var Ie=Object.defineProperty;var Ke=Object.getOwnPropertyDescriptor;var g=(r,t,e,i)=>{for(var o=i>1?void 0:i?Ke(t,e):t,n=r.length-1,s;n>=0;n--)(s=r[n])&&(o=(i?s(t,e,o):s(o))||o);return i&&o&&Ie(t,e,o),o};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var X=globalThis,Z=X.ShadowRoot&&(X.ShadyCSS===void 0||X.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,gt=Symbol(),jt=new WeakMap,j=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==gt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(Z&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=jt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&jt.set(e,t))}return t}toString(){return this.cssText}},It=r=>new j(typeof r=="string"?r:r+"",void 0,gt),I=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((i,o,n)=>i+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+r[n+1],r[0]);return new j(e,r,gt)},Kt=(r,t)=>{if(Z)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),o=X.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=e.cssText,r.appendChild(i)}},yt=Z?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return It(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:Fe,defineProperty:ze,getOwnPropertyDescriptor:Ve,getOwnPropertyNames:We,getOwnPropertySymbols:qe,getPrototypeOf:Ye}=Object,Q=globalThis,Ft=Q.trustedTypes,Ge=Ft?Ft.emptyScript:"",Je=Q.reactiveElementPolyfillSupport,K=(r,t)=>r,F={toAttribute(r,t){switch(t){case Boolean:r=r?Ge:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},tt=(r,t)=>!Fe(r,t),zt={attribute:!0,type:String,converter:F,reflect:!1,useDefault:!1,hasChanged:tt};Symbol.metadata??=Symbol("metadata"),Q.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=zt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),o=this.getPropertyDescriptor(t,i,e);o!==void 0&&ze(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){let{get:o,set:n}=Ve(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:o,set(s){let a=o?.call(this);n?.call(this,s),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??zt}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;let t=Ye(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){let e=this.properties,i=[...We(e),...qe(e)];for(let o of i)this.createProperty(o,e[o])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,o]of e)this.elementProperties.set(i,o)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let o=this._$Eu(e,i);o!==void 0&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let o of i)e.unshift(yt(o))}else t!==void 0&&e.push(yt(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Kt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(o!==void 0&&i.reflect===!0){let n=(i.converter?.toAttribute!==void 0?i.converter:F).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){let i=this.constructor,o=i._$Eh.get(t);if(o!==void 0&&this._$Em!==o){let n=i.getPropertyOptions(o),s=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:F;this._$Em=o;let a=s.fromAttribute(e,n.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,i,o=!1,n){if(t!==void 0){let s=this.constructor;if(o===!1&&(n=this[t]),i??=s.getPropertyOptions(t),!((i.hasChanged??tt)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:n},s){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),n!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),o===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[o,n]of i){let{wrapped:s}=n,a=this[o];s!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[K("elementProperties")]=new Map,$[K("finalized")]=new Map,Je?.({ReactiveElement:$}),(Q.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Ct=globalThis,Vt=r=>r,et=Ct.trustedTypes,Wt=et?et.createPolicy("lit-html",{createHTML:r=>r}):void 0,Zt="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,Qt="?"+A,Xe=`<${Qt}>`,R=document,V=()=>R.createComment(""),W=r=>r===null||typeof r!="object"&&typeof r!="function",wt=Array.isArray,Ze=r=>wt(r)||typeof r?.[Symbol.iterator]=="function",vt=`[ 	
\f\r]`,z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qt=/-->/g,Yt=/>/g,E=RegExp(`>|${vt}(?:([^\\s"'>=/]+)(${vt}*=${vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Gt=/'/g,Jt=/"/g,te=/^(?:script|style|textarea|title)$/i,St=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),d=St(1),Br=St(2),Hr=St(3),x=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),Xt=new WeakMap,T=R.createTreeWalker(R,129);function ee(r,t){if(!wt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wt!==void 0?Wt.createHTML(t):t}var Qe=(r,t)=>{let e=r.length-1,i=[],o,n=t===2?"<svg>":t===3?"<math>":"",s=z;for(let a=0;a<e;a++){let l=r[a],c,p,h=-1,m=0;for(;m<l.length&&(s.lastIndex=m,p=s.exec(l),p!==null);)m=s.lastIndex,s===z?p[1]==="!--"?s=qt:p[1]!==void 0?s=Yt:p[2]!==void 0?(te.test(p[2])&&(o=RegExp("</"+p[2],"g")),s=E):p[3]!==void 0&&(s=E):s===E?p[0]===">"?(s=o??z,h=-1):p[1]===void 0?h=-2:(h=s.lastIndex-p[2].length,c=p[1],s=p[3]===void 0?E:p[3]==='"'?Jt:Gt):s===Jt||s===Gt?s=E:s===qt||s===Yt?s=z:(s=E,o=void 0);let y=s===E&&r[a+1].startsWith("/>")?" ":"";n+=s===z?l+Xe:h>=0?(i.push(c),l.slice(0,h)+Zt+l.slice(h)+A+y):l+A+(h===-2?a:y)}return[ee(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},q=class r{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let n=0,s=0,a=t.length-1,l=this.parts,[c,p]=Qe(t,e);if(this.el=r.createElement(c,i),T.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(o=T.nextNode())!==null&&l.length<a;){if(o.nodeType===1){if(o.hasAttributes())for(let h of o.getAttributeNames())if(h.endsWith(Zt)){let m=p[s++],y=o.getAttribute(h).split(A),J=/([.?@])?(.*)/.exec(m);l.push({type:1,index:n,name:J[2],strings:y,ctor:J[1]==="."?$t:J[1]==="?"?xt:J[1]==="@"?_t:M}),o.removeAttribute(h)}else h.startsWith(A)&&(l.push({type:6,index:n}),o.removeAttribute(h));if(te.test(o.tagName)){let h=o.textContent.split(A),m=h.length-1;if(m>0){o.textContent=et?et.emptyScript:"";for(let y=0;y<m;y++)o.append(h[y],V()),T.nextNode(),l.push({type:2,index:++n});o.append(h[m],V())}}}else if(o.nodeType===8)if(o.data===Qt)l.push({type:2,index:n});else{let h=-1;for(;(h=o.data.indexOf(A,h+1))!==-1;)l.push({type:7,index:n}),h+=A.length-1}n++}}static createElement(t,e){let i=R.createElement("template");return i.innerHTML=t,i}};function H(r,t,e=r,i){if(t===x)return t;let o=i!==void 0?e._$Co?.[i]:e._$Cl,n=W(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),n===void 0?o=void 0:(o=new n(r),o._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=o:e._$Cl=o),o!==void 0&&(t=H(r,o._$AS(r,t.values),o,i)),t}var bt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??R).importNode(e,!0);T.currentNode=o;let n=T.nextNode(),s=0,a=0,l=i[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new Y(n,n.nextSibling,this,t):l.type===1?c=new l.ctor(n,l.name,l.strings,this,t):l.type===6&&(c=new At(n,this,t)),this._$AV.push(c),l=i[++a]}s!==l?.index&&(n=T.nextNode(),s++)}return T.currentNode=R,o}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},Y=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=H(this,t,e),W(t)?t===u||t==null||t===""?(this._$AH!==u&&this._$AR(),this._$AH=u):t!==this._$AH&&t!==x&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ze(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==u&&W(this._$AH)?this._$AA.nextSibling.data=t:this.T(R.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,o=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=q.createElement(ee(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{let n=new bt(o,this),s=n.u(this.options);n.p(e),this.T(s),this._$AH=n}}_$AC(t){let e=Xt.get(t.strings);return e===void 0&&Xt.set(t.strings,e=new q(t)),e}k(t){wt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,o=0;for(let n of t)o===e.length?e.push(i=new r(this.O(V()),this.O(V()),this,this.options)):i=e[o],i._$AI(n),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=Vt(t).nextSibling;Vt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},M=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,n){this.type=1,this._$AH=u,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}_$AI(t,e=this,i,o){let n=this.strings,s=!1;if(n===void 0)t=H(this,t,e,0),s=!W(t)||t!==this._$AH&&t!==x,s&&(this._$AH=t);else{let a=t,l,c;for(t=n[0],l=0;l<n.length-1;l++)c=H(this,a[i+l],e,l),c===x&&(c=this._$AH[l]),s||=!W(c)||c!==this._$AH[l],c===u?t=u:t!==u&&(t+=(c??"")+n[l+1]),this._$AH[l]=c}s&&!o&&this.j(t)}j(t){t===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},$t=class extends M{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===u?void 0:t}},xt=class extends M{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==u)}},_t=class extends M{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}_$AI(t,e=this){if((t=H(this,t,e,0)??u)===x)return;let i=this._$AH,o=t===u&&i!==u||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==u&&(i===u||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},At=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){H(this,t)}};var tr=Ct.litHtmlPolyfillSupport;tr?.(q,Y),(Ct.litHtmlVersions??=[]).push("3.3.3");var re=(r,t,e)=>{let i=e?.renderBefore??t,o=i._$litPart$;if(o===void 0){let n=e?.renderBefore??null;i._$litPart$=o=new Y(t.insertBefore(V(),n),n,void 0,e??{})}return o._$AI(r),o};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var kt=globalThis,v=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=re(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};v._$litElement$=!0,v.finalized=!0,kt.litElementHydrateSupport?.({LitElement:v});var er=kt.litElementPolyfillSupport;er?.({LitElement:v});(kt.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var rt=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var rr={attribute:!0,type:String,converter:F,reflect:!1,hasChanged:tt},ir=(r=rr,t,e)=>{let{kind:i,metadata:o}=e,n=globalThis.litPropertyMetadata.get(o);if(n===void 0&&globalThis.litPropertyMetadata.set(o,n=new Map),i==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),i==="accessor"){let{name:s}=e;return{set(a){let l=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,l,r,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,r,a),a}}}if(i==="setter"){let{name:s}=e;return function(a){let l=this[s];t.call(this,a),this.requestUpdate(s,l,r,!0,a)}}throw Error("Unsupported decorator location: "+i)};function D(r){return(t,e)=>typeof e=="object"?ir(r,t,e):((i,o,n)=>{let s=o.hasOwnProperty(n);return o.constructor.createProperty(n,i),s?Object.getOwnPropertyDescriptor(o,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function O(r){return D({...r,state:!0,attribute:!1})}/**
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
 */var ie={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},oe=r=>(...t)=>({_$litDirective$:r,values:t}),ot=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ne="important",or=" !"+ne,b=oe(class extends ot{constructor(r){if(super(r),r.type!==ie.ATTRIBUTE||r.name!=="style"||r.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((t,e)=>{let i=r[e];return i==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(r,[t]){let{style:e}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let i of this.ft)t[i]==null&&(this.ft.delete(i),i.includes("-")?e.removeProperty(i):e[i]=null);for(let i in t){let o=t[i];if(o!=null){this.ft.add(i);let n=typeof o=="string"&&o.endsWith(or);i.includes("-")||n?e.setProperty(i,n?o.slice(0,-11):o,n?ne:""):e[i]=o}}return x}});var nr=/^#?(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i;var se="var(--card-background-color, #ffffff)";function ae(r){let t=nr.exec(r.trim());if(!t)return null;let e=t[1]?t[1].split("").map(i=>i+i).join(""):t[2];return{r:Number.parseInt(e.slice(0,2),16),g:Number.parseInt(e.slice(2,4),16),b:Number.parseInt(e.slice(4,6),16)}}function Et(r){let t=r/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4}function sr({r,g:t,b:e}){return .2126*Et(r)+.7152*Et(t)+.0722*Et(e)}function le(r){let t=ae(r);return t&&sr(t)>.179?"#0f172a":"#ffffff"}function nt(r){return`color-mix(in srgb, ${r} 14%, ${se})`}function st(r){return`color-mix(in srgb, ${r} 35%, ${se})`}function at(r,t){let e=ae(r);if(!e)return t;let i=o=>o.toString(16).padStart(2,"0");return`#${i(e.r)}${i(e.g)}${i(e.b)}`}var P=["mon","tue","wed","thu","fri","sat","sun"];function Tt(r){return typeof r=="string"&&P.includes(r)}function ce(r,t){if(!Array.isArray(r))return[...t];let e=[];for(let i of r)Tt(i)&&!e.includes(i)&&e.push(i);return e.length>0?e:[...t]}function de(r=new Date){return P[(r.getDay()+6)%7]}var ar={monday:0,tuesday:1,wednesday:2,thursday:3,friday:4,saturday:5,sunday:6};function ue(r){let t=r?.locale?.first_weekday,e=0;return t&&t!=="language"?e=ar[t]:t==="language"&&(e=lr(r?.language)?6:0),P.map((i,o)=>P[(o+e)%7])}function lr(r){return r?r.toLowerCase().startsWith("en-us"):!1}function pe(r,t,e){if(r.includes(t))return r.length<=1?r:r.filter(s=>s!==t);let i=s=>e.indexOf(s),o=r.findIndex(s=>i(s)>i(t)),n=[...r];return n.splice(o===-1?n.length:o,0,t),n}var Rt={days:{mon:{full:"\u043F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A",short:"\u043F\u043D"},tue:{full:"\u0432\u0442\u043E\u0440\u043D\u0438\u043A",short:"\u0432\u0442"},wed:{full:"\u0441\u0440\u044F\u0434\u0430",short:"\u0441\u0440"},thu:{full:"\u0447\u0435\u0442\u0432\u044A\u0440\u0442\u044A\u043A",short:"\u0447\u0442"},fri:{full:"\u043F\u0435\u0442\u044A\u043A",short:"\u043F\u0442"},sat:{full:"\u0441\u044A\u0431\u043E\u0442\u0430",short:"\u0441\u0431"},sun:{full:"\u043D\u0435\u0434\u0435\u043B\u044F",short:"\u043D\u0434"}},until:r=>`\u0434\u043E ${r}`,after:r=>`\u0441\u043B\u0435\u0434 ${r}`,range:(r,t)=>`${r}\u2013${t}`,untilWord:"\u0434\u043E",afterWord:"\u0441\u043B\u0435\u0434",today:"\u0414\u043D\u0435\u0441",editor:{tabSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",tabSchedule:"\u0420\u0430\u0437\u043F\u0438\u0441\u0430\u043D\u0438\u0435",tabActivities:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442\u0438",title:"\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435",layout:"\u0418\u0437\u0433\u043B\u0435\u0434",layoutBlocks:"\u0411\u043B\u043E\u043A\u043E\u0432\u0435",layoutGrid:"\u041C\u0440\u0435\u0436\u0430",days:"\u0414\u043D\u0438",language:"\u0415\u0437\u0438\u043A",languageAuto:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E",languageEnglish:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",languageBulgarian:"\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",highlightToday:"\u041E\u0442\u0431\u0435\u043B\u044F\u0437\u0432\u0430\u0439 \u0434\u043D\u0435\u0448\u043D\u0438\u044F \u0434\u0435\u043D",headerColor:"\u0426\u0432\u044F\u0442 \u043D\u0430 \u0437\u0430\u0433\u043B\u0430\u0432\u043A\u0430\u0442\u0430",slots:"\u0427\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438",addSlot:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotColumn:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",addBlock:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0431\u043B\u043E\u043A",addBlockNeedsActivity:"\u041F\u044A\u0440\u0432\u043E \u0434\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activity:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442",start:"\u041D\u0430\u0447\u0430\u043B\u043E",end:"\u041A\u0440\u0430\u0439",slot:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotNone:"\u0418\u0437\u0432\u044A\u043D \u043C\u0440\u0435\u0436\u0430\u0442\u0430",moveUp:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0433\u043E\u0440\u0435",moveDown:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0434\u043E\u043B\u0443",moveToDay:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u0432 \u0434\u0440\u0443\u0433 \u0434\u0435\u043D",clearTime:"\u0418\u0437\u0447\u0438\u0441\u0442\u0438 \u0442\u043E\u0437\u0438 \u0447\u0430\u0441 (\u0431\u043B\u043E\u043A\u044A\u0442 \u0441\u0442\u0430\u0432\u0430 \u043E\u0442\u0432\u043E\u0440\u0435\u043D)",remove:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438",placeHint:"\u0414\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442, \u0441\u043B\u0435\u0434 \u043A\u043E\u0435\u0442\u043E \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0434\u0435\u043D, \u0437\u0430 \u0434\u0430 \u044F \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u0435 \u0442\u0430\u043C",activityTitle:"\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435",activitySubtitle:"\u041F\u043E\u0434\u0437\u0430\u0433\u043B\u0430\u0432\u0438\u0435",newActivityTitle:"\u0418\u043C\u0435 \u043D\u0430 \u043D\u043E\u0432\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",addActivity:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activityInUse:(r,t)=>`\u201E${r}\u201C \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430 \u0432 ${t} ${t===1?"\u0431\u043B\u043E\u043A":"\u0431\u043B\u043E\u043A\u0430"}.`,confirmRemoveActivity:"\u0414\u0430 \u0441\u0435 \u043F\u0440\u0435\u043C\u0430\u0445\u043D\u0435 \u043B\u0438 \u0432\u044A\u043F\u0440\u0435\u043A\u0438 \u0442\u043E\u0432\u0430?",noSlots:"\u0414\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0447\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438, \u0437\u0430 \u0434\u0430 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442\u0435 \u0438\u0437\u0433\u043B\u0435\u0434\u0430 \u201E\u041C\u0440\u0435\u0436\u0430\u201C.",noBlocks:"\u041D\u044F\u043C\u0430 \u0437\u0430\u043D\u0438\u043C\u0430\u043D\u0438\u044F",orphanActivity:"\u041D\u0435\u043F\u043E\u0437\u043D\u0430\u0442\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442"}};var Dt={days:{mon:{full:"Monday",short:"Mon"},tue:{full:"Tuesday",short:"Tue"},wed:{full:"Wednesday",short:"Wed"},thu:{full:"Thursday",short:"Thu"},fri:{full:"Friday",short:"Fri"},sat:{full:"Saturday",short:"Sat"},sun:{full:"Sunday",short:"Sun"}},until:r=>`until ${r}`,after:r=>`after ${r}`,range:(r,t)=>`${r}\u2013${t}`,untilWord:"until",afterWord:"after",today:"Today",editor:{tabSettings:"Settings",tabSchedule:"Schedule",tabActivities:"Activities",title:"Title",layout:"Layout",layoutBlocks:"Blocks",layoutGrid:"Grid",days:"Days",language:"Language",languageAuto:"Automatic",languageEnglish:"English",languageBulgarian:"Bulgarian",highlightToday:"Highlight today",headerColor:"Header colour",slots:"Time slots",addSlot:"Add slot",slotColumn:"Slot",addBlock:"Add block",addBlockNeedsActivity:"Add an activity first",activity:"Activity",start:"Start",end:"End",slot:"Slot",slotNone:"Not on the grid",moveUp:"Move up",moveDown:"Move down",moveToDay:"Move to another day",clearTime:"Clear this time (makes the block open-ended)",remove:"Remove",placeHint:"Tap an activity, then tap a day to add it there",activityTitle:"Title",activitySubtitle:"Subtitle",newActivityTitle:"New activity name",addActivity:"Add activity",activityInUse:(r,t)=>`\u201C${r}\u201D is used by ${t} block${t===1?"":"s"}.`,confirmRemoveActivity:"Remove it anyway?",noSlots:"Add time slots to use the grid layout.",noBlocks:"Nothing scheduled",orphanActivity:"Unknown activity"}};function C(r,t){return r.language==="en"||r.language==="bg"?r.language:(t?.language??"en").toLowerCase().startsWith("bg")?"bg":"en"}function lt(r){return r==="bg"?Rt:Dt}var dt="custom:weekly-timetable-card",ut=["mon","tue","wed","thu","fri"],pt="#1e3a5f",cr="#888888";function ct(r){if(typeof r=="number"&&Number.isFinite(r)&&r>=0){let e=Math.floor(r/60),i=r%60;return`${String(e).padStart(2,"0")}:${String(i).padStart(2,"0")}`}if(typeof r!="string")return;let t=r.trim();return t.length>0?t:void 0}function ht(r){let t=r??{};if(t.people!==void 0)throw new Error("weekly-timetable-card: unknown key `people` \u2014 a card shows one timetable. Put `slots` and `schedule` at the top level.");if(t.activities!==void 0&&!Array.isArray(t.activities))throw new Error("weekly-timetable-card: `activities` must be a list");let e=ce(t.days,ut),i=(Array.isArray(t.activities)?t.activities:[]).map(dr).filter(c=>c!==null),o=t.schedule??{},n={},s=new Set(e);for(let c of Object.keys(o))Tt(c)&&s.add(c);for(let c of P){if(!s.has(c))continue;let p=o[c];n[c]=Array.isArray(p)?p.map(ur).filter(h=>h!==null):[]}let a=Array.isArray(t.slots)?t.slots.map((c,p)=>pr(c,p)).filter(c=>c!==null):void 0,l={type:typeof t.type=="string"?t.type:dt,title:typeof t.title=="string"?t.title:void 0,layout:t.layout==="grid"?"grid":"blocks",days:e,language:t.language==="en"||t.language==="bg"?t.language:"auto",highlight_today:t.highlight_today!==!1,header_color:typeof t.header_color=="string"&&t.header_color.trim().length>0?t.header_color.trim():pt,activities:i,schedule:n};return a&&(l.slots=a),l}function dr(r){let t=r??{},e=typeof t.id=="string"?t.id.trim():"";if(e.length===0)return null;typeof t.label=="string"&&typeof t.title!="string"&&console.warn(`weekly-timetable-card: activity "${e}" uses \`label\`, which is now \`title\`.`);let i=typeof t.title=="string"&&t.title.trim().length>0?t.title.trim():e,o=typeof t.color=="string"&&t.color.trim().length>0?t.color.trim():cr,n={id:e,title:i,color:o},s=typeof t.subtitle=="string"?t.subtitle.trim():"";return s.length>0&&(n.subtitle=s),n}function ur(r){let t=r??{};if(typeof t.activity!="string"||t.activity.trim().length===0)return null;let e={activity:t.activity.trim()},i=ct(t.start),o=ct(t.end);return i&&(e.start=i),o&&(e.end=o),e}function pr(r,t){let e=r??{},i=ct(e.start),o=ct(e.end);return!i||!o?null:{slot:typeof e.slot=="number"&&Number.isFinite(e.slot)?e.slot:t+1,start:i,end:o}}var hr={en:[{id:"english",title:"English",subtitle:"Room 12",color:"#3b82f6"},{id:"daycare",title:"After-school club",color:"#64748b"},{id:"break",title:"Break and a snack",color:"#94a3b8"},{id:"judo",title:"Judo",subtitle:"Sports hall",color:"#f97316"},{id:"chess",title:"Chess",color:"#a855f7"},{id:"home",title:"Back home",color:"#22c55e"}],bg:[{id:"english",title:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",subtitle:"\u0421\u0442\u0430\u044F 12",color:"#3b82f6"},{id:"daycare",title:"\u0417\u0430\u043D\u0438\u043C\u0430\u043B\u043D\u044F",color:"#64748b"},{id:"break",title:"\u041F\u043E\u0447\u0438\u0432\u043A\u0430 \u0438 \u0445\u0430\u043F\u0432\u0430\u043D\u0435",color:"#94a3b8"},{id:"judo",title:"\u0414\u0436\u0443\u0434\u043E",subtitle:"\u0421\u043F\u043E\u0440\u0442\u043D\u0430 \u0437\u0430\u043B\u0430",color:"#f97316"},{id:"chess",title:"\u0428\u0430\u0445",color:"#a855f7"},{id:"home",title:"\u0412\u0440\u044A\u0449\u0430\u043D\u0435 \u0432\u043A\u044A\u0449\u0438",color:"#22c55e"}]},fr="Sami";function he(r){let t=C({language:"auto"},r),e=i=>[{activity:"english",start:"15:20",end:"16:20"},{activity:"break",start:"16:20",end:"17:30"},{activity:i,start:"17:30",end:"18:30"},{activity:"home",start:"18:30"}];return{type:dt,title:fr,layout:"blocks",days:[...ut],language:"auto",highlight_today:!0,header_color:pt,activities:hr[t].map(i=>({...i})),schedule:{mon:e("judo"),tue:[{activity:"daycare",end:"16:00"}],wed:e("judo"),thu:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}],fri:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}]}}}function Pt(r,t){if(t<=0||r<=0)return"stacked";let e=r/t;return e>=150?"full":e>=72?"compact":"stacked"}var fe=I`
  .block {
    display: flex;
    align-items: baseline;
    gap: 8px;
    border-radius: 8px;
    padding: 8px 10px;
    text-align: left;
    /* Not a color-mix fallback. --wtc-block-fill carries a color-mix() value,
       and if a browser cannot resolve it the declaration below is invalid at
       computed-value time: background becomes the initial value (transparent),
       it does not revert to this one — the cascade already chose the later
       declaration. What this line does cover is a browser with no custom
       properties at all, where the var() below is unparseable and that whole
       declaration is dropped at parse time instead, leaving this one to apply. */
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
`,me=I`
  ${fe}

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
  /* Below the full threshold the two columns stop paying for themselves: a
     ~129px day column leaves the title about 35px, and it shreds into two or
     three characters per line. Stack the block internally instead — the time on
     one line, in reading order, above the text at full block width. Verified in
     the harness at 700px with seven days: all seven stay visible and titles wrap
     at word boundaries. The stacked tier is deliberately untouched; there each
     day has the card's full width, where two columns are the right shape. */
  [data-density="compact"] .block {
    flex-direction: column;
    align-items: stretch;
    padding: 5px 7px;
    gap: 2px;
  }
  [data-density="compact"] .block-time {
    display: flex;
    gap: 4px;
    text-align: left;
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
`,ge=I`
  ${fe}

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
`;var mr=/[^\p{L}\p{N}]+/gu,gr=/^-+|-+$/g;function yr(r){return r.toLowerCase().replace(mr,"-").replace(gr,"")}function ye(r,t){let e=yr(r)||"activity";if(!t.includes(e))return e;let i=2;for(;t.includes(`${e}-${i}`);)i+=1;return`${e}-${i}`}function w(r){return r.title.trim()||r.id}function ve(r,t){return r.find(e=>e.id===t)}var $e=/^(\d{1,2}):(\d{2})$/;function be(r){try{return new Intl.DateTimeFormat(r,{hour:"numeric"}).formatToParts(new Date(2020,0,1,13,0)).some(e=>e.type==="dayPeriod")}catch{return!1}}var vr={en:"en-GB",bg:"bg"};function Bt(r,t){return r?.language??vr[t]}function br(r,t){let e=r?.locale?.time_format;if(e==="12")return!0;if(e==="24")return!1;if(e==="system"){let i=typeof navigator>"u"?void 0:navigator.language;return be(i??Bt(r,t))}return be(Bt(r,t))}function N(r,t,e){let i=r.trim(),o=$e.exec(i);if(!o)return i;let n=Number(o[1]),s=Number(o[2]);if(n>23||s>59)return i;if(!br(t,e))return`${String(n).padStart(2,"0")}:${o[2]}`;try{return new Intl.DateTimeFormat(Bt(t,e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(new Date(2020,0,1,n,s))}catch{return i}}var Lt=24*60;function xe(r,t){let e=$e.exec(r.trim());if(!e)return r;let o=((Number(e[1])*60+Number(e[2])+t)%Lt+Lt)%Lt,n=Math.floor(o/60);return`${String(n).padStart(2,"0")}:${String(o%60).padStart(2,"0")}`}var $r="08:00",xr=45;function _e(r,t,e){return Math.min(Math.max(r,t),e)}function U(r,t){return r.schedule[t]??[]}function ft(r,t,e){return{...r,schedule:{...r.schedule,[t]:e}}}function L(r,t){return{...r,...t}}function Ht(r,t,e){return ft(r,t,[...U(r,t),{...e}])}function S(r,t,e,i){let o=r.schedule[t]?.[e];if(!o)return r;let n={...o};i.activity!==void 0&&(n.activity=i.activity),i.start!==void 0&&(i.start===null||i.start===""?delete n.start:n.start=i.start),i.end!==void 0&&(i.end===null||i.end===""?delete n.end:n.end=i.end);let s=U(r,t).map((a,l)=>l===e?n:a);return ft(r,t,s)}function Ae(r,t,e){if(!r.schedule[t]?.[e])return r;let i=U(r,t).filter((o,n)=>n!==e);return ft(r,t,i)}function Mt(r,t,e){let i=[...U(r,t.day)],o=i[t.index];if(!o)return r;if(i.splice(t.index,1),t.day===e.day)return i.splice(_e(e.index,0,i.length),0,o),ft(r,t.day,i);let n=[...U(r,e.day)];return n.splice(_e(e.index,0,n.length),0,o),{...r,schedule:{...r.schedule,[t.day]:i,[e.day]:n}}}function Ot(r,t,e,i){let o=e+i;return o<0||o>=U(r,t).length?r:Mt(r,{day:t,index:e},{day:t,index:o})}function Ce(r,t,e){let i=ye(t,r.activities.map(o=>o.id));return{...r,activities:[...r.activities,{id:i,title:t,color:e}]}}function mt(r,t,e){return r.activities[t]?{...r,activities:r.activities.map((i,o)=>o===t?{...i,...e}:i)}:r}function we(r,t){return r.activities[t]?{...r,activities:r.activities.filter((e,i)=>i!==t)}:r}function Se(r,t){let e=0;for(let i of Object.values(r.schedule))for(let o of i??[])o.activity===t&&(e+=1);return e}function ke(r){let t=r.slots??[],i=t[t.length-1]?.end??$r,o=t.reduce((n,s)=>Math.max(n,s.slot),0)+1;return{...r,slots:[...t,{slot:o,start:i,end:xe(i,xr)}]}}function Nt(r,t,e){return r.slots?.[t]?{...r,slots:r.slots.map((i,o)=>o===t?{...i,...e}:i)}:r}function Ee(r,t){return r.slots?.[t]?{...r,slots:r.slots.filter((e,i)=>i!==t)}:r}function f(r){return r.target.value}function Te(r){return r.target.checked}var Re="#64748b";function De(r){let{config:t,strings:e,commit:i}=r,o=(n,s)=>{let a=Se(t,s.id);if(a>0){let l=`${e.editor.activityInUse(w(s),a)} ${e.editor.confirmRemoveActivity}`;if(!window.confirm(l))return}i(we(t,n))};return d`
    <div class="panel">
      ${t.activities.map((n,s)=>d`
          <div class="row" data-activity=${n.id}>
            <input
              type="color"
              data-field="color"
              .value=${at(n.color,Re)}
              @change=${a=>i(mt(t,s,{color:f(a)}))}
            />
            <input
              class="grow"
              type="text"
              data-field="title"
              .value=${n.title}
              @change=${a=>i(mt(t,s,{title:f(a).trim()}))}
            />
            <input
              class="grow"
              type="text"
              data-field="subtitle"
              placeholder=${e.editor.activitySubtitle}
              .value=${n.subtitle??""}
              @change=${a=>i(mt(t,s,{subtitle:f(a).trim()}))}
            />
            <button
              class="icon-button"
              type="button"
              data-action="remove-activity"
              title=${e.editor.remove}
              @click=${()=>o(s,n)}
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
          @click=${n=>{let a=n.currentTarget.parentElement.querySelector('[data-field="new-title"]'),l=a.value.trim();l.length!==0&&(a.value="",i(Ce(t,l,Re)))}}
        >
          +
        </button>
      </div>

      <div class="palette">
        ${t.activities.map(n=>d`
            <div
              class="block"
              style=${b({"--wtc-block-fill":nt(n.color),"--wtc-block-border":st(n.color)})}
            >
              <div class="block-text">
                <div class="block-title">${w(n)}</div>
                ${n.subtitle?d`<div class="block-subtitle">${n.subtitle}</div>`:u}
              </div>
            </div>
          `)}
      </div>
    </div>
  `}function Pe(r,t,e){r.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}function B(r){let t=!!r.start,e=!!r.end;return t&&e?"range":e?"until":t?"after":"bare"}function Le(r,t){let e=i=>N(i,r.hass,r.lang);switch(B(t)){case"range":return r.strings.range(e(t.start),e(t.end));case"until":return r.strings.until(e(t.end));case"after":return r.strings.after(e(t.start));case"bare":return""}}function _r(r,t){let e=i=>N(i,r.hass,r.lang);switch(B(t)){case"range":return{top:e(t.start),bottom:e(t.end)};case"until":return{top:r.strings.untilWord,bottom:e(t.end)};case"after":return{top:r.strings.afterWord,bottom:e(t.start)};case"bare":return null}}function G(r,t,e){let i=ve(r.config.activities,t.activity),o=e?.hideTime===!0?null:_r(r,t),n=i?{"--wtc-block-fill":nt(i.color),"--wtc-block-border":st(i.color)}:{};return d`
    <div
      class=${i?"block":"block orphan"}
      style=${b(n)}
      title=${i?u:r.strings.editor.orphanActivity}
    >
      ${o?d`
            <div class="block-time">
              <div class="block-time-top">${o.top}</div>
              <div class="block-time-bottom">${o.bottom}</div>
            </div>
          `:u}
      <div class="block-text">
        <div class="block-title">${i?w(i):t.activity}</div>
        ${i?.subtitle?d`<div class="block-subtitle">${i.subtitle}</div>`:u}
      </div>
    </div>
  `}function Ar(r){return{strings:r.strings,hass:r.hass,lang:C(r.config,r.hass)}}function Be(r,t){let{config:e,strings:i}=r,o=e.days;return d`
    <div class="panel">
      ${e.layout==="grid"?Cr(r):u}

      <div class="palette">
        ${e.activities.map(n=>d`
            <button
              type="button"
              class="palette-chip"
              data-palette-activity=${n.id}
              aria-pressed=${t.selectedActivity===n.id?"true":"false"}
              @click=${()=>t.onSelectActivity(t.selectedActivity===n.id?null:n.id)}
            >
              ${w(n)}
            </button>
          `)}
      </div>
      <div class="hint">${i.editor.placeHint}</div>

      ${o.map(n=>wr(r,t,n))}
    </div>
  `}function Cr(r){let{config:t,strings:e,commit:i}=r,o=t.slots??[];return d`
    <div class="day-group" data-section="slots">
      <h4>${e.editor.slots}</h4>
      <div class="block-rows">
        ${o.map((n,s)=>d`
            <div class="row" data-slot-index=${s}>
              <span class="hint" style="width: 2rem">${n.slot}</span>
              <input
                type="time"
                data-field="slot-start"
                .value=${n.start}
                @change=${a=>i(Nt(t,s,{start:f(a)}))}
              />
              <input
                type="time"
                data-field="slot-end"
                .value=${n.end}
                @change=${a=>i(Nt(t,s,{end:f(a)}))}
              />
              <button
                class="icon-button"
                type="button"
                data-action="remove-slot"
                title=${e.editor.remove}
                @click=${()=>i(Ee(t,s))}
              >
                ×
              </button>
            </div>
          `)}
        <button
          class="chip"
          type="button"
          data-action="add-slot"
          @click=${()=>i(ke(t))}
        >
          ＋ ${e.editor.addSlot}
        </button>
      </div>
    </div>
  `}function wr(r,t,e){let{config:i,strings:o,commit:n}=r,s=i.schedule[e]??[],a=i.activities[0]?.id;return d`
    <div
      class="day-group"
      data-day=${e}
      @click=${()=>{t.selectedActivity&&(n(Ht(i,e,{activity:t.selectedActivity})),t.onSelectActivity(null))}}
    >
      <h4>${o.days[e].full}</h4>
      <div class="block-rows">
        ${s.map((l,c)=>Sr(r,t,e,l,c,s.length))}
        ${a?d`
              <button
                class="chip"
                type="button"
                data-action="add-block"
                @click=${l=>{l.stopPropagation(),n(Ht(i,e,{activity:a}))}}
              >
                ＋ ${o.editor.addBlock}
              </button>
            `:d`
              <button class="chip" type="button" data-action="add-block" disabled>
                ＋ ${o.editor.addBlock}
              </button>
              <div class="hint">${o.editor.addBlockNeedsActivity}</div>
            `}
      </div>
    </div>
  `}function Sr(r,t,e,i,o,n){let{config:s,strings:a,commit:l}=r;return d`
    <div class="row" data-block-index=${o} @click=${c=>c.stopPropagation()}>
      <select
        class="grow"
        data-field="activity"
        @change=${c=>l(S(s,e,o,{activity:f(c)}))}
      >
        ${s.activities.map(c=>d`
            <option value=${c.id} .selected=${c.id===i.activity}>
              ${w(c)}
            </option>
          `)}
        ${s.activities.some(c=>c.id===i.activity)?u:d`<option value=${i.activity} .selected=${!0}>${i.activity}</option>`}
      </select>

      <select
        data-field="day"
        title=${a.editor.moveToDay}
        @change=${c=>{let p=f(c);if(p===e)return;let h=(s.schedule[p]??[]).length;l(Mt(s,{day:e,index:o},{day:p,index:h}))}}
      >
        ${s.days.map(c=>d`
            <option value=${c} .selected=${c===e}>
              ${a.days[c].short}
            </option>
          `)}
      </select>

      ${s.layout==="grid"?kr(r,e,i,o,s.slots??[]):d`
            <input
              type="time"
              data-field="start"
              .value=${i.start??""}
              @change=${c=>l(S(s,e,o,{start:f(c)||null}))}
            />
            ${i.start?d`
                  <button
                    class="icon-button"
                    type="button"
                    data-action="clear-start"
                    title=${a.editor.clearTime}
                    @click=${()=>l(S(s,e,o,{start:null}))}
                  >
                    ⌫
                  </button>
                `:u}
            <input
              type="time"
              data-field="end"
              .value=${i.end??""}
              @change=${c=>l(S(s,e,o,{end:f(c)||null}))}
            />
            ${i.end?d`
                  <button
                    class="icon-button"
                    type="button"
                    data-action="clear-end"
                    title=${a.editor.clearTime}
                    @click=${()=>l(S(s,e,o,{end:null}))}
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
        ?disabled=${o===0}
        @click=${()=>l(Ot(s,e,o,-1))}
      >
        ↑
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="move-down"
        title=${a.editor.moveDown}
        ?disabled=${o>=n-1}
        @click=${()=>l(Ot(s,e,o,1))}
      >
        ↓
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="remove-block"
        title=${a.editor.remove}
        @click=${()=>l(Ae(s,e,o))}
      >
        ×
      </button>
    </div>
  `}function kr(r,t,e,i,o){let{config:n,strings:s,commit:a}=r,l=B(e)==="range"?o.find(p=>p.start===e.start&&p.end===e.end):void 0,c=l===void 0&&(e.start!==void 0||e.end!==void 0);return d`
    <select
      data-field="slot"
      @change=${p=>{let h=f(p);if(h===""){a(S(n,t,i,{start:null,end:null}));return}let m=o.find(y=>String(y.slot)===h);m&&a(S(n,t,i,{start:m.start,end:m.end}))}}
    >
      <option value="" .selected=${l===void 0}>${s.editor.slotNone}</option>
      ${o.map(p=>d`
          <option value=${String(p.slot)} .selected=${l?.slot===p.slot}>
            ${p.slot}. ${p.start}–${p.end}
          </option>
        `)}
    </select>
    ${c?d`<span class="hint">${Le(Ar(r),e)}</span>`:u}
  `}function He(r){let{config:t,strings:e,commit:i}=r,o=ue(r.hass);return d`
    <div class="panel">
      <label class="field">
        <span>${e.editor.title}</span>
        <input
          type="text"
          data-field="title"
          .value=${t.title??""}
          @change=${n=>i(L(t,{title:f(n)||void 0}))}
        />
      </label>

      <label class="field">
        <span>${e.editor.layout}</span>
        <select
          data-field="layout"
          @change=${n=>i(L(t,{layout:f(n)}))}
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
          ${o.map(n=>d`
              <button
                type="button"
                class="chip"
                data-day=${n}
                aria-pressed=${t.days.includes(n)?"true":"false"}
                @click=${()=>i(L(t,{days:pe(t.days,n,o)}))}
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
          @change=${n=>i(L(t,{language:f(n)}))}
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
          @change=${n=>i(L(t,{highlight_today:Te(n)}))}
        />
        <span>${e.editor.highlightToday}</span>
      </label>

      <label class="field inline">
        <input
          type="color"
          data-field="header_color"
          .value=${at(t.header_color,pt)}
          @change=${n=>i(L(t,{header_color:f(n)}))}
        />
        <span>${e.editor.headerColor}</span>
      </label>
    </div>
  `}var _=class extends v{constructor(){super(...arguments);this._tab="settings";this._selectedActivity=null}setConfig(e){this._config=ht(e),this._healSelection(this._config)}_healSelection(e){this._selectedActivity&&!e.activities.some(i=>i.id===this._selectedActivity)&&(this._selectedActivity=null)}_commit(e){this._config=e,this._healSelection(e),Pe(this,"config-changed",{config:e})}render(){let e=this._config;if(!e)return u;let i=lt(C(e,this.hass)),o={config:e,strings:i,hass:this.hass,commit:n=>this._commit(n)};return d`
      <div class="tabs" role="tablist">
        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="settings"
          aria-selected=${this._tab==="settings"?"true":"false"}
          @click=${()=>{this._tab="settings"}}
        >
          ${i.editor.tabSettings}
        </button>

        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="schedule"
          aria-selected=${this._tab==="schedule"?"true":"false"}
          @click=${()=>{this._tab="schedule"}}
        >
          ${i.editor.tabSchedule}
        </button>

        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="activities"
          aria-selected=${this._tab==="activities"?"true":"false"}
          @click=${()=>{this._tab="activities"}}
        >
          ${i.editor.tabActivities}
        </button>
      </div>

      ${this._renderPanel(o)}
    `}_renderPanel(e){return this._tab==="settings"?He(e):this._tab==="activities"?De(e):Be(e,{selectedActivity:this._selectedActivity,onSelectActivity:i=>{this._selectedActivity=i}})}};_.styles=ge,g([D({attribute:!1})],_.prototype,"hass",2),g([O()],_.prototype,"_config",2),g([O()],_.prototype,"_tab",2),g([O()],_.prototype,"_selectedActivity",2),_=g([rt("weekly-timetable-card-editor")],_);function Ut(r,t){let e=r.strings.days[t];return r.density==="compact"?e.short:e.full}function Me(r){return d`
    <div class="week" style=${b({"--wtc-day-count":String(r.days.length)})}>
      ${r.days.map(t=>Er(r,t))}
    </div>
  `}function Er(r,t){let e=r.config.schedule[t]??[];return d`
    <section class=${r.today===t?"day today":"day"}>
      <header class="day-head">${Ut(r,t)}</header>
      <div class="day-body">
        ${e.length>0?e.map(i=>G(r,i)):d`<div class="empty">${r.strings.editor.noBlocks}</div>`}
      </div>
    </section>
  `}function Oe(r){let{config:t,hass:e,density:i,now:o}=r,n=C(t,e);return{config:t,days:t.days,strings:lt(n),lang:n,hass:e,density:i,today:t.highlight_today?de(o):null}}function Ne(r,t){let e=new Map,i=[];for(let o of t){let n=B(o)==="range"?r.find(a=>a.start===o.start&&a.end===o.end):void 0;if(!n){i.push(o);continue}let s=e.get(n.slot);s?s.push(o):e.set(n.slot,[o])}return{bySlot:e,loose:i}}function Ue(r){let t=[...r.config.slots??[]].sort((s,a)=>s.slot-a.slot),e=new Map;for(let s of r.days)e.set(s,Ne(t,r.config.schedule[s]??[]));let i=r.days.some(s=>e.get(s).loose.length>0),o=b({"--wtc-day-count":String(r.days.length)}),n=r.days.map(s=>d`<div class=${r.today===s?"grid-head today":"grid-head"}>${Ut(r,s)}</div>`);return d`
    <div class="grid-wrap" style=${o}>
      ${t.length===0?d`
            <div class="grid-heads">
              <div class="grid-corner"></div>
              ${n}
            </div>
          `:u}
      ${i?d`
            <div class="strip">
              <div class="strip-label"></div>
              ${r.days.map(s=>d`
                  <div class="strip-cell">
                    ${e.get(s).loose.map(a=>G(r,a))}
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
                    ${r.strings.range(N(s.start,r.hass,r.lang),N(s.end,r.hass,r.lang))}
                  </div>
                `,...r.days.map(a=>d`
                    <div class=${r.today===a?"grid-cell today":"grid-cell"}>
                      ${(e.get(a).bySlot.get(s.slot)??[]).map(l=>G(r,l,{hideTime:!0}))}
                    </div>
                  `)])}
            </div>
          `}
    </div>
  `}var je="0.1.0";var k=class extends v{constructor(){super(...arguments);this.density="full";this._measuredWidth=0}static getConfigElement(){return document.createElement("weekly-timetable-card-editor")}static getStubConfig(e){return he(e)}static getLayoutOptions(){return{grid_columns:"full",grid_rows:"auto"}}setConfig(e){this._config=ht(e)}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),!(typeof ResizeObserver>"u")&&(this._observer=new ResizeObserver(e=>{let i=e[0]?.contentRect.width??0;this._measuredWidth=i;let o=Pt(i,this._dayCount());o!==this.density&&(this.density=o)}),this._observer.observe(this))}disconnectedCallback(){this._observer?.disconnect(),this._observer=void 0,super.disconnectedCallback()}willUpdate(e){if(super.willUpdate(e),this._measuredWidth<=0)return;let i=Pt(this._measuredWidth,this._dayCount());i!==this.density&&(this.density=i)}_dayCount(){return this._config?.days.length??ut.length}render(){let e=this._config;if(!e)return u;let i=Oe({config:e,hass:this.hass,density:this.density}),o=this.density==="stacked"||e.layout==="blocks"?Me(i):Ue(i),n=b({"--wtc-header-color":e.header_color,"--wtc-header-text":le(e.header_color)});return d`
      <ha-card style=${n}>
        ${e.title?d`<h1 class="card-title">${e.title}</h1>`:u}
        <div class="body" data-density=${this.density}>${o}</div>
      </ha-card>
    `}};k.styles=me,g([D({attribute:!1})],k.prototype,"hass",2),g([D({attribute:!1})],k.prototype,"density",2),g([O()],k.prototype,"_config",2),k=g([rt("weekly-timetable-card")],k);console.info(`%c WEEKLY-TIMETABLE-CARD %c v${je} `,"color:#fff;background:#1e3a5f;padding:2px 4px;border-radius:3px 0 0 3px","color:#1e3a5f;background:#e2e8f0;padding:2px 4px;border-radius:0 3px 3px 0");window.customCards=window.customCards??[];window.customCards.push({type:dt.replace(/^custom:/,""),name:"Weekly Timetable Card",description:"Weekly timetable in English or Bulgarian",preview:!0,documentationURL:"https://github.com/vmlinuz82/weekly-timetable-card"});export{k as WeeklyTimetableCard};
