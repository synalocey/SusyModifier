// ==UserScript==
// @name         NSR Flow Control Tower
// @version      26.8.26
// @description  NSR Flow Control Tower
// @author       Kyra
// @match        https://fep.lamresearch.com/*
// @run-at       document-start
// @noframes
// @downloadURL  https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/NSR_Control_Tower.user.js
// @updateURL    https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/NSR_Control_Tower.user.js
// @require      https://gcore.jsdelivr.net/npm/jquery@4.0.0/dist/jquery.min.js
// @require      https://gcore.jsdelivr.net/gh/synalocey/SusyModifier@master/chosen.jquery.js
// @require      https://gcore.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      127.0.0.1
// ==/UserScript==
/* globals jQuery, XLSX, GM, GM_info, GM_registerMenuCommand, GM_xmlhttpRequest, GM_getValue, GM_setValue, GM_deleteValue, unsafeWindow */

(function(){
'use strict';
const versionDateParts=String(typeof GM_info==='object'&&GM_info&&GM_info.script?GM_info.script.version:'').split('.').slice(0,3).map(Number);
const date_v=versionDateParts.length===3&&versionDateParts.every(Number.isFinite)?new Date(2000+versionDateParts[0],versionDateParts[1]-1,versionDateParts[2]):new Date(NaN);
const APP_PATH='/k1.png';
const BRIDGE_PATH='/k2.png';
const FLAG='nsrCtLaunch';
const BRIDGE_FLAG='nsrSapBridgeLaunch';
const FLP='/flp#ZNSR-display-1';
const PROBE="/sap/opu/odata/sap/ZNSR_CD_SRV/WorkflowSet/?$filter=Nsrnum%20%20eq%20%27%27";
const BRIDGE_URL='http://127.0.0.1:8765';
const BRIDGE_TOKEN_KEY='nsrSapGuiBridgeTokenV1';
const APP_CSS=`
.chosen-container{position:relative;display:inline-block;vertical-align:middle;font-size:13px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.chosen-container *{-webkit-box-sizing:border-box;box-sizing:border-box}.chosen-container .chosen-drop{position:absolute;top:100%;z-index:1010;width:100%;border:1px solid #aaa;border-top:0;background:#fff;-webkit-box-shadow:0 4px 5px rgb(0 0 0 / .15);box-shadow:0 4px 5px rgb(0 0 0 / .15);clip:rect(0,0,0,0);-webkit-clip-path:inset(100% 100%);clip-path:inset(100% 100%)}.chosen-container.chosen-with-drop .chosen-drop{clip:auto;-webkit-clip-path:none;clip-path:none}.chosen-container a{cursor:pointer}.chosen-container .search-choice .group-name,.chosen-container .chosen-single .group-name{margin-right:4px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:400;color:#999}.chosen-container .search-choice .group-name:after,.chosen-container .chosen-single .group-name:after{content:":";padding-left:2px;vertical-align:top}.chosen-container-single .chosen-single{position:relative;display:block;overflow:hidden;padding:0 0 0 8px;height:25px;border:1px solid #aaa;border-radius:5px;background-color:#fff;background:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#fff),color-stop(50%,#f6f6f6),color-stop(52%,#eee),to(#f4f4f4));background:linear-gradient(#fff 20%,#f6f6f6 50%,#eee 52%,#f4f4f4 100%);background-clip:padding-box;-webkit-box-shadow:0 0 3px #fff inset,0 1px 1px rgb(0 0 0 / .1);box-shadow:0 0 3px #fff inset,0 1px 1px rgb(0 0 0 / .1);color:#444;text-decoration:none;white-space:nowrap;line-height:24px}.chosen-container-single .chosen-default{color:#999}.chosen-container-single .chosen-single span{display:block;overflow:hidden;margin-right:26px;text-overflow:ellipsis;white-space:nowrap}.chosen-container-single .chosen-single-with-deselect span{margin-right:38px}.chosen-container-single .chosen-single abbr{position:absolute;top:6px;right:26px;display:block;width:12px;height:12px;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) -42px 1px no-repeat;font-size:1px}.chosen-container-single .chosen-single abbr:hover{background-position:-42px -10px}.chosen-container-single.chosen-disabled .chosen-single abbr:hover{background-position:-42px -10px}.chosen-container-single .chosen-single div{position:absolute;top:0;right:0;display:block;width:18px;height:100%}.chosen-container-single .chosen-single div b{display:block;width:100%;height:100%;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) no-repeat 0 2px}.chosen-container-single .chosen-search{position:relative;z-index:1010;margin:0;padding:3px 4px;white-space:nowrap}.chosen-container-single .chosen-search input[type="text"]{margin:1px 0;padding:4px 20px 4px 5px;width:100%;height:auto;outline:0;border:1px solid #aaa;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) no-repeat 100% -20px;font-size:1em;font-family:sans-serif;line-height:normal;border-radius:0}.chosen-container-single .chosen-drop{margin-top:-1px;border-radius:0 0 4px 4px;background-clip:padding-box}.chosen-container-single.chosen-container-single-nosearch .chosen-search{position:absolute;clip:rect(0,0,0,0);-webkit-clip-path:inset(100% 100%);clip-path:inset(100% 100%)}.chosen-container .chosen-results{color:#444;position:relative;overflow-x:hidden;overflow-y:auto;margin:0 4px 4px 0;padding:0 0 0 4px;max-height:600px;-webkit-overflow-scrolling:touch}.chosen-container .chosen-results li{display:none;margin:0;padding:5px 6px;list-style:none;line-height:15px;word-wrap:break-word;-webkit-touch-callout:none}.chosen-container .chosen-results li.active-result{display:list-item;cursor:pointer}.chosen-container .chosen-results li.disabled-result{display:list-item;color:#ccc;cursor:default}.chosen-container .chosen-results li.highlighted{background-color:#3875d7;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#3875d7),color-stop(90%,#2a62bc));background-image:linear-gradient(#3875d7 20%,#2a62bc 90%);color:#fff}.chosen-container .chosen-results li.no-results{color:#777;display:list-item;background:#f4f4f4}.chosen-container .chosen-results li.group-result{display:list-item;font-weight:700;cursor:default}.chosen-container .chosen-results li.group-option{padding-left:15px}.chosen-container .chosen-results li em{font-style:normal;text-decoration:underline}.chosen-container-multi .chosen-choices{position:relative;overflow:hidden;margin:0;padding:0 5px;width:100%;height:auto;border:1px solid #aaa;background-color:#fff;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(1%,#eee),color-stop(15%,#fff));background-image:linear-gradient(#eee 1%,#fff 15%);cursor:text}.chosen-container-multi .chosen-choices li{float:left;list-style:none}.chosen-container-multi .chosen-choices li.search-field{margin:0;padding:0;white-space:nowrap}.chosen-container-multi .chosen-choices li.search-field input[type="text"]{margin:1px 0;padding:0;height:25px;outline:0;border:0!important;background:transparent!important;-webkit-box-shadow:none;box-shadow:none;color:#999;font-size:100%;font-family:sans-serif;line-height:normal;border-radius:0;width:25px}.chosen-container-multi .chosen-choices li.search-choice{position:relative;margin:3px 5px 3px 0;padding:3px 20px 3px 5px;border:1px solid #aaa;max-width:100%;border-radius:3px;background-color:#eee;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),to(#eee));background-image:linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);background-size:100% 19px;background-repeat:repeat-x;background-clip:padding-box;-webkit-box-shadow:0 0 2px #fff inset,0 1px 0 rgb(0 0 0 / .05);box-shadow:0 0 2px #fff inset,0 1px 0 rgb(0 0 0 / .05);color:#333;line-height:13px;cursor:default}.chosen-container-multi .chosen-choices li.search-choice span{word-wrap:break-word}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close{position:absolute;top:4px;right:3px;display:block;width:12px;height:12px;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) -42px 1px no-repeat;font-size:1px}.chosen-container-multi .chosen-choices li.search-choice .search-choice-close:hover{background-position:-42px -10px}.chosen-container-multi .chosen-choices li.search-choice-disabled{padding-right:5px;border:1px solid #ccc;background-color:#e4e4e4;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#f4f4f4),color-stop(50%,#f0f0f0),color-stop(52%,#e8e8e8),to(#eee));background-image:linear-gradient(#f4f4f4 20%,#f0f0f0 50%,#e8e8e8 52%,#eee 100%);color:#666}.chosen-container-multi .chosen-choices li.search-choice-focus{background:#d4d4d4}.chosen-container-multi .chosen-choices li.search-choice-focus .search-choice-close{background-position:-42px -10px}.chosen-container-multi .chosen-results{margin:0;padding:0}.chosen-container-multi .chosen-drop .result-selected{display:list-item;color:#ccc;cursor:default}.chosen-container-active .chosen-single{border:1px solid #5897fb;-webkit-box-shadow:0 0 5px rgb(0 0 0 / .3);box-shadow:0 0 5px rgb(0 0 0 / .3)}.chosen-container-active.chosen-with-drop .chosen-single{border:1px solid #aaa;border-bottom-right-radius:0;border-bottom-left-radius:0;background-image:-webkit-gradient(linear,left top,left bottom,color-stop(20%,#eee),color-stop(80%,#fff));background-image:linear-gradient(#eee 20%,#fff 80%);-webkit-box-shadow:0 1px 0 #fff inset;box-shadow:0 1px 0 #fff inset}.chosen-container-active.chosen-with-drop .chosen-single div{border-left:none;background:#fff0}.chosen-container-active.chosen-with-drop .chosen-single div b{background-position:-18px 2px}.chosen-container-active .chosen-choices{border:1px solid #5897fb;-webkit-box-shadow:0 0 5px rgb(0 0 0 / .3);box-shadow:0 0 5px rgb(0 0 0 / .3)}.chosen-container-active .chosen-choices li.search-field input[type="text"]{color:#222!important}.chosen-disabled{opacity:0.5!important;cursor:default}.chosen-disabled .chosen-single{cursor:default}.chosen-disabled .chosen-choices .search-choice .search-choice-close{cursor:default}.chosen-rtl{text-align:right}.chosen-rtl .chosen-single{overflow:visible;padding:0 8px 0 0}.chosen-rtl .chosen-single span{margin-right:0;margin-left:26px;direction:rtl}.chosen-rtl .chosen-single-with-deselect span{margin-left:38px}.chosen-rtl .chosen-single div{right:auto;left:3px}.chosen-rtl .chosen-single abbr{right:auto;left:26px}.chosen-rtl .chosen-choices li{float:right}.chosen-rtl .chosen-choices li.search-field input[type="text"]{direction:rtl}.chosen-rtl .chosen-choices li.search-choice{margin:3px 5px 3px 0;padding:3px 5px 3px 19px}.chosen-rtl .chosen-choices li.search-choice .search-choice-close{right:auto;left:4px}.chosen-rtl.chosen-container-single .chosen-results{margin:0 0 4px 4px;padding:0 4px 0 0}.chosen-rtl .chosen-results li.group-option{padding-right:15px;padding-left:0}.chosen-rtl.chosen-container-active.chosen-with-drop .chosen-single div{border-right:none}.chosen-rtl .chosen-search input[type="text"]{padding:4px 5px 4px 20px;background:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==) no-repeat -30px -20px;direction:rtl}.chosen-rtl.chosen-container-single .chosen-single div b{background-position:6px 2px}.chosen-rtl.chosen-container-single.chosen-with-drop .chosen-single div b{background-position:-12px 2px}@media only screen and (-webkit-min-device-pixel-ratio:1.5),only screen and (min-resolution:144dpi),only screen and (min-resolution:1.5dppx){.chosen-rtl .chosen-search input[type="text"],.chosen-container-single .chosen-single abbr,.chosen-container-single .chosen-single div b,.chosen-container-single .chosen-search input[type="text"],.chosen-container-multi .chosen-choices .search-choice .search-choice-close,.chosen-container .chosen-results-scroll-down span,.chosen-container .chosen-results-scroll-up span{background-image:url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==)!important;background-size:52px 37px!important;background-repeat:no-repeat!important}}
:root{
  --bg:#f3f7fb;--panel:#fff;--ink:#0f172a;--muted:#64748b;--line:#d8e3ee;
  --navy:#052e44;--blue:#2563eb;--teal:#0f766e;--cyan:#0891b2;--green:#16a34a;
  --amber:#d97706;--red:#dc2626;--purple:#7c3aed;--shadow:0 14px 34px rgba(15,23,42,.08);
  --radius:18px;--side:350px
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:"Segoe UI",Arial,"Microsoft YaHei",sans-serif}
button,input,select{font:inherit}
button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid rgba(14,165,233,.32);outline-offset:2px}
.hero{background:linear-gradient(128deg,#052e44 0%,#075985 50%,#0f766e 100%);color:#fff;padding:24px 30px 26px;box-shadow:0 9px 24px rgba(3,46,70,.18)}
.hero-inner{max-width:1900px;margin:auto;display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
.hero h1{margin:8px 0 5px;font-size:30px;letter-spacing:-.5px}
.hero p{margin:0;color:#d8fbf5;font-size:13px;line-height:1.55;max-width:1050px}
.tag{display:inline-flex;align-items:center;border:1px solid #ffffff55;background:#ffffff1f;border-radius:999px;padding:4px 10px;margin:0 6px 4px 0;font-size:11px;font-weight:800;letter-spacing:.2px}
.hero-source{min-width:270px;background:#ffffff16;border:1px solid #ffffff35;border-radius:14px;padding:12px 14px;text-align:right}
.hero-source small{display:block;color:#cffafe;font-size:10px;text-transform:uppercase;letter-spacing:.7px;font-weight:800}
.hero-source strong{display:block;font-size:14px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:390px}
.layout{display:grid;grid-template-columns:var(--side) minmax(0,1fr);gap:16px;max-width:1900px;margin:auto;padding:16px}
.side,.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow)}
.side{align-self:start;position:sticky;top:12px;max-height:calc(100vh - 24px);overflow:auto;padding:15px;scrollbar-width:thin}
.main{display:grid;gap:16px;min-width:0}
.section-title{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
.section-title h2,.side h2{font-size:17px;margin:0;letter-spacing:-.15px}
.section-title p{margin:3px 0 0;color:var(--muted);font-size:12px}
.side-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:15px 0 8px}
.upload-box{border:1.5px dashed #9fb6c8;background:linear-gradient(180deg,#fbfdff,#f5fafc);border-radius:14px;padding:12px;margin-top:12px}
.upload-box label{display:block;font-size:11px;font-weight:900;color:#334155;text-transform:uppercase;letter-spacing:.45px;margin-bottom:7px}
.upload-box input{display:block;width:100%;font-size:11px;color:#475569}
.upload-box input::file-selector-button{border:0;border-radius:8px;background:#e2e8f0;color:#0f172a;font-weight:800;padding:7px 9px;margin-right:7px;cursor:pointer}
.source-status{margin-top:10px;border-left:4px solid var(--blue);background:#eff6ff;color:#1e3a8a;border-radius:10px;padding:9px 10px;font-size:11px;line-height:1.5}
.source-status.loading{border-color:var(--amber);background:#fffbeb;color:#78350f}
.source-status.error{border-color:var(--red);background:#fef2f2;color:#991b1b}
.source-status.ok{border-color:var(--teal);background:#ecfdf5;color:#14532d}
.btn{border:0;border-radius:10px;background:var(--teal);color:#fff;font-weight:850;padding:9px 11px;cursor:pointer;transition:transform .12s ease,filter .12s ease}
.btn:hover{filter:brightness(1.05);transform:translateY(-1px)}
.btn.light{background:#e2e8f0;color:#0f172a}.btn.blue{background:var(--blue)}
.btn.small{padding:6px 9px;font-size:11px}.btn.wide{width:100%;margin-top:8px}
.filter-group{border-top:1px solid #edf2f7;padding:9px 0 2px}
.filter-label{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:5px}
.filter-label label{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.45px;font-weight:900;cursor:pointer}
.filter-label button{border:0;background:transparent;color:var(--blue);padding:2px;font-size:10px;font-weight:800;cursor:pointer}
.filter-select{width:100%;min-height:38px;border:1px solid var(--line);border-radius:9px;background:#fff;padding:6px}
.quick-pick{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-top:6px}
.quick-pick span{font-size:9px;color:var(--muted);font-weight:900;text-transform:uppercase;letter-spacing:.35px}
.quick-pick button{border:1px solid #cbd5e1;background:#f8fafc;color:#334155;border-radius:7px;padding:4px 7px;font-size:10px;font-weight:800;cursor:pointer}
.quick-pick button:hover{border-color:#38bdf8;color:#0369a1}.quick-pick button.active{border-color:var(--teal);background:#ccfbf1;color:#115e59}.quick-pick button.partial{border-color:#7dd3fc;background:#e0f2fe;color:#075985}
.quick-search{width:100%;border:1px solid var(--line);border-radius:10px;background:#fff;padding:9px 10px;font-size:12px;color:var(--ink)}
.chosen-container{font-size:12px!important;width:100%!important}
.chosen-container-multi .chosen-choices{min-height:38px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:#fff!important;background-image:none!important;box-shadow:none!important;padding:3px 5px!important}
.chosen-container-active .chosen-choices{border-color:#38bdf8!important;box-shadow:0 0 0 3px rgba(56,189,248,.13)!important}
.chosen-container-multi .chosen-choices li.search-choice{border:0!important;background:#e0f2fe!important;color:#075985!important;border-radius:7px!important;box-shadow:none!important;padding:5px 22px 5px 7px!important;font-weight:700!important}
.chosen-container-multi .chosen-choices li.search-choice .search-choice-close{top:50%!important;right:5px!important;width:14px!important;height:14px!important;margin-top:-7px!important;background:none!important;font-size:0!important}
.chosen-container-multi .chosen-choices li.search-choice .search-choice-close::after{content:"×";display:block;color:#0369a1;font-size:15px;line-height:13px;text-align:center;font-weight:400;pointer-events:none}
.chosen-container-multi .chosen-choices li.search-choice .search-choice-close:hover::after{color:var(--red)}
.chosen-container .chosen-drop{border:1px solid #b8c8d8!important;border-radius:0 0 11px 11px!important;box-shadow:0 12px 26px rgba(15,23,42,.16)!important}
.chosen-container .chosen-results li.highlighted{background:#0f766e!important;background-image:none!important}
.chosen-container .chosen-results{max-height:250px!important}
.chosen-container-multi .chosen-choices li.search-field input[type=text]{height:28px!important;color:#64748b!important;font-family:inherit!important}
.active-filters{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
.filter-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #bae6fd;background:#f0f9ff;color:#075985;border-radius:999px;padding:4px 7px 4px 9px;font-size:10px;font-weight:750;max-width:100%}
.filter-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.filter-chip button{border:0;background:transparent;color:#075985;cursor:pointer;padding:0;font-size:14px;line-height:1}
.all-chip{font-size:11px;color:var(--muted);padding:3px 0}
.hint{border-left:4px solid var(--teal);background:#ecfeff;color:#164e63;border-radius:10px;padding:9px 10px;font-size:11px;line-height:1.5;margin-top:10px}
.kpis{display:grid;grid-template-columns:repeat(5,minmax(125px,1fr));gap:12px}
.kpi{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);padding:13px 14px;min-height:100px;position:relative;overflow:hidden}
.kpi::after{content:"";position:absolute;width:64px;height:64px;border-radius:50%;right:-25px;top:-24px;background:var(--kpi-color,#2563eb);opacity:.12}
.kpi small{display:block;color:var(--muted);font-size:10px;text-transform:uppercase;letter-spacing:.5px;font-weight:900}
.kpi strong,.kpi-num{display:block;font-size:27px;line-height:1;margin:11px 0 6px;color:var(--kpi-color,#2563eb)}
.kpi-num{border:0;background:transparent;padding:0;font-weight:700;cursor:pointer;text-align:left}.kpi-num:hover{text-decoration:underline;text-underline-offset:3px}
.kpi span{font-size:10px;color:#64748b}
.card{padding:16px;min-width:0}
.context-badge{display:inline-flex;align-items:center;gap:7px;background:#ecfdf5;color:#166534;border:1px solid #bbf7d0;border-radius:999px;padding:5px 10px;font-size:11px;font-weight:850;white-space:nowrap}
.context-badge::before{content:"";width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 4px rgba(34,197,94,.12)}
.pivot-grid{display:grid;grid-template-columns:repeat(3,minmax(260px,1fr));gap:12px}
.pivot-card{border:1px solid #dfe8f1;border-radius:14px;background:#fbfdff;min-width:0;overflow:hidden}
.pivot-head{display:flex;justify-content:space-between;align-items:center;gap:9px;padding:11px 12px 9px;border-bottom:1px solid #e8eef5;background:#fff}
.pivot-head h3{font-size:12px;margin:0;color:#334155}
.pivot-head span{font-size:10px;color:var(--muted);white-space:nowrap}
.pivot-list{padding:7px 9px 9px;max-height:310px;overflow:auto;scrollbar-width:thin}
.pivot-row{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(55px,1fr) 42px;gap:8px;align-items:center;padding:5px 3px;border-radius:7px}
.pivot-row:hover{background:#f1f5f9}
.pivot-label{font-size:11px;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pivot-bar{height:8px;background:#e7eef5;border-radius:999px;overflow:hidden}
.pivot-bar i{display:block;height:100%;min-width:3px;border-radius:999px;background:var(--bar,#0f766e)}
.pivot-count{border:0;background:#e0f2fe;color:#075985;border-radius:7px;padding:4px 6px;font-size:11px;font-weight:900;cursor:pointer;text-align:center;font-variant-numeric:tabular-nums}
.pivot-count:hover{background:#0f766e;color:#fff}
.empty{padding:28px 14px;text-align:center;color:var(--muted);font-size:12px}
.table-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:11px}
.toolbar-left,.toolbar-right{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.table-search{width:290px;max-width:60vw;border:1px solid var(--line);border-radius:10px;padding:9px 10px;font-size:12px}
.row-count{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums}
.table-wrap{overflow:auto;border:1px solid var(--line);border-radius:13px;max-height:660px;background:#fff;scrollbar-width:thin}
table{border-collapse:separate;border-spacing:0;table-layout:fixed;width:1658px;min-width:1658px;font-size:11px}
th,td{border-right:1px solid #e7edf4;border-bottom:1px solid #e7edf4;padding:6px 8px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
th{position:sticky;top:0;z-index:4;background:#f3f7fb;color:#334155;font-size:10px;text-transform:uppercase;letter-spacing:.25px;font-weight:900;cursor:pointer;user-select:none}
th:first-child,td:first-child{position:sticky;left:0;box-shadow:2px 0 0 #dbe5ee}
th:first-child{z-index:6}td:first-child{z-index:2;background:#fff}
th:hover{background:#e8f0f7}
th .sort-mark{margin-left:5px;color:#94a3b8}th.sorted .sort-mark{color:var(--blue)}
tbody tr:nth-child(even) td{background:#fbfdff}tbody tr:hover td{background:#f0fdfa}
.status-pill{display:inline-flex;align-items:center;border-radius:999px;padding:3px 7px;font-size:11px;font-weight:400;line-height:1.2;background:#dbeafe;color:#1d4ed8}
.status-pill.terminal{background:#dcfce7;color:#166534}.status-pill.stop{background:#fee2e2;color:#991b1b}.status-pill.unknown{background:#fef3c7;color:#92400e}
.footer{max-width:1900px;margin:auto;padding:0 18px 20px;color:#64748b;font-size:10px;line-height:1.5}
.toast{position:fixed;right:20px;bottom:20px;z-index:50;max-width:390px;background:#0f172a;color:#fff;border-radius:12px;padding:11px 14px;box-shadow:0 18px 36px rgba(15,23,42,.26);font-size:12px;line-height:1.45;opacity:0;transform:translateY(12px);pointer-events:none;transition:.2s ease}
.toast.show{opacity:1;transform:translateY(0)}.toast.error{background:#991b1b}
.loading-line{height:3px;position:fixed;left:0;top:0;z-index:99;background:#2dd4bf;width:0;transition:width .25s ease}.loading-line.on{width:72%;animation:loading 1.3s ease-in-out infinite}.loading-line.done{width:100%}
@keyframes loading{0%{opacity:.55}50%{opacity:1}100%{opacity:.55}}
@media(max-width:1450px){.pivot-grid{grid-template-columns:repeat(2,minmax(260px,1fr))}.kpis{grid-template-columns:repeat(3,1fr)}}
@media(max-width:980px){body{min-width:1030px}.hero-inner{display:block}.hero-source{margin-top:12px;text-align:left}.layout{grid-template-columns:320px minmax(680px,1fr);min-width:1030px}.side{position:sticky;top:12px;max-height:calc(100vh - 24px);overflow:auto}.pivot-grid{grid-template-columns:1fr}.kpis{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.hero{padding:20px 16px}.hero h1{font-size:24px}.layout{padding:10px}.kpis{grid-template-columns:1fr 1fr;gap:8px}.kpi{min-height:90px;padding:11px}.kpi strong,.kpi-num{font-size:23px}.table-search{width:100%;max-width:none}}
@media print{.side,.table-toolbar,.pivot-grid,.footer{display:none}.layout{display:block}.hero{background:#075985!important;-webkit-print-color-adjust:exact}.table-wrap{max-height:none;overflow:visible}table{width:100%;font-size:7px}th,td{position:static!important;white-space:normal}}


.tabs{position:sticky;top:0;z-index:40;display:flex;align-items:center;justify-content:space-between;gap:12px;background:#fff;border-bottom:1px solid var(--line);box-shadow:0 5px 16px rgba(15,23,42,.07);padding:9px max(16px,calc((100vw - 1900px)/2 + 16px))}
.tab-list{display:flex;gap:7px}.tab-btn{border:1px solid #cbd5e1;background:#f8fafc;color:#475569;border-radius:10px;padding:8px 13px;font-size:12px;font-weight:850;cursor:pointer}.tab-btn:hover{border-color:#38bdf8;color:#075985}.tab-btn.active{border-color:var(--teal);background:#ccfbf1;color:#115e59}
.tab-page{display:none}.tab-page.active{display:block}.cycle-shell{display:grid;gap:16px;max-width:1900px;margin:auto;padding:16px}
.cycle-label{display:block;color:#334155;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.45px;margin-bottom:6px}.cycle-input{display:block;width:100%;resize:vertical;min-height:120px;border:1px solid var(--line);border-radius:12px;background:#fff;color:var(--ink);padding:11px 12px;font:12px/1.55 Consolas,"Segoe UI",sans-serif}.cycle-input:focus{outline:3px solid rgba(14,165,233,.2);border-color:#38bdf8}
.cycle-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px}.cycle-note{color:var(--muted);font-size:10px}.cycle-progress{display:block;width:100%;height:8px;margin-top:12px;accent-color:var(--teal)}.cycle-status{margin-top:7px;color:var(--muted);font-size:11px;line-height:1.45}.cycle-wrap{max-height:690px}#cycleTable{width:2422px;min-width:2422px}
.ct-link{border:0;background:none;color:#0369a1;padding:0;font:inherit;font-weight:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}.ct-link:hover{color:#0f766e}.ct-link:focus-visible{outline:2px solid #38bdf8;outline-offset:3px;border-radius:2px}
.duration-over,.duration-over .ct-link{color:var(--red)!important}
.wf-modal[hidden]{display:none}.wf-modal{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:20px}.wf-bg{position:absolute;inset:0;width:100%;height:100%;border:0;background:rgba(15,23,42,.62);cursor:default}.wf-box{position:relative;display:flex;flex-direction:column;width:min(1180px,calc(100vw - 40px));max-height:calc(100vh - 40px);overflow:hidden;border:1px solid #cbd5e1;border-radius:16px;background:#fff;box-shadow:0 24px 80px rgba(15,23,42,.35)}.wf-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 17px;border-bottom:1px solid var(--line);background:#f8fafc}.wf-head h2{margin:0;color:#0f172a;font-size:17px}.wf-head p{margin:3px 0 0;color:var(--muted);font-size:11px}.wf-actions{display:flex;align-items:center;gap:8px}.wf-wrap{overflow:auto;max-height:calc(100vh - 120px)}#wfTable{width:1120px;min-width:1120px;table-layout:fixed}#wfTable th:nth-child(1){width:190px}#wfTable th:nth-child(2){width:120px}#wfTable th:nth-child(3){width:160px}#wfTable th:nth-child(4){width:95px}#wfTable th:nth-child(5){width:120px}#wfTable th:nth-child(6){width:435px}#wfTable td{white-space:normal;overflow-wrap:anywhere;vertical-align:top;line-height:1.45}#wfTable td:nth-child(6){white-space:pre-wrap}body.wf-open{overflow:hidden}.toast{z-index:1100}
#wfTable th{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.25;cursor:default}
.wf-box{width:min(1320px,calc(100vw - 40px))}#wfTable{width:1280px;min-width:1280px}#wfTable th:nth-child(4){width:160px}#wfTable th:nth-child(5){width:95px}#wfTable th:nth-child(6){width:120px}#wfTable th:nth-child(7){width:435px}#wfTable td:nth-child(6){white-space:normal}#wfTable td:nth-child(7){white-space:pre-wrap}
.btn:disabled{cursor:not-allowed;filter:none;transform:none;opacity:.48}
@media(max-width:980px){.tabs{min-width:1030px}.cycle-shell{min-width:1030px}}
`;
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
:root{--bg:#f3f7fb;--panel:#fff;--ink:#0f172a;--muted:#64748b;--line:#d8e3ee;--navy:#052e44;--blue:#2563eb;--teal:#0f766e;--green:#16a34a;--amber:#d97706;--red:#dc2626;--shadow:0 14px 34px rgba(15,23,42,.08);--radius:18px}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:"Segoe UI",Arial,"Microsoft YaHei",sans-serif}button,input,select,textarea{font:inherit}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid rgba(14,165,233,.3);outline-offset:2px}
.bridge-hero{background:linear-gradient(128deg,#052e44 0%,#075985 52%,#0f766e 100%);color:#fff;padding:24px 28px;box-shadow:0 9px 24px rgba(3,46,70,.18)}.bridge-hero-inner{max-width:1180px;margin:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:22px}.bridge-hero h1{margin:0 0 6px;font-size:29px;letter-spacing:-.45px}.bridge-hero p{max-width:720px;margin:0;color:#d8fbf5;font-size:13px;line-height:1.55}.bridge-hero-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
.bridge-shell{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;max-width:1180px;margin:auto;padding:18px}.bridge-card{min-width:0;background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow);padding:17px}.bridge-card.wide{grid-column:1/-1}.bridge-card h2{margin:0;font-size:17px}.bridge-card p{margin:4px 0 0;color:var(--muted);font-size:11px;line-height:1.5}.bridge-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:14px}
.bridge-btn{border:0;border-radius:10px;background:var(--teal);color:#fff;font-weight:800;padding:9px 12px;cursor:pointer;transition:transform .12s ease,filter .12s ease}.bridge-btn:hover{filter:brightness(1.06);transform:translateY(-1px)}.bridge-btn.blue{background:var(--blue)}.bridge-btn.light{background:#e2e8f0;color:#0f172a}.bridge-btn.ghost{border:1px solid #ffffff66;background:#ffffff18}.bridge-btn:disabled{cursor:not-allowed;opacity:.5;filter:none;transform:none}
.bridge-badge{display:inline-flex;align-items:center;gap:7px;border-radius:999px;background:#f1f5f9;color:#475569;padding:6px 10px;font-size:11px;font-weight:850;white-space:nowrap}.bridge-badge::before{content:"";width:8px;height:8px;border-radius:50%;background:#94a3b8}.bridge-badge.ok{background:#dcfce7;color:#166534}.bridge-badge.ok::before{background:var(--green)}.bridge-badge.warn{background:#fef3c7;color:#92400e}.bridge-badge.warn::before{background:var(--amber)}.bridge-badge.error{background:#fee2e2;color:#991b1b}.bridge-badge.error::before{background:var(--red)}
.bridge-status{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.bridge-status-item{border:1px solid #e2e8f0;border-radius:13px;background:#f8fafc;padding:11px}.bridge-status-item small{display:block;color:var(--muted);font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.45px}.bridge-status-item strong{display:block;margin-top:5px;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bridge-help{margin-top:11px;border-left:4px solid var(--teal);border-radius:10px;background:#ecfeff;color:#164e63;padding:9px 11px;font-size:11px;line-height:1.5}
.bridge-field{display:grid;gap:6px;margin-top:11px}.bridge-field label{color:#475569;font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:.4px}.bridge-field input,.bridge-field select,.bridge-field textarea{display:block;width:100%;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:var(--ink);padding:10px 11px;font-size:12px}.bridge-field textarea{min-height:145px;resize:vertical;font:11px/1.5 Consolas,"Courier New",monospace}.bridge-field input:disabled,.bridge-field select:disabled,.bridge-field textarea:disabled{background:#f1f5f9;color:#94a3b8}.bridge-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.bridge-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px}.bridge-inline{display:grid;grid-template-columns:1fr 110px;gap:10px}
.bridge-result{min-height:130px;max-height:320px;overflow:auto;margin:0;border:1px solid #dbe5ee;border-radius:13px;background:#071521;color:#d8fbf5;padding:12px;white-space:pre-wrap;overflow-wrap:anywhere;font:11px/1.55 Consolas,"Courier New",monospace}.bridge-note{color:var(--muted);font-size:10px;line-height:1.45}.bridge-divider{height:1px;background:#e2e8f0;margin:15px 0}.bridge-card details summary{cursor:pointer;color:#334155;font-size:12px;font-weight:800}.bridge-card details[open] summary{margin-bottom:10px}
@media(max-width:820px){.bridge-hero-inner{align-items:flex-start;flex-direction:column}.bridge-hero-actions{justify-content:flex-start}.bridge-shell{grid-template-columns:1fr}.bridge-card.wide{grid-column:auto}.bridge-status,.bridge-grid,.bridge-inline{grid-template-columns:1fr}}
`;
const BRIDGE_HTML=`
<header class="bridge-hero">
  <div class="bridge-hero-inner">
    <div><h1>SAP GUI Bridge</h1><p>Control the signed-in SAP GUI on this computer through the local PowerShell bridge. Commands stay on 127.0.0.1 and pairing runs automatically.</p></div>
    <div class="bridge-hero-actions">
      <button id="bridgeRefresh" class="bridge-btn ghost" type="button" data-bridge-action>Refresh</button>
    </div>
  </div>
</header>
<main class="bridge-shell">
  <section class="bridge-card wide">
    <div class="bridge-card-head"><div><h2>Connection</h2><p>Local service, browser authorization, and current SAP GUI availability.</p></div><span id="bridgeBadge" class="bridge-badge">Checking</span></div>
    <div class="bridge-status">
      <div class="bridge-status-item"><small>Local service</small><strong id="bridgeService">Checking 127.0.0.1:8765…</strong></div>
      <div class="bridge-status-item"><small>Browser pairing</small><strong id="bridgePairing">Not checked</strong></div>
      <div class="bridge-status-item"><small>SAP GUI</small><strong id="bridgeSap">Not checked</strong></div>
    </div>
    <div id="bridgeHelp" class="bridge-help">Start NSR_SAP_GUI_Bridge.ps1 before opening this page. Pairing starts automatically.</div>
    <div class="bridge-field"><label for="sapSession">SAP session</label><select id="sapSession" disabled><option value="">Connecting to the local bridge…</option></select></div>
  </section>

  <section class="bridge-card">
    <div class="bridge-card-head"><div><h2>Open Transaction</h2><p>Starts a transaction in the selected SAP GUI session.</p></div></div>
    <div class="bridge-field"><label for="sapTransaction">Transaction code</label><input id="sapTransaction" type="text" maxlength="20" placeholder="For example: VA03 or SE16N" autocomplete="off"></div>
    <div class="bridge-actions"><button id="sapRunTransaction" class="bridge-btn blue" type="button" data-bridge-action disabled>Open transaction</button></div>
    <p class="bridge-note">Enter the transaction code without /n. System commands and arbitrary PowerShell code are not accepted.</p>
  </section>

  <section class="bridge-card">
    <div class="bridge-card-head"><div><h2>Control Inspector</h2><p>Read or operate one SAP GUI Scripting control by its ID.</p></div></div>
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
    <div class="bridge-card-head"><div><h2>Result</h2><p>The latest response from the local bridge. SAP status-bar text is returned when available.</p></div></div>
    <pre id="sapResult" class="bridge-result" aria-live="polite">Waiting for the local bridge…</pre>
  </section>

  <section class="bridge-card wide">
    <details>
      <summary>Advanced: run a small action list</summary>
      <p>Allowed operations: setText, setKey, press, select, sendVKey, readText, and wait. The bridge runs at most 50 actions per request.</p>
      <div class="bridge-field"><label for="sapActions">JSON actions</label><textarea id="sapActions" spellcheck="false">[
  {"operation":"setText","controlId":"wnd[0]/usr/ctxtEXAMPLE","value":"12345"},
  {"operation":"press","controlId":"wnd[0]/tbar[1]/btn[8]"}
]</textarea></div>
      <div class="bridge-actions"><button id="sapRunActions" class="bridge-btn blue" type="button" data-bridge-action disabled>Run action list</button></div>
    </details>
  </section>
</main>`;
const launchLoops=new Set();
let bridgeBusy=false,bridgeSessions=[];

GM_registerMenuCommand('Open NSR Flow Control Tower',beginLaunch);
GM_registerMenuCommand('Open SAP GUI Bridge',beginBridgeLaunch);

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
  const title=document.createElement('title');title.textContent='NSR SAP GUI Bridge';
  const style=document.createElement('style');style.textContent=BRIDGE_CSS;
  document.head.replaceChildren(charset,viewport,title,style);document.body.innerHTML=BRIDGE_HTML;
  bindBridgeEvents();refreshBridge();
}

function bridgeId(id){return document.getElementById(id)}

function getBridgeToken(){
  try{return String(GM_getValue(BRIDGE_TOKEN_KEY,'')||'')}catch(_){return ''}
}

function setBridgeToken(token){
  try{GM_setValue(BRIDGE_TOKEN_KEY,String(token||''))}catch(_){/* ignore */}
}

function forgetBridgeToken(){
  try{GM_deleteValue(BRIDGE_TOKEN_KEY)}catch(_){/* ignore */}
}

function bridgeRequest(method,path,payload,auth,timeout){
  return new Promise((resolve,reject)=>{
    const modern=typeof GM==='object'&&GM&&typeof GM.xmlHttpRequest==='function'?GM.xmlHttpRequest.bind(GM):null;
    const legacy=typeof GM_xmlhttpRequest==='function'?GM_xmlhttpRequest:null;
    const send=legacy||modern;
    if(!send){reject(new Error('Tampermonkey bridge permission is unavailable. Update this userscript.'));return}
    const headers={Accept:'application/json','X-NSR-Page-Origin':unsafeWindow.location.origin};
    const token=getBridgeToken();
    if(payload!==undefined)headers['Content-Type']='application/json';
    if(auth!==false&&token)headers['X-NSR-Bridge-Token']=token;
    let settled=false;
    const finish=callback=>value=>{if(settled)return;settled=true;callback(value)};
    const transportError=detail=>{
      const suffix=detail?' ('+String(detail)+')':'',error=new Error('Cannot reach the local PowerShell bridge at 127.0.0.1:8765. Confirm the PowerShell window is running and Tampermonkey Site access is set to All sites.'+suffix);
      error.transport=true;return error;
    };
    const options={method:method,url:BRIDGE_URL+path,headers:headers,timeout:timeout||20000,nocache:true,fetch:false,
      onload:response=>{
        if(!response||!Number(response.status)){reject(transportError(response&&response.statusText));return}
        let data={};
        try{data=response.responseText?JSON.parse(response.responseText):{}}catch(_){data={message:response.responseText||'Invalid bridge response.'}}
        if(response.status>=200&&response.status<300){resolve(data);return}
        const error=new Error(data.message||('Local bridge returned HTTP '+response.status+'.'));error.status=response.status;error.data=data;
        if(response.status===401)forgetBridgeToken();reject(error);
      },
      onerror:response=>reject(transportError(response&&(response.error||response.statusText))),
      ontimeout:()=>reject(transportError('request timed out')),
      onabort:()=>reject(transportError('request was aborted'))
    };
    options.onload=finish(options.onload);options.onerror=finish(options.onerror);options.ontimeout=finish(options.ontimeout);options.onabort=finish(options.onabort);
    if(payload!==undefined)options.data=JSON.stringify(payload);
    try{
      const result=send(options);
      if(send===modern&&result&&typeof result.then==='function')result.then(options.onload,options.onerror);
    }catch(error){options.onerror(error&&error.message)}
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
  document.querySelectorAll('[data-bridge-action]').forEach(button=>{
    const needsSession=button.id.indexOf('sap')===0;
    button.disabled=bridgeBusy||(needsSession&&!selectedBridgeSession());
  });
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
    select.disabled=false;
  }
  setBridgeBusy(bridgeBusy);
}

async function refreshBridge(){
  setBridgeBusy(true);setBridgeBadge('Checking','');bridgeId('bridgeService').textContent='Checking 127.0.0.1:8765…';
  let health=null;
  try{
    health=await bridgeRequest('GET','/health',undefined,false,5000);
    bridgeId('bridgeService').textContent=(health.service||'NSR SAP GUI Bridge')+' '+(health.version||'');
    bridgeId('bridgeSap').textContent=health.sapAvailable?'SAP GUI detected':'SAP GUI not detected';
    if(!getBridgeToken())await pairBridge();
    if(health.sapAvailable===false){
      bridgeId('bridgePairing').textContent='Paired automatically';renderBridgeSessions([]);setBridgeBadge('SAP unavailable','warn');
      const hint='Bridge is connected, but SAP GUI is not open or no scriptable signed-in SAP session is available. Open and sign in to SAP GUI, then click Refresh.';
      bridgeId('bridgeHelp').textContent=hint;showBridgeResult({ok:true,bridge:'Connected',sapGui:'Unavailable',message:hint},'Waiting for SAP GUI.');return;
    }
    let data;
    try{data=await bridgeRequest('GET','/sap/sessions')}
    catch(error){if(error.status!==401)throw error;forgetBridgeToken();await pairBridge();data=await bridgeRequest('GET','/sap/sessions')}
    bridgeId('bridgePairing').textContent='Paired automatically';renderBridgeSessions(data.sessions);
    if(bridgeSessions.length){setBridgeBadge('Ready','ok');bridgeId('bridgeHelp').textContent='Select a SAP session, then open a transaction or operate a known SAP GUI control ID.'}
    else{setBridgeBadge('SAP unavailable','warn');bridgeId('bridgeHelp').textContent='The bridge is running, but no scriptable SAP GUI session is open. Sign in to SAP GUI and refresh.'}
    showBridgeResult(data,'Connection refreshed.');
  }catch(error){
    renderBridgeSessions([]);
    if(error.status===503&&health){bridgeId('bridgeService').textContent=(health.service||'Local bridge')+' '+(health.version||'');bridgeId('bridgePairing').textContent=getBridgeToken()?'Paired automatically':'Not paired';bridgeId('bridgeSap').textContent='SAP GUI unavailable';setBridgeBadge('SAP unavailable','warn');bridgeId('bridgeHelp').textContent=bridgeError(error)}
    else if(error.status){bridgeId('bridgeService').textContent=health?(health.service||'Local bridge')+' '+(health.version||''):'Local bridge responded';bridgeId('bridgePairing').textContent='Automatic pairing failed';if(!health)bridgeId('bridgeSap').textContent='Unavailable';setBridgeBadge('Bridge error','error');bridgeId('bridgeHelp').textContent=bridgeError(error)}
    else{bridgeId('bridgeService').textContent='Offline';bridgeId('bridgePairing').textContent='Not paired';bridgeId('bridgeSap').textContent='Unavailable';setBridgeBadge('Bridge offline','error');bridgeId('bridgeHelp').textContent='Keep NSR_SAP_GUI_Bridge.ps1 running. If /health opens in the browser, set Tampermonkey Site access to All sites, then refresh this page.'}
    showBridgeResult(bridgeError(error),'Connection failed.');
  }finally{setBridgeBusy(false)}
}

async function pairBridge(){
  bridgeId('bridgePairing').textContent='Pairing automatically';setBridgeBadge('Pairing','warn');bridgeId('bridgeHelp').textContent='Connecting this browser to the local bridge…';
  const data=await bridgeRequest('POST','/pair',{},false,15000);
  if(!data.token)throw new Error('The bridge did not return a pairing token.');
  setBridgeToken(data.token);bridgeId('bridgePairing').textContent='Paired automatically';return data;
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
    const data=await bridgeRequest('POST','/sap/action',payload,true,30000);
    if(operation==='readText'&&Object.prototype.hasOwnProperty.call(data,'value'))bridgeId('sapControlValue').value=data.value==null?'':String(data.value);
    showBridgeResult(data,'SAP action completed.');setBridgeBadge('Ready','ok');
  }catch(error){showBridgeResult(bridgeError(error),'SAP action failed.');setBridgeBadge('Action failed','error')}
  finally{setBridgeBusy(false)}
}

async function runBridgeActions(){
  setBridgeBusy(true);
  try{
    const actions=JSON.parse(bridgeId('sapActions').value);if(!Array.isArray(actions))throw new Error('JSON actions must be an array.');
    const payload=Object.assign(requireBridgeSession(),{actions:actions});
    const data=await bridgeRequest('POST','/sap/actions',payload,true,120000);showBridgeResult(data,'SAP action list completed.');setBridgeBadge('Ready','ok');
  }catch(error){showBridgeResult(bridgeError(error),'SAP action list failed.');setBridgeBadge('Action failed','error')}
  finally{setBridgeBusy(false)}
}

function bindBridgeEvents(){
  const trusted=handler=>event=>{if(!event.isTrusted){showBridgeResult('Synthetic page actions are blocked.','Request blocked.');return}handler(event)};
  bridgeId('bridgeRefresh').addEventListener('click',trusted(refreshBridge));
  bridgeId('sapSession').addEventListener('change',()=>setBridgeBusy(false));
  bridgeId('sapRunTransaction').addEventListener('click',trusted(()=>runBridgeAction('transaction')));
  bridgeId('sapReadText').addEventListener('click',trusted(()=>runBridgeAction('readText')));
  bridgeId('sapSetText').addEventListener('click',trusted(()=>runBridgeAction('setText')));
  bridgeId('sapSetKey').addEventListener('click',trusted(()=>runBridgeAction('setKey')));
  bridgeId('sapPress').addEventListener('click',trusted(()=>runBridgeAction('press')));
  bridgeId('sapSelect').addEventListener('click',trusted(()=>runBridgeAction('select')));
  bridgeId('sapSendVKey').addEventListener('click',trusted(()=>runBridgeAction('sendVKey')));
  bridgeId('sapRunActions').addEventListener('click',trusted(runBridgeActions));
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
