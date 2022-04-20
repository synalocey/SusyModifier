// ==UserScript==
// @name          Susy Modifier Mini
// @version       2.4.20
// @description   Susy Modifier Mini
// @author        Syna
// @icon          https://susy.mdpi.com/bundles/mdpisusy/img/icon_old/favicon-196x196.png
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifierMini.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifierMini.user.js
// @match         https://*.mdpi.com/*
// @match         https://*.scopus.com/*
// @match         *://scholar.google.co.uk/*&amp;user*
// @match         *://scholar.google.com/*&amp;user*
// @match         *://scholar.google.com.hk/*&amp;user*
// @match         *://scholar.google.com.tw/*&amp;user*
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant         GM_xmlhttpRequest
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    //GE invitation✏️
    if (window.location.href.indexOf("invite/guest_editor") > -1){try{
        $('#emailTemplates').val("1151").change();
        document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change'));
        function init() {document.getElementById('mailSubject').value=document.getElementById('mailSubject').value.replace('ISSN 2227-7390', 'ISSN 2227-7390');
                         document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace('You have been invited based on your strong', 'You are welcome to adjust the title according to your own interest and projects. You have been invited based on your strong');}
        setTimeout(()=>{init()}, 1000)
    } catch (error){ }}

    //GE reminder✏️
    if (window.location.href.indexOf("remind/guest_editor") > -1){try{
        $('#emailTemplates').val("154").change();
        document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change'));
        function init() {document.getElementById('mailSubject').value=document.getElementById('mailSubject').value.replace('ISSN 2227-7390', 'Rank Q1');
                         document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace('Please let us know whether or not you are interested, and if you have any further questions.', 'Considering you might miss the previous messages, we would like to renew our invitation again.\n\nYou may modify the title to suit your interests and set the submission deadline according to your time schedule. The information in the special issue just includes a short summary (about 200 words) and keywords (3–10). You could invite your colleagues or friends as Co-Guest Editors (but optional). It would be helpful to share the workload among editors and also enable an internal discussion in case any uncertainties arise. \n\nCould you please let us know your decision on our invitation?  If you need more information or more time to make the decision, please never hesitate to contact us. If you are not able to accept the invitation, we will appreciate it if you could tell us. Please let us know whether or not you are interested, and if you have any further questions.');}
        setTimeout(()=>{init()}, 1000)

        $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailSubject\').value=document.getElementById(\'mailSubject\').value.replace(\'ISSN 2227-7390\', \'Rank Q1\').replace(\'Reminder: \', \'Awaiting Your Reply: \');"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a> ')
    } catch (error){ }}


    //文章处理页面[Voucher]按钮
    if (window.location.href.indexOf("/process_form/")+window.location.href.indexOf("/production_form/") > -2){try{
        var corresponding
        for (i=1;i<$("[title|='Google Scholar']").length;i++)
        {
            var n=$("[title|='Google Scholar']")[i].parentNode.nextSibling
            if (n.nodeType!=1) {n=n.nextSibling}
            var email=n.textContent.trim()

            n=$("[title|='Google Scholar']")[i].parentNode.previousSibling
            if (n.nodeType!=1) {n=n.previousSibling}
            if($("[title|='Google Scholar']")[i].parentNode.textContent.indexOf("*") != -1 ) {corresponding=email}
            var name=n.textContent.trim() + " " + $("[title|='Google Scholar']")[i].parentNode.textContent.trim().replace(" *", "")

            $("[title|='Google Scholar']").eq(i).before('<a href="mailto:' + email + '?subject=[Mathematics] (IF 2.258, ISSN 2227-7390) Promote Your Published Papers&body=Dear ' + name + ',%0A%0A\
Thank you very much for your contribution to /Mathematics/, your manuscript ' + document.getElementById("manuscript_id").parentNode.textContent.trim() + ' is now under review. We will keep you informed about the status of your manuscript.%0A%0AIn addition, you have published a paper/papers in /Mathematics/ in the past two years with the citation of about XX times. Based on your reputation and research interests, we believe that your results should attract more citations and attention. Therefore, could you please promote the paper/papers to your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?%0A%0A\
In addition, you have published a paper/papers in /Mathematics/ in 20XX with the citation of XXXXX times, congratulations on your great work!%0ATo encourage open scientific discussions and increase the visibility of your results, could you please promote the paper/papers to your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?%0A%0A1. [paper link]%0A2. [paper link]%0A%0AThank you in advance for your support.\
"><img src="/bundles/mdpisusy/img/icon/mail.png"></a> ')
        }
        var Promote='';
        // Promote = ' <a href="https://script.google.com/macros/s/AKfycbx1XtdG27UCL9Q1LdpAC_10ek75MDUr_BDYtdg8Ig/exec?name=' + document.getElementsByClassName("editorName")[0].textContent.trim() + '&phone=' + document.getElementById("manuscript_id").parentNode.textContent.trim() + '" target="_blank"><img style="vertical-align: middle;" src="https://ssl.gstatic.com/docs/common/addon_sheets_promo.svg" height="16" width="16"></a> <a href="https://script.google.com/macros/s/AKfycbxb_kAH3cErvnmKfucepiMzdjvige7NH38JIsXhTheONPP9JWE/exec?name='+ document.getElementById("manuscript_id").parentNode.textContent.trim() +'" target="_blank">[Promote]</a>'

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
    if (window.location.href.indexOf("susy.mdpi.com/special_issue_pending/list") > -1 && window.location.href.indexOf("page=") == -1){try{
        $(".outside_table").css("max-height","none")
        var totalpage = document.getElementsByClassName("pagination margin-0")[0].getElementsByTagName("li").length-1
        for (var i = 2; i < totalpage; i++) {
            (function(i){//闭包
                setTimeout(function(){
                    console.log(i);
                    var IFramename = "iframe"+i;
                    $("body").append('<iframe id="iframe'+i+'" src="' + document.getElementsByClassName("pagination margin-0")[0].getElementsByTagName("li")[i].getElementsByTagName("a")[0].href + '" style="display:none;"></iframe>');
                    document.getElementById("iframe"+i).onload = function () {
                        $('#statustable').after(document.getElementById("iframe"+i).contentWindow.document.getElementById("statustable"))
                        $('#statustable').attr('id','old_statustable');
                    }
                },500*i)
            })(i);//闭包
        };
        $("[href='/special_issue_pending/list?show_all=my_journals']").attr('href',"/special_issue_pending/list/online?form[journal_id]=154&show_all=my_journals");
    } catch (error){ }}


    //特刊网页重定向
    if (window.location.href.indexOf("mdpi.com/journal/mathematics/special_issues/") > -1 && window.location.href.indexOf("/abstract") == -1 ){try{
        window.location.href=window.location.href.replace(/\/journal\/mathematics\/special_issues\//,"/si/mathematics/");
    } catch (error){ }}


    //susy侧边栏的SI按钮🔎
    if (window.location.href.indexOf("susy.mdpi.com/") > -1){try{
        var siappend="<div id='si-search' tabindex='-1' role='dialog' style='display: none; position: absolute; height: 300px; width: 500px; top: 500px; left: 242.5px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-draggable ui-resizable' aria-describedby='display-user-info'><div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle'><span class='ui-dialog-title'>Quick Search</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close' title='Close' onclick='document.getElementById(\"si-search\").style.display=\"none\"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div><div id='display-user-info' data-url='/user/info' class='ui-dialog-content ui-widget-content' style='width: auto; min-height: 0px; max-height: none; height: 512px;'>\
<form class='insertform' method='get' action='https://susy.mdpi.com/special_issue_pending/list/search' target='_blank'><input type='text' name='show_all' value='my_journals' style='display:none;'>SI Title: <input type='text' name='form[si_name]' id='si-search2' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='SI Search'></form><hr> <form class='insertform' method='get' action='https://susy.mdpi.com/user/ebm-new/management/all/my_journals' target='_blank'>Name: <input type='text' id='form_name2' name='form[name]' style='display:inline-block; width:65%;'><br>Email: <input type='email' id='form_email2' name='form[email]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='EBM Search'></form><hr>";
        $("body").append(siappend);
        $("[data-menu='editorial_office'] > li > [href='/special_issue_pending/list']").after(" <a href='/user/sme/status/submitted'>[M]</a>");
        $("[data-menu='editorial_office'] > li > [href='/special_issue_pending/list']").attr("href","/special_issue_pending/list/online?sort_field=special_issue_pending.publish_date&sort=DESC")

        $("[data-menu='editorial_office'] > li > [href='/user/ebm-new/management']").after(" <div style='float:right;'><a onclick='document.getElementById(\"si-search\").style.display=\"\"'><img src='https://susy.mdpi.com/bundles/mdpisusy/img/icon/magnifier.png'></a> </div> ");
        $("[data-menu='editorial_office'] > li > [href='/voucher/application/list']").attr("href","/voucher/application/list/my_journal?form[journal_id]=154");

        $("[data-menu='editorial_office'] > li > [href='/user/managing/status/submitted']").attr("href","/user/managing/status/submitted?form[journal_id]=154");
    } catch (error){ }}

    //Google Scholar校正
    if (window.location.href.indexOf("&amp;") > -1){
        function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
        try{
            window.location.href="https://scholar.google.com/citations?hl=en&user="+getUrlParam('amp;user')
        } catch (error){ }}

    //Manuscript Sidebar Size
    if(window.location.href.indexOf("//susy.mdpi.com/") > -1){try{
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

    //默认新建EBM位于Mathematics🔢
    if (window.location.href.indexOf("susy.mdpi.com/user/ebm-new/management") > -1){try{
        document.getElementById('journal_id').value = "154";
        document.getElementById('role_id').value = "9";
        document.evaluate('//*[@id="journal_id_chosen"]/a/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText="Mathematics";
        $("#ebm_pending_check_btn").before('<input class="submit" type="submit" value="Proceed"> ');
    } catch (error){ }}

    //默认新建特刊位于Mathematics🔢
    if (window.location.href.indexOf("susy.mdpi.com/user/special_issue/edit/") > -1){try{
        $('#form_id_journal').val('154').change();
        document.getElementById('form_id_journal').dispatchEvent(new CustomEvent('change'));
        document.evaluate('//*[@id="form_id_journal_chosen"]/a/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText="Mathematics";
        $("#form_name").after("<a href='#' onclick='function reqListener () {  $(\"#form_name\")[0].value=this.responseText;}var oReq = new XMLHttpRequest();oReq.addEventListener(\"load\", reqListener);oReq.open(\"GET\", \"https://brettterpstra.com/titlecase/?title=\" + $(\"#form_name\")[0].value);oReq.send();' return false;>🔠🔡</a> ");
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
    if (window.location.href.indexOf("reviewer/checking/") > -1){
        try{$("body").append('<iframe frameborder="0" width="100%" height="200px" src="'+ $(".reviewerNotes").attr("data-load-url") +'"></iframe>');
            GM_xmlhttpRequest({
                method: 'GET',
                url: $(".reviewerNotes").attr("data-load-url").replace(/user\/reviewer_editor_notes/g, 'list/reviewer/invitations-history'),
                headers: {'User-agent': 'Mozilla/5.0 (compatible)', 'Accept': 'application/atom+xml,application/xml,text/xml',},
                onload: function(responseDetails) {
                    $("body").append(responseDetails.responseText.replace(/href="\//g,"href=\"//susy.mdpi.com/"));
                }
            });
            function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
            $(".reviewerNotes").after(" <a href='https://scholar.google.com/scholar?hl=en&q=" + getUrlParam('email') +"'><img style='vertical-align: middle;' src='/bundles/mdpisusy/img/design/google_logo.png'></a>");
            document.getElementsByClassName("see-blocked-info")[0].href="https://susy.mdpi.com/reviewer/blocked/seemore?email="+getUrlParam('email');
           } catch (error){ } }

    //特刊页面➕按钮、Note
    if (window.location.href.indexOf("susy.mdpi.com/submission/topic/view")+window.location.href.indexOf("susy.mdpi.com/special_issue/process") > -2){try{
        waitForKeyElements("#special_issue_notesText",SINotes);
        waitForKeyElements("#topic_notesText",TopicNotes);
        function SINotes() {
            $("#manuscript-special-issue-notes").css("height","1000px");
            $("[aria-describedby|='manuscript-special-issue-notes']").css("width","500px");
            $("#special_issue_notesText").css("height","800px");
        }
        function TopicNotes() {
            $("#manuscript-special-issue-notes").css("height","1000px");
            $("[aria-describedby|='manuscript-special-issue-notes']").css("width","500px");
            $("#topic_notesText").css("height","800px");
        }
        $('#si-update-emphasized').before('<a href="?pagesection=AddGuestEditor" title="New special issue">➕</a> ');
        $('#si-update-emphasized').before('<a href="'+$('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/","/special_issue/reset_status/")+'" title="Reset">↩</a> ');
        $('#si-update-emphasized').before('<a href="'+$('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/","/special_issue/close_invitation/")+'" title="Close Invitation (will change to pending English)">🆑</a> ');
        $('div.cell.small-12.medium-6.large-2:contains("Online Date")').next().css({"background-color":"yellow"});
        $('#guestNextBtn').after(" <a onclick='$(`#form_article_title_5`)[0].value=$(`#form_article_title_4`)[0].value=$(`#form_article_title_3`)[0].value=$(`#form_article_title_2`)[0].value=$(`#form_article_title_1`)[0].value; $(`#form_article_doi_5`)[0].value=$(`#form_article_doi_4`)[0].value=$(`#form_article_doi_3`)[0].value=$(`#form_article_doi_2`)[0].value=$(`#form_article_doi_1`)[0].value;'>[CpPub]</a>");
        //$(".input-group-button").append('&nbsp; <input type="button" class="submit add-planned-paper-btn" value="Force Add">');
    } catch (error){ }}
})();
