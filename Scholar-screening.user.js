// ==UserScript==
// @name         SuSy Scholar Screener
// @version      6.9.22
// @author       SKDAY
// @match        https://susy.mdpi.com/user/settings*
// @match        https://www.scopus.com/authid/detail.uri*
// @match        https://www.scopus.com/search/form.uri*
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
// @run-at       document-start
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
  const SCOPUS_BRIDGE_CHANNEL_PARAM = 'ge_screen_channel';
  const REVIEWER_CHECK_ROUTE_KEY = 'a5ce29b8b4917729fc1dc44abf2fc686';
  const SPECIAL_ISSUE_CONFIG_KEY = 'GE_Check_SI_ID';
  const DEFAULT_SPECIAL_ISSUE_ID = '342143';
  const MDPI_REQUEST_CONCURRENCY = Number.POSITIVE_INFINITY;
  const SCOPUS_REQUEST_CONCURRENCY = 5;
  const SCOPUS_REQUESTS_PER_SECOND = 5;
  const SCOPUS_WORKER_READY_TIMEOUT = 30000;
  const SCOPUS_WORKER_TITLE = '[工作中] Scopus Scholar Screening — 请勿关闭';
  const PROCEED_SYMBOLS = { yes: '✓', no: '✕', 'not-applicable': '∅', pending: '…' };
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

  const scopusBridgeState = {
    channelId: '',
    requestKey: '',
    readyKey: '',
    workerHandle: null,
    readyPromise: null,
    requests: new Map(),
    pending: new Map(),
    cleanupRegistered: false,
  };

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

  function extractEmails(value) {
    return unique((String(value || '').match(EMAIL_PATTERN) || []).map((email) => email.toLowerCase()));
  }

  function emailsAreSimilar(left, right) {
    const leftEmail = extractEmails(left)[0] || '';
    const rightEmail = extractEmails(right)[0] || '';
    if (!leftEmail || !rightEmail) return false;
    if (leftEmail === rightEmail) return true;
    const [leftLocalRaw, leftDomain] = leftEmail.split('@');
    const [rightLocalRaw, rightDomain] = rightEmail.split('@');
    const leftLocal = leftLocalRaw.replace(/\+.*/, '').replace(/[^a-z0-9]/g, '');
    const rightLocal = rightLocalRaw.replace(/\+.*/, '').replace(/[^a-z0-9]/g, '');
    const relatedDomain = leftDomain === rightDomain
      || leftDomain.endsWith(`.${rightDomain}`)
      || rightDomain.endsWith(`.${leftDomain}`);
    return relatedDomain && leftLocal.length >= 3 && leftLocal === rightLocal;
  }

  function normalizeNameTokens(value) {
    const ignored = /^(?:prof|professor|dr|doctor|mr|mrs|ms|miss|sir|jr|sr|phd|md)$/;
    return normalizeSpace(value).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()
      .replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').split(' ')
      .filter((token) => token && !ignored.test(token));
  }

  function namesAreSimilar(left, right) {
    const leftTokens = normalizeNameTokens(left);
    const rightTokens = normalizeNameTokens(right);
    if (!leftTokens.length || !rightTokens.length) return false;
    if (leftTokens.join(' ') === rightTokens.join(' ')) return true;
    const [shorter, longer] = leftTokens.length <= rightTokens.length
      ? [leftTokens, rightTokens]
      : [rightTokens, leftTokens];
    if (shorter.length < 2) return false;
    const used = new Set();
    return shorter.every((token) => {
      const index = longer.findIndex((candidate, candidateIndex) => !used.has(candidateIndex) && (
        token === candidate
        || (token.length === 1 && candidate.startsWith(token))
        || (candidate.length === 1 && token.startsWith(candidate))
      ));
      if (index < 0) return false;
      used.add(index);
      return true;
    });
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

  function extractAssignmentRoles(text) {
    return unique(String(text || '').split(/\r?\n/).flatMap((line) => ROLE_TERMS.filter((term) =>
      new RegExp(`^\\s*(?:[-•]\\s*)?${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(?:of|for|in)\\s+\\S`, 'i').test(line),
    )));
  }

  function parseUserInfo(html) {
    const documentObject = parseDocument(html);
    const text = documentText(documentObject);
    if (!/Overview:/i.test(text)) throw new Error('Info 页面异常');

    const topBoundary = text.search(/Voucher Record|reviewer information:/i);
    const topText = topBoundary >= 0 ? text.slice(0, topBoundary) : text.slice(0, 12000);
    const compactTop = normalizeSpace(topText);
    const structuredName = normalizeSpace(
      $('[data-section="reviewer-profile"] b', documentObject).first().text()
      || $('[data-section="editors"] b', documentObject).first().text()
      || $('[data-section="account-info"] b', documentObject).first().text(),
    );
    const nameMatch = compactTop.match(/Overview:\s*\S+\s+(?:CRM\s+)?(.+?)\s*\([^)]*\)\s*(?:registered on (?:SUSY|SciProfiles)|is:|$)/i);

    const editorSection = $('[data-section="editors"]', documentObject)[0];
    const decisionRecords = [];
    for (const row of editorSection ? $('table tr', editorSection) : []) {
      const dateCell = $('.submission-date', row)[0];
      if (dateCell) decisionRecords.push({ id: elementText($('.msid', row)[0]), date: dateCell.getAttribute('title') || elementText(dateCell) });
    }
    const editorText = editorSection ? documentText({ body: editorSection }) : '';
    const roles = editorSection ? ROLE_TERMS.filter((term) => new RegExp(
      `\\bis:\\s*${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(?:of|for|in)\\s+\\S`, 'i',
    ).test(editorText)) : [];
    return {
      name: structuredName || normalizeSpace(nameMatch?.[1] || ''),
      submitted: numberOr(text.match(/submitted\s+(\d+)\s+manuscripts?/i)?.[1]),
      reviewed: numberOr(text.match(/reviewed\s+(\d+)\s+manuscripts?/i)?.[1]),
      decisionsPastYear: new Set(decisionRecords.map((record, index) => isWithinPastYear(record.date) ? normalizeSpace(record.id) || `row-${index}` : null).filter(Boolean)).size,
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
    const proceedStatus = /publishers\s+and\s+MEs\s+can\s+add\s+GEs/i.test(text) ? 'not-applicable' : hasProceed ? 'yes' : 'no';
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
    const confirmedRoleRows = roleRows.filter((row) => /^(?:online|active|completed|closed|expired|offline|resigned)\b/.test(normalizeStatus(row.status))
      && row.journal
      && ROLE_TERMS.some((term) => normalizeStatus(term) === normalizeStatus(row.role)));
    const assignmentRoles = unique($('p,li,td,div', documentObject).get()
      .flatMap((element) => extractAssignmentRoles(elementText(element))));
    const roles = unique([
      ...assignmentRoles,
      ...confirmedRoleRows.map((row) => row.role),
    ]);

    if (!hasProceed && !/E-?Mail:|Name:|not allowed to invite|Special Issue|publishers\s+and\s+MEs\s+can\s+add\s+GEs/i.test(text)) throw new Error('GE 页面异常');

    return {
      hasProceed,
      proceedStatus,
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
    if (!/Primary email:|Email:|reviewer/i.test(text)) throw new Error('Reviewer 页面异常');
    return {
      reviewPastYear: numberOr(text.match(/Number of review received in the past year:\s*(\d+)/i)?.[1]),
      scopusId: extractScopusIdFromDocument(documentObject),
      reviewerId: extractReviewerIdFromDocument(documentObject),
    };
  }

  function parseReviewerInvitationHistory(html, now = new Date()) {
    const documentObject = parseDocument(html);
    const table = findTable(extractTables(documentObject), ['Manuscript ID', 'Status', 'Added on']);
    if (!table.headers.length) throw new Error('Reviewer 历史页面异常');
    const statusIndex = table.headers.findIndex((header) => /^Status$/i.test(header));
    const addedIndex = table.headers.findIndex((header) => /^Added on$/i.test(header));
    const rows = table.rows.map((row) => ({
      status: row[statusIndex] || '',
      addedOn: row[addedIndex] || '',
    }));
    const invitedRows = rows.filter((row) => normalizeSpace(row.status) && !/^Uninvited\b/i.test(normalizeSpace(row.status)));
    const acceptedRows = invitedRows.filter((row) => /^(?:Accepted|Review received|Report received)\b/i.test(normalizeSpace(row.status)));
    return {
      invitationCount: invitedRows.length,
      acceptedCount: acceptedRows.length,
      declinedCount: invitedRows.filter((row) => /^Declined\b/i.test(normalizeSpace(row.status))).length,
      invitationPastYearCount: invitedRows.filter((row) => isWithinPastYear(row.addedOn, now)).length,
      acceptedPastYearCount: acceptedRows.filter((row) => isWithinPastYear(parseSusyDate(row.status) || row.addedOn, now)).length,
    };
  }

  function parseMailSearch(html) {
    const documentObject = parseDocument(html);
    const text = documentText(documentObject);
    if (!/Summary of current results batch:|Search:/i.test(text)) throw new Error('MailsDB 页面异常');
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
    const emails = unique([
      ...extractEmails(data.emailAddress),
      ...extractEmails(data.email),
      ...(Array.isArray(data.emailAddresses) ? data.emailAddresses.flatMap(extractEmails) : []),
    ]);
    return {
      authorId: String(data.authorId),
      hIndex,
      subjects,
      preferredName: normalizeSpace(data.preferredName?.full || ''),
      emails,
    };
  }

  function sourceOk(source) {
    return Boolean(source && source.ok && source.data);
  }

  function validateScopusIdentity(email, susyNames, scopusSource) {
    if (!sourceOk(scopusSource)) return { needsReview: false, warning: '' };
    const scopus = scopusSource.data;
    const scopusEmails = unique(Array.isArray(scopus.emails) ? scopus.emails.flatMap(extractEmails) : []);
    const scopusName = normalizeSpace(scopus.preferredName || '');
    const candidateNames = unique((Array.isArray(susyNames) ? susyNames : [susyNames]).map(normalizeSpace));
    const emailMatched = scopusEmails.some((scopusEmail) => emailsAreSimilar(email, scopusEmail));
    const nameMatched = Boolean(scopusName) && candidateNames.some((susyName) => namesAreSimilar(susyName, scopusName));
    if (emailMatched || nameMatched) {
      return { needsReview: false, warning: '', emailMatched, nameMatched, scopusEmails, scopusName };
    }
    return {
      needsReview: true,
      warning: 'Scopus 身份待核',
      emailMatched,
      nameMatched,
      scopusEmails,
      scopusName,
    };
  }

  function metricMaximum(...values) { return Math.max(0, ...values.map((value) => numberOr(value))); }

  function collectMetrics(sources = {}, rawConfig = {}, mode = 'full') {
    const config = {
      minimumHIndex: clamp(rawConfig.minimumHIndex, 0, 500, DEFAULTS.minimumHIndex),
      subjectName: normalizeSpace(rawConfig.subjectName) || DEFAULTS.subjectName,
      maximumSubjectRank: clamp(rawConfig.maximumSubjectRank, 1, 50, DEFAULTS.maximumSubjectRank),
      inactiveInviteLimit: clamp(rawConfig.inactiveInviteLimit, 0, 1000, DEFAULTS.inactiveInviteLimit),
      mailLookbackDays: clamp(rawConfig.mailLookbackDays, 1, 3650, DEFAULTS.mailLookbackDays),
    };
    const info = sourceOk(sources.info) ? sources.info.data : {};
    const ge = sourceOk(sources.ge) ? sources.ge.data : {};
    const reviewer = sourceOk(sources.reviewer) ? sources.reviewer.data : {};
    const reviewerHistory = sourceOk(sources.reviewerHistory) ? sources.reviewerHistory.data : {};
    const mail = sourceOk(sources.mail) ? sources.mail.data : {};
    const scopus = sourceOk(sources.scopus) ? sources.scopus.data : {};
    let proceedStatus = 'unknown';
    if (mode !== 'scopus') {
      if (sources.ge?.pending) proceedStatus = 'pending';
      else if (sourceOk(sources.ge)) proceedStatus = ['yes', 'no', 'not-applicable'].includes(ge.proceedStatus) ? ge.proceedStatus : ge.hasProceed ? 'yes' : 'no';
    }
    const submissions = metricMaximum(info.submitted, mail.authorSubmissions);
    const reviews = metricMaximum(info.reviewed, mail.reviewReports, reviewerHistory.acceptedCount);
    const reviewPastYear = metricMaximum(reviewer.reviewPastYear, reviewerHistory.acceptedPastYearCount);
    let subjectRank = null;
    if (sourceOk(sources.scopus) && Array.isArray(scopus.subjects) && scopus.subjects.length) {
      const index = scopus.subjects.findIndex((subject) => normalizeSpace(subject?.name).toLowerCase() === config.subjectName.toLowerCase());
      subjectRank = index < 0 ? Infinity : index + 1;
    }
    const metrics = {
      submissions, reviews,
      reviewInvitations: sourceOk(sources.reviewerHistory) || sourceOk(sources.mail) ? metricMaximum(reviewerHistory.invitationCount, mail.reviewInvitations, reviews) : null,
      reviewPastYear,
      reviewPastYearInvitations: sourceOk(sources.reviewerHistory) ? metricMaximum(reviewerHistory.invitationPastYearCount, reviewPastYear) : null,
      decisions: numberOr(info.decisionsPastYear), recentMails: numberOr(mail.recentMailCount), latestMail: mail.latestMail || null,
      attempts: numberOr(ge.attemptCount), accepted: numberOr(ge.acceptedCount), interested: numberOr(ge.interestedCount), declined: numberOr(ge.declinedCount),
      roles: unique([...(info.roles || []), ...(ge.roles || []), ...(mail.roles || [])]),
      hIndex: Number.isFinite(scopus.hIndex) ? scopus.hIndex : null,
      subjectName: config.subjectName, subjectRank,
      subjects: Array.isArray(scopus.subjects) ? scopus.subjects.map((subject) => subject.name) : [],
      geProceed: proceedStatus === 'yes' ? true : proceedStatus === 'no' ? false : null,
      geProceedStatus: proceedStatus,
      hardGateFailures: {
        proceed: proceedStatus === 'no',
        hIndex: Number.isFinite(scopus.hIndex) && scopus.hIndex < config.minimumHIndex,
        subject: subjectRank !== null && subjectRank > config.maximumSubjectRank,
      },
    };
    return { config, metrics, info, ge, mail };
  }

  function classifyCandidate(evidence, rawConfig = {}) {
    const sources = evidence.sources || {};
    const { config, metrics, info, ge, mail } = collectMetrics(sources, rawConfig);
    const hardReasons = [], reviewReasons = [];
    if (!sourceOk(sources.ge)) reviewReasons.push('GE 查询失败');
    else if (metrics.hardGateFailures.proceed) hardReasons.push('无 Proceed');
    if (!sourceOk(sources.scopus)) reviewReasons.push('Scopus 查询失败');
    else {
      if (metrics.hIndex === null) reviewReasons.push('缺 h-index');
      else if (metrics.hardGateFailures.hIndex) hardReasons.push('h-index 低');
      if (!metrics.subjects.length) reviewReasons.push('缺 Scopus 学科');
      else if (metrics.hardGateFailures.subject) hardReasons.push('学科不符');
    }
    if (hardReasons.length) return { code: 'unsuitable', ...VERDICTS.unsuitable, hardGateFailed: true, reasons: hardReasons, metrics };
    if (reviewReasons.length) return { code: 'review', ...VERDICTS.review, reasons: reviewReasons, metrics };

    const hasActivity = metrics.submissions > 0 || metrics.reviews > 0 || metrics.reviewPastYear > 0 || metrics.decisions > 0 || metrics.recentMails > 0;
    const hasRoleHistory = Boolean(info.roleHistory || ge.roleHistory || mail.roleHistory);
    if (hasRoleHistory) return { code: 'recommended', ...VERDICTS.recommended, reasons: ['有 MDPI 任职'], metrics };
    if (hasActivity) {
      if (metrics.attempts > config.inactiveInviteLimit && !metrics.accepted) return { code: 'cautious', ...VERDICTS.cautious, reasons: ['GE 多次未接受'], metrics };
      return { code: 'suitable', ...VERDICTS.suitable, reasons: ['有 MDPI 活动'], metrics };
    }
    if (metrics.accepted) return { code: 'suitable', ...VERDICTS.suitable, reasons: ['有 accepted'], metrics };
    if (metrics.interested) return { code: 'cautious', ...VERDICTS.cautious, reasons: ['有 interested'], metrics };
    if (metrics.attempts > config.inactiveInviteLimit) {
      if (!sourceOk(sources.info) || !sourceOk(sources.mail)) return { code: 'review', ...VERDICTS.review, reasons: ['活动数据不全'], metrics };
      return { code: 'unsuitable', ...VERDICTS.unsuitable, reasons: ['无活动'], metrics };
    }
    return { code: 'suitable', ...VERDICTS.suitable, reasons: ['首次/低频邀请'], metrics };
  }

  function classifyScopusOnly(scopusSource, rawConfig = DEFAULTS) {
    const { metrics } = collectMetrics({ scopus: scopusSource }, rawConfig, 'scopus');
    if (!sourceOk(scopusSource)) return { code: 'review', ...VERDICTS.review, reasons: ['Scopus 查询失败'], metrics };
    const reasons = [];
    if (metrics.hIndex === null) reasons.push('缺 h-index');
    else if (metrics.hardGateFailures.hIndex) reasons.push('h-index 低');
    if (!metrics.subjects.length) reasons.push('缺 Scopus 学科');
    else if (metrics.hardGateFailures.subject) reasons.push('学科不符');
    if (metrics.hardGateFailures.hIndex || metrics.hardGateFailures.subject) return { code: 'unsuitable', ...VERDICTS.unsuitable, hardGateFailed: true, reasons, metrics };
    if (reasons.length) return { code: 'review', ...VERDICTS.review, reasons, metrics };
    return { code: 'scopus', ...VERDICTS.scopus, reasons: [], metrics };
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
    let specialIssueId = DEFAULT_SPECIAL_ISSUE_ID;
    try {
      const value = typeof GM_config !== 'undefined' && typeof GM_config.get === 'function'
        ? GM_config.get(SPECIAL_ISSUE_CONFIG_KEY)
        : typeof GM_getValue === 'function' ? GM_getValue(SPECIAL_ISSUE_CONFIG_KEY, DEFAULT_SPECIAL_ISSUE_ID) : '';
      specialIssueId = String(value || DEFAULT_SPECIAL_ISSUE_ID).trim() || DEFAULT_SPECIAL_ISSUE_ID;
    } catch (_) {}
    return {
      info: `https://susy.mdpi.com/user/info?emails=${encodedEmail}`,
      ge: `https://susy.mdpi.com/user/guest_editor/check?email=${encodedEmail}&special_issue_id=${encodeURIComponent(specialIssueId)}`,
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

  function createScopusBridgeId() {
    return globalThis.crypto?.randomUUID?.()
      || `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }

  function initializeScopusBridgeChannel() {
    if (scopusBridgeState.channelId) return;
    scopusBridgeState.channelId = createScopusBridgeId();
    scopusBridgeState.requestKey = `${SCOPUS_BRIDGE_PREFIX}${scopusBridgeState.channelId}_requests`;
    scopusBridgeState.readyKey = `${SCOPUS_BRIDGE_PREFIX}${scopusBridgeState.channelId}_ready`;
    try { if (typeof GM_deleteValue === 'function') GM_deleteValue(scopusBridgeState.requestKey); } catch (_) {}
    try { if (typeof GM_deleteValue === 'function') GM_deleteValue(scopusBridgeState.readyKey); } catch (_) {}
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function' && !scopusBridgeState.cleanupRegistered) {
      scopusBridgeState.cleanupRegistered = true;
      window.addEventListener('pagehide', () => {
        const error = new Error('Scholar screening 页面已关闭');
        failPendingScopusBridgeRequests(error);
        closeScopusBridgeWorker();
      }, { once: true });
    }
  }

  function publishScopusBridgeRequests() {
    if (typeof GM_setValue !== 'function') throw new Error('Tampermonkey 共享存储权限不可用');
    GM_setValue(scopusBridgeState.requestKey, Array.from(scopusBridgeState.requests.values()));
  }

  function failPendingScopusBridgeRequests(error) {
    for (const rejectPending of Array.from(scopusBridgeState.pending.values())) rejectPending(error);
  }

  function closeScopusBridgeWorker() {
    if (scopusBridgeState.pending.size) return false;
    const workerHandle = scopusBridgeState.workerHandle;
    const requestKey = scopusBridgeState.requestKey;
    const readyKey = scopusBridgeState.readyKey;
    scopusBridgeState.workerHandle = null;
    scopusBridgeState.readyPromise = null;
    scopusBridgeState.requests.clear();
    scopusBridgeState.channelId = '';
    scopusBridgeState.requestKey = '';
    scopusBridgeState.readyKey = '';
    try { if (requestKey && typeof GM_deleteValue === 'function') GM_deleteValue(requestKey); } catch (_) {}
    try { if (readyKey && typeof GM_deleteValue === 'function') GM_deleteValue(readyKey); } catch (_) {}
    try {
      if (workerHandle && !workerHandle.closed && typeof workerHandle.close === 'function') workerHandle.close();
    } catch (_) {}
    return true;
  }

  function ensureScopusBridgeWorker(authorId = null) {
    if (scopusBridgeState.readyPromise) return scopusBridgeState.readyPromise;
    if (
      typeof GM_openInTab !== 'function'
      || typeof GM_addValueChangeListener !== 'function'
      || typeof GM_removeValueChangeListener !== 'function'
      || typeof GM_setValue !== 'function'
    ) return Promise.reject(new Error('Tampermonkey 后台标签页桥接权限不可用'));

    initializeScopusBridgeChannel();
    let tabHandle = null;
    const readyPromise = new Promise((resolve, reject) => {
      let listenerId = null;
      let timeout = null;
      let settled = false;

      function finish(handler, value) {
        if (settled) return;
        settled = true;
        if (timeout) clearTimeout(timeout);
        if (listenerId !== null) { try { GM_removeValueChangeListener(listenerId); } catch (_) {} }
        handler(value);
      }

      function fail(error) {
        if (tabHandle && scopusBridgeState.workerHandle === tabHandle) {
          scopusBridgeState.workerHandle = null;
          try { if (!tabHandle.closed && typeof tabHandle.close === 'function') tabHandle.close(); } catch (_) {}
        }
        finish(reject, error);
      }

      try {
        listenerId = GM_addValueChangeListener(scopusBridgeState.readyKey, (_key, _oldValue, rawMessage) => {
          let message = rawMessage;
          if (typeof rawMessage === 'string') {
            try { message = JSON.parse(rawMessage); } catch (_) { return; }
          }
          if (!message || message.channelId !== scopusBridgeState.channelId) return;
          if (message.ok === false) {
            fail(new Error(message.error || 'Scopus Worker 启动失败'));
            return;
          }
          finish(resolve, message);
        });

        const normalizedAuthorId = String(authorId || '');
        const workerUrl = new URL(normalizedAuthorId
          ? 'https://www.scopus.com/authid/detail.uri'
          : 'https://www.scopus.com/search/form.uri');
        if (normalizedAuthorId) workerUrl.searchParams.set('authorId', normalizedAuthorId);
        else workerUrl.searchParams.set('display', 'basic');
        workerUrl.searchParams.set(SCOPUS_BRIDGE_PARAM, 'worker');
        workerUrl.searchParams.set(SCOPUS_BRIDGE_CHANNEL_PARAM, scopusBridgeState.channelId);
        tabHandle = GM_openInTab(workerUrl.toString(), { active: false, setParent: true });
        scopusBridgeState.workerHandle = tabHandle;
        if (tabHandle && typeof tabHandle === 'object') {
          tabHandle.onclose = () => {
            if (scopusBridgeState.workerHandle !== tabHandle) return;
            scopusBridgeState.workerHandle = null;
            scopusBridgeState.readyPromise = null;
            try { if (typeof GM_deleteValue === 'function') GM_deleteValue(scopusBridgeState.readyKey); } catch (_) {}
            const error = new Error('Scopus Worker 已关闭');
            finish(reject, error);
            failPendingScopusBridgeRequests(error);
          };
        }
        timeout = setTimeout(() => fail(new Error('Scopus Worker 启动超时')), SCOPUS_WORKER_READY_TIMEOUT);
      } catch (error) {
        fail(error);
      }
    });

    scopusBridgeState.readyPromise = readyPromise;
    readyPromise.catch(() => {
      if (scopusBridgeState.readyPromise === readyPromise) scopusBridgeState.readyPromise = null;
    });
    return readyPromise;
  }

  function requestScopusViaBridge(authorId, timeoutMs = 45000) {
    const normalizedAuthorId = String(authorId || '');
    if (!/^\d+$/.test(normalizedAuthorId)) return Promise.reject(new Error('Scopus Author ID 无法识别'));
    initializeScopusBridgeChannel();

    return new Promise((resolve, reject) => {
      if (
        typeof GM_addValueChangeListener !== 'function'
        || typeof GM_removeValueChangeListener !== 'function'
        || typeof GM_setValue !== 'function'
      ) {
        reject(new Error('Tampermonkey 后台标签页桥接权限不可用'));
        return;
      }

      const requestId = createScopusBridgeId();
      const responseKey = `${SCOPUS_BRIDGE_PREFIX}${scopusBridgeState.channelId}_response_${requestId}`;
      let listenerId = null;
      let timeout = null;
      let settled = false;
      let published = false;

      function cleanup() {
        if (timeout) clearTimeout(timeout);
        if (listenerId !== null) { try { GM_removeValueChangeListener(listenerId); } catch (_) {} }
        try { if (typeof GM_deleteValue === 'function') GM_deleteValue(responseKey); } catch (_) {}
        scopusBridgeState.pending.delete(requestId);
        if (published && scopusBridgeState.requests.delete(requestId)) {
          try { publishScopusBridgeRequests(); } catch (_) {}
        }
      }

      function settle(handler, value) {
        if (settled) return;
        settled = true;
        cleanup();
        handler(value);
      }

      try {
        try { if (typeof GM_deleteValue === 'function') GM_deleteValue(responseKey); } catch (_) {}
        listenerId = GM_addValueChangeListener(responseKey, (_key, _oldValue, rawMessage) => {
          let message = rawMessage;
          if (typeof rawMessage === 'string') {
            try { message = JSON.parse(rawMessage); } catch (_) { return; }
          }
          if (!message || message.requestId !== requestId || String(message.authorId) !== normalizedAuthorId) return;
          if (message.ok && typeof message.payload === 'string') {
            settle(resolve, {
              text: message.payload,
              status: 200,
              finalUrl: `https://www.scopus.com/api/authors/${encodeURIComponent(normalizedAuthorId)}`,
              method: 'same-origin-persistent-worker',
            });
          } else {
            settle(reject, new Error(message.error || 'Scopus Worker 未返回数据'));
          }
        });

        scopusBridgeState.pending.set(requestId, (error) => settle(reject, error));
        timeout = setTimeout(() => settle(reject, new Error('Scopus Worker 查询超时')), timeoutMs);
        ensureScopusBridgeWorker(normalizedAuthorId).then(() => {
          if (settled) return;
          scopusBridgeState.requests.set(requestId, {
            requestId,
            authorId: normalizedAuthorId,
            responseKey,
            expiresAt: Date.now() + timeoutMs,
          });
          published = true;
          try {
            publishScopusBridgeRequests();
          } catch (error) {
            settle(reject, error);
          }
        }).catch((error) => settle(reject, error));
      } catch (error) {
        settle(reject, error);
      }
    });
  }

  async function requestScopus(url) {
    const authorId = String(url || '').match(/\/api\/authors\/(\d+)/i)?.[1];
    if (!authorId) throw new Error('Scopus Author ID 无法识别');
    return requestScopusViaBridge(authorId);
  }

  function installScopusWorkerNotice() {
    let statusText = '正在连接 Scholar Screening…';
    let statusElement = null;
    let titleObserver = null;

    function keepTitle() {
      if (document.title !== SCOPUS_WORKER_TITLE) document.title = SCOPUS_WORKER_TITLE;
    }

    function mount() {
      keepTitle();
      const parent = document.body || document.documentElement;
      if (!parent) return;
      let notice = document.getElementById('susy-ge-scopus-worker-notice');
      if (!notice) {
        notice = document.createElement('div');
        notice.id = 'susy-ge-scopus-worker-notice';
        notice.setAttribute('role', 'status');
        notice.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;background:#f4f7fa;color:#1f2933;font-family:Segoe UI,Microsoft YaHei,sans-serif;';
        const panel = document.createElement('div');
        panel.style.cssText = 'width:min(560px,100%);padding:30px 32px;border:1px solid #cbd5df;border-radius:12px;background:#fff;box-shadow:0 12px 36px rgba(15,23,42,.16);text-align:center;';
        const heading = document.createElement('div');
        heading.textContent = 'Scopus 数据查询正在运行';
        heading.style.cssText = 'font-size:22px;font-weight:700;margin-bottom:12px;';
        statusElement = document.createElement('div');
        statusElement.id = 'susy-ge-scopus-worker-status';
        statusElement.style.cssText = 'font-size:16px;font-weight:600;color:#0b6b53;margin-bottom:14px;';
        const explanation = document.createElement('div');
        explanation.textContent = '这是 Scholar Screening 自动创建的专用工作页。请勿关闭；任务完成后会自动关闭。您手动打开的其他 Scopus 页面不会受影响。';
        explanation.style.cssText = 'font-size:14px;line-height:1.65;color:#52606d;';
        panel.append(heading, statusElement, explanation);
        notice.appendChild(panel);
        parent.appendChild(notice);
      } else {
        statusElement = notice.querySelector('#susy-ge-scopus-worker-status');
      }
      if (statusElement) statusElement.textContent = statusText;
      if (!titleObserver && document.head && typeof MutationObserver === 'function') {
        titleObserver = new MutationObserver(keepTitle);
        titleObserver.observe(document.head, { childList: true, subtree: true, characterData: true });
      }
    }

    mount();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
    window.addEventListener('pagehide', () => titleObserver?.disconnect(), { once: true });
    return (message) => {
      statusText = message;
      mount();
    };
  }

  function runScopusBridgeWorker() {
    const params = new URLSearchParams(location.search);
    const channelId = params.get(SCOPUS_BRIDGE_CHANNEL_PARAM);
    if (
      params.get(SCOPUS_BRIDGE_PARAM) !== 'worker'
      || !channelId
      || !/^[a-z0-9-]{20,100}$/i.test(channelId)
    ) return;
    const requestKey = `${SCOPUS_BRIDGE_PREFIX}${channelId}_requests`;
    const readyKey = `${SCOPUS_BRIDGE_PREFIX}${channelId}_ready`;
    const responsePrefix = `${SCOPUS_BRIDGE_PREFIX}${channelId}_response_`;
    const handledRequestIds = new Set();
    const updateWorkerNotice = installScopusWorkerNotice();
    let activeRequests = 0;

    function writeResponse(responseKey, message) {
      if (typeof GM_setValue !== 'function') return;
      GM_setValue(responseKey, message);
      setTimeout(() => {
        try { if (typeof GM_deleteValue === 'function') GM_deleteValue(responseKey); } catch (_) {}
      }, 60000);
    }

    async function processRequest(request) {
      const { requestId, authorId, responseKey } = request;
      activeRequests += 1;
      updateWorkerNotice(`正在查询 Scopus 数据（${activeRequests} 项）…`);
      try {
        const response = await fetch(`https://www.scopus.com/api/authors/${encodeURIComponent(authorId)}`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
          headers: { Accept: 'application/json,text/plain,*/*' },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        if (/\/login|\/signin/i.test(response.url)) throw new Error('Scopus 登录状态已失效');
        const parsed = parseScopusPayload(await response.text(), authorId);
        writeResponse(responseKey, {
          requestId,
          authorId: String(authorId),
          ok: true,
          payload: JSON.stringify({
            authorId: parsed.authorId,
            hindex: parsed.hIndex,
            preferredName: { full: parsed.preferredName },
            publishedSubjectAreas: parsed.subjects,
            emailAddresses: parsed.emails,
          }),
          completedAt: new Date().toISOString(),
        });
      } catch (error) {
        writeResponse(responseKey, {
          requestId,
          authorId: String(authorId),
          ok: false,
          error: conciseError(error),
          completedAt: new Date().toISOString(),
        });
      } finally {
        activeRequests -= 1;
        updateWorkerNotice(activeRequests > 0
          ? `正在查询 Scopus 数据（${activeRequests} 项）…`
          : '查询已响应，正在等待原页面完成…');
      }
    }

    function acceptRequests(rawRequests) {
      let requests = rawRequests;
      if (typeof rawRequests === 'string') {
        try { requests = JSON.parse(rawRequests); } catch (_) { return; }
      }
      if (!Array.isArray(requests)) return;
      for (const request of requests) {
        const requestId = String(request?.requestId || '');
        const authorId = String(request?.authorId || '');
        const responseKey = String(request?.responseKey || '');
        if (
          !requestId
          || handledRequestIds.has(requestId)
          || !/^\d+$/.test(authorId)
          || responseKey !== `${responsePrefix}${requestId}`
          || (Number(request.expiresAt) && Number(request.expiresAt) <= Date.now())
        ) continue;
        handledRequestIds.add(requestId);
        processRequest({ requestId, authorId, responseKey });
      }
    }

    try {
      if (
        typeof GM_getValue !== 'function'
        || typeof GM_setValue !== 'function'
        || typeof GM_addValueChangeListener !== 'function'
      ) throw new Error('Tampermonkey 共享存储权限不可用');
      GM_addValueChangeListener(requestKey, (_key, _oldValue, requests) => acceptRequests(requests));
      acceptRequests(GM_getValue(requestKey, []));
      GM_setValue(readyKey, {
        channelId,
        ok: true,
        workerId: createScopusBridgeId(),
        readyAt: new Date().toISOString(),
      });
      updateWorkerNotice('已连接，正在等待查询任务…');
    } catch (error) {
      updateWorkerNotice('工作页启动失败，请返回 Scholar Screening 页面查看提示。');
      if (typeof GM_setValue === 'function') {
        GM_setValue(readyKey, { channelId, ok: false, error: conciseError(error) });
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

  async function collectCandidate(email, config, requestQueues = {}, onProgress = null) {
    const runMdpiRequest = requestQueues.mdpi || ((task) => Promise.resolve().then(task));
    const runScopusRequest = requestQueues.scopus || ((task) => Promise.resolve().then(task));
    const mode = config.queryMode === 'scopus' ? 'scopus' : 'full';
    const sourceKeys = mode === 'scopus' ? ['info', 'scopus'] : ['info', 'ge', 'reviewer', 'mail', 'reviewerHistory', 'scopus'];
    const sources = Object.fromEntries(sourceKeys.map((key) => [key, { ok: false, data: null, pending: true }]));
    let urls = buildUrls(email, config);

    function refreshUrls() {
      const scopusId = sources.ge?.data?.scopusId || sources.info?.data?.scopusId || sources.reviewer?.data?.scopusId || null;
      const reviewerId = sources.info?.data?.reviewerId || sources.reviewer?.data?.reviewerId || null;
      urls = buildUrls(email, config, scopusId, reviewerId);
    }

    function completeSource(name, source) {
      sources[name] = source;
      refreshUrls();
      if (typeof onProgress === 'function') {
        const pendingKeys = sourceKeys.filter((key) => sources[key]?.pending);
        const completed = sourceKeys.length - pendingKeys.length;
        const { metrics, info, ge } = collectMetrics(sources, config, mode);
        const scopus = sourceOk(sources.scopus) ? sources.scopus.data : {};
        try { onProgress({
          email, mode, sources, urls, pending: true,
          name: ge.name || info.name || scopus.preferredName || '',
          progress: {
            completed, total: sourceKeys.length, pendingKeys,
            scopus: Boolean(sources.scopus?.pending),
            activity: ['info', 'reviewer', 'reviewerHistory', 'mail'].some((key) => sources[key]?.pending),
            history: ['info', 'ge', 'mail'].some((key) => sources[key]?.pending),
          },
          decision: { code: 'pending', label: `查询中 ${completed}/${sourceKeys.length}`, reasons: [], metrics },
          scopusIdentity: validateScopusIdentity(email, [ge.name, info.name], sources.scopus),
        }); } catch (_) {}
      }
      return source;
    }

    const trackSource = (name, requestPromise) => Promise.resolve(requestPromise)
      .then((source) => completeSource(name, source));
    const infoPromise = trackSource('info', loadSource(runMdpiRequest(() => requestSameOrigin(urls.info)), parseUserInfo));

    if (config.queryMode === 'scopus') {
      const info = await infoPromise;
      const scopusId = info.data?.scopusId || null;
      refreshUrls();
      const scopus = scopusId
        ? await trackSource('scopus', loadSource(runScopusRequest(() => requestScopus(urls.scopus)), (payload) => parseScopusPayload(payload, scopusId)))
        : completeSource('scopus', { ok: false, data: null, error: '未找到 Scopus Author ID' });
      const scopusIdentity = validateScopusIdentity(email, [info.data?.name], scopus);
      return {
        email,
        name: info.data?.name || scopus.data?.preferredName || '',
        mode: 'scopus',
        sources: { info, scopus },
        urls,
        decision: classifyScopusOnly(scopus, config),
        scopusIdentity,
      };
    }

    const gePromise = trackSource('ge', loadSource(runMdpiRequest(() => requestSameOrigin(urls.ge)), parseGuestEditorCheck));
    const reviewerPromise = trackSource('reviewer', loadSource(runMdpiRequest(() => requestSameOrigin(urls.reviewer)), parseReviewerCheck));
    const mailPromise = trackSource('mail', loadSource(runMdpiRequest(() => requestCrossOrigin(urls.mail)), parseMailSearch));
    const scopusPromise = (async () => {
      const ge = await gePromise;
      let scopusId = ge.data?.scopusId || null;
      if (!scopusId) scopusId = (await infoPromise).data?.scopusId || null;
      if (!scopusId) scopusId = (await reviewerPromise).data?.scopusId || null;
      if (!scopusId) return completeSource('scopus', { ok: false, data: null, error: '未找到 Scopus Author ID' });
      const scopusUrl = buildUrls(email, config, scopusId).scopus;
      return trackSource('scopus', loadSource(runScopusRequest(() => requestScopus(scopusUrl)), (payload) => parseScopusPayload(payload, scopusId)));
    })();
    const reviewerHistoryPromise = (async () => {
      const info = await infoPromise;
      let reviewerId = info.data?.reviewerId || null;
      if (!reviewerId) reviewerId = (await reviewerPromise).data?.reviewerId || null;
      if (!reviewerId) return completeSource('reviewerHistory', { ok: false, data: null, error: '未找到 Reviewer ID' });
      const reviewerHistoryUrl = buildUrls(email, config, null, reviewerId).reviewerHistory;
      return trackSource('reviewerHistory', loadSource(runMdpiRequest(() => requestSameOrigin(reviewerHistoryUrl)), parseReviewerInvitationHistory));
    })();
    const [info, ge, reviewer, mail, scopus, reviewerHistory] = await Promise.all([
      infoPromise, gePromise, reviewerPromise, mailPromise, scopusPromise, reviewerHistoryPromise,
    ]);
    const evidence = { email, sources };
    const decision = classifyCandidate(evidence, config);
    const name = ge.data?.name || info.data?.name || scopus.data?.preferredName || '';
    const scopusIdentity = validateScopusIdentity(email, [ge.data?.name, info.data?.name], scopus);

    return { email, name, mode: 'full', sources, urls, decision, scopusIdentity };
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

  function renderResultRow(row, result) {
    const scopusOnly = result.mode === 'scopus';
    const progress = result.progress || {};
    row.className = result.pending ? 'ges-row pending' : scopusOnly ? 'ges-row' : `ges-row ${result.decision.code}`;
    if (result.scopusIdentity?.needsReview) row.classList.add('ges-identity-review');
    row.replaceChildren();
    const metrics = result.decision.metrics;

    const verdictCell = createElement('td');
    if (result.pending || !scopusOnly) verdictCell.appendChild(createElement('span', `ges-badge ${result.decision.code}`, result.decision.label));

    const candidateCell = createElement('td');
    if (result.name) {
      candidateCell.appendChild(createElement('strong', '', result.name));
      candidateCell.appendChild(createElement('br'));
    }
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
          .then(() => showCopyTip('✓', '#1e8e3e'))
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
    const proceedStatus = metrics.geProceedStatus || (metrics.geProceed === null ? 'unknown' : metrics.geProceed ? 'yes' : 'no');
    const proceedText = `Proceed: ${PROCEED_SYMBOLS[proceedStatus] || '?'}`;
    const hText = `h-index: ${metrics.hIndex === null ? progress.scopus ? '…' : '?' : `${metrics.hIndex}${progress.scopus ? '…' : ''}`}`;
    const subjectRank = metrics.subjectRank === Infinity ? '∞' : metrics.subjectRank;
    const subjectText = `${metrics.subjectName}: #${subjectRank === null ? progress.scopus ? '…' : '?' : `${subjectRank}${progress.scopus ? '…' : ''}`}`;
    const gateLines = [
      [hText, metrics.hardGateFailures?.hIndex, metrics.hIndex === null],
      [subjectText, metrics.hardGateFailures?.subject, metrics.subjectRank === null],
    ];
    if (!scopusOnly) gateLines.unshift([proceedText, metrics.hardGateFailures?.proceed, proceedStatus === 'unknown']);
    for (const [text, failed, unknown] of gateLines) {
      gateCell.appendChild(createElement('div', `ges-line${failed ? ' ges-fail' : unknown ? ' ges-unknown' : ''}`, text));
    }

    const subjectAreasCell = createElement('td', 'ges-subjects');
    if (metrics.subjects.length) appendLines(subjectAreasCell, metrics.subjects.slice(0, 5).map((subject, index) => `#${index + 1} ${subject}`));
    else subjectAreasCell.textContent = progress.scopus ? '…' : '—';

    const activityCell = createElement('td');
    if (result.mode === 'scopus') activityCell.textContent = '—';
    else {
      const activityUpdating = Boolean(progress.activity);
      const suffix = activityUpdating ? '…' : '';
      const reviewInvitations = metrics.reviewInvitations === null ? activityUpdating ? '…' : '?' : `${metrics.reviewInvitations}${suffix}`;
      const reviewPastYearInvitations = metrics.reviewPastYearInvitations === null ? activityUpdating ? '…' : '?' : `${metrics.reviewPastYearInvitations}${suffix}`;
      appendLines(activityCell, [
        `投稿 ${metrics.submissions}${suffix} · 审稿 ${metrics.reviews}${suffix}/${reviewInvitations}`,
        `近一年审稿 ${metrics.reviewPastYear}${suffix}/${reviewPastYearInvitations} · 编辑决定 ${metrics.decisions}${suffix}`,
        `来信 ${metrics.recentMails}${suffix}${metrics.latestMail ? ` · ${metrics.latestMail}` : ''}`,
      ]);
    }

    const historyCell = createElement('td');
    if (result.mode === 'scopus') historyCell.textContent = '—';
    else {
      const historyUpdating = Boolean(progress.history);
      const suffix = historyUpdating ? '…' : '';
      appendLines(historyCell, [
        `GE Invited ${metrics.attempts}${suffix} 次`,
        `accepted ${metrics.accepted}${suffix} · interested ${metrics.interested}${suffix} · declined ${metrics.declined}${suffix}`,
        metrics.roles.length ? `任职：${metrics.roles.join(' / ')}${suffix}` : historyUpdating ? '任职：…' : '任职：无',
      ]);
    }

    const reasonCell = createElement('td');
    if (result.scopusIdentity?.warning) {
      reasonCell.appendChild(createElement('div', 'ges-line ges-identity-warning', result.scopusIdentity.warning));
    }
    if (result.pending || !scopusOnly) appendLines(reasonCell, result.decision.reasons);
    row.append(verdictCell, candidateCell, gateCell, subjectAreasCell, activityCell, historyCell, reasonCell);
  }

  function exportCsv(results) {
    const headers = [
      'Email', 'Name', 'Mode', 'Verdict', 'Proceed', 'h-index', 'Subject', 'Subject Rank', 'Subject Areas', 'Submissions',
      'Reviews Accepted', 'Review Invitations', 'Reviews Past Year Accepted',
      'Review Invitations Past Year', 'Editorial Decisions Past Year', 'Recent Mails',
      'Latest Mail', 'GE Invitations', 'GE Accepted', 'GE Interested', 'GE Declined', 'Roles', 'Reason',
    ];
    const rows = results.map(({ email, name, mode, decision, scopusIdentity }) => {
      const m = decision.metrics;
      return [
        email, name, mode === 'scopus' ? 'scopus' : 'full', mode === 'scopus' ? '' : decision.label,
        mode === 'scopus' ? '' : PROCEED_SYMBOLS[m.geProceedStatus || (m.geProceed === null ? 'unknown' : m.geProceed ? 'yes' : 'no')] || '?', m.hIndex ?? '', m.subjectName, m.subjectRank === Infinity ? '∞' : m.subjectRank ?? '', m.subjects.join(' | '),
        m.submissions, m.reviews, m.reviewInvitations ?? '', m.reviewPastYear,
        m.reviewPastYearInvitations ?? '', m.decisions, m.recentMails, m.latestMail || '', m.attempts,
        m.accepted, m.interested, m.declined, m.roles.join(' | '),
        [scopusIdentity?.warning, ...(mode === 'scopus' ? [] : decision.reasons)].filter(Boolean).join(' | '),
      ];
    });
    const csv = `\uFEFF${[headers, ...rows].map((row) => row.map((value) => {
      const text = String(value ?? '');
      return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    }).join(',')).join('\r\n')}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = `ge-screening-${formatDate(new Date())}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function createRequestLimiter(maxConcurrent = Infinity, maxStarts = Infinity, intervalMs = 1000) {
    if (maxConcurrent === Infinity && maxStarts === Infinity) return (task) => Promise.resolve().then(task);
    const concurrentLimit = Math.max(1, Math.floor(numberOr(maxConcurrent, 1)));
    const startLimit = maxStarts === Infinity ? Infinity : Math.max(1, Math.floor(numberOr(maxStarts, 1)));
    const interval = Math.max(1, Math.floor(numberOr(intervalMs, 1000)));
    const queue = [];
    const startTimes = [];
    let active = 0, timer = null;

    function drain() {
      if (timer !== null) { clearTimeout(timer); timer = null; }
      const now = Date.now();
      while (startTimes.length && startTimes[0] <= now - interval) startTimes.shift();
      while (queue.length && active < concurrentLimit && startTimes.length < startLimit) {
        const entry = queue.shift();
        startTimes.push(Date.now());
        active += 1;
        Promise.resolve().then(entry.task).then(entry.resolve, entry.reject).finally(() => { active -= 1; drain(); });
      }
      if (queue.length && active < concurrentLimit && startTimes.length >= startLimit) timer = setTimeout(drain, Math.max(1, startTimes[0] + interval - Date.now()));
    }

    return (task) => {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        drain();
      });
    };
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
      .ges-table { width:100%; min-width:78rem; table-layout:fixed; border-collapse:collapse; background:#fff; color:#202a34; }
      .ges-table th { position:sticky; top:0; z-index:1; background:#eef2f5; color:#33404d; text-align:left; font-size:.78rem; }
      .ges-table th, .ges-table td { border-bottom:1px solid #e2e6ea; padding:.65rem .7rem; vertical-align:top; }
      .ges-table td { font-size:.82rem; line-height:1.4; }
      .ges-table th:nth-child(1) { width:6.5rem; }
      .ges-table th:nth-child(2) { width:12.5rem; }
      .ges-table th:nth-child(3) { width:9.5rem; }
      .ges-table th:nth-child(4) { width:15rem; }
      .ges-table th:nth-child(5) { width:12.5rem; }
      .ges-table th:nth-child(6) { width:14.5rem; }
      .ges-table th:nth-child(7) { width:7.5rem; }
      .ges-row.review, .ges-row.cautious { background:#fffaf0; }
      .ges-row.recommended { background:#f4fbf7; }
      .ges-row.ges-identity-review { background:#fffaf0; }
      .ges-badge { display:inline-block; border-radius:999px; padding:.25rem .55rem; color:#fff; font-size:.78rem; font-weight:750; white-space:nowrap; }
      .ges-badge.recommended { background:#087f5b; }
      .ges-badge.suitable { background:#22863a; }
      .ges-badge.cautious { background:#b36b00; }
      .ges-badge.scopus { background:#3568a8; }
      .ges-badge.unsuitable { background:#bd2635; }
      .ges-badge.review { background:#7a5b16; }
      .ges-badge.pending { background:#64748b; }
      .ges-row.pending { background:#f7f9fb; }
      .ges-email { display:inline-block; overflow-wrap:anywhere; color:#1a73e8; margin-top:.14rem; line-height:1.1; cursor:pointer; border-bottom:1px dashed #1a73e8; }
      .ges-email:hover { color:#1557b0; }
      .ges-copy-tip { color:#888; margin-left:.35rem; font-size:.76rem; font-weight:normal; white-space:nowrap; }
      .ges-subjects { overflow:hidden; }
      .ges-subjects .ges-line { overflow:hidden; white-space:nowrap; text-overflow:clip; }
      .ges-links { display:flex; gap:.42rem; flex-wrap:wrap; margin-top:.38rem; }
      .ges-link { font-size:.74rem; text-decoration:underline; }
      .ges-line+.ges-line { margin-top:.18rem; }
      .ges-fail { color:#a40e21; background:#ffe4e8; border-left:3px solid #c81e32; border-radius:3px; padding:.12rem .35rem; font-weight:750; }
      .ges-unknown { color:#7a5b16; background:#fff5d6; border-left:3px solid #a77c20; border-radius:3px; padding:.12rem .35rem; font-weight:750; }
      .ges-identity-warning { color:#8a4b08; background:#fff1cc; border-left:3px solid #b36b00; border-radius:3px; padding:.18rem .35rem; font-weight:750; }
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

    async function startScreening() {
      if (state.running) return;
      const config = {
        queryMode: $panel.find('#ges-mode').val() || '',
        minimumHIndex: clamp($panel.find('#ges-min-h').val(), 0, 500, DEFAULTS.minimumHIndex),
        subjectName: normalizeSpace($panel.find('#ges-subject').val()) || DEFAULTS.subjectName,
        maximumSubjectRank: clamp($panel.find('#ges-subject-rank').val(), 1, 50, DEFAULTS.maximumSubjectRank),
        inactiveInviteLimit: clamp($panel.find('#ges-invite-limit').val(), 0, 1000, DEFAULTS.inactiveInviteLimit),
        mailLookbackDays: clamp($panel.find('#ges-mail-days').val(), 1, 3650, DEFAULTS.mailLookbackDays),
      };
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

      for (const key of ['minimumHIndex', 'subjectName', 'maximumSubjectRank', 'inactiveInviteLimit', 'mailLookbackDays']) {
        try { if (typeof GM_setValue === 'function') GM_setValue(`${STORAGE_PREFIX}${key}`, config[key]); } catch (_) {}
      }
      state.running = true;
      ensureScopusBridgeWorker().catch(() => {});
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
      for (const entry of parsed.ordered) {
        const row = createElement('tr', 'ges-loading'), cell = createElement('td', '', `正在查询 ${entry.value} …`);
        cell.colSpan = 7;
        row.appendChild(cell); $results.append(row); state.rowByEmail.set(entry.value, row);
      }
      updateSummary();
      updateProgress(`开始查询：${state.completed}/${state.total}`);

      const requestQueues = {
        mdpi: createRequestLimiter(MDPI_REQUEST_CONCURRENCY),
        scopus: createRequestLimiter(SCOPUS_REQUEST_CONCURRENCY, SCOPUS_REQUESTS_PER_SECOND),
      };
      await Promise.all(parsed.valid.map(async (email) => {
        if (state.cancelRequested) return;
        let result;
        try {
          result = await collectCandidate(email, config, requestQueues, (partialResult) => {
            renderResultRow(state.rowByEmail.get(email), partialResult);
          });
        } catch (error) {
          result = {
            email, name: '', mode: config.queryMode, sources: {}, urls: {},
            decision: { code: 'review', ...VERDICTS.review, label: '查询失败', reasons: ['查询失败'], metrics: collectMetrics({}, config, config.queryMode).metrics },
          };
        }
        state.resultByEmail.set(email, result);
        state.results = Array.from(state.resultByEmail.values());
        renderResultRow(state.rowByEmail.get(email), result);
        state.completed += 1;
        updateSummary();
        updateProgress();
      }));

      state.results = parsed.ordered.map((entry) => state.resultByEmail.get(entry.value)).filter(Boolean);
      updateSummary();

      state.running = false;
      closeScopusBridgeWorker();
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
    DEFAULTS, VERDICTS, PROCEED_SYMBOLS, REVIEWER_CHECK_ROUTE_KEY, SPECIAL_ISSUE_CONFIG_KEY, DEFAULT_SPECIAL_ISSUE_ID,
    MDPI_REQUEST_CONCURRENCY, SCOPUS_REQUEST_CONCURRENCY, SCOPUS_REQUESTS_PER_SECOND,
    parseEmailList, extractAssignmentRoles,
    parseUserInfo, parseGuestEditorCheck, parseReviewerCheck, parseReviewerInvitationHistory, parseMailSearch, parseScopusPayload,
    emailsAreSimilar, namesAreSimilar, validateScopusIdentity, collectMetrics, classifyCandidate, classifyScopusOnly,
    collectCandidate, renderResultRow, createRequestLimiter, buildUrls,
    ensureScopusBridgeWorker, requestScopus, requestScopusViaBridge,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = testApi;
  if (typeof window !== 'undefined' && globalThis.__GE_SCREEN_TEST__) globalThis.__GE_SCREEN_TEST_API__ = testApi;
  const isScopusBridgeWorker = (
    typeof window !== 'undefined'
    && location.hostname === 'www.scopus.com'
    && new URLSearchParams(location.search).get(SCOPUS_BRIDGE_PARAM) === 'worker'
    && new URLSearchParams(location.search).has(SCOPUS_BRIDGE_CHANNEL_PARAM)
  );
  try {
    if (isScopusBridgeWorker) {
      runScopusBridgeWorker();
    } else if (
      typeof window !== 'undefined'
      && typeof document !== 'undefined'
      && (location.hostname === 'susy.mdpi.com' || globalThis.__GE_SCREEN_TEST__)
    ) {
      const initWhenReady = () => {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', init, { once: true });
        } else {
          init();
        }
      };
      if (location.hostname === 'susy.mdpi.com') $(window).on('hashchange', initWhenReady);
      initWhenReady();
    }
  } catch (error) {
    console.error('[SuSy GE Invitation Screener] Initialization failed.', error);
  }
})();
