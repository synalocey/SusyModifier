// ==UserScript==
// @name          Susy Modifier
// @version       2.5.25
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Susy Modifier
// @author        Syna
// @icon          https://susy.mdpi.com/bundles/mdpisusy/img/icon_old/favicon-196x196.png
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @match         *://*.mdpi.com/*
// @match         *://redmine.mdpi.cn/*
// @match         *://*.scopus.com/*
// @match         *://*/*amp;user*
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_openInTab
// @connect       mdpi.com
// @connect       titlecaseconverter.com
// ==/UserScript==
/* globals jQuery, $, GM_config */

(function() {
    'use strict';
    GM_config.init({
        'id': 'SusyModifierConfig',
        'title': 'Settings of SusyModifier v'+GM_info.script.version,
        'fields':  {
            'Interface_sidebar': {'section': [],'label': 'Susy 左侧边栏按钮', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'Interface_SME': {'label': 'I am SME of', 'type': 'select', 'labelPos': 'left', 'options':
                              ['','Algebra and Geometry','Computational and Applied Mathematics','Difference and Differential Equations','Dynamical Systems','Engineering Mathematics','Financial Mathematics','Functional Interpolation',
                               'Fuzzy Set Theory','Mathematical Biology','Mathematical Physics','Mathematics and Computer Science','Network Science','Probability and Statistics Theory'], 'default': ''},
            'Journal': {'label': 'of Journal', 'type': 'select', 'labelPos': 'left', 'options': ['Mathematics', 'None'], 'default': 'Mathematics'},
            'Interface_combine': {'label': 'Topic Manuscripts整合进SI Manuscripts', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Manuscriptnote': {'section': [],'label': 'Manuscript Note 边栏紧凑', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'ManuscriptFunc': {'label': '快捷申请优惠券和发送推广信按钮', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'Template_Linkedin': {'label': 'LinkedIn推广信模板', 'type': 'textarea', 'default':
                                  `Dear Authors,\n\nHope this email finds you well. Your manuscript %m_id% is promoted by the Mathematics "%m_section%" Section LinkedIn account. Welcome to like, share, send and comment on it.\n\n`
                                  +`Find us and receive more information in the section "%m_section%" of Mathematics:\n[Links]\n\nPlease do not hesitate to let us know if you have questions.`},
            'Template_Paper': {'label': '文章推广信模板', 'type': 'textarea', 'default':
                               `Dear %name%,\n\nThank you very much for your contribution to /Mathematics/, your manuscript %m_id% is now under review. We will keep you informed about the status of your manuscript.\n\n`
                               +`In addition, you have published a paper/papers in /Mathematics/ in the past two years with the citation of about XX times. Based on your reputation and research interests, we believe that your results should attract more citations and `
                               +`attention. Therefore, could you please promote the paper/papers to your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?\n\nIn addition, you have published a paper/`
                               +`papers in /Mathematics/ in 20XX with the citation of XXXXX times, congratulations on your great work!\nTo encourage open scientific discussions and increase the visibility of your results, could you please promote the paper/papers to `
                               +`your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?\n\n1. [paper link]\n2. [paper link]\n\nThank you in advance for your support.`},
            'SIpages': {'section': [], 'label': '特刊列表显示所有特刊', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'SInote': {'label': 'Special Issue Note 界面变大', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'SInoteW': {'label': 'SI Note Width', 'labelPos': 'left', 'type': 'int', 'default': 500},
            'SInoteH': {'label': 'Height', 'labelPos': 'left', 'type': 'int', 'default': 500},
            'GE_TemplateID': {'section': [], 'label': '默认 GE Invitation Template', 'type': 'select', 'labelPos': 'left', 'options':
                              ['!Guest Editor – invite Version 1','Guest Editor - Invite with Benefits and Planned Papers','Guest Editor - Invite Free','Guest Editor - Invite with Discounts','Guest Editor-Invite (Optional)'], default: '!Guest Editor – invite Version 1'},
            'GE_TemplateS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^.* Guest Editor"},
            'GE_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.258, Rank Q1) Invitation to Serve as the Guest Editor"},
            'GE_TemplateB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderID': {'section': [], 'label': '默认 GE Reminder Template', 'type': 'select', 'labelPos': 'left', 'options':
                              ['Guest Editor Invitation – 1st Reminder','Guest Editor Invitation – 2nd Reminder','Guest Editor Invitation – 3rd Reminder'], default: 'Guest Editor Invitation – 1st Reminder'},
            'GE_ReminderS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_TemplateID': {'section': [], 'label': '默认 EB Invitation Template', 'type': 'select', 'labelPos': 'left', 'options': ['!Editorial Board Member – Invite Version 1']},
            'EB_TemplateS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^Invitation"},
            'EB_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.258, Rank Q1) Invitation"},
            'EB_TemplateB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_ReminderID': {'section': [], 'label': '默认 EB Reminder Template', 'type': 'select', 'labelPos': 'left', 'options': ['!Editorial Board Member – Reminder']},
            'EB_ReminderS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^Invitation"},
            'EB_ReminderS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.258, Rank Q1) Invitation"},
            'EB_ReminderB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_ReminderB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'Con_Template': {'section': [], 'label': '修改 Conference Template', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Con_TemplateS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "(ISSN 2227-7390)"},
            'Con_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "(ISSN 2227-7390, IF 2.258)"},
            'Con_TemplateB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex] and within the journal newsletter.* website and newsletter."},
            'Con_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ". We would be glad if, in return, you could advertise the journal via the conference website."},
            'LinkShort': {'label': 'SI Webpage 短链接', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'Cfp_checker': {'label': 'Toolkit for CfP Checker', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Hidden_Func': {'label': 'Experimental (Default: OFF)', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
        },
        'events': {
            'save': function() {location.href = location.href},
            'open': function(doc) {
                var f_settings = $("#SusyModifierConfig").contents();
                //Experimental警告
                GM_config.fields.Hidden_Func.node.addEventListener('change', function(){ if(f_settings.find("#SusyModifierConfig_field_Hidden_Func")[0].checked) {
                    alert('Dangerous! \n\nDon\'t turn it on unless you are familiar with ALL susy functions. \nOtherwise, it will cause serious problems.')} });
                //隐藏SI Note WH选项
                if(!GM_config.get('SInote')){ f_settings.find("#SusyModifierConfig_SInoteW_var, #SusyModifierConfig_SInoteH_var").hide() }
                GM_config.fields.SInote.node.addEventListener('change', function(doc){
                    if(f_settings.find("#SusyModifierConfig_field_SInote")[0].checked) { f_settings.find("#SusyModifierConfig_SInoteW_var, #SusyModifierConfig_SInoteH_var").show(); }
                    else { f_settings.find("#SusyModifierConfig_SInoteW_var, #SusyModifierConfig_SInoteH_var").hide(); }
                });
                //隐藏推广信模板
                if(!GM_config.get('ManuscriptFunc')){ f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").hide() }
                GM_config.fields.ManuscriptFunc.node.addEventListener('change', function(doc){
                    if(f_settings.find("#SusyModifierConfig_field_ManuscriptFunc")[0].checked) { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").show(); }
                    else { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").hide() }
                });
                //隐藏Conference Template
                f_settings.find("#SusyModifierConfig_Con_TemplateB2_var").after('<div id="c_br"></div>')
                if(!GM_config.get('Con_Template')) { f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").hide() }
                GM_config.fields.Con_Template.node.addEventListener('change', function(doc){
                    if(f_settings.find("#SusyModifierConfig_field_Con_Template")[0].checked) {
                        f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").show()
                    }
                    else { f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").hide() }
                });
            },
        },
        'css': `#SusyModifierConfig{background-color:#D6EDD9} textarea{font-size:12px;width:180px} .config_var{padding: 5px 10px;display:inline-block;vertical-align:top;} select{width:200px} #SusyModifierConfig_section_1{min-height:70px}
        #SusyModifierConfig_section_0,#SusyModifierConfig_section_2{min-height:40px} #SusyModifierConfig_field_SInoteW,#SusyModifierConfig_field_SInoteH{width:50px}
        #SusyModifierConfig_Interface_sidebar_field_label,#SusyModifierConfig_Manuscriptnote_field_label,#SusyModifierConfig_SIpages_field_label,#SusyModifierConfig_LinkShort_field_label{width:150px;display:inline-block;}
        #SusyModifierConfig_ManuscriptFunc_field_label,#SusyModifierConfig_SInote_field_label{width:200px;display:inline-block;} #SusyModifierConfig_Con_Template_field_label{width:175px;display:inline-block;}
        #SusyModifierConfig_GE_TemplateID_field_label,#SusyModifierConfig_GE_ReminderID_field_label,#SusyModifierConfig_EB_TemplateID_field_label,#SusyModifierConfig_EB_ReminderID_field_label{display:block;}`
    });
    $("#topmenu [href='https://www.mdpi.com/about/']").after("<li><a id='susymodifier_config'>SusyModifier Settings</a></li>"); $("#susymodifier_config").click(function(e) {GM_config.open()});

    var S_J, S_S;
    switch (GM_config.get('Journal')) {
        case 'Mathematics': S_J=154; break;
        case 'None': S_J=-1; break;
    }

    //susy侧边栏的按钮🔎
    if (window.location.href.indexOf("susy.mdpi.com/") > -1 && GM_config.get('Interface_sidebar')){try{
        $("body").append( `<div id='si_search' role='dialog' style='display: none; position: absolute; height: 350px; width: 500px; top: 500px; left: 242.5px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-draggable ui-resizable'>
        <div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle'><span class='ui-dialog-title'>Quick Search</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close'
        onclick='document.getElementById(\"si_search\").style.display=\"none\"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span></button></div><div class='ui-dialog-content ui-widget-content'>
        <form class='insertform' method='get' action='//susy.mdpi.com/special_issue_pending/list/search' target='_blank'><input type='text' name='show_all' value='my_journals' style='display:none;'>
        SI Title: <input type='text' name='form[si_name]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='SI Search'></form><hr>
        <form class='insertform' method='get' action='//susy.mdpi.com/user/ebm-new/management/all/my_journals' target='_blank'>Name: <input type='text' id='form_name2' name='form[name]' style='display:inline-block; width:65%;'><br>
        Email: <input type='email' name='form[email]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='EBM Search'></form><hr>
        <form class='insertform' method='get' action='//susy.mdpi.com/user/conference/list' target='_blank'>Conference: <input type='text' name='form[conference_name]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='Search'></form>`);

        switch (GM_config.get('Interface_SME')) {
            case 'Algebra and Geometry': S_S=915; break;
            case 'Computational and Applied Mathematics': S_S=892; break;
            case 'Difference and Differential Equations': S_S=894; break;
            case 'Dynamical Systems': S_S=891; break;
            case 'Engineering Mathematics': S_S=544; break;
            case 'Financial Mathematics': S_S=895; break;
            case 'Functional Interpolation': S_S=1671; break;
            case 'Fuzzy Set Theory': S_S=893; break;
            case 'Mathematical Biology': S_S=545; break;
            case 'Mathematical Physics': S_S=896; break;
            case 'Mathematics and Computer Science': S_S=555; break;
            case 'Network Science': S_S=557; break;
            case 'Probability and Statistics Theory': S_S=916; break;
            case '':S_S=-1;break;
        }

        if (S_S>0 && S_J>0){
            $(".menu [href='/special_issue_pending/list']").after("<a href='/special_issue_pending/list/online?form[journal_id]=" + S_J + "&form[section_id]=" + S_S + "&show_all=my_journals&sort_field=special_issue_pending.deadline&sort=ASC'>[S]</a>");
            $(".menu [href='/user/managing/status/submitted']").after(" <a href='https://susy.mdpi.com/user/managing/status/all?form[journal_id]=" + S_J + "&form[section_id]=" + S_S + "&sort_field=submission_manuscript_state.last_action&sort=DESC'>[S]</a>");
        }
        if (S_J>0){
            $(".menu [href='/user/managing/status/submitted']").after("<a href='https://susy.mdpi.com/user/managing/status/published?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.publish_date&sort=DESC'>[P]</a>");
            $(".menu [href='/user/managing/status/submitted']").after(" <a href='https://susy.mdpi.com/user/managing/status/production?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.last_action&sort=DESC'>[F]</a>");
            $(".menu [href='/voucher/application/list']").attr("href","/voucher/application/list/my_journal?form[journal_id]=" + S_J);
            $(".menu [href='/user/managing/status/submitted']").attr("href","/user/managing/status/submitted?form[journal_id]=" + S_J);
            $(".menu [href='/user/manage/award_request']").attr("href","/user/manage/award_request?form[journal_id]=" + S_J);
            $(".menu [href='/user/manage/awards_item']").attr("href","/user/manage/awards_item?form[journal_id]=" + S_J);
            $(".menu [href='/si/proposal/list']").attr("href","/si/proposal/list?form[journal_id]=" + S_J);
            $(".menu [href='/list/list_volunteer_reviewers']").attr("href","/list/list_volunteer_reviewers?form[journal_id]=" + S_J);
            $(".menu [href='/tap/list']").attr("href","/tap/list?form[journal_id]=" + S_J);
            $(".menu [href='/topic/proposal/list']").attr("href","/topic/proposal/list?form[journal_id]=" + S_J);
            $(".menu [href='/user/conference/list']").attr("href","/user/conference/list?form[subject_id]=4");
            $(".menu [href='/user/submission_sponsorships/list']").after(" <a href='/user/submission_sponsorships/list/my_journal?form[sponsorship_journal_id]=" + S_J + "'>[J]</a>");
        }
        $(".menu [href='/user/myprofile']").after(" <a href='/user/settings'>[Settings]</a>");
        $(".menu [href='/special_issue_pending/list']").after(" <a href='/special_issue_pending/list?&sort_field=special_issue_pending.date_update&sort=DESC'>Special Issues</a> <a href='/user/sme/status/submitted'>[M]</a>");
        $(".menu [href='/special_issue_pending/list']").text("Manage").attr("href","/special_issue_pending/list/online?sort_field=special_issue_pending.publish_date&sort=DESC")
        $(".menu [href='/submission/topic/list']").after(" <a href='/user/topic/status/submitted'>[M]</a>");
        $(".menu [href='/submission/topic/list']").attr("href","/submission/topic/list/online");
        $(".menu [href='/user/ebm-new/management']").after("<div style='float:right;'><a onclick='$(\"#si_search\").show(); $(\"#si_search\").draggable({handle: \"#mover\"});'><img src='https://susy.mdpi.com/bundles/mdpisusy/img/icon/magnifier.png'></a> </div> ");
    } catch (error){ }}

    //SI和Topic Manuscripts整合
    if (window.location.href.indexOf("//susy.mdpi.com/user/sme/status/") > -1 && GM_config.get('Interface_combine')){
        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href.replace('sme/status','topic/status'),
            onload: function(responseDetails) {
                let parser = new DOMParser();
                let responseDoc = parser.parseFromString(responseDetails.responseText.replace(/\/user\/topic\/status/g,'/user/sme/status'), "text/html").getElementById('manuscripts-list');
                $("#manuscripts-list").after(responseDoc);
            }
        });
    }

    //Manuscript Page 侧边栏紧凑
    if(window.location.href.indexOf("//susy.mdpi.com/") > -1 && GM_config.get('Manuscriptnote')==true){try{
        waitForKeyElements(".manuscript-note-box",SidebarSize);
        function SidebarSize() {
            $(".note-list-container").css("padding","0");
            $(".note-box-component").css("margin-bottom","10px");
            if ($('.special-issue-note-box').length > 0) {
                $(".manuscript-note-box .manuscript-note-item-content, .section-note-box .manuscript-note-item-content").height(200);
                $(".manuscript-note-box .manuscript-note-item-content, .section-note-box .manuscript-note-item-content").css("overflow-y","auto");
            }
        }
    } catch (error){ }}

    //GE Invitation✏️
    if (window.location.href.indexOf("/invite/guest_editor") > -1){try{
        var S_GEID;
        switch (GM_config.get('GE_TemplateID')) {
            case '!Guest Editor – invite Version 1': S_GEID=1518; break;
            case 'Guest Editor - Invite with Benefits and Planned Papers': S_GEID=269; break;
            case 'Guest Editor - Invite Free': S_GEID=873; break;
            case 'Guest Editor - Invite with Discounts': S_GEID=874; break;
            case 'Guest Editor-Invite (Optional)': S_GEID=1151; break;
        }
        $('#emailTemplates').val(S_GEID).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change')); $("span:contains('Select')").text(GM_config.get('GE_TemplateID'));
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        function init() {let t1 = RegExptest(GM_config.get('GE_TemplateS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, GM_config.get('GE_TemplateS2')) );
                         let t2 = RegExptest(GM_config.get('GE_TemplateB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, GM_config.get('GE_TemplateB2')) );}
        document.getElementById("emailTemplates_chosen").scrollIntoView();
        if (S_GEID==269) { $('#mailSubject').parent().after(`<a onclick="document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(/We will gladly waive .+? from the Guest Editor. /, '');">[No Discount]</a>`); }
    } catch (error){ }}

    //GE Reminder✏️
    if (window.location.href.indexOf("/remind/guest_editor") > -1){try{
        var S_GERID;
        switch (GM_config.get('GE_ReminderID')) {
            case 'Guest Editor Invitation – 1st Reminder': S_GERID=1618; break;
            case 'Guest Editor Invitation – 2nd Reminder': S_GERID=1619; break;
            case 'Guest Editor Invitation – 3rd Reminder': S_GERID=1620; break;
        }
        $('#emailTemplates').val(S_GERID).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change')); $("span:contains('Select')").text(GM_config.get('GE_ReminderID'));
        $('#mailSubject').parent().after('<a id="Awaiting"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a>');
        $('#Awaiting').click(function(e) {if ($('#mailSubject').val().indexOf("Awaiting Your Reply")==-1) {$('#mailSubject').val("Awaiting Your Reply: " + $('#mailSubject').val())}});
        function init() {let t1 = RegExptest(GM_config.get('GE_ReminderS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, GM_config.get('GE_ReminderS2')) );
                         let t2 = RegExptest(GM_config.get('GE_ReminderB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, GM_config.get('GE_ReminderB2')) );}
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        document.getElementById("emailTemplates_chosen").scrollIntoView();
    } catch (error){ }}

    //EB invitation✏️
    if (window.location.href.indexOf("present_editor_ebm/invite_email") > -1){try{
        let firstid = $('#emailTemplates :contains("Editorial")').val();
        $('#emailTemplates').val(firstid).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change'));
        function init() {let t1 = RegExptest(GM_config.get('EB_TemplateS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, GM_config.get('EB_TemplateS2')) );
                         let t2 = RegExptest(GM_config.get('EB_TemplateB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, GM_config.get('EB_TemplateB2')) );}
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        document.getElementById("emailTemplates").scrollIntoView();
        $('#mailSubject').parent().after('<a id="No_Discount">[No Discount]</a>');
        $('#No_Discount').click(function(e) {
            $('#mailBody').val($('#mailBody').val().replace('you will have the opportunity to publish one paper free of charge in Mathematics per year, and can also publish extra papers with special discounts.\n\n','')
                               .replace('Additionally, we would like to invite you to publish one paper per year—this will be free of charge once accepted for publication. ','').replace(/\nPlease click on the following link .*?\nhttp.*?\n/g,''))});
    } catch (error){ }}

    //EB Reminder✏️
    if (window.location.href.indexOf("present_editor_ebm/remind_email") > -1){try{
        function init() {let t1 = RegExptest(GM_config.get('EB_ReminderS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, GM_config.get('EB_ReminderS2')) );
                         let t2 = RegExptest(GM_config.get('EB_ReminderB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, GM_config.get('EB_ReminderB2')) );}
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        document.getElementById("emailTemplates").scrollIntoView();
    } catch (error){ }}

    //文章处理页面[Voucher]按钮和发送推广信按钮
    if (window.location.href.indexOf("/process_form/")+window.location.href.indexOf("/production_form/") > -2 && GM_config.get('ManuscriptFunc')){try{
        let Promote='', email=[], name=[];
        let m_id = $("#manuscript_id").parent().text().trim();
        let m_section = $("div.cell.small-12.medium-6.large-2:contains('Section') + div").text().trim();
        let m_si = $("div.cell.small-12.medium-6.large-2:contains('Special Issue') + div").text().trim();
        let corresponding=$("b:contains('*')").parent("td").next().last().text().trim();

        $("table [title|='Google Scholar']").each(function( index ) {
            name[index] = $(this).parent().prev().text().trim() + " " + $(this).parent().children("b").first().text().trim();
            email[index] = $(this).parent().next().text().trim();
            $(this).before('<a href="mailto:'+email[index]+'?subject=[Mathematics] (IF 2.258, ISSN 2227-7390) Promote Your Published Papers&body=' +
                           GM_config.get('Template_Paper').replace(/\n/g,"%0A").replace(/"/g,"&quot;").replace(/%m_id%/g,m_id).replace(/%m_section%/g,m_section).replace(/%name%/g,name[index]) + '"><img src="/bundles/mdpisusy/img/icon/mail.png"></a> ');
        });

        $("[title|='Send email to authors']").before('<a id="linkedin" href="mailto:' + email.join(";") + '?subject=[Mathematics] Manuscript ID: '+ m_id +' - Your Paper is Promoted via Mathematics Social Media&body=' + GM_config.get('Template_Linkedin')
                                                     .replace(/\n/g,"%0A").replace(/"/g,"&quot;").replace(/%m_id%/g,m_id).replace(/%m_section%/g,m_section) + '"><img src="https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a" alt="[LinkedIn]"></a> ')
        if (window.location.href.indexOf("?linkedin") > -1) {$("#linkedin")[0].click(); history.back();}
        $("[title='Google']").before(' <a href="https://www.researchgate.net/search.Search.html?type=publication&query='+$("[title='Google']").prev().text()+
                                     '" title="Researchgate" target="_blank"><img style="vertical-align: middle;" src="https://c5.rgstatic.net/m/41542880220916/images/favicon/favicon-16x16.png"></a> ');
        $("[class|='margin-horizontal-1']").after(`<form id='vf' class='insertform' method='post' target='_blank' style='display:none;'><input name='form[journal_id]' value='154'><input name='form[is_percentage]' value='1'><input name='form[special_issue_id]'>`
                                                  + `<input name='form[emails]'><input name='form[valid_months]' value='12'><input name='form[section_id]'><input name='form[reason]'><input name='form[manuscript_id]'> </form>`);
        $("[class|='margin-horizontal-1']").after(`<div id="voucher" style="display:inline-block;"><a style="color:#4b5675;">[Vouchers]</a> <div style="position:absolute;background-color: #f1f1f1;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);display: none;">`
                                                  + `<a id="v_si" style="display:block;padding: 8px 12px;text-decoration: none;color:black;">Special Issue</a><a id="v_eb" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">EBM</a>`
                                                  + `<a id="v_ec" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">Exception Case</a></div></div> `);
        $("#voucher").mouseover(function(){ $(this).children("div").show() });
        $("#voucher").mouseout(function(){ $(this).children("div").hide() });
        $('head').append('<style>#voucher a:hover {background-color: #ddd;}</style>');

        if (!m_si) {$("#v_si").remove()}; if (!m_section) {$("#v_eb").remove()};
        $("#voucher>div>a").click(function(){
            switch ($(this).attr("id")) {
                case 'v_eb': $("#vf").attr("action","https://susy.mdpi.com/voucher/application/create?waiverApplyForm[types]=5"); $("[name='form[reason]']").val("Paper by editorial board member"); break;
                case 'v_si': $("#vf").attr("action","https://susy.mdpi.com/voucher/application/create?waiverApplyForm[types]=6"); break;
                case 'v_ec': $("#vf").attr("action","https://susy.mdpi.com/voucher/application/create?waiverApplyForm[types]=7"); break;
            }
            $("[name='form[emails]']").val(corresponding);
            $("[name='form[manuscript_id]']").val(m_id);

            if (!!m_section) {
                let xhr = new XMLHttpRequest(), s_search = new RegExp('(\\d*)[^0-9]:[^0-9]' + m_section.replace(/\(/g,"\\\(").replace(/\)/g,"\\\)"), '');
                xhr.open('GET', 'https://susy.mdpi.com/list/journal/154/sections', false); xhr.send();
                let s_result = $("<div/>").html(xhr.responseText).text().match(s_search);
                if (!!s_result) {$("[name='form[section_id]']").val(s_result.pop())};
            }
            if (!!m_si) {
                let xhr = new XMLHttpRequest(), s_search = new RegExp('(\\d*)[^0-9]:[^0-9]' + m_si.replace(/\(/g,"\\\(").replace(/\)/g,"\\\)"), '');
                xhr.open('GET', 'https://susy.mdpi.com/list/journal/154/section/0/all_special_issues', false); xhr.send();
                let s_result = $("<div/>").html(xhr.responseText).text().match(s_search);
                if (!!s_result) {$("[name='form[special_issue_id]']").val(s_result.pop())};
            }
            $("#vf").submit();
        });
    } catch (error){ }}

    //特刊列表免翻页⚙️
    if (window.location.href.indexOf("susy.mdpi.com/special_issue_pending/list") > -1 && window.location.href.indexOf("page=") == -1 && GM_config.get('SIpages')==true){try{
        let maxpage = 20, totalpage = Math.min(maxpage,parseInt($('li:contains("Next")').prev().text()));
        function doXHR(counter) {
            if (counter < totalpage+1) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: $(".pagination.margin-0 a:contains('2')").attr("href").replace(/page=2/gi,"page="+counter),
                    onload: function(response) {
                        var $jQueryObject = $('#statustable',$.parseHTML(response.responseText));
                        $($jQueryObject).attr('id','statustable'+counter);
                        $('#statustable').parent().append($jQueryObject);
                        doXHR(counter+1);
                    }
                });
            }
            if (counter == maxpage+1){$('#statustable').parent().append("<br><br>Only List " + maxpage + " Pages.<br><br>");}
        }
        doXHR(2);
        if (S_J>0) {$("[href='/special_issue_pending/list?show_all=my_journals']").attr('href',"/special_issue_pending/list/online?form[journal_id]=" +S_J+ "&show_all=my_journals");}
    } catch (error){ }}

    //特刊页面➕按钮、Note
    if (window.location.href.indexOf("susy.mdpi.com/submission/topic/view")+window.location.href.indexOf("susy.mdpi.com/special_issue/process") > -2){try{
        if(GM_config.get('SInote')) {
            waitForKeyElements("#special_issue_notesText, #topic_notesText",SINotes);
            function SINotes() {
                $("#manuscript-special-issue-notes").css("height",GM_config.get('SInoteH')+"px");
                $("[aria-describedby|='manuscript-special-issue-notes']").css("width",GM_config.get('SInoteW')+"px");
                $("#special_issue_notesText, #topic_notesText").css("height",GM_config.get('SInoteH')-100 +"px");
            }
        }
        $('#si-update-emphasized').before('<a href="?pagesection=AddGuestEditor" title="Add Guest Editor">➕</a> ');
        if(GM_config.get('Hidden_Func')) {
            $('#si-update-emphasized').before('<a href="'+$('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/","/special_issue/reset_status/")+'" title="Reset"><img border="0" src="/bundles/mdpisusy/img/icon/arrow-180.png"></a> ');
            $('#si-update-emphasized').before('<a href="'+$('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/","/special_issue/close_invitation/")+'" title="Close">🆑</a> ');
            $(".input-group-button").append('&nbsp; <input type="button" class="submit add-planned-paper-btn" value="Force Add">');
            $("#guestNextBtn").after(' <input id=eltry style=display:inline-block type=button class=submit value=Experimental><input id=eltry_stop style=display:none type=button class=submit value=Stop><input id=eltry_stopbox style=display:none type=checkbox>');
            $("#eltry_stop").click(eltry_stop); function eltry_stop (zEvent) {$("#eltry_stopbox").prop('checked',true)};
            $("#eltry").click(sk_eltry); function sk_eltry (zEvent) {
                var eltry_email = $("#form_email").val();
                $("#eltry_stop").css("display","inline-block"); $("#eltry").css("display","none");
                $("#guestNextBtn").click();
                waitForKeyElements("#specialBackBtn", sk_eltry_check, true);
                function sk_eltry_check() {
                    setTimeout(() => {
                        if (document.getElementById('process-special-issue-guest-editor') !=null) {
                            document.getElementById("process-special-issue-guest-editor").click()
                        } else if ($("#eltry_stopbox").prop("checked")) {
                            $("#eltry_stop").css("display","none"); $("#eltry").css("display","inline-block");
                        } else {
                            document.getElementById("specialBackBtn").click(); document.getElementById("form_email").value=eltry_email;
                            sk_eltry();
                        }}, 1500)
                }
            }
        }
        $('div.cell.small-12.medium-6.large-2:contains("Online Date")').next().css({"background-color":"yellow"});
        $("#form_checklist_1").before("<a id='select_all'>[Select All]</a><br>"); $("#select_all").click( function(){$("#si-cfp-form [type=\'checkbox\']").prop("checked",true)} );
    } catch (error){ }}

    //默认新建特刊位置和Title Case
    if (window.location.href.indexOf("susy.mdpi.com/user/special_issue/edit/") > -1){try{
        $("#form_name").after("<a id='TitleCaseChicago'>🔡(Chicago)🔠</a> "); //brettterpstra.com/titlecase/?title
        $("#TitleCaseChicago").click(function () {
            if ($("#form_name").val().length > 1) {
                (async () => {
                    $("#form_name").prop("disabled", true);
                    var result="";
                    let response = await p_get("https://titlecaseconverter.com/tcc/?title=" + encodeURIComponent($("#form_name").val()) + "&preserveAllCaps=true&styleC=true");
                    let jsonarray= $.parseJSON(response.responseText);
                    jsonarray[0].title.forEach(element => {result = result + element.joint + element.word});
                    $("#form_name").val(result);
                    $("#form_name").prop("disabled", false);
                })()
            }
        });
        if (window.location.href.indexOf("/edit/0") > -1 && S_J>0) { $('#form_id_journal').val(S_J).change(); $("#form_id_journal_chosen>a>span").text(GM_config.get('Journal')); document.getElementById('form_id_journal').dispatchEvent(new CustomEvent('change'));}
    } catch (error){ }}

    //默认新建EBM位置
    if (window.location.href.indexOf("susy.mdpi.com/user/ebm-new/management") > -1){try{
        if (S_J>0){
            $("#journal_id").val(S_J); $("#role_id").val(9); $("#journal_id_chosen>a>span").text(GM_config.get('Journal'));
            $("[href='/user/ebm-new/management/pending_invitation/my_journals").attr("href","/user/ebm-new/management/pending_invitation/my_journals?form[journal_id]=" +S_J);
        }
        if (GM_config.get('Hidden_Func')){$("#ebm_pending_check_btn").after(' <input class="submit" type="submit" value="Force Proceed"> ');}
    } catch (error){ }}

    //特刊网页短链接
    if (window.location.href.indexOf("mdpi.com/journal/mathematics/special_issues/") > -1 && window.location.href.indexOf("/abstract") == -1 && GM_config.get('LinkShort')){try{
        window.location.href=window.location.href.replace(/\/journal\/mathematics\/special_issues\//,"/si/mathematics/");
    } catch (error){ }}

    //会议相关
    if (window.location.href.indexOf("mdpi.com/user/conference/") > -1 && window.location.href.indexOf("/view") > -1){try{$("[name=journal_id]").val(S_J);} catch (error){ }}
    if (window.location.href.indexOf("susy.mdpi.com/user/conference/add") > -1) {
        $("#form_conference_organization").val(2).trigger("change"); $("#form_conference_organization_chosen span").text("Societies, Universities or University professors");
        $("[id^=form_checklist]").parent().parent().show(); $("[id^=form_commercial],[id^=form_conference_commercial]").parent().parent().hide(); $("[id^=form_checklist],[id^=form_commercial_checklist]").prop("checked",true);
        if (S_J = 154) { $("#form_subject_id").val(4); $("#form_subject_id_chosen span").text("Computer Science & Mathematics") }
    }
    if (window.location.href.indexOf("mdpi.com/user/send/conference_journal/contact_mail") > -1 && GM_config.get('Con_Template')){try{
        function init() {let t1 = RegExptest(GM_config.get('Con_TemplateS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, GM_config.get('Con_TemplateS2')) );
                         let t2 = RegExptest(GM_config.get('Con_TemplateB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, GM_config.get('Con_TemplateB2')) );}
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        $('#mailSubject').parent().after('<div><a id="First_Line">[First Line]</a><br><br><a id="Del_Proceedings">[Del Proceedings]</a></div>');
        $('#First_Line').click(function() {$('#mailBody').val("Dear Conference Committee,\nTo Whom It May Concern,\n"+$('#mailBody').val()) });
        $('#Del_Proceedings').click(function() {$('#mailBody').val($('#mailBody').val().replace(/\n(.*?)https:\/\/www.mdpi.com\/about\/proceedings(.*?)\n/g,'')) });
    } catch (error){ }}

    //CfP Checker
    if (window.location.href.indexOf("//redmine.mdpi.") > -1 && GM_config.get('Cfp_checker')){try{
        //Always: Redmine重定向
        if(window.location.href.indexOf("//redmine.mdpi.com/") > -1){window.location.replace(decodeURIComponent(window.location.href.split("login?back_url=")[window.location.href.split("login?back_url=").length-1]).replace("//redmine.mdpi.com/","//redmine.mdpi.cn/"));}
        if(window.location.href.indexOf("//redmine.mdpi.cn//") > -1){window.location.replace(decodeURIComponent(window.location.href.replace(".cn//",".cn/")));}
        //排队界面
        if(window.location.href.indexOf("/projects/si-planning/issues?utf8=")>-1){$('[href="/users/64"]').css("background-color","yellow"); $('h2:contains("Issues")').append(" <span style=background-color:#ff0>("+$('[href="/users/64"]').length+" pending CfP Team)</span>");}
        //CfP filter链接
        $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/si-planning/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]==&v[status_id][]=13&f[]=cf_10&op[cf_10]==&v[cf_10][]=Mathematics`
                                 + `&f[]=&c[]=cf_25&c[]=cf_10&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&sort=updated_on%3Adesc&per_page=100'>[Maths CfP]</a>`)
        //Checker功能和检测函数
        $('label:contains("From CFP Checkers")').after(" <a id='S_C'><u>[Start Check]</u></a>"); $("#S_C").click(sk_cfpcheck_func);
        function sk_cfpcheck_func (zEvent) {
            let Today=new Date();
            $("#issue_pe_note").val($("#issue_pe_note").val()+"--- Checked on " + Today.getFullYear()+ "-" + (Today.getMonth()+1) + "-" + Today.getDate() + " ---\n");
            if($(".subject").eq(0).text().indexOf("[Mathematics]") == -1) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find [Mathematics]\n")}

            (async () => {
                var result="";
                let response = await p_get("https://titlecaseconverter.com/tcc/?title=" + encodeURIComponent($(".subject").eq(0).text().trim()) + "&preserveAllCaps=true&styleC=true");
                let jsonarray= $.parseJSON(response.responseText);
                jsonarray[0].title.forEach(element => {result = result + element.joint + element.word});
                if(result.match(/[a-zA-Z]*/g).join("") != $(".subject").eq(0).text().match(/[a-zA-Z]*/g).join("")) { $("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ TitleCase Is Inconsistent with Chicago Style: " + result.trim() + "\n") }
            })()

            let DDL = new Date($("th:contains('Special Issue Deadline:')").next().text())
            if(Math.ceil((DDL - Today) / (1000 * 60 * 60 * 24)) < 90) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ Deadline is less than 3 months.\n")}
            if(Math.ceil((DDL - Today) / (1000 * 60 * 60 * 24)) > 365) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Deadline is longer than 12 months.\n")}

            if($(".subject").eq(0).text().indexOf("New CFP Request") > -1){ //未延期特刊
                if($('a:contains("mailing-list.v1")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ Cannot find mailing-list.v1\n")}
                if($('a:contains("cfp-approval.v1.pdf")').length+$('a:contains("cfp-approval.v1.eml")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find cfp-approval.v1.eml (or pdf)\n")}
                if($('a:contains("mailing-list.v1")').length*($('a:contains("cfp-approval.v1.pdf")').length+$('a:contains("cfp-approval.v1.eml")').length)>0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"✅ First Round CfP\n")}
                GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v1")').attr('href'), )
            }
            else if ($(".subject").eq(0).text().indexOf("Extended SI") > -1) { //已延期特刊
                let old_request=$("strong:contains('Please change the issue status to ')").parent().parent();
                let old_DDL = new Date(old_request[old_request.length-1].textContent.match(/Deadline: [0-9,-]*/)[0].replace("Deadline: ",""));
                if(DDL-old_DDL < 86400000 * 30) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ The deadline between 2nd and 1st CfP is too close.\n")}
                if($('a:contains("mailing-list.v3")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ Cannot find mailing-list.v3\n")}
                if($('a:contains("cfp-approval.v2.pdf")').length+$('a:contains("cfp-approval.v2.eml")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find cfp-approval.v2.eml (or pdf)\n")}
                if($('a:contains("mailing-list.v3")').length*($('a:contains("cfp-approval.v2.pdf")').length+$('a:contains("cfp-approval.v2.eml")').length)>0) {
                    $("#issue_pe_note").val($("#issue_pe_note").val()+"✅ Extended SI CfP\n")
                    GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v1")').attr('href'), )
                    GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v3")').attr('href'), )
                }
            }
            else { //名称不规范
                $("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Subject is Wrong.\n")
            }

            if($(".assigned-to").text().indexOf("CfP") == -1) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Assignee is not CfP/MDPI\n")};
        }
    } catch (error){ }}

    //Always: Mailsdb样式⚙️🔝
    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/search/emails") > -1){try{
        $("head").append('<link rel="stylesheet" type="text/css" href="/assets/application-79a8659b0064dad9845d4ec2f290c6e94795079e79a99ab4354776213eb35db0.css">');
        $("head").append(`<style>table{width:80%}.colorgray{color:gray!important}.bgcoloref{background:#efefef!important}#user-info .user-info-section{margin-bottom:10px}#user-info span.email{font-weight:400;color:#103247}#user-info span.number{font-weight:400;color:#123}
                    #user-info a{color:#00f}#user-info a:visited{color:#cd7e53}#user-info a:hover{color:#47566d}#user-info table{margin-left:2%;width:98%;background:#99a4b5;margin-bottom:10px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;font-size:14px}
                    #user-info table tr th{text-align:left;background:#4f5671;color:#fefefe;font-weight:400;border-left:1px solid #ccc;border-top:1px solid #ccc;padding:.2rem}#user-info table tr td{border-left:1px solid #ccc;border-top:1px solid #ccc;padding:.2rem;
                    background:#fefefe} #user-info table tr td span.msid{color:#4e6c88;font-weight:400}#user-info table tr td.title{width:50%}#user-info table tr td.journal{width:10%;text-align:center}#user-info table tr td.status{width:10%;text-align:center}
                    #user-info table tr td.submission-date{width:10%;text-align:center}#user-info table tr td.invoice-info{width:10%;text-align:center}#user-info table tr td.invoice-payment-info{width:10%;text-align:center}</style>`);
        document.body.innerHTML = document.body.innerHTML.replace(/ data-url=/g,' href=').replace(/ data-load-url=/g,' href=');

        var susycheck = "https://susy.mdpi.com/user/info?emails="+ window.location.href.match(/search_content=(\S*)/)[1];
        if (susycheck.indexOf("@") > -1){
            GM_xmlhttpRequest({
                method: 'GET',
                url: susycheck,
                onload: function(responseDetails) {
                    $("body").prepend("<p>⬆️ ⬆️ ⬆️ ⬆️ ⬆️</p>");
                    $("body").prepend(responseDetails.responseText.replace(/href="\//g,"href=\"//susy.mdpi.com/").replace(/ data-url=/g,' href=').replace(/ data-load-url=/g,' href='));
                } });

            susycheck = "https://susy.mdpi.com/user/guest_editor/check?email="+ window.location.href.match(/search_content=(\S*)/)[1] +"&special_issue_id=1";
            GM_xmlhttpRequest({
                method: 'GET',
                url: susycheck,
                onload: function(responseDetails) {
                    $("body").prepend("<p>⬆️ ⬆️ ⬆️ ⬆️ ⬆️</p>");
                    var $jQueryObject = $($.parseHTML(responseDetails.responseText.replace(/data-load-url="\/user/g,'data-load-url="//susy.mdpi.com/user')));
                    $("body").prepend($jQueryObject);
                } });
        }
    } catch (error){ }}

    //Always: Reviewer checking样式⚙️
    if (window.location.href.indexOf("reviewer/checking/") > -1){try{
        GM_xmlhttpRequest({
            method: 'GET',
            url: $("a:contains('Edit Reviewer')").attr("href").replace(/reivewer\/managment\/edit/g, 'list/reviewer/invitations-history'),
            onload: function(responseDetails) {
                $("body").append(responseDetails.responseText.replace(/href="\//g,"href=\"//susy.mdpi.com/"));
            } });
        function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
        $(".morphNotes").first().before(" <a href='https://scholar.google.com/scholar?hl=en&q=" + getUrlParam('email') +"'><img style='vertical-align: middle;' src='/bundles/mdpisusy/img/design/google_logo.png'></a> ");
        $("a:contains('see more')").attr('href',$("a:contains('see more')").attr('data-uri'));
    } catch (error){ } }

    //Hidden_Func: MRS ALL journals
    if(window.location.href.indexOf("//mrs.mdpi.com/data/role/") > -1 && GM_config.get('Hidden_Func')){try{
        $('#demo-form2').before(` <a onclick='$("#journal > option")[0].value="250,77,145,362,13,524,534,341,456,390,90,480,517,491,523,35,118,471,323,47,82,346,67,427,240,103,515,299,305,143,487,531,441,123,26,214,440,467,213,176,416,259,428,385,356,142,151,`
                                + `84,404,306,397,127,449,7,402,5,412,83,509,192,301,42,492,275,395,19,460,53,25,413,409,453,79,474,481,163,50,225,215,148,221,355,203,499,37,51,435,170,290,49,432,199,14,407,231,154,81,92,59,522,465,438,314,457,365,359,360,444,`
                                + `165,419,511,358,436,271,353,16,252,114,162,130,206,246,3,233,265,528,518,414,173,296,466,294,15,376,44,131,417,150,276,133,228,291,269,36,504";'>[All Journal]</a>`);
    } catch (error){ }}

    //Hidden_Func: Paper Rejection
    if(window.location.href.indexOf("assigned/reject-manuscript/") > -1 && GM_config.get('Hidden_Func')){try{ $('#emailTemplates').val(77).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change')); } catch (error){ }}

    //Hidden_Func: Remind 2nd Round Reviewer
    if (window.location.href.indexOf("assigned/remind_reviewer") > -1 && GM_config.get('Hidden_Func')){try{
        $('#emailTemplates').val(21).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change'));
    } catch (error){ }}

    //Always: Reviewer Information is not required
    if(window.location.href.indexOf("//susy.mdpi.com/reivewer/create") > -1){try{
        $("#form_affiliation, #form_country, #form_research_keywords").attr("required",false);
        $("#form_url").val(".");
        $('[for="form_affiliation"]>span, [for="form_url"]>span, [for="form_country"]>span, [for="form_research_keywords"]>span').remove();
    } catch (error){ }}

    //Always: Manuscript Notes in Summary Page
    if(window.location.href.indexOf("//susy.mdpi.com/manuscript/summary") > -1){try{
        $("#maincol").after('<div id="manuscript_note_offcanvas" class="hide-note-offcanvas"></div>');
        $.get("https://susy.mdpi.com/user/nots_of_manuscript/"+window.location.href.match("summary/(.*?)(/|$)")[1], function(res) {
            if (res.show_off_canvas) {
                $('#manuscript_note_offcanvas').html(res.note_html);
                $('#manuscript_note_offcanvas').removeClass('hide-note-offcanvas');
                $('#manuscript_note_offcanvas').find('.manuscript-id').show();
            }
        });
    } catch (error){ }}

    //Always: Mailsdb登陆
    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/login") > -1){try{ $("[name=p_s]").attr('checked',true); $("#check-rem").attr('checked',true); } catch (error){ }}

    //Always: Manage Voucher Applications + 页面最底端
    if(window.location.href.indexOf("//susy.mdpi.com/voucher/application/list/") > -1){try{ document.getElementById("show-more-budgets").click();} catch (error){ }}
    if(window.location.href.indexOf("//susy.mdpi.com/voucher/application/view/") > -1){try{ waitForKeyElements(".user_box_head", voucher_scroll, false); function voucher_scroll(){scroll(0,document.body.scrollHeight)}; } catch (error){ }}

    //Always: Editor Decision 返回处理界面
    if (window.location.href.indexOf("decision/process_form/") > -1){try{
        $("div.cell.small-12.medium-6.large-2:contains('Manuscript ID')").next().append(`<a href="/user/assigned/process_form/`+$("a:contains('Download Manuscript')").attr("href").match("displayFile/(.*?)(/|$)")[1]+`">[Back to Manuscript]</a>`)
    } catch (error){ }}

    //Always: Google Scholar校正
    if (window.location.href.indexOf("&amp;") > -1 && window.location.href.indexOf("google") > -1){try{
        var new_uri, old_uri = window.location.search;
        for (let i = 1; i < 5; i++){ new_uri = $("<div />").html(old_uri).text(); if (new_uri==old_uri) {break;} else {old_uri = new_uri} }
        let searchParams = new URLSearchParams(new_uri)
        if(searchParams.has('user')) {window.location.href="https://scholar.google.com/citations?hl=en&user="+searchParams.get('user')}
    } catch (error){ }}

    //ManuscriptFunc: 文章页面加[Linkedin]
    if (window.location.href.indexOf("www.mdpi.com/2227-7390/") > -1 && GM_config.get('ManuscriptFunc')){try{
        $("a:contains('Peer-Reviewed')").parent().after('<a id="s_linkedin" href="' + $("a:contains('Peer-Reviewed')").attr("href") +'?linkedin"><img src="https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a"></a>');
        $("#s_linkedin").click(function() {$("#container").after(`<div class="ui-widget-overlay ui-front" style="background: #aaaaaa;opacity: .5;filter: Alpha(Opacity=50);position: fixed;top: 0;left: 0;width: 100%;height: 100%;"></div>`)});
    } catch (error){ }}
})();

function waitForKeyElements(selectorTxt,actionFunction,bWaitOnce,iframeSelector) {
    var targetNodes,btargetsFound;if(typeof iframeSelector=="undefined") {targetNodes=$(selectorTxt);} else targetNodes=$(iframeSelector).contents().find(selectorTxt);if(targetNodes&&targetNodes.length>0){btargetsFound=!0;targetNodes.each(function(){var jThis=$(this);
    var alreadyFound=jThis.data('alreadyFound')||!1;if(!alreadyFound){var cancelFound=actionFunction(jThis);if(cancelFound) {btargetsFound=!1;} else jThis.data('alreadyFound',!0)}})}else{btargetsFound=!1} var controlObj=waitForKeyElements.controlObj||{};
    var controlKey=selectorTxt.replace(/[^\w]/g,"_");var timeControl=controlObj[controlKey];if(btargetsFound&&bWaitOnce&&timeControl){clearInterval(timeControl);delete controlObj[controlKey]}else{if(!timeControl){timeControl=setInterval(function()
    {waitForKeyElements(selectorTxt,actionFunction,bWaitOnce,iframeSelector)},300);controlObj[controlKey]=timeControl}}; waitForKeyElements.controlObj=controlObj }

function waitForText(element, text, callback, freq) {
    let interval = window.setInterval(test, freq || 200); if (!element || !callback || typeof text !== 'string') {throw new TypeError('Bad value');}
    function test() {
        if (!element.parentNode) {window.clearInterval(interval);}
        if (element.value.indexOf(text) > -1) { window.clearInterval(interval); callback.call(element);}
    }
}

function p_get(url) { return new Promise(resolve => { GM_xmlhttpRequest({ method: "GET", url: url, onload: resolve }); }) }

function RegExptest(str) {if (str.indexOf("[Regex]")==0) {return RegExp(str.substring(7), "g");} else {return str} };
