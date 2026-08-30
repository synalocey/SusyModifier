// ==UserScript==
// @name         NSR Flow Control Tower
// @version      26.8.28
// @description  NSR Flow Control Tower
// @author       Kyra
// @match        https://fep.lamresearch.com/*
// @match        https://www.lamresearch.com/*
// @run-at       document-start
// @noframes
// @downloadURL  https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/NSR_Control_Tower.user.js
// @updateURL    https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/NSR_Control_Tower.user.js
// @require      https://gcore.jsdelivr.net/npm/jquery@4.0.0/dist/jquery.min.js
// @require      https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/chosen.jquery.js
// @require      https://gcore.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @require      https://gcore.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      127.0.0.1
// ==/UserScript==
// Readable development source. Run build-nsr-userjs.mjs after editing.
/* globals jQuery, XLSX, ExcelJS, GM_info, GM_registerMenuCommand, GM_setClipboard, GM_xmlhttpRequest, unsafeWindow */

(function(){
'use strict';
const date_v = new Date('202' + GM_info.script.version);
const APP_PATH='/k1.png';
const BRIDGE_PATH='/k2.png';
const FLAG='nsrCtLaunch';
const BRIDGE_FLAG='nsrSapBridgeLaunch';
const FLP='/flp#ZNSR-display-1';
const PROBE="/sap/opu/odata/sap/ZNSR_CD_SRV/WorkflowSet/?$filter=Nsrnum%20%20eq%20%27%27";
const BRIDGE_URL='http://127.0.0.1:8765';
const APP_CSS=`
.chosen-container{position:relative;display:inline-block;vertical-align:middle;font-size:13px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.chosen-container *{
-webkit-box-sizing:border-box;box-sizing:border-box}.chosen-container .chosen-drop{position:absolute;top:100%;z-index:1010;width:100%;border:1px solid #aaa;border-top:0;background:#fff;
-webkit-box-shadow:0 4px 5px rgb(0 0 0 / .15);box-shadow:0 4px 5px rgb(0 0 0 / .15);clip:rect(0,0,0,0);-webkit-clip-path:inset(100% 100%);clip-path:inset(100% 100%)}
.chosen-container.chosen-with-drop .chosen-drop{clip:auto;-webkit-clip-path:none;clip-path:none}.chosen-container a{cursor:pointer}.chosen-container .chosen-single .group-name,
.chosen-container .search-choice .group-name{margin-right:4px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:400;color:#999}.chosen-container .chosen-single .group-name:after,
.chosen-container .search-choice .group-name:after{content:":";padding-left:2px;vertical-align:top}.chosen-container-single .chosen-single{position:relative;display:block;overflow:hidden;padding:0 0 0
 8px;height:25px;border:1px solid #aaa;border-radius:5px;background-color:#fff;background:
-webkit-gradient(linear,left top,left bottom,color-stop(20%,#fff),color-stop(50%,#f6f6f6),color-stop(52%,#eee),to(#f4f4f4));background:linear-gradient(#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);
background-clip:padding-box;-webkit-box-shadow:0 0 3px #fff inset,0 1px 1px rgb(0 0 0 / .1);box-shadow:0 0 3px #fff inset,0 1px 1px rgb(0 0 0 / .1);color:#444;text-decoration:none;white-space:nowrap;
line-height:24px}.chosen-container-single .chosen-default{color:#999}.chosen-container-single .chosen-single span{display:block;overflow:hidden;margin-right:26px;text-overflow:ellipsis;white-space:
nowrap}.chosen-container-single .chosen-single-with-deselect span{margin-right:38px}.chosen-container-single .chosen-single abbr{position:absolute;top:6px;right:26px;display:block;width:12px;height:
12px;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) -42px 1px no-repeat;font-size:1px}.chosen-container-single .chosen-single abbr:hover{background-position:
-42px -10px}.chosen-container-single.chosen-disabled .chosen-single abbr:hover{background-position:-42px -10px}.chosen-container-single .chosen-single div{position:absolute;top:0;right:0;display:block
;width:18px;height:100%}.chosen-container-single .chosen-single div b{display:block;width:100%;height:100%;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) 
no-repeat 0 2px}.chosen-container-single .chosen-search{position:relative;z-index:1010;margin:0;padding:3px 4px;white-space:nowrap}.chosen-container-single .chosen-search input[type=text]{margin:1px 0
;padding:4px 20px 4px 5px;width:100%;height:auto;outline:0;border:1px solid #aaa;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) no-repeat 100% -20px;font-size:
1em;font-family:sans-serif;line-height:normal;border-radius:0}.chosen-container-single .chosen-drop{margin-top:-1px;border-radius:0 0 4px 4px;background-clip:padding-box}
.chosen-container-single.chosen-container-single-nosearch .chosen-search{position:absolute;clip:rect(0,0,0,0);-webkit-clip-path:inset(100% 100%);clip-path:inset(100% 100%)}
.chosen-container .chosen-results{color:#444;position:relative;overflow-x:hidden;overflow-y:auto;margin:0 4px 4px 0;padding:0 0 0 4px;max-height:600px;-webkit-overflow-scrolling:touch}
.chosen-container .chosen-results li{display:none;margin:0;padding:5px 6px;list-style:none;line-height:15px;word-wrap:break-word;-webkit-touch-callout:none}
.chosen-container .chosen-results li.active-result{display:list-item;cursor:pointer}.chosen-container .chosen-results li.disabled-result{display:list-item;color:#ccc;cursor:default}
.chosen-container .chosen-results li.highlighted{background-color:#3875d7;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#3875d7),color-stop(90%,#2a62bc));
background-image:linear-gradient(#3875d7 20%,#2a62bc 90%);color:#fff}.chosen-container .chosen-results li.no-results{color:#777;display:list-item;background:#f4f4f4}
.chosen-container .chosen-results li.group-result{display:list-item;font-weight:700;cursor:default}.chosen-container .chosen-results li.group-option{padding-left:15px}
.chosen-container .chosen-results li em{font-style:normal;text-decoration:underline}.chosen-container-multi .chosen-choices{position:relative;overflow:hidden;margin:0;padding:0 5px;width:100%;height:
auto;border:1px solid #aaa;background-color:#fff;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(1%,#eee),color-stop(15%,#fff));background-image:
linear-gradient(#eee 1%,#fff 15%);cursor:text}.chosen-container-multi .chosen-choices li{float:left;list-style:none}.chosen-container-multi .chosen-choices li.search-field{margin:0;padding:0;
white-space:nowrap}.chosen-container-multi .chosen-choices li.search-field input[type=text]{margin:1px 0;padding:0;height:25px;outline:0;border:0!important;background:0 0!important;-webkit-box-shadow:
none;box-shadow:none;color:#999;font-size:100%;font-family:sans-serif;line-height:normal;border-radius:0;width:25px}.chosen-container-multi .chosen-choices li.search-choice{position:relative;margin:
3px 5px 3px 0;padding:3px 20px 3px 5px;border:1px solid #aaa;max-width:100%;border-radius:3px;background-color:#eee;background-image:
-webkit-gradient(linear,left top,left bottom,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),to(#eee));background-image:
linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-size:100% 19px;background-repeat:repeat-x;background-clip:padding-box;-webkit-box-shadow:0 0 2px #fff inset,0 1px 0 
rgb(0 0 0 / .05);box-shadow:0 0 2px #fff inset,0 1px 0 rgb(0 0 0 / .05);color:#333;line-height:13px;cursor:default}.chosen-container-multi .chosen-choices li.search-choice span{word-wrap:break-word}
.chosen-container-multi .chosen-choices li.search-choice .search-choice-close{position:absolute;top:4px;right:3px;display:block;width:12px;height:12px;background:
url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) -42px 1px no-repeat;font-size:1px}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close:hover{
background-position:-42px -10px}.chosen-container-multi .chosen-choices li.search-choice-disabled{padding-right:5px;border:1px solid #ccc;background-color:#e4e4e4;background-image:
-webkit-gradient(linear,left top,left bottom,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),to(#eee));background-image:
linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);color:#666}.chosen-container-multi .chosen-choices li.search-choice-focus{background:#d4d4d4}
.chosen-container-multi .chosen-choices li.search-choice-focus .search-choice-close{background-position:-42px -10px}.chosen-container-multi .chosen-results{margin:0;padding:0}
.chosen-container-multi .chosen-drop .result-selected{display:list-item;color:#ccc;cursor:default}.chosen-container-active .chosen-single{border:1px solid #5897fb;-webkit-box-shadow:0 0 5px 
rgb(0 0 0 / .3);box-shadow:0 0 5px rgb(0 0 0 / .3)}.chosen-container-active.chosen-with-drop .chosen-single{border:1px solid #aaa;border-bottom-right-radius:0;border-bottom-left-radius:0;
background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#eee),color-stop(80%,#fff));background-image:linear-gradient(#eee 20%,#fff 80%);-webkit-box-shadow:0 1px 0 #fff inset;
box-shadow:0 1px 0 #fff inset}.chosen-container-active.chosen-with-drop .chosen-single div{border-left:none;background:#fff0}.chosen-container-active.chosen-with-drop .chosen-single div b{
background-position:-18px 2px}.chosen-container-active .chosen-choices{border:1px solid #5897fb;-webkit-box-shadow:0 0 5px rgb(0 0 0 / .3);box-shadow:0 0 5px rgb(0 0 0 / .3)}
.chosen-container-active .chosen-choices li.search-field input[type=text]{color:#222!important}.chosen-disabled{opacity:.5!important;cursor:default}.chosen-disabled .chosen-single{cursor:default}
.chosen-disabled .chosen-choices .search-choice .search-choice-close{cursor:default}.chosen-rtl{text-align:right}.chosen-rtl .chosen-single{overflow:visible;padding:0 8px 0 0}
.chosen-rtl .chosen-single span{margin-right:0;margin-left:26px;direction:rtl}.chosen-rtl .chosen-single-with-deselect span{margin-left:38px}.chosen-rtl .chosen-single div{right:auto;left:3px}
.chosen-rtl .chosen-single abbr{right:auto;left:26px}.chosen-rtl .chosen-choices li{float:right}.chosen-rtl .chosen-choices li.search-field input[type=text]{direction:rtl}
.chosen-rtl .chosen-choices li.search-choice{margin:3px 5px 3px 0;padding:3px 5px 3px 19px}.chosen-rtl .chosen-choices li.search-choice .search-choice-close{right:auto;left:4px}
.chosen-rtl.chosen-container-single .chosen-results{margin:0 0 4px 4px;padding:0 4px 0 0}.chosen-rtl .chosen-results li.group-option{padding-right:15px;padding-left:0}
.chosen-rtl.chosen-container-active.chosen-with-drop .chosen-single div{border-right:none}.chosen-rtl .chosen-search input[type=text]{padding:4px 5px 4px 20px;background:
url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) no-repeat -30px -20px;direction:rtl}.chosen-rtl.chosen-container-single .chosen-single div b{background-position:6px 2px}
.chosen-rtl.chosen-container-single.chosen-with-drop .chosen-single div b{background-position:-12px 2px}@media only screen and (-webkit-min-device-pixel-ratio:1.5),
only screen and (min-resolution:144dpi),only screen and (min-resolution:1.5dppx){.chosen-container .chosen-results-scroll-down span,.chosen-container .chosen-results-scroll-up span,
.chosen-container-multi .chosen-choices .search-choice .search-choice-close,.chosen-container-single .chosen-search input[type=text],.chosen-container-single .chosen-single abbr,
.chosen-container-single .chosen-single div b,.chosen-rtl .chosen-search input[type=text]{background-image:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==)!important;
background-size:52px 37px!important;background-repeat:no-repeat!important}}
:root{--bg:#f3f7fb;--panel:#fff;--ink:#0f172a;--muted:#64748b;--line:#d8e3ee;--navy:#052e44;--blue:#2563eb;--teal:#0f766e;--cyan:#0891b2;--green:#16a34a;--amber:#d97706;--red:#dc2626;--purple:#7c3aed;
--shadow:0 14px 34px rgba(15,23,42,.08);--radius:18px;--side:350px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:"Segoe UI",Arial,
"Microsoft YaHei",sans-serif}button,input,select{font:inherit}button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid rgba(14,165,233,.32);outline-offset:2px}.hero{background:
linear-gradient(128deg,#052e44 0,#075985 50%,#0f766e 100%);color:#fff;padding:24px 30px 26px;box-shadow:0 9px 24px rgba(3,46,70,.18)}.hero-inner{max-width:1900px;margin:auto;display:flex;
justify-content:space-between;align-items:flex-end;gap:24px}.hero h1{margin:8px 0 5px;font-size:30px;letter-spacing:-.5px}.hero p{margin:0;color:#d8fbf5;font-size:13px;line-height:1.55;max-width:
1050px}.tag{display:inline-flex;align-items:center;border:1px solid #ffffff55;background:#ffffff1f;border-radius:999px;padding:4px 10px;margin:0 6px 4px 0;font-size:11px;font-weight:800;letter-spacing
:.2px}.hero-source{min-width:270px;background:#ffffff16;border:1px solid #ffffff35;border-radius:14px;padding:12px 14px;text-align:right}.hero-source small{display:block;color:#cffafe;font-size:10px;
text-transform:uppercase;letter-spacing:.7px;font-weight:800}.hero-source strong{display:block;font-size:14px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:390px}
.layout{display:grid;grid-template-columns:var(--side) minmax(0,1fr);gap:16px;max-width:1900px;margin:auto;padding:16px}.card,.side{background:var(--panel);border:1px solid var(--line);border-radius:
var(--radius);box-shadow:var(--shadow)}.side{align-self:start;position:sticky;top:12px;max-height:calc(100vh - 24px);overflow:auto;padding:15px;scrollbar-width:thin}.main{display:grid;gap:16px;
min-width:0}.section-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.section-title h2,.side h2{font-size:17px;margin:0;letter-spacing:-.15px}
.section-title p{margin:3px 0 0;color:var(--muted);font-size:12px}.side-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:15px 0 8px}.upload-box{border:1.5px dashed 
#9fb6c8;background:linear-gradient(180deg,#fbfdff,#f5fafc);border-radius:14px;padding:12px;margin-top:12px}.upload-box label{display:block;font-size:11px;font-weight:900;color:#334155;text-transform:
uppercase;letter-spacing:.45px;margin-bottom:7px}.upload-box input{display:block;width:100%;font-size:11px;color:#475569}.upload-box input::file-selector-button{border:0;border-radius:8px;background:
#e2e8f0;color:#0f172a;font-weight:800;padding:7px 9px;margin-right:7px;cursor:pointer}.source-status{margin-top:10px;border-left:4px solid var(--blue);background:#eff6ff;color:#1e3a8a;border-radius:
10px;padding:9px 10px;font-size:11px;line-height:1.5}.source-status.loading{border-color:var(--amber);background:#fffbeb;color:#78350f}.source-status.error{border-color:var(--red);background:#fef2f2;
color:#991b1b}.source-status.ok{border-color:var(--teal);background:#ecfdf5;color:#14532d}.btn{border:0;border-radius:10px;background:var(--teal);color:#fff;font-weight:850;padding:9px 11px;cursor:
pointer;transition:transform .12s ease,filter .12s ease}.btn:hover{filter:brightness(1.05);transform:translateY(-1px)}.btn.light{background:#e2e8f0;color:#0f172a}.btn.blue{background:var(--blue)}
.btn.small{padding:6px 9px;font-size:11px}.btn.wide{width:100%;margin-top:8px}.filter-group{border-top:1px solid #edf2f7;padding:9px 0 2px}.filter-label{display:flex;align-items:center;justify-content
:space-between;gap:8px;margin-bottom:5px}.filter-label label{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.45px;font-weight:900;cursor:pointer}.filter-label button{border:0;
background:0 0;color:var(--blue);padding:2px;font-size:10px;font-weight:800;cursor:pointer}.filter-select{width:100%;min-height:38px;border:1px solid var(--line);border-radius:9px;background:#fff;
padding:6px}.quick-pick{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:6px}.quick-pick span{font-size:9px;color:var(--muted);font-weight:900;text-transform:uppercase;letter-spacing:
.35px}.quick-pick button{border:1px solid #cbd5e1;background:#f8fafc;color:#334155;border-radius:7px;padding:4px 7px;font-size:10px;font-weight:800;cursor:pointer}.quick-pick button:hover{border-color
:#38bdf8;color:#0369a1}.quick-pick button.active{border-color:var(--teal);background:#ccfbf1;color:#115e59}.quick-pick button.partial{border-color:#7dd3fc;background:#e0f2fe;color:#075985}
.quick-search{width:100%;border:1px solid var(--line);border-radius:10px;background:#fff;padding:9px 10px;font-size:12px;color:var(--ink)}.chosen-container{font-size:12px!important;width:
100%!important}.chosen-container-multi .chosen-choices{min-height:38px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:#fff!important;background-image:
none!important;box-shadow:none!important;padding:3px 5px!important}.chosen-container-active .chosen-choices{border-color:#38bdf8!important;box-shadow:0 0 0 3px rgba(56,189,248,.13)!important}
.chosen-container-multi .chosen-choices li.search-choice{border:0!important;background:#e0f2fe!important;color:#075985!important;border-radius:7px!important;box-shadow:none!important;padding:5px 22px 
5px 7px!important;font-weight:700!important}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close{top:50%!important;right:5px!important;width:14px!important;height:
14px!important;margin-top:-7px!important;background:0 0!important;font-size:0!important}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close::after{content:"×";display:block;
color:#0369a1;font-size:15px;line-height:13px;text-align:center;font-weight:400;pointer-events:none}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close:hover::after{color:
var(--red)}.chosen-container .chosen-drop{border:1px solid #b8c8d8!important;border-radius:0 0 11px 11px!important;box-shadow:0 12px 26px rgba(15,23,42,.16)!important}
.chosen-container .chosen-results li.highlighted{background:#0f766e!important;background-image:none!important}.chosen-container .chosen-results{max-height:250px!important}
.chosen-container-multi .chosen-choices li.search-field input[type=text]{height:28px!important;color:#64748b!important;font-family:inherit!important}.active-filters{display:flex;flex-wrap:wrap;gap:6px
;margin-top:9px}.filter-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #bae6fd;background:#f0f9ff;color:#075985;border-radius:999px;padding:4px 7px 4px 9px;font-size:10px;
font-weight:750;max-width:100%}.filter-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.filter-chip button{border:0;background:0 0;color:#075985;cursor:pointer;padding:0;font-size:
14px;line-height:1}.all-chip{font-size:11px;color:var(--muted);padding:3px 0}.hint{border-left:4px solid var(--teal);background:#ecfeff;color:#164e63;border-radius:10px;padding:9px 10px;font-size:11px
;line-height:1.5;margin-top:10px}.kpis{display:grid;grid-template-columns:repeat(5,minmax(125px,1fr));gap:12px}.kpi{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:
var(--shadow);padding:13px 14px;min-height:100px;position:relative;overflow:hidden}.kpi::after{content:"";position:absolute;width:64px;height:64px;border-radius:50%;right:-25px;top:-24px;background:
var(--kpi-color,#2563eb);opacity:.12}.kpi small{display:block;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.5px;font-weight:900}.kpi strong,.kpi-num{display:block;
font-size:27px;line-height:1;margin:11px 0 6px;color:var(--kpi-color,#2563eb)}.kpi-num{border:0;background:0 0;padding:0;font-weight:700;cursor:pointer;text-align:left}.kpi-num:hover{text-decoration:
underline;text-underline-offset:3px}.kpi span{font-size:10px;color:#64748b}.card{padding:16px;min-width:0}.context-badge{display:inline-flex;align-items:center;gap:7px;background:#ecfdf5;color:#166534
;border:1px solid #bbf7d0;border-radius:999px;padding:5px 10px;font-size:11px;font-weight:850;white-space:nowrap}.context-badge::before{content:"";width:7px;height:7px;border-radius:50%;background:
#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.12)}.pivot-grid{display:grid;grid-template-columns:repeat(3,minmax(260px,1fr));gap:12px}.pivot-card{border:1px solid #dfe8f1;border-radius:14px;background:
#fbfdff;min-width:0;overflow:hidden}.pivot-head{display:flex;justify-content:space-between;align-items:center;gap:9px;padding:11px 12px 9px;border-bottom:1px solid #e8eef5;background:#fff}
.pivot-head h3{font-size:12px;margin:0;color:#334155}.pivot-head span{font-size:10px;color:var(--muted);white-space:nowrap}.pivot-list{padding:7px 9px 9px;max-height:310px;overflow:auto;
scrollbar-width:thin}.pivot-row{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(55px,1fr) 42px;gap:8px;align-items:center;padding:5px 3px;border-radius:7px}.pivot-row:hover{background:
#f1f5f9}.pivot-label{font-size:11px;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pivot-bar{height:8px;background:#e7eef5;border-radius:999px;overflow:hidden}.pivot-bar i{
display:block;height:100%;min-width:3px;border-radius:999px;background:var(--bar,#0f766e)}.pivot-count{border:0;background:#e0f2fe;color:#075985;border-radius:7px;padding:4px 6px;font-size:11px;
font-weight:900;cursor:pointer;text-align:center;font-variant-numeric:tabular-nums}.pivot-count:hover{background:#0f766e;color:#fff}.empty{padding:28px 14px;text-align:center;color:var(--muted);
font-size:12px}.table-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:11px}.toolbar-left,.toolbar-right{display:flex;align-items:center;gap:
8px;flex-wrap:wrap}.table-search{width:290px;max-width:60vw;border:1px solid var(--line);border-radius:10px;padding:9px 10px;font-size:12px}.row-count{font-size:11px;color:var(--muted);
font-variant-numeric:tabular-nums}.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:13px;max-height:660px;background:#fff;scrollbar-width:thin}table{border-collapse:separate;
border-spacing:0;table-layout:fixed;width:1658px;min-width:1658px;font-size:11px}td,th{border-right:1px solid #e7edf4;border-bottom:1px solid #e7edf4;padding:6px 8px;text-align:left;white-space:nowrap
;overflow:hidden;text-overflow:ellipsis}th{position:sticky;top:0;z-index:4;background:#f3f7fb;color:#334155;font-size:10px;text-transform:uppercase;letter-spacing:.25px;font-weight:900;cursor:pointer;
user-select:none}td:first-child,th:first-child{position:sticky;left:0;box-shadow:2px 0 0 #dbe5ee}th:first-child{z-index:6}td:first-child{z-index:2;background:#fff}th:hover{background:#e8f0f7}
th .sort-mark{margin-left:5px;color:#94a3b8}th.sorted .sort-mark{color:var(--blue)}tbody tr:nth-child(2n) td{background:#fbfdff}tbody tr:hover td{background:#f0fdfa}.status-pill{display:inline-flex;
align-items:center;border-radius:999px;padding:3px 7px;font-size:11px;font-weight:400;line-height:1.2;background:#dbeafe;color:#1d4ed8}.status-pill.terminal{background:#dcfce7;color:#166534}
.status-pill.stop{background:#fee2e2;color:#991b1b}.status-pill.unknown{background:#fef3c7;color:#92400e}.footer{max-width:1900px;margin:auto;padding:0 18px 20px;color:#64748b;font-size:10px;
line-height:1.5}.toast{position:fixed;right:20px;bottom:20px;z-index:50;max-width:390px;background:#0f172a;color:#fff;border-radius:12px;padding:11px 14px;box-shadow:0 18px 36px rgba(15,23,42,.26);
font-size:12px;line-height:1.45;opacity:0;transform:translateY(12px);pointer-events:none;transition:.2s ease}.toast.show{opacity:1;transform:translateY(0)}.toast.error{background:#991b1b}.loading-line
{height:3px;position:fixed;left:0;top:0;z-index:99;background:#2dd4bf;width:0;transition:width .25s ease}.loading-line.on{width:72%;animation:loading 1.3s ease-in-out infinite}.loading-line.done{width
:100%}@keyframes loading{0%{opacity:.55}50%{opacity:1}100%{opacity:.55}}@media(max-width:1450px){.pivot-grid{grid-template-columns:repeat(2,minmax(260px,1fr))}.kpis{grid-template-columns:repeat(3,1fr)
}}@media(max-width:980px){body{min-width:1030px}.hero-inner{display:block}.hero-source{margin-top:12px;text-align:left}.layout{grid-template-columns:320px minmax(680px,1fr);min-width:1030px}.side{
position:sticky;top:12px;max-height:calc(100vh - 24px);overflow:auto}.pivot-grid{grid-template-columns:1fr}.kpis{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.hero{padding:20px 16px}
.hero h1{font-size:24px}.layout{padding:10px}.kpis{grid-template-columns:1fr 1fr;gap:8px}.kpi{min-height:90px;padding:11px}.kpi strong,.kpi-num{font-size:23px}.table-search{width:100%;max-width:none}}
@media print{.footer,.pivot-grid,.side,.table-toolbar{display:none}.layout{display:block}.hero{background:#075985!important;-webkit-print-color-adjust:exact}.table-wrap{max-height:none;overflow:
visible}table{width:100%;font-size:7px}td,th{position:static!important;white-space:normal}}.tabs{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:12px
;background:#fff;border-bottom:1px solid var(--line);box-shadow:0 5px 16px rgba(15,23,42,.07);padding:9px max(16px,calc((100vw - 1900px)/ 2 + 16px))}.tab-list{display:flex;gap:7px}.tab-btn{border:1px 
solid #cbd5e1;background:#f8fafc;color:#475569;border-radius:10px;padding:8px 13px;font-size:12px;font-weight:850;cursor:pointer}.tab-btn:hover{border-color:#38bdf8;color:#075985}.tab-btn.active{
border-color:var(--teal);background:#ccfbf1;color:#115e59}.tab-page{display:none}.tab-page.active{display:block}.cycle-shell{display:grid;gap:16px;max-width:1900px;margin:auto;padding:16px}
.cycle-label{display:block;color:#334155;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.45px;margin-bottom:6px}.cycle-input{display:block;width:100%;resize:vertical;min-height
:120px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);padding:11px 12px;font:12px/1.55 Consolas,"Segoe UI",sans-serif}.cycle-input:focus{outline:3px solid 
rgba(14,165,233,.2);border-color:#38bdf8}.cycle-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px}.cycle-note{color:var(--muted);font-size:10px}.cycle-progress{display:
block;width:100%;height:8px;margin-top:12px;accent-color:var(--teal)}.cycle-status{margin-top:7px;color:var(--muted);font-size:11px;line-height:1.45}.cycle-wrap{max-height:690px}#cycleTable{width:
2422px;min-width:2422px}.ct-link{border:0;background:0 0;color:#0369a1;padding:0;font:inherit;font-weight:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}.ct-link:hover{
color:#0f766e}.ct-link:focus-visible{outline:2px solid #38bdf8;outline-offset:3px;border-radius:2px}.duration-over,.duration-over .ct-link{color:var(--red)!important}.wf-modal[hidden]{display:none}
.wf-modal{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:20px}.wf-bg{position:absolute;inset:0;width:100%;height:100%;border:0;background:rgba(15,23,42,.62);cursor:default
}.wf-box{position:relative;display:flex;flex-direction:column;width:min(1180px,calc(100vw - 40px));max-height:calc(100vh - 40px);overflow:hidden;border:1px solid #cbd5e1;border-radius:16px;background:
#fff;box-shadow:0 24px 80px rgba(15,23,42,.35)}.wf-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 17px;border-bottom:1px solid var(--line);background:#f8fafc}
.wf-head h2{margin:0;color:#0f172a;font-size:17px}.wf-head p{margin:3px 0 0;color:var(--muted);font-size:11px}.wf-actions{display:flex;align-items:center;gap:8px}.wf-wrap{overflow:auto;max-height:
calc(100vh - 120px)}#wfTable{width:1120px;min-width:1120px;table-layout:fixed}#wfTable th:first-child{width:190px}#wfTable th:nth-child(2){width:120px}#wfTable th:nth-child(3){width:160px}
#wfTable th:nth-child(4){width:95px}#wfTable th:nth-child(5){width:120px}#wfTable th:nth-child(6){width:435px}#wfTable td{white-space:normal;overflow-wrap:anywhere;vertical-align:top;line-height:1.45}
#wfTable td:nth-child(6){white-space:pre-wrap}body.wf-open{overflow:hidden}.toast{z-index:1100}#wfTable th{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.25;cursor:default}
.wf-box{width:min(1320px,calc(100vw - 40px))}#wfTable{width:1280px;min-width:1280px}#wfTable th:nth-child(4){width:160px}#wfTable th:nth-child(5){width:95px}#wfTable th:nth-child(6){width:120px}
#wfTable th:nth-child(7){width:435px}#wfTable td:nth-child(6){white-space:normal}#wfTable td:nth-child(7){white-space:pre-wrap}.btn:disabled{cursor:not-allowed;filter:none;transform:none;opacity:.48}
@media(max-width:980px){.tabs{min-width:1030px}.cycle-shell{min-width:1030px}}`;
const APP_HTML=`<div id="loadingLine" class="loading-line"></div>
<header class="hero">
  <div class="hero-inner">
    <div>
      <h1>NSR Flow Control Tower</h1>
      <p>One-page NSR workflow view. Every pivot uses the same filtered NSR population; click any count to drill into that value and update the filter panel.</p>
    </div>
    <div class="hero-source"><small>Current data source</small><strong id="heroSource">Loading SAP data…</strong></div>
  </div>
</header>
<nav class="tabs" aria-label="Control Tower pages">
  <div class="tab-list" role="tablist">
    <button id="overviewBtn" class="tab-btn active" type="button" role="tab" aria-selected="true" data-tab="overview">NSR Overview</button>
    <button id="cycleBtn" class="tab-btn" type="button" role="tab" aria-selected="false" data-tab="cycle">NSR Cycle Time</button>
  </div>
</nav>

<section id="overviewTab" class="tab-page active" role="tabpanel" aria-labelledby="overviewBtn"><div class="layout">
  <aside class="side">
    <h2>Data Source</h2>
    <div class="upload-box">
      <label for="rawFile">Upload raw data</label>
      <input id="rawFile" type="file" accept=".xlsx,.xls,.csv">
      <div id="sourceStatus" class="source-status loading">Loading latest SAP data…</div>
    </div>

    <div class="side-head"><h2>Filters</h2><button id="resetBtn" class="btn light small" type="button">Reset all</button></div>
    <div class="filter-group">
      <div class="filter-label"><label for="globalSearch">NSR / title quick search</label><button type="button" data-clear-search>Clear</button></div>
      <input id="globalSearch" class="quick-search" placeholder="NSR#, FCID, title…" autocomplete="off">
    </div>
    <div id="filterHost"></div>
    <div id="activeFilters" class="active-filters"><span class="all-chip">All NSRs are selected.</span></div>
    <div class="hint">Ctrl / ⌘ + click adds the value to the current selection.</div>
  </aside>

  <main class="main">
    <section id="kpis" class="kpis" aria-label="NSR summary"></section>

    <section class="card">
      <div class="section-title">
        <div><h2>Interactive Pivot</h2><p>Six views of the same filtered NSR population; each card total stays aligned.</p></div>
        <span id="pivotContext" class="context-badge">0 filtered NSRs</span>
      </div>
      <div id="pivotGrid" class="pivot-grid"></div>
    </section>

    <section class="card" id="detailSection">
      <div class="section-title">
        <div><h2>NSR Detail</h2><p>Click any column heading to sort.</p></div>
      </div>
      <div class="table-toolbar">
        <div class="toolbar-left">
          <input id="tableSearch" class="table-search" placeholder="Search within current result…" autocomplete="off">
          <span id="rowCount" class="row-count">0 rows</span>
        </div>
        <div class="toolbar-right">
          <button id="copyBtn" class="btn light" type="button">Copy</button>
          <button id="sendCycleBtn" class="btn blue" type="button">Cycle Time</button>
        </div>
      </div>
      <div class="table-wrap">
        <table id="detailTable" aria-label="Filtered NSR detail"></table>
      </div>
    </section>
  </main>
</div>
</section>
<section id="cycleTab" class="tab-page" role="tabpanel" aria-labelledby="cycleBtn">
  <div class="cycle-shell">
    <section class="card">
      <div class="section-title">
        <div><h2>NSR Cycle Time</h2><p>Live workflow lookup using the current authenticated Fiori session.</p></div>
        <span id="cycleBadge" class="context-badge">Ready</span>
      </div>
      <label class="cycle-label" for="cycleInput">NSR# list</label>
      <textarea id="cycleInput" class="cycle-input" rows="6" placeholder="Enter one NSR# per line, for example:&#10;N123456&#10;N123457"></textarea>
      <div class="cycle-actions">
        <button id="runCycleBtn" class="btn blue" type="button">Query</button>
        <button id="cancelCycleBtn" class="btn light" type="button" disabled>Cancel</button>
        <span class="cycle-note">Valid format: one letter followed by 5–9 digits. Up to 500 NSRs; 101+ requires confirmation.</span>
      </div>
      <progress id="cycleProgress" class="cycle-progress" max="1" value="0"></progress>
      <div id="cycleStatus" class="cycle-status">Enter NSR# values or send the visible NSR Detail rows here.</div>
    </section>

    <section class="card">
      <div class="section-title">
        <div><h2>Cycle Time Detail</h2><p>Live workflow fields merged with the current NSR data by unique NSR#.</p></div>
      </div>
      <div class="table-toolbar">
        <div class="toolbar-left">
          <input id="cycleSearch" class="table-search" placeholder="Search within lookup result…" autocomplete="off">
          <span id="cycleCount" class="row-count">0 rows</span>
        </div>
        <div class="toolbar-right">
          <button id="copyCycleBtn" class="btn light" type="button" disabled>Copy</button>
          <button id="exportCycleBtn" class="btn light" type="button" disabled>Export XLSX</button>
        </div>
      </div>
      <div class="table-wrap cycle-wrap">
        <table id="cycleTable" aria-label="NSR cycle time detail"></table>
      </div>
    </section>
  </div>
</section>
<div id="wfModal" class="wf-modal" hidden>
  <button class="wf-bg" type="button" data-wf-close aria-label="Close workflow detail"></button>
  <section class="wf-box" role="dialog" aria-modal="true" aria-labelledby="wfTitle">
    <div class="wf-head">
      <div><h2 id="wfTitle">Workflow Detail</h2><p id="wfMeta"></p></div>
      <div class="wf-actions">
        <button id="wfCopy" class="btn light" type="button">Copy</button>
        <button id="wfClose" class="btn light" type="button" data-wf-close aria-label="Close workflow detail">Close</button>
      </div>
    </div>
    <div class="wf-wrap"><table id="wfTable" aria-label="Full NSR workflow detail"></table></div>
  </section>
</div>
<div id="toast" class="toast" role="status" aria-live="polite"></div>`;
const BRIDGE_CSS=`
:root{--bg:#f3f7fb;--panel:#fff;--ink:#0f172a;--muted:#64748b;--line:#d8e3ee;--blue:#2563eb;--teal:#0f766e;--green:#16a34a;--amber:#d97706;--red:#dc2626;--shadow:0 14px 34px rgba(15,23,42,.08);
--font-sans:"Segoe UI Variable Text","Segoe UI","Microsoft YaHei UI","Microsoft YaHei",Arial,sans-serif}*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;background:var(--bg);color
:var(--ink);font-family:var(--font-sans);font-weight:400;line-height:1.4}b,h1,h2,strong{font-weight:600}button,input,select,textarea{font:inherit}button:focus-visible,input:focus-visible,
select:focus-visible,textarea:focus-visible{outline:3px solid rgba(14,165,233,.3);outline-offset:2px}.bridge-hero{background:linear-gradient(128deg,#052e44,#075985 52%,#0f766e);color:#fff;padding:24px
 28px;box-shadow:0 9px 24px rgba(3,46,70,.18)}.bridge-hero-inner{max-width:1180px;margin:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.bridge-hero h1{margin:0 0 6px;
font-size:29px;line-height:1.15;letter-spacing:-.3px}.bridge-hero p{max-width:760px;margin:0;color:#d8fbf5;font-size:13px;line-height:1.5}.toolbox-shell{max-width:1180px;margin:auto;padding:18px}
.bridge-shell,.zbom-grid,.create-quote-grid{display:grid;gap:16px}.bridge-shell{grid-template-columns:repeat(2,minmax(0,1fr))}.zbom-grid{grid-template-columns:minmax(0,1.3fr) minmax(300px,.9fr)}.create-quote-grid{grid-template-columns:240px minmax(240px,1fr) 320px}.bridge-card{min-width:0;
background:var(--panel);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:17px}.bridge-card.wide{grid-column:1/-1}.bridge-card h2{margin:0;font-size:17px;line-height:1.3
}.bridge-card p{margin:4px 0 0;color:var(--muted);font-size:11px;line-height:1.5}.bridge-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px}
.bridge-card-tools{display:flex;align-items:center;gap:7px}.connection-card{margin-bottom:15px}.bridge-btn{border:0;border-radius:10px;background:var(--teal);color:#fff;font-weight:600;padding:9px 
12px;cursor:pointer;transition:filter .12s ease,transform .12s ease}.bridge-btn:hover:not(:disabled){filter:brightness(1.05);transform:translateY(-1px)}.bridge-btn.blue{background:var(--blue)}
.bridge-btn.light{background:#e2e8f0;color:#0f172a}.bridge-btn.ghost{border:1px solid #ffffff66;background:#ffffff18}.bridge-btn:disabled{cursor:not-allowed;opacity:.5}.bridge-btn.small{padding:6px 
9px;font-size:10px}.bridge-badge{display:inline-flex;align-items:center;gap:7px;border-radius:999px;background:#f1f5f9;color:#475569;padding:6px 10px;font-size:11px;font-weight:600;white-space:nowrap}
.bridge-badge::before{content:"";width:8px;height:8px;border-radius:50%;background:#94a3b8}.bridge-badge.ok{background:#dcfce7;color:#166534}.bridge-badge.ok::before{background:var(--green)}
.bridge-badge.warn{background:#fef3c7;color:#92400e}.bridge-badge.warn::before{background:var(--amber)}.bridge-badge.error{background:#fee2e2;color:#991b1b}.bridge-badge.error::before{background:
var(--red)}.bridge-status{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.bridge-status-item{border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;padding:11px}
.bridge-status-item small{display:block;color:var(--muted);font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.35px}.bridge-status-item strong{display:block;margin-top:5px;font-size
:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bridge-field{display:grid;gap:6px;margin-top:11px}.bridge-field label{color:#475569;font-size:10px;font-weight:600;
text-transform:uppercase;letter-spacing:.35px}.bridge-field input,.bridge-field select,.bridge-field textarea{display:block;width:100%;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color
:var(--ink);padding:10px 11px;font-size:12px}.bridge-field textarea{min-height:88px;resize:vertical;font:11px/1.55 Consolas,"Courier New",monospace;tab-size:4}.bridge-field textarea.quotation-input{
white-space:pre;overflow:auto;overflow-wrap:normal;word-break:normal}.bridge-field input:disabled,.bridge-field select:disabled,.bridge-field textarea:disabled{background:#f1f5f9;color:#94a3b8}
.bridge-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}.bridge-inline{display:grid;grid-template-columns:1fr 110px;gap:10px}.bridge-divider{height:1px;background:
#e2e8f0;margin:15px 0}.bridge-note{color:var(--muted);font-size:10px;line-height:1.45}.bridge-result{min-height:130px;max-height:320px;overflow:auto;margin:0;border:1px solid #dbe5ee;border-radius:
12px;background:#071521;color:#d8fbf5;padding:12px;white-space:pre-wrap;overflow-wrap:anywhere;font:11px/1.55 Consolas,"Courier New",monospace}.tool-tabs{display:flex;gap:6px;margin:0 0 15px;padding:
5px;border:1px solid var(--line);border-radius:13px;background:#e8f0f7;box-shadow:0 8px 20px rgba(15,23,42,.05)}.tool-tab{flex:0 0 auto;border:0;border-radius:9px;background:0 0;color:#475569;padding:
9px 18px;font-weight:600;cursor:pointer}.tool-tab[aria-selected=true]{background:#fff;color:#0f4c67;box-shadow:0 3px 10px rgba(15,23,42,.1)}.token-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:
8px}.token-chip{border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 8px;font-size:10px;cursor:pointer}.folder-line{display:flex;align-items:center;gap:9px;
flex-wrap:wrap;margin-top:12px}.folder-name{min-width:0;color:#475569;font-size:11px;overflow-wrap:anywhere}.history-button-count{font-variant-numeric:tabular-nums}.toolbox-modal{position:fixed;inset:
0;z-index:1000;display:grid;place-items:center;padding:24px}.toolbox-modal-backdrop{position:absolute;inset:0;background:rgba(2,16,27,.56);backdrop-filter:blur(2px)}.toolbox-modal-card{position:
relative;display:grid;grid-template-rows:auto minmax(0,1fr);width:min(920px,100%);max-height:calc(100vh - 48px);overflow:hidden;border:1px solid var(--line);border-radius:16px;background:#fff;
box-shadow:0 24px 70px rgba(2,16,27,.3);padding:17px}.toolbox-modal-head{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-bottom:12px;border-bottom:1px solid #e2e8f0}
.toolbox-modal-title{display:flex;align-items:baseline;gap:10px}.toolbox-modal-title h2{margin:0;font-size:17px}.history-count{color:#64748b;font-size:10px}.history-list{display:grid;gap:8px;
overflow-y:auto;overflow-x:hidden;padding:12px 2px 2px}.history-empty{color:#94a3b8;font-size:11px;padding:14px 5px}.history-entry{display:grid;grid-template-columns:165px minmax(0,1fr);gap:12px;width
:100%;min-width:0;border:1px solid #dbe5ee;border-radius:10px;background:#fff;color:#334155;padding:10px 11px;text-align:left;cursor:pointer}.history-entry:hover{border-color:#93c5fd;background:
#eff6ff}.history-entry-time{display:block;color:#64748b;font-size:10px;line-height:1.4;font-variant-numeric:tabular-nums}.history-entry-text{display:block;min-width:0;white-space:pre-wrap;
overflow-wrap:anywhere;word-break:break-word;font:10px/1.45 Consolas,"Courier New",monospace}body.history-open{overflow:hidden}.preview-toolbar{display:flex;align-items:center;justify-content:
space-between;gap:10px;flex-wrap:wrap}.preview-count{color:#475569;font-size:11px}.zbom-table-wrap{margin-top:12px;overflow:auto;max-height:360px;border:1px solid #dbe5ee;border-radius:12px}
.zbom-table{width:100%;border-collapse:separate;border-spacing:0;font-size:11px}.zbom-table th{position:sticky;top:0;z-index:1;background:#edf5fa;color:#334155;text-align:left;font-size:10px;
white-space:nowrap}.zbom-table td,.zbom-table th{padding:8px 9px;border-right:1px solid #e5edf4;border-bottom:1px solid #e5edf4;vertical-align:top}.zbom-table td:last-child,.zbom-table th:last-child{
border-right:0}.zbom-table tr:last-child td{border-bottom:0}.zbom-table .missing{color:#94a3b8}.row-ok{color:#166534}.row-warning{color:#92400e}.row-error{color:#b91c1c}.planned-name{min-width:270px;max-width:440px;
overflow-wrap:anywhere}.compare-template-control{display:grid;grid-template-columns:minmax(0,1fr) 64px;gap:8px;align-items:center}.compare-template-separator{text-align:center;font-weight:700}.compare-table td,.compare-table th{padding:4px 7px;vertical-align:middle}
.compare-fid{min-width:78px}.compare-customer{width:110px;min-width:100px;max-width:145px;overflow-wrap:anywhere}.compare-system-description{width:155px;min-width:140px;max-width:230px;overflow-wrap:anywhere}
.compare-group-cell{width:92px;min-width:92px}.compare-group-select{display:block;width:100%;min-width:0;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:var(--ink);padding:3px 6px;font-size:11px}.compare-file-name{min-width:460px;max-width:900px;
overflow-wrap:anywhere}.compare-file-link{border:0;background:0 0;color:#0369a1;padding:0;text-align:left;font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer;overflow-wrap:anywhere}.compare-file-link:hover{color:#0f766e}.compare-file-link:disabled{color:#94a3b8;cursor:wait}.compare-output-control{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center}.compare-keep-temp{white-space:nowrap}.compare-keep-temp[aria-pressed=true]{background:var(--teal);color:#fff}.create-quote-reference-title{white-space:nowrap}.create-quote-number{max-width:112px;font-variant-numeric:tabular-nums}.create-quote-setting-row{grid-template-columns:max-content minmax(0,1fr);align-items:center;column-gap:10px}.create-quote-days-control{display:grid;grid-template-columns:auto 62px auto;align-items:center;justify-content:start;gap:7px}.create-quote-days-control input{text-align:center;font-variant-numeric:tabular-nums}.create-quote-unit{color:#475569;font-size:11px;font-weight:600}.create-quote-suffix{max-width:76px}.create-quote-crd-input{display:block;width:150px;max-width:100%;border:1px solid #cbd5e1;border-radius:7px;background:#fff;color:var(--ink);padding:5px 7px;font-size:11px}.create-quote-crd-input.invalid{border-color:var(--red);background:#fff1f2}.create-quote-status{margin-top:10px}.create-quote-version-note{font-weight:400;white-space:nowrap}.create-quote-table{table-layout:fixed}.create-quote-table th:first-child,.create-quote-table td:first-child{width:58px}.create-quote-table th:not(:first-child),.create-quote-table td:not(:first-child){width:calc((100% - 58px)/3)}.compare-status{width:74px;min-width:74px;white-space:nowrap}.compare-result-preview{margin-top:14px;border:1px solid #dbe5ee;border-radius:12px;background:#fff;overflow:hidden}.compare-result-tabs{display:flex;gap:5px;overflow-x:auto;padding:8px;border-bottom:1px solid #dbe5ee;background:#f8fafc}.compare-result-tab{flex:0 0 auto;border:1px solid #cbd5e1;border-radius:8px;background:#fff;color:#475569;padding:6px 10px;font-size:10px;font-weight:700;cursor:pointer}.compare-result-tab[aria-selected=true]{border-color:#0f766e;background:#0f766e;color:#fff}.compare-result-sheet-wrap{max-height:520px;overflow:auto}.compare-result-sheet{border-collapse:separate;border-spacing:0;min-width:100%;width:max-content;font-size:10px}.compare-result-sheet td{min-width:86px;max-width:340px;padding:4px 7px;border-right:1px solid #d6e0ea;border-bottom:1px solid #d6e0ea;vertical-align:top;white-space:pre-wrap;overflow-wrap:anywhere}.compare-result-sheet tr:first-child td,.compare-result-sheet tr:nth-child(2) td{position:sticky;z-index:2}.compare-result-sheet tr:first-child td{top:0}.compare-result-sheet tr:nth-child(2) td{top:25px}.compare-result-empty{padding:24px;color:#94a3b8;font-size:11px}.progress-track{height:9px;margin-top:12px;border-radius:999px;background:#e2e8f0;overflow:hidden}.progress-bar{height:100%;width:0;background:
linear-gradient(90deg,var(--blue),var(--teal));transition:width .2s ease}.progress-line{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:8px;color:#475569;font-size:11px}
.result-summary{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.result-pill{border-radius:999px;background:#e2e8f0;color:#334155;padding:5px 9px;font-size:10px}.result-pill.ok{background:#dcfce7;
color:#166534}.result-pill.warn{background:#fef3c7;color:#92400e}@media(max-width:800px){.bridge-hero-inner{align-items:flex-start;flex-direction:column}.bridge-inline,.bridge-shell,.bridge-status,
.zbom-grid,.create-quote-grid{grid-template-columns:1fr}.bridge-card.wide{grid-column:auto}.toolbox-shell{padding:12px}.tool-tabs{overflow:auto}.planned-name{min-width:220px}.toolbox-modal{padding:12px}
.toolbox-modal-card{max-height:calc(100vh - 24px)}.history-entry{grid-template-columns:1fr;gap:4px}}`;
const BRIDGE_HTML=`
<header class="bridge-hero">
  <div class="bridge-hero-inner">
    <div><h1>SAP Toolbox</h1></div>
    <button id="bridgeRefresh" class="bridge-btn ghost" type="button" data-bridge-action>Refresh</button>
  </div>
</header>
<main class="toolbox-shell">
  <section class="bridge-card connection-card">
    <div class="bridge-card-head"><div><h2>Connection</h2></div><span id="bridgeBadge" class="bridge-badge">Checking</span></div>
    <div class="bridge-status">
      <div class="bridge-status-item"><small>Local service</small><strong id="bridgeService">Checking 127.0.0.1:8765…</strong></div>
      <div class="bridge-status-item"><small>SAP GUI</small><strong id="bridgeSap">Not checked</strong></div>
    </div>
    <div class="bridge-field"><label for="sapSession">SAP session</label><select id="sapSession" disabled><option value="">Connecting to the local bridge…</option></select></div>
  </section>

  <nav class="tool-tabs" role="tablist" aria-label="SAP Toolbox functions">
    <button id="tabZbom" class="tool-tab" type="button" role="tab" aria-selected="true" aria-controls="panelZbom" data-tool-tab="zbom">ZBOM PDF</button>
    <button id="tabZbomCompare" class="tool-tab" type="button" role="tab" aria-selected="false" aria-controls="panelZbomCompare" data-tool-tab="zbomCompare">ZBOM Compare</button>
    <button id="tabCreateQuote" class="tool-tab" type="button" role="tab" aria-selected="false" aria-controls="panelCreateQuote" data-tool-tab="createQuote">Quote Create</button>
    <button id="tabDebug" class="tool-tab" type="button" role="tab" aria-selected="false" aria-controls="panelDebug" data-tool-tab="debug" hidden>Debug</button>
  </nav>

  <section id="panelZbom" class="tool-panel" role="tabpanel" aria-labelledby="tabZbom" data-tool-panel="zbom">
    <div class="zbom-grid">
      <section class="bridge-card">
        <div class="bridge-card-head">
          <div><h2>1. Quotation Data</h2></div>
          <div class="bridge-card-tools">
            <button id="zbomOpenHistory" class="bridge-btn light small" type="button">History (<span id="zbomHistoryButtonCount" class="history-button-count">0</span>)</button>
            <button id="zbomResetInput" class="bridge-btn light small" type="button">Reset</button>
          </div>
        </div>
        <div class="bridge-field"><textarea id="zbomInput" class="quotation-input" rows="4" wrap="off" spellcheck="false" aria-label="Quotation data" placeholder="FID    System Description    Quote&#10;225822-4    WTSC_MAX/HALT_MAXx2    20736497"></textarea></div>
      </section>

      <section class="bridge-card">
        <div class="bridge-card-head"><div><h2>2. Filename</h2></div><button id="zbomResetTemplate" class="bridge-btn light small" type="button">Reset</button></div>
        <div class="bridge-field"><input id="zbomTemplate" type="text" maxlength="240" value="{FID}_{System Description}_{Quote}_{Today}" autocomplete="off"></div>
        <div class="token-list" aria-label="Available file-name tokens">
          <button class="token-chip" type="button" data-zbom-token="{FID}">{FID}</button>
          <button class="token-chip" type="button" data-zbom-token="{System Description}">{System Description}</button>
          <button class="token-chip" type="button" data-zbom-token="{Quote}">{Quote}</button>
          <button class="token-chip" type="button" data-zbom-token="{Today}">{Today}</button>
        </div>
        <div class="folder-line"><span class="folder-name">Default output folder: C:\\PDFFILES</span></div>
      </section>

      <section class="bridge-card wide">
        <div class="preview-toolbar">
          <div><h2>3. Preview</h2></div>
          <span id="zbomCount" class="preview-count">0 rows</span>
        </div>
        <div class="zbom-table-wrap">
          <table class="zbom-table" aria-label="Detected ZBOM PDF input">
            <thead><tr><th>FID</th><th>System Description</th><th>Quote</th><th>Planned file name</th><th>Status</th></tr></thead>
            <tbody id="zbomPreviewBody"><tr><td colspan="5" class="missing">No preview yet.</td></tr></tbody>
          </table>
        </div>
      </section>

      <section class="bridge-card wide">
        <div class="bridge-card-head"><div><h2>4. Export PDF Files</h2></div></div>
        <div class="bridge-actions">
          <button id="zbomStart" class="bridge-btn blue" type="button" disabled>Start PDF Export</button>
          <button id="zbomOpenFolder" class="bridge-btn light" type="button" disabled>Open Folder</button>
        </div>
        <div class="progress-track" aria-hidden="true"><div id="zbomProgressBar" class="progress-bar"></div></div>
        <div class="progress-line"><span id="zbomProgressNumber">0%</span></div>
        <div id="zbomResultSummary" class="result-summary"></div>
      </section>
    </div>
  </section>

  <section id="panelZbomCompare" class="tool-panel" role="tabpanel" aria-labelledby="tabZbomCompare" data-tool-panel="zbomCompare" hidden>
    <div class="zbom-grid">
      <section class="bridge-card">
        <div class="bridge-card-head">
          <div><h2>1. Quotation Data</h2></div>
          <div class="bridge-card-tools">
            <button id="zbomCompareOpenHistory" class="bridge-btn light small" type="button">History (<span id="zbomCompareHistoryButtonCount" class="history-button-count">0</span>)</button>
            <button id="zbomCompareResetInput" class="bridge-btn light small" type="button">Reset</button>
          </div>
        </div>
        <div class="bridge-field"><textarea id="zbomCompareInput" class="quotation-input" rows="6" wrap="off" spellcheck="false" aria-label="ZBOM Compare quotation data" placeholder="Customer    FID    System Description    Quotation    Group&#10;Customer A    225822    WTSC_MAX/HALT_MAXx2    21314937    G1"></textarea></div>
        <div class="bridge-note">Paste one quotation per line or multiple Excel columns.</div>
      </section>

      <section class="bridge-card">
        <div class="bridge-card-head"><div><h2>2. Filename</h2></div><button id="zbomCompareResetTemplate" class="bridge-btn light small" type="button">Reset</button></div>
        <div class="bridge-field">
          <div class="compare-template-control">
            <input id="zbomCompareTemplate" type="text" maxlength="240" value="{Customer}_{FID}_{SysDes}" autocomplete="off" aria-label="ZBOM Compare filename template">
            <input id="zbomCompareSeparator" class="compare-template-separator" type="text" maxlength="24" value="vs" autocomplete="off" spellcheck="false" aria-label="Text between compared file names" title="Text between compared file names">
          </div>
        </div>
        <div class="token-list" aria-label="Available ZBOM Compare file-name tokens">
          <button class="token-chip" type="button" data-zbom-compare-token="{Customer}">{Customer}</button>
          <button class="token-chip" type="button" data-zbom-compare-token="{FID}">{FID}</button>
          <button class="token-chip" type="button" data-zbom-compare-token="{SysDes}">{SysDes}</button>
          <button class="token-chip" type="button" data-zbom-compare-token="{Quote}">{Quote}</button>
        </div>
        <div class="bridge-note">{FID} stays as a placeholder when it is missing. The short field joins the two compared file names.</div>
        <div class="bridge-field">
          <label for="zbomCompareOutputFolder">Output Folder</label>
          <div class="compare-output-control">
            <input id="zbomCompareOutputFolder" type="text" maxlength="1000" value="C:\\PDFFILES\\Compare" autocomplete="off" spellcheck="false" placeholder="C:\\PDFFILES\\Compare">
            <button id="zbomCompareKeepTemp" class="bridge-btn light small compare-keep-temp" type="button" aria-pressed="false" title="Keep the temp folder after Compare finishes">SaveTemp</button>
          </div>
        </div>
      </section>

      <section class="bridge-card wide">
        <div class="preview-toolbar">
          <div><h2>3. Preview</h2></div>
          <span id="zbomCompareCount" class="preview-count">0 quotations</span>
        </div>
        <div class="zbom-table-wrap">
          <table class="zbom-table compare-table" aria-label="Detected ZBOM Compare input">
            <thead><tr><th>Quotation</th><th>FID</th><th>Customer</th><th>System Description</th><th>Compare Group</th><th>File Name</th><th class="compare-status">Status</th></tr></thead>
            <tbody id="zbomComparePreviewBody"><tr><td colspan="7" class="missing">No preview yet.</td></tr></tbody>
          </table>
        </div>
      </section>

      <section class="bridge-card wide">
        <div class="bridge-card-head"><div><h2>4. Compare</h2></div></div>
        <div class="bridge-actions">
          <button id="zbomCompareStart" class="bridge-btn blue" type="button" data-bridge-action disabled>Start Compare</button>
          <button id="zbomCompareOpenFolder" class="bridge-btn light" type="button" data-bridge-action disabled>Open Folder</button>
        </div>
        <div class="progress-track" aria-hidden="true"><div id="zbomCompareProgressBar" class="progress-bar"></div></div>
        <div class="progress-line"><span id="zbomCompareProgressText">Ready.</span><span id="zbomCompareProgressNumber">0%</span></div>
        <div id="zbomCompareResultSummary" class="result-summary"></div>
        <div id="zbomCompareResultPreview" class="compare-result-preview" hidden>
          <div id="zbomCompareResultTabs" class="compare-result-tabs" role="tablist" aria-label="ZBOM Compare result sheets"></div>
          <div id="zbomCompareResultSheet" class="compare-result-sheet-wrap"></div>
        </div>
      </section>
    </div>
  </section>

  <section id="panelCreateQuote" class="tool-panel" role="tabpanel" aria-labelledby="tabCreateQuote" data-tool-panel="createQuote" hidden>
    <div class="create-quote-grid">
      <section class="bridge-card">
        <div class="bridge-card-head"><div><h2 class="create-quote-reference-title">1. Reference Quotation</h2></div></div>
        <div class="bridge-field"><input id="createQuoteQuotation" class="create-quote-number" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="10" autocomplete="off" spellcheck="false" aria-label="Create Quote quotation number" placeholder="Quotation No."></div>
      </section>

      <section class="bridge-card">
        <div class="bridge-card-head"><div><h2>2. FID</h2></div></div>
        <div class="bridge-field"><textarea id="createQuoteInput" class="quotation-input" rows="4" wrap="off" spellcheck="false" aria-label="Create Quote FID and date data" placeholder="FID    CRD    ValidTo&#10;264072    08/01/2026    09/15/2026"></textarea></div>
      </section>

      <section class="bridge-card">
        <div class="bridge-card-head"><div><h2>3. Settings</h2></div></div>
        <div class="bridge-field create-quote-setting-row">
          <label for="createQuoteDefaultValidTo">Default ValidTo</label>
          <div class="create-quote-days-control">
            <span class="create-quote-unit">+</span>
            <input id="createQuoteDefaultValidTo" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" value="30" autocomplete="off" spellcheck="false" aria-label="Default ValidTo days">
            <span class="create-quote-unit">Days</span>
          </div>
        </div>
        <div class="bridge-field create-quote-setting-row">
          <label for="createQuoteFidSuffix">New FID suffix</label>
          <input id="createQuoteFidSuffix" class="create-quote-suffix" type="text" maxlength="6" value="-01" autocomplete="off" spellcheck="false">
        </div>
      </section>

      <section class="bridge-card wide">
        <div class="preview-toolbar">
          <div><h2>4. Preview</h2></div>
          <span id="createQuoteCount" class="preview-count">0 FIDs</span>
        </div>
        <div class="zbom-table-wrap">
          <table class="zbom-table create-quote-table" aria-label="Detected Create Quote input">
            <thead><tr><th>Item</th><th>CRD</th><th>Version <span class="bridge-note create-quote-version-note">(Incremented if same as Ref. Quotation)</span></th><th>Valid to</th></tr></thead>
            <tbody id="createQuotePreviewBody"><tr><td colspan="4" class="missing">No preview yet.</td></tr></tbody>
          </table>
        </div>
      </section>

      <section class="bridge-card wide">
        <div class="bridge-card-head"><div><h2>5. Create Quote</h2></div></div>
        <div class="bridge-actions">
          <button id="createQuoteStart" class="bridge-btn blue" type="button" disabled>Create Quote</button>
        </div>
        <div id="createQuoteStatus" class="bridge-note create-quote-status">Ready.</div>
      </section>
    </div>
  </section>

  <section id="panelDebug" class="tool-panel" role="tabpanel" aria-labelledby="tabDebug" data-tool-panel="debug" hidden>
    <div class="bridge-shell">
      <section class="bridge-card">
        <div class="bridge-card-head"><div><h2>Open Transaction</h2></div></div>
        <div class="bridge-field"><label for="sapTransaction">Transaction code</label><input id="sapTransaction" type="text" maxlength="40" placeholder="For example: VA03 or /SCWM/MON" autocomplete="off"></div>
        <div class="bridge-actions"><button id="sapRunTransaction" class="bridge-btn blue" type="button" data-bridge-action disabled>Open transaction</button></div>
      </section>

      <section class="bridge-card">
        <div class="bridge-card-head"><div><h2>Control Inspector</h2></div></div>
        <div class="bridge-field"><label for="sapControlId">SAP control ID</label><input id="sapControlId" type="text" maxlength="300" placeholder="wnd[0]/usr/ctxt…" autocomplete="off"></div>
        <div class="bridge-field"><label for="sapControlValue">Value</label><input id="sapControlValue" type="text" maxlength="4000" placeholder="Text or key to write" autocomplete="off"></div>
        <div class="bridge-actions">
          <button id="sapReadText" class="bridge-btn light" type="button" data-bridge-action disabled>Read text</button>
          <button id="sapSetText" class="bridge-btn blue" type="button" data-bridge-action disabled>Set text</button>
          <button id="sapSetKey" class="bridge-btn light" type="button" data-bridge-action disabled>Set key</button>
          <button id="sapPress" class="bridge-btn light" type="button" data-bridge-action disabled>Press</button>
          <button id="sapSelect" class="bridge-btn light" type="button" data-bridge-action disabled>Select</button>
        </div>
        <div class="bridge-divider"></div>
        <div class="bridge-inline">
          <div class="bridge-field"><label for="sapVKeyTarget">Window ID</label><input id="sapVKeyTarget" type="text" maxlength="300" value="wnd[0]" autocomplete="off"></div>
          <div class="bridge-field"><label for="sapVKey">VKey</label><input id="sapVKey" type="number" min="0" max="99" value="0"></div>
        </div>
        <div class="bridge-actions"><button id="sapSendVKey" class="bridge-btn light" type="button" data-bridge-action disabled>Send VKey</button></div>
      </section>

      <section class="bridge-card wide">
        <div class="bridge-card-head"><div><h2>Result</h2></div></div>
        <pre id="sapResult" class="bridge-result" aria-live="polite">Waiting for the local bridge…</pre>
      </section>
    </div>
  </section>
</main>
<div id="zbomHistoryDialog" class="toolbox-modal" hidden>
  <div class="toolbox-modal-backdrop" data-zbom-history-close></div>
  <section class="toolbox-modal-card" role="dialog" aria-modal="true" aria-labelledby="zbomHistoryTitle">
    <div class="toolbox-modal-head">
      <div class="toolbox-modal-title"><h2 id="zbomHistoryTitle">Quotation History</h2><span id="zbomHistoryCount" class="history-count">0/50</span></div>
      <button id="zbomCloseHistory" class="bridge-btn light small" type="button">Close</button>
    </div>
    <div id="zbomHistoryList" class="history-list"><div class="history-empty">No export history.</div></div>
  </section>
</div>
<div id="zbomCompareHistoryDialog" class="toolbox-modal" hidden>
  <div class="toolbox-modal-backdrop" data-zbom-compare-history-close></div>
  <section class="toolbox-modal-card" role="dialog" aria-modal="true" aria-labelledby="zbomCompareHistoryTitle">
    <div class="toolbox-modal-head">
      <div class="toolbox-modal-title"><h2 id="zbomCompareHistoryTitle">ZBOM Compare History</h2><span id="zbomCompareHistoryCount" class="history-count">0/50</span></div>
      <button id="zbomCompareCloseHistory" class="bridge-btn light small" type="button">Close</button>
    </div>
    <div id="zbomCompareHistoryList" class="history-list"><div class="history-empty">No compare history.</div></div>
  </section>
</div>`;
const launchLoops=new Set();
const ZBOM_PDF_FOLDER='C:\\PDFFILES';
const ZBOM_DEFAULT_TEMPLATE='{FID}_{System Description}_{Quote}_{Today}';
const ZBOM_TOKENS=['{FID}','{System Description}','{Quote}','{Today}'];
const ZBOM_HISTORY_LIMIT=50;
const ZBOM_STORAGE_KEYS={input:'nsrSapToolbox.zbomInput.v1',template:'nsrSapToolbox.zbomTemplate.v1',history:'nsrSapToolbox.zbomHistory.v1'};
const ZBOM_COMPARE_DEFAULT_TEMPLATE='{Customer}_{FID}_{SysDes}';
const ZBOM_COMPARE_DEFAULT_SEPARATOR='vs';
const ZBOM_COMPARE_DEFAULT_GROUP='G01';
const ZBOM_COMPARE_DEFAULT_FOLDER='C:\\PDFFILES\\Compare';
const ZBOM_COMPARE_STANDALONE='__STANDALONE__';
const ZBOM_COMPARE_FID_ERROR='FID Read Error';
const ZBOM_COMPARE_HEADER_FILL='FF0070C0';
const ZBOM_COMPARE_BORDER_COLOR='FFD6E0EA';
const ZBOM_COMPARE_FILE_COLORS=['FFFFC7CE','FFC6EFCE','FFFFEB9C','FFBDD7EE','FFE4DFEC','FFFCE4D6','FFDDEBF7','FFE2F0D9','FFF4B183','FFD9E1F2'];
const ZBOM_COMPARE_STORAGE_KEYS={input:'nsrSapToolbox.zbomCompareInput.v1',template:'nsrSapToolbox.zbomCompareTemplate.v1',separator:'nsrSapToolbox.zbomCompareSeparator.v1',folder:'nsrSapToolbox.zbomCompareFolder.v1',groups:'nsrSapToolbox.zbomCompareGroups.v1',history:'nsrSapToolbox.zbomCompareHistory.v1'};
const CREATE_QUOTE_DEFAULT_VALID_TO_DAYS='30';
const CREATE_QUOTE_DEFAULT_FID_SUFFIX='-01';
const CREATE_QUOTE_STORAGE_KEYS={quotation:'nsrSapToolbox.createQuoteQuotation.v1',input:'nsrSapToolbox.createQuoteInput.v1',validToDays:'nsrSapToolbox.createQuoteValidToDays.v1',fidSuffix:'nsrSapToolbox.createQuoteFidSuffix.v1',crdOverrides:'nsrSapToolbox.createQuoteCrdOverrides.v1'};
const BRIDGE_DEBUG_STORAGE_KEY='nsrSapToolbox.debugUnlocked.v1';
let bridgeBusy=false,bridgeSessions=[],bridgeMock=false,zbomRows=[],zbomErrors=[],zbomRunning=false,zbomHasRun=false,zbomLogLines=[],zbomOutputClaims=new Map(),zbomResults=new Map(),zbomHistory=[],zbomHistoryReturnFocus=null;
let zbomCompareRows=[],zbomCompareStats={duplicates:0,ignored:0},zbomCompareSavedGroups=new Map(),zbomCompareRunning=false,zbomCompareHasRun=false,zbomCompareResults=new Map(),zbomCompareLogLines=[],zbomCompareOutputRowHint=4,zbomCompareHistory=[],zbomCompareHistoryReturnFocus=null,zbomCompareResultTabs=[],zbomCompareActiveResultTab='';
let createQuoteRows=[],createQuoteStats={duplicates:0,ignored:0},createQuoteCrdOverrides=new Map();
let bridgeDebugUnlocked=false;

GM_registerMenuCommand('Open NSR Flow Control Tower',beginLaunch);
GM_registerMenuCommand('Open SAP Toolbox',beginBridgeLaunch);

const currentPath=unsafeWindow.location.pathname.toLowerCase();
if(currentPath===APP_PATH){
  clearLaunch(FLAG);whenBody(mountApp);
}else if(currentPath===BRIDGE_PATH){
  clearLaunch(BRIDGE_FLAG);whenBody(mountBridgeApp);
}else{
  resumeLaunch(FLAG,APP_PATH+'?nsrct=1');
  resumeLaunch(BRIDGE_FLAG,BRIDGE_PATH+'?nsrbridge=1');
}

function whenBody(callback){
  if(document.body)callback();else document.addEventListener('DOMContentLoaded',callback,{once:true});
}

function store(){
  try{return unsafeWindow.sessionStorage}catch(_){return sessionStorage}
}

function persistentStore(){
  try{return unsafeWindow.localStorage}catch(_){
    try{return localStorage}catch(__){return null}
  }
}

function readPersistent(key,fallback){
  const storage=persistentStore();if(!storage)return fallback;
  try{const value=storage.getItem(key);return value===null?fallback:value}catch(_){return fallback}
}

function writePersistent(key,value){
  const storage=persistentStore();if(!storage)return;
  try{storage.setItem(key,String(value))}catch(_){/* ignore unavailable or full storage */}
}

function loadZbomPreferences(){
  const input=bridgeId('zbomInput'),template=bridgeId('zbomTemplate'),savedInput=readPersistent(ZBOM_STORAGE_KEYS.input,null),savedTemplate=readPersistent(ZBOM_STORAGE_KEYS.template,null);
  if(savedInput!==null)input.value=savedInput;
  if(savedTemplate!==null)template.value=savedTemplate;
  const savedHistory=readPersistent(ZBOM_STORAGE_KEYS.history,'[]');
  try{
    const parsed=JSON.parse(savedHistory);
    zbomHistory=Array.isArray(parsed)?parsed.filter(item=>item&&typeof item.text==='string'&&typeof item.runAt==='string').slice(0,ZBOM_HISTORY_LIMIT):[];
  }catch(_){zbomHistory=[]}
  renderZbomHistory();
}

function saveZbomInput(){
  const input=bridgeId('zbomInput');if(input)writePersistent(ZBOM_STORAGE_KEYS.input,input.value);
}

function saveZbomTemplate(){
  const input=bridgeId('zbomTemplate');if(input)writePersistent(ZBOM_STORAGE_KEYS.template,input.value);
}

function resetZbomInput(){
  const input=bridgeId('zbomInput');input.value='';saveZbomInput();previewZbomInput();input.focus();
}

function resetZbomTemplate(){
  const input=bridgeId('zbomTemplate');input.value=ZBOM_DEFAULT_TEMPLATE;saveZbomTemplate();zbomHasRun=false;zbomResults=new Map();bridgeId('zbomResultSummary').replaceChildren();renderZbomPreview();input.focus();
}

function loadZbomComparePreferences(){
  const input=bridgeId('zbomCompareInput'),template=bridgeId('zbomCompareTemplate'),separator=bridgeId('zbomCompareSeparator'),folder=bridgeId('zbomCompareOutputFolder'),savedInput=readPersistent(ZBOM_COMPARE_STORAGE_KEYS.input,null),savedTemplate=readPersistent(ZBOM_COMPARE_STORAGE_KEYS.template,null),savedSeparator=readPersistent(ZBOM_COMPARE_STORAGE_KEYS.separator,null),savedFolder=readPersistent(ZBOM_COMPARE_STORAGE_KEYS.folder,null);
  if(savedInput!==null)input.value=savedInput;
  if(savedTemplate!==null){template.value=/^\{fid\}$/i.test(String(savedTemplate).trim())?ZBOM_COMPARE_DEFAULT_TEMPLATE:savedTemplate;if(template.value!==savedTemplate)writePersistent(ZBOM_COMPARE_STORAGE_KEYS.template,template.value)}
  if(savedSeparator!==null)separator.value=savedSeparator;
  folder.value=savedFolder!==null&&String(savedFolder).trim()?savedFolder:ZBOM_COMPARE_DEFAULT_FOLDER;
  zbomCompareSavedGroups=new Map();
  try{
    const parsed=JSON.parse(readPersistent(ZBOM_COMPARE_STORAGE_KEYS.groups,'{}'));
    if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))Object.entries(parsed).forEach(([quote,value])=>{
      if(!/^2\d{7}$/.test(quote)||typeof value!=='string')return;
      const group=value===ZBOM_COMPARE_STANDALONE||value==='__DO_NOT_COMPARE__'?ZBOM_COMPARE_STANDALONE:normalizeZbomCompareGroup(value,true);
      if(group)zbomCompareSavedGroups.set(quote,group);
    });
  }catch(_){zbomCompareSavedGroups=new Map()}
  try{
    const parsed=JSON.parse(readPersistent(ZBOM_COMPARE_STORAGE_KEYS.history,'[]'));
    zbomCompareHistory=Array.isArray(parsed)?parsed.filter(item=>item&&typeof item.text==='string'&&typeof item.runAt==='string').slice(0,ZBOM_HISTORY_LIMIT):[];
  }catch(_){zbomCompareHistory=[]}
  renderZbomCompareHistory();
}

