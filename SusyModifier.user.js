// ==UserScript==
// @name          Susy Modifier
// @version       3.2.22
// @namespace     https://github.com/synalocey/SusyModifier
// @description   Susy Modifier
// @author        Syna
// @icon          https://susy.mdpi.com/bundles/mdpisusy/img/icon_old/favicon-196x196.png
// @updateURL     https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @downloadURL   https://raw.githubusercontent.com/synalocey/SusyModifier/master/SusyModifier.user.js
// @match         *://*.mdpi.com/*
// @match         *://redmine.mdpi.cn/*
// @match         *://*.scopus.com/*
// @match         *://*/*amp;user*
// @require       https://code.jquery.com/jquery-3.6.1.min.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_xmlhttpRequest
// @grant         GM_openInTab
// @connect       mdpi.com
// @connect       titlecaseconverter.com
// @connect       google.com
// @connect       webofknowledge.com
// @connect       skday.com
// @connect       pubpeer.com
// ==/UserScript==
/* globals jQuery, $ */

function GM_configStruct(){arguments.length&&(GM_configInit(this,arguments),this.onInit())}
function GM_configInit(config,args){
    if(void 0===config.fields&&(config.fields={},config.onInit=config.onInit||function(){},config.onOpen=config.onOpen||function(){},config.onSave=config.onSave||function(){},
                                config.onClose=config.onClose||function(){},config.onReset=config.onReset||function(){},config.isOpen=!1,config.title='User Script Settings',config.css={basic:[
        "#GM_config * { font-family: arial,tahoma,myriad pro,sans-serif; }","#GM_config { background: #FFF; }","#GM_config input[type='radio'] { margin-right: 8px; }","#GM_config .indent40 { margin-left: 40%; }",
        "#GM_config .field_label { font-size: 12px; font-weight: bold; margin-right: 6px; }","#GM_config .radio_label { font-size: 12px; }","#GM_config .block { display: block; }","#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px; }",
        "#GM_config .reset, #GM_config .reset a, #GM_config_buttons_holder { color: #000; text-align: right; }","#GM_config .config_header { font-size: 20pt; margin: 0; }","#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt; }",
        "#GM_config .center { text-align: center; }","#GM_config .section_header_holder { margin-top: 8px; }","#GM_config .config_var { margin: 0 0 4px; }","#GM_config .section_header { background: #414141; border: 1px solid #000; color: #FFF;",
        " font-size: 13pt; margin: 0; }","#GM_config .section_desc { background: #EFEFEF; border: 1px solid #CCC; color: #575757; font-size: 9pt; margin: 0 0 6px; }"].join('\n')+'\n',basicPrefix:"GM_config",stylish:""}),
       1==args.length&&"string"==typeof args[0].id&&"function"!=typeof args[0].appendChild)var settings=args[0];else {settings={}; for(var arg,i=0,l=args.length;i<l;++i) if("function"!=typeof(arg=args[i]).appendChild)
        switch(typeof arg){case'object':for(var j in arg){ if("function"!=typeof arg[j]){settings.fields=arg;break;} settings.events||(settings.events={}),settings.events[j]=arg[j]}break;case'function':settings.events={onOpen:arg};break;
            case'string':/\w+\s*\{\s*\w+\s*:\s*\w+[\s|\S]*\}/.test(arg)?settings.css=arg:settings.title=arg}else settings.frame=arg}
    if(settings.id?config.id=settings.id:void 0===config.id&&(config.id='GM_config'),settings.title&&(config.title=settings.title),settings.css&&(config.css.stylish=settings.css),settings.frame&&(config.frame=settings.frame),
       settings.events){var events=settings.events;for(var e in events)config["on"+e.charAt(0).toUpperCase()+e.slice(1)]=events[e]}
    if(settings.fields){var stored=config.read(),fields=settings.fields,customTypes=settings.types||{},configId=config.id;for(var id in fields){var field=fields[id];field?config.fields[id]=new GM_configField(field,stored[id],id,customTypes[field.type],
        configId):config.fields[id]&&delete config.fields[id]}} config.id!=config.css.basicPrefix&&(config.css.basic=config.css.basic.replace(new RegExp('#'+config.css.basicPrefix,'gm'),'#'+config.id),config.css.basicPrefix=config.id)}
function GM_configDefaultValue(type,options){var value;switch(0==type.indexOf('unsigned ')&&(type=type.substring(9)),type){
    case'radio':case'select':value=options[0];break;case'checkbox':value=!1;break;case'int':case'integer':case'float':case'number':value=0;break;default:value=''}return value}
function GM_configField(settings,stored,id,customType,configId){this.settings=settings,this.id=id,this.configId=configId,this.node=null,this.wrapper=null,this.save=void 0===settings.save||settings.save,"button"==settings.type&&(this.save=!1),this.default=void 0===
    settings.default?customType?customType.default:GM_configDefaultValue(settings.type,settings.options):settings.default,this.value=void 0===stored?this.default:stored,customType&&(this.toNode=customType.toNode,this.toValue=customType.toValue,this.reset=customType.reset)}
GM_configStruct.prototype={
    init:function(){GM_configInit(this,arguments),this.onInit()},open:function(){var match=document.getElementById(this.id);if(!match||!("IFRAME"==match.tagName||match.childNodes.length>0)){
        var config=this,defaultStyle="bottom: auto; border: 1px solid #000; display: none; height: 80%; left: 0; margin: 0; max-height: 95%; max-width: 95%; opacity: 0; overflow: auto; padding: 0; position: fixed; right: auto; top: 0; width: 80%; z-index: 9999;";
        if(this.frame)this.frame.id=this.id,this.frame.setAttribute('style',defaultStyle),buildConfigWin(this.frame,this.frame.ownerDocument.getElementsByTagName('head')[0]);else{document.body.appendChild(this.frame=this.create('iframe',{id:this.id,style:defaultStyle})),
            this.frame.src='about:blank';var that=this;this.frame.addEventListener('load',(function(e){var frame=config.frame;frame.src&&!frame.contentDocument?frame.src="":frame.contentDocument||that.log("GM_config failed to initialize default settings dialog node!");
                                                                                                       var body=frame.contentDocument.getElementsByTagName('body')[0];body.id=config.id,buildConfigWin(body,frame.contentDocument.getElementsByTagName('head')[0])}),!1)}
    } function buildConfigWin(body,head){var create=config.create,fields=config.fields,configId=config.id,bodyWrapper=create('div',{id:configId+'_wrapper'});head.appendChild(create('style',{type:'text/css',textContent:config.css.basic+config.css.stylish})),
        bodyWrapper.appendChild(create('div',{id:configId+'_header',className:'config_header block center'},config.title));var section=bodyWrapper,secNum=0;for(var id in fields){var field=fields[id],settings=field.settings;settings.section&&(
        section=bodyWrapper.appendChild(create('div',{className:'section_header_holder',id:configId+'_section_'+secNum})),'[object Array]'!==Object.prototype.toString.call(settings.section)&&(settings.section=[settings.section]),
        settings.section[0]&&section.appendChild(create('div',{className:'section_header center',id:configId+'_section_header_'+secNum},settings.section[0])),settings.section[1]&&section.appendChild(create('p',
        {className:'section_desc center',id:configId+'_section_desc_'+secNum},settings.section[1])),++secNum),section.appendChild(field.wrapper=field.toNode())} bodyWrapper.appendChild(create('div',{id:configId+'_buttons_holder'},create('button',{id:configId+'_saveBtn',
        textContent:'Save',title:'Save settings',className:'saveclose_buttons',onclick:function(){config.save()}}),create('button',{id:configId+'_closeBtn',textContent:'Close',title:'Close window',className:'saveclose_buttons',onclick:function(){config.close()}}),
        create('div',{className:'reset_holder block'},create('a',{id:configId+'_resetLink',textContent:'Reset to defaults',href:'#',title:'Reset fields to default values',className:'reset',onclick:function(e){e.preventDefault(),config.reset()}})))),
        body.appendChild(bodyWrapper),config.center(),window.addEventListener('resize',config.center,!1),config.onOpen(config.frame.contentDocument||config.frame.ownerDocument,config.frame.contentWindow||window,config.frame),
        window.addEventListener('beforeunload',(function(){config.close()}),!1),config.frame.style.display="block",config.isOpen=!0}},
    save:function(){var forgotten=this.write();this.onSave(forgotten)},close:function(){this.frame.contentDocument?(this.remove(this.frame),this.frame=null):(this.frame.innerHTML="",this.frame.style.display="none");var fields=this.fields;for(var id in fields){
        var field=fields[id];field.wrapper=null,field.node=null}this.onClose(),this.isOpen=!1},set:function(name,val){this.fields[name].value=val,this.fields[name].node&&this.fields[name].reload()},get:function(name,getLive){var field=this.fields[name],fieldVal=null;
        return getLive&&field.node&&(fieldVal=field.toValue()),null!=fieldVal?fieldVal:field.value},write:function(store,obj){if(!obj){var values={},forgotten={},fields=this.fields;for(var id in fields){var field=fields[id],value=field.toValue();
        field.save?null!=value?(values[id]=value,field.value=value):values[id]=field.value:forgotten[id]=value}} try{this.setValue(store||this.id,this.stringify(obj||values))}catch(e){this.log("GM_config failed to save settings!")}return forgotten},read:function(store){
            try{var rval=this.parser(this.getValue(store||this.id,'{}'))}catch(e){this.log("GM_config failed to read saved settings!");rval={}}return rval},reset:function(){var fields=this.fields;for(var id in fields)fields[id].reset();this.onReset()},
    create:function(){switch(arguments.length){case 1:var A=document.createTextNode(arguments[0]);break;default:A=document.createElement(arguments[0]);var B=arguments[1];for(var b in B)0==b.indexOf("on")?A.addEventListener(b.substring(2),B[b],!1):-1!=
        ",style,accesskey,id,name,src,href,which,for".indexOf(","+b.toLowerCase())?A.setAttribute(b,B[b]):A[b]=B[b];if("string"==typeof arguments[2])A.innerHTML=arguments[2];else for(var i=2,len=arguments.length;i<len;++i)A.appendChild(arguments[i])}return A},
    center:function(){var node=this.frame;if(node){var style=node.style;style.opacity;'none'==style.display&&(style.opacity='0'),style.display='',style.top=Math.floor(window.innerHeight/2-node.offsetHeight/2)+'px',
        style.left=Math.floor(window.innerWidth/2-node.offsetWidth/2)+'px',style.opacity='1'}},remove:function(el){el&&el.parentNode&&el.parentNode.removeChild(el)}},
    function(){var setValue,getValue,stringify,parser,isGM='undefined'!=typeof GM_getValue&&void 0!==GM_getValue('a','b');
               isGM?(setValue=GM_setValue,getValue=GM_getValue,stringify="undefined"==typeof JSON?function(obj){return obj.toSource()}:JSON.stringify,parser="undefined"==typeof JSON?function(jsonData){return new Function('return '+jsonData+';')()}:JSON.parse)
               :(setValue=function(name,value){return localStorage.setItem(name,value)},getValue=function(name,def){var s=localStorage.getItem(name);return null==s?def:s},stringify=JSON.stringify,parser=JSON.parse),
                   GM_configStruct.prototype.isGM=isGM,GM_configStruct.prototype.setValue=setValue,GM_configStruct.prototype.getValue=getValue,GM_configStruct.prototype.stringify=stringify,GM_configStruct.prototype.parser=parser,
                   GM_configStruct.prototype.log=window.console?console.log:isGM&&'undefined'!=typeof GM_log?GM_log:window.opera?opera.postError:function(){/* no logging */}}(),
    GM_configField.prototype={create:GM_configStruct.prototype.create,toNode:function(){
        var field=this.settings,value=this.value,options=field.options,type=field.type,id=this.id,configId=this.configId,labelPos=field.labelPos,create=this.create;function addLabel(pos,labelEl,parentNode,beforeEl){switch(beforeEl||(beforeEl=parentNode.firstChild),pos)
        {case'right':case'below':'below'==pos&&parentNode.appendChild(create('br',{})),parentNode.appendChild(labelEl);break;default:'above'==pos&&parentNode.insertBefore(create('br',{}),beforeEl),parentNode.insertBefore(labelEl,beforeEl)}}
        var firstProp,retNode=create('div',{className:'config_var',id:configId+'_'+id+'_var',title:field.title||''});for(var i in field){firstProp=i;break} var label=field.label&&"button"!=type?create('label',{id:configId+'_'+id+'_field_label',for:configId+'_field_'+id,
        className:'field_label'},field.label):null;switch(type){case'textarea':retNode.appendChild(this.node=create('textarea',{innerHTML:value,id:configId+'_field_'+id,className:'block',cols:field.cols?field.cols:20,rows:field.rows?field.rows:2}));break;
            case'radio':var wrap=create('div',{id:configId+'_field_'+id});this.node=wrap;i=0;for(var len=options.length;i<len;++i){var radLabel=create('label',{className:'radio_label'},options[i]),rad=wrap.appendChild(create('input',{value:options[i],type:'radio',name:id,
            checked:options[i]==value}));addLabel(!labelPos||'left'!=labelPos&&'right'!=labelPos?'options'==firstProp?'left':'right':labelPos,radLabel,wrap,rad)}retNode.appendChild(wrap);break;
            case'select':wrap=create('select',{id:configId+'_field_'+id});this.node=wrap;for(i=0,len=options.length;i<len;++i){var option=options[i];wrap.appendChild(create('option',{value:option,selected:option==value},option))}retNode.appendChild(wrap);break;
            default:var props={id:configId+'_field_'+id,type:type,value:'button'==type?field.label:value};switch(type){case'checkbox':props.checked=value;break;case'button':props.size=field.size?field.size:25,field.script&&(field.click=field.script),
                field.click&&(props.onclick=field.click);break;case'hidden':break;default:props.type='text',props.size=field.size?field.size:25}retNode.appendChild(this.node=create('input',props))}
        return label&&(labelPos||(labelPos="label"==firstProp||"radio"==type?"left":"right"),addLabel(labelPos,label,retNode)),retNode},toValue:function(){var node=this.node,field=this.settings,type=field.type,unsigned=!1,rval=null;if(!node) return rval;
        switch(0==type.indexOf('unsigned ')&&(type=type.substring(9),unsigned=!0),type){case'checkbox':rval=node.checked;break;case'select':rval=node[node.selectedIndex].value;break;case'radio':for(var radios=node.getElementsByTagName('input'),i=0,len=radios.length;i<len;
        ++i)radios[i].checked&&(rval=radios[i].value);break;case'button':break;case'int':case'integer':case'float':case'number':var num=Number(node.value),warn='Field labeled "'+field.label+'" expects a'+(unsigned?' positive ':'n ')+'integer value';if(isNaN(num)||
        'int'==type.substr(0,3)&&Math.ceil(num)!=Math.floor(num)||unsigned&&num<0)return alert(warn+'.'),null;if(!this._checkNumberRange(num,warn))return null;rval=num;break;default:rval=node.value}return rval;},reset:function(){var node=this.node,type=this.settings.type;
        if(node)switch(type){case'checkbox':node.checked=this.default;break;
            case'select':for(var i=0,len=node.options.length;i<len;++i)node.options[i].textContent==this.default&&(node.selectedIndex=i);break;
            case'radio':var radios=node.getElementsByTagName('input');for(i=0,len=radios.length;i<len;++i)radios[i].value==this.default&&(radios[i].checked=!0);break;case'button':break;
            default:node.value=this.default}},remove:function(el){GM_configStruct.prototype.remove(el||this.wrapper),this.wrapper=null,this.node=null},reload:function(){var wrapper=this.wrapper;wrapper&&(wrapper.parentNode.insertBefore(this.wrapper=this.toNode(),wrapper),
            this.remove(wrapper))},_checkNumberRange:function(num,warn){
                var field=this.settings;return"number"==typeof field.min&&num<field.min?(alert(warn+' greater than or equal to '+field.min+'.'),null):!("number"==typeof field.max&&num>field.max)||(alert(warn+' less than or equal to '+field.max+'.'),null)}};
var GM_config=new GM_configStruct; // https://github.com/sizzlemctwizzle/GM_config/blob/master/gm_config.js

