// ==UserScript==
// @name          Maths ToolKit
// @version       3.6.28
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Maths ToolKit
// @author        Syna
// @icon          https://pub.mdpi-res.com/img/journals/mathematics-logo-sq.png
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/MathsToolKit.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/MathsToolKit.user.js
// @match         *://*.mdpi.com/*
// @match         *://skday.eu.org/*
// @require       https://unpkg.com/jquery@3.7.0/dist/jquery.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_openInTab
// @connect       mdpi.com
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict'; console.time("Maths");
    if (window.location.href.indexOf("skday.eu.org/math.html") > -1 ) {
        $("h2").html("正在加载，请确保susy已登陆...");
        location.href = "https://susy.mdpi.com/user/settings#math";
    }

    if (window.location.href.indexOf("susy.mdpi.com/user/settings#math") > -1 ) {
        const date_v = new Date('202'+GM_info.script.version);
        if ((Date.now() - date_v)/86400000 > 180) {$("#maincol").html("<p>!!! Outdated !!!</p>"); return;}
        else {
            $("#maincol").html(`
<div class="quickform">
    <form>
        <div>
            <fieldset>
                <legend>[Mathematics] Batch Unsubscribe Link</legend><br>
                <div class="row grid-x grid-padding-x grid-margin-y">
                    <div class="cell small-12 medium-6 large-2">
                        <label>
                            Author Emails
                        </label>
                        <break></break>
                    </div>
                    <div class="cell small-12 medium-6 large-8">
                        <textarea id="mathbatch_emails" placeholder="Example:
111@111.com
222@222.com
aaa@aaa.edu
bbb@bbb.edu" minlength="1" maxlength="20000" rows="10" spellcheck="false"></textarea>
                        <input type="button" value="Get Unsubscribe Links" id="mathbatch_button" class="submit" />
                    </div>
                </div>
                <div id="mathbatch_form2" class="row grid-x grid-padding-x grid-margin-y" style="display: none;">
                    <div class="cell small-12 medium-6 large-2">
                        <label>
                            Results<br>(Please copy to Excel)
                        </label>
                        <break></break>
                    </div>
                    <div class="cell small-12 medium-6 large-8">
                        <textarea id="mathbatch_results" minlength="1" maxlength="20000" rows="3" spellcheck="false"></textarea>
                    </div>
                </div>

            </fieldset>
        </div>
    </form>
</div>`);
            $("#mathbatch_button").click(function (){
                $("#mathbatch_button").prop("disabled", true);
                var textContent = $("#mathbatch_emails").val().trim();
                var emails = textContent.split(/[\n;,\t]+/), results = [];

                async function getEmailResponses() {
                    for (let email of emails) {
                        var url = 'https://susy.mdpi.com/user/get/unsubscribe_manage_link/' + email.trim();
                        await $.ajax({
                            url: url,
                            type: 'GET',
                            success: function(response) {
                                if (response.status === "success") {
                                    results.push(response.link);
                                } else if (response.status === "failed") {
                                    results.push(response.message);
                                } else {
                                    results.push("error");
                                }
                                $("#mathbatch_results").prop("rows",$("#mathbatch_results").prop("rows")+2);
                                $("#mathbatch_results").val(results.join('\n'));
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                results.push("Error: " + errorThrown);
                                $("#mathbatch_results").prop("rows",$("#mathbatch_results").prop("rows")+2);
                                $("#mathbatch_results").val(results.join('\n'));
                            }
                        });
                    }
                    $("#mathbatch_button").prop("disabled", false);
                }

                $("#mathbatch_form2").show();
                getEmailResponses();
            });
        }
    }
    console.timeEnd("Maths")
})();