function saveZbomCompareInput(){
  const input=bridgeId('zbomCompareInput');if(input)writePersistent(ZBOM_COMPARE_STORAGE_KEYS.input,input.value);
}

function saveZbomCompareTemplate(){
  const input=bridgeId('zbomCompareTemplate');if(input)writePersistent(ZBOM_COMPARE_STORAGE_KEYS.template,input.value);
}

function saveZbomCompareSeparator(){
  const input=bridgeId('zbomCompareSeparator');if(input)writePersistent(ZBOM_COMPARE_STORAGE_KEYS.separator,input.value);
}

function saveZbomCompareFolder(){
  const input=bridgeId('zbomCompareOutputFolder');if(input)writePersistent(ZBOM_COMPARE_STORAGE_KEYS.folder,input.value);
}

function normalizeCreateQuoteQuotation(value){
  return String(value||'').replace(/\D/g,'').slice(0,10);
}

function sanitizeCreateQuoteQuotation(){
  const input=bridgeId('createQuoteQuotation');if(!input)return '';
  const value=normalizeCreateQuoteQuotation(input.value);if(input.value!==value)input.value=value;return value;
}

function normalizeCreateQuoteDays(value){
  return String(value||'').replace(/\D/g,'').slice(0,4);
}

function sanitizeCreateQuoteDays(){
  const input=bridgeId('createQuoteDefaultValidTo');if(!input)return '';
  const value=normalizeCreateQuoteDays(input.value);if(input.value!==value)input.value=value;return value;
}

