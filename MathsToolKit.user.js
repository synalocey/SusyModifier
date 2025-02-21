// ==UserScript==
// @name          Maths ToolKit
// @version       5.2.25
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Maths ToolKit
// @author        Syna
// @icon64        https://pub.mdpi-res.com/img/journals/mathematics-logo-sq.png
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/MathsToolKit.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/MathsToolKit.user.js
// @match         *://*.mdpi.com/*
// @match         *://skday.eu.org/*
// @require       https://unpkg.com/jquery@4.0.0-beta/dist/jquery.js
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
        if ((Date.now() - date_v)/86400000 > 360) {$("#maincol").html("<p>!!! Outdated !!!</p>"); return;}
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
bbb@bbb.edu" minlength="1" rows="10" spellcheck="false"></textarea>
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
                        <textarea id="mathbatch_results" minlength="1" rows="3" spellcheck="false"></textarea>
                    </div>
                </div>

            </fieldset>
        </div>
    </form>
</div>`);

            $("#mathbatch_button").click(function (){
                $("#mathbatch_button").prop("disabled", true);
                var textContent = $("#mathbatch_emails").val().trim();
                var emails = textContent.split(/[\n;,\t]+/), results = Array(emails.length).fill("");

                const CONCURRENT_REQUESTS = 10; //并发数

                async function fetchUnsubscribeLink(email, index) {
                    var url = 'https://susy.mdpi.com/user/get/unsubscribe_manage_link/' + email.trim();
                    try {
                        let response = await $.ajax({ url: url, type: 'GET' });
                        if (response.status === "success") {
                            results[index] = response.link;
                        } else if (response.status === "failed") {
                            results[index] = response.message;
                        } else {
                            results[index] = "error";
                        }
                    } catch (error) {
                        results[index] = "Error: " + error.statusText;
                    }
                    $("#mathbatch_results").val(results.join('\n'));
                    const nonEmptyResults = results.filter(result => result !== "").length + 2;
                    $("#mathbatch_results").prop("rows", nonEmptyResults * 2);
                }

                async function batchRequest(emailsBatch, startIndex) {
                    let promises = emailsBatch.map((email, batchIndex) => fetchUnsubscribeLink(email, startIndex + batchIndex));
                    await Promise.all(promises);
                }

                async function handleAllRequests() {
                    for (let i = 0; i < emails.length; i += CONCURRENT_REQUESTS) {
                        let batch = emails.slice(i, i + CONCURRENT_REQUESTS);
                        await batchRequest(batch, i);
                    }
                    $("#mathbatch_button").prop("disabled", false);
                }

                handleAllRequests();
                $("#mathbatch_form2").show();
            });

        }
    }
    console.timeEnd("Maths")
})();
