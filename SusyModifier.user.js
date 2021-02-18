// ==UserScript==
// @name          Susy Modifier
// @version       1.2.18
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Susy Modifier
// @author        Syna
// @icon          https://skday.com/favicon.ico
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @match         https://*.mdpi.com/*
// @match         https://*.scopus.com/*
// @match         *://scholar.google.co.uk/*&amp;user*
// @match         *://scholar.google.com/*&amp;user*
// @match         *://scholar.google.com.hk/*&amp;user*
// @match         *://scholar.google.com.tw/*&amp;user*
// @require       https://code.jquery.com/jquery-3.5.1.min.js
// @require       https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant         GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    //添加新建特刊➕符号
    if (window.location.href.indexOf("susy.mdpi.com/special_issue/process") > -1){try{
        $('#si-update-emphasized').before('<a href="/user/special_issue/edit/0" title="New special issue">➕</a> ');
    } catch (error){ }}

    //特刊主页添加修改✏️符号
    if (window.location.href.indexOf("/special_issues/") > -1){try{
        $("h1").append(' <a href="https://susy.mdpi.com/special_issue_pending/list/search?show_all=my_journals&form%5Bsi_name%5D='+$("h1").text().split('"')[1]+'" title="Edit"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a>');
    } catch (error){ }}

    //添加文章处理页面Researchgate[RG]
    if (window.location.href.indexOf("/process_form/") > -1){try{
        $("[title|='Google']").before(' <a href="https://www.researchgate.net/search.Search.html?type=publication&query='+$("[title|='Google']").prev()[0].text+'" title="Researchgate" target="_blank"><img style="vertical-align: middle;" src="https://c5.rgstatic.net/m/41542880220916/images/favicon/favicon-16x16.png"></a> ');
        $("[title|='Link pre-manuscript']").after(' <a href="https://script.google.com/macros/s/AKfycbx1XtdG27UCL9Q1LdpAC_10ek75MDUr_BDYtdg8Ig/exec?name=' + document.getElementsByClassName("editorName")[0].textContent.trim() + '&phone=' + document.getElementById("manuscript_id").parentNode.textContent.trim() + '" target="_blank"><img style="vertical-align: middle;" src="https://ssl.gstatic.com/docs/common/addon_sheets_promo.svg" height="16" width="16"></a> <a href="https://script.google.com/macros/s/AKfycbxb_kAH3cErvnmKfucepiMzdjvige7NH38JIsXhTheONPP9JWE/exec?name='+ document.getElementById("manuscript_id").parentNode.textContent.trim() +'" target="_blank">[Promote]</a>');
        $("[title|='Unlink pre-manuscript']").after(' <a href="https://script.google.com/macros/s/AKfycbx1XtdG27UCL9Q1LdpAC_10ek75MDUr_BDYtdg8Ig/exec?name=' + document.getElementsByClassName("editorName")[0].textContent.trim() + '&phone=' + document.getElementById("manuscript_id").parentNode.textContent.trim() + '" target="_blank"><img style="vertical-align: middle;" src="https://ssl.gstatic.com/docs/common/addon_sheets_promo.svg" height="16" width="16"></a> <a href="https://script.google.com/macros/s/AKfycbxb_kAH3cErvnmKfucepiMzdjvige7NH38JIsXhTheONPP9JWE/exec?name='+ document.getElementById("manuscript_id").parentNode.textContent.trim() +'" target="_blank">[Promote]</a>');
    } catch (error){ }}

    //特刊列表免翻页⚙️
    if (window.location.href.indexOf("susy.mdpi.com/special_issue_pending/list") > -1 && window.location.href.indexOf("page=") == -1){try{
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
    if (window.location.href.indexOf("checking/") > -1){
        try{$("body").append('<iframe frameborder="0" width="100%" hight="160px" src="'+ $(".reviewerNotes").attr("data-load-url") +'"></iframe>');
            function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
            $(".reviewerNotes").after(" <a href='https://scholar.google.com/scholar?hl=en&q=" + getUrlParam('email') +"'><img style='vertical-align: middle;' src='/bundles/mdpisusy/img/design/google_logo.png'></a>");
            document.getElementsByClassName("see-blocked-info")[0].href="https://susy.mdpi.com/reviewer/blocked/seemore?email="+getUrlParam('email');
           } catch (error){ } }

    //susy侧边栏的SI按钮🔎
    if (window.location.href.indexOf("susy.mdpi.com/") > -1){try{
        var siappend="<div id='si-search' tabindex='-1' role='dialog' style='display: none; position: absolute; height: 300px; width: 500px; top: 500px; left: 242.5px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-draggable ui-resizable' aria-describedby='display-user-info'><div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle'><span class='ui-dialog-title'>Special Issue Search</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close' title='Close' onclick='document.getElementById(\"si-search\").style.display=\"none\"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div><div id='display-user-info' data-url='/user/info' class='ui-dialog-content ui-widget-content' style='width: auto; min-height: 0px; max-height: none; height: 512px;'>\
<form class='insertform' method='get' action='https://susy.mdpi.com/special_issue_pending/list/search' target='_blank'><input type='text' name='show_all' value='my_journals' style='display:none;'>   <input type='text' name='form[si_name]' id='si-search2'><input type='submit' class='submit' value='SI Search'></form></div></div>";
        $("body").append(siappend);
        $("[data-menu='editorial_office'] > li > [href='/special_issue_pending/list']").after(" <a href='https://susy.mdpi.com/special_issue_pending/list/online?sort_field=special_issue_pending.publish_date&sort=DESC'>[O]</a> <a href='https://susy.mdpi.com/special_issue_pending/list/online?form%5Bjournal_id%5D=154&form%5Bsection_id%5D=893&show_all=my_journals&sort_field=special_issue_pending.deadline&sort=ASC'>[Fu]</a><a href='https://susy.mdpi.com/special_issue_pending/list/online?form%5Bjournal_id%5D=154&form%5Bsection_id%5D=895&show_all=my_journals&sort_field=special_issue_pending.deadline&sort=ASC'>[FM]</a><div style='float:right;'><a onclick='document.getElementById(\"si-search\").style.display=\"\"'><img src='https://susy.mdpi.com/bundles/mdpisusy/img/icon/magnifier.png'></a> </div>");
        $("[data-menu='editorial_office'] > li > [href='/user/managing/status/submitted']").after(" <a href='https://susy.mdpi.com/user/managing/status/all?form%5Bjournal_id%5D=154&form%5Bsection_id%5D=895&sort_field=submission_manuscript_state.last_action&sort=DESC'>[FM]</a>");
        $("[data-menu='editorial_office'] > li > [href='/user/managing/status/submitted']").after(" <a href='https://susy.mdpi.com/user/managing/status/all?form%5Bjournal_id%5D=154&form%5Bsection_id%5D=893&sort_field=submission_manuscript_state.last_action&sort=DESC'>[Fu]</a>");
    } catch (error){ }}

    //默认新建特刊位于Mathematics🔢
    if (window.location.href.indexOf("susy.mdpi.com/user/special_issue/edit/") > -1){try{
        document.getElementById('form_id_journal').value = "154";
        document.evaluate('//*[@id="form_id_journal_chosen"]/a/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText="Mathematics";
        $("#form_name").after("<a href='#' onclick='function reqListener () {  $(\"#form_name\")[0].value=this.responseText;}var oReq = new XMLHttpRequest();oReq.addEventListener(\"load\", reqListener);oReq.open(\"GET\", \"https://brettterpstra.com/titlecase/?title=\" + $(\"#form_name\")[0].value);oReq.send();' return false;>🔠🔡</a> ");
    } catch (error){ }}

    //invite/remind email修改标题✏️
    if (window.location.href.indexOf("ebm_pending/invite_email") > -1){try{
        $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailSubject\').value=document.getElementById(\'mailSubject\').value.replace(\'ISSN 2227-7390) [Mathematics] (IF=1.747\', \'Rank Q1\').replace(\'ISSN 2227-7390\', \'Rank Q1\');"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a>')
    } catch (error){ }}
    if (window.location.href.indexOf("invite/guest_editor") > -1){try{
        $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailBody\').value=document.getElementById(\'mailBody\').value.replace(\'gladly waive\', \'gladly offer 50% discounts on\');">[50%]</a>')
        $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailSubject\').value=document.getElementById(\'mailSubject\').value.replace(\'ISSN 2227-7390\', \'Rank Q1\'); document.getElementById(\'mailBody\').value=document.getElementById(\'mailBody\').value.replace(\'from the Guest Editor. If\', \'from the Guest Editor, and may offer discounts for papers invited by the Guest Editor. If\');"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a> ')
    } catch (error){ }}
    if (window.location.href.indexOf("remind/guest_editor") > -1){try{
        $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailSubject\').value=document.getElementById(\'mailSubject\').value.replace(\'ISSN 2227-7390\', \'Rank Q1\').replace(\'Re: \', \'Awaiting Your Reply: \'); document.getElementById(\'mailBody\').value=document.getElementById(\'mailBody\').value.replace(\'We recently\', \'I am sorry for sending the repeated message as I did not get your reply. We recently\').replace(\'Please let us know whether or not you are interested, and if you have any further questions.\', \'We sincerely hope to cooperate with you. If you need more information, please do not hesitate to contact us. Please click on the following link to either accept or decline our request:\');"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a> ')
    } catch (error){ }}

    //默认新建EBM位于Mathematics+TE🔢
    if (window.location.href.indexOf("susy.mdpi.com/user/ebm/management") > -1){try{
        document.getElementById('journal_id').value = "154";
        document.getElementById('role').value = "Topic Editor";
        document.evaluate('//*[@id="journal_id_chosen"]/a/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText="Mathematics";
        $("#ebm_pending_check_btn").before('<input class="submit" type="submit" value="Proceed"> ');
    } catch (error){ }}

    //Scopus校正
    //    if (window.location.href.indexOf("authid/detail.uri?authorId") > -1 && window.location.href.indexOf("FEATURE_AUTHOR_DETAILS_BOTOX:0") == -1 ){try{
    //        if(!document.getElementById("authDetailsNameSection")){$("body").prepend('<iframe frameborder="0" width="100%" height="90%" src="'+document.URL.replace(/featureToggles=FEATURE_AUTHOR_DETAILS_BOTOX:1/, "")+'&featureToggles=FEATURE_AUTHOR_DETAILS_BOTOX:0"></iframe>');}
    //    } catch (error){ }}

    //Google Scholar校正
    if (window.location.href.indexOf("&amp;") > -1){
        function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
        try{
            window.location.href="https://scholar.google.com/citations?hl=en&user="+getUrlParam('amp;user')
        } catch (error){ }}
})();
