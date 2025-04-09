// ==UserScript==
// @name          Susy Modifier
// @version       5.4.9
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Susy Modifier
// @author        Syna
// @icon64        https://susy.mdpi.com/build/img/design/susy-logo.png
// @updateURL     https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/SusyModifier.user.js
// @downloadURL   https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/SusyModifier.user.js
// @match         *://*.mdpi.com/*
// @match         *://redmine.mdpi.cn/*
// @match         *://*.scopus.com/*
// @match         *://www.scilit.net/*
// @match         *://admin.scilit.net/articles*
// @match         *://*.mdpi.com/*
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
// @require       https://gcore.jsdelivr.net/npm/jquery@4.0.0-beta.2/dist/jquery.js
// @require       https://gcore.jsdelivr.net/npm/tooltipster@4.2.8/dist/js/tooltipster.bundle.min.js
// @require       https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/chosen.jquery.js
// @require       https://gcore.jsdelivr.net/gh/sizzlemctwizzle/GM_config@master/gm_config.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_openInTab
// @grant         GM_addStyle
// @connect       mdpi.com
// @connect       i.mdpi.cn
// @connect       titlecaseconverter.com
// @connect       google.com
// @connect       webofknowledge.com
// @connect       skday.com
// @connect       pubpeer.com
// ==/UserScript==
/* globals jQuery, $, GM_config */

