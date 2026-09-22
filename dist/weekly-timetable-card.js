var We=Object.defineProperty;var Xe=Object.getOwnPropertyDescriptor;var g=(o,t,e,r)=>{for(var n=r>1?void 0:r?Xe(t,e):t,i=o.length-1,s;i>=0;i--)(s=o[i])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&We(t,e,n),n};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var rt=globalThis,nt=rt.ShadowRoot&&(rt.ShadyCSS===void 0||rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,At=Symbol(),Wt=new WeakMap,F=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==At)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(nt&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=Wt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Wt.set(e,t))}return t}toString(){return this.cssText}},Xt=o=>new F(typeof o=="string"?o:o+"",void 0,At),z=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((r,n,i)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+o[i+1],o[0]);return new F(e,o,At)},Jt=(o,t)=>{if(nt)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),n=rt.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=e.cssText,o.appendChild(r)}},Ct=nt?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return Xt(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:Je,defineProperty:Ze,getOwnPropertyDescriptor:Qe,getOwnPropertyNames:to,getOwnPropertySymbols:eo,getPrototypeOf:oo}=Object,it=globalThis,Zt=it.trustedTypes,ro=Zt?Zt.emptyScript:"",no=it.reactiveElementPolyfillSupport,V=(o,t)=>o,Y={toAttribute(o,t){switch(t){case Boolean:o=o?ro:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},st=(o,t)=>!Je(o,t),Qt={attribute:!0,type:String,converter:Y,reflect:!1,useDefault:!1,hasChanged:st};Symbol.metadata??=Symbol("metadata"),it.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Qt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),n=this.getPropertyDescriptor(t,r,e);n!==void 0&&Ze(this.prototype,t,n)}}static getPropertyDescriptor(t,e,r){let{get:n,set:i}=Qe(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:n,set(s){let a=n?.call(this);i?.call(this,s),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qt}static _$Ei(){if(this.hasOwnProperty(V("elementProperties")))return;let t=oo(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(V("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(V("properties"))){let e=this.properties,r=[...to(e),...eo(e)];for(let n of r)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,n]of e)this.elementProperties.set(r,n)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let n=this._$Eu(e,r);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let n of r)e.unshift(Ct(n))}else t!==void 0&&e.push(Ct(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Jt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){let i=(r.converter?.toAttribute!==void 0?r.converter:Y).toAttribute(e,r.type);this._$Em=t,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(t,e){let r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let i=r.getPropertyOptions(n),s=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Y;this._$Em=n;let a=s.fromAttribute(e,i.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,r,n=!1,i){if(t!==void 0){let s=this.constructor;if(n===!1&&(i=this[t]),r??=s.getPropertyOptions(t),!((r.hasChanged??st)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:n,wrapped:i},s){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),i!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[n,i]of r){let{wrapped:s}=i,a=this[n];s!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[V("elementProperties")]=new Map,_[V("finalized")]=new Map,no?.({ReactiveElement:_}),(it.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Tt=globalThis,te=o=>o,at=Tt.trustedTypes,ee=at?at.createPolicy("lit-html",{createHTML:o=>o}):void 0,ae="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,le="?"+k,io=`<${le}>`,P=document,G=()=>P.createComment(""),W=o=>o===null||typeof o!="object"&&typeof o!="function",Rt=Array.isArray,so=o=>Rt(o)||typeof o?.[Symbol.iterator]=="function",kt=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,oe=/-->/g,re=/>/g,S=RegExp(`>|${kt}(?:([^\\s"'>=/]+)(${kt}*=${kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ne=/'/g,ie=/"/g,ce=/^(?:script|style|textarea|title)$/i,Lt=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),p=Lt(1),Xo=Lt(2),Jo=Lt(3),x=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),se=new WeakMap,E=P.createTreeWalker(P,129);function de(o,t){if(!Rt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ee!==void 0?ee.createHTML(t):t}var ao=(o,t)=>{let e=o.length-1,r=[],n,i=t===2?"<svg>":t===3?"<math>":"",s=q;for(let a=0;a<e;a++){let l=o[a],c,u,d=-1,f=0;for(;f<l.length&&(s.lastIndex=f,u=s.exec(l),u!==null);)f=s.lastIndex,s===q?u[1]==="!--"?s=oe:u[1]!==void 0?s=re:u[2]!==void 0?(ce.test(u[2])&&(n=RegExp("</"+u[2],"g")),s=S):u[3]!==void 0&&(s=S):s===S?u[0]===">"?(s=n??q,d=-1):u[1]===void 0?d=-2:(d=s.lastIndex-u[2].length,c=u[1],s=u[3]===void 0?S:u[3]==='"'?ie:ne):s===ie||s===ne?s=S:s===oe||s===re?s=q:(s=S,n=void 0);let y=s===S&&o[a+1].startsWith("/>")?" ":"";i+=s===q?l+io:d>=0?(r.push(c),l.slice(0,d)+ae+l.slice(d)+k+y):l+k+(d===-2?a:y)}return[de(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},X=class o{constructor({strings:t,_$litType$:e},r){let n;this.parts=[];let i=0,s=0,a=t.length-1,l=this.parts,[c,u]=ao(t,e);if(this.el=o.createElement(c,r),E.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=E.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(ae)){let f=u[s++],y=n.getAttribute(d).split(k),M=/([.?@])?(.*)/.exec(f);l.push({type:1,index:i,name:M[2],strings:y,ctor:M[1]==="."?St:M[1]==="?"?Et:M[1]==="@"?Pt:U}),n.removeAttribute(d)}else d.startsWith(k)&&(l.push({type:6,index:i}),n.removeAttribute(d));if(ce.test(n.tagName)){let d=n.textContent.split(k),f=d.length-1;if(f>0){n.textContent=at?at.emptyScript:"";for(let y=0;y<f;y++)n.append(d[y],G()),E.nextNode(),l.push({type:2,index:++i});n.append(d[f],G())}}}else if(n.nodeType===8)if(n.data===le)l.push({type:2,index:i});else{let d=-1;for(;(d=n.data.indexOf(k,d+1))!==-1;)l.push({type:7,index:i}),d+=k.length-1}i++}}static createElement(t,e){let r=P.createElement("template");return r.innerHTML=t,r}};function N(o,t,e=o,r){if(t===x)return t;let n=r!==void 0?e._$Co?.[r]:e._$Cl,i=W(t)?void 0:t._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(o),n._$AT(o,e,r)),r!==void 0?(e._$Co??=[])[r]=n:e._$Cl=n),n!==void 0&&(t=N(o,n._$AS(o,t.values),n,r)),t}var wt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,n=(t?.creationScope??P).importNode(e,!0);E.currentNode=n;let i=E.nextNode(),s=0,a=0,l=r[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new J(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new Dt(i,this,t)),this._$AV.push(c),l=r[++a]}s!==l?.index&&(i=E.nextNode(),s++)}return E.currentNode=P,n}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},J=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,n){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=N(this,t,e),W(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):so(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&W(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=X.createElement(de(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(e);else{let i=new wt(n,this),s=i.u(this.options);i.p(e),this.T(s),this._$AH=i}}_$AC(t){let e=se.get(t.strings);return e===void 0&&se.set(t.strings,e=new X(t)),e}k(t){Rt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,n=0;for(let i of t)n===e.length?e.push(r=new o(this.O(G()),this.O(G()),this,this.options)):r=e[n],r._$AI(i),n++;n<e.length&&(this._$AR(r&&r._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=te(t).nextSibling;te(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,n,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=h}_$AI(t,e=this,r,n){let i=this.strings,s=!1;if(i===void 0)t=N(this,t,e,0),s=!W(t)||t!==this._$AH&&t!==x,s&&(this._$AH=t);else{let a=t,l,c;for(t=i[0],l=0;l<i.length-1;l++)c=N(this,a[r+l],e,l),c===x&&(c=this._$AH[l]),s||=!W(c)||c!==this._$AH[l],c===h?t=h:t!==h&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}s&&!n&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},St=class extends U{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},Et=class extends U{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},Pt=class extends U{constructor(t,e,r,n,i){super(t,e,r,n,i),this.type=5}_$AI(t,e=this){if((t=N(this,t,e,0)??h)===x)return;let r=this._$AH,n=t===h&&r!==h||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==h&&(r===h||n);n&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Dt=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t)}};var lo=Tt.litHtmlPolyfillSupport;lo?.(X,J),(Tt.litHtmlVersions??=[]).push("3.3.3");var pe=(o,t,e)=>{let r=e?.renderBefore??t,n=r._$litPart$;if(n===void 0){let i=e?.renderBefore??null;r._$litPart$=n=new J(t.insertBefore(G(),i),i,void 0,e??{})}return n._$AI(o),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Bt=globalThis,b=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=pe(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};b._$litElement$=!0,b.finalized=!0,Bt.litElementHydrateSupport?.({LitElement:b});var co=Bt.litElementPolyfillSupport;co?.({LitElement:b});(Bt.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var lt=o=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(o,t)}):customElements.define(o,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var po={attribute:!0,type:String,converter:Y,reflect:!1,hasChanged:st},uo=(o=po,t,e)=>{let{kind:r,metadata:n}=e,i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),r==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(e.name,o),r==="accessor"){let{name:s}=e;return{set(a){let l=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,l,o,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,o,a),a}}}if(r==="setter"){let{name:s}=e;return function(a){let l=this[s];t.call(this,a),this.requestUpdate(s,l,o,!0,a)}}throw Error("Unsupported decorator location: "+r)};function D(o){return(t,e)=>typeof e=="object"?uo(o,t,e):((r,n,i)=>{let s=n.hasOwnProperty(i);return n.constructor.createProperty(i,r),s?Object.getOwnPropertyDescriptor(n,i):void 0})(o,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function T(o){return D({...o,state:!0,attribute:!1})}/**
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
 */var ue={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},he=o=>(...t)=>({_$litDirective$:o,values:t}),dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var me="important",ho=" !"+me,v=he(class extends dt{constructor(o){if(super(o),o.type!==ue.ATTRIBUTE||o.name!=="style"||o.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(o){return Object.keys(o).reduce((t,e)=>{let r=o[e];return r==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(o,[t]){let{style:e}=o.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let r of this.ft)t[r]==null&&(this.ft.delete(r),r.includes("-")?e.removeProperty(r):e[r]=null);for(let r in t){let n=t[r];if(n!=null){this.ft.add(r);let i=typeof n=="string"&&n.endsWith(ho);r.includes("-")||i?e.setProperty(r,i?n.slice(0,-11):n,i?me:""):e[r]=n}}return x}});var mo=/^#?(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i;var fe="var(--card-background-color, #ffffff)";function ye(o){let t=mo.exec(o.trim());if(!t)return null;let e=t[1]?t[1].split("").map(r=>r+r).join(""):t[2];return{r:Number.parseInt(e.slice(0,2),16),g:Number.parseInt(e.slice(2,4),16),b:Number.parseInt(e.slice(4,6),16)}}function Ht(o){let t=o/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4}function fo({r:o,g:t,b:e}){return .2126*Ht(o)+.7152*Ht(t)+.0722*Ht(e)}function ge(o){let t=ye(o);return t&&fo(t)>.179?"#0f172a":"#ffffff"}function pt(o){return`color-mix(in srgb, ${o} 14%, ${fe})`}function ut(o){return`color-mix(in srgb, ${o} 35%, ${fe})`}function j(o,t){let e=ye(o);if(!e)return t;let r=n=>n.toString(16).padStart(2,"0");return`#${r(e.r)}${r(e.g)}${r(e.b)}`}var R=["mon","tue","wed","thu","fri","sat","sun"];function L(o){return typeof o=="string"&&R.includes(o)}function Ot(o,t){if(!Array.isArray(o))return[...t];let e=[];for(let r of o)L(r)&&!e.includes(r)&&e.push(r);return e.length>0?e:[...t]}function Z(o,t){return t.days&&t.days.length>0?t.days:o.days}function ve(o=new Date){return R[(o.getDay()+6)%7]}var yo={monday:0,tuesday:1,wednesday:2,thursday:3,friday:4,saturday:5,sunday:6};function ht(o){let t=o?.locale?.first_weekday,e=0;return t&&t!=="language"?e=yo[t]:t==="language"&&(e=go(o?.language)?6:0),R.map((r,n)=>R[(n+e)%7])}function go(o){return o?o.toLowerCase().startsWith("en-us"):!1}function mt(o,t,e){if(o.includes(t))return o.length<=1?o:o.filter(s=>s!==t);let r=s=>e.indexOf(s),n=o.findIndex(s=>r(s)>r(t)),i=[...o];return i.splice(n===-1?i.length:n,0,t),i}var Mt={days:{mon:{full:"\u043F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A",short:"\u043F\u043D"},tue:{full:"\u0432\u0442\u043E\u0440\u043D\u0438\u043A",short:"\u0432\u0442"},wed:{full:"\u0441\u0440\u044F\u0434\u0430",short:"\u0441\u0440"},thu:{full:"\u0447\u0435\u0442\u0432\u044A\u0440\u0442\u044A\u043A",short:"\u0447\u0442"},fri:{full:"\u043F\u0435\u0442\u044A\u043A",short:"\u043F\u0442"},sat:{full:"\u0441\u044A\u0431\u043E\u0442\u0430",short:"\u0441\u0431"},sun:{full:"\u043D\u0435\u0434\u0435\u043B\u044F",short:"\u043D\u0434"}},until:o=>`\u0434\u043E ${o}`,after:o=>`\u0441\u043B\u0435\u0434 ${o}`,range:(o,t)=>`${o}\u2013${t}`,today:"\u0414\u043D\u0435\u0441",editor:{tabSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",tabActivities:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442\u0438",addPerson:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0447\u043E\u0432\u0435\u043A",removePerson:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438 \u0447\u043E\u0432\u0435\u043A",personNamePlaceholder:"\u041D\u043E\u0432 \u0447\u043E\u0432\u0435\u043A",title:"\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435",layout:"\u0418\u0437\u0433\u043B\u0435\u0434",layoutBlocks:"\u0411\u043B\u043E\u043A\u043E\u0432\u0435",layoutGrid:"\u041C\u0440\u0435\u0436\u0430",days:"\u0414\u043D\u0438",language:"\u0415\u0437\u0438\u043A",languageAuto:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E",languageEnglish:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",languageBulgarian:"\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",highlightToday:"\u041E\u0442\u0431\u0435\u043B\u044F\u0437\u0432\u0430\u0439 \u0434\u043D\u0435\u0448\u043D\u0438\u044F \u0434\u0435\u043D",headerColor:"\u0426\u0432\u044F\u0442 \u043D\u0430 \u0437\u0430\u0433\u043B\u0430\u0432\u043A\u0430\u0442\u0430",name:"\u0418\u043C\u0435",emoji:"\u0415\u043C\u043E\u0434\u0436\u0438",color:"\u0426\u0432\u044F\u0442",daysOverride:"\u0414\u043D\u0438 \u0437\u0430 \u0442\u043E\u0437\u0438 \u0447\u043E\u0432\u0435\u043A",daysOverrideHint:"\u041E\u0441\u0442\u0430\u0432\u0435\u0442\u0435 \u043F\u0440\u0430\u0437\u043D\u043E, \u0437\u0430 \u0434\u0430 \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442 \u0434\u043D\u0438\u0442\u0435 \u043D\u0430 \u043A\u0430\u0440\u0442\u0430\u0442\u0430",slots:"\u0427\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438",addSlot:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotColumn:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",addBlock:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0431\u043B\u043E\u043A",addBlockNeedsActivity:"\u041F\u044A\u0440\u0432\u043E \u0434\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activity:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442",start:"\u041D\u0430\u0447\u0430\u043B\u043E",end:"\u041A\u0440\u0430\u0439",slot:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotNone:"\u0418\u0437\u0432\u044A\u043D \u043C\u0440\u0435\u0436\u0430\u0442\u0430",moveUp:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0433\u043E\u0440\u0435",moveDown:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0434\u043E\u043B\u0443",moveToDay:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u0432 \u0434\u0440\u0443\u0433 \u0434\u0435\u043D",remove:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438",dragHint:"\u0412\u043B\u0430\u0447\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442 \u0432\u044A\u0440\u0445\u0443 \u0434\u0435\u043D \u0438\u043B\u0438 \u044F \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0438 \u0441\u043B\u0435\u0434 \u0442\u043E\u0432\u0430 \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0434\u0435\u043D\u044F",label:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",newActivityLabel:"\u0418\u043C\u0435 \u043D\u0430 \u043D\u043E\u0432\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",addActivity:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activityInUse:(o,t)=>`\u201E${o}\u201C \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430 \u0432 ${t} ${t===1?"\u0431\u043B\u043E\u043A":"\u0431\u043B\u043E\u043A\u0430"}.`,confirmRemoveActivity:"\u0414\u0430 \u0441\u0435 \u043F\u0440\u0435\u043C\u0430\u0445\u043D\u0435 \u043B\u0438 \u0432\u044A\u043F\u0440\u0435\u043A\u0438 \u0442\u043E\u0432\u0430?",noSlots:"\u0414\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0447\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438, \u0437\u0430 \u0434\u0430 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442\u0435 \u0438\u0437\u0433\u043B\u0435\u0434\u0430 \u201E\u041C\u0440\u0435\u0436\u0430\u201C.",noBlocks:"\u041D\u044F\u043C\u0430 \u0437\u0430\u043D\u0438\u043C\u0430\u043D\u0438\u044F",orphanActivity:"\u041D\u0435\u043F\u043E\u0437\u043D\u0430\u0442\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442"}};var Nt={days:{mon:{full:"Monday",short:"Mon"},tue:{full:"Tuesday",short:"Tue"},wed:{full:"Wednesday",short:"Wed"},thu:{full:"Thursday",short:"Thu"},fri:{full:"Friday",short:"Fri"},sat:{full:"Saturday",short:"Sat"},sun:{full:"Sunday",short:"Sun"}},until:o=>`until ${o}`,after:o=>`after ${o}`,range:(o,t)=>`${o}\u2013${t}`,today:"Today",editor:{tabSettings:"Settings",tabActivities:"Activities",addPerson:"Add person",removePerson:"Remove person",personNamePlaceholder:"New person",title:"Title",layout:"Layout",layoutBlocks:"Blocks",layoutGrid:"Grid",days:"Days",language:"Language",languageAuto:"Automatic",languageEnglish:"English",languageBulgarian:"Bulgarian",highlightToday:"Highlight today",headerColor:"Header colour",name:"Name",emoji:"Emoji",color:"Colour",daysOverride:"Days for this person",daysOverrideHint:"Leave empty to use the card's days",slots:"Time slots",addSlot:"Add slot",slotColumn:"Slot",addBlock:"Add block",addBlockNeedsActivity:"Add an activity first",activity:"Activity",start:"Start",end:"End",slot:"Slot",slotNone:"Not on the grid",moveUp:"Move up",moveDown:"Move down",moveToDay:"Move to another day",remove:"Remove",dragHint:"Drag an activity onto a day, or tap it and then tap a day",label:"Label",newActivityLabel:"New activity name",addActivity:"Add activity",activityInUse:(o,t)=>`\u201C${o}\u201D is used by ${t} block${t===1?"":"s"}.`,confirmRemoveActivity:"Remove it anyway?",noSlots:"Add time slots to use the grid layout.",noBlocks:"Nothing scheduled",orphanActivity:"Unknown activity"}};function w(o,t){return o.language==="en"||o.language==="bg"?o.language:(t?.language??"en").toLowerCase().startsWith("bg")?"bg":"en"}function ft(o){return o==="bg"?Mt:Nt}var gt="custom:weekly-timetable-card",vt=["mon","tue","wed","thu","fri"],bt="#1e3a5f",vo="#888888";function yt(o){if(typeof o=="number"&&Number.isFinite(o)&&o>=0){let e=Math.floor(o/60),r=o%60;return`${String(e).padStart(2,"0")}:${String(r).padStart(2,"0")}`}if(typeof o!="string")return;let t=o.trim();return t.length>0?t:void 0}function $t(o){let t=o??{};if(!Array.isArray(t.people)||t.people.length===0)throw new Error("weekly-timetable-card: `people` must be a non-empty list");if(t.activities!==void 0&&!Array.isArray(t.activities))throw new Error("weekly-timetable-card: `activities` must be a list");let e=Ot(t.days,vt),r=(Array.isArray(t.activities)?t.activities:[]).map(bo).filter(i=>i!==null),n=t.people.map(i=>$o(i,e));return{type:typeof t.type=="string"?t.type:gt,title:typeof t.title=="string"?t.title:void 0,layout:t.layout==="grid"?"grid":"blocks",days:e,language:t.language==="en"||t.language==="bg"?t.language:"auto",highlight_today:t.highlight_today!==!1,header_color:typeof t.header_color=="string"&&t.header_color.trim().length>0?t.header_color.trim():bt,activities:r,people:n}}function bo(o){let t=o??{},e=typeof t.id=="string"?t.id.trim():"";if(e.length===0)return null;let r=typeof t.label=="string"&&t.label.trim().length>0?t.label.trim():e,n=typeof t.color=="string"&&t.color.trim().length>0?t.color.trim():vo;return{id:e,label:r,color:n}}function $o(o,t){let e=o??{},r=Array.isArray(e.days)?Ot(e.days,t):void 0,n=r??t,i=e.schedule??{},s={},a=new Set(n);for(let u of Object.keys(i))L(u)&&a.add(u);for(let u of R){if(!a.has(u))continue;let d=i[u];s[u]=Array.isArray(d)?d.map(_o).filter(f=>f!==null):[]}let l=Array.isArray(e.slots)?e.slots.map((u,d)=>xo(u,d)).filter(u=>u!==null):void 0,c={name:typeof e.name=="string"?e.name:"",schedule:s};return typeof e.emoji=="string"&&e.emoji.length>0&&(c.emoji=e.emoji),typeof e.color=="string"&&e.color.trim().length>0&&(c.color=e.color.trim()),r&&(c.days=r),l&&(c.slots=l),c}function _o(o){let t=o??{};if(typeof t.activity!="string"||t.activity.trim().length===0)return null;let e={activity:t.activity.trim()},r=yt(t.start),n=yt(t.end);return r&&(e.start=r),n&&(e.end=n),e}function xo(o,t){let e=o??{},r=yt(e.start),n=yt(e.end);return!r||!n?null:{slot:typeof e.slot=="number"&&Number.isFinite(e.slot)?e.slot:t+1,start:r,end:n}}var Ao={en:[{id:"english",label:"English",color:"#3b82f6"},{id:"daycare",label:"After-school club",color:"#64748b"},{id:"break",label:"Break and a snack",color:"#94a3b8"},{id:"judo",label:"Judo",color:"#f97316"},{id:"chess",label:"Chess",color:"#a855f7"},{id:"home",label:"Back home",color:"#22c55e"}],bg:[{id:"english",label:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",color:"#3b82f6"},{id:"daycare",label:"\u0417\u0430\u043D\u0438\u043C\u0430\u043B\u043D\u044F",color:"#64748b"},{id:"break",label:"\u041F\u043E\u0447\u0438\u0432\u043A\u0430 \u0438 \u0445\u0430\u043F\u0432\u0430\u043D\u0435",color:"#94a3b8"},{id:"judo",label:"\u0414\u0436\u0443\u0434\u043E",color:"#f97316"},{id:"chess",label:"\u0428\u0430\u0445",color:"#a855f7"},{id:"home",label:"\u0412\u0440\u044A\u0449\u0430\u043D\u0435 \u0432\u043A\u044A\u0449\u0438",color:"#22c55e"}]},Co={en:"Sami",bg:"Sami"};function be(o){let t=w({language:"auto"},o),e=r=>[{activity:"english",start:"15:20",end:"16:20"},{activity:"break",start:"16:20",end:"17:30"},{activity:r,start:"17:30",end:"18:30"},{activity:"home",start:"18:30"}];return{type:gt,title:void 0,layout:"blocks",days:[...vt],language:"auto",highlight_today:!0,header_color:bt,activities:Ao[t].map(r=>({...r})),people:[{name:Co[t],emoji:"\u{1F94B}",color:"#f472b6",schedule:{mon:e("judo"),tue:[{activity:"daycare",end:"16:00"}],wed:e("judo"),thu:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}],fri:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}]}}]}}function Ut(o,t){if(t<=0||o<=0)return"stacked";let e=o/t;return e>=110?"full":e>=72?"compact":"stacked"}var $e=z`
  .block {
    border-radius: 8px;
    padding: 8px 10px;
    text-align: center;
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

  .block-time {
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
  }

  .block-label {
    font-size: 13px;
    line-height: 1.3;
    font-weight: 600;
    color: var(--primary-text-color);
  }
`,_e=z`
  ${$e}

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

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
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
    border-color: var(--wtc-accent, var(--primary-color));
    background: color-mix(
      in srgb,
      var(--wtc-accent, var(--primary-color)) 14%,
      var(--card-background-color, #ffffff)
    );
    font-weight: 600;
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
    padding: 6px;
  }
  [data-density="compact"] .block-time {
    font-size: 10px;
  }
  [data-density="compact"] .block-label {
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
`,xe=z`
  ${$e}

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

  .day-group.drop-target {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color, #ffffff));
  }

  .block-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .drag-handle {
    cursor: grab;
    touch-action: none;
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
    touch-action: none;
  }

  .palette-chip[aria-pressed="true"] {
    outline: 2px solid var(--primary-color);
  }
`;var ko=/[^\p{L}\p{N}]+/gu,wo=/^-+|-+$/g;function So(o){return o.toLowerCase().replace(ko,"-").replace(wo,"")}function Ae(o,t){let e=So(o)||"activity";if(!t.includes(e))return e;let r=2;for(;t.includes(`${e}-${r}`);)r+=1;return`${e}-${r}`}function Ce(o,t){return o.find(e=>e.id===t)}var we=/^(\d{1,2}):(\d{2})$/;function ke(o){try{return new Intl.DateTimeFormat(o,{hour:"numeric"}).formatToParts(new Date(2020,0,1,13,0)).some(e=>e.type==="dayPeriod")}catch{return!1}}var Eo={en:"en-GB",bg:"bg"};function Kt(o,t){return o?.language??Eo[t]}function Po(o,t){let e=o?.locale?.time_format;if(e==="12")return!0;if(e==="24")return!1;if(e==="system"){let r=typeof navigator>"u"?void 0:navigator.language;return ke(r??Kt(o,t))}return ke(Kt(o,t))}function Q(o,t,e){let r=o.trim(),n=we.exec(r);if(!n)return r;let i=Number(n[1]),s=Number(n[2]);if(i>23||s>59)return r;if(!Po(t,e))return`${String(i).padStart(2,"0")}:${n[2]}`;try{return new Intl.DateTimeFormat(Kt(t,e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(new Date(2020,0,1,i,s))}catch{return r}}var jt=24*60;function Se(o,t){let e=we.exec(o.trim());if(!e)return o;let n=((Number(e[1])*60+Number(e[2])+t)%jt+jt)%jt,i=Math.floor(n/60);return`${String(i).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`}var Do="08:00",To=45;function It(o,t,e){return Math.min(Math.max(o,t),e)}function $(o,t,e){return{...o,people:o.people.map((r,n)=>n===t?e:r)}}function B(o,t){return o.schedule[t]??[]}function tt(o,t,e){return{...o,schedule:{...o.schedule,[t]:e}}}function H(o,t){return{...o,...t}}function Ee(o,t){return{...o,people:[...o.people,{name:t,schedule:{}}]}}function Pe(o,t){return o.people.length<=1||!o.people[t]?o:{...o,people:o.people.filter((e,r)=>r!==t)}}function O(o,t,e){let r=o.people[t];if(!r)return o;let n={...r,schedule:{...r.schedule}};if(e.name!==void 0&&(n.name=e.name),e.emoji!==void 0&&(e.emoji===null||e.emoji===""?delete n.emoji:n.emoji=e.emoji),e.color!==void 0&&(e.color===null||e.color===""?delete n.color:n.color=e.color),e.slots!==void 0&&(e.slots===null?delete n.slots:n.slots=e.slots.map(i=>({...i}))),e.days!==void 0){e.days===null||e.days.length===0?delete n.days:n.days=[...e.days];for(let i of n.days??o.days)n.schedule[i]||(n.schedule[i]=[])}return $(o,t,n)}function Ft(o,t,e,r){let n=o.people[t];return n?$(o,t,tt(n,e,[...B(n,e),{...r}])):o}function K(o,t,e,r,n){let i=o.people[t],s=i?.schedule[e]?.[r];if(!i||!s)return o;let a={...s};n.activity!==void 0&&(a.activity=n.activity),n.start!==void 0&&(n.start===null||n.start===""?delete a.start:a.start=n.start),n.end!==void 0&&(n.end===null||n.end===""?delete a.end:a.end=n.end);let l=B(i,e).map((c,u)=>u===r?a:c);return $(o,t,tt(i,e,l))}function De(o,t,e,r){let n=o.people[t];if(!n||!n.schedule[e]?.[r])return o;let i=B(n,e).filter((s,a)=>a!==r);return $(o,t,tt(n,e,i))}function Te(o,t,e,r,n){let i=o.people[t];if(!i)return o;let s=[...B(i,e)];return s.splice(It(r,0,s.length),0,{...n}),$(o,t,tt(i,e,s))}function et(o,t,e,r){let n=o.people[t];if(!n)return o;let i=[...B(n,e.day)],s=i[e.index];if(!s)return o;if(i.splice(e.index,1),e.day===r.day)return i.splice(It(r.index,0,i.length),0,s),$(o,t,tt(n,e.day,i));let a=[...B(n,r.day)];return a.splice(It(r.index,0,a.length),0,s),$(o,t,{...n,schedule:{...n.schedule,[e.day]:i,[r.day]:a}})}function zt(o,t,e,r,n){let i=o.people[t];if(!i)return o;let s=r+n;return s<0||s>=B(i,e).length?o:et(o,t,{day:e,index:r},{day:e,index:s})}function Re(o,t,e){let r=Ae(t,o.activities.map(n=>n.id));return{...o,activities:[...o.activities,{id:r,label:t,color:e}]}}function Vt(o,t,e){return o.activities[t]?{...o,activities:o.activities.map((r,n)=>n===t?{...r,...e}:r)}:o}function Le(o,t){return o.activities[t]?{...o,activities:o.activities.filter((e,r)=>r!==t)}:o}function Be(o,t){let e=0;for(let r of o.people)for(let n of Object.values(r.schedule))for(let i of n??[])i.activity===t&&(e+=1);return e}function He(o,t){let e=o.people[t];if(!e)return o;let r=e.slots??[],i=r[r.length-1]?.end??Do,s=r.reduce((a,l)=>Math.max(a,l.slot),0)+1;return $(o,t,{...e,slots:[...r,{slot:s,start:i,end:Se(i,To)}]})}function Yt(o,t,e,r){let n=o.people[t];return n?.slots?.[e]?$(o,t,{...n,slots:n.slots.map((i,s)=>s===e?{...i,...r}:i)}):o}function Oe(o,t,e){let r=o.people[t];return r?.slots?.[e]?$(o,t,{...r,slots:r.slots.filter((n,i)=>i!==e)}):o}function m(o){return o.target.value}function _t(o){return o.target.checked}var Me="#64748b";function Ne(o){let{config:t,strings:e,commit:r}=o,n=(i,s)=>{let a=Be(t,s.id);if(a>0){let l=`${e.editor.activityInUse(s.label,a)} ${e.editor.confirmRemoveActivity}`;if(!window.confirm(l))return}r(Le(t,i))};return p`
    <div class="panel">
      ${t.activities.map((i,s)=>p`
          <div class="row" data-activity=${i.id}>
            <input
              type="color"
              data-field="color"
              .value=${j(i.color,Me)}
              @change=${a=>r(Vt(t,s,{color:m(a)}))}
            />
            <input
              class="grow"
              type="text"
              data-field="label"
              .value=${i.label}
              @change=${a=>r(Vt(t,s,{label:m(a)}))}
            />
            <button
              class="icon-button"
              type="button"
              data-action="remove-activity"
              title=${e.editor.remove}
              @click=${()=>n(s,i)}
            >
              ×
            </button>
          </div>
        `)}

      <div class="row">
        <input
          class="grow"
          type="text"
          data-field="new-label"
          placeholder=${e.editor.newActivityLabel}
        />
        <button
          class="icon-button"
          type="button"
          data-action="add-activity"
          title=${e.editor.addActivity}
          @click=${i=>{let a=i.currentTarget.parentElement.querySelector('[data-field="new-label"]'),l=a.value.trim();l.length!==0&&(a.value="",r(Re(t,l,Me)))}}
        >
          +
        </button>
      </div>

      <div class="palette">
        ${t.activities.map(i=>p`
            <div
              class="block"
              style=${v({"--wtc-block-fill":pt(i.color),"--wtc-block-border":ut(i.color)})}
            >
              <div class="block-label">${i.label}</div>
            </div>
          `)}
      </div>
    </div>
  `}var Ro=5,Ue=56,Lo=14,Bo=16;function Ho(o){let t=o;for(;t;){let e=getComputedStyle(t).overflowY;if((e==="auto"||e==="scroll"||e==="overlay")&&t.scrollHeight>t.clientHeight+1)return t;if(t.parentElement){t=t.parentElement;continue}let r=t.getRootNode();t=r instanceof ShadowRoot?r.host:null}return document.scrollingElement}function Oo(o){let t=o&&o.nodeType!==Node.ELEMENT_NODE?o.parentElement:o,e=t?.closest("[data-drag-block]");if(e){let i=e.dataset.dragDay,s=Number(e.dataset.dragBlock);return L(i)&&Number.isInteger(s)&&s>=0?{kind:"block",day:i,index:s}:null}let n=t?.closest("[data-palette-activity]")?.dataset.paletteActivity;return n?{kind:"activity",activityId:n}:null}function Mo(o,t){for(let e=0;e<o.length;e+=1){let r=o[e];if(t<(r.top+r.bottom)/2)return e}return o.length}function No(o,t,e){return o.kind!=="block"||o.day!==t?e:e>o.index?e-1:e}var xt=class{constructor(t,e){this.getRoot=t;this.callbacks=e;this._source=null;this._origin={x:0,y:0};this._active=!1;this._hoverDay=null;this._scroller=null;this._scrollTimer=null;this._scrollDirection=0;this.onPointerDown=t=>{if(!t.isPrimary||t.button!==0)return;let e=Oo(t.target);e&&(this._source=e,this._origin={x:t.clientX,y:t.clientY},this._active=!1,this._scroller=Ho(t.target),window.addEventListener("pointermove",this._onPointerMove),window.addEventListener("pointerup",this._onPointerUp),window.addEventListener("pointercancel",this._onPointerCancel))};this._onPointerMove=t=>{if(!this._source)return;if(!this._active){let r=t.clientX-this._origin.x,n=t.clientY-this._origin.y;if(Math.hypot(r,n)<Ro)return;this._active=!0}t.preventDefault(),this._updateAutoScroll(t.clientY);let e=this._dayUnder(t.clientX,t.clientY);e!==this._hoverDay&&(this._hoverDay=e,this.callbacks.requestUpdate())};this._onPointerUp=t=>{let e=this._source,r=this._active;if(this._teardown(),!e||!r)return;let n=this._groupUnder(t.clientX,t.clientY),i=n?.dataset.day;if(!n||!L(i))return;let s=[...n.querySelectorAll("[data-block-index]")].map(l=>{let c=l.getBoundingClientRect();return{top:c.top,bottom:c.bottom}}),a=No(e,i,Mo(s,t.clientY));if(e.kind==="block"){this.callbacks.moveBlock({day:e.day,index:e.index},{day:i,index:a});return}this.callbacks.insertActivity(e.activityId,{day:i,index:a})};this._onPointerCancel=()=>{this._teardown()}}get active(){return this._active}get hoverDay(){return this._hoverDay}cancel(){this._teardown()}_updateAutoScroll(t){let e=this._scroller;if(!e)return;let r=e===document.scrollingElement,n=r?0:e.getBoundingClientRect().top,i=r?window.innerHeight:e.getBoundingClientRect().bottom,s=0;t<n+Ue?s=-1:t>i-Ue&&(s=1),s!==this._scrollDirection&&(this._scrollDirection=s,this._stopAutoScroll(),s!==0&&(this._scrollTimer=setInterval(()=>{e.scrollTop+=s*Lo},Bo)))}_stopAutoScroll(){this._scrollTimer!==null&&(clearInterval(this._scrollTimer),this._scrollTimer=null)}_teardown(){this._stopAutoScroll(),this._scrollDirection=0,this._scroller=null,window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),window.removeEventListener("pointercancel",this._onPointerCancel);let t=this._active||this._hoverDay!==null;this._source=null,this._active=!1,this._hoverDay=null,t&&this.callbacks.requestUpdate()}_groupUnder(t,e){return(this.getRoot()?.elementFromPoint?.(t,e)??(typeof document.elementFromPoint=="function"?document.elementFromPoint(t,e):null))?.closest("[data-day]")??null}_dayUnder(t,e){let r=this._groupUnder(t,e)?.dataset.day;return L(r)?r:null}};function je(o,t,e){o.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}function I(o){let t=!!o.start,e=!!o.end;return t&&e?"range":e?"until":t?"after":"bare"}function qt(o,t){let e=r=>Q(r,o.hass,o.lang);switch(I(t)){case"range":return o.strings.range(e(t.start),e(t.end));case"until":return o.strings.until(e(t.end));case"after":return o.strings.after(e(t.start));case"bare":return""}}function ot(o,t){let e=Ce(o.config.activities,t.activity),r=qt(o,t),n=e?{"--wtc-block-fill":pt(e.color),"--wtc-block-border":ut(e.color)}:{};return p`
    <div
      class=${e?"block":"block orphan"}
      style=${v(n)}
      title=${e?h:o.strings.editor.orphanActivity}
    >
      ${r?p`<div class="block-time">${r}</div>`:h}
      <div class="block-label">${e?e.label:t.activity}</div>
    </div>
  `}function Uo(o){return{strings:o.strings,hass:o.hass,lang:w(o.config,o.hass)}}var Ke="#f472b6";function Ie(o,t){let{config:e,strings:r,commit:n}=o,{personIndex:i}=t,s=e.people[i];if(!s)return p``;let a=ht(o.hass),l=Z(e,s);return p`
    <div class="panel">
      <div class="row">
        <input
          type="text"
          class="grow"
          data-field="name"
          .value=${s.name}
          placeholder=${r.editor.personNamePlaceholder}
          @change=${c=>n(O(e,i,{name:m(c)}))}
        />
        <input
          type="text"
          data-field="emoji"
          style="width: 3.5rem"
          .value=${s.emoji??""}
          placeholder=${r.editor.emoji}
          @change=${c=>n(O(e,i,{emoji:m(c)||null}))}
        />
        <input
          type="color"
          data-field="person-color"
          .value=${j(s.color??Ke,Ke)}
          @change=${c=>n(O(e,i,{color:m(c)}))}
        />
        <button
          class="icon-button"
          type="button"
          data-action="clear-person-color"
          title=${r.editor.color}
          @click=${()=>n(O(e,i,{color:null}))}
        >
          ⌫
        </button>
        <button
          class="icon-button"
          type="button"
          data-action="remove-person"
          title=${r.editor.removePerson}
          ?disabled=${e.people.length<=1}
          @click=${()=>n(Pe(e,i))}
        >
          ×
        </button>
      </div>

      <label class="field inline">
        <input
          type="checkbox"
          data-field="own-days"
          .checked=${s.days!==void 0}
          @change=${c=>n(O(e,i,{days:_t(c)?[...e.days]:null}))}
        />
        <span>${r.editor.daysOverride}</span>
      </label>
      ${s.days===void 0?p`<div class="hint">${r.editor.daysOverrideHint}</div>`:p`
            <div class="chips">
              ${a.map(c=>p`
                  <button
                    type="button"
                    class="chip"
                    data-person-day=${c}
                    aria-pressed=${s.days.includes(c)?"true":"false"}
                    @click=${()=>n(O(e,i,{days:mt(s.days,c,a)}))}
                  >
                    ${r.days[c].short}
                  </button>
                `)}
            </div>
          `}

      ${e.layout==="grid"?jo(o,i,s):h}

      <div class="palette">
        ${e.activities.map(c=>p`
            <button
              type="button"
              class="palette-chip"
              data-palette-activity=${c.id}
              aria-pressed=${t.selectedActivity===c.id?"true":"false"}
              @click=${()=>t.onSelectActivity(t.selectedActivity===c.id?null:c.id)}
            >
              ${c.label}
            </button>
          `)}
      </div>
      <div class="hint">${r.editor.dragHint}</div>

      ${l.map(c=>Ko(o,t,s,c))}
    </div>
  `}function jo(o,t,e){let{config:r,strings:n,commit:i}=o,s=e.slots??[];return p`
    <div class="day-group" data-section="slots">
      <h4>${n.editor.slots}</h4>
      <div class="block-rows">
        ${s.map((a,l)=>p`
            <div class="row" data-slot-index=${l}>
              <span class="hint" style="width: 2rem">${a.slot}</span>
              <input
                type="time"
                data-field="slot-start"
                .value=${a.start}
                @change=${c=>i(Yt(r,t,l,{start:m(c)}))}
              />
              <input
                type="time"
                data-field="slot-end"
                .value=${a.end}
                @change=${c=>i(Yt(r,t,l,{end:m(c)}))}
              />
              <button
                class="icon-button"
                type="button"
                data-action="remove-slot"
                title=${n.editor.remove}
                @click=${()=>i(Oe(r,t,l))}
              >
                ×
              </button>
            </div>
          `)}
        <button
          class="chip"
          type="button"
          data-action="add-slot"
          @click=${()=>i(He(r,t))}
        >
          ＋ ${n.editor.addSlot}
        </button>
      </div>
    </div>
  `}function Ko(o,t,e,r){let{config:n,strings:i,commit:s}=o,{personIndex:a}=t,l=e.schedule[r]??[],c=n.activities[0]?.id;return p`
    <div
      class=${t.hoverDay===r?"day-group drop-target":"day-group"}
      data-day=${r}
      @click=${()=>{t.selectedActivity&&(s(Ft(n,a,r,{activity:t.selectedActivity})),t.onSelectActivity(null))}}
    >
      <h4>${i.days[r].full}</h4>
      <div class="block-rows">
        ${l.map((u,d)=>Io(o,t,r,u,d,l.length))}
        ${c?p`
              <button
                class="chip"
                type="button"
                data-action="add-block"
                @click=${u=>{u.stopPropagation(),s(Ft(n,a,r,{activity:c}))}}
              >
                ＋ ${i.editor.addBlock}
              </button>
            `:p`
              <button class="chip" type="button" data-action="add-block" disabled>
                ＋ ${i.editor.addBlock}
              </button>
              <div class="hint">${i.editor.addBlockNeedsActivity}</div>
            `}
      </div>
    </div>
  `}function Io(o,t,e,r,n,i){let{config:s,strings:a,commit:l}=o,{personIndex:c}=t,u=s.people[c];return p`
    <div class="row" data-block-index=${n} @click=${d=>d.stopPropagation()}>
      <span class="drag-handle" data-drag-block=${n} data-drag-day=${e}>⠿</span>
      <select
        class="grow"
        data-field="activity"
        @change=${d=>l(K(s,c,e,n,{activity:m(d)}))}
      >
        ${s.activities.map(d=>p`
            <option value=${d.id} .selected=${d.id===r.activity}>
              ${d.label}
            </option>
          `)}
        ${s.activities.some(d=>d.id===r.activity)?h:p`<option value=${r.activity} .selected=${!0}>${r.activity}</option>`}
      </select>

      <select
        data-field="day"
        title=${a.editor.moveToDay}
        @change=${d=>{let f=m(d);if(f===e)return;let y=(u.schedule[f]??[]).length;l(et(s,c,{day:e,index:n},{day:f,index:y}))}}
      >
        ${Z(s,u).map(d=>p`
            <option value=${d} .selected=${d===e}>
              ${a.days[d].short}
            </option>
          `)}
      </select>

      ${s.layout==="grid"?Fo(o,c,e,r,n,u.slots??[]):p`
            <input
              type="time"
              data-field="start"
              .value=${r.start??""}
              @change=${d=>l(K(s,c,e,n,{start:m(d)||null}))}
            />
            <input
              type="time"
              data-field="end"
              .value=${r.end??""}
              @change=${d=>l(K(s,c,e,n,{end:m(d)||null}))}
            />
          `}

      <button
        class="icon-button"
        type="button"
        data-action="move-up"
        title=${a.editor.moveUp}
        ?disabled=${n===0}
        @click=${()=>l(zt(s,c,e,n,-1))}
      >
        ↑
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="move-down"
        title=${a.editor.moveDown}
        ?disabled=${n>=i-1}
        @click=${()=>l(zt(s,c,e,n,1))}
      >
        ↓
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="remove-block"
        title=${a.editor.remove}
        @click=${()=>l(De(s,c,e,n))}
      >
        ×
      </button>
    </div>
  `}function Fo(o,t,e,r,n,i){let{config:s,strings:a,commit:l}=o,c=I(r)==="range"?i.find(d=>d.start===r.start&&d.end===r.end):void 0,u=c===void 0&&(r.start!==void 0||r.end!==void 0);return p`
    <select
      data-field="slot"
      @change=${d=>{let f=m(d);if(f===""){l(K(s,t,e,n,{start:null,end:null}));return}let y=i.find(M=>String(M.slot)===f);y&&l(K(s,t,e,n,{start:y.start,end:y.end}))}}
    >
      <option value="" .selected=${c===void 0}>${a.editor.slotNone}</option>
      ${i.map(d=>p`
          <option value=${String(d.slot)} .selected=${c?.slot===d.slot}>
            ${d.slot}. ${d.start}–${d.end}
          </option>
        `)}
    </select>
    ${u?p`<span class="hint">${qt(Uo(o),r)}</span>`:h}
  `}function Fe(o){let{config:t,strings:e,commit:r}=o,n=ht(o.hass);return p`
    <div class="panel">
      <label class="field">
        <span>${e.editor.title}</span>
        <input
          type="text"
          data-field="title"
          .value=${t.title??""}
          @change=${i=>r(H(t,{title:m(i)||void 0}))}
        />
      </label>

      <label class="field">
        <span>${e.editor.layout}</span>
        <select
          data-field="layout"
          @change=${i=>r(H(t,{layout:m(i)}))}
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
          ${n.map(i=>p`
              <button
                type="button"
                class="chip"
                data-day=${i}
                aria-pressed=${t.days.includes(i)?"true":"false"}
                @click=${()=>r(H(t,{days:mt(t.days,i,n)}))}
              >
                ${e.days[i].short}
              </button>
            `)}
        </div>
      </div>

      <label class="field">
        <span>${e.editor.language}</span>
        <select
          data-field="language"
          @change=${i=>r(H(t,{language:m(i)}))}
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
          @change=${i=>r(H(t,{highlight_today:_t(i)}))}
        />
        <span>${e.editor.highlightToday}</span>
      </label>

      <label class="field inline">
        <input
          type="color"
          data-field="header_color"
          .value=${j(t.header_color,bt)}
          @change=${i=>r(H(t,{header_color:m(i)}))}
        />
        <span>${e.editor.headerColor}</span>
      </label>
    </div>
  `}var A=class extends b{constructor(){super(...arguments);this._tab="settings";this._selectedActivity=null;this._dnd=new xt(()=>this.shadowRoot,{moveBlock:(e,r)=>{let n=this._config;!n||typeof this._tab!="object"||this._commit(et(n,this._tab.person,e,r))},insertActivity:(e,r)=>{let n=this._config;!n||typeof this._tab!="object"||this._commit(Te(n,this._tab.person,r.day,r.index,{activity:e}))},requestUpdate:()=>this.requestUpdate()})}setConfig(e){this._config=$t(e),typeof this._tab=="object"&&!this._config.people[this._tab.person]&&(this._tab="settings")}_commit(e){let r=this._config;this._config=e,typeof this._tab=="object"&&(!e.people[this._tab.person]||r!==void 0&&e.people.length<r.people.length)&&(this._tab="settings",this._selectedActivity=null),je(this,"config-changed",{config:e})}disconnectedCallback(){this._dnd.cancel(),super.disconnectedCallback()}render(){let e=this._config;if(!e)return h;let r=ft(w(e,this.hass)),n={config:e,strings:r,hass:this.hass,commit:i=>this._commit(i)};return p`
      <div class="tabs" role="tablist">
        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="settings"
          aria-selected=${this._tab==="settings"?"true":"false"}
          @click=${()=>{this._tab="settings"}}
        >
          ${r.editor.tabSettings}
        </button>

        ${e.people.map((i,s)=>p`
            <button
              class="tab"
              type="button"
              role="tab"
              data-tab="person"
              data-person-index=${s}
              aria-selected=${typeof this._tab=="object"&&this._tab.person===s?"true":"false"}
              @click=${()=>{this._tab={person:s}}}
            >
              ${i.emoji?`${i.emoji} `:""}${i.name||r.editor.personNamePlaceholder}
            </button>
          `)}

        <button
          class="tab"
          type="button"
          data-tab="add"
          title=${r.editor.addPerson}
          @click=${()=>{let i=Ee(e,"");this._tab={person:i.people.length-1},this._commit(i)}}
        >
          ＋
        </button>

        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="activities"
          aria-selected=${this._tab==="activities"?"true":"false"}
          @click=${()=>{this._tab="activities"}}
        >
          ${r.editor.tabActivities}
        </button>
      </div>

      <div @pointerdown=${this._dnd.onPointerDown}>${this._renderPanel(n)}</div>
    `}_renderPanel(e){return this._tab==="settings"?Fe(e):this._tab==="activities"?Ne(e):Ie(e,{personIndex:this._tab.person,selectedActivity:this._selectedActivity,onSelectActivity:r=>{this._selectedActivity=r},hoverDay:this._dnd.hoverDay})}};A.styles=xe,g([D({attribute:!1})],A.prototype,"hass",2),g([T()],A.prototype,"_config",2),g([T()],A.prototype,"_tab",2),g([T()],A.prototype,"_selectedActivity",2),A=g([lt("weekly-timetable-card-editor")],A);function Gt(o,t){let e=o.strings.days[t];return o.density==="compact"?e.short:e.full}function ze(o){return p`
    <div class="week" style=${v({"--wtc-day-count":String(o.days.length)})}>
      ${o.days.map(t=>zo(o,t))}
    </div>
  `}function zo(o,t){let e=o.person.schedule[t]??[];return p`
    <section class=${o.today===t?"day today":"day"}>
      <header class="day-head">${Gt(o,t)}</header>
      <div class="day-body">
        ${e.length>0?e.map(r=>ot(o,r)):p`<div class="empty">${o.strings.editor.noBlocks}</div>`}
      </div>
    </section>
  `}function Ve(o){let{config:t,hass:e,density:r,now:n}=o,i=Math.min(Math.max(o.personIndex,0),t.people.length-1),s=t.people[i],a=w(t,e);return{config:t,person:s,days:Z(t,s),strings:ft(a),lang:a,hass:e,density:r,today:t.highlight_today?ve(n):null}}function Ye(o,t){let e=new Map,r=[];for(let n of t){let i=I(n)==="range"?o.find(a=>a.start===n.start&&a.end===n.end):void 0;if(!i){r.push(n);continue}let s=e.get(i.slot);s?s.push(n):e.set(i.slot,[n])}return{bySlot:e,loose:r}}function qe(o){let t=[...o.person.slots??[]].sort((s,a)=>s.slot-a.slot),e=new Map;for(let s of o.days)e.set(s,Ye(t,o.person.schedule[s]??[]));let r=o.days.some(s=>e.get(s).loose.length>0),n=v({"--wtc-day-count":String(o.days.length)}),i=o.days.map(s=>p`<div class=${o.today===s?"grid-head today":"grid-head"}>${Gt(o,s)}</div>`);return p`
    <div class="grid-wrap" style=${n}>
      ${t.length===0?p`
            <div class="grid-heads">
              <div class="grid-corner"></div>
              ${i}
            </div>
          `:h}
      ${r?p`
            <div class="strip">
              <div class="strip-label"></div>
              ${o.days.map(s=>p`
                  <div class="strip-cell">
                    ${e.get(s).loose.map(a=>ot(o,a))}
                  </div>
                `)}
            </div>
          `:h}
      ${t.length===0?p`<div class="no-slots">${o.strings.editor.noSlots}</div>`:p`
            <div class="grid">
              <div class="grid-corner"></div>
              ${i}
              ${t.flatMap(s=>[p`
                  <div class="slot-label">
                    ${o.strings.range(Q(s.start,o.hass,o.lang),Q(s.end,o.hass,o.lang))}
                  </div>
                `,...o.days.map(a=>p`
                    <div class=${o.today===a?"grid-cell today":"grid-cell"}>
                      ${(e.get(a).bySlot.get(s.slot)??[]).map(l=>ot(o,l))}
                    </div>
                  `)])}
            </div>
          `}
    </div>
  `}var Ge="0.0.2";var C=class extends b{constructor(){super(...arguments);this.density="full";this._personIndex=0;this._measuredWidth=0}static getConfigElement(){return document.createElement("weekly-timetable-card-editor")}static getStubConfig(e){return be(e)}static getLayoutOptions(){return{grid_columns:"full",grid_rows:"auto"}}setConfig(e){this._config=$t(e),this._personIndex=Math.min(this._personIndex,this._config.people.length-1)}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),!(typeof ResizeObserver>"u")&&(this._observer=new ResizeObserver(e=>{let r=e[0]?.contentRect.width??0;this._measuredWidth=r;let n=Ut(r,this._dayCount());n!==this.density&&(this.density=n)}),this._observer.observe(this))}disconnectedCallback(){this._observer?.disconnect(),this._observer=void 0,super.disconnectedCallback()}willUpdate(e){if(super.willUpdate(e),this._measuredWidth<=0)return;let r=Ut(this._measuredWidth,this._dayCount());r!==this.density&&(this.density=r)}_dayCount(){let e=this._config;return e?(e.people[Math.min(this._personIndex,e.people.length-1)]?.days??e.days).length:vt.length}render(){let e=this._config;if(!e)return h;let r=Ve({config:e,personIndex:this._personIndex,hass:this.hass,density:this.density}),n=this.density==="stacked"||e.layout==="blocks"?ze(r):qe(r),i=v({"--wtc-header-color":e.header_color,"--wtc-header-text":ge(e.header_color),"--wtc-accent":r.person.color??"var(--primary-color)"});return p`
      <ha-card style=${i}>
        ${e.title?p`<h1 class="card-title">${e.title}</h1>`:h}
        ${e.people.length>1?this._renderTabs(e):h}
        <div class="body" data-density=${this.density}>${n}</div>
      </ha-card>
    `}_renderTabs(e){return p`
      <div class="tabs" role="tablist">
        ${e.people.map((r,n)=>p`
            <button
              class="tab"
              role="tab"
              type="button"
              aria-selected=${n===this._personIndex?"true":"false"}
              style=${v({"--wtc-accent":r.color??"var(--primary-color)"})}
              @click=${()=>{this._personIndex=n}}
            >
              ${r.emoji?p`<span>${r.emoji}</span>`:h}
              <span>${r.name}</span>
            </button>
          `)}
      </div>
    `}};C.styles=_e,g([D({attribute:!1})],C.prototype,"hass",2),g([D({attribute:!1})],C.prototype,"density",2),g([T()],C.prototype,"_config",2),g([T()],C.prototype,"_personIndex",2),C=g([lt("weekly-timetable-card")],C);console.info(`%c WEEKLY-TIMETABLE-CARD %c v${Ge} `,"color:#fff;background:#1e3a5f;padding:2px 4px;border-radius:3px 0 0 3px","color:#1e3a5f;background:#e2e8f0;padding:2px 4px;border-radius:0 3px 3px 0");window.customCards=window.customCards??[];window.customCards.push({type:gt.replace(/^custom:/,""),name:"Weekly Timetable Card",description:"Weekly timetable for one or more people, in English or Bulgarian",preview:!0,documentationURL:"https://github.com/vmlinuz82/weekly-timetable-card"});export{C as WeeklyTimetableCard};