function loadCreateQuotePreferences(){
  const quotation=bridgeId('createQuoteQuotation'),input=bridgeId('createQuoteInput'),validToDays=bridgeId('createQuoteDefaultValidTo'),fidSuffix=bridgeId('createQuoteFidSuffix');
  const savedQuotation=readPersistent(CREATE_QUOTE_STORAGE_KEYS.quotation,null),savedInput=readPersistent(CREATE_QUOTE_STORAGE_KEYS.input,null),savedValidToDays=readPersistent(CREATE_QUOTE_STORAGE_KEYS.validToDays,null),savedFidSuffix=readPersistent(CREATE_QUOTE_STORAGE_KEYS.fidSuffix,null);
  if(savedQuotation!==null)quotation.value=savedQuotation;
  if(savedInput!==null)input.value=savedInput;
  validToDays.value=savedValidToDays===null?CREATE_QUOTE_DEFAULT_VALID_TO_DAYS:savedValidToDays;
  fidSuffix.value=savedFidSuffix===null?CREATE_QUOTE_DEFAULT_FID_SUFFIX:savedFidSuffix;
  const normalized=sanitizeCreateQuoteQuotation();
  if(savedQuotation!==null&&normalized!==savedQuotation)writePersistent(CREATE_QUOTE_STORAGE_KEYS.quotation,normalized);
  const normalizedDays=sanitizeCreateQuoteDays();
  if(savedValidToDays!==null&&normalizedDays!==savedValidToDays)writePersistent(CREATE_QUOTE_STORAGE_KEYS.validToDays,normalizedDays);
  createQuoteCrdOverrides=new Map();
  try{
    const parsed=JSON.parse(readPersistent(CREATE_QUOTE_STORAGE_KEYS.crdOverrides,'{}'));
    if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))Object.entries(parsed).forEach(([fid,value])=>{if(/^\d{6}$/.test(fid)&&typeof value==='string')createQuoteCrdOverrides.set(fid,value)});
  }catch(_){createQuoteCrdOverrides=new Map()}
}

function saveCreateQuoteQuotation(){
  const input=bridgeId('createQuoteQuotation');if(input)writePersistent(CREATE_QUOTE_STORAGE_KEYS.quotation,input.value);
}

function saveCreateQuoteInput(){
  const input=bridgeId('createQuoteInput');if(input)writePersistent(CREATE_QUOTE_STORAGE_KEYS.input,input.value);
}

function saveCreateQuoteValidToDays(){
  const input=bridgeId('createQuoteDefaultValidTo');if(input)writePersistent(CREATE_QUOTE_STORAGE_KEYS.validToDays,input.value);
}

function saveCreateQuoteFidSuffix(){
  const input=bridgeId('createQuoteFidSuffix');if(input)writePersistent(CREATE_QUOTE_STORAGE_KEYS.fidSuffix,input.value);
}

function saveCreateQuoteCrdOverrides(){
  const values={};createQuoteCrdOverrides.forEach((value,fid)=>{values[fid]=value});writePersistent(CREATE_QUOTE_STORAGE_KEYS.crdOverrides,JSON.stringify(values));
}

function keepZbomCompareTemp(){return bridgeId('zbomCompareKeepTemp').getAttribute('aria-pressed')==='true'}

function toggleZbomCompareKeepTemp(){
  const button=bridgeId('zbomCompareKeepTemp'),keep=!keepZbomCompareTemp();button.setAttribute('aria-pressed',keep?'true':'false');button.title=keep?'The temp folder will be kept.':'The temp folder will be deleted after Compare finishes.';
}

function saveZbomCompareGroups(){
  const values={};zbomCompareSavedGroups=new Map();
  zbomCompareRows.forEach(row=>{if(row.quote&&row.group){values[row.quote]=row.group;zbomCompareSavedGroups.set(row.quote,row.group)}});
  writePersistent(ZBOM_COMPARE_STORAGE_KEYS.groups,JSON.stringify(values));
}

async function openZbomCompareOutputFolder(){
  const input=bridgeId('zbomCompareOutputFolder'),button=bridgeId('zbomCompareOpenFolder');let path;
  try{path=normalizedZbomCompareFolder()}catch(error){showBridgeResult(bridgeError(error),'Unable to open the ZBOM Compare output folder.');input.focus();return}
  input.value=path;saveZbomCompareFolder();
  button.disabled=true;setBridgeBusy(true);
  try{
    await bridgeFileRequest('createDirectory',{path:path},30000);const data=await bridgeFileRequest('openDirectory',{path:path},20000);showBridgeResult(data,'ZBOM Compare output folder opened.');
  }catch(error){showBridgeResult(bridgeError(error),'Unable to open the ZBOM Compare output folder.')}
  finally{setBridgeBusy(false);updateZbomCompareStart()}
}

async function openZbomCompareWorkbook(path,button){
  if(!path)return;
  if(button)button.disabled=true;
  try{
    await bridgeFileRequest('openFile',{path:path},30000);setZbomCompareProgress(100,'Opened '+String(path).split(/[\\/]/).pop()+'.');
  }catch(error){setZbomCompareProgress(100,'Unable to open workbook: '+bridgeError(error))}
  finally{if(button)button.disabled=false}
}

function clearZbomCompareResultPreview(){
  zbomCompareResultTabs=[];zbomCompareActiveResultTab='';
  const preview=bridgeId('zbomCompareResultPreview'),tabs=bridgeId('zbomCompareResultTabs'),sheet=bridgeId('zbomCompareResultSheet');
  if(preview)preview.hidden=true;if(tabs)tabs.replaceChildren();if(sheet)sheet.replaceChildren();
}

function invalidateZbomCompareResults(){
  zbomCompareHasRun=false;zbomCompareResults=new Map();bridgeId('zbomCompareResultSummary').replaceChildren();clearZbomCompareResultPreview();
}

function renderZbomCompareResultSheet(){
  const container=bridgeId('zbomCompareResultSheet'),tab=zbomCompareResultTabs.find(item=>item.key===zbomCompareActiveResultTab);if(!container)return;
  container.replaceChildren();
  if(!tab||!tab.sheet||!tab.sheet.rows.length){const empty=document.createElement('div');empty.className='compare-result-empty';empty.textContent='No table content.';container.appendChild(empty);return}
  const table=document.createElement('table'),colgroup=document.createElement('colgroup'),body=document.createElement('tbody');table.className='compare-result-sheet';
  tab.sheet.widths.forEach(width=>{const column=document.createElement('col');column.style.width=Math.max(55,Math.min(360,(Number(width)||12)*7))+'px';colgroup.appendChild(column)});
  tab.sheet.rows.forEach(row=>{
    const tr=document.createElement('tr');row.forEach(item=>{
      const cell=document.createElement('td');cell.textContent=item.text;
      if(item.fill)cell.style.backgroundColor='#'+item.fill.slice(-6);
      if(item.fontColor)cell.style.color='#'+item.fontColor.slice(-6);
      if(item.bold)cell.style.fontWeight='700';
      tr.appendChild(cell);
    });body.appendChild(tr);
  });
  table.append(colgroup,body);container.appendChild(table);
}

function renderZbomCompareResultTabs(preferredLabel){
  const preview=bridgeId('zbomCompareResultPreview'),container=bridgeId('zbomCompareResultTabs');if(!preview||!container)return;
  if(!zbomCompareResultTabs.length){clearZbomCompareResultPreview();return}
  if(preferredLabel){const preferred=zbomCompareResultTabs.find(item=>item.label===preferredLabel);if(preferred)zbomCompareActiveResultTab=preferred.key}
  if(!zbomCompareResultTabs.some(item=>item.key===zbomCompareActiveResultTab))zbomCompareActiveResultTab=zbomCompareResultTabs[0].key;
  preview.hidden=false;container.replaceChildren();
  zbomCompareResultTabs.forEach(tab=>{
    const button=document.createElement('button');button.type='button';button.className='compare-result-tab';button.setAttribute('role','tab');button.setAttribute('aria-selected',tab.key===zbomCompareActiveResultTab?'true':'false');button.textContent=tab.label;
    button.addEventListener('click',()=>{zbomCompareActiveResultTab=tab.key;renderZbomCompareResultTabs()});container.appendChild(button);
  });
  renderZbomCompareResultSheet();
}

function showZbomCompareResultPreview(groupPreviews,fidPreviews){
  const groups=(groupPreviews||[]).slice().sort((left,right)=>{
    const leftMatch=String(left.group).match(/^G(\d+)$/i),rightMatch=String(right.group).match(/^G(\d+)$/i);
    if(leftMatch&&rightMatch)return Number(leftMatch[1])-Number(rightMatch[1]);
    if(leftMatch)return -1;if(rightMatch)return 1;return String(left.group).localeCompare(String(right.group));
  });
  const tabs=[];
  groups.forEach(item=>{if(item.options)tabs.push({key:'group:'+item.group,label:item.group,sheet:item.options});if(item.gas)tabs.push({key:'group-gas:'+item.group,label:item.group+'_Gas',sheet:item.gas})});
  Array.from((fidPreviews||new Map()).values()).sort((left,right)=>left.order-right.order).forEach(item=>{if(item.sheet)tabs.push({key:'fid:'+item.fid,label:item.fid,sheet:item.sheet})});
  zbomCompareResultTabs=tabs;zbomCompareActiveResultTab='';renderZbomCompareResultTabs('G01');
}

function resetZbomCompareInput(){
  const input=bridgeId('zbomCompareInput');input.value='';saveZbomCompareInput();previewZbomCompareInput();input.focus();
}

function resetZbomCompareTemplate(){
  const input=bridgeId('zbomCompareTemplate'),separator=bridgeId('zbomCompareSeparator'),folder=bridgeId('zbomCompareOutputFolder');input.value=ZBOM_COMPARE_DEFAULT_TEMPLATE;separator.value=ZBOM_COMPARE_DEFAULT_SEPARATOR;folder.value=ZBOM_COMPARE_DEFAULT_FOLDER;saveZbomCompareTemplate();saveZbomCompareSeparator();saveZbomCompareFolder();invalidateZbomCompareResults();renderZbomComparePreview();updateZbomCompareStart();input.focus();
}

function historyDisplayTime(value){
  const date=new Date(value);return Number.isNaN(date.getTime())?String(value):date.toLocaleString([], {hour12:false});
}

function historyDisplayText(value){
  const lines=String(value||'').split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
  if(!lines.length)return '(empty)';
  const preview=lines.slice(0,4);
  if(lines.length>4)preview.push('… '+lines.length+' lines total');
  return preview.join('\n');
}

function openZbomHistory(){
  const dialog=bridgeId('zbomHistoryDialog');if(!dialog)return;
  closeZbomCompareHistory();
  zbomHistoryReturnFocus=document.activeElement;renderZbomHistory();dialog.hidden=false;document.body.classList.add('history-open');bridgeId('zbomCloseHistory').focus();
}

function closeZbomHistory(){
  const dialog=bridgeId('zbomHistoryDialog');if(!dialog||dialog.hidden)return;
  dialog.hidden=true;document.body.classList.remove('history-open');
  const returnFocus=zbomHistoryReturnFocus;zbomHistoryReturnFocus=null;
  if(returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();
}

function renderZbomHistory(){
  const list=bridgeId('zbomHistoryList'),count=bridgeId('zbomHistoryCount'),buttonCount=bridgeId('zbomHistoryButtonCount');
  if(buttonCount)buttonCount.textContent=String(zbomHistory.length);
  if(!list||!count)return;
  count.textContent=zbomHistory.length+'/'+ZBOM_HISTORY_LIMIT;list.replaceChildren();
  if(!zbomHistory.length){const empty=document.createElement('div');empty.className='history-empty';empty.textContent='No export history.';list.appendChild(empty);return}
  zbomHistory.forEach((entry,index)=>{
    const displayTime=historyDisplayTime(entry.runAt),button=document.createElement('button');button.type='button';button.className='history-entry';button.dataset.historyIndex=String(index);button.setAttribute('aria-label','Restore quotation data from '+displayTime);
    const time=document.createElement('span');time.className='history-entry-time';time.textContent=displayTime;
    const text=document.createElement('span');text.className='history-entry-text';text.textContent=historyDisplayText(entry.text);
    button.append(time,text);button.addEventListener('click',()=>{
      const current=zbomHistory[index];if(!current)return;
      const input=bridgeId('zbomInput');input.value=current.text;saveZbomInput();previewZbomInput();closeZbomHistory();input.focus();
    });
    list.appendChild(button);
  });
}

function recordZbomHistory(text){
  zbomHistory=[{text:String(text||''),runAt:new Date().toISOString()},...zbomHistory].slice(0,ZBOM_HISTORY_LIMIT);
  writePersistent(ZBOM_STORAGE_KEYS.history,JSON.stringify(zbomHistory));renderZbomHistory();
}

function openZbomCompareHistory(){
  const dialog=bridgeId('zbomCompareHistoryDialog');if(!dialog)return;
  closeZbomHistory();
  zbomCompareHistoryReturnFocus=document.activeElement;renderZbomCompareHistory();dialog.hidden=false;document.body.classList.add('history-open');bridgeId('zbomCompareCloseHistory').focus();
}

function closeZbomCompareHistory(){
  const dialog=bridgeId('zbomCompareHistoryDialog');if(!dialog||dialog.hidden)return;
  dialog.hidden=true;document.body.classList.remove('history-open');
  const returnFocus=zbomCompareHistoryReturnFocus;zbomCompareHistoryReturnFocus=null;
  if(returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();
}

function renderZbomCompareHistory(){
  const list=bridgeId('zbomCompareHistoryList'),count=bridgeId('zbomCompareHistoryCount'),buttonCount=bridgeId('zbomCompareHistoryButtonCount');
  if(buttonCount)buttonCount.textContent=String(zbomCompareHistory.length);
  if(!list||!count)return;
  count.textContent=zbomCompareHistory.length+'/'+ZBOM_HISTORY_LIMIT;list.replaceChildren();
  if(!zbomCompareHistory.length){const empty=document.createElement('div');empty.className='history-empty';empty.textContent='No compare history.';list.appendChild(empty);return}
  zbomCompareHistory.forEach((entry,index)=>{
    const displayTime=historyDisplayTime(entry.runAt),button=document.createElement('button');button.type='button';button.className='history-entry';button.setAttribute('aria-label','Restore ZBOM Compare data from '+displayTime);
    const time=document.createElement('span');time.className='history-entry-time';time.textContent=displayTime;
    const text=document.createElement('span');text.className='history-entry-text';text.textContent=historyDisplayText(entry.text);
    button.append(time,text);button.addEventListener('click',()=>{
      const current=zbomCompareHistory[index];if(!current)return;
      const input=bridgeId('zbomCompareInput');input.value=current.text;saveZbomCompareInput();previewZbomCompareInput();closeZbomCompareHistory();input.focus();
    });
    list.appendChild(button);
  });
}

function recordZbomCompareHistory(text){
  zbomCompareHistory=[{text:String(text||''),runAt:new Date().toISOString()},...zbomCompareHistory].slice(0,ZBOM_HISTORY_LIMIT);
  writePersistent(ZBOM_COMPARE_STORAGE_KEYS.history,JSON.stringify(zbomCompareHistory));renderZbomCompareHistory();
}

function beginLaunch(){
  beginRoute(FLAG,APP_PATH+'?nsrct=1');
}

function beginBridgeLaunch(){
  beginRoute(BRIDGE_FLAG,BRIDGE_PATH+'?nsrbridge=1');
}

function beginRoute(flag,target){
  store().setItem(flag,String(Date.now()+15*60*1000));
  unsafeWindow.location.assign(FLP);resumeLaunch(flag,target);
}

function clearLaunch(flag){
  try{store().removeItem(flag)}catch(_){/* ignore */}
}

function launchPending(flag){
  const until=Number(store().getItem(flag)||0);
  if(!until||until<Date.now()){clearLaunch(flag);return false}
  return true;
}

async function signedIn(){
  try{
    const response=await unsafeWindow.fetch(PROBE,{credentials:'same-origin',cache:'no-store',redirect:'manual',headers:{Accept:'application/atom+xml,application/xml,text/xml'}});
    if(!response.ok)return false;
    const type=(response.headers.get('Content-Type')||'').toLowerCase(),text=await response.text();
    return !type.includes('text/html')&&/<(?:[A-Za-z0-9_-]+:)?feed\b/i.test(text);
  }catch(_){return false}
}

async function resumeLaunch(flag,target){
  if(launchLoops.has(flag)||!launchPending(flag))return;launchLoops.add(flag);
  try{
    for(let attempt=0;attempt<300&&launchPending(flag);attempt++){
      if(await signedIn()){
        clearLaunch(flag);unsafeWindow.location.replace(target);return;
      }
      await new Promise(resolve=>setTimeout(resolve,2000));
    }
  }finally{launchLoops.delete(flag)}
}

function mountApp(){
  if(document.documentElement.dataset.nsrCtMounted)return;
  if(Number.isFinite(date_v.getTime())&&(Date.now()-date_v.getTime())/86400000>270){unsafeWindow.alert('The data format has changed. Please update to the latest version.');return}
  document.documentElement.dataset.nsrCtMounted='1';document.documentElement.lang='en';
  const charset=document.createElement('meta');charset.charset='utf-8';
  const viewport=document.createElement('meta');viewport.name='viewport';viewport.content='width=device-width,initial-scale=1';
  const title=document.createElement('title');title.textContent='NSR Flow Control Tower';
  const style=document.createElement('style');style.textContent=APP_CSS;
  document.head.replaceChildren(charset,viewport,title,style);document.body.innerHTML=APP_HTML;
  if(window.jQuery&&!jQuery.trim)jQuery.trim=value=>value==null?'':String(value).trim();
  runDashboard();
}

function mountBridgeApp(){
  if(document.documentElement.dataset.nsrSapBridgeMounted)return;
  document.documentElement.dataset.nsrSapBridgeMounted='1';document.documentElement.lang='en';
  const charset=document.createElement('meta');charset.charset='utf-8';
  const viewport=document.createElement('meta');viewport.name='viewport';viewport.content='width=device-width,initial-scale=1';
  const title=document.createElement('title');title.textContent='SAP Toolbox';
  const style=document.createElement('style');style.textContent=BRIDGE_CSS;
  document.head.replaceChildren(charset,viewport,title,style);document.body.innerHTML=BRIDGE_HTML;
  bindBridgeEvents();refreshBridge();
}

function bridgeId(id){return document.getElementById(id)}

function bridgeRequest(method,path,payload,timeout){
  return new Promise((resolve,reject)=>{
    if(typeof GM_xmlhttpRequest!=='function'){reject(new Error('Tampermonkey bridge permission is unavailable. Reinstall or update this userscript.'));return}
    const headers={Accept:'application/json','X-NSR-Page-Origin':unsafeWindow.location.origin};
    if(payload!==undefined)headers['Content-Type']='application/json';
    const transportError=detail=>{
      const suffix=detail?' ('+String(detail)+')':'',error=new Error('Cannot reach SAPGUIcontrol.exe at 127.0.0.1:8765. Start the EXE and keep its window open. If /health opens in a browser, allow Tampermonkey access to fep.lamresearch.com and 127.0.0.1.'+suffix);
      error.transport=true;return error;
    };
    const options={method:method,url:BRIDGE_URL+path,headers:headers,timeout:timeout||20000,nocache:true,fetch:false,
      onload:response=>{
        if(!response||!Number(response.status)){reject(transportError(response&&response.statusText));return}
        let data={};
        try{data=response.responseText?JSON.parse(response.responseText):{}}catch(_){data={message:response.responseText||'Invalid bridge response.'}}
        if(response.status>=200&&response.status<300){resolve(data);return}
        const error=new Error(data.message||('Local bridge returned HTTP '+response.status+'.'));error.status=response.status;error.data=data;
        reject(error);
      },
      onerror:response=>reject(transportError(response&&(response.error||response.statusText))),
      ontimeout:()=>reject(transportError('request timed out')),
      onabort:()=>reject(transportError('request was aborted'))
    };
    if(payload!==undefined)options.data=JSON.stringify(payload);
    try{GM_xmlhttpRequest(options)}catch(error){options.onerror(error&&error.message)}
  });
}

function setBridgeBadge(text,kind){
  const badge=bridgeId('bridgeBadge');badge.textContent=text;badge.className='bridge-badge'+(kind?' '+kind:'');
}

function showBridgeResult(value,label){
  const prefix=label?label+'\n':'';
  bridgeId('sapResult').textContent=prefix+(typeof value==='string'?value:JSON.stringify(value,null,2));
}

function bridgeError(error){
  return error&&error.message?error.message:String(error||'Unknown bridge error.');
}

function setBridgeBusy(value){
  bridgeBusy=Boolean(value);
  const locked=bridgeBusy||zbomRunning||zbomCompareRunning;
  document.querySelectorAll('[data-bridge-action]').forEach(button=>{
    const needsSession=button.id.indexOf('sap')===0;
    button.disabled=locked||(needsSession&&!selectedBridgeSession());
  });
  const sessionSelect=bridgeId('sapSession');
  if(sessionSelect)sessionSelect.disabled=locked||!bridgeSessions.length;
  updateZbomStart();updateZbomCompareStart();updateCreateQuoteStart();
}

function selectedBridgeSession(){
  const select=bridgeId('sapSession'),value=select&&select.value;
  if(!value)return null;
  const parts=value.split(':');
  if(parts.length!==2)return null;
  return {connectionIndex:Number(parts[0]),sessionIndex:Number(parts[1])};
}

function renderBridgeSessions(sessions){
  bridgeSessions=Array.isArray(sessions)?sessions:[];
  const select=bridgeId('sapSession'),previous=select.value;select.replaceChildren();
  if(!bridgeSessions.length){
    const option=document.createElement('option');option.value='';option.textContent='No SAP GUI sessions found';select.appendChild(option);select.disabled=true;
  }else{
    bridgeSessions.forEach((session,index)=>{
      const option=document.createElement('option');option.value=String(session.connectionIndex)+':'+String(session.sessionIndex);
      option.textContent=(session.system||'SAP')+' '+(session.client||'')+' · '+(session.user||'User')+' · '+(session.transaction||'No transaction')+(session.windowTitle?' · '+session.windowTitle:'');
      select.appendChild(option);if(option.value===previous)select.selectedIndex=index;
    });
    select.disabled=bridgeBusy||zbomRunning;
  }
  setBridgeBusy(bridgeBusy);
}

async function refreshBridge(){
  setBridgeBusy(true);setBridgeBadge('Checking','');bridgeId('bridgeService').textContent='Checking 127.0.0.1:8765…';
  try{
    const health=await bridgeRequest('GET','/health',undefined,8000),mock=health.mode==='mock';
    bridgeMock=mock;
    bridgeId('bridgeService').textContent=(health.service||'SAPGUIcontrol')+' '+(health.version||'')+(mock?' · MOCK':'');
    bridgeId('bridgeSap').textContent=mock?'Simulated SAP session':health.sapAvailable?'SAP GUI detected':'SAP GUI not detected';
    renderBridgeSessions(health.sessions);
    if(bridgeSessions.length)setBridgeBadge(mock?'Mock ready':'Ready',mock?'warn':'ok');
    else setBridgeBadge('SAP unavailable','warn');
    showBridgeResult(health,'Connection refreshed.');
  }catch(error){
    bridgeMock=false;
    renderBridgeSessions([]);
    bridgeId('bridgeService').textContent=error.status?'Local bridge responded with an error':'Offline';bridgeId('bridgeSap').textContent='Unavailable';setBridgeBadge(error.status?'Bridge error':'Bridge offline','error');
    showBridgeResult(bridgeError(error),'Connection failed.');
  }finally{setBridgeBusy(false)}
}

function setToolTab(name){
  if(name==='debug'&&!bridgeDebugUnlocked)name='zbom';
  document.querySelectorAll('[data-tool-tab]').forEach(button=>{
    const active=button.dataset.toolTab===name;button.setAttribute('aria-selected',active?'true':'false');
  });
  document.querySelectorAll('[data-tool-panel]').forEach(panel=>{panel.hidden=panel.dataset.toolPanel!==name});
}

function toggleBridgeDebug(){
  bridgeDebugUnlocked=!bridgeDebugUnlocked;writePersistent(BRIDGE_DEBUG_STORAGE_KEY,bridgeDebugUnlocked?'1':'0');bridgeId('tabDebug').hidden=!bridgeDebugUnlocked;setToolTab(bridgeDebugUnlocked?'debug':'zbom');
}

function splitZbomLine(line){
  if(line.indexOf('\t')>=0)return line.split('\t').map(value=>value.trim());
  if(line.indexOf(',')>=0){
    const values=[];let value='',quoted=false;
    for(let index=0;index<line.length;index++){
      const character=line[index];
      if(character==='"'){
        if(quoted&&line[index+1]==='"'){value+='"';index++}else quoted=!quoted;
      }else if(character===','&&!quoted){values.push(value.trim());value=''}
      else value+=character;
    }
    values.push(value.trim());return values;
  }
  if(/\s{2,}/.test(line.trim()))return line.trim().split(/\s{2,}/).map(value=>value.trim());
  return [line.trim()];
}

function normalizedZbomHeader(value){
  return String(value||'').trim().toLowerCase().replace(/[\s_.\-/#]+/g,'');
}

function zbomHeaderRole(value){
  const key=normalizedZbomHeader(value);
  if(['fid','facilityid'].includes(key))return 'fid';
  if(['systemdescription','systemdesc','sysdescription','sysdesc','description'].includes(key))return 'systemDescription';
  if(['quote','quotation','quotenumber','quotationnumber','vbeln'].includes(key))return 'quote';
  return '';
}

function createQuoteHeaderRole(value){
  const key=normalizedZbomHeader(value);
  if(['fid','facilityid'].includes(key))return 'fid';
  if(['crd','customerrequestdate','customerrequesteddate','datecustomerrequest'].includes(key))return 'crd';
  if(['validto','validateto','validityto','validitydate'].includes(key))return 'validTo';
  return '';
}

function createQuoteUtcDate(year,month,day){
  const value=Date.UTC(Number(year),Number(month)-1,Number(day)),date=new Date(value);
  return date.getUTCFullYear()===Number(year)&&date.getUTCMonth()===Number(month)-1&&date.getUTCDate()===Number(day)?value:null;
}

function createQuoteDateValue(value){
  const text=String(value||'').trim();if(!text||/^\d{6}$/.test(text))return null;
  let match=text.match(/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})$/);
  if(match)return createQuoteUtcDate(match[1],match[2],match[3]);
  match=text.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  if(match)return createQuoteUtcDate(match[1],match[2],match[3]);
  match=text.match(/^(\d{4})(\d{2})(\d{2})$/);
  if(match)return createQuoteUtcDate(match[1],match[2],match[3]);
  match=text.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  if(match){
    const first=Number(match[1]),second=Number(match[2]),month=first>12?second:first,day=first>12?first:second;
    return createQuoteUtcDate(match[3],month,day);
  }
  if(/^\d{4,5}(?:\.\d+)?$/.test(text)){
    const serial=Number(text);if(serial>=20000&&serial<=80000)return Date.UTC(1899,11,30)+Math.round(serial*86400000);
  }
  const parsed=Date.parse(text);return Number.isFinite(parsed)?parsed:null;
}

function splitCreateQuoteLine(line){
  const values=splitZbomLine(line);return values.length===1&&/\s/.test(line.trim())?line.trim().split(/\s+/).map(value=>value.trim()):values;
}

function parseCreateQuoteInput(text){
  const source=String(text||'').replace(/\r/g,'').split('\n').map((line,index)=>({line:index+1,values:splitCreateQuoteLine(line)})).filter(item=>item.values.some(Boolean));
  if(!source.length)return {rows:[],duplicates:0,ignored:0};
  const hasHeader=source[0].values.some(value=>Boolean(createQuoteHeaderRole(value))),data=hasHeader?source.slice(1):source,rows=[],seen=new Map();let duplicates=0,ignored=0;
  data.forEach(item=>{
    const cells=item.values.map((value,index)=>({value:String(value||'').trim(),index:index})).filter(cell=>cell.value),fidCell=cells.find(cell=>/^\d{6}$/.test(cell.value));
    if(!fidCell){ignored++;return}
    const dates=cells.filter(cell=>cell.index!==fidCell.index&&createQuoteDateValue(cell.value)!==null);
    const row={fid:fidCell.value,crd:dates[0]?dates[0].value:'',validTo:dates[1]?dates[1].value:''},existing=seen.get(fidCell.value);
    if(existing){duplicates++;if(!existing.crd&&row.crd)existing.crd=row.crd;if(!existing.validTo&&row.validTo)existing.validTo=row.validTo;return}
    seen.set(fidCell.value,row);rows.push(row);
  });
  return {rows:rows,duplicates:duplicates,ignored:ignored};
}

function formatCreateQuoteDate(date){
  return String(date.getMonth()+1).padStart(2,'0')+'/'+String(date.getDate()).padStart(2,'0')+'/'+date.getFullYear();
}

function formatCreateQuoteDateParts(year,month,day){
  return createQuoteUtcDate(year,month,day)===null?'':String(Number(month)).padStart(2,'0')+'/'+String(Number(day)).padStart(2,'0')+'/'+String(Number(year)).padStart(4,'0');
}

function normalizeCreateQuoteDate(value){
  const text=String(value||'').trim();if(!text)return '';
  let match=text.match(/^(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})$/);
  if(match)return formatCreateQuoteDateParts(match[1],match[2],match[3]);
  match=text.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);
  if(match)return formatCreateQuoteDateParts(match[1],match[2],match[3]);
  match=text.match(/^(\d{4})(\d{2})(\d{2})$/);
  if(match)return formatCreateQuoteDateParts(match[1],match[2],match[3]);
  match=text.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  if(match){
    const first=Number(match[1]),second=Number(match[2]),month=first>12?second:first,day=first>12?first:second;
    return formatCreateQuoteDateParts(match[3],month,day);
  }
  if(/^\d{4,5}(?:\.\d+)?$/.test(text)){
    const serial=Number(text);
    if(serial>=20000&&serial<=80000){const date=new Date(Date.UTC(1899,11,30)+Math.round(serial*86400000));return formatCreateQuoteDateParts(date.getUTCFullYear(),date.getUTCMonth()+1,date.getUTCDate())}
  }
  const parsed=Date.parse(text);return Number.isFinite(parsed)?formatCreateQuoteDate(new Date(parsed)):'';
}

