// ==UserScript==
// @name          Susy Modifier
// @version       6.11.16
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Susy Modifier
// @author        SKDAY
// @icon64        https://susy.mdpi.com/build/img/design/susy-logo.png
// @updateURL     https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/SusyModifier.user.js
// @downloadURL   https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/SusyModifier.user.js
// @match         *://*.mdpi.com/*
// @match         *://*.mdpi.cn/*
// @match         *://redmine.mdpi.cn/*
// @match         *://*.scopus.com/*
// @match         *://www.scilit.net/*
// @match         *://admin.scilit.net/articles*
// @match         *://*.google.com/*
// @match         *://*.google.com.hk/*
// @match         *://*.google.co.uk/*
// @match         *://*.google.ca/*
// @match         *://*.google.de/*
// @match         *://*.google.fr/*
// @match         *://*.google.co.in/*
// @match         *://*.google.co.jp/*
// @match         *://*.google.com.br/*
// @match         *://*.google.com.mx/*
// @match         *://*.google.com.au/*
// @match         *://*.google.es/*
// @match         *://*.google.it/*
// @match         *://*.google.co.kr/*
// @match         *://*.google.com.tr/*
// @match         *://*.google.com.ar/*
// @match         *://*.google.com.sa/*
// @match         *://*.google.com.sg/*
// @match         *://*.google.com.tw/*
// @match         *://*.google.co.id/*
// @match         *://*.google.com.my/*
// @match         *://i.mdpi.cn/team/dinner*
// @match         *://forms.office.com/*
// @match         *://forms.cloud.microsoft/*
// @match         https://login.microsoftonline.com/*
// @require       https://gcore.jsdelivr.net/npm/jquery@4.0.0/dist/jquery.min.js
// @require       https://gcore.jsdelivr.net/npm/tooltipster@4.2.8/dist/js/tooltipster.bundle.min.js
// @require       https://gcore.jsdelivr.net/gh/JJJ/chosen@master/dist/js/chosen.jquery.min.js
// @require       https://gcore.jsdelivr.net/gh/sizzlemctwizzle/GM_config@master/gm_config.min.js
// @require       https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/Scholar-screening.user.js?v=6.11.11
// @require       https://mrs.mdpi.com/bundles/mdpimrs/js/html5_scripts/zingchart-html5-min.js?v=6.10.20
// @require       https://gcore.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js?v=6.10.20
// @resource      chosenCSS             https://gcore.jsdelivr.net/gh/JJJ/chosen@master/dist/css/chosen.min.css?v=6.10.20
// @resource      tooltipsterCSS        https://gcore.jsdelivr.net/npm/tooltipster@4.2.8/dist/css/tooltipster.bundle.min.css?v=6.10.20
// @resource      tooltipsterNoirCSS    https://gcore.jsdelivr.net/npm/tooltipster@4.2.8/dist/css/plugins/tooltipster/sideTip/themes/tooltipster-sideTip-noir.min.css?v=6.10.20
// @resource      icons                 https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/icons.json?v=6.10.22
// @resource      mailsdbBaseCSS        https://mailsdb.i.mdpi.com/assets/application-98a08eef03d8f08cf84f0f5a890ccbf92dd20964127ea9c280f768a08e729027.css?v=6.10.20
// @resource      mrsScreenCSS          https://mrs.mdpi.com/bundles/mdpimrs/css/screen.css?v=6.10.20
// @resource      mrsMainCSS            https://mrs.mdpi.com/bundles/mdpimrs/css/main.css?v=6.10.20
// @resource      mrsLayoutCSS          https://mrs.mdpi.com/bundles/mdpimrs/lib/datepicker/css/layout.css?v=6.10.20
// @resource      flatpickrCSS          https://gcore.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css?v=6.10.20
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM.xmlHttpRequest
// @grant         GM_deleteValue
// @grant         GM_addValueChangeListener
// @grant         GM_removeValueChangeListener
// @grant         GM_xmlhttpRequest
// @grant         GM_openInTab
// @grant         GM_getTab
// @grant         GM_saveTab
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @grant         GM_getResourceURL
// @grant         GM_registerMenuCommand
// @grant         GM.cookie
// @grant         window.close
// @connect       mdpi.com
// @connect       mdpi.cn
// @connect       i.mdpi.cn
// @connect       login.microsoftonline.com
// @connect       titlecaseconverter.com
// @connect       google.com
// @connect       scholar.google.com
// @connect       scopus.com
// @connect       webofknowledge.com
// @connect       skday.com
// @connect       pubpeer.com
// @connect       script.google.com
// @connect       script.googleusercontent.com
// @run-at        document-idle
// ==/UserScript==
/* globals jQuery, $, GM_config, zingchart, flatpickr */

const SK_WORK_LOGIN_SITES = [
    {id:'susy',name:'SUSY',url:'https://susy.mdpi.com/user/sme/status/submitted',checkUrl:'https://susy.mdpi.com/user/get/skype'}, {id:'mdpi',name:'MDPI',url:'https://www.mdpi.com/user/login',checkPath:'/'},
    {id:'mailsdb',name:'MailsDB',url:'https://mailsdb.i.mdpi.com/'}, {id:'mrs',name:'MRS 1.0',url:'https://mrs.mdpi.com/statistics',checkUrl:'https://mrs.mdpi.com/login_check_ajax',checkType:'boolean'},
    {id:'attendance',name:'HRMS',url:'https://i.mdpi.cn/team/attendance',checkUrl:'https://i.mdpi.cn/team/hr/person/profile'}, {id:'redmine',name:'Redmine CN',url:'https://redmine.mdpi.cn/',checkUrl:'https://redmine.mdpi.cn/my/account'}
];
const SK_WORK_LOGIN_STATUS_KEYS = SK_WORK_LOGIN_SITES.map(site => 'skWorkLoginStatus_' + site.id);
const SK_MRS_FAVORITES = ['Analytics', 'Games', 'Geometry', 'Mathematics', 'MCB', 'Risks', 'IJT', 'Telecom'].map(label => ({ id: String(skGetJid(label)), label }));
// MDPI Feature Paper 折扣区（1 = Zone I 100%，2 = Zone II ≤50%，3 = Zone III 无折扣），键为 Scopus 国家筛选值的写法（已在 Scopus 中逐一核对；Turkey/Türkiye、Russia/Russian Federation、Libya/Libyan Arab Jamahiriya 在 Scopus 中并存）。
const SK_COUNTRY_ZONES = new Map([
    [1, 'Australia|Austria|Belgium|Bulgaria|Canada|Croatia|Cyprus|Czech Republic|Denmark|Estonia|Finland|France|Germany|Greece|Hungary|Iceland|Ireland|Israel|Italy|Japan|South Korea|Latvia|Liechtenstein|Lithuania|Luxembourg|Malta|Netherlands|New Zealand|Norway|Poland|'
        + 'Portugal|Romania|Slovakia|Slovenia|Spain|Sweden|Switzerland|Taiwan|United Kingdom|United States|Singapore|China|Hong Kong|Macao'],
    [2, 'Argentina|Bahrain|Belarus|Brazil|Chile|Colombia|Cuba|Ecuador|Egypt|French Guiana|Guyana|Mexico|Morocco|Oman|Peru|Qatar|Saudi Arabia|Serbia|South Africa|Ukraine|United Arab Emirates|Uruguay|Algeria|Bosnia and Herzegovina|Costa Rica|Georgia|Malaysia|North Macedonia|'
        + 'Northern Mariana Islands|Thailand|Turkey|Türkiye|Viet Nam'],
    [3, 'Afghanistan|Andorra|Angola|Antigua and Barbuda|Armenia|Aruba|Azerbaijan|Bahamas|Bangladesh|Barbados|Belize|Benin|Bhutan|Bolivia|Botswana|Brunei Darussalam|Burkina Faso|Burundi|Cape Verde|Cambodia|Cameroon|Central African Republic|Chad|Comoros|Congo|Cote d\'Ivoire|'
        + 'Democratic Republic Congo|Djibouti|Dominica|Dominican Republic|El Salvador|Equatorial Guinea|Eritrea|Swaziland|Ethiopia|Faroe Islands|Fiji|French Polynesia|Gabon|Gambia|Ghana|Greenland|Grenada|Guatemala|Guinea|Guinea-Bissau|Haiti|Honduras|India|Indonesia|Iran|'
        + 'Iraq|Jamaica|Jordan|Kazakhstan|Kenya|Kiribati|Kosovo|Kuwait|Kyrgyzstan|Laos|Lebanon|Lesotho|Liberia|Libya|Libyan Arab Jamahiriya|Madagascar|Malawi|Maldives|Mali|Marshall Islands|Mauritania|Mauritius|Federated States of Micronesia|Moldova|Mongolia|Montenegro|'
        + 'Mozambique|Myanmar|Namibia|Nauru|Nepal|Nicaragua|Niger|Nigeria|Pakistan|Palau|Palestine|Panama|Papua New Guinea|Paraguay|Philippines|Puerto Rico|South Sudan|Russian Federation|Russia|Rwanda|Samoa|San Marino|Sao Tome and Principe|Senegal|Seychelles|Sierra Leone|'
        + 'Solomon Islands|Somalia|Sri Lanka|Saint Kitts and Nevis|Saint Lucia|Saint Vincent and the Grenadines|Sudan|Suriname|Syrian Arab Republic|Tajikistan|Tanzania|Timor-Leste|Togo|Tonga|Trinidad and Tobago|Tunisia|Turkmenistan|Tuvalu|Uganda|Uzbekistan|Vanuatu|'
        + 'Venezuela|Yemen|Zambia|Zimbabwe']
].flatMap(([zone, names]) => names.split('|').map(name => [name, zone])));

(function () {
    'use strict';
    if (window.top === window) {
        GM_registerMenuCommand('🔐 Login Hub', function(){GM_openInTab('https://www.mdpi.com/?susymodifier-login', { active: true });});
        GM_registerMenuCommand('🗑️ Reset Scopus', async function () {
            try {
                let cookies = await GM.cookie.list({ domain: 'scopus.com', partitionKey: {} });
                await Promise.all(cookies.map(cookie => {
                    const details = { url: `${cookie.secure ? 'https' : 'http'}://${cookie.domain.replace(/^\./, '')}${cookie.path}`, name: cookie.name };
                    if (cookie.partitionKey) details.partitionKey = cookie.partitionKey;
                    if (cookie.firstPartyDomain !== undefined) details.firstPartyDomain = cookie.firstPartyDomain;
                    return GM.cookie.delete(details);
                }));
                alert(`✅ Success! Cleared ${cookies.length} accessible cookies.`);
            } catch (_) {
                alert(`⚠️ Clear Scopus Cookie Failed!\n\nOpen the Tampermonkey Dashboard > Settings (Advanced mode) > Security, set "Allow scripts to access cookies" to "All", save the changes, and reload this page.\n\n`
                      + `请打开 Tampermonkey 管理面板 > 设置（高级模式）> 安全，将“允许脚本访问 Cookie”设置为“All”，保存后重新加载此页面。`);
            }
        });
    }
    GM_config.init({
        'id': 'SusyModifierConfig',
        'title': 'Settings of SusyModifier v' + GM_info.script.version,
        'fields': {
            'Manuscriptnote': { 'section': [GM_config.create('Function Modification'), 'Manuscript Pages'], 'label': 'Manuscript Note紧凑', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'Assign_Assistant': { 'label': '派稿助手', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'ManuscriptFunc': { 'label': '申请优惠券和发推广信', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'Template_Linkedin': {
                'label': 'LinkedIn推广信模板', 'type': 'textarea', 'default':
                `Dear Authors,\n\nHope this email finds you well. Your manuscript %m_id% is promoted by the Mathematics "%m_section%" Section LinkedIn account. Welcome to like, share, send and comment on it.\n\n`
                + `Find us and receive more information in the section "%m_section%" of Mathematics:\n[Links]\n\nPlease do not hesitate to let us know if you have questions.`
            },
            'Template_Paper': {
                'label': '文章推广信模板', 'type': 'textarea', 'default':
                `Dear %name%,\n\nThank you very much for your contribution to /Mathematics/, your manuscript %m_id% is now under review. We will keep you informed about the status of your manuscript.\n\n`
                + `In addition, you have published a paper/papers in /Mathematics/ in the past two years with the citation of about XX times. Based on your reputation and research interests, we believe that your results should attract more citations and `
                + `attention. Therefore, could you please promote the paper/papers to your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?\n\nIn addition, you have published a paper/`
                + `papers in /Mathematics/ in 20XX with the citation of XXXXX times, congratulations on your great work!\nTo encourage open scientific discussions and increase the visibility of your results, could you please promote the paper/papers to `
                + `your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?\n\n1. [paper link]\n2. [paper link]\n\nThank you in advance for your support.`
            },
            'SInote': { 'section': [, 'Special Issue Pages'], 'label': 'Special Issue Note紧凑', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'SIpages': { 'label': '特刊列表免翻页', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'Cfp_checker': { 'label': 'Toolkit for CfP Checker', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'GE_TemplateID': {
                'section': [], 'label': '默认 GE Invitation Template', 'type': 'select', 'labelPos': 'left', 'options':
                ['Guest Editor-Invite with Responsibility', 'Guest Editor-Invite with Benefits', 'Guest Editor-One Free Paper for GE team', 'Guest Editor-Why a Special Issue', 'Guest Editor-Optional', 'Guest Editor – Invite with Responsibilities and Benefits',
                 '*Guest Editor - SI Mentor Program'], default: 'Guest Editor-Invite with Responsibility'
            },
            'GE_TemplateS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^.*Mathematics.*Guest Editor" },
            'GE_TemplateS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] Invitation to Serve as the Guest Editor" },
            'GE_TemplateB1': { 'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_TemplateB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderID': {
                'section': [], 'label': '默认 GE Reminder Template', 'type': 'select', 'labelPos': 'left', 'options':
                ['Reminder (GE Responsibility)', 'Reminder (Video Call)', 'Reminder (General)', 'Reminder (With Benefits)'], default: 'Reminder (GE Responsibility)'
            },
            'GE_ReminderS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderB1': { 'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderPrefix': { 'type': 'hidden', 'default': 'Follow Up: ' },
            'GE_CancelID': {
                'section': [], 'label': '默认 GE Cancel Template', 'type': 'select', 'labelPos': 'left', 'options':
                ['Guest Editor Invitation – Cancel Invitation', 'Guest Editor Invitation – Cancel Invitation (Declined the Invitation via Email)', 'Guest Editor Invitation-Cancel Invitation (paper invitation – free of charge)-manually',
                 'Guest Editor Invitation-Cancel Invitation (paper invitation with full APC)-manually'],
                default: 'Guest Editor Invitation-Cancel Invitation (paper invitation – free of charge)-manually'
            },
            'GE_CancelS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_CancelS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_CancelB1': { 'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "once this Special Issue is online, we welcome you to contribute one Feature Paper with the publishing fees waived" },
            'GE_CancelB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "we welcome you to contribute one Feature Paper with a special discount" },
            'EB_TemplateID': { 'section': [], 'label': '默认 EB Invitation Template', 'type': 'select', 'labelPos': 'left', 'options': ['Invite Version 1', 'Invite Version 2', 'Invite Version 3', 'Invite Version 4'], default: 'Invite Version 1' },
            'EB_TemplateS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^Invitation" },
            'EB_TemplateS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] Invitation" },
            'EB_TemplateB1': { 'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'EB_TemplateB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'EB_ReminderID': {
                'section': [], 'label': '默认 EB Reminder Template', 'type': 'select', 'labelPos': 'left', 'options': ['Reminder (Responsibilities and Benefits)', 'Reminder (General)', 'Reminder (Numerous Benefits)'],
                default: 'Reminder(Responsibilities and Benefits)'
            },
            'EB_ReminderS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^Invitation" },
            'EB_ReminderS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] Invitation" },
            'EB_ReminderB1': { 'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'EB_ReminderB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'Report_TemplateID': {
                'section': [], 'label': '默认 GE Contact', 'type': 'select', 'labelPos': 'left', default: 'Monthly Report', 'options':
                ['Website Online', 'SI Open', 'Paper Invitation', 'Ask GE To Provide List Template 1', 'Ask GE To Provide List Template 2', 'Invite The GE To Send Invitations', 'Remind Another GE To Send The CfP', 'Discuss Discount With GE',
                 'Ask GE To Invite Papers', 'Invite The GE To Send A Reminder', 'Paper Submission Guideline', 'Remind FP Invitations After One Month', 'CFP Authors And Reviewers In MDPI', 'Encourage And Motivate GE To Solicit Papers Template 1',
                 'Encourage And Motivate GE To Solicit Papers Template 2', 'Encourage And Motivate GE To Solicit Papers Template 3', 'Mailing List Check', 'Mailing List Check Reminder', 'Guide GE To Manage SI Template 1', 'Guide GE To Manage SI Template 2',
                 'Conference Inquiry', 'Slide', 'Some Tips', 'Review Paper Invitation', 'Happy Thanksgiving Day', 'Merry Christmas', 'FP Reminder One Month Before The Deadline Template 1', 'FP Reminder One Month Before The Deadline Template 2',
                 'Extend The Deadline', 'Editorial – SI Closed', 'Book Online', 'Check Abstract', 'Monthly Report', 'IF Increased', 'Journal Awards', 'First Publication']
            },
            'Report_Notes': { 'label': '', 'labelPos': 'left', 'type': 'text', 'default': "月报" },
            'Report_TemplateS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex](?<=\\] ).*" },
            'Report_TemplateS2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function () {\n let $si_name = $('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().text().trim();\n`
                + ` return \`Monthly Report (\${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}) – \${$si_name}\`;\n}`
            },
            'Report_TemplateB1': { 'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex](?<=Dear[\\s\\S]*?,\\n\\n)[\\S\\s]*Kind regards," },
            'Report_TemplateB2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function (){\n let $si_name=$('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().text().trim();`
                + ` let $si_link=$('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().children().attr("href");`
                + ` let $arr=$('div.cell.small-12.medium-6.large-2:contains("Manuscripts(")').first().next().text().split("/");\n let $process=$arr[0].trim(),$pub=$arr[1].trim(),$reject=$arr[2].trim(),$instruct;`
                + ` if ($process+$pub+$reject>0) {$instruct="You can view all manuscripts submitted to the Special Issue by logging in with your email at the link provided. Please note that your own submissions will not be visible.`
                + `\\nhttps://susy.mdpi.com/academic-editor/special_issues"} else {$instruct="This is a new Special Issue and hasn't received submissions yet."} return \`I am writing to update you on the status of our Special Issue "\${$si_name}".\n`
                + `\${$si_link}\n\n1. Status of Submissions\n\nPublished: \${$pub}; Under Processing: \${$process}; Rejected: \${$reject}\n\n\${$instruct}\n\n2. Status of Planned Papers\n\nSeveral authors have committed to contributing feature papers`
                + ` to the Special Issue. If there are any missing papers, please let me know.\n\n%pp_list%\n\nWe are excited about a productive collaboration and hope for a successful outcome for the Special Issue. If you have any questions, please `
                + `do not hesitate to contact us.\n--\nBest regards,\n\`;\n}`
            },
            'CfP_TemplateID': { 'section': [], 'label': '默认 CfP Invitation Template', 'type': 'select', 'labelPos': 'left', 'options': ['Default', 'Paper Invitation 1', 'Paper Invitation 2'], default: 'Default' },
            'CfP_TemplateS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'CfP_TemplateS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'CfP_TemplateB1': {
                'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default':
                "[Regex]^(?=[\\s\\S]*(?:journal |in (?:the )?)\"?Mathematics\"?\\s*\\(ISSN)"
                + "Dear[^\\n]*,\\n\\n(?:(?:The open access journal [^\\n]+Special Issue entitled \"[^\"]+\"\\."
                + "[^\\n]+Based on your publication record,)|(?:We hope this email finds you well\\.\\n\\n"
                + "The (?:open access )?journal [^\\n]+Special Issue entitled \"[^\"]+\", with [^\\n]+ serving as Guest Editor))[\\s\\S]*$"
            },
            'CfP_TemplateB2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function (body) {\n let greeting=(body.match(/^Dear[^\\n]*,/)||["Dear {{reviewer_dr_name}},"])[0];\n`
                + ` let siName=(body.match(/Special Issue entitled "([^"]+)"/i)||[])[1]||"";\n let deadline=(body.match(/submission deadline is ([^.]+?) and manuscripts/i)||[])[1]||"";\n`
                + ` let siLink=(body.match(/https[^\\s]+special_issues[^\\s.]+/i)||[])[0]||"";\n let actionLink=(body.match(/Please click on the following link to either accept or decline our invitation:\\s*\\n([^\\n]+)/i)||[])[1]||"";\n`
                + ` let guestEditors=(body.match(/Special Issue entitled "[^"]+"\\.\\s+(.+?) (?:is|are) serving as Guest Editors? for this issue/i)||[])[1]\n`
                + `  ||(body.match(/Special Issue entitled "[^"]+", with (.+?) serving as Guest Editor/i)||[])[1]||"";\n let signature=(body.match(/Kind regards,[\\s\\S]*$/i)||[""])[0];\n`
                + ` let isMathematics=/(?:journal |in (?:the )?)"?Mathematics"?\\s*\\(ISSN/i.test(body);\n let isFree=/free of charge|exempt from this fee|full waiver/i.test(body);\n let discount=(body.match(/(\\d+)% discount/i)||[])[1]||"";\n`
                + ` if(!isMathematics||!siName||!deadline||!siLink||!actionLink||!guestEditors){return body;}\n let editorList=guestEditors.split(/\\s*(?:[,;]\\s*(?:and\\s+)?|\\band\\s+)(?=(?:Prof\\.?|Dr\\.?|Professor)\\s)/i);\n`
                + ` guestEditors=editorList.length>2?editorList.slice(0,-1).join(", ")+", and "+editorList[editorList.length-1]:editorList.join(" and ");\n`
                + ` let openAccess=isFree||discount?"Mathematics is a fully open-access, peer-reviewed journal.":"Mathematics is a fully open-access, peer-reviewed journal, with articles freely available to readers worldwide.";\n`
                + ` let benefit=isFree?"\\n• APC waiver: A 100% APC waiver is available for your future submission to Mathematics if accepted. `
                + `This waiver is not applicable to manuscripts that have already been submitted to the system.":discount?"\\n• Discount: A "+discount+"% APC discount is available for your future submission to Mathematics if accepted. `
                + `This discount applies only to future submissions to Mathematics and excludes other MDPI journals and manuscripts currently under processing.":"";\n`
                + ` let preparation=isFree?"If you have a suitable manuscript in preparation and would like to make use of this APC waiver, `
                + `please let us know before the submission deadline of "+deadline+". If possible, please provide the tentative title, author information, `
                + `abstract, and expected completion date of your manuscript. This will allow us to keep track of your manuscript’s progress and provide timely support throughout the Special Issue.":discount?`
                + `"If you have a suitable manuscript in preparation and need this discount, please let us know before the submission deadline of "+deadline+". `
                + `If possible, please also provide the tentative title, author information, abstract, and expected completion date of your manuscript. `
                + `This will allow us to keep track of your manuscript’s progress and provide timely support throughout the Special Issue.":`
                + `"If you have a suitable manuscript in preparation, please inform us before the submission deadline of "+deadline+", `
                + `and it’s better to provide the tentative title, author information, abstract, and expected completion date of your manuscript. `
                + `This will allow us to keep track of your manuscript’s progress and provide timely support throughout the Special Issue.";\n let response=isFree?"Your response will help us arrange the APC waiver accordingly.":discount?`
                + `"Your timely response would be greatly appreciated and would greatly assist us with our publishing planning and the allocation of Special Issue discounts.":`
                + `"Your timely response would be greatly appreciated and would greatly assist us with our publishing planning.";\n let signatureBlock=signature?"\\n\\n"+signature:"";\n return \`\${greeting}\n\n`
                + `We are pleased to invite you to contribute a manuscript to a Special Issue “\${siName}” of Mathematics, which is being organized by \${guestEditors}. `
                + `Given your expertise and contributions to this field, we sincerely hope you will consider submitting your work to this Special Issue.\n\nWe would like to highlight the following points regarding this invitation:\n`
                + `• Open Access: \${openAccess}\n• High Visibility: The journal is ranked Q1 in both SCIE (Web of Science) and Scopus and is indexed in RePEc, DOAJ, and other major academic databases.\n`
                + `• Rapid Publication: The first decision is provided approximately 17.4 days after submission.\n`
                + `• Special Invitation: As an invited author, you may consult the Guest Editor on your manuscript’s suitability before submission. `
                + `Our editorial team can also assist you with formatting and the submission process.\${benefit}\n\n\${preparation}\n\nYou may also accept or decline this invitation directly by clicking the following link: \${actionLink}\n\n`
                + `\${response}\n\nFor more information, please visit the following websites:\nSpecial Issue Website: \${siLink}\nJournal Website: https://www.mdpi.com/journal/mathematics\n\n`
                + `We look forward to hearing from you and hope to have the opportunity to collaborate with you.\${signatureBlock}\`;\n}`
            },
            'CfP_ReminderID': {
                'section': [], 'label': '默认 CfP Reminder Template', 'type': 'select', 'labelPos': 'left',
                'options': ['Paper Invitation Remind', 'Custom'], default: 'Paper Invitation Remind'
            },
            'CfP_ReminderS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^[\\s\\S]*$" },
            'CfP_ReminderS2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function () {\n let body=$("#mailBody").val();\n let siName=(body.match(/Special Issue entitled "([^"]+)"/i)||[])[1]||"";\n`
                + ` let ifValue=(body.match(/(?:IF|Impact Factor(?: of the Journal)? is)\\s*([\\d.]+)/i)||[])[1]||"2.3";\n let isMathematics=/(?:journal |in (?:the )?)"?Mathematics"?\\s*\\(ISSN/i.test(body);\n`
                + ` let isFree=/free of charge|all associated costs waived|exempt from this fee|full waiver/i.test(body);\n let discount=(body.match(/(\\d+)% discount/i)||[])[1]||"";\n`
                + ` if(!isMathematics||!siName){return $("#mailSubject").val();}\n let prefix=isFree?"Call for Paper Reminder (Free of Charge): ":discount?"Call for Paper Reminder ("+discount+"% Discount): ":"Call for Paper Reminder: ";\n`
                + ` return prefix+'[Mathematics] (IF '+ifValue+') — Special Issue "'+siName+'"';\n}`
            },
            'CfP_ReminderB1': {
                'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default':
                "[Regex]^(?=[\\s\\S]*(?:journal |in (?:the )?)\"?Mathematics\"?\\s*\\(ISSN)"
                + "Dear[^\\r\\n]*,\\r?\\n\\r?\\n(?:(?:We hope this email finds you well\\.\\r?\\n\\r?\\n"
                + "We contacted you on)|(?:We recently invited you to submit a Feature Paper))[\\s\\S]*$"
            },
            'CfP_ReminderB2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function (body) {\n let greeting=(body.match(/^Dear[^\\n]*,/)||["Dear {{reviewer_dr_name}},"])[0];\n`
                + ` let siName=(body.match(/Special Issue entitled "([^"]+)"/i)||[])[1]||"";\n let siLink=(body.match(/https[^\\s]+special_issues[^\\s.]+/i)||[])[0]||"";\n`
                + ` let actionLink=(body.match(/Please click on the following link to either accept or decline our invitation:\\s*\\n([^\\n]+)/i)||[])[1]||"";\n`
                + ` let guestEditors=(body.match(/\\b((?:(?:Prof\\.?|Dr\\.?|Professor)\\s)[^\\n]+?) (?:is|are) serving as Guest Editors? for this issue/i)||[])[1]||"";\n let signature=(body.match(/Kind regards,[\\s\\S]*$/i)||[""])[0];\n`
                + ` let isMathematics=/(?:journal |in (?:the )?)"?Mathematics"?\\s*\\(ISSN/i.test(body);\n let isFree=/free of charge|all associated costs waived|exempt from this fee|full waiver/i.test(body);\n`
                + ` let discount=(body.match(/(\\d+)% discount/i)||[])[1]||"";\n if(!isMathematics||!siName||!siLink||!actionLink||!guestEditors){return body;}\n`
                + ` let editorList=guestEditors.split(/\\s*(?:[,;]\\s*(?:and\\s+)?|\\band\\s+)(?=(?:Prof\\.?|Dr\\.?|Professor)\\s)/i);\n`
                + ` guestEditors=editorList.length>2?editorList.slice(0,-1).join(", ")+", and "+editorList[editorList.length-1]:editorList.join(" and ");\n let scope=isFree||discount?'in this Special Issue "'+siName+'"':"in Mathematics";\n`
                + ` let openAccess=isFree||discount?"Mathematics is a fully open-access, peer-reviewed journal.":"Mathematics is a fully open-access, peer-reviewed journal, with articles freely available to readers worldwide.";\n`
                + ` let specialInvitation=isFree||discount?"As an invited author, you may consult the Guest Editor on your manuscript’s suitability before submission. `
                + `Our editorial team can also assist you with formatting and the submission process.":"As an invited author, you may consult the Guest Editor regarding the suitability of your manuscript before submission. `
                + `Our editorial team can also assist you with formatting and the submission process.";\n let benefit=isFree?"\\n• APC waiver: A 100% APC waiver is available for your submission to Mathematics if accepted. `
                + `This waiver is not applicable to manuscripts that have already been submitted to the system.":discount?"\\n• Discount: A "+discount+"% APC discount is available for your future submission to Mathematics if accepted. `
                + `This discount applies only to future submissions to Mathematics and excludes other MDPI journals and manuscripts currently under processing.":"";\n`
                + ` let ending=discount?"Your timely response would be greatly appreciated and would greatly assist us with our publishing planning and the allocation of Special Issue discounts. `
                + `Thank you very much for your time and consideration, and we look forward to hearing from you.":isFree?"We would greatly appreciate your timely response, as it will help us with our planning for the Special Issue.":`
                + `"We would greatly appreciate your timely response, as it will help us with our planning for the Special Issue. Thank you very much for your time and consideration, and we look forward to hearing from you.";\n`
                + ` let signatureBlock=signature?"\\n\\n"+signature:"";\n return \`\${greeting}\n\nWe hope this email finds you well.\n\n`
                + `We recently contacted you regarding a potential contribution to the Special Issue “\${siName},” but have not yet received your response. `
                + `We therefore wanted to follow up with you once again to see whether you might be interested in contributing a manuscript.\n\n`
                + `This Special Issue is led by \${guestEditors}. Further information about the Special Issue, as well as details about the Guest Editor, can be found on the following website: \${siLink}.\n\n`
                + `We would also like to highlight several advantages of publishing \${scope}:\n• Open Access: \${openAccess}\n`
                + `• High Visibility: The journal is ranked Q1 in both SCIE (Web of Science) and Scopus and is indexed in RePEc, DOAJ, and other major academic databases.\n`
                + `• Rapid Publication: The first decision is provided approximately 17.4 days after submission.\n• Special Invitation: \${specialInvitation}\${benefit}\n\n`
                + `To help us plan the next steps effectively, could you kindly confirm your current interest by selecting one of the following options?\n(a) Yes, we plan to contribute a paper by the submission deadline.\n`
                + `(b) Yes, but we need additional time.\n(c) No, we are unable to contribute, but we would be happy to recommend a colleague (please provide their name).\n(d) No, we are currently unable to contribute.\n\n`
                + `You may also accept or decline the invitation directly by clicking the following link: \${actionLink}\n\n\${ending}\${signatureBlock}\`;\n}`
            },
            'PP_Template': { 'section': [], 'label': '修改 PP 提醒模板', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'PP_TemplateS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^.*Special Issue(.*) – Potential Paper" },
            'PP_TemplateS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (JCR Q1)$1 - Reminder" },
            'PP_TemplateB1': {
                'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default':
                "[Regex]We hope you are well. [\\s\\S]*submitting a paper to the Special Issue (.*?)\\.[\\s\\S]*(https:\\/\\/www.mdpi.com\\/journal\\/mathematics\\/special_issues.*)[\\s\\S]*Kind regards,"
            },
            'PP_TemplateB2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': 'A few months ago, you expressed interest in submitting a paper to our special issue "$1". We would be grateful to have the opportunity to receive it.\n\n$2\n\n'
                + 'Please note that you will be offered a XX% discount on the Article Processing Charge by the guest editors if your paper is accepted for publication. To take advantage of the discount, we strongly encourage you to submit your'
                + ' manuscript by the deadline if possible.\n\nWe look forward to receiving your submission and thank you for your interest in our special issue.\n\nKind regards,'
            },
            'Interface_combine': { 'label': 'Topic Manuscripts整合SI', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Topic_TemplateS1': { 'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^.*" },
            'Topic_TemplateS2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function () { let $topic_name= $('div.cell.small-12.medium-6.large-2:contains("Topic Name")').next().text().trim(); return \`[MDPI Topics] Monthly Report `
                + `(\${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}) – \${$topic_name}\`; }`
            },
            'Topic_TemplateB1': { 'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': '[Regex]Dear Editor,[\\s\\S]*Kind regards,' },
            'Topic_TemplateB2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function (){\n let \$topic_name=\$('div.cell.small-12.medium-6.large-2:contains("Topic Name")').next().text().trim(); let \$topic_link=\$('div.cell.small-12.medium-6.`
                + `large-2:contains("Topic Name")').next().children().attr("href"); let \$arr=\$('div.cell.small-12.medium-6.large-2:contains("Manuscripts(")').first().next().text().split("/");\n let \$process=\$arr[0].trim(),\$pub=\$arr[1].trim(),`
                + `\$reject=\$arr[2].trim(),\$instruct; if (\$process+\$pub+\$reject>0) {\$instruct="You can view all manuscripts submitted to the Topic by logging in with your email at the link provided. Please note that your own submissions will `
                + `not be visible.\\nhttps://susy.mdpi.com/"} else {\$instruct="This is a new Topic and hasn't received submissions yet."} return \`Dear Editor,\n\nI am writing to update you on the status of our Topic "\${\$topic_name}".\n\${\$topic_link}`
                + `\n\n1. Status of Submissions\n\nPublished: \${\$pub}; Under Processing: \${\$process}; Rejected: \${\$reject}\n\n\${\$instruct}\n\n2. Status of Planned Papers\n\nSeveral authors have committed to contributing feature papers to the `
                + `Special Issue. If there are any missing papers, please let me know.\n\n%pp_list%\n\nMay you continue to explore the unknown and lead the forefront of academia. Wishing you continuous breakthroughs and inspiration in your scholarly `
                + `endeavors!\n--\nBest regards,\n\`;\n}`
            },
            'CRM_VisitingType': { 'section': [, 'CRM Pages'], 'label': 'Visiting Invitation Type', 'type': 'select', 'labelPos': 'left', 'options': ['', 'Online', 'Offline'], 'default': '' },
            'Interface_SME': {
                'section': [GM_config.create('Interface Modification')], 'label': 'I am SME ', 'type': 'select', 'labelPos': 'left', 'options':
                ['', 'A: Algebra and Logic', 'B: Geometry and Topology', 'C: Mathematical Analysis', 'C1: Difference and Differential Equations', 'C2: Dynamical Systems', 'C3: Real Analysis', 'C4: Complex Analysis', 'D: Statistics and Operations Research',
                 'D1: Probability and Statistics', 'D2: Operations Research and Fuzzy Decision Making', 'E: Applied Mathematics', 'E1: Mathematics and Computer Science', 'E2: Control Theory and Mechanics', 'E3: Mathematical Biology', 'E4: Mathematical Physics',
                 'E5: Financial Mathematics'], 'default': ''
            },
            'Journal': { 'label': 'of Journal', 'type': 'select', 'labelPos': 'left', 'options': ['Analytics', 'Games', 'Geometry', 'Mathematics', 'MCB', 'Risks', 'IJT', 'Telecom', 'None'], 'default': 'Mathematics' },
            'Easy_Journal': { 'label': '置顶期刊列表', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Susy_Theme': { 'label': 'Change Susy Theme', 'type': 'button', 'click': function () { window.location.href = "https://susy.mdpi.com/user/settings" } },
            'Interface_sidebar': { 'section': [], 'label': 'Susy 左侧边栏按钮', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'Old_Icon': { 'label': '使用旧图标', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Regular_Color': { 'label': '橙色标记 Regular', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Maths_J': { 'label': 'Scopus标记Maths期刊', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'Hidden_Func': { 'section': [], 'label': 'Experimental (!Caution)', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Remind_Dinner': { 'label': '提醒点餐', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'My_Account_Only': { 'label': 'Use My Account Only:', 'labelPos': 'left', 'type': 'text', 'default': "" },
            'GE_Check_SI_ID': { 'label': 'SI ID:', 'labelPos': 'left', 'type': 'text', 'default': "342143" },
        },
        'events': {
            'save': function () { if ($("#SusyModifierConfig").length > 0) { location.reload() }; },
            'open': function () {
                var f_settings = $("#SusyModifierConfig").contents();
                f_settings.find("textarea[id^='SusyModifierConfig_field_']").each(function () {
                    let fieldName = this.id.replace("SusyModifierConfig_field_", "");
                    f_settings.find("#SusyModifierConfig_" + fieldName + "_field_label").after('<button type="button" class="sk_field_reset" title="Reset this field to default" aria-label="Reset this field to default">↺</button>')
                        .next(".sk_field_reset").on("click", function (e) { e.preventDefault(); e.stopPropagation(); GM_config.fields[fieldName].reset(); });
                });
                GM_config.fields.Hidden_Func.node.addEventListener('change', function () { //Experimental警告
                    if (f_settings.find("#SusyModifierConfig_field_Hidden_Func")[0].checked) {
                        alert('Dangerous! \n\nDon\'t turn it on unless you are familiar with ALL susy functions. \nOtherwise, it will cause serious problems.');
                    }
                });
                GM_config.fields.Old_Icon.node.addEventListener('change', function () { //Old Icon提示
                    if (f_settings.find("#SusyModifierConfig_field_Old_Icon")[0].checked) {
                        alert('It is recommended to set the browser zoom to 90%.')
                    }
                });
                //隐藏推广信模板
                if (!GM_config.get('ManuscriptFunc')) { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").hide() }
                GM_config.fields.ManuscriptFunc.node.addEventListener('change', function () {
                    if (f_settings.find("#SusyModifierConfig_field_ManuscriptFunc")[0].checked) { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").show(); }
                    else { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").hide() }
                });
                //隐藏 PP 和 Topic Template
                f_settings.find("#SusyModifierConfig_PP_TemplateB2_var").after('<div id="c_br2"></div>')
                if (!GM_config.get('PP_Template')) { f_settings.find("#SusyModifierConfig_PP_TemplateS1_var,#SusyModifierConfig_PP_TemplateS2_var,#SusyModifierConfig_PP_TemplateB1_var,#SusyModifierConfig_PP_TemplateB2_var,#c_br2").hide() }
                if (!GM_config.get('Interface_combine')) { f_settings.find("#SusyModifierConfig_Topic_TemplateS1_var,#SusyModifierConfig_Topic_TemplateS2_var,#SusyModifierConfig_Topic_TemplateB1_var,#SusyModifierConfig_Topic_TemplateB2_var").hide() }
                GM_config.fields.PP_Template.node.addEventListener('change', function () {
                    if (f_settings.find("#SusyModifierConfig_field_PP_Template")[0].checked) {
                        f_settings.find("#SusyModifierConfig_PP_TemplateS1_var,#SusyModifierConfig_PP_TemplateS2_var,#SusyModifierConfig_PP_TemplateB1_var,#SusyModifierConfig_PP_TemplateB2_var,#c_br2").show()
                    }
                    else { f_settings.find("#SusyModifierConfig_PP_TemplateS1_var,#SusyModifierConfig_PP_TemplateS2_var,#SusyModifierConfig_PP_TemplateB1_var,#SusyModifierConfig_PP_TemplateB2_var,#c_br2").hide() }
                });
                GM_config.fields.Interface_combine.node.addEventListener('change', function () {
                    if (f_settings.find("#SusyModifierConfig_field_Interface_combine")[0].checked) {
                        f_settings.find("#SusyModifierConfig_Topic_TemplateS1_var,#SusyModifierConfig_Topic_TemplateS2_var,#SusyModifierConfig_Topic_TemplateB1_var,#SusyModifierConfig_Topic_TemplateB2_var").show()
                    }
                    else { f_settings.find("#SusyModifierConfig_Topic_TemplateS1_var,#SusyModifierConfig_Topic_TemplateS2_var,#SusyModifierConfig_Topic_TemplateB1_var,#SusyModifierConfig_Topic_TemplateB2_var").hide() }
                });
                //隐藏Section
                if (GM_config.get('Journal') != "Mathematics") { f_settings.find("#SusyModifierConfig_field_Interface_SME").hide(); }
                GM_config.fields.Journal.node.addEventListener('change', function () {
                    if (f_settings.find("#SusyModifierConfig_field_Journal").val() == "Mathematics") {
                        f_settings.find("#SusyModifierConfig_field_Interface_SME").show()
                    }
                    else { f_settings.find("#SusyModifierConfig_field_Interface_SME").hide() }
                });
                // 显示今天首次访问时间 ☀
                let storedData = GM_getValue("firstVisitData", ""), todayStr = skLocalDate();
                if (storedData && storedData.startsWith(todayStr + "|")) {
                    let firstVisitTime = storedData.split("|")[1];
                    f_settings.find("#SusyModifierConfig_header").after(`<div id="sk_first_visit" style="text-align:center;color:#666;font-size:13px;margin:-5px 0 5px;cursor:pointer;" title="点击查看系统开机时间命令">☀ 今日首次访问: ${firstVisitTime}</div>`);
                    f_settings.find("#sk_first_visit").on("click", function () {
                        prompt("在 PowerShell 中运行以下命令查看系统开机时间：", "Get-WinEvent -FilterHashtable @{LogName='System'; Id=1; ProviderName='Microsoft-Windows-Kernel-General'} -MaxEvents 5 -ErrorAction SilentlyContinue | Select-Object TimeCreated");
                    });
                }
            },
            'init': onInit,
        },
        'css': `#SusyModifierConfig{background-color:#D6EDD9} textarea{font-size:12px;width:160px} .config_var{padding: 5px 10px;display:inline-block;vertical-align:top;} select{width:170px} #SusyModifierConfig_section_1{min-height:70px}
        #SusyModifierConfig_section_0,#SusyModifierConfig_section_2,#SusyModifierConfig_section_3{min-height:40px} #SusyModifierConfig_Interface_sidebar_field_label,#SusyModifierConfig_Manuscriptnote_field_label,#SusyModifierConfig_SInote_field_label,
        #SusyModifierConfig_SIpages_field_label,#SusyModifierConfig_section_8{display:inline-grid;grid-template-columns:repeat(5, auto);
        #SusyModifierConfig_Regular_Color_field_label,#SusyModifierConfig_LinkShort_field_label,#SusyModifierConfig_Cfp_checker_field_label,#SusyModifierConfig_Assign_Assistant_field_label,#SusyModifierConfig_ManuscriptFunc_field_label,#SusyModifierConfig_field_Report_Notes,
        #SusyModifierConfig_Old_Icon_field_label,#SusyModifierConfig_Hidden_Func_field_label{width:140px;display:inline-block;} #SusyModifierConfig_PP_Template_field_label,
        #SusyModifierConfig_Interface_combine_field_label{width:145px;display:inline-block;} #SusyModifierConfig_GE_TemplateID_field_label,#SusyModifierConfig_GE_ReminderID_field_label,#SusyModifierConfig_GE_CancelID_field_label,#SusyModifierConfig_EB_TemplateID_field_label,
        #SusyModifierConfig_EB_ReminderID_field_label,#SusyModifierConfig_field_Report_TemplateID,#SusyModifierConfig_CRM_VisitingType_field_label{display:block;} #SusyModifierConfig_Report_Notes_var{padding-top:0;}
        grid-template-rows:auto auto;} #SusyModifierConfig_Report_TemplateID_var{grid-row:1;grid-column:1;} #SusyModifierConfig_Report_Notes_var{grid-row:2;grid-column:1;} #SusyModifierConfig_Report_TemplateID_var{padding-bottom:0;}
        #SusyModifierConfig_Report_TemplateS1_var,#SusyModifierConfig_Report_TemplateS2_var, #SusyModifierConfig_Report_TemplateB1_var,#SusyModifierConfig_Report_TemplateB2_var{grid-row:1/3} #SusyModifierConfig_CfP_TemplateID_field_label,
        #SusyModifierConfig_field_CfP_TemplateID,#SusyModifierConfig_CfP_ReminderID_field_label,#SusyModifierConfig_field_CfP_ReminderID{display:block;} #SusyModifierConfig_field_Journal{width:auto} .sk_field_reset:focus{outline:1px dotted #666}
        .sk_field_reset{border:0;border-radius:3px;background:transparent;color:#777;font-size:14px;line-height:16px;margin-left:2px;padding:0 4px;cursor:pointer;vertical-align:middle}.sk_field_reset:hover{background:#BEDBC2;color:#333}`
    });
})();

function skLocalDate(date = new Date()) {
    return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function skCalendarDate(year, month, day) {
    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return year >= 1 && date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : new Date(NaN);
}

function onInit() {
    const [versionYear, versionMonth, versionDay] = GM_info.script.version.split('.').map(Number);
    const date_v = skCalendarDate(2020 + versionYear, versionMonth, versionDay);
    const blacklistEncoded = ["YWJjYW1lbGlhLnN1bnh5eg==","YWJjY2VsaW5hLnNpeHl6"];
    const blacklist = blacklistEncoded.map(decode);
    const isBlacklisted = blacklist.some(name => $("#topmenu span:contains('@mdpi.com')").text().toLowerCase().includes(name));

    if (isBlacklisted) {
        $(`<li><a style='color:red' onclick='alert(\"Access denied.\");'>!</a></li>`).insertAfter($("#topmenu>ul>li>a[href='https://www.mdpi.com/about']").parent())
        return false;
    }
    else if ((Date.now() - date_v) / 86400000 > 75) {
        $(`<li><a style='color:pink' onclick='alert(\"Please update.\");'>!!! Outdated !!!</a></li>`).insertAfter($("#topmenu>ul>li>a[href='https://www.mdpi.com/about']").parent())
        return false;
    }
    else {
        if (GM_getValue('skWorkLogin', null) === null) {
            ['skWorkLoginUntil', 'skWorkLoginRun', 'skWorkLoginStatus_microsoft', 'skWorkLoginStatus__microsoft'].concat(SK_WORK_LOGIN_STATUS_KEYS,
                SK_WORK_LOGIN_SITES.map(site => 'skWorkLoginAutoClose_' + site.id)).forEach(key => GM_deleteValue(key));
            GM_setValue('skWorkLogin', {});
        }
        const loginParams = new URLSearchParams(location.search);
        if (location.hostname === 'www.mdpi.com' && location.pathname === '/' && loginParams.has('susymodifier-login')) { skOpenWorkLoginHub(); return; }
        // Start before unrelated page customizations, so a page layout error cannot interrupt login tracking.
        skWorkLoginHelper();
        if (location.hostname === 'www.mdpi.com' && loginParams.has('sk-work-login')) return;
        $("#topmenu a.show-submit-dialog[href='/user/manuscripts/upload']").replaceWith(`<span class="sk-susy-tool"><a id=susymodifier_config class="topmenu-tab">SusyMod</a></span>`);
        skAddResourceStyle('customCSS');
        $("#susymodifier_config").on("click", function () { GM_config.open() });
        // 记录今天首次访问时间 ☀
        (function () {
            let now = new Date(), todayStr = skLocalDate(now), hour = now.getHours();
            let storedData = GM_getValue("firstVisitData", "");
            if (!(storedData && storedData.startsWith(todayStr + "|"))) {
                if (hour >= 7 && hour < 17) {
                    GM_setValue("firstVisitData", todayStr + "|" + now.toTimeString().slice(0, 5));
                }
            }
        })();
        document.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.key === 'q') {
                e.preventDefault();
                skOpenUrls();
            }
        })
    }

    var S_J, S_S;
    switch (GM_config.get('Journal')) {
        case 'Mathematics': S_J = 154; break;
        case 'Children': S_J = 159; break;
        case 'Risks': S_J = 162; break;
        case 'Geometry': S_J = 599; break;
        case 'Games': S_J = 25; break;
        case 'MCB': S_J = 743; break;
        case 'IJT': S_J = 598; break;
        case 'Telecom': S_J = 276; break;
        case 'Analytics': S_J = 555; break;
        case 'None': S_J = -1; break;
        default: S_J = 154;
    }

    if (GM_config.get('Easy_Journal')) {
        $(`<select id="SusyModifier_Journal_Easy"><option value="555">Analytics</option><option value="25">Games</option><option value="599">Geometry</option><option value="154">Mathematics</option>
                                   <option value="743">MCB</option><option value="162">Risks</option><option value="598">IJT</option><option value="276">Telecom</option><option value="-1">None</option></select>`).insertAfter($("#susymodifier_config"));
        $("#SusyModifier_Journal_Easy").val(S_J).on("change", function () {
            let J_old = S_J, J_new = $(this).find('option:selected').val(); S_J = J_new;
            GM_config.set('Journal', $(this).find('option:selected').text());
            GM_config.save();

            $('a[href*="id]=' + J_old + '"]').each(function () {
                $(this).attr('href', $(this).attr('href').replace('id]=' + J_old, 'id]=' + J_new));
                let link = $(this); //高亮和闪烁效果
                link.css({ 'background-color': 'yellow', 'transition': 'background-color 0.5s ease' });
                link.animate({ opacity: 0.5 }, 500).animate({ opacity: 1 }, 500);
                //取消高亮 setTimeout(function() {link.css('background-color', ''); }, 10000);
            });

            $('select').each(function () {
                let selectedOption = $(this).find('option:selected');
                if (selectedOption.val() == J_old) {
                    unsafeWindow.$(this).val(J_new).trigger("change").trigger("chosen:updated");
                }
            });
        });
    }

    function decode(input) { const decoded = atob(input); return decoded.slice(3, -3); }
    var userNamesEncoded = ["YWJjc3luYS5tdXh5eg==", "YWJjc3VzaWUuaHVhbmd4eXo=", "YWJjaGVsZW5lLmh1eHl6", "YWJjbGlubi5saXh5eg==", "YWJjZGViYnkucGVuZ3h5eg==", "YWJjZ2xhZHlzLmxpeHl6", "YWJjY29ubmVsbHkueWFuZ3h5eg==", "YWJjZWxsZS5jYWl4eXo=", "YWJjaGFpbGV5LnRhbmd4eXo=",
                            "YWJjaW5uYS5odWFuZ3h5eg==", "YWJjY2FzcGVyLnhpZXh5eg==", "YWJjZGFuaWVsLmRhbnh5eg==", "YWJjZWlsZWVuLnpoYW5neHl6", "YWJjZWRlbi54aWF4eXo=", "YWJjc2hlcnlsLnh1eHl6", "YWJjcnVvbmFuLmNoZW54eXo="];
    var userNames = userNamesEncoded.map(decode);

    //susy侧边栏的按钮🔎
    if (window.location.href.indexOf("susy.mdpi.com/") > -1 && GM_config.get('Interface_sidebar') && $('#leftcol').length) {
        try {
            $('#leftcol').addClass('sk-susy-sidebar');
            $("body").append(`<div id='si_search' role='dialog' style='display: none; position: fixed; height: auto; width: 500px; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 101; background-color: #F5F5F5; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            border-radius: 5px; overflow: hidden;'><div id='si_search_header' style='background-color: #616161; color: white; padding: 10px 15px; font-size: 15px; border-top-left-radius: 5px; border-top-right-radius: 5px; cursor: move;'><span>Quick Search</span>
            <button type='button' onclick='document.getElementById("si_search").style.display="none"' style='float: right; border: none; background-color: transparent; color: white; font-size: 20px; cursor: pointer;'>&times;</button></div>
            <div style='padding: 20px;'> <form class='insertform' method='get' action='/special_issue_pending/list/search' target='_blank'><input type='text' name='show_all' value='my_journals' style='display:none;'>SI Title: <input type='text' name='form[si_name]'
            style='display:inline-block; width:65%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;'><input type='submit' class='submit' value='SI Search' style='background-color: #616161; color: white; padding: 8px 16px; border: none; border-radius: 4px;
            cursor: pointer;'></form><hr style='border: none; border-top: 1px solid #ccc; margin: 15px 0;'><form class='insertform' method='get' action='/user/ebm-new/management/all/my_journals' target='_blank'>Name: <input type='text' id='form_name2' name='form[name]'
            style='display:inline-block; width:65%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;'><br>Email: <input type='email' name='form[email]' style='display:inline-block; width:65%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 8px;'>
            <input type='submit' class='submit' value='EBM Search' style='background-color: #616161; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;'></form><hr style='border: none; border-top: 1px solid #ccc; margin: 15px 0;'>
            <form class='insertform' method='get' action='/user/conference/list' target='_blank'>Conference: <input type='text' name='form[conference_name]' style='display:inline-block; width:65%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;'> <input
            type='submit' class='submit' value='Search' style='background-color: #616161; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;'></form></div></div>`);
            skMakeDraggable(document.getElementById("si_search"), document.getElementById("si_search_header"));

            S_S = -1;
            if (S_J == 154) {
                switch (GM_config.get('Interface_SME')) {
                    case 'A: Algebra and Logic': S_S = 915; break;
                    case 'B: Geometry and Topology': S_S = 2629; break;
                    case 'C: Mathematical Analysis': S_S = 2630; break;
                    case 'C1: Difference and Differential Equations': S_S = 894; break;
                    case 'C2: Dynamical Systems': S_S = 891; break;
                    case 'C3: Real Analysis': S_S = 2631; break;
                    case 'C4: Complex Analysis': S_S = 2632; break;
                    case 'D: Statistics and Operations Research': S_S = 2633; break;
                    case 'D1: Probability and Statistics': S_S = 916; break;
                    case 'D2: Operations Research and Fuzzy Decision Making': S_S = 893; break;
                    case 'E: Applied Mathematics': S_S = 892; break;
                    case 'E1: Mathematics and Computer Science': S_S = 555; break;
                    case 'E2: Control Theory and Mechanics': S_S = 544; break;
                    case 'E3: Mathematical Biology': S_S = 545; break;
                    case 'E4: Mathematical Physics': S_S = 896; break;
                    case 'E5: Financial Mathematics': S_S = 895; break;

                    case 'Algebra, Geometry and Topology': S_S = 915; break;
                    case 'Computational and Applied Mathematics': S_S = 892; break;
                    case 'Difference and Differential Equations': S_S = 894; break;
                    case 'Dynamical Systems': S_S = 891; break;
                    case 'Engineering Mathematics': S_S = 544; break;
                    case 'Financial Mathematics': S_S = 895; break;
                    case 'Functional Interpolation': S_S = 1671; break;
                    case 'Fuzzy Sets, Systems and Decision Making': S_S = 893; break;
                    case 'Mathematical Biology': S_S = 545; break;
                    case 'Mathematical Physics': S_S = 896; break;
                    case 'Mathematics and Computer Science': S_S = 555; break;
                    case 'Network Science': S_S = 557; break;
                    case 'Probability and Statistics': S_S = 916; break;
                }
            }

            if (S_S > 0 && S_J > 0) {
                $(".menu [href='/special_issue_pending/list']").after("<a href='/special_issue_pending/list/online?form[journal_id]=" + S_J + "&form[section_id]=" + S_S + "&show_all=my_journals&sort_field=special_issue_pending.deadline&sort=ASC'>[S]</a>");
                $(".menu [href='/user/assigned/status/ongoing']").after(" <a href='/user/managing/status/submitted?form[journal_id]=" + S_J + "&form[section_id]=" + S_S + "'>[S]</a>");
            }
            if ($("#topmenu span:contains('@mdpi.com')").text() === 'syna.mu@mdpi.com') {
                $(".menu [href='/voucher/application/list']").after("<div style='float:right;'><a href='//skday.com/task/susylog.php' target=_blank>[Log]</a> </div> ");
            }
            if (S_J > 0) {
                $(".menu [href='/user/assigned/status/ongoing']").after("<div style='float:right;'><a href='/user/managing/status/production?form[journal_id]=" + S_J +
                    "&sort_field=submission_manuscript_state.last_action&sort=DESC'>📙</a> <a href='/user/managing/status/published?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.publish_date&sort=DESC'>📗</a></div>");
                $(".menu [href='/user/managing/status/submitted']").after("<div style='float:right;'><a id='owner' href='#'>👑</a></div>");
                $(".menu [href='/voucher/application/list']").attr("href", "/voucher/application/list/my_journal?form[journal_id]=" + S_J);
                $(".menu [href='/user/manage/award_request']").attr("href", "/user/manage/award_request?form[journal_id]=" + S_J);
                $(".menu [href='/user/manage/awards_item']").attr("href", "/user/manage/awards_item?form[journal_id]=" + S_J);
                $(".menu [href='/si/proposal/list']").attr("href", "/si/proposal/list?form[journal_id]=" + S_J);
                $(".menu [href='/list/list_volunteer_reviewers']").attr("href", "/list/list_volunteer_reviewers?form[journal_id]=" + S_J);
                $(".menu [href='/topic/proposal/list']").attr("href", "/topic/proposal/list?form[journal_id]=" + S_J);
                $(".menu [href='/user/conference/list']").attr("href", "/user/conference/list?form[subject_id]=4");
                $(".menu [href='/user/manuscript/list/owner']").attr("href", '/user/manuscript/list/owner/my_journal');
                $(".menu [href='/user/manuscript/special_approval_list']").attr("href", '/user/manuscript/special_approval_list/my_journal');
                $(".menu [href='/user/issues/list']").after(" <a href='/user/issues/list/progress?form[journal_id]=" + S_J + "'>[J]</a> <a href='/user/public_forum/list?form[journal_id]=" + S_J + "'>[P]</a>");
                $(".menu [href='/publisher/manuscripts']").text("Check Published").after(" <a href='/publisher/manuscripts?form[journal_id]=" + S_J + "'>[J1]</a> <a href='/publisher/manuscripts/unchecked?form[journal_id]=" + S_J + "'>[J2]</a>");
            }
            $(".menu [href='/user/myprofile']").after(`<div style='float:right;'><a href='//mrs.mdpi.com/login_check_ajax#statistics' target=_blank title='MRS'><img src='${icon_mrs}' alt='MRS' width='16' height='16'></a></div> `);
            $(".menu [href='/special_issue_pending/list']").after(" <a href='/special_issue_pending/list?&sort_field=special_issue_pending.date_update&sort=DESC&page_limit=100'>Special Issues</a> <a href='/user/sme/status/submitted'>📝</a> ");
            $(".menu [href='/special_issue_pending/list']").text("Manage").attr("href", "/special_issue_pending/list/online?sort_field=special_issue_pending.publish_date&sort=DESC&page_limit=100")
            $(".menu [href='/submission/topic/list']").after(" <a href='/user/topic/status/submitted'>📝</a>");
            $(".menu [href='/submission/topic/list']").attr("href", "/submission/topic/list/online");
            $(".menu [href='/user/manuscript/approval/manage']").attr("href", "/user/manuscript/special_approval_list/my_journal");
            $(".menu [href='/planned_paper/my/list']").after("<div style='float:right;'><a href='/planned_paper/my/list?form[submission_topic_id]=-1&form[special_issue_id]=-1'>🗞️</a></div>");
            $(".menu [href='/user/ebm-new/management']").after(`<div style='float:right;'><a onclick='$("#si_search").toggle();'>🔎</a> </div> `);

            $(".menu [href='/manuscript/quality/check/list']").after(`<div style='float:right;'><a id='sf_b'><img src='${icon_webs}'></a></div>`); $("#sf_b").on("click", skOpenUrls)

            $(".menu [href='/user/managing/status/submitted']").attr("href", "/user/managing/status/submitted?form[journal_id]=" + S_J);
            $(".menu [href='/manuscript/quality/check/list']").attr("href", '/manuscript/quality/check/list?form[journal_id]=' + S_J);
            $("#owner").click(function () {
                let p = $("a[href='/user/super/status/ongoing']").length ? "super" : "managing";
                $.getJSON("/user/ajax/search_manuscript_owner?term=" + $("#topmenu span:contains('@mdpi.com')").text(), d => { location.href = `/user/${p}/status/submitted?form[owner_id][]=${d[0].value}`; });
            });
            if (GM_config.get('Assign_Assistant')) { //派稿助手
                $(".menu [href*='/list/list_volunteer_reviewers']").after(`<div style='float:right;'><a id='sk_susie'><img src='${icon_users}'></a></div>`); $("#sk_susie").on("click", skAddReviewers);
                document.addEventListener('keydown', function (e) { if (e.ctrlKey && e.key === 'e') { e.preventDefault(); skAddReviewers(); $("#add_susie_t").val(''); } });
                document.addEventListener('keydown', function (e) { if (e.ctrlKey && e.key === '3') { e.preventDefault(); skAddReviewers(); } });
            }

            if (GM_config.get('Maths_J')) {
                $('.submit.show-user-info-btn.user-overview').on("click", function () {
                    waitForKeyElements('.get-unsubscribe-link-btn', function () {
                        $("a:contains('Edit Reviewer')").parent().find('td').each(function () {
                            let ranking = skGetUniv($(this).text().trim());
                            if (ranking.color) {
                                skAddResourceStyle('tooltipsterCSS', 'tooltipsterNoirCSS', 'tooltipster-style');
                                $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                    .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                            }
                        });
                    }, true)
                });
            }
        } catch (error) { }
    }

    //SI和Topic Manuscripts整合
    if (window.location.href.indexOf(".mdpi.com/user/sme/status/") > -1 && GM_config.get('Interface_combine')) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href.replace('sme/status', 'topic/status'),
            onload: function (responseDetails) {
                let parser = new DOMParser();
                let responseDoc = parser.parseFromString(responseDetails.responseText.replace(/\/user\/topic\/status/g, '/user/sme/status'), "text/html").getElementById('manuscripts-list');
                $("#manuscripts-list").after(responseDoc);
            }
        });
    }

    //Manuscript Page 侧边栏紧凑
    if (window.location.href.indexOf(".mdpi.com/") > -1 && window.location.href.indexOf("susy") > -1 && GM_config.get('Manuscriptnote') == true) {
        try {
            waitForKeyElements(".manuscript-note-box", skSidebarSize);
        } catch (error) { }
    }

    //Scholar✏️ + Quick
    if (window.location.href.indexOf("/invite/guest_editor") > -1) {
        try {
            skMyAccountOnly();
            unsafeWindow.$(document.getElementById('emailTemplates')).append('<option value>*Guest Editor - SI Mentor Program</option>').trigger("chosen:updated").on("change", function () {
                if ($("#emailTemplates option:selected").text() == "*Guest Editor - SI Mentor Program") {
                    $.ajax({
                        url: $("#emailTemplates").attr("data-url"), dataType: "json", type: "post", async: "true", data: { id: "269", placeholders: $("#placeholders").val() }, success: function (data) {
                            let SI_mentor_body = data.body.replace(
                                /(Dear .*,)[\s\S]*tentative title of (.*) for the journal (.*), (.*)\)[\s\S]*(https:\/\/susy.mdpi.com\/guest_editor\/invitation\/process.*)[\s\S]*egards,/, "$1\n\nWe are pleased to invite you to participate in the Special Issue Mentor "
                                + "Program on $2, offered by the open access journal $3).\n$4/announcements/5184\n\nThis program provides early career researchers, such as postdocs and new faculty, the opportunity to propose innovative ideas for new Special Issues, with "
                                + "the guidance of experienced professors from your institution. We believe this is a valuable opportunity for you to demonstrate your expertise in your field and make a meaningful contribution to the scientific community.\n\nAs a guest "
                                + "editor, you will be responsible for:\n• Preparing the Special Issue's title, aim and scope, summary, and keywords;\n• Assisting in the invitation of feature papers;\n• Making pre-check and final decisions on the manuscripts.\n\nAs a "
                                + "guest editor, you will also enjoy the following benefits:\n• Invitations for up to 10 leading specialists or senior experts from your university or other institutes in your country to submit papers with fee waivers or discounts (subject "
                                + "to approval from the editorial office);\n• Promotion of your expertise in your field;\n• Promotion of your latest research outputs through our marketing channels;\n• The possibility of receiving a travel grant to attend relevant "
                                + "conferences;\n• Certificates for mentors and early career researchers.\n\nIf more than 10 papers are published in the Special Issue, the entire issue may be published in book format and sent to you. Other editorial duties will be fully "
                                + "handled by the editorial office.\n\nWe believe that this is a truly exciting opportunity for you to engage in editorial services and make scientific contributions at the highest level. If you are interested in participating in this "
                                + "program, please click the following link to accept or decline our request:\n$5\n\nIf you have any questions or would like further details, please do not hesitate to contact us. We look forward to your response and hope that you will "
                                + "join us in this opportunity.\n\nKind regards,");
                            let SI_mentor_subject = data.subject.replace("be the Guest Editor of the Special Issue", "Participate in the Special Issue Mentor Program");
                            $("#mailBody").val(SI_mentor_body); $("#mailSubject").val(SI_mentor_subject);
                        }
                    });
                }
            })

            $('#mailSubject').parent().after(`&nbsp;<a onclick="document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(/, entitled.*?, in our/g, ' in our').replace(/Please click [\\s\\S]*?https.*\\n\\n/g, '');">🖇️</a>`);
            $('#mailSubject').parent().after(`<a onclick="document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(/• A waiver and discount.*?\\n/g, '').replace('benefit from:\\n• Promoting', 'benefit from:\\n`
                                             + `• Invitation for up to 10 leading specialists or senior experts from the United States to submit papers with fee waivers or discounts. These benefits are subject to approval from the editorial office.\\n• Promoting');">🇺🇸</a>`);
            if (GM_config.get('GE_TemplateID') == "Guest Editor - Invite with Benefits and Planned Papers") {
                $('#mailSubject').parent().after(`<a onclick="document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(/We will gladly waive .+? from the Guest Editor. /, '');">[No Discount]</a>&nbsp;`);
            }

            $("#emailTemplates > option:contains('" + GM_config.get('GE_TemplateID') + "')").prop('selected', true);
            unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");
            function init() {
                let t1 = skStringToRegex(GM_config.get('GE_TemplateS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('GE_TemplateS2'))));
                let t2 = skStringToRegex(GM_config.get('GE_TemplateB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('GE_TemplateB2'))));
                if (window.location.search == "?Q") { setTimeout(function () { $("#sendingEmail").trigger("click") }, 500); }
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init);
            $('html, body').scrollTop($('#emailTemplates_chosen').offset().top);
        } catch (error) { }
    }

    //GE Reminder✏️ + Quick
    if (window.location.href.indexOf("/remind/guest_editor") > -1) {
        try {
            skMyAccountOnly();
            $("#emailTemplates > option:contains('" + GM_config.get('GE_ReminderID') + "')").prop('selected', true);
            unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");
            function init() {
                let t1 = skStringToRegex(GM_config.get('GE_ReminderS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('GE_ReminderS2'))));
                let t2 = skStringToRegex(GM_config.get('GE_ReminderB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('GE_ReminderB2'))));
                if (window.location.search == "?Q") { setTimeout(function () { $("#sendingEmail").trigger("click") }, 500); }
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init);

            $('#mailSubject').parent().after(`<a id="Awaiting"><img src="${icon_pencil}"></a>`);
            $('#Awaiting').on("click", function () { let p = GM_config.get('GE_ReminderPrefix'); if ($('#mailSubject').val().indexOf(p.trim()) == -1) { $('#mailSubject').val(p + $('#mailSubject').val()) } });
            $('#Awaiting').on("mousedown", function (e) { if (e.button === 1) { e.preventDefault(); let v = prompt('Enter subject prefix:', GM_config.get('GE_ReminderPrefix')); if (v !== null) { GM_config.set('GE_ReminderPrefix', v); GM_config.save(); } } });
            $('html, body').scrollTop($('#emailTemplates_chosen').offset().top);
        } catch (error) { }
    }

    //GE Cancel🗑️ + Quick
    if (window.location.href.indexOf("/uninvite/guest_editor") > -1) {
        try {
            skMyAccountOnly();
            let geCancel = GM_config.get('GE_CancelID');
            let $cancelOpt = $("#emailTemplates > option").filter((_, el) => $(el).text().trim() === geCancel.trim());
            ($cancelOpt.length ? $cancelOpt : $("#emailTemplates > option:contains('" + geCancel + "')").first()).prop('selected', true);
            unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");
            function init() {
                let t1 = skStringToRegex(GM_config.get('GE_CancelS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('GE_CancelS2'))));
                let t2 = skStringToRegex(GM_config.get('GE_CancelB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('GE_CancelB2'))));
                if (window.location.search == "?Q") { setTimeout(function () { $("#sendingEmail").trigger("click") }, 500); }
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init);

            $('#mailSubject').parent().after(`<a id="sk_discount">[Special Discount]</a>`);
            $('#sk_discount').on("click", function () { $("#mailBody").val($("#mailBody").val().replace("the publishing fees waived", "a special discount").replace("Feature Paper, if", "Feature Paper with a special discount, if")) });
            $('#mailBody').parent().after(`<a id="sk_nodiscount">[No Discount]</a>`);
            $('#sk_nodiscount').on("click", function () { $("#mailBody").val($("#mailBody").val().replace("once this Special Issue is online, w","your publication record demonstrates your expertise in this subject area. W").replace(" with the publishing fees waived", "")
                                                                             .replace(" with a special discount", "")) });
            $('#mailBcc').parent().after(`<a id="sk_fullwaiver" style="align-self: center;">[Full Fee Waiver]</a>`);
            $('#sk_fullwaiver').on("click", function () { $("#mailBody").val($("#mailBody").val().replace("a special discount", "the publishing fees waived").replace("Feature Paper, if", "Feature Paper with the publishing fees waived, if")) });
            $('html, body').scrollTop($('#emailTemplates_chosen').offset().top);
        } catch (error) { }
    }

    //EB invitation✏️
    if (window.location.href.indexOf("present_editor_ebm/invite_email") > -1) {
        try {
            if ($('#emailTemplates option').length > 1) {
                $("#emailTemplates > option:contains('" + GM_config.get('EB_TemplateID') + "')").prop('selected', true);
                document.getElementById('emailTemplates').dispatchEvent(new CustomEvent('change'));
            }
            function init() {
                let t1 = skStringToRegex(GM_config.get('EB_TemplateS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('EB_TemplateS2'))));
                let t2 = skStringToRegex(GM_config.get('EB_TemplateB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('EB_TemplateB2'))));
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init);
            $('#mailSubject').parent().after('<a id="No_Discount">[No Discount]</a>');
            $('#No_Discount').on("click", function () {
                $('#mailBody').val($('#mailBody').val().replace(/you will have the opportunity to publish one paper free of charge in .* per year, and can also publish extra papers with special discounts.\n\n/, '').replace(
                    'Additionally, we would like to invite you to publish one paper per year—this will be free of charge once accepted for publication. ', '').replace(/\nPlease click on the following link .*?\nhttp.*?\n/g, ''))
            });
            $('html, body').scrollTop($('#emailTemplates').offset().top);
        } catch (error) { }
    }

    //EB Reminder✏️
    if (window.location.href.indexOf("present_editor_ebm/remind_email") > -1) {
        try {
            let detail = GM_config.get('EB_ReminderID').match(/\(([^)]+)\)/);
            if (detail) {
                let a = $("#emailTemplates > option:contains('" + detail[1] + "')").prop('selected', true);
                if (a.length == 0) { $("#emailTemplates > option:contains('Responsibilities and Benefits')").prop('selected', true) }
                document.getElementById('emailTemplates').dispatchEvent(new CustomEvent('change'));
            }


            function init() {
                let t1 = skStringToRegex(GM_config.get('EB_ReminderS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('EB_ReminderS2'))));
                let t2 = skStringToRegex(GM_config.get('EB_ReminderB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('EB_ReminderB2'))));
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init);
            $('html, body').scrollTop($('#emailTemplates').offset().top);
        } catch (error) { }
    }

    //list_volunteer_reviewers
    if (window.location.href.indexOf("/list_volunteer_reviewers/all") > -1) {
        try {
            location.href = $("a[href*='/volunteer_reviewer_info/view/']").attr("href").replace("/view/", "/update/")
        } catch (error) { }
    }

    //GE Monthly Report
    if (window.location.href.indexOf("/email/acknowledge/") > -1) {
        try {
            skMyAccountOnly();
            $('div.cell.small-12.medium-6.large-2:contains("Online Date")').next().css({ "background-color": "yellow" });

            if (window.location.href.indexOf("guest_editor") > -1) {
                $("#emailTemplates > option:contains('" + GM_config.get('Report_TemplateID') + "')").prop('selected', true);
                unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");
            } else {
                $("#emailTemplates > option:contains('Custom')").prop('selected', true);
                unsafeWindow.$(document.getElementById('emailTemplates')).trigger("change");
            }

            let result = "";
            if (GM_config.get('Report_TemplateB2').indexOf("%pp_list%") > -1) {
                let SI_Topic_Link = $("#special_issue_id").attr("data-special-issue-id") ? "/special_issue/process/" + $("#special_issue_id").attr("data-special-issue-id") : "/submission/topic/view/" + $("#submission_topic_id").attr("data-topic-id");
                let counter = 0, xhr = new XMLHttpRequest(); xhr.open('GET', SI_Topic_Link, false); xhr.send();
                let $form = $($.parseHTML(xhr.responseText)).find('#add-planned-paper-section, #single-planned-paper-form');
                let emailIndex = 1, statusIndex = 2, sourceIndex = 3, discountIndex = 4, agreedDateIndex = 6;
                $form.find('table').each(function () {
                    $(this).find('thead th').each(function (index) {
                        let text = $(this).text().trim();
                        if (text.indexOf("Email") > -1) { emailIndex = index };
                        if (text == "Status") { statusIndex = index };
                        if (text == "Source") { sourceIndex = index };
                        if (text == "Discount") { discountIndex = index };
                        if (text == "Agreed Date" || text == "Decision Date") { agreedDateIndex = index };
                    });

                    $(this).find('tbody tr').each(function () {
                        let $td = $(this).find('td'), email = $td.eq(emailIndex).text().replace(/\s\*/g, "").trim(), status = $td.eq(statusIndex).text().trim(), invitedByGE = $td.eq(sourceIndex).text().trim(),
                            discountText = $td.eq(discountIndex).text().trim(), agreedDate = new Date($td.eq(agreedDateIndex).text().trim());
                        if (status === "Title Provided" || status === "Agreed" || status === "Approved") {
                            counter++;
                            let discountRatio = 0;
                            if (discountText.includes('%')) {
                                discountRatio = parseFloat(discountText.replace(/%/g, '')) / 100;
                            } else {
                                let discount = parseFloat(discountText.replace(/ /g, '').replace(/CHF/g, ''));
                                switch (agreedDate.getFullYear()) {
                                    case 2021: discountRatio = discount / 1600; break;
                                    case 2022: discountRatio = discount / 1800; break;
                                    case 2023: if (agreedDate.getMonth() < 6) { discountRatio = discount / 2100 } else { discountRatio = discount / 2600 }; break;
                                    default: discountRatio = discount / 2600;
                                }
                            }
                            if (invitedByGE.indexOf("by GE") > -1 && discountRatio > 0) {
                                result += `(${counter}) ${email} (${(discountRatio * 100).toFixed(0)}% discount)\n`;
                            } else {
                                result += `(${counter}) ${email}\n`;
                            }
                        }
                    });
                })
            }

            function init() {
                let GetNoteUrl;
                if (window.location.href.indexOf("guest_editor") > -1) {
                    GetNoteUrl = "/user/notes_of_special_issue/" + $("#special_issue_id").attr("data-special-issue-id");
                    let t1 = skStringToRegex(GM_config.get('Report_TemplateS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('Report_TemplateS2'))));
                    let t2 = skStringToRegex(GM_config.get('Report_TemplateB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('Report_TemplateB2'))));
                    $("#mailBody").val($("#mailBody").val().replace("%pp_list%", result.trim()));
                } else {
                    GetNoteUrl = "/submission/topic/show_notes/" + $("#submission_topic_id").attr("data-topic-id");
                    let t1 = skStringToRegex(GM_config.get('Topic_TemplateS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('Topic_TemplateS2'))));
                    let t2 = skStringToRegex(GM_config.get('Topic_TemplateB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('Topic_TemplateB2'))));
                    $("#mailBody").val($("#mailBody").val().replace("%pp_list%", result.trim()));
                }
                $("#maincol").after('<div id="special_issue_note_offcanvas" class="hide-note-offcanvas"></div>');
                $.get(GetNoteUrl, function (res) {
                    $('#special_issue_note_offcanvas').html(res.note_html); $('#special_issue_note_offcanvas').removeClass('hide-note-offcanvas');
                    $('#close-offcanvas-note').parent().on("click", function () { $("#special_issue_note_offcanvas").toggleClass("hide-note-offcanvas"); });
                    let OtherEmails = res.note_html.match(/GE Other Emails:(.*?)[\n<]/), Appellation = res.note_html.match(/GEs:(.*?)[\n<]/);
                    if (OtherEmails) { $("#mailTo").val(OtherEmails[1]); $("#mailTo").trigger("focus"); }
                    if (Appellation) { $("#mailBody").val($("#mailBody").val().replace(/(?<=^Dear ).*/, Appellation[1].trim() + ",")) }
                    $("#mailBody").prop('selectionStart', 0).prop('selectionEnd', 0).trigger("focus"); $("#mailTo").trigger("focus");
                    waitForKeyElements(".special-issue-note-box", skSidebarSize);
                });
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init);

            $('#mailBody').parent().after(`<div style="flex-direction: column"><div style="flex-direction: row"><a id="undoBtn"><svg width="24" height="24"><path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 01-1-1.8c1.1-.6 1.8-2.7
        1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 11-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1 1 0 011.4 1.4L6.4 8z" fill-rule="nonzero"></path></svg></a> <a id="redoBtn"><svg width="24" height="24"><path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 11-1
        1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 111.4-1.4l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4-1.4l3.3-3.3z" fill-rule="nonzero"></path></svg></a></div><div style="flex-direction: column" id="insert"><p><a id="cfpapproval" style="display:none">
        [CfP Approval]</a></p><p><a id="cfpremind" style="display:none">[CfP Remind]</a></p><p><a id="cfpsent">[CfP Sent]</a></p><p><a id="personalcfp">[Personal CfP]</a></p><p><a id="book">[SI Book]</a></p><p><a id="certificate">[Certificate]</a></p><p><a id="conference">
        [Conference]</a></p><p><a id="deadline">[Deadline Ext.]</a></p><p><a id="deadline2">[Deadline Ext. 2]</a></p><p><a id="LinkedIn">[LinkedIn]</a></p><p><a id="review">[Review Article]</a></p><p><a id="meeting">[Online Meeting]</a></p></div></div>`);
            let undoStack = [], redoStack = [], insert_text = "";
            $('#insert a').on("click", function () {
                switch ($(this).attr("id")) {
                    case 'cfpapproval':insert_text=`\n3. Approval of Call for Paper List\n\nI'd like to inquire about the appropriateness of using the attached list of email addresses to send out calls for papers for our special issue. These addresses were collected from our `
                        +`database using an AI system, and I wanted to confirm that they are suitable for receiving calls for papers for our special issue. If you believe that any of the addresses on the list are not suitable, please let me know and I will remove them from `
                        +`the list. If you think that all of the addresses are suitable, please let me know as well.\n\nOnce I have received your feedback, our editorial office will send out paper invitations to the potential authors on the list.\n\nThank you for your `
                        +`support. I look forward to hearing from you again.\n`; $("#addnote").val("检查CfP list"); break;
                    case 'cfpremind':insert_text=`\n3. Reminder:Call for Paper List Approval\n\nLast month, we invited you to check the mailing list for your Special Issue. I would like to kindly inquire if you have had a chance to review the list. If so, please let me know `
                        +`if you approve of the invitations so that we can proceed with sending them out. Your prompt response will be greatly appreciated.\n`; $("#addnote").val("提醒CfP list"); break;
                    case 'cfpsent':insert_text=`\n3. CfP Sent\n\nThe Editorial Office has finished sending the 'call for paper' (CfP) invitations to all the potential authors on the mailing list, and we have not received a positive response yet. We will send a reminder a few `
                        +`months later.\n`; break;
                    case 'personalcfp':insert_text=`\n3. Manuscript Submission Invitations\n\nBased on our experience with previous Special Issues, we have found that guest editors personally sending invitations can be more effective. In this regard, we would like to request `
                        +`your assistance in providing us with a list of 20-30 potential authors, including their names, affiliations, and email addresses, to whom you can send feature paper invitations with discounts. We recommend that you include authors who will `
                        +`significantly enhance the Special Issue.\n\nWe would like to remind you that our Editorial Office is responsible for administering the discounts. Therefore, we kindly request that you discuss the invitees with us before sending out the invitations.`
                        +`\n\nIf you are unable to provide us with a list, we would be happy if you could send invitations to scholars on our list. If you are interested, we can prepare a mailing list and email template that you can use to send the invitations.\n\n`
                        +`Thank you for your valuable time and consideration. We look forward to hearing back from you.\n`; $("#addnote").val("请GE发邀请"); break;
                    case 'book':insert_text=`\nIf eight or more papers are published in this Special Issue, we can make a Special Issue book and send a hard copy to each Guest Editor (free of charge). Special Issue book example:\nhttps://www.mdpi.com/books/pdfview/book/3008\n`;
                        $("#addnote").val("告知做书条件"); break;
                    case 'certificate':insert_text=`\n3. Editor Certificate\n\nOn behalf of the Editor-in-Chief, we would like to thank you for your editorial work, and we are glad to issue you the editor certificate (see attached). \n\nWe look forward to a fruitful `
                        +`collaboration.\n`; $("#addnote").val("发证书"); window.open("https://susy.mdpi.com/user/list/editors?form[email]=" + $("#mailTo").attr("value").match(/<([^>]+)>/)[1] + "&form[_token]=INShBxf_zyiQ6XpSwRC7dFyTvOYTpaIsun9weGzmiPA"); break;
                    case 'conference':insert_text=`\n3. Conferences\n\nI would like to express my sincere appreciation for your efforts in promoting our Special Issue. To further increase its visibility and support your promotional activities, I would like to inquire if you `
                        +`plan to attend or organize any international conferences or workshops in the next months. We are pleased to offer you a travel grant of about 200 CHF to support attendance at these events.\n\nWe kindly ask for your support in promoting our Special `
                        +`Issue in the following ways:\n\n(1) Including one or two slides about our Special Issue in your presentation;\n(2) Attracting planned papers for the Special Issue or encouraging your colleagues and friends to submit their work;\n(3) Distributing `
                        +`flyers about the journal or the Special Issue;\n(4) Promoting the journal during the conference via social media platforms, such as LinkedIn and Twitter.\n\nWe will be more than happy to supply you with promotional materials in advance. Please let `
                        +`us know by writing to me at least eight weeks prior to the event, so that we have sufficient time to prepare and send you the materials.\n\nIf you are interested in this proposal, please send us the conference information in advance, including the `
                        +`estimated number of participants. We will submit the application to our publisher and get back to you.\n\nThank you for considering this opportunity to promote our journal and Special Issue at your upcoming events. We appreciate your continued `
                        +`support.\n`; $("#addnote").val("询问参会"); break;
                    case 'deadline':insert_text=`\n3. Submission Deadline\n\nThe submission deadline for our Special Issue is currently set for XXXXXXXXX, but there are still several planned papers that have not been submitted yet. Although we have published a few papers `
                        +`already, we would like to include at least ten papers to create a Special Issue book, which we plan to send as a hard copy to our guest editors.\n\nWith that in mind, I would like to suggest that we extend the submission deadline, for example, to `
                        +`October or XXXXXXXXX, and send another round of "call for paper" invitations. This will give authors more time to complete their papers and potentially attract additional submissions that would greatly enhance the Special Issue.\n\nWhat are your `
                        +`thoughts on this proposal? I would appreciate it if you could let me know if you agree with this suggestion.\n`; $("#addnote").val("询问延期"); break;
                    case 'deadline2':insert_text=`\n3. Submission Deadline\n\nAs you may recall, the submission deadline is currently set for XXXXXXX, but there are still several planned papers that have not been submitted. [Additionally, I noticed that you had expressed `
                        +`your interest in submitting your own manuscript to this Special Issue, but it appears that it has not been finished yet.]\n\nGiven these circumstances, I would like to inquire if you think we should extend the submission deadline again. As you know, `
                        +`we have published XXXX papers, and the Special Issue has already achieved significant success. We have seen a growing interest from authors and readers alike, with many regular submissions in this research field recently. Therefore, it would be both `
                        +`reasonable and promising to continue running this Special Issue in the coming months, with a goal of publishing ten or more papers.\n\nI value your opinion on this matter, and I would appreciate it if you could let me know your thoughts. Thank you `
                        +`for your time and consideration. I look forward to hearing back from you.\n`; $("#addnote").val("询问二次延期"); break;
                    case 'LinkedIn':insert_text=`\n3. Promotion of the Special Issue\n\nI just wanted to let you know that the Special Issue is now being promoted on LinkedIn at the following link:\nhttps://www.linkedin.com/xxx\n\nIf you have a LinkedIn account, I would `
                        +`greatly appreciate it if you could share the promotion on your profile. This will help to increase visibility for the special issue and potentially reach a wider audience.\n\nThank you in advance for your assistance.\n`;
                        $("#addnote").val("社交网站推广"); break;
                    case 'review':insert_text=`\n3. Invitation to Submit a Review Paper\n\nWe are pleased to invite you to submit a review paper for this Special Issue. A review paper is an article that summarizes and evaluates the current state of knowledge on a specific `
                        +`topic. We believe that your expertise and experience in these fields would make a valuable contribution to our Special Issue. Furthermore, we will waive all the fees associated with the review paper publication, which we hope will encourage you to `
                        +`participate in this opportunity.\n`; $("#addnote").val("邀请review"); break;
                    case 'meeting':insert_text=`\n3. Online Meeting\n\nWould you be interested in a 30-minute online meeting with us? We can introduce our journal, the editorial process, details about our Special Issue, the submission platform functionalities, `
                        +`article processing charges, or any other topics you wish to explore. If you are interested, please let me know a convenient date and time for you. I'm currently in China and available on working hours.\n`;
                        $("#addnote").val("询问Online Meeting"); break;
                }
                let selectionStart = $('#mailBody')[0].selectionStart, selectionEnd = $('#mailBody')[0].selectionEnd, text = $('#mailBody').val(); let newText = text.substring(0, selectionStart) + insert_text + text.substring(selectionEnd);
                undoStack.push(text); redoStack = []; $('#mailBody').val(newText);
                $('#mailBody')[0].setSelectionRange(selectionStart + insert_text.length, selectionStart + insert_text.length);
            });

            $('#undoBtn').on("click", function () {
                if (undoStack.length > 0) {
                    redoStack.push($('#mailBody').val()); $('#mailBody').val(undoStack.pop());
                    $('#mailBody')[0].setSelectionRange(undoStack[undoStack.length - 1].length, undoStack[undoStack.length - 1].length); document.execCommand('undo');
                }
            });
            $('#redoBtn').on("click", function () {
                if (redoStack.length > 0) {
                    undoStack.push($('#mailBody').val()); $('#mailBody').val(redoStack.pop());
                    $('#mailBody')[0].setSelectionRange(undoStack[undoStack.length - 1].length, undoStack[undoStack.length - 1].length); document.execCommand('redo');
                }
            });

            $("#addAttachment").after(' ', $('<input type="text" id="addnote" style="width: 150px; display:inline-block">').val(GM_config.get('Report_Notes')));
            $("#sendingCustomEmail, #sendingEmail").on("click", function () {
                if ($("#addnote").val().length) {
                    $("div.click-to-edit-manuscript").last().trigger("click");
                    let $textarea = $("div.manuscript-input-note-group textarea").last();
                    let mm = (new Date().getMonth() + 1).toString().padStart(2, "0"), dd = new Date().getDate().toString().padStart(2, "0"), yy = new Date().getFullYear().toString().slice(-2);
                    let today = yy + '-' + mm + '-' + dd;
                    $textarea.val($textarea.val().replace(/(E contact:\s*)/, "$1" + today + " " + $("#addnote").val() + " / "));

                    let isCustom = $(this).attr("id") === "sendingCustomEmail";
                    let buttonSelector = isCustom ? "button[data-url*='/user/edit/si_morph_notes/']" : "button[data-url*='/submission/topic/update_followup_notes/']";
                    waitForKeyElements(buttonSelector, function () { $(buttonSelector).last().trigger("click") });
                }
            });
        } catch (error) { }
    }

    //文章处理页面[Voucher]按钮和发送推广信按钮等
    if (window.location.href.indexOf("/process_form/") + window.location.href.indexOf("/production_form/") > -2) {
        try {
            // 标题关键词高亮
            (function highlightTitleKeywords() {
                const titleEl = $("span.article-title, a[title='View the published paper']");
                if (!titleEl.length) return;
                const keywords = skTitleKeywords;
                const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                const regex = new RegExp('(' + escaped.join('|') + ')', 'gi');
                titleEl.each(function () {
                    const html = $(this).html();
                    if (regex.test(html)) {
                        regex.lastIndex = 0;
                        $(this).html(html.replace(regex, '<span style="background-color: yellow; color: red;">$1</span>'));
                    }
                });
            })();

            if (GM_config.get('ManuscriptFunc')) {
                let email = [], name = [];
                let m_id = $("#manuscript_id").parent().text().trim();
                let m_section = $("div.cell.small-12.medium-6.large-2:contains('Section') + div").text().trim();
                let m_journal = $("div .cell.small-12.medium-6.large-2:contains('Journal')").next().text().trim();
                let corresponding = $("b:contains('*')").parent("td").next().last().text().trim();
                let m_si = $("div.cell.small-12.medium-6.large-2:contains('Special Issue') + div").text().trim();

                $("table [title|='Google Scholar']").each(function (index) {
                    name[index] = $(this).parent().prev().text().trim() + " " + $(this).parent().children("b").first().text().trim();
                    email[index] = $(this).parent().next().text().trim();
                    let body = GM_config.get('Template_Paper').replace(/%m_id%/g, () => m_id).replace(/%m_section%/g, () => m_section).replace(/%name%/g, () => name[index]);
                    $(this).before(skIconLink(skMailtoUrl(email[index], '[' + m_journal + '] (ISSN 2227-7390) Promote Your Published Papers', body), icon_mail), ' ');
                });

                let linkedinBody = GM_config.get('Template_Linkedin').replace(/%m_id%/g, () => m_id).replace(/%m_section%/g, () => m_section);
                $("[title|='Send email to authors']").before(skIconLink(skMailtoUrl(email, '[' + m_journal + '] Manuscript ID: ' + m_id, linkedinBody),
                    'https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a', { id: 'linkedin' }, { alt: '[LinkedIn]' }), ' ');
                if (window.location.href.indexOf("?linkedin") > -1) { $("#linkedin")[0].trigger("click"); history.back(); }
                $("[title='Google']").each(function () {
                    $(this).before(skIconLink('https://www.researchgate.net/search.Search.html?type=publication&query=' + encodeURIComponent($(this).prev().text()),
                        icon_researchgate, { title: 'Researchgate', target: '_blank', rel: 'noopener noreferrer' }, { style: 'vertical-align: middle;' }), ' ');
                });
                $("[class|='margin-horizontal-1']").after(`<form id='vf' class='insertform' method='post' target='_blank' style='display:none;'><input name='form[journal_id]'><input name='form[is_percentage]' value='1'><input name='form[special_issue_id]'>
            <input name='form[emails]'><input name='form[valid_months]' value='12'><input name='form[section_id]'><input name='form[reason]'><input name='form[manuscript_id]'><textarea name='form[note]'></textarea></form>`);
                $("[class|='margin-horizontal-1']").after(`<div id="voucher" style="display:inline-block;"><a style="color:#4b5675;">[Vouchers]</a><div style="position:absolute;background-color: #f1f1f1;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);display: none;">
            <a id="v_invited" reason="Feature paper invited by guest editor" style="display:block;padding: 8px 12px;text-decoration: none;color:black;">Invited by GE</a><a id="v_ge" reason="Paper by guest editor" style
            ="display:block;padding: 8px 12px;text-decoration:none;color:black;">Paper by GE</a><a id="v_ebm" reason="Paper by editorial board member" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">Paper by EBM</a>
            <a id="v_sme" reason="Paper Invited by Journal Editorial Office" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">Invited by SME</a>
            <a id="v_author" reason="Discount Requested by Authors" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">Author Request</a></div></div>`);
                $("#voucher").on("mouseover", function () { $(this).children("div").show() });
                $("#voucher").on("mouseout", function () { $(this).children("div").hide() });
                $('head').append('<style>#voucher a:hover {background-color: #ddd;}</style>');
                if (!m_si) { $("#v_invited, #v_ge").remove() };

                let d_reason = "";
                $("#voucher>div>a").on("click", function () {
                    var invoiceId = $("[data-invoice_id]").attr("data-invoice_id") || $('a[href*="show/invoice"]').attr('href')?.match(/\/invoice\/(\d+)\//)?.[1];
                    if (!invoiceId) {alert("There is no APC form on the page. Please change the manuscript status."); return; };
                    if ($('[title="Planned Paper"]').length === 0) { alert('Please submit the PP information!') };

                    let xhr = new XMLHttpRequest(); xhr.open('GET', "https://susy.mdpi.com/apply/voucher/on_ms_page/" + $("[data-rel]").attr("data-rel") + "/" + invoiceId + "/", false); xhr.send();
                    let searchParams = new URLSearchParams(new URL(decodeURIComponent(xhr.responseURL)).search);
                    switch ($(this).attr("id")) {
                        case 'v_invited':d_reason="The paper invited by GE is now submitted. I would like to apply for a XXX% discount on this paper as we promised before. Hope you may approve.\n\nP.S. No need to send promotion letter. / Promotion letter has been sent.";break;
                        case 'v_sme': d_reason="The paper was invited with a XXX% discount."; break;
                        case 'v_ge': d_reason = "The paper by GE is now submitted. We agreed to grant a XXX% discount on GE's paper. Hope you may approve.\n\nP.S. No need to send promotion letter. / Promotion letter has been sent."; break;
                        case 'v_author': d_reason="The authors asked for a discount."; break;
                        default: d_reason = ""; break;
                    }
                    $("[name='form[journal_id]']").val(searchParams.get("waiverApplyForm[journal_id]"));
                    $("[name='form[section_id]']").val(searchParams.get("waiverApplyForm[section_id]"));
                    $("[name='form[special_issue_id]']").val(searchParams.get("waiverApplyForm[special_issue_id]"))
                    $("[name='form[emails]']").val(corresponding);
                    $("[name='form[manuscript_id]']").val(m_id);
                    $("[name='form[note]']").val(d_reason);
                    $("[name='form[reason]']").val($(this).attr("reason"));
                    $("#vf").attr("action", "/voucher/application/create?waiverApplyForm[types]=" + searchParams.get("waiverApplyForm[types]")).submit();
                });

                const allLastNames = [...new Set($("[title='PubPeer']").map((_, el) => $(el).parent().find('b').first().text().trim()).get().filter(Boolean))];
                $("[title='PubPeer']").each(function () {
                    let $link = $(this), $td = $link.parent();
                    let pubpeer_search = new URLSearchParams(new URL($link.attr("href")).search);
                    let pubpeer_name = pubpeer_search.get("q") || '';
                    $link.attr("href", 'https://pubpeer.com/search?q=' + encodeURIComponent('authors:"' + pubpeer_name + '"'));
                    let firstName = $td.contents().filter(function () { return this.nodeType === 3; }).first().text().trim();
                    let lastName = $td.find('b').first().text().trim();
                    let rowEmail = $td.next().text().trim();
                    let rowAffil = $td.nextAll(':last-child').text().trim();
                    let rowOrcid = ($td.find('a[href*="orcid.org/"]').attr('href') || '').match(/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])/i)?.[1] || '';
                    let coLast = allLastNames.filter(n => n.toLowerCase() !== lastName.toLowerCase()).slice(0, 4).join(',');
                    let scopusHash = new URLSearchParams(Object.entries({ email: rowEmail, affil: rowAffil, orcid: rowOrcid, co: coLast }).filter(([, v]) => v)).toString();
                    $link.before(' ', skIconLink('//www.scopus.com/pages/search/authors?firstName=' + encodeURIComponent(firstName) + '&lastName=' + encodeURIComponent(lastName) + (scopusHash ? '#sk_' + scopusHash : ''),
                        icon_scopus, { title: 'Scopus', target: '_blank', rel: 'noopener noreferrer' }), ' ');
                    $link.after(' ', skIconLink('//retractiondatabase.org/RetractionSearch.aspx?auth%3d' + encodeURIComponent(firstName) + '+' + encodeURIComponent(lastName),
                        icon_retractiondatabase, { title: 'retractiondatabase', target: '_blank', rel: 'noopener noreferrer' }), ' ');
                });

                let hasBeenClicked = false;
                $("[title='PubPeer']").on("click", function (event) {
                    if (!hasBeenClicked) {
                        $('body').append('<div id="overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: transparent; cursor: wait; z-index: 10000;"></div>');
                        event.preventDefault(); hasBeenClicked = true;
                        let $link = $(this);

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://pubpeer.com/",
                            onload: function(response) {
                                let data = response.responseText;
                                let match = data.match(/<meta\s+name=["']csrf-token["']\s+content=["']([^"']+)["']/i);
                                let pubpeertoken = match ? match[1] : "";

                                if (!pubpeertoken) {
                                    alert("pubpeer.com首页无法打开，请检查网络连接或代理");
                                    $('#overlay').remove(); return;
                                }

                                $("[title='PubPeer']").each(function () {
                                    let $link = $(this);
                                    $link.attr("href", $link.attr("href") + '&token=' + encodeURIComponent(pubpeertoken));

                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: $link.attr("href").replace("pubpeer.com/", "pubpeer.com/api/") + '&token=' + encodeURIComponent(pubpeertoken),
                                        onload: function(response) {
                                            try {
                                                let result = JSON.parse(response.responseText);
                                                let pub_num = result.meta.total;
                                                $link.append("[" + pub_num + "]");
                                                if (pub_num > 0) { $link.css('background-color', 'gold'); }
                                            } catch (e) { console.error(e); }
                                        }
                                    });
                                });
                                setTimeout(function () { $('#overlay').remove(); }, 500);
                            },
                            onerror: function() {
                                $('#overlay').remove();
                            }
                        });
                    }
                });

            }

            if (GM_config.get('Assign_Assistant')) { //派稿助手
                if ($("div:contains('The CSRF token is invalid. Please try to resubmit the form')").length > 0) {
                    $("header").append('<div data-animation="drop" class="notify notify-dismissible notify-danger center top"><div class="message">The CSRF token is invalid.</div><button type="button" class="close" data-close="notify" data-animation="drop">×</button></div>')
                }

                if ($("strong.margin-horizontal-1").text().indexOf("decision") > -1) {
                    $.get("/user/assigned/production_form/" + window.location.href.match("process_form/(\\w*)")[1], function (res) {
                        if (res.indexOf("see more at redmine issue ") > -1) { $("legend:contains('Academic Editor Decision')").append(" [Layout Sent]") } else { $("legend:contains('Academic Editor Decision')").append(" <span style='color:yellow'>[Layout NOT Sent]</span>") }
                    });
                }

                // 颜色标记Affiliation
                skAddResourceStyle('tooltipsterCSS', 'tooltipsterNoirCSS', 'tooltipster-style');
                $("table [title|='Google Scholar']").each(function () {
                    let ranking = skGetUniv($(this).parent().nextAll(":last-child").text().trim());
                    if (ranking.color) {
                        let markup = $(this).parent().nextAll(":last-child").children("div");
                        markup.css("background-color", ranking.color);
                        markup.attr("title", ranking.detail).tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                    }
                });

                // 重置拒稿按钮
                $("[title|='Reject / Recommend to other journals']").on('click', function(e){
                    e.preventDefault(); e.stopPropagation();
                    waitForKeyElements(".jconfirm-title:contains('Error')", AddManuscriptSourceErrorbox, true);
                })
            }

            //Always QC 换行
            $('a[data-title="Quality Check"]').on("click", skLineBreakForQC);

            $('h1').each(function () {
                if ($(this).text().includes('403 - Permission denied')) {
                    let summary_link = window.location.href.replace(/.*_form/, "//susy.mdpi.com/manuscript/summary");
                    $(this).before($('<h1>').text('Process Manuscript \u00a0\u00a0|\u00a0\u00a0 Finalize Manuscript \u00a0\u00a0|\u00a0\u00a0 ')
                        .append($('<a>').attr('href', summary_link).text('Manuscript Summary')), '<br>');
                    window.location.href = window.location.href.replace(/.*_form/, "//susy.mdpi.com/manuscript/summary"); return false;
                }
            });
        } catch (error) { }
    }

    //特刊列表免翻页⚙️
    if (window.location.href.indexOf(".mdpi.com/special_issue_pending/list") > -1 && !window.location.href.match(/page=(?!1\b)[0-9]+/)) {
        try {
            skMyAccountOnly();
            if (GM_config.get('SInote')) {
                waitForKeyElements(".special-issue-note-box", function () {
                    skSidebarSize();
                    $("span.note-title:contains('SI Section Notes')").trigger("click");
                })
            }
            if (GM_config.get('SIpages')) {
                let maxpage = 10, totalpage = Math.min(maxpage, parseInt($('li:contains("Next")').first().prev().text())), counter, Placeholder = "";
                for (counter = 2; counter <= Math.min(maxpage, totalpage); counter++) {
                    let i = counter;
                    $('#maincol >>> table').parent().append("<table cellspacing=0 cellpadding=0 id='statustable" + i + "'></table>")
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: $(".pagination.margin-0 a:contains('2')").attr("href").replace(/page=2/gi, "page=" + i),
                        onload: function (response) {
                            var $jQueryObject = $('#maincol >>> table', $.parseHTML(response.responseText));
                            $('#statustable' + i).html($jQueryObject.html());
                        }
                    });
                }
                if (totalpage >= maxpage) { Placeholder += "<br><br>Only List " + maxpage + " Pages.<br><br>" }

                if (S_J > 0) { $("[href='/special_issue_pending/list?show_all=my_journals']").attr('href', "/special_issue_pending/list/online?form[journal_id]=" + S_J + "&show_all=my_journals"); }
            }
        } catch (error) { }
    }

    //特刊页面➕按钮、Note
    if (window.location.href.indexOf(".mdpi.com/submission/topic/view") + window.location.href.indexOf(".mdpi.com/special_issue/process") > -2) {
        try {
            skMyAccountOnly();
            if (window.location.href.indexOf("?pagesection=AddGuestEditor") > -1 && GM_config.get('Hidden_Func')) {
                if ($("#guestNextBtn").length === 0) {
                    $("#form_email").after(`<input id="process-special-issue-guest-editor" type="submit" value="Force Add (Info must be pre-filled)" class="submit is-psme-assessment">`)
                }
            }
            if (GM_config.get('SInote')) {
                let done = false;
                waitForKeyElements(".special-issue-note-box", function () {
                    if (!done) {
                        skSidebarSize();
                        $("span.note-title:contains('SI Section Notes')").trigger("click");
                        $('.fold-note-list').last().before('<button id="qcButton" style="background-color: orange; border: none; color: white; padding: 5px;">Add Note</button>');

                        //Always: SI QC QuickAdd
                        let prependContent = GM_getValue("SI_QC", "⭐ - SME按QC要求完成&自己做的其他事情\n✅ - 已做\n❌ - 未做\n————————————————\n$YYYY$.$MM$\nQC comment:\n1. \n2. \nQC 复查意见\n1. \n2. \n⭐ ：xxxx+完成时间\n————————————————");
                        let AddPlace = GM_getValue("SI_QC_AddPlace", "❌ - 未做");

                        $("div.special-issue-note-box").last().on("mousedown", function (event) {
                            if (event.which === 2) { // 中键点击
                                event.preventDefault(); createDialog(); return false;
                            }
                        });
                        $('#qcButton').on('click', AddQCNote).on("dblclick", createDialog)
                        $("div.special-issue-note-box div.note-list-container div.click-to-edit-manuscript").last().on("contextmenu", AddQCNote);

                        function createDialog() {
                            if ($("#si_qc").length == 0) {
                                var dialogHTML = `<div id='si_qc' role='dialog' style='position: fixed; height: 400px; width: 350px; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 101; background-color: #E8F5E9; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                            border-radius: 5px; overflow: hidden;'><div style='background-color: #FFA500; color: white; padding: 10px 15px; font-size: 15px; border-top-left-radius: 5px; border-top-right-radius: 5px;'><span>Note Settings</span><button type='button'
                            onclick='document.getElementById("si_qc").remove()' style='float: right; border: none; background-color: transparent; color: white; font-size: 20px; cursor: pointer;'>&times;</button></div><div style='padding: 20px;'><textarea id="si_qc_t"
                            class="manuscript-add-note-form" minlength="1" rows="8" spellcheck="false" style='width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ccc; border-radius:4px;'></textarea><div style='margin-top: 10px;font-size:
                            14px;'>Text will append after the location specified below, or at the beginning if not found:</div><input type="text" id="si_qc_addplace" style='width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc;
                            border-radius:4px;'><button id="si_qc_save" class="submit" style='background-color: #FFA500; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;'>Save</button></div></div>`;
                                $("body").append(dialogHTML);
                                $("#si_qc_t").val(prependContent); $("#si_qc_addplace").val(AddPlace);

                                $("#si_qc_save").on("click", function () {
                                    prependContent = $("#si_qc_t").val();
                                    AddPlace = $("#si_qc_addplace").val();
                                    GM_setValue("SI_QC", prependContent);
                                    GM_setValue("SI_QC_AddPlace", AddPlace);
                                    $("#si_qc").remove();
                                });
                            }
                        }

                        function AddQCNote(event) {
                            event.preventDefault();
                            event.stopPropagation();
                            let mm = (new Date().getMonth() + 1).toString().padStart(2, "0"),
                                dd = new Date().getDate().toString().padStart(2, "0"),
                                yy = new Date().getFullYear().toString().slice(-2),
                                yyyy = new Date().getFullYear().toString();

                            let $textarea = $("div.manuscript-input-note-group textarea").last();
                            let initiallyVisible = $textarea.is(':visible');

                            if (!initiallyVisible) {
                                $("div.click-to-edit-manuscript").last().trigger("click");
                                $textarea = $("div.manuscript-input-note-group textarea").last(); // Re-acquire the textarea after UI update
                            }

                            let currentVal = $textarea.val();
                            let prependContentFormatted = prependContent.replace(/\$YYYY\$/g, yyyy)
                            .replace(/\$YY\$/g, yy)
                            .replace(/\$MM\$/g, mm)
                            .replace(/\$DD\$/g, dd);

                            if (initiallyVisible) {
                                let cursorPos = $textarea[0].selectionStart;
                                let beforeCursor = currentVal.substring(0, cursorPos);
                                let afterCursor = currentVal.substring(cursorPos);
                                $textarea.val(beforeCursor + prependContentFormatted + afterCursor);
                                let newCursorPos = cursorPos + prependContentFormatted.length;
                                $textarea.trigger("focus"); // Set focus back to the textarea
                                $textarea[0].setSelectionRange(newCursorPos, newCursorPos);
                            } else {
                                let addPlaceIndex = currentVal.indexOf(AddPlace);
                                if (addPlaceIndex > 0) {
                                    let positionAfterAddPlace = addPlaceIndex + AddPlace.length;
                                    let beforeAddPlace = currentVal.substring(0, positionAfterAddPlace);
                                    let afterAddPlace = currentVal.substring(positionAfterAddPlace);
                                    $textarea.val(beforeAddPlace + prependContentFormatted + afterAddPlace);
                                    let newCursorPos = beforeAddPlace.length + prependContentFormatted.length + 1; // +1 for the newline character
                                    $textarea.trigger("focus"); // Set focus back to the textarea
                                    $textarea[0].setSelectionRange(newCursorPos, newCursorPos);
                                } else {
                                    $textarea.val(prependContentFormatted + currentVal);
                                    let newCursorPos = prependContentFormatted.length + 1; // +1 for the newline character
                                    $textarea.trigger("focus"); // Set focus back to the textarea
                                    $textarea[0].setSelectionRange(newCursorPos, newCursorPos);
                                }
                            }

                            $textarea.scrollTop(0);
                            return false;
                        }
                        done = true;
                    }
                }, true);

            }
            if ($("a:contains('Edit at backend')").length) { $('#si-update-emphasized').parent().children("a").first().attr("href", $("a:contains('Edit at backend')").attr("href").replace(/.*\//, "https://mdpi.com/si/")) };
            $('#si-update-emphasized').before(`<a href="?pagesection=AddGuestEditor" title="Add Guest Editor"><img border="0" src="${icon_plus}"></a> `);
            $("[for='form_name_system']").append(` <a onclick="$('#form_name_system').prop('readonly', false)">[Edit]</a>`);
            if (GM_config.get('Hidden_Func')) {
                if ($('#si-update-emphasized').attr("data-uri")) {
                    $('#si-update-emphasized').before(skIconLink($('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/", "/special_issue/reset_status/"), icon_arrow, { title: 'Reset' }, { border: 0 }), ' ');
                    $('#si-update-emphasized').before(skIconLink($('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/", "/special_issue/close_invitation/"), icon_book, { title: 'Close' }, { border: 0 }), ' ');
                    $("#forceadd").on("click", function () { window.location.href = "//susy.mdpi.com/planned_paper/edit?email=" + encodeURIComponent($("#add-planned-paper-section input[name='email']").val()) });
                }
            }
            if (userNames.some(userName => $("#topmenu span:contains('@mdpi.com')").text().includes(userName + "@mdpi.com"))) {
                GM_setValue('isUserNameMatch', true);
                SpecialFunc();
            } else {
                GM_setValue('isUserNameMatch', false);
            }

            function SpecialFunc() {
                $("#checkMailsdb").before('<input id=eltry_stop style=display:none type=button class=submit value=Stop><input id=eltry_stopbox style=display:none type=checkbox> ');
                $("#guestNextBtn").after(' <span id=timesRun style=background-color:#90EE90></span> <input id=eltry style=display:inline-block type=button class=submit value="!AutoRetry"> <input id=add6th style=display:inline-block type=button class=submit value="! Add6th">');

                $("#eltry_stop").on("click", eltry_stop); function eltry_stop() { $("#eltry_stopbox").prop('checked', true) };
                $("#eltry").on("click", sk_eltry); function sk_eltry() {
                    $("body").append(`<div class="blockUI blockOverlay"id=ith-shade1 style=z-index:1000;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div>`);
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: atob("aHR0cHM6Ly9za2RheS5jb20vdGFzay93b3N2ZXJpZnkucGhwP3Y9") + $("#topmenu span:contains('@mdpi.com')").text() + "&version=susy" + GM_info.script.version,
                        onload: function (responseDetails) {
                            let response = responseDetails.responseText || "";
                            if (response.indexOf("OK ") > -1) { sk_eltry_action(response.split("OK ").pop()); } else { $("#ith-shade1").remove(); alert("Not developed yet..."); }
                        }
                    });
                }

                function sk_eltry_action(p1) {
                    $("body").append(`<div class="blockUI blockMsg blockPage" id=ith-shade2 style="z-index:1011;position:fixed;padding:10px;margin:10px;width:500px;top:25%;height:500px;left:35%;color:#000;border:3px solid #aaa;background-color:#fff">
                <form onsubmit="return false;"><br>E-Mail <input type="text" id="sk_eltry_email" style="display:inline-block; width:65%;" required> <br>Interval <input type="number" id="sk_eltry_interval" max=10000 step=50
                style="display:inline-block; width:7em;" onkeydown="return false;" required> ms <br>Start Time <input type="time" id="sk_eltry_startt" style="display:inline-block; width:10em;" required><br><input type=submit id=sk_eltry_submit
                value=Start style="margin:10px;padding:5px 20px"><input onclick='document.getElementById("ith-shade1").remove(),document.getElementById("ith-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"></form></div>`)
                    $("#sk_eltry_email").val($("#form_email").val()); $("#sk_eltry_interval").attr('min', p1).val(p1);
                    $("#sk_eltry_submit").on("click", function () {
                        if (!this.form.reportValidity()) return;
                        var eltry_email = $("#sk_eltry_email").val();
                        var interval_time = $("#sk_eltry_interval").val();
                        let today = new Date(), startClock = $("#sk_eltry_startt")[0].valueAsDate;
                        var start_time = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startClock.getUTCHours(), startClock.getUTCMinutes(), startClock.getUTCSeconds(), startClock.getUTCMilliseconds());
                        var today_string = skLocalDate(today) + ' ';
                        $("#eltry_stop").css("display", "inline-block"); $("#eltry").css("display", "none"); $("#add6th").css("display", "none"); $("#ith-shade1").remove(); $("#ith-shade2").remove();
                        $("#form_email").val(eltry_email); $("#guestNextBtn").trigger("click");

                        waitForKeyElements("#specialBackBtn", sk_eltry_check2, true);
                        function sk_eltry_check2() {
                            var timesRun = 1; $("#timesRun").text("Autotry will start at: " + start_time);
                            let notify_init = { dir: "auto", body: eltry_email + " will be invited on " + start_time + ". Please don't close the tab.", requireInteraction: false, icon: "https://susy.mdpi.com/build/img/design/susy-logo.png" };
                            if (start_time > Date.now()) { notifyMe('Starting', notify_init); timesRun = 0; }
                            var notify_options = {
                                dir: "auto", //Text Direction
                                body: "GE can be invited soon, please watch the webpage.",
                                requireInteraction: true, //Autohide or not
                                icon: "https://susy.mdpi.com/build/img/design/susy-logo.png"
                            };
                            var interval = setInterval(function () {
                                if (start_time - Date.now() < 40000) {
                                    if (timesRun == 0) {
                                        notifyMe('Starting', notify_options);
                                    }
                                    timesRun += 1; $("#timesRun").text(timesRun + " attempts auto trying. ");
                                    $("#guestNextBtn").trigger("click");
                                    if ($("p:contains('on " + today_string + "')").length) {
                                        clearInterval(interval); $("#timesRun").text("The GE is already invited by others. Stopped.");
                                    } else if ($("#eltry_stopbox").prop("checked")) {
                                        $("#eltry_stop").css("display", "none"); $("#eltry").css("display", "inline-block"); $("#add6th").css("display", "inline-block"); clearInterval(interval); $("#timesRun").text("");
                                    } else if ($("p:contains('You are not allowed to invite the editor')").length) {
                                        // do nothing
                                    } else if (document.getElementById('process-special-issue-guest-editor') != null) {
                                        clearInterval(interval);
                                        document.getElementById("process-special-issue-guest-editor").trigger("click");
                                        $("body").append(`<div class="blockUI blockOverlay" style=z-index:1000;border:none;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div><div class="blockUI blockMsg blockPage" style=
                                    "z-index:1011;position:fixed;width:30%;top:45%;height:50px;line-height:40px;left:35%;text-align:center;color:#000;border:3px solid #aaa;overflow-y:none;background-color:#fff;vertical-align:middle">Proceeding... Please wait.</div>`)
                                        $("#process-special-issue-guest-editor").trigger("click");
                                    } else {
                                        // do nothing
                                    }
                                } else if (Math.round((start_time - Date.now()) / 1000) % 120 == 0) {
                                    $("#guestNextBtn").trigger("click");
                                    $("#timesRun").text("Autotry will start in [" + Math.round((start_time - Date.now()) / 1000 / 60) + " min]: " + start_time);
                                }
                            }, interval_time);
                        }

                        function notifyMe(title, options) {
                            if (!window.Notification) { console.log('Notification is not supported by Broswer!'); }
                            else {
                                if (Notification.permission === 'granted') {
                                    var notification = new Notification(title, options); notification.onclick = () => { };
                                } else if (Notification.permission === 'default') {
                                    Notification.requestPermission().then(permission => {
                                        if (permission === 'granted') {
                                            console.log('Notification is granted by User!');
                                            var notification = new Notification(title, options); notification.onclick = () => { };
                                        } else if (permission === 'default') {
                                            console.warn('Notification is not granted or denied. Let us try again!');
                                        } else {
                                            console.log('Notification is denied by User!');
                                        }
                                    });
                                } else { console.log('Notification is denied by User in the past!'); }
                            }
                            return notification;
                        }
                    });
                }

                $("#add6th").on("click", sk_add6th); function sk_add6th() {
                    $("#eltry").css("display", "none"); $("#add6th").css("display", "none");
                    $("#guestNextBtn").trigger("click");
                    waitForKeyElements("div.colorblack", sk_add6th_check, true);
                    function sk_add6th_check() {
                        $("#specialBackBtn").after(` <input id="process-special-issue-guest-editor" type="submit" value="Force Add" class="submit is-psme-assessment">`);
                    }
                }
            }

            Quick_InviteRemind($("a[href^='/email/invite/guest_editor/']")); Quick_InviteRemind($("a[href^='/email/remind/guest_editor/']"));
            function Quick_InviteRemind(param) { param.each(function () { $(this).after(' (', $('<a>').attr('href', $(this).attr('href') + '?Q').text('Quick'), ')') }) }
            $('a[data-title="Extend Deadline"]').on("click", function () { waitForKeyElements("#form_deadline", solve_readonly, false); function solve_readonly() { $("#form_deadline").attr("readonly", false) }; })
            $('a[data-title="Change special issue deadline"]').on("click", function () { waitForKeyElements("#form_date", solve_readonly2, false); function solve_readonly2() { $("#form_date").attr("readonly", false) }; })
            $('div.cell.small-12.medium-6.large-2:contains("Online Date")').next().css({ "background-color": "yellow" });
            $("#form_checklist_1").before("<input id='select_all' type='button' value='[Select All]'><br>"); $("#select_all").on("click", function () {
                $("#si-cfp-form [type=\'checkbox\']").prop("checked", true); if ($("#form_template_id").val() == 1) { $("#form_template_id").val(2) }; if ($("#form_comments").val() == "") { $("#form_comments").val("Thank you.") }
            });

            // 按钮Contact All Guest Editors
            let button = $('input.submit[value="Contact All Guest Editors (Special Issue Management)"]');
            if (button.length > 0) { button.replaceWith($('<a class="submit">').attr('href', button.attr('onclick').match(/'([^']+)'/)[1]).text(button.val())); }

            // 按钮PP MailMerge
            var PPMM = $('<input type="button" id=PPMM class="submit" value="PPMailMerge" style="float:right;margin:0"> ').on("click", function () {
                var selectedEmailLinks = [];
                $('table tr').each(function () {
                    var checkbox = $(this).find('input[type="checkbox"]');
                    if (checkbox.is(':checked')) {
                        var emailLink = $(this).find('a[title="Send Planned Paper Email"]').attr('href');
                        if (emailLink) {
                            selectedEmailLinks.push(emailLink);
                        }
                    }
                });
                if (!selectedEmailLinks.length) return null;
                var baseLink = selectedEmailLinks[0];
                var ids = selectedEmailLinks.map(link => link.split('/').pop()).join(',');
                GM_openInTab("https://susy.mdpi.com" + baseLink + "/management?multiIds=" + ids, false);
            });

            var SelectALL = $('<input type="button" id=SelectALL class="button hollow" value="Select PP" style="float:right;float:right;font-size:small;margin:0;"> ').on("click", function () {
                this.toggle = !this.toggle;
                var statusesToCheck = this.toggle ? ['Title Provided', 'Agreed'] : ['Title Provided', 'Agreed', 'Interested'];
                let statusIndex = 0, found = false;
                $('#add-planned-paper-section, #single-planned-paper-form').find('thead th').each(function (index) {
                    if (!found) {
                        let text = $(this).text().trim();
                        if (text === "Status") { statusIndex = index + 1; found = true; }
                    }
                });
                $('table tr').each(function () {
                    var status = $(this).find('td:nth-child(' + statusIndex + ')').text().trim();
                    $(this).find('input[type="checkbox"]').prop('checked', statusesToCheck.includes(status));
                });
            });
            $('#add-planned-paper-section>fieldset>div>div, #single-planned-paper-form>fieldset>div>div').last().append(SelectALL, "<span style=float:right>&nbsp;</span>", PPMM);

            $("div.special-issue-invite-div a[href$='/unresponsive'], div.special-issue-invite-div a[href$='/to_be_contacted']").attr("href", function () {
                return this.href + "?page=1&page_limit=100";
            });

            if (GM_config.get('Maths_J')) {
                $("a.display_present_editor").on("click", function () {
                    waitForKeyElements('span:contains("Guest Editor Information"):visible', function () {
                        $('span:contains("Guest Editor Information"):visible').parent().parent().find("div.cell.small-12").each(function () {
                            let ranking = skGetUniv($(this).text().trim());
                            if (ranking.color) {
                                skAddResourceStyle('tooltipsterCSS', 'tooltipsterNoirCSS', 'tooltipster-style');
                                $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                    .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                            }
                        });
                    }, true)
                });
                $("#guestNextBtn").on("click", function () {
                    waitForKeyElements('#specialBackBtn', function () {
                        skAddResourceStyle('tooltipsterCSS', 'tooltipsterNoirCSS', 'tooltipster-style');
                        $('#checkMailsdb').parent().find("br").each(function () {
                            var nextNode = this.nextSibling;
                            if (nextNode && nextNode.nodeType === 3 && nextNode.nodeValue.includes('Affiliation:')) {
                                let ranking = skGetUniv($(nextNode).text().trim());
                                if (ranking.color) {
                                    $(nextNode).replaceWith($('<span>').text(nextNode.nodeValue).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                                            .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' }));
                                }
                            }
                            let ranking = skGetUniv($(this).text().trim());
                            if (ranking.color) {
                                $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                    .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                            }
                        });
                    }, true)
                });
            }

            if (GM_config.get('Hidden_Func')) {
                $("a:contains('Show Cancelled Guest Editors')").before(`<a id=sk_list class="btn--secondary small  margin-0">Links</a> `);
                $("h1:contains('Process Special Issue')").attr("id", "sk_list2")
                $("#sk_list,#sk_list2").on("click", function () {
                    var emailLinks = [];
                    $("[data-user-publication-history-emails]").each(function () {
                        let email = $(this).attr('data-user-publication-history-emails');
                        let quickLink = $(this).parent().parent().next().next().find('a:contains("Quick")').attr('href');
                        if (quickLink) { emailLinks.push(email + "\thttps://susy.mdpi.com" + quickLink) };
                    })
                    $("body").append(`<div class="blockUI blockOverlay"id=links-shade1 style=z-index:1000;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div>
                                <div class="blockUI blockMsg blockPage" id=links-shade2 style="z-index:1011;position:fixed;padding:0;margin:0;width:50%;top:5%;height:90%;left:25%;text-align:center;color:#000;border:3px solid #aaa;overflow-y:auto;background-color:#fff">
                                <input onclick='document.getElementById("links-shade1").remove(),document.getElementById("links-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"><textarea id=links_prompt rows=30>
                                     </textarea><input onclick='document.getElementById("links-shade1").remove(),document.getElementById("links-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"></div>`)
                    $("#links_prompt").val(emailLinks.join('\n')).select(); navigator.clipboard.writeText($("#links_prompt").val());
                })

                if (window.location.href.indexOf("/ge") > -1) {
                    let url_ChangeDiscount = $("input[data-post-uri*='/special_issue/cfp/batch_change_discount']").last().attr('data-post-uri');
                    let url_Invite = url_ChangeDiscount.replace("/restapi/special_issue/cfp/batch_change_discount", "/special_issue/paper_invitations").replace(/\/1\/.*$/,"/invite/1");
                    $("input[batch-ajax-url*='paper_invitations/withdraws']").before($('<input value="🚨 Invite" type="button" class="batch-operation-button button batch-invite-btn">').attr('batch-ajax-url', url_Invite));

                }

                // 自动修改Deadline：URL含DL=日期时触发，CL=单元格时同步更新
                let dlMatch = window.location.href.match(/[?&]DL=([^&]+)/);
                let uidMatch = window.location.href.match(/[?&]UID=([^&]+)/);
                let OnlineDateElem = $('div.cell.small-12.medium-6.large-2:contains("Online Date")').next();
                let OnlineDate = OnlineDateElem.length ? OnlineDateElem.text().trim() : "";
                const FORM_URL = "https://forms.office.com/e/gaQVDih0BU";

                if (dlMatch && uidMatch) {
                    let onlineYear = parseInt(OnlineDate.match(/\d{4}/)?.[0] || '0', 10);
                    if (onlineYear > 0 && onlineYear < 2024) {
                        alert('Online Date is ' + OnlineDate + '.\nDo not extend the deadline.');
                    } else {
                        let dlRaw = decodeURIComponent(dlMatch[1]).trim();
                        let dlDate = new Date(NaN);
                        let mYMD = dlRaw.match(/^(\d{4})[./\-](\d{1,2})[./\-](\d{1,2})$/);
                        if (mYMD) { dlDate = skCalendarDate(...mYMD.slice(1).map(Number)); }
                        else {
                            let mDMY = dlRaw.match(/^(\d{1,2})[./\-](\d{1,2})[./\-](\d{4})$/);
                            if (mDMY) { dlDate = skCalendarDate(Number(mDMY[3]), Number(mDMY[2]), Number(mDMY[1])); }
                        }
                        if (!Number.isFinite(dlDate.getTime())) { alert(`非法的日期数据: ${dlRaw}`); throw new Error(`非法的日期数据: ${dlRaw}`); }
                        let dlDateForWeb = skLocalDate(dlDate);

                        sessionStorage.setItem("DL_pending_date", dlDateForWeb);
                        sessionStorage.setItem("DL_pending_uid", decodeURIComponent(uidMatch[1]));

                        let cleanUrl = window.location.href.replace(/[?&]DL=[^&]+/g, '').replace(/[?&]UID=[^&]+/g, '').replace(/[?&]CL=[A-Z]+\d+/g, '').replace(/\?&/, '?').replace(/\?$/, '');
                        history.replaceState(null, '', cleanUrl);

                        let $extendBtn = $('a[data-url*="/si/extend/deadline/"]');
                        if ($extendBtn.length > 0) {
                            $extendBtn[0].click();
                        } else {
                            let altBtn = $('a[data-url*="/user/special_issue/deadline/"]');
                            if(altBtn.length > 0) altBtn[0].click();
                        }

                        let dlWait = setInterval(function () {
                            if ($("#form_date, #form_deadline").length === 0) return;
                            clearInterval(dlWait);
                            $("#form_date, #form_deadline").attr("readonly", false).val(dlDateForWeb);
                            $("div.quickform input.submit[type='submit'][value='Submit'], div.quickform input.submit[type='submit'][value='Save']").trigger("click");
                        }, 500);
                    }
                }
                else {
                    let dlPendingDate = sessionStorage.getItem("DL_pending_date");
                    let dlPendingUid = sessionStorage.getItem("DL_pending_uid");
                    if (dlPendingDate && dlPendingUid) {
                        sessionStorage.removeItem("DL_pending_date");
                        sessionStorage.removeItem("DL_pending_uid");
                        let deadlineText = $('div.cell.small-12.medium-6.large-2:contains("Deadline")').next().text().trim();
                        if (deadlineText.includes(dlPendingDate)) {
                            let taskPayload = JSON.stringify({
                                uid: dlPendingUid,
                                taskName: "SI New Deadline"
                            });
                            let targetUrl = FORM_URL + "#syncData=" + encodeURIComponent(taskPayload);
                            GM_openInTab(targetUrl, { active: false });
                        } else {
                            alert("❌ Deadline 修改失败，当前：" + deadlineText);
                        }
                    }
                }

                // 自动填入GE邮箱：URL含GE=邮箱时，自动填入form_email并点击guestNextBtn
                let geMatch = window.location.href.match(/[?&]GE=([^&@]+@[^&.]+\.[^&]+)/);
                if (geMatch) {
                    let geEmail = decodeURIComponent(geMatch[1]);
                    let cleanUrl = window.location.href.replace(/[?&]GE=[^&]+/g, '').replace(/\?&/, '?').replace(/\?$/, '');
                    history.replaceState(null, '', cleanUrl);
                    if ($("#form_email").length > 0) {
                        document.getElementById('form_email').scrollIntoView();
                        $("#form_email").val(geEmail);
                        sessionStorage.setItem("GE_pending_email", geEmail);
                        let geClMatch = window.location.href.match(/[?&]CL=([A-Z]+\d+)/);
                        if (geClMatch) { sessionStorage.setItem("GE_pending_cell", geClMatch[1]); }
                        $("#guestNextBtn").trigger("click");
                        // 等待Cloudflare验证成功后自动点击Proceed
                        waitForKeyElements("#process-special-issue-guest-editor", function () {
                            let geStartTime = Date.now();
                            let geCheckInterval = setInterval(function () {
                                let cfResponse = document.querySelector('[name="cf-turnstile-response"]');
                                if (cfResponse && cfResponse.value) {
                                    clearInterval(geCheckInterval);
                                    $("#process-special-issue-guest-editor").trigger("click");
                                } else if (Date.now() - geStartTime > 20000) {
                                    clearInterval(geCheckInterval);
                                    alert("Cloudflare 验证超时");
                                }
                            }, 500);
                        }, true);
                    }
                } else {
                    // 检查GE添加结果（页面刷新后）
                    let gePendingEmail = sessionStorage.getItem("GE_pending_email");
                    if (gePendingEmail) {
                        sessionStorage.removeItem("GE_pending_email");
                        if (document.body.innerText.includes(gePendingEmail)) {
                            let gePendingCell = sessionStorage.getItem("GE_pending_cell");
                            if (gePendingCell) {
                                sessionStorage.removeItem("GE_pending_cell");
                                let today = new Date();
                                let todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "https://script.google.com/macros/s/AKfycbzPrOYlVXip3M8u3Ty2oHfKF6Irf8TkuTRYeNO4HAY5LvIO8c_JZYx9r7CBfsC4Mlc81w/exec?sheetId=185189532&cell=" + gePendingCell + "&value=" + todayStr,
                                    onerror: function () { alert("Google Sheet 更新失败"); }
                                });
                            }
                            alert("✅ GE添加成功：" + gePendingEmail);
                        } else {
                            alert("❌ GE添加失败：" + gePendingEmail);
                        }
                    }
                }
            }
        } catch (error) { }
    }

    if (window.location.href.includes("forms.office.com") || window.location.href.includes("forms.cloud.microsoft")) {
        let hash = window.location.hash;
        if (hash && hash.includes("#syncData=")) {
            try {
                let dataStr = decodeURIComponent(hash.replace("#syncData=", ""));
                let taskData = JSON.parse(dataStr);
                let uid = taskData.uid;
                let taskName = taskData.taskName;

                function setNativeValue(element, value) {
                    const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    const prototype = Object.getPrototypeOf(element);
                    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, "value").set;
                    if (valueSetter && valueSetter !== prototypeValueSetter) {
                        prototypeValueSetter.call(element, value);
                    } else {
                        valueSetter.call(element, value);
                    }
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                }

                let checkForm = setInterval(() => {
                    let inputs = document.querySelectorAll('input[data-automation-id="textInput"]');
                    if (inputs.length >= 3) {
                        clearInterval(checkForm);

                        let today = new Date();
                        let todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

                        setNativeValue(inputs[0], uid);
                        setNativeValue(inputs[1], todayStr);
                        setNativeValue(inputs[2], taskName);

                        setTimeout(() => {
                            let submitBtn = document.querySelector("button[data-automation-id='submitButton']");
                            if(submitBtn) submitBtn.click();

                            let checkSuccess = setInterval(() => {
                                let isSuccess = document.body.innerText.includes("Your response was submitted");
                                if (isSuccess) {
                                    clearInterval(checkSuccess);
                                    history.replaceState(null, null, ' ');
                                    window.close();
                                }
                            }, 1000);
                        }, 1000);
                    }
                }, 1000);
            } catch (e) {
                alert("解析任务数据失败", e);
            }
        }
        return; // 结束 Forms 页面的逻辑
    }

    // PP Note 快捷按键
    if (window.location.href.indexOf(".mdpi.com/planned_paper/my/") + window.location.href.indexOf(".mdpi.com/special_issue/process") > -2) {
        $('a[data-load-url*="/planned_paper/update_notes/"]').on("mousedown", function(event) {// 按钮 PP Note 中键
            if (event.which === 2) { // Middle mouse button
                event.preventDefault();
                if ($("#pp_note_settings").length == 0) {
                    var notePos = GM_getValue("PP_Note_Pos", "end");
                    var dialogHTML = `<div id='pp_note_settings' role='dialog' style='position: fixed; height: 340px; width: 350px; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 101; background-color: #E8F5E9; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                            border-radius: 5px; overflow: hidden;'><div style='background-color: #FFA500; color: white; padding: 10px 15px; font-size: 15px; border-top-left-radius: 5px; border-top-right-radius: 5px;'><span>Note Settings</span><button type='button'
                            onclick='document.getElementById("pp_note_settings").remove()' style='float: right; border: none; background-color: transparent; color: white; font-size: 20px; cursor: pointer;'>&times;</button></div><div style='padding: 20px;'>
                            <div style='margin-bottom: 15px;'><label style='display: block; margin-bottom: 5px;'>Add the following note at:</label><div style="display: flex; gap: 20px; align-items: center;"><label style="margin:0;">
                            <input type="radio" name="pp_note_pos" value="end" ${notePos === "end" ? "checked" : ""}> End</label><label style="margin:0;"><input type="radio" name="pp_note_pos" value="beginning" ${notePos === "beginning" ? "checked" : ""}> Beginning</label>
                            </div></div><div style='margin-bottom: 15px;'><label style='display: block; margin-bottom: 5px;'>Note Content:</label><textarea id="pp_note" style='width: 100%; height: 100px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;
                            resize: vertical;'></textarea></div><button id="pp_note_save" class="submit" style='background-color: #FFA500; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%;'>Save</button></div></div>`;
                    $("body").append(dialogHTML);

                    let savedNote = GM_getValue("PP_Note", "%YYYY-MM-DD% Remind PP");
                    $("#pp_note").val(savedNote);
                    $(`input[name="pp_note_pos"][value="${notePos}"]`).prop("checked", true);

                    $("#pp_note_save").on("click", function () {
                        let note = $("#pp_note").val();
                        let pos = $('input[name="pp_note_pos"]:checked').val();
                        GM_setValue("PP_Note", note);
                        GM_setValue("PP_Note_Pos", pos);
                        $("#pp_note_settings").remove();
                    });
                }
                return false;
            }
        })

        $('a[data-load-url*="/planned_paper/update_notes/"]').on("contextmenu", function(event) {// 按钮 PP Note 右键
            let target = $(event.target);
            let link = target.is('a') ? target : target.parent();
            if (link.html() === "✅") { return; } else { event.preventDefault();}

            let url = "https://susy.mdpi.com" + link.attr('data-load-url');
            $.get(url, function(data) {
                let textareaContent = $(data).find('textarea').text().trim();
                let savedNote = GM_getValue("PP_Note", "%YYYY-MM-DD% Remind PP");
                let notePos = GM_getValue("PP_Note_Pos", "end");
                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, '0');
                let day = String(today.getDate()).padStart(2, '0');

                savedNote = savedNote.replace(/%([^%]+)%/g, function(match, content) {
                    return content.replace(/YYYY/g, year).replace(/YY/g, String(year).slice(-2)).replace(/MM/g, month).replace(/DD/g, day);
                });

                let newContent;
                if (notePos === "beginning") { newContent = savedNote + "\n" + textareaContent; } else { newContent = textareaContent + "\n" + savedNote; }

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: { data: newContent },
                    headers: {
                        'susy-csrf-token': unsafeWindow.SusyConfig.susy_csrf_token
                    },
                    success: function(response, status, xhr) {
                        if (xhr.status === 200) {
                            link.attr("title",newContent).html("✅");
                        }
                    }
                });
            });
        });
    }

    //SI可行性报告
    if (window.location.href.indexOf(".mdpi.com/si/evaluation_checklist_hash/") > -1) {
        try {
            $("#sp_100").children("div").first().prepend(`<div style="padding:10px;background:lightyellow;font-size:12px;">Enter keywords separated by commas, semicolons or linebreaks:<textarea id=s_key></textarea>Operators: [Finder]
        <select id="finder_o" style="display:inline-block; width:auto"><option value="and" selected="selected">And</option><option value="or">Or</option></select> [WoS] <select id="wos_o" style="display:inline-block; width:auto"><option value="AND">And</option>
        <option value="OR" selected="selected">Or</option></select> WoS[SID]: <input type="text" id="wos_sid" style="display:inline-block;width:150px;margin-right:10px;">
        <button id=s_key_submit class=submit progress=zero style=margin:0>Generate Feasibility Report</button></div>`)

            $("#wos_sid").val(GM_getValue("wos_sid", "")); $("#s_key").val($("#sq_101i").val().replace(" and ", "\n")); $("#s_key_submit").on("click", fc_fill);
            function fc_fill() {
                let keywords = $("#s_key").val().split(/[.:;,|\n/\\]+/), keyword_num = keywords.length, url1 = "https://finder.susy.mdpi.com/topic/special_issue?", n_closed, n_open, n_pending, j_open, n_wos, n_wos_m, conclusion = 0;
                let fc_journal_name = $("h4:contains('Journal:')").find("i").text(); let fc_j_id = skGetJid(fc_journal_name.toLowerCase());
                let WOS_Category = "";
                for (let i = 0; i < keyword_num; i++) { url1 = url1 + "fields[keywords][" + i + "]=" + keywords[i] + "&fields[operators][" + i + "]=" + $("#finder_o").val() + "&" }
                url1 = encodeURI(url1.slice(0, -1));
                $("#s_key_submit").attr('disabled', true).text("Progessing"); $('input[value="Complete"]').attr('disabled', true);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url1,
                    onload: function (responseDetails) {
                        if (responseDetails.finalUrl.indexOf("finder.susy.mdpi.com/login") > -1) {
                            alert("Please first login to [Finder] and try again.");
                            $("#s_key_submit").attr('disabled', false).attr('progress', 'zero').text("Click to Try Again"); $('input[value="Complete"]').attr('disabled', false);
                            GM_openInTab(url1, false); return;
                        }
                        console.log(responseDetails.responseText)
                        let $res = $($.parseHTML(responseDetails.responseText));
                        n_closed = $res.find("#filter_fields_si_statuses_Closed").parent().text().match(/\d+/).pop();
                        n_open = $res.find("#filter_fields_si_statuses_Open").parent().text().match(/\d+/).pop();
                        n_pending = $res.find("#filter_fields_si_statuses_Pending").parent().text().match(/\d+/).pop();
                        GM_xmlhttpRequest({
                            url: url1 + "&fields[journals][]=" + fc_j_id, onload: function (responseDetails) {
                                let $resj = $($.parseHTML(responseDetails.responseText));
                                j_open = $resj.find("#filter_fields_si_statuses_Open").parent().text().match(/\d+/).pop();
                                $("div[title='Rich Text Editor, editor1']").html("<p>Title: " + keywords.join(' ' + $("#finder_o").val() + ' ') + "</p><p>The number of open SIs in your journal:" + j_open + "</p><p>The number of open SIs in MDPI:" + n_open +
                                                                                 "</p><p>The number of pending online SIs in MDPI:" + n_pending + "</p><p>The number of closed SIs in MDPI:" + n_closed + "</p><p>Link: " + url1 + "</p>")
                                if ($("#s_key_submit").attr("progress") == "half") { write_conclusion(); } else { $("#s_key_submit").attr("progress", "half"); }
                            }
                        });
                    },
                    onerror: function (error) { console.error('Error Details:', error) }
                });


                let date = new Date(), year5 = date.getFullYear() - 5, year1 = date.getFullYear() + 1, url2;
                var QID = 0, SID = $("#wos_sid").val();
                if (!SID) {
                    alert("Please input SID.");
                    $("#s_key_submit").attr('disabled', false).attr('progress', 'zero').text("Click to Try Again"); $('input[value="Complete"]').attr('disabled', false);
                    return;
                }
                GM_setValue("wos_sid", SID);
                var ws = new WebSocket("wss://www.webofscience.com/api/wosnxcorews?SID=" + SID);
                let param = {
                    "commandId": "runQuerySearch", "params": {
                        "product": "WOSCC", "searchMode": "general", "viewType": "search", "serviceMode": "summary", "search": {
                            "mode": "general", "database": "WOSCC", "query": [{
                                "rowText": "TS=(" + keywords.join(' ' + $("#wos_o").val() + ' ')
                                + ") and PY=(" + year5 + "-" + year1 + ")"
                            }], "sets": [], "options": { "lemmatize": "On" }
                        }, "retrieve": {
                            "count": 50, "history": true, "jcr": true, "sort": "relevance", "analyzes": ["TP.Value.6", "DR.Value.6", "REVIEW.Value.6", "EARLY ACCESS.Value.6", "OA.Value.6", "PY.Field_D.6",
                                                                                                         "TASCA.Value.6", "OG.Value.6", "DT.Value.6", "AU.Value.6", "SO.Value.6", "PUBL.Value.6", "ECR.Value.6", "DX2NG.Value.6"]
                        }, "eventMode": null
                    }, "id": 1
                };
                let param2 = {
                    "commandId": "runQuerySearch", "params": {
                        "product": "WOSCC", "searchMode": "general", "viewType": "search", "serviceMode": "summary", "search": {
                            "mode": "general", "database": "WOSCC", "query": [{
                                "rowText": "TS=(" + keywords.join(' ' + $("#wos_o").val() + ' ')
                                + ") and WC=(mathematic* OR statistic*) and PY=(" + year5 + "-" + year1 + ")"
                            }], "sets": [], "options": { "lemmatize": "On" }
                        }, "retrieve": {
                            "count": 50, "history": true, "jcr": true, "sort": "relevance", "analyzes": ["TP.Value.6", "DR.Value.6", "REVIEW.Value.6",
                                                                                                         "EARLY ACCESS.Value.6","OA.Value.6","PY.Field_D.6","TASCA.Value.6","OG.Value.6","DT.Value.6","AU.Value.6","SO.Value.6","PUBL.Value.6","ECR.Value.6","DX2NG.Value.6"]
                        }, "eventMode": null
                    }, "id": 2
                };

                ws.onopen = function () { ws.send(JSON.stringify(param)); }
                ws.onmessage = function (evt) {
                    let data = evt.data;
                    if (data.indexOf('"key":"COMPLETE"') > -1) { ws.close(); }
                    if (data.indexOf('{"QueryID":') > -1) { QID = data.match(/"QueryID":"(.*?)",/).pop(); n_wos = data.match(/"RecordsFound":(.*?),"/).pop(); }
                    if (data.indexOf('"Key":"TASCA') > -1) {
                        $.each(JSON.parse(data).payload['TASCA.Value.6'].Values, function (_, item) { WOS_Category = WOS_Category + "• " + item.Key + ": " + item.Value + "; " });
                        WOS_Category = WOS_Category.replace(/TASCA./g, "").toLowerCase().replace(/(?:^|\s)\w/g, function (match) { return match.toUpperCase(); });
                    }
                    console.log(data)
                }
                ws.onclose = function () {
                    console.log("WSS is closed......");
                    url2 = "https://www.webofscience.com/wos/woscc/summary/" + QID + "/relevance/1";
                    if (n_wos) {
                        $("div[title='Rich Text Editor, editor2']")
                            .html("<p>Total Results: " + n_wos + "</p><p>Topic: " + keywords.join(' ' + $("#wos_o").val() + ' ') + "</p><p>Timespan: Last 5 years</p><p>Indexes: SCI-EXPANDED</p><p>Top Categories: " + WOS_Category + "</p><p>Link: " + url2 + "</p>")
                        let ws_m = new WebSocket("wss://www.webofscience.com/api/wosnxcorews?SID=" + SID);
                        ws_m.onopen = function () { ws_m.send(JSON.stringify(param2)); }
                        ws_m.onmessage = function (evt) {
                            let data = evt.data;
                            if (data.indexOf('"key":"COMPLETE"') > -1) { ws_m.close(); }
                            if (data.indexOf('{"QueryID":') > -1) { n_wos_m = data.match(/"RecordsFound":(.*?),"/).pop(); }
                        }
                        ws_m.onclose = function () {
                            $("p:contains('Total Results:')").append(" (Category related to Mathematics: " + n_wos_m + ")");
                            if ($("#s_key_submit").attr("progress") == "half") { write_conclusion(); } else { $("#s_key_submit").attr("progress", "half"); }
                        }
                    } else {
                        alert("Failed to receive valid data. Please revise SID and try again.");
                        $("#s_key_submit").attr('disabled', false).attr('progress', 'zero').text("Click to Try Again"); $('input[value="Complete"]').attr('disabled', false);
                    }
                };

                function write_conclusion() {
                    if (j_open == 0) {
                        conclusion = "I found that there is no similar open Special Issues in our journal, so I suggest creating this Special Issue. Hope you may approve."
                    }
                    else if (j_open == 1) {
                        conclusion = "I found that there is only 1 open Special Issue in our journal with similar research field. So I suggest creating this Special Issue. Hope you may approve."
                    }
                    else if (j_open < 4) {
                        conclusion = "After evaluation, I found that there are only " + j_open + " similar open Special Issues in our journal. The Publication record indicates that there are about " + n_wos +
                            " papers published in this field in the past 5 years. I suggest creating this Special Issue. Hope you may approve."
                    }
                    else if (j_open > 9) {
                        conclusion = "Although there are " + j_open + " similar open Special Issues in our journal, this topic is very wide. The Publication record indicates that there are about " + n_wos +
                            " papers published in this field in the past 5 years. we could focus on other aspects of the topic to make a full cover of the research field. Hope you may approve."; alert("相似特刊太多了，您要不考虑换换吧？")
                    }
                    else {
                        conclusion = "Although there are " + j_open + " similar open Special Issues in our journal, this topic is very wide. The Publication record indicates that there are about " + n_wos +
                            " papers published in this field in the past 5 years. we could focus on other aspects of the topic to make a full cover of the research field. Hope you may approve."
                    }
                    $("div[title='Rich Text Editor, editor3']").html("<p>" + conclusion + "</p");
                    $("#s_key_submit").attr('disabled', false).attr('progress', 'zero').text("Generate Feasibility Report");
                    $('input[value="Complete"]').attr('disabled', false);
                    $('html, body').animate({ scrollTop: $("div[title='Rich Text Editor, editor1']").parent().parent().prev().offset().top }, 500);
                }
            }
        } catch (error) { }
    }
    if (window.location.href.indexOf("/email/invite/eic_decision/") > -1) {
        try {
            unsafeWindow.$('#emailTemplates').prop('selectedIndex', 1).trigger("chosen:updated").trigger('change');
        } catch (error) { }
    }

    //默认新建特刊位置和Title Case
    if (window.location.href.indexOf(".mdpi.com/user/special_issue/edit/") > -1) {
        try {
            $("#form_name").after("<a id='TitleCaseChicago'>🔡(Chicago)🔠</a> ");
            $("#TitleCaseChicago").on("click", function () {
                if ($("#form_name").val().length > 1) {
                    (async () => {
                        $('#form_name, input[value="Edit"], input[value="Add"]').prop("disabled", true);
                        var result = "";
                        let response = await skGMFetchGet("https://titlecaseconverter.com/tcc/?title=" + encodeURIComponent($("#form_name").val()) + "&preserveAllCaps=true&styleC=true");
                        let jsonarray = JSON.parse(response.responseText);
                        jsonarray[0].title.forEach(element => { result = result + element.joint + element.word });
                        $("#form_name").val(result);
                        $('#form_name, input[value="Edit"], input[value="Add"]').prop("disabled", false);
                    })()
                }
            });
            if (window.location.href.indexOf("/edit/0") > -1 && S_J > 0) {
                unsafeWindow.$('#form_id_journal').val(S_J).trigger("chosen:updated").trigger("change");
                if (window.location.href.indexOf("/edit/0?") > -1) { $("#form_owner_email").val(window.location.search.split('?')[1]); }
            }
        } catch (error) { }
    }

    //Susy CfP
    if (window.location.href.indexOf("/paper_invitations/") > -1) {
        try {
            if (window.location.href.indexOf("/invite/") > -1) {
                let cfpTemplateID = GM_config.get('CfP_TemplateID'), $cfpTemplate = $();
                if (cfpTemplateID == 'Paper Invitation 2') {
                    $cfpTemplate = $("#emailTemplates > option:contains('Paper Invitation2'), #emailTemplates > option:contains('Paper Invitation 2')").first();
                } else if (cfpTemplateID == 'Paper Invitation 1') {
                    $cfpTemplate = $("#emailTemplates > option:contains('Paper Invitation1'), #emailTemplates > option:contains('Paper Invitation 1')").first();
                    if (!$cfpTemplate.length) { $cfpTemplate = $("#emailTemplates > option:contains('Paper Invitation')").not(":contains('Paper Invitation2')").not(":contains('Paper Invitation 2')").not(":contains('GE Approved')").first(); }
                }
                function init() {
                    let t1 = skStringToRegex(GM_config.get('CfP_TemplateS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('CfP_TemplateS2'))));
                    let t2 = skStringToRegex(GM_config.get('CfP_TemplateB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('CfP_TemplateB2'))));
                }
                waitForText(document.querySelector('#mailBody'), ' ', function () {
                    if ($cfpTemplate.length) {
                        let cfpTemplateValue = $cfpTemplate.val(), cfpState = "", cfpTriedState = "", cfpStable = 0, cfpTicks = 0;
                        if (!$cfpTemplate.prop('selected')) {
                            $cfpTemplate.prop('selected', true);
                            unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");
                        }
                        let cfpTimer = setInterval(function () {
                            if ($("#emailTemplates").val() != cfpTemplateValue || ++cfpTicks > 100) { clearInterval(cfpTimer); return; }
                            let cfpCurrentBody = $("#mailBody").val(), cfpCurrentState = $("#mailSubject").val() + "\u0000" + cfpCurrentBody;
                            if (cfpCurrentBody.indexOf(' ') < 0) { return; }
                            if (cfpCurrentState != cfpState) { cfpState = cfpCurrentState; cfpStable = 0; }
                            else if (++cfpStable >= 4 && cfpCurrentState != cfpTriedState) {
                                cfpTriedState = cfpCurrentState; init();
                                let cfpReplacedState = $("#mailSubject").val() + "\u0000" + $("#mailBody").val();
                                if (cfpReplacedState != cfpCurrentState) { cfpState = cfpTriedState = cfpReplacedState; cfpStable = 0; }
                            }
                        }, 300);
                    } else { init(); }
                });
            }
            if (window.location.href.indexOf("/remind/") > -1) {
                try {
                    if (GM_config.get('CfP_ReminderID') == 'Custom') {
                        waitForText(document.querySelector('#mailBody'), ' ', function () {
                            let t1 = skStringToRegex(GM_config.get('CfP_ReminderS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('CfP_ReminderS2'))));
                            let t2 = skStringToRegex(GM_config.get('CfP_ReminderB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('CfP_ReminderB2'))));
                        });
                    }
                } catch (error) { }
            }
            $('#mailBody').parent().after(`&nbsp;<a id="SpecialDiscount">📉</a>`);
            $('#SpecialDiscount').on("click", function () {
                document.getElementById('mailBody').value = document.getElementById('mailBody').value.replace(/\(\d+%/, '(with special').replace(/\nThis invitation entitles you.* after peer review. /g, "\n").replace(/\d+% discount/g, '*special discount*');
                document.getElementById('mailSubject').value = document.getElementById('mailSubject').value.replace(/\d+%/g, 'Special');
            });
        } catch (error) { }
    }

    //默认新建EBM位置
    if (window.location.href.indexOf(".mdpi.com/user/ebm-new/management") > -1) {
        try {
            if (S_J > 0) {
                unsafeWindow.$("#journal_id").val(S_J).trigger("chosen:updated");
                if (S_J == 154) { $("#role_id").val(9) } else { $("#role_id").val(10) };
                $("[href='/user/ebm-new/management/pending_invitation/my_journals").attr("href", "/user/ebm-new/management/pending_invitation/my_journals?form[journal_id]=" + S_J);
            }
            if (GM_config.get('Hidden_Func')) { $("#ebm_pending_check_btn").after(' <input class="submit" type="submit" value="Force Proceed"> '); }
        } catch (error) { }
    }

    //默认Renew EBM期刊
    if (window.location.href.indexOf(".mdpi.com/user/list/editors") + window.location.href.indexOf("/user/ebm/contract") + window.location.href.indexOf("/user/eic/contract") > -3) {
        try {
            if (S_J > 0) {
                $('a:contains("Renew EBM")').attr('href', '/user/ebm/contract?form%5Bjournal_id%5D=' + S_J);
                $('a:contains("Renew EIC")').attr('href', '/user/eic/contract?form%5Bjournal_id%5D=' + S_J);
            }
        } catch (error) { }
    }

    //PP提醒模板
    if (window.location.href.indexOf("mdpi.com/special_issue/email/planned_paper") > -1 && GM_config.get('PP_Template')) {
        try {
            unsafeWindow.$("#emailTemplates > option:contains('Follow up on Interested Authors')").prop('selected', true).trigger("change");
            function init() {
                let t1 = skStringToRegex(GM_config.get('PP_TemplateS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, GM_config.get('PP_TemplateS2')));
                let t2 = skStringToRegex(GM_config.get('PP_TemplateB1')); $("#mailBody").val($("#mailBody").val().replace(t2, GM_config.get('PP_TemplateB2')));
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init, 1000);
            $('html, body').scrollTop($('#emailTemplates_chosen').offset().top);
        } catch (error) { }
    }

    //新增PP修改邮箱1
    if (window.location.href.indexOf("mdpi.com/si/planned_paper") + window.location.href.indexOf("planned_paper/edit/") > -2) {
        $("[for='form_email']").append(` <a onclick="$('#form_email').prop('readonly', false)">[Edit]</a>`);
        $("[for='form_agreed_date']").append(` <a onclick="$('#form_agreed_date').prop('readonly', false)">[Edit]</a>`);
    }

    //新增PP修改邮箱和期刊2
    if (window.location.href.indexOf("/planned_paper/edit?email=") > -1) {
        $("[for='form_email']").append(` <a onclick="$('#form_email').prop('readonly', false)">[Edit]</a>`);
        $("[for='form_agreed_date']").append(` <a onclick="$('#form_agreed_date').prop('readonly', false)">[Edit]</a>`);
        if ($("#form_status").val() === '') { //设定PP默认值
            $("#form_status").val(2);
            $('#form_type_0').prop('checked', true);
            unsafeWindow.$('#form_journal_id').val(S_J).trigger("chosen:updated").trigger("change");
            $("#form_source").val(8);
        }
    }

    //CfP Checker
    if (window.location.href.indexOf("//redmine.mdpi.") > -1 && GM_config.get('Cfp_checker')) {
        try {
            //Always: Redmine重定向
            if (window.location.href.indexOf("//redmine.mdpi.com/") > -1) {window.location.replace(decodeURIComponent(window.location.href.split("login?back_url=")[window.location.href.split("login?back_url=").length - 1]).replace("//redmine.mdpi.com/", "//redmine.mdpi.cn/"))}
            if (window.location.href.indexOf("//redmine.mdpi.cn//") > -1) {window.location.replace(decodeURIComponent(window.location.href.replace(".cn//", ".cn/")))}
            //排队界面
            if (window.location.href.indexOf("/projects/si-planning/issues?utf8=") > -1) {
                $('[href="/users/64"]').css("background-color", "yellow"); $('h2:contains("Issues")').append(" <span style=background-color:#ff0>(" + $('[href="/users/64"]').length + " pending CfP Team)</span>");
            }
            //CfP filter链接
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/si-planning/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]==&v[status_id][]=13&v[status_id][]=113&f[]=cf_10&op[cf_10]==&v[cf_10][]=` + GM_config.get('Journal')
                                     + `&f[]=&c[]=cf_25&c[]=cf_10&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&sort=updated_on%3Adesc&per_page=100'>[CfP]</a>`) // + GM_config.get('Journal')
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/si-committee/issues?c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&f[]=status_id&utf8=%E2%9C%93&v[subject][]=[` + GM_config.get('Journal')
                                     + `&f[]=subject&f[]=&group_by=&op[status_id]=o&op[subject]=%7E&per_page=100&set_filter=1'>[SCfP]</a>`)
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/special-issue-prints/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]=o&f[]=cf_10&op[cf_10]=%3D&v[cf_10][]=` + GM_config.get('Journal')
                                     + `&f[]=&c[]=cf_10&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&sort=updated_on%3Adesc&per_page=100'>[Books]</a>`)
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/feature-paper-invitation/issues?utf8=%E2%9C%93&set_filter=1&f[]=op[status_id]=o&f[]=subject&op[subject]=~&v[subject][]=[` + GM_config.get('Journal')
                                     + `]&f[]=&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on%3Adesc&per_page=100'>[FP]</a>`)
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/ethic-committee/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]=o&f[]=subject&op[subject]=%7E&v[subject][]=` + GM_config.get('Journal')
                                     + `]&f[]=&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&group_by=&per_page=100'>[EC]</a>`)

            //Assignee切换时自动添加Dear问候语
            unsafeWindow.$(document).on("select2:select", "#issue_assigned_to_id", function(e) {
                let selectedText = e.params.data.text.trim();
                let greeting = "Dear Colleagues,";
                let nameToUse = selectedText;

                const specialKeywords = ["editor", "group", "team", "reprint", "website", "english", "admin", "manager", "coordinator", "epc", "sic", "cfp"];
                const isSpecialAssignee = specialKeywords.some(kw => selectedText.toLowerCase().includes(kw));

                if (isSpecialAssignee) {
                    greeting = "Dear " + selectedText + ",";
                    nameToUse = null;
                } else if (selectedText.toLowerCase().includes("author")) {
                    let authorEl = document.querySelector('.author a');
                    if (authorEl) { nameToUse = authorEl.innerText.trim(); }
                } else if (selectedText.toLowerCase().includes("applicant")) {
                    let applicantThs = document.querySelectorAll('th.assigned-to');
                    for (let th of applicantThs) {
                        if (th.textContent.trim().startsWith('Applicant')) {
                            let applicantLink = th.nextElementSibling?.querySelector('a.user');
                            if (applicantLink) { nameToUse = applicantLink.innerText.trim(); }
                            break;
                        }
                    }
                }
                if (nameToUse && !nameToUse.startsWith("<<") && !nameToUse.startsWith("--")) {
                    let firstName = nameToUse.split(" ")[0];
                    if (firstName && firstName.length >= 2 && /^[A-Za-z]+$/.test(firstName)) {
                        greeting = "Dear " + firstName + ",";
                    }
                }
                let currentNotes = $("#issue_notes").val();
                if (!currentNotes.trim().startsWith("Dear ")) {
                    $("#issue_notes").val(greeting + "\n\n" + (currentNotes.trim() ? currentNotes : ""));
                } else {
                    let lines = currentNotes.split("\n\n");
                    lines[0] = greeting;
                    $("#issue_notes").val(lines.join("\n\n"));
                }
            });

            //Checker功能和检测函数
            $('label:contains("From CFP Checkers")').after(" <a id='S_C'><u>[Start Check]</u></a>"); $("#S_C").on("click", sk_cfpcheck_func);


            function sk_cfpcheck_func() {
                let Today = new Date();
                $("#issue_pe_note").val($("#issue_pe_note").val() + "--- Checked on " + Today.getFullYear() + "-" + (Today.getMonth() + 1) + "-" + Today.getDate() + " ---\n");
                if ($(".subject").eq(0).text().indexOf(GM_config.get('Journal')) == -1) { $("#issue_pe_note").val($("#issue_pe_note").val() + "🚨 Cannot find [Journal Name]\n") }

                (async () => {
                    var result = "";
                    let response = await skGMFetchGet("https://titlecaseconverter.com/tcc/?title=" + encodeURIComponent($(".subject").eq(0).text().trim()) + "&preserveAllCaps=true&styleC=true");
                    let jsonarray = JSON.parse(response.responseText);
                    jsonarray[0].title.forEach(element => { result = result + element.joint + element.word });
                    if (result.match(/[a-zA-Z]*/g).join("") != $(".subject").eq(0).text().match(/[a-zA-Z]*/g).join("")) { $("#issue_pe_note").val($("#issue_pe_note").val() + "🚨 TitleCase Is Inconsistent with Chicago Style: " + result.trim() + "\n") }
                })()

                let DDL = new Date($("th:contains('Special Issue Deadline:')").next().text())
                if (Math.ceil((DDL - Today) / (1000 * 60 * 60 * 24)) < 120) { $("#issue_pe_note").val($("#issue_pe_note").val() + "❌ Deadline is less than 4 months.\n") }
                if (Math.ceil((DDL - Today) / (1000 * 60 * 60 * 24)) > 365) { $("#issue_pe_note").val($("#issue_pe_note").val() + "🚨 Deadline is longer than 12 months.\n") }

                let DecisionLink = $('a:contains("special_issue/decision/cfp_approval")').first().attr("href");
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: DecisionLink,
                    onload: function (responseDetails) {
                        var $jQueryObject = $($.parseHTML(responseDetails.responseText));
                        let DecisionSymbol = "✅", DecisionNote = "";
                        let CfP_Approval = $jQueryObject.find("div.cell.small-12.medium-6.large-2:contains('Signature')").next().text().trim();
                        let CfP_Time = $jQueryObject.find("div.cell.small-12.medium-6.large-2:contains('Decision Date')").next().text().trim().split(' ')[0];
                        let CfP_Time_Date = new Date(CfP_Time);
                        if ((Today - CfP_Time_Date) / (1000 * 3600 * 24) > 60) { DecisionSymbol = "❌"; DecisionNote = ". [Decision made 2 month ago!]" }
                        if (CfP_Approval.toLowerCase().includes("ursula") || CfP_Approval.toLowerCase().includes("vivian")) { DecisionSymbol = "🚨"; DecisionNote = ". [Decision made by Publisher! Check GE Reminder time or GE Approval Attachment.]" }
                        $("#issue_pe_note").val($("#issue_pe_note").val() + DecisionSymbol + " Approved by " + CfP_Approval + " on " + CfP_Time + DecisionNote + "\n");
                        $("#issue_pe_note").val($("#issue_pe_note").val() + "🔎 Compare decision & upload list yourself");
                    }
                });
                GM_openInTab(DecisionLink,)

                if ($(".subject").eq(0).text().indexOf("New CFP Request") > -1) { //未延期特刊
                    let CfPPass = true;
                    if ($('a:contains("mailing-list.v1")').length == 0) { $("#issue_pe_note").val($("#issue_pe_note").val() + "❌ Cannot find mailing-list.v1\n"); CfPPass = false; }
                    if (CfPPass) { $("#issue_pe_note").val($("#issue_pe_note").val() + "✅ First Round CfP\n"); }
                    GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v1")').attr('href'),)
                }
                else if ($(".subject").eq(0).text().indexOf("Extended SI") > -1) { //已延期特刊
                    let old_request = $("strong:contains('Please change the issue status to ')").parent().parent();
                    let old_DDL = new Date(old_request[old_request.length - 1].textContent.match(/Deadline: [0-9,-]*/)[0].replace("Deadline: ", ""));
                    if (DDL - old_DDL < 86400000 * 30) { $("#issue_pe_note").val($("#issue_pe_note").val() + "❌ The deadline between 2nd and 1st CfP is too close.\n") }
                    if ($('a:contains("mailing-list.v3")').length == 0) { $("#issue_pe_note").val($("#issue_pe_note").val() + "❌ Cannot find mailing-list.v3\n") }
                    else {
                        $("#issue_pe_note").val($("#issue_pe_note").val() + "✅ Extended SI CfP\n")
                        GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v1")').attr('href'),)
                        GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v3")').attr('href'),)
                        $("#issue_pe_note").val($("#issue_pe_note").val() + "🔎 Compare 1st & 2nd list yourself\n");
                    }
                }
                else { //名称不规范
                    $("#issue_pe_note").val($("#issue_pe_note").val() + "🚨 Subject is Wrong.\n")
                }

                if ($(".assigned-to").text().indexOf("CfP") == -1) { $("#issue_pe_note").val($("#issue_pe_note").val() + "🚨 Assignee is not CfP/MDPI\n") };
            }
        } catch (error) { }
    }

    //Always: Mailsdb样式⚙️🔝
    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/search/emails") > -1) {
        try {
            document.documentElement.classList.add('sk-mailsdb');
            skAddResourceStyle('mailsdbBaseCSS', 'customCSS');
            document.body.innerHTML = document.body.innerHTML.replace(/ data-url=/g, ' href=').replace(/ data-load-url=/g, ' href=');
            const mailsdbParams = new URLSearchParams(window.location.search);
            var mailsdb_email = mailsdbParams.get('search_content') || '', susycheck;

            let mailPopup = $(`<dialog id="sk-mailsdb-mail" aria-labelledby="sk-mailsdb-mail-title"><div id="sk-mailsdb-mail-toolbar"><strong id="sk-mailsdb-mail-title">Email preview</strong>
            <button type="button" aria-label="Close email preview">×</button></div><iframe title="Email content"></iframe></dialog>`).appendTo("body")[0];
            $(mailPopup).find("button").on("click", function () { mailPopup.close(); });
            $(mailPopup).on("click", function (event) { if (event.target === this) this.close(); })
                .on("close", function () { $(this).find("iframe").attr("src", "about:blank"); });
            $(mailPopup).find("iframe").on("load", function () {
                let doc = this.contentDocument;
                if (!doc) return;
                $(doc).on("keydown", function (event) { if (event.key === "Escape") { event.preventDefault(); mailPopup.close(); } });
                if (doc.location.pathname !== "/fulltext" || doc.querySelector(".download-origin-email, a[href*='download=yes']")) return;
                let downloadUrl = new URL(doc.location.href);
                downloadUrl.searchParams.set("download", "yes");
                $('<a class="download-origin-email" data-turbolinks="false">Download Original email</a>').attr("href", downloadUrl.href).appendTo(doc.body);
            });
            $("body").on("click", "a[href*='/fulltext?']", function (event) {
                let url = new URL(this.href);
                if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || url.origin !== location.origin || url.pathname !== "/fulltext" || !url.searchParams.has("code") || url.searchParams.get("download") === "yes") return;
                event.preventDefault();
                event.stopPropagation();
                $("#sk-mailsdb-mail-title").text($(this).text().trim() || "Email preview");
                $(mailPopup).find("iframe").attr("src", url.href);
                if (!mailPopup.open) mailPopup.showModal();
            });

            // Paginated searches show the mail list without the overview panels.
            if (!mailsdbParams.has('page') && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mailsdb_email)) {
                $("body").prepend(`<div><div id='d1'>Loading Invitation Record...</div><a class='scroll-icon'>⬇️ ⬇️ ⬇️ ⬇️ ⬇️</a><div id='d2'>Loading Overview...</div><a class='scroll-icon'>⬇️ ⬇️ ⬇️ ⬇️ ⬇️</a>
                <div id='d3'>Loading Review History...</div><a class='scroll-icon'>⬇️ ⬇️ ⬇️ ⬇️ ⬇️</a></div>`);
                $('.scroll-icon').on("click", function () {
                    let currentIndex = $('.scroll-icon').index(this);
                    let nextIcon = $('.scroll-icon').eq(currentIndex + 1);
                    if (nextIcon.length > 0) { $('html, body').animate({ scrollTop: nextIcon.offset().top }, 300); }
                    else { $('html, body').animate({ scrollTop: $(document).height() }, 300); }
                });

                susycheck = "https://susy.mdpi.com/user/info?emails=" + encodeURIComponent(mailsdb_email);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: susycheck,
                    onload: function (responseDetails) {
                        var $jQueryObject = $($.parseHTML(responseDetails.responseText.replace(/href="\//g, "href=\"//susy.mdpi.com/").replace(/ data-url=/g, ' href=').replace(/ data-load-url=/g, ' href=').replace(/<h1>[\s\S]*<\/h1>/g, '')));
                        $("#d2").html($jQueryObject);
                        $("#d2 a[onclick*='next().toggle()']").removeAttr("onclick").on("click", function (event) { event.preventDefault(); $(this).next().toggle(); });
                        $("#d2 .show-voucher").on("click", function (event) { event.preventDefault(); $(this).next(".discount-voucher").toggleClass("hide"); });
                        $("#d2 #Box").css("cursor", "auto").html("<h3>User Notes</h3><div>Loading notes...</div>");
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: "https://susy.mdpi.com/user/comment?emails=" + encodeURIComponent(mailsdb_email),
                            timeout: 30000,
                            onload: function (responseDetails) {
                                var $notes = $($.parseHTML(responseDetails.responseText)).filter('form[data-html-content="1"]');
                                if (responseDetails.status !== 200 || !$notes.length) { $("#d2 #Box > div").text("Unable to load user notes. Please check your SuSy login."); return; }
                                $notes.find(".author-note").parent().remove();
                                $notes.find(".delete-comment, input, button, textarea").remove();
                                $("#d2 #Box > div").empty().append($notes);
                            },
                            onerror: function () { $("#d2 #Box > div").text("Unable to load user notes. Please try again later."); },
                            ontimeout: function () { $("#d2 #Box > div").text("Loading user notes timed out. Please try again later."); }
                        });
                        $("[title='Generate unsubscribe link']").each(function () {
                            $(this).attr("href", "//scholar.google.com/scholar?hl=en&q=" + encodeURIComponent($(this).attr('data-email'))).attr("target", "_blank").text("").append('<img width="20px" height="20px" src="//www.google.com/favicon.ico">')
                        });
                        $("a:contains('Edit Reviewer')").each(function () {
                            let full_name = $(this).prev("b").text(), first_name = full_name.split(" ")[0], last_name = full_name.split(" ").pop();
                            $(this).after(' ', skIconLink('//susy.mdpi.com/user/reviewer/checking/a5ce29b8b4917729fc1dc44abf2fc686?email=' + encodeURIComponent($("[title='Generate unsubscribe link']").attr('data-email')),
                                '//susy.mdpi.com/build/img/design/susy-logo.png', { target: '_blank', rel: 'noopener noreferrer' }, { width: 20, height: 20 }),
                                ' ', skIconLink('//scholar.google.com/scholar?hl=en&q=' + encodeURIComponent(full_name), '//www.google.com/favicon.ico', { target: '_blank', rel: 'noopener noreferrer' }, { width: 20, height: 20 }),
                                ' ', skIconLink('//www.scopus.com/pages/search/authors?firstName=' + encodeURIComponent(first_name) + '&lastName=' + encodeURIComponent(last_name), icon_scopus, { target: '_blank', rel: 'noopener noreferrer' }));
                        });

                        if ($jQueryObject.find("a:contains('Edit Reviewer')").length) {
                            let ReviewerHistory = $jQueryObject.find("a:contains('Edit Reviewer')").attr("href").replace('//susy.mdpi.com/reviewer/management/edit', '//susy.mdpi.com/list/reviewer/invitations-history');
                            $jQueryObject.find("a:contains('Edit Reviewer')").parent().find('td').each(function () {
                                let ranking = skGetUniv($(this).text().trim());
                                if (ranking.color) {
                                    skAddResourceStyle('tooltipsterCSS', 'tooltipsterNoirCSS', 'tooltipster-style');
                                    $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                        .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                                }
                            })

                            GM_xmlhttpRequest({
                                method: 'GET',
                                url: ReviewerHistory,
                                onload: function (responseDetails) {
                                    var $jQueryObject2 = $($.parseHTML(responseDetails.responseText.replace(/data-load-url="\/user/g, 'data-load-url="//susy.mdpi.com/user')));
                                    $("#d3").html($jQueryObject2);
                                }
                            });
                        } else {
                            $("#d3").html("No Review Record");
                        }
                    }
                });

                var si_id = String(GM_config.get('GE_Check_SI_ID') || "342143").trim();
                susycheck = "https://susy.mdpi.com/user/guest_editor/check?email=" + encodeURIComponent(mailsdb_email) + "&special_issue_id=" + encodeURIComponent(si_id);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: susycheck,
                    onload: function (responseDetails) {
                        var $jQueryObject = $($.parseHTML(responseDetails.responseText.replace(/data-load-url="\/user/g, 'data-load-url="//susy.mdpi.com/user')));
                        $("#d1").html($jQueryObject);
                        $("#d1 .table-show-hide-btn").on("click", function (event) { event.preventDefault(); let rows = $(this).closest("table").find(".show-hide-tr").toggle(); $(this).text(rows.is(":visible") ? "Show less" : "Show more"); });
                        $("[data-title='Blocked Info']").attr("href", "//susy.mdpi.com" + $("[data-title='Blocked Info']").attr("data-uri"));
                    }
                });
            }
        } catch (error) { }
    }

    //Always: Reviewer checking样式⚙️
    if (window.location.href.indexOf("reviewer/checking/") > -1) {
        try {
            let Reviewer_ID = $(".morphNotes").attr("data-load-url").match(/morph_notes\/(\d+)/)[1];
            GM_xmlhttpRequest({
                method: 'GET',
                url: "/list/reviewer/invitations-history/" + Reviewer_ID,
                onload: function (responseDetails) {
                    $("body").append(responseDetails.responseText.replace(/href="\//g, "href=\"//susy.mdpi.com/"));
                }
            });
            let reviewerEmail = new URLSearchParams(window.location.search).get('email') || '';
            $(".morphNotes").first().before(' ', skIconLink('https://scholar.google.com/scholar?hl=en&q=' + encodeURIComponent(reviewerEmail),
                'https://www.google.com/favicon.ico', {}, { style: 'vertical-align: middle;', width: 20, height: 20 }), ' ');
            $("a:contains('see more')").attr('href', $("a:contains('see more')").attr('data-uri'));
        } catch (error) { }
    }

    //Always: QC换行问题
    if (window.location.href.indexOf("quality/check/") > -1) {
        try {
            if ($("tr th.user_box_head:nth-child(7)").text() == "Note") {
                $("tr td.user_box_item:nth-child(7)").css("width", "200px").each(function () {
                    $(this).html($(this).html().replace(/\n/g, '<br>\n'));
                });
            }
            $('a[data-title="Quality Check"]').on("click", skLineBreakForQC);
        } catch (error) { }
    }

    //Always: Paper ID to page
    if (window.location.href.indexOf(".mdpi.com/ajax/submission_get_manuscripts") > -1) {
        try {
            let jsonObject = JSON.parse($("body").text().replace(/\\/g, ''));
            document.body.style.cssText = '';
            if (jsonObject[0]) {
                document.body.innerHTML = '<p>' + jsonObject[0].label + '</p><p>&nbsp;</p><p>https://susy.mdpi.com' + jsonObject[0].url + '</p><p>&nbsp;</p><p>Redirecting...</p>';
                window.location.href = jsonObject[0].url + window.location.search;
            } else {
                document.body.innerHTML = '<p>Wrong Manuscript ID or No Access Permission.</p>'
            }
        } catch (error) { }
    }

    //Always: Paper ID to page Beta
    if (window.location.href.indexOf(".mdpi.com/build/img/design/susy-logo.png") > -1) {
        try {
            let TrueUrl = location.href.replace("mdpi.com/build/img/design/susy-logo.png", "mdpi.com/ajax/submission_get_manuscripts");
            $.get(TrueUrl, function (jsonObject) {
                document.body.style.cssText = '';
                if (jsonObject[0]) {
                    document.body.innerHTML = '<p>' + jsonObject[0].label + '</p><p>&nbsp;</p><p>https://susy.mdpi.com' + jsonObject[0].url + '</p><p>&nbsp;</p><p>Redirecting...</p>';
                    window.location.href = jsonObject[0].url + window.location.search;
                } else {
                    document.body.innerHTML = '<p>Wrong Manuscript ID or No Access Permission.</p>'
                }
            });
        } catch (error) { }
    }

    //Always: Unsubscribe link to page
    if (window.location.href.indexOf(".mdpi.com/user/get/unsubscribe_manage_link") > -1) { try { $.get(window.location.href, function (res) { window.location.href = res.link }) } catch (error) { } }

    //Hidden_Func: PSAN Redirect
    if (window.location.href == 'https://admin.mdpi.com/' && GM_config.get('Hidden_Func')) { try { window.location.href = 'https://admin.mdpi.com/tools/email-purger/email-list' } catch (error) { } }

    //PSAN Journal
    if (window.location.href.indexOf("admin.mdpi.com/tools/email-purger/") > -1) {
        try {
            $('#ExcelMailPurgerEmailList_full_name,#ExcelMailPurgerEmailList_exclude_cfr').prop('checked', false);
            $('#ExcelMailPurgerEmailList_sanctions').prop('checked', true);
            $("div[id^='ExcelMailPurger'].chzn-container").remove();
            unsafeWindow.$("select[id^='ExcelMailPurger'].chosen.chzn-done").val(S_J).removeClass('chzn-done').chosen({ allow_single_deselect: true });
        } catch (error) { }
    }

    //Hidden_Func: TAP - Assign to another Editor
    if (window.location.href.indexOf("tap/list/") > -1 && window.location.href.indexOf("/my_journals") > -1 && GM_config.get('Hidden_Func')) {
        try {
            let editorColumnIndex, emailColumnIndex;
            $("tr th.user_box_head").each(function (index) {
                if ($(this).text().trim() == 'Responsible Editor') { editorColumnIndex = index + 1; }
                if ($(this).text().trim() == 'Email') { emailColumnIndex = index + 1; }
            });
            if (editorColumnIndex) {
                $("tr td.user_box_item:nth-child(" + editorColumnIndex + ")").each(function () {
                    if ($(this).html().indexOf("Assign to another Editor") == -1) {
                        let tap_id = $(this).parent().find("[title='TAPM Feed']").attr("data-url").split("_id=").pop();
                        let changeUrl = '/tap/change_user/' + encodeURIComponent(tap_id);
                        $(this).append(skIconLink(changeUrl, icon_pencil, { 'data-url': changeUrl, class: 'ajax-form-submit-btn' }, { title: 'Assign to another Editor' }));
                    }
                });
            }
            if (emailColumnIndex) {
                $("tr td.user_box_item:nth-child(" + emailColumnIndex + ")").each(function () {
                    let tap_email = $(this).text().trim();
                    $(this).append(' ', skIconLink(skMailsdbUrl(tap_email), icon_magnifier, { target: '_blank', rel: 'noopener noreferrer' }));
                });
            }
        } catch (error) { }
    }

    //Always: MRS Quick Statistics
    if (location.href.indexOf('mrs.mdpi.com/login_check_ajax#statistics') > -1) {
        const loginStatus = document.body.textContent.trim();
        if (loginStatus === 'false') { sessionStorage.setItem('mrs.login_redirect', '1'); location.replace('/login'); return; }
        sessionStorage.removeItem('mrs.login_redirect');
        if (loginStatus !== 'true') return;
        const cacheKey = 'mrs.c', searchesKey = 'mrs.s', lastQueryKey = 'mrs.q';
        const containers = { journals: 'allJurnals', employees: 'allEmplyees', offices: 'allOffices', sections: 'allSections' };
        const readStored = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (_) { return fallback; } };
        const store = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* Storage is optional. */ } };
        function readCatalog(source) {
            const lists = {};
            for (const [kind, id] of Object.entries(containers)) {
                lists[kind] = Array.from(new Map(Array.from(source.querySelectorAll('#' + id + ' input[type="checkbox"]')).map(input => [input.value, {
                    id: input.value, label: (input.nextElementSibling?.textContent?.trim() || input.dataset.name || input.labels?.[0]?.textContent || input.value).trim(),
                }])).values());
            }
            lists.metrics = Array.from(source.querySelectorAll('#statisticSelecter option')).map(option => ({
                value: option.value, label: option.textContent.trim(), group: option.parentElement.label || '',
            }));
            return lists;
        }
        let savedSearches = GM_getValue(searchesKey, []).map(search => typeof search === 'string' ? JSON.parse(search) : search);
        const startupSearches = savedSearches.filter(search => search.autoStart);
        const cached = readStored(cacheKey, {}), settings = startupSearches[0]?.state || readStored(lastQueryKey, {});
        const saveSearches = () => GM_setValue(searchesKey, savedSearches.map(search => JSON.stringify(search)));
        skAddResourceStyle(['mrsScreenCSS', 'mrsMainCSS', 'mrsLayoutCSS', 'flatpickrCSS', 'customCSS']);
        const catalog = {
            journals: cached.journals?.length ? cached.journals : Object.entries(skGetJid()).map(([label, id]) => ({ id: String(id), label })),
            employees: [], offices: [], sections: [],
            metrics: cached.metrics?.length ? cached.metrics : [{ value: 'Papers Published', label: 'Papers Published', group: '' }],
        };
        const selected = Object.fromEntries(Object.keys(containers).map(kind => [kind, new Set(settings.selected?.[kind] || (kind === 'journals' ? [String(S_J > 0 ? S_J : 154)] : []))]));
        const pageWindow = unsafeWindow;
        let queryGeneration = 0, pendingQueries = 0, chartIndex = 0;
        const root = document.createElement('div');
        root.id = 'ms';
        root.innerHTML = `
            <div id="container"><div id="topmenu"><div id="projectsMenu"><a href="/statistics">Statistics</a> | <a href="/data/">Data</a> | <b>Quick Statistics</b> | <a href="https://mrs.mdpi.cn/">MRS 2.0</a></div></div>
            <div id="main"><div class="colcontainer"><div id="contentcontainer"><div id="content"><div class="contentwrap"><div class="itemwrap">
                <div id="formMenu" style="height:auto"><div id="saved_search_list" style="width:96.5%"></div><form id="ms-form">
                    <section id="statistic" class="box" style="overflow:visible"><span class="big">Statistic</span><br><br><select id="ms-stat" aria-label="Statistic"></select></section>
                    <section id="ms-filter" class="box" style="width:56%;overflow:visible"><span class="big">Filter</span><br><br>
                        <div id="ms-kinds"><label><span>Journals</span><input type="radio" name="ms-kind" value="journals" checked></label><label><span>Employees</span><input type="radio" name="ms-kind" value="employees"></label>
                            <label><span>Offices</span><input type="radio" name="ms-kind" value="offices"></label><label><span>Sections</span><input type="radio" name="ms-kind" value="sections"></label></div>
                        <div id="ms-fav" style="margin:12px 0"></div><select id="ms-items" multiple data-placeholder="Select..." aria-label="Filter items"></select>
                    </section>
                    <section id="options" class="box"><span class="big">Options</span><select id="date-format" aria-label="Date format"><option value="Y-m-d">Daily</option>
                        <option value="weekly">Weekly</option><option value="Y-m" selected>Monthly</option><option value="Quarterly">Quarterly</option><option value="Y">Yearly</option></select>
                        <br><label for="from-date">From:</label><input type="text" id="from-date" placeholder="YYYY-MM-DD" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" maxlength="10" required>
                        <br><label for="to-date">To:</label><input type="text" id="to-date" placeholder="YYYY-MM-DD" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" maxlength="10" required><br><br>
                        <div class="search-type">Search Type: <label><input type="radio" name="ms-type" value="0" checked>Basic</label>
                            <label><input type="radio" name="ms-type" value="1">MoM</label><label><input type="radio" name="ms-type" value="2">YoY</label></div>
                        <div class="optionButton"><label for="ms-one">One graph</label><input type="checkbox" id="ms-one" name="oneGraph"></div>
                        <div class="optionButton"><label for="ms-bar">Bar view</label><input type="checkbox" id="ms-bar" name="barView" checked></div>
                        <div class="optionButton"><label for="ms-sect">Article Sections</label><input type="checkbox" id="ms-sect" name="articleSections"></div>
                        <div class="optionButton"><label for="ms-si">Article SIs</label><input type="checkbox" id="ms-si" name="articleSIs"></div>
                        <div class="optionButton"><label for="ms-all">All Article</label><input type="checkbox" id="ms-all" name="allArticle"></div>
                    </section>
                    <div class="clear"></div><div id="reload" class="actionButtons">Reload</div>
                        <div id="ms-prepend" class="actionButtons" style="width:auto;white-space:nowrap">Search &amp; Keep</div>
                        <div id="save_search" class="actionButtons">Save Search</div>
                        <span id="ms-status" role="status">Ready.</span><div class="clear"></div>
                </form></div>
                <div id="ms-results"></div>
            </div></div></div></div></div></div></div>`;
        document.body.replaceChildren(root); document.title = 'MRS | Quick Statistics';
        const find = selector => root.querySelector(selector);
        const form = find('#ms-form'), metric = find('#ms-stat'), items = find('#ms-items');
        const queryStatus = find('#ms-status');
        const currentKind = () => find('input[name="ms-kind"]:checked').value;
        function getState() {
            const fields = form.querySelectorAll('#from-date,#to-date,#ms-stat,#date-format,input[type=checkbox][id^="ms-"]');
            return {
                kind: currentKind(), items: Array.from(items.selectedOptions).map(option => ({ id: option.value, label: option.textContent })),
                selected: Object.fromEntries(Object.entries(selected).map(([kind, ids]) => [kind, [...ids]])),
                fields: Object.fromEntries(Array.from(fields).map(input => [input.id, input.type === 'checkbox' ? input.checked : input.value])),
                searchType: find('input[name="ms-type"]:checked').value,
            };
        }
        function refreshMetrics() {
            const value = metric.value || settings.fields?.['ms-stat'] || 'Papers Published';
            for (const item of catalog.metrics) {
                if (Array.from(metric.options).some(option => option.value === item.value)) continue;
                let parent = Array.from(metric.children).find(group => group.tagName === 'OPTGROUP' && group.label === item.group);
                if (item.group && !parent) { parent = document.createElement('optgroup'); parent.label = item.group; metric.append(parent); }
                (parent || metric).append(new Option(item.label, item.value));
            }
            metric.value = Array.from(metric.options).some(option => option.value === value) ? value : 'Papers Published';
            if ($(metric).data('chosen')) $(metric).trigger('chosen:updated');
        }
        function refreshSelection() {
            for (const input of root.querySelectorAll('input[data-kind]')) input.checked = selected[input.dataset.kind].has(input.value);
        }
        function refreshChoices() {
            const kind = currentKind(), fragment = document.createDocumentFragment();
            for (const item of catalog[kind]) fragment.append(new Option(item.label, item.id, false, selected[kind].has(item.id)));
            items.replaceChildren(fragment); $(items).trigger('chosen:updated'); refreshSelection();
        }
        function applySettings(state) {
            for (const kind of Object.keys(containers)) if (state.selected?.[kind]) selected[kind] = new Set(state.selected[kind]);
            const kind = Object.hasOwn(containers, state.kind) ? state.kind : 'journals';
            find(`input[name="ms-kind"][value="${kind}"]`).checked = true;
            catalog[kind] = Array.from(new Map([...(state.items || []), ...catalog[kind]].map(item => [item.id, item])).values());
            for (const [id, value] of Object.entries(state.fields || {})) {
                const input = find('#' + id);
                if (!input) continue;
                if (input.type === 'checkbox') input.checked = Boolean(value);
                else if (input.tagName !== 'SELECT' || Array.from(input.options).some(option => option.value === value)) input.value = value;
            }
            find(`input[name="ms-type"][value="${['0', '1', '2'].includes(state.searchType) ? state.searchType : '0'}"]`).checked = true;
            refreshChoices(); $(metric).trigger('chosen:updated');
        }
        function renderSavedSearches() {
            const table = document.createElement('table'), heading = table.createTHead().insertRow(), body = table.createTBody(); table.style.width = '100%';
            for (const title of ['Name', 'Statistic', 'Filter', 'FromDate', 'ToDate', 'Auto start', 'Action']) {
                const cell = document.createElement('th'); cell.textContent = title; heading.append(cell);
            }
            savedSearches.forEach((search, index) => {
                const { state } = search, fields = state.fields, row = body.insertRow(), link = document.createElement('a'), remove = document.createElement('a');
                link.href = '#'; link.textContent = search.name;
                link.addEventListener('click', event => { event.preventDefault(); applySettings(search.state); form.requestSubmit(); });
                row.insertCell().append(link);
                const labels = state.items?.map(item => item.label).join(', ') || state.selected[state.kind]?.join(', ') || '';
                const filter = `${state.kind}: ${labels}`, summary = filter.length > 48 ? filter.slice(0, 48) + '…' : filter;
                for (const value of [fields['ms-stat'], summary, fields['from-date'], fields['to-date']]) row.insertCell().textContent = value;
                row.cells[2].title = filter;
                const autoStart = document.createElement('input'); autoStart.type = 'checkbox'; autoStart.checked = Boolean(search.autoStart);
                autoStart.setAttribute('aria-label', 'Auto start ' + search.name);
                autoStart.addEventListener('change', () => { search.autoStart = autoStart.checked; saveSearches(); }); row.insertCell().append(autoStart);
                remove.href = '#'; remove.className = 'remove_search'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', 'Remove ' + search.name);
                remove.addEventListener('click', event => {
                    event.preventDefault();
                    if (!pageWindow.confirm(`Remove saved search "${search.name}"?`)) return;
                    savedSearches = savedSearches.filter(item => item !== search); saveSearches(); renderSavedSearches();
                });
                const action = row.insertCell(); action.style.whiteSpace = 'nowrap'; action.append(remove, '\u2003');
                [-1, 1].forEach(step => {
                    const target = index + step;
                    const move = document.createElement('a'); move.href = '#'; move.textContent = step < 0 ? '⬆️' : '⬇️'; move.title = step < 0 ? 'Move up' : 'Move down';
                    move.style.cssText = 'display:inline-block;width:1.8em';
                    if (target < 0 || target >= savedSearches.length) move.style.visibility = 'hidden';
                    else {
                        move.addEventListener('click', event => {
                            event.preventDefault();
                            [savedSearches[index], savedSearches[target]] = [savedSearches[target], savedSearches[index]];
                            saveSearches(); renderSavedSearches();
                        });
                    }
                    action.append(move);
                });
            });
            find('#saved_search_list').replaceChildren(...(savedSearches.length ? [table] : []));
        }
        for (const item of SK_MRS_FAVORITES) {
            const label = document.createElement('label'), input = document.createElement('input');
            input.type = 'checkbox'; input.value = item.id; input.dataset.kind = 'journals';
            label.append(input, document.createTextNode(item.label)); find('#ms-fav').append(label);
        }
        refreshMetrics();
        const year = new Date().getFullYear(); find('#from-date').value = `${year}-01-01`; find('#to-date').value = `${year}-12-31`;
        applySettings(settings); renderSavedSearches();
        $(form).on('change', event => {
            const input = event.target;
            if (input === items) { selected[currentKind()] = new Set($(items).val()); refreshSelection(); }
            if (input.dataset.kind) {
                const ids = selected[input.dataset.kind]; input.checked ? ids.add(input.value) : ids.delete(input.value);
                find('input[name="ms-kind"][value="journals"]').checked = true; refreshChoices();
            }
        });
        find('#ms-kinds').addEventListener('click', event => {
            if (event.target.type !== 'radio') return;
            refreshChoices(); $(items).trigger('chosen:open');
        });
        function flashButton(button) { button.classList.remove('ms-clicked'); void button.offsetWidth; button.classList.add('ms-clicked'); }
        find('#reload').addEventListener('click', event => { flashButton(event.currentTarget); form.requestSubmit(); });
        find('#ms-prepend').addEventListener('click', event => { flashButton(event.currentTarget); submitQuery(true); });
        find('#save_search').addEventListener('click', event => {
            flashButton(event.currentTarget);
            if (!validateQuery()) return;
            const name = pageWindow.prompt('Search name:')?.trim(); if (!name) return;
            const autoStart = Boolean(savedSearches.find(search => search.name === name)?.autoStart);
            savedSearches = savedSearches.filter(search => search.name !== name);
            savedSearches.push({ name, state: getState(), autoStart }); saveSearches(); renderSavedSearches();
        });
        // Keep lists on GM and chart queries on fetch so the large download does not block queries.
        skGMFetchGet('https://mrs.mdpi.com/statistics', 120000).then(response => {
            const source = new DOMParser().parseFromString(response.responseText, 'text/html');
            const lists = readCatalog(source);
            if (!lists.journals.length || !lists.metrics.length) return;
            Object.assign(catalog, lists);
            store(cacheKey, { journals: catalog.journals, metrics: catalog.metrics });
            refreshMetrics(); refreshChoices();
            for (const input of find('#ms-kinds').querySelectorAll('input')) {
                input.previousElementSibling.textContent = `${input.value[0].toUpperCase() + input.value.slice(1)} (${catalog[input.value].length})`;
            }
        }).catch(() => {});
        function validateQuery() {
            if (!form.reportValidity()) return false;
            if (selected[currentKind()].size && find('#from-date').value <= find('#to-date').value) return true;
            queryStatus.textContent = 'Check filters.'; return false;
        }
        async function runQuery(controller, { append = false, prepend = false, name = '', showTable = true } = {}) {
            const kind = currentKind(), from = find('#from-date').value, to = find('#to-date').value;
            store(lastQueryKey, getState()); $(items).trigger('chosen:close');
            const results = find('#ms-results'), block = document.createElement('div'), chart = document.createElement('div');
            if (!append && !prepend) {
                for (const previous of results.querySelectorAll('.ms-chart')) zingchart.exec(previous.id, 'destroy');
                results.replaceChildren();
            }
            if (name) { const title = document.createElement('h3'); title.textContent = name; block.append(title); }
            const loading = document.createElement('p'); loading.className = 'ms-loading'; loading.textContent = name ? `Loading: ${name}…` : 'Loading…';
            chart.id = 'ms-chart-' + ++chartIndex; chart.hidden = true; block.append(loading, chart);
            if (prepend) results.prepend(block); else results.append(block);
            pendingQueries++;
            const updateStatus = text => { queryStatus.textContent = pendingQueries > 1 ? `Loading (${pendingQueries})…` : pendingQueries ? 'Loading…' : text; };
            updateStatus(loading.textContent); const started = performance.now();
            const abort = () => controller.abort(); root.addEventListener('ms:abort-all', abort, { once: true });
            const data = new URLSearchParams({
                from, to, employees: kind + ':' + [...selected[kind]].join(','), statistic: metric.value,
                dateFilter: find('#date-format').value, type: find('input[name="ms-type"]:checked').value,
                download: 'false', articletypes: 'articletype:', articleTopics: 'false', editorJournalId: '0', marketingJournalId: '0',
                'min-y': '', 'max-y': '', y_step: '', invoiceDate: 'false', invoiceVat: 'false', budgetPaid: 'false',
                billingConfirmed: 'false', isShowNums: 'false', confirmationDate: 'false', transferType: 'false',
            });
            for (const input of form.querySelectorAll('input[type=checkbox][name]')) data.set(input.name, String(input.checked));
            try {
                const response = await fetch('/statistic', { method: 'POST', credentials: 'same-origin', body: data, signal: controller.signal });
                const result = await response.json();
                if (controller.signal.aborted) { pendingQueries--; return; }
                const graph = result.graph || result, graphs = graph.graphset || [graph];
                if (!graphs.some(item => Array.isArray(item.series))) throw new Error();
                const comparisonMode = data.get('type') === '1' ? 'MoM' : data.get('type') === '2' ? 'YoY' : '';
                if (comparisonMode) {
                    for (const item of graphs) {
                        if (!Array.isArray(item.series)) continue;
                        const suffix = ` ${comparisonMode} Comparison Data`, current = item.series.filter(series => !series.text?.endsWith(suffix));
                        item.series = current.map(series => {
                            const baseline = item.series.find(other => other.text === series.text + suffix);
                            if (!baseline) throw new Error();
                            const values = series.values.map((value, index) => {
                                const previous = baseline.values[index], present = Number(value), past = Number(previous);
                                if (value == null || value === '' || previous == null || previous === '' || !Number.isFinite(present) || !Number.isFinite(past) || present === 0 || past === 0) return null;
                                return Number(((present - past) / past * 100).toFixed(2));
                            });
                            return { ...series, text: `${series.text} ${comparisonMode} (%)`, values };
                        });
                        item.title = { ...item.title, text: `${item.title?.text || data.get('statistic')} — ${comparisonMode} change (%)` };
                        item['scale-y'] = { ...item['scale-y'], format: '%v%', label: { text: `${comparisonMode} change (%)` } };
                        item.plot = { ...item.plot, 'tooltip-text': '%t<br>%v%', 'value-box': { ...item.plot?.['value-box'], text: '%v%', visible: false } };
                    }
                }
                const tables = document.createDocumentFragment();
                if (showTable) {
                    for (const item of graphs) {
                        if (!Array.isArray(item.series)) continue;
                        const table = document.createElement('table'), caption = table.createCaption(); table.className = 'border'; table.style.width = '100%';
                        caption.textContent = item.title?.text || `${data.get('statistic')} ${from} – ${to}`;
                        const labels = item['scale-x']?.values || item.scaleX?.values || [], heading = table.createTHead().insertRow();
                        const th = document.createElement('th'); th.className = 'col-caption'; th.textContent = 'Date'; heading.append(th);
                        for (const series of item.series) { const cell = document.createElement('th'); cell.className = 'col-caption'; cell.textContent = series.text || 'Value'; heading.append(cell); }
                        const body = table.createTBody(), length = Math.max(labels.length, ...item.series.map(series => series.values?.length || 0));
                        for (let index = 0; index < length; index++) {
                            const row = body.insertRow(); row.insertCell().textContent = labels[index] ?? String(index + 1);
                            for (const series of item.series) {
                                const value = series.values?.[index];
                                row.insertCell().textContent = value == null ? (comparisonMode ? '—' : '') : comparisonMode ? value.toFixed(2) + '%' : String(value);
                            }
                        }
                        tables.append(table);
                    }
                }
                loading.remove(); block.append(tables);
                chart.hidden = false;
                zingchart.render({ id: chart.id, output: 'svg', width: '100%', height: Math.max(400, graphs.length * 400), data: graph }); chart.className = 'ms-chart';
                pendingQueries--; updateStatus(`Done (${((performance.now() - started) / 1000).toFixed(2)} s).`);
            } catch (error) {
                pendingQueries--;
                if (!controller.signal.aborted) {
                    loading.textContent = 'Failed.'; updateStatus('Failed.');
                }
            } finally {
                root.removeEventListener('ms:abort-all', abort);
            }
        }
        function submitQuery(prepend = false) {
            if (!validateQuery()) return;
            if (!prepend) { queryGeneration++; root.dispatchEvent(new Event('ms:abort-all')); }
            runQuery(new AbortController(), { prepend });
        }
        form.addEventListener('submit', event => { event.preventDefault(); submitQuery(); });
        skAddResourceStyle('chosenCSS');
        $(metric).chosen({ width: '240px' }).next('.chosen-container').find('.chosen-drop').css({ width: '360px', 'white-space': 'nowrap' });
        $(items).chosen({ width: '100%', search_contains: true, hide_results_on_select: false });
        flatpickr([find('#from-date'), find('#to-date')], {
            dateFormat: 'Y-m-d', allowInput: true, showMonths: 2, disableMobile: true, locale: { firstDayOfWeek: 1 },
            positionElement: find('#to-date'),
            onOpen(_, __, picker) { picker.setDate(picker.input.value, false); },
        });
        if (startupSearches.length) {
            const generation = ++queryGeneration;
            (async () => {
                for (const [index, search] of startupSearches.entries()) {
                    if (generation !== queryGeneration) break;
                    applySettings(search.state);
                    if (validateQuery()) await runQuery(new AbortController(), { append: index > 0, name: search.name, showTable: false });
                }
            })();
        } else if (settings.fields) form.requestSubmit();
    }

    //Always: MRS Chosen
    if (window.location.href.indexOf("//mrs.mdpi.com/statistics") > -1) {
        if (sessionStorage.getItem('mrs.login_redirect')) { sessionStorage.removeItem('mrs.login_redirect'); location.replace('/login_check_ajax#statistics'); return; }
        try {
            skAddResourceStyle('chosenCSS');
            $('<style>').text('.chosen-container .chosen-results{max-height:65vh}').appendTo('head');
            $('#statisticSelecter').on('change', function (event) {
                if (!event.originalEvent) this.dispatchEvent(new Event('change', { bubbles: true }));
            });
            function toggleChosen() {
                const select = $('#statisticSelecter');
                if (select.data('chosen')) {
                    select.chosen('destroy'); $('#statistic').css('overflow', 'auto');
                } else {
                    select.chosen({ width: '240px' }); $('#statistic').css('overflow', 'visible');
                    select.next('.chosen-container').find('.chosen-drop').css({ width: '360px', 'white-space': 'nowrap' });
                }
            }
            toggleChosen();
            $("#statistic > span").after("<br><br>").wrapInner('<a id="s_chosen"></a>').on("click", function () { toggleChosen() });

            if (GM_config.get('Hidden_Func')) {
                function syncCheckboxes(checkbox1, checkbox2) { // 同步两个复选框的状态
                    checkbox1.on('change', function () {
                        checkbox2.prop('checked', $(this).prop('checked'));
                    });
                }
                const checkboxes = SK_MRS_FAVORITES;
                $('#filter').append(`<div style="display: block;" id="SynaAdd">&emsp;&emsp;&emsp;</div>`);

                checkboxes.forEach(function (checkbox) {
                    let originalCheckbox = $('#journal_' + checkbox.id);
                    if (originalCheckbox.length) {
                        let isChecked = originalCheckbox.prop('checked');
                        let newCheckbox = $('<input>', {
                            type: 'checkbox',
                            id: 'new_' + checkbox.id,
                            class: 'journals_selected',
                            value: originalCheckbox.val(),
                            'data-name': originalCheckbox.data('name')
                        }).prop('checked', isChecked);
                        let label = `<label for="new_${checkbox.id}">${checkbox.label}</label>&emsp;&#9;`
                        $('#SynaAdd').append(newCheckbox).append(label);
                        syncCheckboxes(originalCheckbox, newCheckbox);
                        syncCheckboxes(newCheckbox, originalCheckbox);
                    }
                });
            }
        } catch (error) { }
    }

    if (window.location.href.indexOf("/volunteer/reviewer/email/") > -1) {
        try {
            $('html, body').scrollTop($('#mailSubject').offset().top);
        } catch (error) { }
    }

    //Always: Reviewer Information is not required
    if (window.location.href.indexOf(".mdpi.com/reivewer/create") > -1) {
        try {
            $("#form_affiliation, #form_country, #form_research_keywords").attr("required", false);
            $("#form_url").val(".");
            $('[for="form_affiliation"]>span, [for="form_url"]>span, [for="form_country"]>span, [for="form_research_keywords"]>span').remove();
        } catch (error) { }
    }

    //Always: Manuscript Notes in Summary Page
    if (window.location.href.indexOf(".mdpi.com/manuscript/summary") > -1) {
        try {
            $("#maincol").after('<div id="manuscript_note_offcanvas" class="hide-note-offcanvas"></div>');
            $.get("/user/nots_of_manuscript/" + window.location.href.match("summary/(.*?)(/|$)")[1], function (res) {
                if (res.show_off_canvas) {
                    $('#manuscript_note_offcanvas').html(res.note_html);
                    $('#manuscript_note_offcanvas').removeClass('hide-note-offcanvas');
                    $('#manuscript_note_offcanvas').find('.manuscript-id').show();
                }
            });
        } catch (error) { }
    }

    //Always: Mailsdb登陆打勾
    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/login") > -1) { try { $("[name=p_s]").attr('checked', true); $("#check-rem").attr('checked', true); } catch (error) { } }

    //Always: Manage Voucher Applications + 页面最底端
    if (window.location.href.indexOf(".mdpi.com/voucher/application/list/") > -1) { try { document.getElementById("show-more-budgets").trigger("click"); } catch (error) { } }
    if (window.location.href.indexOf(".mdpi.com/voucher/application/view/") > -1) {
        try {
            if (/guest editor|by editorial board/i.test($("div.cell.large-2:contains('Reason')").next().text())) {
                $.get($("div.cell.large-2:contains('Manuscript ID')").next().find("a").attr("href"), function (res) {
                    let warn = [];
                    if (res.includes("Self-submission")) warn.push("Manuscript Source is \"Self-submission\", which is incorrect for an invited paper.");
                    if (!res.includes('title="Planned Paper"')) warn.push("No Planned Paper is linked to this manuscript.");
                    if (warn.length) alert(warn.join("\n\n"));
                });
            }
            $("[value='Approve']").on("click", function () {
                waitForKeyElements("button:contains('confirm')", click_confirm, false);
                function click_confirm() { $("button:contains('confirm')").trigger("click") }
            })
            waitForKeyElements(".user_box_head", voucher_scroll, false); function voucher_scroll() { scroll(0, document.body.scrollHeight) };
        } catch (error) { }
    }
    if (window.location.href.indexOf(".mdpi.com/voucher/application/create?") > -1) {
        try {
            waitForKeyElements("#field-form_emails", ObserveEmail, false); function ObserveEmail() {
                let targetNode = document.getElementById('field-form_emails');
                let observer = new MutationObserver(function () {
                    if ($("#field-form_emails:contains('[Edit]')").length) { return; }
                    $("#field-form_emails fieldset>div:contains('Name:')").children().last().append("<a id='update_reviewer'>[Edit]</a>");
                    $("#update_reviewer").on("click", function () {
                        $("body").css('cursor', 'wait');
                        $.get("/list/reviewers/by-email-query?showName=1&term=" + $("#form_emails").val(), function (res) {
                            GM_openInTab("https://susy.mdpi.com/reivewer/managment/edit/" + res[0].id, { active: true });
                            $("body").css('cursor', 'default');
                        });
                    })
                });
                observer.observe(targetNode, { characterData: true, childList: true, subtree: true });
            };
        } catch (error) { }
    }

    //Always: Editor Decision 返回处理界面
    if (window.location.href.indexOf("decision/process_form/") > -1) {
        try {
            $("div.cell.small-12.medium-6.large-2:contains('Manuscript ID')").next().append($('<a>').attr('href', '/user/assigned/process_form/' + $("a:contains('Download Manuscript')").attr('href').match('displayFile/(.*?)(/|$)')[1]).text('[Back to Manuscript]'));
        } catch (error) { }
    }

    //Always: SI First/Final Decision
    if (window.location.href.indexOf("special_issue/eic_decision/") + window.location.href.indexOf("special_issue/si_decision/") > -2) {
        try {
            let str = $("#topmenu span:contains('@mdpi.com')").text().replace("@mdpi.com", "").replace(".", " ");
            let sk_signature = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            $("#form_signature").val(sk_signature);
            $("#form_decision_0").prop("checked", true)[0]?.dispatchEvent(new Event("change", { bubbles: true }));

            // 从 SI 页面读取 Section 开头的代号。
            function detectSection() {
                let sectionText = $('#maincol div.cell').filter(function () { return /^Section\s*[:：]?$/i.test($(this).text().trim()); }).first().next().text().trim();
                return sectionText.match(/^([A-E]\d?):/)?.[1];
            }

            let stopWords = ['and','the','for','with','from','into','its','any','all','new','via','using','of','mathematical','mathematics','methods','method','applications','application'];
            function getSITitleWords() {
                let siTitle = $("div.cell.small-12.medium-6.large-2:contains('Special Issue Title')").next().find("a").first().text().trim();
                siTitle += ';' + $("div.cell.small-12.medium-6.large-2:contains('Keywords')").next().text().replace(/[\r\n]+/g, ';');
                let terms = new Set(), phraseWords = new Set();
                // 保留原始词序和分隔边界，不能删掉 and/of 后再拼出不存在的短语。
                let chunks = siTitle.toLowerCase().replace(/[‐‑–—-]/g, ' ').split(/[^a-z0-9\s]+/)
                    .flatMap(part => part.split(new RegExp('\\b(?:' + stopWords.join('|') + '|in|on|to|a|an|at|by|as|or|modern|recent|advances|advanced|developments)\\b')))
                    .map(part => part.trim().split(/\s+/).filter(Boolean));
                for (let words of chunks) {
                    for (let size of [3, 2]) {
                        for (let i = 0; i <= words.length - size; i++) {
                            let phrase = words.slice(i, i + size);
                            terms.add(phrase.join(' '));
                            phrase.forEach(word => phraseWords.add(word));
                        }
                    }
                }
                let weakWords = ['model','models','network','networks','foundation','foundations','approach','approaches','study','studies','research','theory','analysis','system','systems'];
                for (let words of chunks) {
                    if (words.length === 1 && words[0].length > 2 && !phraseWords.has(words[0]) && !weakWords.includes(words[0])) terms.add(words[0]);
                }
                return [...terms].map(term => {
                    let words = term.split(' ');
                    let pattern = words.map(word => word.length > 3 && !/(ss|us|is)$/.test(word) ? word.replace(/s$/, '') + 's?' : word).join('[\\s‐‑–—-]+');
                    return { regex: new RegExp('\\b' + pattern + '\\b', 'gi'), weight: words.length };
                });
            }
            function filterEditorRI(titleWords) {
                let $dialog = $("#select-ebm-for-oversee"), $tbody = $dialog.find("tbody");
                let ranked = [];
                $tbody.find("tr").each(function () {
                    let $row = $(this), $cells = $row.find("td");
                    if ($cells.length < 6) return;
                    let overseeCount = parseInt($cells.eq(4).text().trim(), 10);
                    $row.toggleClass('sk-oversee-unavailable', !Number.isFinite(overseeCount) || overseeCount >= 3);
                    if ($row.hasClass('sk-oversee-unavailable') || $row.hasClass('sk-oversee-other-section')) return;
                    let $riCell = $cells.eq(3), riText = $riCell.text(), score = 0, ranges = [];
                    for (let term of titleWords) {
                        let matches = [...riText.matchAll(term.regex)];
                        if (matches.length) score += term.weight;
                        matches.forEach(match => ranges.push([match.index, match.index + match[0].length]));
                    }
                    // 合并重叠短语，用文本节点高亮，保留原始文字且不把 RI 当作 HTML。
                    ranges.sort((a, b) => a[0] - b[0]);
                    let merged = [], offset = 0;
                    for (let range of ranges) {
                        let last = merged[merged.length - 1];
                        if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
                        else merged.push(range);
                    }
                    $riCell.empty();
                    for (let [start, end] of merged) {
                        $riCell.append(document.createTextNode(riText.slice(offset, start)), $('<span style="background-color:#FFA500;"></span>').text(riText.slice(start, end)));
                        offset = end;
                    }
                    $riCell.append(document.createTextNode(riText.slice(offset)));
                    ranked.push({ row: this, score });
                });
                $tbody.append(ranked.sort((a, b) => b.score - a.score).map(item => item.row));
                $dialog.find('#sk-ri-style').remove();
                $dialog.prepend('<style id="sk-ri-style">#select-ebm-for-oversee tr.sk-oversee-unavailable,#select-ebm-for-oversee tr.sk-oversee-other-section{display:none!important;}</style>');
            }

            let editorObserver, editorAutoSelect = false;
            $('#selectEBMForOversee').on('click.skOversee', function () {
                let sectionOnly = editorAutoSelect, autoSelect = sectionOnly, processedTable; editorAutoSelect = false;
                editorObserver?.disconnect();
                editorObserver = new MutationObserver(function () {
                    let $table = $('#select-ebm-for-oversee #filter_1').closest('table');
                    if (!$table.length || $table[0] === processedTable) return;
                    let $rows = $table.find('tbody tr').filter(function () { return $(this).find('td').length >= 6 && $(this).find('a.select-overseer').length; });
                    if (!$rows.length) return;
                    processedTable = $table[0];
                    editorObserver.disconnect();
                    $rows.removeClass('sk-oversee-unavailable sk-oversee-other-section');
                    let rowEmail = row => $(row).find('td').eq(1).text().trim().toLowerCase();
                    let $available = $rows.filter(function () {
                        let count = parseInt($(this).find('td').eq(4).text().trim(), 10); return Number.isFinite(count) && count < 3;
                    });
                    let emails = $('#maincol div.decisionHistory').filter(function () { return /Decision Type:\s*First Approval\b/.test($(this).text()); })
                        .map(function () { return $(this).find('a[href^="mailto:"]').first().text().trim().toLowerCase(); }).get();
                    let $matchRow = $();
                    for (let email of emails) {
                        $matchRow = $available.filter(function () { return rowEmail(this) === email; }).first();
                        if ($matchRow.length) break;
                    }
                    if (autoSelect && $matchRow.length) $matchRow.find('a.select-overseer')[0].click();
                    autoSelect = false;
                    // 原站校验成功会关闭弹窗；不能选中时，下方候选表仍可继续选择。
                    let candidateEmails = new Set(SK_SectionCandidatesMap[detectSection()] || []);
                    // 自动打开默认按 Section；手动 Choose Editor 展示所有未满 3 个 SI 的编辑。
                    if (sectionOnly && $available.filter(function () { return candidateEmails.has(rowEmail(this)); }).length) {
                        $rows.each(function () { $(this).toggleClass('sk-oversee-other-section', !candidateEmails.has(rowEmail(this))); });
                    }
                    filterEditorRI(getSITitleWords());
                    // 自动打开和手动点击的请求可能交错返回，每次替换表格都沿用最后一次的模式。
                    editorObserver.observe(document.getElementById('select-ebm-for-oversee'), { childList: true, subtree: true });
                });
                editorObserver.observe(document.getElementById('select-ebm-for-oversee'), { childList: true, subtree: true });
            });
            window.addEventListener('pagehide', function () { editorObserver?.disconnect(); });
            if ($("#selectEBMForOversee").length) runAutoDetect();
            $("#autoDetectEBM").on("click", runAutoDetect);
            // 在 form_decision 中添加手动触发 Choose Editor + 高亮匹配的链接
            if ($("#form_decision").length && $("#selectEBMForOversee").length) {
                $("#form_decision").append(' <a href="javascript:void(0);" id="sk-choose-editor-link" style="color: #3156A2; cursor: pointer; margin-left: 8px;">[Choose Editor]</a>');
                $("#sk-choose-editor-link").on("click", function () {
                    document.getElementById('selectEBMForOversee')?.click();
                });
            }
            function runAutoDetect() {
                let button = document.getElementById('selectEBMForOversee'); if (!button) return;
                editorAutoSelect = true; button.click();
            }
        } catch (error) { }
    }

    //Always: Google Scholar 校正
    if (window.location.href.indexOf("&amp;") > -1 && window.location.href.indexOf("google") > -1) {
        try {
            let new_uri, old_uri = window.location.search;
            for (let i = 1; i < 5; i++) { new_uri = $("<div />").html(old_uri).text(); if (new_uri == old_uri) { break; } else { old_uri = new_uri } }
            let searchParams = new URLSearchParams(new_uri)
            if (searchParams.has('user')) { window.location.href = "https://scholar.google.com/citations?hl=en&user=" + searchParams.get('user') }
        } catch (error) { }
    }

    //Experimental: CN Rank标记
    if (window.location.href.indexOf("projects/journal-mathematics/wiki/SI_Manage") > -1 && GM_config.get('Hidden_Func')) {
        try {
            skAddResourceStyle('tooltipsterCSS', 'tooltipsterNoirCSS', 'tooltipster-style');
            $("td").each(function () {
                let ranking = skGetUniv($(this).text().trim());
                if (ranking.color) {
                    $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                        .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                }
            });
        } catch (error) { }
    }

    // Scopus 作者搜索仅有一个结果时直接进入详情（Lightweight Mode 开启时由轻量搜索页接管）。
    if (location.hostname === 'www.scopus.com' && /^\/results\/author(?:NamesList|ListResults)\.uri$/.test(location.pathname) && GM_getValue('skScopusLightweightProfile', false) !== true) {
        waitForKeyElements('#srchResultsList .authorResultsNamesCol a[href]', function () {
            const links = $('#srchResultsList .authorResultsNamesCol a[href]');
            if ($('h1.documentHeader .resultsCount').text().trim() !== '1' || links.length !== 1) return;
            const id = new URL(links[0].href).searchParams.get('authorId');
            if (/^\d+$/.test(id || '')) location.replace('/authid/detail.uri?authorId=' + id);
        }, true);
    }

    //Maths-Related Journal Search + Rank ABC
    if (window.location.hostname.indexOf("google") + window.location.hostname.indexOf("scopus") > -2 && GM_config.get('Maths_J')) {
        try {
            var maths_j = ["math","stat","computat","computing","equation","probab","algebr","algorithm","calculus","pde","nonlinear","topology","fractal","discrete","fixed point","artificial intelligence","inverse prob","combinatori","number theory","matemati",
                           "operator theory","axiom","numeric","stochastic","fuzzy set","dynamical sys","chaos","functional analysis","optimization theory","inequalit","group theory","game theory","journal of molecular graphics & modelling",
                           "infectious disease modelling","current bioinformatics","evolutionary bioinformatics","frontiers in neuroinformatics","international journal of data mining and bioinformatics","journal of biological dynamics",
                           "annals of k-theory","concrete operators","dolomites research notes on approximation","fibonacci quarterly","international journal of analysis and applications","journal of analysis","journal of integer sequences","problemy analiza",
                           "real analysis exchange","special matrices","acta arithmetica","annales de l institut fourier","annales scientifiques de l ecole normale superieure","annali della scuola normale superiore di pisa","applied categorical structures",
                           "constructive approximation","journal de theorie des nombres de bordeaux","journal of approximation theory","journal of convex analysis","graph theory","journal of homotopy and related structures","journal of knot theory and its ramifications",
                           "journal of lie theory","operators and matrices","journal on the theory of ordered sets and its applications","ramanujan journal","representation theory","semigroup forum","transformation groups","advances in fuzzy systems",
                           "fuzzy information and engineering","journal of applied analysis","minimax theory and its applications","acm transactions on modeling and computer simulation","analysis and applications","annals of pure and applied logic","anziam journal",
                           "applicable analysis","archive for rational mechanics and analysis","archives of control sciences","asymptotic analysis","boundary value problems","communications on pure and applied analysis","designs codes and cryptography",
                           "finite elements in analysis and design","finite fields and their applications","fundamenta informaticae","homology homotopy and applications","integral transforms and special functions","interfaces and free boundaries",
                           "iranian journal of fuzzy systems","journal of complexity","journal of cryptology","journal of dynamical and control systems","journal of fourier analysis and applications","journal of function spaces","journal of global optimization",
                           "journal of inverse and ill","journal of modern dynamics","differential operators and applications","journal of spectral theory","kinetic and related models","logic journal of the igpl","optimal control applications","optimization letters",
                           "pacific journal of optimization","problems of information transmission","chaotic dynamics","set-valued and variational analysis","siam journal on control and optimization","siam journal on matrix analysis and applications",
                           "siam journal on optimization","advances in data science and adaptive analysis","cybernetics and systems analysis","international journal of modelling and simulation","journal of dynamics and games","journal of multiscale modelling",
                           "p-adic numbers ultrametric analysis and applications","engineering optimization","annales henri poincare","computer physics communications","quantum information processing","decisions in economics and finance",
                           "journal of time series econometrics","monte carlo methods and applications","advances in data analysis and classification","astin bulletin-the journal of the international actuarial association","bayesian analysis",
                           "journal of multivariate analysis","journal of time series analysis","lifetime data analysis","markov process","random matrices","scandinavian actuarial journal"];
            var geometry_j = ["geometr", "fractal", "manifold"];
            var maths_regex = new RegExp("(" + maths_j.join("|") + ")", "i");
            var geometry_regex = new RegExp("(" + geometry_j.join("|") + ")", "i");
            // 作者单位按大学排名着色，悬停显示排名详情（Scopus、Google Scholar 共用）。
            const markUniversity = function () {
                const ranking = skGetUniv($(this).text().trim());
                if (!ranking.color) return;
                skAddResourceStyle('tooltipsterCSS', 'tooltipsterNoirCSS', 'tooltipster-style');
                $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                    .tooltipster({ functionInit: function (instance, helper) { instance.content($(helper.origin).attr('title')); }, contentAsHTML: true, theme: 'tooltipster-noir' });
            };
            if (window.location.hostname.indexOf("scopus") > -1) {
                waitForKeyElements("div[data-component='document-source'],div[data-testid='author-list']+span", function () {
                    mark_journals();
                    $('span[data-testid="authorInstitution"]').each(markUniversity);
                }, true);
                const scopusSubjectNames = {
                    AGRI: 'Agricultural and Biological Sciences', ARTS: 'Arts and Humanities', BIOC: 'Biochemistry, Genetics and Molecular Biology',
                    BUSI: 'Business, Management and Accounting', CENG: 'Chemical Engineering', CHEM: 'Chemistry', COMP: 'Computer Science',
                    DECI: 'Decision Sciences', DENT: 'Dentistry', EART: 'Earth and Planetary Sciences', ECON: 'Economics, Econometrics and Finance',
                    ENER: 'Energy', ENGI: 'Engineering', ENVI: 'Environmental Science', HEAL: 'Health Professions', IMMU: 'Immunology and Microbiology',
                    MATE: 'Materials Science', MATH: 'Mathematics', MEDI: 'Medicine', MULT: 'Multidisciplinary', NEUR: 'Neuroscience',
                    NURS: 'Nursing', PHAR: 'Pharmacology, Toxicology and Pharmaceutics', PHYS: 'Physics and Astronomy', PSYC: 'Psychology',
                    SOCI: 'Social Sciences', VETE: 'Veterinary'
                };
                // Scopus 公共请求与 Lightweight 壳层复用（搜索页、作者页、合作者面板共用）。
                const fetchAuthorJson = (id, ms = 12000) => fetch('/api/authors/' + id, {
                    credentials: 'include', cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(ms)
                }).then(r => {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    if (!r.headers.get('content-type')?.includes('json')) throw new Error('Scopus returned a page instead of author data.');
                    return r.json();
                }).then(d => { if (String(d?.authorId) !== String(id)) throw new Error('Unexpected author profile'); return d; });
                const fetchScopusGql = (query, variables, signal = AbortSignal.timeout(25000)) => fetch('/gateway/author-profile-api/author', {
                    method: 'POST', credentials: 'include', signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(variables ? { query, variables } : { query })
                });
                const fetchBatchGql = (batch, fields, signal) => fetchScopusGql('query {\n' + batch.map((r, i) => `a${i}: author(id: "${r.id}", disableTombstoneResolution: true) { ${fields} }`).join('\n') + '\n}', null, signal);
                const liteKey = 'skScopusLightweightProfile', lite = GM_getValue(liteKey, false) === true;
                const mountLiteShell = root => {
                    const bar = $('<div id="sk-lite-bar"></div>').append($('<label></label>').append(
                        $('<input type="checkbox" role="switch">').prop('checked', lite).on('change', function () { GM_setValue(liteKey, this.checked); location.reload(); }), ' Lightweight Mode (Beta)'));
                    (root.length ? root : $('body')).prepend(bar);
                    if (!lite || !root.length) return null;
                    if (!$('#sk-lite-banner').length) $('body').prepend('<div id="sk-lite-banner">Experimental Lightweight Mode (inspired by Eden): stability is unverified, use at your own risk.</div>');
                    $('html').addClass('sk-scopus-lite');
                    root.children().not(bar)[root.is('#__next') ? 'hide' : 'remove']();
                    return $('<div id="sk-lite-page"></div>').appendTo(root);
                };

                // 作者搜索页：共用 Lightweight Mode，结合清洗机构、邮箱反查、ORCID、合著者并发检索，高置信唯一命中时自动进入详情页。
                const isAuthorSearchPage = /^\/results\/author(?:NamesList|ListResults)\.uri$/.test(location.pathname) || /^\/(?:pages\/)?(?:new-scopus\/)?search\/authors\/?$/.test(location.pathname);
                function mountLiteSearch() {
                    const root = $('#contentWrapper, main, #__next').first();
                    if (lite) root.addClass('sk-lite-search-root');
                    if (root.children('#sk-lite-page').length || (!lite && root.children('#sk-lite-bar').length)) return true;
                    root.children('#sk-lite-bar').remove();
                    const litePage = mountLiteShell(root);
                    if (litePage) {
                        const qs = new URLSearchParams(location.search), hs = new URLSearchParams(location.hash.replace(/^#(?:sk_)?/, ''));
                        const cleanAffils = raw => {
                            if (!raw) return [];
                            const mapped = (skGetUniv(raw).detail || '').replace(/<[^>]+>/g, '').replace(/^(?:Abbr|Top150|Rank\s+\w+):\s*/i, '').replace(/^\d+\+?\s+/, '').split('(')[0].trim();
                            const parts = raw.replace(/^\s*\d+\s*/, '').split(/[,;，；]/).map(s => s.replace(/\b\d{4,6}\b/g, '').trim()).filter(Boolean);
                            const mainRe = /\b(university|univ\.?|universit\S*|institute|inst\.?|academy|polytechnic|politecnico|hochschule|college|hospital|cnrs|inria|csic|infn|cern)\b/i;
                            const picked = parts.filter(p => mainRe.test(p) && !/\b(department|dept\.?|school|college|faculty|laboratory|lab|center|centre|division|ministry|group|program)\b/i.test(p));
                            if (!picked.length) picked.push(...parts.filter(p => mainRe.test(p) && !/\b(department|dept\.?|school of|college of|faculty of|laboratory|key lab)\b/i.test(p)));
                            return [...new Set([/^[\x20-\x7e]+$/.test(mapped) ? mapped : '', ...picked, parts.length === 1 ? parts[0] : ''].filter(Boolean))];
                        };
                        const resolveEmailOrg = async email => {
                            const dom = (email || '').split('@')[1]?.toLowerCase().trim();
                            if (!dom || /^(gmail|163|126|qq|sina|sohu|yeah|foxmail|outlook|hotmail|live|msn|yahoo|icloud|me|protonmail|proton|aol|mail|yandex|gmx|web|naver|hanmail|daum|aliyun|139|189)\./.test(dom)) return [];
                            const segs = dom.split('.'), min = /^(edu|ac|gov|org|co|com)\.[a-z]{2}$/i.test(segs.slice(-2).join('.')) ? 3 : 2;
                            for (const d of [...new Set([dom, segs.length > min ? segs.slice(-min).join('.') : dom])]) {
                                const items = await fetch('https://api.ror.org/v2/organizations?query.advanced=' + encodeURIComponent('domains:' + d), { signal: AbortSignal.timeout(3500) })
                                    .then(r => r.ok ? r.json() : null).then(j => j?.items || []).catch(() => []);
                                const exact = items.filter(x => (x.domains || []).some(k => d === k.toLowerCase() || d.endsWith('.' + k.toLowerCase())));
                                const names = (exact.length ? exact : items.slice(0, 1)).map(x => x.names?.find(n => n.types?.includes('ror_display'))?.value).filter(Boolean);
                                if (names.length) return names;
                            }
                            return [];
                        };
                        const getJson = (url, init) => fetch(url, { credentials: 'include', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(12000), ...init }).then(r => r.ok ? r.json() : null).catch(() => null);
                        const previewDocs = (q, n = 15) => getJson('/api/documents/search/preview?query=' + encodeURIComponent(q) + '&itemcount=' + n + '&offset=0&sort=plf-f&allauthors=true').then(j => j?.items || []);
                        const searchAuthors = (last, first, affiliation = '') => getJson('/gateway/author-search-api/authors/search', {
                            method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                            body: JSON.stringify({ authorLastName: last, authorFirstName: first, ...(affiliation ? { affiliation } : {}), itemCount: 20, offset: 0, sort: { fieldName: 'count', sortOrder: 'DESC' } })
                        }).then(j => j?.items || []);

                        const parseName = raw => {
                            const v = String(raw || '').replace(/^(?:Dr|Prof|Mr|Ms|Mrs)\.?\s+/i, '').replace(/\s+/g, ' ').trim();
                            if (!v) return { last: '', first: '', formatted: '' };
                            let last = v, first = '';
                            if (v.includes(',')) {
                                const [l, ...rest] = v.split(',');
                                last = l.trim(); first = rest.join(' ').trim();
                            } else if (v.includes(' ')) {
                                const p = v.split(' '), i = p.length > 2 && /^(?:van|von|de|del|della|di|da|dos|das|du|le|la|el|al|bin|ibn|st\.?)$/i.test(p[p.length - 2]) ? p.length - 2 : p.length - 1;
                                last = p.slice(i).join(' '); first = p.slice(0, i).join(' ');
                            }
                            return { last, first, formatted: first ? `${last}, ${first}` : last };
                        };
                        const initLast = (qs.get('st1') || qs.get('lastName') || '').trim(), initFirst = (qs.get('st2') || qs.get('firstName') || '').trim();
                        const inName = $('<input name="name" placeholder="Name (e.g. Alotaibi, Rashed)">').val(hs.get('name') ?? [initLast, initFirst].filter(Boolean).join(', '));
                        const swapBtn = $('<button type="button" class="sk-lite-swap" title="Swap Last & First name">🔄</button>');
                        const inAffil = $('<input name="affil" placeholder="Affiliation (auto-cleaned)">').val((hs.get('affil') ?? (qs.get('affilName') || qs.get('affiliation') || '')).trim());
                        const inExtra = $('<input name="extra" placeholder="Email or ORCID (optional)">').val((hs.get('extra') ?? (qs.get('orcidId') || qs.get('orcid') || hs.get('orcid') || hs.get('email') || '')).trim());
                        const inCo = $('<input name="co" placeholder="Co-authors (comma-separated)" title="Co-author surnames, separated by commas">').val(hs.get('co') || '');
                        const searchBtn = $('<button type="submit" class="sk-scopus-btn">Search</button>');
                        const statusNote = $('<p class="sk-scopus-note" role="status"></p>'), resultBox = $('<div></div>');
                        const formatInName = () => { const n = parseName(inName.val()); if (n.formatted) inName.val(n.formatted); return n; };
                        inName.on('blur', formatInName).on('paste', () => setTimeout(formatInName, 0));
                        swapBtn.on('click', () => {
                            const { last, first } = formatInName();
                            if (last && first) { inName.val(`${first}, ${last}`); runSearch(false); }
                        });
                        const form = $('<form class="sk-lite-search"></form>').append(inName, swapBtn, inAffil, inExtra, inCo, searchBtn);
                        litePage.append($('<div class="sk-lite-header"><h1>Scopus Author Search</h1></div>'), form, statusNote, resultBox);

                        const runSearch = async autoJump => {
                            const { last, first } = formatInName(), rawAffil = inAffil.val().trim(), extra = inExtra.val().trim();
                            const coList = inCo.val().split(/[,;，；]/).map(s => s.trim()).filter(Boolean);
                            const orcid = extra.match(/(\d{4}-\d{4}-\d{4}-\d{3}[\dX])/i)?.[1] || '', email = !orcid && extra.includes('@') ? extra.toLowerCase() : '';
                            if (!last && !orcid && !email) {
                                if (rawAffil || extra) statusNote.text('Please enter an author name, email, or ORCID (searching by affiliation alone is not supported).');
                                return;
                            }
                            hs.set('name', inName.val()); hs.set('affil', rawAffil); hs.set('extra', extra);
                            hs.set('co', coList.join(',')); hs.set('auto', autoJump ? '1' : '0');
                            history.replaceState(history.state, '', location.pathname + location.search + '#sk_' + hs);
                            document.title = ([last, first].filter(Boolean).join(', ') || email || orcid) + ' - Scopus Author Search';
                            searchBtn.prop('disabled', true); statusNote.empty().append('<span class="sk-scopus-spinner"></span>Searching Scopus…'); resultBox.empty();

                            const affils = [...new Set([...(email ? await resolveEmailOrg(email) : []), ...cleanAffils(rawAffil)])].slice(0, 2);
                            const qStr = s => '"' + String(s).replace(/"/g, '') + '"', fi = first[0] || '';
                            const nameQ = last ? (fi ? `(AUTHOR-NAME(${qStr(last + ', ' + first)}) OR AUTHOR-NAME(${qStr(last + ', ' + fi + '*')}))` : `AUTHLASTNAME(${qStr(last)})`) : '';
                            const [orcidHits, emailDocs, coDocs, affilDocs, affilList, baseList] = await Promise.all([
                                orcid ? getJson('/gateway/author-search-api/authors/orcid/' + encodeURIComponent(orcid)).then(j => j?.items || []) : [],
                                email ? previewDocs(`ALL(${qStr(email)})`, 10) : [],
                                last && coList.length ? previewDocs(`AUTHLASTNAME(${qStr(last)}) AND (${coList.map(c => `AUTHLASTNAME(${qStr(c)})`).join(' OR ')})`, 15) : [],
                                nameQ && affils.length ? previewDocs(`${nameQ} AND (${affils.map(a => `AFFIL(${qStr(a)})`).join(' OR ')})`, 20) : [],
                                last && affils[0] ? searchAuthors(last, first, affils[0]) : [],
                                last ? searchAuthors(last, first) : []
                            ]);

                            const map = new Map(), norm = s => (s || '').toLowerCase().replace(/[^a-z]/g, ''), tLast = norm(last), tFirst = norm(first);
                            const ensure = id => /^\d+$/.test(String(id || '')) ? (map.get(String(id)) || map.set(String(id), { id: String(id), tags: new Set(), row: null, profile: null }).get(String(id))) : null;
                            const nameOk = (l, f) => {
                                const nl = norm(l), nf = norm(f);
                                return (!tLast || nl.includes(tLast) || tLast.includes(nl)) && (!tFirst || !nf || nf[0] === tFirst[0] || nf.includes(tFirst) || tFirst.includes(nf));
                            };
                            orcidHits.forEach(it => { const c = ensure(it.identifier); if (c) { c.tags.add('ORCID'); c.row = it; } });
                            [[emailDocs, 'Email'], [coDocs, 'Co-author'], [affilDocs, 'Affiliation']].forEach(([docs, tag]) =>
                                docs.forEach(d => (d.authors || []).forEach(a => { if (!tLast || nameOk(a.preferredName?.last, a.preferredName?.first)) ensure(a.authorId)?.tags.add(tag); })));
                            affilList.forEach(it => { if (nameOk(it.preferredFamilyName, it.preferredFirstName)) { const c = ensure(it.identifier); if (c) { c.tags.add('Affiliation'); c.row ||= it; } } });
                            baseList.forEach(it => { const c = ensure(it.identifier); if (c) c.row ||= it; });

                            const rank = c => (c.tags.has('EmailExact') ? 200 : 0) + (c.tags.has('ORCID') ? 150 : 0) + (c.tags.has('Email') ? 90 : 0) + (c.tags.has('Co-author') ? 50 : 0) + (c.tags.has('Affiliation') ? 25 : 0);
                            const enrich = async batch => {
                                if (!batch.length) return;
                                if (batch.length <= 3) {
                                    await Promise.all(batch.map(c => fetchAuthorJson(c.id).then(p => { c.profile = p; }).catch(() => { })));
                                } else {
                                    const data = (await fetchBatchGql(batch, 'profile { emailAddress orcId subjectAreas { code documentCount } } metrics { hindex documentCount }').then(r => r.ok ? r.json() : null).catch(() => null))?.data || {};
                                    batch.forEach((c, i) => {
                                        const prof = data['a' + i]?.profile;
                                        if (!prof) return;
                                        const subjects = [...(prof.subjectAreas || [])].sort((x, y) => y.documentCount - x.documentCount).map(s => ({ code: s.code, name: scopusSubjectNames[s.code] || s.code }));
                                        c.profile = { ...data['a' + i]?.metrics, emailAddress: prof.emailAddress, orcId: prof.orcId, publishedSubjectAreas: subjects };
                                    });
                                }
                                batch.forEach(c => {
                                    if (email && String(c.profile?.emailAddress || '').toLowerCase() === email) c.tags.add('EmailExact');
                                    if (orcid && String(c.profile?.orcId || '').toUpperCase() === orcid.toUpperCase()) c.tags.add('ORCID');
                                });
                            };

                            let list = [...map.values()].sort((a, b) => rank(b) - rank(a) || (b.row?.authorOfCount || 0) - (a.row?.authorOfCount || 0));
                            const hinted = list.filter(c => c.tags.size > 0);
                            if (list.length <= 3 || (autoJump && hinted.length && hinted.length <= 3)) await enrich(list.length <= 3 ? list : hinted);
                            const findExact = () => list.filter(c => c.tags.has('ORCID') || c.tags.has('EmailExact') || (email && list.filter(x => x.tags.has('Email')).length === 1 && c.tags.has('Email')));
                            let exact = findExact();
                            if (autoJump && (exact.length === 1 || (list.length === 1 && !rawAffil && !email))) return location.replace('/authid/detail.uri?authorId=' + (exact[0] || list[0]).id);

                            const renderTable = () => {
                                list.sort((a, b) => rank(b) - rank(a) || ((b.profile?.documentCount ?? b.row?.authorOfCount ?? 0) - (a.profile?.documentCount ?? a.row?.authorOfCount ?? 0)));
                                const rows = list.slice(0, 20).map((c, idx) => {
                                    const p = c.profile, r = c.row, inst = p?.latestAffiliatedInstitution || r?.affiliations?.[0], mail = p?.emailAddress && p.emailAddress !== 'null' ? p.emailAddress : '';
                                    const name = p?.preferredName?.full || [r?.preferredFamilyName, r?.preferredFirstName].filter(Boolean).join(', ') || ('Author ' + c.id);
                                    const subList = (p?.publishedSubjectAreas || []).map(s => s.name || s.code);
                                    const nameTd = $('<td></td>').append($('<a target="_blank" rel="noopener"></a>').attr('href', '/authid/detail.uri?authorId=' + c.id).text(name));
                                    [['EmailExact', '✓ Email Match', true], ['ORCID', '✓ ORCID', true], ['Email', '📄 Email in Paper', false], ['Co-author', '✓ Co-author', false], ['Affiliation', '✓ Affiliation', false]].forEach(([k, t, ok]) => {
                                        if (c.tags.has(k) && !(k === 'Email' && c.tags.has('EmailExact'))) nameTd.append($('<span class="sk-lite-tag"></span>').toggleClass('sk-lite-tag-ok', ok).toggleClass('sk-lite-tag-paper', k === 'Email').text(t));
                                    });
                                    const mailEl = mail ? $('<span class="sk-lite-email" title="Click to copy"></span>').text(mail).on('click', function () {
                                        const el = $(this); navigator.clipboard.writeText(mail).then(() => { el.text('✓ Copied'); setTimeout(() => el.text(mail), 1200); });
                                    }) : (p ? '' : '…');
                                    return $('<tr></tr>').append($('<td></td>').text(idx + 1), nameTd,
                                        $('<td></td>').append(inst?.name ? $('<span data-testid="authorInstitution"></span>').text(inst.name) : ''),
                                        $('<td></td>').text([inst?.address?.city ?? inst?.city, inst?.address?.country ?? inst?.country].filter(Boolean).join(', ')),
                                        $('<td></td>').text(p?.documentCount ?? r?.authorOfCount ?? '—'), $('<td></td>').text(p?.hindex ?? r?.hIndex ?? '—'), $('<td></td>').append(mailEl),
                                        $('<td></td>').attr('title', subList.join('; ')).text(p ? subList.join('; ') : '…'));
                                });
                                const head = '<thead><tr><th>#</th><th>Author</th><th>Affiliation</th><th>Location</th><th>Docs</th><th>h-index</th><th>Email</th><th>Subjects</th></tr></thead>';
                                resultBox.empty().append($('<div class="sk-scopus-scroll"><table id="sk-lite-results" class="sk-scopus-table">' + head + '<tbody></tbody></table></div>'));
                                resultBox.find('tbody').append(rows);
                                resultBox.find('span[data-testid="authorInstitution"]').each(markUniversity);
                            };

                            searchBtn.prop('disabled', false);
                            statusNote.text(list.length ? `${list.length} candidate author(s)` + (affils.length ? ' · Affiliation filter: ' + affils.join(' / ') : '') : 'No matching authors found.');
                            if (!list.length) return;
                            renderTable();
                            const pending = list.slice(0, 20).filter(c => !c.profile);
                            if (pending.length) {
                                await enrich(pending);
                                exact = findExact();
                                if (autoJump && exact.length === 1) return location.replace('/authid/detail.uri?authorId=' + exact[0].id);
                                renderTable();
                            }
                        };
                        form.on('submit', e => { e.preventDefault(); runSearch(false); });
                        runSearch(hs.get('auto') !== '0');
                    }
                    return true;
                }
                if (isAuthorSearchPage && !new URLSearchParams(location.search).has('ge_screen_request')) waitForKeyElements('#contentWrapper, main, #__next', mountLiteSearch, false);
                const pageAuthorId = new URLSearchParams(location.search).get('authorId') || (location.pathname.match(/\/pages\/authors\/(\d+)/) || [])[1];
                if ((location.pathname.indexOf('authid/detail.uri') > -1 || /\/pages\/authors\/\d+/.test(location.pathname)) && /^\d+$/.test(pageAuthorId || '') && !new URLSearchParams(location.search).has('ge_screen_request')) {
                    // /api/authors 只请求一次，Lightweight 头部与邮箱共用；失败后允许重试。
                    let authorApiTask = null;
                    const loadAuthorApi = () => authorApiTask ||= fetchAuthorJson(pageAuthorId, 15000).catch(error => { authorApiTask = null; throw error; });
                    const litePage = mountLiteShell($('#authorDetailsBotoxRoot'));
                    if (litePage) {
                        const count = v => v == null || v === '' || !Number.isSafeInteger(Number(v)) || Number(v) < 0 ? '—' : Number(v).toLocaleString('en');
                        const renderLite = () => {
                            litePage.empty().append($('<p class="sk-scopus-note" role="status"></p>').text('Loading author profile…'));
                            loadAuthorApi().then(p => {
                                const name = p.preferredName?.full || 'Author ' + pageAuthorId;
                                document.title = name + ' - Scopus Lightweight Profile';
                                const inst = p.latestAffiliatedInstitution, place = [inst?.address?.city, inst?.address?.country].filter(Boolean).join(', ');
                                // 单位用 authorInstitution 标记，复用大学排名着色与机构历史的插入位置。
                                const affil = $('<div class="sk-lite-affil"></div>');
                                if (inst?.name) affil.append($('<span data-testid="authorInstitution"></span>').text(inst.name), place ? ', ' + place : '');
                                const ids = $('<ul class="sk-lite-ids"></ul>').append($('<li></li>').text('Scopus ID: ' + pageAuthorId));
                                if (/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(p.orcId || '')) ids.append($('<li></li>').append($('<a target="_blank" rel="noopener"></a>').attr('href', 'https://orcid.org/' + p.orcId).text('ORCID ' + p.orcId)));
                                ids.append($('<li></li>').append($('<a target="_blank" rel="noopener">Documents in Scopus ↗</a>')
                                    .attr('href', '/results/results.uri?sort=plf-f&src=s&sot=a&sdt=a&origin=AuthorEval&s=' + encodeURIComponent('AU-ID(' + pageAuthorId + ')'))));
                                const metrics = $('<dl class="sk-lite-metrics"></dl>').append([
                                    [p.citedByCount == null ? ['Citations'] : ['Citations by ', $('<b></b>').text(count(p.citedByCount)), ' documents'], p.citationsCount],
                                    [['Documents'], p.documentCount], [['h-index'], p.hindex], [['Co-authors'], p.coAuthorsCount]
                                ].map(([label, value]) => $('<div></div>').append($('<dt></dt>').append(label), $('<dd></dd>').text(count(value)))));
                                litePage.empty().append($('<div class="sk-lite-header"></div>').append($('<h1 data-testid="author-profile-name"></h1>').text(name), affil, ids, metrics),
                                    $('<div id="sk-lite-cols"><div id="sk-lite-main"></div><aside id="sk-lite-side"></aside></div>'));
                                affil.children('span').each(markUniversity);
                            }).catch(error => {
                                litePage.empty().append($('<p class="sk-scopus-note" role="alert"></p>').text('Could not load author ' + pageAuthorId + '. ' + (error.name === 'TimeoutError' ? 'The request timed out.' : error.message) + ' '),
                                    $('<button type="button" class="sk-scopus-btn">Retry</button>').on('click', renderLite));
                            });
                        };
                        renderLite();
                    }

                    waitForKeyElements('h1[data-testid="author-profile-name"]', function (h1node) {
                        if (h1node.find('#sk-scopus-h1-tools').length) return;
                        const authorId = pageAuthorId;

                        // 用空格文本节点 + user-select:none 工具容器隔开姓名与邮箱，避免双击名字末尾时连带选中邮箱。
                        const toolsWrap = $('<span id="sk-scopus-h1-tools"></span>').css({ userSelect: 'none', marginLeft: '14px', fontWeight: 'normal' });
                        const copyNameBtn = $('<span></span>').attr('title', 'Click to copy First Last name').hide()
                            .css({ fontSize: '0.45em', color: '#5f6368', marginRight: '12px', padding: '2px 8px', border: '1px solid #dadce0', borderRadius: '6px', background: '#f8f9fa', verticalAlign: 'middle', cursor: 'pointer' });
                        const emailSpan = $('<span id="sk-scopus-email-inline">…</span>').attr('title', 'Click to copy')
                            .css({ fontSize: '0.5em', color: '#1a73e8', verticalAlign: 'middle', cursor: 'pointer', borderBottom: '1px dashed #1a73e8', overflowWrap: 'anywhere' });
                        const tipSpan = $('<span id="sk-scopus-email-tip"></span>').css({ fontSize: '0.5em', color: '#888', marginLeft: '5px', verticalAlign: 'middle' });
                        const inlineLoadBtn = $('<span>📊</span>').css({ fontSize: '0.45em', marginLeft: '8px', cursor: 'pointer', verticalAlign: 'middle', opacity: '0.7', transition: 'opacity .2s' })
                            .attr('title', 'Load Publications & Co-authors').on('mouseover', function () { $(this).css('opacity', '1'); }).on('mouseout', function () { $(this).css('opacity', '0.5'); });
                        const flashCopied = text => navigator.clipboard.writeText(text)
                            .then(() => { tipSpan.text('✓ Copied').css('color', '#1e8e3e'); setTimeout(() => tipSpan.text(''), 1500); })
                            .catch(() => { tipSpan.text('Failed').css('color', '#d93025'); setTimeout(() => tipSpan.text(''), 1500); });
                        h1node.append(' ', toolsWrap.append(copyNameBtn, emailSpan, tipSpan, inlineLoadBtn));
                        let authorProfile = null, naturalName = '';
                        loadAuthorApi().then(d => {
                            authorProfile = d;
                            naturalName = [d.preferredName?.first, d.preferredName?.last].map(s => (s || '').trim()).filter(Boolean).join(' ');
                            if (naturalName) copyNameBtn.text(naturalName).show();
                            const email = d.emailAddress || '';
                            if (email && email !== 'null') { emailSpan.text(email); }
                            else { emailSpan.text('--').css({ color: '#aaa', borderBottom: 'none', cursor: 'default' }); }
                        }).catch(() => emailSpan.text('--').css({ color: '#aaa', borderBottom: 'none', cursor: 'default' }));
                        copyNameBtn.on('click', () => naturalName && flashCopied(naturalName));
                        emailSpan.on('click', function () {
                            const email = emailSpan.text();
                            if (email && !email.startsWith('-') && email !== '…') flashCopied(email);
                        });

                        // ── Hirsch: 注入按钮 ──
                        function skInjectHirschSection() {
                            if ($('#sk-hirsch-section').length) return;
                            const authorName = h1node.clone().children().remove().end().text().trim();
                            const hirschPageUrl = 'https://www.scopus.com/hirsch/author.uri?accessor=authorProfile&auidList=' + authorId + '&origin=AuthorProfile';
                            const dataUrl = 'https://www.scopus.com/hirsch/author/data.uri';
                            const baseBody = 'authorName=' + encodeURIComponent(authorName) + '&accessor=authorProfile&keyEventCutState=n&auidList=' + authorId + '&origin=AuthorEval&ajax=true';

                            function postData(display) {
                                return fetch(dataUrl, {
                                    method: 'POST', credentials: 'include',
                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
                                    referrer: hirschPageUrl,
                                    body: 'display=' + display + '&' + baseBody, signal: AbortSignal.timeout(20000)
                                }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
                            }

                            // 按钮样式
                            function makeBtn(text) {
                                const btn = $('<button type="button">' + text + '</button>').css({
                                    background: '#2f709b', color: '#fff', border: 'none',
                                    borderRadius: '8px', padding: '10px 28px', fontSize: '14px', fontWeight: '600',
                                    cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,115,232,0.3)',
                                    transition: 'all .2s', display: 'block', margin: '12px auto'
                                });
                                btn.on('mouseover', function () { $(this).css({ transform: 'scale(1.03)', boxShadow: '0 4px 14px rgba(26,115,232,0.4)' }); });
                                btn.on('mouseout', function () { $(this).css({ transform: 'scale(1)', boxShadow: '0 2px 8px rgba(26,115,232,0.3)' }); });
                                return btn;
                            }

                            // 左栏按钮（Lightweight 模式放入左栏，否则放在 Documents 标签页内）
                            const section = $('<div id="sk-hirsch-section"></div>').css({ padding: '16px 0' });
                            const seeAllBtn = makeBtn('See All Publications');
                            section.append(seeAllBtn);
                            const liteMain = $('#sk-lite-main'), hr = $('#documents-panel hr').first();
                            if (liteMain.length) { liteMain.append(section); } else if (hr.length) { hr.after(section); } else { h1node.closest('section, div[class*="Author"]').first().append(section); }

                            // 右栏按钮（Lightweight 右栏或 Author Position 下方）
                            const seeCoBtn = makeBtn('See Co-authors');
                            const authorPos = $('#sk-lite-side').length ? $('#sk-lite-side') : $('section.author-position').first();
                            if (authorPos.length) { authorPos.append(seeCoBtn); }

                            // 共享加载逻辑
                            let loaded = false;
                            const spinner = '<span class="sk-scopus-spinner" aria-hidden="true"></span>';
                            const setBtn = (btn, text, busy = false) => btn.empty().append(busy ? spinner : '', text).prop('disabled', busy).css({ opacity: busy ? '.85' : '1', cursor: busy ? 'wait' : 'pointer' });
                            // 数学/几何相关文字高亮（标题、期刊、主题共用）。
                            const mark = el => el.addClass(geometry_regex.test(el.text()) ? 'sk-hl-geo' : maths_regex.test(el.text()) ? 'sk-hl-math' : '');

                            function fetchMainAuthorGraphql() {
                                const query = `query($id: String!) {
                                    author(id: $id) {
                                        id
                                        profile {
                                            nameVariants
                                            currentInstitution { id name }
                                            institutionHistory { id name parentName city country dateRange }
                                        }
                                        funding { awardedGrantsCount }
                                        preprints { preprintCount }
                                        topicDetails {
                                            topicsRange { yearFrom yearTo }
                                            topics { topic authorDocumentCount authorFwci topicFwci }
                                        }
                                        publications {
                                            eid doi title pubYear subType openAccess citationCount authKeywords
                                            journals { srcTitle }
                                        }
                                    }
                                }`;
                                return fetchScopusGql(query, { id: authorId }, AbortSignal.timeout(20000)).then(r => r.ok ? r.json() : { httpStatus: r.status }).then(j => {
                                    // 记录失败原因：整个请求被拒（HTTP 状态）与 SciVal 主题服务报错（GraphQL errors）分开提示。
                                    const topicError = j?.errors?.find(e => /topic/i.test(e.message));
                                    const topicsError = j?.httpStatus ? 'HTTP ' + j.httpStatus : topicError ? 'SciVal: ' + topicError.message + (topicError.extensions?.httpStatus ? ' (' + topicError.extensions.httpStatus + ')' : '') : '';
                                    return { ...j?.data?.author, topicsFailed: !j?.data?.author || !!topicError, topicsError };
                                }).catch(error => ({ topicsFailed: true, topicsError: error.name === 'TimeoutError' ? 'timed out' : error.message }));
                            }

                            async function fetchAuthorSearchDocsMeta(expectedCount) {
                                const metaByEid = new Map(), metaByTitle = new Map(), countries = [];
                                const normTitle = s => String(s || '').toLowerCase().replace(/[^a-z0-9\u00c0-\u024f]+/g, ' ').trim();
                                const parsePage = html => {
                                    const doc = new DOMParser().parseFromString(html, 'text/html');
                                    // 首页侧栏 Country/territory 筛选：按作者单位国家统计的论文数（含本人单位，前 10 个），无需额外请求。
                                    if (!countries.length) doc.querySelectorAll('input[name="selectedCountryClusterCategories"]').forEach(input => {
                                        const count = Number(input.closest('li')?.querySelector('.badge')?.textContent.replace(/\D/g, ''));
                                        if (input.value && input.value !== 'Undefined' && count > 0) countries.push({ name: input.value, count });
                                    });
                                    const rows = [...doc.querySelectorAll('tr.searchArea')];
                                    rows.forEach(tr => {
                                        const text = el => el?.textContent?.replace(/\s+/g, ' ').trim() || '';
                                        const eid = tr.querySelector('input[name="selectedEIDs"]')?.value?.trim() || '', title = text(tr.querySelector('.docTitle')), year = text(tr.children[3]);
                                        const info = { year: /^\d{4}$/.test(year) ? year : '', journal: text(tr.children[4]), oa: !!tr.querySelector('.openAccessTxt') };
                                        if (eid) metaByEid.set(eid, info);
                                        if (title) metaByTitle.set(normTitle(title), info);
                                    });
                                    return rows.length;
                                };
                                try {
                                    const baseSearchUrl = 'https://www.scopus.com/results/results.uri?sort=plf-f&src=s&sot=a&sdt=a&s=AU-ID%28' + encodeURIComponent(authorId) + '%29&origin=AuthorEval&resultsPerPage=200';
                                    const firstRes = await fetch(baseSearchUrl, { credentials: 'include', signal: AbortSignal.timeout(20000) });
                                    if (firstRes.ok) {
                                        const firstCount = parsePage(await firstRes.text());
                                        const targetPages = Math.min(3, Math.ceil((Number(expectedCount) || firstCount) / 200));
                                        for (let p = 2; p <= targetPages && firstCount === 200; p++) {
                                            const nextRes = await fetch(baseSearchUrl + '&offset=' + ((p - 1) * 200 + 1), { credentials: 'include', signal: AbortSignal.timeout(20000) });
                                            if (!nextRes.ok || parsePage(await nextRes.text()) < 200) break;
                                        }
                                    }
                                } catch (_) { }
                                return { metaByEid, metaByTitle, normTitle, countries };
                            }

                            function triggerLoad() {
                                if (loaded || $('#sk-coa-overlay').length) return;
                                loaded = true;
                                $('#sk-hirsch-error').remove();
                                setBtn(seeAllBtn, 'Loading publications…', true);
                                setBtn(seeCoBtn, 'Loading co-authors…', true);
                                inlineLoadBtn.html(spinner).css({ cursor: 'wait', opacity: '1' });
                                waitForKeyElements('[class*="AuthorHeader-module"]:contains("Scopus Preview")', el => { el.remove(); }, false);

                                const gqlPromise = fetchMainAuthorGraphql();
                                fetch(hirschPageUrl, { credentials: 'include', signal: AbortSignal.timeout(20000) }).then(r => {
                                    if (!r.ok) throw new Error('HTTP ' + r.status);
                                    return r.text();
                                }).then(html => {
                                    // 从初始页面 HTML 解析内嵌的 JSON（包含 source / subject area 数据）
                                    let docData = {};
                                    try {
                                        const pageDoc = new DOMParser().parseFromString(html, 'text/html');
                                        const jsonPre = pageDoc.getElementById('getAuthEvalJsonData');
                                        if (jsonPre) { docData = JSON.parse(jsonPre.textContent); }
                                    } catch (e) { /* ignore parse errors */ }
                                    // GraphQL 与检索页请求自带兜底，不会 reject。
                                    return Promise.all([postData('hIndex').catch(() => ({})), postData('CoAuthors').catch(() => ({})), gqlPromise, fetchAuthorSearchDocsMeta(docData.docCount)])
                                        .then(([hData, coData, gqlAuthor, searchMeta]) => [hData, coData, docData, gqlAuthor, searchMeta]);
                                }).then(([hData, coData, docData, gqlAuthor, searchMeta]) => {
                                    seeAllBtn.hide();
                                    seeCoBtn.hide();
                                    $('#sk-hirsch-content, #sk-subject-overlay, #sk-inst-history, #sk-coauthors-section, #sk-sources-section').remove();
                                    inlineLoadBtn.text('✅').css({ cursor: 'default', opacity: '1' }).off('click');
                                    const content = $('<div id="sk-hirsch-content"></div>');

                                    // ── 历史机构：按主机构去重（系所放入提示），复用大学排名高亮 ──
                                    const gqlProfile = gqlAuthor?.profile || {};
                                    const currentInst = gqlProfile.currentInstitution || authorProfile?.latestAffiliatedInstitution || {};
                                    const history = new Map();
                                    (gqlProfile.institutionHistory || []).forEach(inst => {
                                        const primary = (inst.parentName || inst.name || '').trim();
                                        if (!primary) return;
                                        const key = (primary + '|' + (inst.country || '')).toLowerCase();
                                        if (!history.has(key)) history.set(key, { primary, subs: new Set(), loc: [inst.city, inst.country].filter(Boolean).join(', '), dateRange: inst.dateRange || '' });
                                        const item = history.get(key);
                                        if (inst.parentName && inst.name && inst.name !== inst.parentName) item.subs.add(inst.name.trim());
                                        if ((inst.id && String(inst.id) === String(currentInst.id)) || primary.toLowerCase() === String(currentInst.name || '').toLowerCase()) item.current = true;
                                    });
                                    const pastInst = [...history.values()].filter(x => !x.current), shownInst = pastInst.length ? pastInst : [...history.values()];
                                    if (shownInst.length) {
                                        const variants = (gqlProfile.nameVariants || []).filter(Boolean);
                                        const list = $('<div class="sk-inst-hist-list"></div>').append(shownInst.map(item => {
                                            const rank = skGetUniv(item.primary);
                                            const tip = [item.subs.size && 'Dept: ' + [...item.subs].join(' / '), rank.color && rank.detail.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()].filter(Boolean).join(' · ');
                                            return $('<span class="sk-inst-hist-chip"></span>').text(item.primary + (item.loc ? ' (' + item.loc + ')' : '') + (item.dateRange ? ' [' + item.dateRange + ']' : ''))
                                                .css(rank.color ? { background: rank.color, fontWeight: 700 } : {}).attr('title', tip || null);
                                        }));
                                        if (variants.length) list.append($('<div class="sk-scopus-note"></div>').text('Also published as: ' + variants.join(' · ')));
                                        const anchor = $('span[data-testid="authorInstitution"]').first().closest('ul, div');
                                        (anchor.length ? anchor : h1node).after($('<details id="sk-inst-history"></details>').append(
                                            $('<summary></summary>').text('Affiliation history (' + shownInst.length + ')' + (variants.length ? ' · Name variants (' + variants.length + ')' : '')), list));
                                    }

                                    // ── Research profile：学科占比 + 合作国家 + SciVal 主题，各默认显示前 6 行（Mathematics 始终可见），一个按钮同时展开 ──
                                    const docTotal = Number(docData.docCount ?? docData.totalDataForSourceData?.noOfDocuments);
                                    const subjectAreas = [...(docData.documentSubjectAreaViewBeans || [])].sort((a, b) => b.noOfDocuments - a.noOfDocuments);
                                    const topics = [...(gqlAuthor?.topicDetails?.topics || [])].sort((a, b) => b.authorDocumentCount - a.authorDocumentCount || b.authorFwci - a.authorFwci);
                                    const range = gqlAuthor?.topicDetails?.topicsRange;
                                    const rpHead = $('<div class="sk-rp-head"></div>').append($('<strong>Research profile</strong>'));
                                    [['Grants', gqlAuthor?.funding?.awardedGrantsCount], ['Preprints', gqlAuthor?.preprints?.preprintCount]].forEach(([label, n]) => { if (n > 0) rpHead.append($('<span></span>').text(label + ' ').append($('<b></b>').text(n))); });
                                    if (subjectAreas.length || topics.length || searchMeta.countries.length || rpHead.children().length > 1 || gqlAuthor.topicsFailed) {
                                        const cells = values => values.map(v => v?.jquery ? v : $('<span></span>').text(v));
                                        // 表头行兼作面板标题，说明放在表头提示中。
                                        const rpPanel = (labels, note, rows, limit = 6) => {
                                            rows.forEach((li, i) => li.toggleClass('sk-rp-extra', i >= limit && !li.hasClass('sk-rp-math')));
                                            return $('<section class="sk-rp-panel"></section>').append($('<ul class="sk-rp-list"></ul>').append($('<li class="sk-rp-labels"></li>').attr('title', note || null).append(cells(labels)), rows));
                                        };
                                        // 名称 | 占比条（本面板最大值为满格）| 论文数 | 占总论文比例（学科、国家共用）。
                                        const shareRow = (label, n, max, url, math = false) => {
                                            const name = $(url ? '<a target="_blank" rel="noopener"></a>' : '<span></span>').attr({ href: url || null, title: label }).text((math ? '★ ' : '') + label);
                                            return $('<li></li>').toggleClass('sk-rp-math', math).append(cells([name, $('<span class="sk-rp-bar"></span>').append($('<i></i>').css('width', (max > 0 ? n / max * 100 : 0) + '%')),
                                                n, docTotal > 0 ? Math.min(100, n / docTotal * 100).toFixed(1) + '%' : '']));
                                        };
                                        const subjectMax = Math.max(0, ...subjectAreas.map(s => Number(s.noOfDocuments) || 0));
                                        const subjectRows = subjectAreas.map(s => shareRow(s.displayName, Number(s.noOfDocuments) || 0, subjectMax, s.url, s.code === 'MATH' || /^Mathematics$/i.test(s.displayName))
                                            .attr('data-subject', s.code || (/^Mathematics$/i.test(s.displayName) ? 'MATH' : 'MULT')));
                                        const countryMax = Math.max(0, ...searchMeta.countries.map(c => c.count));
                                        const countryRows = searchMeta.countries.map(c => {
                                            const zone = SK_COUNTRY_ZONES.get(c.name);
                                            return shareRow(c.name, c.count, countryMax).attr({ 'data-zone': zone || null, title: zone ? 'MDPI discount zone ' + ['I', 'II', 'III'][zone - 1] : null });
                                        });
                                        const topicRows = topics.map(t => {
                                            const fwci = t.authorFwci == null ? NaN : Number(t.authorFwci);
                                            return $('<li></li>').attr('title', 'Topic world FWCI: ' + Number(t.topicFwci || 0).toFixed(2)).append(cells([mark($('<span></span>').attr('title', t.topic || null).text(t.topic || '?')), t.authorDocumentCount,
                                                $('<span class="sk-rp-fwci"></span>').toggleClass('sk-rp-high', fwci >= 1).text(Number.isFinite(fwci) ? fwci.toFixed(2) : '—')]));
                                        });
                                        const panels = [
                                            subjectAreas.length && rpPanel(['Subject areas', 'Papers', 'Share'], (docTotal > 0 ? 'Share of ' + docTotal + ' publications. ' : '')
                                                + 'A publication can belong to several subject areas, so shares may sum to more than 100%.', subjectRows),
                                            countryRows.length && rpPanel(['Countries in published papers', 'Papers', 'Share'], 'Papers with an author affiliated there, from the Scopus search filter of this author\'s documents (top 10); '
                                                + 'includes the author\'s own affiliation. Colours: MDPI discount zone I / II / III.', countryRows)
                                        ].filter(Boolean);
                                        const topicPanel = rpPanel(['SciVal topics', 'Papers', 'FWCI'], (range?.yearFrom ? range.yearFrom + '–' + range.yearTo + ' · ' : '') + 'FWCI 1.00 = world average', topicRows).addClass('sk-rp-topics');
                                        if (!topics.length) topicPanel.append($('<div class="sk-scopus-note"></div>').text(gqlAuthor.topicsFailed
                                            ? 'Scopus could not load topics' + (gqlAuthor.topicsError ? ' (' + gqlAuthor.topicsError + ')' : '') + '. Try again later.' : 'No topic data returned by Scopus.'));
                                        // Lightweight 模式默认展开全部行，普通页面默认只显示前 6 行。
                                        const rpBox = $('<div id="sk-subject-overlay"></div>').toggleClass('sk-rp-open', $('html').hasClass('sk-scopus-lite'))
                                            .append(rpHead, $('<div class="sk-rp-cols"></div>').append(panels, topicPanel));
                                        if (rpBox.find('.sk-rp-extra').length) rpBox.append($('<button type="button" class="sk-rp-more"></button>').text(rpBox.hasClass('sk-rp-open') ? 'Show less' : 'Show more').on('click', function () {
                                            $(this).text(rpBox.toggleClass('sk-rp-open').hasClass('sk-rp-open') ? 'Show less' : 'Show more');
                                        }));
                                        h1node.parent().append(rpBox);
                                    }

                                    const yearData = [...(docData.documentYearDataViewBeans || [])].sort((a, b) => Number(b.code || b.displayName) - Number(a.code || a.displayName));
                                    // 补齐已有年份之间的空档，保留最早、最晚年份的范围。
                                    for (let i = 1; i < yearData.length; i++) {
                                        const previousYear = Number(yearData[i - 1].code || yearData[i - 1].displayName), nextYear = Number(yearData[i].code || yearData[i].displayName);
                                        if (Number.isInteger(previousYear) && Number.isInteger(nextYear) && previousYear > nextYear + 1) {
                                            yearData.splice(i, 0, { code: String(previousYear - 1), displayName: String(previousYear - 1), noOfDocuments: 0 });
                                        }
                                    }
                                    const docs = Array.isArray(hData.hirschGraphData) ? hData.hirschGraphData : [];
                                    // 合并 GraphQL 最新论文元数据（关键词/DOI/文献类型/期刊）与站内检索页补全的全部论文年份+期刊
                                    const gqlPubByEid = new Map((gqlAuthor?.publications || []).filter(p => p?.eid).map(p => [String(p.eid), p]));
                                    const enrichedDocs = docs.map(d => {
                                        const eid = String(d.eid || ''), gp = gqlPubByEid.get(eid);
                                        const sm = searchMeta.metaByEid.get(eid) || searchMeta.metaByTitle.get(searchMeta.normTitle(d.documentTitle));
                                        return {
                                            ...d, pubYear: gp?.pubYear ? String(gp.pubYear) : (sm?.year || ''), journal: gp?.journals?.[0]?.srcTitle || sm?.journal || '',
                                            subType: gp?.subType || '', doi: gp?.doi || '', oa: Boolean(gp?.openAccess || sm?.oa), keywords: Array.isArray(gp?.authKeywords) ? gp.authKeywords.filter(Boolean) : []
                                        };
                                    });
                                    const thisYear = new Date().getFullYear();
                                    if (yearData.length || enrichedDocs.length) {
                                        const pubBox = $('<div id="sk-publications-section" class="sk-scopus-card"></div>');
                                        // 标题右侧右对齐显示文献类型统计。
                                        const types = docData.documentTypeDataViewBeans || [];
                                        pubBox.append($('<div class="sk-scopus-toolbar sk-scopus-heading"></div>').append($('<strong>Publications</strong>'), $('<a target="_blank" class="sk-scopus-icon" aria-label="Scopus analysis">↗</a>').attr('href', hirschPageUrl),
                                            types.length ? $('<span class="sk-scopus-note sk-pub-types"></span>').text(types.map(t => t.displayName + ': ' + t.noOfDocuments).join(' · ')) : ''));
                                        const yearCounts = $('<div class="sk-scopus-years"></div>');
                                        yearData.forEach(y => {
                                            const current = Number(y.code || y.displayName) === thisYear;
                                            yearCounts.append($('<div class="sk-scopus-year"></div>').toggleClass('sk-scopus-year-current', current)
                                                .append($('<span></span>').text((y.displayName || y.code) + (current ? ' (YTD)' : '')))
                                                .append(Number(y.noOfDocuments) === 0 ? $('<b>0</b>') : $('<a target="_blank" rel="noopener"></a>').attr('href', y.url || hirschPageUrl).text(y.noOfDocuments)));
                                        });
                                        if (yearData.length) pubBox.append(yearCounts);

                                        // 年度数据下方完整展示文章列表（含年份、期刊、OA/DOI 与近期关键词；默认按 Year 倒序，点击 Year / Cited 表头排序）。
                                        const pubBody = $('<tbody></tbody>');
                                        let sortMode = 'year', sortAsc = false;
                                        const sortHeads = {
                                            year: $('<th scope="col" class="sk-pub-sort sk-pub-year-head"><button type="button">Year <span class="sk-pub-sort-arrow" aria-hidden="true"></span></button></th>'),
                                            cited: $('<th scope="col" class="sk-pub-sort sk-pub-cited-head"><button type="button">Cited <span class="sk-pub-sort-arrow" aria-hidden="true"></span></button></th>')
                                        };
                                        $.each(sortHeads, (mode, th) => th.find('button').on('click', () => { sortAsc = mode === sortMode ? !sortAsc : false; sortMode = mode; renderPubRows(); }));
                                        const pubNumber = value => value == null || String(value).trim() === '' ? NaN : Number(String(value).replace(/,/g, ''));
                                        const renderPubRows = () => {
                                            $.each(sortHeads, (mode, th) => th.attr('aria-sort', mode === sortMode ? (sortAsc ? 'ascending' : 'descending') : 'none')
                                                .find('.sk-pub-sort-arrow').text(mode === sortMode ? (sortAsc ? '↑' : '↓') : '↕'));
                                            const field = sortMode === 'year' ? 'pubYear' : 'count';
                                            const sorted = [...enrichedDocs].sort((a, b) => {
                                                const x = pubNumber(a[field]), y = pubNumber(b[field]);
                                                if (!Number.isFinite(x)) return Number.isFinite(y) ? 1 : 0;
                                                if (!Number.isFinite(y)) return -1;
                                                return (x - y) * (sortAsc ? 1 : -1);
                                            });
                                            pubBody.empty().append(sorted.map((d, i) => {
                                                let href = hirschPageUrl;
                                                try { const url = new URL(d.detailsUrl, 'https://www.scopus.com'); if (url.protocol === 'https:' && url.hostname === 'www.scopus.com') href = url.href; } catch (e) { }
                                                const titleCell = $('<td></td>').append(mark($('<a target="_blank" rel="noopener"></a>').attr('href', href).text(d.documentTitle || '?')), d.oa ? '<span class="sk-pub-oa" title="Open Access">OA</span>' : '');
                                                const meta = [d.journal && mark($('<i></i>').text(d.journal)), d.subType !== 'ARTICLE' && d.subType,
                                                    d.doi && $('<a target="_blank" rel="noopener"></a>').attr('href', 'https://doi.org/' + encodeURIComponent(d.doi).replace(/%2F/gi, '/')).text('DOI ↗')].filter(Boolean);
                                                if (meta.length) titleCell.append($('<div class="sk-pub-meta"></div>').append(meta.flatMap((m, j) => j ? [' · ', m] : [m])));
                                                if (d.keywords.length) titleCell.append($('<div class="sk-pub-kw"></div>').text('🔑 ' + d.keywords.slice(0, 6).join(' · ')));
                                                return $('<tr></tr>').append($('<td></td>').text(i + 1), $('<td class="sk-pub-year"></td>').text(d.pubYear || '—'), titleCell, $('<td class="sk-pub-cited"></td>').text(d.count ?? '—'));
                                            }));
                                        };
                                        if (enrichedDocs.length) {
                                            renderPubRows();
                                            pubBox.append($('<div class="sk-scopus-scroll"></div>').append(
                                                $('<table class="sk-scopus-table"></table>').append($('<thead></thead>').append($('<tr></tr>').append('<th>#</th>', sortHeads.year, '<th>Title &amp; Source</th>', sortHeads.cited)), pubBody)
                                            ));
                                        }
                                        content.append(pubBox);
                                    }

                                    // 共同作者按 Scopus ID 保存；同名的不同档案不擅自合并。
                                    const coauthors = Array.isArray(coData.coAuthorsViewBeans) ? coData.coAuthorsViewBeans : [];
                                    if (coauthors.length) {
                                        const coRows = [...new Map(coauthors.filter(c => /^\d+$/.test(String(c.coAuthorId)) && String(c.coAuthorId) !== authorId).map(c => {
                                            let name = String(c.coAuthorName || '?').replace(/\+/g, ' ');
                                            try { name = decodeURIComponent(name); } catch (e) { }
                                            const nm = name.match(/^(.+?),\s*(.+)$/);
                                            return [String(c.coAuthorId), { id: String(c.coAuthorId), name, first: nm ? nm[2].trim() : name, last: nm ? nm[1].trim() : '', shared: c.noOfCoAuthoredDocuments ?? null, profile: null, state: 'Not loaded', error: '' }];
                                        })).values()].sort((a, b) => Number(b.shared) - Number(a.shared) || a.name.localeCompare(b.name));
                                        const coSection = $('<div id="sk-coauthors-section" class="sk-scopus-card"></div>');
                                        const coExportIcon = $('<button type="button" class="sk-scopus-icon" aria-label="Co-author details">📋</button>');
                                        // 侧栏合作者列表：Name | Country | Co-docs；国家由下方的轻量查询逐批填入。
                                        const coSideNote = $('<div class="sk-scopus-note"></div>').text('Loading countries…');
                                        const coCompact = $('<div id="sk-coa-compact" class="sk-scopus-scroll"></div>').append($('<table class="sk-scopus-table"></table>')
                                            .append($('<tbody></tbody>').append(coRows.map(row => $('<tr></tr>').append(
                                                $('<td></td>').attr('title', row.name).append($('<a target="_blank" rel="noopener"></a>').attr('href', 'https://www.scopus.com/authid/detail.uri?authorId=' + row.id).text(row.name)),
                                                $('<td></td>').append(row.sideCountry = $('<span class="sk-zone-tag"></span>')),
                                                $('<td></td>').attr('title', 'Co-authored documents').text(row.shared ?? '—'))))));
                                        const showLiteCountry = row => {
                                            const country = row.liteInst?.country || '';
                                            row.sideCountry.text(country || '—').attr({ 'data-zone': SK_COUNTRY_ZONES.get(country) || null, title: row.liteInst?.name || null });
                                        };
                                        let detailRunning = false, detailPaused = false, detailsRequested = false, detailTask = null, detailMessage = '', columns = [];
                                        let overlay, coTable, tableBody, countrySummary, tip, loadBtn;
                                        const activeControllers = new Set();
                                        const abortAll = () => { for (const c of activeControllers) c.abort(); activeControllers.clear(); };
                                        const isOpen = () => overlay?.[0]?.isConnected;
                                        // 加载中只显示已“揭示”的行；加载结束后显示全部已有数据。
                                        const isReady = row => row.shown || !detailRunning;

                                        function coauthorTsv() {
                                            const headers = detailsRequested ? ['Email','H-Index','Latest Pub','Institution','Country','Documents','Citations','Subject Areas','First Name','Last Name','Co-Docs','Scopus Link']
                                            : ['First Name','Last Name','Co-Docs','Scopus Link'];
                                            return [headers, ...coRows.map(row => {
                                                const p = row.profile || {};
                                                const base = [row.first, row.last, row.shared ?? '', 'https://www.scopus.com/authid/detail.uri?authorId=' + row.id];
                                                return detailsRequested ? [p.email, p.hindex, row.latestPub, p.inst?.name, p.inst?.country, p.docs, p.cites, p.subjects, ...base] : base;
                                            })].map(row => row.map(value => {
                                                const text = value == null ? '' : String(value).replace(/[\t\r\n]+/g, ' ').trim();
                                                return /^[=+@]/.test(text) ? "'" + text : text;
                                            }).join('\t')).join('\n');
                                        }

                                        function renderSummary() {
                                            const loadedRows = coRows.filter(row => isReady(row) && row.profile);
                                            const countries = new Map(), institutions = new Map(), institutionNames = new Map(), mainInstId = String(authorProfile?.latestAffiliatedInstitution?.id || '');
                                            let countryKnown = 0, institutionKnown = 0, sameInstitution = 0;
                                            loadedRows.forEach(({ profile: { inst } }) => {
                                                if (inst?.country) { countryKnown++; countries.set(inst.country, (countries.get(inst.country) || 0) + 1); }
                                                if (inst?.name) {
                                                    const key = String(inst.id || inst.name);
                                                    institutionKnown++; institutions.set(key, (institutions.get(key) || 0) + 1); institutionNames.set(key, inst.name);
                                                }
                                                if (mainInstId && String(inst?.id) === mainInstId) sameInstitution++;
                                            });
                                            countrySummary.empty();
                                            for (const [label, counts, known] of [['Countries', countries, countryKnown], ['Institutions', institutions, institutionKnown]]) {
                                                const chart = $('<div></div>').append($('<strong></strong>').text(label + (loadedRows.length ? ' · ' + known + '/' + loadedRows.length : '')));
                                                const bars = $('<div class="sk-scopus-bars"></div>');
                                                [...counts].sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([key, n]) => {
                                                    const name = counts === institutions ? institutionNames.get(key) : key;
                                                    // 国家条按 MDPI 折扣区着色（与 Research profile 的国家面板一致），不在名单中的保持蓝色。
                                                    const zone = counts === countries ? SK_COUNTRY_ZONES.get(name) : 0;
                                                    bars.append($('<div></div>').attr('data-zone', zone || null).append($('<div class="sk-scopus-bar-label"></div>').append($('<span></span>').attr('title', name).text(name), $('<b></b>').text(n)))
                                                                .append($('<div class="sk-scopus-bar-track"></div>').append($('<div class="sk-scopus-bar-fill"></div>').css({ width: (n / known * 100) + '%', background: counts === institutions ? '#a142f4' : null }))));
                                                });
                                                if (!counts.size) bars.text('—');
                                                chart.append(bars); countrySummary.append(chart);
                                            }
                                            if (mainInstId && loadedRows.length) countrySummary.children().last().append($('<div class="sk-scopus-note"></div>').text('Same institution: ' + sameInstitution));
                                            const errors = coRows.filter(row => isReady(row) && row.state === 'Failed').length;
                                            tip.text(detailsRequested ? loadedRows.length + '/' + coRows.length + ' loaded' + (errors ? ' · ' + errors + ' failed' : '') + (detailMessage ? ' · ' + detailMessage : '') : '');
                                        }

                                        function buildRow(row, cursor = false) {
                                            const ready = isReady(row), p = ready ? row.profile : null, name = row.name;
                                            const tr = $('<tr></tr>').toggleClass('sk-coa-pending', detailsRequested && !ready);
                                            tr.append($('<td></td>').attr('title', name + (row.error ? ' · ' + row.error : '')).append(cursor ? spinner : '', document.createTextNode(name + (ready && row.state === 'Failed' ? ' ⚠' : ''))));
                                            const values = detailsRequested ? [p?.email, p?.hindex, p && row.latestPub, p?.docs, p?.cites, p?.inst?.country, p?.inst?.name, p?.subjects, row.shared] : [row.liteInst?.country, row.shared];
                                            values.forEach((value, i) => {
                                                const [label, , numeric] = columns[i + 1];
                                                const text = value == null || value === '' ? (ready ? '—' : '') : String(value);
                                                const cell = $('<td></td>').attr('title', text).toggleClass('sk-scopus-number', !!numeric)
                                                    .toggleClass('sk-coa-output', label === 'Docs' || label === 'Citations').toggleClass('sk-coa-country', label === 'Country');
                                                // 国家按 MDPI 折扣区、机构按大学排名着色（与作者主页一致）。
                                                if (label === 'Country') cell.attr('data-zone', SK_COUNTRY_ZONES.get(text) || null);
                                                if (label === 'Institution' && p?.rank?.color) cell.css('background-color', p.rank.color).attr('title', text + ' · ' + p.rank.text);
                                                if (label === 'Email' && /^[^\s@]+@[^\s@]+$/.test(text)) cell.append($('<a target="_blank" rel="noopener"></a>').attr('href', skMailsdbUrl(text)).text(text));
                                                else if (label === 'h-index' && p && Number.isFinite(Number(text))) cell.append($('<a target="_blank" rel="noopener"></a>').attr('href', 'https://www.scopus.com/authid/detail.uri?authorId=' + row.id).text(text));
                                                else if (label === 'Latest Pub' && p && row.latestPub) {
                                                    cell.attr('title', row.pubError || 'Click to view yearly publications').append($('<a href="#"></a>').text(text).on('click', e => { e.preventDefault(); showCoauthorPublications(row); }));
                                                }
                                                else cell.text(text);
                                                tr.append(cell);
                                            });
                                            return row.tr = tr;
                                        }

                                        function renderCoauthors() {
                                            if (!isOpen()) return;
                                            coTable.closest('#sk-coa-popup').toggleClass('sk-coa-detailed', detailsRequested);
                                            loadBtn.toggle(!detailRunning && coRows.some(row => !row.profile)).text(coRows.some(row => row.profile || row.state === 'Failed') ? 'Retry / Resume' : 'Load Details');
                                            columns = detailsRequested ? [
                                                ['Name', '12%'], ['Email', '17%'], ['h-index', '62px', true], ['Latest Pub', '84px', true], ['Docs', '48px', true], ['Citations', '70px', true],
                                                ['Country', '110px'], ['Institution', ''], ['Subject areas', ''], ['Co-docs', '68px', true]
                                            ] : [['Name', ''], ['Country', '140px'], ['Co-docs', '68px', true]];
                                            const heading = $('<tr></tr>'), colGroup = coTable.find('colgroup').empty();
                                            columns.forEach(([label, width, numeric]) => {
                                                colGroup.append($('<col>').css('width', width));
                                                heading.append($('<th></th>').toggleClass('sk-scopus-number', !!numeric).text(label));
                                            });
                                            coTable.find('thead').empty().append(heading);
                                            renderSummary();
                                            const cursor = detailRunning && coRows.find(row => !row.shown);
                                            tableBody.empty().append(coRows.map(row => buildRow(row, row === cursor)));
                                        }

                                        async function loadSingleCoauthorPubData(row, signal) {
                                            if (row.pubData) return row.pubData;
                                            if (row.pubTask) return row.pubTask;
                                            const coPost = display => fetch(dataUrl, {
                                                method: 'POST', credentials: 'include', signal,
                                                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' },
                                                body: 'display=' + display + '&accessor=authorProfile&keyEventCutState=n&auidList=' + row.id + '&origin=AuthorEval&ajax=true'
                                            }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
                                            row.pubTask = Promise.all([coPost('Documents'), coPost('hIndex').catch(() => ({}))]).then(([docJson, hJson]) => {
                                                const counts = new Map();
                                                for (const y of docJson.documentYearDataViewBeans || []) {
                                                    const year = Number(y.code || y.displayName), count = Number(y.noOfDocuments);
                                                    if (Number.isInteger(year) && year > 1800 && Number.isInteger(count) && count >= 0) counts.set(year, (counts.get(year) || 0) + count);
                                                }
                                                const years = [...counts].sort((a, b) => b[0] - a[0]).map(([year, count]) => ({ code: String(year), noOfDocuments: count }));
                                                const documents = Array.isArray(hJson.hirschGraphData) ? hJson.hirschGraphData : [];
                                                row.pubError = '';
                                                return (row.pubData = { years, latest: years.find(y => y.noOfDocuments > 0)?.code ?? row.latestPub ?? null, documents });
                                            }).finally(() => { row.pubTask = null; });
                                            return row.pubTask;
                                        }

                                        function showCoauthorPublications(row) {
                                            $('#sk-coa-publications').remove();
                                            const returnFocus = document.activeElement;
                                            let dialogController = null;
                                            const page = $('<div id="sk-coa-publications" role="dialog" aria-modal="true" aria-labelledby="sk-coa-pub-title"></div>');
                                            const panel = $('<section></section>');
                                            const close = $('<button type="button" class="sk-scopus-btn" aria-label="Close publications">✕</button>').on('click', () => {
                                                dialogController?.abort(); page.remove(); if (returnFocus?.isConnected) returnFocus.focus();
                                            });
                                            const coHirschUrl = 'https://www.scopus.com/hirsch/author.uri?accessor=authorProfile&auidList=' + row.id + '&origin=AuthorProfile';
                                            panel.append($('<div class="sk-scopus-toolbar"></div>').append(
                                                $('<strong id="sk-coa-pub-title"></strong>').text(row.name + ' · Publications'),
                                                $('<a target="_blank" rel="noopener" class="sk-scopus-icon" aria-label="Scopus analysis">↗</a>').attr('href', coHirschUrl),
                                                close
                                            ));
                                            const bodyWrap = $('<div class="sk-coa-pub-body"></div>');
                                            panel.append(bodyWrap);
                                            const renderPanel = (pubData, loadingText, errorText) => {
                                                bodyWrap.empty();
                                                if (loadingText) bodyWrap.append($('<div class="sk-scopus-note"></div>').append(spinner, loadingText));
                                                if (errorText) bodyWrap.append($('<div class="sk-scopus-note"></div>').css('color', '#d93025').text(errorText));
                                                const counts = new Map((pubData?.years || []).map(y => [Number(y.code), y.noOfDocuments]));
                                                const years = [...counts.keys()];
                                                if (years.length) {
                                                    const tiles = $('<div class="sk-scopus-years"></div>');
                                                    for (let year = Math.max(...years); year >= Math.min(...years); year--) {
                                                        const n = counts.get(year) ?? 0;
                                                        const yearUrl = 'https://www.scopus.com/search/submit/author.uri?authorId=' + row.id + '&origin=AuthorEval&pubYear=' + year + '&pubStartYear=1970&pubEndYear=' + (new Date().getFullYear() + 1) + '&zone=Documents-Years';
                                                        tiles.append($('<div class="sk-scopus-year"></div>').toggleClass('sk-scopus-year-current', year === new Date().getFullYear())
                                                            .append($('<span></span>').text(year), n === 0 ? $('<b>0</b>') : $('<a target="_blank" rel="noopener"></a>').attr('href', yearUrl).text(n)));
                                                    }
                                                    bodyWrap.append(tiles);
                                                }
                                                const docs = pubData?.documents || [];
                                                if (docs.length) {
                                                    const body = $('<tbody></tbody>');
                                                    docs.forEach((d, i) => {
                                                        const title = mark($('<span></span>').text(d.documentTitle || '?'));
                                                        let link = title;
                                                        try {
                                                            const url = new URL(d.detailsUrl, 'https://www.scopus.com');
                                                            if (d.detailsUrl && url.protocol === 'https:' && url.hostname === 'www.scopus.com') link = $('<a target="_blank" rel="noopener"></a>').attr('href', url.href).append(title);
                                                        } catch (e) { }
                                                        body.append($('<tr></tr>').append($('<td></td>').text(i + 1), $('<td></td>').append(link), $('<td class="sk-pub-cited"></td>').text(d.count ?? '—')));
                                                    });
                                                    bodyWrap.append($('<div class="sk-scopus-scroll"></div>').append(
                                                        $('<table class="sk-scopus-table"><thead><tr><th>#</th><th>Title</th><th>Cited</th></tr></thead></table>').append(body)
                                                    ));
                                                }
                                            };
                                            page.append(panel).on('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); close.trigger('click'); } });
                                            $('body').append(page); close.trigger('focus');

                                            if (row.pubData) {
                                                renderPanel(row.pubData, '', '');
                                            } else {
                                                renderPanel(null, 'Loading yearly publication counts…', '');
                                                dialogController = new AbortController();
                                                const timeout = setTimeout(() => dialogController?.abort(), 20000);
                                                loadSingleCoauthorPubData(row, dialogController.signal).then(pubData => {
                                                    if (page[0].isConnected) renderPanel(pubData, '', '');
                                                }).catch(err => {
                                                    if (err.name === 'AbortError' && !page[0].isConnected) return;
                                                    row.pubError = err.name === 'AbortError' ? 'Timed out' : err.message;
                                                    if (page[0].isConnected) renderPanel(null, '', 'Failed to load yearly breakdown: ' + row.pubError);
                                                }).finally(() => clearTimeout(timeout));
                                            }
                                        }

                                        // 只取表格与导出用到的字段；论文只取年份（Latest Pub），以减轻每批请求。
                                        const coFragment = `fragment F on Author {
                                            profile {
                                                emailAddress
                                                currentInstitution { id name country }
                                                subjectAreas { code documentCount }
                                            }
                                            metrics { hindex documentCount citationCount }
                                            publications { pubYear }
                                        }`;
                                        // 一次 GraphQL 请求查询整批作者（别名 a0、a1…，服务端约按人数线性耗时）；返回是否应停止后续请求。
                                        let coMsPerRow = 450;
                                        async function fetchCoauthorBatch(batch) {
                                            const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 35000);
                                            activeControllers.add(controller);
                                            let stop = false, started = performance.now();
                                            try {
                                                const response = await fetchScopusGql('query {\n' + batch.map((row, i) => `a${i}: author(id: "${row.id}") { ...F }`).join('\n') + '\n}\n' + coFragment, null, controller.signal);
                                                if ([401, 403, 429].includes(response.status)) {
                                                    stop = true;
                                                    detailMessage = response.status === 429 ? 'Rate limited; wait before retrying.' : 'Scopus access needs checking before retrying.';
                                                }
                                                if (!response.ok) throw new Error('HTTP ' + response.status);
                                                const payload = await response.json(), data = payload?.data || {};
                                                coMsPerRow = (performance.now() - started) / batch.length;
                                                batch.forEach((row, i) => {
                                                    const a = data['a' + i];
                                                    if (!a?.profile) { row.state = 'Failed'; row.error = payload?.errors?.find(e => e.path?.[0] === 'a' + i)?.message || 'Author profile unavailable'; return; }
                                                    const prof = a.profile, met = a.metrics || {}, pubs = a.publications || [];
                                                    const years = pubs.map(p => Number(p.pubYear)).filter(y => y > 1800);
                                                    row.latestPub = years.length ? String(Math.max(...years)) : null;
                                                    const inst = prof.currentInstitution, rank = inst?.name ? skGetUniv(inst.name) : {};
                                                    row.profile = {
                                                        email: prof.emailAddress, hindex: met.hindex, docs: met.documentCount, cites: met.citationCount, inst,
                                                        // 大学排名每人只算一次，渲染表格时复用。
                                                        rank: rank.color ? { color: rank.color, text: rank.detail.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() } : null,
                                                        subjects: [...(prof.subjectAreas || [])].sort((x, y) => y.documentCount - x.documentCount)
                                                            .map(s => (scopusSubjectNames[s.code] || s.code) + ' (' + s.documentCount + ')').join('; ')
                                                    };
                                                    row.state = 'Loaded';
                                                });
                                            } catch (error) {
                                                batch.forEach(row => {
                                                    if (!row.profile) { row.state = detailPaused ? 'Not loaded' : 'Failed'; row.error = detailPaused ? '' : error.name === 'AbortError' ? 'Timed out' : error.message; }
                                                });
                                            } finally {
                                                clearTimeout(timeout);
                                                activeControllers.delete(controller);
                                            }
                                            return stop;
                                        }

                                        async function loadCoauthorDetails() {
                                            if (detailRunning) return;
                                            coRows.forEach(row => { row.shown = Boolean(row.profile); if (!row.shown) row.error = ''; });
                                            const pending = coRows.filter(row => !row.shown);
                                            detailsRequested = true; detailRunning = true; detailPaused = false; detailMessage = '';
                                            renderCoauthors();
                                            // 递增分批 6 → 18 → 30 → 45…：首批尽快出结果，后续放大以减少请求；尾部不足 8 人并入当前批。
                                            const batches = [];
                                            for (let i = 0, n; i < pending.length; i += n) {
                                                n = [6, 18, 30][batches.length] ?? 45;
                                                if (pending.length - i - n < 8) n = pending.length - i;
                                                batches.push(pending.slice(i, i + n));
                                            }
                                            try {
                                                let request = batches.length && fetchCoauthorBatch(batches[0]);
                                                for (const [b, batch] of batches.entries()) {
                                                    const stop = await request;
                                                    if (detailPaused || !isOpen()) break;
                                                    // 显示本批的同时，稍作间隔后后台请求下一批。
                                                    const nextBatch = !stop && batches[b + 1];
                                                    let arrived = !nextBatch;
                                                    if (nextBatch) (request = new Promise(r => setTimeout(r, 650 + Math.random() * 500)).then(() => detailPaused || !isOpen() || fetchCoauthorBatch(nextBatch))).then(() => { arrived = true; });
                                                    // 本批逐行显示，按下一批的预计耗时铺开（每行 60–400ms），让表格持续推进；下一批已到或本行失败则快速显示。
                                                    const pace = nextBatch ? Math.min(400, Math.max(60, (900 + coMsPerRow * nextBatch.length) / batch.length)) : 60;
                                                    for (const row of batch) {
                                                        if (!isOpen()) break;
                                                        row.shown = true;
                                                        const next = coRows.find(r => !r.shown);
                                                        row.tr.replaceWith(buildRow(row).addClass('sk-coa-in'));
                                                        next?.tr.replaceWith(buildRow(next, true));
                                                        renderSummary();
                                                        await new Promise(r => setTimeout(r, arrived || !row.profile ? 60 : pace));
                                                    }
                                                    if (stop) break;
                                                }
                                            } finally {
                                                detailRunning = false;
                                                if (detailPaused) detailMessage = 'Paused';
                                                renderCoauthors();
                                            }
                                        }

                                        coExportIcon.on('mousedown', e => { if (e.which === 2 || e.button === 1) e.preventDefault(); }).on('auxclick', function (e) {
                                            if ((e.originalEvent?.button ?? e.button) !== 1) return;
                                            e.preventDefault();
                                            if (!$('#sk-coa-overlay').length) $(this).trigger('click');
                                            if (!detailRunning) detailTask = loadCoauthorDetails();
                                        }).on('click', function () {
                                            if ($('#sk-coa-overlay').length) { overlay.find('#sk-inner-copy-btn').trigger('focus'); return; }
                                            tip = $('<span class="sk-scopus-note" role="status"></span>');
                                            countrySummary = $('<div class="sk-scopus-distribution"></div>');
                                            tableBody = $('<tbody></tbody>');
                                            coTable = $('<table class="sk-scopus-table"><colgroup></colgroup><thead></thead></table>').append(tableBody);
                                            const scroll = $('<div class="sk-scopus-scroll"></div>').append(coTable);
                                            loadBtn = $('<button type="button" class="sk-scopus-btn">Load Details</button>').on('click', function () {
                                                if (!detailRunning && coRows.some(row => !row.profile)) detailTask = loadCoauthorDetails();
                                            });
                                            let copyPending = false;
                                            const copyIcon = $('<button type="button" id="sk-inner-copy-btn" class="sk-scopus-btn">Copy</button>').on('click', function () {
                                                const textToCopy = coauthorTsv();
                                                navigator.clipboard.writeText(textToCopy).then(() => {
                                                    tip.text('Copied'); setTimeout(() => { if (tip.text() === 'Copied') tip.text(''); }, 1500);
                                                }).catch(() => {
                                                    const copyText = $('<textarea readonly></textarea>').val(textToCopy).css({ position: 'fixed', left: '-9999px', top: '0' }).appendTo(popup);
                                                    let copied = false;
                                                    try { copyText[0].select(); copied = document.execCommand('copy'); } catch (e) { } finally { copyText.remove(); }
                                                    tip.text(copied ? 'Copied' : 'Copy failed');
                                                });
                                            }).on('mousedown', e => { if (e.which === 2 || e.button === 1) e.preventDefault(); }).on('auxclick', async function (e) {
                                                if ((e.originalEvent?.button ?? e.button) !== 1) return;
                                                e.preventDefault();
                                                if (copyPending) return;
                                                copyPending = true;
                                                try {
                                                    if (detailPaused && detailRunning) await detailTask;
                                                    if (!popup[0].isConnected) return;
                                                    if (!detailRunning && coRows.some(row => !row.profile)) detailTask = loadCoauthorDetails();
                                                    await detailTask;
                                                    if (popup[0].isConnected && !detailPaused) $(this).trigger('click');
                                                } catch (e) {
                                                    if (popup[0].isConnected) tip.text('Loading failed; middle-click Copy to retry.');
                                                } finally { copyPending = false; }
                                            });
                                            const closeBtn = $('<button type="button" class="sk-scopus-btn" aria-label="Close co-author details">✕</button>').on('click', () => {
                                                detailPaused = true; abortAll(); $('#sk-coa-publications').remove(); overlay.remove(); coExportIcon.trigger('focus');
                                            });
                                            const popup = $('<div id="sk-coa-popup" role="dialog" aria-modal="true" aria-labelledby="sk-coa-title"></div>');
                                            popup.append($('<div class="sk-scopus-toolbar"></div>').append($('<strong id="sk-coa-title"></strong>').text('Co-authors (' + coRows.length + ')')).append(tip, loadBtn, copyIcon, closeBtn));
                                            popup.append($('<div id="sk-coa-body"></div>').append(scroll, countrySummary));
                                            overlay = $('<div id="sk-coa-overlay"></div>').append(popup).on('keydown', e => { if (e.key === 'Escape') closeBtn.trigger('click'); });
                                            $('body').append(overlay); renderCoauthors(); copyIcon.trigger('focus');
                                        });
                                        coSection.append($('<div class="sk-scopus-toolbar sk-scopus-heading"></div>').append($('<strong></strong>').text('Co-authors (' + coRows.length + ')')).append(coExportIcon)).append(coSideNote, coCompact);
                                        (authorPos.length ? authorPos : content).append(coSection);

                                        // 主页加载时只查合作者当前机构（轻量，约 0.1 秒/人），每批 50 人依次请求；邮箱、指标等重字段留给 Load Details。
                                        (async () => {
                                            for (let i = 0; i < coRows.length; i += 50) {
                                                const batch = coRows.slice(i, i + 50);
                                                try {
                                                    const response = await fetchBatchGql(batch, 'profile { currentInstitution { id name country } }', AbortSignal.timeout(35000));
                                                    if (!response.ok) throw new Error('HTTP ' + response.status);
                                                    const data = (await response.json())?.data || {};
                                                    batch.forEach((row, j) => { row.liteInst = data['a' + j]?.profile?.currentInstitution || null; showLiteCountry(row); });
                                                } catch (error) {
                                                    coSideNote.text('Countries could not be loaded (' + (error.name === 'TimeoutError' ? 'timed out' : error.message) + ').');
                                                    return;
                                                }
                                                if (isOpen() && !detailRunning) renderCoauthors();
                                            }
                                            coSideNote.remove();
                                        })();
                                    }

                                    if (!Array.isArray(hData.hirschGraphData) || !Array.isArray(coData.coAuthorsViewBeans)) {
                                        loaded = false;
                                        content.append($('<div class="sk-scopus-note"></div>').text('Some publication or co-author data could not be loaded. ').append($('<button type="button" class="sk-scopus-btn">Retry missing analysis</button>').on('click', triggerLoad)));
                                        inlineLoadBtn.text('↻').css({ cursor: 'pointer', opacity: '1' }).off('click').on('click', triggerLoad);
                                    }

                                    // ── 来源表格 → 插入右栏（找不到右栏则落回主内容区），保留折叠，展开时完整显示 ──
                                    const sources = [...(docData.documentSourceDataViewBeans || [])].sort((a, b) => Number(b.noOfDocuments) - Number(a.noOfDocuments));
                                    if (sources.length) {
                                        const maxSourceDocs = Math.max(1, ...sources.map(s => Number(s.noOfDocuments) || 0));
                                        const srcSection = $('<details id="sk-sources-section" class="sk-scopus-card" open></details>');
                                        srcSection.append($('<summary></summary>').text('Sources (' + sources.length + ')'));
                                        const srcTbody = $('<tbody></tbody>');
                                        sources.forEach(s => {
                                            const srcTr = $('<tr></tr>').css('background-image', 'linear-gradient(to right, #d2e3fc ' + (Number(s.noOfDocuments) / maxSourceDocs * 100) + '%, transparent 0%)');
                                            const jName = s.displayName || s.code || '?';
                                            const jLink = mark((s.url ? $('<a target="_blank" rel="noopener"></a>').attr('href', s.url) : $('<span></span>')).text(jName));
                                            srcTr.append($('<td></td>').append(jLink), $('<td></td>').text(s.noOfDocuments));
                                            srcTbody.append(srcTr);
                                        });
                                        if (docData.totalDataForSourceData) {
                                            srcTbody.append($('<tr class="sk-sources-total"></tr>').append($('<td>Total</td>'), $('<td></td>').text(docData.totalDataForSourceData.noOfDocuments)));
                                        }
                                        srcSection.append($('<table><thead><tr><th>Source</th><th>Docs</th></tr></thead></table>').append(srcTbody));
                                        (authorPos.length ? authorPos : content).append(srcSection);
                                    }

                                    section.append(content);
                                }).catch(() => {
                                    loaded = false;
                                    setBtn(seeAllBtn.show(), 'Retry author analysis');
                                    setBtn(seeCoBtn.show(), 'Retry author analysis');
                                    inlineLoadBtn.text('↻').css({ cursor: 'pointer', opacity: '1' }).off('click').on('click', triggerLoad);
                                    $('#sk-hirsch-error').remove();
                                    section.append($('<div id="sk-hirsch-error" class="sk-scopus-note"></div>').text('Author analysis could not be loaded. Retry or ').append($('<a target="_blank" rel="noopener">open Scopus analysis</a>').attr('href', hirschPageUrl)));
                                });
                            }

                            seeAllBtn.on('click', triggerLoad);
                            seeCoBtn.on('click', triggerLoad);
                            inlineLoadBtn.on('click', triggerLoad);
                            triggerLoad(); // 页面加载完成后自动触发
                        }
                        // Lightweight 分栏已就绪时直接注入；否则等 hr 分割线出现，若新版页面无 #documents-panel hr，则在短延迟后使用回退锚点注入。
                        if ($('#sk-lite-main').length) { skInjectHirschSection(); }
                        else {
                            waitForKeyElements('#documents-panel hr', skInjectHirschSection, true);
                            setTimeout(skInjectHirschSection, 1500);
                        }
                    }, true);
                }

            } else { //Google Scholar

                mark_journals();
                $("#gsc_bpf_more").on("click", function () {
                    let targetNode = document.querySelector('#gsc_a_nn')
                    let observer = new MutationObserver(function () { mark_journals() });
                    observer.observe(targetNode, { characterData: true, childList: true, subtree: true });
                })
                $("div.gsc_prf_il").each(markUniversity);
            };
            function mark_journals() {
                $("div.gs_gray:not([style]),div[data-component='document-source'],div[data-testid='author-list']+span").each(function () {
                    if (maths_regex.test($(this).text())) { $(this).css("background-color", "Wheat") };
                    if (geometry_regex.test($(this).text())) { $(this).css("background-color", "Aquamarine") };
                });
                $("td.gsc_a_t > a:first-child, div[data-testid='document-type-container']+div > h4 > span").each(function () {
                    if (geometry_regex.test($(this).text())) { $(this).css("background-image", "linear-gradient(to bottom, transparent 25%, Aquamarine 25%, Aquamarine 75%, transparent 75%)") };
                });
            }
        } catch (error) { }
    }

    //稿件列表标记Regular
    if (window.location.href.indexOf("/managing/status/") > -1 && GM_config.get('Regular_Color')) {
        try {
            $("#manuscripts-list tbody tr").each(function () {
                var si_item = $(this).find(".si_item").text(); if (!si_item.includes("SI: ") && !si_item.includes("Topic: ")) { $(this).css("background-color", "#FFE5B4") }
            });
        } catch (error) { }
    }

    //派稿助手: iThenticate AUTO
    if (window.location.href.indexOf("managing/status/") + window.location.href.indexOf("sme/status/submitted") > -2 && GM_config.get('Assign_Assistant')) {
        try {
            $("#show_title").parent().append("<input type='button' id='send_ith' value='Send iThenticate in OneClick'>")
            $("#send_ith").on("click", function () {
                if (confirm("I will send ALL manuscripts in this page to iThenticate!") == true) {
                    $("a:contains('math')[href*='/process_form/'],a:contains('games')[href*='/process_form/'],a:contains('mcb')[href*='/process_form/'],a:contains('geometry')[href*='/process_form/']").each(function () { chk_ith($(this).attr('href'), $(this).text()) });
                    $("body").append(`<div class="blockUI blockOverlay"id=ith-shade1 style=z-index:1000;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div>
                                <div class="blockUI blockMsg blockPage" id=ith-shade2 style="z-index:1011;position:fixed;padding:0;margin:0;width:30%;top:5%;height:90%;left:35%;text-align:center;color:#000;border:3px solid #aaa;overflow-y:auto;background-color:#fff">
                                <input onclick='document.getElementById("ith-shade1").remove(),document.getElementById("ith-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"><p id=ith_prompt></p>
                                <input onclick='document.getElementById("ith-shade1").remove(),document.getElementById("ith-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"></div>`)
                    function chk_ith(url, mid) {
                        let ith_chkurl = window.location.origin + "/ajax/manuscript_get_ithenticate_status/" + url.split("/").pop();
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: ith_chkurl,
                            onload: function (responseDetails) {
                                if (responseDetails.responseText.indexOf("iThenticate result found.") == -1) {
                                    GM_xmlhttpRequest({
                                        method: 'GET', url: window.location.origin + "/ajax/upload_manuscript_file_to_ithenticate/" + url.split("/").pop() + "?file_name=manuscript.v1.pdf",
                                        onload: function (responseDetails) {
                                            if (responseDetails.responseText.indexOf("success") != -1) { $("#ith_prompt").html($("#ith_prompt").html() + mid + " is sending to iThenticate... Done<br/>") }
                                            else {
                                                GM_xmlhttpRequest({
                                                    method: 'GET', url: window.location.origin + "/ajax/upload_manuscript_file_to_ithenticate/" + url.split("/").pop() + "?file_name=manuscript.v1.docx",
                                                    onload: function (responseDetails) {
                                                        if (responseDetails.responseText.indexOf("success") != -1) { $("#ith_prompt").html($("#ith_prompt").html() + mid + " is sending to iThenticate... Done<br/>") }
                                                        else {
                                                            $("#ith_prompt").html($("#ith_prompt").html() + mid + " sent failed! Maybe wrong file extension<br/>")
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                                else { $("#ith_prompt").html($("#ith_prompt").html() + mid + " already has iThenticate report<br/>") }
                            }
                        });
                    }
                }
            });
            $("tr.manuscript-status-table > td:nth-child(6)").not(":has('.user_info_modal')").css("text-align", "center").on("bind", "contextmenu", function () { return false; }).each(function () {
                $(this).append($('<a class="sk_reject" style="font-style:italic">').attr('href', '//susy.mdpi.com/user/managing/reject/' + $(this).parents('tr').find('td:nth-child(4) >> a').attr('href').split('/').pop()).text('[Reject]'));
            });
//             $(".sk_reject").on('mouseup', function (e) {
//                 switch (e.which) {
//                     case 3: // Right click.
//                         if (confirm('The paper will be rejected immediately using "without Peer Review Template"')) { GM_openInTab($(this).attr("href").replace("managing/reject/","assigned/reject-manuscript/") + "?quickreject", 1); $(this).parent().html("[Rejected]"); }
//                         return;
//                 }; return true;
//             });
        } catch (error) { }
    }

    //派稿助手: Paper Rejection
    if (window.location.href.indexOf("assigned/reject-manuscript/") > -1 && GM_config.get('Assign_Assistant')) {
        try {
            $('#emailTemplates').val(77).trigger("change"); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change')); window.scrollTo(0, document.body.scrollHeight);
            if (window.location.search == "?quickreject") {
                waitForText(document.querySelector('#mailSubject'), ' ', init);
                function init() { $("#sendingEmail").trigger("click"); }
            }
        } catch (error) { }
    }
    if (window.location.href.indexOf("user/managing/reject/") > -1 && GM_config.get('Assign_Assistant')) {
        try {
            $('input[value="Reject/Recommend"]').trigger("click");
            waitForKeyElements(".jconfirm-title:contains('Error')", AddManuscriptSourceErrorbox);
            waitForKeyElements("#form_comment", function() { window.scrollTo(0, document.body.scrollHeight) });
        } catch (error) { }
    }

    //ManuscriptFunc: 文章页面加[Linkedin]
    if ((window.location.href.indexOf("www.mdpi.com/2") + window.location.href.indexOf("www.mdpi.com/3")) > -2 && GM_config.get('ManuscriptFunc')) {
        try {
            $("a:contains('Peer-Reviewed')").parent().after(skIconLink($("a:contains('Peer-Reviewed')").attr('href') + '?linkedin', 'https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a', { id: 's_linkedin' }));
            $("#s_linkedin").on("click", function () { $("#container").after(`<div class="ui-widget-overlay ui-front" style="background: #aaaaaa;opacity: .5;filter: Alpha(Opacity=50);position: fixed;top: 0;left: 0;width: 100%;height: 100%;"></div>`) });
        } catch (error) { }

        try { //检测参考文献是否缺少[CrossRef]
            let refCount = 0, gsLinks = [];
            $("a.google-scholar").each(function () {
                let $entry = $(this).closest("li");
                if ($entry.length && $entry.find("a.cross-ref").length === 0) {
                    $(this).css("background-color", "yellow");
                    gsLinks.push(this);
                    refCount++;
                }
            });
            let refBtnText = refCount > 0 ? `[U.Ref:${refCount}]` : "[U.Ref✓]";
            let refBtnColor = refCount > 0 ? "color:orange;font-weight:bold;" : "color:green;";
            $("#s_linkedin").after(` <a id="s_refcheck" style="cursor:pointer;font-size:12px;${refBtnColor}">${refBtnText}</a>`);
            // 点击后才开始验证Google Scholar链接
            let gsVerifying = false;
            $("#s_refcheck").on("click", function () {
                if (refCount === 0) return;
                // 跳转到第一个有问题的条目
                let firstHighlight = $("a.google-scholar").filter(function () { let bg = $(this).css("background-color"); return bg === "rgb(255, 107, 107)" || bg === "rgb(255, 255, 0)"; }).first();
                if (firstHighlight.length) { $("html, body").animate({ scrollTop: firstHighlight.offset().top - 100 }, 500); }
                // 首次点击时启动验证
                if (!gsVerifying && gsLinks.length > 0) {
                    gsVerifying = true;
                    let noResult = 0;
                    function verifyGS(index) {
                        if (index >= gsLinks.length) {
                            let finalText = noResult > 0 ? `[U.Ref⚠${noResult}/${gsLinks.length}]` : `[U.Ref✓${gsLinks.length}]`;
                            let finalColor = noResult > 0 ? "color:red;font-weight:bold;" : "color:green;";
                            $("#s_refcheck").attr("style", `cursor:pointer;font-size:12px;${finalColor}`).text(finalText);
                            return;
                        }
                        let $a = $(gsLinks[index]);
                        let url = $a.attr("href");
                        $("#s_refcheck").text(`[U.Ref ${index + 1}/${gsLinks.length}...]`);
                        GM_xmlhttpRequest({
                            method: 'GET', url: url,
                            onload: function (res) {
                                let doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                                if (doc.querySelector('.gs_ri')) {
                                    $a.css("background-color", "#90EE90");
                                } else {
                                    $a.css("background-color", "#FF6B6B");
                                    noResult++;
                                }
                                setTimeout(function () { verifyGS(index + 1); }, 1500);
                            },
                            onerror: function () {
                                setTimeout(function () { verifyGS(index + 1); }, 1500);
                            }
                        });
                    }
                    verifyGS(0);
                }
            });
        } catch (error) { }
    }

    //Black Technology Reviewers
    if (window.location.href.indexOf("/user/assigned/process_form/") + window.location.href.indexOf("/user/managing/process_form/") > -2 && userNames.some(userName => $("#topmenu span:contains('@mdpi.com')").text().includes(userName + "@mdpi.com"))
        && GM_config.get('Hidden_Func')) {
        try {
            waitForKeyElements("#specialBackBtn", ForceAddR);
            function ForceAddR() {
                $("#specialBackBtn").after(' <a type="button" id="ForceAddR" value="[ForceAddR]" class="submit">　　　</a>')
                $("#ForceAddR").on("click", function () {
                    $("#ForceAddR").hide(); $("#addReviewerForm").show();
                    //                 $('#submitBtn_check').parent().parent().parent().parent().parent().parent().on('submit', function(e){
                    //                     e.preventDefault();
                    //                     var formData = $(this).serialize();
                    //                     let now = new Date();
                    //                     $('#submitBtn_check').parent().parent().after("<br>"+now.toLocaleString());
                    //                     $.post($(this).attr('action'), formData, function(response){
                    //                     })
                    //                 });
                })
            }
        } catch (error) { }
    }

    //Interface: 修改图标
    if (window.location.href.indexOf("susy.mdpi.com") > -1 && GM_config.get('Old_Icon')) {
        try {
            for (const [name, icon] of Object.entries({ pencil: icon_pencil, note: icon_note, note_add: icon_note_add, mail: icon_mail })) {
                document.documentElement.style.setProperty('--sk-icon-' + name, `url("${icon}")`);
            }
            document.documentElement.classList.add('sk-old-icons');
            $("._removeEmail:contains('x')").text(" x");
            waitForKeyElements("#intercom-frame", function () { $('.intercom-lightweight-app,#intercom-frame').remove(); }, true);
        } catch (error) { }
    }

    // Scopus Hidden Func
    if (window.location.hostname.indexOf("scopus.com") > -1 && GM_config.get('Hidden_Func')) {
        try {
            if (window.location.href.indexOf("/results/authorListResults.uri?") + window.location.href.indexOf("/results/coAuthorResults.uri?") > -2) {
                $("h1.documentHeader").append(" <a href='#' id='scopus_list'> [Export CSV]</a>");
                $("#scopus_list").on("click", function (e) {
                    e.preventDefault();
                    var csvContent = "";
                    $('#srchResultsList tbody tr.searchArea').each(function () {
                        var $nameLink = $(this).find('.authorResultsNamesCol a');
                        var authorName = $nameLink.text().trim();
                        var authorId = ($nameLink.attr('href') || '').match(/authorId=(\d+)/)?.[1] || '';
                        var affiliation = $(this).find('.dataCol5').text().trim();
                        var country = $(this).find('.dataCol7').text().trim();
                        var hIndex = $(this).find('.dataCol4').text().trim();
                        var documents = $(this).find('.dataCol3').text().trim();

                        var line = [authorId, authorName, affiliation, country, hIndex, documents].join("\t");
                        csvContent += line + "\n";
                    });

                    $('#csv-shade, #csv-popup').remove();
                    const $shade = $('<div class="blockUI blockOverlay" id="csv-shade" style="z-index:1000;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:0.6;position:fixed;"></div>');
                    const $close = $('<input type="button" value="Close" style="margin:10px;padding:5px 20px;cursor:pointer;">');
                    const $textarea = $('<textarea id="csv_content" readonly rows="30" style="width:90%;"></textarea>').val(csvContent);
                    const $popup = $('<div class="blockUI blockMsg blockPage" id="csv-popup"></div>').css({
                        zIndex: 1011, position: 'fixed', padding: '0 0 12px', margin: 0, width: '50%', top: '12%', left: '25%',
                        maxHeight: '76vh', textAlign: 'center', color: '#000', border: '3px solid #aaa', backgroundColor: '#fff', overflowY: 'auto'
                    }).append($close, '<br>', $textarea);
                    $close.add($shade).on('click', () => { $shade.remove(); $popup.remove(); });
                    $("body").append($shade, $popup);

                    $textarea[0].select();
                    navigator.clipboard?.writeText($textarea.val()).catch(() => {});
                })
            }
            if (window.location.href.indexOf("/record/display.uri?eid=") > -1) {
                waitForKeyElements('div[data-testid="author-list"]', mark_emais, true);
                function mark_emais() {
                    $('div[data-testid="author-list"] a[href^="mailto"]').each(function () {
                        var scopus_email = $(this).attr('href').slice('mailto:'.length).split('?')[0]; try { scopus_email = decodeURIComponent(scopus_email); } catch (_) { }
                        var scopus_name = $(this).prevAll('button').first().text();
                        $("#recordPageBoxes").before($('<b>').text(scopus_name), '\u2003', $('<a target="_blank" rel="noopener noreferrer">').attr('href', skMailsdbUrl(scopus_email)).text(scopus_email), '<br>');
                    });
                }
            }
        } catch (error) { }
    }

    //send_cfp_form_susy
    if (window.location.href.indexOf("email/send_cfp_form_susy") > -1 && GM_config.get('Hidden_Func')) {
        try {
            $(".mailBody").each(function () {
                let newVal = $(this).val().replace("We suggest compiling a list of potential contributors alongside myself as your MDPI in-house Editor. I will help to ensure that the excel file is formatted correctly and that the appropriate scholars are contacted. ", "");
                $(this).val(newVal);
            });
        } catch (error) { }
    }

    //Pre-peer-review approval
    if (window.location.href.indexOf(".mdpi.com/user/manuscript/affiliation_approval_list") > -1) {
        try {
            if (S_J > 0) {
                unsafeWindow.$("#form_journal_id").val(S_J).trigger("chosen:updated");
                $("a:contains('Discard')").after(' <input id="checkall" type="button" style="margin-left: 8px; cursor: pointer" value="Check All">')
                $("#checkall").on("click", function () {
                    if (confirm("ALL manuscripts in this page were checked and can be approved!") == true) {
                        // 收集所有包含 /approved 的 data-url 链接
                        var approveUrls = [];
                        $('a[data-url*="/approved"]').each(function () {
                            approveUrls.push($(this).attr('data-url'));
                        });

                        if (approveUrls.length === 0) { return }

                        // 创建进度显示
                        $("body").append(`<div id="approve-progress" style="position: fixed; top: 10px; right: 10px; z-index: 9999; background: #4CAF50; color: white; padding: 15px 25px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 14px;">
                            <div style="font-weight: bold; margin-bottom: 5px;">Approving Manuscripts...</div>
                            <div id="approve-status">Progress: <span id="approve-current">0</span> / <span id="approve-total">${approveUrls.length}</span></div>
                            <div id="approve-bar" style="width: 200px; height: 10px; background: rgba(255,255,255,0.3); border-radius: 5px; margin-top: 8px; overflow: hidden;">
                                <div id="approve-bar-fill" style="width: 0%; height: 100%; background: white; transition: width 0.3s;"></div>
                            </div>
                        </div>`);

                        var completed = 0;
                        var total = approveUrls.length;

                        // 并行发起所有请求
                        approveUrls.forEach(function(url) {
                            $.get(url).always(function() {
                                completed++;
                                $("#approve-current").text(completed);
                                $("#approve-bar-fill").css("width", (completed / total * 100) + "%");

                                if (completed >= total) {
                                    $("#approve-progress").css("background", "#2196F3").find("div:first").text("All Done!");
                                    setTimeout(function() {
                                        $("#approve-progress").fadeOut(500, function() { $(this).remove(); });
                                    }, 2000);
                                }
                            });
                        });
                    }
                })
            }
        } catch (error) { }
    }

    //Dinner
    if (window.location.href.indexOf("i.mdpi.cn/team/dinner") > -1 && userNames.some(userName => $("a.nav-link:contains('@mdpi.com')").text().trim().includes(userName + "@mdpi.com"))) {
        try {
            $('#appbundle_dinner_dinnerRestaurant option:contains("江城快点")').prop('selected', true);
        } catch (error) { }
    }

    //Remind_Dinner
    if (GM_config.get('Remind_Dinner') && window.location.href.indexOf("mdpi.com/") > -1) {
        try {
            let now = new Date();
            let todayDateString = now.toISOString().slice(0, 10); // 获取YYYY-MM-DD格式的日期字符串
            let lastDinnerDate = GM_getValue("lastDinnerDate", "");
            if (todayDateString !== lastDinnerDate) {
                let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0); // 13:00
                let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 30, 0); // 15:30
                if (now >= start && now <= end) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://i.mdpi.cn/team/dinner",
                        onload: function (response) {
                            let parser = new DOMParser();
                            let doc = parser.parseFromString(response.responseText, "text/html");
                            let inputExists = doc.querySelector('#appbundle_dinner_dish') !== null;
                            let linkExists = doc.querySelector('a[href="/team/dinner/list/export"]') !== null;
                            if (!inputExists && linkExists) {
                                GM_setValue("lastDinnerDate", todayDateString);
                            } else {
                                $("body").append(`<div class="blockUI blockOverlay" id=dinner-shade1 style=z-index:1000;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div>
                                    <div class="blockUI blockMsg blockPage" id=dinner-shade2 style="z-index:1011;position:fixed;padding:0;margin:0;width:30%;top:40%;height:20%;left:35%;text-align:center;color:#000;border:3px solid #aaa;overflow-y:auto;background-color:#fff">
                                    <p></p><p id=dinner_prompt><a href="https://i.mdpi.cn/team/dinner" target="_blank">亲，今天的晚餐似乎还没有点喔~</a></p><p id=dinner_prompt2>&nbsp;</p>
                                    <input id="cancelDinnerBtn" type="button" value="不吃晚餐" style="margin:10px;padding:5px 20px"></div>`)
                                if ([4, 5].includes(new Date().getDay())) {
                                    $("#dinner_prompt2").html(`<a href="https://i.mdpi.cn/team/admin/duty" target="_blank" style="background-color: yellow;">【周末值班嘛？记得点值班午餐！】</a>`);
                                }
                                $('#cancelDinnerBtn').on('click', function () {
                                    let userInput = prompt("确认不吃？输入：今天不吃晚餐");
                                    if (userInput === "今天不吃晚餐") { $('#dinner-shade1, #dinner-shade2').remove(); GM_setValue("lastDinnerDate", new Date().toISOString().slice(0, 10)) };
                                });
                            }
                        }
                    });
                }
            }
        } catch (error) { }
    }

    if (window.location.href.indexOf("susy.mdpi.com/user/settings#reviewer") > -1) {
        $("#container").html(`<div class="quickform"><form><div><fieldset><legend>[Mathematics] Batch Add Reviewers</legend><div><div class="cell small-12 medium-6 large-8"><textarea id="inputArea" rows="10" cols="50"></textarea>
        <input type="button" value="Start" id="reviewer_button" class="submit"><span id="spinner" style="display: none; vertical-align: middle; margin-left: 10px;"><div class="loader"></div></span><iframe id="processFrame" style="width:100%; height:1500px;" src="about:blank">
        </iframe></div></div></fieldset></div></form></div>`);

        $("<style type='text/css'> " +
          ".loader { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 2s linear infinite; } " +
          "#spinner { display: inline-flex; align-items: center; } " +
          "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } " +
          "</style>").appendTo("head");

        $("#reviewer_button").on("click", function () {
            $("#inputArea,#reviewer_button").prop('disabled', true);
            $("#spinner").show();
            var lines = $('#inputArea').val().split('\n');
            var tasks = [];
            var currentUrl = null;
            lines.forEach(line => {
                let urlMatch = /(https:\/\/susy\.mdpi\.com\/user.+|\w+-\d{6,})/.exec(line);
                if (urlMatch) {
                    currentUrl = urlMatch[0]; // 当匹配到URL时更新currentUrl
                }
                let emailMatch = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.exec(line);
                if (currentUrl && emailMatch) {
                    tasks.push({ url: currentUrl, email: emailMatch[0] });
                }
            });

            var i = 0;
            async function loadNextURL(retryCount = 0) {
                if (i >= tasks.length) {
                    $("#inputArea,#reviewer_button").prop('disabled', false);
                    $("#spinner").hide();
                    return;
                }

                function updateFrameAndLoad(url) {
                    $('#processFrame').off('load').on('load', function () {
                        try {
                            var iframeDoc = this.contentDocument || this.contentWindow.document;
                            var cemail = tasks[i].email;
                            $(iframeDoc).find('#form_email').val(cemail);
                            $(iframeDoc).find('#nextBtn').trigger('click');
                            waitForKeyElements('#specialBackBtn', process, true, '#processFrame');
                            function process() {
                                if ($(iframeDoc).find('#keepRviewer').length > 0) {
                                    $(iframeDoc).find('#keepRviewer').trigger('click');
                                    setTimeout(waitForKeyElements('#nextBtn:visible', function () {
                                        $('#inputArea').val($('#inputArea').val().replace(cemail, "✅" + cemail));
                                        setTimeout(loadNextURL, 1000);
                                    }, true, '#processFrame'), 1000)
                                } else {
                                    $('#inputArea').val($('#inputArea').val().replace(cemail, "❌" + cemail));
                                    setTimeout(loadNextURL, 100);
                                }
                            }
                            $('#processFrame').off('load');
                        } catch (e) {
                            console.error("Error processing iframe contents:", e);
                        }
                        i++;
                    }).show().attr('src', url);
                }

                if (!tasks[i].url.startsWith("http")) {
                    try {
                        let jsonObject = await $.ajax({
                            url: "//susy.mdpi.com/ajax/submission_get_manuscripts?term=" + tasks[i].url,
                            type: 'GET',
                            dataType: 'json'
                        });
                        if (jsonObject[0]) {
                            tasks[i].url = jsonObject[0].url; // 更新URL
                            updateFrameAndLoad(tasks[i].url);
                        } else {
                            if (retryCount < 3) {
                                console.warn(`Retrying AJAX request for ${tasks[i].url} (attempt ${retryCount + 1})`);
                                setTimeout(() => loadNextURL(retryCount + 1), 1000); // 1秒后重试
                            } else {
                                $('#inputArea').val(String($('#inputArea').val()).replace(tasks[i].email, "⛓️‍💥" + tasks[i].email));
                                i++;
                                setTimeout(loadNextURL, 100);
                            }
                        }
                    } catch (error) {
                        console.error(`AJAX request failed for ${tasks[i].url}, attempt ${retryCount + 1}`, error);
                        if (retryCount < 2) {
                            setTimeout(() => loadNextURL(retryCount + 1), 1000); // 1秒后重试
                        } else {
                            $('#inputArea').val(String($('#inputArea').val()).replace(tasks[i].email, "⛓️‍💥" + tasks[i].email));
                            i++;
                            setTimeout(loadNextURL, 100);
                        }
                    }
                } else {
                    updateFrameAndLoad(tasks[i].url); // 直接加载HTTP URL
                }
            }
            loadNextURL();
        })

        // Extract query parameter after #
        const hashDetails = window.location.hash.split('?');
        if (hashDetails.length > 1) {
            const decodedReviewerId = decodeURIComponent(hashDetails[1]);
            $('#inputArea').val(decodedReviewerId);
            $('#reviewer_button').click();
        }
    }

    if (window.location.href.indexOf("user/managing/reject/") > -1 && GM_config.get('ManuscriptFunc')) {
        try {
            waitForKeyElements(".submit-reasons", function () {
                //$('input[id="Low H-index of authors"],input[id="Lack of novelty"]').prop('checked', true);
                if ($('.card-yellow').length + $('.card-red').length > 0) {
                    $('input[id="Authors have a red/yellow card"]').prop('checked', true);
                }
                //$('.submit-reasons').click();
            }, true)
        } catch (error) { }
    }

    if (window.location.href.indexOf("crm.mdpi.cn/email/add") > -1 && GM_config.get('CRM_VisitingType')) {
        waitForKeyElements('#form_item_category_id', function (categoryNode) {
            const categoryInput = categoryNode[0];
            const crmForm = categoryInput.closest('form') || categoryInput.closest('.ant-form');
            let cancelled = false;
            const stopCrmFill = e => { if (e.isTrusted) cancelled = true; };
            const onCrmForm = () => !cancelled && categoryInput.isConnected;
            crmForm?.addEventListener('pointerdown', stopCrmFill, true);
            crmForm?.addEventListener('keydown', stopCrmFill, true);

            async function waitUntil(fn, timeout = 5000, interval = 40) {
                const until = Date.now() + timeout;
                while (onCrmForm() && Date.now() < until) {
                    try { const result = fn(); if (result) return result; } catch (_) {}
                    await new Promise(resolve => setTimeout(resolve, interval));
                }
                return null;
            }

            function setNativeInputValue(input, value) {
                const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
                if (setter) setter.call(input, value);
                else input.value = value;
                try { input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value })); } catch (_) { input.dispatchEvent(new Event('input', { bubbles: true })); }
            }

            function isDropdownVisible(dropdown) {
                if (!dropdown?.getClientRects().length) return false;
                const style = getComputedStyle(dropdown);
                return style.display !== 'none' && style.visibility !== 'hidden';
            }

            async function fillCrmSelect(id, label) {
                let input = null, select = null;
                try {
                    const result = await waitUntil(() => {
                        const el = document.getElementById(id), sel = el?.closest('.ant-select');
                        if (el && sel?.getClientRects().length && !el.disabled && !sel.classList.contains('ant-select-disabled')) return { input: el, select: sel };
                        return null;
                    }, 10000);

                    if (!result) return false;
                    input = result.input;
                    select = result.select;

                    const current = select.querySelector('.ant-select-selection-item')?.textContent?.trim() || '';
                    if (current) return current === label;
                    input.focus({ preventScroll: true });
                    if (input.getAttribute('aria-expanded') !== 'true') {input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40 }));}

                    await waitUntil(() => {
                        if (input.getAttribute('aria-expanded') === 'true') return true;
                        const dropdown = document.getElementById(input.getAttribute('aria-controls'))?.closest('.ant-select-dropdown');
                        return isDropdownVisible(dropdown);
                    }, 5000);
                    if (!onCrmForm()) return false;

                    if (!input.readOnly) setNativeInputValue(input, label);
                    const option = await waitUntil(() => {
                        const dropdown = document.getElementById(input.getAttribute('aria-controls'))?.closest('.ant-select-dropdown');
                        if (!isDropdownVisible(dropdown)) return null;
                        return [...dropdown.querySelectorAll('.ant-select-item-option')].find(el => !el.classList.contains('ant-select-item-option-disabled') && (el.getAttribute('title') || el.textContent || '').trim() === label) || null;
                    }, 5000);
                    if (!option) return false;
                    option.click();

                    if (await waitUntil(() => select.querySelector('.ant-select-selection-item')?.textContent?.trim() === label, 3000)) return true;

                    try {
                        option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
                        option.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
                        option.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    } catch (_) {}

                    return !!await waitUntil(() => select.querySelector('.ant-select-selection-item')?.textContent?.trim() === label, 2000);
                } catch (error) {
                    console.warn('[SusyModifier] CRM fill Select:', id, label, error);
                    return false;
                } finally {
                    const selected = select?.querySelector('.ant-select-selection-item')?.textContent?.trim() || '';
                    if (onCrmForm() && input?.isConnected && select?.isConnected && !selected && input.value === label) {try { setNativeInputValue(input, ''); } catch (_) {}}
                    if (onCrmForm() && input?.isConnected && input.getAttribute('aria-expanded') === 'true') {try { input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape', code: 'Escape', keyCode: 27, which: 27 }));} catch (_) {}}
                }
            }

            (async () => {
                if (!await fillCrmSelect('form_item_category_id', 'Scholar Visiting')) return;
                if (!await fillCrmSelect('form_item_visit_category', 'Single Journal')) return;
                const journal = GM_config.get('Journal'), visitingType = GM_config.get('CRM_VisitingType');
                if (journal && journal !== 'None') await fillCrmSelect('form_item_journal_ids', journal);
                await fillCrmSelect('form_item_visit_type', visitingType);
            })().catch(error => console.warn('[SusyModifier] CRM autofill:', error)).finally(() => {
                crmForm?.removeEventListener('pointerdown', stopCrmFill, true);
                crmForm?.removeEventListener('keydown', stopCrmFill, true);
            });
        }, false);
    }

    if (window.location.href.indexOf("crm.mdpi.cn/conference/") + window.location.href.indexOf("crm.mdpi.cn/scholar_visits/") + window.location.href.indexOf("crm.mdpi.cn/sponsorship/") + window.location.href.indexOf("crm.mdpi.cn/email/") > -4 && GM_config.get('Hidden_Func')) {
        try {
            waitForKeyElements('button[label="Accept"]:visible:last', function(acceptBtn) {
                function doAccept() {
                    acceptBtn.trigger('click');
                    waitForKeyElements('button:contains("OK"):visible', function($okBtn) {
                        $okBtn.first().trigger('click');
                        setTimeout(function() { location.reload(); }, 1500);
                    }, 10000);
                }
                if ($("input[id^='rc_select_']").length > 0){
                    const $inputs = $("input[id^='rc_select_']");
                    let index = 0;
                    function processNextInput() {
                        if (index >= $inputs.length) {
                            alert('Please check meeting report.');
                            return;
                        }
                        const input = $inputs[index];
                        index++;
                        input.focus();
                        const arrowDownEvent = new KeyboardEvent('keydown', {bubbles: true, cancelable: true, key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40});
                        input.dispatchEvent(arrowDownEvent);

                        waitForKeyElements('.ant-select-item-option[title="Qualified"]:visible', function($option) {
                            $option[0].click();
                            setTimeout(processNextInput, 1500);
                        }, true);
                    }
                    processNextInput();
                } else {
                    doAccept();
                }
            }, true);
        } catch (error) { }
    }

}

//---------------------------------------------------------------------------------------------------------------------------Functions-------------------------------------------------------------------------------------------------------------------------

function skIconLink(href, src, attributes = {}, imageAttributes = {}) { return $('<a>').attr(attributes).attr('href', href).append($('<img>').attr(imageAttributes).attr('src', src)); }
function skMailtoUrl(emails, subject, body) {
    return 'mailto:' + [emails].flat().map(email => encodeURIComponent(email).replace(/%40/gi, '@')).join(';') + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
}
function skMailsdbUrl(email) { return 'https://mailsdb.i.mdpi.com/reversion/search/emails?fm=true&cc=true&to=true&m_type=&sort=desc&link=true&bcc=true&search_content=' + encodeURIComponent(email); }

function skDecodeResourceText(name) {
    if (name === 'customCSS') return SK_CUSTOM_CSS;
    const text = typeof GM_getResourceText === 'function' ? GM_getResourceText(name) : '';
    if (text) return text;
    try {
        const url = typeof GM_getResourceURL === 'function' ? GM_getResourceURL(name, false) : '';
        if (!url || !url.startsWith('data:')) return '';
        const comma = url.indexOf(',');
        if (comma < 0) return '';
        const meta = url.slice(5, comma), payload = url.slice(comma + 1);
        if (!/;base64/i.test(meta)) return decodeURIComponent(payload);
        const binary = atob(payload.replace(/\s+/g, '')), bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return new TextDecoder('utf-8').decode(bytes);
    } catch (_) { return ''; }
}

function skAddResourceStyle(name, extraName, id = 'sk-style-' + [name].flat()[0]) {
    const existing = document.getElementById(id);
    if (existing && existing.textContent.trim()) return;
    const css = [name, extraName].flat().filter(Boolean).map(resName => {
        const base = GM_info.script.resources.find(resource => resource.name === resName)?.url || location.href;
        return skDecodeResourceText(resName).replace(/url\(\s*(?:"([^"\n]*)"|'([^'\n]*)'|([^)]*?))\s*\)/gi, (match, double, single, plain) => {
            const url = (double ?? single ?? plain).trim();
            return !url || /^(?:data:|blob:|#)/i.test(url) ? match : 'url("' + new URL(url, base).href + '")';
        });
    }).join('\n');
    if (existing) existing.remove();
    const styleEl = GM_addStyle(css);
    if (styleEl) styleEl.id = id;
}

function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
    var targetNodes, btargetsFound; if (typeof iframeSelector == "undefined") { targetNodes = $(selectorTxt); } else targetNodes = $(iframeSelector).contents().find(selectorTxt); if (targetNodes && targetNodes.length > 0) {
        btargetsFound = !0; targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || !1; if (!alreadyFound) { var cancelFound = actionFunction(jThis); if (cancelFound) { btargetsFound = !1; } else jThis.data('alreadyFound', !0) }
        })
    } else { btargetsFound = !1 } var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_"); var timeControl = controlObj[controlKey]; if (btargetsFound && bWaitOnce && timeControl) { clearInterval(timeControl); delete controlObj[controlKey] } else {
        if (!timeControl) {
            timeControl = setInterval(function () { waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) }, 300); controlObj[controlKey] = timeControl
        }
    }; waitForKeyElements.controlObj = controlObj
}

function waitForText(element, text, callback, freq) {
    if (!element || typeof callback !== 'function' || typeof text !== 'string') { throw new TypeError('Bad value'); }
    let interval = window.setInterval(test, freq || 300);
    function test() {
        if (!element.parentNode) { window.clearInterval(interval); return; }
        if (element.value.indexOf(text) > -1) { window.clearInterval(interval); callback.call(element); }
    }
}


function skGMFetchGet(url, timeout = 0) { return new Promise(resolve => { GM_xmlhttpRequest({ method: "GET", url: url, timeout, onload: resolve, onerror: resolve, ontimeout: resolve, onabort: resolve }); }) };
function skStringToRegex(str) { if (str.startsWith("[Regex]")) { return RegExp(str.substring(7), "g"); } else { return str } };
function skStringToFunction(str) { if (str.indexOf("function ") == 0) { let funcTest = new Function('return ' + str); return funcTest(); } else { return str } };
function skSidebarSize() {
    $(".note-list-container").css("padding", "0"); $(".note-box-component").css("margin-bottom", "10px");
    if ($(".section-note-box .manuscript-note-item-content").height() > 200) { $(".section-note-box .manuscript-note-item-content").height(200).css("overflow-y", "auto") }
    if ($(".apc-container .manuscript-note-item-content").height() > 200) { $(".apc-container .manuscript-note-item-content").height(200).css("overflow-y", "auto") }
    $(".special-issue-note-box,.manuscript-add-note-form").prop("rows", 22)
    if ($('.special-issue-note-box').length > 0) { $(".manuscript-note-box .manuscript-note-item-content").height(200).css("overflow-y", "auto") }
}
function skLineBreakForQC() {
    $("span:contains('Quality Check')").text("QC");
    //    waitForText(document.querySelector('span:contains("Quality Check")'), 'Quality Check', LineBreak2);
    waitForKeyElements("div.ui-widget-overlay.ui-front", LineBreak2, true);
    function LineBreak2() {
        $("div.large-2:contains('Note')").next().each(function () { $(this).html($(this).html().trim().replace(/\n/g, '<br>\n')) });
        $("div.large-2:contains('Comment')").next().each(function () { $(this).html($(this).html().trim().replace(/\n/g, '<br>\n')) });
    }
}

function skGetJid(s){const journals={
    aam:807,accountaudit:627,acn:703,acoustics:250,actuators:77,addictprev:709,adhesives:597,admsci:88,adolescents:437,aee:769,aerobiology:579,aeronautics:744,aerospace:145,afsd:745,agriculture:95,agriengineering:336,agrochemicals:554,
    agronomy:34,ai:362,aiaerosp:765,aiagents:753,aibiol:798,aichem:652,aieduc:658,aieng:667,aimater:654,aimed:653,aipa:670,air:557,aisens:631,aisoc:702,algorithms:13,allergies:210,alloys:524,amh:604,analog:674,analytica:285,analytics:555,
    anatomia:552,anesthesia:570,anesthres:577,animals:74,antibiotics:116,antibodies:40,antioxidants:75,applbiosci:534,appliedchem:480,appliedmath:517,appliedphys:616,applmech:341,applmicrobiol:456,applnano:390,applsci:90,aps:705,aquacj:335,
    archaeolstud:691,architecture:491,arm:573,arthropoda:578,arts:78,asi:302,astronautics:661,astronomy:523,atmosphere:35,atoms:118,audiolres:471,automation:323,axioms:47,bacteria:496,batteries:201,bcrc:722,bdcc:245,behavsci:82,
    beverages:174,bioactives:758,biochem:459,bioengineering:175,biologics:420,biology:120,biomass:494,biomechanics:458,biomed:477,biomedicines:158,biomedinformatics:410,biomimetics:208,biomolecules:111,biophysica:346,bioresourbioprod:648,
    biosensors:108,biosphere:645,biotech:462,birds:415,blockchains:516,blsf:510,brainsci:91,buildings:67,businesses:427,cancers:23,cancersurviv:760,carbon:195,cardiogenetics:473,cardiovascmed:679,catalysts:27,cells:32,ceramics:240,
    challenges:103,chemeco:751,chemengineering:155,chemistry:350,chemosensors:161,chemproc:406,children:159,chips:515,cimb:497,civileng:299,cleantechnol:305,climate:143,clinbioenerg:625,clinpract:482,clockssleep:288,cmd:330,cmtr:629,
    coasts:487,coatings:107,colloids:253,colorants:501,commodities:531,complexities:647,complications:582,compounds:441,computation:123,computers:26,condensedmatter:214,conservation:440,constrmater:467,cosmetics:125,covid:493,crafts:660,
    crops:451,cryo:591,cryptography:213,crystals:28,csmf:543,ctn:495,culture:672,curroncol:476,dairy:289,data:176,ddc:575,dentistry:144,dermato:396,dermatopathology:400,designs:227,devices:572,dgg:762,dhi:684,diabetology:389,diagnostics:41,
    dietetics:520,digital:416,disabilities:426,diseases:126,diversity:17,dna:450,drones:259,drugreact:713,drylandsci:704,dynamics:428,earth:385,ebj:468,ece:776,ecm:585,"eco-environsci":777,ecologies:356,econometrics:142,economies:151,
    edm:662,education:84,eesp:632,ejihpe:361,electricity:404,electrochem:306,electronicmat:397,electronics:127,embodiedintell:717,encyclopedia:449,endocrines:386,energies:7,eng:391,engproc:402,entomology:533,entropy:5,environments:83,
    environremediat:676,environsciproc:412,enzymology:772,epidemiologia:388,epigenomes:198,epilepsy:750,esa:613,etm:720,famsci:601,fclam:719,fea:729,fermentation:196,fibers:128,fintech:509,fire:319,fishes:212,fluids:192,foods:169,
    forecasting:301,forensicsci:443,forests:42,fossstud:608,foundations:492,fractalfract:275,freshwater:714,fuels:395,future:571,futureinternet:19,futurepharmacol:448,futuretransp:460,galaxies:53,games:25,gases:413,gastroent:434,
    gastrointestdisord:255,gastronomy:583,gels:191,genealogy:209,genes:31,geochem:725,geographies:409,geohazards:347,geomatics:453,geometry:599,geosciences:79,geotechnics:474,geriatrics:179,germs:681,glacies:586,govpol:774,grainsci:712,
    grasses:556,green:685,greenhealth:628,gucdd:580,gynecolcancer:715,hardware:588,healthcare:157,healthcmater:701,hearts:379,hemato:464,hematolrep:559,hep:673,heritage:320,higheredu:567,histories:205,horticulturae:197,hospitals:574,
    humanities:63,humanoids:757,humans:481,hydrobiology:514,hydrogen:382,hydrology:177,hydrometeorology:686,hydropower:663,hygiene:439,idr:469,iic:620,ijcs:650,ijem:656,ijerph:6,ijfs:148,ijgi:113,ijmd:602,ijms:2,ijns:211,ijom:643,ijp:733,
    ijpb:558,ijt:598,ijtm:423,ijtpp:237,ijtst:734,ime:564,immuno:381,industries:682,inflammj:723,informatics:163,information:50,infrastructures:225,inorganics:167,insects:54,instruments:215,inventions:221,investment:716,iot:355,iron:695,
    j:318,jaestheticmed:649,jal:488,japma:696,jcdd:180,jcm:93,jcp:311,jcrm:655,jcs:244,jcto:529,jdad:594,jdb:134,jdcp:767,jdream:675,jemr:644,jeta:542,jfb:104,jfbi:804,jfmk:222,jfth:742,jgbg:680,jgg:689,jimaging:203,jintelligence:106,
    jlpea:110,jmahp:596,jmmp:279,jmms:641,jmp:418,jmse:99,jne:394,jnt:351,jof:186,joi:677,joitmc:339,joma:605,jop:630,joptm:671,jor:401,journalmedia:405,jox:433,jpbi:609,jphytomed:669,jpm:65,jrfm:185,jsam:692,jsan:138,jtaer:454,jvd:566,
    jzbg:399,kidneydial:461,kinasesphosphatases:561,knowledge:499,labmed:606,laboratories:584,lae:693,land:37,langtechnol:731,languages:146,lasers:724,laws:60,legumes:740,life:51,lights:615,limnolrev:590,lipidology:313,liquids:435,
    literature:217,livers:393,logics:538,logistics:170,lubricants:52,lymphatics:539,machines:49,macromol:425,magnetism:432,magnetochemistry:199,make:290,marinedrugs:4,maritime:706,materials:14,materproc:407,mathematics:154,mca:231,mcb:743,
    meb:747,medicina:340,medicines:172,medsci:81,membranes:92,merits:484,metabolites:112,metals:59,metamaterialsadv:756,meteorology:522,methane:525,metrics:617,metrology:465,micro:438,microbiolres:483,microchem:805,microelectronics:624,
    micromachines:22,microorganisms:73,microplastics:498,microwave:623,minerals:45,mining:447,mmphys:619,modelling:314,molbank:11,molecules:1,mollusca:735,mps:207,msf:512,mti:229,multimedia:621,muscles:537,musculoskeletsci:800,mutation:748,
    nanoenergyadv:479,nanomanufacturing:442,nanomaterials:105,ncrna:193,ndt:581,network:457,neuroglia:292,neuroimaging:657,neurolint:472,neurosci:365,nitrogen:239,numbertheory:741,nursrep:429,nutraceuticals:478,nutrients:20,obesities:384,
    occuphealth:678,oceans:359,ohbm:235,onco:475,opermanag:737,optics:360,optoelectronics:746,oral:422,organics:392,organoids:527,osteology:398,oxygen:445,pandemics:664,parasitologia:431,particles:272,pathogens:64,pathophysiology:463,
    peacestud:642,pediatrrep:470,pets:589,pharmaceuticals:18,pharmaceutics:9,pharmacoepidemiology:536,pharmacy:147,phc:707,philosophies:219,photochem:444,photonics:165,photovoltaics:721,phycology:500,physchem:419,physics:358,
    physiologia:436,plants:137,plasma:271,platforms:576,pmh:718,pnr:763,pollutants:383,polymers:29,polysaccharides:304,populations:612,poultry:503,powders:508,ppi:770,precision:732,precisoncol:646,prevhealthc:766,proceedings:247,
    processes:164,prosthesis:364,proteomes:153,psf:511,psych:343,psychiatryint:380,psychoactives:532,psycholint:610,publications:168,purification:600,quantumrep:353,quaternary:277,qubs:224,radiation:411,rareearths:688,rdt:690,reactions:342,
    realestate:595,receptors:545,recycling:202,religions:102,remotesensing:16,reports:252,reprodmed:268,resources:114,rheumato:506,risks:162,rjpm:659,robotics:130,robots:797,rsee:618,ruminants:505,safety:206,sanpp:708,sbf:768,sca:736,
    sci:246,sciedu:710,scipharm:238,sclerosis:568,seeds:332,sensors:3,senssyst:761,separations:233,sexes:218,shi:668,signals:265,sinusitis:200,siuj:603,smartcities:337,smartfish:698,smartgrids:759,societies:58,socsci:71,software:528,
    soilsystems:344,solar:518,solids:414,spectroscj:562,sports:56,standards:173,stats:296,std:560,sti:752,stomatology:778,stratsediment:665,stresses:466,strokerep:699,superintelligence:697,surfaces:294,surgeries:295,suschem:376,
    susenvmgmt:773,sustainability:15,sustainagric:755,sustainfoods:711,sustainpackag:739,symmetry:44,synbio:521,systems:131,tae:622,targets:569,taxonomy:417,technologies:150,telecom:276,textiles:446,thalassrep:544,therapeutics:611,
    thermo:408,timespace:592,tomography:489,totalenviron:771,tourismhosp:378,toxics:171,toxins:21,tph:593,transplantology:352,traumacare:502,tropicalmed:230,universe:133,urbansci:228,uro:403,vaccines:76,vehicles:291,venereology:490,
    vetsci:178,vibration:269,virtualworlds:553,viruses:8,vision:223,waste:530,water:36,welding:683,wetlres:799,wevj:354,wild:614,wind:504,women:349,world:377,xmanagement:754,xscience:749,youth:519,zoonoticdis:541,zoos:775
};return s === undefined ? journals : journals[String(s).trim().toLowerCase()]||0}

var skTitleKeywords = [
    "Pythagorean","Neutrosophic","Picture fuzzy","Grey fuzzy","q-rung Orthopair","Spherical Fuzzy","Conformable","Jumarie","Atangana-Baleanu","Atangana–Baleanu","Caputo-Fabrizio","Caputo–Fabrizio","Katugampola"
];

function skGetUniv(aff) {
    let results = "", color = "", i, len;
    var u_QP = ["tsinghua", "peking", "北京大学", "清华大学"];
    var u_QPr = ["24 Tsinghua University", "25 Peking University", "北京大学", "清华大学"];
    var u_A = ["shanghai jiao","fudan univ","university of science and technology of china","sci & technol china","zhejiang univ","sun yat-sen","harbin institute","nanjing univ","beijing normal","nankai univ","tongji univ","wuhan univ","shandong univ","an jiao","sichuan univ",
               "jilin univ","复旦大学","中国科学技术大学","山东大学","南开大学","浙江大学","北京师范大学","上海交通大学","西安交通大学","四川大学","南京大学","中山大学","吉林大学","哈尔滨工业大学","武汉大学","同济大学"];
    var u_Ar = ["50 Shanghai Jiao Tong University","53 Fudan University","74 University of Science and Technology of China","74 University of Science and Technology of China","89 Zhejiang University","151+ Sun Yat-sen University","151+ Harbin Institute of Technology",
                "136 Nanjing University","151+ Beijing Normal University","151+ Nankai University","201+ Tongji University","151+ Wuhan University","251+ Shandong University","201+ Xi’an Jiaotong University","301+ Sichuan University","Jilin University","复旦大学",
                "中国科学技术大学","山东大学","南开大学","浙江大学","北京师范大学","上海交通大学","西安交通大学","四川大学","南京大学","中山大学","吉林大学","哈尔滨工业大学","武汉大学","同济大学"];
    var u_B = ["beihang univ","beijing institute of technology","shanghai univ","huazhong university of science","huazhong univ sci ","tianjin univ","east china normal","central south","xiamen univ","chinese academy of science","renmin university of",
               "beijing university of aeronautics","capital normal","northeast normal","lanzhou univ","xiangtan univ","dalian university of technology","south china university of","soochow univ","suzhou univ","chongqing univ","hunan univ","hunan normal","southwest univ",
               "northwestern polytechnical","institute of applied physics and computational mathematics","institute of computational mathematics and scientific engineering computing","beijing institute of mathematical sciences and applications","华东师范大学","中国科学院大学",
               "厦门大学","首都师范大学","华中科技大学","东北师范大学","兰州大学","中南大学","湘潭大学","华南理工大学","苏州大学","北京航空航天大学","中国人民大学","重庆大学","湖南大学","西南大学","湖南师范大学","天津大学","上海大学","北京理工大学","中国科学院","北京应用物理与计算数学研究所",
               "计算数学与科学工程计算研究所","北京雁栖湖应用数学研究所","西北工业大学","大连理工大学"];
    var u_Br = ["201+ Beihang University","201+ Beijing Institute of Technology","251+ Shanghai University","251+ Huazhong University of Science and Technology","251+ Huazhong University of Science and Technology","Tianjin University","East China Normal University",
                "Central South University","251+ Xiamen University","Chinese Academy of Sciences<br>(Please further check its institute and decide)","Renmin University of China","Beijing University of Aeronautics and Astronautics","Capital Normal University",
                "Northeast Normal University","Lanzhou University","Xiangtan University","Dalian University of Technology","South China University of Technology","Soochow University","Soochow University","Chongqing University","Hunan University","Hunan Normal University",
                "Southwest University","Northwestern Polytechnical University","Institute of Applied Physics and Computational Mathematics","Institute of Computational Mathematics and Scientific Engineering Computing",
                "Beijing Institute of Mathematical Sciences and Applications","华东师范大学","中国科学院大学","厦门大学","首都师范大学","华中科技大学","东北师范大学","兰州大学","中南大学","湘潭大学","华南理工大学","苏州大学","北京航空航天大学","中国人民大学","重庆大学","湖南大学",
                "西南大学","湖南师范大学","天津大学","上海大学","北京理工大学","中国科学院","北京应用物理与计算数学研究所","计算数学与科学工程计算研究所","北京雁栖湖应用数学研究所","西北工业大学","大连理工大学"];
    var u_C = ["china agricultural univ","zhengzhou univ","university of science and technology beijing","shanghai university of finance","beijing university of technology","xidian univ","nanchang univ","south china normal","huazhong normal","nanjing normal",
               "shandong university of science","northeastern univ","shaanxi normal","nanjing university of science","northwest a&f","northwest agriculture","ocean university of china","central china normal","fujian normal","northwest normal","xinjiang univ","nanjing agr",
               "east china university of sci","wuhan university of technology","china university of mining and technology","fuzhou univ","china university of geosciences","china university of petroleum","beijing university of chemical technology","jiangsu univ","beijing jiao",
               "southeast univ","university of electronic science","southern university of science","central university of finance","dalian maritime univ","hohai univ","hefei university of technology","huazhong agr","jinan univ","hainan univ","guizhou univ","qinghai univ",
               "beijing university of posts","university of international business","liaoning univ","harbin engineering univ","jiangnan univ","southwestern university of finance","yunnan univ","ningxia univ","north china elect","hebei university of technology","yanbian univ",
               "anhui univ","zhongnan university of economics and law","southwest jiao","tibet univ","beijing forestry univ","taiyuan university of technology","northeast forestry univ","guangxi univ","northwest univ","changan univ","chang'an univ","shihezi univ",
               "guangzhou univ","ningbo univ","yangzhou univ","mongolia univ","shanxi univ","donghua univ","henan univ","hubei univ","nanjing university of information science","nanjing univ informat sci","zhejiang sci-tech","shantou univ","university of shanghai for science",
               "univ shanghai sci","zhejiang university of technology","zhejiang univ technol","changsha university of science","changsha univ sci","qingdao univ","yantai univ","guilin university of electronic technology","guilin univ elect technol",
               "north china univ water resources","north china university of water resources","nanjing university of posts","nanjing univ posts","westlake univ","nanjing forestry univ","new york university shanghai","nyu shanghai","duke kunshan univ",
               "guangdong technion-israel","nottingham","wenzhou-kean univ","shenzhen univ","nanjing university of aeronautics","华中师范大学","陕西师范大学","华南师范大学","南京师范大学","福建师范大学","西北师范大学","新疆大学","中国矿业大学","郑州大学","云南大学","扬州大学",
               "福州大学","安徽大学","西北大学","内蒙古大学","北京科技大学","华东理工大学","合肥工业大学","东北大学","北京工业大学","宁波大学","北京交通大学","广州大学","暨南大学","南昌大学","贵州大学","山西大学","东华大学","中国海洋大学","西南交通大学","南京理工大学","江苏大学","河南大学",
               "湖北大学","广西大学","南京信息工程大学","浙江理工大学","汕头大学","河海大学","西安电子科技大学","电子科技大学","东南大学","上海理工大学","宁夏大学","南方科技大学","浙江工业大学","长沙理工大学","哈尔滨工程大学","青岛大学","上海财经大学","西南财经大学","烟台大学",
               "桂林电子科技大学","长安大学","华北水利水电大学","北京邮电大学","南京邮电大学","河南大学","上海纽约大学","西交利物浦大学","昆山杜克大学","广东以色列理工学院","南京林业大学","西湖大学","南京航空航天","温州肯恩大学","宁波大学","中国农业大学","山东科技大学","武汉理工大学",
               "中国地质大学","中国石油大学","北京化工大学","大连海事大学","河北工业大学","太原理工大学","西北农林大学","南京农业大学","中央财经大学","华中农业大学","海南大学","青海大学","对外经济贸易大学","辽宁大学","江南大学","华北电力大学","延边大学","中南财经政法大学","西藏大学",
               "北京林业大学","东北林业大学","石河子大学","深圳大学"];
    var u_Cr = ["China Agricultural University","Zhengzhou University","University of Science and Technology Beijing","Shanghai University of Finance and Economics","Beijing University of Technology","Xidian University","Nanchang University","South China Normal University",
                "Huazhong Normal University","Nanjing Normal University","Shandong University of Science and Technology","Northeastern University","Shaanxi Normal University","Nanjing University of Science and Technology","Northwest A&F University","Northwest A&F University",
                "Ocean University of China","Central China Normal University","Fujian Normal University","Northwest Normal University","Xinjiang University","Nanjing Agricultural University","East China University of Science and Technology","Wuhan University of Technology",
                "China University of Mining and Technology","Fuzhou University","China University of Geosciences","China University of Petroleum","Beijing University of Chemical Technology","Jiangsu University","301+ Beijing Jiaotong University","251+ Southeast University",
                "University of Electronic Science and Technology","Southern University of Science and Technology","Central University of Finance and Economics","Dalian Maritime University","Hohai University","Hefei University of Technology","Huazhong Agricultural University",
                "Jinan University","Hainan University","Guizhou University","Qinghai University","Beijing University of Posts and Telecommunications","University of International Business and Economics","Liaoning University","Harbin Engineering University",
                "Jiangnan University","Southwestern University of Finance and Economics","Yunnan University","Ningxia University","North China Electric Power University","Hebei University of Technology","Yanbian University","Anhui University",
                "Zhongnan University of Economics","Southwest Jiaotong University","Tibet University","Beijing Forestry University","Taiyuan University of Technology","Northeast Forestry University","Guangxi University","Northwest University","Changan University",
                "Changan University","Shihezi University","GuangZhou University","Ningbo Univ","Yangzhou Univ","Mongolia University","Shanxi University","Donghua University","Henan University","Hubei University","Nanjing University of Information Science and Technology",
                "Nanjing University of Information Science and Technology","Zhejiang Sci-Tech University","Shantou University","University of Shanghai for Science and Technology","University of Shanghai for Science and Technology","Zhejiang University of Technology",
                "Zhejiang University of Technology","Changsha University of Science and Technology","Changsha University of Science and Technology","Qingdao University","Yantai University","Guilin University of Electronic Technology",
                "Guilin University of Electronic Technology","North China University of Water Resources and Electric Power","North China University of Water Resources and Electric Power","Nanjing University of Posts and Telecommunications",
                "Nanjing University of Posts and Telecommunications","Westlake University","Nanjing Forestry University","New York University Shanghai","New York University Shanghai","Duke Kunshan University","Guangdong Technion-Israel Institute of Technology",
                "University of Nottingham Ningbo China","Wenzhou-Kean University","Shenzhen University","Nanjing University of Aeronautics and Astronautics","华中师范大学","陕西师范大学","华南师范大学","南京师范大学","福建师范大学","西北师范大学","新疆大学","中国矿业大学","郑州大学",
                "云南大学","扬州大学","福州大学","安徽大学","西北大学","内蒙古大学","北京科技大学","华东理工大学","合肥工业大学","东北大学","北京工业大学","宁波大学","北京交通大学","广州大学","暨南大学","南昌大学","贵州大学","山西大学","东华大学","中国海洋大学","西南交通大学","南京理工大学",
                "江苏大学","河南大学","湖北大学","广西大学","南京信息工程大学","浙江理工大学","汕头大学","河海大学","西安电子科技大学","电子科技大学","东南大学","上海理工大学","宁夏大学","南方科技大学","浙江工业大学","长沙理工大学","哈尔滨工程大学","青岛大学","上海财经大学","西南财经大学",
                "烟台大学","桂林电子科技大学","长安大学","华北水利水电大学","北京邮电大学","南京邮电大学","河南大学","上海纽约大学","西交利物浦大学","昆山杜克大学","广东以色列理工学院","南京林业大学","西湖大学","南京航空航天","温州肯恩大学","宁波大学","中国农业大学","山东科技大学",
                "武汉理工大学","中国地质大学","中国石油大学","北京化工大学","大连海事大学","河北工业大学","太原理工大学","西北农林大学","南京农业大学","中央财经大学","华中农业大学","海南大学","青海大学","对外经济贸易大学","辽宁大学","江南大学","华北电力大学","延边大学","中南财经政法大学",
                "西藏大学","北京林业大学","东北林业大学","石河子大学","深圳大学"];
    var u_D = ["of hong kong","hong kong university of","of nottingham"];
    var u_Dr = ["Hong Kong","Hong Kong","University of Nottingham"];
    var u_2 = ["king abdulaziz","king abdul aziz","king abdul-aziz","de são paulo","of são paulo","de sao paulo","of sao paulo","de buenos aires","universidad nacional autónoma de méxico","national autonomous university of mexico","indian institute of technology bombay",
               "universidade estadual de campinas","state university of campinas","indian institute of technology delhi","indian institute of technology kanpur","universidad de chile","university of chile","indian institute of science","universiti malaya",
               "university of malaya","indian institute of technology madras"];
    var u_2r = ["65 King Abdulaziz University (KAU)","65 King Abdulaziz University (KAU)","65 King Abdulaziz University (KAU)","95 Universidade de São Paulo","95 Universidade de São Paulo","95 Universidade de São Paulo","95 Universidade de São Paulo",
                "104 Universidad de Buenos Aires (UBA)","107 Universidad Nacional Autónoma de México (UNAM)","107 Universidad Nacional Autónoma de México (UNAM)","117 Indian Institute of Technology Bombay (IITB)","124 Universidade Estadual de Campinas (UNICAMP)",
                "124 Universidade Estadual de Campinas (UNICAMP)","128 Indian Institute of Technology Delhi (IITD)","132 Indian Institute of Technology Kanpur (IITK)","132 Universidad de Chile","132 Universidad de Chile","142 Indian Institute of Science",
                "144 Universiti Malaya (UM)","144 Universiti Malaya (UM)","148 Indian Institute of Technology Madras (IITM)"];
    var u_Abbr = ["BUAA","NUDT","CAS","KAU","UBA","UNAM","IITB","UNICAMP","Unicamp","IITD","IITK","UM","IITM"];
    var u_Abbrr = ["Rank B 201+ Beihang University","Rank B National University of Defense Technology","Chinese Academy of Sciences<br>(Please further check its institute and decide)","65 King Abdulaziz University","104 Universidad de Buenos Aires",
                   "107 Universidad Nacional Autónoma de México","117 Indian Institute of Technology Bombay","124 Universidade Estadual de Campinas","124 Universidade Estadual de Campinas","128 Indian Institute of Technology Delhi",
                   "132 Indian Institute of Technology Kanpur","144 Universiti Malaya","148 Indian Institute of Technology Madras"];
    var u_Black = ["taizhou institute of zhejiang"];
    var u_Blackr = ["Taizhou Institute of Zhejiang"];
    for (i = 0, len = u_Abbr.length; i < len; i++) { if (aff.indexOf(u_Abbr[i]) > -1) { results += "<span style='background-color:pink;font-weight:bold'>Abbr: " + u_Abbrr[i] + "</span>"; color = "pink"; break; } }
    aff = aff.toLowerCase();

    for (i = 0, len = u_2.length; i < len; i++) { if (aff.indexOf(u_2[i]) > -1) { results += "<span style='background-color:lightblue;font-weight:bold'>Top150: " + u_2r[i] + "</span>"; color = "lightblue"; break; } }
    for (i = 0, len = u_D.length; i < len; i++) {
        if (aff.indexOf(u_D[i]) > -1 && (u_D[i].indexOf("of") > -1 || (u_D[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1))) {
            results += "<span style='background-color:thistle;font-weight:bold'>Rank HK: " + u_Dr[i] + "</span>"; color = "thistle";
        }
    }
    for (i = 0, len = u_C.length; i < len; i++) {
        if (aff.indexOf(u_C[i]) > -1 && (u_C[i].indexOf("of") > -1 || (u_C[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1))) {
            results += "<span style='background-color:lightgreen;font-weight:bold'>Rank C: " + u_Cr[i] + "</span>"; color = "lightgreen";
        }
    }
    for (i = 0, len = u_B.length; i < len; i++) {
        if (aff.indexOf(u_B[i]) > -1 && (u_B[i].indexOf("of") > -1 || (u_B[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1))) {
            results += "<span style='background-color:wheat;font-weight:bold'>Rank B: " + u_Br[i] + "</span>"; color = "wheat";
        }
    }
    for (i = 0, len = u_A.length; i < len; i++) {
        if (aff.indexOf(u_A[i]) > -1 && (u_A[i].indexOf("of") > -1 || (u_A[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1))) {
            results += "<span style='background-color:lightblue;font-weight:bold'>Rank A: " + u_Ar[i] + "</span>"; color = "lightblue";
        }
    }
    for (i = 0, len = u_QP.length; i < len; i++) { if (aff.indexOf(u_QP[i]) > -1) { results += "<span style='background-color:cyan;font-weight:bold'>Rank Top: " + u_QPr[i] + "</span>"; color = "cyan"; } }
    for (i = 0, len = u_Black.length; i < len; i++) { if (aff.indexOf(u_Black[i]) > -1) { results = "<span style='background-color:#ffc1c1;color:#c33;font-weight:bold'>⛔ Blacklist: " + u_Blackr[i] + "</span>"; color = "#111111"; } }
    return { detail: results, color: color };
}

function skMakeDraggable(elmnt, header) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // 移除 transform 以便直接使用 top/left 定位
        if (elmnt.style.transform) {
            var rect = elmnt.getBoundingClientRect();
            elmnt.style.top = rect.top + "px";
            elmnt.style.left = rect.left + "px";
            elmnt.style.transform = "none";
        }
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function skOpenUrls() {
    if ($("#add_r").length) {
        if ($("#add_r").css("display") == "none") { $("#add_r").css("display", "block") } else { $("#add_r").css("display", "none") }
    } else {
        $("body").append(`<div id='add_r' role='dialog' style='position: fixed; height: 350px; width: 350px; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 101; background-color: #E8F5E9; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); border-radius: 5px;
        overflow: hidden;'> <div id='add_r_header' style='background-color: #4CAF50; color: white; padding: 10px 15px; font-size: 15px; border-top-left-radius: 5px; border-top-right-radius: 5px; cursor: move;'> <span>Open Urls, IDs & Emails [Ctrl+Q]</span>
        <button type='button' onclick='document.getElementById("add_r").style.display="none"' style='float: right; border: none; background-color: transparent; color: white; font-size: 20px; cursor: pointer;'>&times;</button> </div> <div style='padding: 20px;'>
        <textarea id="add_r_t" class="manuscript-add-note-form" placeholder="Example:\nmathematics-11111111\nmathematics-2222222\n\nhttps://www.scopus.com/detail.uri?authorId=333\nhttps://scholar.google.com/citations?user=444\n\naaa@aaa.edu\nbbb@bbb.edu" minlength="1"
        rows="10" spellcheck="false" style='width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ccc; border-radius: 4px;'></textarea>
        <button id="add_r_b" class="submit" style='background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;'>Submit</button></div></div>`);
        skMakeDraggable(document.getElementById("add_r"), document.getElementById("add_r_header"));
        $("#add_r_t").trigger("focus");
        $("#add_r_b").on("click", function () {
            var textContent = String($("#add_r_t").val());
            var urlRegex = /(https?:\/\/[^\s]+)/g;
            var emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
            var digitRegex = /(?<!\d)(\d{6,7})(?!\d)/g;
            // 查找网址
            var urls = textContent.match(urlRegex) || [];
            urls.forEach(function (url) { window.open(url, '_blank') });
            textContent = textContent.replace(urlRegex, ''); // 移除已找到的网址
            // 查找邮箱
            var emails = textContent.match(emailRegex) || [];
            emails.forEach(function (email) { window.open(skMailsdbUrl(email), '_blank') });
            textContent = textContent.replace(emailRegex, '');
            // 查找连续的6位或7位数字
            var digits = textContent.match(digitRegex) || [];
            digits.forEach(function (digit) { window.open('https://susy.mdpi.com/build/img/design/susy-logo.png?term=' + digit, '_blank') });

        })
    }
}

function skAddReviewers() {
    if ($("#add_susie").length) {
        if ($("#add_susie").css("display") == "none") { $("#add_susie").css("display", "block"); } else { $("#add_susie").css("display", "none") }
    } else {
        $("body").append(`<div id='add_susie' role='dialog' style='position: fixed; height: 350px; width: 350px; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 101; background-color: #ECEFF1; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); border-radius: 5px;
        overflow: hidden;'> <div id='add_susie_header' style='background-color: #546E7A; color: white; padding: 10px 15px; font-size: 15px; border-top-left-radius: 5px; border-top-right-radius: 5px; cursor: move;'> <span>Add Reviewers [Ctrl+E] <a href='/user/settings#reviewer'
        target=_blank style='color: #CFD8DC;'>[Full Version]</a></span>
        <button type='button' onclick='document.getElementById("add_susie").style.display="none"' style='float: right; border: none; background-color: transparent; color: white; font-size: 20px; cursor: pointer;'>&times;</button> </div> <div style='padding: 20px;'>
        <textarea id="add_susie_t" class="manuscript-add-note-form" placeholder="Example:\nmathematics-xxxxxx\naaa@aaa.edu\nbbb@bbb.edu (in USA now)\nhttps://susy.mdpi.com/user/xxxxxxxxxxxx\nccc@ccc.edu ddd@ddd.edu" minlength="1" maxlength="20000"
        rows="10" spellcheck="false" style='width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ccc; border-radius: 4px;'></textarea>
        <button id="add_susie_b" class="submit" style='background-color: #546E7A; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;'>Submit</button></div></div>`);
        skMakeDraggable(document.getElementById("add_susie"), document.getElementById("add_susie_header"));
        $("#add_susie_t").trigger("focus");
        $("#add_susie_b").on("click", function () {
            let myArray, add_id, emailArray, rdline = String($("#add_susie_t").val()).split("\n");
            rdline.forEach((line, _) => {
                if ((myArray = /(https:\/\/susy\.mdpi\.com\/user.+|\w+-\d{6,})/.exec(line)) !== null) {
                    add_id = myArray[0];
                }
                const emailPattern = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
                while ((emailArray = emailPattern.exec(line)) !== null) {
                    if (add_id.startsWith("https://")) { // 如果 add_id 是网址，则以这种方式构建 URL 并打开
                        GM_openInTab(add_id + "?finder2_reviewer_email=" + emailArray[0], true);
                    } else { // 如果 add_id 是字母数字-数字模式，则以原有方式构建 URL 并打开
                        GM_openInTab(window.location.origin + "/build/img/design/susy-logo.png?term=" + add_id + "&finder2_reviewer_email=" + emailArray[0], true);
                    }
                }
            });
        });
    }
}

function skMyAccountOnly() {
    let My_Account_Only = String(GM_config.get('My_Account_Only'));
    let Current_Account = $("#topmenu span:contains('@mdpi.com')").text();
    if (My_Account_Only.length > 0 && Current_Account != My_Account_Only) {
        $('body').append(`<div id="overlay" style="position: fixed; width: 100%; height: 100%; top: 0px; left: 0px; background: rgba(0, 0, 0, 0.5); z-index: 1000;"></div>
        <div id="alertBox" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 20px; background: white; border: 1px solid black; z-index: 1001;"><p>You are now using: ${Current_Account}</p><button id="okBtn">[OK]</button></div>`);
        $('#okBtn').on("click", function () { $('#overlay, #alertBox').remove() });
    }
}

function skReadWorkLoginRun(runId) { const run = GM_getValue('skWorkLogin', {}); return run.run && (!runId || run.run === runId) && Array.isArray(run.sites) && Date.now() <= Number(run.until || 0) ? run : null; }

function skCheckWorkLoginStatus(siteId, timeout = 6000, signal) {
    const site = SK_WORK_LOGIN_SITES.find(site => site.id === siteId), target = new URL(site.checkUrl || site.url);
    return new Promise(resolve => {
        let request, settled = false;
        const finish = value => { if (!settled) { settled = true; clearTimeout(guard); signal?.removeEventListener('abort', abort); resolve(value); } };
        const abort = () => { finish(null); request?.abort(); }, guard = setTimeout(abort, timeout + 250);
        if (signal?.aborted) { abort(); return; } signal?.addEventListener('abort', abort, { once: true });
        try {
            request = GM_xmlhttpRequest({
                method:site.checkType === 'boolean' ? 'GET' : 'HEAD',url:target.href,redirect:'manual',timeout,headers:{'Cache-Control':'no-cache'},
                onload(res) {
                    if (res.status === 401) { finish(false); return; } if (res.status < 200 || res.status >= 400) { finish(null); return; }
                    const redirect = res.status >= 300, location = /^location:\s*(.+)$/im.exec(res.responseHeaders || '')?.[1]?.trim();
                    let finalUrl; try { finalUrl = new URL(redirect ? location : res.finalUrl, target); } catch (_) { finish(null); return; }
                    if (redirect ? !location : !res.finalUrl) { finish(null); return; }
                    if (/^(?:auth|login|keycloak)\.mdpi\.(?:com|cn)$|^login\.microsoftonline\.com$/i.test(finalUrl.hostname) ||
                        /\/(?:login|welcome|2fa|mfa)(?:\/|$)/i.test(finalUrl.pathname)) { finish(false); return; }
                    // Inspect the first response: no HTML download and no trip through a home page or authentication chain.
                    if (finalUrl.origin !== target.origin || finalUrl.pathname !== (site.checkPath || target.pathname)) { finish(null); return; }
                    if (site.checkType === 'boolean') { const text = (res.responseText || '').trim(); finish(!redirect && /^(true|false)$/.test(text) ? text === 'true' : null); }
                    else finish(true);
                },
                onerror: () => finish(null), ontimeout: () => finish(null), onabort: () => finish(null)
            });
        } catch (_) { finish(null); }
    });
}

function skOpenWorkLoginHub() {
    document.documentElement.innerHTML = `<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Work Login Hub</title>
    <style id="sk-style-customCSS">${skDecodeResourceText('customCSS')}</style></head><body class="sk-work-login"><main id="sk-work-login-page" class="sk-work-page"><section class="sk-work-card">
    <div class="sk-work-summary"><span id="sk-work-badge" class="sk-work-badge">Checking</span></div>
    ${SK_WORK_LOGIN_SITES.map(site => `<div class="sk-work-row" data-site="${site.id}" data-state="checking"><span class="sk-work-dot"></span><span class="sk-work-name">${site.name}</span>
    <span class="sk-work-state" aria-live="polite">Checking…</span><a class="sk-work-open" href="${site.url}" target="_blank" rel="noopener">Open</a></div>`).join('')}
    <div class="sk-work-actions"><button type="button" id="sk-work-start" class="sk-work-start">Start Batch Login</button>
    ${GM_getValue('isUserNameMatch', false) ? `<div class="sk-work-extra-actions"><a id="sk-scholar-check" class="sk-work-btn" href="https://susy.mdpi.com/user/settings#G" target="_blank">Scholar Check</a>
    <button type="button" class="sk-work-btn sk-work-btn-placeholder"></button></div>` : ''}</div></section></main></body>`;
    const systems = SK_WORK_LOGIN_SITES.map(site => ({ ...site, row: document.querySelector('.sk-work-row[data-site="' + site.id + '"]'), state: 'checking', job: false, queued: false, serial: 0 }));
    const start = document.getElementById('sk-work-start'), badge = document.getElementById('sk-work-badge'), owner = crypto.randomUUID(), listeners = [];
    let run = null, nextVerify = 0, disposed = false;
    const pending = () => systems.filter(site => site.job), statusKey = site => 'skWorkLoginStatus_' + site.id, currentRun = () => run && skReadWorkLoginRun(run.run);
    function setRow(site, state, text) { site.state = site.row.dataset.state = state; site.row.querySelector('.sk-work-state').textContent = text; }
    function render() {
        const jobs = pending(), remaining = systems.filter(site => site.state !== 'ok'), checking = systems.some(site => site.check), retryable = jobs.some(site => site.state === 'unknown');
        badge.textContent = !remaining.length ? 'All Logged In' : jobs.length ? 'Logging In' : checking ? 'Checking' : run ? 'Login Incomplete' : 'Check Completed';
        start.disabled = !remaining.length || (jobs.length > 0 && !retryable);
        start.textContent = !remaining.length ? (run ? 'All Logins Completed' : 'All Logged In') : retryable ? 'Retry Incomplete Logins' : jobs.length ? 'Batch logging in…' : run ? 'Retry Incomplete Logins' : 'Start Batch Login';
    }
    function writeStatus(site, state, text) { if (currentRun()) GM_setValue(statusKey(site), { run: run.run, state, text }); }
    function finish(site) {
        site.serial++; site.job = site.queued = false; setRow(site, 'ok', 'Logged in'); if (site.tab && !site.tab.closed) { site.tab.onclose = null; site.tab.close(); }
        const current = currentRun(), saved = GM_getValue(statusKey(site), {});
        if (current && current.sites.includes(site.id)) {
            if (saved.run !== run.run || saved.state !== 'ok') writeStatus(site, 'ok', 'Logged in');
            if (!pending().length && !current.finishedAt) GM_setValue('skWorkLogin', { ...current, finishedAt: Date.now() });
        }
        render();
    }
    function receive(site) {
        if (!site.job || !currentRun()) return; const saved = GM_getValue(statusKey(site), {}); if (saved.run !== run.run) return;
        if (saved.state === 'ok') finish(site);
        else if (saved.text) { site.queued = saved.state === 'queued'; setRow(site, site.queued ? 'checking' : saved.state, saved.text); }
    }
    function coordinate() {
        // One hub launches queued tabs; a reopened hub takes over after the previous owner closes or stops responding.
        const current = currentRun(); if (!current || current.finishedAt) return false; if (current.owner !== owner && Date.now() - Number(current.heartbeat || 0) < 5000) return false;
        if (current.owner !== owner || Date.now() - Number(current.heartbeat || 0) >= 2000) GM_setValue('skWorkLogin', { ...current, owner, heartbeat: Date.now() });
        return skReadWorkLoginRun(run.run)?.owner === owner;
    }
    function launch(site) {
        if (!site.job || !site.queued || !coordinate() || (site.tab && !site.tab.closed)) return;
        site.queued = false; writeStatus(site, 'working', 'Logging in…');
        try {
            site.tab = GM_openInTab('https://www.mdpi.com/?sk-work-login#sk-work-login=' + run.run + ':' + site.id, { active: false, insert: true });
            if (!site.tab) throw new Error('No login tab');
            site.tab.onclose = () => {
                if (!disposed && site.job && currentRun()) { writeStatus(site, 'unknown', 'Could not confirm automatically. Please open and check.'); verify(site); render(); }
            };
        } catch (_) { writeStatus(site, 'unknown', 'Could not confirm automatically. Please open and check.'); }
        nextVerify = Date.now() + 3000; render();
    }
    function verify(site) {
        if (site.check) return site.check.promise;
        const check = {serial:++site.serial,run:run?.run,controller:new AbortController()}; if (!site.job) setRow(site, 'checking', 'Checking…');
        check.promise = skCheckWorkLoginStatus(site.id, 6000, check.controller.signal).then(isOk => {
            if (disposed || check.serial !== site.serial || check.run !== run?.run) return; site.checkedAt = Date.now();
            if (isOk) finish(site);
            else if (site.job) { if (site.queued) launch(site); }
            else setRow(site, isOk === false ? 'login' : 'unknown', isOk === false ? 'Not logged in' : 'Unconfirmed, ready to log in');
        }).finally(() => { if (site.check === check) site.check = null; render(); });
        site.check = check; return check.promise;
    }
    function restore(saved) {
        run = saved; systems.forEach(site => { site.serial++; site.check?.controller.abort(); site.check = null; site.job = saved.sites.includes(site.id); site.queued = false; });
        pending().forEach(site => { setRow(site, 'working', 'Logging in…'); receive(site); }); nextVerify = 0; render();
    }
    start.addEventListener('click', () => {
        if (start.disabled) return;
        if (!pending().length) {
            const saved = skReadWorkLoginRun();
            if (saved && !saved.finishedAt) restore(saved);
            else {
                run = { run: crypto.randomUUID(), until: Date.now() + 5 * 60 * 1000, sites: systems.filter(site => site.state !== 'ok').map(site => site.id), owner, heartbeat: Date.now() };
                SK_WORK_LOGIN_STATUS_KEYS.forEach(key => GM_deleteValue(key));
                systems.forEach(site => { site.job = run.sites.includes(site.id); site.queued = site.job; if (site.check) site.check.run = run.run; });
                GM_setValue('skWorkLogin', run);
                pending().forEach(site => writeStatus(site, 'queued', 'Logging in…'));
            }
        }
        pending().forEach(site => {
            if (site.state === 'unknown') {
                if (site.tab && !site.tab.closed) { site.tab.onclose = null; site.tab.close(); }
                site.queued = true; writeStatus(site, 'queued', 'Logging in…');
            }
            if (!site.check) { if (site.checkedAt && Date.now() - site.checkedAt < 5000) launch(site); else verify(site); }
        });
        render();
    });
    document.getElementById('sk-scholar-check')?.addEventListener('click', event => {
        if (systems.some(site => ['susy', 'mailsdb'].includes(site.id) && site.state !== 'ok')) { event.preventDefault(); alert('Please log in to SUSY and MailsDB first!'); }
    });
    if (typeof GM_addValueChangeListener === 'function') {
        systems.forEach(site => listeners.push(GM_addValueChangeListener(statusKey(site), () => { receive(site); render(); })));
        listeners.push(GM_addValueChangeListener('skWorkLogin', (_, old, value) => {
            if (value?.run !== run?.run && value?.run && !value.finishedAt && skReadWorkLoginRun(value.run)) restore(value);
        }));
    }
    const saved = skReadWorkLoginRun();
    if (saved && !saved.finishedAt) restore(saved);
    systems.forEach(verify);
    const timer = setInterval(() => {
        if (!pending().length || disposed) return;
        if (!currentRun()) {
            pending().forEach(site => { site.job = site.queued = false; site.serial++; setRow(site, 'unknown', 'Unconfirmed, ready to log in'); });
        } else {
            pending().forEach(receive);
            if (coordinate() && Date.now() >= nextVerify) { nextVerify = Date.now() + 5000; pending().forEach(verify); }
        }
        render();
    }, 1000);
    const onFocus = () => { if (!document.hidden) systems.filter(site => site.state !== 'ok').forEach(verify); };
    window.addEventListener('focus', onFocus); document.addEventListener('visibilitychange', onFocus);
    window.addEventListener('pagehide', () => {
        disposed = true; clearInterval(timer); systems.forEach(site => site.check?.controller.abort()); listeners.forEach(id => GM_removeValueChangeListener(id));
        window.removeEventListener('focus', onFocus); document.removeEventListener('visibilitychange', onFocus);
        const current = currentRun();
        if (current?.owner === owner && !current.finishedAt) GM_setValue('skWorkLogin', { ...current, heartbeat: 0 });
    }, { once: true });
    render();
}

async function skWorkLoginHelper() {
    if (window.top !== window || document.getElementById('sk-work-login-page') || typeof GM_getTab !== 'function' || typeof GM_saveTab !== 'function') return;
    const initial = skReadWorkLoginRun(); if (!initial) return;
    const tab = await new Promise(resolve => GM_getTab(resolve));
    const launch = location.hostname === 'www.mdpi.com' && location.pathname === '/' && new URLSearchParams(location.search).has('sk-work-login') &&
        /^#sk-work-login=([^:]+):([a-z0-9]+)$/.exec(location.hash);
    if (launch) {
        const site = SK_WORK_LOGIN_SITES.find(site => site.id === launch[2]), current = skReadWorkLoginRun(launch[1]);
        if (!site || !current || !current.sites.includes(site.id)) return;
        tab.skWorkLogin = { run: current.run, site: site.id };
        GM_saveTab(tab, () => { if (skReadWorkLoginRun(current.run)) location.replace(site.url); }); return;
    }
    const site = SK_WORK_LOGIN_SITES.find(site => site.id === tab.skWorkLogin?.site), run = initial.run, host = location.hostname;
    if (!site || tab.skWorkLogin?.run !== run || !initial.sites.includes(site.id)) return;
    const business = host === new URL(site.url).hostname, microsoft = host === 'login.microsoftonline.com', auth = /^(?:auth|login|keycloak)\.mdpi\.(?:com|cn)$/.test(host);
    if (!business && !microsoft && !auth) return;
    if (microsoft && !/^https:\/\/(?:keycloak\.mdpi\.cn|auth\.mdpi\.(?:com|cn)|login\.mdpi\.com)\//i.test(new URLSearchParams(location.search).get('redirect_uri') || '')) return;
    let lastStatus = '', finished = false, timer, observer, scheduled, checking = false, nextVerify = 0, checkController;
    const started = Date.now(), currentRun = () => { const current = skReadWorkLoginRun(run); return current?.sites.includes(site.id) ? current : null; };
    function report(state, text) {
        const current = currentRun(), previous = GM_getValue('skWorkLoginStatus_' + site.id, {});
        if (!current || lastStatus === state + text || (previous.run === run && previous.state === 'ok' && state !== 'ok')) return;
        lastStatus = state + text; GM_setValue('skWorkLoginStatus_' + site.id, {run,state,text});
    }
    function stop() { clearInterval(timer); clearTimeout(scheduled); observer?.disconnect(); checkController?.abort(); }
    function finish() {
        if (finished || !currentRun()) return; finished = true; stop(); report('ok', 'Logged in'); const current = currentRun();
        if (current && current.sites.every(id => { const status = GM_getValue('skWorkLoginStatus_' + id, {}); return status.run === run && status.state === 'ok'; })) {
            GM_setValue('skWorkLogin', { ...current, finishedAt: Date.now() });
        }
        GM_saveTab(tab, () => window.close());
    }
    function inspect() {
        const current = currentRun(); if (!current) { stop(); return; }
        if (business && !/\/(?:login|2fa|mfa)(?:\/|$)/i.test(location.pathname) && document.querySelector('a[href*="logout"]')) { finish(); return; }
        // A child also verifies its own session when the hub has closed, so completing login does not depend on the hub's lifetime.
        if (!checking && Date.now() >= nextVerify && (business || Date.now() - Number(current.heartbeat || 0) >= 5000)) {
            checking = true; nextVerify = Date.now() + 5000; checkController = new AbortController();
            skCheckWorkLoginStatus(site.id, 6000, checkController.signal).then(ok => { if (ok && !finished) finish(); }).finally(() => { checking = false; });
        }
        const mailsdbContinue = business && site.id === 'mailsdb' && location.pathname === '/reversion/login'
            && document.querySelector('a#login-current[href="/reversion/login/auth"]');
        const buttons = [...document.querySelectorAll('a,button,[role="button"],input[type="submit"]')];
        const button = mailsdbContinue || (microsoft ? buttons.find(el => /@mdpi\.com/i.test(el.textContent || '')) : document.querySelector('a[href*="/mdpi_keycloak/login"]') ||
            buttons.find(el => /Continue as .*@mdpi\.com|(?:Microsoft MDPI|MDPI Microsoft) Authentication/i.test(el.textContent || '')));
        if (button && !button.dataset.skClicked) {
            button.dataset.skClicked = '1'; report('working', mailsdbContinue ? 'Finishing MailsDB sign-in…' : 'Authenticating via Microsoft…'); button.click();
        }
        else if (!button && document.querySelector('input[type="password"],#username')) report('manual', 'Please enter your credentials and click Continue');
        else if (!button && Date.now() - started > 15000) report('manual', 'Could not confirm automatically. Please open and check.');
    }
    observer = new MutationObserver(() => { if (!scheduled) scheduled = setTimeout(() => { scheduled = null; inspect(); }, 100); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    timer = setInterval(inspect, 1000); window.addEventListener('pagehide', stop, { once: true }); inspect();
}

function AddManuscriptSourceErrorbox() {
    $(".jconfirm-content:contains('Please ')").append(`<select id="sourceSelect" size="6" style="height: auto;"><option value="1">Self-submission</option><option value="2">Invited via Call for Papers (CFP)</option><option value="3">In House Editor invited</option>
                                                       <option value="4">Academic Editor Invited</option><option value="5">Academic Editor Submission</option><option value="6">Conference SI invited</option></select>`);
    $('#sourceSelect option').css({'padding': '6px'});
    $(".jconfirm-buttons:contains('ok') > button").text("Close");

    $('#sourceSelect').on('change', function(e) {
        const type_value = $(this).val();
        let apiUrl = 'https://susy.mdpi.com/restapi/manuscript/quick_change/save/' + $('#maincol a:contains("Manuscript Summary")').attr('href').match(/\/manuscript\/summary\/([a-f0-9]+)/)[1] + '/source';
        $(this).find('option:selected').text('⌛ ' + $(this).find('option:selected').text());
        $(this).find("option").prop('disabled', true);
        $.ajax({
            url: apiUrl,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ type_value: type_value }),
            headers: {
                "susy-csrf-token": unsafeWindow.SusyConfig.susy_csrf_token,
                "susy-auth-token": "Bearer " + localStorage.getItem("Susy-token")
            }
        }).done(function(response){
            $('#sourceSelect').find('option:selected').text($('#sourceSelect').find('option:selected').text().replace('⌛','✅'));
            window.location.href = 'https://susy.mdpi.com/user/managing/reject/' + $('#maincol a:contains("Manuscript Summary")').attr('href').match(/\/manuscript\/summary\/([a-f0-9]+)/)[1];
        }).fail(function(error){
            alert("Failed. Please try again.");
        });
    })
}

var SK_SectionCandidatesMap = {
    'A': ['lkadison@broadpark.no','gigel.militaru@fmi.unibuc.ro','maietti@math.unipd.it','thomas.tucker@rochester.edu','cristina.sernadas@tecnico.ulisboa.pt'],
    'B': ['ggerla@unisa.it','eric.grinberg@umb.edu','jhh8@cornell.edu','alexander.kasprzyk@warwick.ac.uk'],
    'C': ['tomasd@us.es','mchen@eitech.edu.cn','amontes@us.es'],
    'C1': ['serblaza@imm.upv.es','boccardo@mat.uniroma1.it','chengq@maths.ox.ac.uk','sscheng@math.nthu.edu.tw','derfel@bgu.ac.il','zhaosheng.feng@utrgv.edu','kondrat@mathematik.uni-bielefeld.de','congming.li@sjtu.edu.cn','mmei@champlaincollege.qc.ca','mmihailes@yahoo.com',
           'lni@math.ucsd.edu','wangzhch@lzu.edu.cn'],
    'C2': ['edward.belbruno@yu.edu','sandra.carillo@uniroma1.it','stefania.cherubini@poliba.it','henar.herrero@uclm.es','danielle.hilhorst@universite-paris-saclay.fr','jinyf@bit.edu.cn','wtli@lzu.edu.cn','hrsun@lzu.edu.cn','weijj@hit.edu.cn'],
    'C4': ['jjahangi@kent.edu'],
    'D': ['herminia@unizar.es'],
    'D1': ['x.mao@strath.ac.uk','chinshan@buffalo.edu','ganastss@memphis.edu','brani@stat.tamu.edu','wangfy@tju.edu.cn','xli82@stevens.edu','mfranco@um.es','guolian.kang@stjude.org','ipinelis@mtu.edu','alba.sofi@unirc.it'],
    'D2': ['kostas@dpem.tuc.gr','baranyi@sze.hu','xiaojiechen@uestc.edu.cn','irina.perfilieva@osu.cz','aroldan@ugr.es','mjesus.campion@unavarra.es','jalcala@decsai.ugr.es','pasi.luukka@lut.fi','jpaulo@fe.uc.pt','lihait@umsl.edu','pgrzeg@ibspan.waw.pl'],
    'E': ['tucker.carrington@queensu.ca','estrada@ifisc.uib-csic.es','sjliao@sjtu.edu.cn','geguo@yeah.net','umberto.morbiducci@polito.it','nick.sh.chung@polyu.edu.hk','andre.nicolet@fresnel.fr','lihe-wang@uiowa.edu','yzhang10@nd.edu','lshen03@syr.edu'],
    'E1': ['wangzhb@lzu.edu.cn','hendrik.richter@htwk-leipzig.de','ahs_zadeh@yahoo.com','yangyunyun@hit.edu.cn','valeriu.beiu@uav.ro','andrej.brodnik@upr.si','beatriz.lopez@udg.edu','eroanes@mat.ucm.es','ryanlhu@um.edu.mo','miura.kenjiro@shizuoka.ac.jp',
           'manuelchica@ugr.es','michal.baczynski@us.edu.pl','cerquide@iiia.csic.es','ltorgo@dal.ca','gtsek@ct.aegean.gr','pmat@math.tecnico.ulisboa.pt','cyanez@cic.ipn.mx','skala@kiv.zcu.cz','giovanni.squillero@polito.it','catalin.stoean@fmi.unibuc.ro',
           'chxuwh@swu.edu.cn','zhengxiangtao@opt.cn','zxh@fudan.edu.cn','robin.hankin@aut.ac.nz','emilio.turco@uniss.it','r_caballero@uma.es','pnelson@ltu.edu','mehdi.salimi@mcmaster.ca','zsh@amss.ac.cn','x.zeng@manchester.ac.uk',
           'tollis@csd.uoc.gr','gianluigi.greco@unical.it','mehdi.toloo@vsb.cz','liguo@rutgers.edu','jean-francois.remacle@uclouvain.be','osan@utk.edu','rayteam@yeah.net','siarry@u-pec.fr','wangxy@dlut.edu.cn','marina.andrade@iscte.pt'],
    'E2': ['xbli@csu.edu.cn','zhuang@iop.uni-hannover.de','rmagin@uic.edu','hcyan@ecust.edu.cn','j.r.banerjee@city.ac.uk','huangxia_qd@126.com','zhaolin1585@163.com','tinh.buiquoc@gmail.com','chunyin@uestc.edu.cn','josep.masdemont@upc.edu',
           'lin_peng@csu.edu.cn','santolo.meo@unina.it','wangh6@ornl.gov','mcszhtsh@mail.sysu.edu.cn'],
    'E3': ['li.shen@pennmedicine.upenn.edu','mxz721106@sdust.edu.cn','mkulenovic@uri.edu','sochen@math.tau.ac.il','tianhai.tian@sci.monash.edu.au'],
    'E4': ['antoniad@lpthe.jussieu.fr','t.fokas@damtp.cam.ac.uk','grigo@unt.edu','gts@physics.uoc.gr','tarasov@theory.sinp.msu.ru','polyanin@ipmnet.ru','michael.s.zhdanov@gmail.com','ratiu@sjtu.edu.cn','yazad@phys.uni-sofia.bg','vdodonov@fis.unb.br'],
    'E5': ['luca.passalacqua@uniroma1.it','youri.kabanov@univ-fcomte.fr','yaozhong@ualberta.ca','li.xun@polyu.edu.hk','g.peters@hw.ac.uk','wim.schoutens@kuleuven.be']
};

var SK_CUSTOM_CSS = String.raw`
#topmenu>ul:has(.sk-susy-tool){align-items:center}#topmenu .sk-susy-tool{display:inline-flex;align-items:center;gap:6px;flex:0 0 auto;white-space:nowrap}#topmenu .sk-susy-tool>a{padding:0 6px!important;font-size:13px;line-height:28px}
#topmenu>ul>li:has(.susy-global-search-li){flex:1 1 0%;min-width:0}#topmenu .susy-global-search-li,#topmenu .susy-global-search-li .gs-root,#topmenu .susy-global-search-li input{min-width:0}#SusyModifier_Journal_Easy{width:100px;max-width:100px;height:28px;margin:0;
    padding:0 18px 0 6px;font-size:12px}#leftcol.sk-susy-sidebar .menu li{padding-left:15px;font-size:13px;line-height:26px}@media(max-width:1200px){#topmenu>ul:has(.sk-susy-tool){padding-left:8px!important;padding-right:8px!important}#topmenu>ul:has(.sk-susy-tool)>li>a{
        padding-left:6px!important;padding-right:6px!important;font-size:12px}#SusyModifier_Journal_Easy{width:96px;max-width:96px}}:where(.sk-old-icons) #leftcol .menu{gap:0!important}:where(.sk-old-icons) #leftcol .menu li{text-align:left!important;
    justify-content:flex-start!important;position:relative!important;padding:2px 0 2px 15px!important;font-size:13px!important;line-height:20px!important;border-bottom:1px solid rgb(204,204,204)!important}:where(.sk-old-icons) #maincol .user_box_item,
:where(.sk-old-icons) #maincol .user_box{font-size:13px!important;}:where(.sk-old-icons) #leftcol .menu li:not([class])::before{background-color:rgb(79,86,113);content:"";height:6px;width:6px;position:absolute;left:4px;top:9px;z-index:1}
:where(.sk-old-icons) #leftcol .menu-hr{display:none!important;}:where(.sk-old-icons) :is(.light_green_theme #leftcol .menu li:not([class]))::before{background-color:rgb(76,142,101)!important;}:where(.sk-old-icons) :is(.light_green_theme #leftcol .menu li){
    border-bottom:1px solid rgb(197,222,208)!important;}:where(.sk-old-icons) :is(.light_green_theme #leftcol .menu li:not(.active) a:not(.active)){color:rgb(46,57,36)!important;}:where(.sk-old-icons) #topmenu ul{padding:3px 0!important;}:where(.sk-old-icons) #topmenu ul a{
    padding:0 0.6rem!important;}:where(.sk-old-icons) .ms-edit:before,:where(.sk-old-icons) .ms-note:before,:where(.sk-old-icons) .ms-note-add:before,:where(.sk-old-icons) .ms-mail:before{content:'';display:inline-block;height:16px;width:16px;position:relative;top:-2px;
    background-size:contain}:where(.sk-old-icons) .ms-edit:before{background:var(--sk-icon-pencil) no-repeat center center;}:where(.sk-old-icons) .ms-note:before{background:var(--sk-icon-note) no-repeat center center;}:where(.sk-old-icons) .ms-note-add:before{
    background:var(--sk-icon-note_add) no-repeat center center;}:where(.sk-old-icons) .ms-mail:before{background:var(--sk-icon-mail) no-repeat center center;}html.sk-mailsdb{background:#f5f6f8}html.sk-mailsdb body{box-sizing:border-box;max-width:1600px;margin:0 auto;
    padding:20px;color:#303943;line-height:1.55}html.sk-mailsdb #d1,html.sk-mailsdb #d2,html.sk-mailsdb #d3,html.sk-mailsdb .search-all-info{padding:16px 20px;background:#fff;border:1px solid #dce2e8;border-radius:6px;overflow-x:auto}html.sk-mailsdb table{width:100%;
    border-collapse:collapse}html.sk-mailsdb .editor-invitation-history-table th,html.sk-mailsdb .editor-invitation-history-table td,html.sk-mailsdb #d3 th,html.sk-mailsdb #d3 td{padding:6px 8px;border-bottom:1px solid #e5e9ee;font-size:13px;vertical-align:top}
:where(.sk-mailsdb) .colorgray{color:gray!important}:where(.sk-mailsdb) .bgcoloref{background:#efefef!important}html.sk-mailsdb #user-info .user-info-section{margin-bottom:16px}:where(.sk-mailsdb) #user-info span.email{font-weight:400;color:#103247}
:where(.sk-mailsdb) #user-info span.number{font-weight:400;color:#123}html.sk-mailsdb #user-info a{color:#225b8d}html.sk-mailsdb #user-info a:visited{color:#6d5a81}:where(.sk-mailsdb) #user-info a:hover{color:#47566d}html.sk-mailsdb #user-info table{width:100%;
    margin:10px 0 16px;background:#fff;border:1px solid #dce2e8;font-size:13px}html.sk-mailsdb #user-info table tr th,html.sk-mailsdb #user-info table tr td{border:1px solid #dce2e8;padding:6px 8px}html.sk-mailsdb #user-info table tr th{text-align:left;background:#f0f3f6;
    color:#45505c;font-weight:600}:where(.sk-mailsdb) #user-info table tr td{background:#fefefe}:where(.sk-mailsdb) #user-info table tr td span.msid{color:#4e6c88;font-weight:400}:where(.sk-mailsdb) #user-info table tr td.title{width:50%}
:where(.sk-mailsdb) #user-info table tr td.journal{width:10%;text-align:center}:where(.sk-mailsdb) #user-info table tr td.status{width:10%;text-align:center}:where(.sk-mailsdb) #user-info table tr td.submission-date{width:10%;text-align:center}
:where(.sk-mailsdb) #user-info table tr td.invoice-info{width:10%;text-align:center}:where(.sk-mailsdb) #user-info table tr td.invoice-payment-info{width:10%;text-align:center}html.sk-mailsdb #d2 h2{margin:0 0 16px;font-size:20px;font-weight:600}html.sk-mailsdb .scroll-icon{
    display:block;margin:6px 0;text-align:center;color:#748296;cursor:pointer;font-size:12px;text-decoration:none}html.sk-mailsdb #Box{margin-top:20px;padding-top:14px;border-top:1px solid #dce2e8}html.sk-mailsdb #Box h3{margin:0 0 12px;font-size:16px;font-weight:600}
html.sk-mailsdb #Box p{overflow-wrap:anywhere}html.sk-mailsdb #Box hr{display:none}html.sk-mailsdb .search-all-info .table{min-width:900px}html.sk-mailsdb .search-all-info .table th,html.sk-mailsdb .search-all-info .table td{padding:10px 12px;text-align:left;
    vertical-align:top}html.sk-mailsdb #sk-mailsdb-mail{box-sizing:border-box;position:fixed;inset:0;width:min(1600px,94vw);height:92vh;max-width:none;max-height:none;margin:auto;padding:0;border:1px solid #cbd3dd;border-radius:6px;background:#fff;color:#303943;
    overflow:hidden}html.sk-mailsdb #sk-mailsdb-mail[open]{display:flex;flex-direction:column}html.sk-mailsdb #sk-mailsdb-mail::backdrop{background:rgba(25,35,45,.45)}html.sk-mailsdb #sk-mailsdb-mail-toolbar{display:flex;align-items:center;gap:16px;padding:10px 16px;
    background:#f7f8fa;border-bottom:1px solid #dce2e8;flex-shrink:0}html.sk-mailsdb #sk-mailsdb-mail-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px;font-weight:600}html.sk-mailsdb #sk-mailsdb-mail button{width:28px;
    height:28px;padding:0;border:0;border-radius:4px;background:transparent;color:#45505c;font-size:24px;line-height:1;cursor:pointer}html.sk-mailsdb #sk-mailsdb-mail button:hover{background:#e6ebf1}html.sk-mailsdb #sk-mailsdb-mail iframe{display:block;flex:1;min-height:0;
    width:100%;border:0;background:#fff}:where(#ms) #ms-kinds label,:where(#ms) #ms-fav label{margin-right:10px}#ms .chosen-results{max-height:65vh}#ms .chosen-choices input{border:0;outline:0;background:none;box-shadow:none}#ms #options>label{display:inline-block;
    width:34px}:where(#ms) #ms-status{display:inline-block;margin:16px 10px 10px}:where(#ms) #saved_search_list,:where(#ms) #ms-results{overflow:auto}#ms table{color:inherit;font:inherit}:where(#ms) #ms-form .actionButtons{margin-right:8px;user-select:none;
    transition:transform .08s,filter .12s}:where(#ms) #ms-form .actionButtons:hover{filter:brightness(1.06)}:where(#ms) #ms-form .actionButtons:active{transform:translateY(1px);filter:brightness(.92)}:where(#ms) #ms-form .actionButtons.ms-clicked{
    animation:sk-ms-pulse .22s ease-out}:where(#ms) .ms-loading{margin:10px 0;color:#666}@keyframes sk-ms-pulse{50%{transform:scale(.96);filter:brightness(.9)}}#sk-subject-overlay,#sk-subject-overlay *,.sk-scopus-card,.sk-scopus-card *,#sk-coa-overlay,#sk-coa-overlay *,
#sk-coa-publications,#sk-coa-publications *,#sk-inst-history,#sk-inst-history *{box-sizing:border-box}.sk-scopus-card{border:1px solid #c6d5eb;border-radius:10px;padding:14px;margin:14px 0;background:#fff;color:#202124;font-size:15px;line-height:1.45}.sk-scopus-toolbar{
    display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}.sk-scopus-toolbar strong{margin-right:auto;font-size:18px;color:#1558d6;font-weight:700;line-height:1.3}.sk-scopus-heading strong{margin-right:0}.sk-scopus-heading .sk-pub-types{margin-left:auto;
    text-align:right}button.sk-scopus-btn,.sk-scopus-btn{appearance:none;display:inline-flex;align-items:center;justify-content:center;min-width:0;min-height:0;margin:0;border:1px solid #1a73e8;border-radius:6px;padding:6px 10px;background:#1a73e8;color:#fff;cursor:pointer;
    font:inherit;font-size:14px;font-weight:600;line-height:1.25;white-space:nowrap;box-shadow:none;text-transform:none}button.sk-scopus-btn:hover,.sk-scopus-btn:hover{background:#1558d6;color:#fff;border-color:#1558d6;text-decoration:none}button.sk-scopus-btn:disabled,
.sk-scopus-btn:disabled{opacity:.6;cursor:default}button.sk-scopus-icon,a.sk-scopus-icon,.sk-scopus-icon{appearance:none;display:inline-flex;align-items:center;justify-content:center;min-width:0;min-height:0;margin:0;border:0;padding:0 3px;background:none;color:#1a73e8;
    font-size:20px;line-height:1.2;cursor:pointer;text-decoration:none;box-shadow:none}button.sk-scopus-icon:hover,a.sk-scopus-icon:hover,.sk-scopus-icon:hover{background:none;color:#d93025;text-decoration:none}.sk-scopus-note{font-size:13px;color:#444;line-height:1.5}
#sk-coauthors-section .sk-scopus-icon{font-size:13px!important;width:18px;height:18px;padding:0!important;line-height:1!important;flex-shrink:0}.sk-scopus-years{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.sk-scopus-year{min-width:68px;padding:7px 10px;
    border-radius:8px;background:#e8f0fe;text-align:center}.sk-scopus-year span{display:block;font-size:13px;color:#333;line-height:1.3}.sk-scopus-year a,.sk-scopus-year b{display:block;font-size:22px;font-weight:700;color:#1a73e8;line-height:1.35;text-decoration:none}
.sk-scopus-year a:hover{color:#d93025;text-decoration:none}.sk-scopus-year-current{background:#fff0da}.sk-scopus-year-current a,.sk-scopus-year-current b{color:#c65b00}.sk-scopus-bars{display:grid;gap:12px;margin-top:14px}.sk-scopus-bar-label{display:flex;
    justify-content:space-between;gap:10px;margin-bottom:5px;font-size:14px}.sk-scopus-bar-label span{overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical}.sk-scopus-bar-label b{flex-shrink:0;font-weight:700;color:#1558d6}
.sk-scopus-bar-track{height:8px;border-radius:4px;background:#dfe9f7;overflow:hidden}.sk-scopus-bar-fill{height:100%;border-radius:4px;background:#1a73e8}.sk-scopus-bars [data-zone="1"] .sk-scopus-bar-fill{background:#15803d}
.sk-scopus-bars [data-zone="2"] .sk-scopus-bar-fill{background:#c2410c}.sk-scopus-bars [data-zone="3"] .sk-scopus-bar-fill{background:#b91c1c}.sk-scopus-distribution{display:grid;grid-template-rows:minmax(0,1fr) minmax(0,1fr);gap:12px;min-height:0}
.sk-scopus-distribution>div{min-width:0;overflow:auto;padding:12px;border-radius:8px;background:#f0f6ff;border-left:4px solid #1a73e8}.sk-scopus-distribution>div>strong{font-size:17px;color:#1558d6}.sk-scopus-distribution>div:nth-child(2){background:#f6efff;
    border-left-color:#a142f4}.sk-scopus-distribution>div:nth-child(2)>strong,.sk-scopus-distribution>div:nth-child(2) b{color:#7b1fa2}.sk-scopus-scroll{overflow:auto;min-width:0;min-height:0;border:1px solid #c6d5eb;border-radius:7px}.sk-scopus-table{
    border-collapse:separate;border-spacing:0;width:100%;margin:0;background:#fff;font-size:15px;text-align:left;color:#202124}.sk-scopus-table th,.sk-scopus-table td{padding:7px 8px;border:0;border-bottom:1px solid #dce5f2;vertical-align:top;line-height:1.5;text-align:left}
.sk-scopus-table th{position:sticky;top:0;z-index:1;background:#1a73e8;color:#fff;font-weight:600;white-space:nowrap}.sk-scopus-table td{background:#fff}.sk-scopus-table th:first-child{width:42px}#sk-publications-section .sk-scopus-table th,
#sk-publications-section .sk-scopus-table td{padding:5px 8px;line-height:1.35}#sk-publications-section .sk-scopus-table th.sk-pub-sort{padding:0;user-select:none}#sk-publications-section .sk-scopus-table th.sk-pub-year-head{width:68px;text-align:center}
#sk-publications-section .sk-scopus-table th.sk-pub-cited-head{width:76px;text-align:right}#sk-publications-section .sk-pub-sort button{appearance:none;display:inline-flex;align-items:center;justify-content:center;gap:4px;width:100%;min-width:0;min-height:0;margin:0;
    padding:5px 8px;border:0;border-radius:0;background:transparent;color:inherit;font:inherit;line-height:inherit;white-space:nowrap;cursor:pointer;box-shadow:none;text-transform:none}#sk-publications-section .sk-pub-cited-head button{justify-content:flex-end}
#sk-publications-section .sk-pub-sort button:hover{background:#1558d6}#sk-publications-section .sk-pub-sort button:focus-visible{outline:2px solid currentColor;outline-offset:-3px}#sk-publications-section .sk-pub-sort-arrow{display:inline-block;width:1em;font-size:12px;
    line-height:1;text-align:center}#sk-publications-section [aria-sort=none] .sk-pub-sort-arrow{opacity:.55}.sk-scopus-table tbody tr:nth-child(even) td{background:#f4f8ff}.sk-scopus-table tbody tr:hover td{background:#e8f0fe}.sk-scopus-table a{color:#1a0dab;
    text-decoration:none}.sk-scopus-table a:hover{text-decoration:underline}#sk-coa-overlay{position:fixed;inset:0;background:rgba(25,38,52,.5);z-index:10000;display:flex;align-items:center;justify-content:center;padding:12px}#sk-coa-popup{box-sizing:border-box;width:94vw;
    height:90vh;display:flex;flex-direction:column;gap:10px;background:#fff;color:#202124;font-size:14px;border-radius:12px;padding:14px;box-shadow:0 12px 48px #152c4940}#sk-coa-popup:not(.sk-coa-detailed){width:min(520px,94vw);height:min(76vh,680px)}
#sk-coa-popup>.sk-scopus-toolbar{margin:0;flex-wrap:wrap;flex-shrink:0}#sk-coa-popup>.sk-scopus-toolbar .sk-scopus-note{max-width:36vw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#sk-coa-body{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;flex:1;
    min-height:0}#sk-coa-popup.sk-coa-detailed #sk-coa-body{grid-template-columns:minmax(0,1fr) clamp(240px,20vw,320px)}#sk-coa-popup:not(.sk-coa-detailed) .sk-scopus-distribution{display:none}#sk-coa-popup .sk-scopus-table{table-layout:fixed;font-size:14px}
#sk-coa-popup.sk-coa-detailed .sk-scopus-table{min-width:1050px}#sk-coa-popup .sk-scopus-table th,#sk-coa-popup .sk-scopus-table td{padding:4px 6px;line-height:1.35;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#sk-coa-popup .sk-scopus-number{text-align:center}
#sk-coa-popup td.sk-scopus-number{color:#1558d6;font-weight:600}#sk-coa-popup td.sk-coa-output{color:#000;font-weight:400}#sk-coa-popup td.sk-coa-country{font-weight:700}#sk-coa-publications{position:fixed;inset:0;z-index:10001;background:#19263480;display:flex;
    align-items:center;justify-content:center;padding:20px}#sk-coa-publications>section{box-sizing:border-box;width:min(1100px,90vw);max-height:85vh;display:flex;flex-direction:column;gap:10px;overflow:hidden;background:#fff;border-radius:12px;padding:18px;color:#202124;
    font-size:15px;box-shadow:0 12px 48px #152c4940}#sk-coa-publications>section>.sk-scopus-toolbar{margin:0;flex-shrink:0}#sk-coa-publications .sk-coa-pub-body{flex:1;min-height:0;overflow:auto}#sk-coa-publications .sk-scopus-table th:last-child,
#sk-coa-publications .sk-scopus-table td:last-child{width:72px;text-align:right}#sk-coa-compact{max-height:min(60vh,560px);border:0;border-radius:0}#sk-coa-compact .sk-scopus-table{table-layout:fixed;font-size:14px}#sk-coa-compact .sk-scopus-table td{padding:3px 4px;
    border:0;background:transparent;line-height:1.4;vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#sk-coa-compact .sk-scopus-table tr:hover td{background:#f4f7fb}#sk-coa-compact .sk-scopus-table td:nth-child(2){width:40%}
#sk-coa-compact .sk-scopus-table td:nth-child(3){width:40px;text-align:right;color:#5f6368}.sk-zone-tag{display:inline-block;max-width:100%;padding:0 6px;border-radius:4px;font-size:13px;vertical-align:middle;overflow:hidden;text-overflow:ellipsis}:is(.sk-zone-tag,
#sk-coa-popup td)[data-zone="1"]{background:#dcfce7;color:#15803d}:is(.sk-zone-tag,#sk-coa-popup td)[data-zone="2"]{background:#ffedd5;color:#c2410c}:is(.sk-zone-tag,#sk-coa-popup td)[data-zone="3"]{background:#fee2e2;color:#b91c1c}#sk-coa-popup td:first-child{color:#1558d6;
    font-weight:700}#sk-coa-popup tr.sk-coa-pending td{color:#9aa0a6}#sk-coa-popup tr.sk-coa-in td{animation:sk-coa-in .35s ease-out}@keyframes sk-coa-in{from{opacity:0}}@keyframes sk-scopus-spin{to{transform:rotate(360deg)}}.sk-scopus-spinner{display:inline-block;
    width:10px;height:10px;border:2px solid #1a73e8;border-right-color:transparent;border-radius:50%;vertical-align:-1px;margin-right:6px;animation:sk-scopus-spin .8s linear infinite}button .sk-scopus-spinner{border-color:currentColor;border-right-color:transparent}
@media(max-width:900px){#sk-coa-popup.sk-coa-detailed #sk-coa-body{grid-template-columns:minmax(0,1fr) 210px;gap:8px}}.sk-hl-geo,.sk-hl-math{padding:0 3px;border-radius:3px;color:#202124}.sk-hl-geo{background:Aquamarine}.sk-hl-math{background:Wheat}.sk-pub-year{
    text-align:center!important;font-weight:600;color:#475569;white-space:nowrap}.sk-pub-cited{text-align:right!important;font-weight:700;color:#1a73e8;white-space:nowrap}.sk-pub-meta{font-size:13px;color:#5f6368;margin-top:2px;line-height:1.35}.sk-pub-meta a{
    color:#64748b!important}.sk-pub-kw{font-size:13px;color:#0f766e;margin-top:2px;line-height:1.35}.sk-pub-oa{display:inline-block;padding:0 5px;margin-left:6px;border-radius:4px;font-size:12px;font-weight:700;background:#fff7ed;color:#c2410c;border:1px solid #fdba74;
    vertical-align:1px}#sk-sources-section>summary{font-size:18px;font-weight:700;color:#1558d6;cursor:pointer;user-select:none}#sk-sources-section[open]>summary{margin-bottom:10px}#sk-sources-section table{width:100%;margin:0;border-collapse:collapse;font-size:15px;
    color:#202124}#sk-sources-section th,#sk-sources-section td{padding:4px 6px;border:0;line-height:1.4;vertical-align:top}#sk-sources-section th{border-bottom:2px solid #c6d5eb;color:#202124;font-weight:600;text-align:left}#sk-sources-section th:last-child{width:46px;
    text-align:right}#sk-sources-section tbody tr{border-bottom:1px solid #dce5f2}#sk-sources-section td:last-child{text-align:right;font-weight:600;color:#1a73e8;white-space:nowrap}#sk-sources-section tr.sk-sources-total{border-top:2px solid #e0e0e0;border-bottom:0;
    background:#f5f5f5;font-weight:600}#sk-sources-section tr.sk-sources-total td:last-child{color:#202124}#sk-sources-section a{color:#1a0dab;text-decoration:none}#sk-sources-section a:hover{text-decoration:underline}#sk-inst-history{margin:6px 0 4px;font-size:15px;
    color:#334155}#sk-inst-history>summary{cursor:pointer;color:#1558d6;font-weight:400;user-select:none}.sk-inst-hist-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.sk-inst-hist-list .sk-scopus-note{width:100%;font-size:14px}.sk-inst-hist-chip{padding:1px 8px;
    border-radius:5px;border:1px solid #d5dfe9;background:#fff;font-size:14px;line-height:1.5}html.sk-scopus-lite #contentWrapper{max-width:none}#sk-lite-banner{padding:3px 12px;background:#fef9ec;border-bottom:1px solid #f0e2be;color:#7a5a18;font:12px/1.4 elsevier-sans,
    ElsevierSans,arial,helvetica,sans-serif;text-align:center}#sk-lite-bar,#sk-lite-page{box-sizing:border-box;max-width:1600px;margin:0 auto;padding-inline:2rem;font-family:elsevier-sans,ElsevierSans,arial,helvetica,sans-serif;
    font-variant-numeric:lining-nums proportional-nums}#sk-lite-bar{display:flex;justify-content:flex-end;padding-top:.5rem;font-size:.875rem;color:#505050}#sk-lite-bar label{display:inline-flex;align-items:center;gap:.375rem;margin:0;font-weight:400;cursor:pointer}
#sk-lite-bar input{appearance:auto;position:static;opacity:1;width:15px;height:15px;margin:0;accent-color:#0056d6;cursor:pointer}#sk-lite-page{padding-bottom:3rem;color:#2e2e2e;font-size:1rem;line-height:1.5}.sk-lite-search{display:flex;flex-wrap:wrap;gap:8px;
    align-items:center;margin:10px 0 12px}.sk-lite-search input{box-sizing:border-box;height:38px;padding:6px 12px;border:1px solid #b9c8dc;border-radius:6px;background:#fff;color:#202124;font:inherit;font-size:14px}.sk-lite-search .sk-scopus-btn{height:38px;
    padding-inline:16px}.sk-lite-search button.sk-lite-swap{appearance:none;border:0;background:none;padding:0 4px;font-size:15px;line-height:1;opacity:.45;cursor:pointer;transition:opacity .15s}.sk-lite-search button.sk-lite-swap:hover{opacity:.9;background:none}
.sk-lite-search input[name="name"]{flex:0 1 250px}.sk-lite-search input[name="affil"]{flex:1 1 220px}.sk-lite-tag{display:inline-block;margin-left:6px;padding:1px 6px;border-radius:4px;background:#e8f0fe;color:#1558d6;font-size:12px;font-weight:600;vertical-align:middle}
.sk-lite-tag-ok{background:#dcfce7;color:#15803d}.sk-lite-email{color:#1a73e8;cursor:pointer;border-bottom:1px dashed #1a73e8;overflow-wrap:anywhere}.sk-lite-header h1{margin:.5rem 0 0;font-size:2rem;line-height:2.5rem;font-weight:400;color:#505050;overflow-wrap:anywhere}
.sk-lite-affil{margin-top:.5rem;font-size:1rem;line-height:1.5rem}.sk-lite-ids{display:flex;flex-wrap:wrap;gap:.25rem;margin:.5rem 0 .25rem;padding:0;list-style:none;font-size:1rem;line-height:1.5rem}.sk-lite-ids li{display:inline-flex;gap:.25rem}
.sk-lite-ids li:not(:first-child)::before{content:"\2022"}.sk-lite-header a{color:#0056d6;text-decoration:none}.sk-lite-header a:hover{text-decoration:underline}.sk-lite-metrics{display:flex;flex-wrap:wrap;column-gap:1.5rem;row-gap:2rem;margin:1.5rem 0 2rem}
.sk-lite-metrics div{display:flex;flex-direction:column-reverse;padding-left:1rem;border-left:.125rem solid #2e2e2e}.sk-lite-metrics dt{font-size:.875rem;line-height:1.375rem;font-weight:400;color:#2e2e2e}.sk-lite-metrics dd{margin:0;font-size:1.5rem;line-height:2rem;
    font-weight:400;color:#2e2e2e}#sk-lite-cols{display:grid;grid-template-columns:minmax(0,2fr) minmax(320px,1fr);gap:2rem;align-items:start}#sk-lite-side{min-width:0;padding-top:16px}@media(max-width:900px){#sk-lite-cols{grid-template-columns:minmax(0,1fr)}}
#sk-subject-overlay{margin:14px 0 16px;padding:14px 18px;border:1px solid #dce4ec;border-radius:12px;background:#fff;color:#172943;font-size:15px;line-height:1.4;font-variant-numeric:lining-nums tabular-nums}.sk-rp-head{display:flex;flex-wrap:wrap;align-items:baseline;
    gap:4px 18px;margin-bottom:10px;color:#53667b;font-size:14px}.sk-rp-head strong{margin-right:auto;font-size:18px;color:#1558d6}.sk-rp-head b,.sk-rp-head a{color:#172943;font-weight:600}.sk-rp-cols{display:grid;
    grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));gap:14px 20px;align-items:start}.sk-rp-panel{min-width:0}.sk-rp-list{list-style:none;margin:0;padding:0}#sk-subject-overlay .sk-rp-list li{display:grid;
    grid-template-columns:minmax(0,1.6fr) minmax(40px,1fr) 46px 58px;align-items:center;gap:8px;margin:0;padding:4px 6px;border-bottom:1px solid #eef2f6;line-height:1.35;list-style:none}#sk-subject-overlay .sk-rp-topics li{grid-template-columns:minmax(0,1fr) 52px 60px}
#sk-subject-overlay .sk-rp-list li>:first-child{justify-self:start;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:left}#sk-subject-overlay .sk-rp-list li>:not(:first-child){text-align:right}#sk-subject-overlay .sk-rp-list li.sk-rp-labels{
    padding-block:6px 3px;border-bottom-color:#dce4ec;color:#6b7c8f;font-size:13px;font-weight:600;cursor:help}#sk-subject-overlay .sk-rp-list li.sk-rp-labels>:first-child{color:#172943;font-size:16px;font-weight:700}
#sk-subject-overlay .sk-rp-panel:not(.sk-rp-topics) li.sk-rp-labels>:first-child{grid-column:span 2}.sk-rp-list li:not(.sk-rp-labels):hover{background:#f6f9fb}#sk-subject-overlay .sk-rp-list li:not(.sk-rp-labels){height:29px}.sk-rp-list a{color:inherit;text-decoration:none;
    border:0}.sk-rp-list a:hover{color:#1558d6;text-decoration:underline}.sk-rp-bar{height:5px;border-radius:3px;background:#e8eff4;overflow:hidden}.sk-rp-bar i{display:block;height:100%;border-radius:inherit;background:#9db8d6}.sk-rp-math{font-weight:700}
#sk-subject-overlay :is([data-subject],[data-zone]){color:var(--sk-subject-color,#475569);background:var(--sk-subject-bg,#f1f5f9);border-radius:4px}#sk-subject-overlay :is([data-subject=MATH],[data-subject=COMP],[data-subject=DECI]){--sk-subject-color:#3a2917;
    --sk-subject-bg:#f5ece1}#sk-subject-overlay :is([data-subject=ENGI],[data-subject=PHYS],[data-subject=ENER]){--sk-subject-color:#2563eb;--sk-subject-bg:#eaf1ff}#sk-subject-overlay :is([data-subject=CHEM],[data-subject=CENG],[data-subject=MATE]){
    --sk-subject-color:#9333ea;--sk-subject-bg:#f4eaff}#sk-subject-overlay :is([data-subject=AGRI],[data-subject=EART],[data-subject=ENVI]){--sk-subject-color:#047857;--sk-subject-bg:#dcfce7}#sk-subject-overlay :is([data-subject=BIOC],[data-subject=MEDI],[data-subject=IMMU],
[data-subject=NEUR],[data-subject=NURS],[data-subject=HEAL],[data-subject=PHAR],[data-subject=DENT],[data-subject=VETE]){--sk-subject-color:#be185d;--sk-subject-bg:#fce7f3}#sk-subject-overlay :is([data-subject=BUSI],[data-subject=ECON]){--sk-subject-color:#c2410c;
    --sk-subject-bg:#ffedd5}#sk-subject-overlay :is([data-subject=ARTS],[data-subject=SOCI],[data-subject=PSYC]){--sk-subject-color:#0e7490;--sk-subject-bg:#cffafe}#sk-subject-overlay [data-zone="1"]{--sk-subject-color:#15803d;--sk-subject-bg:#dcfce7}
#sk-subject-overlay [data-zone="2"]{--sk-subject-color:#c2410c;--sk-subject-bg:#ffedd5}#sk-subject-overlay [data-zone="3"]{--sk-subject-color:#b91c1c;--sk-subject-bg:#fee2e2}#sk-subject-overlay :is([data-subject],[data-zone]) .sk-rp-bar{background:#ffffffb3}
#sk-subject-overlay :is([data-subject],[data-zone]) .sk-rp-bar i{background:var(--sk-subject-color,#64748b)}.sk-rp-fwci{justify-self:end;min-width:44px;padding:0 5px;border-radius:5px;background:#eef2f6;color:#314359;font-size:13px;text-align:center!important}
.sk-rp-fwci.sk-rp-high{background:#e4f3eb;color:#146047}#sk-subject-overlay:not(.sk-rp-open) .sk-rp-extra{display:none}button.sk-rp-more,.sk-rp-more{appearance:none;display:block;min-width:0;min-height:0;margin:8px auto 0;padding:2px 6px;border:0;background:none;
    color:#1558d6;font:inherit;font-size:14px;font-weight:600;cursor:pointer;box-shadow:none;text-transform:none}button.sk-rp-more:hover,.sk-rp-more:hover{background:none;text-decoration:underline}:where(.sk-work-login),:where(.sk-work-login) *{box-sizing:border-box}
body:where(.sk-work-login){margin:0;min-height:100%;background:#f3f6f8;color:#26343d;font-family:Arial,"Microsoft YaHei",sans-serif;padding:42px 18px}.sk-work-page{max-width:820px;margin:auto}.sk-work-head{margin-bottom:22px}.sk-work-head h1{margin:0;color:#244a63;
    font-size:28px}.sk-work-head p{margin:7px 0 0;color:#6b7881;font-size:14px}.sk-work-card{overflow:hidden;background:#fff;border:1px solid #e0e6ea;border-radius:12px;box-shadow:0 8px 28px rgba(42,62,74,.09)}.sk-work-summary{display:flex;align-items:center;gap:12px;
    padding:16px 20px;background:#f8fafb;border-bottom:1px solid #eee}.sk-work-badge{min-width:72px;padding:5px 10px;color:#26b;background:#e7f0ff;border-radius:20px;font-size:12px;font-weight:bold;text-align:center}.sk-work-summary-text{color:#52616b;font-size:14px}
.sk-work-row{display:grid;grid-template-columns:18px minmax(135px,1fr) minmax(210px,1.5fr) 58px;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid #edf1f3;font-size:14px}.sk-work-dot{width:10px;height:10px;border-radius:50%;background:#3b82e6;
    box-shadow:0 0 0 4px #e8f1ff}.sk-work-name{font-weight:600}.sk-work-state{color:#2769b7}.sk-work-open{padding:5px 8px;color:#405562;background:#fff;border:1px solid #b8c4cc;border-radius:6px;text-align:center;text-decoration:none}.sk-work-open:hover{color:#245e86;
    background:#f3f8fb}.sk-work-row[data-state="ok"] .sk-work-dot{background:#22a060;box-shadow:none}.sk-work-row[data-state="ok"] .sk-work-state{color:#16804b;font-weight:600}.sk-work-row[data-state="login"] .sk-work-dot,.sk-work-row[data-state="unknown"] .sk-work-dot,
.sk-work-row[data-state="manual"] .sk-work-dot{background:#e59622;box-shadow:none}.sk-work-row[data-state="login"] .sk-work-state,.sk-work-row[data-state="unknown"] .sk-work-state,.sk-work-row[data-state="manual"] .sk-work-state{color:#ad6700}.sk-work-microsoft{
    margin:14px 20px 0;padding:10px 12px;color:#805900;background:#fff6dc;border-radius:7px;font-size:13px}.sk-work-microsoft[hidden]{display:none}.sk-work-actions{padding:18px 20px 20px}.sk-work-start{width:100%;padding:12px;color:#fff;background:#2f709b;border:0;
    border-radius:8px;font-size:15px;font-weight:bold;cursor:pointer}.sk-work-start:disabled{background:#a0adb5;cursor:default}.sk-work-extra-actions{margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.sk-work-btn{display:block;
    width:100%;padding:10px 12px;color:#2f709b;background:#f0f6fa;border:1px solid #c4d7e5;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s ease;text-align:center;text-decoration:none}.sk-work-btn:hover:not(.sk-work-btn-placeholder){
    background:#2f709b;color:#fff;border-color:#2f709b}.sk-work-btn-placeholder{opacity:0.5;cursor:default;background:#f8fafb;border-style:dashed}@media(max-width:620px){body:where(.sk-work-login){padding:24px 12px}.sk-work-row{grid-template-columns:14px 1fr 54px;gap:9px;
        padding:13px 15px}.sk-work-state{grid-column:2/4}}.sk-lite-tag-paper{background:#fef3c7;color:#92400e}#sk-lite-results th,#sk-lite-results td{white-space:nowrap}
#sk-lite-results td:last-child{width:30%;max-width:0;overflow:hidden;text-overflow:ellipsis}.sk-lite-search-root>:not(#sk-lite-bar):not(#sk-lite-page){display:none!important}.sk-lite-search input[name="co"]{flex:0 1 180px;min-width:0}
.sk-lite-search input[name="extra"]{flex:0 1 300px;min-width:0}
`;

var { icon_mrs, icon_magnifier, icon_pencil, icon_mail, icon_note, icon_note_add, icon_arrow, icon_book, icon_plus, icon_users, icon_webs, icon_scopus, icon_retractiondatabase, icon_researchgate } = JSON.parse(skDecodeResourceText('icons') || '{}');