(function() {
    'use strict'; console.time("test");
    GM_config.init({
        'id': 'SusyModifierConfig',
        'title': 'Settings of SusyModifier v'+GM_info.script.version,
        'fields':  {
            'Interface_sidebar': {'section': [],'label': 'Susy 左侧边栏按钮', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'Interface_SME': {'label': 'I am SME ', 'type': 'select', 'labelPos': 'left', 'options':
                              ['','Algebra and Geometry','Computational and Applied Mathematics','Difference and Differential Equations','Dynamical Systems','Engineering Mathematics','Financial Mathematics','Functional Interpolation',
                               'Fuzzy Set Theory','Mathematical Biology','Mathematical Physics','Mathematics and Computer Science','Network Science','Probability and Statistics Theory'], 'default': ''},
            'Journal': {'label': 'of Journal', 'type': 'select', 'labelPos': 'left', 'options': ['AppliedMath','Children','Games','Mathematics','None'], 'default': 'Mathematics'},
            'Interface_combine': {'label': 'Topic Manuscripts整合到SI', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Manuscriptnote': {'section': [],'label': 'Manuscript Note紧凑', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'ManuscriptFunc': {'label': '快捷申请优惠券和发送推广信按钮', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'Template_Linkedin': {'label': 'LinkedIn推广信模板', 'type': 'textarea', 'default':
                                  `Dear Authors,\n\nHope this email finds you well. Your manuscript %m_id% is promoted by the Mathematics "%m_section%" Section LinkedIn account. Welcome to like, share, send and comment on it.\n\n`
                                  +`Find us and receive more information in the section "%m_section%" of Mathematics:\n[Links]\n\nPlease do not hesitate to let us know if you have questions.`},
            'Template_Paper': {'label': '文章推广信模板', 'type': 'textarea', 'default':
                               `Dear %name%,\n\nThank you very much for your contribution to /Mathematics/, your manuscript %m_id% is now under review. We will keep you informed about the status of your manuscript.\n\n`
                               +`In addition, you have published a paper/papers in /Mathematics/ in the past two years with the citation of about XX times. Based on your reputation and research interests, we believe that your results should attract more citations and `
                               +`attention. Therefore, could you please promote the paper/papers to your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?\n\nIn addition, you have published a paper/`
                               +`papers in /Mathematics/ in 20XX with the citation of XXXXX times, congratulations on your great work!\nTo encourage open scientific discussions and increase the visibility of your results, could you please promote the paper/papers to `
                               +`your colleagues, friends, or related scholars by sharing the paper using the button on the right sidebar of the article page?\n\n1. [paper link]\n2. [paper link]\n\nThank you in advance for your support.`},
            'SInote': {'section': [], 'label': 'Special Issue Note紧凑', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'SIpages': {'label': '特刊列表免翻页', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'GE_TemplateID': {'section': [], 'label': '默认 GE Invitation Template', 'type': 'select', 'labelPos': 'left', 'options':
                              ['!Guest Editor – invite Version 1','Guest Editor - Invite with Benefits and Planned Papers','Guest Editor - Invite Free','Guest Editor - Invite with Discounts','Guest Editor-Invite (Optional)','Guest Editor Invitation-Why a Special Issue',
                               '*Guest Editor - SI Mentor Program'], default: 'Guest Editor - Invite Free'},
            'GE_TemplateS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^.*Mathematics.*Guest Editor"},
            'GE_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.592, Rank Q1) Invitation to Serve as the Guest Editor"},
            'GE_TemplateB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderID': {'section': [], 'label': '默认 GE Reminder Template', 'type': 'select', 'labelPos': 'left', 'options':
                              ['Guest Editor Invitation – 1st Reminder','Guest Editor Invitation – 2nd Reminder','Guest Editor Invitation – 3rd Reminder'], default: 'Guest Editor Invitation – 1st Reminder'},
            'GE_ReminderS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'GE_ReminderB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_TemplateID': {'section': [], 'label': '默认 EB Invitation Template', 'type': 'select', 'labelPos': 'left', 'options': ['!Editorial Board Member – Invite Version 1']},
            'EB_TemplateS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^Invitation"},
            'EB_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.592, Rank Q1) Invitation"},
            'EB_TemplateB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_ReminderID': {'section': [], 'label': '默认 EB Reminder Template', 'type': 'select', 'labelPos': 'left', 'options': ['!Editorial Board Member – Reminder']},
            'EB_ReminderS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex]^Invitation"},
            'EB_ReminderS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "[Mathematics] (IF: 2.592, Rank Q1) Invitation"},
            'EB_ReminderB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'EB_ReminderB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'Report_TemplateID': {'section': [], 'label': '默认 GE Contact', 'type': 'select', 'labelPos': 'left', default: 'Monthly Report', 'options':
                                  ['Website Online','SI Open','Paper Invitation','Ask GE To Provide List Template 1','Ask GE To Provide List Template 2','Invite The GE To Send Invitations','Remind Another GE To Send The CfP','Discuss Discount With GE',
                                   'Ask GE To Invite Papers','Invite The GE To Send A Reminder','Paper Submission Guideline','Remind FP Invitations After One Month','CFP Authors And Reviewers In MDPI','Encourage And Motivate GE To Solicit Papers Template 1',
                                   'Encourage And Motivate GE To Solicit Papers Template 2','Encourage And Motivate GE To Solicit Papers Template 3','Mailing List Check','Mailing List Check Reminder','Guide GE To Manage SI Template 1','Guide GE To Manage SI Template 2',
                                   'Conference Inquiry','Slide','Some Tips','Review Paper Invitation','Happy Thanksgiving Day','Merry Christmas','FP Reminder One Month Before The Deadline Template 1','FP Reminder One Month Before The Deadline Template 2',
                                   'Extend The Deadline','Editorial – SI Closed','Book Online','Check Abstract','Monthly Report','IF Increased','Journal Awards','First Publication']},
            'Report_TemplateS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex](?<=] )\\(.* – monthly report"},
            'Report_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function () {\n let $si_name = $('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().text().trim();\n`
                                  + ` return \`Monthly Report (\${new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}) – Special Issue: \${$si_name}\`;\n}`},
            'Report_TemplateB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex](?<=Dear[\\s\\S]*?,\\n\\n)I hope this finds you well. I have included,[\\S\\s]*Kind regards,"},
            'Report_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': `function (){\n let $si_name=$('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().text().trim();`
                                  + ` let $si_link=$('div.cell.small-12.medium-6.large-2:contains("Special Issue Title")').next().children().attr("href").replace(/journal\\/(.*)\\/special_issues/,"si/$1");`
                                  + ` let $arr=$('div.cell.small-12.medium-6.large-2:contains("Manuscripts(")').next().text().split("/");\n let $process=$arr[0].trim(),$pub=$arr[1].trim(),$reject=$arr[2].trim(),$instruct;`
                                  + ` if ($process+$pub+$reject>0) {$instruct="You can view all manuscripts submitted to the Special Issue by logging in with your email at the link provided. Please note that your own submissions will not be visible.`
                                  + `\\nhttps://susy.mdpi.com/academic-editor/special_issues"} else {$instruct="This is a new Special Issue and hasn't received submissions yet."} return \`I am writing to update you on the status of our Special Issue "\${$si_name}".\n`
                                  + `\${$si_link}\n\n1. Status of Submissions\n\nPublished: \${$pub}; Under Processing: \${$process}; Rejected: \${$reject}\n\n\${$instruct}\n\n2. Status of Planned Papers\n\nSeveral authors have committed to contributing feature papers`
                                  + ` to the Special Issue. If there are any missing papers, please let me know.\n\n%pp_list%\n\nWe are excited about a productive collaboration and hope for a successful outcome for the Special Issue. If you have any questions, please `
                                  + `do not hesitate to contact us.\n--\nBest regards,\n\`;\n}`},
            'PP_Template': {'section': [], 'label': '修改 PP 提醒模板', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'PP_TemplateS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'PP_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ""},
            'PP_TemplateB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default':
                              "[Regex]A few months ago[\\s\\S]*submit to the special issue (.*?)\\.[\\s\\S]*(https:\\/\\/www.mdpi.com\\/journal\\/mathematics\\/special_issues.*)[\\s\\S]*Kind regards,"},
            'PP_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': 'A few months ago, you expressed interest in submitting a paper to our special issue "$1". We would be grateful to have the opportunity to receive it.\n\n$2\n\n'
                              + 'Please note that you will be offered a XX% discount on the Article Processing Charge by the guest editors if your paper is accepted for publication.To take advantage of the discount, we strongly encourage you to submit your'
                              + ' manuscript by the deadline if possible.\n\nWe look forward to receiving your submission and thank you for your interest in our special issue.\n\nKind regards,'},
            'LinkShort': {'label': 'SI Webpage 短链接', 'labelPos': 'right', 'type': 'checkbox', 'default': true},
            'Cfp_checker': {'label': 'Toolkit for CfP Checker', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Assign_Assistant': {'label': '派稿助手', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Hidden_Func': {'label': 'Experimental (Default: OFF)', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Con_Template': {'section': [], 'label': '修改Conference模板', 'labelPos': 'right', 'type': 'checkbox', 'default': false},
            'Con_TemplateS1': {'label': 'Replace Email Subject From', 'labelPos': 'left', 'type': 'textarea', 'default': "(ISSN 2227-7390)"},
            'Con_TemplateS2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': "(ISSN 2227-7390, IF 2.592)"},
            'Con_TemplateB1': {'label': 'Replace Email Body From', 'labelPos': 'left', 'type': 'textarea', 'default': "[Regex] and within the journal newsletter.* website and newsletter."},
            'Con_TemplateB2': {'label': 'To', 'labelPos': 'left', 'type': 'textarea', 'default': ". We would be glad if, in return, you could advertise the journal via the conference website."},
        },
        'events': {
            'save': function() {location.href = location.href},
            'open': function(doc) {
                var f_settings = $("#SusyModifierConfig").contents();
                //Experimental警告
                GM_config.fields.Hidden_Func.node.addEventListener('change', function(){ if(f_settings.find("#SusyModifierConfig_field_Hidden_Func")[0].checked) {
                    alert('Dangerous! \n\nDon\'t turn it on unless you are familiar with ALL susy functions. \nOtherwise, it will cause serious problems.')} });
                //隐藏推广信模板
                if(!GM_config.get('ManuscriptFunc')){ f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").hide() }
                GM_config.fields.ManuscriptFunc.node.addEventListener('change', function(doc){
                    if(f_settings.find("#SusyModifierConfig_field_ManuscriptFunc")[0].checked) { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").show(); }
                    else { f_settings.find("#SusyModifierConfig_Template_Linkedin_var, #SusyModifierConfig_Template_Paper_var").hide() }
                });
                //隐藏Conference Template
                f_settings.find("#SusyModifierConfig_Con_TemplateB2_var").after('<div id="c_br"></div>')
                f_settings.find("#SusyModifierConfig_PP_TemplateB2_var").after('<div id="c_br2"></div>')
                if(!GM_config.get('Con_Template')) { f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").hide() }
                if(!GM_config.get('PP_Template')) { f_settings.find("#SusyModifierConfig_PP_TemplateS1_var,#SusyModifierConfig_PP_TemplateS2_var,#SusyModifierConfig_PP_TemplateB1_var,#SusyModifierConfig_PP_TemplateB2_var,#c_br2").hide() }
                GM_config.fields.Con_Template.node.addEventListener('change', function(doc){
                    if(f_settings.find("#SusyModifierConfig_field_Con_Template")[0].checked) {
                        f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").show()
                    }
                    else { f_settings.find("#SusyModifierConfig_Con_TemplateS1_var,#SusyModifierConfig_Con_TemplateS2_var,#SusyModifierConfig_Con_TemplateB1_var,#SusyModifierConfig_Con_TemplateB2_var,#c_br").hide() }
                });
                GM_config.fields.PP_Template.node.addEventListener('change', function(doc){
                    if(f_settings.find("#SusyModifierConfig_field_PP_Template")[0].checked) {
                        f_settings.find("#SusyModifierConfig_PP_TemplateS1_var,#SusyModifierConfig_PP_TemplateS2_var,#SusyModifierConfig_PP_TemplateB1_var,#SusyModifierConfig_PP_TemplateB2_var,#c_br2").show()
                    }
                    else { f_settings.find("#SusyModifierConfig_PP_TemplateS1_var,#SusyModifierConfig_PP_TemplateS2_var,#SusyModifierConfig_PP_TemplateB1_var,#SusyModifierConfig_PP_TemplateB2_var,#c_br2").hide() }
                });
                //隐藏Section
                if(GM_config.get('Journal') != "Mathematics"){ f_settings.find("#SusyModifierConfig_field_Interface_SME").hide(); }
                GM_config.fields.Journal.node.addEventListener('change', function(doc){
                    if(f_settings.find("#SusyModifierConfig_field_Journal").val() == "Mathematics") {
                        f_settings.find("#SusyModifierConfig_field_Interface_SME").show()
                    }
                    else { f_settings.find("#SusyModifierConfig_field_Interface_SME").hide() }
                });
            },
        },
        'css': `#SusyModifierConfig{background-color:#D6EDD9} textarea{font-size:12px;width:160px} .config_var{padding: 5px 10px;display:inline-block;vertical-align:top;} select{width:170px} #SusyModifierConfig_section_1{min-height:70px}
        #SusyModifierConfig_section_0,#SusyModifierConfig_section_2{min-height:40px} #SusyModifierConfig_Interface_sidebar_field_label,#SusyModifierConfig_Manuscriptnote_field_label,#SusyModifierConfig_SInote_field_label,
        #SusyModifierConfig_LinkShort_field_label{width:140px;display:inline-block;} #SusyModifierConfig_ManuscriptFunc_field_label{width:200px;display:inline-block;} #SusyModifierConfig_Con_Template_field_label,#SusyModifierConfig_PP_Template_field_label
        {width:145px;display:inline-block;} #SusyModifierConfig_GE_TemplateID_field_label,#SusyModifierConfig_GE_ReminderID_field_label,#SusyModifierConfig_EB_TemplateID_field_label,
        #SusyModifierConfig_EB_ReminderID_field_label,#SusyModifierConfig_field_Report_TemplateID{display:block;}`
    });
    const date_v = new Date('202'+GM_info.script.version);
    if ((Date.now() - date_v)/86400000 > 180) {$("#topmenu > ul").append("<li><a style='color:pink' onclick='alert(\"Please update.\");'>!!! SusyModifier Outdated !!!</a></li>"); return;}
    else {$("#topmenu > ul").append("<li><a id='susymodifier_config'>SusyModifier Settings</a></li>"); $("#susymodifier_config").click(function(e) {GM_config.open()});}

    var S_J, S_S;
    switch (GM_config.get('Journal')) {
        case 'Mathematics': S_J=154; break;
        case 'Children': S_J=159; break;
        case 'AppliedMath': S_J=517; break;
        case 'Games': S_J=25; break;
        case 'None': S_J=-1; break;
    }

    //susy侧边栏的按钮🔎
    if (window.location.href.indexOf("susy.mdpi.com/")>-1 && GM_config.get('Interface_sidebar') && $('#leftcol').length){try{
        $("body").append( `<div id='si_search' role='dialog' style='display: none; position: absolute; height: 350px; width: 500px; top: 500px; left: 242.5px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front'>
        <div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle'><span class='ui-dialog-title'>Quick Search</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close'
        onclick='document.getElementById(\"si_search\").style.display=\"none\"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span></button></div><div class='ui-dialog-content ui-widget-content'> <form class='insertform' method='get'
        action='/special_issue_pending/list/search' target='_blank'><input type='text' name='show_all' value='my_journals' style='display:none;'>SI Title: <input type='text' name='form[si_name]' style='display:inline-block; width:65%;'>
        <input type='submit' class='submit' value='SI Search'></form><hr><form class='insertform' method='get' action='/user/ebm-new/management/all/my_journals' target='_blank'>Name: <input type='text' id='form_name2' name='form[name]'
        style='display:inline-block; width:65%;'><br>Email: <input type='email' name='form[email]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='EBM Search'></form><hr>
        <form class='insertform' method='get' action='/user/conference/list' target='_blank'>Conference: <input type='text' name='form[conference_name]' style='display:inline-block; width:65%;'> <input type='submit' class='submit' value='Search'></form>`);

        S_S=-1;
        if (S_J==154) {switch (GM_config.get('Interface_SME')) {
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
        }}

        if (S_S>0 && S_J>0){
            $(".menu [href='/special_issue_pending/list']").after("<a href='/special_issue_pending/list/online?form[journal_id]=" + S_J + "&form[section_id]=" + S_S + "&show_all=my_journals&sort_field=special_issue_pending.deadline&sort=ASC'>[S]</a>");
            $(".menu [href='/user/managing/status/submitted']").after(" <a href='/user/managing/status/submitted?form[journal_id]=" + S_J + "&form[section_id]=" + S_S + "'>[S]</a>");
        }
        if (S_J>0){
            $(".menu [href='/user/managing/status/submitted']").after("<a href='/user/managing/status/published?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.publish_date&sort=DESC'>[P]</a>");
            $(".menu [href='/user/managing/status/submitted']").after(" <a href='/user/managing/status/production?form[journal_id]=" + S_J + "&sort_field=submission_manuscript_state.last_action&sort=DESC'>[F]</a>");
            $(".menu [href='/voucher/application/list']").attr("href","/voucher/application/list/my_journal?form[journal_id]=" + S_J);
            $(".menu [href='/user/managing/status/submitted']").attr("href","/user/managing/status/submitted?form[journal_id]=" + S_J);
            $(".menu [href='/user/manage/award_request']").attr("href","/user/manage/award_request?form[journal_id]=" + S_J);
            $(".menu [href='/user/manage/awards_item']").attr("href","/user/manage/awards_item?form[journal_id]=" + S_J);
            $(".menu [href='/si/proposal/list']").attr("href","/si/proposal/list?form[journal_id]=" + S_J);
            $(".menu [href='/list/list_volunteer_reviewers']").attr("href","/list/list_volunteer_reviewers?form[journal_id]=" + S_J);
            $(".menu [href='/tap/list']").attr("href","/tap/list?form[journal_id]=" + S_J);
            $(".menu [href='/topic/proposal/list']").attr("href","/topic/proposal/list?form[journal_id]=" + S_J);
            $(".menu [href='/user/conference/list']").attr("href","/user/conference/list?form[subject_id]=4");
            $(".menu [href='/user/submission_sponsorships/list']").after(" <a href='/user/submission_sponsorships/list/my_journal?form[sponsorship_journal_id]=" + S_J + "'>[J]</a>");
            $(".menu [href='/user/manuscript/list/owner']").attr("href",'/user/manuscript/list/owner/my_journal');
            $(".menu [href='/user/manuscript/special_approval_list']").attr("href",'/user/manuscript/special_approval_list/my_journal');
            $(".menu [href='/user/list/editors']").after(" <a href='/user/ebm/contract?form[journal_id]=" + S_J + "'>[R]</a>");
        }
        $(".menu [href='/user/myprofile']").after(" <a href='/user/settings'>[Settings]</a>");
        $(".menu [href='/special_issue_pending/list']").after(" <a href='/special_issue_pending/list?&sort_field=special_issue_pending.date_update&sort=DESC'>Special Issues</a> <a href='/user/sme/status/submitted'>[M]</a>");
        $(".menu [href='/special_issue_pending/list']").text("Manage").attr("href","/special_issue_pending/list/online?sort_field=special_issue_pending.publish_date&sort=DESC")
        $(".menu [href='/submission/topic/list']").after(" <a href='/user/topic/status/submitted'>[M]</a>");
        $(".menu [href='/submission/topic/list']").attr("href","/submission/topic/list/online");
        $(".menu [href='/user/ebm-new/management']").after("<div style='float:right;'><a onclick='$(\"#si_search\").show(); $(\"#si_search\").draggable({handle: \"#mover\"});'><img src='/bundles/mdpisusy/img/icon/magnifier.png'></a> </div> ");

        if (GM_config.get('Assign_Assistant')) {
            $("body").append( `<div id='add_r' role='dialog' style='display: none; position: absolute; height: 350px; width: 350px; top: 300px; left: 500px; z-index: 101;' class='ui-dialog ui-corner-all ui-widget ui-widget-content ui-front'>
        <div class='ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix'><span class='ui-dialog-title'>Add Reviewers [for GL]</span><button type='button' class='ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close'
        onclick='document.getElementById("add_r").style.display="none"'><span class='ui-button-icon ui-icon ui-icon-closethick'></span></button></div><div class='ui-dialog-content ui-widget-content'><textarea id="add_r_t" class="manuscript-add-note-form"
        placeholder="Example:\nmathematics-xxxxxx\naaa@aaa.edu\nbbb@bbb.edu\nmathematics-yyyyyy\nccc@ccc.edu" minlength="1" maxlength="20000" rows="10" spellcheck="false"></textarea><button id="add_r_b" class="submit">Submit</button></div></div>`);
            $(".menu [href='/user/assigned/status/ongoing']").after(`<div style='float:right;'><a onclick='$("#add_r").show(); $("#add_r").draggable({handle: "#mover"});'><img src='/bundles/mdpisusy/img/icon/users.png'></a></div>`);
            $("#add_r_b").click(function (){
                let myArray, add_id, rdline = $("#add_r_t").val().split("\n");
                for (var i=0; i < rdline.length; i++){
                    if ((myArray = /\w+-\d+/.exec(rdline[i])) !== null) {add_id=myArray[0]}
                    if ((myArray = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.exec(rdline[i])) !== null) {GM_openInTab(window.location.origin+"/ajax/submission_get_manuscripts?term="+add_id+"&r="+myArray[0], false)}
                }
            })
        }
    } catch (error){ }}

    //SI和Topic Manuscripts整合
    if (window.location.href.indexOf(".mdpi.com/user/sme/status/") > -1 && GM_config.get('Interface_combine')){
        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href.replace('sme/status','topic/status'),
            onload: function(responseDetails) {
                let parser = new DOMParser();
                let responseDoc = parser.parseFromString(responseDetails.responseText.replace(/\/user\/topic\/status/g,'/user/sme/status'), "text/html").getElementById('manuscripts-list');
                $("#manuscripts-list").after(responseDoc);
            }
        });
    }

    //Manuscript Page 侧边栏紧凑
    if(window.location.href.indexOf(".mdpi.com/") > -1 && window.location.href.indexOf("susy") > -1 && GM_config.get('Manuscriptnote')==true){try{
        waitForKeyElements(".manuscript-note-box",SidebarSize);
    } catch (error){ }}

    //GE Invitation✏️ + Quick
    if (window.location.href.indexOf("/invite/guest_editor") > -1){try{
        unsafeWindow.$(document.getElementById('emailTemplates')).append('<option value>*Guest Editor - SI Mentor Program</option>').trigger("chosen:updated").change(function(){
            if($("#emailTemplates option:selected").text() == "*Guest Editor - SI Mentor Program") {
                $.ajax({url:$("#emailTemplates").attr("data-url"), dataType:"json", type:"post", async:"true", data:{id:"269",placeholders:$("#placeholders").val()}, success:function(data){
                    let SI_mentor_body = data.body.replace(
                        /(Dear .*,)[\s\S]*tentative title of (.*) for the journal (.*), (.*)\)[\s\S]*(https:\/\/susy.mdpi.com\/guest_editor\/invitation\/process.*)[\s\S]*egards,/, "$1\n\nWe are pleased to invite you to participate in the Special Issue Mentor "
                        + "Program on $2, offered by the open access journal $3).\n$4/announcements/5184\n\nThis program provides early career researchers, such as postdocs and new faculty, the opportunity to propose innovative ideas for new Special Issues, with "
                        + "the guidance of experienced professors from your institution. We believe this is a valuable opportunity for you to demonstrate your expertise in your field and make a meaningful contribution to the scientific community.\n\nAs a guest "
                        + "editor, you will be responsible for:\n• Preparing the Special Issue's title, aim and scope, summary, and keywords;\n• Assisting in the invitation of feature papers;\n• Making pre-check and final decisions on the manuscripts.\n\nAs a "
                        + "guest editor, you will also enjoy the following benefits:\n• Invitations for up to 10 leading specialists or senior experts from your university or other institutes in your country to submit papers with fee waivers or discounts (subject "
                        + "to approval from the editorial office);\n• Promotion of your expertise in your field;\n• Promotion of your latest research outputs through our marketing channels;\n• The possibility of receiving a travel grant to attend relevant "
                        + "conferences;\n• Certificates for mentors and early career researchers.\n\nIf more than 10 papers are published in the Special Issue, the entire issue may be published in book format and sent to you. Other editorial duties will be fully "
                        + "handled by the editorial office.\n\nWe believe that this is a truly exciting opportunity for you to engage in editorial services and make scientific contributions at the highest level. If you are interested in participating in this "
                        + "program, please click the following link to accept or decline our request:\n$5\n\nIf you have any questions or would like further details, please do not hesitate to contact us. We look forward to your response and hope that you will "
                        + "join us in this opportunity.\n\nKind regards,");
                    let SI_mentor_subject = data.subject.replace("be the Guest Editor of the Special Issue", "Participate in the Special Issue Mentor Program");
                    $("#mailBody").val(SI_mentor_body);$("#mailSubject").val(SI_mentor_subject);
                }});
            }
        })

        $('#mailSubject').parent().after(`&nbsp;<a onclick="document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(/, entitled.*?, in our/g, ' in our').replace(/Please click [\\s\\S]*?https.*\\n\\n/g, '');">🖇️</a>`);
        $('#mailSubject').parent().after(`<a onclick="document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(/• A waiver and discount.*?\\n/g, '').replace('benefit from:\\n• Promoting', 'benefit from:\\n`
                                         + `• Invitation for up to 10 leading specialists or senior experts from the United States to submit papers with fee waivers or discounts. These benefits are subject to approval from the editorial office.\\n• Promoting');">🇺🇸</a>`);
        if (GM_config.get('GE_TemplateID')=="Guest Editor - Invite with Benefits and Planned Papers"){
            $('#mailSubject').parent().after(`<a onclick="document.getElementById('mailBody').value=document.getElementById('mailBody').value.replace(/We will gladly waive .+? from the Guest Editor. /, '');">[No Discount]</a>&nbsp;`);
        }

        $("#emailTemplates > option:contains('"+GM_config.get('GE_TemplateID')+"')").prop('selected', true);
        unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");
        function init() {let t1 = RegExptest(GM_config.get('GE_TemplateS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, Functiontest(GM_config.get('GE_TemplateS2'))) );
                         let t2 = RegExptest(GM_config.get('GE_TemplateB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, Functiontest(GM_config.get('GE_TemplateB2'))) );
                         if(window.location.search == "?Q") {setTimeout(function(){$("#sendingEmail").click()},500);}
                        }
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        $('html, body').scrollTop($('#emailTemplates_chosen').offset().top);
    } catch (error){ }}

    //GE Reminder✏️ + Quick
    if (window.location.href.indexOf("/remind/guest_editor") > -1){try{
        $("#emailTemplates > option:contains('"+GM_config.get('GE_ReminderID')+"')").prop('selected', true);
        unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");
        function init() {let t1 = RegExptest(GM_config.get('GE_ReminderS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, Functiontest(GM_config.get('GE_ReminderS2'))) );
                         let t2 = RegExptest(GM_config.get('GE_ReminderB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, Functiontest(GM_config.get('GE_ReminderB2'))) );
                         if(window.location.search == "?Q") {setTimeout(function(){$("#sendingEmail").click()},500);}
                        }
        waitForText(document.querySelector('#mailSubject'), ' ', init);

        $('#mailSubject').parent().after('<a id="Awaiting"><img src="/bundles/mdpisusy/img/icon/pencil.png"></a>');
        $('#Awaiting').click(function(e) {if ($('#mailSubject').val().indexOf("Awaiting Your Reply")==-1) {$('#mailSubject').val("Awaiting Your Reply: " + $('#mailSubject').val())}});
        $('html, body').scrollTop($('#emailTemplates_chosen').offset().top);
    } catch (error){ }}

    //EB invitation✏️
    if (window.location.href.indexOf("present_editor_ebm/invite_email") > -1){try{
        if ($('#emailTemplates option').length > 1) { $('#emailTemplates').prop('selectedIndex', 1).trigger('change'); document.getElementById('emailTemplates').dispatchEvent(new CustomEvent('change'))}
        function init() {let t1 = RegExptest(GM_config.get('EB_TemplateS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, Functiontest(GM_config.get('EB_TemplateS2'))) );
                         let t2 = RegExptest(GM_config.get('EB_TemplateB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, Functiontest(GM_config.get('EB_TemplateB2'))) );}
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        $('#mailSubject').parent().after('<a id="No_Discount">[No Discount]</a>');
        $('#No_Discount').click(function(e) {$('#mailBody').val($('#mailBody').val().replace(/you will have the opportunity to publish one paper free of charge in .* per year, and can also publish extra papers with special discounts.\n\n/,'').replace(
            'Additionally, we would like to invite you to publish one paper per year—this will be free of charge once accepted for publication. ','').replace(/\nPlease click on the following link .*?\nhttp.*?\n/g,''))});
        $('html, body').scrollTop($('#emailTemplates').offset().top);
    } catch (error){ }}

    //EB Reminder✏️
    if (window.location.href.indexOf("present_editor_ebm/remind_email") > -1){try{
        function init() {let t1 = RegExptest(GM_config.get('EB_ReminderS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, Functiontest(GM_config.get('EB_ReminderS2'))) );
                         let t2 = RegExptest(GM_config.get('EB_ReminderB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, Functiontest(GM_config.get('EB_ReminderB2'))) );}
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        $('html, body').scrollTop($('#emailTemplates').offset().top);
    } catch (error){ }}

    //GE Monthly Report
    if (window.location.href.indexOf("/email/acknowledge/") > -1){try{
        $("#emailTemplates > option:contains('"+GM_config.get('Report_TemplateID')+"')").prop('selected', true);
        unsafeWindow.$(document.getElementById('emailTemplates')).trigger("chosen:updated").trigger("change");

        let result = "";
        if(GM_config.get('Report_TemplateB2').indexOf("%pp_list%") > -1) {
            let counter = 0, xhr = new XMLHttpRequest(); xhr.open('GET', "/special_issue/process/" + $("#special_issue_id").attr("data-special-issue-id"), false); xhr.send();
            let $form = $($.parseHTML(xhr.responseText)).find('#special-issue-planned-papers-form');
            $form.find('tbody tr').each(function() {
                let $td = $(this).find('td'), email = $td.eq(0).text().trim(), status = $td.eq(1).text().trim(), invitedByGE = $td.eq(2).text().trim(),
                    discount = parseFloat($td.eq(3).text().trim().replace(/ /g, '').replace(/CHF/g, '')), agreedDate = new Date($td.eq(5).text().trim());
                if (status === "Title Provided" || status === "Agreed") { counter++;
                    if (invitedByGE === "Yes" && discount > 0) {
                        let discountRatio = 0;
                        switch (agreedDate.getFullYear()) {
                            case 2021: discountRatio = discount / 1600; break;
                            case 2022: discountRatio = discount / 1800; break;
                            case 2023: if(agreedDate.getMonth() < 6) {discountRatio = discount / 2100} else {discountRatio = discount / 2600}; break;
                            default: discountRatio = 8;
                        }
                        result += `(${counter}) ${email} (${(discountRatio * 100).toFixed(0)}% discount)\n`;
                    } else {
                        result += `(${counter}) ${email}\n`;
                    }
                }
            });
        }

        function init() {let t1 = RegExptest(GM_config.get('Report_TemplateS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, Functiontest(GM_config.get('Report_TemplateS2'))) );
                         let t2 = RegExptest(GM_config.get('Report_TemplateB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, Functiontest(GM_config.get('Report_TemplateB2'))) );
                         $("#mailBody").val( $("#mailBody").val().replace("%pp_list%", result.trim()) );

                         $("#maincol").after('<div id="special_issue_note_offcanvas" class="hide-note-offcanvas"></div>');
                         $.get("/user/notes_of_special_issue/" + $("#special_issue_id").attr("data-special-issue-id"), function(res) {
                             $('#special_issue_note_offcanvas').html(res.note_html); $('#special_issue_note_offcanvas').removeClass('hide-note-offcanvas');
                             $('#close-offcanvas-note').parent().click(function(){$("#special_issue_note_offcanvas").toggleClass("hide-note-offcanvas");});
                             if (GM_config.get('SInote')) {waitForKeyElements(".special-issue-note-box",SidebarSize)};
                             let OtherEmails = res.note_html.match(/GE Other Emails:(.*?)[\n<]/), Appellation = res.note_html.match(/GEs:(.*?)[\n<]/);
                             if (OtherEmails) {$("#mailTo").val(OtherEmails[1]); $("#mailTo").focus();}
                             if (Appellation) {$("#mailBody").val( $("#mailBody").val().replace(/(?<=^Dear ).*/, Appellation[1].trim()+",") )}
                             $("#mailBody").prop('selectionStart', 0).prop('selectionEnd', 0).focus(); $("#mailTo").focus();
                         });
                        }
        waitForText(document.querySelector('#mailSubject'), ' ', init);

        $('#mailBody').parent().after(`<div style="flex-direction: column"><div style="flex-direction: row"><a id="undoBtn"><svg width="24" height="24"><path d="M6.4 8H12c3.7 0 6.2 2 6.8 5.1.6 2.7-.4 5.6-2.3 6.8a1 1 0 01-1-1.8c1.1-.6 1.8-2.7 1.4-4.6-.5-2.1-2.1-3.5-4.9-3.5H6.4l3.3 3.3a1 1 0 11-1.4 1.4l-5-5a1 1 0 010-1.4l5-5a1
        1 0 011.4 1.4L6.4 8z" fill-rule="nonzero"></path></svg></a> <a id="redoBtn"><svg width="24" height="24"><path d="M17.6 10H12c-2.8 0-4.4 1.4-4.9 3.5-.4 2 .3 4 1.4 4.6a1 1 0 11-1 1.8c-2-1.2-2.9-4.1-2.3-6.8.6-3 3-5.1 6.8-5.1h5.6l-3.3-3.3a1 1 0 111.4-1.4l5 5a1 1 0 010 1.4l-5 5a1 1 0 01-1.4-1.4l3.3-3.3z" fill-rule="nonzero">
        </path></svg></a></div><div style="flex-direction: column" id="insert"><p><a id="cfpapproval">[CfP Approval]</a></p><p><a id="cfpremind">[CfP Remind]</a></p><p><a id="cfpsent">[CfP Sent]</a></p><p><a id="personalcfp">[Personal CfP]</a></p><p><a id="book">[SI Book]</a></p><p><a id="certificate">[Certificate]</a></p>
        <p><a id="conference">[Conference]</a></p><p><a id="deadline">[Deadline Ext.]</a></p><p><a id="deadline2">[Deadline Ext. 2]</a></p><p><a id="LinkedIn">[LinkedIn]</a></p></div></div>`);
        let undoStack = [], redoStack = [], insert_text = "";
        $('#insert a').click(function() {
            switch ($(this).attr("id")) {
                case 'cfpapproval': insert_text=`\n3. Approval of Call for Paper List\n\nI'd like to inquire about the appropriateness of using the attached list of email addresses to send out calls for papers for our special issue. These addresses were collected from our database using an AI system, and I wanted to confirm that they `
                    + `are suitable for receiving calls for papers for our special issue. If you believe that any of the addresses on the list are not suitable, please let me know and I will remove them from the list. If you think that all of the addresses are suitable, please let me know as well.\n\nOnce I have received your feedback`
                    + `, our editorial office will send out paper invitations to the potential authors on the list.\n\nThank you for your support. I look forward to hearing from you again.\n`; $("#addnote").val("检查CfP list"); break;
                case 'cfpremind': insert_text=`\n3. Reminder: Call for Paper List Approval\n\nLast month, we invited you to check the mailing list for your Special Issue. I would like to kindly inquire if you have had a chance to review the list. If so, please let me know if you approve of the invitations so that we can proceed with sending `
                    + `them out. Your prompt response will be greatly appreciated.\n`; $("#addnote").val("提醒CfP list"); break;
                case 'cfpsent': insert_text=`\n3. CfP Sent\n\nThe Editorial Office has finished sending the 'call for paper' (CfP) invitations to all the potential authors on the mailing list, and we have not received a positive response yet. We will send a reminder a few months later.\n`; break;
                case 'personalcfp': insert_text=`\n3. Manuscript Submission Invitations\n\nBased on our experience with previous Special Issues, we have found that guest editors personally sending invitations can be more effective. In this regard, we would like to request your assistance in providing us with a list of 20-30 potential authors`
                    + `, including their names, affiliations, and email addresses, to whom you can send feature paper invitations with discounts. We recommend that you include authors who will significantly enhance the Special Issue.\n\nWe would like to remind you that our Editorial Office is responsible for administering the discounts. `
                    + `Therefore, we kindly request that you discuss the invitees with us before sending out the invitations.\n\nIf you are unable to provide us with a list, we would be happy if you could send invitations to scholars on our list. If you are interested, we can prepare a mailing list and email template that you can use to `
                    + `send the invitations.\n\nThank you for your valuable time and consideration. We look forward to hearing back from you.\n`; $("#addnote").val("请GE发邀请"); break;
                case 'book': insert_text=`\nIf ten or more papers are published in this Special Issue, we can make a Special Issue book and send a hard copy to each Guest Editor (free of charge). Special Issue book example:\nhttps://www.mdpi.com/books/pdfview/book/3008\n`; $("#addnote").val("告知做书条件"); break;
                case 'certificate': insert_text=`\n3. Editor Certificate\n\nOn behalf of the Editor-in-Chief, we would like to thank you for your editorial work, and we are glad to issue you the editor certificate (see attached). \n\nWe look forward to a fruitful collaboration.\n`;
                    $("#addnote").val("发证书"); window.open("https://susy.mdpi.com/user/list/editors?form[email]=" + $("#mailTo").attr("value").match(/<([^>]+)>/)[1] + "&form[_token]=INShBxf_zyiQ6XpSwRC7dFyTvOYTpaIsun9weGzmiPA"); break;
                case 'conference': insert_text=`\n3. Conferences\n\nI would like to express my sincere appreciation for your efforts in promoting our Special Issue. To further increase its visibility and support your promotional activities, I would like to inquire if you plan to attend or organize any international conferences or workshops `
                    + `in the next months. We are pleased to offer you a travel grant of about 200 CHF to support attendance at these events.\n\nWe kindly ask for your support in promoting our Special Issue in the following ways:\n\n(1) Including one or two slides about our Special Issue in your presentation;\n(2) Attracting planned papers `
                    + `for the Special Issue or encouraging your colleagues and friends to submit their work;\n(3) Distributing flyers about the journal or the Special Issue;\n(4) Promoting the journal during the conference via social media platforms, such as LinkedIn and Twitter.\n\nWe will be more than happy to supply you with promotional `
                    + `materials in advance. Please let us know by writing to me at least eight weeks prior to the event, so that we have sufficient time to prepare and send you the materials.\n\nIf you are interested in this proposal, please send us the conference information in advance, including the estimated number of participants. We `
                    + `will submit the application to our publisher and get back to you.\n\nThank you for considering this opportunity to promote our journal and Special Issue at your upcoming events. We appreciate your continued support.\n`; $("#addnote").val("询问参会"); break;
                case 'deadline': insert_text=`\n3. Submission Deadline\n\nThe submission deadline for our Special Issue is currently set for XXXXXXXXX, but there are still several planned papers that have not been submitted yet. Although we have published a few papers already, we would like to include at least ten papers to create a `
                    + `Special Issue book, which we plan to send as a hard copy to our guest editors.\n\nWith that in mind, I would like to suggest that we extend the submission deadline, for example, to October or XXXXXXXXX, and send another round of "call for paper" invitations. This will give authors more time to complete their papers `
                    + `and potentially attract additional submissions that would greatly enhance the Special Issue.\n\nWhat are your thoughts on this proposal? I would appreciate it if you could let me know if you agree with this suggestion.\n`; $("#addnote").val("询问延期"); break;
                case 'deadline2': insert_text=`\n3. Submission Deadline\n\nAs you may recall, the submission deadline is currently set for XXXXXXX, but there are still several planned papers that have not been submitted. [Additionally, I noticed that you had expressed your interest in submitting your own manuscript to this Special Issue, `
                    + `but it appears that it has not been finished yet.]\n\nGiven these circumstances, I would like to inquire if you think we should extend the submission deadline again. As you know, we have published XXXX papers, and the Special Issue has already achieved significant success. We have seen a growing interest from authors `
                    + `and readers alike, with many regular submissions in this research field recently. Therefore, it would be both reasonable and promising to continue running this Special Issue in the coming months, with a goal of publishing ten or more papers.\n\nI value your opinion on this matter, and I would appreciate it if you `
                    + `could let me know your thoughts. Thank you for your time and consideration. I look forward to hearing back from you.\n`; $("#addnote").val("询问二次延期"); break;
                case 'LinkedIn': insert_text=`\n3. Promotion of the Special Issue\n\nI just wanted to let you know that the Special Issue is now being promoted on LinkedIn at the following link:\nhttps://www.linkedin.com/xxx\n\nIf you have a LinkedIn account, I would greatly appreciate it if you could share the promotion on your profile. `
                    + `This will help to increase visibility for the special issue and potentially reach a wider audience.\n\nThank you in advance for your assistance.\n`; $("#addnote").val("社交网站推广"); break;
            }
            let selectionStart = $('#mailBody')[0].selectionStart, selectionEnd = $('#mailBody')[0].selectionEnd, text = $('#mailBody').val(); let newText = text.substring(0, selectionStart) + insert_text + text.substring(selectionEnd);
            undoStack.push(text); redoStack = []; $('#mailBody').val(newText);
            $('#mailBody')[0].setSelectionRange(selectionStart + insert_text.length, selectionStart + insert_text.length);
        });

        $('#undoBtn').click(function() { if (undoStack.length > 0) {redoStack.push($('#mailBody').val()); $('#mailBody').val(undoStack.pop()); $('#mailBody')[0].setSelectionRange(undoStack[undoStack.length - 1].length, undoStack[undoStack.length - 1].length); document.execCommand('undo');} });
        $('#redoBtn').click(function() { if (redoStack.length > 0) {undoStack.push($('#mailBody').val()); $('#mailBody').val(redoStack.pop()); $('#mailBody')[0].setSelectionRange(undoStack[undoStack.length - 1].length, undoStack[undoStack.length - 1].length); document.execCommand('redo');} });

        $("#addAttachment").after(` <input type="text" id="addnote" value="月报" style="width: 150px; display:inline-block">`); // $("#sendingEmail").after(`<a class="submit" type="button" id="SKsendingEmail">Send email</a>`).hide();
        $("#sendingEmail").click(function(){
            $("div.click-to-edit-manuscript").last().click();
            let $textarea = $("div.manuscript-input-note-group textarea").last();
            let mm = (new Date().getMonth() + 1).toString().padStart(2, "0"), dd = new Date().getDate().toString().padStart(2, "0"), yy = new Date().getFullYear().toString().slice(-2);
            let today = yy + '-' + mm + '-' + dd;
            $textarea.val($textarea.val().replace("GE contact: \n", "GE contact: \n" + today + " " + $("#addnote").val() + "/"));
            waitForKeyElements("button[data-url*='/user/edit/si_follow_up_notes/']",function(){$("button[data-url*='/user/edit/si_follow_up_notes/']").click()});
        });
    } catch (error){ }}

    //文章处理页面[Voucher]按钮和发送推广信按钮等
    if (window.location.href.indexOf("/process_form/")+window.location.href.indexOf("/production_form/") > -2){try{
        if (GM_config.get('ManuscriptFunc')) {
            let Promote='', email=[], name=[];
            let m_id = $("#manuscript_id").parent().text().trim();
            let m_section = $("div.cell.small-12.medium-6.large-2:contains('Section') + div").text().trim();
            let m_journal=$("div .cell.small-12.medium-6.large-2:contains('Journal')").next().text().trim();
            let corresponding=$("b:contains('*')").parent("td").next().last().text().trim();
            let m_si = $("div.cell.small-12.medium-6.large-2:contains('Special Issue') + div").text().trim();

            $("table [title|='Google Scholar']").each(function( index ) {
                name[index] = $(this).parent().prev().text().trim() + " " + $(this).parent().children("b").first().text().trim();
                email[index] = $(this).parent().next().text().trim();
                $(this).before('<a href="mailto:'+email[index]+'?subject=['+ m_journal +'] (IF 2.592, ISSN 2227-7390) Promote Your Published Papers&body=' +
                               GM_config.get('Template_Paper').replace(/\n/g,"%0A").replace(/"/g,"&quot;").replace(/%m_id%/g,m_id).replace(/%m_section%/g,m_section).replace(/%name%/g,name[index]) + '"><img src="/bundles/mdpisusy/img/icon/mail.png"></a> ');
            });

            $("[title|='Send email to authors']").before('<a id="linkedin" href="mailto:' + email.join(";") + '?subject=['+ m_journal +'] Manuscript ID: '+ m_id +' - Your Paper is Promoted via Social Media&body=' + GM_config.get('Template_Linkedin')
                                                         .replace(/\n/g,"%0A").replace(/"/g,"&quot;").replace(/%m_id%/g,m_id).replace(/%m_section%/g,m_section) + '"><img src="https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a" alt="[LinkedIn]"></a> ')
            if (window.location.href.indexOf("?linkedin") > -1) {$("#linkedin")[0].click(); history.back();}
            $("[title='Google']").before(' <a href="https://www.researchgate.net/search.Search.html?type=publication&query='+$("[title='Google']").prev().text()+
                                         '" title="Researchgate" target="_blank"><img style="vertical-align: middle;" src="https://c5.rgstatic.net/m/41542880220916/images/favicon/favicon-16x16.png"></a> ');

            $("[class|='margin-horizontal-1']").after(`<form id='vf' class='insertform' method='post' target='_blank' style='display:none;'><input name='form[journal_id]'><input name='form[is_percentage]' value='1'><input name='form[special_issue_id]'>
            <input name='form[emails]'><input name='form[valid_months]' value='12'><input name='form[section_id]'><input name='form[reason]'><input name='form[manuscript_id]'><textarea name='form[note]'></textarea></form>`);
            $("[class|='margin-horizontal-1']").after(`<div id="voucher" style="display:inline-block;"><a style="color:#4b5675;">[Vouchers]</a><div style="position:absolute;background-color: #f1f1f1;box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);display: none;">
            <a id="v_invited" reason="Feature paper invited by guest editor" style="display:block;padding: 8px 12px;text-decoration: none;color:black;">FP invited by GE</a><a id="v_ge" reason="Paper by guest editor" style
            ="display:block;padding: 8px 12px;text-decoration:none;color:black;">Paper by GE</a><a id="v_ebm" reason="Paper by editorial board member" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">Paper by EBM</a>
            <a id="v_other" reason="Others" style="display:block;padding: 8px 12px;text-decoration:none;color:black;">Others</a></div></div>`);
            $("#voucher").mouseover(function(){ $(this).children("div").show() });
            $("#voucher").mouseout(function(){ $(this).children("div").hide() });
            $('head').append('<style>#voucher a:hover {background-color: #ddd;}</style>');
            if (!m_si) {$("#v_invited, #v_ge").remove()};

            let d_reason="";
            $("#voucher>div>a").click(function(){
                if ($("[data-invoice_id]").length == 0) {alert("There is no APC form on the page. Please change the manuscript status."); return;}

                let xhr = new XMLHttpRequest(); xhr.open('GET', "https://susy.mdpi.com/apply/voucher/on_ms_page/" + $("[data-rel]").attr("data-rel") + "/" + $("[data-invoice_id]").attr("data-invoice_id") + "/", false); xhr.send();
                let searchParams = new URLSearchParams(new URL(decodeURIComponent(xhr.responseURL)).search);
                switch ($(this).attr("id")) {
                    case 'v_invited':
                    case 'v_other': d_reason="The paper invited by GE is now submitted. I would like to apply for a XXX% discount on this paper as we promised before. Hope you may approve.\n\nP.S. No need to send promotion letter. / Promotion letter has been sent.";break;
                    case 'v_ge': d_reason = "The paper by GE is now submitted. We agreed to grant a XXX% discount on GE's paper. Hope you may approve.\n\nP.S. No need to send promotion letter. / Promotion letter has been sent."; break;
                    default: d_reason = ""; break;
                }
                $("[name='form[journal_id]']").val(searchParams.get("waiverApplyForm[journal_id]"));
                $("[name='form[section_id]']").val(searchParams.get("waiverApplyForm[section_id]"));
                $("[name='form[special_issue_id]']").val(searchParams.get("waiverApplyForm[special_issue_id]"))
                $("[name='form[emails]']").val(corresponding);
                $("[name='form[manuscript_id]']").val(m_id);
                $("[name='form[note]']").val(d_reason);
                $("[name='form[reason]']").val($(this).attr("reason"));
                $("#vf").attr("action","/voucher/application/create?waiverApplyForm[types]=" + searchParams.get("waiverApplyForm[types]")).submit();
            });

            $("[title='PubPeer']").each(function() {
                let $link = $(this);
                let pubpeer_search = new URLSearchParams(new URL($link.attr("href")).search);
                let pubpeer_name = pubpeer_search.get("q");
                $(this).attr("href","https://pubpeer.com/search?q=authors%3A%22"+pubpeer_name+"%22")
                GM_xmlhttpRequest({
                    method: "GET", url: 'https://pubpeer.com/api/search?q=authors%3A%22'+pubpeer_name+'%22',
                    onload: function(response) {
                        let pub_num = $.parseJSON(response.responseText).meta.total;
                        $link.append("["+pub_num+"]");
                        if(pub_num > 0) {$link.css('background-color', 'gold');}
                    }
                });
            });
        }

        if (GM_config.get('Assign_Assistant')) { //派稿助手
            try {let params = new window.URLSearchParams(window.location.search); let reviewer = params.get('r');
                 if (reviewer.indexOf("@") > -1) {$("#form_email").val(reviewer); $("#nextBtn").click(); waitForKeyElements('#specialBackBtn', scrolldown, true); function scrolldown() {$('html, body').scrollTop($('#form_email').offset().top)} }
                } catch (error){ }

            if ($("strong.margin-horizontal-1").text().indexOf("decision") > -1) {
                $.get("/user/assigned/production_form/" + window.location.href.match("process_form/(\\w*)")[1], function(res) {
                    if (res.indexOf("see more at redmine issue ") > -1) {$("legend:contains('Academic Editor Decision')").append(" [Layout Sent]")} else {$("legend:contains('Academic Editor Decision')").append(" <span style='color:yellow'>[Layout NOT Sent]</span>")}
                });
            }

            if (S_J==154 || S_J==517) {
                $("table [title|='Google Scholar']").each(function() {
                    let ranking = get_univ( $(this).parent().nextAll(":last-child").text().trim() );
                    if(ranking.color){
                        let markup = $(this).parent().nextAll(":last-child").children("div");
                        markup.css("background-color",ranking.color); markup.attr("title",markup.attr("title")+"<br>" + ranking.detail)
                    }
                });
                $("table:has([title|='Google Scholar'])").parent().prev().html( $("table:has([title|='Google Scholar'])").parent().prev().html() + " <a href='//redmine.mdpi.cn/projects/journal-mathematics/wiki/SI_Manage_CN' target=_blank>[List]</a>" )
            }
        }
    } catch (error){ }}

    //特刊列表免翻页⚙️
    if (window.location.href.indexOf(".mdpi.com/special_issue_pending/list") > -1 && window.location.href.indexOf("page=") == -1){try{
        if(GM_config.get('SInote')) { waitForKeyElements(".special-issue-note-box",SidebarSize);}
        if(GM_config.get('SIpages')){
            let maxpage = 20, totalpage = Math.min(maxpage,parseInt($('li:contains("Next")').prev().text())), counter, Placeholder="";
            for (counter = 2; counter<=Math.min(maxpage,totalpage); counter++) {
                let i = counter;
                $('#maincol >>> table').parent().append("<table cellspacing=0 cellpadding=0 id='statustable" + i + "'></table>")
                GM_xmlhttpRequest({
                    method: "GET",
                    url: $(".pagination.margin-0 a:contains('2')").attr("href").replace(/page=2/gi,"page=" + i),
                    onload: function(response) {
                        var $jQueryObject = $('#maincol >>> table',$.parseHTML(response.responseText));
                        $('#statustable' + i).html($jQueryObject.html());
                    }
                });
            }
            if (totalpage>=maxpage) {Placeholder += "<br><br>Only List " + maxpage + " Pages.<br><br>"}

            if (S_J>0) {$("[href='/special_issue_pending/list?show_all=my_journals']").attr('href',"/special_issue_pending/list/online?form[journal_id]=" +S_J+ "&show_all=my_journals");}
        }
    } catch (error){ }}

    //特刊页面➕按钮、Note
    if (window.location.href.indexOf(".mdpi.com/submission/topic/view")+window.location.href.indexOf(".mdpi.com/special_issue/process") > -2){try{
        if (GM_config.get('SInote')) {waitForKeyElements(".special-issue-note-box",SidebarSize)}
        if ($("a:contains('Edit at backend')").length) {$('#si-update-emphasized').parent().children("a").first().attr("href", $("a:contains('Edit at backend')").attr("href").replace(/.*\//,"https://mdpi.com/si/") )};
        $('#si-update-emphasized').before('<a href="?pagesection=AddGuestEditor" title="Add Guest Editor"><img border="0" src="/bundles/mdpisusy/img/icon/plus.png"></a> ');
        $("[for='form_name_system']").append(` <a onclick="$('#form_name_system').prop('readonly', false)">[Edit]</a>`);
        if(GM_config.get('Hidden_Func')) {
            $('#si-update-emphasized').before('<a href="'+$('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/","/special_issue/reset_status/")+'" title="Reset"><img border="0" src="/bundles/mdpisusy/img/icon/arrow.png"></a> ');
            $('#si-update-emphasized').before('<a href="'+$('#si-update-emphasized').attr("data-uri").replace("/si/update_emphasized/","/special_issue/close_invitation/")+'" title="Close"><img border="0" src="/bundles/mdpisusy/img/icon/book.png"></a> ');
            $(".input-group-button").append('&nbsp; <input type="button" class="submit add-planned-paper-btn" value="Force Add">');
            $("#checkMailsdb").before('<input id=eltry_stop style=display:none type=button class=submit value=Stop><input id=eltry_stopbox style=display:none type=checkbox> ');
            $("#guestNextBtn").after(' <span id=timesRun style=background-color:#90EE90></span> <input id=eltry style=display:inline-block type=button class=submit value="! AutoRetry"> <input id=add6th style=display:inline-block type=button class=submit value="! Add6th">');

            $("#eltry_stop").click(eltry_stop); function eltry_stop (zEvent) {$("#eltry_stopbox").prop('checked',true)};
            $("#eltry").click(sk_eltry); function sk_eltry (zEvent) {
                $("body").append(`<div class="blockUI blockOverlay"id=ith-shade1 style=z-index:1000;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div>`);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: atob("aHR0cHM6Ly9za2RheS5jb20vdGFzay93b3N2ZXJpZnkucGhwP3Y9") + $("#topmenu span:contains('@mdpi.com')").text() +"&version=susy" + GM_info.script.version,
                    onload: function(responseDetails) {
                        let response = responseDetails.responseText ?? "";
                        if(response.indexOf("OK ") > -1) {sk_eltry_action(response.split("OK ").pop());} else {$("#ith-shade1").remove(); alert("Not developed yet...");}
                    }
                });
            }

            function sk_eltry_action (p1) {
                $("body").append(`<div class="blockUI blockMsg blockPage" id=ith-shade2 style="z-index:1011;position:fixed;padding:10px;margin:10px;width:500px;top:25%;height:500px;left:35%;color:#000;border:3px solid #aaa;background-color:#fff">
                <form onsubmit="return false;"><br>E-Mail <input type="text" id="sk_eltry_email" style="display:inline-block; width:65%;" value="`+$("#form_email").val()+`" required> <br>Interval <input type="number" id="sk_eltry_interval" min=`+p1+` max=10000 step=50
                style="display:inline-block; width:7em;" value=`+p1+` onkeydown="return false;" required> ms <br>Start Time <input type="time" id="sk_eltry_startt" style="display:inline-block; width:10em;" required><br><input type=submit id=sk_eltry_submit
                value=Start style="margin:10px;padding:5px 20px"><input onclick='document.getElementById("ith-shade1").remove(),document.getElementById("ith-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"></form></div>`)
                $("#sk_eltry_submit").click(function(e){
                    var eltry_email = $("#sk_eltry_email").val();
                    var interval_time = $("#sk_eltry_interval").val();
                    let today = new Date();
                    var start_time = new Date(today.getFullYear() + '/' + (today.getMonth()+1 < 10 ? '0'+(today.getMonth()+1) : today.getMonth()+1) + '/'+today.getDate() + ' ' + $("#sk_eltry_startt").val());
                    var today_string = today.getFullYear() + '-' + (today.getMonth()+1 < 10 ? '0'+(today.getMonth()+1) : today.getMonth()+1) + '-'+today.getDate() + ' ';
                    $("#eltry_stop").css("display","inline-block"); $("#eltry").css("display","none"); $("#add6th").css("display","none"); $("#ith-shade1").remove(); $("#ith-shade2").remove();
                    $("#form_email").val(eltry_email); $("#guestNextBtn").click();

                    waitForKeyElements("#specialBackBtn", sk_eltry_check2, true);
                    function sk_eltry_check2() {
                        var timesRun = 1; $("#timesRun").text("Autotry will start at: " + start_time);
                        let notify_init = {dir: "auto", body: eltry_email+" will be invited on "+start_time+". Please don't close the tab.", requireInteraction: false, icon: "https://susy.mdpi.com/bundles/mdpisusy/img/icon_old/favicon-196x196.png"};
                        if (start_time > Date.now()) {notifyMe('Starting', notify_init); timesRun = 0;}
                        var notify_options = {
                            dir: "auto", //Text Direction
                            body: "GE can be invited soon, please watch the webpage.",
                            requireInteraction: true, //Autohide or not
                            icon: "https://susy.mdpi.com/bundles/mdpisusy/img/icon_old/favicon-196x196.png"
                        };
                        var interval = setInterval(function(){
                            if (start_time-Date.now() < 40000) {
                                if (timesRun == 0) {
                                    notifyMe('Starting', notify_options);
                                }
                                timesRun += 1; $("#timesRun").text(timesRun + " attempts auto trying. ");
                                $("#guestNextBtn").click();
                                if ($("p:contains('on "+today_string+"')").length) {
                                    clearInterval(interval); $("#timesRun").text("The GE is already invited by others. Stopped.");
                                } else if ($("#eltry_stopbox").prop("checked")) {
                                    $("#eltry_stop").css("display","none"); $("#eltry").css("display","inline-block"); $("#add6th").css("display","inline-block"); clearInterval(interval); $("#timesRun").text("");
                                } else if ($("p:contains('You are not allowed to invite the editor')").length) {
                                    // do nothing
                                } else if (document.getElementById('process-special-issue-guest-editor') !=null) {
                                    clearInterval(interval);
                                    document.getElementById("process-special-issue-guest-editor").click();
                                    $("body").append(`<div class="blockUI blockOverlay" style=z-index:1000;border:none;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div><div class="blockUI blockMsg blockPage" style=
                                    "z-index:1011;position:fixed;width:30%;top:45%;height:50px;line-height:40px;left:35%;text-align:center;color:#000;border:3px solid #aaa;overflow-y:none;background-color:#fff;vertical-align:middle">Proceeding... Please wait.</div>`)
                                    $("#process-special-issue-guest-editor").click();
                                } else {
                                    // do nothing
                                }
                            } else if (Math.round((start_time-Date.now())/1000) % 120 == 0) {
                                $("#guestNextBtn").click();
                                $("#timesRun").text("Autotry will start in [" + Math.round((start_time-Date.now())/1000/60) + " min]: " + start_time );
                            }
                        }, interval_time);
                    }

                    function notifyMe(title, options) {
                        if (!window.Notification) { console.log('Notification is not supported by Broswer!'); }
                        else {
                            if (Notification.permission === 'granted') {
                                var notification = new Notification(title, options); notification.onclick = e => {};
                            } else if (Notification.permission === 'default') {
                                Notification.requestPermission().then(permission => {
                                    if (permission === 'granted') {
                                        console.log('Notification is granted by User!');
                                        var notification = new Notification(title, options); notification.onclick = e => {};
                                    } else if (permission === 'default') {
                                        console.warn('Notification is not granted or denied. Let us try again!');
                                    } else {
                                        console.log('Notification is denied by User!');
                                    }
                                });
                            } else { console.log('Notification is denied by User in the past!'); }
                        }
                        return notification;
                    }
                });
            }

            $("#add6th").click(sk_add6th); function sk_add6th (zEvent) {
                $("#eltry").css("display","none"); $("#add6th").css("display","none");
                $("#guestNextBtn").click();
                waitForKeyElements("#specialBackBtn", sk_add6th_check, true);
                function sk_add6th_check() {
                    $("#specialBackBtn").after(` <input id="process-special-issue-guest-editor" type="submit" value="Force Add" class="submit is-psme-assessment">`);
                }
            }
        }
        Quick_InviteRemind($("a[href^='/email/invite/guest_editor/']")); Quick_InviteRemind($("a[href^='/email/remind/guest_editor/']"));
        function Quick_InviteRemind(param) {param.each(function(){$(this).after(" (<a href='" + $(this).attr("href") + "?Q'>Quick</a>)")})}

        $('a[data-title="Extend Deadline"]').click(function(e){waitForKeyElements("#form_deadline", solve_readonly, false); function solve_readonly(){$("#form_deadline").attr("readonly",false)};})
        $('a[data-title="Change special issue deadline"]').click(function(e){waitForKeyElements("#form_date", solve_readonly2, false); function solve_readonly2(){$("#form_date").attr("readonly",false)};})
        $('div.cell.small-12.medium-6.large-2:contains("Online Date")').next().css({"background-color":"yellow"});
        $('input[value="Contact All Guest Editors"]').after($('<a>', {text: 'Contact [New Tab]', href: $('input[value="Contact All Guest Editors"]').attr('onclick').match(/'([^']+)'/)[1], target: '_blank'})).after(" ");
        $("#form_checklist_1").before("<input id='select_all' type='button' value='[Select All]'><br>"); $("#select_all").click( function(){$("#si-cfp-form [type=\'checkbox\']").prop("checked",true)} );
    } catch (error){ }}

    //SI可行性报告
    if (window.location.href.indexOf(".mdpi.com/si/evaluation_checklist_hash/") > -1){try{
        $("#sp_100").children("div").first().prepend(`<div style="padding:10px;background:lightyellow;font-size:12px;">Enter keywords separated by commas, semicolons or linebreaks:<textarea id=s_key></textarea>Operators: [Finder]
        <select id="finder_o" style="display:inline-block; width:auto"><option value="and" selected="selected">And</option><option value="or">Or</option></select> [WoS] <select id="wos_o" style="display:inline-block; width:auto"><option value="AND">And</option>
        <option value="OR" selected="selected">Or</option></select> <button id=s_key_submit class=submit progress=zero style=margin:0>Generate Feasibility Report</button></div>`)

        $("#s_key").val($("#sq_101i").val().replace(" and ","\n")); $("#s_key_submit").click(fc_fill);
        function fc_fill(){
            let keywords=$("#s_key").val().split(/[.:;,|\n/\\]+/), keyword_num = keywords.length, url1 = "https://finder.susy.mdpi.com/topic/special_issue?", n_closed,n_open,n_pending,j_open,n_wos,n_wos_m,wss_fin,conclusion=0;
            let fc_journal_name=$("h4:contains('Journal:')").find("i").text(); let fc_j_id = get_jid(fc_journal_name.toLowerCase());
            let WOS_Category="";
            for (let i=0; i<keyword_num; i++){ url1 = url1 + "fields[keywords]["+ i +"]="+ keywords[i] +"&fields[operators]["+ i +"]="+$("#finder_o").val()+"&" }
            url1 = encodeURI(url1.slice(0,-1));
            $("#s_key_submit").attr('disabled', true).text("Progessing"); $('input[value="Complete"]').attr('disabled', true);

            GM_xmlhttpRequest({
                method: 'GET',
                url: url1,
                onload: function(responseDetails) {
                    if (responseDetails.finalUrl.indexOf("finder.susy.mdpi.com/login")>-1) {
                        alert("Please first login to [Finder] and try again.");
                        $("#s_key_submit").attr('disabled', false).attr('progress', 'zero').text("Click to Try Again"); $('input[value="Complete"]').attr('disabled', false);
                        GM_openInTab(url1, false); return;
                    }
                    let $res = $($.parseHTML(responseDetails.responseText));
                    n_closed = $res.find("#filter_fields_si_statuses_Closed").parent().text().match(/\d+/).pop();
                    n_open = $res.find("#filter_fields_si_statuses_Open").parent().text().match(/\d+/).pop();
                    n_pending = $res.find("#filter_fields_si_statuses_Pending").parent().text().match(/\d+/).pop();
                    GM_xmlhttpRequest({url: url1+"&fields[journals][]="+fc_j_id, onload: function(responseDetails) {
                        let $resj = $($.parseHTML(responseDetails.responseText));
                        j_open = $resj.find("#filter_fields_si_statuses_Open").parent().text().match(/\d+/).pop();
                        $("div[title='Rich Text Editor, editor1']").html("<p>Title: "+keywords.join(' '+$("#finder_o").val()+' ')+"</p><p>The number of open SIs in your journal:"+j_open+"</p><p>The number of open SIs in MDPI:"+n_open+
                                                                         "</p><p>The number of pending online SIs in MDPI:" + n_pending +"</p><p>The number of closed SIs in MDPI:"+n_closed+"</p><p>Link: "+url1+"</p>")
                        if ($("#s_key_submit").attr("progress") == "half") {write_conclusion();} else {$("#s_key_submit").attr("progress","half");}
                    } });
                } });

            let date = new Date(), year5=date.getFullYear()-5, year1=date.getFullYear()+1, url2;
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://search.webofknowledge.com/esti/wokmws/ws/WOKMWSAuthenticate?wsdl',
                data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:auth="http://auth.cxf.wokmws.thomsonreuters.com"><soapenv:Header/><soapenv:Body><auth:authenticate/></soapenv:Body></soapenv:Envelope>',
                onload: function(responseDetails) {
                    var SID = responseDetails.responseText.match(/<return>(.*?)<\/return>/), QID=0;
                    if (SID == null) {
                        alert("Something wrong with WoS. Please ensure that you can access to WoS and try again 3 minutes later.");
                        $("#s_key_submit").attr('disabled', false).attr('progress', 'zero').text("Click to Try Again"); $('input[value="Complete"]').attr('disabled', false);
                        return;
                    } else {SID=SID.pop();}
                    var ws = new WebSocket("wss://www.webofscience.com/api/wosnxcorews?SID="+SID);
                    let param = {"commandId":"runQuerySearch","params":{"product":"WOSCC","searchMode":"general","viewType":"search","serviceMode":"summary","search":{"mode":"general","database":"WOSCC","query":[{"rowText":"TS=("+keywords.join(' '+$("#wos_o").val()+' ')
                    + ") and PY=("+year5+"-"+year1+")"}],"sets":[],"options":{"lemmatize":"On"}},"retrieve":{"count":50,"history":true,"jcr":true,"sort":"relevance","analyzes":["TP.Value.6","DR.Value.6","REVIEW.Value.6","EARLY ACCESS.Value.6","OA.Value.6","PY.Field_D.6",
                    "TASCA.Value.6","OG.Value.6","DT.Value.6","AU.Value.6","SO.Value.6","PUBL.Value.6","ECR.Value.6","DX2NG.Value.6"]},"eventMode":null},"id":1};
                    let param2 = {"commandId":"runQuerySearch","params":{"product":"WOSCC","searchMode":"general","viewType":"search","serviceMode":"summary","search":{"mode":"general","database":"WOSCC","query":[{"rowText":"TS=("+keywords.join(' '+$("#wos_o").val()+' ')
                    + ") and WC=mathematics and PY=("+year5+"-"+year1+")"}],"sets":[],"options":{"lemmatize":"On"}},"retrieve":{"count":50,"history":true,"jcr":true,"sort":"relevance","analyzes":["TP.Value.6","DR.Value.6","REVIEW.Value.6","EARLY ACCESS.Value.6",
                    "OA.Value.6","PY.Field_D.6","TASCA.Value.6","OG.Value.6","DT.Value.6","AU.Value.6","SO.Value.6","PUBL.Value.6","ECR.Value.6","DX2NG.Value.6"]},"eventMode":null},"id":2};

                    ws.onopen = function () { ws.send(JSON.stringify(param)); }
                    ws.onmessage = function (evt) {
                        let data = evt.data;
                        if (data.indexOf('"key":"COMPLETE"')>-1) { ws.close(); }
                        if (data.indexOf('{"QueryID":')>-1) { QID=data.match(/"QueryID":"(.*?)",/).pop(); n_wos=data.match(/"RecordsFound":(.*?),"/).pop(); }
                        if (data.indexOf('"Key":"TASCA')>-1) {
                            $.each( $.parseJSON(data).payload['TASCA.Value.6'].Values, function( index, item ) { WOS_Category = WOS_Category+ "• "+item.Key+": "+item.Value+"; " });
                            WOS_Category = WOS_Category.replace(/TASCA./g,"").toLowerCase().replace(/(?:^|\s)\w/g, function(match) { return match.toUpperCase();});
                        }
                    }
                    ws.onclose = function () {
                        console.log("WSS is closed......");
                        url2="https://www.webofscience.com/wos/woscc/summary/"+QID+"/relevance/1";
                        $("div[title='Rich Text Editor, editor2']")
                            .html("<p>Total Results: "+n_wos+"</p><p>Topic: "+keywords.join(' '+$("#wos_o").val()+' ')+"</p><p>Timespan: Last 5 years</p><p>Indexes: SCI-EXPANDED</p><p>Top Categories: "+WOS_Category+"</p><p>Link: "+url2+"</p>")
                        let ws_m = new WebSocket("wss://www.webofscience.com/api/wosnxcorews?SID="+SID);
                        ws_m.onopen = function () { ws_m.send(JSON.stringify(param2)); }
                        ws_m.onmessage = function (evt) {
                            let data = evt.data;
                            if (data.indexOf('"key":"COMPLETE"')>-1) { ws_m.close(); }
                            if (data.indexOf('{"QueryID":')>-1) { n_wos_m=data.match(/"RecordsFound":(.*?),"/).pop(); }
                        }
                        ws_m.onclose = function () {
                            $("p:contains('Total Results:')").append(" (Category related to Mathematics: "+n_wos_m+")");
                            if ($("#s_key_submit").attr("progress") == "half") {write_conclusion();} else {$("#s_key_submit").attr("progress","half");}
                        }
                    };

                } });

            function write_conclusion(){
                if(j_open==0) {
                    conclusion="I found that there is no similar open Special Issues in our journal, so I suggest creating this Special Issue. Hope you may approve."
                }
                else if (j_open==1) {
                    conclusion="I found that there is only 1 open Special Issue in our journal with similar research field. So I suggest creating this Special Issue. Hope you may approve."
                }
                else if (j_open<4) {
                    conclusion="After evaluation, I found that there are only "+j_open+" similar open Special Issues in our journal. The Publication record indicates that there are about "+n_wos+
                        " papers published in this field in the past 5 years. I suggest creating this Special Issue. Hope you may approve."
                }
                else if (j_open>9) {
                    conclusion="Although there are "+j_open+" similar open Special Issues in our journal, this topic is very wide. The Publication record indicates that there are about "+n_wos+
                        " papers published in this field in the past 5 years. we could focus on other aspects of the topic to make a full cover of the research field. Hope you may approve."; alert("相似特刊太多了，您要不考虑换换吧？")
                }
                else {
                    conclusion="Although there are "+j_open+" similar open Special Issues in our journal, this topic is very wide. The Publication record indicates that there are about "+n_wos+
                        " papers published in this field in the past 5 years. we could focus on other aspects of the topic to make a full cover of the research field. Hope you may approve."
                }
                $("div[title='Rich Text Editor, editor3']").html("<p>"+conclusion+"</p");
                $("#s_key_submit").attr('disabled', false).attr('progress', 'zero').text("Generate Feasibility Report");
                $('input[value="Complete"]').attr('disabled', false);
                $('html, body').animate({scrollTop: $("div[title='Rich Text Editor, editor1']").parent().parent().prev().offset().top}, 500);
            }
        }
    } catch (error){ }}
    if (window.location.href.indexOf("/email/invite/eic_decision/") > -1){try{
        unsafeWindow.$('#emailTemplates').prop('selectedIndex', 1).trigger("chosen:updated").trigger('change');
    } catch (error){ }}

    //默认新建特刊位置和Title Case
    if (window.location.href.indexOf(".mdpi.com/user/special_issue/edit/") > -1){try{
        $("#form_name").after("<a id='TitleCaseChicago'>🔡(Chicago)🔠</a> ");
        $("#TitleCaseChicago").click(function () {
            if ($("#form_name").val().length > 1) {
                (async () => {
                    $('#form_name, input[value="Edit"], input[value="Add"]').prop("disabled", true);
                    var result="";
                    let response = await p_get("https://titlecaseconverter.com/tcc/?title=" + encodeURIComponent($("#form_name").val()) + "&preserveAllCaps=true&styleC=true");
                    let jsonarray= $.parseJSON(response.responseText);
                    jsonarray[0].title.forEach(element => {result = result + element.joint + element.word});
                    $("#form_name").val(result);
                    $('#form_name, input[value="Edit"], input[value="Add"]').prop("disabled", false);
                })()
            }
        });
        if (window.location.href.indexOf("/edit/0") > -1 && S_J>0) { unsafeWindow.$('#form_id_journal').val(S_J).trigger("chosen:updated").trigger("change") }
    } catch (error){ }}

    //默认新建EBM位置
    if (window.location.href.indexOf(".mdpi.com/user/ebm-new/management") > -1){try{
        if (S_J>0){
            unsafeWindow.$("#journal_id").val(S_J).trigger("chosen:updated"); $("#role_id").val(9);
            $("[href='/user/ebm-new/management/pending_invitation/my_journals").attr("href","/user/ebm-new/management/pending_invitation/my_journals?form[journal_id]=" +S_J);
        }
        if (GM_config.get('Hidden_Func')){$("#ebm_pending_check_btn").after(' <input class="submit" type="submit" value="Force Proceed"> ');}
    } catch (error){ }}

    //默认Renew EBM期刊
    if (window.location.href.indexOf(".mdpi.com/user/list/editors") + window.location.href.indexOf("/user/ebm/contract") + window.location.href.indexOf("/user/eic/contract") > -3){try{
        if (S_J>0){
            $('a:contains("Renew EBM")').attr('href','/user/ebm/contract?form%5Bjournal_id%5D='+S_J);
            $('a:contains("Renew EIC")').attr('href','/user/eic/contract?form%5Bjournal_id%5D='+S_J);
        }
    } catch (error){ }}

    //特刊网页短链接
    if (window.location.href.indexOf("mdpi.com/journal/") > -1 && window.location.href.indexOf("/special_issues/") > -1 && window.location.href.indexOf("/abstract") == -1 && GM_config.get('LinkShort')){try{
        window.location.href=window.location.href.replace(/\/journal\/(.*)\/special_issues\//,"/si/$1/");
    } catch (error){ }}

    //会议相关
    if (window.location.href.indexOf("mdpi.com/user/conference/") > -1 && window.location.href.indexOf("/view") > -1){try{$("[name=journal_id]").val(S_J);} catch (error){ }}
    if (window.location.href.indexOf("mdpi.com/user/conference/add") > -1) {
        $("#form_conference_organization").val(2).trigger("change"); $("#form_conference_organization_chosen span").text("Societies, Universities or University professors");
        $("[id^=form_checklist]").parent().parent().show(); $("[id^=form_commercial],[id^=form_conference_commercial]").parent().parent().hide(); $("[id^=form_checklist],[id^=form_commercial_checklist]").prop("checked",true);
        if (S_J = 154) { $("#form_subject_id").val(4); $("#form_subject_id_chosen span").text("Computer Science & Mathematics") }
    }
    if (window.location.href.indexOf("mdpi.com/user/send/conference_journal/contact_mail") > -1 && GM_config.get('Con_Template')){try{
        function init() {let t1 = RegExptest(GM_config.get('Con_TemplateS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, GM_config.get('Con_TemplateS2')) );
                         let t2 = RegExptest(GM_config.get('Con_TemplateB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, GM_config.get('Con_TemplateB2')) );}
        waitForText(document.querySelector('#mailSubject'), ' ', init);
        $('#mailSubject').parent().after('<div><a id="First_Line">[First Line]</a><br><br><a id="Del_Proceedings">[Del Proceedings]</a></div>');
        $('#First_Line').click(function() {$('#mailBody').val("Dear Conference Committee,\nTo Whom It May Concern,\n"+$('#mailBody').val()) });
        $('#Del_Proceedings').click(function() {$('#mailBody').val($('#mailBody').val().replace(/\n(.*?)https:\/\/www.mdpi.com\/about\/proceedings(.*?)\n/g,'')) });
    } catch (error){ }}

    //PP提醒模板
    if (window.location.href.indexOf("mdpi.com/special_issue/email/planned_paper") > -1 && GM_config.get('PP_Template')){try{
        function init() {let t1 = RegExptest(GM_config.get('PP_TemplateS1')); $("#mailSubject").val( $("#mailSubject").val().replace(t1, GM_config.get('PP_TemplateS2')) );
                         let t2 = RegExptest(GM_config.get('PP_TemplateB1')); $("#mailBody").val( $("#mailBody").val().replace(t2, GM_config.get('PP_TemplateB2')) );}
        waitForText(document.querySelector('#mailSubject'), ' ', init, 1000);
        $('html, body').scrollTop($('#emailTemplates_chosen').offset().top);
    } catch (error){ }}

    //新增PP修改邮箱
    if (window.location.href.indexOf("mdpi.com/si/planned_paper") > -1) {
        $("[for='form_email']").append(` <a onclick="$('#form_email').prop('readonly', false)">[Edit]</a>`)
    }

    //CfP Checker
    if (window.location.href.indexOf("//redmine.mdpi.") > -1 && GM_config.get('Cfp_checker')){try{
        //Always: Redmine重定向
        if(window.location.href.indexOf("//redmine.mdpi.com/") > -1){window.location.replace(decodeURIComponent(window.location.href.split("login?back_url=")[window.location.href.split("login?back_url=").length-1]).replace("//redmine.mdpi.com/","//redmine.mdpi.cn/"));}
        if(window.location.href.indexOf("//redmine.mdpi.cn//") > -1){window.location.replace(decodeURIComponent(window.location.href.replace(".cn//",".cn/")));}
        //排队界面
        if(window.location.href.indexOf("/projects/si-planning/issues?utf8=")>-1){$('[href="/users/64"]').css("background-color","yellow"); $('h2:contains("Issues")').append(" <span style=background-color:#ff0>("+$('[href="/users/64"]').length+" pending CfP Team)</span>");}
        //CfP filter链接
        $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/si-planning/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]==&v[status_id][]=13&f[]=cf_10&op[cf_10]==&v[cf_10][]=` + GM_config.get('Journal')
                                 + `&f[]=&c[]=cf_25&c[]=cf_10&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&sort=updated_on%3Adesc&per_page=100'>[`+GM_config.get('Journal')+` CfP]</a>`)
        $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/special-issue-prints/issues?utf8=%E2%9C%93&set_filter=1&f[]=status_id&op[status_id]=o&f[]=cf_10&op[cf_10]=%3D&v[cf_10][]=` + GM_config.get('Journal')
                                 + `&f[]=&c[]=cf_10&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on&sort=updated_on%3Adesc&per_page=100'>[Books]</a>`)
        $("#header > h1").append(` <a href='https://redmine.mdpi.cn/projects/feature-paper-invitation/issues?utf8=%E2%9C%93&set_filter=1&f[]=op[status_id]=o&f[]=subject&op[subject]=~&v[subject][]=[` + GM_config.get('Journal')
                                 + `]&f[]=&c[]=tracker&c[]=subject&c[]=status&c[]=assigned_to&c[]=author&c[]=updated_on%3Adesc&per_page=100'>[FP]</a>`)
        //Checker功能和检测函数
        $('label:contains("From CFP Checkers")').after(" <a id='S_C'><u>[Start Check]</u></a>"); $("#S_C").click(sk_cfpcheck_func);
        function sk_cfpcheck_func (zEvent) {
            let Today=new Date();
            $("#issue_pe_note").val($("#issue_pe_note").val()+"--- Checked on " + Today.getFullYear()+ "-" + (Today.getMonth()+1) + "-" + Today.getDate() + " ---\n");
            if($(".subject").eq(0).text().indexOf(GM_config.get('Journal')) == -1) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find [Journal Name]\n")}

            (async () => {
                var result="";
                let response = await p_get("https://titlecaseconverter.com/tcc/?title=" + encodeURIComponent($(".subject").eq(0).text().trim()) + "&preserveAllCaps=true&styleC=true");
                let jsonarray= $.parseJSON(response.responseText);
                jsonarray[0].title.forEach(element => {result = result + element.joint + element.word});
                if(result.match(/[a-zA-Z]*/g).join("") != $(".subject").eq(0).text().match(/[a-zA-Z]*/g).join("")) { $("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ TitleCase Is Inconsistent with Chicago Style: " + result.trim() + "\n") }
            })()

            let DDL = new Date($("th:contains('Special Issue Deadline:')").next().text())
            if(Math.ceil((DDL - Today) / (1000 * 60 * 60 * 24)) < 90) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ Deadline is less than 3 months.\n")}
            if(Math.ceil((DDL - Today) / (1000 * 60 * 60 * 24)) > 365) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Deadline is longer than 12 months.\n")}

            if($(".subject").eq(0).text().indexOf("New CFP Request") > -1){ //未延期特刊
                if($('a:contains("mailing-list.v1")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ Cannot find mailing-list.v1\n")}
                if($('a:contains("cfp-approval.v1.pdf")').length+$('a:contains("cfp-approval.v1.eml")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find cfp-approval.v1.eml (or pdf)\n")}
                if($('a:contains("mailing-list.v1")').length*($('a:contains("cfp-approval.v1.pdf")').length+$('a:contains("cfp-approval.v1.eml")').length)>0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"✅ First Round CfP\n")}
                GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v1")').attr('href'), )
            }
            else if ($(".subject").eq(0).text().indexOf("Extended SI") > -1) { //已延期特刊
                let old_request=$("strong:contains('Please change the issue status to ')").parent().parent();
                let old_DDL = new Date(old_request[old_request.length-1].textContent.match(/Deadline: [0-9,-]*/)[0].replace("Deadline: ",""));
                if(DDL-old_DDL < 86400000 * 30) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ The deadline between 2nd and 1st CfP is too close.\n")}
                if($('a:contains("mailing-list.v3")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"❌ Cannot find mailing-list.v3\n")}
                if($('a:contains("cfp-approval.v2.pdf")').length+$('a:contains("cfp-approval.v2.eml")').length==0) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Cannot find cfp-approval.v2.eml (or pdf)\n")}
                if($('a:contains("mailing-list.v3")').length*($('a:contains("cfp-approval.v2.pdf")').length+$('a:contains("cfp-approval.v2.eml")').length)>0) {
                    $("#issue_pe_note").val($("#issue_pe_note").val()+"✅ Extended SI CfP\n")
                    GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v1")').attr('href'), )
                    GM_openInTab("//" + window.location.host + $('a:contains("mailing-list.v3")').attr('href'), )
                }
            }
            else { //名称不规范
                $("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Subject is Wrong.\n")
            }

            if($(".assigned-to").text().indexOf("CfP") == -1) {$("#issue_pe_note").val($("#issue_pe_note").val()+"⚠️ Assignee is not CfP/MDPI\n")};
        }
    } catch (error){ }}

    //Always: Mailsdb样式⚙️🔝
    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/search/emails") > -1){try{
        $("head").append('<link rel="stylesheet" type="text/css" href="/assets/application-3f4ae7647a4464beb61368778f76d00684da5f6d4b0490fcb3a33e4b350c8bd6.css">');
        $("head").append(`<style>table{width:80%}.colorgray{color:gray!important}.bgcoloref{background:#efefef!important}#user-info .user-info-section{margin-bottom:10px}#user-info span.email{font-weight:400;color:#103247}#user-info span.number{font-weight:400;color:#123}
                    #user-info a{color:#00f}#user-info a:visited{color:#cd7e53}#user-info a:hover{color:#47566d}#user-info table{margin-left:2%;width:98%;background:#99a4b5;margin-bottom:10px;border-right:1px solid #ccc;border-bottom:1px solid #ccc;font-size:14px}
                    #user-info table tr th{text-align:left;background:#4f5671;color:#fefefe;font-weight:400;border-left:1px solid #ccc;border-top:1px solid #ccc;padding:.2rem}#user-info table tr td{border-left:1px solid #ccc;border-top:1px solid #ccc;padding:.2rem;
                    background:#fefefe} #user-info table tr td span.msid{color:#4e6c88;font-weight:400}#user-info table tr td.title{width:50%}#user-info table tr td.journal{width:10%;text-align:center}#user-info table tr td.status{width:10%;text-align:center}
                    #user-info table tr td.submission-date{width:10%;text-align:center}#user-info table tr td.invoice-info{width:10%;text-align:center}#user-info table tr td.invoice-payment-info{width:10%;text-align:center}</style>`);
        document.body.innerHTML = document.body.innerHTML.replace(/ data-url=/g,' href=').replace(/ data-load-url=/g,' href=');
        var susycheck = "https://susy.mdpi.com/user/info?emails="+ window.location.href.match(/search_content=(\S*)/)[1];

        $("body").prepend("<div style='margin:10px;'><div id='d1'>Loading Invitation Record...</div><p>⬆️ ⬆️ ⬆️ ⬆️ ⬆️</p><div id='d2'>Loading Overview...</div><p>⬆️ ⬆️ ⬆️ ⬆️ ⬆️</p><div>");

        if (susycheck.indexOf("@") > -1){
            GM_xmlhttpRequest({
                method: 'GET',
                url: susycheck,
                onload: function(responseDetails) {
                    $("#d2").html(responseDetails.responseText.replace(/href="\//g,"href=\"//susy.mdpi.com/").replace(/ data-url=/g,' href=').replace(/ data-load-url=/g,' href=').replace(/<h1>[\s\S]*<\/h1>/g,''));
                    $("[title='Generate unsubscribe link']").each(function(e) {
                        $(this).attr("href", "//scholar.google.com/scholar?hl=en&q=" + $(this).attr('data-email')).attr("target","_blank").text("").append('<img width="20px" height="20px" src="//susy.mdpi.com//bundles/mdpisusy/img/design/google_logo.png">')
                    });
                    $("a:contains('Edit Reviewer')").each(function(e) {
                        let full_name = $(this).prev("b").text(), first_name = full_name.split(" ")[0], last_name = full_name.split(" ").pop();
                        $(this).after(` <a href="//susy.mdpi.com/user/reviewer/checking/a5ce29b8b4917729fc1dc44abf2fc686?email=` + $("[title='Generate unsubscribe link']").attr('data-email') + `" target="_blank">
                        <img src="//susy.mdpi.com/bundles/mdpisusy/img/icon_old/favicon-16x16.png"></a> <a href="//scholar.google.com/scholar?hl=en&q=` + full_name + `" target=_blank><img src="//susy.mdpi.com//bundles/mdpisusy/img/design/google_logo.png"></a>
                                       <a href="//www.scopus.com/results/authorNamesList.uri?st2=` + first_name + `&st1=` + last_name + `" target=_blank><img src="//www.scopus.com/static/proteus-images/favicon.ico" width=16px height=16px></a>`);
                    });
                } });

            susycheck = "https://susy.mdpi.com/user/guest_editor/check?email="+ window.location.href.match(/search_content=(\S*)/)[1] +"&special_issue_id=1139163";
            GM_xmlhttpRequest({
                method: 'GET',
                url: susycheck,
                onload: function(responseDetails) {
                    var $jQueryObject = $($.parseHTML(responseDetails.responseText.replace(/data-load-url="\/user/g,'data-load-url="//susy.mdpi.com/user')));
                    $("#d1").html($jQueryObject);
                    $("[data-title='Blocked Info']").attr("href","//susy.mdpi.com" + $("[data-title='Blocked Info']").attr("data-uri"))
                } });
        } else {
            $("#d2").parent().remove();
        }
    } catch (error){ }}

    //Always: Reviewer checking样式⚙️
    if (window.location.href.indexOf("reviewer/checking/") > -1){try{
        GM_xmlhttpRequest({
            method: 'GET',
            url: $("a:contains('Edit Reviewer')").attr("href").replace(/reivewer\/managment\/edit/g, 'list/reviewer/invitations-history'),
            onload: function(responseDetails) {
                $("body").append(responseDetails.responseText.replace(/href="\//g,"href=\"//susy.mdpi.com/"));
            } });
        function getUrlParam(name) {var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); var r = window.location.search.substr(1).match(reg); if(r != null) {return decodeURI(r[2]);} return null; }
        $(".morphNotes").first().before(" <a href='https://scholar.google.com/scholar?hl=en&q=" + getUrlParam('email') +"'><img style='vertical-align: middle;' src='/bundles/mdpisusy/img/design/google_logo.png'></a> ");
        $("a:contains('see more')").attr('href',$("a:contains('see more')").attr('data-uri'));
    } catch (error){ } }

    //Always: Paper ID to page
    if(window.location.href.indexOf(".mdpi.com/ajax/submission_get_manuscripts") > -1){try{
        let jsonObject = JSON.parse( $("body").text().replace(/\\/g, '') );
        document.body.innerHTML = '<p>' + jsonObject[0].label + '</p><p>&nbsp;</p><p>https://susy.mdpi.com/' + jsonObject[0].url + '</p><p>&nbsp;</p><p>Redirecting...</p>';
        window.location.href = jsonObject[0].url;
    } catch (error){ }}

    //Always: Unsubscribe link to page
    if(window.location.href.indexOf(".mdpi.com/user/get/unsubscribe_manage_link") > -1){try{$.get(window.location.href, function(res) {window.location.href=res.link})} catch (error){ }}

    //Hidden_Func: MRS ALL journals
    if(window.location.href.indexOf("//mrs.mdpi.com/data/role/") > -1 && GM_config.get('Hidden_Func')){try{
        $('#demo-form2').before(` <a onclick='$("#journal > option")[0].value="250,77,145,362,13,524,534,341,456,390,90,480,517,491,523,35,118,471,323,47,82,346,67,427,240,103,515,299,305,143,487,531,441,123,26,214,440,467,213,176,416,259,428,385,356,142,151,`
                                + `84,404,306,397,127,449,7,402,5,412,83,509,192,301,42,492,275,395,19,460,53,25,413,409,453,79,474,481,163,50,225,215,148,221,355,203,499,37,51,435,170,290,49,432,199,14,407,231,154,81,92,59,522,465,438,314,457,365,359,360,444,`
                                + `165,419,511,358,436,271,353,16,252,114,162,130,206,246,3,233,265,528,518,414,173,296,466,294,15,376,44,131,417,150,276,133,228,291,269,36,504";'>[All Journal]</a>`);
    } catch (error){ }}

    //Hidden_Func: PSAN Redirect
    if(window.location.href=='https://admin.mdpi.com/' && GM_config.get('Hidden_Func')) {try{window.location.href='https://admin.mdpi.com/tools/email-purger/email-list'} catch (error){ }}

//     //Hidden_Func: Remind 2nd Round Reviewer
//     if (window.location.href.indexOf("assigned/remind_reviewer") > -1 && GM_config.get('Hidden_Func')){try{
//         $('#emailTemplates').val(21).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change'));
//     } catch (error){ }}

    //Hidden_Func: Volunteer Reviewer
    if (window.location.href.indexOf("/volunteer_reviewer_info/view/") > -1 && GM_config.get('Hidden_Func')){try{
        $("button:contains('Accept')").attr("onclick","window.location.href='/volunteer_reviewer_info/operate/"+location.href.split('/view/')[1]+"/accept'");
        $("button:contains('Reject')").attr("onclick","window.location.href='/volunteer_reviewer_info/operate/"+location.href.split('/view/')[1]+"/reject'");
        $("div.small-12.large-2:contains('Email')").next().append(`<a href="//scholar.google.com/scholar?hl=en&q=`+$("div.small-12.large-2:contains('Email')").next().text().trim()+`" target=_blank><img src="/bundles/mdpisusy/img/design/google_logo.png"></a>`)
            .append(` <a href="//mailsdb.i.mdpi.com/reversion/search/emails?fm=true&cc=true&to=true&m_type=&sort=desc&link=true&bcc=true&search_content=`+$("div.small-12.large-2:contains('Email')").next().text().trim()+`" target=_blank>[Mailsdb]</a>`)
        $("div.small-12.large-2:contains('First name')").next().append(`<a href="//www.scopus.com/results/authorNamesList.uri?st2=`+$("div.small-12.large-2:contains('First name')").next().text().trim()+`&st1=`
                                                                       +$("div.small-12.large-2:contains('Last name')").next().text().trim()+`" target=_blank><img src="//www.scopus.com/static/proteus-images/favicon.ico" width=16px height=16px></a>`)
    } catch (error){ }}
    if (window.location.href.indexOf("/volunteer/reviewer/email/") > -1 && GM_config.get('Hidden_Func')){try{
        $('html, body').scrollTop($('#mailSubject').offset().top);
    } catch (error){ }}

    //Always: Reviewer Information is not required
    if(window.location.href.indexOf(".mdpi.com/reivewer/create") > -1){try{
        $("#form_affiliation, #form_country, #form_research_keywords").attr("required",false);
        $("#form_url").val(".");
        $('[for="form_affiliation"]>span, [for="form_url"]>span, [for="form_country"]>span, [for="form_research_keywords"]>span').remove();
    } catch (error){ }}

    //Always: Manuscript Notes in Summary Page
    if(window.location.href.indexOf(".mdpi.com/manuscript/summary") > -1){try{
        $("#maincol").after('<div id="manuscript_note_offcanvas" class="hide-note-offcanvas"></div>');
        $.get("/user/nots_of_manuscript/"+window.location.href.match("summary/(.*?)(/|$)")[1], function(res) {
            if (res.show_off_canvas) {
                $('#manuscript_note_offcanvas').html(res.note_html);
                $('#manuscript_note_offcanvas').removeClass('hide-note-offcanvas');
                $('#manuscript_note_offcanvas').find('.manuscript-id').show();
            }
        });
    } catch (error){ }}

    //Always: Mailsdb登陆打勾
    if (window.location.href.indexOf("mailsdb.i.mdpi.com/reversion/login") > -1){try{ $("[name=p_s]").attr('checked',true); $("#check-rem").attr('checked',true); } catch (error){ }}

    //Always: Manage Voucher Applications + 页面最底端
    if(window.location.href.indexOf(".mdpi.com/voucher/application/list/") > -1){try{ document.getElementById("show-more-budgets").click();} catch (error){ }}
    if(window.location.href.indexOf(".mdpi.com/voucher/application/view/") > -1){try{
        $("[value='Approve']").attr("onclick","window.location.replace('/voucher/approve/application/"+location.href.split('/view/')[1]+"')");
        waitForKeyElements(".user_box_head", voucher_scroll, false); function voucher_scroll(){scroll(0,document.body.scrollHeight)};
    } catch (error){ }}
    if(window.location.href.indexOf(".mdpi.com/voucher/application/create?") > -1){try{
        waitForKeyElements("#field-form_emails", ObserveEmail, false); function ObserveEmail(){
            let targetNode = document.getElementById('field-form_emails');
            let observer = new MutationObserver(function(mutations) {
                if ($("#field-form_emails:contains('[Edit]')").length) {return;}
                $("#field-form_emails fieldset>div:contains('Name:')").children().last().append("<a id='update_reviewer'>[Edit]</a>");
                $("#update_reviewer").click(function(){
                    $("body").css('cursor', 'wait');
                    $.get("/list/reviewers/by-email-query?showName=1&term="+$("#form_emails").val(), function(res) {
                        GM_openInTab("https://susy.mdpi.com/reivewer/managment/edit/"+res[0].id, {active: true});
                        $("body").css('cursor', 'default');
                    });
                })
            });
            observer.observe(targetNode, {characterData: true, childList: true, subtree: true});
        };
    } catch (error){ }}

    //Always: Editor Decision 返回处理界面
    if (window.location.href.indexOf("decision/process_form/") > -1){try{
        $("div.cell.small-12.medium-6.large-2:contains('Manuscript ID')").next().append(`<a href="/user/assigned/process_form/`+$("a:contains('Download Manuscript')").attr("href").match("displayFile/(.*?)(/|$)")[1]+`">[Back to Manuscript]</a>`)
    } catch (error){ }}

    //Always: Google Scholar校正
    if (window.location.href.indexOf("&amp;") > -1 && window.location.href.indexOf("google") > -1){try{
        var new_uri, old_uri = window.location.search;
        for (let i = 1; i < 5; i++){ new_uri = $("<div />").html(old_uri).text(); if (new_uri==old_uri) {break;} else {old_uri = new_uri} }
        let searchParams = new URLSearchParams(new_uri)
        if(searchParams.has('user')) {window.location.href="https://scholar.google.com/citations?hl=en&user="+searchParams.get('user')}
    } catch (error){ }}

    //派稿助手: iThenticate AUTO
    if (window.location.href.indexOf("managing/status/submitted") + window.location.href.indexOf("sme/status/submitted") > -2 && GM_config.get('Assign_Assistant')){try{
        $("#show_title").parent().append("<input type='button' id='send_ith' value='Send iThenticate in OneClick'>")
        $("#send_ith").click(function() {
            if (confirm("I will send ALL manuscripts in this page to iThenticate!") == true) {
                $("a[href*='/process_form/']").each(function() {chk_ith($(this).attr('href'),$(this).text())});
                $("body").append(`<div class="blockUI blockOverlay"id=ith-shade1 style=z-index:1000;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0;background-color:#000;opacity:.6;cursor:wait;position:fixed></div>
                                <div class="blockUI blockMsg blockPage" id=ith-shade2 style="z-index:1011;position:fixed;padding:0;margin:0;width:30%;top:5%;height:90%;left:35%;text-align:center;color:#000;border:3px solid #aaa;overflow-y:auto;background-color:#fff">
                                <input onclick='document.getElementById("ith-shade1").remove(),document.getElementById("ith-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"><p id=ith_prompt></p>
                                <input onclick='document.getElementById("ith-shade1").remove(),document.getElementById("ith-shade2").remove()'type=button value=Close style="margin:10px;padding:5px 20px"></div>`)
                function chk_ith(url, mid) {
                    let ith_chkurl = window.location.origin+"/ajax/manuscript_get_ithenticate_status/"+url.split("/").pop();
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: ith_chkurl,
                        onload: function(responseDetails) {
                            if(responseDetails.responseText.indexOf("log can not be found") != -1) {
                                GM_xmlhttpRequest({method: 'GET',url: window.location.origin + "/ajax/upload_manuscript_file_to_ithenticate/"+url.split("/").pop(),
                                                   onload: function(responseDetails) {
                                                       if(responseDetails.responseText.indexOf("success") != -1) {$("#ith_prompt").html($("#ith_prompt").html() + mid + " is sending to iThenticate... Done<br/>")}
                                                       else {$("#ith_prompt").html($("#ith_prompt").html() + mid + " sent failed! Maybe wrong file extension<br/>")}
                                                   } })
                            }
                            else {$("#ith_prompt").html($("#ith_prompt").html() + mid + " already has iThenticate report<br/>")}
                        } });
                }
            }
        });

        $("tr.manuscript-status-table > td:nth-child(6)").not(":has('.user_info_modal')").css("text-align","center").bind("contextmenu",function(e){return false;}).each(function() {
            $(this).append("<a class='sk_reject' style='font-style:italic' href='//susy.mdpi.com/user/assigned/reject-manuscript/"+$(this).parents("tr").find("td:nth-child(4) >> a").attr("href").split("/").pop()+"'>[Reject]</a>");} );

        $(".sk_reject").on('mouseup', function (e){switch (e.which) {
            case 3: // Right click.
                if(confirm('The paper will be rejected immediately using "without Peer Review Template"')) {GM_openInTab($(this).attr("href")+"?quickreject", 1);$(this).parent().html("[Rejected]");}
                return;
        }; return true;});
    } catch (error){ }}

    //派稿助手: Paper Rejection
    if(window.location.href.indexOf("assigned/reject-manuscript/") > -1 && GM_config.get('Assign_Assistant')){try{
        $('#emailTemplates').val(77).change(); document.getElementById("emailTemplates").dispatchEvent(new CustomEvent('change')); window.scrollTo(0, document.body.scrollHeight);
        if(window.location.search == "?quickreject"){
            waitForText(document.querySelector('#mailSubject'), ' ', init);
            function init() {$("#sendingEmail").click();}
        }
    } catch (error){ }}

    //ManuscriptFunc: 文章页面加[Linkedin]
    if (window.location.href.indexOf("www.mdpi.com/2227-7390/") > -1 && GM_config.get('ManuscriptFunc')){try{
        $("a:contains('Peer-Reviewed')").parent().after('<a id="s_linkedin" href="' + $("a:contains('Peer-Reviewed')").attr("href") +'?linkedin"><img src="https://static.licdn.com/sc/h/413gphjmquu9edbn2negq413a"></a>');
        $("#s_linkedin").click(function() {$("#container").after(`<div class="ui-widget-overlay ui-front" style="background: #aaaaaa;opacity: .5;filter: Alpha(Opacity=50);position: fixed;top: 0;left: 0;width: 100%;height: 100%;"></div>`)});
    } catch (error){ }}

    console.timeEnd("test")
})();

function waitForKeyElements(selectorTxt,actionFunction,bWaitOnce,iframeSelector) {
    var targetNodes,btargetsFound;if(typeof iframeSelector=="undefined") {targetNodes=$(selectorTxt);} else targetNodes=$(iframeSelector).contents().find(selectorTxt);if(targetNodes&&targetNodes.length>0){btargetsFound=!0;targetNodes.each(function(){var jThis=$(this);
    var alreadyFound=jThis.data('alreadyFound')||!1;if(!alreadyFound){var cancelFound=actionFunction(jThis);if(cancelFound) {btargetsFound=!1;} else jThis.data('alreadyFound',!0)}})}else{btargetsFound=!1} var controlObj=waitForKeyElements.controlObj||{};
    var controlKey=selectorTxt.replace(/[^\w]/g,"_");var timeControl=controlObj[controlKey];if(btargetsFound&&bWaitOnce&&timeControl){clearInterval(timeControl);delete controlObj[controlKey]}else{if(!timeControl){timeControl=setInterval(function()
    {waitForKeyElements(selectorTxt,actionFunction,bWaitOnce,iframeSelector)},300);controlObj[controlKey]=timeControl}}; waitForKeyElements.controlObj=controlObj }

function waitForText(element, text, callback, freq) {
    let interval = window.setInterval(test, freq || 300); if (!element || !callback || typeof text !== 'string') {throw new TypeError('Bad value');}
    function test() {
        if (!element.parentNode) {window.clearInterval(interval);}
        if (element.value.indexOf(text) > -1) { window.clearInterval(interval); callback.call(element);}
    }
}

function p_get(url) { return new Promise(resolve => { GM_xmlhttpRequest({ method: "GET", url: url, onload: resolve }); }) };
function RegExptest(str) {if (str.indexOf("[Regex]")==0) {return RegExp(str.substring(7), "g");} else {return str} };
function Functiontest(str) {if (str.indexOf("function ")==0) {let funcTest = new Function('return '+str); return funcTest();} else {return str} };
function SidebarSize() {
    $(".note-list-container").css("padding","0"); $(".note-box-component").css("margin-bottom","10px");
    if ($(".section-note-box .manuscript-note-item-content").height() > 200) {$(".section-note-box .manuscript-note-item-content").height(200).css("overflow-y","auto")}
    if ($(".apc-container .manuscript-note-item-content").height() > 200) {$(".apc-container .manuscript-note-item-content").height(200).css("overflow-y","auto")}
    if ($('.special-issue-note-box').length > 1) {$(".special-issue-note-box .manuscript-add-note-form").eq(1).prop("rows",20)}
    else if ($('.special-issue-note-box').length > 0) {$(".manuscript-note-box .manuscript-note-item-content").height(200).css("overflow-y","auto")}
}

function get_jid(sysname) {return[
    {id:"250",j:"acoustics"},{id:"77",j:"actuators"},{id:"88",j:"admsci"},{id:"437",j:"adolescents"},{id:"573",j:"arm"},{id:"145",j:"aerospace"},{id:"95",j:"agriculture"},{id:"336",j:"agriengineering"},{id:"554",j:"agrochemicals"},{id:"34",j:"agronomy"},{id:"362",j:"ai"},
    {id:"557",j:"air"},{id:"13",j:"algorithms"},{id:"210",j:"allergies"},{id:"524",j:"alloys"},{id:"285",j:"analytica"},{id:"555",j:"analytics"},{id:"552",j:"anatomia"},{id:"570",j:"anesthesia"},{id:"74",j:"animals"},{id:"116",j:"antibiotics"},{id:"40",j:"antibodies"},
    {id:"75",j:"antioxidants"},{id:"534",j:"applbiosci"},{id:"341",j:"applmech"},{id:"456",j:"applmicrobiol"},{id:"390",j:"applnano"},{id:"90",j:"applsci"},{id:"302",j:"asi"},{id:"480",j:"appliedchem"},{id:"517",j:"appliedmath"},{id:"335",j:"aquacj"},
    {id:"491",j:"architecture"},{id:"78",j:"arts"},{id:"523",j:"astronomy"},{id:"35",j:"atmosphere"},{id:"118",j:"atoms"},{id:"471",j:"audiolres"},{id:"323",j:"automation"},{id:"47",j:"axioms"},{id:"496",j:"bacteria"},{id:"201",j:"batteries"},{id:"82",j:"behavsci"},
    {id:"174",j:"beverages"},{id:"245",j:"BDCC"},{id:"459",j:"biochem"},{id:"175",j:"bioengineering"},{id:"420",j:"biologics"},{id:"120",j:"biology"},{id:"510",j:"blsf"},{id:"494",j:"biomass"},{id:"458",j:"biomechanics"},{id:"477",j:"biomed"},{id:"158",j:"biomedicines"},
    {id:"410",j:"biomedinformatics"},{id:"208",j:"biomimetics"},{id:"111",j:"biomolecules"},{id:"346",j:"biophysica"},{id:"108",j:"biosensors"},{id:"462",j:"biotech"},{id:"415",j:"birds"},{id:"91",j:"brainsci"},{id:"67",j:"buildings"},{id:"427",j:"businesses"},
    {id:"195",j:"carbon"},{id:"23",j:"cancers"},{id:"473",j:"cardiogenetics"},{id:"27",j:"catalysts"},{id:"32",j:"cells"},{id:"240",j:"ceramics"},{id:"103",j:"challenges"},{id:"155",j:"ChemEngineering"},{id:"350",j:"chemistry"},{id:"406",j:"chemproc"},
    {id:"161",j:"chemosensors"},{id:"159",j:"children"},{id:"515",j:"chips"},{id:"299",j:"civileng"},{id:"305",j:"cleantechnol"},{id:"143",j:"climate"},{id:"495",j:"ctn"},{id:"482",j:"clinpract"},{id:"487",j:"coasts"},{id:"107",j:"coatings"},{id:"288",j:"clockssleep"},
    {id:"253",j:"colloids"},{id:"501",j:"colorants"},{id:"531",j:"commodities"},{id:"441",j:"compounds"},{id:"123",j:"computation"},{id:"543",j:"csmf"},{id:"26",j:"computers"},{id:"214",j:"condensedmatter"},{id:"440",j:"conservation"},{id:"467",j:"constrmater"},
    {id:"125",j:"cosmetics"},{id:"493",j:"covid"},{id:"451",j:"crops"},{id:"213",j:"cryptography"},{id:"28",j:"crystals"},{id:"497",j:"cimb"},{id:"476",j:"curroncol"},{id:"289",j:"dairy"},{id:"176",j:"data"},{id:"144",j:"dentistry"},{id:"396",j:"dermato"},
    {id:"400",j:"dermatopathology"},{id:"227",j:"designs"},{id:"572",j:"devices"},{id:"389",j:"diabetology"},{id:"41",j:"diagnostics"},{id:"520",j:"dietetics"},{id:"416",j:"digital"},{id:"426",j:"disabilities"},{id:"126",j:"diseases"},{id:"17",j:"diversity"},
    {id:"450",j:"dna"},{id:"259",j:"drones"},{id:"575",j:"ddc"},{id:"428",j:"dynamics"},{id:"385",j:"earth"},{id:"356",j:"ecologies"},{id:"142",j:"econometrics"},{id:"151",j:"economies"},{id:"84",j:"education"},{id:"404",j:"electricity"},{id:"306",j:"electrochem"},
    {id:"397",j:"electronicmat"},{id:"127",j:"electronics"},{id:"449",j:"encyclopedia"},{id:"386",j:"endocrines"},{id:"7",j:"energies"},{id:"391",j:"eng"},{id:"402",j:"engproc"},{id:"533",j:"entomology"},{id:"5",j:"entropy"},{id:"412",j:"environsciproc"},
    {id:"83",j:"environments"},{id:"388",j:"epidemiologia"},{id:"198",j:"epigenomes"},{id:"468",j:"ebj"},{id:"361",j:"ejihpe"},{id:"196",j:"fermentation"},{id:"128",j:"fibers"},{id:"509",j:"fintech"},{id:"319",j:"fire"},{id:"212",j:"fishes"},{id:"192",j:"fluids"},
    {id:"169",j:"foods"},{id:"301",j:"forecasting"},{id:"443",j:"forensicsci"},{id:"42",j:"forests"},{id:"492",j:"foundations"},{id:"275",j:"fractalfract"},{id:"395",j:"fuels"},{id:"571",j:"future"},{id:"19",j:"futureinternet"},{id:"448",j:"futurepharmacol"},
    {id:"460",j:"futuretransp"},{id:"53",j:"galaxies"},{id:"25",j:"games"},{id:"413",j:"gases"},{id:"434",j:"gastroent"},{id:"255",j:"gastrointestdisord"},{id:"191",j:"gels"},{id:"209",j:"genealogy"},{id:"31",j:"genes"},{id:"409",j:"geographies"},{id:"347",j:"geohazards"},
    {id:"453",j:"geomatics"},{id:"79",j:"geosciences"},{id:"474",j:"geotechnics"},{id:"179",j:"geriatrics"},{id:"556",j:"grasses"},{id:"157",j:"healthcare"},{id:"379",j:"hearts"},{id:"464",j:"hemato"},{id:"559",j:"hematolrep"},{id:"320",j:"heritage"},
    {id:"205",j:"histories"},{id:"197",j:"horticulturae"},{id:"63",j:"humanities"},{id:"481",j:"humans"},{id:"514",j:"hydrobiology"},{id:"382",j:"hydrogen"},{id:"177",j:"hydrology"},{id:"439",j:"hygiene"},{id:"381",j:"immuno"},{id:"469",j:"idr"},{id:"163",j:"informatics"},
    {id:"50",j:"information"},{id:"225",j:"infrastructures"},{id:"167",j:"inorganics"},{id:"54",j:"insects"},{id:"215",j:"instruments"},{id:"6",j:"ijerph"},{id:"148",j:"ijfs"},{id:"2",j:"ijms"},{id:"211",j:"IJNS"},{id:"558",j:"ijpb"},{id:"423",j:"ijtm"},
    {id:"564",j:"ime"},{id:"221",j:"inventions"},{id:"355",j:"IoT"},{id:"113",j:"ijgi"},{id:"318",j:"J"},{id:"488",j:"jal"},{id:"180",j:"jcdd"},{id:"529",j:"jcto"},{id:"93",j:"jcm"},{id:"244",j:"jcs"},{id:"311",j:"jcp"},{id:"134",j:"jdb"},{id:"542",j:"jeta"},
    {id:"104",j:"jfb"},{id:"222",j:"jfmk"},{id:"186",j:"jof"},{id:"203",j:"jimaging"},{id:"106",j:"jintelligence"},{id:"110",j:"jlpea"},{id:"279",j:"jmmp"},{id:"99",j:"jmse"},{id:"418",j:"jmp"},{id:"351",j:"jnt"},{id:"394",j:"jne"},{id:"339",j:"JOItmC"},{id:"235",j:"ohbm"},
    {id:"65",j:"jpm"},{id:"401",j:"jor"},{id:"185",j:"jrfm"},{id:"138",j:"jsan"},{id:"454",j:"jtaer"},{id:"566",j:"jvd"},{id:"433",j:"jox"},{id:"399",j:"jzbg"},{id:"405",j:"journalmedia"},{id:"461",j:"kidneydial"},{id:"561",j:"kinasesphosphatases"},{id:"499",j:"knowledge"},
    {id:"37",j:"land"},{id:"146",j:"languages"},{id:"60",j:"laws"},{id:"435",j:"liquids"},{id:"393",j:"livers"},{id:"217",j:"literature"},{id:"538",j:"logics"},{id:"170",j:"logistics"},{id:"52",j:"lubricants"},{id:"539",j:"lymphatics"},{id:"290",j:"make"},
    {id:"49",j:"machines"},{id:"425",j:"macromol"},{id:"432",j:"magnetism"},{id:"199",j:"magnetochemistry"},{id:"4",j:"marinedrugs"},{id:"14",j:"materials"},{id:"407",j:"materproc"},{id:"231",j:"mca"},{id:"154",j:"mathematics"},{id:"81",j:"medsci"},{id:"512",j:"msf"},
    {id:"340",j:"medicina"},{id:"172",j:"medicines"},{id:"92",j:"membranes"},{id:"484",j:"merits"},{id:"112",j:"metabolites"},{id:"59",j:"metals"},{id:"522",j:"meteorology"},{id:"525",j:"methane"},{id:"207",j:"mps"},{id:"465",j:"metrology"},{id:"438",j:"micro"},
    {id:"483",j:"microbiolres"},{id:"22",j:"micromachines"},{id:"73",j:"microorganisms"},{id:"498",j:"microplastics"},{id:"45",j:"minerals"},{id:"447",j:"mining"},{id:"314",j:"modelling"},{id:"11",j:"molbank"},{id:"1",j:"molecules"},{id:"537",j:"muscles"},
    {id:"479",j:"nanoenergyadv"},{id:"442",j:"nanomanufacturing"},{id:"105",j:"nanomaterials"},{id:"457",j:"network"},{id:"292",j:"neuroglia"},{id:"472",j:"neurolint"},{id:"365",j:"neurosci"},{id:"239",j:"nitrogen"},{id:"193",j:"ncrna"},{id:"429",j:"nursrep"},
    {id:"478",j:"nutraceuticals"},{id:"20",j:"nutrients"},{id:"384",j:"obesities"},{id:"359",j:"oceans"},{id:"475",j:"onco"},{id:"360",j:"optics"},{id:"422",j:"oral"},{id:"392",j:"organics"},{id:"527",j:"organoids"},{id:"398",j:"osteology"},{id:"445",j:"oxygen"},
    {id:"431",j:"parasitologia"},{id:"272",j:"particles"},{id:"64",j:"pathogens"},{id:"463",j:"pathophysiology"},{id:"470",j:"pediatrrep"},{id:"18",j:"pharmaceuticals"},{id:"9",j:"pharmaceutics"},{id:"536",j:"pharmacoepidemiology"},{id:"147",j:"pharmacy"},
    {id:"219",j:"philosophies"},{id:"444",j:"photochem"},{id:"165",j:"photonics"},{id:"500",j:"phycology"},{id:"419",j:"physchem"},{id:"511",j:"psf"},{id:"358",j:"physics"},{id:"436",j:"physiologia"},{id:"137",j:"plants"},{id:"271",j:"plasma"},{id:"383",j:"pollutants"},
    {id:"29",j:"polymers"},{id:"304",j:"polysaccharides"},{id:"503",j:"poultry"},{id:"508",j:"powders"},{id:"247",j:"proceedings"},{id:"164",j:"processes"},{id:"364",j:"prosthesis"},{id:"153",j:"proteomes"},{id:"343",j:"psych"},{id:"380",j:"psychiatryint"},
    {id:"532",j:"psychoactives"},{id:"168",j:"publications"},{id:"224",j:"qubs"},{id:"353",j:"quantumrep"},{id:"277",j:"quaternary"},{id:"411",j:"radiation"},{id:"342",j:"reactions"},{id:"545",j:"receptors"},{id:"202",j:"recycling"},{id:"102",j:"religions"},
    {id:"16",j:"remotesensing"},{id:"252",j:"reports"},{id:"268",j:"reprodmed"},{id:"114",j:"resources"},{id:"506",j:"rheumato"},{id:"162",j:"risks"},{id:"130",j:"robotics"},{id:"505",j:"ruminants"},{id:"206",j:"safety"},{id:"246",j:"sci"},{id:"238",j:"scipharm"},
    {id:"568",j:"sclerosis"},{id:"332",j:"seeds"},{id:"3",j:"sensors"},{id:"233",j:"separations"},{id:"218",j:"sexes"},{id:"265",j:"signals"},{id:"200",j:"sinusitis"},{id:"337",j:"smartcities"},{id:"71",j:"socsci"},{id:"58",j:"societies"},{id:"528",j:"software"},
    {id:"344",j:"soilsystems"},{id:"518",j:"solar"},{id:"414",j:"solids"},{id:"562",j:"spectroscj"},{id:"56",j:"sports"},{id:"173",j:"standards"},{id:"296",j:"stats"},{id:"466",j:"stresses"},{id:"294",j:"surfaces"},{id:"295",j:"surgeries"},{id:"560",j:"std"},
    {id:"15",j:"sustainability"},{id:"376",j:"suschem"},{id:"44",j:"symmetry"},{id:"521",j:"synbio"},{id:"131",j:"systems"},{id:"417",j:"taxonomy"},{id:"150",j:"technologies"},{id:"276",j:"telecom"},{id:"446",j:"textiles"},{id:"544",j:"thalassrep"},{id:"408",j:"thermo"},
    {id:"489",j:"tomography"},{id:"378",j:"tourismhosp"},{id:"171",j:"toxics"},{id:"21",j:"toxins"},{id:"352",j:"transplantology"},{id:"502",j:"traumacare"},{id:"567",j:"higheredu"},{id:"230",j:"tropicalmed"},{id:"133",j:"universe"},{id:"228",j:"urbansci"},
    {id:"403",j:"uro"},{id:"76",j:"vaccines"},{id:"291",j:"vehicles"},{id:"490",j:"venereology"},{id:"178",j:"vetsci"},{id:"269",j:"vibration"},{id:"553",j:"virtualworlds"},{id:"8",j:"viruses"},{id:"223",j:"vision"},{id:"530",j:"waste"},{id:"36",j:"water"},
    {id:"504",j:"wind"},{id:"349",j:"women"},{id:"377",j:"world"},{id:"354",j:"wevj"},{id:"519",j:"youth"},{id:"541",j:"zoonoticdis"}].find(function(b){return b.j===sysname}).id}

function get_univ(aff) {
    let results = "", color = "", i, len;
    var u_QP = ["tsinghua","peking"];
    var u_QPr =["24 Tsinghua University","25 Peking University"];
    var u_A = ["shanghai jiao","fudan univ","university of science and technology of china","sci & technol china","zhejiang univ","sun yat-sen","harbin institute","nanjing univ","beijing normal","nankai univ","tongji univ"];
    var u_Ar =["50 Shanghai Jiao Tong University","53 Fudan University","74 University of Science and Technology of China","74 University of Science and Technology of China","89 Zhejiang University","151+ Sun Yat-sen University","151+ Harbin Institute of Technology",
               "136 Nanjing University","151+ Beijing Normal University","151+ Nankai University","201+ Tongji University"];
    var u_B = ["beihang univ","an jiao","shandong univ","beijing institute of technology","wuhan univ","shanghai univ","sichuan univ","huazhong university of science","huazhong univ sci ","tianjin univ","east china normal","university of electronic science",
               "national university of defense technology","central south","xiamen univ","southeast univ","chinese academy of science","beijing jiao","renmin university of","nanjing university of aeronautics","southern university of science","shenzhen univ"];
    var u_Br =["201+ Beihang University","201+ Xi’an Jiaotong University","251+ Shandong University","201+ Beijing Institute of Technology","151+ Wuhan University","251+ Shanghai University","301+ Sichuan University","251+ Huazhong University of Science and Technology",
               "251+ Huazhong University of Science and Technology","Tianjin University","East China Normal University","University of Electronic Science and Technology","National University of Defense Technology","Central South University","251+ Xiamen University",
               "251+ Southeast University","Chinese Academy of Sciences<br>(Please further check its institute and decide)","301+ Beijing Jiaotong University","Renmin University of China","Nanjing University of Aeronautics and Astronautics",
               "Southern University of Science and Technology","451+ Shenzhen University"];
    var u_C = ["jilin univ","dalian university of technology","northwestern polytechnical","south china university of","china agricultural univ","lanzhou univ","hunan univ","chongqing univ","northeast normal","zhengzhou univ","university of science and technology beijing",
               "shanghai university of finance and economics","beijing university of technology","xidian univ","nanchang univ","south china normal","huazhong normal","nanjing normal","shandong university of science","northeastern univ","southwest univ","shaanxi normal",
               "hunan normal","nanjing university of science","northwest a&f","northwest a f","ocean university of china"];
    var u_Cr =["Jilin University","Dalian University of Technology","Northwestern Polytechnical University","South China University of Technology","China Agricultural University","Lanzhou University","Hunan University","Chongqing University","Northeast Normal University",
               "Zhengzhou University","University of Science and Technology Beijing","Shanghai University of Finance and Economics","Beijing University of Technology","Xidian University","Nanchang University","South China Normal University","Huazhong Normal University",
               "Nanjing Normal University","Shandong University of Science and Technology","Northeastern University","Southwest University","Shaanxi Normal University","Hunan Normal University","Nanjing University of Science and Technology","Northwest A&F University",
               "Ocean University of China"];
    var u_D = ["nanjing agr","university of chinese academy","east china university of sci","wuhan university of technology","china university of mining and technology","fuzhou univ","china university of geosciences","china university of petroleum","suzhou univ",
               "beijing university of chemical technology","jiangsu univ","minzu university of china","central university of finance and economics","mongolian univ","dalian maritime univ","donghua univ","hohai univ","hefei university of technology","huazhong agr",
               "jinan univ","hainan univ","sichuan agr","guizhou univ","qinghai univ","beijing university of posts","university of international business and economics","china university of political science and law","tianjin med","liaoning univ","harbin engineering univ",
               "jiangnan univ","southwestern university of finance and economics","yunnan univ","ningxia univ","north china elect","hebei university of technology","yanbian univ","northeast agricultural univ","shanghai international studies univ","anhui univ",
               "zhongnan university of economics and law","southwest jiao","tibet univ","xinjiang univ","beijing forestry univ","communication university of china","taiyuan university of technology","northeast forestry univ","china pharmaceut","guangxi univ",
               "northwest univ","changan univ","shihezi univ","zhejiang normal","chongqing normal","capital normal","xiangtan univ","qufu normal","jiangsu normal","guangzhou univ","shandong normal","soochow univ"];
    var u_Dr =["Nanjing Agricultural University","University of Chinese Academy of Sciences","East China University of Science and Technology","Wuhan University of Technology","China University of Mining and Technology","Fuzhou University","China University of Geosciences",
               "China University of Petroleum","Soochow University","Beijing University of Chemical Technology","Jiangsu University","Minzu University of China","Central University of Finance and Economics","Mongolian University","Dalian Maritime University",
               "Donghua University","Hohai University","Hefei University of Technology","Huazhong Agricultural University","Jinan University","Hainan University","Sichuan Agricultural University","Guizhou University","Qinghai University",
               "Beijing University of Posts and Telecommunications","University of International Business and Economics","China University of Political Science and Law","Tianjin Medical University","Liaoning University","Harbin Engineering University","Jiangnan University",
               "Southwestern University of Finance and Economics","Yunnan University","Ningxia University","North China Electric Power University","Hebei University of Technology","Yanbian University","Northeast Agricultural University",
               "Shanghai International Studies University","Anhui University","Zhongnan University of Economics and Law","Southwest Jiaotong University","Tibet University","Xinjiang University","Beijing Forestry University","Communication University of China",
               "Taiyuan University of Technology","Northeast Forestry University","China Pharmaceutical University","Guangxi University","Northwest University","Changan University","Shihezi University","Zhejiang Normal University","Chongqing Normal University",
               "Capital Normal University","Xiangtan University","Qufu Normal University","Jiangsu Normal University","GuangZhou University","Shandong Normal University","Soochow University"];
    var u_2 = ["king abdulaziz","king abdul aziz","king abdul-aziz","de são paulo","of são paulo","de sao paulo","of sao paulo","de buenos aires","universidad nacional autónoma de méxico","national autonomous university of mexico",
               "indian institute of technology bombay","universidade estadual de campinas","state university of campinas","indian institute of technology delhi","indian institute of technology kanpur","universidad de chile","university of chile",
               "indian institute of science","universiti malaya","university of malaya","indian institute of technology madras"];
    var u_2r =["65 King Abdulaziz University (KAU)","65 King Abdulaziz University (KAU)","65 King Abdulaziz University (KAU)","95 Universidade de São Paulo","95 Universidade de São Paulo","95 Universidade de São Paulo","95 Universidade de São Paulo",
               "104 Universidad de Buenos Aires (UBA)","107 Universidad Nacional Autónoma de México  (UNAM)","107 Universidad Nacional Autónoma de México  (UNAM)","117 Indian Institute of Technology Bombay (IITB)","124 Universidade Estadual de Campinas (UNICAMP)",
               "124 Universidade Estadual de Campinas (UNICAMP)","128 Indian Institute of Technology Delhi (IITD)","132 Indian Institute of Technology Kanpur (IITK)","132 Universidad de Chile","132 Universidad de Chile","142 Indian Institute of Science",
               "144 Universiti Malaya (UM)","144 Universiti Malaya (UM)","148 Indian Institute of Technology Madras (IITM)"];
    var u_Abbr = ["BUAA","NUDT","CAS","KAU","UBA","UNAM","IITB","UNICAMP","Unicamp","IITD","IITK","UM","IITM"];
    var u_Abbrr =["Rank B 201+ Beihang University","Rank B National University of Defense Technology","Chinese Academy of Sciences<br>(Please further check its institute and decide)","65 King Abdulaziz University","104 Universidad de Buenos Aires",
                  "107 Universidad Nacional Autónoma de México","117 Indian Institute of Technology Bombay","124 Universidade Estadual de Campinas","124 Universidade Estadual de Campinas","128 Indian Institute of Technology Delhi",
                  "132 Indian Institute of Technology Kanpur","144 Universiti Malaya","148 Indian Institute of Technology Madras"];

    for (i = 0, len = u_Abbr.length; i < len ; i++){ if (aff.indexOf(u_Abbr[i]) > -1){results += "<br><span style='background-color:pink;font-weight:bold'>Abbr: "+u_Abbrr[i]+"</span>"; color="pink";break;}}
    aff = aff.toLowerCase();
    for (i = 0, len = u_2.length; i < len ; i++){ if (aff.indexOf(u_2[i]) > -1){results += "<br><span style='background-color:lightblue;font-weight:bold'>Top150: "+u_2r[i]+"</span>"; color="lightblue";break;}}
    for (i = 0, len = u_D.length; i < len ; i++){
        if (aff.indexOf(u_D[i]) > -1 && (u_D[i].indexOf("of") > -1 || (u_D[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1)) ){results += "<br><span style='background-color:thistle;font-weight:bold'>Zone D: "+u_Dr[i]+"</span>"; color="thistle";break;} }
    for (i = 0, len = u_C.length; i < len ; i++){
        if (aff.indexOf(u_C[i]) > -1 && (u_C[i].indexOf("of") > -1 || (u_C[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1)) ){results += "<br><span style='background-color:lightgreen;font-weight:bold'>Zone C: "+u_Cr[i]+"</span>"; color="lightgreen";break;} }
    for (i = 0, len = u_B.length; i < len ; i++){
        if (aff.indexOf(u_B[i]) > -1 && (u_B[i].indexOf("of") > -1 || (u_B[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1)) ){results += "<br><span style='background-color:wheat;font-weight:bold'>Zone B: "+u_Br[i]+"</span>"; color="wheat";break;} }
    for (i = 0, len = u_A.length; i < len ; i++){
        if (aff.indexOf(u_A[i]) > -1 && (u_A[i].indexOf("of") > -1 || (u_A[i].indexOf("of") == -1 && aff.indexOf("versity of") == -1)) ){results += "<br><span style='background-color:lightblue;font-weight:bold'>Zone A: "+u_Ar[i]+"</span>"; color="lightblue";break;} }
    for (i = 0, len = u_QP.length; i < len ; i++){ if (aff.indexOf(u_QP[i]) > -1){results += "<br><span style='background-color:cyan;font-weight:bold'>Zone QP: "+u_QPr[i]+"</span>"; color="cyan";}}
    return {detail: results, color: color};
}

//[Regex][\S\s]*
//function match(str) {if(str.indexOf("Games")>-1) {return `[Games] Invitation to Serve as the Guest Editor for Games`}; if(str.indexOf("Mathematics")>-1) {return `[Mathematics] Invitation to be the Guest Editor of a Special Issue in Mathematics (Rank Q1)`}; return ""}