function defaultCreateQuoteValidTo(){
  const input=bridgeId('createQuoteDefaultValidTo'),raw=normalizeCreateQuoteDays(input&&input.value),days=raw===''?Number(CREATE_QUOTE_DEFAULT_VALID_TO_DAYS):Number(raw),date=new Date();
  date.setHours(12,0,0,0);date.setDate(date.getDate()+days);return formatCreateQuoteDate(date);
}

function createQuotePreviewFid(fid){
  const suffix=bridgeId('createQuoteFidSuffix');return String(fid||'')+String(suffix&&suffix.value||'');
}

function renderCreateQuotePreview(){
  const body=bridgeId('createQuotePreviewBody');body.replaceChildren();
  if(!createQuoteRows.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=4;td.className='missing';td.textContent='No preview yet.';tr.appendChild(td);body.appendChild(tr)}
  else createQuoteRows.forEach((row,index)=>{
    const tr=document.createElement('tr'),item=document.createElement('td'),crd=document.createElement('td'),crdInput=document.createElement('input'),version=document.createElement('td'),validTo=document.createElement('td');
    item.textContent=String(index+1);version.textContent=row.version||createQuotePreviewFid(row.fid);crdInput.type='text';crdInput.className='create-quote-crd-input';crdInput.value=row.crd||'';crdInput.placeholder='CRD';crdInput.setAttribute('aria-label','CRD for FID '+row.fid);
    crdInput.addEventListener('input',()=>{crdInput.classList.remove('invalid');row.crd=crdInput.value;createQuoteCrdOverrides.set(row.fid,row.crd);saveCreateQuoteCrdOverrides()});
    crd.appendChild(crdInput);validTo.textContent=row.validTo||defaultCreateQuoteValidTo();tr.append(item,crd,version,validTo);body.appendChild(tr);
  });
  const count=createQuoteRows.length,parts=[count+' FID'+(count===1?'':'s')];
  if(createQuoteStats.duplicates)parts.push(createQuoteStats.duplicates+' duplicate'+(createQuoteStats.duplicates===1?'':'s')+' removed');
  if(createQuoteStats.ignored)parts.push(createQuoteStats.ignored+' row'+(createQuoteStats.ignored===1?'':'s')+' ignored');
  bridgeId('createQuoteCount').textContent=parts.join(' · ');
  updateCreateQuoteStart();
}

function previewCreateQuoteInput(){
  const parsed=parseCreateQuoteInput(bridgeId('createQuoteInput').value);createQuoteRows=parsed.rows;createQuoteRows.forEach(row=>{if(createQuoteCrdOverrides.has(row.fid))row.crd=createQuoteCrdOverrides.get(row.fid)});createQuoteStats={duplicates:parsed.duplicates,ignored:parsed.ignored};renderCreateQuotePreview();
}

function setCreateQuoteStatus(message,kind){
  const status=bridgeId('createQuoteStatus');if(!status)return;
  status.textContent=message;status.className='bridge-note create-quote-status'+(kind==='error'?' row-error':kind==='ok'?' row-ok':'');
}

function updateCreateQuoteStart(){
  const button=bridgeId('createQuoteStart');if(!button)return;
  button.disabled=bridgeBusy||zbomRunning||zbomCompareRunning||!selectedBridgeSession()||!sanitizeCreateQuoteQuotation()||!createQuoteRows.length;
}

function validateCreateQuotePreview(){
  const inputs=Array.from(document.querySelectorAll('#createQuotePreviewBody .create-quote-crd-input')),normalized=[];let firstInvalid=null,error='';
  createQuoteRows.forEach((row,index)=>{
    const input=inputs[index],crdText=String(input?input.value:row.crd).trim(),crd=crdText?normalizeCreateQuoteDate(crdText):'',validTo=normalizeCreateQuoteDate(row.validTo||defaultCreateQuoteValidTo());
    if(input)input.classList.remove('invalid');
    if(crdText&&!crd){
      if(input){input.classList.add('invalid');if(!firstInvalid)firstInvalid=input}
      if(!error)error='Item '+(index+1)+': CRD is not a recognized date.';
      return;
    }
    if(!validTo){if(!error)error='Item '+(index+1)+': Valid to is not a recognized date.';return}
    normalized[index]={crd:crd,validTo:validTo};
  });
  if(error){setCreateQuoteStatus(error,'error');if(firstInvalid)firstInvalid.focus();return false}
  normalized.forEach((value,index)=>{createQuoteRows[index].crd=value.crd;createQuoteRows[index].validTo=value.validTo;createQuoteCrdOverrides.set(createQuoteRows[index].fid,value.crd)});
  saveCreateQuoteCrdOverrides();renderCreateQuotePreview();return true;
}

async function startCreateQuote(){
  if(!validateCreateQuotePreview())return;
  setBridgeBusy(true);setCreateQuoteStatus('Opening SAP transaction ZVA21M…');
  try{
    await sendZbomAction('transaction',{code:'ZVA21M'});
    await sendZbomAction('setText',{controlId:'wnd[0]/usr/txtGS_HEADER-VBELN',value:sanitizeCreateQuoteQuotation()});
    await sendZbomAction('setKey',{controlId:'wnd[0]/usr/cmbGS_HEADER-ACQ_ID',value:'999'});
    await sendZbomAction('sendVKey',{controlId:'wnd[0]',key:0});
    const data=await sendZbomAction('readText',{controlId:'wnd[0]/usr/txtGS_HEADER-VERSION'}),referenceVersion=String(data&&data.value||'').trim(),fidMatch=referenceVersion.match(/(?:^|\D)(\d{6})(?!\d)/),referenceFid=fidMatch?fidMatch[1]:'';
    if(!referenceFid){
      if(!unsafeWindow.confirm('FID could not be extracted from "'+(referenceVersion||'(blank)')+'". Continue?')){setCreateQuoteStatus('Create Quote stopped.');return}
    }else{
      const row=createQuoteRows.find(item=>item.fid===referenceFid);
      if(row){
        const tail=referenceVersion.slice(referenceVersion.indexOf(referenceFid)+referenceFid.length),versionMatch=tail.match(/^(\D*)(\d+)(.*)$/);
        if(versionMatch){
          const crdData=await sendZbomAction('readText',{controlId:'wnd[0]/usr/txtGS_HEADER-CRD'}),referenceCrd=String(crdData&&crdData.value||'').trim();
          row.version=referenceFid+versionMatch[1]+String(Number(versionMatch[2])+1).padStart(versionMatch[2].length,'0')+versionMatch[3];row.crd=referenceCrd;createQuoteCrdOverrides.set(row.fid,row.crd);saveCreateQuoteCrdOverrides();renderCreateQuotePreview();
        }else if(!unsafeWindow.confirm('FID Version "'+referenceVersion+'" could not be incremented. Continue?')){setCreateQuoteStatus('Create Quote stopped.');return}
      }
    }
    setCreateQuoteStatus('Entering '+createQuoteRows.length+' item(s) into SAP…');
    const tableId='wnd[0]/usr/tblZSDR0390_MASS_QUOTE_CREATE1MYTABLE';
    for(let index=0;index<createQuoteRows.length;index++){
      const row=createQuoteRows[index];
      if(row.crd)await sendZbomAction('setText',{controlId:tableId+'/ctxtGS_ITEM-REQ_DEL_DATE[1,'+index+']',value:row.crd});
      await sendZbomAction('setText',{controlId:tableId+'/txtGS_ITEM-VERSION[2,'+index+']',value:row.version||createQuotePreviewFid(row.fid)});
      await sendZbomAction('setText',{controlId:tableId+'/ctxtGS_ITEM-VALID_TO[3,'+index+']',value:row.validTo||defaultCreateQuoteValidTo()});
    }
    if(createQuoteRows.every(row=>String(row.crd||'').trim())){
      await sendZbomAction('sapCall',{controlId:tableId+'/ctxtGS_ITEM-VALID_TO[3,0]',steps:[{action:'invoke',member:'SetFocus',arguments:[]}]});
      await sendZbomAction('sendVKey',{controlId:'wnd[0]',key:0});
    }
    setCreateQuoteStatus(createQuoteRows.length+' item(s) entered. Ready for the next step.','ok');
  }catch(error){setCreateQuoteStatus('Unable to prepare ZVA21M: '+bridgeError(error),'error')}
  finally{setBridgeBusy(false)}
}

function zbomCompareHeaderRole(value){
  const key=normalizedZbomHeader(value);
  if(['quote','quotation','quoteno','quotationno','quotenumber','quotationnumber','vbeln'].includes(key))return 'quote';
  if(['fid','facilityid'].includes(key))return 'fid';
  if(['group','groupid','comparegroup','comparisongroup','zbomgroup'].includes(key))return 'group';
  if(['systemdescription','systemdesc','sysdescription','sysdesc','description'].includes(key))return 'systemDescription';
  if(['customer','customername','account','accountname'].includes(key))return 'customer';
  return '';
}

function extractZbomCompareQuote(value){
  const text=String(value||'').trim();
  if(/^2\d{7}$/.test(text))return text;
  const match=text.match(/(?:^|\D)(2\d{7})(?!\d)/);
  return match?match[1]:'';
}

function normalizeZbomCompareGroup(value,allowCustom){
  const text=String(value||'').trim();
  if(!text)return '';
  if(/^standalone$/i.test(text)||/^do[\s_-]*not[\s_-]*compare$/i.test(text))return ZBOM_COMPARE_STANDALONE;
  if(/^g\d+$/i.test(text))return 'G'+text.slice(1);
  return allowCustom&&/^[A-Za-z0-9]+$/.test(text)?text:'';
}

function mappedZbomCompareValue(values,index){
  return index>=0&&index<values.length?String(values[index]||'').trim():'';
}

function inferZbomCompareColumns(rows,mapping){
  if(mapping.systemDescription>=0)return mapping;
  const width=Math.max(0,...rows.map(values=>values.length)),reserved=new Set(Object.values(mapping).filter(index=>index>=0));let best=-1,bestMatches=0;
  for(let column=0;column<width;column++){
    if(reserved.has(column))continue;
    const matches=rows.reduce((total,values)=>total+(/[\/_]/.test(String(values[column]||'').trim())?1:0),0);
    if(matches>bestMatches){best=column;bestMatches=matches}
  }
  if(best>=0)mapping.systemDescription=best;
  return mapping;
}

function classifyZbomCompareRow(values,mapping){
  const cells=values.map((value,index)=>({value:String(value||'').trim(),index:index})).filter(cell=>cell.value),used=new Set();
  Object.values(mapping).forEach(index=>{if(index>=0)used.add(index)});
  let quote=extractZbomCompareQuote(mappedZbomCompareValue(values,mapping.quote)),quoteIndex=quote?mapping.quote:-1;
  if(!quote){
    const candidates=cells.filter(cell=>!used.has(cell.index)).map(cell=>Object.assign({},cell,{quote:extractZbomCompareQuote(cell.value)})).filter(cell=>cell.quote);
    const candidate=candidates.find(cell=>cell.value===cell.quote)||candidates[0];
    if(candidate){quote=candidate.quote;quoteIndex=candidate.index;used.add(candidate.index)}
  }
  let fid=mappedZbomCompareValue(values,mapping.fid);
  if(!/^\d{6}$/.test(fid))fid='';
  if(!fid){
    const candidate=cells.find(cell=>!used.has(cell.index)&&/^\d{6}$/.test(cell.value));
    if(candidate){fid=candidate.value;used.add(candidate.index)}
  }
  let group=normalizeZbomCompareGroup(mappedZbomCompareValue(values,mapping.group),mapping.group>=0);
  if(!group){
    const candidate=cells.find(cell=>!used.has(cell.index)&&/^g\d+$/i.test(cell.value));
    if(candidate){group=normalizeZbomCompareGroup(candidate.value,false);used.add(candidate.index)}
  }
  let customer=mappedZbomCompareValue(values,mapping.customer),systemDescription=mappedZbomCompareValue(values,mapping.systemDescription);
  const unknown=cells.filter(cell=>!used.has(cell.index));
  if(!systemDescription){
    const marked=unknown.find(cell=>/[\/_]/.test(cell.value));
    if(marked){systemDescription=marked.value;used.add(marked.index)}
  }
  const remaining=unknown.filter(cell=>!used.has(cell.index));
  if(!customer&&!systemDescription){
    if(remaining.length===1)systemDescription=remaining[0].value;
    else if(remaining.length>1){customer=remaining[0].value;systemDescription=remaining[1].value}
  }else if(!customer&&remaining.length)customer=remaining[0].value;
  else if(!systemDescription&&remaining.length)systemDescription=remaining[0].value;
  return {quote:quote,fid:fid,group:group,customer:customer,systemDescription:systemDescription,_groupExplicit:Boolean(group),_quoteIndex:quoteIndex};
}

function parseZbomCompareInput(text){
  const source=String(text||'').replace(/\r/g,'').split('\n').map((line,index)=>({line:index+1,values:splitZbomLine(line)})).filter(item=>item.values.some(Boolean));
  if(!source.length)return {rows:[],duplicates:0,ignored:0};
  const firstRoles=source[0].values.map(zbomCompareHeaderRole),hasHeader=firstRoles.includes('quote'),mapping={quote:-1,fid:-1,group:-1,customer:-1,systemDescription:-1};
  if(hasHeader)firstRoles.forEach((role,index)=>{if(role&&mapping[role]<0)mapping[role]=index});
  const rows=[],seen=new Map(),data=hasHeader?source.slice(1):source;let duplicates=0,ignored=0;
  inferZbomCompareColumns(data.map(item=>item.values),mapping);
  data.forEach(item=>{
    const row=classifyZbomCompareRow(item.values,mapping);
    if(!row.quote){ignored++;return}
    if(!row.group)row.group=zbomCompareSavedGroups.get(row.quote)||ZBOM_COMPARE_DEFAULT_GROUP;
    const existing=seen.get(row.quote);
    if(existing){
      duplicates++;
      ['fid','customer','systemDescription'].forEach(field=>{if(!existing[field]&&row[field])existing[field]=row[field]});
      if(!existing._groupExplicit&&row._groupExplicit){existing.group=row.group;existing._groupExplicit=true}
      return;
    }
    seen.set(row.quote,row);rows.push(row);
  });
  return {rows:rows,duplicates:duplicates,ignored:ignored};
}

function zbomCompareGroupLabel(number){
  return 'G'+String(number).padStart(2,'0');
}

function zbomCompareGroupOptions(){
  const selected=new Set(zbomCompareRows.map(row=>row.group)),groups=[zbomCompareGroupLabel(1)],custom=[],customKeys=new Set();let number=1;
  while(number<500&&selected.has(zbomCompareGroupLabel(number))){number++;groups.push(zbomCompareGroupLabel(number))}
  zbomCompareRows.forEach(row=>{
    if(row.group&&row.group!==ZBOM_COMPARE_STANDALONE&&!groups.includes(row.group)){
      const key=row.group;if(!customKeys.has(key)){customKeys.add(key);custom.push(row.group)}
    }
  });
  return groups.concat(custom,ZBOM_COMPARE_STANDALONE);
}

function compactZbomCompareName(value){
  return String(value||'').trim().replace(/_{2,}/g,'_').replace(/^[\s_.-]+|[\s_.-]+$/g,'');
}

function renderZbomCompareFileName(row,omit){
  const input=bridgeId('zbomCompareTemplate'),template=String(input.value||'').trim()||ZBOM_COMPARE_DEFAULT_TEMPLATE;
  const options=omit||{},customer=options.customer?'':row.customer||'',systemDescription=options.systemDescription?'':row.systemDescription||'';
  return compactZbomCompareName(template.replace(/\{quote\}/gi,row.quote||'').replace(/\{fid\}/gi,row.fid||'{FID}').replace(/\{customer\}/gi,customer).replace(/\{sysdes\}/gi,systemDescription).replace(/\{system description\}/gi,systemDescription));
}

function finishZbomCompareFileName(value){
  const safe=compactZbomCompareName(value).replace(/[<>:"/\\|?*\u0000-\u001F]/g,',').replace(/\.xlsx$/i,'');
  return (safe||'ZBOM Compare')+'.xlsx';
}

function zbomCompareDuplicateKey(value){return String(value||'').trim().toLocaleLowerCase()}

function renderZbomCompareGroupFileName(rows){
  const separator=String(bridgeId('zbomCompareSeparator').value||'').trim()||ZBOM_COMPARE_DEFAULT_SEPARATOR;
  const seenCustomers=new Set(),seenDescriptions=new Set(),parts=[];
  rows.forEach(row=>{
    const customerKey=zbomCompareDuplicateKey(row.customer),descriptionKey=zbomCompareDuplicateKey(row.systemDescription);
    parts.push(renderZbomCompareFileName(row,{customer:Boolean(customerKey&&seenCustomers.has(customerKey)),systemDescription:Boolean(descriptionKey&&seenDescriptions.has(descriptionKey))}));
    if(customerKey)seenCustomers.add(customerKey);
    if(descriptionKey)seenDescriptions.add(descriptionKey);
  });
  return finishZbomCompareFileName(parts.join(' '+separator+' '));
}

function plannedZbomCompareFileNames(){
  const names=new Map(),groups=new Map();
  zbomCompareRows.forEach(row=>{
    if(row.group===ZBOM_COMPARE_STANDALONE){names.set(row.quote,finishZbomCompareFileName(renderZbomCompareFileName(row)));return}
    if(!groups.has(row.group))groups.set(row.group,[]);
    groups.get(row.group).push(row);
  });
  groups.forEach(rows=>{
    const name=renderZbomCompareGroupFileName(rows);
    rows.forEach(row=>names.set(row.quote,name));
  });
  return names;
}

function renderZbomComparePreview(){
  const body=bridgeId('zbomComparePreviewBody');body.replaceChildren();
  if(!zbomCompareRows.length){
    const tr=document.createElement('tr'),cell=document.createElement('td');cell.colSpan=7;cell.className='missing';cell.textContent='No preview yet.';tr.appendChild(cell);body.appendChild(tr);
  }else{
    const options=zbomCompareGroupOptions(),fileNames=plannedZbomCompareFileNames();
    zbomCompareRows.forEach(row=>{
      const tr=document.createElement('tr'),quoteCell=document.createElement('td'),fidCell=document.createElement('td'),customerCell=document.createElement('td'),systemCell=document.createElement('td'),groupCell=document.createElement('td'),fileCell=document.createElement('td'),statusCell=document.createElement('td'),select=document.createElement('select'),result=zbomCompareResults.get(row.quote);
      quoteCell.textContent=row.quote;fidCell.textContent=row.fid||'{FID}';fidCell.className='compare-fid';customerCell.textContent=row.customer||'';customerCell.className='compare-customer';systemCell.textContent=row.systemDescription||'';systemCell.className='compare-system-description';
      groupCell.className='compare-group-cell';select.className='compare-group-select';select.dataset.quote=row.quote;select.setAttribute('aria-label','Compare group for quotation '+row.quote);
      options.forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=value===ZBOM_COMPARE_STANDALONE?'Standalone':value;select.appendChild(option)});
      select.value=row.group;select.disabled=zbomCompareRunning;select.addEventListener('change',()=>{row.group=select.value;saveZbomCompareGroups();invalidateZbomCompareResults();renderZbomComparePreview();const next=Array.from(body.querySelectorAll('select')).find(item=>item.dataset.quote===row.quote);if(next)next.focus()});
      groupCell.appendChild(select);fileCell.className='compare-file-name';const fileName=fileNames.get(row.quote)||'',outputPath=result&&result.completed?String(result.outputPath||''):'';if(outputPath){const link=document.createElement('button');link.type='button';link.className='compare-file-link';link.textContent=fileName;link.title='Open '+outputPath;link.addEventListener('click',event=>{if(event.isTrusted)openZbomCompareWorkbook(outputPath,link)});fileCell.appendChild(link)}else fileCell.textContent=fileName;statusCell.textContent=result?result.status:'Ready';statusCell.className='compare-status'+(result&&['Exported','Formatted','Completed'].includes(result.status)?' row-ok':result&&result.status===ZBOM_COMPARE_FID_ERROR?' row-warning':result&&['Failed','Group incomplete'].includes(result.status)?' row-error':'');if(result&&(result.error||result.warning))statusCell.title=result.error||result.warning;tr.append(quoteCell,fidCell,customerCell,systemCell,groupCell,fileCell,statusCell);body.appendChild(tr);
    });
  }
  const count=zbomCompareRows.length,parts=[count+' quotation'+(count===1?'':'s')];
  if(zbomCompareStats.duplicates)parts.push(zbomCompareStats.duplicates+' duplicate'+(zbomCompareStats.duplicates===1?'':'s')+' removed');
  if(zbomCompareStats.ignored)parts.push(zbomCompareStats.ignored+' line'+(zbomCompareStats.ignored===1?'':'s')+' ignored');
  bridgeId('zbomCompareCount').textContent=parts.join(' · ');
  updateZbomCompareStart();
}

function previewZbomCompareInput(){
  const parsed=parseZbomCompareInput(bridgeId('zbomCompareInput').value);
  zbomCompareRows=parsed.rows;zbomCompareStats={duplicates:parsed.duplicates,ignored:parsed.ignored};invalidateZbomCompareResults();setZbomCompareProgress(0,'Ready.');saveZbomCompareGroups();renderZbomComparePreview();
}

function insertZbomCompareToken(token){
  const input=bridgeId('zbomCompareTemplate'),start=input.selectionStart==null?input.value.length:input.selectionStart,end=input.selectionEnd==null?start:input.selectionEnd;
  input.value=input.value.slice(0,start)+token+input.value.slice(end);input.focus();input.setSelectionRange(start+token.length,start+token.length);saveZbomCompareTemplate();invalidateZbomCompareResults();renderZbomComparePreview();
}

function setZbomCompareProgress(percent,message){
  const value=Math.max(0,Math.min(100,Number(percent)||0)),bar=bridgeId('zbomCompareProgressBar'),number=bridgeId('zbomCompareProgressNumber'),text=bridgeId('zbomCompareProgressText');
  if(bar)bar.style.width=value+'%';
  if(number)number.textContent=Math.round(value)+'%';
  if(text&&message)text.textContent=String(message);
}

function setZbomCompareRunning(value){
  zbomCompareRunning=Boolean(value);
  ['zbomCompareInput','zbomCompareTemplate','zbomCompareSeparator','zbomCompareOutputFolder','zbomCompareKeepTemp','zbomCompareOpenHistory','zbomCompareResetInput','zbomCompareResetTemplate'].forEach(id=>{const element=bridgeId(id);if(element)element.disabled=zbomCompareRunning});
  document.querySelectorAll('[data-zbom-compare-token]').forEach(button=>button.disabled=zbomCompareRunning);
  document.querySelectorAll('.compare-group-select').forEach(select=>select.disabled=zbomCompareRunning);
  setBridgeBusy(bridgeBusy);
}

function updateZbomCompareStart(){
  const button=bridgeId('zbomCompareStart');if(!button)return;
  const folder=bridgeId('zbomCompareOutputFolder'),path=String(folder&&folder.value||'').trim(),validPath=/^[A-Za-z]:[\\/]/.test(path);
  button.disabled=zbomCompareRunning||bridgeBusy||!selectedBridgeSession()||!zbomCompareRows.length||!validPath;
  const openButton=bridgeId('zbomCompareOpenFolder');if(openButton)openButton.disabled=zbomCompareRunning||bridgeBusy||!validPath;
}

function normalizedZbomCompareFolder(){
  const input=bridgeId('zbomCompareOutputFolder'),raw=String(input&&input.value||'').trim().replace(/\//g,'\\');
  if(!raw||!/^[A-Za-z]:\\/.test(raw))throw new Error('Use an absolute local output folder such as C:\\PDFFILES\\Compare.');
  return raw.length>3?raw.replace(/\\+$/,''):raw;
}

function zbomCompareTempFolder(folder){return folder+'\\temp'}

async function cleanupZbomCompareTemp(tempFolder){
  if(keepZbomCompareTemp()){addZbomCompareLog('Temp folder kept: '+tempFolder);return ''}
  try{await bridgeFileRequest('deleteDirectory',{path:tempFolder,recursive:true},120000);addZbomCompareLog('Temp folder deleted.');return ''}
  catch(error){const message=bridgeError(error);addZbomCompareLog('TEMP CLEANUP FAILED: '+message);return message}
}

function sapCallArgument(type,value){return {type:type,value:value===null||value===undefined?'':String(value)}}

function addZbomCompareLog(message){
  zbomCompareLogLines.push('['+new Date().toLocaleTimeString([], {hour12:false})+'] '+message);
  if(zbomCompareLogLines.length>160)zbomCompareLogLines.shift();
  const result=bridgeId('sapResult');if(!result)return;
  result.textContent='ZBOM Compare log\n'+zbomCompareLogLines.join('\n');result.scrollTop=result.scrollHeight;
}

function isZbomCompareAccessError(text){
  return /(?:do(?:es)?\s+not|doesn't|don't)\s+have\s+access|no\s+access|not\s+authori[sz]ed|no\s+authori[sz]ation/i.test(String(text||''));
}

async function selectZbomCompareOutputType(row){
  const tableId='wnd[1]/usr/tblSAPLVMSGTABCONTROL',cellId=tableId+'/txtNAST-KSCHL[0,'+row+']';
  try{
    await sendZbomAction('sapCall',{steps:[
      {action:'invoke',member:'Table',arguments:[sapCallArgument('string',tableId)]},
      {action:'invoke',member:'SelectRow',arguments:[sapCallArgument('int',row)]},
      {action:'findById',arguments:[sapCallArgument('string',cellId)]},
      {action:'invoke',member:'SetFocus',arguments:[]}
    ]});
  }catch(_){
    await sendZbomAction('sapCall',{steps:[
      {action:'findById',arguments:[sapCallArgument('string',tableId)]},
      {action:'invoke',member:'GetAbsoluteRow',arguments:[sapCallArgument('int',row)]},
      {action:'set',member:'Selected',value:sapCallArgument('bool',true)},
      {action:'findById',arguments:[sapCallArgument('string',cellId)]},
      {action:'invoke',member:'SetFocus',arguments:[]}
    ]});
  }
}

async function findZbomCompareOutputRow(){
  const tableId='wnd[1]/usr/tblSAPLVMSGTABCONTROL',rows=[zbomCompareOutputRowHint,...Array.from({length:31},(_,row)=>row).filter(row=>row!==zbomCompareOutputRowHint)];let tableOpened=false;
  if(bridgeMock)return {row:4,tableOpened:true};
  for(const row of rows){
    try{
      const data=await sendZbomAction('readText',{controlId:tableId+'/txtNAST-KSCHL[0,'+row+']'});tableOpened=true;
      if(String(data&&data.value||'').trim().toUpperCase()==='ZBOM'){zbomCompareOutputRowHint=row;return {row:row,tableOpened:true}}
    }catch(_){/* an absent row is expected near the end of the table */}
  }
  return {row:-1,tableOpened:tableOpened};
}

async function setZbomCompareSaveTarget(tempFolder,fileName){
  const fullPath=tempFolder+'\\'+fileName;let splitPath=false;
  try{
    await sendZbomAction('setText',{controlId:'wnd[1]/usr/ctxtDY_PATH',value:tempFolder});
    await sendZbomAction('setText',{controlId:'wnd[1]/usr/ctxtDY_FILENAME',value:fileName});
    splitPath=true;
  }catch(_){/* older SAP dialogs provide only DY_FILENAME */}
  if(!splitPath)await sendZbomAction('setText',{controlId:'wnd[1]/usr/ctxtDY_FILENAME',value:fullPath});
  return fullPath;
}

async function waitForZbomCompareFile(path,timeout){
  const started=Date.now(),limit=timeout||30000;
  while(Date.now()-started<limit){
    try{
      const result=await bridgeFileRequest('stat',{path:path},10000);
      if(result&&result.exists)return result;
    }catch(_){/* the file may not exist until SAP finishes writing it */}
    await waitMs(250);
  }
  throw new Error('SAP did not create '+path+' within '+Math.round(limit/1000)+' seconds.');
}

async function exportOneZbomCompareQuotation(row,tempFolder){
  const quote=row.quote,fileName=quote+'.tsv',fullPath=tempFolder+'\\'+fileName;
  await sendZbomAction('transaction',{code:'VA23'});
  await sendZbomAction('setText',{controlId:'wnd[0]/usr/ctxtVBAK-VBELN',value:quote});
  await sendZbomAction('select',{controlId:'wnd[0]/mbar/menu[0]/menu[5]'});
  const popup=await sendZbomAction('readText',{controlId:'wnd[1]/usr/txtMESSTXT1'}).catch(()=>null),popupText=String(popup?.value||'').trim();
  if(popupText){
    await sendZbomAction('press',{controlId:'wnd[1]/tbar[0]/btn[0]'});addZbomCompareLog(quote+' — information popup confirmed: '+popupText);
    if(isZbomCompareAccessError(popupText))throw new Error(quote+': '+popupText);
  }
  const {row:outputRow,tableOpened}=await findZbomCompareOutputRow();
  if(outputRow<0)throw new Error(quote+': '+(tableOpened?'ZBOM output type was not found.':popupText||'SAP output dialog did not open.'));
  await selectZbomCompareOutputType(outputRow);addZbomCompareLog(quote+' — ZBOM output selected.');
  await sendZbomAction('press',{controlId:'wnd[1]/tbar[0]/btn[37]'});
  await sendZbomAction('select',{controlId:'wnd[0]/mbar/menu[2]/menu[1]'});
  await sendZbomAction('select',{controlId:'wnd[0]/mbar/menu[3]/menu[5]/menu[2]/menu[1]'});
  const radioId='wnd[1]/usr/subSUBSCREEN_STEPLOOP:SAPLSPO5:0150/sub:SAPLSPO5:0150/radSPOPLI-SELFLAG[1,0]';
  await sendZbomAction('select',{controlId:radioId});
  await sendZbomAction('sapCall',{controlId:radioId,steps:[{action:'invoke',member:'SetFocus',arguments:[]}]});
  await sendZbomAction('press',{controlId:'wnd[1]/tbar[0]/btn[0]'});addZbomCompareLog(quote+' — local save dialog opened.');
  await setZbomCompareSaveTarget(tempFolder,fileName);
  await sendZbomAction('press',{controlId:'wnd[1]/tbar[0]/btn[11]'});
  for(const controlId of ['wnd[1]/tbar[0]/btn[11]','wnd[1]/usr/btnSPOP-OPTION1']){
    try{await sendZbomAction('press',{controlId:controlId})}catch(_){/* optional overwrite/confirmation dialog */}
  }
  if(bridgeMock)return {path:fullPath,simulated:true};
  addZbomCompareLog(quote+' — save requested; waiting for '+fullPath+'.');
  await waitForZbomCompareFile(fullPath,30000);return {path:fullPath,simulated:false};
}

function decodeZbomCompareBase64(contentBase64){
  const binary=atob(String(contentBase64||'')),bytes=new Uint8Array(binary.length);
  for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);
  if(bytes[0]===0xff&&bytes[1]===0xfe)return new TextDecoder('utf-16le').decode(bytes.subarray(2));
  if(bytes[0]===0xfe&&bytes[1]===0xff){
    const swapped=new Uint8Array(bytes.length-2);
    for(let index=2;index+1<bytes.length;index+=2){swapped[index-2]=bytes[index+1];swapped[index-1]=bytes[index]}
    return new TextDecoder('utf-16le').decode(swapped);
  }
  const offset=bytes[0]===0xef&&bytes[1]===0xbb&&bytes[2]===0xbf?3:0;
  return new TextDecoder('utf-8').decode(bytes.subarray(offset));
}

