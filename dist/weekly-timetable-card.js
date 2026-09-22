var Ge=Object.defineProperty;var We=Object.getOwnPropertyDescriptor;var g=(r,t,e,o)=>{for(var n=o>1?void 0:o?We(t,e):t,i=r.length-1,s;i>=0;i--)(s=r[i])&&(n=(o?s(t,e,n):s(n))||n);return o&&n&&Ge(t,e,n),n};/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ot=globalThis,nt=ot.ShadowRoot&&(ot.ShadyCSS===void 0||ot.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,At=Symbol(),Wt=new WeakMap,F=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==At)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(nt&&t===void 0){let o=e!==void 0&&e.length===1;o&&(t=Wt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&Wt.set(e,t))}return t}toString(){return this.cssText}},Xt=r=>new F(typeof r=="string"?r:r+"",void 0,At),z=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((o,n,i)=>o+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+r[i+1],r[0]);return new F(e,r,At)},Jt=(r,t)=>{if(nt)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let o=document.createElement("style"),n=ot.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=e.cssText,r.appendChild(o)}},Ct=nt?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let o of t.cssRules)e+=o.cssText;return Xt(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var{is:Xe,defineProperty:Je,getOwnPropertyDescriptor:Ze,getOwnPropertyNames:Qe,getOwnPropertySymbols:tr,getPrototypeOf:er}=Object,it=globalThis,Zt=it.trustedTypes,rr=Zt?Zt.emptyScript:"",or=it.reactiveElementPolyfillSupport,V=(r,t)=>r,q={toAttribute(r,t){switch(t){case Boolean:r=r?rr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},st=(r,t)=>!Xe(r,t),Qt={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:st};Symbol.metadata??=Symbol("metadata"),it.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Qt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let o=Symbol(),n=this.getPropertyDescriptor(t,o,e);n!==void 0&&Je(this.prototype,t,n)}}static getPropertyDescriptor(t,e,o){let{get:n,set:i}=Ze(this.prototype,t)??{get(){return this[e]},set(s){this[e]=s}};return{get:n,set(s){let a=n?.call(this);i?.call(this,s),this.requestUpdate(t,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qt}static _$Ei(){if(this.hasOwnProperty(V("elementProperties")))return;let t=er(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(V("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(V("properties"))){let e=this.properties,o=[...Qe(e),...tr(e)];for(let n of o)this.createProperty(n,e[n])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[o,n]of e)this.elementProperties.set(o,n)}this._$Eh=new Map;for(let[e,o]of this.elementProperties){let n=this._$Eu(e,o);n!==void 0&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)e.unshift(Ct(n))}else t!==void 0&&e.push(Ct(t));return e}static _$Eu(t,e){let o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Jt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){let o=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,o);if(n!==void 0&&o.reflect===!0){let i=(o.converter?.toAttribute!==void 0?o.converter:q).toAttribute(e,o.type);this._$Em=t,i==null?this.removeAttribute(n):this.setAttribute(n,i),this._$Em=null}}_$AK(t,e){let o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){let i=o.getPropertyOptions(n),s=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:q;this._$Em=n;let a=s.fromAttribute(e,i.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(t,e,o,n=!1,i){if(t!==void 0){let s=this.constructor;if(n===!1&&(i=this[t]),o??=s.getPropertyOptions(t),!((o.hasChanged??st)(i,e)||o.useDefault&&o.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:n,wrapped:i},s){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),i!==!0||s!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),n===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,i]of this._$Ep)this[n]=i;this._$Ep=void 0}let o=this.constructor.elementProperties;if(o.size>0)for(let[n,i]of o){let{wrapped:s}=i,a=this[n];s!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,i,a)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[V("elementProperties")]=new Map,x[V("finalized")]=new Map,or?.({ReactiveElement:x}),(it.reactiveElementVersions??=[]).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Tt=globalThis,te=r=>r,at=Tt.trustedTypes,ee=at?at.createPolicy("lit-html",{createHTML:r=>r}):void 0,ae="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,le="?"+k,nr=`<${le}>`,P=document,G=()=>P.createComment(""),W=r=>r===null||typeof r!="object"&&typeof r!="function",Rt=Array.isArray,ir=r=>Rt(r)||typeof r?.[Symbol.iterator]=="function",kt=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,re=/-->/g,oe=/>/g,S=RegExp(`>|${kt}(?:([^\\s"'>=/]+)(${kt}*=${kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ne=/'/g,ie=/"/g,ce=/^(?:script|style|textarea|title)$/i,Lt=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),p=Lt(1),Vr=Lt(2),qr=Lt(3),_=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),se=new WeakMap,E=P.createTreeWalker(P,129);function de(r,t){if(!Rt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ee!==void 0?ee.createHTML(t):t}var sr=(r,t)=>{let e=r.length-1,o=[],n,i=t===2?"<svg>":t===3?"<math>":"",s=Y;for(let a=0;a<e;a++){let l=r[a],c,u,d=-1,m=0;for(;m<l.length&&(s.lastIndex=m,u=s.exec(l),u!==null);)m=s.lastIndex,s===Y?u[1]==="!--"?s=re:u[1]!==void 0?s=oe:u[2]!==void 0?(ce.test(u[2])&&(n=RegExp("</"+u[2],"g")),s=S):u[3]!==void 0&&(s=S):s===S?u[0]===">"?(s=n??Y,d=-1):u[1]===void 0?d=-2:(d=s.lastIndex-u[2].length,c=u[1],s=u[3]===void 0?S:u[3]==='"'?ie:ne):s===ie||s===ne?s=S:s===re||s===oe?s=Y:(s=S,n=void 0);let y=s===S&&r[a+1].startsWith("/>")?" ":"";i+=s===Y?l+nr:d>=0?(o.push(c),l.slice(0,d)+ae+l.slice(d)+k+y):l+k+(d===-2?a:y)}return[de(r,i+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]},X=class r{constructor({strings:t,_$litType$:e},o){let n;this.parts=[];let i=0,s=0,a=t.length-1,l=this.parts,[c,u]=sr(t,e);if(this.el=r.createElement(c,o),E.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(n=E.nextNode())!==null&&l.length<a;){if(n.nodeType===1){if(n.hasAttributes())for(let d of n.getAttributeNames())if(d.endsWith(ae)){let m=u[s++],y=n.getAttribute(d).split(k),O=/([.?@])?(.*)/.exec(m);l.push({type:1,index:i,name:O[2],strings:y,ctor:O[1]==="."?St:O[1]==="?"?Et:O[1]==="@"?Pt:j}),n.removeAttribute(d)}else d.startsWith(k)&&(l.push({type:6,index:i}),n.removeAttribute(d));if(ce.test(n.tagName)){let d=n.textContent.split(k),m=d.length-1;if(m>0){n.textContent=at?at.emptyScript:"";for(let y=0;y<m;y++)n.append(d[y],G()),E.nextNode(),l.push({type:2,index:++i});n.append(d[m],G())}}}else if(n.nodeType===8)if(n.data===le)l.push({type:2,index:i});else{let d=-1;for(;(d=n.data.indexOf(k,d+1))!==-1;)l.push({type:7,index:i}),d+=k.length-1}i++}}static createElement(t,e){let o=P.createElement("template");return o.innerHTML=t,o}};function N(r,t,e=r,o){if(t===_)return t;let n=o!==void 0?e._$Co?.[o]:e._$Cl,i=W(t)?void 0:t._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(r),n._$AT(r,e,o)),o!==void 0?(e._$Co??=[])[o]=n:e._$Cl=n),n!==void 0&&(t=N(r,n._$AS(r,t.values),n,o)),t}var wt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:o}=this._$AD,n=(t?.creationScope??P).importNode(e,!0);E.currentNode=n;let i=E.nextNode(),s=0,a=0,l=o[0];for(;l!==void 0;){if(s===l.index){let c;l.type===2?c=new J(i,i.nextSibling,this,t):l.type===1?c=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(c=new Dt(i,this,t)),this._$AV.push(c),l=o[++a]}s!==l?.index&&(i=E.nextNode(),s++)}return E.currentNode=P,n}p(t){let e=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}},J=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,n){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=N(this,t,e),W(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==_&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ir(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&W(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:o}=t,n=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=X.createElement(de(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===n)this._$AH.p(e);else{let i=new wt(n,this),s=i.u(this.options);i.p(e),this.T(s),this._$AH=i}}_$AC(t){let e=se.get(t.strings);return e===void 0&&se.set(t.strings,e=new X(t)),e}k(t){Rt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,o,n=0;for(let i of t)n===e.length?e.push(o=new r(this.O(G()),this.O(G()),this,this.options)):o=e[n],o._$AI(i),n++;n<e.length&&(this._$AR(o&&o._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let o=te(t).nextSibling;te(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},j=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,n,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=h}_$AI(t,e=this,o,n){let i=this.strings,s=!1;if(i===void 0)t=N(this,t,e,0),s=!W(t)||t!==this._$AH&&t!==_,s&&(this._$AH=t);else{let a=t,l,c;for(t=i[0],l=0;l<i.length-1;l++)c=N(this,a[o+l],e,l),c===_&&(c=this._$AH[l]),s||=!W(c)||c!==this._$AH[l],c===h?t=h:t!==h&&(t+=(c??"")+i[l+1]),this._$AH[l]=c}s&&!n&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},St=class extends j{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},Et=class extends j{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},Pt=class extends j{constructor(t,e,o,n,i){super(t,e,o,n,i),this.type=5}_$AI(t,e=this){if((t=N(this,t,e,0)??h)===_)return;let o=this._$AH,n=t===h&&o!==h||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,i=t!==h&&(o===h||n);n&&this.element.removeEventListener(this.name,this,o),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},Dt=class{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t)}};var ar=Tt.litHtmlPolyfillSupport;ar?.(X,J),(Tt.litHtmlVersions??=[]).push("3.3.3");var pe=(r,t,e)=>{let o=e?.renderBefore??t,n=o._$litPart$;if(n===void 0){let i=e?.renderBefore??null;o._$litPart$=n=new J(t.insertBefore(G(),i),i,void 0,e??{})}return n._$AI(r),n};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Bt=globalThis,b=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=pe(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return _}};b._$litElement$=!0,b.finalized=!0,Bt.litElementHydrateSupport?.({LitElement:b});var lr=Bt.litElementPolyfillSupport;lr?.({LitElement:b});(Bt.litElementVersions??=[]).push("4.2.2");/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var lt=r=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(r,t)}):customElements.define(r,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var cr={attribute:!0,type:String,converter:q,reflect:!1,hasChanged:st},dr=(r=cr,t,e)=>{let{kind:o,metadata:n}=e,i=globalThis.litPropertyMetadata.get(n);if(i===void 0&&globalThis.litPropertyMetadata.set(n,i=new Map),o==="setter"&&((r=Object.create(r)).wrapped=!0),i.set(e.name,r),o==="accessor"){let{name:s}=e;return{set(a){let l=t.get.call(this);t.set.call(this,a),this.requestUpdate(s,l,r,!0,a)},init(a){return a!==void 0&&this.C(s,void 0,r,a),a}}}if(o==="setter"){let{name:s}=e;return function(a){let l=this[s];t.call(this,a),this.requestUpdate(s,l,r,!0,a)}}throw Error("Unsupported decorator location: "+o)};function D(r){return(t,e)=>typeof e=="object"?dr(r,t,e):((o,n,i)=>{let s=n.hasOwnProperty(i);return n.constructor.createProperty(i,o),s?Object.getOwnPropertyDescriptor(n,i):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function T(r){return D({...r,state:!0,attribute:!1})}/**
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
 */var ue={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},he=r=>(...t)=>({_$litDirective$:r,values:t}),dt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var fe="important",pr=" !"+fe,v=he(class extends dt{constructor(r){if(super(r),r.type!==ue.ATTRIBUTE||r.name!=="style"||r.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(r){return Object.keys(r).reduce((t,e)=>{let o=r[e];return o==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(r,[t]){let{style:e}=r.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(t)),this.render(t);for(let o of this.ft)t[o]==null&&(this.ft.delete(o),o.includes("-")?e.removeProperty(o):e[o]=null);for(let o in t){let n=t[o];if(n!=null){this.ft.add(o);let i=typeof n=="string"&&n.endsWith(pr);o.includes("-")||i?e.setProperty(o,i?n.slice(0,-11):n,i?fe:""):e[o]=n}}return _}});var ur=/^#?(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i;var me="var(--card-background-color, #ffffff)";function ye(r){let t=ur.exec(r.trim());if(!t)return null;let e=t[1]?t[1].split("").map(o=>o+o).join(""):t[2];return{r:Number.parseInt(e.slice(0,2),16),g:Number.parseInt(e.slice(2,4),16),b:Number.parseInt(e.slice(4,6),16)}}function Ht(r){let t=r/255;return t<=.03928?t/12.92:((t+.055)/1.055)**2.4}function hr({r,g:t,b:e}){return .2126*Ht(r)+.7152*Ht(t)+.0722*Ht(e)}function ge(r){let t=ye(r);return t&&hr(t)>.179?"#0f172a":"#ffffff"}function pt(r){return`color-mix(in srgb, ${r} 14%, ${me})`}function ut(r){return`color-mix(in srgb, ${r} 35%, ${me})`}function U(r,t){let e=ye(r);if(!e)return t;let o=n=>n.toString(16).padStart(2,"0");return`#${o(e.r)}${o(e.g)}${o(e.b)}`}var R=["mon","tue","wed","thu","fri","sat","sun"];function L(r){return typeof r=="string"&&R.includes(r)}function Mt(r,t){if(!Array.isArray(r))return[...t];let e=[];for(let o of r)L(o)&&!e.includes(o)&&e.push(o);return e.length>0?e:[...t]}function Z(r,t){return t.days&&t.days.length>0?t.days:r.days}function ve(r=new Date){return R[(r.getDay()+6)%7]}var fr={monday:0,tuesday:1,wednesday:2,thursday:3,friday:4,saturday:5,sunday:6};function ht(r){let t=r?.locale?.first_weekday,e=0;return t&&t!=="language"?e=fr[t]:t==="language"&&(e=mr(r?.language)?6:0),R.map((o,n)=>R[(n+e)%7])}function mr(r){return r?r.toLowerCase().startsWith("en-us"):!1}function ft(r,t,e){if(r.includes(t))return r.length<=1?r:r.filter(s=>s!==t);let o=s=>e.indexOf(s),n=r.findIndex(s=>o(s)>o(t)),i=[...r];return i.splice(n===-1?i.length:n,0,t),i}var Ot={days:{mon:{full:"\u043F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A",short:"\u043F\u043D"},tue:{full:"\u0432\u0442\u043E\u0440\u043D\u0438\u043A",short:"\u0432\u0442"},wed:{full:"\u0441\u0440\u044F\u0434\u0430",short:"\u0441\u0440"},thu:{full:"\u0447\u0435\u0442\u0432\u044A\u0440\u0442\u044A\u043A",short:"\u0447\u0442"},fri:{full:"\u043F\u0435\u0442\u044A\u043A",short:"\u043F\u0442"},sat:{full:"\u0441\u044A\u0431\u043E\u0442\u0430",short:"\u0441\u0431"},sun:{full:"\u043D\u0435\u0434\u0435\u043B\u044F",short:"\u043D\u0434"}},until:r=>`\u0434\u043E ${r}`,after:r=>`\u0441\u043B\u0435\u0434 ${r}`,range:(r,t)=>`${r}\u2013${t}`,today:"\u0414\u043D\u0435\u0441",editor:{tabSettings:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",tabActivities:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442\u0438",addPerson:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0447\u043E\u0432\u0435\u043A",removePerson:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438 \u0447\u043E\u0432\u0435\u043A",personNamePlaceholder:"\u041D\u043E\u0432 \u0447\u043E\u0432\u0435\u043A",title:"\u0417\u0430\u0433\u043B\u0430\u0432\u0438\u0435",layout:"\u0418\u0437\u0433\u043B\u0435\u0434",layoutBlocks:"\u0411\u043B\u043E\u043A\u043E\u0432\u0435",layoutGrid:"\u041C\u0440\u0435\u0436\u0430",days:"\u0414\u043D\u0438",language:"\u0415\u0437\u0438\u043A",languageAuto:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u043E",languageEnglish:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",languageBulgarian:"\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",highlightToday:"\u041E\u0442\u0431\u0435\u043B\u044F\u0437\u0432\u0430\u0439 \u0434\u043D\u0435\u0448\u043D\u0438\u044F \u0434\u0435\u043D",headerColor:"\u0426\u0432\u044F\u0442 \u043D\u0430 \u0437\u0430\u0433\u043B\u0430\u0432\u043A\u0430\u0442\u0430",name:"\u0418\u043C\u0435",emoji:"\u0415\u043C\u043E\u0434\u0436\u0438",color:"\u0426\u0432\u044F\u0442",daysOverride:"\u0414\u043D\u0438 \u0437\u0430 \u0442\u043E\u0437\u0438 \u0447\u043E\u0432\u0435\u043A",daysOverrideHint:"\u041E\u0441\u0442\u0430\u0432\u0435\u0442\u0435 \u043F\u0440\u0430\u0437\u043D\u043E, \u0437\u0430 \u0434\u0430 \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442 \u0434\u043D\u0438\u0442\u0435 \u043D\u0430 \u043A\u0430\u0440\u0442\u0430\u0442\u0430",slots:"\u0427\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438",addSlot:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotColumn:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",addBlock:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0431\u043B\u043E\u043A",addBlockNeedsActivity:"\u041F\u044A\u0440\u0432\u043E \u0434\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activity:"\u0414\u0435\u0439\u043D\u043E\u0441\u0442",start:"\u041D\u0430\u0447\u0430\u043B\u043E",end:"\u041A\u0440\u0430\u0439",slot:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B",slotNone:"\u0418\u0437\u0432\u044A\u043D \u043C\u0440\u0435\u0436\u0430\u0442\u0430",moveUp:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0433\u043E\u0440\u0435",moveDown:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u043D\u0430\u0434\u043E\u043B\u0443",moveToDay:"\u041F\u0440\u0435\u043C\u0435\u0441\u0442\u0438 \u0432 \u0434\u0440\u0443\u0433 \u0434\u0435\u043D",remove:"\u041F\u0440\u0435\u043C\u0430\u0445\u043D\u0438",dragHint:"\u0412\u043B\u0430\u0447\u0435\u0442\u0435 \u0434\u0435\u0439\u043D\u043E\u0441\u0442 \u0432\u044A\u0440\u0445\u0443 \u0434\u0435\u043D \u0438\u043B\u0438 \u044F \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0438 \u0441\u043B\u0435\u0434 \u0442\u043E\u0432\u0430 \u0434\u043E\u043A\u043E\u0441\u043D\u0435\u0442\u0435 \u0434\u0435\u043D\u044F",label:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435",newActivityLabel:"\u0418\u043C\u0435 \u043D\u0430 \u043D\u043E\u0432\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",addActivity:"\u0414\u043E\u0431\u0430\u0432\u0438 \u0434\u0435\u0439\u043D\u043E\u0441\u0442",activityInUse:(r,t)=>`\u201E${r}\u201C \u0441\u0435 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430 \u0432 ${t} ${t===1?"\u0431\u043B\u043E\u043A":"\u0431\u043B\u043E\u043A\u0430"}.`,confirmRemoveActivity:"\u0414\u0430 \u0441\u0435 \u043F\u0440\u0435\u043C\u0430\u0445\u043D\u0435 \u043B\u0438 \u0432\u044A\u043F\u0440\u0435\u043A\u0438 \u0442\u043E\u0432\u0430?",noSlots:"\u0414\u043E\u0431\u0430\u0432\u0435\u0442\u0435 \u0447\u0430\u0441\u043E\u0432\u0438 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0438, \u0437\u0430 \u0434\u0430 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u0442\u0435 \u0438\u0437\u0433\u043B\u0435\u0434\u0430 \u201E\u041C\u0440\u0435\u0436\u0430\u201C.",noBlocks:"\u041D\u044F\u043C\u0430 \u0437\u0430\u043D\u0438\u043C\u0430\u043D\u0438\u044F",orphanActivity:"\u041D\u0435\u043F\u043E\u0437\u043D\u0430\u0442\u0430 \u0434\u0435\u0439\u043D\u043E\u0441\u0442"}};var Nt={days:{mon:{full:"Monday",short:"Mon"},tue:{full:"Tuesday",short:"Tue"},wed:{full:"Wednesday",short:"Wed"},thu:{full:"Thursday",short:"Thu"},fri:{full:"Friday",short:"Fri"},sat:{full:"Saturday",short:"Sat"},sun:{full:"Sunday",short:"Sun"}},until:r=>`until ${r}`,after:r=>`after ${r}`,range:(r,t)=>`${r}\u2013${t}`,today:"Today",editor:{tabSettings:"Settings",tabActivities:"Activities",addPerson:"Add person",removePerson:"Remove person",personNamePlaceholder:"New person",title:"Title",layout:"Layout",layoutBlocks:"Blocks",layoutGrid:"Grid",days:"Days",language:"Language",languageAuto:"Automatic",languageEnglish:"English",languageBulgarian:"Bulgarian",highlightToday:"Highlight today",headerColor:"Header colour",name:"Name",emoji:"Emoji",color:"Colour",daysOverride:"Days for this person",daysOverrideHint:"Leave empty to use the card's days",slots:"Time slots",addSlot:"Add slot",slotColumn:"Slot",addBlock:"Add block",addBlockNeedsActivity:"Add an activity first",activity:"Activity",start:"Start",end:"End",slot:"Slot",slotNone:"Not on the grid",moveUp:"Move up",moveDown:"Move down",moveToDay:"Move to another day",remove:"Remove",dragHint:"Drag an activity onto a day, or tap it and then tap a day",label:"Label",newActivityLabel:"New activity name",addActivity:"Add activity",activityInUse:(r,t)=>`\u201C${r}\u201D is used by ${t} block${t===1?"":"s"}.`,confirmRemoveActivity:"Remove it anyway?",noSlots:"Add time slots to use the grid layout.",noBlocks:"Nothing scheduled",orphanActivity:"Unknown activity"}};function w(r,t){return r.language==="en"||r.language==="bg"?r.language:(t?.language??"en").toLowerCase().startsWith("bg")?"bg":"en"}function mt(r){return r==="bg"?Ot:Nt}var gt="custom:weekly-timetable-card",vt=["mon","tue","wed","thu","fri"],bt="#1e3a5f",yr="#888888";function yt(r){if(typeof r=="number"&&Number.isFinite(r)&&r>=0){let e=Math.floor(r/60),o=r%60;return`${String(e).padStart(2,"0")}:${String(o).padStart(2,"0")}`}if(typeof r!="string")return;let t=r.trim();return t.length>0?t:void 0}function $t(r){let t=r??{};if(!Array.isArray(t.people)||t.people.length===0)throw new Error("weekly-timetable-card: `people` must be a non-empty list");if(t.activities!==void 0&&!Array.isArray(t.activities))throw new Error("weekly-timetable-card: `activities` must be a list");let e=Mt(t.days,vt),o=(Array.isArray(t.activities)?t.activities:[]).map(gr).filter(i=>i!==null),n=t.people.map(i=>vr(i,e));return{type:typeof t.type=="string"?t.type:gt,title:typeof t.title=="string"?t.title:void 0,layout:t.layout==="grid"?"grid":"blocks",days:e,language:t.language==="en"||t.language==="bg"?t.language:"auto",highlight_today:t.highlight_today!==!1,header_color:typeof t.header_color=="string"&&t.header_color.trim().length>0?t.header_color.trim():bt,activities:o,people:n}}function gr(r){let t=r??{},e=typeof t.id=="string"?t.id.trim():"";if(e.length===0)return null;let o=typeof t.label=="string"&&t.label.trim().length>0?t.label.trim():e,n=typeof t.color=="string"&&t.color.trim().length>0?t.color.trim():yr;return{id:e,label:o,color:n}}function vr(r,t){let e=r??{},o=Array.isArray(e.days)?Mt(e.days,t):void 0,n=o??t,i=e.schedule??{},s={},a=new Set(n);for(let u of Object.keys(i))L(u)&&a.add(u);for(let u of R){if(!a.has(u))continue;let d=i[u];s[u]=Array.isArray(d)?d.map(br).filter(m=>m!==null):[]}let l=Array.isArray(e.slots)?e.slots.map((u,d)=>$r(u,d)).filter(u=>u!==null):void 0,c={name:typeof e.name=="string"?e.name:"",schedule:s};return typeof e.emoji=="string"&&e.emoji.length>0&&(c.emoji=e.emoji),typeof e.color=="string"&&e.color.trim().length>0&&(c.color=e.color.trim()),o&&(c.days=o),l&&(c.slots=l),c}function br(r){let t=r??{};if(typeof t.activity!="string"||t.activity.trim().length===0)return null;let e={activity:t.activity.trim()},o=yt(t.start),n=yt(t.end);return o&&(e.start=o),n&&(e.end=n),e}function $r(r,t){let e=r??{},o=yt(e.start),n=yt(e.end);return!o||!n?null:{slot:typeof e.slot=="number"&&Number.isFinite(e.slot)?e.slot:t+1,start:o,end:n}}var xr={en:[{id:"english",label:"English",color:"#3b82f6"},{id:"daycare",label:"After-school club",color:"#64748b"},{id:"break",label:"Break and a snack",color:"#94a3b8"},{id:"judo",label:"Judo",color:"#f97316"},{id:"chess",label:"Chess",color:"#a855f7"},{id:"home",label:"Back home",color:"#22c55e"}],bg:[{id:"english",label:"\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438",color:"#3b82f6"},{id:"daycare",label:"\u0417\u0430\u043D\u0438\u043C\u0430\u043B\u043D\u044F",color:"#64748b"},{id:"break",label:"\u041F\u043E\u0447\u0438\u0432\u043A\u0430 \u0438 \u0445\u0430\u043F\u0432\u0430\u043D\u0435",color:"#94a3b8"},{id:"judo",label:"\u0414\u0436\u0443\u0434\u043E",color:"#f97316"},{id:"chess",label:"\u0428\u0430\u0445",color:"#a855f7"},{id:"home",label:"\u0412\u0440\u044A\u0449\u0430\u043D\u0435 \u0432\u043A\u044A\u0449\u0438",color:"#22c55e"}]},_r={en:"Sami",bg:"Sami"};function be(r){let t=w({language:"auto"},r),e=o=>[{activity:"english",start:"15:20",end:"16:20"},{activity:"break",start:"16:20",end:"17:30"},{activity:o,start:"17:30",end:"18:30"},{activity:"home",start:"18:30"}];return{type:gt,title:void 0,layout:"blocks",days:[...vt],language:"auto",highlight_today:!0,header_color:bt,activities:xr[t].map(o=>({...o})),people:[{name:_r[t],emoji:"\u{1F94B}",color:"#f472b6",schedule:{mon:e("judo"),tue:[{activity:"daycare",end:"16:00"}],wed:e("judo"),thu:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}],fri:[{activity:"daycare",end:"16:00"},{activity:"break",start:"16:00",end:"16:30"},{activity:"chess",start:"16:30",end:"17:30"}]}}]}}function jt(r,t){if(t<=0||r<=0)return"stacked";let e=r/t;return e>=110?"full":e>=72?"compact":"stacked"}var $e=z`
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
`,xe=z`
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
`,_e=z`
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
`;var Ar=/[^\p{L}\p{N}]+/gu,Cr=/^-+|-+$/g;function kr(r){return r.toLowerCase().replace(Ar,"-").replace(Cr,"")}function Ae(r,t){let e=kr(r)||"activity";if(!t.includes(e))return e;let o=2;for(;t.includes(`${e}-${o}`);)o+=1;return`${e}-${o}`}function Ce(r,t){return r.find(e=>e.id===t)}var we=/^(\d{1,2}):(\d{2})$/;function ke(r){try{return new Intl.DateTimeFormat(r,{hour:"numeric"}).formatToParts(new Date(2020,0,1,13,0)).some(e=>e.type==="dayPeriod")}catch{return!1}}var wr={en:"en-GB",bg:"bg"};function Kt(r,t){return r?.language??wr[t]}function Sr(r,t){let e=r?.locale?.time_format;if(e==="12")return!0;if(e==="24")return!1;if(e==="system"){let o=typeof navigator>"u"?void 0:navigator.language;return ke(o??Kt(r,t))}return ke(Kt(r,t))}function Q(r,t,e){let o=r.trim(),n=we.exec(o);if(!n)return o;let i=Number(n[1]),s=Number(n[2]);if(i>23||s>59)return o;if(!Sr(t,e))return`${String(i).padStart(2,"0")}:${n[2]}`;try{return new Intl.DateTimeFormat(Kt(t,e),{hour:"numeric",minute:"2-digit",hour12:!0}).format(new Date(2020,0,1,i,s))}catch{return o}}var Ut=24*60;function Se(r,t){let e=we.exec(r.trim());if(!e)return r;let n=((Number(e[1])*60+Number(e[2])+t)%Ut+Ut)%Ut,i=Math.floor(n/60);return`${String(i).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`}var Er="08:00",Pr=45;function It(r,t,e){return Math.min(Math.max(r,t),e)}function $(r,t,e){return{...r,people:r.people.map((o,n)=>n===t?e:o)}}function B(r,t){return r.schedule[t]??[]}function tt(r,t,e){return{...r,schedule:{...r.schedule,[t]:e}}}function H(r,t){return{...r,...t}}function Ee(r,t){return{...r,people:[...r.people,{name:t,schedule:{}}]}}function Pe(r,t){return r.people.length<=1||!r.people[t]?r:{...r,people:r.people.filter((e,o)=>o!==t)}}function M(r,t,e){let o=r.people[t];if(!o)return r;let n={...o,schedule:{...o.schedule}};if(e.name!==void 0&&(n.name=e.name),e.emoji!==void 0&&(e.emoji===null||e.emoji===""?delete n.emoji:n.emoji=e.emoji),e.color!==void 0&&(e.color===null||e.color===""?delete n.color:n.color=e.color),e.slots!==void 0&&(e.slots===null?delete n.slots:n.slots=e.slots.map(i=>({...i}))),e.days!==void 0){e.days===null||e.days.length===0?delete n.days:n.days=[...e.days];for(let i of n.days??r.days)n.schedule[i]||(n.schedule[i]=[])}return $(r,t,n)}function Ft(r,t,e,o){let n=r.people[t];return n?$(r,t,tt(n,e,[...B(n,e),{...o}])):r}function K(r,t,e,o,n){let i=r.people[t],s=i?.schedule[e]?.[o];if(!i||!s)return r;let a={...s};n.activity!==void 0&&(a.activity=n.activity),n.start!==void 0&&(n.start===null||n.start===""?delete a.start:a.start=n.start),n.end!==void 0&&(n.end===null||n.end===""?delete a.end:a.end=n.end);let l=B(i,e).map((c,u)=>u===o?a:c);return $(r,t,tt(i,e,l))}function De(r,t,e,o){let n=r.people[t];if(!n||!n.schedule[e]?.[o])return r;let i=B(n,e).filter((s,a)=>a!==o);return $(r,t,tt(n,e,i))}function Te(r,t,e,o,n){let i=r.people[t];if(!i)return r;let s=[...B(i,e)];return s.splice(It(o,0,s.length),0,{...n}),$(r,t,tt(i,e,s))}function et(r,t,e,o){let n=r.people[t];if(!n)return r;let i=[...B(n,e.day)],s=i[e.index];if(!s)return r;if(i.splice(e.index,1),e.day===o.day)return i.splice(It(o.index,0,i.length),0,s),$(r,t,tt(n,e.day,i));let a=[...B(n,o.day)];return a.splice(It(o.index,0,a.length),0,s),$(r,t,{...n,schedule:{...n.schedule,[e.day]:i,[o.day]:a}})}function zt(r,t,e,o,n){let i=r.people[t];if(!i)return r;let s=o+n;return s<0||s>=B(i,e).length?r:et(r,t,{day:e,index:o},{day:e,index:s})}function Re(r,t,e){let o=Ae(t,r.activities.map(n=>n.id));return{...r,activities:[...r.activities,{id:o,label:t,color:e}]}}function Vt(r,t,e){return r.activities[t]?{...r,activities:r.activities.map((o,n)=>n===t?{...o,...e}:o)}:r}function Le(r,t){return r.activities[t]?{...r,activities:r.activities.filter((e,o)=>o!==t)}:r}function Be(r,t){let e=0;for(let o of r.people)for(let n of Object.values(o.schedule))for(let i of n??[])i.activity===t&&(e+=1);return e}function He(r,t){let e=r.people[t];if(!e)return r;let o=e.slots??[],i=o[o.length-1]?.end??Er,s=o.reduce((a,l)=>Math.max(a,l.slot),0)+1;return $(r,t,{...e,slots:[...o,{slot:s,start:i,end:Se(i,Pr)}]})}function qt(r,t,e,o){let n=r.people[t];return n?.slots?.[e]?$(r,t,{...n,slots:n.slots.map((i,s)=>s===e?{...i,...o}:i)}):r}function Me(r,t,e){let o=r.people[t];return o?.slots?.[e]?$(r,t,{...o,slots:o.slots.filter((n,i)=>i!==e)}):r}function f(r){return r.target.value}function xt(r){return r.target.checked}var Oe="#64748b";function Ne(r){let{config:t,strings:e,commit:o}=r,n=(i,s)=>{let a=Be(t,s.id);if(a>0){let l=`${e.editor.activityInUse(s.label,a)} ${e.editor.confirmRemoveActivity}`;if(!window.confirm(l))return}o(Le(t,i))};return p`
    <div class="panel">
      ${t.activities.map((i,s)=>p`
          <div class="row" data-activity=${i.id}>
            <input
              type="color"
              data-field="color"
              .value=${U(i.color,Oe)}
              @change=${a=>o(Vt(t,s,{color:f(a)}))}
            />
            <input
              class="grow"
              type="text"
              data-field="label"
              .value=${i.label}
              @change=${a=>o(Vt(t,s,{label:f(a)}))}
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
          @click=${i=>{let a=i.currentTarget.parentElement.querySelector('[data-field="new-label"]'),l=a.value.trim();l.length!==0&&(a.value="",o(Re(t,l,Oe)))}}
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
  `}var Dr=5;function Tr(r){let t=r&&r.nodeType!==Node.ELEMENT_NODE?r.parentElement:r,e=t?.closest("[data-drag-block]");if(e){let i=e.dataset.dragDay,s=Number(e.dataset.dragBlock);return L(i)&&Number.isInteger(s)&&s>=0?{kind:"block",day:i,index:s}:null}let n=t?.closest("[data-palette-activity]")?.dataset.paletteActivity;return n?{kind:"activity",activityId:n}:null}function Rr(r,t){for(let e=0;e<r.length;e+=1){let o=r[e];if(t<(o.top+o.bottom)/2)return e}return r.length}function Lr(r,t,e){return r.kind!=="block"||r.day!==t?e:e>r.index?e-1:e}var _t=class{constructor(t,e){this.getRoot=t;this.callbacks=e;this._source=null;this._origin={x:0,y:0};this._active=!1;this._hoverDay=null;this.onPointerDown=t=>{if(!t.isPrimary||t.button!==0)return;let e=Tr(t.target);e&&(this._source=e,this._origin={x:t.clientX,y:t.clientY},this._active=!1,window.addEventListener("pointermove",this._onPointerMove),window.addEventListener("pointerup",this._onPointerUp),window.addEventListener("pointercancel",this._onPointerCancel))};this._onPointerMove=t=>{if(!this._source)return;if(!this._active){let o=t.clientX-this._origin.x,n=t.clientY-this._origin.y;if(Math.hypot(o,n)<Dr)return;this._active=!0}t.preventDefault();let e=this._dayUnder(t.clientX,t.clientY);e!==this._hoverDay&&(this._hoverDay=e,this.callbacks.requestUpdate())};this._onPointerUp=t=>{let e=this._source,o=this._active;if(this._teardown(),!e||!o)return;let n=this._groupUnder(t.clientX,t.clientY),i=n?.dataset.day;if(!n||!L(i))return;let s=[...n.querySelectorAll("[data-block-index]")].map(l=>{let c=l.getBoundingClientRect();return{top:c.top,bottom:c.bottom}}),a=Lr(e,i,Rr(s,t.clientY));if(e.kind==="block"){this.callbacks.moveBlock({day:e.day,index:e.index},{day:i,index:a});return}this.callbacks.insertActivity(e.activityId,{day:i,index:a})};this._onPointerCancel=()=>{this._teardown()}}get active(){return this._active}get hoverDay(){return this._hoverDay}cancel(){this._teardown()}_teardown(){window.removeEventListener("pointermove",this._onPointerMove),window.removeEventListener("pointerup",this._onPointerUp),window.removeEventListener("pointercancel",this._onPointerCancel);let t=this._active||this._hoverDay!==null;this._source=null,this._active=!1,this._hoverDay=null,t&&this.callbacks.requestUpdate()}_groupUnder(t,e){return(this.getRoot()?.elementFromPoint?.(t,e)??(typeof document.elementFromPoint=="function"?document.elementFromPoint(t,e):null))?.closest("[data-day]")??null}_dayUnder(t,e){let o=this._groupUnder(t,e)?.dataset.day;return L(o)?o:null}};function je(r,t,e){r.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}function I(r){let t=!!r.start,e=!!r.end;return t&&e?"range":e?"until":t?"after":"bare"}function Yt(r,t){let e=o=>Q(o,r.hass,r.lang);switch(I(t)){case"range":return r.strings.range(e(t.start),e(t.end));case"until":return r.strings.until(e(t.end));case"after":return r.strings.after(e(t.start));case"bare":return""}}function rt(r,t){let e=Ce(r.config.activities,t.activity),o=Yt(r,t),n=e?{"--wtc-block-fill":pt(e.color),"--wtc-block-border":ut(e.color)}:{};return p`
    <div
      class=${e?"block":"block orphan"}
      style=${v(n)}
      title=${e?h:r.strings.editor.orphanActivity}
    >
      ${o?p`<div class="block-time">${o}</div>`:h}
      <div class="block-label">${e?e.label:t.activity}</div>
    </div>
  `}function Br(r){return{strings:r.strings,hass:r.hass,lang:w(r.config,r.hass)}}var Ue="#f472b6";function Ke(r,t){let{config:e,strings:o,commit:n}=r,{personIndex:i}=t,s=e.people[i];if(!s)return p``;let a=ht(r.hass),l=Z(e,s);return p`
    <div class="panel">
      <div class="row">
        <input
          type="text"
          class="grow"
          data-field="name"
          .value=${s.name}
          placeholder=${o.editor.personNamePlaceholder}
          @change=${c=>n(M(e,i,{name:f(c)}))}
        />
        <input
          type="text"
          data-field="emoji"
          style="width: 3.5rem"
          .value=${s.emoji??""}
          placeholder=${o.editor.emoji}
          @change=${c=>n(M(e,i,{emoji:f(c)||null}))}
        />
        <input
          type="color"
          data-field="person-color"
          .value=${U(s.color??Ue,Ue)}
          @change=${c=>n(M(e,i,{color:f(c)}))}
        />
        <button
          class="icon-button"
          type="button"
          data-action="clear-person-color"
          title=${o.editor.color}
          @click=${()=>n(M(e,i,{color:null}))}
        >
          ⌫
        </button>
        <button
          class="icon-button"
          type="button"
          data-action="remove-person"
          title=${o.editor.removePerson}
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
          @change=${c=>n(M(e,i,{days:xt(c)?[...e.days]:null}))}
        />
        <span>${o.editor.daysOverride}</span>
      </label>
      ${s.days===void 0?p`<div class="hint">${o.editor.daysOverrideHint}</div>`:p`
            <div class="chips">
              ${a.map(c=>p`
                  <button
                    type="button"
                    class="chip"
                    data-person-day=${c}
                    aria-pressed=${s.days.includes(c)?"true":"false"}
                    @click=${()=>n(M(e,i,{days:ft(s.days,c,a)}))}
                  >
                    ${o.days[c].short}
                  </button>
                `)}
            </div>
          `}

      ${e.layout==="grid"?Hr(r,i,s):h}

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
      <div class="hint">${o.editor.dragHint}</div>

      ${l.map(c=>Mr(r,t,s,c))}
    </div>
  `}function Hr(r,t,e){let{config:o,strings:n,commit:i}=r,s=e.slots??[];return p`
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
                @change=${c=>i(qt(o,t,l,{start:f(c)}))}
              />
              <input
                type="time"
                data-field="slot-end"
                .value=${a.end}
                @change=${c=>i(qt(o,t,l,{end:f(c)}))}
              />
              <button
                class="icon-button"
                type="button"
                data-action="remove-slot"
                title=${n.editor.remove}
                @click=${()=>i(Me(o,t,l))}
              >
                ×
              </button>
            </div>
          `)}
        <button
          class="chip"
          type="button"
          data-action="add-slot"
          @click=${()=>i(He(o,t))}
        >
          ＋ ${n.editor.addSlot}
        </button>
      </div>
    </div>
  `}function Mr(r,t,e,o){let{config:n,strings:i,commit:s}=r,{personIndex:a}=t,l=e.schedule[o]??[],c=n.activities[0]?.id;return p`
    <div
      class=${t.hoverDay===o?"day-group drop-target":"day-group"}
      data-day=${o}
      @click=${()=>{t.selectedActivity&&(s(Ft(n,a,o,{activity:t.selectedActivity})),t.onSelectActivity(null))}}
    >
      <h4>${i.days[o].full}</h4>
      <div class="block-rows">
        ${l.map((u,d)=>Or(r,t,o,u,d,l.length))}
        ${c?p`
              <button
                class="chip"
                type="button"
                data-action="add-block"
                @click=${u=>{u.stopPropagation(),s(Ft(n,a,o,{activity:c}))}}
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
  `}function Or(r,t,e,o,n,i){let{config:s,strings:a,commit:l}=r,{personIndex:c}=t,u=s.people[c];return p`
    <div class="row" data-block-index=${n} @click=${d=>d.stopPropagation()}>
      <span class="drag-handle" data-drag-block=${n} data-drag-day=${e}>⠿</span>
      <select
        class="grow"
        data-field="activity"
        @change=${d=>l(K(s,c,e,n,{activity:f(d)}))}
      >
        ${s.activities.map(d=>p`
            <option value=${d.id} .selected=${d.id===o.activity}>
              ${d.label}
            </option>
          `)}
        ${s.activities.some(d=>d.id===o.activity)?h:p`<option value=${o.activity} .selected=${!0}>${o.activity}</option>`}
      </select>

      <select
        data-field="day"
        title=${a.editor.moveToDay}
        @change=${d=>{let m=f(d);if(m===e)return;let y=(u.schedule[m]??[]).length;l(et(s,c,{day:e,index:n},{day:m,index:y}))}}
      >
        ${Z(s,u).map(d=>p`
            <option value=${d} .selected=${d===e}>
              ${a.days[d].short}
            </option>
          `)}
      </select>

      ${s.layout==="grid"?Nr(r,c,e,o,n,u.slots??[]):p`
            <input
              type="time"
              data-field="start"
              .value=${o.start??""}
              @change=${d=>l(K(s,c,e,n,{start:f(d)||null}))}
            />
            <input
              type="time"
              data-field="end"
              .value=${o.end??""}
              @change=${d=>l(K(s,c,e,n,{end:f(d)||null}))}
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
  `}function Nr(r,t,e,o,n,i){let{config:s,strings:a,commit:l}=r,c=I(o)==="range"?i.find(d=>d.start===o.start&&d.end===o.end):void 0,u=c===void 0&&(o.start!==void 0||o.end!==void 0);return p`
    <select
      data-field="slot"
      @change=${d=>{let m=f(d);if(m===""){l(K(s,t,e,n,{start:null,end:null}));return}let y=i.find(O=>String(O.slot)===m);y&&l(K(s,t,e,n,{start:y.start,end:y.end}))}}
    >
      <option value="" .selected=${c===void 0}>${a.editor.slotNone}</option>
      ${i.map(d=>p`
          <option value=${String(d.slot)} .selected=${c?.slot===d.slot}>
            ${d.slot}. ${d.start}–${d.end}
          </option>
        `)}
    </select>
    ${u?p`<span class="hint">${Yt(Br(r),o)}</span>`:h}
  `}function Ie(r){let{config:t,strings:e,commit:o}=r,n=ht(r.hass);return p`
    <div class="panel">
      <label class="field">
        <span>${e.editor.title}</span>
        <input
          type="text"
          data-field="title"
          .value=${t.title??""}
          @change=${i=>o(H(t,{title:f(i)||void 0}))}
        />
      </label>

      <label class="field">
        <span>${e.editor.layout}</span>
        <select
          data-field="layout"
          @change=${i=>o(H(t,{layout:f(i)}))}
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
                @click=${()=>o(H(t,{days:ft(t.days,i,n)}))}
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
          @change=${i=>o(H(t,{language:f(i)}))}
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
          @change=${i=>o(H(t,{highlight_today:xt(i)}))}
        />
        <span>${e.editor.highlightToday}</span>
      </label>

      <label class="field inline">
        <input
          type="color"
          data-field="header_color"
          .value=${U(t.header_color,bt)}
          @change=${i=>o(H(t,{header_color:f(i)}))}
        />
        <span>${e.editor.headerColor}</span>
      </label>
    </div>
  `}var A=class extends b{constructor(){super(...arguments);this._tab="settings";this._selectedActivity=null;this._dnd=new _t(()=>this.shadowRoot,{moveBlock:(e,o)=>{let n=this._config;!n||typeof this._tab!="object"||this._commit(et(n,this._tab.person,e,o))},insertActivity:(e,o)=>{let n=this._config;!n||typeof this._tab!="object"||this._commit(Te(n,this._tab.person,o.day,o.index,{activity:e}))},requestUpdate:()=>this.requestUpdate()})}setConfig(e){this._config=$t(e),typeof this._tab=="object"&&!this._config.people[this._tab.person]&&(this._tab="settings")}_commit(e){let o=this._config;this._config=e,typeof this._tab=="object"&&(!e.people[this._tab.person]||o!==void 0&&e.people.length<o.people.length)&&(this._tab="settings",this._selectedActivity=null),je(this,"config-changed",{config:e})}disconnectedCallback(){this._dnd.cancel(),super.disconnectedCallback()}render(){let e=this._config;if(!e)return h;let o=mt(w(e,this.hass)),n={config:e,strings:o,hass:this.hass,commit:i=>this._commit(i)};return p`
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
              ${i.emoji?`${i.emoji} `:""}${i.name||o.editor.personNamePlaceholder}
            </button>
          `)}

        <button
          class="tab"
          type="button"
          data-tab="add"
          title=${o.editor.addPerson}
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
          ${o.editor.tabActivities}
        </button>
      </div>

      <div @pointerdown=${this._dnd.onPointerDown}>${this._renderPanel(n)}</div>
    `}_renderPanel(e){return this._tab==="settings"?Ie(e):this._tab==="activities"?Ne(e):Ke(e,{personIndex:this._tab.person,selectedActivity:this._selectedActivity,onSelectActivity:o=>{this._selectedActivity=o},hoverDay:this._dnd.hoverDay})}};A.styles=_e,g([D({attribute:!1})],A.prototype,"hass",2),g([T()],A.prototype,"_config",2),g([T()],A.prototype,"_tab",2),g([T()],A.prototype,"_selectedActivity",2),A=g([lt("weekly-timetable-card-editor")],A);function Gt(r,t){let e=r.strings.days[t];return r.density==="compact"?e.short:e.full}function Fe(r){return p`
    <div class="week" style=${v({"--wtc-day-count":String(r.days.length)})}>
      ${r.days.map(t=>jr(r,t))}
    </div>
  `}function jr(r,t){let e=r.person.schedule[t]??[];return p`
    <section class=${r.today===t?"day today":"day"}>
      <header class="day-head">${Gt(r,t)}</header>
      <div class="day-body">
        ${e.length>0?e.map(o=>rt(r,o)):p`<div class="empty">${r.strings.editor.noBlocks}</div>`}
      </div>
    </section>
  `}function ze(r){let{config:t,hass:e,density:o,now:n}=r,i=Math.min(Math.max(r.personIndex,0),t.people.length-1),s=t.people[i],a=w(t,e);return{config:t,person:s,days:Z(t,s),strings:mt(a),lang:a,hass:e,density:o,today:t.highlight_today?ve(n):null}}function Ve(r,t){let e=new Map,o=[];for(let n of t){let i=I(n)==="range"?r.find(a=>a.start===n.start&&a.end===n.end):void 0;if(!i){o.push(n);continue}let s=e.get(i.slot);s?s.push(n):e.set(i.slot,[n])}return{bySlot:e,loose:o}}function qe(r){let t=[...r.person.slots??[]].sort((s,a)=>s.slot-a.slot),e=new Map;for(let s of r.days)e.set(s,Ve(t,r.person.schedule[s]??[]));let o=r.days.some(s=>e.get(s).loose.length>0),n=v({"--wtc-day-count":String(r.days.length)}),i=r.days.map(s=>p`<div class=${r.today===s?"grid-head today":"grid-head"}>${Gt(r,s)}</div>`);return p`
    <div class="grid-wrap" style=${n}>
      ${t.length===0?p`
            <div class="grid-heads">
              <div class="grid-corner"></div>
              ${i}
            </div>
          `:h}
      ${o?p`
            <div class="strip">
              <div class="strip-label"></div>
              ${r.days.map(s=>p`
                  <div class="strip-cell">
                    ${e.get(s).loose.map(a=>rt(r,a))}
                  </div>
                `)}
            </div>
          `:h}
      ${t.length===0?p`<div class="no-slots">${r.strings.editor.noSlots}</div>`:p`
            <div class="grid">
              <div class="grid-corner"></div>
              ${i}
              ${t.flatMap(s=>[p`
                  <div class="slot-label">
                    ${r.strings.range(Q(s.start,r.hass,r.lang),Q(s.end,r.hass,r.lang))}
                  </div>
                `,...r.days.map(a=>p`
                    <div class=${r.today===a?"grid-cell today":"grid-cell"}>
                      ${(e.get(a).bySlot.get(s.slot)??[]).map(l=>rt(r,l))}
                    </div>
                  `)])}
            </div>
          `}
    </div>
  `}var Ye="0.1.0";var C=class extends b{constructor(){super(...arguments);this.density="full";this._personIndex=0;this._measuredWidth=0}static getConfigElement(){return document.createElement("weekly-timetable-card-editor")}static getStubConfig(e){return be(e)}static getLayoutOptions(){return{grid_columns:"full",grid_rows:"auto"}}setConfig(e){this._config=$t(e),this._personIndex=Math.min(this._personIndex,this._config.people.length-1)}getCardSize(){return 6}connectedCallback(){super.connectedCallback(),!(typeof ResizeObserver>"u")&&(this._observer=new ResizeObserver(e=>{let o=e[0]?.contentRect.width??0;this._measuredWidth=o;let n=jt(o,this._dayCount());n!==this.density&&(this.density=n)}),this._observer.observe(this))}disconnectedCallback(){this._observer?.disconnect(),this._observer=void 0,super.disconnectedCallback()}willUpdate(e){if(super.willUpdate(e),this._measuredWidth<=0)return;let o=jt(this._measuredWidth,this._dayCount());o!==this.density&&(this.density=o)}_dayCount(){let e=this._config;return e?(e.people[Math.min(this._personIndex,e.people.length-1)]?.days??e.days).length:vt.length}render(){let e=this._config;if(!e)return h;let o=ze({config:e,personIndex:this._personIndex,hass:this.hass,density:this.density}),n=this.density==="stacked"||e.layout==="blocks"?Fe(o):qe(o),i=v({"--wtc-header-color":e.header_color,"--wtc-header-text":ge(e.header_color),"--wtc-accent":o.person.color??"var(--primary-color)"});return p`
      <ha-card style=${i}>
        ${e.title?p`<h1 class="card-title">${e.title}</h1>`:h}
        ${e.people.length>1?this._renderTabs(e):h}
        <div class="body" data-density=${this.density}>${n}</div>
      </ha-card>
    `}_renderTabs(e){return p`
      <div class="tabs" role="tablist">
        ${e.people.map((o,n)=>p`
            <button
              class="tab"
              role="tab"
              type="button"
              aria-selected=${n===this._personIndex?"true":"false"}
              style=${v({"--wtc-accent":o.color??"var(--primary-color)"})}
              @click=${()=>{this._personIndex=n}}
            >
              ${o.emoji?p`<span>${o.emoji}</span>`:h}
              <span>${o.name}</span>
            </button>
          `)}
      </div>
    `}};C.styles=xe,g([D({attribute:!1})],C.prototype,"hass",2),g([D({attribute:!1})],C.prototype,"density",2),g([T()],C.prototype,"_config",2),g([T()],C.prototype,"_personIndex",2),C=g([lt("weekly-timetable-card")],C);console.info(`%c WEEKLY-TIMETABLE-CARD %c v${Ye} `,"color:#fff;background:#1e3a5f;padding:2px 4px;border-radius:3px 0 0 3px","color:#1e3a5f;background:#e2e8f0;padding:2px 4px;border-radius:0 3px 3px 0");window.customCards=window.customCards??[];window.customCards.push({type:gt.replace(/^custom:/,""),name:"Weekly Timetable Card",description:"Weekly timetable for one or more people, in English or Bulgarian",preview:!0,documentationURL:"https://github.com/vmlinuz82/weekly-timetable-card"});export{C as WeeklyTimetableCard};
