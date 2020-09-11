// ==UserScript==
// @name          Susy Modifier
// @version       0.9.8
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Susy Modifier
// @author        Syna
// @icon          https://skday.com/favicon.ico
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @match         https://*.mdpi.com/*
// @require       https://code.jquery.com/jquery-3.5.1.min.js
// @require       https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.indexOf("susy.mdpi.com/special_issue/process") > -1){
        try{
            $('#si-update-emphasized').before('<a href="/user/special_issue/edit/0" title="New special issue">➕</a> ');
        } catch (error){ }
    }

    if (window.location.href.indexOf("/special_issues/") > -1){
        try{
            $("h1").append(' <a href="https://susy.mdpi.com/special_issue_pending/list/search?show_all=my_journals&form%5Bsi_name%5D='+$("h1").text().split('"')[1]+'" title="Edit"><img src="https://susy.mdpi.com/bundles/mdpisusy/img/icon/pencil.png"></a>');
        } catch (error){ }
    }

    if (window.location.href.indexOf("/process_form/") > -1){
        try{
            $("[title|='Google']").before(' <a href="https://www.researchgate.net/search.Search.html?type=publication&query='+$("[title|='Google']").prev()[0].text+'" title="Researchgate" target="_blank"><img style="vertical-align: middle;" src="https://c5.rgstatic.net/m/41542880220916/images/favicon/favicon-16x16.png"></a> ');
        } catch (error){ }
    }

    if (window.location.href=='https://susy.mdpi.com/special_issue_pending/list'){
        try{
            var totalpage = document.getElementsByClassName("pagination margin-0")[0].getElementsByTagName("li").length-1
            for (var i = 2; i < totalpage; i++) {
                (function(i){//闭包
                    setTimeout(function(){
                        console.log(i);
                        var IFramename = "iframe"+i;
                        $("body").append('<iframe id="iframe'+i+'" src="https://susy.mdpi.com/special_issue_pending/list?page=' +i+ '" style="display:none;"></iframe>');
                        document.getElementById("iframe"+i).onload = function () {
                            $('#statustable').after(document.getElementById("iframe"+i).contentWindow.document.getElementById("statustable"))
                            $('#statustable').attr('id','old_statustable');
                        }
                    },500*i)
                })(i);//闭包
            };
        } catch (error){ }
    }

    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/search/emails") > -1){
        try{
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = "/assets/application-79a8659b0064dad9845d4ec2f290c6e94795079e79a99ab4354776213eb35db0.css";
            document.getElementsByTagName("head")[0].appendChild(link);
            document.body.innerHTML = document.body.innerHTML.replace(new RegExp(' data-url="','g'),' href="');
        } catch (error){ }
    }

    if (window.location.href.indexOf("susy.mdpi.com/") > -1){
        try{
            var siappend="<div id='si-search' tabindex='-1' role='dialog' style='position: absolute; height: 300px; width: 500px; top: 500px; left: 242.5px; display: block; z-index: 101;' class='hide ui-dialog ui-corner-all ui-widget ui-widget-content ui-front ui-draggable ui-resizable' aria-describedby='display-user-info'>\
<div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle'><span class='ui-dialog-title'>Special Issue Search</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close' title='Close' onclick='document.getElementById(\"si-search\").classList.add(\"hide\");'><span class='ui-button-icon ui-icon ui-icon-closethick'></span><span class='ui-button-icon-space'> </span>Close</button></div><div id='display-user-info' data-url='/user/info' class='ui-dialog-content ui-widget-content' style='width: auto; min-height: 0px; max-height: none; height: 512px;'>\
<form class='insertform' method='get' action='https://susy.mdpi.com/special_issue_pending/list/search' target='_blank'>\
<input type='text' name='show_all' value='my_journals' style='display:none;'>   <input type='text' name='form[si_name]' id='si-search2'>\
<input type='submit' class='submit' value='SI Search'></form></div></div>";
            $("body").append(siappend);
            $("[data-menu='editorial_office'] > li:nth-child(8)").append("<div style='float:right;'><a onclick='document.getElementById(\"si-search\").classList.remove(\"hide\");'><img src='https://susy.mdpi.com/bundles/mdpisusy/img/icon/magnifier.png'></a> </div>");
        } catch (error){ }
    }
})();
