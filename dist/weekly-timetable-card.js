var je=Object.defineProperty;var Ie=Object.getOwnPropertyDescriptor;var g=(r,t,e,o)=>{for(var i=o>1?void 0:o?Ie(t,e):t,n=r.length-1,s;n>=0;n--)(s=r[n])&&(i=(o?s(t,e,i):s(i))||i);return o&&i&&je(t,e,i),i};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var J=globalThis,X=J.ShadowRoot&&(J.ShadyCSS===void 0||J.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,mt=Symbol(),Ut=new WeakMap,U=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==mt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(X&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=Ut.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Ut.set(e,t))}return t}toString(){return this.cssText}},jt=r=>new U(typeof r=="string"?r:r+"",void 0,mt),j=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((o,i,n)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new U(e,r,mt)},It=(r,t)=>{if(X)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),i=J.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=e.cssText,r.appendChild(o)}},gt=X?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return jt(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:Ke,defineProperty:Fe,getOwnPropertyDescriptor:ze,getOwnPropertyNames:Ve,getOwnPropertySymbols:qe,getPrototypeOf:We}=Object,Z=globalThis,Kt=Z.trustedTypes,Ye=Kt?Kt.emptyScript:"",Ge=Z.reactiveElementPolyfillSupport,I=(r,t)=>r,K={toAttribute(r,t){switch(t){case Boolean:r=r?Ye:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Q=(r,t)=>!Ke(r,t),Ft={attribute:!0,type:String,converter:K,reflect:!1,useDefault:!1,hasChanged:Q};Symbol.metadata??=Symbol("metadata"),Z.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ft){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),i=this.getPropertyDescriptor(t,o,e);i!==void 0&&Fe(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){let{get:i,set:n}=ze(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:i,set(s){let a=i?.call(this);n?.call(this,s),this.requestUpdate(t,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ft}static _$Ei(){if(this.hasOwnProperty(I("elementProperties")))return;let t=We(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(I("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(I("properties"))){let e=this.properties,o=[...Ve(e),...qe(e)];for(let i of o)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,i]of e)this.elementProperties.set(o,i)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let i=this._$Eu(e,o);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let i of o)e.unshift(gt(i))}else t!==void 0&&e.push(gt(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return It(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){let o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(i!==void 0&&o.reflect===!0){let n=(o.converter?.toAttribute!==void 0?o.converter:K).toAttribute(e,o.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){let o=this.constructor,i=o._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let n=o.getPropertyOptions(i),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:K;this._$Em=i;let a=s.fromAttribute(e,n.type);this[i]=a??this._$Ej?.get(i)??a,this._$Em=null}}requestUpdate(t,e,o,i=!1,n){if(t!==void 0){let s=this.constructor;if(i===!1&&(n=this[t]),o??=s.getPropertyOptions(t),!((o.hasChanged??Q)(n,e)||o.useDefault&&o.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:i,wrapped:n},s){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),n!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[i,n]of o){let{wrapped:s}=n,a=this[i];s!==!0||this._$AL.has(i)||a===void 0||this.C(i,void 0,n,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[I("elementProperties")]=new Map,$[I("finalized")]=new Map,Ge?.({ReactiveElement:$}),(Z.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var At=globalThis,zt=r=>r,tt=At.trustedTypes,Vt=tt?tt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Xt="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,Zt="?"+A,Je=`<${Zt}>`,T=document,z=()=>T.createComment(""),V=r=>r===null||typeof r!="object"&&typeof r!="function",Ct=Array.isArray,Xe=r=>Ct(r)||typeof r?.[Symbol.iterator]=="function",yt=`[ 	
\f\r]`,F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qt=/-->/g,Wt=/>/g,k=RegExp(`>|${yt}(?:([^\\s"'>=/]+)(${yt}*=${yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yt=/'/g,Gt=/"/g,Qt=/^(?:script|style|textarea|title)$/i,St=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),d=St(1),Lr=St(2),Br=St(3),x=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Jt=new WeakMap,E=T.createTreeWalker(T,129);function te(r,t){if(!Ct(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Vt!==void 0?Vt.createHTML(t):t}var Ze=(r,t)=>{let e=r.length-1,o=[],i,n=t===2?"<svg>":t===3?"<math>":"",s=F;for(let a=0;a<e;a++){let l=r[a],c,p,h=-1,m=0;for(;m<l.length&&(s.lastIndex=m,p=s.exec(l),p!==null);)m=s.lastIndex,s===F?p[1]==="!--"?s=qt:p[1]!==void 0?s=Wt:p[2]!==void 0?(Qt.test(p[2])&&(i=RegExp("</"+p[2],"g")),s=k):p[3]!==void 0&&(s=k):s===k?p[0]===">"?(s=i??F,h=-1):p[1]===void 0?h=-2:(h=s.lastIndex-p[2].length,c=p[1],s=p[3]===void 0?k:p[3]==='"'?Gt:Yt):s===Gt||s===Yt?s=k:s===qt||s===Wt?s=F:(s=k,i=void 0);let y=s===k&&r[a+1].startsWith("/>")?" ":"";n+=s===F?l+Je:h>=0?(o.push(c),l.slice(0,h)+Xt+l.slice(h)+A+y):l+A+(h===-2?a:y)}return[te(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},q=class r{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let n=0,s=0,a=t.length-1,l=this.parts,[c,p]=Ze(t,e);if(this.el=r.createElement(c,o),E.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(i=E.nextNode())!==null&&l.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(let h of i.getAttributeNames())if(h.endsWith(Xt)){let m=p[s++],y=i.getAttribute(h).split(A),G=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:G[2],strings:y,ctor:G[1]==="."?bt:G[1]==="?"?$t:G[1]==="@"?xt:H}),i.removeAttribute(h)}else h.startsWith(A)&&(l.push({type:6,index:n}),i.removeAttribute(h));if(Qt.test(i.tagName)){let h=i.textContent.split(A),m=h.length-1;if(m>0){i.textContent=tt?tt.emptyScript:"";for(let y=0;y<m;y++)i.append(h[y],z()),E.nextNode(),l.push({type:2,index:++n});i.append(h[m],z())}}}else if(i.nodeType===8)if(i.data===Zt)l.push({type:2,index:n});else{let h=-1;for(;(h=i.data.indexOf(A,h+1))!==-1;)l.push({type:7,index:n}),h+=A.length-1}n++}}static createElement(t,e){let o=T.createElement("template");return o.innerHTML=t,o}};function B(r,t,e=r,o){if(t===x)return t;let i=o!==void 0?e._$Co?.[o]:e._$Cl,n=V(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,o)),o!==void 0?(e._$Co??=[])[o]=i:e._$Cl=i),i!==void 0&&(t=B(r,i._$AS(r,t.values),i,o)),t}var vt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,i=(t?.creationScope??T).importNode(e,!0);E.currentNode=i;let n=E.nextNode(),s=0,a=0,l=o[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new W(n,n.nextSibling,this,t):l.type===1?c=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(c=new _t(n,this,t)),this._$AV.push(c),l=o[++a]}s!==l?.index&&(n=E.nextNode(),s++)}return E.currentNode=T,i}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},W=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,i){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=B(this,t,e),V(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Xe(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&V(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=q.createElement(te(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(e);else{let n=new vt(i,this),s=n.u(this.options);n.p(e),this.T(s),this._$AH=n}}_$AC(t){let e=Jt.get(t.strings);return e===void 0&&Jt.set(t.strings,e=new q(t)),e}k(t){Ct(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,i=0;for(let n of t)i===e.length?e.push(o=new r(this.O(z()),this.O(z()),this,this.options)):o=e[i],o._$AI(n),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let o=zt(t).nextSibling;zt(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,i,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=u}_$AI(t,e=this,o,i){let n=this.strings,s=!1;if(n===void 0)t=B(this,t,e,0),s=!V(t)||t!==this._$AH&&t!==x,s&&(this._$AH=t);else{let a=t,l,c;for(t=n[0],l=0;l<n.length-1;l++)c=B(this,a[o+l],e,l),c===x&&(c=this._$AH[l]),s||=!V(c)||c!==this._$AH[l],c===u?t=u:t!==u&&(t+=(c??"")+n[l+1]),this._$AH[l]=c}s&&!i&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},bt=class extends H{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},$t=class extends H{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},xt=class extends H{constructor(t,e,o,i,n){super(t,e,o,i,n),this.type=5}_$AI(t,e=this){if((t=B(this,t,e,0)??u)===x)return;let o=this._$AH,i=t===u&&o!==u||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==u&&(o===u||i);i&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},_t=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){B(this,t)}};var Qe=At.litHtmlPolyfillSupport;Qe?.(q,W),(At.litHtmlVersions??=[]).push("3.3.3");var ee=(r,t,e)=>{let o=e?.renderBefore??t,i=o._$litPart$;if(i===void 0){let n=e?.renderBefore??null;o._$litPart$=i=new W(t.insertBefore(z(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var wt=globalThis,v=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ee(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};v._$litElement$=!0,v.finalized=!0,wt.litElementHydrateSupport?.({LitElement:v});var tr=wt.litElementPolyfillSupport;tr?.({LitElement:v});(wt.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var et=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var er={attribute:!0,type:String,converter:K,reflect:!1,hasChanged:Q},rr=(r=er,t,e)=>{let{kind:o,metadata:i}=e,n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),o==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),o==="accessor"){let{name:s}=e;return{set(a){let l=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,l,r,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,r,a),a}}}if(o==="setter"){let{name:s}=e;return function(a){let l=this[s];t.call(this,a),this.requestUpdate(s,l,r,!0,a)}}throw Error("Unsupported decorator location: "+o)};function R(r){return(t,e)=>typeof e=="object"?rr(r,t,e):((o,i,n)=>{let s=i.hasOwnProperty(n);return i.constructor.createProperty(n,o),s?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function M(r){return R({...r,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var re={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},oe=r=>(...t)=>({_$litDirective$:r,values:t}),ot=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ie="important",or=" !"+ie,b=oe(class extends ot{constructor(r){if(super(r),r.type!==re.ATTRIBUTE||r.name!=="style"||r.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((t,e)=>{let o=r[e];return o==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(r,[t]){let{style:e}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let o of this.ft)t[o]==null&&(this.ft.delete(o),o.includes("-")?e.removeProperty(o):e[o]=null);for(let o in t){let i=t[o];if(i!=null){this.ft.add(o);let n=typeof i=="string"&&i.endsWith(or);o.includes("-")||n?e.setProperty(o,n?i.slice(0,-11):i,n?ie:""):e[o]=i}}return x}});var ir=/^#?(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i;var ne="var(--card-background-color, #ffffff)";function se(r){let t=ir.exec(r.trim());if(!t)return null;let e=t[1]?t[1].split("").map(o=>o+o).join(""):t[2];return{r:Number.parseInt(e.slice(0,2),16),g:Number.parseInt(e.slice(2,4),16),b:Number.parseInt(e.slice(4,6),16)}}function kt(r){let t=r/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4}function nr({r,g:t,b:e}){return .2126*kt(r)+.7152*kt(t)+.0722*kt(e)}function ae(r){let t=se(r);return t&&nr(t)>.179?"#0f172a":"#ffffff"}function it(r){return`color-mix(in srgb, ${r} 14%, ${ne})`}function nt(r){return`color-mix(in srgb, ${r} 35%, ${ne})`}function st(r,t){let e=se(r);if(!e)return t;let o=i=>i.toString(16).padStart(2,"0");return`#${o(e.r)}${o(e.g)}${o(e.b)}`}var D=["mon","tue","wed","thu","fri","sat","sun"];function Et(r){return typeof r=="string"&&D.includes(r)}function le(r,t){if(!Array.isArray(r))return[...t];let e=[];for(let o of r)Et(o)&&!e.includes(o)&&e.push(o);return e.length>0?e:[...t]}function ce(r=new Date){return D[(r.getDay()+6)%7]}var sr={monday:0,tuesday:1,wednesday:2,thursday:3,friday:4,saturday:5,sunday:6};function de(r){let t=r?.locale?.first_weekday,e=0;return t&&t!=="language"?e=sr[t]:t==="language"&&(e=ar(r?.language)?6:0),D.map((o,i)=>D[(i+e)%7])}function ar(r){return r?r.toLowerCase().startsWith("en-us"):!1}function ue(r,t,e){if(r.includes(t))return r.length<=1?r:r.filter(s=>s!==t);let o=s=>e.indexOf(s),i=r.findIndex(s=>o(s)>o(t)),n=[...r];return n.splice(i===-1?n.length:i,0,t),n}var Tt={days:{mon:{full:"\u043F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A",short:"\u043F\u043D"},tue:{full:"\u0432\u0442\u043E\u0440\u043D\u0438\u043A",short:"\u0432\u0442"},wed:{full:"\u0441\u0440\u044F\u0434\u0430",short:"\u0441\u0440"},thu:{full:"\u0447\u0435\u0442\u0432\u044A\u0440\u0442\u044A\u043A",short:"\u0447\u0442"},fri:{full:"\u043F\u0435\u0442\u044A\u043A",short:"\u043F\u0442"},sat:{full:"\u0441\u044A\u0431\u043E\u0442\u0430",short:"\u0441\u0431"},sun:{full:"\u043D\u0435\u0434\u0435\u043B\u044F",short:"\u043D\u0434"}},until:r=>`\u0434\u043E ${r}`,after:r=>`\u0441\u043B\u0435\u0434 ${r}`,range:(r,t)=>`${r}\u2013${t}`,untilWord:"\u0434\u043E",afterWord:"\u0441\u043B\u0435\u0434",today:"\u0414\u043D\u0435\u0441",editor:{tabSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",tabSchedule:"\u0420\u0430\u0437\u043F\u0438\u0441\u0430\u043D\u0438\u0435",tabActivities:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442\u0438",title:"\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435",layout:"\u0418\u0437\u0433\u043B\u0435\u0434",layoutBlocks:"\u0411\u043B\u043E\u043A\u043E\u0432\u0435",layoutGrid:"\u041C\u0440\u0435\u0436\u0430",days:"\u0414\u043D\u0438",language:"\u0415\u0437\u0438\u043A",languageAuto:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E",languageEnglish:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",languageBulgarian:"\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",highlightToday:"\u041E\u0442\u0431\u0435\u043B\u044F\u0437\u0432\u0430\u0439 \u0434\u043D\u0435\u0448\u043D\u0438\u044F \u0434\u0435\u043D",headerColor:"\u0426\u0432\u044F\u0442 \u043D\u0430 \u0437\u0430\u0433\u043B\u0430\u0432\u043A\u0430\u0442\u0430",slots:"\u0427\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438",addSlot:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotColumn:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",addBlock:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0431\u043B\u043E\u043A",addBlockNeedsActivity:"\u041F\u044A\u0440\u0432\u043E \u0434\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activity:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442",start:"\u041D\u0430\u0447\u0430\u043B\u043E",end:"\u041A\u0440\u0430\u0439",slot:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotNone:"\u0418\u0437\u0432\u044A\u043D \u043C\u0440\u0435\u0436\u0430\u0442\u0430",moveUp:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0433\u043E\u0440\u0435",moveDown:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0434\u043E\u043B\u0443",moveToDay:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u0432 \u0434\u0440\u0443\u0433 \u0434\u0435\u043D",clearTime:"\u0418\u0437\u0447\u0438\u0441\u0442\u0438 \u0442\u043E\u0437\u0438 \u0447\u0430\u0441 (\u0431\u043B\u043E\u043A\u044A\u0442 \u0441\u0442\u0430\u0432\u0430 \u043E\u0442\u0432\u043E\u0440\u0435\u043D)",remove:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438",placeHint:"\u0414\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442, \u0441\u043B\u0435\u0434 \u043A\u043E\u0435\u0442\u043E \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0434\u0435\u043D, \u0437\u0430 \u0434\u0430 \u044F \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u0435 \u0442\u0430\u043C",activityTitle:"\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435",activitySubtitle:"\u041F\u043E\u0434\u0437\u0430\u0433\u043B\u0430\u0432\u0438\u0435",newActivityTitle:"\u0418\u043C\u0435 \u043D\u0430 \u043D\u043E\u0432\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",addActivity:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activityInUse:(r,t)=>`\u201E${r}\u201C \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430 \u0432 ${t} ${t===1?"\u0431\u043B\u043E\u043A":"\u0431\u043B\u043E\u043A\u0430"}.`,confirmRemoveActivity:"\u0414\u0430 \u0441\u0435 \u043F\u0440\u0435\u043C\u0430\u0445\u043D\u0435 \u043B\u0438 \u0432\u044A\u043F\u0440\u0435\u043A\u0438 \u0442\u043E\u0432\u0430?",noSlots:"\u0414\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0447\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438, \u0437\u0430 \u0434\u0430 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442\u0435 \u0438\u0437\u0433\u043B\u0435\u0434\u0430 \u201E\u041C\u0440\u0435\u0436\u0430\u201C.",noBlocks:"\u041D\u044F\u043C\u0430 \u0437\u0430\u043D\u0438\u043C\u0430\u043D\u0438\u044F",orphanActivity:"\u041D\u0435\u043F\u043E\u0437\u043D\u0430\u0442\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442"}};var Rt={days:{mon:{full:"Monday",short:"Mon"},tue:{full:"Tuesday",short:"Tue"},wed:{full:"Wednesday",short:"Wed"},thu:{full:"Thursday",short:"Thu"},fri:{full:"Friday",short:"Fri"},sat:{full:"Saturday",short:"Sat"},sun:{full:"Sunday",short:"Sun"}},until:r=>`until ${r}`,after:r=>`after ${r}`,range:(r,t)=>`${r}\u2013${t}`,untilWord:"until",afterWord:"after",today:"Today",editor:{tabSettings:"Settings",tabSchedule:"Schedule",tabActivities:"Activities",title:"Title",layout:"Layout",layoutBlocks:"Blocks",layoutGrid:"Grid",days:"Days",language:"Language",languageAuto:"Automatic",languageEnglish:"English",languageBulgarian:"Bulgarian",highlightToday:"Highlight today",headerColor:"Header colour",slots:"Time slots",addSlot:"Add slot",slotColumn:"Slot",addBlock:"Add block",addBlockNeedsActivity:"Add an activity first",activity:"Activity",start:"Start",end:"End",slot:"Slot",slotNone:"Not on the grid",moveUp:"Move up",moveDown:"Move down",moveToDay:"Move to another day",clearTime:"Clear this time (makes the block open-ended)",remove:"Remove",placeHint:"Tap an activity, then tap a day to add it there",activityTitle:"Title",activitySubtitle:"Subtitle",newActivityTitle:"New activity name",addActivity:"Add activity",activityInUse:(r,t)=>`\u201C${r}\u201D is used by ${t} block${t===1?"":"s"}.`,confirmRemoveActivity:"Remove it anyway?",noSlots:"Add time slots to use the grid layout.",noBlocks:"Nothing scheduled",orphanActivity:"Unknown activity"}};function C(r,t){return r.language==="en"||r.language==="bg"?r.language:(t?.language??"en").toLowerCase().startsWith("bg")?"bg":"en"}function at(r){return r==="bg"?Tt:Rt}var ct="custom:weekly-timetable-card",dt=["mon","tue","wed","thu","fri"],ut="#1e3a5f",lr="#888888";function lt(r){if(typeof r=="number"&&Number.isFinite(r)&&r>=0){let e=Math.floor(r/60),o=r%60;return`${String(e).padStart(2,"0")}:${String(o).padStart(2,"0")}`}if(typeof r!="string")return;let t=r.trim();return t.length>0?t:void 0}function pt(r){let t=r??{};if(t.people!==void 0)throw new Error("weekly-timetable-card: unknown key `people` \u2014 a card shows one timetable. Put `slots` and `schedule` at the top level.");if(t.activities!==void 0&&!Array.isArray(t.activities))throw new Error("weekly-timetable-card: `activities` must be a list");let e=le(t.days,dt),o=(Array.isArray(t.activities)?t.activities:[]).map(cr).filter(c=>c!==null),i=t.schedule??{},n={},s=new Set(e);for(let c of Object.keys(i))Et(c)&&s.add(c);for(let c of D){if(!s.has(c))continue;let p=i[c];n[c]=Array.isArray(p)?p.map(dr).filter(h=>h!==null):[]}let a=Array.isArray(t.slots)?t.slots.map((c,p)=>ur(c,p)).filter(c=>c!==null):void 0,l={type:typeof t.type=="string"?t.type:ct,title:typeof t.title=="string"?t.title:void 0,layout:t.layout==="grid"?"grid":"blocks",days:e,language:t.language==="en"||t.language==="bg"?t.language:"auto",highlight_today:t.highlight_today!==!1,header_color:typeof t.header_color=="string"&&t.header_color.trim().length>0?t.header_color.trim():ut,activities:o,schedule:n};return a&&(l.slots=a),l}function cr(r){let t=r??{},e=typeof t.id=="string"?t.id.trim():"";if(e.length===0)return null;let o=typeof t.title=="string"&&t.title.trim().length>0?t.title.trim():e,i=typeof t.color=="string"&&t.color.trim().length>0?t.color.trim():lr,n={id:e,title:o,color:i},s=typeof t.subtitle=="string"?t.subtitle.trim():"";return s.length>0&&(n.subtitle=s),n}function dr(r){let t=r??{};if(typeof t.activity!="string"||t.activity.trim().length===0)return null;let e={activity:t.activity.trim()},o=lt(t.start),i=lt(t.end);return o&&(e.start=o),i&&(e.end=i),e}function ur(r,t){let e=r??{},o=lt(e.start),i=lt(e.end);return!o||!i?null:{slot:typeof e.slot=="number"&&Number.isFinite(e.slot)?e.slot:t+1,start:o,end:i}}var pr={en:[{id:"english",title:"English",subtitle:"Room 12",color:"#3b82f6"},{id:"daycare",title:"After-school club",color:"#64748b"},{id:"break",title:"Break and a snack",color:"#94a3b8"},{id:"judo",title:"Judo",subtitle:"Sports hall",color:"#f97316"},{id:"chess",title:"Chess",color:"#a855f7"},{id:"home",title:"Back home",color:"#22c55e"}],bg:[{id:"english",title:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",subtitle:"\u0421\u0442\u0430\u044F 12",color:"#3b82f6"},{id:"daycare",title:"\u0417\u0430\u043D\u0438\u043C\u0430\u043B\u043D\u044F",color:"#64748b"},{id:"break",title:"\u041F\u043E\u0447\u0438\u0432\u043A\u0430 \u0438 \u0445\u0430\u043F\u0432\u0430\u043D\u0435",color:"#94a3b8"},{id:"judo",title:"\u0414\u0436\u0443\u0434\u043E",subtitle:"\u0421\u043F\u043E\u0440\u0442\u043D\u0430 \u0437\u0430\u043B\u0430",color:"#f97316"},{id:"chess",title:"\u0428\u0430\u0445",color:"#a855f7"},{id:"home",title:"\u0412\u0440\u044A\u0449\u0430\u043D\u0435 \u0432\u043A\u044A\u0449\u0438",color:"#22c55e"}]},hr="Sami";function pe(r){let t=C({language:"auto"},r),e=o=>[{activity:"english",start:"15:20",end:"16:20"},{activity:"break",start:"16:20",end:"17:30"},{activity:o,start:"17:30",end:"18:30"},{activity:"home",start:"18:30"}];return{type:ct,title:hr,layout:"blocks",days:[...dt],language:"auto",highlight_today:!0,header_color:ut,activities:pr[t].map(o=>({...o})),schedule:{mon:e("judo"),tue:[{activity:"daycare",end:"16:00"}],wed:e("judo"),thu:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}],fri:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}]}}}function Dt(r,t){if(t<=0||r<=0)return"stacked";let e=r/t;return e>=110?"full":e>=72?"compact":"stacked"}var he=j`
  .block {
    display: flex;
    align-items: baseline;
    gap: 8px;
    border-radius: 8px;
    padding: 8px 10px;
    text-align: left;
    /* The solid fallback is declared first so a browser without color-mix
       still shows a readable block rather than a transparent one. */
    background: var(--secondary-background-color);
    background: var(--wtc-block-fill, var(--secondary-background-color));
    border: 1px solid var(--divider-color);
    border-color: var(--wtc-block-border, var(--divider-color));
  }

  .block.orphan {
    border-style: dashed;
    background: var(--secondary-background-color);
  }

  /* Content-sized so the text column takes the remainder, and right-aligned so
     the two stacked times line up with each other rather than with the title.
     The words until/after are the widest content and set the column's floor. */
  .block-time {
    flex: 0 0 auto;
    text-align: right;
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }

  .block-text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .block-title {
    font-size: 13px;
    line-height: 1.3;
    font-weight: 600;
    color: var(--primary-text-color);
    overflow-wrap: break-word;
  }

  .block-subtitle {
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
    overflow-wrap: break-word;
  }
`,fe=j`
  ${he}

  :host {
    display: block;
  }

  ha-card {
    padding: 12px;
    overflow: hidden;
  }

  .card-title {
    margin: 0 0 10px;
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .week {
    display: grid;
    grid-template-columns: repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 12px;
    align-items: stretch;
  }

  .day {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    overflow: hidden;
    background: var(--card-background-color);
  }

  .day-head {
    padding: 10px 6px;
    background: var(--wtc-header-color, #1e3a5f);
    color: var(--wtc-header-text, #ffffff);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: center;
  }

  .day-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }

  .day.today .day-head {
    background: color-mix(in srgb, var(--wtc-header-color, #1e3a5f) 85%, white 15%);
  }

  .day.today .day-body {
    background: color-mix(
      in srgb,
      var(--wtc-header-color, #1e3a5f) 7%,
      var(--card-background-color, #ffffff)
    );
  }

  .empty {
    padding: 4px 0;
    font-size: 12px;
    color: var(--secondary-text-color);
    text-align: center;
  }

  [data-density="compact"] .day-head {
    padding: 8px 4px;
    font-size: 11px;
    letter-spacing: 0.04em;
  }
  [data-density="compact"] .day-body {
    gap: 6px;
    padding: 6px;
  }
  [data-density="compact"] .block {
    padding: 5px 7px;
    gap: 6px;
  }
  [data-density="compact"] .block-time,
  [data-density="compact"] .block-subtitle {
    font-size: 10px;
  }
  [data-density="compact"] .block-title {
    font-size: 12px;
  }
  [data-density="compact"] .grid-head {
    padding: 8px 4px;
    font-size: 11px;
    letter-spacing: 0.04em;
  }
  [data-density="compact"] .slot-label {
    padding: 4px 6px;
    font-size: 10px;
  }
  [data-density="compact"] .grid-cell {
    gap: 4px;
    min-height: 32px;
    padding: 3px;
  }

  [data-density="stacked"] .week {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  [data-density="stacked"] .day-head {
    padding-left: 12px;
    text-align: left;
  }

  .grid-wrap {
    display: grid;
    grid-template-columns: max-content repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 10px 6px;
  }

  .grid,
  .grid-heads {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    align-items: stretch;
  }

  .grid {
    row-gap: 6px;
  }

  .grid-head {
    padding: 10px 6px;
    border-radius: 8px;
    background: var(--wtc-header-color, #1e3a5f);
    color: var(--wtc-header-text, #ffffff);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: center;
  }

  .grid-head.today {
    background: color-mix(in srgb, var(--wtc-header-color, #1e3a5f) 85%, white 15%);
  }

  .grid-corner {
    background: transparent;
  }

  .slot-label {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    font-size: 11px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }

  .grid-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 40px;
    padding: 4px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }

  .grid-cell.today {
    background: color-mix(
      in srgb,
      var(--wtc-header-color, #1e3a5f) 7%,
      var(--card-background-color, #ffffff)
    );
  }

  .strip {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
  }

  .strip-label {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .strip-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .no-slots {
    grid-column: 1 / -1;
    padding: 16px;
    color: var(--secondary-text-color);
    text-align: center;
  }
`,me=j`
  ${he}

  :host {
    display: block;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }

  .tab {
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }

  .tab[aria-selected="true"] {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color, #ffffff));
    font-weight: 600;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .field.inline {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .hint {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  input[type="text"],
  input[type="time"],
  input[type="number"],
  select {
    padding: 6px 8px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
  }

  input[type="color"] {
    width: 40px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: none;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    padding: 5px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .chip[aria-pressed="true"] {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 16%, var(--card-background-color, #ffffff));
    color: var(--primary-text-color);
    font-weight: 600;
  }

  /* Home Assistant's card-config dialog gives the editor about 390px. A block
     row holds seven controls, and the two time inputs alone take ~216px there,
     so an unconstrained min-width of 0 collapsed the activity select - the one
     field that says what the row IS - to 18px. Wrap instead of crushing. */
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }

  .row .grow {
    flex: 1 1 7rem;
    min-width: 7rem;
  }

  .icon-button {
    width: 30px;
    height: 30px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    line-height: 1;
    cursor: pointer;
  }

  .icon-button[disabled] {
    opacity: 0.4;
    cursor: default;
  }

  .day-group {
    padding: 10px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }

  .day-group > h4 {
    margin: 0 0 8px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary-text-color);
  }

  .block-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .palette {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .palette-chip {
    padding: 6px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .palette-chip[aria-pressed="true"] {
    outline: 2px solid var(--primary-color);
  }
`;var fr=/[^\p{L}\p{N}]+/gu,mr=/^-+|-+$/g;function gr(r){return r.toLowerCase().replace(fr,"-").replace(mr,"")}function ge(r,t){let e=gr(r)||"activity";if(!t.includes(e))return e;let o=2;for(;t.includes(`${e}-${o}`);)o+=1;return`${e}-${o}`}function ye(r,t){return r.find(e=>e.id===t)}var be=/^(\d{1,2}):(\d{2})$/;function ve(r){try{return new Intl.DateTimeFormat(r,{hour:"numeric"}).formatToParts(new Date(2020,0,1,13,0)).some(e=>e.type==="dayPeriod")}catch{return!1}}var yr={en:"en-GB",bg:"bg"};function Lt(r,t){return r?.language??yr[t]}function vr(r,t){let e=r?.locale?.time_format;if(e==="12")return!0;if(e==="24")return!1;if(e==="system"){let o=typeof navigator>"u"?void 0:navigator.language;return ve(o??Lt(r,t))}return ve(Lt(r,t))}function O(r,t,e){let o=r.trim(),i=be.exec(o);if(!i)return o;let n=Number(i[1]),s=Number(i[2]);if(n>23||s>59)return o;if(!vr(t,e))return`${String(n).padStart(2,"0")}:${i[2]}`;try{return new Intl.DateTimeFormat(Lt(t,e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(new Date(2020,0,1,n,s))}catch{return o}}var Pt=24*60;function $e(r,t){let e=be.exec(r.trim());if(!e)return r;let i=((Number(e[1])*60+Number(e[2])+t)%Pt+Pt)%Pt,n=Math.floor(i/60);return`${String(n).padStart(2,"0")}:${String(i%60).padStart(2,"0")}`}var br="08:00",$r=45;function xe(r,t,e){return Math.min(Math.max(r,t),e)}function N(r,t){return r.schedule[t]??[]}function ht(r,t,e){return{...r,schedule:{...r.schedule,[t]:e}}}function P(r,t){return{...r,...t}}function Bt(r,t,e){return ht(r,t,[...N(r,t),{...e}])}function S(r,t,e,o){let i=r.schedule[t]?.[e];if(!i)return r;let n={...i};o.activity!==void 0&&(n.activity=o.activity),o.start!==void 0&&(o.start===null||o.start===""?delete n.start:n.start=o.start),o.end!==void 0&&(o.end===null||o.end===""?delete n.end:n.end=o.end);let s=N(r,t).map((a,l)=>l===e?n:a);return ht(r,t,s)}function _e(r,t,e){if(!r.schedule[t]?.[e])return r;let o=N(r,t).filter((i,n)=>n!==e);return ht(r,t,o)}function Ht(r,t,e){let o=[...N(r,t.day)],i=o[t.index];if(!i)return r;if(o.splice(t.index,1),t.day===e.day)return o.splice(xe(e.index,0,o.length),0,i),ht(r,t.day,o);let n=[...N(r,e.day)];return n.splice(xe(e.index,0,n.length),0,i),{...r,schedule:{...r.schedule,[t.day]:o,[e.day]:n}}}function Mt(r,t,e,o){let i=e+o;return i<0||i>=N(r,t).length?r:Ht(r,{day:t,index:e},{day:t,index:i})}function Ae(r,t,e){let o=ge(t,r.activities.map(i=>i.id));return{...r,activities:[...r.activities,{id:o,title:t,color:e}]}}function ft(r,t,e){return r.activities[t]?{...r,activities:r.activities.map((o,i)=>i===t?{...o,...e}:o)}:r}function Ce(r,t){return r.activities[t]?{...r,activities:r.activities.filter((e,o)=>o!==t)}:r}function Se(r,t){let e=0;for(let o of Object.values(r.schedule))for(let i of o??[])i.activity===t&&(e+=1);return e}function we(r){let t=r.slots??[],o=t[t.length-1]?.end??br,i=t.reduce((n,s)=>Math.max(n,s.slot),0)+1;return{...r,slots:[...t,{slot:i,start:o,end:$e(o,$r)}]}}function Ot(r,t,e){return r.slots?.[t]?{...r,slots:r.slots.map((o,i)=>i===t?{...o,...e}:o)}:r}function ke(r,t){return r.slots?.[t]?{...r,slots:r.slots.filter((e,o)=>o!==t)}:r}function f(r){return r.target.value}function Ee(r){return r.target.checked}var Te="#64748b";function Re(r){let{config:t,strings:e,commit:o}=r,i=(n,s)=>{let a=Se(t,s.id);if(a>0){let l=`${e.editor.activityInUse(s.title,a)} ${e.editor.confirmRemoveActivity}`;if(!window.confirm(l))return}o(Ce(t,n))};return d`
    <div class="panel">
      ${t.activities.map((n,s)=>d`
          <div class="row" data-activity=${n.id}>
            <input
              type="color"
              data-field="color"
              .value=${st(n.color,Te)}
              @change=${a=>o(ft(t,s,{color:f(a)}))}
            />
            <input
              class="grow"
              type="text"
              data-field="title"
              .value=${n.title}
              @change=${a=>o(ft(t,s,{title:f(a)}))}
            />
            <input
              class="grow"
              type="text"
              data-field="subtitle"
              placeholder=${e.editor.activitySubtitle}
              .value=${n.subtitle??""}
              @change=${a=>o(ft(t,s,{subtitle:f(a)}))}
            />
            <button
              class="icon-button"
              type="button"
              data-action="remove-activity"
              title=${e.editor.remove}
              @click=${()=>i(s,n)}
            >
              ×
            </button>
          </div>
        `)}

      <div class="row">
        <input
          class="grow"
          type="text"
          data-field="new-title"
          placeholder=${e.editor.newActivityTitle}
        />
        <button
          class="icon-button"
          type="button"
          data-action="add-activity"
          title=${e.editor.addActivity}
          @click=${n=>{let a=n.currentTarget.parentElement.querySelector('[data-field="new-title"]'),l=a.value.trim();l.length!==0&&(a.value="",o(Ae(t,l,Te)))}}
        >
          +
        </button>
      </div>

      <div class="palette">
        ${t.activities.map(n=>d`
            <div
              class="block"
              style=${b({"--wtc-block-fill":it(n.color),"--wtc-block-border":nt(n.color)})}
            >
              <div class="block-text">
                <div class="block-title">${n.title}</div>
                ${n.subtitle?d`<div class="block-subtitle">${n.subtitle}</div>`:u}
              </div>
            </div>
          `)}
      </div>
    </div>
  `}function De(r,t,e){r.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}function L(r){let t=!!r.start,e=!!r.end;return t&&e?"range":e?"until":t?"after":"bare"}function Pe(r,t){let e=o=>O(o,r.hass,r.lang);switch(L(t)){case"range":return r.strings.range(e(t.start),e(t.end));case"until":return r.strings.until(e(t.end));case"after":return r.strings.after(e(t.start));case"bare":return""}}function xr(r,t){let e=o=>O(o,r.hass,r.lang);switch(L(t)){case"range":return{top:e(t.start),bottom:e(t.end)};case"until":return{top:r.strings.untilWord,bottom:e(t.end)};case"after":return{top:r.strings.afterWord,bottom:e(t.start)};case"bare":return null}}function Y(r,t,e){let o=ye(r.config.activities,t.activity),i=e?.hideTime===!0?null:xr(r,t),n=o?{"--wtc-block-fill":it(o.color),"--wtc-block-border":nt(o.color)}:{};return d`
    <div
      class=${o?"block":"block orphan"}
      style=${b(n)}
      title=${o?u:r.strings.editor.orphanActivity}
    >
      ${i?d`
            <div class="block-time">
              <div class="block-time-top">${i.top}</div>
              <div class="block-time-bottom">${i.bottom}</div>
            </div>
          `:u}
      <div class="block-text">
        <div class="block-title">${o?o.title:t.activity}</div>
        ${o?.subtitle?d`<div class="block-subtitle">${o.subtitle}</div>`:u}
      </div>
    </div>
  `}function _r(r){return{strings:r.strings,hass:r.hass,lang:C(r.config,r.hass)}}function Le(r,t){let{config:e,strings:o}=r,i=e.days;return d`
    <div class="panel">
      ${e.layout==="grid"?Ar(r):u}

      <div class="palette">
        ${e.activities.map(n=>d`
            <button
              type="button"
              class="palette-chip"
              data-palette-activity=${n.id}
              aria-pressed=${t.selectedActivity===n.id?"true":"false"}
              @click=${()=>t.onSelectActivity(t.selectedActivity===n.id?null:n.id)}
            >
              ${n.title}
            </button>
          `)}
      </div>
      <div class="hint">${o.editor.placeHint}</div>

      ${i.map(n=>Cr(r,t,n))}
    </div>
  `}function Ar(r){let{config:t,strings:e,commit:o}=r,i=t.slots??[];return d`
    <div class="day-group" data-section="slots">
      <h4>${e.editor.slots}</h4>
      <div class="block-rows">
        ${i.map((n,s)=>d`
            <div class="row" data-slot-index=${s}>
              <span class="hint" style="width: 2rem">${n.slot}</span>
              <input
                type="time"
                data-field="slot-start"
                .value=${n.start}
                @change=${a=>o(Ot(t,s,{start:f(a)}))}
              />
              <input
                type="time"
                data-field="slot-end"
                .value=${n.end}
                @change=${a=>o(Ot(t,s,{end:f(a)}))}
              />
              <button
                class="icon-button"
                type="button"
                data-action="remove-slot"
                title=${e.editor.remove}
                @click=${()=>o(ke(t,s))}
              >
                ×
              </button>
            </div>
          `)}
        <button
          class="chip"
          type="button"
          data-action="add-slot"
          @click=${()=>o(we(t))}
        >
          ＋ ${e.editor.addSlot}
        </button>
      </div>
    </div>
  `}function Cr(r,t,e){let{config:o,strings:i,commit:n}=r,s=o.schedule[e]??[],a=o.activities[0]?.id;return d`
    <div
      class="day-group"
      data-day=${e}
      @click=${()=>{t.selectedActivity&&(n(Bt(o,e,{activity:t.selectedActivity})),t.onSelectActivity(null))}}
    >
      <h4>${i.days[e].full}</h4>
      <div class="block-rows">
        ${s.map((l,c)=>Sr(r,t,e,l,c,s.length))}
        ${a?d`
              <button
                class="chip"
                type="button"
                data-action="add-block"
                @click=${l=>{l.stopPropagation(),n(Bt(o,e,{activity:a}))}}
              >
                ＋ ${i.editor.addBlock}
              </button>
            `:d`
              <button class="chip" type="button" data-action="add-block" disabled>
                ＋ ${i.editor.addBlock}
              </button>
              <div class="hint">${i.editor.addBlockNeedsActivity}</div>
            `}
      </div>
    </div>
  `}function Sr(r,t,e,o,i,n){let{config:s,strings:a,commit:l}=r;return d`
    <div class="row" data-block-index=${i} @click=${c=>c.stopPropagation()}>
      <select
        class="grow"
        data-field="activity"
        @change=${c=>l(S(s,e,i,{activity:f(c)}))}
      >
        ${s.activities.map(c=>d`
            <option value=${c.id} .selected=${c.id===o.activity}>
              ${c.title}
            </option>
          `)}
        ${s.activities.some(c=>c.id===o.activity)?u:d`<option value=${o.activity} .selected=${!0}>${o.activity}</option>`}
      </select>

      <select
        data-field="day"
        title=${a.editor.moveToDay}
        @change=${c=>{let p=f(c);if(p===e)return;let h=(s.schedule[p]??[]).length;l(Ht(s,{day:e,index:i},{day:p,index:h}))}}
      >
        ${s.days.map(c=>d`
            <option value=${c} .selected=${c===e}>
              ${a.days[c].short}
            </option>
          `)}
      </select>

      ${s.layout==="grid"?wr(r,e,o,i,s.slots??[]):d`
            <input
              type="time"
              data-field="start"
              .value=${o.start??""}
              @change=${c=>l(S(s,e,i,{start:f(c)||null}))}
            />
            ${o.start?d`
                  <button
                    class="icon-button"
                    type="button"
                    data-action="clear-start"
                    title=${a.editor.clearTime}
                    @click=${()=>l(S(s,e,i,{start:null}))}
                  >
                    ⌫
                  </button>
                `:u}
            <input
              type="time"
              data-field="end"
              .value=${o.end??""}
              @change=${c=>l(S(s,e,i,{end:f(c)||null}))}
            />
            ${o.end?d`
                  <button
                    class="icon-button"
                    type="button"
                    data-action="clear-end"
                    title=${a.editor.clearTime}
                    @click=${()=>l(S(s,e,i,{end:null}))}
                  >
                    ⌫
                  </button>
                `:u}
          `}

      <button
        class="icon-button"
        type="button"
        data-action="move-up"
        title=${a.editor.moveUp}
        ?disabled=${i===0}
        @click=${()=>l(Mt(s,e,i,-1))}
      >
        ↑
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="move-down"
        title=${a.editor.moveDown}
        ?disabled=${i>=n-1}
        @click=${()=>l(Mt(s,e,i,1))}
      >
        ↓
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="remove-block"
        title=${a.editor.remove}
        @click=${()=>l(_e(s,e,i))}
      >
        ×
      </button>
    </div>
  `}function wr(r,t,e,o,i){let{config:n,strings:s,commit:a}=r,l=L(e)==="range"?i.find(p=>p.start===e.start&&p.end===e.end):void 0,c=l===void 0&&(e.start!==void 0||e.end!==void 0);return d`
    <select
      data-field="slot"
      @change=${p=>{let h=f(p);if(h===""){a(S(n,t,o,{start:null,end:null}));return}let m=i.find(y=>String(y.slot)===h);m&&a(S(n,t,o,{start:m.start,end:m.end}))}}
    >
      <option value="" .selected=${l===void 0}>${s.editor.slotNone}</option>
      ${i.map(p=>d`
          <option value=${String(p.slot)} .selected=${l?.slot===p.slot}>
            ${p.slot}. ${p.start}–${p.end}
          </option>
        `)}
    </select>
    ${c?d`<span class="hint">${Pe(_r(r),e)}</span>`:u}
  `}function Be(r){let{config:t,strings:e,commit:o}=r,i=de(r.hass);return d`
    <div class="panel">
      <label class="field">
        <span>${e.editor.title}</span>
        <input
          type="text"
          data-field="title"
          .value=${t.title??""}
          @change=${n=>o(P(t,{title:f(n)||void 0}))}
        />
      </label>

      <label class="field">
        <span>${e.editor.layout}</span>
        <select
          data-field="layout"
          @change=${n=>o(P(t,{layout:f(n)}))}
        >
          <option value="blocks" .selected=${t.layout==="blocks"}>
            ${e.editor.layoutBlocks}
          </option>
          <option value="grid" .selected=${t.layout==="grid"}>
            ${e.editor.layoutGrid}
          </option>
        </select>
      </label>

      <div class="field">
        <span>${e.editor.days}</span>
        <div class="chips">
          ${i.map(n=>d`
              <button
                type="button"
                class="chip"
                data-day=${n}
                aria-pressed=${t.days.includes(n)?"true":"false"}
                @click=${()=>o(P(t,{days:ue(t.days,n,i)}))}
              >
                ${e.days[n].short}
              </button>
            `)}
        </div>
      </div>

      <label class="field">
        <span>${e.editor.language}</span>
        <select
          data-field="language"
          @change=${n=>o(P(t,{language:f(n)}))}
        >
          <option value="auto" .selected=${t.language==="auto"}>
            ${e.editor.languageAuto}
          </option>
          <option value="en" .selected=${t.language==="en"}>
            ${e.editor.languageEnglish}
          </option>
          <option value="bg" .selected=${t.language==="bg"}>
            ${e.editor.languageBulgarian}
          </option>
        </select>
      </label>

      <label class="field inline">
        <input
          type="checkbox"
          data-field="highlight_today"
          .checked=${t.highlight_today}
          @change=${n=>o(P(t,{highlight_today:Ee(n)}))}
        />
        <span>${e.editor.highlightToday}</span>
      </label>

      <label class="field inline">
        <input
          type="color"
          data-field="header_color"
          .value=${st(t.header_color,ut)}
          @change=${n=>o(P(t,{header_color:f(n)}))}
        />
        <span>${e.editor.headerColor}</span>
      </label>
    </div>
  `}var _=class extends v{constructor(){super(...arguments);this._tab="settings";this._selectedActivity=null}setConfig(e){this._config=pt(e)}_commit(e){this._config=e,De(this,"config-changed",{config:e})}render(){let e=this._config;if(!e)return u;let o=at(C(e,this.hass)),i={config:e,strings:o,hass:this.hass,commit:n=>this._commit(n)};return d`
      <div class="tabs" role="tablist">
        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="settings"
          aria-selected=${this._tab==="settings"?"true":"false"}
          @click=${()=>{this._tab="settings"}}
        >
          ${o.editor.tabSettings}
        </button>

        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="schedule"
          aria-selected=${this._tab==="schedule"?"true":"false"}
          @click=${()=>{this._tab="schedule"}}
        >
          ${o.editor.tabSchedule}
        </button>

        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="activities"
          aria-selected=${this._tab==="activities"?"true":"false"}
          @click=${()=>{this._tab="activities"}}
        >
          ${o.editor.tabActivities}
        </button>
      </div>

      ${this._renderPanel(i)}
    `}_renderPanel(e){return this._tab==="settings"?Be(e):this._tab==="activities"?Re(e):Le(e,{selectedActivity:this._selectedActivity,onSelectActivity:o=>{this._selectedActivity=o}})}};_.styles=me,g([R({attribute:!1})],_.prototype,"hass",2),g([M()],_.prototype,"_config",2),g([M()],_.prototype,"_tab",2),g([M()],_.prototype,"_selectedActivity",2),_=g([et("weekly-timetable-card-editor")],_);function Nt(r,t){let e=r.strings.days[t];return r.density==="compact"?e.short:e.full}function He(r){return d`
    <div class="week" style=${b({"--wtc-day-count":String(r.days.length)})}>
      ${r.days.map(t=>kr(r,t))}
    </div>
  `}function kr(r,t){let e=r.config.schedule[t]??[];return d`
    <section class=${r.today===t?"day today":"day"}>
      <header class="day-head">${Nt(r,t)}</header>
      <div class="day-body">
        ${e.length>0?e.map(o=>Y(r,o)):d`<div class="empty">${r.strings.editor.noBlocks}</div>`}
      </div>
    </section>
  `}function Me(r){let{config:t,hass:e,density:o,now:i}=r,n=C(t,e);return{config:t,days:t.days,strings:at(n),lang:n,hass:e,density:o,today:t.highlight_today?ce(i):null}}function Oe(r,t){let e=new Map,o=[];for(let i of t){let n=L(i)==="range"?r.find(a=>a.start===i.start&&a.end===i.end):void 0;if(!n){o.push(i);continue}let s=e.get(n.slot);s?s.push(i):e.set(n.slot,[i])}return{bySlot:e,loose:o}}function Ne(r){let t=[...r.config.slots??[]].sort((s,a)=>s.slot-a.slot),e=new Map;for(let s of r.days)e.set(s,Oe(t,r.config.schedule[s]??[]));let o=r.days.some(s=>e.get(s).loose.length>0),i=b({"--wtc-day-count":String(r.days.length)}),n=r.days.map(s=>d`<div class=${r.today===s?"grid-head today":"grid-head"}>${Nt(r,s)}</div>`);return d`
    <div class="grid-wrap" style=${i}>
      ${t.length===0?d`
            <div class="grid-heads">
              <div class="grid-corner"></div>
              ${n}
            </div>
          `:u}
      ${o?d`
            <div class="strip">
              <div class="strip-label"></div>
              ${r.days.map(s=>d`
                  <div class="strip-cell">
                    ${e.get(s).loose.map(a=>Y(r,a))}
                  </div>
                `)}
            </div>
          `:u}
      ${t.length===0?d`<div class="no-slots">${r.strings.editor.noSlots}</div>`:d`
            <div class="grid">
              <div class="grid-corner"></div>
              ${n}
              ${t.flatMap(s=>[d`
                  <div class="slot-label">
                    ${r.strings.range(O(s.start,r.hass,r.lang),O(s.end,r.hass,r.lang))}
                  </div>
                `,...r.days.map(a=>d`
                    <div class=${r.today===a?"grid-cell today":"grid-cell"}>
                      ${(e.get(a).bySlot.get(s.slot)??[]).map(l=>Y(r,l,{hideTime:!0}))}
                    </div>
                  `)])}
            </div>
          `}
    </div>
  `}var Ue="0.1.0";var w=class extends v{constructor(){super(...arguments);this.density="full";this._measuredWidth=0}static getConfigElement(){return document.createElement("weekly-timetable-card-editor")}static getStubConfig(e){return pe(e)}static getLayoutOptions(){return{grid_columns:"full",grid_rows:"auto"}}setConfig(e){this._config=pt(e)}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),!(typeof ResizeObserver>"u")&&(this._observer=new ResizeObserver(e=>{let o=e[0]?.contentRect.width??0;this._measuredWidth=o;let i=Dt(o,this._dayCount());i!==this.density&&(this.density=i)}),this._observer.observe(this))}disconnectedCallback(){this._observer?.disconnect(),this._observer=void 0,super.disconnectedCallback()}willUpdate(e){if(super.willUpdate(e),this._measuredWidth<=0)return;let o=Dt(this._measuredWidth,this._dayCount());o!==this.density&&(this.density=o)}_dayCount(){return this._config?.days.length??dt.length}render(){let e=this._config;if(!e)return u;let o=Me({config:e,hass:this.hass,density:this.density}),i=this.density==="stacked"||e.layout==="blocks"?He(o):Ne(o),n=b({"--wtc-header-color":e.header_color,"--wtc-header-text":ae(e.header_color)});return d`
      <ha-card style=${n}>
        ${e.title?d`<h1 class="card-title">${e.title}</h1>`:u}
        <div class="body" data-density=${this.density}>${i}</div>
      </ha-card>
    `}};w.styles=fe,g([R({attribute:!1})],w.prototype,"hass",2),g([R({attribute:!1})],w.prototype,"density",2),g([M()],w.prototype,"_config",2),w=g([et("weekly-timetable-card")],w);console.info(`%c WEEKLY-TIMETABLE-CARD %c v${Ue} `,"color:#fff;background:#1e3a5f;padding:2px 4px;border-radius:3px 0 0 3px","color:#1e3a5f;background:#e2e8f0;padding:2px 4px;border-radius:0 3px 3px 0");window.customCards=window.customCards??[];window.customCards.push({type:ct.replace(/^custom:/,""),name:"Weekly Timetable Card",description:"Weekly timetable in English or Bulgarian",preview:!0,documentationURL:"https://github.com/vmlinuz82/weekly-timetable-card"});export{w as WeeklyTimetableCard};
