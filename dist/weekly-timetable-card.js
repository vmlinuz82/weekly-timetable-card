var ie=Object.defineProperty;var ae=Object.getOwnPropertyDescriptor;var w=(r,t,e,o)=>{for(var s=o>1?void 0:o?ae(t,e):t,n=r.length-1,i;n>=0;n--)(i=r[n])&&(s=(o?i(t,e,s):i(s))||s);return o&&s&&ie(t,e,s),s};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var I=globalThis,K=I.ShadowRoot&&(I.ShadyCSS===void 0||I.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,tt=Symbol(),$t=new WeakMap,k=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==tt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(K&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=$t.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&$t.set(e,t))}return t}toString(){return this.cssText}},_t=r=>new k(typeof r=="string"?r:r+"",void 0,tt),F=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((o,s,n)=>o+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[n+1],r[0]);return new k(e,r,tt)},xt=(r,t)=>{if(K)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),s=I.litNonce;s!==void 0&&o.setAttribute("nonce",s),o.textContent=e.cssText,r.appendChild(o)}},et=K?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return _t(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:le,defineProperty:ce,getOwnPropertyDescriptor:de,getOwnPropertyNames:pe,getOwnPropertySymbols:ue,getPrototypeOf:he}=Object,z=globalThis,At=z.trustedTypes,fe=At?At.emptyScript:"",ye=z.reactiveElementPolyfillSupport,R=(r,t)=>r,T={toAttribute(r,t){switch(t){case Boolean:r=r?fe:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},q=(r,t)=>!le(r,t),St={attribute:!0,type:String,converter:T,reflect:!1,useDefault:!1,hasChanged:q};Symbol.metadata??=Symbol("metadata"),z.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=St){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),s=this.getPropertyDescriptor(t,o,e);s!==void 0&&ce(this.prototype,t,s)}}static getPropertyDescriptor(t,e,o){let{get:s,set:n}=de(this.prototype,t)??{get(){return this[e]},set(i){this[e]=i}};return{get:s,set(i){let l=s?.call(this);n?.call(this,i),this.requestUpdate(t,l,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??St}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let t=he(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let e=this.properties,o=[...pe(e),...ue(e)];for(let s of o)this.createProperty(s,e[s])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,s]of e)this.elementProperties.set(o,s)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let s=this._$Eu(e,o);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let s of o)e.unshift(et(s))}else t!==void 0&&e.push(et(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){let o=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,o);if(s!==void 0&&o.reflect===!0){let n=(o.converter?.toAttribute!==void 0?o.converter:T).toAttribute(e,o.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){let o=this.constructor,s=o._$Eh.get(t);if(s!==void 0&&this._$Em!==s){let n=o.getPropertyOptions(s),i=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:T;this._$Em=s;let l=i.fromAttribute(e,n.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(t,e,o,s=!1,n){if(t!==void 0){let i=this.constructor;if(s===!1&&(n=this[t]),o??=i.getPropertyOptions(t),!((o.hasChanged??q)(n,e)||o.useDefault&&o.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:s,wrapped:n},i){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,i??e??this[t]),n!==!0||i!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),s===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,n]of this._$Ep)this[s]=n;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[s,n]of o){let{wrapped:i}=n,l=this[s];i!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,n,l)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[R("elementProperties")]=new Map,y[R("finalized")]=new Map,ye?.({ReactiveElement:y}),(z.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var lt=globalThis,wt=r=>r,Y=lt.trustedTypes,Ct=Y?Y.createPolicy("lit-html",{createHTML:r=>r}):void 0,Pt="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,Lt="?"+$,me=`<${Lt}>`,S=document,P=()=>S.createComment(""),L=r=>r===null||typeof r!="object"&&typeof r!="function",ct=Array.isArray,ge=r=>ct(r)||typeof r?.[Symbol.iterator]=="function",rt=`[ 	
\f\r]`,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Et=/-->/g,kt=/>/g,x=RegExp(`>|${rt}(?:([^\\s"'>=/]+)(${rt}*=${rt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Rt=/'/g,Tt=/"/g,Nt=/^(?:script|style|textarea|title)$/i,dt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),h=dt(1),qe=dt(2),Ye=dt(3),m=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),Dt=new WeakMap,A=S.createTreeWalker(S,129);function Ot(r,t){if(!ct(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ct!==void 0?Ct.createHTML(t):t}var be=(r,t)=>{let e=r.length-1,o=[],s,n=t===2?"<svg>":t===3?"<math>":"",i=D;for(let l=0;l<e;l++){let a=r[l],u,p,c=-1,f=0;for(;f<a.length&&(i.lastIndex=f,p=i.exec(a),p!==null);)f=i.lastIndex,i===D?p[1]==="!--"?i=Et:p[1]!==void 0?i=kt:p[2]!==void 0?(Nt.test(p[2])&&(s=RegExp("</"+p[2],"g")),i=x):p[3]!==void 0&&(i=x):i===x?p[0]===">"?(i=s??D,c=-1):p[1]===void 0?c=-2:(c=i.lastIndex-p[2].length,u=p[1],i=p[3]===void 0?x:p[3]==='"'?Tt:Rt):i===Tt||i===Rt?i=x:i===Et||i===kt?i=D:(i=x,s=void 0);let v=i===x&&r[l+1].startsWith("/>")?" ":"";n+=i===D?a+me:c>=0?(o.push(u),a.slice(0,c)+Pt+a.slice(c)+$+v):a+$+(c===-2?l:v)}return[Ot(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},N=class r{constructor({strings:t,_$litType$:e},o){let s;this.parts=[];let n=0,i=0,l=t.length-1,a=this.parts,[u,p]=be(t,e);if(this.el=r.createElement(u,o),A.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=A.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(Pt)){let f=p[i++],v=s.getAttribute(c).split($),j=/([.?@])?(.*)/.exec(f);a.push({type:1,index:n,name:j[2],strings:v,ctor:j[1]==="."?st:j[1]==="?"?nt:j[1]==="@"?it:E}),s.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:n}),s.removeAttribute(c));if(Nt.test(s.tagName)){let c=s.textContent.split($),f=c.length-1;if(f>0){s.textContent=Y?Y.emptyScript:"";for(let v=0;v<f;v++)s.append(c[v],P()),A.nextNode(),a.push({type:2,index:++n});s.append(c[f],P())}}}else if(s.nodeType===8)if(s.data===Lt)a.push({type:2,index:n});else{let c=-1;for(;(c=s.data.indexOf($,c+1))!==-1;)a.push({type:7,index:n}),c+=$.length-1}n++}}static createElement(t,e){let o=S.createElement("template");return o.innerHTML=t,o}};function C(r,t,e=r,o){if(t===m)return t;let s=o!==void 0?e._$Co?.[o]:e._$Cl,n=L(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),n===void 0?s=void 0:(s=new n(r),s._$AT(r,e,o)),o!==void 0?(e._$Co??=[])[o]=s:e._$Cl=s),s!==void 0&&(t=C(r,s._$AS(r,t.values),s,o)),t}var ot=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,s=(t?.creationScope??S).importNode(e,!0);A.currentNode=s;let n=A.nextNode(),i=0,l=0,a=o[0];for(;a!==void 0;){if(i===a.index){let u;a.type===2?u=new O(n,n.nextSibling,this,t):a.type===1?u=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(u=new at(n,this,t)),this._$AV.push(u),a=o[++l]}i!==a?.index&&(n=A.nextNode(),i++)}return A.currentNode=S,s}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},O=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,s){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=C(this,t,e),L(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==m&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ge(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&L(this._$AH)?this._$AA.nextSibling.data=t:this.T(S.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,s=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=N.createElement(Ot(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===s)this._$AH.p(e);else{let n=new ot(s,this),i=n.u(this.options);n.p(e),this.T(i),this._$AH=n}}_$AC(t){let e=Dt.get(t.strings);return e===void 0&&Dt.set(t.strings,e=new N(t)),e}k(t){ct(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,s=0;for(let n of t)s===e.length?e.push(o=new r(this.O(P()),this.O(P()),this,this.options)):o=e[s],o._$AI(n),s++;s<e.length&&(this._$AR(o&&o._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let o=wt(t).nextSibling;wt(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,s,n){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=d}_$AI(t,e=this,o,s){let n=this.strings,i=!1;if(n===void 0)t=C(this,t,e,0),i=!L(t)||t!==this._$AH&&t!==m,i&&(this._$AH=t);else{let l=t,a,u;for(t=n[0],a=0;a<n.length-1;a++)u=C(this,l[o+a],e,a),u===m&&(u=this._$AH[a]),i||=!L(u)||u!==this._$AH[a],u===d?t=d:t!==d&&(t+=(u??"")+n[a+1]),this._$AH[a]=u}i&&!s&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},st=class extends E{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},nt=class extends E{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},it=class extends E{constructor(t,e,o,s,n){super(t,e,o,s,n),this.type=5}_$AI(t,e=this){if((t=C(this,t,e,0)??d)===m)return;let o=this._$AH,s=t===d&&o!==d||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==d&&(o===d||s);s&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},at=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){C(this,t)}};var ve=lt.litHtmlPolyfillSupport;ve?.(N,O),(lt.litHtmlVersions??=[]).push("3.3.3");var Bt=(r,t,e)=>{let o=e?.renderBefore??t,s=o._$litPart$;if(s===void 0){let n=e?.renderBefore??null;o._$litPart$=s=new O(t.insertBefore(P(),n),n,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var pt=globalThis,_=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Bt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return m}};_._$litElement$=!0,_.finalized=!0,pt.litElementHydrateSupport?.({LitElement:_});var $e=pt.litElementPolyfillSupport;$e?.({LitElement:_});(pt.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Ht=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var _e={attribute:!0,type:String,converter:T,reflect:!1,hasChanged:q},xe=(r=_e,t,e)=>{let{kind:o,metadata:s}=e,n=globalThis.litPropertyMetadata.get(s);if(n===void 0&&globalThis.litPropertyMetadata.set(s,n=new Map),o==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),o==="accessor"){let{name:i}=e;return{set(l){let a=t.get.call(this);t.set.call(this,l),this.requestUpdate(i,a,r,!0,l)},init(l){return l!==void 0&&this.C(i,void 0,r,l),l}}}if(o==="setter"){let{name:i}=e;return function(l){let a=this[i];t.call(this,l),this.requestUpdate(i,a,r,!0,l)}}throw Error("Unsupported decorator location: "+o)};function B(r){return(t,e)=>typeof e=="object"?xe(r,t,e):((o,s,n)=>{let i=s.hasOwnProperty(n);return s.constructor.createProperty(n,o),i?Object.getOwnPropertyDescriptor(s,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ut(r){return B({...r,state:!0,attribute:!1})}/**
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
 */var Mt={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Ut=r=>(...t)=>({_$litDirective$:r,values:t}),W=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var jt="important",Ae=" !"+jt,g=Ut(class extends W{constructor(r){if(super(r),r.type!==Mt.ATTRIBUTE||r.name!=="style"||r.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((t,e)=>{let o=r[e];return o==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(r,[t]){let{style:e}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let o of this.ft)t[o]==null&&(this.ft.delete(o),o.includes("-")?e.removeProperty(o):e[o]=null);for(let o in t){let s=t[o];if(s!=null){this.ft.add(o);let n=typeof s=="string"&&s.endsWith(Ae);o.includes("-")||n?e.setProperty(o,n?s.slice(0,-11):s,n?jt:""):e[o]=s}}return m}});var Se=/^#?(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i;var It="var(--card-background-color, #ffffff)";function we(r){let t=Se.exec(r.trim());if(!t)return null;let e=t[1]?t[1].split("").map(o=>o+o).join(""):t[2];return{r:Number.parseInt(e.slice(0,2),16),g:Number.parseInt(e.slice(2,4),16),b:Number.parseInt(e.slice(4,6),16)}}function ht(r){let t=r/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4}function Ce({r,g:t,b:e}){return .2126*ht(r)+.7152*ht(t)+.0722*ht(e)}function Kt(r){let t=we(r);return t&&Ce(t)>.179?"#0f172a":"#ffffff"}function Ft(r){return`color-mix(in srgb, ${r} 14%, ${It})`}function zt(r){return`color-mix(in srgb, ${r} 35%, ${It})`}var H=["mon","tue","wed","thu","fri","sat","sun"];function ft(r){return typeof r=="string"&&H.includes(r)}function yt(r,t){if(!Array.isArray(r))return[...t];let e=[];for(let o of r)ft(o)&&!e.includes(o)&&e.push(o);return e.length>0?e:[...t]}function qt(r,t){return t.days&&t.days.length>0?t.days:r.days}function Yt(r=new Date){return H[(r.getDay()+6)%7]}var mt={days:{mon:{full:"\u043F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A",short:"\u043F\u043D"},tue:{full:"\u0432\u0442\u043E\u0440\u043D\u0438\u043A",short:"\u0432\u0442"},wed:{full:"\u0441\u0440\u044F\u0434\u0430",short:"\u0441\u0440"},thu:{full:"\u0447\u0435\u0442\u0432\u044A\u0440\u0442\u044A\u043A",short:"\u0447\u0442"},fri:{full:"\u043F\u0435\u0442\u044A\u043A",short:"\u043F\u0442"},sat:{full:"\u0441\u044A\u0431\u043E\u0442\u0430",short:"\u0441\u0431"},sun:{full:"\u043D\u0435\u0434\u0435\u043B\u044F",short:"\u043D\u0434"}},until:r=>`\u0434\u043E ${r}`,after:r=>`\u0441\u043B\u0435\u0434 ${r}`,range:(r,t)=>`${r}\u2013${t}`,today:"\u0414\u043D\u0435\u0441",editor:{tabSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",tabActivities:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442\u0438",addPerson:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0447\u043E\u0432\u0435\u043A",removePerson:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438 \u0447\u043E\u0432\u0435\u043A",personNamePlaceholder:"\u041D\u043E\u0432 \u0447\u043E\u0432\u0435\u043A",title:"\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435",layout:"\u0418\u0437\u0433\u043B\u0435\u0434",layoutBlocks:"\u0411\u043B\u043E\u043A\u043E\u0432\u0435",layoutGrid:"\u041C\u0440\u0435\u0436\u0430",days:"\u0414\u043D\u0438",language:"\u0415\u0437\u0438\u043A",languageAuto:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E",languageEnglish:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",languageBulgarian:"\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",highlightToday:"\u041E\u0442\u0431\u0435\u043B\u044F\u0437\u0432\u0430\u0439 \u0434\u043D\u0435\u0448\u043D\u0438\u044F \u0434\u0435\u043D",headerColor:"\u0426\u0432\u044F\u0442 \u043D\u0430 \u0437\u0430\u0433\u043B\u0430\u0432\u043A\u0430\u0442\u0430",name:"\u0418\u043C\u0435",emoji:"\u0415\u043C\u043E\u0434\u0436\u0438",color:"\u0426\u0432\u044F\u0442",daysOverride:"\u0414\u043D\u0438 \u0437\u0430 \u0442\u043E\u0437\u0438 \u0447\u043E\u0432\u0435\u043A",daysOverrideHint:"\u041E\u0441\u0442\u0430\u0432\u0435\u0442\u0435 \u043F\u0440\u0430\u0437\u043D\u043E, \u0437\u0430 \u0434\u0430 \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442 \u0434\u043D\u0438\u0442\u0435 \u043D\u0430 \u043A\u0430\u0440\u0442\u0430\u0442\u0430",slots:"\u0427\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438",addSlot:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotColumn:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",addBlock:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0431\u043B\u043E\u043A",activity:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442",start:"\u041D\u0430\u0447\u0430\u043B\u043E",end:"\u041A\u0440\u0430\u0439",slot:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotNone:"\u0418\u0437\u0432\u044A\u043D \u043C\u0440\u0435\u0436\u0430\u0442\u0430",moveUp:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0433\u043E\u0440\u0435",moveDown:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0434\u043E\u043B\u0443",remove:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438",dragHint:"\u0412\u043B\u0430\u0447\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442 \u0432\u044A\u0440\u0445\u0443 \u0434\u0435\u043D \u0438\u043B\u0438 \u044F \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0438 \u0441\u043B\u0435\u0434 \u0442\u043E\u0432\u0430 \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0434\u0435\u043D\u044F",label:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",addActivity:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activityInUse:(r,t)=>`\u201E${r}\u201C \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430 \u0432 ${t} ${t===1?"\u0431\u043B\u043E\u043A":"\u0431\u043B\u043E\u043A\u0430"}.`,confirmRemoveActivity:"\u0414\u0430 \u0441\u0435 \u043F\u0440\u0435\u043C\u0430\u0445\u043D\u0435 \u043B\u0438 \u0432\u044A\u043F\u0440\u0435\u043A\u0438 \u0442\u043E\u0432\u0430?",noSlots:"\u0414\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0447\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438, \u0437\u0430 \u0434\u0430 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442\u0435 \u0438\u0437\u0433\u043B\u0435\u0434\u0430 \u201E\u041C\u0440\u0435\u0436\u0430\u201C.",noBlocks:"\u041D\u044F\u043C\u0430 \u0437\u0430\u043D\u0438\u043C\u0430\u043D\u0438\u044F",orphanActivity:"\u041D\u0435\u043F\u043E\u0437\u043D\u0430\u0442\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442"}};var gt={days:{mon:{full:"Monday",short:"Mon"},tue:{full:"Tuesday",short:"Tue"},wed:{full:"Wednesday",short:"Wed"},thu:{full:"Thursday",short:"Thu"},fri:{full:"Friday",short:"Fri"},sat:{full:"Saturday",short:"Sat"},sun:{full:"Sunday",short:"Sun"}},until:r=>`until ${r}`,after:r=>`after ${r}`,range:(r,t)=>`${r}\u2013${t}`,today:"Today",editor:{tabSettings:"Settings",tabActivities:"Activities",addPerson:"Add person",removePerson:"Remove person",personNamePlaceholder:"New person",title:"Title",layout:"Layout",layoutBlocks:"Blocks",layoutGrid:"Grid",days:"Days",language:"Language",languageAuto:"Automatic",languageEnglish:"English",languageBulgarian:"Bulgarian",highlightToday:"Highlight today",headerColor:"Header colour",name:"Name",emoji:"Emoji",color:"Colour",daysOverride:"Days for this person",daysOverrideHint:"Leave empty to use the card's days",slots:"Time slots",addSlot:"Add slot",slotColumn:"Slot",addBlock:"Add block",activity:"Activity",start:"Start",end:"End",slot:"Slot",slotNone:"Not on the grid",moveUp:"Move up",moveDown:"Move down",remove:"Remove",dragHint:"Drag an activity onto a day, or tap it and then tap a day",label:"Label",addActivity:"Add activity",activityInUse:(r,t)=>`\u201C${r}\u201D is used by ${t} block${t===1?"":"s"}.`,confirmRemoveActivity:"Remove it anyway?",noSlots:"Add time slots to use the grid layout.",noBlocks:"Nothing scheduled",orphanActivity:"Unknown activity"}};function G(r,t){return r.language==="en"||r.language==="bg"?r.language:(t?.language??"en").toLowerCase().startsWith("bg")?"bg":"en"}function Vt(r){return r==="bg"?mt:gt}var X="custom:weekly-timetable-card",Z=["mon","tue","wed","thu","fri"],Wt="#1e3a5f",Ee="#888888";function J(r){if(typeof r=="number"&&Number.isFinite(r)&&r>=0){let e=Math.floor(r/60),o=r%60;return`${String(e).padStart(2,"0")}:${String(o).padStart(2,"0")}`}if(typeof r!="string")return;let t=r.trim();return t.length>0?t:void 0}function Gt(r){let t=r??{};if(!Array.isArray(t.people)||t.people.length===0)throw new Error("weekly-timetable-card: `people` must be a non-empty list");if(t.activities!==void 0&&!Array.isArray(t.activities))throw new Error("weekly-timetable-card: `activities` must be a list");let e=yt(t.days,Z),o=(Array.isArray(t.activities)?t.activities:[]).map(ke).filter(n=>n!==null),s=t.people.map(n=>Re(n,e));return{type:typeof t.type=="string"?t.type:X,title:typeof t.title=="string"?t.title:void 0,layout:t.layout==="grid"?"grid":"blocks",days:e,language:t.language==="en"||t.language==="bg"?t.language:"auto",highlight_today:t.highlight_today!==!1,header_color:typeof t.header_color=="string"&&t.header_color.trim().length>0?t.header_color.trim():Wt,activities:o,people:s}}function ke(r){let t=r??{},e=typeof t.id=="string"?t.id.trim():"";if(e.length===0)return null;let o=typeof t.label=="string"&&t.label.trim().length>0?t.label.trim():e,s=typeof t.color=="string"&&t.color.trim().length>0?t.color.trim():Ee;return{id:e,label:o,color:s}}function Re(r,t){let e=r??{},o=Array.isArray(e.days)?yt(e.days,t):void 0,s=o??t,n=e.schedule??{},i={},l=new Set(s);for(let p of Object.keys(n))ft(p)&&l.add(p);for(let p of H){if(!l.has(p))continue;let c=n[p];i[p]=Array.isArray(c)?c.map(Te).filter(f=>f!==null):[]}let a=Array.isArray(e.slots)?e.slots.map((p,c)=>De(p,c)).filter(p=>p!==null):void 0,u={name:typeof e.name=="string"?e.name:"",schedule:i};return typeof e.emoji=="string"&&e.emoji.length>0&&(u.emoji=e.emoji),typeof e.color=="string"&&e.color.trim().length>0&&(u.color=e.color.trim()),o&&(u.days=o),a&&(u.slots=a),u}function Te(r){let t=r??{};if(typeof t.activity!="string"||t.activity.trim().length===0)return null;let e={activity:t.activity.trim()},o=J(t.start),s=J(t.end);return o&&(e.start=o),s&&(e.end=s),e}function De(r,t){let e=r??{},o=J(e.start),s=J(e.end);return!o||!s?null:{slot:typeof e.slot=="number"&&Number.isFinite(e.slot)?e.slot:t+1,start:o,end:s}}var Pe={en:[{id:"english",label:"English",color:"#3b82f6"},{id:"daycare",label:"After-school club",color:"#64748b"},{id:"break",label:"Break and a snack",color:"#94a3b8"},{id:"judo",label:"Judo",color:"#f97316"},{id:"chess",label:"Chess",color:"#a855f7"},{id:"home",label:"Back home",color:"#22c55e"}],bg:[{id:"english",label:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",color:"#3b82f6"},{id:"daycare",label:"\u0417\u0430\u043D\u0438\u043C\u0430\u043B\u043D\u044F",color:"#64748b"},{id:"break",label:"\u041F\u043E\u0447\u0438\u0432\u043A\u0430 \u0438 \u0445\u0430\u043F\u0432\u0430\u043D\u0435",color:"#94a3b8"},{id:"judo",label:"\u0414\u0436\u0443\u0434\u043E",color:"#f97316"},{id:"chess",label:"\u0428\u0430\u0445",color:"#a855f7"},{id:"home",label:"\u0412\u0440\u044A\u0449\u0430\u043D\u0435 \u0432\u043A\u044A\u0449\u0438",color:"#22c55e"}]},Le={en:"Alex",bg:"\u0418\u0432\u0430\u043D"};function Jt(r){let t=G({language:"auto"},r),e=o=>[{activity:"english",start:"15:20",end:"16:20"},{activity:"break",start:"16:20",end:"17:30"},{activity:o,start:"17:30",end:"18:30"},{activity:"home",start:"18:30"}];return{type:X,title:void 0,layout:"blocks",days:[...Z],language:"auto",highlight_today:!0,header_color:Wt,activities:Pe[t].map(o=>({...o})),people:[{name:Le[t],emoji:"\u{1F94B}",color:"#f472b6",schedule:{mon:e("judo"),tue:[{activity:"daycare",end:"16:00"}],wed:e("judo"),thu:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}],fri:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}]}}]}}function Xt(r,t){if(t<=0||r<=0)return"stacked";let e=r/t;return e>=110?"full":e>=72?"compact":"stacked"}function Zt(r,t){return r.find(e=>e.id===t)}function Q(r){let t=!!r.start,e=!!r.end;return t&&e?"range":e?"until":t?"after":"bare"}var Ne=/^(\d{1,2}):(\d{2})$/;function Qt(r){try{return new Intl.DateTimeFormat(r,{hour:"numeric"}).formatToParts(new Date(2020,0,1,13,0)).some(e=>e.type==="dayPeriod")}catch{return!1}}var Oe={en:"en-GB",bg:"bg"};function bt(r,t){return r?.language??Oe[t]}function Be(r,t){let e=r?.locale?.time_format;if(e==="12")return!0;if(e==="24")return!1;if(e==="system"){let o=typeof navigator>"u"?void 0:navigator.language;return Qt(o??bt(r,t))}return Qt(bt(r,t))}function M(r,t,e){let o=r.trim(),s=Ne.exec(o);if(!s)return o;let n=Number(s[1]),i=Number(s[2]);if(n>23||i>59)return o;if(!Be(t,e))return`${String(n).padStart(2,"0")}:${s[2]}`;try{return new Intl.DateTimeFormat(bt(t,e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(new Date(2020,0,1,n,i))}catch{return o}}function He(r,t){let e=o=>M(o,r.hass,r.lang);switch(Q(t)){case"range":return r.strings.range(e(t.start),e(t.end));case"until":return r.strings.until(e(t.end));case"after":return r.strings.after(e(t.start));case"bare":return""}}function U(r,t){let e=Zt(r.config.activities,t.activity),o=He(r,t),s=e?{"--wtc-block-fill":Ft(e.color),"--wtc-block-border":zt(e.color)}:{};return h`
    <div
      class="block ${e?"":"orphan"}"
      style=${g(s)}
      title=${e?d:r.strings.editor.orphanActivity}
    >
      ${o?h`<div class="block-time">${o}</div>`:d}
      <div class="block-label">${e?e.label:t.activity}</div>
    </div>
  `}function vt(r,t){let e=r.strings.days[t];return r.density==="compact"?e.short:e.full}function te(r){return h`
    <div class="week" style=${g({"--wtc-day-count":String(r.days.length)})}>
      ${r.days.map(t=>Me(r,t))}
    </div>
  `}function Me(r,t){let e=r.person.schedule[t]??[];return h`
    <section class="day ${r.today===t?"today":""}">
      <header class="day-head">${vt(r,t)}</header>
      <div class="day-body">
        ${e.length>0?e.map(o=>U(r,o)):h`<div class="empty">${r.strings.editor.noBlocks}</div>`}
      </div>
    </section>
  `}function ee(r){let{config:t,hass:e,density:o,now:s}=r,n=Math.min(Math.max(r.personIndex,0),t.people.length-1),i=t.people[n],l=G(t,e);return{config:t,person:i,days:qt(t,i),strings:Vt(l),lang:l,hass:e,density:o,today:t.highlight_today?Yt(s):null}}function re(r,t){let e=new Map,o=[];for(let s of t){let n=Q(s)==="range"?r.find(l=>l.start===s.start&&l.end===s.end):void 0;if(!n){o.push(s);continue}let i=e.get(n.slot);i?i.push(s):e.set(n.slot,[s])}return{bySlot:e,loose:o}}function oe(r){let t=[...r.person.slots??[]].sort((n,i)=>n.slot-i.slot),e=new Map;for(let n of r.days)e.set(n,re(t,r.person.schedule[n]??[]));let o=r.days.some(n=>e.get(n).loose.length>0),s=g({"--wtc-day-count":String(r.days.length)});return h`
    <div>
      ${o?h`
            <div class="strip" style=${s}>
              <div class="strip-label"></div>
              ${r.days.map(n=>h`
                  <div class="strip-cell">
                    ${e.get(n).loose.map(i=>U(r,i))}
                  </div>
                `)}
            </div>
          `:d}
      ${t.length===0?h`<div class="no-slots">${r.strings.editor.noSlots}</div>`:h`
            <div class="grid" style=${s}>
              <div class="grid-corner"></div>
              ${r.days.map(n=>h`<div class="grid-head">${vt(r,n)}</div>`)}
              ${t.flatMap(n=>[h`
                  <div class="slot-label">
                    ${r.strings.range(M(n.start,r.hass,r.lang),M(n.end,r.hass,r.lang))}
                  </div>
                `,...r.days.map(i=>h`
                    <div class="grid-cell ${r.today===i?"today":""}">
                      ${(e.get(i).bySlot.get(n.slot)??[]).map(l=>U(r,l))}
                    </div>
                  `)])}
            </div>
          `}
    </div>
  `}var Ue=F`
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
`,se=F`
  ${Ue}

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
`;var ne="0.1.0";var b=class extends _{constructor(){super(...arguments);this.density="full";this._personIndex=0}static getStubConfig(e){return Jt(e)}static getLayoutOptions(){return{grid_columns:"full",grid_rows:"auto"}}setConfig(e){this._config=Gt(e),this._personIndex=Math.min(this._personIndex,this._config.people.length-1)}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),!(typeof ResizeObserver>"u")&&(this._observer=new ResizeObserver(e=>{let o=e[0]?.contentRect.width??0,s=Xt(o,this._dayCount());s!==this.density&&(this.density=s)}),this._observer.observe(this))}disconnectedCallback(){this._observer?.disconnect(),this._observer=void 0,super.disconnectedCallback()}_dayCount(){let e=this._config;return e?(e.people[Math.min(this._personIndex,e.people.length-1)]?.days??e.days).length:Z.length}render(){let e=this._config;if(!e)return d;let o=ee({config:e,personIndex:this._personIndex,hass:this.hass,density:this.density}),s=this.density==="stacked"||e.layout==="blocks"?te(o):oe(o),n=g({"--wtc-header-color":e.header_color,"--wtc-header-text":Kt(e.header_color),"--wtc-accent":o.person.color??"var(--primary-color)"});return h`
      <ha-card style=${n}>
        ${e.title?h`<h1 class="card-title">${e.title}</h1>`:d}
        ${e.people.length>1?this._renderTabs(e):d}
        <div class="body" data-density=${this.density}>${s}</div>
      </ha-card>
    `}_renderTabs(e){return h`
      <div class="tabs" role="tablist">
        ${e.people.map((o,s)=>h`
            <button
              class="tab"
              role="tab"
              type="button"
              aria-selected=${s===this._personIndex?"true":"false"}
              style=${g({"--wtc-accent":o.color??"var(--primary-color)"})}
              @click=${()=>{this._personIndex=s}}
            >
              ${o.emoji?h`<span>${o.emoji}</span>`:d}
              <span>${o.name}</span>
            </button>
          `)}
      </div>
    `}};b.styles=se,w([B({attribute:!1})],b.prototype,"hass",2),w([B({attribute:!1})],b.prototype,"density",2),w([ut()],b.prototype,"_config",2),w([ut()],b.prototype,"_personIndex",2),b=w([Ht("weekly-timetable-card")],b);console.info(`%c WEEKLY-TIMETABLE-CARD %c v${ne} `,"color:#fff;background:#1e3a5f;padding:2px 4px;border-radius:3px 0 0 3px","color:#1e3a5f;background:#e2e8f0;padding:2px 4px;border-radius:0 3px 3px 0");window.customCards=window.customCards??[];window.customCards.push({type:X,name:"Weekly Timetable Card",description:"Weekly timetable for one or more people, in English or Bulgarian",preview:!0,documentationURL:"https://github.com/kosio/weekly-timetable-card"});export{b as WeeklyTimetableCard};