(function () {
    'use strict'; console.time("test");
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
            'LinkShort': { 'label': 'SI Webpage 短链接', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'Cfp_checker': { 'label': 'Toolkit for CfP Checker', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'GE_TemplateID': {
                'section': [], 'label': '默认 GE Invitation Template', 'type': 'select', 'labelPos': 'left', 'options':
                ['Guest Editor-Invite with Responsibility', 'Guest Editor-Invite with Benefits', 'Guest Editor-One Free Paper for GE team', 'Guest Editor-Why a Special Issue', 'Guest Editor-Optional', 'Guest Editor – Invite with Responsibilities and Benefits',
                 '*Guest Editor - SI Mentor Program'], default: 'Guest Editor-Invite with Responsibility'
            },
            'GE_TemplateS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^.*Mathematics.*Guest Editor" },
            'GE_TemplateS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] Invitation to Serve as the Guest Editor" },
            'GE_TemplateB1': { 'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_TemplateB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderID': {
                'section': [], 'label': '默认 GE Reminder Template', 'type': 'select', 'labelPos': 'left', 'options':
                ['Reminder (GE responsibility)', 'Reminder (video call)', 'Reminder (general)', 'Reminder (with benefits)'], default: 'Reminder (GE responsibility)'
            },
            'GE_ReminderS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderB1': { 'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_ReminderB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_CancelID': {
                'section': [], 'label': '默认 GE Cancel Template', 'type': 'select', 'labelPos': 'left', 'options':
                ['Guest Editor Invitation – Cancel Invitation', 'Guest Editor Invitation – Cancel Invitation (Declined the Invitation via Email)', 'Guest Editor Invitation-Cancel Invitation (feature paper invitation)-manually'],
                default: 'Guest Editor Invitation-Cancel Invitation (feature paper invitation)-manually'
            },
            'GE_CancelS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_CancelS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'GE_CancelB1': { 'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "once this Special Issue is online, we welcome you to contribute one Feature Paper with the publishing fees waived" },
            'GE_CancelB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "we welcome you to contribute one Feature Paper with a special discount" },
            'EB_TemplateID': { 'section': [], 'label': '默认 EB Invitation Template', 'type': 'select', 'labelPos': 'left', 'options': ['Invite Version 1', 'Invite Version 2', 'Invite Version 3', 'Invite Version 4'], default: 'Invite Version 1' },
            'EB_TemplateS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^Invitation" },
            'EB_TemplateS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] Invitation" },
            'EB_TemplateB1': { 'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'EB_TemplateB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
            'EB_ReminderID': {
                'section': [], 'label': '默认 EB Reminder Template', 'type': 'select', 'labelPos': 'left', 'options': ['Reminder (Responsibilities and Benefits)', 'Reminder (General)', 'Reminder (Numerous Benefits)'],
                default: 'Reminder(Responsibilities and Benefits)'
            },
            'EB_ReminderS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^Invitation" },
            'EB_ReminderS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] Invitation" },
            'EB_ReminderB1': { 'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "" },
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
            'Report_TemplateS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex](?<=\\] ).*" },
            'Report_TemplateS2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function () {\n let $si_name = $('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().text().trim();\n`
                + ` return \`Monthly Report (\${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}) – \${$si_name}\`;\n}`
            },
            'Report_TemplateB1': { 'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex](?<=Dear[\\s\\S]*?,\\n\\n)[\\S\\s]*Kind regards," },
            'Report_TemplateB2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function (){\n let $si_name=$('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().text().trim();`
                + ` let $si_link=$('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().children().attr("href").replace(/journal\\/(.*)\\/special_issues/,"si/$1");`
                + ` let $arr=$('div.cell.small-12.medium-6.large-2:contains("Manuscripts(")').first().next().text().split("/");\n let $process=$arr[0].trim(),$pub=$arr[1].trim(),$reject=$arr[2].trim(),$instruct;`
                + ` if ($process+$pub+$reject>0) {$instruct="You can view all manuscripts submitted to the Special Issue by logging in with your email at the link provided. Please note that your own submissions will not be visible.`
                + `\\nhttps://susy.mdpi.com/academic-editor/special_issues"} else {$instruct="This is a new Special Issue and hasn't received submissions yet."} return \`I am writing to update you on the status of our Special Issue "\${$si_name}".\n`
                + `\${$si_link}\n\n1. Status of Submissions\n\nPublished: \${$pub}; Under Processing: \${$process}; Rejected: \${$reject}\n\n\${$instruct}\n\n2. Status of Planned Papers\n\nSeveral authors have committed to contributing feature papers`
                + ` to the Special Issue. If there are any missing papers, please let me know.\n\n%pp_list%\n\nWe are excited about a productive collaboration and hope for a successful outcome for the Special Issue. If you have any questions, please `
                + `do not hesitate to contact us.\n--\nBest regards,\n\`;\n}`
            },
            'PP_Template': { 'section': [], 'label': '修改 PP 提醒模板', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'PP_TemplateS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^.*Special Issue(.*) – Potential Paper" },
            'PP_TemplateS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (JCR Q1)$1 - Reminder" },
            'PP_TemplateB1': {
                'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default':
                "[Regex]We hope you are well. [\\s\\S]*submitting a paper to the Special Issue (.*?)\\.[\\s\\S]*(https:\\/\\/www.mdpi.com\\/journal\\/mathematics\\/special_issues.*)[\\s\\S]*Kind regards,"
            },
            'PP_TemplateB2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': 'A few months ago, you expressed interest in submitting a paper to our special issue "$1". We would be grateful to have the opportunity to receive it.\n\n$2\n\n'
                + 'Please note that you will be offered a XX% discount on the Article Processing Charge by the guest editors if your paper is accepted for publication. To take advantage of the discount, we strongly encourage you to submit your'
                + ' manuscript by the deadline if possible.\n\nWe look forward to receiving your submission and thank you for your interest in our special issue.\n\nKind regards,'
            },
            'Interface_combine': { 'label': 'Topic Manuscripts整合SI', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Topic_TemplateS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^.*" },
            'Topic_TemplateS2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function () { let $topic_name= $('div.cell.small-12.medium-6.large-2:contains("Topic Name")').next().text().trim(); return \`[MDPI Topics] Monthly Report `
                + `(\${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}) – \${$topic_name}\`; }`
            },
            'Topic_TemplateB1': { 'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': '[Regex]Dear Editor,[\\s\\S]*Kind regards,' },
            'Topic_TemplateB2': {
                'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function (){\n let \$topic_name=\$('div.cell.small-12.medium-6.large-2:contains("Topic Name")').next().text().trim(); let \$topic_link=\$('div.cell.small-12.medium-6.`
                + `large-2:contains("Topic Name")').next().children().attr("href"); let \$arr=\$('div.cell.small-12.medium-6.large-2:contains("Manuscripts(")').first().next().text().split("/");\n let \$process=\$arr[0].trim(),\$pub=\$arr[1].trim(),`
                + `\$reject=\$arr[2].trim(),\$instruct; if (\$process+\$pub+\$reject>0) {\$instruct="You can view all manuscripts submitted to the Topic by logging in with your email at the link provided. Please note that your own submissions will `
                + `not be visible.\\nhttps://susy.mdpi.com/"} else {\$instruct="This is a new Topic and hasn't received submissions yet."} return \`Dear Editor,\n\nI am writing to update you on the status of our Topic "\${\$topic_name}".\n\${\$topic_link}`
                + `\n\n1. Status of Submissions\n\nPublished: \${\$pub}; Under Processing: \${\$process}; Rejected: \${\$reject}\n\n\${\$instruct}\n\n2. Status of Planned Papers\n\nSeveral authors have committed to contributing feature papers to the `
                + `Special Issue. If there are any missing papers, please let me know.\n\n%pp_list%\n\nMay you continue to explore the unknown and lead the forefront of academia. Wishing you continuous breakthroughs and inspiration in your scholarly `
                + `endeavors!\n--\nBest regards,\n\`;\n}`
            },

            'Con_Template': { 'section': [, "Conference Pages"], 'label': '修改Conference模板', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Con_TemplateS1': { 'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "(ISSN 2227-7390)" },
            'Con_TemplateS2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "(ISSN 2227-7390)" },
            'Con_TemplateB1': { 'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex] and within the journal newsletter.* website and newsletter." },
            'Con_TemplateB2': { 'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ". We would be glad if, in return, you could advertise the journal via the conference website." },

            'Interface_SME': {
                'section': [GM_config.create('Interface Modification')], 'label': 'I am SME ', 'type': 'select', 'labelPos': 'left', 'options':
                ['', 'A: Algebra and Logic', 'B: Geometry and Topology', 'C: Mathematical Analysis', 'C1: Difference and Differential Equations', 'C2: Dynamical Systems', 'C3: Real Analysis', 'C4: Complex Analysis', 'D: Statistics and Operations Research',
                 'D1: Probability and Statistics', 'D2: Operations Research and Fuzzy Decision Making', 'E: Applied Mathematics', 'E1: Mathematics and Computer Science', 'E2: Control Theory and Mechanics', 'E3: Mathematical Biology', 'E4: Mathematical Physics',
                 'E5: Financial Mathematics'], 'default': ''
            },
            'Journal': { 'label': 'of Journal', 'type': 'select', 'labelPos': 'left', 'options': ['Analytics', 'AppliedMath', 'Games', 'Geometry', 'Mathematics', 'Risks', 'IJT', 'Telecom', 'None'], 'default': 'Mathematics' },
            'Easy_Journal': { 'label': '置顶期刊列表', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Susy_Theme': { 'label': 'Change Susy Theme', 'type': 'button', 'click': function () { window.location.href = "https://susy.mdpi.com/user/settings" } },
            'MathBatch': { 'label': 'Get Unsubscribe Link', 'type': 'button', 'click': function () { window.location.href = "https://skday.eu.org/math.html" } },
            'Interface_sidebar': { 'section': [], 'label': 'Susy 左侧边栏按钮', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'Old_Icon': { 'label': '使用旧图标', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Regular_Color': { 'label': '橙色标记 Regular', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Maths_J': { 'label': 'Scopus标记Maths期刊', 'labelPos': 'right', 'type': 'checkbox', 'default': true },
            'Hidden_Func': { 'section': [], 'label': 'Experimental (!Caution)', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'Remind_Dinner': { 'label': '提醒点餐', 'labelPos': 'right', 'type': 'checkbox', 'default': false },
            'My_Account_Only': { 'label': 'Use My Account Only:', 'labelPos': 'left', 'type': 'text', 'default': "" },
        },
        'events': {
            'save': function () { if ($("#SusyModifierConfig").length > 0) { location.reload() }; },
            'open': function () {
                var f_settings = $("#SusyModifierConfig").contents();
                //Experimental警告
                GM_config.fields.Hidden_Func.node.addEventListener('change', function () {
                    if (f_settings.find("#SusyModifierConfig_field_Hidden_Func")[0].checked) {
                        alert('Dangerous! \n\nDon\'t turn it on unless you are familiar with ALL susy functions. \nOtherwise, it will cause serious problems.')
                    }
                });
                //隐藏推广信模板
                if (!GM_config.get('ManuscriptFunc')) { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").hide() }
                GM_config.fields.ManuscriptFunc.node.addEventListener('change', function () {
                    if (f_settings.find("#SusyModifierConfig_field_ManuscriptFunc")[0].checked) { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").show(); }
                    else { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").hide() }
                });
                //隐藏Conference Template
                f_settings.find("#SusyModifierConfig_Con_TemplateB2_var").after('<div id="c_br"></div>')
                f_settings.find("#SusyModifierConfig_PP_TemplateB2_var").after('<div id="c_br2"></div>')
                if (!GM_config.get('Con_Template')) { f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").hide() }
                if (!GM_config.get('PP_Template')) { f_settings.find("#SusyModifierConfig_PP_TemplateS1_var,#SusyModifierConfig_PP_TemplateS2_var,#SusyModifierConfig_PP_TemplateB1_var,#SusyModifierConfig_PP_TemplateB2_var,#c_br2").hide() }
                if (!GM_config.get('Interface_combine')) { f_settings.find("#SusyModifierConfig_Topic_TemplateS1_var,#SusyModifierConfig_Topic_TemplateS2_var,#SusyModifierConfig_Topic_TemplateB1_var,#SusyModifierConfig_Topic_TemplateB2_var").hide() }
                GM_config.fields.Con_Template.node.addEventListener('change', function () {
                    if (f_settings.find("#SusyModifierConfig_field_Con_Template")[0].checked) {
                        f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").show()
                    }
                    else { f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").hide() }
                });
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
            },
            'init': onInit,
        },
        'css': `#SusyModifierConfig{background-color:#D6EDD9} textarea{font-size:12px;width:160px} .config_var{padding: 5px 10px;display:inline-block;vertical-align:top;} select{width:170px} #SusyModifierConfig_section_1{min-height:70px}
        #SusyModifierConfig_section_0,#SusyModifierConfig_section_2{min-height:40px} #SusyModifierConfig_Interface_sidebar_field_label,#SusyModifierConfig_Manuscriptnote_field_label,#SusyModifierConfig_SInote_field_label,#SusyModifierConfig_SIpages_field_label,
        #SusyModifierConfig_Regular_Color_field_label,#SusyModifierConfig_LinkShort_field_label,#SusyModifierConfig_Cfp_checker_field_label,#SusyModifierConfig_Assign_Assistant_field_label,#SusyModifierConfig_ManuscriptFunc_field_label,#SusyModifierConfig_field_Report_Notes,
        #SusyModifierConfig_Old_Icon_field_label,#SusyModifierConfig_Hidden_Func_field_label{width:140px;display:inline-block;} #SusyModifierConfig_Con_Template_field_label,#SusyModifierConfig_PP_Template_field_label,
        #SusyModifierConfig_Interface_combine_field_label{width:145px;display:inline-block;} #SusyModifierConfig_GE_TemplateID_field_label,#SusyModifierConfig_GE_ReminderID_field_label,#SusyModifierConfig_GE_CancelID_field_label,#SusyModifierConfig_EB_TemplateID_field_label,
        #SusyModifierConfig_EB_ReminderID_field_label,#SusyModifierConfig_field_Report_TemplateID{display:block;} #SusyModifierConfig_Report_Notes_var{padding-top:0;} #SusyModifierConfig_section_6{display:inline-grid;grid-template-columns:repeat(5, auto);
        grid-template-rows:auto auto;} #SusyModifierConfig_Report_Notes_var{grid-row:2;grid-column:1;} #SusyModifierConfig_Report_TemplateID_var{padding-bottom:0;} #SusyModifierConfig_Report_TemplateS1_var,#SusyModifierConfig_Report_TemplateS2_var,
        #SusyModifierConfig_Report_TemplateB1_var,#SusyModifierConfig_Report_TemplateB2_var{grid-row:1/3} #SusyModifierConfig_field_Journal{width:auto}`
    });
})();


function onInit() {
    const date_v = new Date('202' + GM_info.script.version);
    if ((Date.now() - date_v) / 86400000 > 75) { $("#topmenu > ul").append("<li><a style='color:pink' onclick='alert(\"Please update.\");'>!!! SusyModifier Outdated !!!</a></li>"); return false; }
    else {
        $("#topmenu > ul").append(`<li><a id='susymodifier_config'>SusyModifier</a></li>`); $("#susymodifier_config").on("click", function () { GM_config.open() });
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
        case 'AppliedMath': S_J = 517; break;
        case 'Geometry': S_J = 599; break;
        case 'Games': S_J = 25; break;
        case 'IJT': S_J = 598; break;
        case 'Telecom': S_J = 276; break;
        case 'Analytics': S_J = 555; break;
        case 'None': S_J = -1; break;
        default: S_J = 154;
    }

    if (GM_config.get('Easy_Journal')) {
        $("#topmenu > ul").append(`<li><select id="SusyModifier_Journal_Easy"><option value="555">Analytics</option><option value="517">AppliedMath</option><option value="25">Games</option><option value="599">Geometry</option><option value="154">Mathematics</option>
                                   <option value="162">Risks</option><option value="598">IJT</option><option value="276">Telecom</option><option value="-1">None</option></select></li>`);
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
    var userNamesEncoded = ["YWJjc3luYS5tdXh5eg==", "YWJjc3VzaWUuaHVhbmd4eXo=", "YWJjaGVsZW5lLmh1eHl6", "YWJjbGlubi5saXh5eg==", "YWJjZGViYnkucGVuZ3h5eg==", "YWJjZ2xhZHlzLmxpeHl6", "YWJjY29ubmVsbHkueWFuZ3h5eg==", "YWJjdGlmZmFueS5saXh5eg==", "YWJjbGlsaWEuZGluZ3h5eg==",
                            "YWJjaW5uYS5odWFuZ3h5eg==", "YWJjY2FzcGVyLnhpZXh5eg==", "YWJjZGFuaWVsLmRhbnh5eg==", "YWJjZWlsZWVuLnpoYW5neHl6", "YWJjZWRlbi54aWF4eXo="];
    var userNames = userNamesEncoded.map(decode);

    //susy侧边栏的按钮🔎
    if (window.location.href.indexOf("susy.mdpi.com/") > -1 && GM_config.get('Interface_sidebar') && $('#leftcol').length) {
        try {
            $("body").append(`<div id='si_search' role='dialog' style='display: none; position: absolute; height: 350px; width: 500px; top: 500px; left: 242.5px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front'>
        <div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle'><span class='ui-dialog-title'>Quick Search</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close'
        onclick='document.getElementById(\"si_search\").style.display=\"none\"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span></button></div><div class='ui-dialog-content ui-widget-content'> <form class='insertform' method='get'
        action='/special_issue_pending/list/search' target='_blank'><input type='text' name='show_all' value='my_journals' style='display:none;'>SI Title: <input type='text' name='form[si_name]' style='display:inline-block; width:65%;'>
        <input type='submit' class='submit' value='SI Search'></form><hr><form class='insertform' method='get' action='/user/ebm-new/management/all/my_journals' target='_blank'>Name: <input type='text' id='form_name2' name='form[name]'
        style='display:inline-block; width:65%;'><br>Email: <input type='email' name='form[email]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='EBM Search'></form><hr>
        <form class='insertform' method='get' action='/user/conference/list' target='_blank'>Conference: <input type='text' name='form[conference_name]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='Search'></form>`);

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
            } else {
                $(".menu [href='/special_issue_pending/list']").after("<a href='/special_issue_pending/list/online?form[journal_id]=" + S_J + "&show_all=my_journals&sort_field=special_issue_pending.deadline&sort=ASC'>[J]</a>");
            }
            if ($("#topmenu span:contains('@mdpi.com')").text() === 'syna.mu@mdpi.com') {
                $(".menu [href='/voucher/application/list']").after("<div style='float:right;'><a href='//skday.com/task/susylog.php' target=_black>[Log]</a> </div> ");
            }
            if (S_J > 0) {
                $(".menu [href='/user/assigned/status/ongoing']").after("<a href='/user/managing/status/published?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.publish_date&sort=DESC'>[Pub]</a> ");
                $(".menu [href='/user/assigned/status/ongoing']").after(" <a href='/user/managing/status/production?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.last_action&sort=DESC'>[Fin]</a> ");
                $(".menu [href='/user/managing/status/submitted']").after(" <a id='owner' href='#'>[Owner]</a>");
                $(".menu [href='/voucher/application/list']").attr("href", "/voucher/application/list/my_journal?form[journal_id]=" + S_J);
                $(".menu [href='/user/manage/award_request']").attr("href", "/user/manage/award_request?form[journal_id]=" + S_J);
                $(".menu [href='/user/manage/awards_item']").attr("href", "/user/manage/awards_item?form[journal_id]=" + S_J);
                $(".menu [href='/si/proposal/list']").attr("href", "/si/proposal/list?form[journal_id]=" + S_J);
                $(".menu [href='/list/list_volunteer_reviewers']").attr("href", "/list/list_volunteer_reviewers?form[journal_id]=" + S_J);
                $(".menu [href='/tap/list']").after("<a href='/tap/list/pending/my_journals?form[journal_id]=" + S_J + "'> [J]</a>");
                $(".menu [href='/topic/proposal/list']").attr("href", "/topic/proposal/list?form[journal_id]=" + S_J);
                $(".menu [href='/user/conference/list']").attr("href", "/user/conference/list?form[subject_id]=4");
                $(".menu [href='/user/submission_sponsorships/list']").after(" <a href='/user/submission_sponsorships/list/my_journal?form[sponsorship_journal_id]=" + S_J + "'>[J]</a>");
                $(".menu [href='/user/manuscript/list/owner']").attr("href", '/user/manuscript/list/owner/my_journal');
                $(".menu [href='/user/manuscript/special_approval_list']").attr("href", '/user/manuscript/special_approval_list/my_journal');
                $(".menu [href='/user/issues/list']").after(" <a href='/user/issues/list/progress?form[journal_id]=" + S_J + "'>[J]</a> <a href='/user/public_forum/list?form[journal_id]=" + S_J + "'>[P]</a>");
                $(".menu [href='/publisher/manuscripts']").attr("href", "/publisher/manuscripts?form[journal_id]=" + S_J);
            }
            $(".menu [href='/special_issue_pending/list']").after(" <a href='/special_issue_pending/list?&sort_field=special_issue_pending.date_update&sort=DESC&page_limit=100'>Special Issues</a> <a href='/user/sme/status/submitted'>[MS]</a> ");
            $(".menu [href='/special_issue_pending/list']").text("Manage").attr("href", "/special_issue_pending/list/online?sort_field=special_issue_pending.publish_date&sort=DESC&page_limit=100")
            $(".menu [href='/submission/topic/list']").after(" <a href='/user/topic/status/submitted'>[MS]</a>");
            $(".menu [href='/submission/topic/list']").attr("href", "/submission/topic/list/online");
            $(".menu [href='/user/manuscript/approval/manage']").attr("href", "/user/manuscript/special_approval_list/my_journal");
            $(".menu [href='/planned_paper/my/list']").after(" <a href='/planned_paper/my/list?form[submission_topic_id]=-1&form[special_issue_id]=-1'>[Reg.]</a>");
            $(".menu [href='/user/ebm-new/management']").after(`<div style='float:right;'><a onclick='$(\"#si_search\").show(); $(\"#si_search\").draggable({handle: \"#mover\"});'><img src='${icon_magnifier}'></a> </div> `);

            $(".menu [href='/manuscript/quality/check/list']").after(`<div style='float:right;'><a id='sf_b'><img src='${icon_webs}'></a></div>`); $("#sf_b").on("click", skOpenUrls)

            $(".menu [href='/user/managing/status/submitted']").attr("href", "/user/managing/status/submitted?form[journal_id]=" + S_J);
            $(".menu [href='/manuscript/quality/check/list']").attr("href", '/manuscript/quality/check/list?form[journal_id]=' + S_J);
            $("#owner").on("click", function () { $.getJSON("/user/ajax/search_manuscript_owner?term=" + $("#topmenu span:contains('@mdpi.com')").text(), function (data) { window.location.href = '/user/managing/status/submitted?form[owner_id]=' + data[0].value }); });

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
                                if (!$('#tooltipster-style').length) { addCssTooltipster() }
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

    //GE Invitation✏️ + Quick
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
            $('#Awaiting').on("click", function () { if ($('#mailSubject').val().indexOf("Awaiting Your Reply") == -1) { $('#mailSubject').val("Awaiting Your Reply: " + $('#mailSubject').val()) } });
            $('html, body').scrollTop($('#emailTemplates_chosen').offset().top);
        } catch (error) { }
    }

    //GE Cancel🗑️ + Quick
    if (window.location.href.indexOf("/uninvite/guest_editor") > -1) {
        try {
            skMyAccountOnly();
            $("#emailTemplates > option:contains('" + GM_config.get('GE_CancelID') + "')").prop('selected', true);
            unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");
            function init() {
                let t1 = skStringToRegex(GM_config.get('GE_CancelS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, skStringToFunction(GM_config.get('GE_CancelS2'))));
                let t2 = skStringToRegex(GM_config.get('GE_CancelB1')); $("#mailBody").val($("#mailBody").val().replace(t2, skStringToFunction(GM_config.get('GE_CancelB2'))));
                if (window.location.search == "?Q") { setTimeout(function () { $("#sendingEmail").trigger("click") }, 500); }
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init);

            $('#mailSubject').parent().after(`<a id="sk_discount">[Special Discount]</a></a>`);
            $('#sk_discount').on("click", function () { $("#mailBody").val($("#mailBody").val().replace("the publishing fees waived", "a special discount").replace("Feature Paper, if", "Feature Paper with a special discount, if")) });
            $('#mailBody').parent().after(`<a id="sk_nodiscount">[No Discount]</a>`);
            $('#sk_nodiscount').on("click", function () { $("#mailBody").val($("#mailBody").val().replace(" with the publishing fees waived", "").replace(" with a special discount", "")) });
            $('#mailBcc').parent().after(`<a id="sk_fullwaiver" style="align-self: center;">[Full Fee Waiver]</a>`);
            $('#sk_fullwaiver').on("click", function () { $("#mailBody").val($("#mailBody").val().replace("a special discount", "the publishing fees waived").replace(" Feature Paper, if", "Feature Paper with the publishing fees waived, if")) });
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
                                    case 2024: discountRatio = discount / 2600; break;
                                    default: discountRatio = 8;
                                }
                            }
                            if (invitedByGE.indexOf("by GE") > -1 && discountRatio > 0) {
                                switch (agreedDate.getFullYear()) {
                                }
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
                    case 'book':insert_text=`\nIf ten or more papers are published in this Special Issue, we can make a Special Issue book and send a hard copy to each Guest Editor (free of charge). Special Issue book example:\nhttps://www.mdpi.com/books/pdfview/book/3008\n`;
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

            $("#addAttachment").after(` <input type="text" id="addnote" value="${GM_config.get('Report_Notes')}" style="width: 150px; display:inline-block">`); // $("#sendingEmail").after(`<a class="submit" type="button" id="SKsendingEmail">Send email</a>`).hide();
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
                    $(this).before('<a href="mailto:' + email[index] + '?subject=[' + m_journal + '] (ISSN 2227-7390) Promote Your Published Papers&body=' +
                                   GM_config.get('Template_Paper').replace(/\n/g, "%0A").replace(/"/g, "&quot;").replace(/%m_id%/g, m_id).replace(/%m_section%/g, m_section).replace(/%name%/g, name[index]) + `"><img src=${icon_mail}></a> `);
                });

                $("[title|='Send email to authors']").before('<a id="linkedin" href="mailto:' + email.join(";") + '?subject=[' + m_journal + '] Manuscript ID: ' + m_id + '&body=' + GM_config.get('Template_Linkedin')
                                                             .replace(/\n/g, "%0A").replace(/"/g, "&quot;").replace(/%m_id%/g, m_id).replace(/%m_section%/g, m_section) + '"><img src="https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a" alt="[LinkedIn]"></a> ')
                if (window.location.href.indexOf("?linkedin") > -1) { $("#linkedin")[0].trigger("click"); history.back(); }
                $("[title='Google']").before(' <a href="https://www.researchgate.net/search.Search.html?type=publication&query=' + $("[title='Google']").prev().text() +
                                             '" title="Researchgate" target="_blank"><img style="vertical-align: middle;" src="https://c5.rgstatic.net/m/41542880220916/images/favicon/favicon-16x16.png"></a> ');

                $("[class|='margin-horizontal-1']").after(`<form id='vf' class='insertform' method='post' target='_blank' style='display:none;'><input name='form[journal_id]'><input name='form[is_percentage]' value='1'><input name='form[special_issue_id]'>
            <input name='form[emails]'><input name='form[valid_months]' value='12'><input name='form[section_id]'><input name='form[reason]'><input name='form[manuscript_id]'><textarea name='form[note]'></textarea></form>`);
                $("[class|='margin-horizontal-1']").after(`<div id="voucher" style="display:inline-block;"><a style="color:#4b5675;">[Vouchers]</a><div style="position:absolute;background-color: #f1f1f1;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);display: none;">
            <a id="v_invited" reason="Feature paper invited by guest editor" style="display:block;padding: 8px 12px;text-decoration: none;color:black;">FP invited by GE</a><a id="v_ge" reason="Paper by guest editor" style
            ="display:block;padding: 8px 12px;text-decoration:none;color:black;">Paper by GE</a><a id="v_ebm" reason="Paper by editorial board member" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">Paper by EBM</a>
            <a id="v_other" reason="Others" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">Others</a></div></div>`);
                $("#voucher").on("mouseover", function () { $(this).children("div").show() });
                $("#voucher").on("mouseout", function () { $(this).children("div").hide() });
                $('head').append('<style>#voucher a:hover {background-color: #ddd;}</style>');
                if (!m_si) { $("#v_invited, #v_ge").remove() };

                let d_reason = "";
                $("#voucher>div>a").on("click", function () {
                    if ($("[data-invoice_id]").length == 0) { alert("There is no APC form on the page. Please change the manuscript status."); return; }

                    let xhr = new XMLHttpRequest(); xhr.open('GET', "https://susy.mdpi.com/apply/voucher/on_ms_page/" + $("[data-rel]").attr("data-rel") + "/" + $("[data-invoice_id]").attr("data-invoice_id") + "/", false); xhr.send();
                    let searchParams = new URLSearchParams(new URL(decodeURIComponent(xhr.responseURL)).search);
                    switch ($(this).attr("id")) {
                        case 'v_invited':
                        case 'v_other':d_reason="The paper invited by GE is now submitted. I would like to apply for a XXX% discount on this paper as we promised before. Hope you may approve.\n\nP.S. No need to send promotion letter. / Promotion letter has been sent."; break;
                        case 'v_ge': d_reason = "The paper by GE is now submitted. We agreed to grant a XXX% discount on GE's paper. Hope you may approve.\n\nP.S. No need to send promotion letter. / Promotion letter has been sent."; break;
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

                $("[title='PubPeer']").each(function () {
                    let $link = $(this);
                    let pubpeer_search = new URLSearchParams(new URL($link.attr("href")).search);
                    let pubpeer_name = pubpeer_search.get("q");
                    $link.attr("href", "https://pubpeer.org/search?q=authors%3A%22" + pubpeer_name + "%22");
                    let firstName = $link.parent().contents().filter(function () { return this.nodeType === 3; }).first().text().trim();
                    let lastName = $link.parent().find('b').first().text().trim();
                    $(this).before(` <a href="//www.scopus.com/results/authorNamesList.uri?st2=${firstName}&st1=${lastName}" title="Scopus" target="_blank" rel="noopener noreferrer"><img src=${icon_scopus}></a> `);
                    $(this).after(` <a href="//retractiondatabase.org/RetractionSearch.aspx?auth%3d${firstName}+${lastName}" title="retractiondatabase" target="_blank" rel="noopener noreferrer"><img src=${icon_retractiondatabase}></a> `)
                });

                let hasBeenClicked = false;
                $("[title='PubPeer']").on("click", function (event) {
                    if (!hasBeenClicked) {
                        $('body').append('<div id="overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: transparent; cursor: wait; z-index: 10000;"></div>');
                        event.preventDefault(); hasBeenClicked = true;
                        let $link = $(this);
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: $link.attr("href").replace("pubpeer.org/", "pubpeer.com/api/"),
                            onload: function (response) {
                                let pub_num = JSON.parse(response.responseText).meta.total;
                                $link.append("[" + pub_num + "]");
                                if (pub_num > 0) { $link.css('background-color', 'gold'); }
                                $('#overlay').remove();
                            }
                        });
                        $("[title='PubPeer']").each(function () {
                            let $link = $(this);
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: $link.attr("href").replace("pubpeer.org/", "pubpeer.com/api/"),
                                onload: function (response) {
                                    let pub_num = JSON.parse(response.responseText).meta.total;
                                    $link.append("[" + pub_num + "]");
                                    if (pub_num > 0) { $link.css('background-color', 'gold'); }
                                }
                            });
                        });
                        setTimeout(function () { $('#overlay').remove(); }, 1000);
                    }
                });

            }

            if (GM_config.get('Assign_Assistant')) { //派稿助手
                try {
                    let params = new window.URLSearchParams(window.location.search); let reviewer = params.get('r');
                    if (reviewer.indexOf("@") > -1) {
                        $("#form_email").val(reviewer); $("#nextBtn").trigger("click");

                        waitForKeyElements('#specialBackBtn', function () {
                            $('html, body').scrollTop($('#form_email').offset().top);
                            $("#keepRviewer").hide().before(` <input type="button" id="keepReviewer2" value="Proceed2" class="submit"> `);
                            $("#keepReviewer2").on("click", function () {
                                document.querySelector("#specialBackBtn").click();
                                document.querySelector("#nextBtn").click();
                                waitForKeyElements('#specialBackBtn', function () {
                                    $("#keepRviewer").before(` <input type="button" id="keepReviewer3" value="Proceed2" class="submit"> `);
                                    $("#keepReviewer3").on("click", function () {
                                        document.querySelector("#specialBackBtn").click();
                                        document.querySelector("#nextBtn").click();
                                        waitForKeyElements('#specialBackBtn', function () { document.querySelector("#keepRviewer").click(); }, true);
                                    })
                                    document.querySelector("#keepRviewer").click();
                                }, true);
                            });
                        }, true);
                    }
                } catch (error) { }
                if ($("div:contains('The CSRF token is invalid. Please try to resubmit the form')").length > 0) {
                    $("header").append('<div data-animation="drop" class="notify notify-dismissible notify-danger center top"><div class="message">The CSRF token is invalid.</div><button type="button" class="close" data-close="notify" data-animation="drop">×</button></div>')
                }

                if ($("strong.margin-horizontal-1").text().indexOf("decision") > -1) {
                    $.get("/user/assigned/production_form/" + window.location.href.match("process_form/(\\w*)")[1], function (res) {
                        if (res.indexOf("see more at redmine issue ") > -1) { $("legend:contains('Academic Editor Decision')").append(" [Layout Sent]") } else { $("legend:contains('Academic Editor Decision')").append(" <span style='color:yellow'>[Layout NOT Sent]</span>") }
                    });
                }

                if ([154, 159, 162, 517, 599, 25, 598, 276].includes(S_J)) {
                    $("table [title|='Google Scholar']").each(function () {
                        let ranking = skGetUniv($(this).parent().nextAll(":last-child").text().trim());
                        if (ranking.color) {
                            let markup = $(this).parent().nextAll(":last-child").children("div");
                            markup.css("background-color", ranking.color); markup.attr("title", markup.attr("title") + "<br>" + ranking.detail)
                        }
                    });
                    //              $("table:has([title|='Google Scholar'])").parent().prev().html( $("table:has([title|='Google Scholar'])").parent().prev().html() + " <a href='//redmine.mdpi.cn/projects/journal-mathematics/wiki/SI_Manage_CN' target=_blank>[List]</a>" )
                }
            }

            //Always QC 换行
            $('a[data-title="Quality Check"]').on("click", skLineBreakForQC);

            $('h1').each(function () {
                if ($(this).text().includes('403 - Permission denied')) {
                    let summary_link = window.location.href.replace(/.*_form/, "//susy.mdpi.com/manuscript/summary");
                    $(this).before(`<h1>Process Manuscript &nbsp;&nbsp;|&nbsp;&nbsp; Finalize Manuscript &nbsp;&nbsp;|&nbsp;&nbsp; <a href="${summary_link}">Manuscript Summary</a></h1><br>`);
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
                            class="manuscript-add-note-form" minlength="1" rows="8" spellcheck="false" style='width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ccc; border-radius:4px;'>${prependContent}</textarea><div style='margin-top: 10px;font-size:
                            14px;'>Text will append after the location specified below, or at the beginning if not found:</div><input type="text" id="si_qc_addplace" value="${AddPlace}" style='width: 100%; padding: 10px; margin-top: 5px; border: 1px solid #ccc;
                            border-radius:4px;'><button id="si_qc_save" class="submit" style='background-color: #FFA500; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;'>Save</button></div></div>`;
                                $("body").append(dialogHTML);

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
                    $('#si-update-emphasized').before('<a href="' + $('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/", "/special_issue/reset_status/") + `" title="Reset"><img border="0" src="${icon_arrow}"></a> `);
                    $('#si-update-emphasized').before('<a href="' + $('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/", "/special_issue/close_invitation/") + `" title="Close"><img border="0" src="${icon_book}"></a> `);
                    $("#forceadd").on("click", function () { window.location.href = "//susy.mdpi.com/planned_paper/edit?email=" + $("#add-planned-paper-section input[name='email']").val() });
                }
            }
            if (userNames.some(userName => $("#topmenu span:contains('@mdpi.com')").text().includes(userName + "@mdpi.com"))) {
                SpecialFunc();
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
                <form onsubmit="return false;"><br>E-Mail <input type="text" id="sk_eltry_email" style="display:inline-block; width:65%;" value="`+ $("#form_email").val() + `" required> <br>Interval <input type="number" id="sk_eltry_interval" min=` + p1 + ` max=10000 step=50
                style="display:inline-block; width:7em;" value=`+ p1 + ` onkeydown="return false;" required> ms <br>Start Time <input type="time" id="sk_eltry_startt" style="display:inline-block; width:10em;" required><br><input type=submit id=sk_eltry_submit
                value=Start style="margin:10px;padding:5px 20px"><input onclick='document.getElementById("ith-shade1").remove(),document.getElementById("ith-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"></form></div>`)
                    $("#sk_eltry_submit").on("click", function () {
                        var eltry_email = $("#sk_eltry_email").val();
                        var interval_time = $("#sk_eltry_interval").val();
                        let today = new Date();
                        var start_time = new Date(today.getFullYear() + '/' + (today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1) + '/' + today.getDate() + ' ' + $("#sk_eltry_startt").val());
                        var today_string = today.getFullYear() + '-' + (today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1) + '-' + today.getDate() + ' ';
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
            function Quick_InviteRemind(param) { param.each(function () { $(this).after(" (<a href='" + $(this).attr("href") + "?Q'>Quick</a>)") }) }
            $('a[data-title="Extend Deadline"]').on("click", function () { waitForKeyElements("#form_deadline", solve_readonly, false); function solve_readonly() { $("#form_deadline").attr("readonly", false) }; })
            $('a[data-title="Change special issue deadline"]').on("click", function () { waitForKeyElements("#form_date", solve_readonly2, false); function solve_readonly2() { $("#form_date").attr("readonly", false) }; })
            $('div.cell.small-12.medium-6.large-2:contains("Online Date")').next().css({ "background-color": "yellow" });
            $("#form_checklist_1").before("<input id='select_all' type='button' value='[Select All]'><br>"); $("#select_all").on("click", function () {
                $("#si-cfp-form [type=\'checkbox\']").prop("checked", true); if ($("#form_template_id").val() == 1) { $("#form_template_id").val(2) }; if ($("#form_comments").val() == "") { $("#form_comments").val("Thank you.") }
            });

            // 按钮Contact All Guest Editors
            let button = $('input.submit[value="Contact All Guest Editors (Special Issue Management)"]');
            if (button.length > 0) { button.replaceWith(`<a href="${button.attr('onclick').match(/'([^']+)'/)[1]}" class="submit">${button.val()}</a>`); }

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
                                if (!$('#tooltipster-style').length) { addCssTooltipster() }
                                $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                    .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                            }
                        });
                    }, true)
                });
                $("#guestNextBtn").on("click", function () {
                    waitForKeyElements('#specialBackBtn', function () {
                        $('#checkMailsdb').parent().find("br").each(function () {
                            var nextNode = this.nextSibling;
                            if (nextNode && nextNode.nodeType === 3 && nextNode.nodeValue.includes('Affiliation:')) {
                                let ranking = skGetUniv($(nextNode).text().trim());
                                if (ranking.color) {
                                    if (!$('#tooltipster-style').length) { addCssTooltipster() }
                                    $(nextNode).replaceWith($('<span>').text(nextNode.nodeValue).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                                            .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' }));
                                }
                            }
                            let ranking = skGetUniv($(this).text().trim());
                            if (ranking.color) {
                                if (!$('#tooltipster-style').length) { addCssTooltipster() }
                                $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                    .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                            }
                        });
                    }, true)
                });
            }

            if (GM_config.get('Hidden_Func')) {
                $("a:contains('Show Cancelled Guest Editors')").before(`<a id=sk_list class="button small secondary margin-0">Links</a> `);
                $("h1:contains('Process Special Issue')").attr("id", "sk_list2")
                $("#sk_list,#sk_list2").on("click", function () {
                    var emailLinks = [];
                    $("[data-user-info-emails]").each(function () {
                        let email = $(this).attr('data-user-info-emails');
                        let quickLink = $(this).parent().parent().next().next().find('a:contains("Quick")').attr('href');
                        if (quickLink) { emailLinks.push(email + "\thttps://susy.mdpi.com" + quickLink) };
                    })
                    $("body").append(`<div class="blockUI blockOverlay"id=links-shade1 style=z-index:1000;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div>
                                <div class="blockUI blockMsg blockPage" id=links-shade2 style="z-index:1011;position:fixed;padding:0;margin:0;width:50%;top:5%;height:90%;left:25%;text-align:center;color:#000;border:3px solid #aaa;overflow-y:auto;background-color:#fff">
                                <input onclick='document.getElementById("links-shade1").remove(),document.getElementById("links-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"><textarea id=links_prompt rows=30>`+ emailLinks.join('\n') +
                                     `</textarea><input onclick='document.getElementById("links-shade1").remove(),document.getElementById("links-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"></div>`)
                    $("#links_prompt").select(); navigator.clipboard.writeText($("#links_prompt").val());
                })

                if (window.location.href.indexOf("/ge") > -1) {
                    let url_ChangeDiscount = $("input[data-post-uri*='/special_issue/cfp/batch_change_discount']").last().attr('data-post-uri');
                    let url_Invite = url_ChangeDiscount.replace("/restapi/special_issue/cfp/batch_change_discount", "/special_issue/paper_invitations").replace(/\/1$/,"/invite/1");
                    $("input[batch-ajax-url*='paper_invitations/withdraws']").before(`<input value="🚨 Invite" type="button" class="batch-operation-button button batch-invite-btn" batch-ajax-url="${url_Invite}">`);

                }
            }

        } catch (error) { }
    }

    //SI可行性报告
    if (window.location.href.indexOf(".mdpi.com/si/evaluation_checklist_hash/") > -1) {
        try {
            $("#sp_100").children("div").first().prepend(`<div style="padding:10px;background:lightyellow;font-size:12px;">Enter keywords separated by commas, semicolons or linebreaks:<textarea id=s_key></textarea>Operators: [Finder]
        <select id="finder_o" style="display:inline-block; width:auto"><option value="and" selected="selected">And</option><option value="or">Or</option></select> [WoS] <select id="wos_o" style="display:inline-block; width:auto"><option value="AND">And</option>
        <option value="OR" selected="selected">Or</option></select> WoS[SID]: <input type="text" id="wos_sid" style="display:inline-block;width:150px;margin-right:10px;" value="` + GM_getValue("wos_sid", "") + `">
        <button id=s_key_submit class=submit progress=zero style=margin:0>Generate Feasibility Report</button></div>`)

            $("#s_key").val($("#sq_101i").val().replace(" and ", "\n")); $("#s_key_submit").on("click", fc_fill);
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
            $("input[value='Edit']").before(`<input class="submit" type="submit" value="Edit">`).remove();
            if (window.location.href.indexOf("/edit/0") > -1 && S_J > 0) {
                unsafeWindow.$('#form_id_journal').val(S_J).trigger("chosen:updated").trigger("change");
                unsafeWindow.$('#form_type').val(0).trigger("chosen:updated").trigger('change');
                $("input[value='Add']").before(`<input class="submit" type="submit" value="Add">`).remove();
                if (window.location.href.indexOf("/edit/0?") > -1) { $("#form_owner_email").val(window.location.search.split('?')[1]); }
            }
        } catch (error) { }
    }

    //Susy CfP
    if (window.location.href.indexOf("/paper_invitations/") > -1) {
        try {
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

    //特刊网页短链接
    if (window.location.href.indexOf("mdpi.com/journal/") > -1 && window.location.href.indexOf("/special_issues/") > -1 && window.location.href.indexOf("/abstract") == -1 && window.location.href.indexOf("/ge_instructions") == -1 && GM_config.get('LinkShort')) {
        try {
            window.location.href = window.location.href.replace(/\/journal\/(.*)\/special_issues\//, "/si/$1/");
        } catch (error) { }
    }

    //会议相关
    if (window.location.href.indexOf("mdpi.com/user/conference/") > -1 && window.location.href.indexOf("/view") > -1) { try { $("[name=journal_id]").val(S_J); } catch (error) { } }
    if (window.location.href.indexOf("mdpi.com/user/conference/add") > -1) {
        $("#form_conference_organization").val(2).trigger("change"); $("#form_conference_organization_chosen span").text("Societies, Universities or University professors");
        $("[id^=form_checklist]").parent().parent().show(); $("[id^=form_commercial],[id^=form_conference_commercial]").parent().parent().hide(); $("[id^=form_checklist],[id^=form_commercial_checklist]").prop("checked", true);
        if (S_J = 154) { $("#form_subject_id").val(4); $("#form_subject_id_chosen span").text("Computer Science & Mathematics") }
    }
    if (window.location.href.indexOf("mdpi.com/user/send/conference_journal/contact_mail") > -1 && GM_config.get('Con_Template')) {
        try {
            function init() {
                let t1 = skStringToRegex(GM_config.get('Con_TemplateS1')); $("#mailSubject").val($("#mailSubject").val().replace(t1, GM_config.get('Con_TemplateS2')));
                let t2 = skStringToRegex(GM_config.get('Con_TemplateB1')); $("#mailBody").val($("#mailBody").val().replace(t2, GM_config.get('Con_TemplateB2')));
            }
            waitForText(document.querySelector('#mailSubject'), ' ', init);
            $('#mailSubject').parent().after('<div><a id="First_Line">[First Line]</a><br><br><a id="Del_Proceedings">[Del Proceedings]</a></div>');
            $('#First_Line').on("click", function () { $('#mailBody').val("Dear Conference Committee,\nTo Whom It May Concern,\n" + $('#mailBody').val()) });
            $('#Del_Proceedings').on("click", function () { $('#mailBody').val($('#mailBody').val().replace(/\n(.*?)https:\/\/www.mdpi.com\/about\/proceedings(.*?)\n/g, '')) });
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
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/si-planning/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]==&v[status_id][]=13&f[]=cf_10&op[cf_10]==&v[cf_10][]=` + GM_config.get('Journal')
                                     + `&f[]=&c[]=cf_25&c[]=cf_10&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&sort=updated_on%3Adesc&per_page=100'>[CfP]</a>`) // + GM_config.get('Journal')
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/si-committee/issues?c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&f[]=status_id&utf8=%E2%9C%93&v[subject][]=[` + GM_config.get('Journal')
                                     + `&f[]=subject&f[]=&group_by=&op[status_id]=o&op[subject]=%7E&per_page=100&set_filter=1'>[SCfP]</a>`)
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/special-issue-prints/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]=o&f[]=cf_10&op[cf_10]=%3D&v[cf_10][]=` + GM_config.get('Journal')
                                     + `&f[]=&c[]=cf_10&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&sort=updated_on%3Adesc&per_page=100'>[Books]</a>`)
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/feature-paper-invitation/issues?utf8=%E2%9C%93&set_filter=1&f[]=op[status_id]=o&f[]=subject&op[subject]=~&v[subject][]=[` + GM_config.get('Journal')
                                     + `]&f[]=&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on%3Adesc&per_page=100'>[FP]</a>`)
            $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/ethic-committee/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]=o&f[]=subject&op[subject]=%7E&v[subject][]=` + GM_config.get('Journal')
                                     + `]&f[]=&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&group_by=&per_page=100'>[EC]</a>`)
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
            $("head").append('<link rel="stylesheet" type="text/css" href="/assets/application-3f4ae7647a4464beb61368778f76d00684da5f6d4b0490fcb3a33e4b350c8bd6.css">');
            $("head").append(`<style>table{width:80%}.colorgray{color:gray!important}.bgcoloref{background:#efefef!important}#user-info .user-info-section{margin-bottom:10px}#user-info span.email{font-weight:400;color:#103247}#user-info span.number{font-weight:400;color:#123}
                    #user-info a{color:#00f}#user-info a:visited{color:#cd7e53}#user-info a:hover{color:#47566d}#user-info table{margin-left:2%;width:98%;background:#99a4b5;margin-bottom:10px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;font-size:14px}
                    #user-info table tr th{text-align:left;background:#4f5671;color:#fefefe;font-weight:400;border-left:1px solid #ccc;border-top:1px solid #ccc;padding:.2rem}#user-info table tr td{border-left:1px solid #ccc;border-top:1px solid #ccc;padding:.2rem;
                    background:#fefefe} #user-info table tr td span.msid{color:#4e6c88;font-weight:400}#user-info table tr td.title{width:50%}#user-info table tr td.journal{width:10%;text-align:center}#user-info table tr td.status{width:10%;text-align:center}
                    #user-info table tr td.submission-date{width:10%;text-align:center}#user-info table tr td.invoice-info{width:10%;text-align:center}#user-info table tr td.invoice-payment-info{width:10%;text-align:center}</style>`);
            document.body.innerHTML = document.body.innerHTML.replace(/ data-url=/g, ' href=').replace(/ data-load-url=/g, ' href=');
            var mailsdb_email = window.location.href.match(/search_content=(\S*)/)[1], susycheck;

            if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(mailsdb_email)) {
                $("body").prepend(`<div style='margin:10px;'><div id='d1'>Loading Invitation Record...</div><a class='scroll-icon'>⬇️ ⬇️ ⬇️ ⬇️ ⬇️</a><div id='d2'>Loading Overview...</div><a class='scroll-icon'>⬇️ ⬇️ ⬇️ ⬇️ ⬇️</a>
            <div id='d3'>Loading Review History...</div><a class='scroll-icon'>⬇️ ⬇️ ⬇️ ⬇️ ⬇️</a><div>`);
                $('.scroll-icon').on("click", function () {
                    let currentIndex = $('.scroll-icon').index(this);
                    let nextIcon = $('.scroll-icon').eq(currentIndex + 1);
                    if (nextIcon.length > 0) { $('html, body').animate({ scrollTop: nextIcon.offset().top }, 300); }
                    else { $('html, body').animate({ scrollTop: $(document).height() }, 300); }
                });

                susycheck = "https://susy.mdpi.com/user/info?emails=" + mailsdb_email;
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: susycheck,
                    onload: function (responseDetails) {
                        var $jQueryObject = $($.parseHTML(responseDetails.responseText.replace(/href="\//g, "href=\"//susy.mdpi.com/").replace(/ data-url=/g, ' href=').replace(/ data-load-url=/g, ' href=').replace(/<h1>[\s\S]*<\/h1>/g, '')));
                        $("#d2").html($jQueryObject);
                        $("[title='Generate unsubscribe link']").each(function () {
                            $(this).attr("href", "//scholar.google.com/scholar?hl=en&q=" + $(this).attr('data-email')).attr("target", "_blank").text("").append('<img width="20px" height="20px" src="//www.google.com/favicon.ico">')
                        });
                        $("a:contains('Edit Reviewer')").each(function () {
                            let full_name = $(this).prev("b").text(), first_name = full_name.split(" ")[0], last_name = full_name.split(" ").pop();
                            $(this).after(` <a href="//susy.mdpi.com/user/reviewer/checking/a5ce29b8b4917729fc1dc44abf2fc686?email=` + $("[title='Generate unsubscribe link']").attr('data-email') + `" target="_blank">
                        <img width=20px height=20px src="//susy.mdpi.com/build/img/design/susy-logo.png"></a> <a href="//scholar.google.com/scholar?hl=en&q=` + full_name + `" target=_blank><img width=20px height=20px src="//www.google.com/favicon.ico"></a>
                                       <a href="//www.scopus.com/results/authorNamesList.uri?st2=` + first_name + `&st1=` + last_name + `" target=_blank><img src=${icon_scopus}></a>`);
                        });

                        if ($jQueryObject.find("a:contains('Edit Reviewer')").length) {
                            let ReviewerHistory = $jQueryObject.find("a:contains('Edit Reviewer')").attr("href").replace('//susy.mdpi.com/reivewer/managment/edit', 'https://susy.mdpi.com/list/reviewer/invitations-history');
                            $jQueryObject.find("a:contains('Edit Reviewer')").parent().find('td').each(function () {
                                let ranking = skGetUniv($(this).text().trim());
                                if (ranking.color) {
                                    if (!$('#tooltipster-style').length) { addCssTooltipster() }
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

                susycheck = "https://susy.mdpi.com/user/guest_editor/check?email=" + mailsdb_email + "&special_issue_id=1139163";
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: susycheck,
                    onload: function (responseDetails) {
                        var $jQueryObject = $($.parseHTML(responseDetails.responseText.replace(/data-load-url="\/user/g, 'data-load-url="//susy.mdpi.com/user')));
                        $("#d1").html($jQueryObject);
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
            function getUrlParam(name) { var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.slice(1).match(reg); if (r != null) { return decodeURI(r[2]); } return null; }
            $(".morphNotes").first().before(" <a href='https://scholar.google.com/scholar?hl=en&q=" + getUrlParam('email') + "'><img style='vertical-align: middle;' width=20px height=20px src='https://www.google.com/favicon.ico'></a> ");
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

    //Hidden_Func: MRS ALL journals
    if (window.location.href.indexOf("//mrs.mdpi.com/data/role/") > -1 && GM_config.get('Hidden_Func')) {
        try {
            $('#demo-form2').before(` <a onclick='$("#journal > option")[0].value="250,77,145,362,13,524,534,341,456,390,90,480,517,491,523,35,118,471,323,47,82,346,67,427,240,103,515,299,305,143,487,531,441,123,26,214,440,467,213,176,416,259,428,385,356,142,151,`
                                    + `84,404,306,397,127,449,7,402,5,412,83,509,192,301,42,492,275,395,19,460,53,25,413,409,453,79,474,481,163,50,225,215,148,221,355,203,499,37,51,435,170,290,49,432,199,14,407,231,154,81,92,59,522,465,438,314,457,365,359,360,444,`
                                    + `165,419,511,358,436,271,353,16,252,114,162,130,206,246,3,233,265,528,518,414,173,296,466,294,15,376,44,131,417,150,276,133,228,291,269,36,504";'>[All Journal]</a>`);
        } catch (error) { }
    }

    //Hidden_Func: PSAN Redirect
    if (window.location.href == 'https://admin.mdpi.com/' && GM_config.get('Hidden_Func')) { try { window.location.href = 'https://admin.mdpi.com/tools/email-purger/email-list' } catch (error) { } }

    //PSAN Journal
    if (window.location.href.indexOf("admin.mdpi.com/tools/email-purger/") > -1) {
        try {
            $('#ExcelMailPurgerEmailList_full_name,#ExcelMailPurgerEmailList_exclude_cfr').prop('checked', false);
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
                        $(this).append(`<a href="/tap/change_user/${tap_id}" data-url="/tap/change_user/${tap_id}" class="ajax-form-submit-btn"><img src="${icon_pencil}" title="Assign to another Editor"></a>`);
                    }
                });
            }
            if (emailColumnIndex) {
                $("tr td.user_box_item:nth-child(" + emailColumnIndex + ")").each(function () {
                    let tap_email = $(this).text().trim();
                    $(this).append(` <a href="https://mailsdb.i.mdpi.com/reversion/search/emails?fm=true&cc=true&to=true&m_type=&sort=desc&link=true&bcc=true&search_content=${tap_email}" target=_blank><img src="${icon_magnifier}"></a>`);
                });
            }
        } catch (error) { }
    }

    //     //Hidden_Func: Remind 2nd Round Reviewer
    //     if (window.location.href.indexOf("assigned/remind_reviewer") > -1 && GM_config.get('Hidden_Func')){try{
    //         $('#emailTemplates').val(21).trigger("change"); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change'));
    //     } catch (error){ }}

    //Always: MRS Chosen
    if (window.location.href.indexOf("//mrs.mdpi.com/statistics") > -1) {
        try {
            let styleElement = document.createElement("style");
            styleElement.innerHTML = `.chosen-container{position:relative;display:inline-block;vertical-align:middle;font-size:13px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.chosen-container *{-webkit-box-sizing:border-box;
        box-sizing:border-box}.chosen-container .chosen-drop{position:absolute;top:100%;z-index:1010;width:100%;border:1px solid #aaa;border-top:0;background:#fff;-webkit-box-shadow:0 4px 5px rgba(0,0,0,.15);box-shadow:0 4px 5px rgba(0,0,0,.15);clip:rect(0,0,0,0);
        -webkit-clip-path:inset(100% 100%);clip-path:inset(100% 100%)}.chosen-container.chosen-with-drop .chosen-drop{clip:auto;-webkit-clip-path:none;clip-path:none}.chosen-container a{cursor:pointer}.chosen-container .chosen-single .group-name,.chosen-container
        .search-choice .group-name{margin-right:4px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:400;color:#999}.chosen-container .chosen-single .group-name:after,.chosen-container .search-choice .group-name:after{content:":";padding-left:
        2px;vertical-align:top}.chosen-container-single .chosen-single{position:relative;display:block;overflow:hidden;padding:0 0 0 8px;height:25px;border:1px solid #aaa;border-radius:5px;background-color:#fff;background:-webkit-gradient(linear,left top,left bottom,
        color-stop(20%,#fff),color-stop(50%,#f6f6f6),color-stop(52%,#eee),to(#f4f4f4));background:linear-gradient(#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-clip:padding-box;-webkit-box-shadow:0 0 3px #fff inset,0 1px 1px rgba(0,0,0,.1);box-shadow:
        0 0 3px #fff inset,0 1px 1px rgba(0,0,0,.1);color:#444;text-decoration:none;white-space:nowrap;line-height:24px}.chosen-container-single .chosen-default{color:#999}.chosen-container-single .chosen-single span{display:block;overflow:hidden;margin-right:26px;
        text-overflow:ellipsis;white-space:nowrap}.chosen-container-single .chosen-single-with-deselect span{margin-right:38px}.chosen-container-single .chosen-single abbr{position:absolute;top:6px;right:26px;display:block;width:12px;height:12px;background:url(
        chosen-sprite.png) -42px 1px no-repeat;font-size:1px}.chosen-container-single .chosen-single abbr:hover{background-position:-42px -10px}.chosen-container-single.chosen-disabled .chosen-single abbr:hover{background-position:-42px -10px}.chosen-container-single
        .chosen-single div{position:absolute;top:0;right:0;display:block;width:18px;height:100%}.chosen-container-single .chosen-single div b{display:block;width:100%;height:100%;background:url(chosen-sprite.png) no-repeat 0 2px}.chosen-container-single
        .chosen-search{position:relative;z-index:1010;margin:0;padding:3px 4px;white-space:nowrap}.chosen-container-single .chosen-search input[type=text]{margin:1px 0;padding:4px 20px 4px 5px;width:100%;height:auto;outline:0;border:1px solid #aaa;
        background:url(chosen-sprite.png) no-repeat 100% -20px;font-size:1em;font-family:sans-serif;line-height:normal;border-radius:0}.chosen-container-single .chosen-drop{margin-top:-1px;border-radius:0 0 4px 4px;background-clip:padding-box}
        .chosen-container-single.chosen-container-single-nosearch .chosen-search{position:absolute;clip:rect(0,0,0,0);-webkit-clip-path:inset(100% 100%);clip-path:inset(100% 100%)}.chosen-container .chosen-results{color:#444;position:relative;overflow-x:hidden;
        overflow-y:auto;margin:0 4px 4px 0;padding:0 0 0 4px;max-height:65vh;-webkit-overflow-scrolling:touch}.chosen-container .chosen-results li{display:none;margin:0;padding:5px 6px;list-style:none;line-height:15px;word-wrap:break-word;-webkit-touch-callout:none}
        .chosen-container .chosen-results li.active-result{display:list-item;cursor:pointer}.chosen-container .chosen-results li.disabled-result{display:list-item;color:#ccc;cursor:default}.chosen-container .chosen-results li.highlighted{background-color:#3875d7;
        background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#3875d7),color-stop(90%,#2a62bc));background-image:linear-gradient(#3875d7 20%,#2a62bc 90%);color:#fff}.chosen-container .chosen-results li.no-results{color:#777;display:list-item;
        background:#f4f4f4}.chosen-container .chosen-results li.group-result{display:list-item;font-weight:700;cursor:default}.chosen-container .chosen-results li.group-option{padding-left:15px}.chosen-container .chosen-results li em{font-style:normal;
        text-decoration:underline}.chosen-container-multi .chosen-choices{position:relative;overflow:hidden;margin:0;padding:0 5px;width:100%;height:auto;border:1px solid #aaa;background-color:#fff;background-image:-webkit-gradient(linear,left top,left bottom,
        color-stop(1%,#eee),color-stop(15%,#fff));background-image:linear-gradient(#eee 1%,#fff 15%);cursor:text}.chosen-container-multi .chosen-choices li{float:left;list-style:none}.chosen-container-multi .chosen-choices li.search-field{margin:0;padding:0;
        white-space:nowrap}.chosen-container-multi .chosen-choices li.search-field input[type=text]{margin:1px 0;padding:0;height:25px;outline:0;border:0!important;background:0 0!important;-webkit-box-shadow:none;box-shadow:none;color:#999;font-size:100%;
        font-family:sans-serif;line-height:normal;border-radius:0;width:25px}.chosen-container-multi .chosen-choices li.search-choice{position:relative;margin:3px 5px 3px 0;padding:3px 20px 3px 5px;border:1px solid #aaa;max-width:100%;border-radius:3px;
        background-color:#eee;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),to(#eee));background-image:linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);
        background-size:100% 19px;background-repeat:repeat-x;background-clip:padding-box;-webkit-box-shadow:0 0 2px #fff inset,0 1px 0 rgba(0,0,0,.05);box-shadow:0 0 2px #fff inset,0 1px 0 rgba(0,0,0,.05);color:#333;line-height:13px;cursor:default}
        .chosen-container-multi .chosen-choices li.search-choice span{word-wrap:break-word}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close{position:absolute;top:4px;right:3px;display:block;width:12px;height:12px;
        background:url(chosen-sprite.png) -42px 1px no-repeat;font-size:1px}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close:hover{background-position:-42px -10px}.chosen-container-multi .chosen-choices li.search-choice-disabled
        {padding-right:5px;border:1px solid #ccc;background-color:#e4e4e4;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),to(#eee));background-image:linear-gradient
        (#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);color:#666}.chosen-container-multi .chosen-choices li.search-choice-focus{background:#d4d4d4}.chosen-container-multi .chosen-choices li.search-choice-focus .search-choice-close{background-position:-42px -10px}
        .chosen-container-multi .chosen-results{margin:0;padding:0}.chosen-container-multi .chosen-drop .result-selected{display:list-item;color:#ccc;cursor:default}.chosen-container-active .chosen-single{border:1px solid #5897fb;-webkit-box-shadow:0 0 5px
        rgba(0,0,0,.3);box-shadow:0 0 5px rgba(0,0,0,.3)}.chosen-container-active.chosen-with-drop .chosen-single{border:1px solid #aaa;border-bottom-right-radius:0;border-bottom-left-radius:0;background-image:-webkit-gradient(linear,left top,left bottom,
        color-stop(20%,#eee),color-stop(80%,#fff));background-image:linear-gradient(#eee 20%,#fff 80%);-webkit-box-shadow:0 1px 0 #fff inset;box-shadow:0 1px 0 #fff inset}.chosen-container-active.chosen-with-drop .chosen-single div{border-left:none;background:0 0}
        .chosen-container-active.chosen-with-drop .chosen-single div b{background-position:-18px 2px}.chosen-container-active .chosen-choices{border:1px solid #5897fb;-webkit-box-shadow:0 0 5px rgba(0,0,0,.3);box-shadow:0 0 5px rgba(0,0,0,.3)}.chosen-container-active
        .chosen-choices li.search-field input[type=text]{color:#222!important}.chosen-disabled{opacity:.5!important;cursor:default}.chosen-disabled .chosen-single{cursor:default}.chosen-disabled .chosen-choices .search-choice .search-choice-close{cursor:default}
        .chosen-rtl{text-align:right}.chosen-rtl .chosen-single{overflow:visible;padding:0 8px 0 0}.chosen-rtl .chosen-single span{margin-right:0;margin-left:26px;direction:rtl}.chosen-rtl .chosen-single-with-deselect span{margin-left:38px}.chosen-rtl
        .chosen-single div{right:auto;left:3px}.chosen-rtl .chosen-single abbr{right:auto;left:26px}.chosen-rtl .chosen-choices li{float:right}.chosen-rtl .chosen-choices li.search-field input[type=text]{direction:rtl}.chosen-rtl .chosen-choices
        li.search-choice{margin:3px 5px 3px 0;padding:3px 5px 3px 19px}.chosen-rtl .chosen-choices li.search-choice .search-choice-close{right:auto;left:4px}.chosen-rtl.chosen-container-single .chosen-results{margin:0 0 4px 4px;padding:0 4px 0 0}.chosen-rtl
        .chosen-results li.group-option{padding-right:15px;padding-left:0}.chosen-rtl.chosen-container-active.chosen-with-drop .chosen-single div{border-right:none}.chosen-rtl .chosen-search input[type=text]{padding:4px 5px 4px 20px;background:url(chosen-sprite.png)
        no-repeat -30px -20px;direction:rtl}.chosen-rtl.chosen-container-single .chosen-single div b{background-position:6px 2px}.chosen-rtl.chosen-container-single.chosen-with-drop .chosen-single div b{background-position:-12px 2px}@media only screen and
        (-webkit-min-device-pixel-ratio:1.5),only screen and (min-resolution:144dpi),only screen and (min-resolution:1.5dppx){.chosen-container .chosen-results-scroll-down span,.chosen-container .chosen-results-scroll-up span,.chosen-container-multi .chosen-choices
        .search-choice .search-choice-close,.chosen-container-single .chosen-search input[type=text],.chosen-container-single .chosen-single abbr,.chosen-container-single .chosen-single div b,.chosen-rtl .chosen-search input[type=text]{background-image:
        url(chosen-sprite@2x.png)!important;background-size:52px 37px!important;background-repeat:no-repeat!important}}`;
            document.head.appendChild(styleElement);

            function toggleChosen() {
                if ($("#statisticSelecter").css("display") === "none") {
                    unsafeWindow.$(document.getElementById('statisticSelecter')).chosen("destroy"); $("#statistic").css('overflow', 'auto');
                } else {
                    let xhr = new XMLHttpRequest;
                    xhr.open('get', 'https://raw.githubusercontent.com/synalocey/SusyModifier/master/chosen.jquery.js', true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                                var script = document.createElement('script');
                                script.type = 'text/javascript'; script.text = xhr.responseText; document.body.appendChild(script);
                                unsafeWindow.$(document.getElementById('statisticSelecter')).chosen();
                                $("#statistic").css('overflow', 'visible'); $(".chosen-single").css("width", "240px");
                            }
                        }
                    };
                    xhr.send(null);
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
                const checkboxes = [
                    { id: '555', label: 'Analytics' },
                    { id: '25', label: 'Games' },
                    { id: '599', label: 'Geometry' },
                    { id: '154', label: 'Mathematics' },
                    { id: '162', label: 'Risks' },
                    { id: '598', label: 'IJT' },
                    { id: '276', label: 'Telecom' },
                ];
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

    //Always: Volunteer Reviewer
    if (window.location.href.indexOf("/volunteer_reviewer_info/view/") > -1) {
        try {
            $("button:contains('Accept')").attr("onclick", "window.location.href='/volunteer_reviewer_info/operate/" + location.href.split('/view/')[1] + "/accept'");
            $("button:contains('Reject')").attr("onclick", "window.location.href='/volunteer_reviewer_info/operate/" + location.href.split('/view/')[1] + "/reject'");
            $("div.small-12.large-2:contains('Email')").next().append(`<a href="//scholar.google.com/scholar?hl=en&q=` + $("div.small-12.large-2:contains('Email')").next().text().trim() + `" target=_blank><img src="/bundles/mdpisusy/img/design/google_logo.png"></a>`)
                .append(` <a href="//mailsdb.i.mdpi.com/reversion/search/emails?fm=true&cc=true&to=true&m_type=&sort=desc&link=true&bcc=true&search_content=` + $("div.small-12.large-2:contains('Email')").next().text().trim() + `" target=_blank>[Mailsdb]</a>`)
            $("div.small-12.large-2:contains('First name')").next().append(`<a href="//www.scopus.com/results/authorNamesList.uri?st2=` + $("div.small-12.large-2:contains('First name')").next().text().trim() + `&st1=`
                                                                           + $("div.small-12.large-2:contains('Last name')").next().text().trim() + `" target=_blank><img src="//www.scopus.com/static/proteus-images/favicon.ico" width=16px height=16px></a>`)
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
            $("div.cell.small-12.medium-6.large-2:contains('Manuscript ID')").next().append(`<a href="/user/assigned/process_form/` + $("a:contains('Download Manuscript')").attr("href").match("displayFile/(.*?)(/|$)")[1] + `">[Back to Manuscript]</a>`)
        } catch (error) { }
    }

    //Always: 自动填写签名
    if (window.location.href.indexOf("special_issue/eic_decision/") + window.location.href.indexOf("special_issue/si_decision/") > -2) {
        try {
            let str = $("#topmenu span:contains('@mdpi.com')").text().replace("@mdpi.com", "").replace(".", " ");
            let sk_signature = str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            $("#form_signature").val(sk_signature);
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
            addCssTooltipster();
            $("td").each(function () {
                let ranking = skGetUniv($(this).text().trim());
                if (ranking.color) {
                    $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                        .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                }
            });
        } catch (error) { }
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
                           "p-adic numbers ultrametric analysis and applications","engineering optimization","annales henri poincare","computer physics communications","quantum information processing","decisions in economics and finance","journal of time series econometrics",
                           "monte carlo methods and applications","advances in data analysis and classification","astin bulletin-the journal of the international actuarial association","bayesian analysis","journal of multivariate analysis","journal of time series analysis",
                           "lifetime data analysis","markov process","random matrices","scandinavian actuarial journal"];
            var geometry_j = ["geometr", "fractal", "manifold"];
            var maths_regex = new RegExp("(" + maths_j.join("|") + ")", "i");
            var geometry_regex = new RegExp("(" + geometry_j.join("|") + ")", "i");
            if (window.location.hostname.indexOf("scopus") > -1) {
                waitForKeyElements("div[data-component='document-source'],div[data-testid='author-list']+span", function () {
                    mark_journals();
                    $('span[data-testid="authorInstitution"]').each(function () {
                        let ranking = skGetUniv($(this).text().trim());
                        if (ranking.color) {
                            if (!$('#tooltipster-style').length) { addCssTooltipster() }
                            $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                                .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                        }
                    });
                }, true);
            } else { //Google Scholar
                mark_journals();
                $("#gsc_bpf_more").on("click", function () {
                    let targetNode = document.querySelector('#gsc_a_nn')
                    let observer = new MutationObserver(function () { mark_journals() });
                    observer.observe(targetNode, { characterData: true, childList: true, subtree: true });
                })
                $("div.gsc_prf_il").each(function () {
                    let ranking = skGetUniv($(this).text().trim());
                    if (ranking.color) {
                        if (!$('#tooltipster-style').length) { addCssTooltipster() }
                        $(this).css("background-color", ranking.color).attr("title", ranking.detail.replace(/^<br\s*\/?>/i, ''))
                            .tooltipster({ functionInit: function (instance, helper) { var content = $(helper.origin).attr('title'); instance.content(content); }, contentAsHTML: true, theme: 'tooltipster-noir' });
                    }
                });
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
    if (window.location.href.indexOf("managing/status/submitted") + window.location.href.indexOf("sme/status/submitted") > -2 && GM_config.get('Assign_Assistant')) {
        try {
            $("#show_title").parent().append("<input type='button' id='send_ith' value='Send iThenticate in OneClick'>")
            $("#send_ith").on("click", function () {
                if (confirm("I will send ALL manuscripts in this page to iThenticate!") == true) {
                    $("a:contains('math')[href*='/process_form/'],a:contains('games')[href*='/process_form/'],a:contains('children')[href*='/process_form/'],a:contains('geometry')[href*='/process_form/']").each(function () { chk_ith($(this).attr('href'), $(this).text()) });
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
                $(this).append("<a class='sk_reject' style='font-style:italic' href='//susy.mdpi.com/user/assigned/reject-manuscript/" + $(this).parents("tr").find("td:nth-child(4) >> a").attr("href").split("/").pop() + "'>[Reject]</a>");
            });
            $(".sk_reject").on('mouseup', function (e) {
                switch (e.which) {
                    case 3: // Right click.
                        if (confirm('The paper will be rejected immediately using "without Peer Review Template"')) { GM_openInTab($(this).attr("href") + "?quickreject", 1); $(this).parent().html("[Rejected]"); }
                        return;
                }; return true;
            });
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

    //ManuscriptFunc: 文章页面加[Linkedin]
    if (window.location.href.indexOf("www.mdpi.com/2227-7390/") > -1 && GM_config.get('ManuscriptFunc')) {
        try {
            $("a:contains('Peer-Reviewed')").parent().after('<a id="s_linkedin" href="' + $("a:contains('Peer-Reviewed')").attr("href") + '?linkedin"><img src="https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a"></a>');
            $("#s_linkedin").on("click", function () { $("#container").after(`<div class="ui-widget-overlay ui-front" style="background: #aaaaaa;opacity: .5;filter: Alpha(Opacity=50);position: fixed;top: 0;left: 0;width: 100%;height: 100%;"></div>`) });
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
            $("._removeEmail:contains('x')").text(" x");
            $('head').append(
                `<style>.ms-edit:before, .ms-note:before, .ms-note-add:before, .ms-mail:before{content: ''; display: inline-block; height: 16px; width: 16px; position: relative; top: -2px; background-size: contain;}
            .ms-edit:before{background: url('${icon_pencil}') no-repeat center center;}
            .ms-note:before{background: url('${icon_note}') no-repeat center center;}
            .ms-note-add:before{background: url('${icon_note_add}') no-repeat center center;}
            .ms-mail:before{background: url('${icon_mail}') no-repeat center center;} </style>`);
            waitForKeyElements("#intercom-frame", function () { $('.intercom-lightweight-app,#intercom-frame').remove(); }, true);
        } catch (error) { }
    }

    // Scopus Hidden Func
    if (window.location.hostname.indexOf("scopus.com") > -1 && GM_config.get('Hidden_Func')) {
        try {
            if (window.location.href.indexOf("/results/authorListResults.uri?") + window.location.href.indexOf("/results/coAuthorResults.uri?") > -2) {
                $("h1.documentHeader").append(" <a href='#' id='scopus_list'> [Export CSV]</a>");
                $("#scopus_list").on("click", function () {
                    var csvContent = "";
                    $('#srchResultsList tbody tr.searchArea').each(function () {
                        var authorName = $(this).find('.authorResultsNamesCol a').text().trim();
                        var authorId = $(this).find('.authorResultsNamesCol a').attr('href').match(/authorId=(\d+)/)[1];
                        var affiliation = $(this).find('.dataCol5').text().trim();
                        var country = $(this).find('.dataCol7').text().trim();
                        var hIndex = $(this).find('.dataCol4').text().trim();
                        var documents = $(this).find('.dataCol3').text().trim();

                        var line = [authorId, authorName, affiliation, country, hIndex, documents].join("\t");
                        csvContent += line + "\n";
                    });

                    $("body").append(`<div class="blockUI blockOverlay" id="csv-shade" style="z-index: 1000; border: none; margin: 0; padding: 0; width: 100%; height: 100%; top: 0; left: 0; background-color: #000; opacity: 0.6; cursor: wait; position: fixed;"></div>
                <div class="blockUI blockMsg blockPage" id="csv-popup" style="z-index: 1011; position: fixed; padding: 0; margin: 0; width: 50%; top: 25%; left: 25%; text-align: center; color: #000; border: 3px solid #aaa; background-color: #fff; overflow-y: auto;">
                <input type="button" value="Close" onclick="document.getElementById('csv-shade').remove(); document.getElementById('csv-popup').remove();" style="margin: 10px; padding: 5px 20px;">
                <textarea id="csv_content" readonly rows="30" style="width: 90%;">${csvContent}</textarea></div>`);

                    var textarea = document.getElementById("csv_content");
                    textarea.select();
                    navigator.clipboard.writeText(textarea.value);
                })
            }
            if (window.location.href.indexOf("/record/display.uri?eid=") > -1) {
                waitForKeyElements('div[data-testid="author-list"]', mark_emais, true);
                function mark_emais() {
                    $('div[data-testid="author-list"] a[href^="mailto"]').each(function () {
                        var scopus_email = $(this).attr('href').split('mailto:')[1];
                        var scopus_name = $(this).prevAll('button').first().text();
                        $("#recordPageBoxes").before(`<b>${scopus_name}</b>&emsp;<a href="//mailsdb.i.mdpi.com/reversion/search/emails?fm=true&cc=true&to=true&m_type=&sort=desc&link=true&bcc=true&search_content=${scopus_email}" target=_blank>${scopus_email}</a><br>`);
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

    console.timeEnd("test")
}

//---------------------------------------------------------------------------------------------------------------------------Functions-------------------------------------------------------------------------------------------------------------------------

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
    let interval = window.setInterval(test, freq || 300); if (!element || !callback || typeof text !== 'string') { throw new TypeError('Bad value'); }
    function test() {
        if (!element.parentNode) { window.clearInterval(interval); }
        if (element.value.indexOf(text) > -1) { window.clearInterval(interval); callback.call(element); }
    }
}

function skGMFetchGet(url) { return new Promise(resolve => { GM_xmlhttpRequest({ method: "GET", url: url, onload: resolve }); }) };
function skStringToRegex(str) { if (str.startsWith("[Regex]")) { return RegExp(str.substring(7), "g"); } else { return str } };
function skStringToFunction(str) { if (str.indexOf("function ") == 0) { let funcTest = new Function('return ' + str); return funcTest(); } else { return str } };
function skSidebarSize() {
    $(".note-list-container").css("padding", "0"); $(".note-box-component").css("margin-bottom", "10px");
    if ($(".section-note-box .manuscript-note-item-content").height() || 0 > 200) { $(".section-note-box .manuscript-note-item-content").height(200).css("overflow-y", "auto") }
    if ($(".apc-container .manuscript-note-item-content").height() || 0 > 200) { $(".apc-container .manuscript-note-item-content").height(200).css("overflow-y", "auto") }
    if ($('.special-issue-note-box').length > 1) { $(".special-issue-note-box .manuscript-add-note-form").slice(1).prop("rows", 22) }
    else if ($('.special-issue-note-box').length > 0) { $(".manuscript-note-box .manuscript-note-item-content").height(200).css("overflow-y", "auto") }
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

function skGetJid(sysname) {const journalMap = [
    {id:"250",j:"acoustics"},{id:"77",j:"actuators"},{id:"88",j:"admsci"},{id:"437",j:"adolescents"},{id:"573",j:"arm"},{id:"145",j:"aerospace"},{id:"95",j:"agriculture"},{id:"336",j:"agriengineering"},{id:"554",j:"agrochemicals"},{id:"34",j:"agronomy"},
    {id:"557",j:"air"},{id:"13",j:"algorithms"},{id:"210",j:"allergies"},{id:"524",j:"alloys"},{id:"285",j:"analytica"},{id:"555",j:"analytics"},{id:"552",j:"anatomia"},{id:"570",j:"anesthesia"},{id:"74",j:"animals"},{id:"116",j:"antibiotics"},{id:"40",j:"antibodies"},
    {id:"75",j:"antioxidants"},{id:"534",j:"applbiosci"},{id:"341",j:"applmech"},{id:"456",j:"applmicrobiol"},{id:"390",j:"applnano"},{id:"90",j:"applsci"},{id:"302",j:"asi"},{id:"480",j:"appliedchem"},{id:"517",j:"appliedmath"},{id:"335",j:"aquacj"},
    {id:"491",j:"architecture"},{id:"78",j:"arts"},{id:"523",j:"astronomy"},{id:"35",j:"atmosphere"},{id:"118",j:"atoms"},{id:"471",j:"audiolres"},{id:"323",j:"automation"},{id:"47",j:"axioms"},{id:"496",j:"bacteria"},{id:"201",j:"batteries"},{id:"82",j:"behavsci"},
    {id:"174",j:"beverages"},{id:"245",j:"BDCC"},{id:"459",j:"biochem"},{id:"175",j:"bioengineering"},{id:"420",j:"biologics"},{id:"120",j:"biology"},{id:"510",j:"blsf"},{id:"494",j:"biomass"},{id:"458",j:"biomechanics"},{id:"477",j:"biomed"},{id:"158",j:"biomedicines"},
    {id:"410",j:"biomedinformatics"},{id:"208",j:"biomimetics"},{id:"111",j:"biomolecules"},{id:"346",j:"biophysica"},{id:"108",j:"biosensors"},{id:"462",j:"biotech"},{id:"415",j:"birds"},{id:"91",j:"brainsci"},{id:"67",j:"buildings"},{id:"427",j:"businesses"},
    {id:"195",j:"carbon"},{id:"23",j:"cancers"},{id:"473",j:"cardiogenetics"},{id:"27",j:"catalysts"},{id:"32",j:"cells"},{id:"240",j:"ceramics"},{id:"103",j:"challenges"},{id:"155",j:"ChemEngineering"},{id:"350",j:"chemistry"},{id:"406",j:"chemproc"},
    {id:"161",j:"chemosensors"},{id:"159",j:"children"},{id:"515",j:"chips"},{id:"299",j:"civileng"},{id:"305",j:"cleantechnol"},{id:"143",j:"climate"},{id:"495",j:"ctn"},{id:"482",j:"clinpract"},{id:"487",j:"coasts"},{id:"107",j:"coatings"},{id:"288",j:"clockssleep"},
    {id:"253",j:"colloids"},{id:"501",j:"colorants"},{id:"531",j:"commodities"},{id:"441",j:"compounds"},{id:"123",j:"computation"},{id:"543",j:"csmf"},{id:"26",j:"computers"},{id:"214",j:"condensedmatter"},{id:"440",j:"conservation"},{id:"467",j:"constrmater"},
    {id:"125",j:"cosmetics"},{id:"493",j:"covid"},{id:"451",j:"crops"},{id:"213",j:"cryptography"},{id:"28",j:"crystals"},{id:"497",j:"cimb"},{id:"476",j:"curroncol"},{id:"289",j:"dairy"},{id:"176",j:"data"},{id:"144",j:"dentistry"},{id:"396",j:"dermato"},
    {id:"400",j:"dermatopathology"},{id:"227",j:"designs"},{id:"572",j:"devices"},{id:"389",j:"diabetology"},{id:"41",j:"diagnostics"},{id:"520",j:"dietetics"},{id:"416",j:"digital"},{id:"426",j:"disabilities"},{id:"126",j:"diseases"},{id:"17",j:"diversity"},
    {id:"450",j:"dna"},{id:"259",j:"drones"},{id:"575",j:"ddc"},{id:"428",j:"dynamics"},{id:"385",j:"earth"},{id:"356",j:"ecologies"},{id:"142",j:"econometrics"},{id:"151",j:"economies"},{id:"84",j:"education"},{id:"404",j:"electricity"},{id:"306",j:"electrochem"},
    {id:"397",j:"electronicmat"},{id:"127",j:"electronics"},{id:"449",j:"encyclopedia"},{id:"386",j:"endocrines"},{id:"7",j:"energies"},{id:"391",j:"eng"},{id:"402",j:"engproc"},{id:"533",j:"entomology"},{id:"5",j:"entropy"},{id:"412",j:"environsciproc"},
    {id:"83",j:"environments"},{id:"388",j:"epidemiologia"},{id:"198",j:"epigenomes"},{id:"468",j:"ebj"},{id:"361",j:"ejihpe"},{id:"196",j:"fermentation"},{id:"128",j:"fibers"},{id:"509",j:"fintech"},{id:"319",j:"fire"},{id:"212",j:"fishes"},{id:"192",j:"fluids"},
    {id:"169",j:"foods"},{id:"301",j:"forecasting"},{id:"443",j:"forensicsci"},{id:"42",j:"forests"},{id:"492",j:"foundations"},{id:"275",j:"fractalfract"},{id:"395",j:"fuels"},{id:"571",j:"future"},{id:"19",j:"futureinternet"},{id:"448",j:"futurepharmacol"},
    {id:"460",j:"futuretransp"},{id:"53",j:"galaxies"},{id:"25",j:"games"},{id:"413",j:"gases"},{id:"434",j:"gastroent"},{id:"255",j:"gastrointestdisord"},{id:"191",j:"gels"},{id:"209",j:"genealogy"},{id:"31",j:"genes"},{id:"409",j:"geographies"},{id:"347",j:"geohazards"},
    {id:"453",j:"geomatics"},{id:"79",j:"geosciences"},{id:"474",j:"geotechnics"},{id:"179",j:"geriatrics"},{id:"556",j:"grasses"},{id:"157",j:"healthcare"},{id:"379",j:"hearts"},{id:"464",j:"hemato"},{id:"559",j:"hematolrep"},{id:"320",j:"heritage"},
    {id:"205",j:"histories"},{id:"197",j:"horticulturae"},{id:"63",j:"humanities"},{id:"481",j:"humans"},{id:"514",j:"hydrobiology"},{id:"382",j:"hydrogen"},{id:"177",j:"hydrology"},{id:"439",j:"hygiene"},{id:"381",j:"immuno"},{id:"469",j:"idr"},{id:"163",j:"informatics"},
    {id:"50",j:"information"},{id:"225",j:"infrastructures"},{id:"167",j:"inorganics"},{id:"54",j:"insects"},{id:"215",j:"instruments"},{id:"6",j:"ijerph"},{id:"148",j:"ijfs"},{id:"2",j:"ijms"},{id:"211",j:"IJNS"},{id:"558",j:"ijpb"},{id:"423",j:"ijtm"},
    {id:"564",j:"ime"},{id:"221",j:"inventions"},{id:"355",j:"IoT"},{id:"113",j:"ijgi"},{id:"318",j:"J"},{id:"488",j:"jal"},{id:"180",j:"jcdd"},{id:"529",j:"jcto"},{id:"93",j:"jcm"},{id:"244",j:"jcs"},{id:"311",j:"jcp"},{id:"134",j:"jdb"},{id:"542",j:"jeta"},
    {id:"104",j:"jfb"},{id:"222",j:"jfmk"},{id:"186",j:"jof"},{id:"203",j:"jimaging"},{id:"106",j:"jintelligence"},{id:"110",j:"jlpea"},{id:"279",j:"jmmp"},{id:"99",j:"jmse"},{id:"418",j:"jmp"},{id:"351",j:"jnt"},{id:"394",j:"jne"},{id:"339",j:"JOItmC"},{id:"235",j:"ohbm"},
    {id:"65",j:"jpm"},{id:"401",j:"jor"},{id:"185",j:"jrfm"},{id:"138",j:"jsan"},{id:"454",j:"jtaer"},{id:"566",j:"jvd"},{id:"433",j:"jox"},{id:"399",j:"jzbg"},{id:"405",j:"journalmedia"},{id:"461",j:"kidneydial"},{id:"561",j:"kinasesphosphatases"},{id:"499",j:"knowledge"},
    {id:"37",j:"land"},{id:"146",j:"languages"},{id:"60",j:"laws"},{id:"435",j:"liquids"},{id:"393",j:"livers"},{id:"217",j:"literature"},{id:"538",j:"logics"},{id:"170",j:"logistics"},{id:"52",j:"lubricants"},{id:"539",j:"lymphatics"},{id:"290",j:"make"},
    {id:"49",j:"machines"},{id:"425",j:"macromol"},{id:"432",j:"magnetism"},{id:"199",j:"magnetochemistry"},{id:"4",j:"marinedrugs"},{id:"14",j:"materials"},{id:"407",j:"materproc"},{id:"231",j:"mca"},{id:"154",j:"mathematics"},{id:"81",j:"medsci"},{id:"512",j:"msf"},
    {id:"340",j:"medicina"},{id:"172",j:"medicines"},{id:"92",j:"membranes"},{id:"484",j:"merits"},{id:"112",j:"metabolites"},{id:"59",j:"metals"},{id:"522",j:"meteorology"},{id:"525",j:"methane"},{id:"207",j:"mps"},{id:"465",j:"metrology"},{id:"438",j:"micro"},
    {id:"483",j:"microbiolres"},{id:"22",j:"micromachines"},{id:"73",j:"microorganisms"},{id:"498",j:"microplastics"},{id:"45",j:"minerals"},{id:"447",j:"mining"},{id:"314",j:"modelling"},{id:"11",j:"molbank"},{id:"1",j:"molecules"},{id:"537",j:"muscles"},
    {id:"479",j:"nanoenergyadv"},{id:"442",j:"nanomanufacturing"},{id:"105",j:"nanomaterials"},{id:"457",j:"network"},{id:"292",j:"neuroglia"},{id:"472",j:"neurolint"},{id:"365",j:"neurosci"},{id:"239",j:"nitrogen"},{id:"193",j:"ncrna"},{id:"429",j:"nursrep"},
    {id:"478",j:"nutraceuticals"},{id:"20",j:"nutrients"},{id:"384",j:"obesities"},{id:"359",j:"oceans"},{id:"475",j:"onco"},{id:"360",j:"optics"},{id:"422",j:"oral"},{id:"392",j:"organics"},{id:"527",j:"organoids"},{id:"398",j:"osteology"},{id:"445",j:"oxygen"},
    {id:"431",j:"parasitologia"},{id:"272",j:"particles"},{id:"64",j:"pathogens"},{id:"463",j:"pathophysiology"},{id:"470",j:"pediatrrep"},{id:"18",j:"pharmaceuticals"},{id:"9",j:"pharmaceutics"},{id:"536",j:"pharmacoepidemiology"},{id:"147",j:"pharmacy"},
    {id:"219",j:"philosophies"},{id:"444",j:"photochem"},{id:"165",j:"photonics"},{id:"500",j:"phycology"},{id:"419",j:"physchem"},{id:"511",j:"psf"},{id:"358",j:"physics"},{id:"436",j:"physiologia"},{id:"137",j:"plants"},{id:"271",j:"plasma"},{id:"383",j:"pollutants"},
    {id:"29",j:"polymers"},{id:"304",j:"polysaccharides"},{id:"503",j:"poultry"},{id:"508",j:"powders"},{id:"247",j:"proceedings"},{id:"164",j:"processes"},{id:"364",j:"prosthesis"},{id:"153",j:"proteomes"},{id:"343",j:"psych"},{id:"380",j:"psychiatryint"},
    {id:"532",j:"psychoactives"},{id:"168",j:"publications"},{id:"224",j:"qubs"},{id:"353",j:"quantumrep"},{id:"277",j:"quaternary"},{id:"411",j:"radiation"},{id:"342",j:"reactions"},{id:"545",j:"receptors"},{id:"202",j:"recycling"},{id:"102",j:"religions"},
    {id:"16",j:"remotesensing"},{id:"252",j:"reports"},{id:"268",j:"reprodmed"},{id:"114",j:"resources"},{id:"506",j:"rheumato"},{id:"162",j:"risks"},{id:"130",j:"robotics"},{id:"505",j:"ruminants"},{id:"206",j:"safety"},{id:"246",j:"sci"},{id:"238",j:"scipharm"},
    {id:"568",j:"sclerosis"},{id:"332",j:"seeds"},{id:"3",j:"sensors"},{id:"233",j:"separations"},{id:"218",j:"sexes"},{id:"265",j:"signals"},{id:"200",j:"sinusitis"},{id:"337",j:"smartcities"},{id:"71",j:"socsci"},{id:"58",j:"societies"},{id:"528",j:"software"},
    {id:"344",j:"soilsystems"},{id:"518",j:"solar"},{id:"414",j:"solids"},{id:"562",j:"spectroscj"},{id:"56",j:"sports"},{id:"173",j:"standards"},{id:"296",j:"stats"},{id:"466",j:"stresses"},{id:"294",j:"surfaces"},{id:"295",j:"surgeries"},{id:"560",j:"std"},
    {id:"15",j:"sustainability"},{id:"376",j:"suschem"},{id:"44",j:"symmetry"},{id:"521",j:"synbio"},{id:"131",j:"systems"},{id:"417",j:"taxonomy"},{id:"150",j:"technologies"},{id:"276",j:"telecom"},{id:"446",j:"textiles"},{id:"544",j:"thalassrep"},{id:"408",j:"thermo"},
    {id:"489",j:"tomography"},{id:"378",j:"tourismhosp"},{id:"171",j:"toxics"},{id:"21",j:"toxins"},{id:"352",j:"transplantology"},{id:"502",j:"traumacare"},{id:"567",j:"higheredu"},{id:"230",j:"tropicalmed"},{id:"133",j:"universe"},{id:"228",j:"urbansci"},
    {id:"403",j:"uro"},{id:"76",j:"vaccines"},{id:"291",j:"vehicles"},{id:"490",j:"venereology"},{id:"178",j:"vetsci"},{id:"269",j:"vibration"},{id:"553",j:"virtualworlds"},{id:"8",j:"viruses"},{id:"223",j:"vision"},{id:"530",j:"waste"},{id:"36",j:"water"},
    {id:"504",j:"wind"},{id:"349",j:"women"},{id:"377",j:"world"},{id:"354",j:"wevj"},{id:"519",j:"youth"},{id:"362",j:"ai"},{id:"541",j:"zoonoticdis"}];
                            const journal = journalMap.find(b => b.j === sysname); return journal ? journal.id : 0;}

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
    for (i = 0, len = u_Abbr.length; i < len; i++) { if (aff.indexOf(u_Abbr[i]) > -1) { results += "<br><span style='background-color:pink;font-weight:bold'>Abbr: " + u_Abbrr[i] + "</span>"; color = "pink"; break; } }
    aff = aff.toLowerCase();
    for (i = 0, len = u_2.length; i < len; i++) { if (aff.indexOf(u_2[i]) > -1) { results += "<br><span style='background-color:lightblue;font-weight:bold'>Top150: " + u_2r[i] + "</span>"; color = "lightblue"; break; } }
    for (i = 0, len = u_D.length; i < len; i++) {
        if (aff.indexOf(u_D[i]) > -1 && (u_D[i].indexOf("of") > -1 || (u_D[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1))) {
            results += "<br><span style='background-color:thistle;font-weight:bold'>Rank HK: " + u_Dr[i] + "</span>"; color = "thistle";
        }
    }
    for (i = 0, len = u_C.length; i < len; i++) {
        if (aff.indexOf(u_C[i]) > -1 && (u_C[i].indexOf("of") > -1 || (u_C[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1))) {
            results += "<br><span style='background-color:lightgreen;font-weight:bold'>Rank C: " + u_Cr[i] + "</span>"; color = "lightgreen";
        }
    }
    for (i = 0, len = u_B.length; i < len; i++) {
        if (aff.indexOf(u_B[i]) > -1 && (u_B[i].indexOf("of") > -1 || (u_B[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1))) {
            results += "<br><span style='background-color:wheat;font-weight:bold'>Rank B: " + u_Br[i] + "</span>"; color = "wheat";
        }
    }
    for (i = 0, len = u_A.length; i < len; i++) {
        if (aff.indexOf(u_A[i]) > -1 && (u_A[i].indexOf("of") > -1 || (u_A[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1))) {
            results += "<br><span style='background-color:lightblue;font-weight:bold'>Rank A: " + u_Ar[i] + "</span>"; color = "lightblue";
        }
    }
    for (i = 0, len = u_QP.length; i < len; i++) { if (aff.indexOf(u_QP[i]) > -1) { results += "<br><span style='background-color:cyan;font-weight:bold'>Rank Top: " + u_QPr[i] + "</span>"; color = "cyan"; } }
    return { detail: results, color: color };
}

function skOpenUrls() {
    if ($("#add_r").length) {
        if ($("#add_r").css("display") == "none") { $("#add_r").css("display", "block") } else { $("#add_r").css("display", "none") }
    } else {
        $("body").append(`<div id='add_r' role='dialog' style='position: fixed; height: 350px; width: 350px; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 101; background-color: #E8F5E9; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); border-radius: 5px;
        overflow: hidden;'> <div style='background-color: #4CAF50; color: white; padding: 10px 15px; font-size: 15px; border-top-left-radius: 5px; border-top-right-radius: 5px;'> <span>Open Urls, IDs & Emails [Ctrl+Q]</span>
        <button type='button' onclick='document.getElementById("add_r").style.display="none"' style='float: right; border: none; background-color: transparent; color: white; font-size: 20px; cursor: pointer;'>&times;</button> </div> <div style='padding: 20px;'>
        <textarea id="add_r_t" class="manuscript-add-note-form" placeholder="Example:\nmathematics-11111111\nmathematics-2222222\n\nhttps://www.scopus.com/detail.uri?authorId=333\nhttps://scholar.google.com/citations?user=444\n\naaa@aaa.edu\nbbb@bbb.edu" minlength="1"
        rows="10" spellcheck="false" style='width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #ccc; border-radius: 4px;'></textarea>
        <button id="add_r_b" class="submit" style='background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;'>Submit</button></div></div>`);
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
            emails.forEach(function (email) { window.open('https://mailsdb.i.mdpi.com/reversion/search/emails?fm=true&cc=true&to=true&m_type=&sort=desc&link=true&bcc=true&search_content=' + email, '_blank') });
            textContent = textContent.replace(emailRegex, '');
            // 查找连续的6位或7位数字
            var digits = textContent.match(digitRegex) || [];
            digits.forEach(function (digit) { window.open('https://susy.mdpi.com/build/img/design/susy-logo.png?term=' + digit, '_blank') });

            // let myArray, add_id, rdline = $("#add_r_t").val().split("\n");
            // for (var i=0; i < rdline.length; i++){
            //     if ((myArray = /\w+-\d+/.exec(rdline[i])) !== null) {add_id=myArray[0]}
            //     if ((myArray = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.exec(rdline[i])) !== null) {GM_openInTab(window.location.origin+"/ajax/submission_get_manuscripts?term="+add_id+"&r="+myArray[0], false)}
            // }
        })
    }
}

function skAddReviewers() {
    if ($("#add_susie").length) {
        if ($("#add_susie").css("display") == "none") { $("#add_susie").css("display", "block"); } else { $("#add_susie").css("display", "none") }
    } else {
        $("body").append(`<div id='add_susie' role='dialog' style='position: fixed; height: 350px; width: 350px; top: 300px; left: 500px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front'>
        <div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix'><span class='ui-dialog-title'>Add Reviewers [Ctrl+E] <a href='/user/settings#reviewer' target=_blank>[Full Version]</a></span>
        <button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close' onclick='document.getElementById("add_susie").style.display="none"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span></button></div>
        <div class='ui-dialog-content ui-widget-content'><textarea id="add_susie_t" class="manuscript-add-note-form" placeholder="Example:\nmathematics-xxxxxx\naaa@aaa.edu\nbbb@bbb.edu (in USA now)\nhttps://susy.mdpi.com/user/xxxxxxxxxxxx\nccc@ccc.edu ddd@ddd.edu"
        minlength="1" maxlength="20000" rows="10" spellcheck="false"></textarea><button id="add_susie_b" class="submit">Submit</button></div></div>`);
        $("#add_susie_t").trigger("focus");
        $("#add_susie_b").on("click", function () {
            let myArray, add_id, emailArray, rdline = String($("#add_susie_t").val()).split("\n");
            rdline.forEach((line, _) => {
                if ((myArray = /(https:\/\/susy\.mdpi\.com\/user.+|\w+-\d{6,})/.exec(line)) !== null) {
                    add_id = myArray[0];
                }
                const emailPattern = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/g;
                while ((emailArray = emailPattern.exec(line)) !== null) {
                    if (add_id.startsWith("https://")) {
                        // 如果 add_id 是网址，则以这种方式构建 URL 并打开
                        GM_openInTab(add_id + "?r=" + emailArray[0], true);
                    } else {
                        // 如果 add_id 是字母数字-数字模式，则以原有方式构建 URL 并打开
                        GM_openInTab(window.location.origin + "/build/img/design/susy-logo.png?term=" + add_id + "&r=" + emailArray[0], true);
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

function addCssTooltipster() {GM_addStyle(`.tooltipster-fall,.tooltipster-grow.tooltipster-show{-webkit-transition-timing-function:cubic-bezier(.175,.885,.32,1);-moz-transition-timing-function:cubic-bezier(.175,.885,.32,1.15);-ms-transition-timing-function:
cubic-bezier(.175,.885,.32,1.15);-o-transition-timing-function:cubic-bezier(.175,.885,.32,1.15)}.tooltipster-base{display:flex;pointer-events:none;position:absolute}.tooltipster-box{flex:1 1 auto}.tooltipster-content{box-sizing:border-box;max-height:100%;max-width:100%;
overflow:auto}.tooltipster-ruler{bottom:0;left:0;overflow:hidden;position:fixed;right:0;top:0;visibility:hidden}.tooltipster-fade{opacity:0;-webkit-transition-property:opacity;-moz-transition-property:opacity;-o-transition-property:opacity;-ms-transition-property:opacity;
transition-property:opacity}.tooltipster-fade.tooltipster-show{opacity:1}.tooltipster-grow{-webkit-transform:scale(0,0);-moz-transform:scale(0,0);-o-transform:scale(0,0);-ms-transform:scale(0,0);transform:scale(0,0);-webkit-transition-property:-webkit-transform;
-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform;-webkit-backface-visibility:hidden}.tooltipster-grow.tooltipster-show{-webkit-transform:scale(1,1);-moz-transform:scale(1,1);
-o-transform:scale(1,1);-ms-transform:scale(1,1);transform:scale(1,1);-webkit-transition-timing-function:cubic-bezier(.175,.885,.32,1.15);transition-timing-function:cubic-bezier(.175,.885,.32,1.15)}.tooltipster-swing{opacity:0;-webkit-transform:rotateZ(4deg);
-moz-transform:rotateZ(4deg);-o-transform:rotateZ(4deg);-ms-transform:rotateZ(4deg);transform:rotateZ(4deg);-webkit-transition-property:-webkit-transform,opacity;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:
-ms-transform;transition-property:transform}.tooltipster-swing.tooltipster-show{opacity:1;-webkit-transform:rotateZ(0);-moz-transform:rotateZ(0);-o-transform:rotateZ(0);-ms-transform:rotateZ(0);transform:rotateZ(0);-webkit-transition-timing-function:cubic-bezier(.23,
.635,.495,1);-webkit-transition-timing-function:cubic-bezier(.23,.635,.495,2.4);-moz-transition-timing-function:cubic-bezier(.23,.635,.495,2.4);-ms-transition-timing-function:cubic-bezier(.23,.635,.495,2.4);-o-transition-timing-function:cubic-bezier(.23,.635,.495,2.4);
transition-timing-function:cubic-bezier(.23,.635,.495,2.4)}.tooltipster-fall{-webkit-transition-property:top;-moz-transition-property:top;-o-transition-property:top;-ms-transition-property:top;transition-property:top;-webkit-transition-timing-function:cubic-bezier(.175,
.885,.32,1.15);transition-timing-function:cubic-bezier(.175,.885,.32,1.15)}.tooltipster-fall.tooltipster-initial{top:0!important}.tooltipster-fall.tooltipster-dying{-webkit-transition-property:all;-moz-transition-property:all;-o-transition-property:all;
-ms-transition-property:all;transition-property:all;top:0!important;opacity:0}.tooltipster-slide{-webkit-transition-property:left;-moz-transition-property:left;-o-transition-property:left;-ms-transition-property:left;transition-property:left;
-webkit-transition-timing-function:cubic-bezier(.175,.885,.32,1);-webkit-transition-timing-function:cubic-bezier(.175,.885,.32,1.15);-moz-transition-timing-function:cubic-bezier(.175,.885,.32,1.15);-ms-transition-timing-function:cubic-bezier(.175,.885,.32,1.15);
-o-transition-timing-function:cubic-bezier(.175,.885,.32,1.15);transition-timing-function:cubic-bezier(.175,.885,.32,1.15)}.tooltipster-slide.tooltipster-initial{left:-40px!important}.tooltipster-slide.tooltipster-dying{-webkit-transition-property:all;
-moz-transition-property:all;-o-transition-property:all;-ms-transition-property:all;transition-property:all;left:0!important;opacity:0}@keyframes tooltipster-fading{0%{opacity:0}100%{opacity:1}}.tooltipster-update-fade{animation:tooltipster-fading .4s}
@keyframes tooltipster-rotating{25%{transform:rotate(-2deg)}75%{transform:rotate(2deg)}100%{transform:rotate(0)}}.tooltipster-update-rotate{animation:tooltipster-rotating .6s}@keyframes tooltipster-scaling{50%{transform:scale(1.1)}100%{transform:scale(1)}}
.tooltipster-update-scale{animation:tooltipster-scaling .6s}.tooltipster-sidetip .tooltipster-box{background:#565656;border:2px solid #000;border-radius:4px}.tooltipster-sidetip.tooltipster-bottom .tooltipster-box{margin-top:8px}.tooltipster-sidetip.tooltipster-left
.tooltipster-box{margin-right:8px}.tooltipster-sidetip.tooltipster-right .tooltipster-box{margin-left:8px}.tooltipster-sidetip.tooltipster-top.tooltipster-box{margin-bottom:8px}.tooltipster-sidetip .tooltipster-content{color:#fff;line-height:18px;padding:6px 14px}
.tooltipster-sidetip .tooltipster-arrow{overflow:hidden;position:absolute}.tooltipster-sidetip.tooltipster-bottom .tooltipster-arrow{height:10px;margin-left:-10px;top:0;width:20px}.tooltipster-sidetip.tooltipster-left .tooltipster-arrow{height:20px;margin-top:-10px;
right:0;top:0;width:10px}.tooltipster-sidetip.tooltipster-right .tooltipster-arrow{height:20px;margin-top:-10px;left:0;top:0;width:10px}.tooltipster-sidetip.tooltipster-top.tooltipster-arrow{bottom:0;height:10px;margin-left:-10px;width:20px}.tooltipster-sidetip
.tooltipster-arrow-background,.tooltipster-sidetip .tooltipster-arrow-border{height:0;position:absolute;width:0}.tooltipster-sidetip .tooltipster-arrow-background{border:10px solid transparent}.tooltipster-sidetip.tooltipster-bottom .tooltipster-arrow-background{
border-bottom-color:#565656;left:0;top:3px}.tooltipster-sidetip.tooltipster-left .tooltipster-arrow-background{border-left-color:#565656;left:-3px;top:0}.tooltipster-sidetip.tooltipster-right.tooltipster-arrow-background{border-right-color:#565656;left:3px;top:0}
.tooltipster-sidetip.tooltipster-top .tooltipster-arrow-background{border-top-color:#565656;left:0;top:-3px}.tooltipster-sidetip .tooltipster-arrow-border{border:10px solid transparent;left:0;top:0}.tooltipster-sidetip.tooltipster-bottom .tooltipster-arrow-border{
border-bottom-color:#000}.tooltipster-sidetip.tooltipster-left .tooltipster-arrow-border{border-left-color:#000}.tooltipster-sidetip.tooltipster-right .tooltipster-arrow-border{border-right-color:#000}.tooltipster-sidetip.tooltipster-top .tooltipster-arrow-border{
border-top-color:#000}.tooltipster-sidetip .tooltipster-arrow-uncropped{position:relative}.tooltipster-sidetip.tooltipster-bottom .tooltipster-arrow-uncropped{top:-10px}.tooltipster-sidetip.tooltipster-right.tooltipster-arrow-uncropped{left:-10px}
.tooltipster-sidetip.tooltipster-noir .tooltipster-box{border-radius:0;border:3px solid #000;background:#fff}.tooltipster-sidetip.tooltipster-noir .tooltipster-content{color:#000}.tooltipster-sidetip.tooltipster-noir.tooltipster-arrow{height:11px;margin-left:-11px;
width:22px}.tooltipster-sidetip.tooltipster-noir.tooltipster-left .tooltipster-arrow,.tooltipster-sidetip.tooltipster-noir.tooltipster-right .tooltipster-arrow{height:22px;margin-left:0;margin-top:-11px;width:11px}.tooltipster-sidetip.tooltipster-noir
.tooltipster-arrow-background{border:11px solid transparent}.tooltipster-sidetip.tooltipster-noir.tooltipster-bottom .tooltipster-arrow-background{border-bottom-color:#fff;top:4px}.tooltipster-sidetip.tooltipster-noir.tooltipster-left.tooltipster-arrow-background{
border-left-color:#fff;left:-4px}.tooltipster-sidetip.tooltipster-noir.tooltipster-right .tooltipster-arrow-background{border-right-color:#fff;left:4px}.tooltipster-sidetip.tooltipster-noir.tooltipster-top .tooltipster-arrow-background{border-top-color:#fff;top:-4px}
.tooltipster-sidetip.tooltipster-noir .tooltipster-arrow-border{border-width:11px}.tooltipster-sidetip.tooltipster-noir.tooltipster-bottom .tooltipster-arrow-uncropped{top:-11px}.tooltipster-sidetip.tooltipster-noir.tooltipster-right.tooltipster-arrow-uncropped{
left:-11px}`)}

//---------------------------------------------------------------------------------------------------------------------------ICON-------------------------------------------------------------------------------------------------------------------------
var icon_magnifier = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAl5JREFUeNqMk01oE1EQx99+mmSTbLayWqtN+hWxIW21VeOhpDEVBIupFBQRAgUL6rWth57tVSgIvWnBiyj1EBDpQdCDH4RCIVAbTSm9pBGDJqkxyW42u+u8kGKzbsGBH++D"
+ "/8ybmfceEYlEkJlRFIURCIIYgGUbwAElIKPrekJV1TyAaHSwddrs/MXzo5HeM4PnetpEZ2tVlnPxePzrm1cvu4q7ubeg2aa8Xi+CiE2ACZzTNTZxezbYffKU333EKdIkQbMM4/B0dHhau/ocycQqKUvlbRKnYaRWqw0GwhGfQzjsETiWJQlE7KWF5+4Tx3qGL1/rwzq6Wq2apd/u9Q+58SSTr0gYo8A3cLZzeelRO60oilkA3mK1tqhavRzUe9zpNArSuQoDvvx"
+ "BGZQ1RSoi6hBv5lwvRa0WwbdMyrKMTEgn1z5laIqklJquGp1xYutrH3ewjhQEAfE8jxwOB7Lb7YjjOMSy7Gbs+VKaqf1WqqrWfDJJULs/v2cfLy4kS6XSKmmMDtfoYRhm/N6du/NTN6/GV2IvUroila0sZSFUubISW/5yffzKh43P668lSfpBhMNhpGnaHj6bjZuYnr7/IBq9NZ/P555BTD/QDeBe/AK2gHc2my3rcrn+vkQ4+YIoHo3MzMzNRaM3HoLzU9jeBD"
+ "bMmghvAGWzWYRCoRAKBoNjk5NTC4nElt7ff3qRpukh/BfgH0DN5D80mdvtRoFAYDaVyuojI6NPwPkSdvxfw0qLKIrDUEKoUCh8g9Tewx6+uloDZd+o7FtjjYoD4D60NEa9gWaCahjruj8CDADbZyPFMNpHlwAAAABJRU5ErkJggg=="
var icon_pencil = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAZlJREFUeNpiZCAAdNQYGSJ8GBjO3g8A86ds2ACixN4wMLx69P8/AwshjTpqEP7Z+3Apmz8MDEX/GBhuAtmVLIQ0IoP///+rxTg4GO81MQlkvHTp1f2dO/eyEKMRpvnjx4+ee/b"
+ "smbBu/fpr/7q73/9mYNjDqCXPwBBkx8BgYs2IMxyAXnX4+ZOhQt8swP35s0cfvGOvzSz+8aNCBSjBVB3LwKApz0BQc0B4ufu/v/9fXThz9qKcxO+Ka4wQC5nwxQCy5rt3brzauXXD9b9/GRwUpP/B1TCRqhkojgKYKNF8A4hZyNEMjBGG9UD+f3QDCGm+95iBYfcxBoa7jxGmsRCjGaER07ss338CCWYGuXePeWwDkyPd9+3e8/LGtTM3QJrvPsKtEW7At58MjH"
+ "//MaYUNO2vLc4wXfj9F8Ot7/8Z2w6f+49XIxy0pTL2PLu67H9OEONyRyNGYLJiEAdiUSAWBmJBIOYHYl4g5gJiDiBmg3qdGYjByel/hj/j6k1HGZY/e/MflOf+QjEw0zH8htLI7N9Iav4CBBgAZrcHTnowXc4AAAAASUVORK5CYII="
var icon_mail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdQTFRF////AAAAAAAAAAAAVX9/VX9/CyQkUnx8T3h4S3R0R29vQ2pqPmVlOV9fNFpaL1RUH0JCDS4una6uobKypba2qru7r8DAtMXFuMnJvc7OwNHRwdLSxdbWydrazdvb0t7e1"
+ "OPj1uHh2Obm2unp3OXl3enp3e3t3uvr3+7u4enp4ezs4+7u4/Pz5ezs6PHx6Pb26e/v6/Hx7Pf37fHx7vX17/n58/j48/r69/v79/z8+v39+/39////VLvycQAAABJ0Uk5TAAYWGk1naGhpa21vcXN1eH6G7arvxgAAAJRJREFUGBmFwcEKgkAUBdB77fVyksAIEun//8yiaJFTijY6MxkURZvOAf6hEN+izNY7g7duf0lYVk18aaqSQrM9FBme2lNhmDCazdGG"
+ "iT1uTKQwhGw4DznqOs8CKQwOurh4XFN1WFDoveuXYrHSW6qeQt85TdKIFPPOC4X3XjlijhGUXim0K8Wbs6Rm+NZygo8Y8esBKMtC8OXU0AUAAAAASUVORK5CYII="
var icon_note = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAfZJREFUeNqMk01LG1EUht87DkkmtgsXWvIxUhLd6B+I27q1q/ZH9E9UULrouhTqupCu+geKUBAqBNy4r42tmoQgZPxIOh+Zj55zMpOZQJReONxz597zvs+ZO6Ne7+6Ch1LqJU0lP"
+ "D6+h2F4FgYBoiiSB3qS0Fz+srd3ENCmd3wMbG0hpL1k/8fJCT4fHr5hL4qfiaLGanGoKAwlJxr44zE8z4PrunAcB8PhEF/39w9of5vq1hMBnR3joX79+Qs2NEmg251g8ppjMBjgY7OJFxsbnz40m2/p/DsRCFMBbf35Inxa+z2F2moeAVWOeU1kr0o7IlgoFPDt9NSaEvhZgosJQZUIfl95GYKUJIocNlFpC74/FVhbLSIgt7EQFOLCaIYkl8uBauYKaO0rW1wq"
+ "QuDOIYiEgGq0tIWMwJpZlKtzmcCMCYAZEm1hAf4DAqrdmRCUmaDzEAFYINMC3XdCUK8W5ZBDBHXTkDz5mBISJqCa+S0wAR1DiQjOO85jBKnAba+HxeVlaaFembjaTFA1xD3+zKck8TuQFkbX19DPjo5gNhowlpb0dteWAv6jzrt25u5nCezRSLctC5etFnQ6a1Dy9Fmjka+VDRFgglqlOHWXOc75P7m1rHy/1VqhR/ciQLFy1+/fPNncfI//GKFt33ANhf9PgAE"
+ "A+ImOPNiBpOQAAAAASUVORK5CYII="
var icon_note_add = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAlRJREFUeNp8k0trE1EUx88kY161iyBtyauIaUAaXOki0bhRXAi6EMXP4EcQxWCDC3cFESy4q6QrcSlIoVJIXdgUik01YppYaWZoqLEpIZmZzNzrOTeTF9YeOMx9nf//d+feK"
+ "91Lp4FCkqTb+AnAybHCGCsxywLOORRzOZCpQYHf4NLc3IKFk8baGkAyCQznevO59XVYXF5+QF6YP2jsfCoFDlKzU+KMiTbSgNnpgGEYoOs6aJoGzWYT3mYyCzh/HWtjPSSZHO2QdnZbQIYRFFCULib1Kev1OrzMZuHa7OyrF9nsE1z/TAiwgYAjdnYMTOybqgTnpt1gYWWH+kh2N3BLCHo8HviwufmnT2AOE/zqEoSR4OeeMUQwIOFcIxNpsAXT7AvMTPvAQreO"
+ "IPDYhXyExOVyAdYcK+Ao77WFS0gQ6McQcEGANY7BFoYEZiI+cXQ6EURsAoAREofTCeZ/BKRytUsQJILqvwRPdx/D11YBahd+3x8/9M9brINbwPPuEUTDPrFYQ4JoxCvavctEJDvft+HylUuwWFsK18dVYMwa3QIRoB8EkKBS1frO6eJD2D7aEosaVgO4ziTmtvK4dENuqCqMTUyILURDXdc2EYS9wp2i9HkLJq+eEe0D8wBSd5IhbIY+vlsBubS6CpFEArx+v1x"
+ "W2mIRvaiK0u6ffexUHArvv3R/1A0Jim++KabbUPFVbNCYF3NyKpHIcDta+TxHd5F4L0TiHeAXX6d4sBLnzkd+hWqoVu4JHO3vH56Ox5+f9Jb1uHqTfdKmoMYLtoD5V4ABAIRMpFbtaSpMAAAAAElFTkSuQmCC"
var icon_arrow = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAe9JREFUeNqkUz1oE2EYfu7uuyRKLCFt6g+4VNQWWod+mQRRR1En0UFOHKoNCMKNju4SEQsOzsFNcRGl4CS42AzaKhKcsqhk0Etj7u+773y/6+USbOLSF5574b33eX+e906L4xh7"
+ "MaYeC/c/IFcowMznEzDTBGPMoldnqEFtkPy708mIqvHHe0s7BcaYJYSwRwPu9vbYRH1XJI4tEYb2jYtHOHko9LvdxE9cYZQcBoF9+9oJ7jgRQt+HFAJSyv9rkO6UkGvXF3mr9QelkpkUINsYR6T8Jrkay8i+b9+5yfnmppMmSFw6e4yrIynBBsdS3jQ1PH/zeTiBIt+9dZpvbTlZh1+Oh/Z3F33XRUj7R1GUxA3DwMx0EYHnDUUMPe9Rfe1tc26uiL6M8aXno+U"
+ "H6O7PIShPIapMQx6sQMxW4JbL+MkKCKhwNgGN2FD7Pnz82j63coF/aoc4ekDHtxfrzUniaZrW/FfEBomI9Scv7fnVq7zdBwIqajBWpeTd99d3vgBNCaQSzMOLyJ+6ApSPWxSzD61a/MfThupSjVuvxk2A3sazYYGBGbML0OcvW9rMyeRLFO8eVGXnKyacMiug5ikSplLs05dXzqNQWpbv6/URjpK+m6JH3GhQQI2QI+RTmBO0EwQ/RUBcqe31d/4rwAB0lPTXqN"
+ "6HzgAAAABJRU5ErkJggg=="
var icon_book = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAVRJREFUeNqsUzFOwzAUfUmdNglUwMLYoUsUdWDhCFyAgaEngAsgTsEBwpQJJE7QUyAWFBVBxQA7KKqQEifp/yaxAnUoA1968vez/9Oz/W0JIVDHGWEsj693sDkeCZeciBY5vpnNz"
+ "vuOA7ffh++6GlueB38wgEu5S+sH0+lpUySKotACt1GEvaOLesr8ssb3eMDJIQ1XPx3Yk8kEYjRCnued3h1ygOrJ0g7aAmVZIssyJEnSKRCGIQmUdqcACJZlIQiCteL5fI56j1Ggp+6DYNs20jRdE2Be7SkLs4CUEmCAB2k8guK7BBoHfITW6+jQ/D846P3qQHWBwYHmOwTE3x1I4xFE46CqKqMDzRfyy8H7MwSTfDncZE0fMKdyg4DiCynwsQDuI+XAo4UhjUNe"
+ "FPTW/Gm6gnsBn6lPxfs0TZUAgSeLOI63cbf7svEzL99e6xq5EmAAdSK/D3nWtn4AAAAASUVORK5CYII="
var icon_plus = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAatJREFUeNqkU71KA0EQ/vaiib+lWCiordidpSg+QHwDBSt7n8DGhwhYCPoEgqCCINomARuLVIqgYKFG5f6z68xOzrvzYuXA3P7MzLffN7unjDH4jw3xx91bQXuxU4woNDjUX7Vgs"
+ "FOIH3/BnHgC0J65AzwFjDpZgoG7vb7lMsPDq6MiuK+B+kjGwFpCUjwK1DIQ3/dl0ssVh5TTM0UJP8aBgBKGleSGIWyP0oKYRm3KPSgYJ0Q0EpEgCASA2WmWZQY3kazBmjP9UhBFEbTWAgA0f9W2yHeG+vrd+tqGy5r5xNTT9erSqpvfdxwHN7fXOQZ0QhzH1oWArLsfXXieJ/KTGEZLcbVaTVn9ALTOLk9L+mYX5lxd0Xh6eGyVgspK6APwI8n3x9hmNpORJOuB"
+ "o5ah8GcTc7dAHmkhNpYQlpHr47Hq2NspA1yEwHkoO/MVYLMmWJNarjEUQBzQw7rPvardFC8tZuOEwwB4p9PHqXgCdm738sUDJPB8mnwKj7qCTtJ527+XyAs6tOf2Bb6SP0OeGxRTVMp2h9nweWMoKS20l3+QT/vwqfZbgAEAUCrnlLQ+w4QAAAAASUVORK5CYII="
var icon_users = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwxJREFUeNqEk+1LU2EUwM9zd7fr7nTlZuk0dfmyTdt813wp7IUQCZPqgxZLiL4EhQmJfSkQkj72zX+gDxkUFUmhoUUhZeZGlImvqdPN6Xb35nC7bndPz9VSEaIDP84597nn3HPu"
+ "OQ8CIgxCkCBq2JH2arypKQrSyHEnMfWESYyhMxYD+9/3JKnklBUNAtqVYMGHAIVIUik81BqMDeqMLF2Qx3ke91rStB16V30AIhT8Q+xrAGMOJFv1gtHl9yfHqdT0scZGhejP2kFGABF6T1wyoZWgJcyTAp6teEHa2dYGrEIBAqld9MlZEsEhBtB4VzSx7xRXVDSbCgvV3ywWbtpqPeILkjZkMuDX14GWSkH0aQq0pPOtBLW6nc7fT+Gqzlv1GqNOA2NTqZqLZms"
+ "pS8PK7MQEaHNyQNTsVs2nCJ82E5zUbcc3jTiVuUUmLUTCYRC1PEGZbNAEVgee9FjL6upKRvv7rfu2RnWG0LWZIBrbTkA1FfKT4bW16mgkAgKhoTgybktPcbOLy+ocnR4+9Pbgry35P+O94b6VdCU40uJBggouA0YUJAorYwpp1JCeayolA6V9HtfGkG9mjrnZoZPnl+s3eCM4awypySdqk97FuUK+BFoLMTwt+VX6AEbk9dCnvAoCRi7qx+PKYASlfh4etONz5p"
+ "ykQ9kqRygE7fXX4KnDAhkH05RGVVYBi2WH51xL0l17gMsGlC1n3ZwHlZSVgz8QlL6arPg+b2OWwuSfcBwHohZF2IgyBlWmCQf4GiQx9+4HStrMMnT+9QbThQP+sTQtw8E8rwZ3Yq63+82AJUzZguUT1sGRKvtpHBHkwAssjsTiYCbwFkkuPb/dUJllLtVr8tSJCYzN5oSu8xlw94UNMjM1wHkDG6PjCzO9A8Mvhdetj/YsHkcBHygr0KqKYtHY5oD2losFkBVma"
+ "/KBUWZJjndMihdqF24kKbpyDzTFtVjChDAtDwItX69xdn8ZSrlxFEXDLIqGFEjg5bBs/Yg9M/exfwmwf3G7BPRnr9Xwf+HEL+59+FuAAQBh80P/MCkZDgAAAABJRU5ErkJggg=="
var icon_webs = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAydJREFUOMttU39MzGEYfw3DMLMZfxlTMTFjmT+s/Fi3lBKZy5HSUZ2Ou67rrvped9+774+7636jkkI3Jm04QoqprCYz8zvmH/+Iya9R2BLx8"
+ "X6PtWre7dn7fp/3eT7P87zfz4fYbDYy0qxWK3GIAjnsdZFKv5t4yx3D/rGxko1KFAWeuB12UsyYZmapDqxW7M2Pzy/QR4k89Tvt4ZixQMPJUoCuyDhnqSwtOGOF7NvMlRsQES/H9OUyzItNeZCs2J0mdcON6Yaw9KPcLhKVRhcdFb/tvfnQcShLRZxvaYehvAKNNzqQoipGUq4Rkas3iCamlHDciA6ktiniFBKx6lVdqBlqqwf+ugYEQ02Iz9TgXvdz5Doq0T84"
+ "BAsF56uO55axLGEt5r8A1QEviU1VGNN1VvCVdYiSyREINmBXkQ3LNmbAV38Rn9ub0GfMAvh9GKpx4HZnx8ESsyU8CrHzHIlct/k+6Oq6/wTswVrpGK680+wBPvWgb28ivt+7haE3PfhSJQB+BucuN21Vq9WEFOgNUxbKtr1z156GLEuDVJURzqOnkK4uRSbrAwKlGOi8hpHrh6hBd6i+8YCFjqDR6ScvSdz+NnT9JtK1ZcguFnC2uQ0FnA87y9yAW4/Bx3dHAfz"
+ "0MXjWUNeiFZyE/gGBLFq/pUu6uP2gG+ZATTjozqOnyGD9wLMufNJux6+v/WH/QFcrBkXt76arV1X71PsJORLwkAR5Vo5MWQidGMD8tWlgvNXYlGfEgnVbUXO5FbgURL9WDngNGMhYg95i5Ueb20tMZjMhPMcRgefGTY2OfVh/pRVa3g/fiTM4R3mQtKcQL16+hnAyhIF3vag5fAQ3XFzwe9oKNGqU+gK7iwxzn7JwdnSCvNtaEUQKre45Vg8NfQdH9Ukk5hQhOZ"
+ "9BTIoix8gJ5Em+vO1DdsJPs42bMExliY0MYxofu3mHZV5c6ouJi+Mwa1USpi1b3xeTrLigUObF+FxOQpOIwLKTAmUlEdJ5lJikcTxUEyxlms5QMnd/oSGyhDFNc9KHdtICYQ1Qs9BEE8cTTiLS/+Qs7S6qSkk8/6j+XylL9gf37xpjQOT4TAAAAABJRU5ErkJggg=="
var icon_scopus = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB0UlEQVR4nLWTvWtUURDFf3PfXd9LdjessGKMglYB0ahgOhtB0JVgodhaiVhYiWJnI6hY+R8IljYBP1AUjKCInYpgVmJQiIQY1w+St4v7vu5YvHXd4CpI8MCtzszcMzNnZPH0JmUVMKtJ7l9ANX/90IdbUUDTCIwBz0IW/yKyBE1jsGtABM2SLmV"
+ "7g4KdE/jbawDEM49pv7iFJm0KW8bxx2p41c1oOyR6dY/4zSMwtlMgS7EjWykePEd44yxu+ROmsgF1Kf7YAQb3nqR1/yrZk1lMqYoEZRDTq0ARvwQoaeM9bmkB+TKHCUoU952ieecy8dunSCHAhQ1Q8ja7M/AsydxLovoUlRPX8XdMoC7DlNdhSlXSjzNIIch/Nbab3KNAQJXmzQv42/ZTrJ3Bq4wQ1adAvDxRFeSva1RwjvbzScLJ8wzsOYZGTdLGO4LxI7ioha"
+ "YRmrThty2ow6zdSLDrENm3eQZ2HyaefYYLP9O8fZHy0Ut5K/PTmKH1ZF8/EL1+gBjvpwJBvy+jWYodHiWafkjr7hWkEJAt1Fm6dhwXNrDDo5jBIVy4mCsGpHsLqrmRVEEEsT5Ip2l1uZE6LhRbyIe5wkgi+aT7Qcwfuf9wTP+IH7tLvmy5ImEAAAAAAElFTkSuQmCC"
var icon_retractiondatabase = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQAAAAA3iMLMAAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAACxMAAAsTAQCanBgAAAA4SURBVAjXY/jxn+FTPcPy/QxdzQwnuxk4mhme72f4UM/w357h/34Gk/kMCv4Mvf4ME9IZ/n8HIgD7ARTNr5OwGQAAAABJRU5ErkJggg=="
