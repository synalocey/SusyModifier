// ==UserScript==
// @name          CfP Checker
// @version       2.3.16
// @namespace     https://github.com/synalocey/SusyModifier
// @description   CfP Checker
// @author        Syna
// @icon          https://www.mdpi.com/img/journals/mathematics-logo-sq.png
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/CfPchecker.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/CfPchecker.user.js
// @match         *://redmine.mdpi.cn/*
// @match         *://redmine.mdpi.com/*
// @require       https://code.jquery.com/jquery-3.6.0.min.js
// @require       https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant         GM_xmlhttpRequest
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    $('label:contains("From CFP Checkers")').after(" <a id='gmMyDiv'><u>[Start Check]</u></a>");
    $("#gmMyDiv").click (sk_cfpcheck_func);

    function sk_cfpcheck_func (zEvent) {
        var Today=new Date();
        $("#issue_pe_note").val($("#issue_pe_note").val()+"--- Checked on " + Today.getFullYear()+ "-" + (Today.getMonth()+1) + "-" + Today.getDate() + " ---\n");
        if($(".subject").text().indexOf("[Mathematics]") == -1){$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find [Mathematics]\n")}

        if($(".subject").text().indexOf("New CFP Request") > -1){ //未延期特刊
            if($('a:contains("mailing-list.v1")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ Cannot find mailing-list.v1\n")}
            if($('a:contains("cfp-approval.v1.pdf")').length+$('a:contains("cfp-approval.v1.eml")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find cfp-approval.v1.eml (or pdf)\n")}
            if($('a:contains("mailing-list.v1")').length*($('a:contains("cfp-approval.v1.pdf")').length+$('a:contains("cfp-approval.v1.eml")').length)>0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"✅ First Round CfP\n")}
            $('a:contains("mailing-list.v1")').append('<span></span>');
            $('a:contains("mailing-list.v1") span').click();
        }
        else if ($(".subject").text().indexOf("Extended SI") > -1) { //已延期特刊
            if($('a:contains("mailing-list.v3")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ Cannot find mailing-list.v3\n")}
            if($('a:contains("cfp-approval.v2.pdf")').length+$('a:contains("cfp-approval.v2.eml")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find cfp-approval.v2.eml (or pdf)\n")}
            if($('a:contains("mailing-list.v3")').length*($('a:contains("cfp-approval.v2.pdf")').length+$('a:contains("cfp-approval.v2.eml")').length)>0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"✅ Extended SI CfP\n")}
            $('a:contains("mailing-list.v3")').append('<span></span>');
            $('a:contains("mailing-list.v1")').append('<span></span>');
            $('a:contains("mailing-list.v1")').attr('target', '_blank');
            $('a:contains("mailing-list.v3") span').click();
            $('a:contains("mailing-list.v1") span').first().click();
        }
        else { //名称不规范
            $("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Subject is Wrong.\n")
        }

        if($(".assigned-to").text().indexOf("CfP") == -1) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Assignee is not CfP/MDPI\n")};

    }

    //CfP filter链接
    $("#header > h1").append(" <a href='https://redmine.mdpi.cn/projects/si-planning/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]==&v[status_id][]=13&f[]=cf_10&op[cf_10]==&v[cf_10][]=Mathematics&f[]=&c[]=cf_25&c[]=cf_10&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&sort=updated_on%3Adesc&per_page=100'>[Maths CfP]</a>")

    //Redmine重定向
    if(window.location.href.indexOf("//redmine.mdpi.com/") > -1){window.location.replace(decodeURIComponent(window.location.href.split("login?back_url=")[window.location.href.split("login?back_url=").length-1]).replace("//redmine.mdpi.com/","//redmine.mdpi.cn/"));}

    //排队界面
    if(window.location.href.indexOf("/projects/si-planning/issues?utf8=") > -1){
        $('[href="/users/64"]').css("background-color", "yellow");
        $('h2:contains("Issues")').append(" <span style='background-color: yellow;'>(" + $('[href="/users/64"]').length + " pending CfP Team)</span>");
    }
})();
