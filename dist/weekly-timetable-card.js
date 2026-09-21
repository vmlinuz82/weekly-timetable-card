var Ye=Object.defineProperty;var Ge=Object.getOwnPropertyDescriptor;var g=(o,t,e,r)=>{for(var n=r>1?void 0:r?Ge(t,e):t,i=o.length-1,s;i>=0;i--)(s=o[i])&&(n=(r?s(t,e,n):s(n))||n);return r&&n&&Ye(t,e,n),n};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var rt=globalThis,nt=rt.ShadowRoot&&(rt.ShadyCSS===void 0||rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,At=Symbol(),Yt=new WeakMap,I=class{constructor(t,e,r){if(this._$cssResult$=!0,r!==At)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(nt&&t===void 0){let r=e!==void 0&&e.length===1;r&&(t=Yt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),r&&Yt.set(e,t))}return t}toString(){return this.cssText}},Gt=o=>new I(typeof o=="string"?o:o+"",void 0,At),F=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((r,n,i)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+o[i+1],o[0]);return new I(e,o,At)},Wt=(o,t)=>{if(nt)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let r=document.createElement("style"),n=rt.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=e.cssText,o.appendChild(r)}},Ct=nt?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let r of t.cssRules)e+=r.cssText;return Gt(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:We,defineProperty:Xe,getOwnPropertyDescriptor:Je,getOwnPropertyNames:Ze,getOwnPropertySymbols:Qe,getPrototypeOf:to}=Object,it=globalThis,Xt=it.trustedTypes,eo=Xt?Xt.emptyScript:"",oo=it.reactiveElementPolyfillSupport,z=(o,t)=>o,q={toAttribute(o,t){switch(t){case Boolean:o=o?eo:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},st=(o,t)=>!We(o,t),Jt={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:st};Symbol.metadata??=Symbol("metadata"),it.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Jt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let r=Symbol(),n=this.getPropertyDescriptor(t,r,e);n!==void 0&&Xe(this.prototype,t,n)}}static getPropertyDescriptor(t,e,r){let{get:n,set:i}=Je(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:n,set(s){let a=n?.call(this);i?.call(this,s),this.requestUpdate(t,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Jt}static _$Ei(){if(this.hasOwnProperty(z("elementProperties")))return;let t=to(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(z("properties"))){let e=this.properties,r=[...Ze(e),...Qe(e)];for(let n of r)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[r,n]of e)this.elementProperties.set(r,n)}this._$Eh=new Map;for(let[e,r]of this.elementProperties){let n=this._$Eu(e,r);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let r=new Set(t.flat(1/0).reverse());for(let n of r)e.unshift(Ct(n))}else t!==void 0&&e.push(Ct(t));return e}static _$Eu(t,e){let r=e.attribute;return r===!1?void 0:typeof r=="string"?r:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let r of e.keys())this.hasOwnProperty(r)&&(t.set(r,this[r]),delete this[r]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Wt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,r){this._$AK(t,r)}_$ET(t,e){let r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){let i=(r.converter?.toAttribute!==void 0?r.converter:q).toAttribute(e,r.type);this._$Em=t,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(t,e){let r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let i=r.getPropertyOptions(n),s=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:q;this._$Em=n;let a=s.fromAttribute(e,i.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,r,n=!1,i){if(t!==void 0){let s=this.constructor;if(n===!1&&(i=this[t]),r??=s.getPropertyOptions(t),!((r.hasChanged??st)(i,e)||r.useDefault&&r.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,r))))return;this.C(t,e,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:r,reflect:n,wrapped:i},s){r&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),i!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||r||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[n,i]of r){let{wrapped:s}=i,a=this[n];s!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[z("elementProperties")]=new Map,x[z("finalized")]=new Map,oo?.({ReactiveElement:x}),(it.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Tt=globalThis,Zt=o=>o,at=Tt.trustedTypes,Qt=at?at.createPolicy("lit-html",{createHTML:o=>o}):void 0,ie="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,se="?"+k,ro=`<${se}>`,E=document,Y=()=>E.createComment(""),G=o=>o===null||typeof o!="object"&&typeof o!="function",Rt=Array.isArray,no=o=>Rt(o)||typeof o?.[Symbol.iterator]=="function",kt=`[ 	
\f\r]`,V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,te=/-->/g,ee=/>/g,w=RegExp(`>|${kt}(?:([^\\s"'>=/]+)(${kt}*=${kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),oe=/'/g,re=/"/g,ae=/^(?:script|style|textarea|title)$/i,Lt=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),p=Lt(1),qo=Lt(2),Vo=Lt(3),_=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),ne=new WeakMap,S=E.createTreeWalker(E,129);function le(o,t){if(!Rt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qt!==void 0?Qt.createHTML(t):t}var io=(o,t)=>{let e=o.length-1,r=[],n,i=t===2?"<svg>":t===3?"<math>":"",s=V;for(let a=0;a<e;a++){let l=o[a],c,u,d=-1,h=0;for(;h<l.length&&(s.lastIndex=h,u=s.exec(l),u!==null);)h=s.lastIndex,s===V?u[1]==="!--"?s=te:u[1]!==void 0?s=ee:u[2]!==void 0?(ae.test(u[2])&&(n=RegExp("</"+u[2],"g")),s=w):u[3]!==void 0&&(s=w):s===w?u[0]===">"?(s=n??V,d=-1):u[1]===void 0?d=-2:(d=s.lastIndex-u[2].length,c=u[1],s=u[3]===void 0?w:u[3]==='"'?re:oe):s===re||s===oe?s=w:s===te||s===ee?s=V:(s=w,n=void 0);let y=s===w&&o[a+1].startsWith("/>")?" ":"";i+=s===V?l+ro:d>=0?(r.push(c),l.slice(0,d)+ie+l.slice(d)+k+y):l+k+(d===-2?a:y)}return[le(o,i+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),r]},W=class o{constructor({strings:t,_$litType$:e},r){let n;this.parts=[];let i=0,s=0,a=t.length-1,l=this.parts,[c,u]=io(t,e);if(this.el=o.createElement(c,r),S.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=S.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(ie)){let h=u[s++],y=n.getAttribute(d).split(k),ot=/([.?@])?(.*)/.exec(h);l.push({type:1,index:i,name:ot[2],strings:y,ctor:ot[1]==="."?St:ot[1]==="?"?Et:ot[1]==="@"?Pt:O}),n.removeAttribute(d)}else d.startsWith(k)&&(l.push({type:6,index:i}),n.removeAttribute(d));if(ae.test(n.tagName)){let d=n.textContent.split(k),h=d.length-1;if(h>0){n.textContent=at?at.emptyScript:"";for(let y=0;y<h;y++)n.append(d[y],Y()),S.nextNode(),l.push({type:2,index:++i});n.append(d[h],Y())}}}else if(n.nodeType===8)if(n.data===se)l.push({type:2,index:i});else{let d=-1;for(;(d=n.data.indexOf(k,d+1))!==-1;)l.push({type:7,index:i}),d+=k.length-1}i++}}static createElement(t,e){let r=E.createElement("template");return r.innerHTML=t,r}};function H(o,t,e=o,r){if(t===_)return t;let n=r!==void 0?e._$Co?.[r]:e._$Cl,i=G(t)?void 0:t._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(o),n._$AT(o,e,r)),r!==void 0?(e._$Co??=[])[r]=n:e._$Cl=n),n!==void 0&&(t=H(o,n._$AS(o,t.values),n,r)),t}var wt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:r}=this._$AD,n=(t?.creationScope??E).importNode(e,!0);S.currentNode=n;let i=S.nextNode(),s=0,a=0,l=r[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new X(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new Dt(i,this,t)),this._$AV.push(c),l=r[++a]}s!==l?.index&&(i=S.nextNode(),s++)}return S.currentNode=E,n}p(t){let e=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(t,r,e),e+=r.strings.length-2):r._$AI(t[e])),e++}},X=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,r,n){this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=H(this,t,e),G(t)?t===f||t==null||t===""?(this._$AH!==f&&this._$AR(),this._$AH=f):t!==this._$AH&&t!==_&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):no(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==f&&G(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=W.createElement(le(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(e);else{let i=new wt(n,this),s=i.u(this.options);i.p(e),this.T(s),this._$AH=i}}_$AC(t){let e=ne.get(t.strings);return e===void 0&&ne.set(t.strings,e=new W(t)),e}k(t){Rt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,r,n=0;for(let i of t)n===e.length?e.push(r=new o(this.O(Y()),this.O(Y()),this,this.options)):r=e[n],r._$AI(i),n++;n<e.length&&(this._$AR(r&&r._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let r=Zt(t).nextSibling;Zt(t).remove(),t=r}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,r,n,i){this.type=1,this._$AH=f,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=f}_$AI(t,e=this,r,n){let i=this.strings,s=!1;if(i===void 0)t=H(this,t,e,0),s=!G(t)||t!==this._$AH&&t!==_,s&&(this._$AH=t);else{let a=t,l,c;for(t=i[0],l=0;l<i.length-1;l++)c=H(this,a[r+l],e,l),c===_&&(c=this._$AH[l]),s||=!G(c)||c!==this._$AH[l],c===f?t=f:t!==f&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}s&&!n&&this.j(t)}j(t){t===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},St=class extends O{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===f?void 0:t}},Et=class extends O{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==f)}},Pt=class extends O{constructor(t,e,r,n,i){super(t,e,r,n,i),this.type=5}_$AI(t,e=this){if((t=H(this,t,e,0)??f)===_)return;let r=this._$AH,n=t===f&&r!==f||t.capture!==r.capture||t.once!==r.once||t.passive!==r.passive,i=t!==f&&(r===f||n);n&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Dt=class{constructor(t,e,r){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}};var so=Tt.litHtmlPolyfillSupport;so?.(W,X),(Tt.litHtmlVersions??=[]).push("3.3.3");var ce=(o,t,e)=>{let r=e?.renderBefore??t,n=r._$litPart$;if(n===void 0){let i=e?.renderBefore??null;r._$litPart$=n=new X(t.insertBefore(Y(),i),i,void 0,e??{})}return n._$AI(o),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Bt=globalThis,b=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ce(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _}};b._$litElement$=!0,b.finalized=!0,Bt.litElementHydrateSupport?.({LitElement:b});var ao=Bt.litElementPolyfillSupport;ao?.({LitElement:b});(Bt.litElementVersions??=[]).push("4.2.2");/**
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
 */var lo={attribute:!0,type:String,converter:q,reflect:!1,hasChanged:st},co=(o=lo,t,e)=>{let{kind:r,metadata:n}=e,i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),r==="setter"&&((o=Object.create(o)).wrapped=!0),i.set(e.name,o),r==="accessor"){let{name:s}=e;return{set(a){let l=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,l,o,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,o,a),a}}}if(r==="setter"){let{name:s}=e;return function(a){let l=this[s];t.call(this,a),this.requestUpdate(s,l,o,!0,a)}}throw Error("Unsupported decorator location: "+r)};function P(o){return(t,e)=>typeof e=="object"?co(o,t,e):((r,n,i)=>{let s=n.hasOwnProperty(i);return n.constructor.createProperty(i,r),s?Object.getOwnPropertyDescriptor(n,i):void 0})(o,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function D(o){return P({...o,state:!0,attribute:!1})}/**
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
 */var de={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},pe=o=>(...t)=>({_$litDirective$:o,values:t}),dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,r){this._$Ct=t,this._$AM=e,this._$Ci=r}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ue="important",po=" !"+ue,v=pe(class extends dt{constructor(o){if(super(o),o.type!==de.ATTRIBUTE||o.name!=="style"||o.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(o){return Object.keys(o).reduce((t,e)=>{let r=o[e];return r==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${r};`},"")}update(o,[t]){let{style:e}=o.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let r of this.ft)t[r]==null&&(this.ft.delete(r),r.includes("-")?e.removeProperty(r):e[r]=null);for(let r in t){let n=t[r];if(n!=null){this.ft.add(r);let i=typeof n=="string"&&n.endsWith(po);r.includes("-")||i?e.setProperty(r,i?n.slice(0,-11):n,i?ue:""):e[r]=n}}return _}});var uo=/^#?(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i;var fe="var(--card-background-color, #ffffff)";function he(o){let t=uo.exec(o.trim());if(!t)return null;let e=t[1]?t[1].split("").map(r=>r+r).join(""):t[2];return{r:Number.parseInt(e.slice(0,2),16),g:Number.parseInt(e.slice(2,4),16),b:Number.parseInt(e.slice(4,6),16)}}function Mt(o){let t=o/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4}function fo({r:o,g:t,b:e}){return .2126*Mt(o)+.7152*Mt(t)+.0722*Mt(e)}function me(o){let t=he(o);return t&&fo(t)>.179?"#0f172a":"#ffffff"}function pt(o){return`color-mix(in srgb, ${o} 14%, ${fe})`}function ut(o){return`color-mix(in srgb, ${o} 35%, ${fe})`}function j(o,t){let e=he(o);if(!e)return t;let r=n=>n.toString(16).padStart(2,"0");return`#${r(e.r)}${r(e.g)}${r(e.b)}`}var T=["mon","tue","wed","thu","fri","sat","sun"];function R(o){return typeof o=="string"&&T.includes(o)}function Ht(o,t){if(!Array.isArray(o))return[...t];let e=[];for(let r of o)R(r)&&!e.includes(r)&&e.push(r);return e.length>0?e:[...t]}function J(o,t){return t.days&&t.days.length>0?t.days:o.days}function ye(o=new Date){return T[(o.getDay()+6)%7]}var ho={monday:0,tuesday:1,wednesday:2,thursday:3,friday:4,saturday:5,sunday:6};function ft(o){let t=o?.locale?.first_weekday,e=0;return t&&t!=="language"?e=ho[t]:t==="language"&&(e=mo(o?.language)?6:0),T.map((r,n)=>T[(n+e)%7])}function mo(o){if(!o)return!1;let t=o.toLowerCase();return t==="en-us"||t.startsWith("en-us")}function ht(o,t,e){if(o.includes(t))return o.length<=1?o:o.filter(s=>s!==t);let r=s=>e.indexOf(s),n=o.findIndex(s=>r(s)>r(t)),i=[...o];return i.splice(n===-1?i.length:n,0,t),i}var Ot={days:{mon:{full:"\u043F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A",short:"\u043F\u043D"},tue:{full:"\u0432\u0442\u043E\u0440\u043D\u0438\u043A",short:"\u0432\u0442"},wed:{full:"\u0441\u0440\u044F\u0434\u0430",short:"\u0441\u0440"},thu:{full:"\u0447\u0435\u0442\u0432\u044A\u0440\u0442\u044A\u043A",short:"\u0447\u0442"},fri:{full:"\u043F\u0435\u0442\u044A\u043A",short:"\u043F\u0442"},sat:{full:"\u0441\u044A\u0431\u043E\u0442\u0430",short:"\u0441\u0431"},sun:{full:"\u043D\u0435\u0434\u0435\u043B\u044F",short:"\u043D\u0434"}},until:o=>`\u0434\u043E ${o}`,after:o=>`\u0441\u043B\u0435\u0434 ${o}`,range:(o,t)=>`${o}\u2013${t}`,today:"\u0414\u043D\u0435\u0441",editor:{tabSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",tabActivities:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442\u0438",addPerson:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0447\u043E\u0432\u0435\u043A",removePerson:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438 \u0447\u043E\u0432\u0435\u043A",personNamePlaceholder:"\u041D\u043E\u0432 \u0447\u043E\u0432\u0435\u043A",title:"\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435",layout:"\u0418\u0437\u0433\u043B\u0435\u0434",layoutBlocks:"\u0411\u043B\u043E\u043A\u043E\u0432\u0435",layoutGrid:"\u041C\u0440\u0435\u0436\u0430",days:"\u0414\u043D\u0438",language:"\u0415\u0437\u0438\u043A",languageAuto:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E",languageEnglish:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",languageBulgarian:"\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",highlightToday:"\u041E\u0442\u0431\u0435\u043B\u044F\u0437\u0432\u0430\u0439 \u0434\u043D\u0435\u0448\u043D\u0438\u044F \u0434\u0435\u043D",headerColor:"\u0426\u0432\u044F\u0442 \u043D\u0430 \u0437\u0430\u0433\u043B\u0430\u0432\u043A\u0430\u0442\u0430",name:"\u0418\u043C\u0435",emoji:"\u0415\u043C\u043E\u0434\u0436\u0438",color:"\u0426\u0432\u044F\u0442",daysOverride:"\u0414\u043D\u0438 \u0437\u0430 \u0442\u043E\u0437\u0438 \u0447\u043E\u0432\u0435\u043A",daysOverrideHint:"\u041E\u0441\u0442\u0430\u0432\u0435\u0442\u0435 \u043F\u0440\u0430\u0437\u043D\u043E, \u0437\u0430 \u0434\u0430 \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442 \u0434\u043D\u0438\u0442\u0435 \u043D\u0430 \u043A\u0430\u0440\u0442\u0430\u0442\u0430",slots:"\u0427\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438",addSlot:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotColumn:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",addBlock:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0431\u043B\u043E\u043A",activity:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442",start:"\u041D\u0430\u0447\u0430\u043B\u043E",end:"\u041A\u0440\u0430\u0439",slot:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotNone:"\u0418\u0437\u0432\u044A\u043D \u043C\u0440\u0435\u0436\u0430\u0442\u0430",moveUp:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0433\u043E\u0440\u0435",moveDown:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0434\u043E\u043B\u0443",moveToDay:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u0432 \u0434\u0440\u0443\u0433 \u0434\u0435\u043D",remove:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438",dragHint:"\u0412\u043B\u0430\u0447\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442 \u0432\u044A\u0440\u0445\u0443 \u0434\u0435\u043D \u0438\u043B\u0438 \u044F \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0438 \u0441\u043B\u0435\u0434 \u0442\u043E\u0432\u0430 \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0434\u0435\u043D\u044F",label:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",addActivity:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activityInUse:(o,t)=>`\u201E${o}\u201C \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430 \u0432 ${t} ${t===1?"\u0431\u043B\u043E\u043A":"\u0431\u043B\u043E\u043A\u0430"}.`,confirmRemoveActivity:"\u0414\u0430 \u0441\u0435 \u043F\u0440\u0435\u043C\u0430\u0445\u043D\u0435 \u043B\u0438 \u0432\u044A\u043F\u0440\u0435\u043A\u0438 \u0442\u043E\u0432\u0430?",noSlots:"\u0414\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0447\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438, \u0437\u0430 \u0434\u0430 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442\u0435 \u0438\u0437\u0433\u043B\u0435\u0434\u0430 \u201E\u041C\u0440\u0435\u0436\u0430\u201C.",noBlocks:"\u041D\u044F\u043C\u0430 \u0437\u0430\u043D\u0438\u043C\u0430\u043D\u0438\u044F",orphanActivity:"\u041D\u0435\u043F\u043E\u0437\u043D\u0430\u0442\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442"}};var jt={days:{mon:{full:"Monday",short:"Mon"},tue:{full:"Tuesday",short:"Tue"},wed:{full:"Wednesday",short:"Wed"},thu:{full:"Thursday",short:"Thu"},fri:{full:"Friday",short:"Fri"},sat:{full:"Saturday",short:"Sat"},sun:{full:"Sunday",short:"Sun"}},until:o=>`until ${o}`,after:o=>`after ${o}`,range:(o,t)=>`${o}\u2013${t}`,today:"Today",editor:{tabSettings:"Settings",tabActivities:"Activities",addPerson:"Add person",removePerson:"Remove person",personNamePlaceholder:"New person",title:"Title",layout:"Layout",layoutBlocks:"Blocks",layoutGrid:"Grid",days:"Days",language:"Language",languageAuto:"Automatic",languageEnglish:"English",languageBulgarian:"Bulgarian",highlightToday:"Highlight today",headerColor:"Header colour",name:"Name",emoji:"Emoji",color:"Colour",daysOverride:"Days for this person",daysOverrideHint:"Leave empty to use the card's days",slots:"Time slots",addSlot:"Add slot",slotColumn:"Slot",addBlock:"Add block",activity:"Activity",start:"Start",end:"End",slot:"Slot",slotNone:"Not on the grid",moveUp:"Move up",moveDown:"Move down",moveToDay:"Move to another day",remove:"Remove",dragHint:"Drag an activity onto a day, or tap it and then tap a day",label:"Label",addActivity:"Add activity",activityInUse:(o,t)=>`\u201C${o}\u201D is used by ${t} block${t===1?"":"s"}.`,confirmRemoveActivity:"Remove it anyway?",noSlots:"Add time slots to use the grid layout.",noBlocks:"Nothing scheduled",orphanActivity:"Unknown activity"}};function N(o,t){return o.language==="en"||o.language==="bg"?o.language:(t?.language??"en").toLowerCase().startsWith("bg")?"bg":"en"}function mt(o){return o==="bg"?Ot:jt}var gt="custom:weekly-timetable-card",vt=["mon","tue","wed","thu","fri"],bt="#1e3a5f",yo="#888888";function yt(o){if(typeof o=="number"&&Number.isFinite(o)&&o>=0){let e=Math.floor(o/60),r=o%60;return`${String(e).padStart(2,"0")}:${String(r).padStart(2,"0")}`}if(typeof o!="string")return;let t=o.trim();return t.length>0?t:void 0}function $t(o){let t=o??{};if(!Array.isArray(t.people)||t.people.length===0)throw new Error("weekly-timetable-card: `people` must be a non-empty list");if(t.activities!==void 0&&!Array.isArray(t.activities))throw new Error("weekly-timetable-card: `activities` must be a list");let e=Ht(t.days,vt),r=(Array.isArray(t.activities)?t.activities:[]).map(go).filter(i=>i!==null),n=t.people.map(i=>vo(i,e));return{type:typeof t.type=="string"?t.type:gt,title:typeof t.title=="string"?t.title:void 0,layout:t.layout==="grid"?"grid":"blocks",days:e,language:t.language==="en"||t.language==="bg"?t.language:"auto",highlight_today:t.highlight_today!==!1,header_color:typeof t.header_color=="string"&&t.header_color.trim().length>0?t.header_color.trim():bt,activities:r,people:n}}function go(o){let t=o??{},e=typeof t.id=="string"?t.id.trim():"";if(e.length===0)return null;let r=typeof t.label=="string"&&t.label.trim().length>0?t.label.trim():e,n=typeof t.color=="string"&&t.color.trim().length>0?t.color.trim():yo;return{id:e,label:r,color:n}}function vo(o,t){let e=o??{},r=Array.isArray(e.days)?Ht(e.days,t):void 0,n=r??t,i=e.schedule??{},s={},a=new Set(n);for(let u of Object.keys(i))R(u)&&a.add(u);for(let u of T){if(!a.has(u))continue;let d=i[u];s[u]=Array.isArray(d)?d.map(bo).filter(h=>h!==null):[]}let l=Array.isArray(e.slots)?e.slots.map((u,d)=>$o(u,d)).filter(u=>u!==null):void 0,c={name:typeof e.name=="string"?e.name:"",schedule:s};return typeof e.emoji=="string"&&e.emoji.length>0&&(c.emoji=e.emoji),typeof e.color=="string"&&e.color.trim().length>0&&(c.color=e.color.trim()),r&&(c.days=r),l&&(c.slots=l),c}function bo(o){let t=o??{};if(typeof t.activity!="string"||t.activity.trim().length===0)return null;let e={activity:t.activity.trim()},r=yt(t.start),n=yt(t.end);return r&&(e.start=r),n&&(e.end=n),e}function $o(o,t){let e=o??{},r=yt(e.start),n=yt(e.end);return!r||!n?null:{slot:typeof e.slot=="number"&&Number.isFinite(e.slot)?e.slot:t+1,start:r,end:n}}var xo={en:[{id:"english",label:"English",color:"#3b82f6"},{id:"daycare",label:"After-school club",color:"#64748b"},{id:"break",label:"Break and a snack",color:"#94a3b8"},{id:"judo",label:"Judo",color:"#f97316"},{id:"chess",label:"Chess",color:"#a855f7"},{id:"home",label:"Back home",color:"#22c55e"}],bg:[{id:"english",label:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",color:"#3b82f6"},{id:"daycare",label:"\u0417\u0430\u043D\u0438\u043C\u0430\u043B\u043D\u044F",color:"#64748b"},{id:"break",label:"\u041F\u043E\u0447\u0438\u0432\u043A\u0430 \u0438 \u0445\u0430\u043F\u0432\u0430\u043D\u0435",color:"#94a3b8"},{id:"judo",label:"\u0414\u0436\u0443\u0434\u043E",color:"#f97316"},{id:"chess",label:"\u0428\u0430\u0445",color:"#a855f7"},{id:"home",label:"\u0412\u0440\u044A\u0449\u0430\u043D\u0435 \u0432\u043A\u044A\u0449\u0438",color:"#22c55e"}]},_o={en:"Alex",bg:"\u0418\u0432\u0430\u043D"};function ge(o){let t=N({language:"auto"},o),e=r=>[{activity:"english",start:"15:20",end:"16:20"},{activity:"break",start:"16:20",end:"17:30"},{activity:r,start:"17:30",end:"18:30"},{activity:"home",start:"18:30"}];return{type:gt,title:void 0,layout:"blocks",days:[...vt],language:"auto",highlight_today:!0,header_color:bt,activities:xo[t].map(r=>({...r})),people:[{name:_o[t],emoji:"\u{1F94B}",color:"#f472b6",schedule:{mon:e("judo"),tue:[{activity:"daycare",end:"16:00"}],wed:e("judo"),thu:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}],fri:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}]}}]}}function ve(o,t){if(t<=0||o<=0)return"stacked";let e=o/t;return e>=110?"full":e>=72?"compact":"stacked"}var be=F`
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
`,$e=F`
  ${be}

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
    align-content: start;
    gap: 10px;
    padding: 10px;
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

  [data-density="stacked"] .week {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  [data-density="stacked"] .day-head {
    padding-left: 12px;
    text-align: left;
  }

  .grid {
    display: grid;
    grid-template-columns: max-content repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 6px;
    align-items: stretch;
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
    grid-template-columns: max-content repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 6px;
    margin-bottom: 10px;
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
    padding: 16px;
    color: var(--secondary-text-color);
    text-align: center;
  }
`,xe=F`
  ${be}

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

  .row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .row .grow {
    flex: 1;
    min-width: 0;
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
`;var Ao=/[^\p{L}\p{N}]+/gu,Co=/^-+|-+$/g;function ko(o){return o.toLowerCase().replace(Ao,"-").replace(Co,"")}function _e(o,t){let e=ko(o)||"activity";if(!t.includes(e))return e;let r=2;for(;t.includes(`${e}-${r}`);)r+=1;return`${e}-${r}`}function Ae(o,t){return o.find(e=>e.id===t)}var ke=/^(\d{1,2}):(\d{2})$/;function Ce(o){try{return new Intl.DateTimeFormat(o,{hour:"numeric"}).formatToParts(new Date(2020,0,1,13,0)).some(e=>e.type==="dayPeriod")}catch{return!1}}var wo={en:"en-GB",bg:"bg"};function Ut(o,t){return o?.language??wo[t]}function So(o,t){let e=o?.locale?.time_format;if(e==="12")return!0;if(e==="24")return!1;if(e==="system"){let r=typeof navigator>"u"?void 0:navigator.language;return Ce(r??Ut(o,t))}return Ce(Ut(o,t))}function Z(o,t,e){let r=o.trim(),n=ke.exec(r);if(!n)return r;let i=Number(n[1]),s=Number(n[2]);if(i>23||s>59)return r;if(!So(t,e))return`${String(i).padStart(2,"0")}:${n[2]}`;try{return new Intl.DateTimeFormat(Ut(t,e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(new Date(2020,0,1,i,s))}catch{return r}}var Nt=24*60;function we(o,t){let e=ke.exec(o.trim());if(!e)return o;let n=((Number(e[1])*60+Number(e[2])+t)%Nt+Nt)%Nt,i=Math.floor(n/60);return`${String(i).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`}var Eo="08:00",Po=45;function Kt(o,t,e){return Math.min(Math.max(o,t),e)}function $(o,t,e){return{...o,people:o.people.map((r,n)=>n===t?e:r)}}function L(o,t){return o.schedule[t]??[]}function Q(o,t,e){return{...o,schedule:{...o.schedule,[t]:e}}}function B(o,t){return{...o,...t}}function Se(o,t){return{...o,people:[...o.people,{name:t,schedule:{}}]}}function Ee(o,t){return o.people.length<=1||!o.people[t]?o:{...o,people:o.people.filter((e,r)=>r!==t)}}function M(o,t,e){let r=o.people[t];if(!r)return o;let n={...r,schedule:{...r.schedule}};if(e.name!==void 0&&(n.name=e.name),e.emoji!==void 0&&(e.emoji===null||e.emoji===""?delete n.emoji:n.emoji=e.emoji),e.color!==void 0&&(e.color===null||e.color===""?delete n.color:n.color=e.color),e.slots!==void 0&&(e.slots===null?delete n.slots:n.slots=e.slots.map(i=>({...i}))),e.days!==void 0){e.days===null||e.days.length===0?delete n.days:n.days=[...e.days];for(let i of n.days??o.days)n.schedule[i]||(n.schedule[i]=[])}return $(o,t,n)}function It(o,t,e,r){let n=o.people[t];return n?$(o,t,Q(n,e,[...L(n,e),{...r}])):o}function U(o,t,e,r,n){let i=o.people[t],s=i?.schedule[e]?.[r];if(!i||!s)return o;let a={...s};n.activity!==void 0&&(a.activity=n.activity),n.start!==void 0&&(n.start===null||n.start===""?delete a.start:a.start=n.start),n.end!==void 0&&(n.end===null||n.end===""?delete a.end:a.end=n.end);let l=L(i,e).map((c,u)=>u===r?a:c);return $(o,t,Q(i,e,l))}function Pe(o,t,e,r){let n=o.people[t];if(!n||!n.schedule[e]?.[r])return o;let i=L(n,e).filter((s,a)=>a!==r);return $(o,t,Q(n,e,i))}function De(o,t,e,r,n){let i=o.people[t];if(!i)return o;let s=[...L(i,e)];return s.splice(Kt(r,0,s.length),0,{...n}),$(o,t,Q(i,e,s))}function tt(o,t,e,r){let n=o.people[t];if(!n)return o;let i=[...L(n,e.day)],s=i[e.index];if(!s)return o;if(i.splice(e.index,1),e.day===r.day)return i.splice(Kt(r.index,0,i.length),0,s),$(o,t,Q(n,e.day,i));let a=[...L(n,r.day)];return a.splice(Kt(r.index,0,a.length),0,s),$(o,t,{...n,schedule:{...n.schedule,[e.day]:i,[r.day]:a}})}function Ft(o,t,e,r,n){let i=o.people[t];if(!i)return o;let s=r+n;return s<0||s>=L(i,e).length?o:tt(o,t,{day:e,index:r},{day:e,index:s})}function Te(o,t,e){let r=_e(t,o.activities.map(n=>n.id));return{...o,activities:[...o.activities,{id:r,label:t,color:e}]}}function zt(o,t,e){return o.activities[t]?{...o,activities:o.activities.map((r,n)=>n===t?{...r,...e}:r)}:o}function Re(o,t){return o.activities[t]?{...o,activities:o.activities.filter((e,r)=>r!==t)}:o}function Le(o,t){let e=0;for(let r of o.people)for(let n of Object.values(r.schedule))for(let i of n??[])i.activity===t&&(e+=1);return e}function Be(o,t){let e=o.people[t];if(!e)return o;let r=e.slots??[],i=r[r.length-1]?.end??Eo,s=r.reduce((a,l)=>Math.max(a,l.slot),0)+1;return $(o,t,{...e,slots:[...r,{slot:s,start:i,end:we(i,Po)}]})}function qt(o,t,e,r){let n=o.people[t];return n?.slots?.[e]?$(o,t,{...n,slots:n.slots.map((i,s)=>s===e?{...i,...r}:i)}):o}function Me(o,t,e){let r=o.people[t];return r?.slots?.[e]?$(o,t,{...r,slots:r.slots.filter((n,i)=>i!==e)}):o}function m(o){return o.target.value}function xt(o){return o.target.checked}var He="#64748b";function Oe(o){let{config:t,strings:e,commit:r}=o,n=(i,s)=>{let a=Le(t,s.id);if(a>0){let l=`${e.editor.activityInUse(s.label,a)} ${e.editor.confirmRemoveActivity}`;if(!window.confirm(l))return}r(Re(t,i))};return p`
    <div class="panel">
      ${t.activities.map((i,s)=>p`
          <div class="row" data-activity=${i.id}>
            <input
              type="color"
              data-field="color"
              .value=${j(i.color,He)}
              @change=${a=>r(zt(t,s,{color:m(a)}))}
            />
            <input
              class="grow"
              type="text"
              data-field="label"
              .value=${i.label}
              @change=${a=>r(zt(t,s,{label:m(a)}))}
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
          placeholder=${e.editor.label}
        />
        <button
          class="icon-button"
          type="button"
          data-action="add-activity"
          title=${e.editor.addActivity}
          @click=${i=>{let a=i.currentTarget.parentElement.querySelector('[data-field="new-label"]'),l=a.value.trim();l.length!==0&&(a.value="",r(Te(t,l,He)))}}
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
  `}var Do=5;function To(o){let t=o&&o.nodeType!==Node.ELEMENT_NODE?o.parentElement:o,e=t?.closest("[data-drag-block]");if(e){let i=e.dataset.dragDay,s=Number(e.dataset.dragBlock);return R(i)&&Number.isInteger(s)&&s>=0?{kind:"block",day:i,index:s}:null}let n=t?.closest("[data-palette-activity]")?.dataset.paletteActivity;return n?{kind:"activity",activityId:n}:null}function Ro(o,t){for(let e=0;e<o.length;e+=1){let r=o[e];if(t<(r.top+r.bottom)/2)return e}return o.length}function Lo(o,t,e){return o.kind!=="block"||o.day!==t?e:e>o.index?e-1:e}var _t=class{constructor(t,e){this.getRoot=t;this.callbacks=e;this._source=null;this._origin={x:0,y:0};this._active=!1;this._hoverDay=null;this.onPointerDown=t=>{let e=To(t.target);e&&(this._source=e,this._origin={x:t.clientX,y:t.clientY},this._active=!1,window.addEventListener("pointermove",this._onPointerMove),window.addEventListener("pointerup",this._onPointerUp),window.addEventListener("pointercancel",this._onPointerCancel))};this._onPointerMove=t=>{if(!this._source)return;if(!this._active){let r=t.clientX-this._origin.x,n=t.clientY-this._origin.y;if(Math.hypot(r,n)<Do)return;this._active=!0}t.preventDefault();let e=this._dayUnder(t.clientX,t.clientY);e!==this._hoverDay&&(this._hoverDay=e,this.callbacks.requestUpdate())};this._onPointerUp=t=>{let e=this._source,r=this._active;if(this._teardown(),!e||!r)return;let n=this._groupUnder(t.clientX,t.clientY),i=n?.dataset.day;if(!n||!R(i))return;let s=[...n.querySelectorAll("[data-block-index]")].map(l=>{let c=l.getBoundingClientRect();return{top:c.top,bottom:c.bottom}}),a=Lo(e,i,Ro(s,t.clientY));if(e.kind==="block"){this.callbacks.moveBlock({day:e.day,index:e.index},{day:i,index:a});return}this.callbacks.insertActivity(e.activityId,{day:i,index:a})};this._onPointerCancel=()=>{this._teardown()}}get active(){return this._active}get hoverDay(){return this._hoverDay}_teardown(){window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),window.removeEventListener("pointercancel",this._onPointerCancel);let t=this._active||this._hoverDay!==null;this._source=null,this._active=!1,this._hoverDay=null,t&&this.callbacks.requestUpdate()}_groupUnder(t,e){return(this.getRoot()?.elementFromPoint?.(t,e)??(typeof document.elementFromPoint=="function"?document.elementFromPoint(t,e):null))?.closest("[data-day]")??null}_dayUnder(t,e){let r=this._groupUnder(t,e)?.dataset.day;return R(r)?r:null}};function je(o,t,e){o.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}function K(o){let t=!!o.start,e=!!o.end;return t&&e?"range":e?"until":t?"after":"bare"}var Ne="#f472b6";function Ue(o,t){let{config:e,strings:r,commit:n}=o,{personIndex:i}=t,s=e.people[i];if(!s)return p``;let a=ft(o.hass),l=J(e,s);return p`
    <div class="panel">
      <div class="row">
        <input
          type="text"
          class="grow"
          data-field="name"
          .value=${s.name}
          placeholder=${r.editor.personNamePlaceholder}
          @change=${c=>n(M(e,i,{name:m(c)}))}
        />
        <input
          type="text"
          data-field="emoji"
          style="width: 3.5rem"
          .value=${s.emoji??""}
          placeholder=${r.editor.emoji}
          @change=${c=>n(M(e,i,{emoji:m(c)||null}))}
        />
        <input
          type="color"
          data-field="person-color"
          .value=${j(s.color??Ne,Ne)}
          @change=${c=>n(M(e,i,{color:m(c)}))}
        />
        <button
          class="icon-button"
          type="button"
          data-action="clear-person-color"
          title=${r.editor.color}
          @click=${()=>n(M(e,i,{color:null}))}
        >
          ⌫
        </button>
        <button
          class="icon-button"
          type="button"
          data-action="remove-person"
          title=${r.editor.removePerson}
          ?disabled=${e.people.length<=1}
          @click=${()=>n(Ee(e,i))}
        >
          ×
        </button>
      </div>

      <label class="field inline">
        <input
          type="checkbox"
          data-field="own-days"
          .checked=${s.days!==void 0}
          @change=${c=>n(M(e,i,{days:xt(c)?[...e.days]:null}))}
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
                    @click=${()=>n(M(e,i,{days:ht(s.days,c,a)}))}
                  >
                    ${r.days[c].short}
                  </button>
                `)}
            </div>
          `}

      ${e.layout==="grid"?Bo(o,i,s):f}

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

      ${l.map(c=>Mo(o,t,s,c))}
    </div>
  `}function Bo(o,t,e){let{config:r,strings:n,commit:i}=o,s=e.slots??[];return p`
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
                @change=${c=>i(qt(r,t,l,{start:m(c)}))}
              />
              <input
                type="time"
                data-field="slot-end"
                .value=${a.end}
                @change=${c=>i(qt(r,t,l,{end:m(c)}))}
              />
              <button
                class="icon-button"
                type="button"
                data-action="remove-slot"
                title=${n.editor.remove}
                @click=${()=>i(Me(r,t,l))}
              >
                ×
              </button>
            </div>
          `)}
        <button
          class="chip"
          type="button"
          data-action="add-slot"
          @click=${()=>i(Be(r,t))}
        >
          ＋ ${n.editor.addSlot}
        </button>
      </div>
    </div>
  `}function Mo(o,t,e,r){let{config:n,strings:i,commit:s}=o,{personIndex:a}=t,l=e.schedule[r]??[],c=n.activities[0]?.id;return p`
    <div
      class="day-group ${t.hoverDay===r?"drop-target":""}"
      data-day=${r}
      @click=${()=>{t.selectedActivity&&(s(It(n,a,r,{activity:t.selectedActivity})),t.onSelectActivity(null))}}
    >
      <h4>${i.days[r].full}</h4>
      <div class="block-rows">
        ${l.map((u,d)=>Ho(o,t,r,u,d,l.length))}
        ${c?p`
              <button
                class="chip"
                type="button"
                data-action="add-block"
                @click=${u=>{u.stopPropagation(),s(It(n,a,r,{activity:c}))}}
              >
                ＋ ${i.editor.addBlock}
              </button>
            `:f}
      </div>
    </div>
  `}function Ho(o,t,e,r,n,i){let{config:s,strings:a,commit:l}=o,{personIndex:c}=t,u=s.people[c];return p`
    <div class="row" data-block-index=${n} @click=${d=>d.stopPropagation()}>
      <span class="drag-handle" data-drag-block=${n} data-drag-day=${e}>⠿</span>
      <select
        class="grow"
        data-field="activity"
        @change=${d=>l(U(s,c,e,n,{activity:m(d)}))}
      >
        ${s.activities.map(d=>p`
            <option value=${d.id} .selected=${d.id===r.activity}>
              ${d.label}
            </option>
          `)}
        ${s.activities.some(d=>d.id===r.activity)?f:p`<option value=${r.activity} .selected=${!0}>${r.activity}</option>`}
      </select>

      <select
        data-field="day"
        title=${a.editor.moveToDay}
        @change=${d=>{let h=m(d);if(h===e)return;let y=(u.schedule[h]??[]).length;l(tt(s,c,{day:e,index:n},{day:h,index:y}))}}
      >
        ${J(s,u).map(d=>p`
            <option value=${d} .selected=${d===e}>
              ${a.days[d].short}
            </option>
          `)}
      </select>

      ${s.layout==="grid"?Oo(o,c,e,r,n,u.slots??[]):p`
            <input
              type="time"
              data-field="start"
              .value=${r.start??""}
              @change=${d=>l(U(s,c,e,n,{start:m(d)||null}))}
            />
            <input
              type="time"
              data-field="end"
              .value=${r.end??""}
              @change=${d=>l(U(s,c,e,n,{end:m(d)||null}))}
            />
          `}

      <button
        class="icon-button"
        type="button"
        data-action="move-up"
        title=${a.editor.moveUp}
        ?disabled=${n===0}
        @click=${()=>l(Ft(s,c,e,n,-1))}
      >
        ↑
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="move-down"
        title=${a.editor.moveDown}
        ?disabled=${n>=i-1}
        @click=${()=>l(Ft(s,c,e,n,1))}
      >
        ↓
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="remove-block"
        title=${a.editor.remove}
        @click=${()=>l(Pe(s,c,e,n))}
      >
        ×
      </button>
    </div>
  `}function Oo(o,t,e,r,n,i){let{config:s,strings:a,commit:l}=o,c=K(r)==="range"?i.find(u=>u.start===r.start&&u.end===r.end):void 0;return p`
    <select
      data-field="slot"
      @change=${u=>{let d=m(u);if(d===""){l(U(s,t,e,n,{start:null,end:null}));return}let h=i.find(y=>String(y.slot)===d);h&&l(U(s,t,e,n,{start:h.start,end:h.end}))}}
    >
      <option value="" .selected=${c===void 0}>${a.editor.slotNone}</option>
      ${i.map(u=>p`
          <option value=${String(u.slot)} .selected=${c?.slot===u.slot}>
            ${u.slot}. ${u.start}–${u.end}
          </option>
        `)}
    </select>
  `}function Ke(o){let{config:t,strings:e,commit:r}=o,n=ft(o.hass);return p`
    <div class="panel">
      <label class="field">
        <span>${e.editor.title}</span>
        <input
          type="text"
          data-field="title"
          .value=${t.title??""}
          @change=${i=>r(B(t,{title:m(i)||void 0}))}
        />
      </label>

      <label class="field">
        <span>${e.editor.layout}</span>
        <select
          data-field="layout"
          @change=${i=>r(B(t,{layout:m(i)}))}
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
                @click=${()=>r(B(t,{days:ht(t.days,i,n)}))}
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
          @change=${i=>r(B(t,{language:m(i)}))}
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
          @change=${i=>r(B(t,{highlight_today:xt(i)}))}
        />
        <span>${e.editor.highlightToday}</span>
      </label>

      <label class="field inline">
        <input
          type="color"
          data-field="header_color"
          .value=${j(t.header_color,bt)}
          @change=${i=>r(B(t,{header_color:m(i)}))}
        />
        <span>${e.editor.headerColor}</span>
      </label>
    </div>
  `}var A=class extends b{constructor(){super(...arguments);this._tab="settings";this._selectedActivity=null;this._dnd=new _t(()=>this.shadowRoot,{moveBlock:(e,r)=>{let n=this._config;!n||typeof this._tab!="object"||this._commit(tt(n,this._tab.person,e,r))},insertActivity:(e,r)=>{let n=this._config;!n||typeof this._tab!="object"||this._commit(De(n,this._tab.person,r.day,r.index,{activity:e}))},requestUpdate:()=>this.requestUpdate()})}setConfig(e){this._config=$t(e),typeof this._tab=="object"&&!this._config.people[this._tab.person]&&(this._tab="settings")}_commit(e){let r=this._config;this._config=e,typeof this._tab=="object"&&(!e.people[this._tab.person]||r!==void 0&&e.people.length<r.people.length)&&(this._tab="settings"),je(this,"config-changed",{config:e})}render(){let e=this._config;if(!e)return f;let r=mt(N(e,this.hass)),n={config:e,strings:r,hass:this.hass,commit:i=>this._commit(i)};return p`
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
          @click=${()=>{let i=Se(e,"");this._tab={person:i.people.length-1},this._commit(i)}}
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
    `}_renderPanel(e){return this._tab==="settings"?Ke(e):this._tab==="activities"?Oe(e):Ue(e,{personIndex:this._tab.person,selectedActivity:this._selectedActivity,onSelectActivity:r=>{this._selectedActivity=r},hoverDay:this._dnd.hoverDay})}};A.styles=xe,g([P({attribute:!1})],A.prototype,"hass",2),g([D()],A.prototype,"_config",2),g([D()],A.prototype,"_tab",2),g([D()],A.prototype,"_selectedActivity",2),A=g([lt("weekly-timetable-card-editor")],A);function jo(o,t){let e=r=>Z(r,o.hass,o.lang);switch(K(t)){case"range":return o.strings.range(e(t.start),e(t.end));case"until":return o.strings.until(e(t.end));case"after":return o.strings.after(e(t.start));case"bare":return""}}function et(o,t){let e=Ae(o.config.activities,t.activity),r=jo(o,t),n=e?{"--wtc-block-fill":pt(e.color),"--wtc-block-border":ut(e.color)}:{};return p`
    <div
      class="block ${e?"":"orphan"}"
      style=${v(n)}
      title=${e?f:o.strings.editor.orphanActivity}
    >
      ${r?p`<div class="block-time">${r}</div>`:f}
      <div class="block-label">${e?e.label:t.activity}</div>
    </div>
  `}function Vt(o,t){let e=o.strings.days[t];return o.density==="compact"?e.short:e.full}function Ie(o){return p`
    <div class="week" style=${v({"--wtc-day-count":String(o.days.length)})}>
      ${o.days.map(t=>No(o,t))}
    </div>
  `}function No(o,t){let e=o.person.schedule[t]??[];return p`
    <section class="day ${o.today===t?"today":""}">
      <header class="day-head">${Vt(o,t)}</header>
      <div class="day-body">
        ${e.length>0?e.map(r=>et(o,r)):p`<div class="empty">${o.strings.editor.noBlocks}</div>`}
      </div>
    </section>
  `}function Fe(o){let{config:t,hass:e,density:r,now:n}=o,i=Math.min(Math.max(o.personIndex,0),t.people.length-1),s=t.people[i],a=N(t,e);return{config:t,person:s,days:J(t,s),strings:mt(a),lang:a,hass:e,density:r,today:t.highlight_today?ye(n):null}}function ze(o,t){let e=new Map,r=[];for(let n of t){let i=K(n)==="range"?o.find(a=>a.start===n.start&&a.end===n.end):void 0;if(!i){r.push(n);continue}let s=e.get(i.slot);s?s.push(n):e.set(i.slot,[n])}return{bySlot:e,loose:r}}function qe(o){let t=[...o.person.slots??[]].sort((i,s)=>i.slot-s.slot),e=new Map;for(let i of o.days)e.set(i,ze(t,o.person.schedule[i]??[]));let r=o.days.some(i=>e.get(i).loose.length>0),n=v({"--wtc-day-count":String(o.days.length)});return p`
    <div>
      ${r?p`
            <div class="strip" style=${n}>
              <div class="strip-label"></div>
              ${o.days.map(i=>p`
                  <div class="strip-cell">
                    ${e.get(i).loose.map(s=>et(o,s))}
                  </div>
                `)}
            </div>
          `:f}
      ${t.length===0?p`<div class="no-slots">${o.strings.editor.noSlots}</div>`:p`
            <div class="grid" style=${n}>
              <div class="grid-corner"></div>
              ${o.days.map(i=>p`<div class="grid-head">${Vt(o,i)}</div>`)}
              ${t.flatMap(i=>[p`
                  <div class="slot-label">
                    ${o.strings.range(Z(i.start,o.hass,o.lang),Z(i.end,o.hass,o.lang))}
                  </div>
                `,...o.days.map(s=>p`
                    <div class="grid-cell ${o.today===s?"today":""}">
                      ${(e.get(s).bySlot.get(i.slot)??[]).map(a=>et(o,a))}
                    </div>
                  `)])}
            </div>
          `}
    </div>
  `}var Ve="0.1.0";var C=class extends b{constructor(){super(...arguments);this.density="full";this._personIndex=0}static getConfigElement(){return document.createElement("weekly-timetable-card-editor")}static getStubConfig(e){return ge(e)}static getLayoutOptions(){return{grid_columns:"full",grid_rows:"auto"}}setConfig(e){this._config=$t(e),this._personIndex=Math.min(this._personIndex,this._config.people.length-1)}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),!(typeof ResizeObserver>"u")&&(this._observer=new ResizeObserver(e=>{let r=e[0]?.contentRect.width??0,n=ve(r,this._dayCount());n!==this.density&&(this.density=n)}),this._observer.observe(this))}disconnectedCallback(){this._observer?.disconnect(),this._observer=void 0,super.disconnectedCallback()}_dayCount(){let e=this._config;return e?(e.people[Math.min(this._personIndex,e.people.length-1)]?.days??e.days).length:vt.length}render(){let e=this._config;if(!e)return f;let r=Fe({config:e,personIndex:this._personIndex,hass:this.hass,density:this.density}),n=this.density==="stacked"||e.layout==="blocks"?Ie(r):qe(r),i=v({"--wtc-header-color":e.header_color,"--wtc-header-text":me(e.header_color),"--wtc-accent":r.person.color??"var(--primary-color)"});return p`
      <ha-card style=${i}>
        ${e.title?p`<h1 class="card-title">${e.title}</h1>`:f}
        ${e.people.length>1?this._renderTabs(e):f}
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
              ${r.emoji?p`<span>${r.emoji}</span>`:f}
              <span>${r.name}</span>
            </button>
          `)}
      </div>
    `}};C.styles=$e,g([P({attribute:!1})],C.prototype,"hass",2),g([P({attribute:!1})],C.prototype,"density",2),g([D()],C.prototype,"_config",2),g([D()],C.prototype,"_personIndex",2),C=g([lt("weekly-timetable-card")],C);console.info(`%c WEEKLY-TIMETABLE-CARD %c v${Ve} `,"color:#fff;background:#1e3a5f;padding:2px 4px;border-radius:3px 0 0 3px","color:#1e3a5f;background:#e2e8f0;padding:2px 4px;border-radius:0 3px 3px 0");window.customCards=window.customCards??[];window.customCards.push({type:gt.replace(/^custom:/,""),name:"Weekly Timetable Card",description:"Weekly timetable for one or more people, in English or Bulgarian",preview:!0,documentationURL:"https://github.com/kosio/weekly-timetable-card"});export{C as WeeklyTimetableCard};