function splitZbomCompareTsvLine(line){
  const values=[];let value='',quoted=false;
  for(let index=0;index<line.length;index++){
    const character=line[index];
    if(character==='"'){
      if(quoted&&line[index+1]==='"'){value+='"';index++}else quoted=!quoted;
    }else if(character==='\t'&&!quoted){values.push(value);value=''}else value+=character;
  }
  values.push(value);return values;
}

function parseZbomCompareTsvRows(text){
  return String(text||'').replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').split('\n').map(line=>splitZbomCompareTsvLine(line).map(value=>String(value||'').replace(/\u00a0/g,' ').trim()));
}

function extractZbomCompareFid(rows){
  const pattern=/Quotation\s*No\.?\s*[:#]?\s*(\d{6}(?:[-_][A-Za-z0-9]+)*)/i;
  for(const row of rows){
    const match=row.join(' ').match(pattern);
    if(match)return match[1];
  }
  return '';
}

function parseZbomCompareOptions(rows,gasStart){
  const options=[];let optionTypeColumn=-1,selectionColumn=-1,effectiveType='';
  const end=gasStart>=0?gasStart:rows.length;
  for(let rowIndex=0;rowIndex<end;rowIndex++){
    const row=rows[rowIndex],typeHeader=row.findIndex(value=>normalizedZbomHeader(value)==='optiontype'),selectionHeader=row.findIndex(value=>normalizedZbomHeader(value)==='optionselection');
    if(typeHeader>=0&&selectionHeader>=0){optionTypeColumn=typeHeader+1;selectionColumn=selectionHeader+1;continue}
    if(optionTypeColumn<0||selectionColumn<0)continue;
    const optionType=String(row[optionTypeColumn]||'').trim(),selection=String(row[selectionColumn]||'').trim();
    if(!optionType&&!selection)continue;
    if(/^(?:Ref\s*#|Page\s+\d+|Quotation\s*No\.?)/i.test(optionType+' '+selection))continue;
    if(optionType)effectiveType=optionType;
    options.push({
      optionType:optionType,
      effectiveType:effectiveType||optionType,
      selection:selection,
      comment:'',
      key:(effectiveType||optionType)+'\u0000'+selection
    });
  }
  return options;
}

function normalizeZbomGasHeader(value){
  return String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'');
}

function canonicalZbomGasHeader(value){
  const key=normalizeZbomGasHeader(value);
  if(key==='module'||key==='processmodule'||key==='pm')return {compareKey:'module',label:'Module'};
  if(key==='line'||key==='linenumber'||key==='lineno')return {compareKey:'line',label:'Line'};
  if(key==='mfctype'||key==='mfc')return {compareKey:'mfctype',label:'MFC Type'};
  if(key==='gastype'||key==='gas')return {compareKey:'gastype',label:'Gas Type'};
  if(key==='gasflow'||key==='flow')return {compareKey:'gasflow',label:'Gas Flow'};
  return {compareKey:key,label:String(value||'').trim()};
}

function firstZbomGasValue(row,start,end){
  const last=Math.min(row.length-1,Math.max(start,end));
  for(let column=start;column<=last;column++){
    const value=String(row[column]||'').trim();if(value)return value;
  }
  return '';
}

function findZbomCompareGasHeaderRow(rows,gasStart){
  if(gasStart<0)return -1;
  for(let rowIndex=gasStart+1;rowIndex<rows.length;rowIndex++){
    const headers=rows[rowIndex].map(normalizeZbomGasHeader);
    if(headers.includes('line')&&headers.includes('mfctype')&&headers.includes('gastype')&&headers.includes('gasflow'))return rowIndex;
  }
  return -1;
}

function parseZbomCompareGas(rows,gasStart){
  if(gasStart<0)return null;
  const headerRow=findZbomCompareGasHeaderRow(rows,gasStart);
  if(headerRow<0)return null;
  const sourceHeaders=rows[headerRow].map((value,column)=>({value:String(value||'').trim(),column:column})).filter(item=>item.value);
  const seenKeys=new Map(),headers=[];
  sourceHeaders.forEach((item,index)=>{
    const canonical=canonicalZbomGasHeader(item.value),count=(seenKeys.get(canonical.compareKey)||0)+1,key=canonical.compareKey+(count>1?'#'+count:'');
    seenKeys.set(canonical.compareKey,count);
    headers.push({key:key,compareKey:canonical.compareKey,label:canonical.label,start:item.column,end:index+1<sourceHeaders.length?sourceHeaders[index+1].column-1:Math.max(item.column,...rows.slice(headerRow+1).map(row=>row.length-1))});
  });
  if(!headers.some(header=>header.compareKey==='module'))headers.unshift({key:'module',compareKey:'module',label:'Module',start:-1,end:-1,synthetic:true});
  const lineHeader=headers.find(header=>header.compareKey==='line');
  if(!lineHeader)throw new Error('Gas section was found, but its Line column could not be identified.');
  const records=[];let currentModule='';
  for(let rowIndex=headerRow+1;rowIndex<rows.length;rowIndex++){
    const row=rows[rowIndex],joined=row.join(' ').trim();
    if(!joined)continue;
    if(/(?:Ref\s*#|Page\s+\d+|Quotation\s*No\.?)/i.test(joined))continue;
    const line=firstZbomGasValue(row,lineHeader.start,lineHeader.end);
    if(!line){
      const moduleCandidate=row.map(value=>String(value||'').trim()).find(value=>/^(?:PM|MODULE)\s*[-_A-Z0-9]+$/i.test(value));
      if(moduleCandidate)currentModule=moduleCandidate;
      continue;
    }
    const values={};
    headers.forEach(header=>{
      values[header.key]=header.synthetic?currentModule:firstZbomGasValue(row,header.start,header.end);
    });
    const moduleHeader=headers.find(header=>header.compareKey==='module'),moduleValue=String(values[moduleHeader.key]||currentModule).trim();
    if(moduleValue)currentModule=moduleValue;
    values[moduleHeader.key]=currentModule;
    records.push({values:values,key:currentModule+'\u0000'+line,module:currentModule,line:line});
  }
  return {headers:headers,records:records};
}

function parseZbomCompareTsv(text,path){
  const rows=parseZbomCompareTsvRows(text),fid=extractZbomCompareFid(rows),gasMarker=rows.findIndex(row=>row.some(value=>normalizeZbomGasHeader(value).includes('gasboxconfiguration'))),gasStart=findZbomCompareGasHeaderRow(rows,gasMarker)>=0?gasMarker:-1;
  const options=parseZbomCompareOptions(rows,gasStart),gas=parseZbomCompareGas(rows,gasStart);
  if(!options.length)throw new Error('No option rows were found in '+path+'.');
  return {fid:fid,fidReadError:!fid,options:options,gas:gas,sourcePath:path};
}

async function readZbomCompareTsv(path){
  const data=await bridgeFileRequest('read',{path:path},120000);
  if(!data||!data.contentBase64)throw new Error('The Bridge returned no file content for '+path+'.');
  return parseZbomCompareTsv(decodeZbomCompareBase64(data.contentBase64),path);
}

function applyZbomCompareFidFallback(model,row){
  if(!model.fidReadError)return '';
  const providedFid=String(row.fid||'').trim();
  model.fid=providedFid||row.quote;
  model.fidWarning='FID could not be read from the exported TSV; using '+(providedFid?'provided FID '+providedFid:'Quotation '+row.quote+' as FID')+'.';
  return model.fidWarning;
}

function completedZbomCompareResult(result,outputPath){
  return {status:result&&result.warning?ZBOM_COMPARE_FID_ERROR:'Completed',outputPath:outputPath,completed:true};
}

function alignZbomCompareRecordSets(recordSets,keyOf,similar){
  if(!recordSets.length)return [];
  let slots=(recordSets[0]||[]).map(record=>({records:[record]}));
  for(let fileIndex=1;fileIndex<recordSets.length;fileIndex++){
    const incoming=recordSets[fileIndex]||[],rowCount=slots.length,columnCount=incoming.length,gap=-2,dp=Array.from({length:rowCount+1},()=>Array(columnCount+1).fill(0));
    for(let row=1;row<=rowCount;row++)dp[row][0]=dp[row-1][0]+gap;
    for(let column=1;column<=columnCount;column++)dp[0][column]=dp[0][column-1]+gap;
    const matchScore=(slot,record)=>{
      const existing=slot.records.filter(Boolean),key=keyOf(record);
      if(existing.some(item=>keyOf(item)===key))return 12;
      if(similar&&existing.some(item=>similar(item,record)))return 4;
      return -5;
    };
    for(let row=1;row<=rowCount;row++){
      for(let column=1;column<=columnCount;column++){
        const diagonal=dp[row-1][column-1]+matchScore(slots[row-1],incoming[column-1]),above=dp[row-1][column]+gap,left=dp[row][column-1]+gap;
        dp[row][column]=Math.max(diagonal,above,left);
      }
    }
    const actions=[];let row=rowCount,column=columnCount;
    while(row>0||column>0){
      const score=row>0&&column>0?matchScore(slots[row-1],incoming[column-1]):-Infinity,diagonal=row>0&&column>0?dp[row-1][column-1]+score:-Infinity,above=row>0?dp[row-1][column]+gap:-Infinity,left=column>0?dp[row][column-1]+gap:-Infinity;
      if(row>0&&column>0&&diagonal===dp[row][column]&&(score>0||(diagonal>above&&diagonal>left))){actions.push(['match',row-1,column-1]);row--;column--}
      else if(row>0&&above===dp[row][column]){actions.push(['missing',row-1,-1]);row--}
      else{actions.push(['insert',-1,column-1]);column--}
    }
    actions.reverse();
    slots=actions.map(action=>{
      if(action[0]==='insert')return {records:Array(fileIndex).fill(null).concat(incoming[action[2]])};
      const slot=slots[action[1]],records=slot.records.slice();while(records.length<fileIndex)records.push(null);
      records.push(action[0]==='match'?incoming[action[2]]:null);return {records:records};
    });
  }
  slots.forEach(slot=>{while(slot.records.length<recordSets.length)slot.records.push(null)});
  return slots;
}

function zbomCompareFileColor(index){
  if(index<ZBOM_COMPARE_FILE_COLORS.length)return ZBOM_COMPARE_FILE_COLORS[index];
  const hue=(index*137.508)%360,saturation=.48,lightness=.84,component=value=>{
    const amount=saturation*Math.min(lightness,1-lightness),part=(value+hue/30)%12,color=lightness-amount*Math.max(-1,Math.min(part-3,9-part,1));
    return Math.round(255*color).toString(16).padStart(2,'0');
  };
  return 'FF'+component(0)+component(8)+component(4);
}

function normalizedZbomCompareCell(value){return String(value===null||value===undefined?'':value).trim()}

function zbomCompareOptionKey(option){
  return [option.optionType,option.selection,option.comment].map(normalizedZbomCompareCell).join('\u0000');
}

function similarZbomCompareOption(left,right){
  const leftSelection=normalizedZbomCompareCell(left.selection),rightSelection=normalizedZbomCompareCell(right.selection);
  if(leftSelection&&leftSelection===rightSelection)return true;
  const leftType=normalizedZbomCompareCell(left.effectiveType),rightType=normalizedZbomCompareCell(right.effectiveType);
  return Boolean(leftType&&leftType===rightType);
}

function isZbomCompareSectionOption(option){
  const title=normalizedZbomCompareCell(option&&option.optionType),selection=normalizedZbomCompareCell(option&&option.selection);
  return Boolean(title&&!selection&&/[A-Z]/.test(title)&&title===title.toUpperCase());
}

function splitZbomCompareOptionSections(options){
  const sections=[];let section=null;
  (options||[]).forEach(option=>{
    if(isZbomCompareSectionOption(option)){
      const title=normalizedZbomCompareCell(option.optionType).replace(/\s+/g,' ').toUpperCase();
      section={key:'SECTION:'+title,records:[]};sections.push(section);
    }else if(!section){section={key:'PREAMBLE',records:[],preamble:true};sections.push(section)}
    section.records.push(option);
  });
  return sections;
}

function scoreZbomCompareSectionContent(left,right){
  const records=section=>section.records.slice(section.preamble?0:1).map(zbomCompareOptionKey),leftKeys=records(left),rightKeys=records(right),counts=new Map();
  leftKeys.forEach(key=>counts.set(key,(counts.get(key)||0)+1));let matches=0;
  rightKeys.forEach(key=>{const count=counts.get(key)||0;if(count){matches++;counts.set(key,count-1)}});
  return leftKeys.length+rightKeys.length?Math.round(200*matches/(leftKeys.length+rightKeys.length)):100;
}

function scoreZbomCompareSectionMatch(slot,section){
  const existing=slot.sections.filter(Boolean).filter(item=>item.key===section.key);
  if(!existing.length)return -1;
  return 1000+Math.max(...existing.map(item=>scoreZbomCompareSectionContent(item,section)));
}

function orderedZbomCompareSectionMatches(slots,incoming){
  const rowCount=slots.length,columnCount=incoming.length,dp=Array.from({length:rowCount+1},()=>Array(columnCount+1).fill(0));
  for(let row=1;row<=rowCount;row++)for(let column=1;column<=columnCount;column++){
    const score=scoreZbomCompareSectionMatch(slots[row-1],incoming[column-1]),diagonal=score>=0?dp[row-1][column-1]+score:-1;
    dp[row][column]=Math.max(diagonal,dp[row-1][column],dp[row][column-1]);
  }
  const matches=[];let row=rowCount,column=columnCount;
  while(row&&column){
    const score=scoreZbomCompareSectionMatch(slots[row-1],incoming[column-1]),diagonal=score>=0?dp[row-1][column-1]+score:-1;
    if(score>=0&&diagonal===dp[row][column]){matches.push([row-1,column-1]);row--;column--}
    else if(dp[row-1][column]>=dp[row][column-1])row--;
    else column--;
  }
  return matches.reverse();
}

function alignZbomCompareOptionSections(optionSets){
  if(!optionSets.length)return [];
  let slots=splitZbomCompareOptionSections(optionSets[0]).map(section=>({sections:[section]}));
  for(let fileIndex=1;fileIndex<optionSets.length;fileIndex++){
    const incoming=splitZbomCompareOptionSections(optionSets[fileIndex]),assignments=new Map(),usedSlots=new Set();
    slots.forEach(slot=>{while(slot.sections.length<=fileIndex)slot.sections.push(null)});
    // Preserve the original Section order wherever an ordered match is possible.
    orderedZbomCompareSectionMatches(slots,incoming).forEach(([slotIndex,incomingIndex])=>{
      slots[slotIndex].sections[fileIndex]=incoming[incomingIndex];assignments.set(incomingIndex,slots[slotIndex]);usedSlots.add(slotIndex);
    });

    // Only unmatched Sections with the same title may move to a different position.
    const moved=[];
    slots.forEach((slot,slotIndex)=>{
      if(usedSlots.has(slotIndex))return;
      incoming.forEach((section,incomingIndex)=>{
        if(assignments.has(incomingIndex)||section.preamble)return;
        const score=scoreZbomCompareSectionMatch(slot,section);
        if(score>=0)moved.push({slot:slot,slotIndex:slotIndex,incomingIndex:incomingIndex,score:score,distance:Math.abs(slotIndex-incomingIndex)});
      });
    });
    moved.sort((left,right)=>right.score-left.score||left.distance-right.distance);
    moved.forEach(match=>{
      if(usedSlots.has(match.slotIndex)||assignments.has(match.incomingIndex))return;
      match.slot.sections[fileIndex]=incoming[match.incomingIndex];assignments.set(match.incomingIndex,match.slot);usedSlots.add(match.slotIndex);
    });

    // Keep genuinely new Sections whole and place them beside their nearest ordered match.
    incoming.forEach((section,incomingIndex)=>{
      if(assignments.has(incomingIndex))return;
      const newSlot={sections:Array(fileIndex).fill(null).concat(section)};let anchor=null;
      for(let previous=incomingIndex-1;previous>=0&&!anchor;previous--)anchor=assignments.get(previous)||null;
      if(anchor)slots.splice(slots.indexOf(anchor)+1,0,newSlot);
      else{
        for(let next=incomingIndex+1;next<incoming.length&&!anchor;next++)anchor=assignments.get(next)||null;
        slots.splice(anchor?slots.indexOf(anchor):slots.length,0,newSlot);
      }
      assignments.set(incomingIndex,newSlot);
    });
  }
  return slots.flatMap(slot=>alignZbomCompareRecordSets(slot.sections.map(section=>section?section.records:[]),zbomCompareOptionKey,similarZbomCompareOption));
}

function applyZbomCompareDifference(cells,values,fileIndexes){
  const keys=values.map(item=>{const value=normalizedZbomCompareCell(item&&item.value);return value?'VALUE:'+value:'__BLANK__'});
  if(new Set(keys).size<=1)return;
  const representative=new Map();keys.forEach((key,index)=>{if(!representative.has(key))representative.set(key,fileIndexes[index])});
  cells.forEach((cell,index)=>{if(cell)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:zbomCompareFileColor(representative.get(keys[index]))}}});
}

function commonZbomGasHeaders(models){
  if(!models.length)return [];
  let common=new Set(models[0].gas.headers.map(header=>header.compareKey));
  models.slice(1).forEach(model=>{const available=new Set(model.gas.headers.map(header=>header.compareKey));common=new Set(Array.from(common).filter(key=>available.has(key)))});
  return Array.from(common);
}

function setZbomCompareHeaderStyle(cell){
  cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:ZBOM_COMPARE_HEADER_FILL}};
  cell.font={bold:true,color:{argb:'FFFFFFFF'}};
  cell.alignment={vertical:'middle',horizontal:'left',wrapText:true};
  setZbomCompareBorder(cell);
}

function setZbomCompareBorder(cell){
  const edge={style:'thin',color:{argb:ZBOM_COMPARE_BORDER_COLOR}};
  cell.border={top:edge,left:edge,bottom:edge,right:edge};
}

function setZbomCompareDataStyle(cell){
  cell.alignment={vertical:'top',horizontal:'left',wrapText:true};setZbomCompareBorder(cell);
}

function isZbomCompareSectionRow(worksheet,rowNumber,firstColumn){
  firstColumn=firstColumn||1;
  const title=normalizedZbomCompareCell(worksheet.getCell(rowNumber,firstColumn).value),selection=normalizedZbomCompareCell(worksheet.getCell(rowNumber,firstColumn+1).value);
  return Boolean(title&&!selection&&/[A-Z]/.test(title)&&title===title.toUpperCase());
}

function boldZbomCompareSectionRows(worksheet,lastRow,lastColumn,firstColumn){
  firstColumn=firstColumn||1;
  for(let rowNumber=1;rowNumber<=lastRow;rowNumber++){
    if(!isZbomCompareSectionRow(worksheet,rowNumber,firstColumn))continue;
    for(let column=firstColumn;column<=lastColumn;column++){
      const cell=worksheet.getCell(rowNumber,column);cell.font=Object.assign({},cell.font||{}, {bold:true});
    }
  }
}

function applyZbomCompareAllBorders(worksheet,firstRow,lastRow,firstColumn,lastColumn){
  for(let rowNumber=firstRow;rowNumber<=lastRow;rowNumber++)for(let column=firstColumn;column<=lastColumn;column++)setZbomCompareBorder(worksheet.getCell(rowNumber,column));
}

function safeZbomCompareSheetName(workbook,value){
  const original=String(value||'Sheet').replace(/[\[\]:*?/\\]/g,',').replace(/^'+|'+$/g,'').trim()||'Sheet';let name=original.slice(0,31),number=2;
  const exists=current=>workbook.worksheets.some(sheet=>sheet.name.toLowerCase()===current.toLowerCase());
  while(exists(name)){
    const suffix=' ('+number+++')';name=original.slice(0,31-suffix.length)+suffix;
  }
  return name;
}

function prepareZbomCompareWorksheet(worksheet){
  worksheet.views=[{state:'frozen',ySplit:2,showGridLines:false}];worksheet.properties.defaultRowHeight=16;
}

function zbomCompareExcelValue(value){return value===null||value===undefined||String(value)===''?null:value}

function addZbomCompareOptionSheet(workbook,model){
  const worksheet=workbook.addWorksheet(safeZbomCompareSheetName(workbook,model.fid));prepareZbomCompareWorksheet(worksheet);
  worksheet.getCell(1,1).value='FID No.';worksheet.getCell(1,2).value=model.fid;
  ['Option Type','Option Selection','Comment'].forEach((label,index)=>worksheet.getCell(2,index+1).value=label);
  for(let column=1;column<=3;column++){setZbomCompareHeaderStyle(worksheet.getCell(1,column));setZbomCompareHeaderStyle(worksheet.getCell(2,column))}
  model.options.forEach((option,index)=>{
    const values=[option.optionType,option.selection,option.comment];
    for(let column=1;column<=3;column++){const cell=worksheet.getCell(index+3,column);cell.value=zbomCompareExcelValue(values[column-1]);setZbomCompareDataStyle(cell)}
  });
  applyZbomCompareAllBorders(worksheet,1,model.options.length+2,1,3);boldZbomCompareSectionRows(worksheet,model.options.length+2,3);
  worksheet.getColumn(1).width=30;worksheet.getColumn(2).width=38;worksheet.getColumn(3).width=22;worksheet.autoFilter='A2:C2';
  return worksheet;
}

function addZbomCompareGasSheet(workbook,model){
  if(!model.gas)return null;
  const worksheet=workbook.addWorksheet(safeZbomCompareSheetName(workbook,model.fid+'_Gas'));prepareZbomCompareWorksheet(worksheet);
  const width=model.gas.headers.length;worksheet.getCell(1,1).value='FID No.';if(width>1)worksheet.getCell(1,2).value=model.fid;
  model.gas.headers.forEach((header,index)=>worksheet.getCell(2,index+1).value=header.label);
  for(let column=1;column<=width;column++){setZbomCompareHeaderStyle(worksheet.getCell(1,column));setZbomCompareHeaderStyle(worksheet.getCell(2,column))}
  model.gas.records.forEach((record,rowIndex)=>{
    model.gas.headers.forEach((header,columnIndex)=>{const cell=worksheet.getCell(rowIndex+3,columnIndex+1);cell.value=zbomCompareExcelValue(record.values[header.key]);setZbomCompareDataStyle(cell)});
  });
  applyZbomCompareAllBorders(worksheet,1,model.gas.records.length+2,1,width);
  model.gas.headers.forEach((header,index)=>{
    const values=model.gas.records.map(record=>String(record.values[header.key]||'').length),longest=Math.max(header.label.length,...values);
    worksheet.getColumn(index+1).width=Math.max(11,Math.min(35,longest+2));
  });
  return worksheet;
}

function addZbomCompareOptionComparison(workbook,models){
  const worksheet=workbook.addWorksheet(safeZbomCompareSheetName(workbook,'Compare'));prepareZbomCompareWorksheet(worksheet);
  const slots=alignZbomCompareOptionSections(models.map(model=>model.options));
  models.forEach((model,fileIndex)=>{
    const start=1+fileIndex*4;worksheet.getCell(1,start).value='FID No.';worksheet.getCell(1,start+1).value=model.fid;
    ['Option Type','Option Selection','Comment'].forEach((label,index)=>worksheet.getCell(2,start+index).value=label);
    for(let column=0;column<3;column++){setZbomCompareHeaderStyle(worksheet.getCell(1,start+column));setZbomCompareHeaderStyle(worksheet.getCell(2,start+column))}
    worksheet.getColumn(start).width=30;worksheet.getColumn(start+1).width=38;worksheet.getColumn(start+2).width=22;if(fileIndex<models.length-1)worksheet.getColumn(start+3).width=3;
  });
  slots.forEach((slot,rowIndex)=>{
    models.forEach((model,fileIndex)=>{
      const start=1+fileIndex*4,record=slot.records[fileIndex],values=record?[record.optionType,record.selection,record.comment]:[null,null,null];
      values.forEach((value,columnIndex)=>{const cell=worksheet.getCell(rowIndex+3,start+columnIndex);cell.value=zbomCompareExcelValue(value);setZbomCompareDataStyle(cell)});
    });
    const fields=['optionType','selection','comment'];
    fields.forEach((field,columnIndex)=>{
      const cells=[],values=[],fileIndexes=[];
      models.forEach((model,fileIndex)=>{
        const record=slot.records[fileIndex],start=1+fileIndex*4;cells.push(worksheet.getCell(rowIndex+3,start+columnIndex));values.push(record?{value:record[field],missing:false}:{value:'',missing:true});fileIndexes.push(fileIndex);
      });
      applyZbomCompareDifference(cells,values,fileIndexes);
    });
  });
  const lastRow=slots.length+2;models.forEach((model,fileIndex)=>{const start=1+fileIndex*4;applyZbomCompareAllBorders(worksheet,1,lastRow,start,start+2);boldZbomCompareSectionRows(worksheet,lastRow,start+2,start)});
  return worksheet;
}

function gasRecordValue(model,record,compareKey){
  const header=model.gas.headers.find(item=>item.compareKey===compareKey);return header?record.values[header.key]||'':'';
}

function addZbomCompareGasComparison(workbook,models){
  const gasModels=models.map((model,fileIndex)=>({model:model,fileIndex:fileIndex})).filter(item=>item.model.gas);
  if(!gasModels.length)return null;
  const worksheet=workbook.addWorksheet(safeZbomCompareSheetName(workbook,'Compare_Gas'));prepareZbomCompareWorksheet(worksheet);
  const blocks=[];let start=1;
  models.forEach((model,fileIndex)=>{
    const width=model.gas?Math.max(2,model.gas.headers.length):3;blocks.push({start:start,width:width,model:model,fileIndex:fileIndex});
    worksheet.getCell(1,start).value='FID No.';worksheet.getCell(1,start+1).value=model.fid;
    for(let column=0;column<width;column++)setZbomCompareHeaderStyle(worksheet.getCell(1,start+column));
    if(model.gas){
      model.gas.headers.forEach((header,index)=>{const cell=worksheet.getCell(2,start+index);cell.value=header.label;setZbomCompareHeaderStyle(cell);worksheet.getColumn(start+index).width=Math.max(11,Math.min(28,header.label.length+4))});
    }else{
      worksheet.getColumn(start).width=11;worksheet.getColumn(start+1).width=14;worksheet.getColumn(start+2).width=5;
      worksheet.mergeCells(2,start,2,start+width-1);const cell=worksheet.getCell(2,start);cell.value='No Gas';setZbomCompareHeaderStyle(cell);cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:zbomCompareFileColor(fileIndex)}};
    }
    start+=width+1;if(fileIndex<models.length-1)worksheet.getColumn(start-1).width=3;
  });
  const slots=alignZbomCompareRecordSets(gasModels.map(item=>item.model.gas.records),record=>record.key,(left,right)=>Boolean(left.module&&left.module===right.module));
  slots.forEach((slot,rowIndex)=>{
    gasModels.forEach((item,gasIndex)=>{
      const block=blocks[item.fileIndex],record=slot.records[gasIndex];
      item.model.gas.headers.forEach((header,columnIndex)=>{const cell=worksheet.getCell(rowIndex+3,block.start+columnIndex);cell.value=record?zbomCompareExcelValue(record.values[header.key]):null;setZbomCompareDataStyle(cell)});
    });
  });
  const commonHeaders=commonZbomGasHeaders(gasModels.map(item=>item.model));
  slots.forEach((slot,rowIndex)=>{
    commonHeaders.forEach(compareKey=>{
      const cells=[],values=[],fileIndexes=[];
      gasModels.forEach((item,gasIndex)=>{
        const headerIndex=item.model.gas.headers.findIndex(header=>header.compareKey===compareKey),block=blocks[item.fileIndex],record=slot.records[gasIndex];
        cells.push(worksheet.getCell(rowIndex+3,block.start+headerIndex));values.push(record?{value:gasRecordValue(item.model,record,compareKey),missing:false}:{value:'',missing:true});fileIndexes.push(item.fileIndex);
      });
      applyZbomCompareDifference(cells,values,fileIndexes);
    });
  });
  const lastRow=slots.length+2;gasModels.forEach(item=>{const block=blocks[item.fileIndex];applyZbomCompareAllBorders(worksheet,1,lastRow,block.start,block.start+item.model.gas.headers.length-1)});
  return worksheet;
}

function snapshotZbomCompareWorksheet(worksheet){
  if(!worksheet)return null;
  const rows=[];
  for(let rowNumber=1;rowNumber<=worksheet.rowCount;rowNumber++){
    const row=[];
    for(let column=1;column<=worksheet.columnCount;column++){
      const cell=worksheet.getCell(rowNumber,column),fill=cell.fill&&cell.fill.fgColor&&cell.fill.fgColor.argb,fontColor=cell.font&&cell.font.color&&cell.font.color.argb;
      row.push({text:cell.text==null?'':String(cell.text),fill:fill||'',fontColor:fontColor||'',bold:Boolean(cell.font&&cell.font.bold)});
    }
    rows.push(row);
  }
  return {rows:rows,widths:Array.from({length:worksheet.columnCount},(_,index)=>Number(worksheet.getColumn(index+1).width)||12)};
}

function buildZbomCompareWorkbook(models,grouped){
  if(typeof ExcelJS==='undefined'||!ExcelJS.Workbook)throw new Error('Excel workbook library is unavailable. Refresh the page and try again.');
  const workbook=new ExcelJS.Workbook();workbook.creator='NSR Control Tower';workbook.company='Lam Research';workbook.created=new Date();
  const compareSheet=grouped&&models.length>1?addZbomCompareOptionComparison(workbook,models):null,compareGasSheet=grouped&&models.length>1?addZbomCompareGasComparison(workbook,models):null,modelSheets=[];
  models.forEach(model=>modelSheets.push({fid:model.fid,quote:model.quote,options:addZbomCompareOptionSheet(workbook,model),gas:addZbomCompareGasSheet(workbook,model)}));
  return {workbook:workbook,preview:{compare:snapshotZbomCompareWorksheet(compareSheet),compareGas:snapshotZbomCompareWorksheet(compareGasSheet),models:modelSheets.map(item=>({fid:item.fid,quote:item.quote,options:snapshotZbomCompareWorksheet(item.options),gas:snapshotZbomCompareWorksheet(item.gas)}))}};
}

function zbomCompareBufferBase64(buffer){
  const bytes=buffer instanceof ArrayBuffer?new Uint8Array(buffer):new Uint8Array(buffer.buffer,buffer.byteOffset||0,buffer.byteLength),chunkSize=0x8000;let binary='';
  for(let offset=0;offset<bytes.length;offset+=chunkSize)binary+=String.fromCharCode.apply(null,bytes.subarray(offset,Math.min(offset+chunkSize,bytes.length)));
  return btoa(binary);
}

async function writeZbomCompareWorkbook(models,grouped,path){
  const built=buildZbomCompareWorkbook(models,grouped),buffer=await built.workbook.xlsx.writeBuffer();
  await bridgeFileRequest('write',{path:path,contentBase64:zbomCompareBufferBase64(buffer),overwrite:true,createParents:true},120000);
  return {path:path,preview:built.preview};
}

