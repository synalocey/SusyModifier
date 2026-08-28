// ==UserScript==
// @name         SuSy Scholar Screener
// @version      6.8.29
// @author       SKDAY
// @match        https://susy.mdpi.com/user/settings*
// @match        https://www.scopus.com/authid/detail.uri*
// @require      https://gcore.jsdelivr.net/npm/jquery@4.0.0/dist/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_openInTab
// @connect      mailsdb.i.mdpi.com
// @connect      www.scopus.com
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  if (typeof window !== 'undefined' && window.top !== window) return;
  if (typeof window !== 'undefined' && !globalThis.__GE_SCREEN_TEST__ && !GM_getValue('isUserNameMatch', false)) return;

  const $ = globalThis.jQuery;
  const STORAGE_PREFIX = 'susy_ge_screener_';
  const SCOPUS_BRIDGE_PREFIX = 'susy_ge_scopus_bridge_';
  const SCOPUS_BRIDGE_PARAM = 'ge_screen_request';
  const REVIEWER_CHECK_ROUTE_KEY = 'a5ce29b8b4917729fc1dc44abf2fc686';
  const SPECIAL_ISSUE_ID = '1139163';
  const MDPI_REQUEST_CONCURRENCY = 10;
  const SCOPUS_REQUEST_CONCURRENCY = 1;
  const EMAIL_PATTERN = /[A-Z0-9](?:[A-Z0-9.!#$%&'*+/=?^_`{|}~-]*[A-Z0-9])?@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/gi;
  const DEFAULTS = Object.freeze({
    queryMode: 'scopus',
    minimumHIndex: 8,
    subjectName: 'Mathematics',
    maximumSubjectRank: 5,
    inactiveInviteLimit: 5,
    mailLookbackDays: 180,
  });

  const ROLE_TERMS = Object.freeze([
    'Guest Editor',
    'Topic Editor',
    'Editorial Board Member',
    'Topical Advisory Panel Member',
    'Section Editor',
    'Academic Editor',
    'Associate Editor',
    'Editor-in-Chief',
  ]);

  const VERDICTS = Object.freeze({
    recommended: { label: '推荐邀请', suitable: true },
    suitable: { label: '可以邀请', suitable: true },
    cautious: { label: '谨慎考虑', suitable: true },
    scopus: { label: '基础通过', suitable: null },
    unsuitable: { label: '不适合', suitable: false },
    review: { label: '需人工复核', suitable: null },
  });

  function numberOr(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function clamp(value, minimum, maximum, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
  }

  function unique(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function normalizeSpace(value) {
    return String(value || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function normalizeStatus(value) {
    return normalizeSpace(value).toLowerCase();
  }

  const MONTH_INDEX = Object.freeze({
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  });

  function parseSusyDate(value) {
    const text = normalizeSpace(value);
    const iso = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
    if (iso) {
      const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const words = text.match(/\b(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})\b/);
    if (!words) return null;
    const month = MONTH_INDEX[words[2].toLowerCase()];
    if (!Number.isInteger(month)) return null;
    const date = new Date(Number(words[3]), month, Number(words[1]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function isWithinPastYear(value, now = new Date()) {
    const date = value instanceof Date ? value : parseSusyDate(value);
    if (!date) return false;
    const cutoff = new Date(now.getTime());
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    const end = new Date(now.getTime());
    end.setHours(23, 59, 59, 999);
    return date >= cutoff && date <= end;
  }

  function countRecentUniqueRecords(records, now = new Date()) {
    const identifiers = new Set();
    records.forEach((record, index) => {
      if (!isWithinPastYear(record.date, now)) return;
      identifiers.add(normalizeSpace(record.id) || `row-${index}`);
    });
    return identifiers.size;
  }

  function parseEmailList(input) {
    const seen = new Set();
    const valid = [];
    for (const match of String(input || '').match(EMAIL_PATTERN) || []) {
      const email = match.toLowerCase();
      if (seen.has(email)) continue;
      seen.add(email);
      valid.push(email);
    }
    return { valid, ordered: valid.map((value) => ({ value })) };
  }

  function parseDocument(html) {
    if (typeof DOMParser === 'undefined') {
      throw new Error('DOMParser is unavailable in this environment.');
    }
    const documentObject = new DOMParser().parseFromString(String(html || ''), 'text/html');
    const title = normalizeSpace(documentObject.title);
    const text = documentObject.body?.innerText || documentObject.body?.textContent || '';
    if (/sign in|log in|login/i.test(title) && /password/i.test(text)) {
      throw new Error('登录状态已失效。');
    }
    return documentObject;
  }

  function documentText(documentObject) {
    return (documentObject.body?.innerText || documentObject.body?.textContent || '').replace(/\u00a0/g, ' ');
  }

  function elementText(element) {
    return normalizeSpace(element?.innerText || element?.textContent || '');
  }

  function extractTables(documentObject) {
    return $('table', documentObject).get().map((table) =>
      $('tr', table).get().map((row) =>
        $('th,td', row).get().map(elementText),
      ),
    );
  }

  function findTable(tables, requiredHeaders) {
    for (const table of tables) {
      const headerIndex = table.findIndex((row) =>
        requiredHeaders.every((header) => row.some((cell) => normalizeSpace(cell).toLowerCase() === header.toLowerCase())),
      );
      if (headerIndex >= 0) {
        return { headers: table[headerIndex], rows: table.slice(headerIndex + 1).filter((row) => row.some(Boolean)) };
      }
    }
    return { headers: [], rows: [] };
  }

  function extractScopusIdFromDocument(documentObject) {
    for (const anchor of $('a[href]', documentObject)) {
      const match = String(anchor.href || '').match(/scopus\.com\/authid\/detail\.uri\?[^#]*authorId=(\d+)/i);
      if (match) return match[1];
    }
    const textMatch = documentText(documentObject).match(/scopus\.com\/authid\/detail\.uri\?[^\s]*authorId=(\d+)/i);
    return textMatch ? textMatch[1] : null;
  }

  function extractReviewerIdFromDocument(documentObject) {
    for (const anchor of $('a[href]', documentObject)) {
      const match = String(anchor.getAttribute('href') || anchor.href || '')
        .match(/\/(?:reivewer\/managment|reviewer\/management)\/edit\/(\d+)/i);
      if (match) return match[1];
    }
    const autoLoad = $('[data-auto-load-url*="/list/reviewer/invitations-history/"]', documentObject)[0];
    return String(autoLoad?.getAttribute('data-auto-load-url') || '').match(/invitations-history\/(\d+)/i)?.[1] || null;
  }

  function extractDecisionRecords(documentObject) {
    const section = $('[data-section="editors"]', documentObject)[0];
    if (!section) return [];
    const records = [];
    for (const row of $('table tr', section)) {
      const dateCell = $('.submission-date', row)[0];
      if (!dateCell) continue;
      records.push({
        id: elementText($('.msid', row)[0]),
        date: dateCell.getAttribute('title') || elementText(dateCell),
      });
    }
    return records;
  }

  function extractAssignmentRoles(text) {
    return unique(String(text || '').split(/\r?\n/).flatMap((line) => ROLE_TERMS.filter((term) =>
      new RegExp(`^\\s*(?:[-•]\\s*)?${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(?:of|for|in)\\s+\\S`, 'i').test(line),
    )));
  }

  function confirmedRoleStatus(status) {
    return /^(?:online|active|completed|closed|expired|offline|resigned)\b/.test(normalizeStatus(status));
  }

  function parseUserInfo(html) {
    const documentObject = parseDocument(html);
    const text = documentText(documentObject);
    if (!/Overview:/i.test(text)) {
      throw new Error('SuSy Info 页面结构无法识别。');
    }

    const topBoundary = text.search(/Voucher Record|reviewer information:/i);
    const topText = topBoundary >= 0 ? text.slice(0, topBoundary) : text.slice(0, 12000);
    const compactTop = normalizeSpace(topText);
    const nameMatch = compactTop.match(/Overview:\s*\S+\s+(?:CRM\s+)?(.+?)\s*\([^)]*\)\s*(?:registered on SUSY|is:)/i);

    const decisionRecords = extractDecisionRecords(documentObject);
    const editorSection = $('[data-section="editors"]', documentObject)[0];
    const editorText = editorSection ? documentText({ body: editorSection }) : '';
    const roles = editorSection ? ROLE_TERMS.filter((term) => new RegExp(
      `\\bis:\\s*${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(?:of|for|in)\\s+\\S`, 'i',
    ).test(editorText)) : [];
    return {
      name: normalizeSpace(nameMatch?.[1] || ''),
      submitted: numberOr(text.match(/submitted\s+(\d+)\s+manuscripts?/i)?.[1]),
      reviewed: numberOr(text.match(/reviewed\s+(\d+)\s+manuscripts?/i)?.[1]),
      decisionsPastYear: countRecentUniqueRecords(decisionRecords),
      scopusId: extractScopusIdFromDocument(documentObject),
      reviewerId: extractReviewerIdFromDocument(documentObject),
      roles,
      roleHistory: roles.length > 0,
    };
  }

  function parseGuestEditorCheck(html) {
    const documentObject = parseDocument(html);
    const text = documentText(documentObject);
    const controls = $('button,input[type="button"],input[type="submit"],a', documentObject).get()
      .filter((element) => {
        const style = String(element.getAttribute('style') || '').toLowerCase();
        return !element.hasAttribute('hidden')
          && element.getAttribute('aria-hidden') !== 'true'
          && !/display\s*:\s*none|visibility\s*:\s*hidden/.test(style)
          && !/(^|\s)(hide|hidden|d-none)(\s|$)/i.test(String(element.className || ''));
      })
      .map((element) => normalizeSpace(element.innerText || element.textContent || element.value || ''))
      .filter(Boolean);
    const hasProceed = controls.some((label) => /^Proceed$/i.test(label));
    const tables = extractTables(documentObject);
    const invitationTable = findTable(tables, ['Special Issue', 'Status']);
    const invitationStatusIndex = invitationTable.headers.findIndex((header) => /^Status$/i.test(header));
    const invitationRows = invitationTable.rows.map((row) => ({
      specialIssue: row[0] || '',
      journal: row[1] || '',
      status: invitationStatusIndex >= 0 ? normalizeStatus(row[invitationStatusIndex]) : '',
      cells: row,
    }));
    const roleTable = findTable(tables, ['Role', 'Journal', 'Status']);
    const roleStatusIndex = roleTable.headers.findIndex((header) => /^Status$/i.test(header));
    const roleRows = roleTable.rows.map((row) => ({
      role: row[0] || '',
      journal: row[1] || '',
      status: roleStatusIndex >= 0 ? normalizeStatus(row[roleStatusIndex]) : '',
      cells: row,
    }));
    const statuses = invitationRows.map((row) => row.status).filter(Boolean);
    const compactText = normalizeSpace(text);
    const name = normalizeSpace(compactText.match(/Name:\s*(.*?)\s*Title:/i)?.[1] || '');
    const acceptedCount = statuses.filter((status) => /^accepted\b/.test(status)).length;
    const interestedCount = statuses.filter((status) => /^interested\b/.test(status)).length;
    const declinedCount = statuses.filter((status) => /^declined\b/.test(status)).length;
    const attemptCount = statuses.filter((status) => status && status !== 'proposed').length;
    const confirmedRoleRows = roleRows.filter((row) => confirmedRoleStatus(row.status)
      && row.journal
      && ROLE_TERMS.some((term) => normalizeStatus(term) === normalizeStatus(row.role)));
    const assignmentRoles = unique($('p,li,td,div', documentObject).get()
      .flatMap((element) => extractAssignmentRoles(elementText(element))));
    const roles = unique([
      ...assignmentRoles,
      ...confirmedRoleRows.map((row) => row.role),
    ]);

    if (!hasProceed && !/E-?Mail:|Name:|not allowed to invite|Special Issue/i.test(text)) {
      throw new Error('Guest Editor Check 页面结构无法识别。');
    }

    return {
      hasProceed,
      name,
      hIndex: numberOr(compactText.match(/H-index:\s*(\d+)/i)?.[1], null),
      scopusId: extractScopusIdFromDocument(documentObject),
      roleRows: confirmedRoleRows,
      roles,
      acceptedCount,
      interestedCount,
      declinedCount,
      attemptCount,
      roleHistory: roles.length > 0,
    };
  }

  function parseReviewerCheck(html) {
    const documentObject = parseDocument(html);
    const text = documentText(documentObject);
    if (!/Primary email:|Email:|reviewer/i.test(text)) {
      throw new Error('Reviewer Check 页面结构无法识别。');
    }
    return {
      reviewPastYear: numberOr(text.match(/Number of review received in the past year:\s*(\d+)/i)?.[1]),
      scopusId: extractScopusIdFromDocument(documentObject),
      reviewerId: extractReviewerIdFromDocument(documentObject),
    };
  }

  function summarizeReviewerInvitationRows(rows, now = new Date()) {
    const invitedRows = rows.filter((row) => {
      const status = normalizeSpace(row.status);
      return status && !/^Uninvited\b/i.test(status);
    });
    const acceptedRows = invitedRows.filter((row) => /^(?:Accepted|Review received|Report received)\b/i.test(normalizeSpace(row.status)));
    return {
      invitationCount: invitedRows.length,
      acceptedCount: acceptedRows.length,
      declinedCount: invitedRows.filter((row) => /^Declined\b/i.test(normalizeSpace(row.status))).length,
      invitationPastYearCount: invitedRows.filter((row) => isWithinPastYear(row.addedOn, now)).length,
      acceptedPastYearCount: acceptedRows.filter((row) => {
        const reportDate = parseSusyDate(row.status);
        return isWithinPastYear(reportDate || row.addedOn, now);
      }).length,
    };
  }

  function parseReviewerInvitationHistory(html, now = new Date()) {
    const documentObject = parseDocument(html);
    const table = findTable(extractTables(documentObject), ['Manuscript ID', 'Status', 'Added on']);
    if (!table.headers.length) throw new Error('Reviewer 邀请历史页面结构无法识别。');
    const statusIndex = table.headers.findIndex((header) => /^Status$/i.test(header));
    const addedIndex = table.headers.findIndex((header) => /^Added on$/i.test(header));
    const idIndex = table.headers.findIndex((header) => /^Manuscript ID$/i.test(header));
    const rows = table.rows.map((row) => ({
      id: row[idIndex] || '',
      status: row[statusIndex] || '',
      addedOn: row[addedIndex] || '',
    }));
    return summarizeReviewerInvitationRows(rows, now);
  }

  function parseMailSearch(html) {
    const documentObject = parseDocument(html);
    const text = documentText(documentObject);
    if (!/Summary of current results batch:|Search:/i.test(text)) {
      throw new Error('MailsDB 页面结构无法识别。');
    }
    const article = $('article', documentObject)[0];
    const articleText = documentText(article ? { body: article } : documentObject);
    const batchMatch = text.match(/Summary of current results batch:\s*(\d+)/i);
    const dates = [];
    for (const row of $('table tr', documentObject)) {
      for (const cell of $('td', row)) {
        const value = elementText(cell);
        if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(value)) dates.push(value);
      }
    }
    const authorCounts = Array.from(articleText.matchAll(/Submitted\s+(\d+)\s+papers?/gi), (match) => Number(match[1]));
    const reviewSummaries = Array.from(articleText.matchAll(/Invited\s+(\d+)\s+times to review\.\s*(\d+)\s+reviews?/gi));
    const editorLabel = $('article .label', documentObject).get().find((element) => /^Editor$/i.test(elementText(element)));
    let editorBlock = editorLabel?.nextElementSibling || null;
    while (editorBlock && editorBlock.tagName !== 'DIV') editorBlock = editorBlock.nextElementSibling;
    const editorItems = editorBlock ? $('li', editorBlock).get().map(elementText).filter(Boolean) : [];
    const roleTexts = editorBlock
      ? (editorItems.length ? editorItems : [documentText({ body: editorBlock })])
      : [articleText.match(/(?:^|\n)[ \t]*Editor[ \t]*\n+([\s\S]*)$/i)?.[1] || ''];
    const roles = unique(roleTexts.flatMap(extractAssignmentRoles));

    return {
      recentMailCount: numberOr(batchMatch?.[1]),
      latestMail: dates[0] || null,
      authorSubmissions: authorCounts.reduce((sum, value) => sum + value, 0),
      reviewInvitations: reviewSummaries.reduce((sum, match) => sum + Number(match[1] || 0), 0),
      reviewReports: reviewSummaries.reduce((sum, match) => sum + Number(match[2] || 0), 0),
      roles,
      roleHistory: roles.length > 0,
    };
  }

  function parseScopusPayload(payload, expectedAuthorId = null) {
    let data;
    try {
      data = typeof payload === 'string' ? JSON.parse(payload) : payload;
    } catch (error) {
      throw new Error('Scopus API 未返回 JSON。');
    }
    if (!data || typeof data !== 'object' || !data.authorId) {
      throw new Error('Scopus API 数据不完整。');
    }
    if (expectedAuthorId && String(data.authorId) !== String(expectedAuthorId)) {
      throw new Error('Scopus Author ID 不匹配。');
    }
    const subjects = Array.isArray(data.publishedSubjectAreas)
      ? data.publishedSubjectAreas.map((subject) => ({ code: subject.code || '', name: normalizeSpace(subject.name) })).filter((subject) => subject.name)
      : [];
    const hIndex = numberOr(data.hindex, null);
    return {
      authorId: String(data.authorId),
      hIndex,
      subjects,
      preferredName: normalizeSpace(data.preferredName?.full || ''),
    };
  }

  function findSubjectRank(subjects, subjectName) {
    if (!Array.isArray(subjects) || subjects.length === 0) return null;
    const target = normalizeSpace(subjectName).toLowerCase();
    const index = subjects.findIndex((subject) => normalizeSpace(subject?.name).toLowerCase() === target);
    return index < 0 ? Infinity : index + 1;
  }

  function sourceOk(source) {
    return Boolean(source && source.ok && source.data);
  }

  function metricMaximum(...values) {
    return Math.max(0, ...values.map((value) => numberOr(value)));
  }

  function classifyCandidate(evidence, rawConfig = {}) {
    const config = {
      minimumHIndex: clamp(rawConfig.minimumHIndex, 0, 500, DEFAULTS.minimumHIndex),
      subjectName: normalizeSpace(rawConfig.subjectName) || DEFAULTS.subjectName,
      maximumSubjectRank: clamp(rawConfig.maximumSubjectRank, 1, 50, DEFAULTS.maximumSubjectRank),
      inactiveInviteLimit: clamp(rawConfig.inactiveInviteLimit, 0, 1000, DEFAULTS.inactiveInviteLimit),
      mailLookbackDays: clamp(rawConfig.mailLookbackDays, 1, 3650, DEFAULTS.mailLookbackDays),
    };
    const sources = evidence.sources || {};
    const geSource = sources.ge;
    const infoSource = sources.info;
    const reviewerSource = sources.reviewer;
    const reviewerHistorySource = sources.reviewerHistory;
    const mailSource = sources.mail;
    const scopusSource = sources.scopus;
    const hardReasons = [];
    const hardGateFailures = { proceed: false, hIndex: false, subject: false };
    const reviewReasons = [];
    const subjectRank = sourceOk(scopusSource) ? findSubjectRank(scopusSource.data.subjects, config.subjectName) : null;

    if (!sourceOk(geSource)) {
      reviewReasons.push(`GE 查询失败：${geSource?.error || '无数据'}`);
    } else if (!geSource.data.hasProceed) {
      hardGateFailures.proceed = true;
      hardReasons.push('无 Proceed');
    }

    if (!sourceOk(scopusSource)) {
      reviewReasons.push(`Scopus 查询失败：${scopusSource?.error || '无 Author ID'}`);
    } else {
      const scopus = scopusSource.data;
      if (!Number.isFinite(scopus.hIndex)) {
        reviewReasons.push('缺少 h-index');
      } else if (scopus.hIndex < config.minimumHIndex) {
        hardGateFailures.hIndex = true;
        hardReasons.push(`h-index ${scopus.hIndex}（low h-index）`);
      }
      if (!Array.isArray(scopus.subjects) || scopus.subjects.length === 0) {
        reviewReasons.push('缺少 Scopus 学科');
      } else if (subjectRank > config.maximumSubjectRank) {
        hardGateFailures.subject = true;
        hardReasons.push(`${config.subjectName} #${subjectRank === Infinity ? '∞' : subjectRank}（out of scope）`);
      }
    }

    const info = sourceOk(infoSource) ? infoSource.data : {};
    const reviewer = sourceOk(reviewerSource) ? reviewerSource.data : {};
    const reviewerHistory = sourceOk(reviewerHistorySource) ? reviewerHistorySource.data : {};
    const mail = sourceOk(mailSource) ? mailSource.data : {};
    const ge = sourceOk(geSource) ? geSource.data : {};
    const submissions = metricMaximum(info.submitted, mail.authorSubmissions);
    const reviews = metricMaximum(info.reviewed, mail.reviewReports, reviewerHistory.acceptedCount);
    const reviewInvitations = sourceOk(reviewerHistorySource) || sourceOk(mailSource)
      ? metricMaximum(reviewerHistory.invitationCount, mail.reviewInvitations, reviews)
      : null;
    const reviewPastYear = metricMaximum(reviewer.reviewPastYear, reviewerHistory.acceptedPastYearCount);
    const reviewPastYearInvitations = sourceOk(reviewerHistorySource)
      ? metricMaximum(reviewerHistory.invitationPastYearCount, reviewPastYear)
      : null;
    const decisions = numberOr(info.decisionsPastYear);
    const recentMails = numberOr(mail.recentMailCount);
    const attempts = numberOr(ge.attemptCount);
    const accepted = numberOr(ge.acceptedCount);
    const interested = numberOr(ge.interestedCount);
    const hasActivity = submissions > 0 || reviews > 0 || reviewPastYear > 0 || decisions > 0 || recentMails > 0;
    const hasRoleHistory = Boolean(info.roleHistory || ge.roleHistory || mail.roleHistory);
    const activityEvidenceComplete = sourceOk(infoSource) && sourceOk(mailSource);
    const roles = unique([
      ...(info.roles || []),
      ...(ge.roles || []),
      ...(mail.roles || []),
    ]);

    const metrics = {
      submissions,
      reviews,
      reviewInvitations,
      reviewPastYear,
      reviewPastYearInvitations,
      decisions,
      recentMails,
      latestMail: mail.latestMail || null,
      attempts,
      accepted,
      interested,
      declined: numberOr(ge.declinedCount),
      roles,
      hIndex: sourceOk(scopusSource) && Number.isFinite(scopusSource.data.hIndex) ? scopusSource.data.hIndex : null,
      subjectName: config.subjectName,
      subjectRank,
      subjects: sourceOk(scopusSource) ? scopusSource.data.subjects.map((subject) => subject.name) : [],
      geProceed: sourceOk(geSource) ? Boolean(geSource.data.hasProceed) : null,
      hardGateFailures,
    };

    if (hardReasons.length > 0) {
      return { code: 'unsuitable', ...VERDICTS.unsuitable, hardGateFailed: true, reasons: hardReasons, metrics };
    }
    if (reviewReasons.length > 0) {
      return { code: 'review', ...VERDICTS.review, reasons: reviewReasons, metrics };
    }
    if (hasRoleHistory) {
      return {
        code: 'recommended',
        ...VERDICTS.recommended,
        reasons: ['有明确 MDPI 任职记录'],
        metrics,
      };
    }
    if (hasActivity) {
      if (attempts > config.inactiveInviteLimit && accepted === 0) {
        return {
          code: 'cautious',
          ...VERDICTS.cautious,
          reasons: [`有活动；GE ${attempts} 次未 accepted`],
          metrics,
        };
      }
      return {
        code: 'suitable',
        ...VERDICTS.suitable,
        reasons: ['有 MDPI 活动或近期来信'],
        metrics,
      };
    }
    if (accepted > 0) {
      return {
        code: 'suitable',
        ...VERDICTS.suitable,
        reasons: ['GE 历史有 accepted（未确认任职）'],
        metrics,
      };
    }
    if (interested > 0) {
      return {
        code: 'cautious',
        ...VERDICTS.cautious,
        reasons: ['GE 历史有 interested'],
        metrics,
      };
    }
    if (attempts > config.inactiveInviteLimit && accepted === 0) {
      if (!activityEvidenceComplete) {
        return {
          code: 'review',
          ...VERDICTS.review,
          reasons: ['活动数据不完整'],
          metrics,
        };
      }
      const responseDetail = numberOr(ge.declinedCount) > 0 ? '多次未接受' : '无回复';
      return {
        code: 'unsuitable',
        ...VERDICTS.unsuitable,
        reasons: [`不活跃学者，${responseDetail}`],
        metrics,
      };
    }
    return {
      code: 'suitable',
      ...VERDICTS.suitable,
      reasons: ['首次或低频邀请'],
      metrics,
    };
  }

  function classifyScopusOnly(scopusSource, config = DEFAULTS) {
    const scopus = sourceOk(scopusSource) ? scopusSource.data : {};
    const subjectName = normalizeSpace(config.subjectName) || DEFAULTS.subjectName;
    const maximumSubjectRank = clamp(config.maximumSubjectRank, 1, 50, DEFAULTS.maximumSubjectRank);
    const subjectRank = findSubjectRank(scopus.subjects, subjectName);
    const hardGateFailures = { proceed: false, hIndex: false, subject: false };
    const metrics = {
      submissions: 0,
      reviews: 0,
      reviewInvitations: null,
      reviewPastYear: 0,
      reviewPastYearInvitations: null,
      decisions: 0,
      recentMails: 0,
      latestMail: null,
      attempts: 0,
      accepted: 0,
      interested: 0,
      declined: 0,
      roles: [],
      hIndex: Number.isFinite(scopus.hIndex) ? scopus.hIndex : null,
      subjectName,
      subjectRank,
      subjects: Array.isArray(scopus.subjects) ? scopus.subjects.map((subject) => subject.name) : [],
      geProceed: null,
      hardGateFailures,
    };
    if (!sourceOk(scopusSource)) {
      return { code: 'review', ...VERDICTS.review, reasons: [`Scopus 查询失败：${scopusSource?.error || '无 Author ID'}`], metrics };
    }
    const reasons = [];
    if (!Number.isFinite(scopus.hIndex)) reasons.push('缺少 h-index');
    else if (scopus.hIndex < config.minimumHIndex) {
      hardGateFailures.hIndex = true;
      reasons.push(`h-index ${scopus.hIndex}（low h-index）`);
    }
    if (!metrics.subjects.length) reasons.push('缺少 Scopus 学科');
    else if (metrics.subjectRank > maximumSubjectRank) {
      hardGateFailures.subject = true;
      reasons.push(`${subjectName} #${metrics.subjectRank === Infinity ? '∞' : metrics.subjectRank}（out of scope）`);
    }
    const missing = reasons.some((reason) => reason.startsWith('缺少'));
    const subjectLine = `学科：${metrics.subjects.slice(0, 5).join(' / ')}`;
    if (hardGateFailures.hIndex || hardGateFailures.subject) {
      return { code: 'unsuitable', ...VERDICTS.unsuitable, hardGateFailed: true, reasons: [...reasons, subjectLine], metrics };
    }
    if (missing) return { code: 'review', ...VERDICTS.review, reasons, metrics };
    return { code: 'scopus', ...VERDICTS.scopus, reasons: [subjectLine], metrics };
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function buildUrls(email, config, scopusId = null, reviewerId = null) {
    const encodedEmail = encodeURIComponent(email);
    const visibleEmail = encodedEmail.replace(/%40/gi, '@');
    const end = new Date();
    const start = new Date(end.getTime());
    start.setDate(start.getDate() - config.mailLookbackDays);
    const reviewerRouteKey = encodeURIComponent(REVIEWER_CHECK_ROUTE_KEY);
    return {
      info: `https://susy.mdpi.com/user/info?emails=${encodedEmail}`,
      ge: `https://susy.mdpi.com/user/guest_editor/check?email=${encodedEmail}&special_issue_id=${SPECIAL_ISSUE_ID}`,
      reviewer: `https://susy.mdpi.com/user/reviewer/checking/${reviewerRouteKey}?email=${encodedEmail}`,
      reviewerHistory: reviewerId ? `https://susy.mdpi.com/list/reviewer/invitations-history/${encodeURIComponent(reviewerId)}` : null,
      mail: `https://mailsdb.i.mdpi.com/reversion/search/emails?since_time=${config.mailLookbackDays}&start=${formatDate(start)}&end=${formatDate(end)}&fm=true&cc=false&to=false&m_type=&sort=desc&page=1&link=false&bcc=false&search_content=${encodedEmail}`,
      infoLink: `https://mailsdb.i.mdpi.com/reversion/search/emails?fm=true&cc=true&to=true&m_type=&sort=desc&link=true&bcc=true&search_content=${visibleEmail}`,
      scopus: scopusId ? `https://www.scopus.com/api/authors/${encodeURIComponent(scopusId)}` : null,
      scopusProfile: scopusId ? `https://www.scopus.com/authid/detail.uri?authorId=${encodeURIComponent(scopusId)}` : null,
    };
  }

  async function requestSameOrigin(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'text/html,application/xhtml+xml' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (/\/login|\/signin/i.test(response.url)) throw new Error('登录状态已失效');
      return { text: await response.text(), status: response.status, finalUrl: response.url };
    } catch (error) {
      if (error?.name === 'AbortError') throw new Error('查询超时');
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  function requestCrossOrigin(url, accept = 'text/html,application/xhtml+xml') {
    return new Promise((resolve, reject) => {
      const options = {
        method: 'GET',
        url,
        timeout: 45000,
        anonymous: false,
        withCredentials: true,
        headers: { Accept: accept },
        onload(response) {
          const status = Number(response.status || 0);
          if (status < 200 || status >= 300) {
            reject(new Error(`HTTP ${status || 'unknown'}`));
            return;
          }
          if (/\/login|\/signin/i.test(response.finalUrl || '')) {
            reject(new Error('登录状态已失效'));
            return;
          }
          resolve({
            text: response.responseText,
            status,
            finalUrl: response.finalUrl || url,
            method: 'gm-xmlhttp-request',
          });
        },
        ontimeout() {
          reject(new Error('查询超时'));
        },
        onerror() {
          reject(new Error('网络请求失败或被浏览器拦截'));
        },
      };

      try {
        if (typeof GM_xmlhttpRequest === 'function') {
          GM_xmlhttpRequest(options);
        } else if (globalThis.GM?.xmlHttpRequest) {
          Promise.resolve(globalThis.GM.xmlHttpRequest(options)).then(options.onload).catch(options.onerror);
        } else {
          reject(new Error('Tampermonkey 跨域请求权限不可用'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  function buildScopusBridgeUrl(authorId, requestId) {
    const url = new URL('https://www.scopus.com/authid/detail.uri');
    url.searchParams.set('authorId', String(authorId));
    url.searchParams.set(SCOPUS_BRIDGE_PARAM, String(requestId));
    return url.toString();
  }

  function deleteBridgeValue(key) {
    try {
      if (typeof GM_deleteValue === 'function') GM_deleteValue(key);
    } catch (error) {
      // Expired bridge values are harmless and use unique request IDs.
    }
  }

  function requestScopusViaBridge(authorId, timeoutMs = 45000) {
    return new Promise((resolve, reject) => {
      if (
        typeof GM_openInTab !== 'function'
        || typeof GM_addValueChangeListener !== 'function'
        || typeof GM_removeValueChangeListener !== 'function'
      ) {
        reject(new Error('Tampermonkey 后台标签页桥接权限不可用'));
        return;
      }

      const requestId = globalThis.crypto?.randomUUID?.()
        || `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
      const responseKey = `${SCOPUS_BRIDGE_PREFIX}${requestId}`;
      let listenerId = null;
      let tabHandle = null;
      let timeout = null;
      let settled = false;

      function cleanup() {
        if (timeout) clearTimeout(timeout);
        if (listenerId !== null) {
          try {
            GM_removeValueChangeListener(listenerId);
          } catch (error) {
            // Continue cleanup even if the listener was already removed.
          }
        }
        deleteBridgeValue(responseKey);
        try {
          if (tabHandle && !tabHandle.closed && typeof tabHandle.close === 'function') tabHandle.close();
        } catch (error) {
          // The tab may already have been closed by the user.
        }
      }

      function settle(handler, value) {
        if (settled) return;
        settled = true;
        cleanup();
        handler(value);
      }

      deleteBridgeValue(responseKey);
      try {
        listenerId = GM_addValueChangeListener(responseKey, (_key, _oldValue, rawMessage) => {
          let message = rawMessage;
          if (typeof rawMessage === 'string') {
            try {
              message = JSON.parse(rawMessage);
            } catch (error) {
              return;
            }
          }
          if (!message || message.requestId !== requestId || String(message.authorId) !== String(authorId)) return;
          if (message.ok && typeof message.payload === 'string') {
            settle(resolve, {
              text: message.payload,
              status: 200,
              finalUrl: `https://www.scopus.com/api/authors/${encodeURIComponent(authorId)}`,
              method: 'same-origin-tab-bridge',
            });
          } else {
            settle(reject, new Error(message.error || 'Scopus 后台页未返回数据'));
          }
        });

        const workerUrl = buildScopusBridgeUrl(authorId, requestId);
        tabHandle = GM_openInTab(workerUrl, { active: false, setParent: true });
        if (tabHandle && typeof tabHandle === 'object') {
          tabHandle.onclose = () => {
            if (!settled) settle(reject, new Error('Scopus 后台查询页被提前关闭'));
          };
        }
        timeout = setTimeout(() => {
          settle(reject, new Error('Scopus 后台同源查询超时'));
        }, timeoutMs);
      } catch (error) {
        settle(reject, error);
      }
    });
  }

  async function requestScopus(url) {
    const authorId = String(url || '').match(/\/api\/authors\/(\d+)/i)?.[1];
    if (!authorId) throw new Error('Scopus Author ID 无法识别');
    try {
      return await requestCrossOrigin(url, 'application/json,text/plain,*/*');
    } catch (gmError) {
      try {
        return await requestScopusViaBridge(authorId);
      } catch (bridgeError) {
        throw new Error(`GM 请求：${conciseError(gmError)}；同源后台页 fallback：${conciseError(bridgeError)}`);
      }
    }
  }

  async function runScopusBridgeWorker() {
    const params = new URLSearchParams(location.search);
    const requestId = params.get(SCOPUS_BRIDGE_PARAM);
    const authorId = params.get('authorId');
    if (!requestId || !/^\d+$/.test(authorId || '')) return;
    const responseKey = `${SCOPUS_BRIDGE_PREFIX}${requestId}`;

    try {
      const response = await fetch(`https://www.scopus.com/api/authors/${encodeURIComponent(authorId)}`, {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers: { Accept: 'application/json,text/plain,*/*' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (/\/login|\/signin/i.test(response.url)) throw new Error('Scopus 登录状态已失效');
      const rawPayload = await response.text();
      const parsed = parseScopusPayload(rawPayload, authorId);
      const safePayload = JSON.stringify({
        authorId: parsed.authorId,
        hindex: parsed.hIndex,
        preferredName: { full: parsed.preferredName },
        publishedSubjectAreas: parsed.subjects,
      });
      if (typeof GM_setValue !== 'function') throw new Error('Tampermonkey 共享存储权限不可用');
      GM_setValue(responseKey, {
        requestId,
        authorId: String(authorId),
        ok: true,
        payload: safePayload,
        completedAt: new Date().toISOString(),
      });
    } catch (error) {
      if (typeof GM_setValue === 'function') {
        GM_setValue(responseKey, {
          requestId,
          authorId: String(authorId),
          ok: false,
          error: conciseError(error),
          completedAt: new Date().toISOString(),
        });
      }
    }
  }

  function conciseError(error) {
    const message = normalizeSpace(error?.message || error || '未知错误');
    return message.slice(0, 220);
  }

  async function loadSource(requestPromise, parser) {
    try {
      const response = await requestPromise;
      return { ok: true, data: parser(response.text), status: response.status, finalUrl: response.finalUrl };
    } catch (error) {
      return { ok: false, data: null, error: conciseError(error) };
    }
  }

  async function collectCandidate(email, config, requestQueues = {}) {
    const runMdpiRequest = requestQueues.mdpi || ((task) => Promise.resolve().then(task));
    const runScopusRequest = requestQueues.scopus || ((task) => Promise.resolve().then(task));
    const initialUrls = buildUrls(email, config);
    const infoPromise = loadSource(runMdpiRequest(() => requestSameOrigin(initialUrls.info)), parseUserInfo);

    if (config.queryMode === 'scopus') {
      const info = await infoPromise;
      const scopusId = info.data?.scopusId || null;
      const urls = buildUrls(email, config, scopusId);
      const scopus = scopusId
        ? await loadSource(runScopusRequest(() => requestScopus(urls.scopus)), (payload) => parseScopusPayload(payload, scopusId))
        : { ok: false, data: null, error: '未找到 Scopus Author ID' };
      return {
        email,
        name: info.data?.name || scopus.data?.preferredName || '',
        mode: 'scopus',
        sources: { info, scopus },
        urls,
        decision: classifyScopusOnly(scopus, config),
      };
    }

    const gePromise = loadSource(runMdpiRequest(() => requestSameOrigin(initialUrls.ge)), parseGuestEditorCheck);
    const reviewerPromise = loadSource(runMdpiRequest(() => requestSameOrigin(initialUrls.reviewer)), parseReviewerCheck);
    const mailPromise = loadSource(runMdpiRequest(() => requestCrossOrigin(initialUrls.mail)), parseMailSearch);
    const [info, ge, reviewer, mail] = await Promise.all([infoPromise, gePromise, reviewerPromise, mailPromise]);

    const scopusId = ge.data?.scopusId || info.data?.scopusId || reviewer.data?.scopusId || null;
    const reviewerId = info.data?.reviewerId || reviewer.data?.reviewerId || null;
    const urls = buildUrls(email, config, scopusId, reviewerId);
    const scopusPromise = scopusId
      ? loadSource(runScopusRequest(() => requestScopus(urls.scopus)), (payload) => parseScopusPayload(payload, scopusId))
      : Promise.resolve({ ok: false, data: null, error: '未找到 Scopus Author ID' });
    const reviewerHistoryPromise = reviewerId
      ? loadSource(runMdpiRequest(() => requestSameOrigin(urls.reviewerHistory)), parseReviewerInvitationHistory)
      : Promise.resolve({ ok: false, data: null, error: '未找到 Reviewer ID' });
    const [scopus, reviewerHistory] = await Promise.all([scopusPromise, reviewerHistoryPromise]);
    const sources = { info, ge, reviewer, reviewerHistory, mail, scopus };
    const evidence = { email, sources };
    const decision = classifyCandidate(evidence, config);
    const name = ge.data?.name || info.data?.name || scopus.data?.preferredName || '';

    return { email, name, mode: 'full', sources, urls, decision };
  }

  function getStored(key, fallback) {
    try {
      return typeof GM_getValue === 'function' ? GM_getValue(`${STORAGE_PREFIX}${key}`, fallback) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function createElement(tagName, className = '', text = '') {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== '') element.textContent = text;
    return element;
  }

  function appendLines(cell, lines) {
    for (const line of lines.filter(Boolean)) {
      cell.appendChild(createElement('div', 'ges-line', line));
    }
  }

  function appendSourceLink(container, label, url) {
    if (!url) return;
    const link = createElement('a', 'ges-link', label);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    container.appendChild(link);
  }

  function makeErrorResult(email, mode = 'full', reason = '查询异常') {
    return {
      email,
      name: '',
      mode,
      sources: {},
      urls: {},
      decision: {
        code: 'review',
        ...VERDICTS.review,
        label: '查询异常',
        reasons: [reason],
        metrics: {
          submissions: 0,
          reviews: 0,
          reviewInvitations: 0,
          reviewPastYear: 0,
          reviewPastYearInvitations: 0,
          decisions: 0,
          recentMails: 0,
          latestMail: null,
          attempts: 0,
          accepted: 0,
          interested: 0,
          declined: 0,
          roles: [],
          subjects: [],
          hIndex: null,
          subjectName: DEFAULTS.subjectName,
          subjectRank: null,
          geProceed: null,
        },
      },
    };
  }

  function renderResultRow(row, result) {
    const scopusOnly = result.mode === 'scopus';
    row.className = scopusOnly ? 'ges-row' : `ges-row ${result.decision.code}`;
    row.replaceChildren();
    const metrics = result.decision.metrics;

    const verdictCell = createElement('td');
    if (!scopusOnly) verdictCell.appendChild(createElement('span', `ges-badge ${result.decision.code}`, result.decision.label));

    const candidateCell = createElement('td');
    if (result.name) candidateCell.appendChild(createElement('strong', '', result.name));
    const emailSpan = createElement('span', 'ges-email', result.email);
    const copyTip = createElement('span', 'ges-copy-tip');
    emailSpan.title = '点击复制';
    emailSpan.addEventListener('click', () => {
      const clipboard = globalThis.navigator?.clipboard;
      const showCopyTip = (text, color) => {
        copyTip.textContent = text;
        copyTip.style.color = color;
        setTimeout(() => { copyTip.textContent = ''; }, 1500);
      };
      if (!clipboard || typeof clipboard.writeText !== 'function') {
        showCopyTip('复制失败', '#d93025');
        return;
      }
      try {
        Promise.resolve(clipboard.writeText(result.email))
          .then(() => showCopyTip('✓ 已复制', '#1e8e3e'))
          .catch(() => showCopyTip('复制失败', '#d93025'));
      } catch (error) {
        showCopyTip('复制失败', '#d93025');
      }
    });
    candidateCell.append(emailSpan, copyTip);
    const links = createElement('div', 'ges-links');
    appendSourceLink(links, 'Info', result.urls.infoLink);
    if (result.mode !== 'scopus') {
      appendSourceLink(links, 'Reviewer', result.urls.reviewer);
      appendSourceLink(links, 'Mail', result.urls.mail);
    }
    appendSourceLink(links, 'Scopus', result.urls.scopusProfile);
    candidateCell.appendChild(links);

    const gateCell = createElement('td');
    const proceedText = metrics.geProceed === null ? 'Proceed: ?' : metrics.geProceed ? 'Proceed: ✓' : 'Proceed: ✕';
    const hText = metrics.hIndex === null ? 'h-index: ?' : `h-index: ${metrics.hIndex}`;
    const subjectText = `${metrics.subjectName}: #${metrics.subjectRank === Infinity ? '∞' : metrics.subjectRank ?? '?'}`;
    const gateLines = [
      [hText, metrics.hardGateFailures?.hIndex, metrics.hIndex === null],
      [subjectText, metrics.hardGateFailures?.subject, metrics.subjectRank === null],
    ];
    if (!scopusOnly) gateLines.unshift([proceedText, metrics.hardGateFailures?.proceed, false]);
    for (const [text, failed, unknown] of gateLines) {
      gateCell.appendChild(createElement('div', `ges-line${failed ? ' ges-fail' : unknown ? ' ges-unknown' : ''}`, text));
    }

    const subjectAreasCell = createElement('td', 'ges-subjects');
    if (metrics.subjects.length) appendLines(subjectAreasCell, metrics.subjects.slice(0, 5).map((subject, index) => `#${index + 1} ${subject}`));
    else subjectAreasCell.textContent = '—';

    const activityCell = createElement('td');
    if (result.mode === 'scopus') activityCell.textContent = '—';
    else {
      const reviewInvitations = metrics.reviewInvitations === null ? '?' : metrics.reviewInvitations;
      const reviewPastYearInvitations = metrics.reviewPastYearInvitations === null ? '?' : metrics.reviewPastYearInvitations;
      appendLines(activityCell, [
        `投稿 ${metrics.submissions} · 审稿 ${metrics.reviews}/${reviewInvitations}`,
        `近一年审稿 ${metrics.reviewPastYear}/${reviewPastYearInvitations} · 编辑决定 ${metrics.decisions}`,
        `来信 ${metrics.recentMails}${metrics.latestMail ? ` · ${metrics.latestMail}` : ''}`,
      ]);
    }

    const historyCell = createElement('td');
    if (result.mode === 'scopus') historyCell.textContent = '—';
    else appendLines(historyCell, [
      `GE Invited ${metrics.attempts} 次`,
      `accepted ${metrics.accepted} · interested ${metrics.interested} · declined ${metrics.declined}`,
      metrics.roles.length ? `任职：${metrics.roles.join(' / ')}` : '任职：无',
    ]);

    const reasonCell = createElement('td');
    if (!scopusOnly) appendLines(reasonCell, result.decision.reasons);
    row.append(verdictCell, candidateCell, gateCell, subjectAreasCell, activityCell, historyCell, reasonCell);
  }

  function csvEscape(value) {
    const text = String(value ?? '');
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  function exportCsv(results) {
    const headers = [
      'Email', 'Name', 'Mode', 'Verdict', 'Proceed', 'h-index', 'Subject', 'Subject Rank', 'Subject Areas', 'Submissions',
      'Reviews Accepted', 'Review Invitations', 'Reviews Past Year Accepted',
      'Review Invitations Past Year', 'Editorial Decisions Past Year', 'Recent Mails',
      'Latest Mail', 'GE Invitations', 'GE Accepted', 'GE Interested', 'GE Declined', 'Roles', 'Reason',
    ];
    const rows = results.map(({ email, name, mode, decision }) => {
      const m = decision.metrics;
      return [
        email, name, mode === 'scopus' ? 'scopus' : 'full', mode === 'scopus' ? '' : decision.label,
        m.geProceed ?? '', m.hIndex ?? '', m.subjectName, m.subjectRank === Infinity ? '∞' : m.subjectRank ?? '', m.subjects.join(' | '),
        m.submissions, m.reviews, m.reviewInvitations ?? '', m.reviewPastYear,
        m.reviewPastYearInvitations ?? '', m.decisions, m.recentMails, m.latestMail || '', m.attempts,
        m.accepted, m.interested, m.declined, m.roles.join(' | '), mode === 'scopus' ? '' : decision.reasons.join(' | '),
      ];
    });
    const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n')}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `ge-screening-${formatDate(new Date())}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function readConfig($panel) {
    return {
      queryMode: $panel.find('#ges-mode').val() || '',
      minimumHIndex: clamp($panel.find('#ges-min-h').val(), 0, 500, DEFAULTS.minimumHIndex),
      subjectName: normalizeSpace($panel.find('#ges-subject').val()) || DEFAULTS.subjectName,
      maximumSubjectRank: clamp($panel.find('#ges-subject-rank').val(), 1, 50, DEFAULTS.maximumSubjectRank),
      inactiveInviteLimit: clamp($panel.find('#ges-invite-limit').val(), 0, 1000, DEFAULTS.inactiveInviteLimit),
      mailLookbackDays: clamp($panel.find('#ges-mail-days').val(), 1, 3650, DEFAULTS.mailLookbackDays),
    };
  }

  function saveConfig(config) {
    for (const key of ['minimumHIndex', 'subjectName', 'maximumSubjectRank', 'inactiveInviteLimit', 'mailLookbackDays']) {
      try {
        if (typeof GM_setValue === 'function') GM_setValue(`${STORAGE_PREFIX}${key}`, config[key]);
      } catch (error) {
        // Storage is optional.
      }
    }
  }

  function createConcurrencyLimiter(maxConcurrent) {
    const limit = Math.max(1, Math.floor(numberOr(maxConcurrent, 1)));
    const queue = [];
    let active = 0;

    function drain() {
      while (active < limit && queue.length > 0) {
        const entry = queue.shift();
        active += 1;
        Promise.resolve()
          .then(entry.task)
          .then(entry.resolve, entry.reject)
          .finally(() => {
            active -= 1;
            drain();
          });
      }
    }

    return function limitRequest(task) {
      if (typeof task !== 'function') return Promise.reject(new TypeError('Queued request must be a function.'));
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        drain();
      });
    };
  }

  async function runPool(items, concurrency, worker) {
    let nextIndex = 0;
    async function runWorker() {
      while (nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        await worker(items[index], index);
      }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, runWorker));
  }

  function installStyles() {
    if ($('#ges-style').length) return;
    $('<style id="ges-style">').text(`
      #ges-panel { margin-top:1.25rem; color:inherit; }
      #ges-panel * { box-sizing:border-box; }
      .ges-field label { display:block; font-weight:650; margin-bottom:.32rem; }
      .ges-field input, .ges-field textarea, #ges-mode { width:100%; border:1px solid #aeb7c2; border-radius:5px; padding:.5rem .6rem; background:#fff; color:#17212b; }
      .ges-field textarea { min-height:5.5rem; resize:vertical; font-family:ui-monospace, SFMono-Regular, Consolas, monospace; line-height:1.4; }
      .ges-params { margin-top:.7rem; }
      .ges-params summary { cursor:pointer; font-weight:650; }
      .ges-param-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(11rem,1fr)); gap:.7rem; margin-top:.6rem; }
      .ges-actions { display:flex; align-items:center; gap:.55rem; flex-wrap:wrap; margin-top:1rem; }
      #ges-mode { width:9.5rem !important; min-width:9.5rem; height:2rem !important; padding:.25rem .6rem !important; line-height:1.25rem !important; }
      .ges-btn { appearance:none; border:1px solid #8c98a5; border-radius:5px; padding:.52rem .85rem; background:#fff; color:#23303d; cursor:pointer; font-weight:650; }
      .ges-btn:hover { background:#f0f4f7; }
      .ges-btn.primary { background:#087f5b; border-color:#087f5b; color:#fff; }
      .ges-btn.primary:hover { background:#066b4c; }
      .ges-btn.danger { border-color:#c43d4b; color:#a51f2e; }
      .ges-btn:disabled { opacity:.48; cursor:not-allowed; }
      .ges-status { min-height:1.35rem; color:#495663; font-size:.86rem; margin-left:.25rem; }
      .ges-progress { width:100%; height:.45rem; border-radius:999px; background:#e5e9ee; overflow:hidden; margin-top:.7rem; }
      .ges-progress>span { display:block; height:100%; width:0; background:#087f5b; transition:width .2s ease; }
      .ges-summary { display:flex; gap:.55rem; flex-wrap:wrap; margin:1rem 0 .65rem; }
      .ges-chip { border:1px solid #d4dae1; border-radius:999px; padding:.28rem .6rem; font-size:.8rem; background:#fff; }
      .ges-table-wrap { width:100%; overflow:auto; border:1px solid #d5dbe2; border-radius:7px; }
      .ges-table { width:100%; min-width:87.5rem; table-layout:fixed; border-collapse:collapse; background:#fff; color:#202a34; }
      .ges-table th { position:sticky; top:0; z-index:1; background:#eef2f5; color:#33404d; text-align:left; font-size:.78rem; }
      .ges-table th, .ges-table td { border-bottom:1px solid #e2e6ea; padding:.65rem .7rem; vertical-align:top; }
      .ges-table td { font-size:.82rem; line-height:1.4; }
      .ges-table th:nth-child(1) { width:7rem; }
      .ges-table th:nth-child(2) { width:14rem; }
      .ges-table th:nth-child(3) { width:10.5rem; }
      .ges-table th:nth-child(4) { width:17rem; }
      .ges-table th:nth-child(5) { width:14rem; }
      .ges-table th:nth-child(6) { width:16rem; }
      .ges-table th:nth-child(7) { width:9rem; }
      .ges-row.review, .ges-row.cautious { background:#fffaf0; }
      .ges-row.recommended { background:#f4fbf7; }
      .ges-badge { display:inline-block; border-radius:999px; padding:.25rem .55rem; color:#fff; font-size:.78rem; font-weight:750; white-space:nowrap; }
      .ges-badge.recommended { background:#087f5b; }
      .ges-badge.suitable { background:#22863a; }
      .ges-badge.cautious { background:#b36b00; }
      .ges-badge.scopus { background:#3568a8; }
      .ges-badge.unsuitable { background:#bd2635; }
      .ges-badge.review { background:#7a5b16; }
      .ges-email { display:inline-block; overflow-wrap:anywhere; color:#1a73e8; margin-top:.14rem; cursor:pointer; border-bottom:1px dashed #1a73e8; }
      .ges-email:hover { color:#1557b0; }
      .ges-copy-tip { color:#888; margin-left:.35rem; font-size:.76rem; font-weight:normal; white-space:nowrap; }
      .ges-subjects { overflow:hidden; }
      .ges-subjects .ges-line { overflow:hidden; white-space:nowrap; text-overflow:clip; }
      .ges-links { display:flex; gap:.42rem; flex-wrap:wrap; margin-top:.38rem; }
      .ges-link { font-size:.74rem; text-decoration:underline; }
      .ges-line+.ges-line { margin-top:.18rem; }
      .ges-fail { color:#a40e21; background:#ffe4e8; border-left:3px solid #c81e32; border-radius:3px; padding:.12rem .35rem; font-weight:750; }
      .ges-unknown { color:#7a5b16; background:#fff5d6; border-left:3px solid #a77c20; border-radius:3px; padding:.12rem .35rem; font-weight:750; }
      .ges-loading td { color:#687481; font-style:italic; }
    `).appendTo(document.head);
  }

  function mountPanel(anchor) {
    if ($('#ges-panel').length) return;
    installStyles();
    const $panel = $('<fieldset id="ges-panel">').html(`
      <legend>GE Invitation Screening</legend>
      <div class="ges-field">
        <label for="ges-emails">邮箱</label>
        <textarea id="ges-emails" spellcheck="false" placeholder="scholar1@university.edu"></textarea>
      </div>
      <details class="ges-params">
        <summary>参数</summary>
        <div class="ges-param-grid">
          <div class="ges-field"><label for="ges-min-h">最低 h-index</label><input id="ges-min-h" type="number" min="0" max="500"></div>
          <div class="ges-field"><label for="ges-subject">Scopus 学科</label><input id="ges-subject" type="text" placeholder="Mathematics"></div>
          <div class="ges-field"><label for="ges-subject-rank">学科排名前</label><input id="ges-subject-rank" type="number" min="1" max="50"></div>
          <div class="ges-field"><label for="ges-invite-limit">不活跃 GE 上限</label><input id="ges-invite-limit" type="number" min="0" max="1000"></div>
          <div class="ges-field"><label for="ges-mail-days">邮件天数</label><input id="ges-mail-days" type="number" min="1" max="3650"></div>
        </div>
      </details>
      <div class="ges-actions">
        <select id="ges-mode" aria-label="查询范围"><option value="" selected disabled>选择查询范围</option><option value="scopus">Only H-index</option><option value="full">Full record</option></select>
        <button type="button" class="ges-btn primary" id="ges-start">开始筛选</button>
        <button type="button" class="ges-btn danger" id="ges-stop" disabled>停止</button>
        <button type="button" class="ges-btn" id="ges-export" disabled>导出 CSV</button>
        <span class="ges-status" id="ges-status" role="status" aria-live="polite">待输入</span>
      </div>
      <div class="ges-progress" aria-hidden="true"><span id="ges-progress-bar"></span></div>
      <div class="ges-summary" id="ges-summary"></div>
      <div class="ges-table-wrap">
        <table class="ges-table">
          <thead><tr><th>判断</th><th>候选人</th><th>硬门槛</th><th>Scopus Subject Areas</th><th>MDPI 活动</th><th>GE Invitation / 任职</th><th>原因</th></tr></thead>
          <tbody id="ges-results"><tr class="ges-loading"><td colspan="7">尚未筛选</td></tr></tbody>
        </table>
      </div>
    `).insertAfter(anchor);
    const savedConfig = {
      minimumHIndex: getStored('minimumHIndex', DEFAULTS.minimumHIndex),
      subjectName: getStored('subjectName', DEFAULTS.subjectName),
      maximumSubjectRank: getStored('maximumSubjectRank', getStored('maximumMathRank', DEFAULTS.maximumSubjectRank)),
      inactiveInviteLimit: getStored('inactiveInviteLimit', DEFAULTS.inactiveInviteLimit),
      mailLookbackDays: getStored('mailLookbackDays', DEFAULTS.mailLookbackDays),
    };
    for (const [id, value] of Object.entries({
      '#ges-mode': '',
      '#ges-min-h': savedConfig.minimumHIndex,
      '#ges-subject': savedConfig.subjectName,
      '#ges-subject-rank': savedConfig.maximumSubjectRank,
      '#ges-invite-limit': savedConfig.inactiveInviteLimit,
      '#ges-mail-days': savedConfig.mailLookbackDays,
    })) $panel.find(id).val(value);

    const state = { running: false, cancelRequested: false, results: [], resultByEmail: new Map(), rowByEmail: new Map(), completed: 0, total: 0 };
    const $start = $panel.find('#ges-start');
    const $stop = $panel.find('#ges-stop');
    const $export = $panel.find('#ges-export');
    const $status = $panel.find('#ges-status');
    const $bar = $panel.find('#ges-progress-bar');
    const $results = $panel.find('#ges-results');
    const $summary = $panel.find('#ges-summary');
    const $emails = $panel.find('#ges-emails');

    function updateProgress(message = '') {
      const percent = state.total ? Math.round((state.completed / state.total) * 100) : 0;
      $bar.css('width', `${percent}%`);
      $status.text(message || (state.running ? `处理中：${state.completed}/${state.total}` : `已完成：${state.completed}/${state.total}`));
    }

    function updateSummary() {
      $summary.empty();
      const counts = {};
      for (const result of state.results) {
        if (result.mode !== 'scopus') counts[result.decision.code] = (counts[result.decision.code] || 0) + 1;
      }
      for (const code of ['recommended', 'suitable', 'cautious', 'scopus', 'unsuitable', 'review']) {
        if (!counts[code]) continue;
        $summary.append(createElement('span', 'ges-chip', `${VERDICTS[code].label} ${counts[code]}`));
      }
    }

    function createPendingRow(email) {
      const row = createElement('tr', 'ges-loading');
      const cell = createElement('td', '', `正在查询 ${email} …`);
      cell.colSpan = 7;
      row.appendChild(cell);
      $results.append(row);
      state.rowByEmail.set(email, row);
    }

    async function startScreening() {
      if (state.running) return;
      const config = readConfig($panel);
      if (!config.queryMode) {
        $status.text('请选择 Only H-index 或 Full record。');
        $panel.find('#ges-mode').trigger('focus');
        return;
      }
      const parsed = parseEmailList($emails.val());
      if (!parsed.valid.length) {
        $status.text('请至少输入一个邮箱。');
        $emails.trigger('focus');
        return;
      }

      saveConfig(config);
      state.running = true;
      state.cancelRequested = false;
      state.results = [];
      state.resultByEmail.clear();
      state.rowByEmail.clear();
      state.completed = 0;
      state.total = parsed.valid.length;
      $results.empty();
      $summary.empty();
      $start.add($export).prop('disabled', true);
      $stop.prop('disabled', false);
      for (const entry of parsed.ordered) createPendingRow(entry.value);
      updateSummary();
      updateProgress(`开始查询：${state.completed}/${state.total}`);

      const requestQueues = {
        mdpi: createConcurrencyLimiter(MDPI_REQUEST_CONCURRENCY),
        scopus: createConcurrencyLimiter(SCOPUS_REQUEST_CONCURRENCY),
      };
      await runPool(parsed.valid, MDPI_REQUEST_CONCURRENCY, async (email) => {
        if (state.cancelRequested) return;
        let result;
        try {
          result = await collectCandidate(email, config, requestQueues);
        } catch (error) {
          result = makeErrorResult(email, config.queryMode, `未完成查询：${conciseError(error)}`);
        }
        state.resultByEmail.set(email, result);
        state.results = Array.from(state.resultByEmail.values());
        renderResultRow(state.rowByEmail.get(email), result);
        state.completed += 1;
        updateSummary();
        updateProgress();
      });

      state.results = parsed.ordered.map((entry) => state.resultByEmail.get(entry.value)).filter(Boolean);
      updateSummary();

      state.running = false;
      $start.prop('disabled', false);
      $stop.prop('disabled', true);
      $export.prop('disabled', state.results.length === 0);
      if (state.cancelRequested) {
        updateProgress(`已停止 ${state.completed}/${state.total}`);
      } else {
        updateProgress(`完成 ${state.completed}/${state.total}`);
      }
    }

    $start.on('click', startScreening);
    $stop.on('click', () => {
      state.cancelRequested = true;
      $stop.prop('disabled', true);
      $status.text('停止中');
    });
    $export.on('click', () => exportCsv(state.results));
    $panel.on('keydown', (event) => {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) event.preventDefault();
    });
  }

  function init() {
    const targetPage = Boolean(globalThis.__GE_SCREEN_TEST__) || (
      location.hostname === 'susy.mdpi.com'
      && location.pathname === '/user/settings'
      && location.hash === '#G'
    );
    if (!targetPage) {
      $('#ges-panel').remove();
      return;
    }
    if ($('#ges-panel').length) return;
    $('#left-menu-main-container').remove();
    let anchor = $('#ges-anchor')[0];
    if (anchor) {
      mountPanel(anchor);
      return;
    }
    const themeFieldset = $('fieldset').filter((_, fieldset) =>
      /Change Susy Theme/i.test(elementText($('legend', fieldset)[0]) || elementText(fieldset).slice(0, 100)),
    )[0];
    if (!themeFieldset) return;
    anchor = $('<span id="ges-anchor" hidden>').insertBefore(themeFieldset)[0];
    $(themeFieldset).remove();
    mountPanel(anchor);
  }

  const testApi = {
    DEFAULTS,
    REVIEWER_CHECK_ROUTE_KEY,
    SPECIAL_ISSUE_ID,
    MDPI_REQUEST_CONCURRENCY,
    SCOPUS_REQUEST_CONCURRENCY,
    VERDICTS,
    parseEmailList,
    extractAssignmentRoles,
    confirmedRoleStatus,
    countRecentUniqueRecords,
    parseUserInfo,
    parseGuestEditorCheck,
    parseReviewerCheck,
    parseReviewerInvitationHistory,
    summarizeReviewerInvitationRows,
    parseMailSearch,
    parseScopusPayload,
    classifyCandidate,
    classifyScopusOnly,
    renderResultRow,
    createConcurrencyLimiter,
    buildUrls,
    buildScopusBridgeUrl,
    requestScopus,
    requestScopusViaBridge,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = testApi;
  if (typeof window !== 'undefined' && globalThis.__GE_SCREEN_TEST__) globalThis.__GE_SCREEN_TEST_API__ = testApi;
  const isScopusBridgeWorker = (
    typeof window !== 'undefined'
    && location.hostname === 'www.scopus.com'
    && new URLSearchParams(location.search).has(SCOPUS_BRIDGE_PARAM)
  );
  try {
    if (isScopusBridgeWorker) {
      runScopusBridgeWorker();
    } else if (
      typeof window !== 'undefined'
      && typeof document !== 'undefined'
      && (location.hostname === 'susy.mdpi.com' || globalThis.__GE_SCREEN_TEST__)
    ) {
      if (location.hostname === 'susy.mdpi.com') $(window).on('hashchange', init);
      init();
    }
  } catch (error) {
    console.error('[SuSy GE Invitation Screener] Initialization failed.', error);
  }
})();
