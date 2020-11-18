// ==UserScript==
// @name          Susy Modifier
// @version       0.11.18
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
        var susycheck = "https://susy.mdpi.com/user/guest_editor/check?email="+ window.location.href.match(/search_content=(\S*)/)[1] +"&special_issue_id=1";
        if (susycheck.indexOf("@") > -1){
            $("body").prepend("<p>⬆️ ⬆️ ⬆️ ⬆️ ⬆️</p>");
            GM_xmlhttpRequest({
                method: 'GET',
                url: susycheck,
                headers: {'User-agent': 'Mozilla/5.0 (compatible)', 'Accept': 'application/atom+xml,application/xml,text/xml',},
                onload: function(responseDetails) {
                    $("body").prepend(responseDetails.responseText);
                }
            });
        }
    } catch (error){ }}

    //reviewer checking样式⚙️
    if (window.location.href.indexOf("checking/") > -1){try{
        $("body").append('<iframe frameborder="0" width="100%" hight="160px" src="'+ $(".reviewerNotes").attr("data-load-url") +'"></iframe>');
    } catch (error){ }}

    //susy侧边栏的SI按钮🔎
    if (window.location.href.indexOf("susy.mdpi.com/") > -1){try{
        var siappend="<div id='si-search' tabindex='-1' role='dialog' style='display: none; position: absolute; height: 300px; width: 500px; top: 500px; left: 242.5px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-draggable ui-resizable' aria-describedby='display-user-info'><div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle'><span class='ui-dialog-title'>Special Issue Search</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close' title='Close' onclick='document.getElementById(\"si-search\").style.display=\"none\"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div><div id='display-user-info' data-url='/user/info' class='ui-dialog-content ui-widget-content' style='width: auto; min-height: 0px; max-height: none; height: 512px;'>\
<form class='insertform' method='get' action='https://susy.mdpi.com/special_issue_pending/list/search' target='_blank'><input type='text' name='show_all' value='my_journals' style='display:none;'>   <input type='text' name='form[si_name]' id='si-search2'><input type='submit' class='submit' value='SI Search'></form></div></div>";
        $("body").append(siappend);
        $("[data-menu='editorial_office'] > li:nth-child(8)").append("<a href='https://susy.mdpi.com/special_issue_pending/list/online?sort_field=special_issue_pending.publish_date&sort=DESC'>[O]</a> <a href='https://susy.mdpi.com/special_issue_pending/list/online?form%5Bjournal_id%5D=154&form%5Bsection_id%5D=893&show_all=my_journals&sort_field=special_issue_pending.deadline&sort=ASC'>[Fuzzy]</a><div style='float:right;'><a onclick='document.getElementById(\"si-search\").style.display=\"\"'><img src='https://susy.mdpi.com/bundles/mdpisusy/img/icon/magnifier.png'></a> </div>");
        $("[data-menu='editorial_office'] > li:nth-child(2)").append("<a href='https://susy.mdpi.com/user/managing/status/all?form%5Bjournal_id%5D=154&form%5Bsection_id%5D=893&sort_field=submission_manuscript_state.last_action&sort=DESC'>[Fuzzy]</a>");
    } catch (error){ }}

    //默认新建特刊位于Mathematics🔢
    if (window.location.href.indexOf("susy.mdpi.com/user/special_issue/edit/0") > -1){try{
        document.getElementById('form_id_journal').value = "154";
        document.evaluate('//*[@id="form_id_journal_chosen"]/a/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText="Mathematics";
    } catch (error){ }}

    //invite email修改标题✏️
    if (window.location.href.indexOf("ebm_pending/invite_email") > -1){try{
        $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailSubject\').value=document.getElementById(\'mailSubject\').value.replace(\'ISSN 2227-7390) [Mathematics] (IF=1.747\', \'Rank Q1\').replace(\'ISSN 2227-7390\', \'Rank Q1\');"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a>')
    } catch (error){ }}
    if (window.location.href.indexOf("invite/guest_editor") > -1){try{
        $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailBody\').value=document.getElementById(\'mailBody\').value.replace(\'gladly waive\', \'gladly offer 50% discounts on\');">[50%]</a>')
        $('#mailSubject').parent().after('<a onclick="document.getElementById(\'mailSubject\').value=document.getElementById(\'mailSubject\').value.replace(\'ISSN 2227-7390\', \'Rank Q1\'); document.getElementById(\'mailBody\').value=document.getElementById(\'mailBody\').value.replace(\'from the Guest Editor. If\', \'from the Guest Editor, and may offer discounts for papers invited by the Guest Editor. If\');"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a> ')
    } catch (error){ }}

    //默认新建EBM位于Mathematics+TE🔢
    if (window.location.href.indexOf("susy.mdpi.com/user/ebm/management") > -1){try{
        document.getElementById('journal_id').value = "154";
        document.getElementById('role').value = "Topic Editor";
        document.evaluate('//*[@id="journal_id_chosen"]/a/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.innerText="Mathematics";
    } catch (error){ }}

    //Scopus校正
    if (window.location.href.indexOf("authid/detail.uri?authorId") > -1 && window.location.href.indexOf("FEATURE_AUTHOR_DETAILS_BOTOX:0") == -1 ){try{
        $("body").prepend('<iframe frameborder="0" width="100%" height="90%" src="'+document.URL.replace(/featureToggles=FEATURE_AUTHOR_DETAILS_BOTOX:1/, "")+'&featureToggles=FEATURE_AUTHOR_DETAILS_BOTOX:0"></iframe>');
    } catch (error){ }}

    //Google Scholar校正
    if (window.location.href.indexOf("&amp;") > -1){
        function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
        try{
            window.location.href="https://scholar.google.com/citations?hl=en&user="+getUrlParam('amp;user')
        } catch (error){ }}
})();
