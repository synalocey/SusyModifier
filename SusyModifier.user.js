// ==UserScript==
// @name          Susy Modifier
// @version       2.4.23
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Susy Modifier
// @author        Syna
// @icon          https://susy.mdpi.com/bundles/mdpisusy/img/icon_old/favicon-196x196.png
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @match         https://*.mdpi.com/*
// @match         https://*.scopus.com/*
// @match         *://scholar.google.co.uk/*&amp;user*
// @match         *://scholar.google.com/*&amp;user*
// @match         *://scholar.google.com.hk/*&amp;user*
// @match         *://scholar.google.com.tw/*&amp;user*
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require       https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements, GM_config */

(function() {
    'use strict';
    GM_config.init({
        'id': 'SusyModifierConfig',
        'title': 'Settings of SusyModifier v'+GM_info.script.version,
        'fields':  {
            'Interface_sidebar': {'section': [],'label': 'Susy侧边栏按钮', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'Interface_SME': {'label': 'I am SME of', 'type': 'select', 'labelPos': 'left', 'options': ['','Algebra and Geometry','Computational and Applied Mathematics','Difference and Differential Equations','Dynamical Systems','Engineering Mathematics','Financial Mathematics','Functional Interpolation','Fuzzy Set Theory','Mathematical Biology','Mathematical Physics','Mathematics and Computer Science','Network Science','Probability and Statistics Theory'], 'default': ''},
            'Journal': {'label': 'of Journal', 'type': 'select', 'labelPos': 'left', 'options': ['Mathematics', 'None'], 'default': 'Mathematics'},
            'Interface_combine': {'label': 'Topic Manuscripts整合进SI Manuscripts', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Manuscriptnote': {'section': [],'label': 'Manuscript Page 侧边栏紧凑', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'ManuscriptFunc': {'label': '快捷申请优惠券和发送推广信按钮', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'Template_Linkedin': {'label': 'LinkedIn推广信模板', 'type': 'textarea', 'default': 'Dear Authors,\n\nHope this email finds you well. Your manuscript %m_id% is promoted by the Mathematics "%m_section%" Section LinkedIn account. Welcome to like, share, send and comment on it.\n\nFind us and receive more information in the section "%m_section%" of Mathematics:\n[Links]\n\nPlease do not hesitate to let us know if you have questions.'},
            'Template_Paper': {'label': '文章推广信模板', 'type': 'textarea', 'default': 'Dear %name%,\n\nThank you very much for your contribution to /Mathematics/, your manuscript %m_id% is now under review. We will keep you informed about the status of your manuscript.\n\nIn addition, you have published a paper/papers in /Mathematics/ in the past two years with the citation of about XX times. Based on your reputation and research interests, we believe that your results should attract more citations and attention. Therefore, could you please promote the paper/papers to your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?\n\nIn addition, you have published a paper/papers in /Mathematics/ in 20XX with the citation of XXXXX times, congratulations on your great work!\nTo encourage open scientific discussions and increase the visibility of your results, could you please promote the paper/papers to your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?\n\n1. [paper link]\n2. [paper link]\n\nThank you in advance for your support.'},
            'SIpages': {'section': [], 'label': '特刊列表显示所有特刊', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'SInote': {'label': 'Special Issue Note 界面变大', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'SInoteW': {'label': 'SI Note Width', 'labelPos': 'left', 'type': 'int', 'default': 500},
            'SInoteH': {'label': 'SI Note Height', 'labelPos': 'left', 'type': 'int', 'default': 1000},
            'LinkShort': {'label': 'SI Webpage 短链接', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'GE_TemplateID': {'section': [], 'label': '默认 GE Invitation Template', 'type': 'select', 'labelPos': 'left', 'options': ['!Guest Editor – invite Version 1','Guest Editor - Invite with Benefits and Planned Papers','Guest Editor - Invite Free','Guest Editor - Invite with Discounts','Guest Editor-Invite (Optional)'], default: '!Guest Editor – invite Version 1'},
            'GE_TemplateS1': {'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "Invitation to Serve as"},
            'GE_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.258, Rank Q1) Invitation to Serve as"},
            'GE_TemplateB1': {'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderID': {'section': [], 'label': '默认 GE Reminder Template', 'type': 'select', 'labelPos': 'left', 'options': ['Guest Editor Invitation – 1st Reminder','Guest Editor Invitation – 2nd Reminder','Guest Editor Invitation – 3rd Reminder'], default: 'Guest Editor Invitation – 1st Reminder'},
            'GE_ReminderS1': {'label': 'Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderB1': {'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_TemplateS1': {'section': [], 'label': '[EBM Invitation] Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "Invitation to Join"},
            'EB_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.258, Rank Q1) Invitation to Join"},
            'EB_TemplateB1': {'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_ReminderS1': {'section': [], 'label': '[EBM Reminder] Replace Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "Invitation to Serve as"},
            'EB_ReminderS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.258, Rank Q1) Invitation to Serve as"},
            'EB_ReminderB1': {'label': 'Replace Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_ReminderB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'Mailsdb_old': {'section': [],'label': '默认旧版Mailsdb', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Cfp_checker': {'label': '开启Toolkit for CfP Cheker', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Hidden': {'section': [], 'label': 'Hidden', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
        },
          'events': {'save': function() {location.href = location.href}},
        'css': '.config_var{padding: 10px;display:inline-block;} #SusyModifierConfig_field_SInoteW,#SusyModifierConfig_field_SInoteH{width:50px} #SusyModifierConfig_Hidden_var{display: none !important;}'
    });
    $("#topmenu >>> [href='https://www.mdpi.com/about/']").after("<li><a id='susymodifier_config'>SusyModifier Settings</a></li>"); $("#susymodifier_config").click(function(e) {GM_config.open()});

    var S_J;
    switch (GM_config.get('Journal')) {
        case 'Mathematics': S_J=154; break;
        case 'None': S_J=-1; break;
    }

    //susy侧边栏的按钮🔎
    if (window.location.href.indexOf("susy.mdpi.com/") > -1 && GM_config.get('Interface_sidebar')){try{
        var S_S, siappend="<div id='si-search' tabindex='-1' role='dialog' style='display: none; position: absolute; height: 300px; width: 500px; top: 500px; left: 242.5px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-draggable ui-resizable' aria-describedby='display-user-info'><div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle'><span class='ui-dialog-title'>Quick Search</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close' title='Close' onclick='document.getElementById(\"si-search\").style.display=\"none\"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div><div id='display-user-info' data-url='/user/info' class='ui-dialog-content ui-widget-content' style='width: auto; min-height: 0px; max-height: none; height: 512px;'><form class='insertform' method='get' action='https://susy.mdpi.com/special_issue_pending/list/search' target='_blank'><input type='text' name='show_all' value='my_journals' style='display:none;'>SI Title: <input type='text' name='form[si_name]' id='si-search2' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='SI Search'></form><hr> <form class='insertform' method='get' action='https://susy.mdpi.com/user/ebm-new/management/all/my_journals' target='_blank'>Name: <input type='text' id='form_name2' name='form[name]' style='display:inline-block; width:65%;'><br>Email: <input type='email' id='form_email2' name='form[email]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='EBM Search'></form><hr>";
        $("body").append(siappend);
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
            $("[data-menu='editorial_office'] > li > [href='/special_issue_pending/list']").after("<a href='/special_issue_pending/list/online?form[journal_id]=" + S_J + "&form[section_id]=" + S_S + "&show_all=my_journals&sort_field=special_issue_pending.deadline&sort=ASC'>[S]</a>");
            $("[data-menu='editorial_office'] > li > [href='/user/managing/status/submitted']").after(" <a href='https://susy.mdpi.com/user/managing/status/all?form[journal_id]=" + S_J + "&form[section_id]=" + S_S + "&sort_field=submission_manuscript_state.last_action&sort=DESC'>[S]</a>");
        }
        if (S_J>0){
            $("[data-menu='editorial_office'] > li > [href='/user/managing/status/submitted']").after("<a href='https://susy.mdpi.com/user/managing/status/published?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.publish_date&sort=DESC'>[P]</a>");
            $("[data-menu='editorial_office'] > li > [href='/user/managing/status/submitted']").after(" <a href='https://susy.mdpi.com/user/managing/status/production?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.last_action&sort=DESC'>[F]</a>");
            $("[data-menu='editorial_office'] > li > [href='/voucher/application/list']").attr("href","/voucher/application/list/my_journal?form[journal_id]=" + S_J);
            $("[data-menu='editorial_office'] > li > [href='/user/managing/status/submitted']").attr("href","/user/managing/status/submitted?form[journal_id]=" + S_J);
        }
        $("[data-menu='editorial_office'] > li > [href='/special_issue_pending/list']").after(" <a href='/user/sme/status/submitted'>[M]</a>");
        $("[data-menu='editorial_office'] > li > [href='/special_issue_pending/list']").attr("href","/special_issue_pending/list/online?sort_field=special_issue_pending.publish_date&sort=DESC")
        $("[data-menu='editorial_office'] > li > [href='/submission/topic/list']").after(" <a href='/user/topic/status/submitted'>[M]</a>");
        $("[data-menu='editorial_office'] > li > [href='/submission/topic/list']").attr("href","/submission/topic/list/online");
        $("[data-menu='editorial_office'] > li > [href='/user/ebm-new/management']").after(" <div style='float:right;'><a onclick='document.getElementById(\"si-search\").style.display=\"\"'><img src='https://susy.mdpi.com/bundles/mdpisusy/img/icon/magnifier.png'></a> </div> ");
    } catch (error){ }}

    //SI和Topic Manuscripts整合
    if (window.location.href.indexOf("//susy.mdpi.com/user/sme/status/") > -1 && GM_config.get('Interface_combine')){
        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href.replace('sme/status','topic/status'),
            onload: function(responseDetails) {
                var parser = new DOMParser();
                var responseDoc = parser.parseFromString(responseDetails.responseText.replace(/\/user\/topic\/status/g,'/user/sme/status'), "text/html").getElementById('manuscripts-list');
                $("#manuscripts-list").after(responseDoc);
            }
        });
    }

    //Manuscript Page 侧边栏紧凑
    if(window.location.href.indexOf("//susy.mdpi.com/") > -1 && GM_config.get('Manuscriptnote')==true){try{
        waitForKeyElements(".manuscript-note-box",SidebarSize);
        function SidebarSize() {
            $(".note-list-container").css("padding","0");
            if ($('.special-issue-note-box').length > 0) {
                $(".manuscript-note-box").find(".manuscript-note-item-content").height(200);
                $(".manuscript-note-box").find(".manuscript-note-item-content").css("overflow-y","auto");
                $(".section-note-box").find(".manuscript-note-item-content").height(200);
                $(".section-note-box").find(".manuscript-note-item-content").css("overflow-y","auto");
            }
        }
    } catch (error){ }}

    //GE Invitation✏️
    if (window.location.href.indexOf("invite/guest_editor") > -1){try{
        var S_GEID;
        switch (GM_config.get('GE_TemplateID')) {
            case '!Guest Editor – invite Version 1': S_GEID=1518; break;
            case 'Guest Editor - Invite with Benefits and Planned Papers': S_GEID=269; break;
            case 'Guest Editor - Invite Free': S_GEID=873; break;
            case 'Guest Editor - Invite with Discounts': S_GEID=874; break;
            case 'Guest Editor-Invite (Optional)': S_GEID=1151; break;
        }
        $('#emailTemplates').val(S_GEID).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change'));
        $("span:contains('Select')").text(GM_config.get('GE_TemplateID'))
        function init() {document.getElementById('mailSubject').value=document.getElementById('mailSubject').value.replace(GM_config.get('GE_TemplateS1'), GM_config.get('GE_TemplateS2'));
                         document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(GM_config.get('GE_TemplateB1'), GM_config.get('GE_TemplateB2'));}
        setTimeout(()=>{init()}, 1000)
        if (S_GEID==269) {$('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailBody\').value=document.getElementById(\'mailBody\').value.replace(\'We gladly waive the article processing charge for papers from the Guest Editor. \', \'\');">[No Discount]</a>');}
        // $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailSubject\').value=document.getElementById(\'mailSubject\').value.replace(\'ISSN 2227-7390\', \'Rank Q1\'); document.getElementById(\'mailBody\').value=document.getElementById(\'mailBody\').value.replace(\'from the Guest Editor. If\', \'from the Guest Editor, and may offer discounts for papers invited by the Guest Editor. If\');"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a> ')
    } catch (error){ }}

    //GE Reminder✏️
    if (window.location.href.indexOf("remind/guest_editor") > -1){try{
        var S_GERID;
        switch (GM_config.get('GE_ReminderID')) {
            case 'Guest Editor Invitation – 1st Reminder': S_GERID=1618; break;
            case 'Guest Editor Invitation – 2nd Reminder': S_GERID=1619; break;
            case 'Guest Editor Invitation – 3rd Reminder': S_GERID=1620; break;
        }
        $('#emailTemplates').val(S_GERID).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change'));
        $("span:contains('Select')").text(GM_config.get('GE_ReminderID'));
        $('#mailSubject').parent().after('<a id="Awaiting"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a>');
        $('#Awaiting').click(function(e) {if ($('#mailSubject').val().indexOf("Awaiting Your Reply")==-1) {$('#mailSubject').val("Awaiting Your Reply: " + $('#mailSubject').val())}});
    } catch (error){ }}

    //EB invitation✏️
    if (window.location.href.indexOf("present_editor_ebm/invite_email") > -1){try{
        function init() {document.getElementById('mailSubject').value=document.getElementById('mailSubject').value.replace(new RegExp(GM_config.get('EB_TemplateS1'),'g'), GM_config.get('EB_TemplateS2'));
                         document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(GM_config.get('EB_TemplateB1'), GM_config.get('EB_TemplateB2'));}
        setTimeout(()=>{init()}, 1000)
        $('#mailSubject').parent().after('<a id="No_Discount">[No Discount]</a>');
        $('#No_Discount').click(function(e) {$('#mailBody').val($('#mailBody').val().replace('you will have the opportunity to publish one paper free of charge in Mathematics per year, and can also publish extra papers with special discounts.\n\n','').replace(/Please click on the following link [\s\S]*?Mathematics/g,'Mathematics'))});
    } catch (error){ }}

    //EB Reminder✏️
    if (window.location.href.indexOf("present_editor_ebm/remind_email") > -1){try{
        function init() {document.getElementById('mailSubject').value=document.getElementById('mailSubject').value.replace(new RegExp(GM_config.get('EB_ReminderS1'),'g'), GM_config.get('EB_ReminderS2'));
                         document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(GM_config.get('EB_ReminderB1'), GM_config.get('EB_ReminderB2'));}
        setTimeout(()=>{init()}, 1500)
    } catch (error){ }}

    //文章处理页面[Voucher]按钮和发送推广信按钮
    if (window.location.href.indexOf("/process_form/")+window.location.href.indexOf("/production_form/") > -2 && GM_config.get('ManuscriptFunc')==true){try{
        var corresponding, Promote='', email=[];
        var m_id = document.getElementById("manuscript_id").parentNode.textContent.trim();
        var m_section = $(`div.cell.small-12.medium-6.large-2:contains('Section')`).next().text().trim();
        for (i=1;i<$("[title|='Google Scholar']").length;i++) {
            var n=$("[title|='Google Scholar']")[i].parentNode.nextSibling
            if (n.nodeType!=1) {n=n.nextSibling}
            email[i-1]=n.textContent.trim()
            n=$("[title|='Google Scholar']")[i].parentNode.previousSibling
            if (n.nodeType!=1) {n=n.previousSibling}
            if($("[title|='Google Scholar']")[i].parentNode.textContent.indexOf("*") != -1 ) {corresponding=email[i-1]}
            var name=n.textContent.trim() + " " + $("[title|='Google Scholar']")[i].parentNode.textContent.trim().replace(" *", "")

            $("[title|='Google Scholar']").eq(i).before('<a href="mailto:' + email[i-1] + '?subject=[Mathematics] (IF 2.258, ISSN 2227-7390) Promote Your Published Papers&body=' + GM_config.get('Template_Paper').replace(/\n/g,"%0A").replace(/"/g,"&quot;").replace(/%m_id%/g,m_id).replace(/%m_section%/g,m_section).replace(/%name%/g,name) + '"><img src="/bundles/mdpisusy/img/icon/mail.png"></a> ')
        }

        $("[title|='Send email to authors']").before('<a href="mailto:' + email.join(";") + '?subject=[Mathematics] Manuscript ID: '+ m_id +' - Your Paper is Promoted via Mathematics Social Media&body=' + GM_config.get('Template_Linkedin').replace(/\n/g,"%0A").replace(/"/g,"&quot;").replace(/%m_id%/g,m_id).replace(/%m_section%/g,m_section) + '"><img src="https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a" alt="[LinkedIn]"></a> ')

        if ($("div.cell.small-12.medium-6.large-2:contains('Special Issue')").length>0 && $("div.cell.small-12.medium-6.large-2:contains('Section')").length>0) { //文章在特刊里且有Section
            Promote += " <form id='s_voucher' class='insertform' method='post' action='https://susy.mdpi.com/voucher/application/create?waiverApplyForm[types]=6' target='_blank' style='display:inline;'><input type='hidden' name='form[journal_id]' value='154'><input type='hidden' name='form[is_percentage]' value='1'><input type='hidden' id='form_special_issue_id' name='form[special_issue_id]' value='0'><input type='hidden' name='form[emails]' value='"+corresponding+"'><input type='hidden' name='form[valid_months]' value='12'><input type='hidden' id='form_section_id' name='form[section_id]' value=''><input type='hidden' name='form[reason]' value='Feature paper invited by guest editor'><input type='hidden' name='form[manuscript_id]' value='"+document.getElementById("manuscript_id").parentNode.textContent.trim()+"'>"
            Promote += " <a onclick=\"var re = new RegExp('(\\\\d*)[^0-9]:[^0-9]' + $(`div.cell.small-12.medium-6.large-2:contains('Special Issue')`).next().text().trim(), '');var xhr = new XMLHttpRequest();xhr.open('GET', 'https://susy.mdpi.com/list/journal/154/section/0/all_special_issues', false);xhr.send(null);document.getElementById('form_special_issue_id').value = xhr.responseText.match(re)[1];re=new RegExp('(\\\\d*)[^0-9]:[^0-9]' + $(`div.cell.small-12.medium-6.large-2:contains('Section')`).next().text().trim(), '');xhr=new XMLHttpRequest();xhr.open('GET', 'https://susy.mdpi.com/list/journal/154/sections', false);xhr.send(null);document.getElementById('form_section_id').value = xhr.responseText.match(re)[1];s_voucher.submit();   \">[Voucher]</a> </form>"
        } else if ($("div.cell.small-12.medium-6.large-2:contains('Special Issue')").length>0){ //文章在特刊里但没Section
            Promote += " <form id='s_voucher' class='insertform' method='post' action='https://susy.mdpi.com/voucher/application/create?waiverApplyForm[types]=6' target='_blank' style='display:inline;'><input type='hidden' name='form[journal_id]' value='154'><input type='hidden' name='form[is_percentage]' value='1'><input type='hidden' id='form_special_issue_id' name='form[special_issue_id]' value=''><input type='hidden' name='form[emails]' value='"+corresponding+"'><input type='hidden' name='form[valid_months]' value='12'><input type='hidden' id='form_section_id' name='form[section_id]' value=''><input type='hidden' name='form[reason]' value='Feature paper invited by guest editor'><input type='hidden' name='form[manuscript_id]' value='"+document.getElementById("manuscript_id").parentNode.textContent.trim()+"'>"
            Promote += " <a onclick=\"var re = new RegExp('(\\\\d*)[^0-9]:[^0-9]' + $(`div.cell.small-12.medium-6.large-2:contains('Special Issue')`).next().text().trim(), '');var xhr = new XMLHttpRequest();xhr.open('GET', 'https://susy.mdpi.com/list/journal/154/section/0/all_special_issues', false);xhr.send(null);document.getElementById('form_special_issue_id').value = xhr.responseText.match(re)[1];s_voucher.submit();   \">[Voucher]</a> </form>"
        } else {}

        if ($("div.cell.small-12.medium-6.large-2:contains('Section')").length>0){ //Section中的常规投稿
            Promote += " <form id='s2_voucher' class='insertform' method='post' action='https://susy.mdpi.com/voucher/application/create?waiverApplyForm[types]=5' target='_blank' style='display:inline;'><input type='hidden' name='form[journal_id]' value='154'><input type='hidden' name='form[is_percentage]' value='1'><input type='hidden' name='form[emails]' value='"+corresponding+"'><input type='hidden' name='form[valid_months]' value='12'><input type='hidden' name='form[reason]' value='Paper by editorial board member'><input type='hidden' id='form_section_id2' name='form[section_id]' value=''><input type='hidden' name='form[manuscript_id]' value='"+document.getElementById("manuscript_id").parentNode.textContent.trim()+"'>"
            Promote += " <a onclick=\"var re = new RegExp('(\\\\d*)[^0-9]:[^0-9]' + $(`div.cell.small-12.medium-6.large-2:contains('Section')`).next().text().trim(), '');var xhr = new XMLHttpRequest();xhr.open('GET', 'https://susy.mdpi.com/list/journal/154/sections', false);xhr.send(null);document.getElementById('form_section_id2').value = xhr.responseText.match(re)[1];s2_voucher.submit();   \">[V_EBM]</a> </form>"
        } else { //没Section的常规投稿
           Promote += " <form id='s2_voucher' class='insertform' method='post' action='https://susy.mdpi.com/voucher/application/create?waiverApplyForm[types]=5' target='_blank' style='display:inline;'><input type='hidden' name='form[journal_id]' value='154'><input type='hidden' name='form[is_percentage]' value='1'><input type='hidden' name='form[emails]' value='"+corresponding+"'><input type='hidden' name='form[valid_months]' value='12'><input type='hidden' name='form[reason]' value='Paper by editorial board member'><input type='hidden' id='form_section_id2' name='form[section_id]' value=''><input type='hidden' name='form[manuscript_id]' value='"+document.getElementById("manuscript_id").parentNode.textContent.trim()+"'>"
           Promote += " <a onclick=\"s2_voucher.submit();   \">[V_EBM]</a> </form>&nbsp;&nbsp;&nbsp;"
        }
        $("[title|='Google']").before(' <a href="https://www.researchgate.net/search.Search.html?type=publication&query='+$("[title|='Google']").prev().text()+'" title="Researchgate" target="_blank"><img style="vertical-align: middle;" src="https://c5.rgstatic.net/m/41542880220916/images/favicon/favicon-16x16.png"></a> ');
        $("[class|='margin-horizontal-1']").after(Promote);
    } catch (error){ }}

    //特刊列表免翻页⚙️
    if (window.location.href.indexOf("susy.mdpi.com/special_issue_pending/list") > -1 && window.location.href.indexOf("page=") == -1 && GM_config.get('SIpages')==true){try{
        $(".outside_table").css("max-height","none")
        var htmlObj, totalpage = parseInt($('li:contains("Next")').prev().text());
        for (var i = 2; i <= Math.min(totalpage,20); i++) {
            (function(i){//闭包
                setTimeout(function(){
                    var IFramename = "iframe"+i;
                    $("body").append('<iframe id="iframe'+i+'" src="' + document.getElementsByClassName("pagination margin-0")[0].getElementsByTagName("li")[2].getElementsByTagName("a")[0].href.replace("page=2","page="+[i]) + '" style="display:none;"></iframe>');
                    document.getElementById("iframe"+i).onload = function () {
                        $('#statustable').after(document.getElementById("iframe"+i).contentWindow.document.getElementById("statustable"));
                        $('#statustable').attr('id','old_statustable');
                    }
                },500*i)
            })(i);//闭包
        };
        if (S_J>0) {$("[href='/special_issue_pending/list?show_all=my_journals']").attr('href',"/special_issue_pending/list/online?form[journal_id]=" +S_J+ "&show_all=my_journals");}
    } catch (error){ }}

    //特刊页面➕按钮、Note
    if (window.location.href.indexOf("susy.mdpi.com/submission/topic/view")+window.location.href.indexOf("susy.mdpi.com/special_issue/process") > -2){try{
        if(GM_config.get('SInote')) {
            waitForKeyElements("#special_issue_notesText",SINotes);
            waitForKeyElements("#topic_notesText",TopicNotes);
            function SINotes() {
                $("#manuscript-special-issue-notes").css("height",GM_config.get('SInoteH')+"px");
                $("[aria-describedby|='manuscript-special-issue-notes']").css("width",GM_config.get('SInoteW')+"px");
                $("#special_issue_notesText").css("height",GM_config.get('SInoteH')-200 +"px");
            }
            function TopicNotes() {
                $("#manuscript-special-issue-notes").css("height",GM_config.get('SInoteH')+"px");
                $("[aria-describedby|='manuscript-special-issue-notes']").css("width",GM_config.get('SInoteW')+"px");
                $("#topic_notesText").css("height",GM_config.get('SInoteH')-200 +"px");
            }
        }
        $('#si-update-emphasized').before('<a href="?pagesection=AddGuestEditor" title="Add Guest Editor">➕</a> ');
        if(GM_config.get('Hidden')) {
            $('#si-update-emphasized').before('<a href="'+$('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/","/special_issue/reset_status/")+'" title="Reset">↩</a> ');
            $('#si-update-emphasized').before('<a href="'+$('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/","/special_issue/close_invitation/")+'" title="Close">🆑</a> ');
        }
        $('div.cell.small-12.medium-6.large-2:contains("Online Date")').next().css({"background-color":"yellow"});
        //$('#guestNextBtn').after(" <a onclick='$(`#form_article_title_5`)[0].value=$(`#form_article_title_4`)[0].value=$(`#form_article_title_3`)[0].value=$(`#form_article_title_2`)[0].value=$(`#form_article_title_1`)[0].value; $(`#form_article_doi_5`)[0].value=$(`#form_article_doi_4`)[0].value=$(`#form_article_doi_3`)[0].value=$(`#form_article_doi_2`)[0].value=$(`#form_article_doi_1`)[0].value;'>[CpPub]</a>");
        //$(".input-group-button").append('&nbsp; <input type="button" class="submit add-planned-paper-btn" value="Force Add">');
    } catch (error){ }}

    //默认新建特刊位置和Title Case
    if (window.location.href.indexOf("susy.mdpi.com/user/special_issue/edit/0") > -1 && S_J>0){try{
        $('#form_id_journal').val(S_J).change();
        document.getElementById('form_id_journal').dispatchEvent(new CustomEvent('change'));
        document.evaluate('//*[@id="form_id_journal_chosen"]/a/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText = GM_config.get('Journal');
        $("#form_name").after("<a href='#' onclick='function reqListener () {  $(\"#form_name\")[0].value=this.responseText;}var oReq = new XMLHttpRequest();oReq.addEventListener(\"load\", reqListener);oReq.open(\"GET\", \"https://brettterpstra.com/titlecase/?title=\" + $(\"#form_name\")[0].value);oReq.send();' return false;>🔠🔡</a> ");
    } catch (error){ }}

    //默认新建EBM位置
    if (window.location.href.indexOf("susy.mdpi.com/user/ebm-new/management") > -1){try{
        if (S_J>0){
            document.getElementById('journal_id').value = S_J;
            document.getElementById('role_id').value = "9";
            document.evaluate('//*[@id="journal_id_chosen"]/a/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText=GM_config.get('Journal');
            $("[href='/user/ebm-new/management/pending_invitation/my_journals").attr("href","/user/ebm-new/management/pending_invitation/my_journals?form[journal_id]=" +S_J);
        }
        if (GM_config.get('Hidden')){$("#ebm_pending_check_btn").after(' <input class="submit" type="submit" value="Force Proceed"> ');}
    } catch (error){ }}

    //特刊网页短链接
    if (window.location.href.indexOf("mdpi.com/journal/mathematics/special_issues/") > -1 && window.location.href.indexOf("/abstract") == -1 && GM_config.get('LinkShort')==true){try{
        window.location.href=window.location.href.replace(/\/journal\/mathematics\/special_issues\//,"/si/mathematics/");
    } catch (error){ }}

    //mailsdb样式⚙️🔝
    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/login") > -1){try{
        window.location.href="https://mailsdb.i.mdpi.com/login";
    } catch (error){ }}
    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/search/emails") > -1){try{
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "/assets/application-79a8659b0064dad9845d4ec2f290c6e94795079e79a99ab4354776213eb35db0.css";
        document.getElementsByTagName("head")[0].appendChild(link);
        document.body.innerHTML = document.body.innerHTML.replace(new RegExp(' data-url="','g'),' href="');
        var susycheck = "https://susy.mdpi.com/user/info?emails="+ window.location.href.match(/search_content=(\S*)/)[1];
        if (susycheck.indexOf("@") > -1){
            GM_xmlhttpRequest({
                method: 'GET',
                url: susycheck,
                headers: {'User-agent': 'Mozilla/5.0 (compatible)', 'Accept': 'application/atom+xml,application/xml,text/xml',},
                onload: function(responseDetails) {
                    const sty = document.createElement("style");
                    sty.innerHTML = 'table{width: 80%} #user-info {width: 80%} #user-info .user-info-section{margin-bottom:10px}#user-info span.email{font-weight:400;color:#103247}#user-info span.number{font-weight:400;color:#123}#user-info a{color:#00f}#user-info a:visited{color:#cd7e53}#user-info a:hover{color:#47566d}#user-info table{margin-left:2%;width:98%;background:#99a4b5;margin-bottom:10px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;font-size: 14px;}#user-info table tr th{text-align:left;background:#4f5671;color:#fefefe;font-weight:400;border-left:1px solid #ccc;border-top:1px solid #ccc;padding:.2rem}#user-info table tr td{border-left:1px solid #ccc;border-top:1px solid #ccc;padding:.2rem;background:#fefefe}#user-info table tr td span.msid{color:#4e6c88;font-weight:400}#user-info table tr td.title{width:50%}#user-info table tr td.journal{width:10%;text-align:center}#user-info table tr td.status{width:10%;text-align:center}#user-info table tr td.submission-date{width:10%;text-align:center}#user-info table tr td.invoice-info{width:10%;text-align:center}#user-info table tr td.invoice-payment-info{width:10%;text-align:center}';
                    sty.id = "sty_add";
                    document.head.appendChild(sty);
                    $("body").prepend("<p>⬆️ ⬆️ ⬆️ ⬆️ ⬆️</p>");
                    $("body").prepend(responseDetails.responseText.replace(/href="\//g,"href=\"//susy.mdpi.com/"));
                }
            });
        }
        susycheck = "https://susy.mdpi.com/user/guest_editor/check?email="+ window.location.href.match(/search_content=(\S*)/)[1] +"&special_issue_id=1";
        if (susycheck.indexOf("@") > -1){
            GM_xmlhttpRequest({
                method: 'GET',
                url: susycheck,
                headers: {'User-agent': 'Mozilla/5.0 (compatible)', 'Accept': 'application/atom+xml,application/xml,text/xml',},
                onload: function(responseDetails) {
                    $("body").prepend("<p>⬆️ ⬆️ ⬆️ ⬆️ ⬆️</p>");
                    $("body").prepend(responseDetails.responseText);
                }
            });
        }
    } catch (error){ }}

    //reviewer checking样式⚙️
    if (window.location.href.indexOf("reviewer/checking/") > -1){try{
        GM_xmlhttpRequest({
            method: 'GET',
            url: $("a:contains('Edit Reviewer')").attr("href").replace(/reivewer\/managment\/edit/g, 'list/reviewer/invitations-history'),
            headers: {'User-agent': 'Mozilla/5.0 (compatible)', 'Accept': 'application/atom+xml,application/xml,text/xml',},
            onload: function(responseDetails) {
                $("body").append(responseDetails.responseText.replace(/href="\//g,"href=\"//susy.mdpi.com/"));
            }
        });
        function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
        $(".reviewerNotes").after(" <a href='https://scholar.google.com/scholar?hl=en&q=" + getUrlParam('email') +"'><img style='vertical-align: middle;' src='/bundles/mdpisusy/img/design/google_logo.png'></a>");
        document.getElementsByClassName("see-blocked-info")[0].href="https://susy.mdpi.com/reviewer/blocked/seemore?email="+getUrlParam('email');
    } catch (error){ } }

    //Hidden: MRS ALL journals
    if(window.location.href.indexOf("//mrs.mdpi.com/data/role/") > -1 && GM_config.get('Hidden')){try{ $('#demo-form2').before(" <a onclick='$(`#journal > option`)[0].value=`250,77,145,362,13,524,534,341,456,390,90,480,517,491,523,35,118,471,323,47,82,346,67,427,240,103,515,299,305,143,487,531,441,123,26,214,440,467,213,176,416,259,428,385,356,142,151,84,404,306,397,127,449,7,402,5,412,83,509,192,301,42,492,275,395,19,460,53,25,413,409,453,79,474,481,163,50,225,215,148,221,355,203,499,37,51,435,170,290,49,432,199,14,407,231,154,81,92,59,522,465,438,314,457,365,359,360,444,165,419,511,358,436,271,353,16,252,114,162,130,206,246,3,233,265,528,518,414,173,296,466,294,15,376,44,131,417,150,276,133,228,291,269,36,504`;'>[All Journal]</a>"); } catch (error){ }}

    //Always: Reviewer Information is not required
    if(window.location.href.indexOf("//susy.mdpi.com/reivewer/create") > -1){try{
        document.getElementById('form_affiliation').removeAttribute("required");
        document.getElementById('form_country').removeAttribute("required");
        document.getElementById('form_research_keywords').removeAttribute("required");
        document.getElementById('form_url').setAttribute("value",".");
        $('[for="form_affiliation"]>span').remove()
        $('[for="form_url"]>span').remove()
        $('[for="form_country"]>span').remove()
        $('[for="form_research_keywords"]>span').remove()
    } catch (error){ }}

    //Always: Manage Voucher Applications
    if(window.location.href.indexOf("//susy.mdpi.com/voucher/application/list/") > -1){try{ document.getElementById("show-more-budgets").click();} catch (error){ }}

    //Always: Google Scholar校正
    if (window.location.href.indexOf("&amp;") > -1){try{
        function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
        window.location.href="https://scholar.google.com/citations?hl=en&user="+getUrlParam('amp;user')
    } catch (error){ }}
})();

//     //TE+EBM加入Google Sheet
//     if (window.location.href.indexOf("susy.mdpi.com/user/ebm-new/edit") > -1){try{
//         $("#edit-ebm-form").append("<a onclick=\"var syna_append='https://script.google.com/macros/s/AKfycbz9XFh17rVkJgGGZXBi_2ATNluvJW_uOmXtUyrqxdY1QAZ5DrEgX_Cu/exec?c1='+$(`#form_firstname`)[0].value+' '+$(`#form_lastname`)[0].value+'&c2='+$(`#form_email`)[0].value+'&c3='+$(`#form_affiliation`)[0].value+'&c4='+$(`#form_country`)[0].value+'&c5='+$(`#form_interests`)[0].value+'&c8='+$(`#form_website`)[0].value;$(\'#edit-ebm-form\').append('<a href=&quot;'+syna_append+'&quot; target=_blank>'+syna_append+'</a>'); \">Add TE to Google Sheet</a><br>");
//     } catch (error){ }}