function renderZbomCompareResultSummary(exported,outputs,failed,mock){
  const container=bridgeId('zbomCompareResultSummary');if(!container)return;
  container.replaceChildren();
  const items=[];
  if(mock)items.push(['MOCK: no real TSV or XLSX written','warn']);
  items.push(['TSV exported: '+exported,exported?'ok':'warn'],['XLSX created: '+outputs,outputs?'ok':mock?'warn':''],['Failed: '+failed,failed?'warn':'ok']);
  items.forEach(item=>{
    const pill=document.createElement('span');pill.className='result-pill'+(item[1]?' '+item[1]:'');pill.textContent=item[0];container.appendChild(pill);
  });
}

async function startZbomCompare(){
  const rows=zbomCompareRows.slice(),folderInput=bridgeId('zbomCompareOutputFolder');let folder,tempFolder;
  try{folder=normalizedZbomCompareFolder();tempFolder=zbomCompareTempFolder(folder)}catch(error){setZbomCompareProgress(0,bridgeError(error));if(folderInput)folderInput.focus();return}
  if(!rows.length){setZbomCompareProgress(0,'Paste at least one valid Quotation first.');return}
  if(!selectedBridgeSession()){setZbomCompareProgress(0,'Select an available SAP GUI session first.');return}
  if(rows.length>100&&!unsafeWindow.confirm('You are about to export '+rows.length+' quotations through SAP. Continue?'))return;
  if(folderInput){folderInput.value=folder;saveZbomCompareFolder()}
  recordZbomCompareHistory(bridgeId('zbomCompareInput').value);invalidateZbomCompareResults();zbomCompareLogLines=[];bridgeId('sapResult').textContent='ZBOM Compare log\n';setZbomCompareRunning(true);renderZbomComparePreview();setZbomCompareProgress(2,'Preparing the temp folder…');
  const formatted=new Map(),updateResult=(row,patch)=>{
    zbomCompareResults.set(row.quote,Object.assign({},zbomCompareResults.get(row.quote)||{},patch));renderZbomComparePreview();
  };
  const groupPreviews=[],fidPreviews=new Map();let exported=0,outputs=0,tempReady=false;
  try{
    await bridgeFileRequest('createDirectory',{path:tempFolder},30000);tempReady=true;
    for(let index=0;index<rows.length;index++){
      const row=rows[index],percent=5+(index/rows.length)*52;setZbomCompareProgress(percent,'Exporting '+row.quote+' ('+(index+1)+'/'+rows.length+')…');
      updateResult(row,{status:'Exporting',error:''});
      try{
        addZbomCompareLog(row.quote+' — export started.');const result=await exportOneZbomCompareQuotation(row,tempFolder);updateResult(row,{status:'Exported',path:result.path,simulated:result.simulated});exported++;addZbomCompareLog(row.quote+' — TSV exported.');
      }catch(error){
        const message=bridgeError(error);updateResult(row,{status:'Failed',error:message});addZbomCompareLog(row.quote+' — FAILED: '+message);
      }
    }
    if(bridgeMock){
      zbomCompareHasRun=true;renderZbomCompareResultSummary(exported,0,rows.length-exported,true);setZbomCompareProgress(100,'Mock export completed. No files were formatted.');setBridgeBadge('Mock ready','warn');return;
    }
    const exportedRows=rows.filter(row=>zbomCompareResults.get(row.quote)&&zbomCompareResults.get(row.quote).status==='Exported');
    for(let index=0;index<exportedRows.length;index++){
      const row=exportedRows[index],result=zbomCompareResults.get(row.quote);setZbomCompareProgress(58+(index/Math.max(1,exportedRows.length))*16,'Formatting '+row.quote+' ('+(index+1)+'/'+exportedRows.length+')…');updateResult(row,{status:'Formatting'});
      try{
        const model=await readZbomCompareTsv(result.path),providedFid=row.fid;model.quote=row.quote;
        const fidWarning=applyZbomCompareFidFallback(model,row);
        if(fidWarning)addZbomCompareLog(row.quote+' — FID READ ERROR: '+fidWarning);
        else if(providedFid&&providedFid!==model.fid)addZbomCompareLog(row.quote+' — FID updated from '+providedFid+' to '+model.fid+'.');
        formatted.set(row.quote,model);row.fid=model.fid;updateResult(row,{status:fidWarning?ZBOM_COMPARE_FID_ERROR:'Formatted',fid:model.fid,warning:fidWarning});addZbomCompareLog(row.quote+' — formatted as '+model.fid+(model.gas?' with Gas.':' without Gas.'));
      }catch(error){
        const message=bridgeError(error);updateResult(row,{status:'Failed',error:message});addZbomCompareLog(row.quote+' — FORMAT FAILED: '+message);
      }
    }
    renderZbomComparePreview();
    const standaloneRows=rows.filter(row=>row.group===ZBOM_COMPARE_STANDALONE),groups=new Map();
    rows.filter(row=>row.group!==ZBOM_COMPARE_STANDALONE).forEach(row=>{if(!groups.has(row.group))groups.set(row.group,[]);groups.get(row.group).push(row)});
    const outputJobs=Math.max(1,standaloneRows.length+groups.size);let completedJobs=0;
    for(const row of standaloneRows){
      const model=formatted.get(row.quote);if(!model)continue;
      const fileName=finishZbomCompareFileName(renderZbomCompareFileName(row)),outputPath=folder+'\\'+fileName;
      setZbomCompareProgress(75+(completedJobs/outputJobs)*23,'Saving '+fileName+'…');updateResult(row,{status:'Saving'});
      try{
        const saved=await writeZbomCompareWorkbook([model],false,outputPath),modelPreview=saved.preview.models[0];outputs++;if(modelPreview&&!fidPreviews.has(model.fid))fidPreviews.set(model.fid,{fid:model.fid,sheet:modelPreview.options,order:rows.findIndex(item=>item.quote===row.quote)});updateResult(row,completedZbomCompareResult(zbomCompareResults.get(row.quote),outputPath));addZbomCompareLog(row.quote+' — workbook saved: '+outputPath);
      }catch(error){
        const message=bridgeError(error);updateResult(row,{status:'Failed',error:message});addZbomCompareLog(row.quote+' — XLSX FAILED: '+message);
      }
      completedJobs++;
    }
    for(const [group,groupRows] of groups){
      const missing=groupRows.filter(row=>!formatted.has(row.quote));
      if(missing.length){
        const message=group+' was not created because '+missing.map(row=>row.quote).join(', ')+' failed before comparison.';
        groupRows.filter(row=>formatted.has(row.quote)).forEach(row=>updateResult(row,{status:'Group incomplete',error:message}));addZbomCompareLog(message);completedJobs++;continue;
      }
      const models=groupRows.map(row=>formatted.get(row.quote)),fileName=renderZbomCompareGroupFileName(groupRows),outputPath=folder+'\\'+fileName;
      const comparing=groupRows.length>1;
      setZbomCompareProgress(75+(completedJobs/outputJobs)*23,(comparing?'Comparing '+group+' and saving ':'Saving ')+fileName+'…');groupRows.forEach(row=>updateResult(row,{status:comparing?'Comparing':'Saving'}));
      try{
        const saved=await writeZbomCompareWorkbook(models,comparing,outputPath);outputs++;if(saved.preview.models)models.forEach(model=>{const modelPreview=saved.preview.models.find(item=>item.quote===model.quote)||saved.preview.models.find(item=>item.fid===model.fid);if(modelPreview&&!fidPreviews.has(model.fid))fidPreviews.set(model.fid,{fid:model.fid,sheet:modelPreview.options,order:rows.findIndex(item=>item.quote===model.quote)})});groupPreviews.push({group:group,options:comparing?saved.preview.compare:saved.preview.models[0]?.options,gas:comparing?saved.preview.compareGas:saved.preview.models[0]?.gas});groupRows.forEach(row=>updateResult(row,completedZbomCompareResult(zbomCompareResults.get(row.quote),outputPath)));addZbomCompareLog(group+' — workbook saved: '+outputPath);
      }catch(error){
        const message=bridgeError(error);groupRows.forEach(row=>updateResult(row,{status:'Failed',error:message}));addZbomCompareLog(group+' — XLSX FAILED: '+message);
      }
      completedJobs++;
    }
    const failed=rows.filter(row=>{const result=zbomCompareResults.get(row.quote);return !result||!result.completed}).length;
    zbomCompareHasRun=true;renderZbomCompareResultSummary(exported,outputs,failed,false);showZbomCompareResultPreview(groupPreviews,fidPreviews);setZbomCompareProgress(100,failed?'Completed with '+failed+' failed or incomplete quotation(s).':'Compare completed.');setBridgeBadge(failed?'Completed with errors':'Ready',failed?'warn':'ok');
  }catch(error){
    const failed=rows.filter(row=>{const result=zbomCompareResults.get(row.quote);return !result||!result.completed}).length;
    zbomCompareHasRun=true;renderZbomCompareResultSummary(exported,outputs,failed,false);showZbomCompareResultPreview(groupPreviews,fidPreviews);setZbomCompareProgress(100,'Compare stopped: '+bridgeError(error));setBridgeBadge('Action failed','error');
  }finally{
    if(tempReady){const cleanupError=await cleanupZbomCompareTemp(tempFolder);if(cleanupError)setZbomCompareProgress(100,'Compare finished, but the temp folder could not be deleted: '+cleanupError)}
    setZbomCompareRunning(false);
  }
}

function bestZbomColumn(rows,used,score,minScore){
  const width=Math.max(0,...rows.map(row=>row.length));let best=-1,bestScore=minScore;
  for(let column=0;column<width;column++){
    if(used.has(column))continue;
    const values=rows.map(row=>String(row[column]||'').trim()).filter(Boolean);
    if(!values.length)continue;
    const current=score(values);
    if(current>bestScore){best=column;bestScore=current}
  }
  if(best>=0)used.add(best);
  return best;
}

function inferZbomColumns(rows){
  const used=new Set(),mapping={fid:-1,systemDescription:-1,quote:-1};
  mapping.quote=bestZbomColumn(rows,used,values=>values.reduce((total,value)=>total+(/^\d{8}$/.test(value)?4+(value[0]==='2'?1:0):0),0)/values.length,1.5);
  mapping.fid=bestZbomColumn(rows,used,values=>values.reduce((total,value)=>total+(isZbomFid(value)?4:0),0)/values.length,1.5);
  mapping.systemDescription=bestZbomColumn(rows,used,values=>values.reduce((total,value)=>total+(/[A-Za-z]/.test(value)?2+(/[\/_]/.test(value)?2:0):0),0)/values.length,.8);
  return mapping;
}

function isZbomFid(value){
  return /^\d{6}(?:-[A-Za-z0-9-]+)?$/.test(String(value||'').trim());
}

function pickZbomValue(values,index){
  return index>=0&&index<values.length?String(values[index]||'').trim():'';
}

function inferZbomRow(values,mapping){
  const used=new Set();
  let quote=pickZbomValue(values,mapping.quote);if(mapping.quote>=0&&quote)used.add(mapping.quote);
  if(!/^\d{8}$/.test(quote)){
    const candidates=values.map((value,index)=>({value:String(value||'').trim(),index:index})).filter(item=>/^\d{8}$/.test(item.value));
    if(candidates.length===1){quote=candidates[0].value;used.add(candidates[0].index)}
  }
  let fid=pickZbomValue(values,mapping.fid);if(mapping.fid>=0&&fid)used.add(mapping.fid);
  if(!fid){
    const candidate=values.map((value,index)=>({value:String(value||'').trim(),index:index})).find(item=>!used.has(item.index)&&isZbomFid(item.value));
    if(candidate){fid=candidate.value;used.add(candidate.index)}
  }
  let systemDescription=pickZbomValue(values,mapping.systemDescription);if(mapping.systemDescription>=0&&systemDescription)used.add(mapping.systemDescription);
  if(!systemDescription){
    const candidate=values.map((value,index)=>({value:String(value||'').trim(),index:index})).find(item=>!used.has(item.index)&&/[A-Za-z]/.test(item.value));
    if(candidate){systemDescription=candidate.value;used.add(candidate.index)}
  }
  return {fid:fid,systemDescription:systemDescription,quote:quote};
}

function parseZbomInput(text){
  const source=String(text||'').replace(/\r/g,'').split('\n').map((line,index)=>({line:index+1,values:splitZbomLine(line)})).filter(item=>item.values.some(Boolean));
  if(!source.length)return {rows:[],errors:['No data was pasted.'],duplicates:0,detection:'No columns detected.'};
  const firstRoles=source[0].values.map(zbomHeaderRole),hasHeader=firstRoles.includes('quote')&&firstRoles.some(Boolean);
  let mapping={fid:-1,systemDescription:-1,quote:-1};
  if(hasHeader)firstRoles.forEach((role,index)=>{if(role&&mapping[role]<0)mapping[role]=index});
  const data=hasHeader?source.slice(1):source;
  if(!hasHeader)mapping=inferZbomColumns(data.map(item=>item.values));
  const rows=[],errors=[],seen=new Map();let duplicates=0;
  data.forEach(item=>{
    const row=Object.assign(inferZbomRow(item.values,mapping),{line:item.line,_error:'',_status:'Ready'});
    if(!row.quote)row._error='Quote was not detected.';
    else if(!/^\d{8}$/.test(row.quote))row._error='Quote must contain exactly 8 digits.';
    if(row._error){row._status=row._error;errors.push('Row '+item.line+': '+row._error);rows.push(row);return}
    const previous=seen.get(row.quote);
    if(previous){
      const conflicts=[];
      [['fid','FID'],['systemDescription','System Description']].forEach(pair=>{
        const field=pair[0],label=pair[1];
        if(!previous[field]&&row[field])previous[field]=row[field];
        else if(previous[field]&&row[field]&&previous[field]!==row[field])conflicts.push(label);
      });
      if(conflicts.length){
        row._error='Duplicate Quote has conflicting '+conflicts.join(', ')+'.';row._status=row._error;
        errors.push('Row '+item.line+': '+row._error);rows.push(row);
      }else duplicates++;
      return;
    }
    seen.set(row.quote,row);rows.push(row);
  });
  const validCount=rows.filter(row=>!row._error).length;
  if(validCount>500)errors.push('A maximum of 500 unique quotations can be exported at once.');
  const labels={fid:'FID',systemDescription:'System Description',quote:'Quote'};
  const detected=Object.keys(mapping).filter(role=>mapping[role]>=0).map(role=>labels[role]+' = column '+(mapping[role]+1));
  const detection=(hasHeader?'Header mapping: ':'Inferred mapping: ')+(detected.length?detected.join(' · '):'Quote will be detected row by row.');
  return {rows:rows,errors:errors,duplicates:duplicates,detection:detection};
}

function todayZbomStamp(){
  const date=new Date(),part=value=>String(value).padStart(2,'0');
  return String(date.getFullYear())+part(date.getMonth()+1)+part(date.getDate());
}

function zbomTemplateInfo(){
  const input=bridgeId('zbomTemplate'),template=String(input.value||'').trim()||ZBOM_DEFAULT_TEMPLATE;
  if(template.length>240)return {template:template,error:'The file-name template is longer than 240 characters.'};
  const allowed=new Set(ZBOM_TOKENS.map(token=>token.toLowerCase())),matches=template.match(/\{[^{}]+\}/g)||[];
  const unknown=matches.find(token=>!allowed.has(token.toLowerCase()));
  if(unknown)return {template:template,error:'Unsupported token '+unknown+'.'};
  const remainder=template.replace(/\{[^{}]+\}/g,'');
  if(remainder.indexOf('{')>=0||remainder.indexOf('}')>=0)return {template:template,error:'The file-name template contains an incomplete token.'};
  return {template:template,error:''};
}

function renderZbomFileName(row,template){
  const values={
    '{fid}':row.fid||'',
    '{system description}':row.systemDescription||'',
    '{quote}':row.quote||'',
    '{today}':todayZbomStamp()
  };
  let stem=String(template||ZBOM_DEFAULT_TEMPLATE).replace(/\{[^{}]+\}/g,token=>values[token.toLowerCase()]||'');
  stem=stem.replace(/[<>:"/\\|?*\u0000-\u001F]/g,'-').replace(/_{2,}/g,'_').replace(/-{2,}/g,'-').replace(/\s{2,}/g,' ').replace(/^[\s._-]+|[\s._-]+$/g,'');
  if(!stem)stem=row.quote||'ZBOM_PDF';
  if(stem.length>190)stem=stem.slice(0,190).replace(/[\s._-]+$/g,'');
  return stem+'.PDF';
}

function appendQuoteToName(name,quote){
  const dot=name.toLowerCase().lastIndexOf('.pdf'),stem=dot>=0?name.slice(0,dot):name;
  return stem+'_'+quote+'.PDF';
}

function previewZbomRow(row){
  return Object.assign({},row,{fid:row.fid||'[SAP FID]'});
}

function plannedZbomNames(rows,template){
  const owners=new Map(),names=new Map();
  rows.filter(row=>!row._error).forEach(row=>{
    let name=renderZbomFileName(row,template),key=name.toLowerCase(),owner=owners.get(key);
    if(owner&&owner!==row.quote){name=appendQuoteToName(name,row.quote);key=name.toLowerCase()}
    owners.set(key,row.quote);names.set(row.quote,name);
  });
  return names;
}

function renderZbomPreview(){
  const body=bridgeId('zbomPreviewBody');body.replaceChildren();
  const templateInfo=zbomTemplateInfo(),planned=plannedZbomNames(zbomRows.map(previewZbomRow),templateInfo.template);
  if(!zbomRows.length){
    const row=document.createElement('tr'),cell=document.createElement('td');cell.colSpan=5;cell.className='missing';cell.textContent='No preview yet.';row.appendChild(cell);body.appendChild(row);
  }else{
    zbomRows.forEach(row=>{
      const tr=document.createElement('tr'),result=zbomResults.get(row.quote);
      const actual=result&&result.files.size?Array.from(result.files).join('; '):planned.get(row.quote)||'';
      const values=[row.fid||'From SAP',row.systemDescription,row.quote,actual];
      values.forEach((value,index)=>{
        const cell=document.createElement('td');cell.textContent=value||'—';if(!value)cell.className='missing';if(index===3)cell.classList.add('planned-name');tr.appendChild(cell);
      });
      const status=document.createElement('td');
      status.textContent=row._error||templateInfo.error||(result?result.status:'Ready');
      status.className=row._error||templateInfo.error||(result&&result.status==='No PDF generated')?'row-error':'row-ok';
      tr.appendChild(status);body.appendChild(tr);
    });
  }
  const valid=zbomRows.filter(row=>!row._error).length;
  bridgeId('zbomCount').textContent=valid+' valid row'+(valid===1?'':'s')+(zbomRows.length!==valid?' · '+(zbomRows.length-valid)+' invalid':'');
  updateZbomStart();
}

function previewZbomInput(){
  const parsed=parseZbomInput(bridgeId('zbomInput').value);
  zbomRows=parsed.rows;zbomErrors=parsed.errors;zbomHasRun=false;zbomResults=new Map();
  bridgeId('zbomResultSummary').replaceChildren();renderZbomPreview();
}

function insertZbomToken(token){
  const input=bridgeId('zbomTemplate'),start=input.selectionStart==null?input.value.length:input.selectionStart,end=input.selectionEnd==null?start:input.selectionEnd;
  input.value=input.value.slice(0,start)+token+input.value.slice(end);input.focus();input.setSelectionRange(start+token.length,start+token.length);
  saveZbomTemplate();zbomHasRun=false;zbomResults=new Map();bridgeId('zbomResultSummary').replaceChildren();renderZbomPreview();
}

function updateZbomStart(){
  const button=bridgeId('zbomStart');if(!button)return;
  const valid=zbomRows.filter(row=>!row._error).length,templateError=zbomTemplateInfo().error;
  button.disabled=zbomRunning||zbomCompareRunning||bridgeBusy||!selectedBridgeSession()||!valid||Boolean(zbomErrors.length)||Boolean(templateError);
  const openButton=bridgeId('zbomOpenFolder');if(openButton)openButton.disabled=zbomRunning||zbomCompareRunning||bridgeBusy||!zbomHasRun;
}

function bridgeFileRequest(operation,options,timeout){
  return bridgeRequest('POST','/files',Object.assign({operation:operation},options||{}),timeout||120000);
}

async function openZbomFolder(){
  setBridgeBusy(true);
  try{
    await bridgeFileRequest('openDirectory',{path:ZBOM_PDF_FOLDER},30000);addZbomLog('Opened '+ZBOM_PDF_FOLDER+' in Windows Explorer.');
  }catch(error){
    addZbomLog('Could not open '+ZBOM_PDF_FOLDER+': '+bridgeError(error));setBridgeBadge('Action failed','error');
  }finally{setBridgeBusy(false)}
}

async function listZbomRawPdfs(){
  const data=await bridgeFileRequest('list',{path:ZBOM_PDF_FOLDER,pattern:'00*.pdf',recursive:false,maxEntries:5000},30000),files=new Map();
  (Array.isArray(data.entries)?data.entries:[]).forEach(entry=>{
    const name=String(entry.name||'');
    if(entry.kind!=='file'||!/^00.*\.pdf$/i.test(name)||zbomOutputClaims.has(name.toLowerCase()))return;
    files.set(name,{name:name,path:String(entry.path||''),size:Number(entry.size)||0,lastModified:Number(entry.lastModified)||0});
  });
  return files;
}

function changedZbomFiles(before,current){
  const changed=[];
  current.forEach((file,name)=>{
    const old=before.get(name);
    if(!old||old.size!==file.size||old.lastModified!==file.lastModified)changed.push(file);
  });
  return changed;
}

function waitMs(milliseconds){return new Promise(resolve=>setTimeout(resolve,milliseconds))}

async function waitForZbomFiles(before){
  const started=Date.now();let lastSignature='',stableSince=0,latest=[];
  while(Date.now()-started<60000){
    const current=await listZbomRawPdfs();latest=changedZbomFiles(before,current);
    if(!latest.length){
      if(Date.now()-started>=5000)return [];
      await waitMs(400);continue;
    }
    const signature=latest.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(file=>file.name+':'+file.size+':'+file.lastModified).join('|');
    if(signature===lastSignature){
      if(!stableSince)stableSince=Date.now();
      if(Date.now()-stableSince>=2000)return latest;
    }else{lastSignature=signature;stableSince=0}
    await waitMs(400);
  }
  return latest;
}

function addZbomLog(message){
  zbomLogLines.push('['+new Date().toLocaleTimeString([], {hour12:false})+'] '+message);
  if(zbomLogLines.length>120)zbomLogLines.shift();
  const result=bridgeId('sapResult');
  result.textContent='ZBOM PDF log\n'+zbomLogLines.join('\n');result.scrollTop=result.scrollHeight;
}

function setZbomProgress(percent,message){
  const value=Math.max(0,Math.min(100,Number(percent)||0));
  bridgeId('zbomProgressBar').style.width=value+'%';bridgeId('zbomProgressNumber').textContent=Math.round(value)+'%';
}

async function sendZbomAction(operation,options){
  const payload=Object.assign(requireBridgeSession(),{operation:operation},options||{});
  let lastError;
  for(let attempt=0;attempt<100;attempt++){
    try{return await bridgeRequest('POST','/action',payload,120000)}catch(error){
      lastError=error;
      if(!error||error.status!==409||!/SAP is busy/i.test(bridgeError(error)))throw error;
      await waitMs(150);
    }
  }
  throw lastError||new Error('SAP remained busy for 15 seconds.');
}

function sapStatusSummary(data){
  return data&&data.statusText?' SAP '+(data.statusType||'status')+': '+data.statusText:'';
}

async function readClipboardBestEffort(){
  try{
    const clipboard=unsafeWindow.navigator&&unsafeWindow.navigator.clipboard;
    return clipboard&&typeof clipboard.readText==='function'?await Promise.race([clipboard.readText(),waitMs(1000).then(()=>null)]):null;
  }catch(_){return null}
}

function writeQuotationClipboard(text){
  if(typeof GM_setClipboard!=='function')throw new Error('Tampermonkey clipboard permission is unavailable. Reinstall or update this userscript.');
  GM_setClipboard(text,'text');
}

function matchZbomRow(rawName){
  const base=rawName.replace(/\.pdf$/i,''),metadata=rawZbomMetadata(rawName);
  if(metadata.quote){const exact=zbomRows.find(row=>!row._error&&row.quote===metadata.quote);if(exact)return exact}
  const matches=zbomRows.filter(row=>!row._error&&base.indexOf(row.quote)>=0);
  return matches.length===1?matches[0]:null;
}

function rawZbomMetadata(rawName){
  const base=String(rawName||'').replace(/\.pdf$/i,''),parts=base.split('_'),quoteMatch=String(parts[0]||'').match(/^00(\d{8})$/),timestamp=parts.find(part=>/^\d{14}$/.test(part))||'',fid=parts.length>3?parts.slice(3).join('_').trim():'';
  return {quote:quoteMatch?quoteMatch[1]:'',timestamp:timestamp,fid:fid};
}

function safeUnmatchedName(name){
  let result=String(name||'Unmatched.pdf').replace(/[<>:"/\\|?*\u0000-\u001F]/g,'-').replace(/-{2,}/g,'-').replace(/^[\s._-]+|[\s._-]+$/g,'');
  if(!/\.pdf$/i.test(result))result+='.PDF';
  return result||'Unmatched.PDF';
}

function claimZbomOutputName(baseName,quote){
  let name=baseName,key=name.toLowerCase(),owner=zbomOutputClaims.get(key);
  if(owner&&owner!==quote){name=appendQuoteToName(name,quote);key=name.toLowerCase();let suffix=2;
    while(zbomOutputClaims.has(key)&&zbomOutputClaims.get(key)!==quote){name=appendQuoteToName(baseName,quote+'_'+suffix++);key=name.toLowerCase()}
  }
  zbomOutputClaims.set(key,quote);return name;
}

function zbomFilePath(name){return ZBOM_PDF_FOLDER+'\\'+name}

async function moveZbomFile(descriptor,name){
  return bridgeFileRequest('move',{sourcePath:descriptor.path||zbomFilePath(descriptor.name),destinationPath:zbomFilePath(name),overwrite:true},120000);
}

async function collectZbomFiles(files,version){
  if(!files.length){addZbomLog('Version '+version+' created no new PDF. This is normal when that print path does not apply.');return 0}
  let moved=0;
  for(const descriptor of files){
    const row=matchZbomRow(descriptor.name),metadata=rawZbomMetadata(descriptor.name);
    if(!row){
      const name='UNMATCHED_'+safeUnmatchedName(descriptor.name);
      await moveZbomFile(descriptor,name);
      addZbomLog('Could not match '+descriptor.name+' to exactly one input Quote; renamed to '+name+'.');moved++;continue;
    }
    const actual={fid:metadata.fid||row.fid,systemDescription:row.systemDescription,quote:metadata.quote||row.quote};
    const template=zbomTemplateInfo().template,baseName=renderZbomFileName(actual,template),outputName=claimZbomOutputName(baseName,actual.quote);
    await moveZbomFile(descriptor,outputName);
    let result=zbomResults.get(row.quote);
    if(!result){result={files:new Set(),notes:[],status:'Exported'};zbomResults.set(row.quote,result)}
    result.files.add(outputName);result.status='Exported';
    if(row.fid&&metadata.fid&&row.fid!==metadata.fid){
      const note='Input FID '+row.fid+' differs from SAP filename FID '+metadata.fid+'; SAP FID was used.';
      if(!result.notes.includes(note))result.notes.push(note);addZbomLog(row.quote+': '+note);
    }
    addZbomLog('Version '+version+': '+descriptor.name+' → '+outputName);moved++;
  }
  return moved;
}

async function runZbomVersion(version,quotationText,previousClipboard,startProgress,collectProgress){
  const before=bridgeMock?new Map():await listZbomRawPdfs();let actionError=null,clipboardWritten=false;
  setZbomProgress(startProgress,'Running SAP Version '+version+'…');addZbomLog('Starting Version '+version+' for '+zbomRows.filter(row=>!row._error).length+' quotation(s).');
  try{
    let data=await sendZbomAction('transaction',{code:'ZMASSPRINT'});addZbomLog('Version '+version+': opened ZMASSPRINT.'+sapStatusSummary(data));
    await sendZbomAction('setText',{controlId:'wnd[0]/usr/ctxtRG_KSCHL-LOW',value:'ZBOM'});
    await sendZbomAction('setText',{controlId:'wnd[0]/usr/ctxtP_FILE',value:ZBOM_PDF_FOLDER});
    await sendZbomAction('press',{controlId:'wnd[0]/usr/btn%_RG_VBELN_%_APP_%-VALU_PUSH'});
    writeQuotationClipboard(quotationText);clipboardWritten=true;
    await sendZbomAction('press',{controlId:'wnd[1]/tbar[0]/btn[24]'});
    await sendZbomAction('press',{controlId:'wnd[1]/tbar[0]/btn[8]'});
    await sendZbomAction('setText',{controlId:'wnd[0]/usr/ctxtPM_VERMO',value:String(version)});
    data=await sendZbomAction('press',{controlId:'wnd[0]/tbar[1]/btn[8]'});addZbomLog('Version '+version+': execute completed.'+sapStatusSummary(data));
    for(const controlId of ['wnd[0]/tbar[1]/btn[5]','wnd[0]/tbar[1]/btn[14]']){
      try{data=await sendZbomAction('press',{controlId:controlId});addZbomLog('Version '+version+': pressed '+controlId+'.'+sapStatusSummary(data))}
      catch(error){addZbomLog('Version '+version+': optional '+controlId+' was unavailable: '+bridgeError(error))}
    }
  }catch(error){
    actionError=error;addZbomLog('Version '+version+' did not complete all SAP steps: '+bridgeError(error));
  }finally{
    if(clipboardWritten&&previousClipboard!==null)try{writeQuotationClipboard(previousClipboard)}catch(_){/* ignore */}
  }
  if(bridgeMock){addZbomLog('Version '+version+': mock mode creates no PDF files.');return {count:0,error:actionError}}
  setZbomProgress(collectProgress,'Checking files created by Version '+version+'…');
  const changed=await waitForZbomFiles(before),count=await collectZbomFiles(changed,version);
  return {count:count,error:actionError};
}

function renderZbomResultSummary(){
  const container=bridgeId('zbomResultSummary');container.replaceChildren();
  const valid=zbomRows.filter(row=>!row._error),success=valid.filter(row=>{const result=zbomResults.get(row.quote);return result&&result.files.size}).length,missing=valid.length-success;
  [['Exported: '+success,'ok'],['No PDF: '+missing,missing?'warn':'ok'],['Output: '+ZBOM_PDF_FOLDER,'']].forEach(item=>{
    const pill=document.createElement('span');pill.className='result-pill'+(item[1]?' '+item[1]:'');pill.textContent=item[0];container.appendChild(pill);
  });
  renderZbomPreview();return {success:success,missing:missing};
}

function setZbomRunning(value){
  zbomRunning=Boolean(value);
  ['zbomInput','zbomTemplate','zbomOpenHistory','zbomResetInput','zbomResetTemplate'].forEach(id=>{const element=bridgeId(id);if(element)element.disabled=zbomRunning});
  document.querySelectorAll('[data-zbom-token]').forEach(button=>button.disabled=zbomRunning);
  setBridgeBusy(bridgeBusy);
}

async function startZbomExport(){
  const validRows=zbomRows.filter(row=>!row._error),templateInfo=zbomTemplateInfo();
  if(!validRows.length||zbomErrors.length||templateInfo.error){setZbomProgress(0,'Fix the detected data or file-name template before export.');return}
  if(!selectedBridgeSession()){setZbomProgress(0,'Select an available SAP GUI session first.');return}
  if(validRows.length>100&&!unsafeWindow.confirm('You are about to print '+validRows.length+' quotations through SAP. Continue?'))return;
  recordZbomHistory(bridgeId('zbomInput').value);
  const previousClipboardPromise=readClipboardBestEffort();
  zbomHasRun=false;setZbomRunning(true);zbomLogLines=[];zbomOutputClaims=new Map();zbomResults=new Map();bridgeId('zbomResultSummary').replaceChildren();bridgeId('sapResult').textContent='ZBOM PDF log\n';
  setZbomProgress(2,'Preparing the ZBOM PDF export…');
  try{
    addZbomLog('Output folder: '+ZBOM_PDF_FOLDER+' (managed by Bridge).');
    const quotationText=validRows.map(row=>row.quote).join('\r\n'),previousClipboard=await previousClipboardPromise;
    const version2=await runZbomVersion(2,quotationText,previousClipboard,10,42);
    const version1=await runZbomVersion(1,quotationText,previousClipboard,52,84);
    const summary=renderZbomResultSummary();
    setZbomProgress(100,summary.missing?'Completed with '+summary.missing+' quotation(s) to review.':'Export completed successfully.');
    zbomHasRun=true;
    addZbomLog('Completed: '+summary.success+' quotation(s) exported, '+summary.missing+' produced no PDF.');
    if(version1.error&&version2.error)addZbomLog('Both SAP paths reported an action error. Review the SAP messages and the rows with no PDF.');
  }catch(error){
    setZbomProgress(100,'Export stopped: '+bridgeError(error));zbomHasRun=true;addZbomLog('Export stopped: '+bridgeError(error));setBridgeBadge('Action failed','error');
  }finally{
    const previousClipboard=await previousClipboardPromise;
    if(previousClipboard!==null)try{writeQuotationClipboard(previousClipboard)}catch(_){/* ignore */}
    setZbomRunning(false);
  }
}

function requireBridgeSession(){
  const session=selectedBridgeSession();if(!session)throw new Error('Select an available SAP GUI session first.');return session;
}

async function runBridgeAction(operation){
  setBridgeBusy(true);
  try{
    const payload=Object.assign(requireBridgeSession(),{operation:operation});
    if(operation==='transaction')payload.code=bridgeId('sapTransaction').value.trim();
    else if(operation==='sendVKey'){payload.controlId=bridgeId('sapVKeyTarget').value.trim()||'wnd[0]';payload.key=Number(bridgeId('sapVKey').value)}
    else{payload.controlId=bridgeId('sapControlId').value.trim();payload.value=bridgeId('sapControlValue').value}
    const data=await bridgeRequest('POST','/action',payload,30000);
    if(operation==='readText'&&Object.prototype.hasOwnProperty.call(data,'value'))bridgeId('sapControlValue').value=data.value==null?'':String(data.value);
    showBridgeResult(data,'SAP action completed.');setBridgeBadge('Ready','ok');
  }catch(error){showBridgeResult(bridgeError(error),'SAP action failed.');setBridgeBadge('Action failed','error')}
  finally{setBridgeBusy(false)}
}

function bindBridgeEvents(){
  const trusted=handler=>event=>{if(!event.isTrusted){showBridgeResult('Synthetic page actions are blocked.','Request blocked.');return}handler(event)};
  bridgeId('bridgeRefresh').addEventListener('click',trusted(refreshBridge));
  bridgeId('sapSession').addEventListener('change',()=>{setBridgeBusy(false);updateZbomStart();updateZbomCompareStart();updateCreateQuoteStart()});
  document.querySelectorAll('[data-tool-tab]').forEach(button=>button.addEventListener('click',()=>setToolTab(button.dataset.toolTab)));
  bridgeId('sapRunTransaction').addEventListener('click',trusted(()=>runBridgeAction('transaction')));
  bridgeId('sapReadText').addEventListener('click',trusted(()=>runBridgeAction('readText')));
  bridgeId('sapSetText').addEventListener('click',trusted(()=>runBridgeAction('setText')));
  bridgeId('sapSetKey').addEventListener('click',trusted(()=>runBridgeAction('setKey')));
  bridgeId('sapPress').addEventListener('click',trusted(()=>runBridgeAction('press')));
  bridgeId('sapSelect').addEventListener('click',trusted(()=>runBridgeAction('select')));
  bridgeId('sapSendVKey').addEventListener('click',trusted(()=>runBridgeAction('sendVKey')));
  bridgeId('zbomInput').addEventListener('input',()=>{saveZbomInput();previewZbomInput()});
  bridgeId('zbomTemplate').addEventListener('input',()=>{saveZbomTemplate();zbomHasRun=false;zbomResults=new Map();bridgeId('zbomResultSummary').replaceChildren();renderZbomPreview()});
  document.querySelectorAll('[data-zbom-token]').forEach(button=>button.addEventListener('click',()=>insertZbomToken(button.dataset.zbomToken)));
  bridgeId('createQuoteQuotation').addEventListener('input',()=>{sanitizeCreateQuoteQuotation();saveCreateQuoteQuotation();updateCreateQuoteStart()});
  bridgeId('createQuoteInput').addEventListener('input',()=>{saveCreateQuoteInput();previewCreateQuoteInput()});
  bridgeId('createQuoteDefaultValidTo').addEventListener('input',()=>{sanitizeCreateQuoteDays();saveCreateQuoteValidToDays();renderCreateQuotePreview()});
  bridgeId('createQuoteFidSuffix').addEventListener('input',()=>{saveCreateQuoteFidSuffix();renderCreateQuotePreview()});
  bridgeId('zbomCompareInput').addEventListener('input',()=>{saveZbomCompareInput();previewZbomCompareInput()});
  bridgeId('zbomCompareTemplate').addEventListener('input',()=>{saveZbomCompareTemplate();invalidateZbomCompareResults();renderZbomComparePreview()});
  bridgeId('zbomCompareSeparator').addEventListener('input',()=>{saveZbomCompareSeparator();invalidateZbomCompareResults();renderZbomComparePreview()});
  bridgeId('zbomCompareOutputFolder').addEventListener('input',()=>{saveZbomCompareFolder();invalidateZbomCompareResults();renderZbomComparePreview();updateZbomCompareStart()});
  bridgeId('zbomCompareKeepTemp').addEventListener('click',trusted(toggleZbomCompareKeepTemp));
  document.querySelectorAll('[data-zbom-compare-token]').forEach(button=>button.addEventListener('click',()=>insertZbomCompareToken(button.dataset.zbomCompareToken)));
  bridgeId('zbomCompareOpenFolder').addEventListener('click',trusted(openZbomCompareOutputFolder));
  bridgeId('zbomCompareOpenHistory').addEventListener('click',trusted(openZbomCompareHistory));
  bridgeId('zbomCompareCloseHistory').addEventListener('click',trusted(closeZbomCompareHistory));
  document.querySelector('[data-zbom-compare-history-close]').addEventListener('click',trusted(closeZbomCompareHistory));
  bridgeId('zbomOpenHistory').addEventListener('click',trusted(openZbomHistory));
  bridgeId('zbomCloseHistory').addEventListener('click',trusted(closeZbomHistory));
  document.querySelector('[data-zbom-history-close]').addEventListener('click',trusted(closeZbomHistory));
  document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(!bridgeId('zbomHistoryDialog').hidden)closeZbomHistory();if(!bridgeId('zbomCompareHistoryDialog').hidden)closeZbomCompareHistory()});
  document.addEventListener('keydown',event=>{if(event.ctrlKey&&event.altKey&&event.shiftKey&&event.code==='KeyD'){event.preventDefault();toggleBridgeDebug()}});
  bridgeId('zbomResetInput').addEventListener('click',trusted(resetZbomInput));
  bridgeId('zbomResetTemplate').addEventListener('click',trusted(resetZbomTemplate));
  bridgeId('zbomCompareResetInput').addEventListener('click',trusted(resetZbomCompareInput));
  bridgeId('zbomCompareResetTemplate').addEventListener('click',trusted(resetZbomCompareTemplate));
  bridgeId('zbomStart').addEventListener('click',trusted(startZbomExport));
  bridgeId('zbomOpenFolder').addEventListener('click',trusted(openZbomFolder));
  bridgeId('zbomCompareStart').addEventListener('click',trusted(startZbomCompare));
  bridgeId('createQuoteStart').addEventListener('click',trusted(startCreateQuote));
  bridgeDebugUnlocked=readPersistent(BRIDGE_DEBUG_STORAGE_KEY,'0')==='1';bridgeId('tabDebug').hidden=!bridgeDebugUnlocked;
  loadZbomPreferences();previewZbomInput();loadZbomComparePreferences();previewZbomCompareInput();loadCreateQuotePreferences();previewCreateQuoteInput();setToolTab('zbom');
}

function runDashboard(){
'use strict';

const DETAIL_FIELDS=['NSR#','NSR Title','Task Status','NSR Type','Impacted Sub System','Initiator','REF FCID','NSR Org','Primary Product','Customer','Sales Rep','Sales Ops','Technical Contact','Submit Date','NSR Request','Temp Id#'];
const DETAIL_WIDTHS=[76,190,144,82,102,94,78,64,120,150,90,90,108,84,96,90];
const LIVE_FIELDS=['Submit Date','Task Status','ECD','Approver Team','Assigned Approver','Pending Days','Aging','Cycle Time'];
const CYCLE_DETAIL_FIELDS=DETAIL_FIELDS.filter(field=>field!=='NSR#'&&field!=='Initiator'&&!LIVE_FIELDS.includes(field));
const CYCLE_FIELDS=['NSR#',...LIVE_FIELDS,...CYCLE_DETAIL_FIELDS.flatMap(field=>field==='NSR Type'?[field,'NSR Category']:field==='Customer'?[field,'Initiator']:[field])];
const WF_FIELDS=['Task Name','Approver Status','Approver Team','Approver','Pending Days','Approved Date','Comments'];
const CYCLE_WIDTHS=CYCLE_FIELDS.map(field=>({
  'NSR#':78,'Submit Date':116,'Approver Team':125,
  'Assigned Approver':130,'Pending Days':82,'Aging':64,'Cycle Time':78,'NSR Title':190,'Task Status':144,'ECD':96,
  'NSR Category':100,'Customer':150,'Primary Product':120,'Technical Contact':108,'Impacted Sub System':104
}[field]||92));
const CYCLE_CONCURRENCY=8,CYCLE_WARN_AT=100,CYCLE_LIMIT=500;
const WORKFLOW_ODATA='/sap/opu/odata/sap/ZNSR_CD_SRV/WorkflowSet/';
const NSR_DETAIL_ODATA='/sap/opu/odata/sap/ZNSR_CD_SRV/GetNsrDetSet/';
const FIORI_DETAIL='/flp#ZNSR-display&/NsrDetail/';
const pageFetch=(url,options)=>unsafeWindow.fetch(url,options);
const SOURCE_FIELDS=['Temp Id#','NSR#','NSR Status','REF FCID','NSR Request','Task Name','NSR Title','NSR Type','Impacted Sub System','Initiator','Sales Rep','Sales Ops','Technical Contact','Customer','Submit Date','NSR Org','Primary Product'];
const FILTERS=[
  {id:'fInit',field:'Initiator',label:'Initiator',color:'#0f766e',filterOnly:true},
  {id:'fStatus',field:'Task Status',label:'Task Status',color:'#2563eb'},
  {id:'fDate',field:'Submit Period',label:'Submit Date',color:'#475569',filterOnly:true},
  {id:'fSys',field:'Impacted Sub System',label:'Impacted Sub System',color:'#0891b2'},
  {id:'fType',field:'NSR Type',label:'NSR Type',color:'#7c3aed'},
  {id:'fProd',field:'Primary Product',label:'Primary Product',color:'#d97706'},
  {id:'fOrg',field:'NSR Org',label:'NSR Org',color:'#16a34a'},
  {id:'fCust',field:'Customer',label:'Customer',color:'#dc2626'}
];
const PIVOT_FILTERS=FILTERS.filter(f=>!f.filterOnly);
const ALIASES={
  'Temp Id#':['Temp Id#','Temp ID','TempId','Temporary ID'],
  'NSR#':['NSR#','NSR','NSR No','NSR Number','NSR ID'],
  'NSR Status':['NSR Status','Status'],
  'REF FCID':['REF FCID','Reference Fcid','Reference FCID','Ref FCID','FCID'],
  'NSR Request':['NSR Request','Request','Request Type'],
  'Task Name':['Task Name','Task','Workflow Task'],
  'NSR Title':['NSR Title','Title'],
  'NSR Type':['NSR Type','Type'],
  'Impacted Sub System':['Impacted Sub System','Impacted Subsystem','Sub System','Subsystem'],
  'Initiator':['Initiator','Initiated By','Requester'],
  'Sales Rep':['Sales Rep','Sales Representative'],
  'Sales Ops':['Sales Ops','Sales Operation','Sales Operations'],
  'Technical Contact':['Technical Contact','Tech Contact'],
  'Customer':['Customer','Customer Name','Account'],
  'Submit Date':['Submit Date','Submitted Date','Submission Date'],
  'NSR Org':['NSR Org','NSR Organization','Organization','Org'],
  'Primary Product':['Primary Product','Product','PrimaryProduct']
};
const TASK_STEPS={
  'CREATE NSR':1,'REQUEST REVIEW':2,'SAFETY REVIEW':5,'ESTIMATES':6,'COST REVIEW':7,
  'PRICE CONFIRMATION':8,'DEMAND CONFIRMATION':9,'FINAL APPROVAL':10,'VC VALIDATION':11,
  'ENGINEERING COMMIT AND DESIGN':12
};
const collator=new Intl.Collator(undefined,{numeric:true,sensitivity:'base'});
const state={rows:[],filtered:[],source:null,stats:null,sort:{field:'Submit Date',dir:'desc'},chosenReady:false,toastTimer:null,sourceRun:0,sourceAbort:null,cycleRows:[],cycleSort:{field:'NSR#',dir:'asc'},cycleAbort:null,cycleRun:0};

const $id=id=>document.getElementById(id);
const clean=v=>{
  if(v===null||v===undefined)return '';
  if(v instanceof Date&&!isNaN(v))return `${v.getFullYear()}-${String(v.getMonth()+1).padStart(2,'0')}-${String(v.getDate()).padStart(2,'0')}`;
  const s=String(v).replace(/^\uFEFF/,'').trim();
  return /^(nan|null|undefined)$/i.test(s)?'':s;
};
const upper=v=>clean(v).toUpperCase().replace(/\s+/g,' ');
const normHeader=v=>clean(v).toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'');
const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const displayValue=v=>clean(v)||'（Blank）';
const pct=(a,b)=>b?`${(a/b*100).toFixed(1)}%`:'0.0%';

function deriveTaskStatus(row){
  const task=upper(row['Task Name']),status=upper(row['NSR Status']);
  if(status.includes('CANCEL')||task==='CANCELLED')return '0-Cancelled';
  if(status.includes('REJECT')||task==='REJECTED')return '0-Rejected';
  if(status.includes('COMPLET')||task==='COMPLETED')return '15-Completed';
  if(task==='INITIAL ASSESSMENT')return status==='PENDING WITH PRODUCT MANAGER'?'4-Initial Assessment':'3-Initial Assessment';
  if(task==='SOBI CREATE AND APPROVAL')return status==='PENDING WITH MFE'?'14-SOBI Create and Approval':'13-SOBI Create and Approval';
  if(Object.prototype.hasOwnProperty.call(TASK_STEPS,task))return `${TASK_STEPS[task]}-${titleForTask(task)}`;
  const uniqueByStatus={
    'PENDING WITH INITIATOR':'1-Create NSR','PENDING WITH SAFETY':'5-Safety Review',
    'PENDING WITH PGBD':'8-Price Confirmation','PENDING WITH POA PM':'11-VC Validation',
    'PENDING WITH DESIGN ENGINEERING':'12-Engineering Commit and Design'
  };
  if(uniqueByStatus[status])return uniqueByStatus[status];
  return `Unmapped · ${clean(row['Task Name'])||clean(row['NSR Status'])||'Blank task/status'}`;
}

function titleForTask(task){
  const names={
    'CREATE NSR':'Create NSR','REQUEST REVIEW':'Request Review','SAFETY REVIEW':'Safety Review','ESTIMATES':'Estimates',
    'COST REVIEW':'Cost Review','PRICE CONFIRMATION':'Price Confirmation','DEMAND CONFIRMATION':'Demand Confirmation',
    'FINAL APPROVAL':'Final Approval','VC VALIDATION':'VC Validation','ENGINEERING COMMIT AND DESIGN':'Engineering Commit and Design'
  };
  return names[task]||task;
}

function statusRank(v){
  const m=clean(v).match(/^(\d+)-/);
  if(!m)return [99,clean(v)];
  return [Number(m[1]),clean(v)];
}

function compareStatus(a,b){
  const aa=statusRank(a),bb=statusRank(b);
  return aa[0]-bb[0]||collator.compare(aa[1],bb[1]);
}

function buildHeaderMap(headers){
  const byNorm=new Map(headers.map(h=>[normHeader(h),h]));
  const map={};
  for(const field of SOURCE_FIELDS){
    const aliases=(ALIASES[field]||[field]).map(normHeader);
    map[field]=aliases.map(a=>byNorm.get(a)).find(Boolean)||'';
  }
  return map;
}

function normalizeRows(rawRows){
  if(!rawRows.length)throw new Error('No data rows were found.');
  const headers=Object.keys(rawRows[0]||{}),headerMap=buildHeaderMap(headers);
  if(!headerMap['NSR#'])throw new Error('Required header “NSR#” was not found.');
  const map=new Map();let missingNsr=0,duplicates=0;
  rawRows.forEach(raw=>{
    const row={};
    SOURCE_FIELDS.forEach(field=>row[field]=clean(raw[headerMap[field]]));
    const nsr=row['NSR#'];
    if(!nsr){missingNsr++;return}
    if(map.has(nsr)){
      duplicates++;
      const existing=map.get(nsr);
      SOURCE_FIELDS.forEach(field=>{if(!existing[field]&&row[field])existing[field]=row[field]});
    }else map.set(nsr,row);
  });
  const rows=[...map.values()].map(row=>({...row,'Task Status':deriveTaskStatus(row),'Submit Period':submitPeriod(row['Submit Date'])}));
  const unmapped=rows.filter(r=>r['Task Status'].startsWith('Unmapped')).length;
  return {rows,stats:{inputRows:rawRows.length,validRows:rows.length,missingNsr,duplicates,unmapped}};
}

function countRecognizedHeaders(values){
  const norms=new Set(values.map(normHeader).filter(Boolean));
  let score=0;
  for(const field of SOURCE_FIELDS){
    if((ALIASES[field]||[field]).some(a=>norms.has(normHeader(a))))score++;
  }
  const hasNsr=(ALIASES['NSR#']||[]).some(a=>norms.has(normHeader(a)));
  return {score,hasNsr};
}

function findHeader(matrix){
  let best=null;
  matrix.slice(0,50).forEach((row,index)=>{
    const hit=countRecognizedHeaders(row||[]),candidate={index,score:hit.score,hasNsr:hit.hasNsr};
    if(candidate.hasNsr&&(!best||candidate.score>best.score))best=candidate;
  });
  if(!best)throw new Error('Required header “NSR#” was not found in the first 50 rows.');
  return best;
}

function rowsFromMatrix(matrix,headerIndex){
  const rawHeaders=(matrix[headerIndex]||[]).map((v,i)=>clean(v)||`Column ${i+1}`),seen={};
  const headers=rawHeaders.map(h=>{seen[h]=(seen[h]||0)+1;return seen[h]===1?h:`${h}_${seen[h]}`});
  return matrix.slice(headerIndex+1).filter(row=>(row||[]).some(v=>clean(v))).map(row=>{
    const out={};headers.forEach((h,i)=>out[h]=row[i]??'');return out;
  });
}

function delimiterScore(line,delimiter){
  let count=0,quoted=false;
  for(let i=0;i<line.length;i++){
    if(line[i]==='"')quoted=!quoted;
    else if(line[i]===delimiter&&!quoted)count++;
  }
  return count;
}

function parseDelimited(text){
  text=String(text||'').replace(/^\uFEFF/,'');
  const probe=text.split(/\r?\n/).filter(Boolean).slice(0,8);
  const candidates=[',','\t',';','|'];
  const delimiter=candidates.map(d=>[d,probe.reduce((s,l)=>s+delimiterScore(l,d),0)]).sort((a,b)=>b[1]-a[1])[0][0];
  const rows=[];let row=[],value='',quoted=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],next=text[i+1];
    if(c==='"'&&quoted&&next==='"'){value+='"';i++}
    else if(c==='"')quoted=!quoted;
    else if(c===delimiter&&!quoted){row.push(value);value=''}
    else if((c==='\r'||c==='\n')&&!quoted){
      if(c==='\r'&&next==='\n')i++;
      row.push(value);value='';
      if(row.some(v=>clean(v)))rows.push(row);
      row=[];
    }else value+=c;
  }
  if(row.length||value){row.push(value);if(row.some(v=>clean(v)))rows.push(row)}
  return rows;
}

function decodeText(buffer){
  const bytes=buffer instanceof Uint8Array?buffer:new Uint8Array(buffer);
  try{return new TextDecoder('utf-8',{fatal:true}).decode(bytes)}catch(_){
    try{return new TextDecoder('gb18030').decode(bytes)}catch(__){return new TextDecoder('windows-1252').decode(bytes)}
  }
}

async function parseFile(file){
  const ext=(file.name.split('.').pop()||'').toLowerCase();
  if(ext==='csv'){
    const matrix=parseDelimited(decodeText(await file.arrayBuffer())),header=findHeader(matrix);
    return {rawRows:rowsFromMatrix(matrix,header.index),sheet:'CSV',headerRow:header.index+1,score:header.score};
  }
  if(!['xlsx','xls'].includes(ext))throw new Error('Please upload an .xlsx, .xls, or .csv file.');
  if(!window.XLSX)throw new Error('The XLSX parser did not load. Check the network connection and try again.');
  let wb;
  try{wb=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:true})}
  catch(err){
    if(/encrypt|password|protected/i.test(String(err&&err.message||err)))throw new Error('Password-protected or encrypted Excel files are not supported. Save an unencrypted copy and upload it again.');
    throw err;
  }
  let best=null;
  wb.SheetNames.forEach(sheet=>{
    const ws=wb.Sheets[sheet];if(!ws||!ws['!ref'])return;
    const range=XLSX.utils.decode_range(ws['!ref']);range.e.r=Math.min(range.e.r,49);
    const preview=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false,range:XLSX.utils.encode_range(range)});
    try{
      const hit=findHeader(preview),candidate={sheet,index:hit.index,score:hit.score};
      if(!best||candidate.score>best.score)best=candidate;
    }catch(_){/* try next sheet */}
  });
  if(!best)throw new Error('No worksheet contains the required “NSR#” header.');
  const matrix=XLSX.utils.sheet_to_json(wb.Sheets[best.sheet],{header:1,defval:'',raw:false});
  return {rawRows:rowsFromMatrix(matrix,best.index),sheet:best.sheet,headerRow:best.index+1,score:best.score};
}

const SAP_SEARCH='/sap/opu/odata/sap/ZNSR_CD_SRV/SearchNsrSet';
const SAP_FIELDS={
  'Temp Id#':['TempId'],'NSR#':['Nsrnum'],'NSR Status':['NsrWorkflowStatus','NsrStatus'],'REF FCID':['RefFcid'],
  'NSR Request':['NsrRequest'],'Task Name':['DescriptionTask'],'NSR Title':['NsrTitle','EnggTitle'],'NSR Type':['NsrType'],
  'Impacted Sub System':['ImpSubSys'],'Initiator':['InitiatedByFn','Requester','InitiatedBy'],'Sales Rep':['SalesRepFn'],
  'Sales Ops':['SalesOpsFn','SalesOps'],'Technical Contact':['TechContactFn'],'Customer':['Customer'],'Submit Date':['SubmitDate'],
  'NSR Org':['NsrOrg'],'Primary Product':['PrimaryProd']
};

function localDate(value){
  return `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;
}

function sapRange(){
  const today=new Date(),yearAgo=new Date(today.getFullYear()-1,today.getMonth(),today.getDate());
  const quarterStart=new Date(yearAgo.getFullYear(),Math.floor(yearAgo.getMonth()/3)*3,1);
  return {from:localDate(quarterStart),to:localDate(today)};
}

function sapFilter(from,to){
  return `(Nsrnum eq '' and Screen eq 'S' and Customer eq '' and Description eq '' and ImpSubSys eq '' and NsrRequest eq '' and NsrTitle eq '' and RefFcid eq '' and NsrType eq '' and SalesOpsFn eq '' and EnggTitle eq '' and NsrWorkflowStatus eq '' and NsrStatus eq '' and InitiatedByFn eq '' and HostFidUpgrade eq '' and (ResEngGroup eq '') and PrimaryProd eq '' and TechSpec eq '' and (SubmitDate ge datetime'${from}T00:00:00' and SubmitDate le datetime'${to}T23:59:59') and (NsrOrg eq ''))`;
}

function sapUrl(range){
  return `${SAP_SEARCH}?$filter=${encodeURIComponent(sapFilter(range.from,range.to))}`;
}

function atomValue(node,names){
  for(const name of names){
    const item=node&&node.getElementsByTagNameNS('*',name)[0],value=clean(item&&item.textContent);if(value)return value;
  }
  return '';
}

function atomDate(value){
  const match=clean(value).match(/^(\d{4}-\d{2}-\d{2})/);return match?match[1]:'';
}

function parseSearchXml(text){
  const doc=new DOMParser().parseFromString(text,'application/xml');
  if(doc.getElementsByTagName('parsererror').length)throw new Error('SAP returned invalid XML.');
  const rows=[...doc.getElementsByTagNameNS('*','entry')].map(entry=>{
    const props=entry.getElementsByTagNameNS('*','properties')[0]||entry,row={};
    SOURCE_FIELDS.forEach(field=>row[field]=atomValue(props,SAP_FIELDS[field]||[field]));
    row['Submit Date']=atomDate(row['Submit Date']);return row;
  }).filter(row=>row['NSR#']);
  const next=[...doc.getElementsByTagNameNS('*','link')].find(link=>clean(link.getAttribute('rel')).toLowerCase()==='next');
  return {rows,next:next?clean(next.getAttribute('href')):''};
}

function nextSapUrl(href,current){
  const url=new URL(href,current);
  if(url.origin!==unsafeWindow.location.origin)throw new Error('SAP returned an unexpected pagination URL.');
  return url.href;
}

function setLoading(on){
  const line=$id('loadingLine');line.className='loading-line'+(on?' on':' done');
  if(!on)setTimeout(()=>line.className='loading-line',350);
}

function setSourceStatus(message,type='ok'){
  const el=$id('sourceStatus');el.className=`source-status ${type}`;el.innerHTML=message;
}

async function fetchSapRows(range,signal){
  const rows=[],seen=new Set();let url=sapUrl(range),pages=0;
  while(url){
    if(seen.has(url))throw new Error('SAP returned a repeated pagination URL.');
    if(pages>=250)throw new Error('SAP returned too many result pages.');
    seen.add(url);setSourceStatus(`Loading latest SAP data…<br>${range.from} to ${range.to}${rows.length?` · ${rows.length.toLocaleString()} rows`:''}`,'loading');
    let response;
    try{response=await pageFetch(url,{credentials:'same-origin',cache:'no-store',signal,headers:{Accept:'application/atom+xml,application/xml,text/xml'}})}
    catch(_){throw new Error('SAP data request failed. Check the Fiori session and network connection.')}
    const text=await response.text(),type=(response.headers.get('Content-Type')||'').toLowerCase();
    if(response.status===401||response.status===403||type.includes('text/html')||/^\s*<!doctype\s+html/i.test(text)||/^\s*<html/i.test(text))throw new Error('Fiori session expired. Return to Fiori and sign in again.');
    if(!response.ok)throw new Error(`SAP SearchNsrSet returned HTTP ${response.status}.`);
    const parsed=parseSearchXml(text);rows.push(...parsed.rows);pages++;
    url=parsed.next?nextSapUrl(parsed.next,response.url||url):'';
  }
  return {rows,pages};
}

function commitRaw(rawRows,meta){
  const normalized=normalizeRows(rawRows);state.rows=normalized.rows;state.stats=normalized.stats;state.source=meta;
  state.sort={field:'Submit Date',dir:'desc'};$id('globalSearch').value='';$id('tableSearch').value='';
  buildFilterControls();applyFilters();
  if(meta.isSap){
    $id('heroSource').textContent=`SAP live · ${meta.from} to ${meta.to}`;
    setSourceStatus(`SAP data loaded · ${esc(meta.from)} to ${esc(meta.to)}`,'ok');
  }else{
    const s=state.stats,duplicates=s.duplicates+(meta.preprocessedDuplicates||0),details=[`${s.validRows.toLocaleString()} NSR#`,`${duplicates} duplicate${duplicates===1?'':'s'} consolidated`,`${s.unmapped} unmapped`];
    $id('heroSource').textContent=meta.file;
    setSourceStatus(`<b>${esc(meta.file)}</b><br>${esc(meta.sheet)} · header row ${meta.headerRow} · ${details.join(' · ')}`,'ok');
  }
}

async function loadSapData(){
  const range=sapRange(),run=++state.sourceRun,controller=new unsafeWindow.AbortController();
  if(state.sourceAbort)state.sourceAbort.abort();state.sourceAbort=controller;
  setLoading(true);setSourceStatus(`Loading latest SAP data…<br>${range.from} to ${range.to}`,'loading');
  try{
    $id('rawFile').value='';const result=await fetchSapRows(range,controller.signal);if(run!==state.sourceRun)return;
    commitRaw(result.rows,{file:'SAP live data',isSap:true,from:range.from,to:range.to,pages:result.pages});
    toast(`${state.rows.length.toLocaleString()} latest SAP NSR${state.rows.length===1?'':'s'} loaded.`);
  }catch(err){
    if(run!==state.sourceRun)return;
    setSourceStatus(`<b>SAP data load failed</b><br>${esc(err.message)} Upload a raw data file to continue.`,'error');toast(err.message,true);
  }finally{if(run===state.sourceRun){state.sourceAbort=null;setLoading(false)}}
}

async function handleUpload(event){
  const file=event.target.files&&event.target.files[0];if(!file)return;
  const run=++state.sourceRun;if(state.sourceAbort)state.sourceAbort.abort();state.sourceAbort=null;
  setLoading(true);setSourceStatus(`Reading <b>${esc(file.name)}</b>…`,'loading');
  try{
    const parsed=await parseFile(file);if(run!==state.sourceRun)return;
    commitRaw(parsed.rawRows,{file:file.name,sheet:parsed.sheet,headerRow:parsed.headerRow,score:parsed.score});toast(`${file.name} loaded successfully.`);
  }catch(err){
    if(run!==state.sourceRun)return;
    setSourceStatus(`<b>Load failed: ${esc(file.name)}</b><br>${esc(err.message)}`,'error');toast(err.message,true);event.target.value='';
  }finally{if(run===state.sourceRun)setLoading(false)}
}

function buildFilterControls(){
  const host=$id('filterHost');
  if(!host.children.length){
    host.innerHTML=FILTERS.map(f=>`<div class="filter-group"><div class="filter-label"><label for="${f.id}">${esc(f.label)}</label><button type="button" data-clear-filter="${f.id}">Clear</button></div><select id="${f.id}" class="filter-select" multiple data-placeholder="All ${esc(f.label)}"></select>${f.field==='Task Status'?'<div class="quick-pick"><span>Quick select</span><button type="button" data-status="flow" aria-pressed="false">1–14 In workflow</button></div>':f.field==='Submit Period'?'<div id="dateYears" class="quick-pick"></div>':''}</div>`).join('');
    host.addEventListener('click',e=>{
      const year=e.target.dataset.year;if(year){toggleYear(year);return}
      const id=e.target.dataset.clearFilter;if(id)clearFilter(id);
    });
    host.addEventListener('change',e=>{if(e.target.matches('.filter-select'))applyFilters()});
  }
  FILTERS.forEach(f=>{
    const select=$id(f.id);let values=[...new Set(state.rows.map(r=>r[f.field]))];
    if(f.field==='Submit Period'){
      values.sort((a,b)=>collator.compare(b,a));
      const years=[...new Set(values.map(periodYear).filter(Boolean))];
      renderYears(years);
    }else values.sort(f.field==='Task Status'?compareStatus:collator.compare);
    select.innerHTML=values.map(v=>`<option value="${esc(v)}">${esc(displayValue(v))}</option>`).join('');
  });
  initOrRefreshChosen();
}

function initOrRefreshChosen(){
  if(window.jQuery&&jQuery.fn&&jQuery.fn.chosen){
    FILTERS.forEach(f=>{
      const jq=jQuery(`#${f.id}`);
      if(jq.data('chosen'))jq.trigger('chosen:updated');
      else jq.chosen({width:'100%',search_contains:true,hide_results_on_select:false,no_results_text:'No match'});
      jq.off('change.nsrControlTower').on('change.nsrControlTower',applyFilters);
    });
    state.chosenReady=true;
  }
}

function renderYears(years){
  const host=$id('dateYears');if(!host)return;
  host.innerHTML=years.length?`<span>Select year</span>${years.map(year=>`<button type="button" data-year="${esc(year)}" aria-pressed="false">${esc(year)}</button>`).join('')}`:'';
}

function toggleYear(year){
  const options=[...$id('fDate').options].filter(o=>periodYear(o.value)===year),selectAll=!options.length||options.some(o=>!o.selected);
  options.forEach(o=>o.selected=selectAll);syncSelect('fDate');applyFilters();
}

function paintYears(){
  document.querySelectorAll('[data-year]').forEach(button=>{
    const options=[...$id('fDate').options].filter(o=>periodYear(o.value)===button.dataset.year),selected=options.filter(o=>o.selected).length;
    button.classList.toggle('active',options.length>0&&selected===options.length);button.classList.toggle('partial',selected>0&&selected<options.length);button.setAttribute('aria-pressed',selected===options.length?'true':'false');
  });
}

function isFlow(value){const n=statusRank(value)[0];return n>=1&&n<=14}
function statusSet(group){
  const single={done:'15-Completed',rejected:'0-Rejected',cancelled:'0-Cancelled'}[group];
  return [...$id('fStatus').options].filter(o=>group==='flow'?isFlow(o.value):o.value===single).map(o=>o.value);
}

function toggleStatus(group){
  const select=$id('fStatus'),values=statusSet(group),selected=selectedValues('fStatus');
  const same=values.length===selected.length&&values.every(v=>selected.includes(v));
  [...select.options].forEach(o=>o.selected=!same&&values.includes(o.value));syncSelect('fStatus');applyFilters();
}

function paintFlow(){
  const button=document.querySelector('#filterHost [data-status="flow"]');if(!button)return;
  const values=statusSet('flow'),selected=selectedValues('fStatus'),hits=selected.filter(v=>values.includes(v)).length;
  const active=values.length>0&&hits===values.length&&hits===selected.length;
  button.classList.toggle('active',active);button.classList.toggle('partial',hits>0&&!active);button.setAttribute('aria-pressed',active?'true':'false');
}

function selectedValues(id){return [...$id(id).selectedOptions].map(o=>o.value)}
function syncSelect(id){if(state.chosenReady)jQuery(`#${id}`).trigger('chosen:updated')}

function clearFilter(id,render=true){
  [...$id(id).options].forEach(o=>o.selected=false);syncSelect(id);if(render)applyFilters();
}

function resetFilters(){
  FILTERS.forEach(f=>clearFilter(f.id,false));
  $id('globalSearch').value='';$id('tableSearch').value='';applyFilters();toast('All filters cleared.');
}

function drillFilter(id,value,additive=false){
  const select=$id(id);
  [...select.options].forEach(o=>o.selected=o.value===value||(additive&&o.selected));
  syncSelect(id);applyFilters();
  const f=FILTERS.find(x=>x.id===id);toast(`${f.label}: ${displayValue(value)}`);
  $id('activeFilters').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function filterRows(){
  const selections=Object.fromEntries(FILTERS.map(f=>[f.field,selectedValues(f.id)]));
  const query=clean($id('globalSearch').value).toLowerCase();
  return state.rows.filter(row=>{
    if(!FILTERS.every(f=>!selections[f.field].length||selections[f.field].includes(row[f.field])))return false;
    if(!query)return true;
    return DETAIL_FIELDS.some(field=>clean(row[field]).toLowerCase().includes(query))||clean(row['NSR Status']).toLowerCase().includes(query)||clean(row['Task Name']).toLowerCase().includes(query);
  });
}

function applyFilters(){
  state.filtered=filterRows();
  paintYears();paintFlow();renderActiveFilters();renderKpis();renderPivots();renderTable();
}

function renderActiveFilters(){
  const parts=[];
  FILTERS.forEach(f=>selectedValues(f.id).forEach(v=>parts.push(`<span class="filter-chip"><span>${esc(f.label)}: ${esc(displayValue(v))}</span><button type="button" aria-label="Remove filter" data-remove-filter="${f.id}" data-remove-value="${esc(v)}">×</button></span>`)));
  const q=clean($id('globalSearch').value);if(q)parts.push(`<span class="filter-chip"><span>Search: ${esc(q)}</span><button type="button" aria-label="Clear search" data-remove-search>×</button></span>`);
  $id('activeFilters').innerHTML=parts.join('')||'<span class="all-chip">All NSRs are selected.</span>';
}

function renderKpis(){
  const rows=state.filtered,total=rows.length;
  const counts={
    active:rows.filter(r=>{const n=statusRank(r['Task Status'])[0];return n>=1&&n<=14}).length,
    completed:rows.filter(r=>r['Task Status']==='15-Completed').length,
    rejected:rows.filter(r=>r['Task Status']==='0-Rejected').length,
    cancelled:rows.filter(r=>r['Task Status']==='0-Cancelled').length
  };
  const items=[
    ['Filtered NSR',total,'Current population','#0f766e'],['In workflow',counts.active,pct(counts.active,total),'#2563eb','flow'],
    ['Completed',counts.completed,pct(counts.completed,total),'#16a34a','done'],['Rejected',counts.rejected,pct(counts.rejected,total),'#dc2626','rejected'],
    ['Cancelled',counts.cancelled,pct(counts.cancelled,total),'#64748b','cancelled']
  ];
  $id('kpis').innerHTML=items.map(x=>`<div class="kpi" style="--kpi-color:${x[3]}"><small>${x[0]}</small>${x[4]?`<button class="kpi-num" type="button" data-status="${x[4]}" title="Filter Task Status">${Number(x[1]).toLocaleString()}</button>`:`<strong>${Number(x[1]).toLocaleString()}</strong>`}<span>${x[2]}</span></div>`).join('');
}

function renderPivots(){
  const rows=state.filtered,total=rows.length;
  $id('pivotContext').textContent=`${total.toLocaleString()} filtered NSR${total===1?'':'s'}`;
  $id('pivotGrid').innerHTML=PIVOT_FILTERS.map(f=>{
    const counts=new Map();rows.forEach(r=>counts.set(r[f.field],(counts.get(r[f.field])||0)+1));
    let entries=[...counts.entries()];
    entries.sort(f.field==='Task Status'?(a,b)=>compareStatus(a[0],b[0]):(a,b)=>b[1]-a[1]||collator.compare(a[0],b[0]));
    const max=Math.max(1,...entries.map(x=>x[1]));
    const list=entries.length?entries.map(([value,count])=>`<div class="pivot-row" title="${esc(displayValue(value))}"><span class="pivot-label">${esc(displayValue(value))}</span><span class="pivot-bar"><i style="width:${(count/max*100).toFixed(1)}%;--bar:${f.color}"></i></span><button class="pivot-count" type="button" data-drill-id="${f.id}" data-drill-value="${esc(value)}" title="Filter by ${esc(displayValue(value))}">${count}</button></div>`).join(''):'<div class="empty">No matching NSRs</div>';
    return `<section class="pivot-card"><div class="pivot-head"><h3>${esc(f.label)}</h3><span>${counts.size} values · ${total.toLocaleString()} NSR</span></div><div class="pivot-list">${list}</div></section>`;
  }).join('');
}

function dateNumber(value){
  const s=clean(value);if(!s)return Number.NEGATIVE_INFINITY;
  if(/^\d{5}(?:\.\d+)?$/.test(s))return (Number(s)-25569)*86400000;
  let m=s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);if(m)return Date.UTC(Number(m[3]),Number(m[1])-1,Number(m[2]));
  m=s.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/);if(m)return Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3]));
  const n=Date.parse(s);return Number.isNaN(n)?Number.NEGATIVE_INFINITY:n;
}

function submitPeriod(value){
  const n=dateNumber(value);if(!Number.isFinite(n))return '';
  const date=new Date(n);return `${date.getUTCFullYear()} Q${Math.floor(date.getUTCMonth()/3)+1}`;
}

function periodYear(value){
  const match=clean(value).match(/^(\d{4})\s+Q[1-4]$/);return match?match[1]:'';
}

function compareRows(a,b,field){
  if(field==='Task Status')return compareStatus(a[field],b[field]);
  if(field==='Submit Date')return dateNumber(a[field])-dateNumber(b[field]);
  return collator.compare(clean(a[field]),clean(b[field]));
}

function currentTableRows(){
  const q=clean($id('tableSearch').value).toLowerCase();
  const rows=q?state.filtered.filter(r=>DETAIL_FIELDS.some(f=>clean(r[f]).toLowerCase().includes(q))):[...state.filtered];
  const {field,dir}=state.sort;
  return rows.sort((a,b)=>compareRows(a,b,field)*(dir==='asc'?1:-1));
}

function statusPill(value){
  const cls=value==='15-Completed'?'terminal':value.startsWith('0-')?'stop':value.startsWith('Unmapped')?'unknown':'';
  return `<span class="status-pill ${cls}">${esc(value)}</span>`;
}

function renderTable(){
  const rows=currentTableRows(),sort=state.sort;
  const cols=`<colgroup>${DETAIL_WIDTHS.map(width=>`<col style="width:${width}px">`).join('')}</colgroup>`;
  const head=`<thead><tr>${DETAIL_FIELDS.map(field=>`<th scope="col" title="${esc(field)}" data-sort="${esc(field)}" class="${sort.field===field?'sorted':''}" aria-sort="${sort.field===field?(sort.dir==='asc'?'ascending':'descending'):'none'}">${esc(field)}<span class="sort-mark">${sort.field===field?(sort.dir==='asc'?'▲':'▼'):'↕'}</span></th>`).join('')}</tr></thead>`;
  const body=rows.length?rows.map(row=>`<tr>${DETAIL_FIELDS.map(field=>`<td title="${esc(row[field])}">${field==='Task Status'?statusPill(row[field]):esc(row[field])}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${DETAIL_FIELDS.length}"><div class="empty">No NSRs match the current filters.</div></td></tr>`;
  $id('detailTable').innerHTML=cols+head+`<tbody>${body}</tbody>`;
  $id('rowCount').textContent=`${rows.length.toLocaleString()} shown · ${state.filtered.length.toLocaleString()} filtered`;
}

function sortTable(field){
  if(state.sort.field===field)state.sort.dir=state.sort.dir==='asc'?'desc':'asc';
  else state.sort={field,dir:field==='Submit Date'?'desc':'asc'};
  renderTable();
}

function tsvValue(v){return clean(v).replace(/[\t\r\n]+/g,' ')}
async function copyRows(){
  const rows=currentTableRows(),text=[DETAIL_FIELDS.join('\t'),...rows.map(r=>DETAIL_FIELDS.map(f=>tsvValue(r[f])).join('\t'))].join('\r\n');
  try{
    if(navigator.clipboard&&window.isSecureContext)await navigator.clipboard.writeText(text);
    else{
      const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(ta);ta.select();
      if(!document.execCommand('copy'))throw new Error('Copy was blocked by the browser.');ta.remove();
    }
    toast(`${rows.length.toLocaleString()} rows copied as tab-separated values.`);
  }catch(err){toast(err.message||'Copy failed.',true)}
}

function toast(message,isError=false){
  const el=$id('toast');clearTimeout(state.toastTimer);el.textContent=message;el.className=`toast show${isError?' error':''}`;
  state.toastTimer=setTimeout(()=>el.className='toast',3000);
}

let wfTrigger=null,wfRows=[];

function switchTab(name){
  const cycle=name==='cycle';
  $id('overviewTab').classList.toggle('active',!cycle);$id('cycleTab').classList.toggle('active',cycle);
  $id('overviewBtn').classList.toggle('active',!cycle);$id('cycleBtn').classList.toggle('active',cycle);
  $id('overviewBtn').setAttribute('aria-selected',cycle?'false':'true');$id('cycleBtn').setAttribute('aria-selected',cycle?'true':'false');
  unsafeWindow.scrollTo({top:0,behavior:'smooth'});
}

function parseNsrInput(text){
  const valid=[],invalid=[],seen=new Set();
  String(text||'').split(/[\s,;|]+/).map(v=>v.trim()).filter(Boolean).forEach(token=>{
    const nsr=token.toUpperCase();
    if(!/^[A-Z]\d{5,9}$/.test(nsr)){invalid.push(token);return}
    if(!seen.has(nsr)){seen.add(nsr);valid.push(nsr)}
  });
  return {valid,invalid};
}

function xmlValue(node,name){
  const item=node&&node.getElementsByTagNameNS('*',name)[0];return clean(item&&item.textContent);
}

function xmlFirst(node,names){
  for(const name of names){const value=xmlValue(node,name);if(value)return value}return '';
}

function workflowDate(value){
  const match=clean(value).match(/^(\d{4}-\d{2}-\d{2})/);return match?match[1]:'';
}

function workflowStatusHint(value){
  const status=upper(value);return status.includes('COMPLET')?'COMPLETED':status.includes('CANCEL')?'CANCELLED':status.includes('REJECT')?'REJECTED':'';
}

function workflowHistory(entries){
  return entries.map(entry=>{
    const task=xmlFirst(entry,['DescriptionTask','TaskName']),approved=workflowDate(xmlFirst(entry,['ApprovalDate','ApprovedDate']));
    let status=xmlFirst(entry,['ApproverStatus','Decision','Status']);if(!status&&task)status=approved?'APPROVED':'PENDING';
    return {
      'Task Name':task,'Approver Status':status,'Approver Team':xmlFirst(entry,['ApproverTeam','ApprovalTeam']),
      'Approver':xmlFirst(entry,['Approver','AssignedApprover','ApproverName','NameText']),
      'Pending Days':xmlFirst(entry,['PendingDays','PendingDay']),'Approved Date':approved,
      'Comments':xmlFirst(entry,['Comments','Comment','ApprovalComments','ApprovalComment','ApproverComments','DecisionComments','DecisionComment','CommentText','Remarks','Remark','Notes']).replace(/%20/gi,' ')
    };
  }).filter(stage=>WF_FIELDS.some(field=>clean(stage[field])));
}

function workflowStamp(value){
  const match=clean(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);return match?Date.UTC(Number(match[1]),Number(match[2])-1,Number(match[3])):NaN;
}

function elapsedDays(startValue,endValue=''){
  const start=workflowStamp(startValue),now=new Date(),end=endValue?workflowStamp(endValue):Date.UTC(now.getFullYear(),now.getMonth(),now.getDate());
  return Number.isFinite(start)&&Number.isFinite(end)?Math.max(0,Math.floor((end-start)/86400000)):'';
}

function parseWorkflowXml(text,statusHint=''){
  const doc=new DOMParser().parseFromString(text,'application/xml');
  if(doc.getElementsByTagName('parsererror').length)throw new Error('The workflow service returned invalid XML.');
  const entries=[...doc.getElementsByTagNameNS('*','entry')],hintedTerminal=workflowStatusHint(statusHint);
  if(!entries.length)return {'Submit Date':'','Approver Team':'','Assigned Approver':'','Pending Days':'','Aging':'','Cycle Time':'',__completed:hintedTerminal==='COMPLETED',__completedAt:'',__cycleEndAt:'',__terminal:hintedTerminal,__workflow:[],__error:'No workflow data'};
  const decisions=entries.map(entry=>upper(xmlValue(entry,'Decision'))),submittedIndex=decisions.indexOf('SUBMITTED');
  const submittedEntry=submittedIndex>=0?entries[submittedIndex]:null;
  const submitted=workflowDate(xmlValue(submittedEntry,'ApprovalDate'));
  let lastAction=-1;const approvedDates=[],terminalDates={};
  entries.forEach((entry,index)=>{
    const decision=decisions[index],date=workflowDate(xmlValue(entry,'ApprovalDate'));
    if(decision&&decision!=='PENDING'&&decision!=='N/A')lastAction=index;
    if(['APPROVED','COMPLETED'].includes(decision)&&date)approvedDates.push(date);
    const terminalDecision=workflowStatusHint(decision);
    if(terminalDecision&&date&&(!terminalDates[terminalDecision]||workflowStamp(date)>workflowStamp(terminalDates[terminalDecision])))terminalDates[terminalDecision]=date;
  });
  const after=entries.slice(lastAction+1);
  const pending=after.find(entry=>{
    const decision=upper(xmlValue(entry,'Decision')),approved=workflowDate(xmlValue(entry,'ApprovalDate'));
    return (!decision||decision==='PENDING')&&!approved&&['DescriptionTask','ApproverTeam','Approver','PendingDays'].some(name=>xmlValue(entry,name));
  })||null;
  const lastDecision=lastAction>=0?decisions[lastAction]:'',xmlTerminal=workflowStatusHint(lastDecision),terminal=hintedTerminal||xmlTerminal;
  const completedAt=approvedDates.reduce((latest,date)=>!latest||workflowStamp(date)>workflowStamp(latest)?date:latest,'');
  const completed=terminal==='COMPLETED'||(!terminal&&lastDecision==='APPROVED'&&!pending);
  const cycleEndAt=completed?completedAt:(terminalDates[terminal]||'');
  return {
    'Submit Date':submitted,
    'Approver Team':terminal?'':xmlValue(pending,'ApproverTeam'),
    'Assigned Approver':terminal?'':xmlValue(pending,'Approver'),
    'Pending Days':terminal?'':xmlValue(pending,'PendingDays'),
    'Aging':'',
    'Cycle Time':'',
    __completed:completed,
    __completedAt:completedAt,
    __cycleEndAt:cycleEndAt,
    __terminal:terminal,
    __workflow:workflowHistory(entries)
  };
}

function odataLookupUrl(endpoint,field,value){
  const literal=clean(value).replaceAll("'","''"),filter=`${field}  eq '${literal}'`;return `${endpoint}?$filter=${encodeURIComponent(filter)}`;
}

async function fetchOdataXml(url,signal,label){
  let response;
  try{response=await pageFetch(url,{credentials:'same-origin',cache:'no-store',signal,headers:{Accept:'application/atom+xml,application/xml,text/xml'}})}
  catch(err){if(signal.aborted)throw err;const e=new Error('Fiori session unavailable or request blocked.');e.auth=true;throw e}
  const text=await response.text(),type=(response.headers.get('Content-Type')||'').toLowerCase();
  if(response.status===401||response.status===403||type.includes('text/html')||/^\s*<!doctype\s+html/i.test(text)||/^\s*<html/i.test(text)){
    const err=new Error('Fiori session expired. Return to Fiori and sign in again.');err.auth=true;throw err;
  }
  if(!response.ok)throw new Error(`${label} returned HTTP ${response.status}.`);
  if(!/<(?:[A-Za-z0-9_-]+:)?feed\b/i.test(text)&&!/<(?:[A-Za-z0-9_-]+:)?entry\b/i.test(text))throw new Error(`${label} returned an unexpected response.`);
  return text;
}

async function fetchWorkflow(nsr,signal,statusHint){
  const text=await fetchOdataXml(odataLookupUrl(WORKFLOW_ODATA,'Nsrnum',nsr),signal,'Workflow service');
  return parseWorkflowXml(text,statusHint);
}

async function fetchNsrEnrichment(tempId,signal){
  if(!clean(tempId))return {category:'',ecd:''};
  const text=await fetchOdataXml(odataLookupUrl(NSR_DETAIL_ODATA,'TempId',tempId),signal,'NSR detail service');
  const doc=new DOMParser().parseFromString(text,'application/xml');
  if(doc.getElementsByTagName('parsererror').length)throw new Error('NSR detail service returned invalid XML.');
  const entry=doc.getElementsByTagNameNS('*','entry')[0];
  return {category:xmlValue(entry,'NsrCategory'),ecd:workflowDate(xmlValue(entry,'HwEngCommit'))};
}

function mergeCycle(nsr,live,details){
  const detail=details.get(upper(nsr))||{},row={'NSR#':nsr,...live};
  if(!row['Submit Date'])row['Submit Date']=detail['Submit Date']||'';
  DETAIL_FIELDS.forEach(field=>{if(field!=='NSR#'&&!LIVE_FIELDS.includes(field))row[field]=detail[field]||''});
  row['Task Status']=detail['Task Status']||({COMPLETED:'15-Completed',CANCELLED:'0-Cancelled',REJECTED:'0-Rejected'}[row.__terminal]||'');
  row['ECD']=row.__ecd||'';
  if(row.__terminal||row.__completed){row['Aging']='';row['Cycle Time']=row.__cycleEndAt?elapsedDays(row['Submit Date'],row.__cycleEndAt):''}
  else{row['Aging']=elapsedDays(row['Submit Date']);row['Cycle Time']=row.__ecd?elapsedDays(row['Submit Date'],row.__ecd):''}
  return row;
}

function setCycleBusy(busy){
  $id('runCycleBtn').disabled=busy;$id('cancelCycleBtn').disabled=!busy;$id('cycleInput').disabled=busy;
  $id('cycleBadge').textContent=busy?'Querying':'Ready';
}

function setCycleProgress(done,total,message){
  const progress=$id('cycleProgress');progress.max=Math.max(1,total);progress.value=done;
  $id('cycleStatus').textContent=message;$id('cycleBadge').textContent=total?`${done}/${total}`:'Ready';
}

function cycleError(err,statusHint=''){
  const message=clean(err&&err.message)||'Lookup failed',terminal=workflowStatusHint(statusHint);
  return {'Submit Date':'','Approver Team':'','Assigned Approver':'','Pending Days':'','Aging':'','Cycle Time':'',__completed:terminal==='COMPLETED',__completedAt:'',__cycleEndAt:'',__terminal:terminal,__error:message};
}

async function runCycleLookup(nsrs){
  const parsed=parseNsrInput(Array.isArray(nsrs)?nsrs.join('\n'):$id('cycleInput').value);
  if(!parsed.valid.length){toast('Enter at least one valid NSR#.',true);return}
  if(parsed.invalid.length)toast(`${parsed.invalid.length} invalid value${parsed.invalid.length===1?' was':'s were'} ignored.`,true);
  const total=parsed.valid.length;
  if(total>CYCLE_LIMIT){const message=`A maximum of ${CYCLE_LIMIT} NSRs can be queried at once. Reduce the list and try again.`;unsafeWindow.alert(message);setCycleProgress(0,0,message);return}
  if(total>CYCLE_WARN_AT&&!unsafeWindow.confirm(`You are about to query ${total.toLocaleString()} NSRs from SAP. This may take some time. Continue?`)){
    setCycleProgress(0,0,`Query cancelled. ${total.toLocaleString()} NSRs were not sent to SAP.`);return;
  }
  if(state.cycleAbort)state.cycleAbort.abort();
  const run=++state.cycleRun,controller=new unsafeWindow.AbortController();state.cycleAbort=controller;state.cycleRows=[];
  const details=new Map(state.rows.map(row=>[upper(row['NSR#']),row])),results=new Array(total),workers=Math.min(CYCLE_CONCURRENCY,total);
  let next=0,done=0,stoppedForAuth=false,lastPaint=0;
  setCycleBusy(true);setCycleProgress(0,total,`Starting ${total.toLocaleString()} live lookup${total===1?'':'s'} · up to ${workers} requests at once…`);renderCycleTable();
  async function worker(){
    while(!controller.signal.aborted&&run===state.cycleRun&&!stoppedForAuth){
      const index=next++;if(index>=total)return;
      const nsr=parsed.valid[index],detail=details.get(upper(nsr)),statusHint=workflowStatusHint(detail&&detail['Task Status']);
      let live;
      try{live=await fetchWorkflow(nsr,controller.signal,statusHint)}
      catch(err){
        if(controller.signal.aborted)return;
        live=cycleError(err,statusHint);if(err.auth){stoppedForAuth=true;controller.abort()}
      }
      let categoryError='';live['NSR Category']='';live.__ecd='';
      if(!stoppedForAuth&&clean(detail&&detail['Temp Id#'])){
        try{const enrichment=await fetchNsrEnrichment(detail['Temp Id#'],controller.signal);live['NSR Category']=enrichment.category;live.__ecd=enrichment.ecd}
        catch(err){
          if(controller.signal.aborted)return;
          categoryError=clean(err&&err.message)||'NSR Category unavailable';if(err.auth){stoppedForAuth=true;controller.abort()}
        }
      }
      if(categoryError)live.__categoryError=categoryError;
      if(run!==state.cycleRun)return;
      results[index]=mergeCycle(nsr,live,details);done++;state.cycleRows=results.filter(Boolean);
      const now=Date.now();if(now-lastPaint>200||done===total||stoppedForAuth){renderCycleTable();lastPaint=now}
      if(!stoppedForAuth)setCycleProgress(done,total,`Queried ${done.toLocaleString()} of ${total.toLocaleString()} · up to ${workers} requests at once`);
    }
  }
  await Promise.all(Array.from({length:workers},()=>worker()));
  if(run!==state.cycleRun)return;
  state.cycleRows=results.filter(Boolean);
  const cancelled=controller.signal.aborted&&!stoppedForAuth,failed=state.cycleRows.filter(row=>row.__error||row.__categoryError).length;
  state.cycleAbort=null;setCycleBusy(false);renderCycleTable();
  if(stoppedForAuth){setCycleProgress(done,total,'Stopped because the Fiori session is unavailable. Return to Fiori, sign in, and run the query again.');toast('Fiori session unavailable.',true)}
  else if(cancelled)setCycleProgress(done,total,`Cancelled after ${done.toLocaleString()} of ${total.toLocaleString()} lookups.`);
  else{setCycleProgress(done,total,`${done.toLocaleString()} live lookup${done===1?'':'s'} completed${failed?` · ${failed.toLocaleString()} unavailable`:''}.`);toast(`${done.toLocaleString()} cycle time row${done===1?'':'s'} loaded${failed?` · ${failed.toLocaleString()} unavailable`:''}.`,failed>0)}
}

function cancelCycleLookup(){
  if(!state.cycleAbort)return;state.cycleAbort.abort();$id('cycleStatus').textContent='Cancelling active requests…';
}

function compareCycle(a,b,field){
  if(['Pending Days','Aging','Cycle Time'].includes(field))return (Number(a[field])||0)-(Number(b[field])||0);
  if(field==='ECD'||field.includes('Date'))return dateNumber(a[field])-dateNumber(b[field]);
  if(field==='Task Status')return compareStatus(a[field],b[field]);
  return collator.compare(clean(a[field]),clean(b[field]));
}

function cycleRows(){
  const query=clean($id('cycleSearch').value).toLowerCase();
  const rows=query?state.cycleRows.filter(row=>CYCLE_FIELDS.some(field=>clean(row[field]).toLowerCase().includes(query))):[...state.cycleRows];
  const {field,dir}=state.cycleSort;return rows.sort((a,b)=>compareCycle(a,b,field)*(dir==='asc'?1:-1));
}

function cycleCell(row,field){
  if(field==='Task Status')return statusPill(row[field]);
  if(field==='NSR Title'&&clean(row[field])&&clean(row['Temp Id#'])&&clean(row['NSR#'])){
    const href=`${unsafeWindow.location.origin}${FIORI_DETAIL}${encodeURIComponent(clean(row['Temp Id#']))}/${encodeURIComponent(clean(row['NSR#']))}/Search`;
    return `<a class="ct-link" data-nsr-detail="${esc(row['NSR#'])}" href="${esc(href)}" target="_blank" rel="noopener noreferrer" title="Open ${esc(row['NSR#'])} in Fiori">${esc(row[field])}</a>`;
  }
  if(['Aging','Cycle Time'].includes(field)&&clean(row[field])&&Array.isArray(row.__workflow)&&row.__workflow.length){
    return `<button class="ct-link" type="button" data-wf-nsr="${esc(row['NSR#'])}" title="View full workflow for ${esc(row['NSR#'])}">${esc(row[field])}</button>`;
  }
  return esc(row[field]);
}

function cycleCellClass(row,field){
  const aging=clean(row['Aging']),cycle=clean(row['Cycle Time']);
  return ['Aging','Cycle Time'].includes(field)&&aging&&cycle&&Number(aging)>Number(cycle)?'duration-over':'';
}

function openWorkflow(nsr,trigger){
  const row=state.cycleRows.find(item=>upper(item['NSR#'])===upper(nsr)),stages=row&&Array.isArray(row.__workflow)?row.__workflow:[];
  if(!stages.length){toast('Workflow detail is unavailable for this NSR.',true);return}
  const head=`<thead><tr>${WF_FIELDS.map(field=>`<th scope="col">${esc(field)}</th>`).join('')}</tr></thead>`;
  const body=`<tbody>${stages.map(stage=>`<tr>${WF_FIELDS.map(field=>`<td>${esc(stage[field])}</td>`).join('')}</tr>`).join('')}</tbody>`;
  $id('wfTitle').textContent=`${clean(nsr)} Workflow Detail`;$id('wfMeta').textContent=`${stages.length.toLocaleString()} workflow record${stages.length===1?'':'s'}`;
  $id('wfTable').innerHTML=head+body;wfRows=stages;wfTrigger=trigger||document.activeElement;$id('wfModal').hidden=false;document.body.classList.add('wf-open');$id('wfClose').focus();
}

function closeWorkflow(){
  if($id('wfModal').hidden)return;$id('wfModal').hidden=true;document.body.classList.remove('wf-open');
  if(wfTrigger&&wfTrigger.isConnected)wfTrigger.focus();wfTrigger=null;wfRows=[];
}

function renderCycleTable(){
  const rows=cycleRows(),sort=state.cycleSort;
  const cols=`<colgroup>${CYCLE_WIDTHS.map(width=>`<col style="width:${width}px">`).join('')}</colgroup>`;
  const head=`<thead><tr>${CYCLE_FIELDS.map(field=>`<th scope="col" title="${esc(field)}" data-cycle-sort="${esc(field)}" class="${sort.field===field?'sorted':''}" aria-sort="${sort.field===field?(sort.dir==='asc'?'ascending':'descending'):'none'}">${esc(field)}<span class="sort-mark">${sort.field===field?(sort.dir==='asc'?'▲':'▼'):'↕'}</span></th>`).join('')}</tr></thead>`;
  const body=rows.length?rows.map(row=>`<tr>${CYCLE_FIELDS.map(field=>`<td class="${cycleCellClass(row,field)}" title="${esc(row[field])}">${cycleCell(row,field)}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${CYCLE_FIELDS.length}"><div class="empty">No cycle time results yet.</div></td></tr>`;
  $id('cycleTable').innerHTML=cols+head+`<tbody>${body}</tbody>`;
  const failed=state.cycleRows.filter(row=>row.__error||row.__categoryError).length;
  $id('cycleCount').textContent=`${rows.length.toLocaleString()} shown · ${state.cycleRows.length.toLocaleString()} queried${failed?` · ${failed.toLocaleString()} unavailable`:''}`;
  $id('copyCycleBtn').disabled=!rows.length;$id('exportCycleBtn').disabled=!rows.length;
}

function sortCycle(field){
  if(state.cycleSort.field===field)state.cycleSort.dir=state.cycleSort.dir==='asc'?'desc':'asc';
  else state.cycleSort={field,dir:field==='ECD'||field.includes('Date')?'desc':'asc'};
  renderCycleTable();
}

async function writeClipboard(text){
  if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
  const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(ta);ta.select();
  try{if(!document.execCommand('copy'))throw new Error('Copy was blocked by the browser.')}finally{ta.remove()}
}

async function copyWorkflow(){
  if(!wfRows.length)return;
  const text=[WF_FIELDS.join('\t'),...wfRows.map(row=>WF_FIELDS.map(field=>tsvValue(row[field])).join('\t'))].join('\r\n');
  try{await writeClipboard(text);toast(`${wfRows.length.toLocaleString()} workflow record${wfRows.length===1?'':'s'} copied.`)}catch(err){toast(err.message||'Copy failed.',true)}
}

async function copyCycleRows(){
  const rows=cycleRows(),text=[CYCLE_FIELDS.join('\t'),...rows.map(row=>CYCLE_FIELDS.map(field=>tsvValue(row[field])).join('\t'))].join('\r\n');
  try{await writeClipboard(text);toast(`${rows.length.toLocaleString()} cycle time row${rows.length===1?'':'s'} copied.`)}catch(err){toast(err.message||'Copy failed.',true)}
}

function exportCycleRows(){
  const rows=cycleRows();if(!rows.length)return;
  if(!window.XLSX){toast('The XLSX library did not load.',true);return}
  const data=rows.map(row=>Object.fromEntries(CYCLE_FIELDS.map(field=>[field,row[field]??'']))),sheet=XLSX.utils.json_to_sheet(data,{header:CYCLE_FIELDS});
  sheet['!cols']=CYCLE_WIDTHS.map(width=>({wch:Math.max(10,Math.round(width/7))}));
  const book=XLSX.utils.book_new();XLSX.utils.book_append_sheet(book,sheet,'NSR Cycle Time');
  const now=new Date(),stamp=`${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  XLSX.writeFile(book,`NSR_Cycle_Time_${stamp}.xlsx`,{compression:true});toast(`${rows.length.toLocaleString()} rows exported.`);
}

function sendDetailToCycle(){
  const nsrs=currentTableRows().map(row=>clean(row['NSR#'])).filter(Boolean);if(!nsrs.length){toast('No visible NSR Detail rows to query.',true);return}
  $id('cycleInput').value=nsrs.join('\n');switchTab('cycle');runCycleLookup(nsrs);
}
function bindEvents(){
  $id('rawFile').addEventListener('change',handleUpload);
  $id('resetBtn').addEventListener('click',resetFilters);
  $id('globalSearch').addEventListener('input',applyFilters);
  $id('tableSearch').addEventListener('input',renderTable);
  $id('copyBtn').addEventListener('click',copyRows);
  $id('sendCycleBtn').addEventListener('click',sendDetailToCycle);
  $id('runCycleBtn').addEventListener('click',()=>runCycleLookup());
  $id('cancelCycleBtn').addEventListener('click',cancelCycleLookup);
  $id('copyCycleBtn').addEventListener('click',copyCycleRows);
  $id('exportCycleBtn').addEventListener('click',exportCycleRows);
  $id('cycleSearch').addEventListener('input',renderCycleTable);
  $id('cycleTable').addEventListener('click',e=>{const trigger=e.target.closest('[data-wf-nsr]');if(trigger)openWorkflow(trigger.dataset.wfNsr,trigger)});
  $id('wfCopy').addEventListener('click',copyWorkflow);
  $id('wfModal').addEventListener('click',e=>{if(e.target.closest('[data-wf-close]'))closeWorkflow()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$id('wfModal').hidden)closeWorkflow()});
  document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>switchTab(button.dataset.tab)));
  document.addEventListener('click',e=>{
    const status=e.target.closest('[data-status]');if(status){toggleStatus(status.dataset.status);return}
    const drill=e.target.closest('[data-drill-id]');if(drill){drillFilter(drill.dataset.drillId,drill.dataset.drillValue,e.ctrlKey||e.metaKey);return}
    const cycleTh=e.target.closest('th[data-cycle-sort]');if(cycleTh){sortCycle(cycleTh.dataset.cycleSort);return}
    const th=e.target.closest('th[data-sort]');if(th){sortTable(th.dataset.sort);return}
    const remove=e.target.closest('[data-remove-filter]');if(remove){
      const select=$id(remove.dataset.removeFilter);[...select.options].forEach(o=>{if(o.value===remove.dataset.removeValue)o.selected=false});syncSelect(select.id);applyFilters();return;
    }
    if(e.target.closest('[data-remove-search]')||e.target.closest('[data-clear-search]')){$id('globalSearch').value='';applyFilters()}
  });
}

bindEvents();renderCycleTable();loadSapData();

}
})();
