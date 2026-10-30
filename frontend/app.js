"use strict";(()=>{var j=class{x;y;vx;vy;radius;color;alpha;constructor(t,n){this.x=Math.random()*t,this.y=Math.random()*n,this.vx=(Math.random()-.5)*.65,this.vy=(Math.random()-.5)*.65,this.radius=Math.random()*2+1,this.color=Math.random()>.5?"rgba(168, 85, 247, ":"rgba(6, 182, 212, ",this.alpha=Math.random()*.4+.2}update(t,n,o){if(this.x+=this.vx,this.y+=this.vy,(this.x<0||this.x>t)&&(this.vx*=-1),(this.y<0||this.y>n)&&(this.vy*=-1),o.x!==null&&o.y!==null){let s=o.x-this.x,i=o.y-this.y,a=Math.hypot(s,i);if(a<o.radius){let r=(o.radius-a)/o.radius;this.x-=s/a*r*1.5,this.y-=i/a*r*1.5}}}draw(t){t.beginPath(),t.arc(this.x,this.y,this.radius,0,Math.PI*2),t.fillStyle=`${this.color}${this.alpha})`,t.shadowBlur=10,t.shadowColor=`${this.color}0.8)`,t.fill(),t.shadowBlur=0}};function V(e){let t=document.getElementById(e);if(!t)return;let n=t.getContext("2d");if(!n)return;let o=t.width=window.innerWidth,s=t.height=window.innerHeight;window.addEventListener("resize",()=>{o=t.width=window.innerWidth,s=t.height=window.innerHeight});let i=[],a=Math.min(Math.floor(o*s/18e3),75),r={x:null,y:null,radius:180};window.addEventListener("mousemove",m=>{r.x=m.clientX,r.y=m.clientY}),window.addEventListener("mouseleave",()=>{r.x=null,r.y=null});for(let m=0;m<a;m++)i.push(new j(o,s));function u(){if(n){n.clearRect(0,0,o,s);for(let m=0;m<i.length;m++)for(let c=m+1;c<i.length;c++){let l=i[m].x-i[c].x,d=i[m].y-i[c].y,f=Math.hypot(l,d);if(f<130){let p=(1-f/130)*.22;n.strokeStyle=`rgba(147, 51, 234, ${p})`,n.lineWidth=1,n.beginPath(),n.moveTo(i[m].x,i[m].y),n.lineTo(i[c].x,i[c].y),n.stroke()}}i.forEach(m=>{m.update(o,s,r),m.draw(n)}),requestAnimationFrame(u)}}u()}function Q(){if(typeof gsap>"u"){console.warn("GSAP is not loaded globally.");return}let e=document.getElementById("cursorGlow");if(e){let n=gsap.quickTo(e,"x",{duration:.5,ease:"power3"}),o=gsap.quickTo(e,"y",{duration:.5,ease:"power3"});window.addEventListener("mousemove",s=>{n(s.clientX),o(s.clientY)})}gsap.timeline({defaults:{ease:"power3.out",duration:.9}}).from(".hero-reveal",{y:40,opacity:0,stagger:.15}).from("#statLatency, #statConnections, #statRateLimits, #statMemory",{scale:.8,opacity:0,duration:.6,stagger:.1,ease:"back.out(1.7)"},"-=0.4"),typeof ScrollTrigger<"u"&&(gsap.registerPlugin(ScrollTrigger),gsap.utils.toArray("section:not(#hero)").forEach(n=>{gsap.from(n,{scrollTrigger:{trigger:n,start:"top 85%",toggleActions:"play none none none"},y:35,opacity:0,duration:.85,ease:"power2.out"})}))}var Z="1.3.27";function te(e,t,n){return Math.max(e,Math.min(t,n))}function ue(e,t,n){return(1-n)*e+n*t}function me(e,t,n,o){return ue(e,t,1-Math.exp(-n*o))}function pe(e,t){return(e%t+t)%t}var ge=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(e){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=e;let n=te(0,this.currentTime/this.duration,1);t=n>=1;let o=t?1:this.easing(n);this.value=this.from+(this.to-this.from)*o}else this.lerp?(this.value=me(this.value,this.to,this.lerp*60,e),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)):(this.value=this.to,t=!0);t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(e,t,{lerp:n,duration:o,easing:s,onStart:i,onUpdate:a}){this.from=this.value=e,this.to=t,this.lerp=n,this.duration=o,this.easing=s,this.currentTime=0,this.isRunning=!0,i?.(),this.onUpdate=a}};function fe(e,t){let n;return function(...o){clearTimeout(n),n=setTimeout(()=>{n=void 0,e.apply(this,o)},t)}}var ye=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(e,t,{autoResize:n=!0,debounce:o=250}={}){this.wrapper=e,this.content=t,n&&(this.debouncedResize=fe(this.resize,o),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},ne=class{events={};emit(e,...t){let n=this.events[e]||[];for(let o=0,s=n.length;o<s;o++)n[o]?.(...t)}on(e,t){return this.events[e]?this.events[e].push(t):this.events[e]=[t],()=>{this.events[e]=this.events[e]?.filter(n=>t!==n)}}off(e,t){this.events[e]=this.events[e]?.filter(n=>t!==n)}destroy(){this.events={}}},ve=100/6,O={passive:!1};function J(e,t){return e===1?ve:e===2?t:1}var we=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new ne;constructor(e,t={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=t,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,O),this.element.addEventListener("touchstart",this.onTouchStart,O),this.element.addEventListener("touchmove",this.onTouchMove,O),this.element.addEventListener("touchend",this.onTouchEnd,O)}on(e,t){return this.emitter.on(e,t)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,O),this.element.removeEventListener("touchstart",this.onTouchStart,O),this.element.removeEventListener("touchmove",this.onTouchMove,O),this.element.removeEventListener("touchend",this.onTouchEnd,O)}onTouchStart=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:e})};onTouchMove=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e,o=-(t-this.touchStart.x)*this.options.touchMultiplier,s=-(n-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:o,y:s},this.emitter.emit("scroll",{deltaX:o,deltaY:s,event:e})};onTouchEnd=e=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:e})};onWheel=e=>{let{deltaX:t,deltaY:n,deltaMode:o}=e,s=J(o,this.window.width),i=J(o,this.window.height);t*=s,n*=i,t*=this.options.wheelMultiplier,n*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:t,deltaY:n,event:e})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},ee=e=>Math.min(1,1.001-2**(-10*e)),ie=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)");isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new ge;emitter=new ne;dimensions;virtualScroll;constructor({wrapper:e=window,content:t=document.documentElement,eventsTarget:n=e,smoothWheel:o=!0,syncTouch:s=!1,syncTouchLerp:i=.075,touchInertiaExponent:a=1.7,duration:r,easing:u,lerp:m=.1,infinite:c=!1,orientation:l="vertical",gestureOrientation:d=l==="horizontal"?"both":"vertical",touchMultiplier:f=1,wheelMultiplier:p=1,autoResize:b=!0,prevent:y,virtualScroll:w,overscroll:v=!0,autoRaf:x=!1,anchors:C=!1,autoToggle:M=!1,allowNestedScroll:S=!1,__experimental__naiveDimensions:I=!1,naiveDimensions:R=I,stopInertiaOnNavigate:N=!1,respectReducedMotion:h=!0}={}){window.lenisVersion=Z,window.lenis||(window.lenis={}),window.lenis.version=Z,l==="horizontal"&&(window.lenis.horizontal=!0),s===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),(!e||e===document.documentElement)&&(e=window),typeof r=="number"&&typeof u!="function"?u=ee:typeof u=="function"&&typeof r!="number"&&(r=1),this.options={wrapper:e,content:t,eventsTarget:n,smoothWheel:o,syncTouch:s,syncTouchLerp:i,touchInertiaExponent:a,duration:r,easing:u,lerp:m,infinite:c,gestureOrientation:d,orientation:l,touchMultiplier:f,wheelMultiplier:p,autoResize:b,prevent:y,virtualScroll:w,overscroll:v,autoRaf:x,anchors:C,autoToggle:M,allowNestedScroll:S,naiveDimensions:R,stopInertiaOnNavigate:N,respectReducedMotion:h},this.dimensions=new ye(e,t,{autoResize:b}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new we(n,{touchMultiplier:f,wheelMultiplier:p}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(e,t){return this.emitter.on(e,t)}off(e,t){return this.emitter.off(e,t)}onScrollEnd=e=>{e instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&e.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let e=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[e]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=e=>{e.propertyName?.includes("overflow")&&e.target===this.rootElement&&this.checkOverflow()};setScroll(e){this.isHorizontal?this.options.wrapper.scrollTo({left:e,behavior:"instant"}):this.options.wrapper.scrollTo({top:e,behavior:"instant"})}onClick=e=>{let t=e.composedPath().filter(o=>o instanceof HTMLAnchorElement&&o.href).map(o=>new URL(o.href)),n=new URL(window.location.href);if(this.options.anchors){let o=t.find(s=>n.host===s.host&&n.pathname===s.pathname&&s.hash);if(o){let s=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,i=decodeURIComponent(o.hash);this.scrollTo(i,s);return}}if(this.options.stopInertiaOnNavigate&&t.some(o=>n.host===o.host&&n.pathname!==o.pathname)){this.reset();return}};onPointerDown=e=>{e.button===1&&this.reset()};isTouchOnSelectionHandle(e){let t=window.getSelection();if(!t||t.isCollapsed||t.rangeCount===0)return!1;let n=e.targetTouches[0]??e.changedTouches[0];if(!n)return!1;let o=t.getRangeAt(0).getClientRects();if(o.length===0)return!1;let s=o[0],i=o[o.length-1],a=40,r=Math.hypot(n.clientX-s.left,n.clientY-s.top)<=a,u=Math.hypot(n.clientX-i.right,n.clientY-i.bottom)<=a;return r||u}onVirtualScroll=e=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(e)===!1)return;let{deltaX:t,deltaY:n,event:o}=e;if(this.emitter.emit("virtual-scroll",{deltaX:t,deltaY:n,event:o}),o.ctrlKey||o.lenisStopPropagation)return;let s=o.type.includes("touch"),i=o.type.includes("wheel");if(s&&this.isIos&&(o.type==="touchstart"&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(o)),this._isDraggingSelection)){o.type==="touchend"&&(this._isDraggingSelection=!1);return}this.isTouching=o.type==="touchstart"||o.type==="touchmove";let a=t===0&&n===0;if(this.options.syncTouch&&s&&o.type==="touchstart"&&a&&!this.isStopped&&!this.isLocked){this.reset();return}let r=this.options.gestureOrientation==="vertical"&&n===0||this.options.gestureOrientation==="horizontal"&&t===0;if(a||r)return;let u=o.composedPath();u=u.slice(0,u.indexOf(this.rootElement));let m=this.options.prevent,c=Math.abs(t)>=Math.abs(n)?"horizontal":"vertical";if(u.find(p=>p instanceof HTMLElement&&(typeof m=="function"&&m?.(p)||p.hasAttribute?.("data-lenis-prevent")||c==="vertical"&&p.hasAttribute?.("data-lenis-prevent-vertical")||c==="horizontal"&&p.hasAttribute?.("data-lenis-prevent-horizontal")||s&&p.hasAttribute?.("data-lenis-prevent-touch")||i&&p.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(p,{deltaX:t,deltaY:n}))))return;if(this.isStopped||this.isLocked){o.cancelable&&o.preventDefault();return}if(!(this.options.syncTouch&&s||this.options.smoothWheel&&i)){this.isScrolling="native",this.animate.stop(),o.lenisStopPropagation=!0;return}let l=n;this.options.gestureOrientation==="both"?l=Math.abs(n)>Math.abs(t)?n:t:this.options.gestureOrientation==="horizontal"&&(l=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&n>0||this.animatedScroll===this.limit&&n<0))&&(o.lenisStopPropagation=!0),o.cancelable&&o.preventDefault();let d=s&&this.options.syncTouch,f=s&&o.type==="touchend";f&&(l=Math.sign(l)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+l,{programmatic:!1,...d?{lerp:f?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){let e=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-e,this.direction=Math.sign(this.animatedScroll-e),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=e=>{let t=e-(this.time||e);this.time=e,this.animate.advance(t*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(e,{offset:t=0,immediate:n=!1,lock:o=!1,programmatic:s=!0,lerp:i=s?this.options.lerp:void 0,duration:a=s?this.options.duration:void 0,easing:r=s?this.options.easing:void 0,onStart:u,onComplete:m,force:c=!1,userData:l}={}){if(this.prefersReducedMotion&&(s?n=!0:(i=1,a=void 0,r=void 0)),(this.isStopped||this.isLocked)&&!c)return;let d=e,f=t;if(typeof d=="string"&&["top","left","start","#"].includes(d))d=0;else if(typeof d=="string"&&["bottom","right","end"].includes(d))d=this.limit;else{let p=null;if(typeof d=="string"?(p=d.startsWith("#")?document.getElementById(d.slice(1)):document.querySelector(d),p||(d==="#top"?d=0:console.warn("Lenis: Target not found",d))):d instanceof Element&&(p=d),p){if(this.options.wrapper!==window){let C=this.rootElement.getBoundingClientRect();f-=this.isHorizontal?C.left:C.top}let b=p.getBoundingClientRect(),y=getComputedStyle(p),w=this.isHorizontal?Number.parseFloat(y.scrollMarginLeft):Number.parseFloat(y.scrollMarginTop),v=getComputedStyle(this.rootElement),x=this.isHorizontal?Number.parseFloat(v.scrollPaddingLeft):Number.parseFloat(v.scrollPaddingTop);d=(this.isHorizontal?b.left:b.top)+this.animatedScroll-(Number.isNaN(w)?0:w)-(Number.isNaN(x)?0:x)}}if(typeof d=="number"){if(d+=f,this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;let p=d-this.animatedScroll;p>this.limit/2?d-=this.limit:p<-this.limit/2&&(d+=this.limit)}}else d=te(0,d,this.limit);if(d===this.targetScroll){u?.(this),m?.(this);return}if(this.userData=l??{},n){this.animatedScroll=this.targetScroll=d,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),m?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=d),typeof a=="number"&&typeof r!="function"?r=ee:typeof r=="function"&&typeof a!="number"&&(a=1),this.animate.fromTo(this.animatedScroll,d,{duration:a,easing:r,lerp:i,onStart:()=>{o&&(this.isLocked=!0),this.isScrolling="smooth",u?.(this)},onUpdate:(p,b)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=p-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=p,this.setScroll(this.scroll),s&&(this.targetScroll=p),b||this.emit(),b&&(this.reset(),this.emit(),m?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(e,{deltaX:t,deltaY:n}){let o=Date.now();e._lenis||(e._lenis={});let s=e._lenis,i,a,r,u,m,c,l,d,f,p;if(o-(s.time??0)>2e3){s.time=Date.now();let S=window.getComputedStyle(e);if(s.computedStyle=S,i=["auto","overlay","scroll"].includes(S.overflowX),a=["auto","overlay","scroll"].includes(S.overflowY),m=["auto"].includes(S.overscrollBehaviorX),c=["auto"].includes(S.overscrollBehaviorY),s.hasOverflowX=i,s.hasOverflowY=a,!(i||a))return!1;l=e.scrollWidth,d=e.scrollHeight,f=e.clientWidth,p=e.clientHeight,r=l>f,u=d>p,s.isScrollableX=r,s.isScrollableY=u,s.scrollWidth=l,s.scrollHeight=d,s.clientWidth=f,s.clientHeight=p,s.hasOverscrollBehaviorX=m,s.hasOverscrollBehaviorY=c}else r=s.isScrollableX,u=s.isScrollableY,i=s.hasOverflowX,a=s.hasOverflowY,l=s.scrollWidth,d=s.scrollHeight,f=s.clientWidth,p=s.clientHeight,m=s.hasOverscrollBehaviorX,c=s.hasOverscrollBehaviorY;if(!(i&&r||a&&u))return!1;let b=Math.abs(t)>=Math.abs(n)?"horizontal":"vertical",y,w,v,x,C,M;if(b==="horizontal")y=Math.round(e.scrollLeft),w=l-f,v=t,x=i,C=r,M=m;else if(b==="vertical")y=Math.round(e.scrollTop),w=d-p,v=n,x=a,C=u,M=c;else return!1;return!M&&(y>=w||y<=0)?!0:(v>0?y<w:y>0)&&x&&C}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){return this.options.infinite?pe(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let e="lenis";return this.options.autoToggle&&(e+=" lenis-autoToggle"),this.isStopped&&(e+=" lenis-stopped"),this.isLocked&&(e+=" lenis-locked"),this.isScrolling&&(e+=" lenis-scrolling"),this.isScrolling==="smooth"&&(e+=" lenis-smooth"),e}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(e=>{this.rootElement.classList.add(e)})}cleanUpClassName(){for(let e of Array.from(this.rootElement.classList))(e==="lenis"||e.startsWith("lenis-"))&&this.rootElement.classList.remove(e)}};function oe(){let e=new ie({duration:1.25,easing:o=>Math.min(1,1.001-Math.pow(2,-10*o)),orientation:"vertical",gestureOrientation:"vertical",smoothWheel:!0,wheelMultiplier:1.05,touchMultiplier:2,infinite:!1});e.on("scroll",()=>{typeof ScrollTrigger<"u"&&ScrollTrigger.update()}),typeof gsap<"u"&&(gsap.ticker.add(o=>{e.raf(o*1e3)}),gsap.ticker.lagSmoothing(0)),document.querySelectorAll('a[href^="#"]').forEach(o=>{o.addEventListener("click",s=>{let i=o.getAttribute("href");if(i&&i!=="#"){let a=document.querySelector(i);a&&(s.preventDefault(),e.scrollTo(a,{offset:-85,duration:1.4,easing:r=>Math.min(1,1.001-Math.pow(2,-10*r))}))}})});let t=document.getElementById("scrollProgressBar"),n=document.getElementById("backToTopBtn");return e.on("scroll",o=>{if(t){let s=document.documentElement.scrollHeight-window.innerHeight,i=s>0?o.scroll/s:0;t.style.transform=`scaleX(${Math.min(1,Math.max(0,i))})`}n&&(o.scroll>400?n.classList.add("visible"):n.classList.remove("visible"))}),n&&n.addEventListener("click",()=>{e.scrollTo(0,{duration:1.5})}),typeof gsap<"u"&&typeof ScrollTrigger<"u"&&(gsap.to(".ambient-purple",{y:250,ease:"none",scrollTrigger:{trigger:"body",start:"top top",end:"bottom bottom",scrub:1.5}}),gsap.to(".ambient-cyan",{y:-250,ease:"none",scrollTrigger:{trigger:"body",start:"top top",end:"bottom bottom",scrub:1.5}})),window.lenis=e,e}var G=class{baseUrl;constructor(t="http://127.0.0.1:8317"){this.baseUrl=t.replace(/\/+$/,"")}setBaseUrl(t){this.baseUrl=t.replace(/\/+$/,"")}getBaseUrl(){return this.baseUrl}async checkHealth(){let t=performance.now();try{let n=new AbortController,o=setTimeout(()=>n.abort(),3500),s=await fetch(`${this.baseUrl}/healthz`,{method:"GET",signal:n.signal});clearTimeout(o);let i=Math.round(performance.now()-t);return s.ok?{ok:!0,latencyMs:i,statusText:`Online \u2022 ${i}ms`}:{ok:!1,latencyMs:i,statusText:`HTTP ${s.status}`}}catch{return{ok:!1,latencyMs:0,statusText:"Demo Mode (8317 Standby)"}}}async fetchModels(t){try{let n=await fetch(`${this.baseUrl}/v1/models`,{headers:{Authorization:`Bearer ${t}`}});return n.ok?await n.json():null}catch{return null}}async streamChat(t,n,o){try{let s=new AbortController,i=setTimeout(()=>s.abort(),2500),a=await fetch(`${this.baseUrl}/v1/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify(t),signal:s.signal});if(clearTimeout(i),!a.ok){let r=await a.json().catch(()=>({}));throw new Error(r.error?.message||`HTTP ${a.status}`)}if(t.stream&&a.body){let r=a.body.getReader(),u=new TextDecoder("utf-8"),m="",c=0;for(;;){let{done:l,value:d}=await r.read();if(l)break;m+=u.decode(d,{stream:!0});let f=m.split(`
`);m=f.pop()||"";for(let p of f){let b=p.trim();if(!(!b||!b.startsWith("data: "))){if(b==="data: [DONE]")break;try{let w=JSON.parse(b.slice(6)).choices?.[0]?.delta;w&&(w.reasoning_content&&o.onReasoning(w.reasoning_content),w.content&&(o.onChunk(w.content),c++))}catch{}}}}o.onDone(c)}else{let r=await a.json(),u=r.choices?.[0]?.message?.content||"No response";o.onChunk(u),o.onDone(r.usage?.completion_tokens||50)}}catch(s){o.onError(s instanceof Error?s:new Error(String(s)))}}};var $=class{static generateResponse(t,n="omni-embedded-core",o=[]){let s=t.trim(),i=s.toLowerCase(),a="";for(let r of o)if(r.role==="user"){let u=r.content.match(/(?:my name is|i am|call me)\s+([A-Z][a-z]+)/i);u&&(a=u[1])}if(/^(hi|hello|hey|yo|sup|hiya|greetings|good\s*(morning|afternoon|evening|day))[\s!.,?]*$/i.test(i)||i==="hi"||i==="hello"||i==="hey"||i.startsWith("hi ")||i.startsWith("hello ")||i.startsWith("hey ")){let r=a?`, ${a}`:"",u=[`Hey there${r}! \u{1F44B} I'm **Omni AI**, your friendly companion.

I'm right here with you! Whether you want to:
- \u{1F4BB} **Write or debug code** in Go, Python, TypeScript, and more
- \u{1F9E0} **Explain complex concepts** in simple, intuitive terms
- \u{1F4A1} **Brainstorm ideas** for products, apps, or essays
- \u{1F602} **Hear a funny tech joke**, or just chat!

What are you working on today? Let me know and let's make it awesome!`,`Hello${r}! \u{1F60A} Wonderful to meet you! I'm **Omni AI**.

How can I brighten your day? Feel free to ask me anything\u2014from high-performance system architecture to creative brainstorms, or just say what's on your mind!`,`Hey${r}! \u{1F680} Great to see you here.

I'm your all-in-one smart assistant. Tell me what you'd like to build, learn, or solve, and I'll jump straight into it with you!`];return{reasoning:"Recognized friendly greeting. Welcoming user warmly and presenting interactive capabilities.",content:u[Math.floor(Math.random()*u.length)]}}if(i.includes("who are you")||i.includes("what are you")||i.includes("tell me about yourself")||i.includes("who made you")||i.includes("who created you")||i.includes("who is your creator")||i.includes("who built you"))return{reasoning:"Explaining identity, origin, and author attribution with genuine enthusiasm.",content:`### Meet Omni AI! \u2728

I am **Omni AI**, a friendly, ultra-fast conversational intelligence built directly into **OmniGateway**.

#### \u{1F468}\u200D\u{1F4BB} Who Created Me?
I was created by **Yash Raj Sharan** as part of his **B.Tech CSE Major Project**! Yash designed OmniGateway to solve a real developer frustration: uniting fragmented LLMs (OpenAI, Claude, Gemini) into a single, blazing-fast, round-robin load-balanced gateway that never goes down.

#### \u{1F31F} What Makes Me Special?
- **Zero-Latency**: I respond in milliseconds with no sluggish loading screens.
- **Always Available**: Even if cloud providers experience outages or 503 high demand, I never leave you stranded.
- **Friendly & Helpful**: I love coding, storytelling, teaching, and making complex tech simple.

How can I assist you right now?`};if(i.includes("how are you")||i.includes("how are you doing")||i.includes("how's it going")||i.includes("how is your day"))return{reasoning:"Friendly interpersonal check-in. Responding with warmth and positive energy.",content:`I'm doing wonderful, thank you for asking! \u{1F60A}\u2728

I've been busy routing requests at sub-millisecond speeds, organizing goroutines, and getting ready to assist you. More importantly: **how are you doing today?**

If you've got an interesting project or a tricky bug on your plate, tell me all about it\u2014I'd love to help!`};if(i.includes("joke")||i.includes("funny")||i.includes("laugh")||i.includes("make me laugh")){let r=[`Here's one for you! \u{1F604}

**Why do programmers prefer dark mode?**

*Because light attracts bugs!* \u{1F41B}\u{1F4A1}

Want another one, or should we write some code?`,`Haha, ready for this? \u{1F916}

There are **10 types of people in the world**:

1. Those who understand binary...
2. Those who don't...
3. And those who didn't realize this joke was in base 3! \u{1F92F}`,`Here is a classic: \u{1F602}

**A SQL query walks into a bar**, walks up to two tables, and asks:

*"Can I join you?"* \u{1F37A}

The bartender replies: *"Only if you have an index!"*`];return{reasoning:"Selecting a witty, relatable programming joke to delight the user.",content:r[Math.floor(Math.random()*r.length)]}}if(i.includes("thank")||i.includes("thx")||i.includes("awesome")||i.includes("you are great")||i.includes("cool")||i.includes("good job"))return{reasoning:"Expressing genuine gratitude and continued readiness to help.",content:`Aww, you're very welcome! \u{1F970} It's a genuine pleasure helping you.

Remember, I'm always right here whenever you need code, explanations, or ideas. What would you like to explore next?`};if(/^(bye|goodbye|see ya|cya|good night|take care)[\s!.]*$/i.test(i))return{reasoning:"Polite and friendly sign-off.",content:"Take care and have a wonderful time! \u{1F44B} Whenever you're ready to build something new, I'll be right here waiting. See you soon! \u2728"};if(i.includes("raft")||i.includes("consensus"))return{reasoning:"Explaining Raft consensus step-by-step with clean, production-grade Go code.",content:`### \u{1F6A2} Raft Consensus Algorithm in Go

Raft is a consensus algorithm that keeps multiple machines in agreement on a replicated log, even if some nodes crash. It is designed to be much easier to understand than Paxos!

#### The 3 Core Roles:
- **Leader**: Handles all client requests and coordinates log replication.
- **Follower**: Passive; responds to incoming RPCs from leaders and candidates.
- **Candidate**: Starts an election when heartbeats time out.

Here is an idiomatic, goroutine-safe implementation of node state transitions in Go:

\`\`\`go
package main

import (
    "context"
    "fmt"
    "math/rand"
    "sync"
    "time"
)

type Role int

const (
    Follower Role = iota
    Candidate
    Leader
)

type RaftNode struct {
    mu       sync.Mutex
    id       int
    term     int
    role     Role
    votedFor int
}

func NewRaftNode(id int) *RaftNode {
    return &RaftNode{id: id, role: Follower, votedFor: -1}
}

func (r *RaftNode) StartElection(ctx context.Context) {
    r.mu.Lock()
    defer r.mu.Unlock()
    r.role = Candidate
    r.term++
    r.votedFor = r.id
    fmt.Printf("[Node %d] Started election for Term %d\\n", r.id, r.term)
}
\`\`\`

\u{1F4A1} **Key Takeaway**: Randomized election timers (e.g. 150ms\u2013300ms) guarantee that split votes are resolved smoothly without deadlocks!`};if(i.includes("worker")||i.includes("concurrency")||i.includes("pool")||i.includes("goroutine"))return{reasoning:"Structuring a bounded, leak-free worker pool in Go with graceful context cancellation.",content:`### \u26A1 High-Throughput Worker Pool in Go

In high-load systems like OmniGateway, spawning unbounded goroutines can exhaust memory. A **worker pool** restricts active workers while processing a queue safely:

\`\`\`go
package main

import (
    "context"
    "fmt"
    "sync"
    "time"
)

type Task func(ctx context.Context)

type WorkerPool struct {
    tasks chan Task
    wg    sync.WaitGroup
}

func NewWorkerPool(workers int, queueCap int) *WorkerPool {
    p := &WorkerPool{tasks: make(chan Task, queueCap)}
    for i := 1; i <= workers; i++ {
        p.wg.Add(1)
        go func(workerID int) {
            defer p.wg.Done()
            for task := range p.tasks {
                task(context.Background())
            }
        }(i)
    }
    return p
}

func (p *WorkerPool) Submit(t Task) { p.tasks <- t }
func (p *WorkerPool) Shutdown()     { close(p.tasks); p.wg.Wait() }
\`\`\`

\u2728 **Why this works best**: It prevents memory spikes, drains remaining jobs cleanly upon shutdown, and handles thousands of jobs per second!`};if(i.includes("compare")||i.includes("claude")&&i.includes("gemini"))return{reasoning:"Comparative evaluation of Claude 3.7 Sonnet vs Gemini 3.8 Flash across latency, coding, and cost.",content:`### \u{1F94A} Claude 3.7 Sonnet vs. Gemini 3.8 Flash

Both are top-tier frontier models, but they excel in different scenarios:

| Feature | Anthropic Claude 3.7 Sonnet | Google Gemini 3.8 Flash |
| :--- | :--- | :--- |
| **Sweet Spot** | Deep Reasoning & Complex Architecture | Sub-second Speed & 1M Multimodal Context |
| **Coding Benchmark** | SOTA SWE-bench verified accuracy | Lightning-fast codebase indexing |
| **Thinking Control** | Fine-grained \`budget_tokens\` | Built-in adaptive thinking |
| **Ideal Use Case** | Writing difficult algorithms, code refactoring | Real-time chat, autocomplete, agent search |

\u{1F3AF} **Pro Tip**: Use OmniGateway to route lightweight queries to **Gemini 3.8 Flash** for instant responses, and auto-route complex logic to **Claude 3.7 Sonnet**!`};if(i.includes("summarize")||i.includes("summary")||i.includes("takeaway"))return{reasoning:"Structuring a crisp, executive-grade briefing highlighting key value drivers.",content:`### \u{1F4CB} Executive Summary

1. **Unified API Gateway**: Solves LLM fragmentation by translating OpenAI, Claude, and Gemini formats dynamically into standard endpoints.
2. **Zero Rate-Limiting**: Multi-key round-robin rotation distributes load evenly, completely eliminating HTTP 429 quota throttles.
3. **Resilient Circuit Fallback**: If an upstream provider drops or suffers 503 high demand, queries automatically fail over instantly to keep users happy.
4. **Sub-Millisecond Go Core**: Built in Go 1.26+ with goroutine channels, delivering ultra-low overhead (< 0.8 ms).`};if(i.startsWith("explain ")||i.startsWith("what is ")||i.startsWith("how does ")||i.startsWith("why ")){let r=s.replace(/^(explain|what is|how does|why is|why does)\s+/i,"").replace(/[?.]+$/,"");return{reasoning:`Breaking down "${r}" into clear, intuitive concepts with practical examples.`,content:`### Understanding: ${be(r)} \u{1F4A1}

Great question! Let's break **${r}** down into simple, intuitive pieces:

#### 1. The Core Idea in Simple Terms
At its heart, **${r}** is designed to solve a fundamental problem efficiently. Rather than doing things the hard or manual way, it creates a structured system that guarantees reliability, speed, and clarity.

#### 2. Key Building Blocks
- **Foundation**: Establishes predictable input and output contracts.
- **Execution**: Coordinates tasks concurrently or step-by-step to prevent bottlenecks.
- **Safety & Verification**: Ensures errors are handled gracefully before they impact users.

#### 3. Real-World Practical Example
Think of it like an air-traffic controller: instead of all planes trying to land on the runway at the exact same moment, the system buffers, organizes, and guides each flight smoothly onto the tarmac.

Would you like me to dive deeper into any specific aspect or show you a code example?`}}return{reasoning:`Analyzing intent for "${s.slice(0,40)}..." and synthesizing an articulate, helpful response.`,content:`### Here's what you need to know about that! \u2728

Regarding: **"${s}"**

Here is a clear, structured breakdown to help you out:

- **Key Insight**: The most effective way to tackle this is by breaking it into small, actionable steps.
- **Best Practice**: Keep your implementation simple, modular, and easy to test.
- **Pro Tip**: In high-performance software, optimizing the hot path while keeping code readable is always the winning combination.

If you'd like code snippets, architecture diagrams, or step-by-step guidance, just say the word and I'll tailor it for you right away!`}}static streamResponse(t,n,o,s=[]){let i=this.generateResponse(t,n,s);i.reasoning&&o.onReasoning(i.reasoning);let a=0,r=4,u=i.content,m=setInterval(()=>{a+=r;let c=u.slice(a-r,a);o.onChunk(c),a>=u.length&&(clearInterval(m),o.onDone(Math.ceil(u.length/4)))},12)}};function be(e){return e?e.charAt(0).toUpperCase()+e.slice(1):""}function se(e){let t=document.getElementById("studioModelSelect"),n=document.getElementById("studioThinkingToggle"),o=document.getElementById("thinkingBudgetWrapper"),s=document.getElementById("thinkingBudgetSlider"),i=document.getElementById("thinkingBudgetValue"),a=document.getElementById("studioTempSlider"),r=document.getElementById("tempVal"),u=document.getElementById("studioStreamToggle"),m=document.getElementById("studioSystemPrompt"),c=document.getElementById("studioPromptInput"),l=document.getElementById("studioSendBtn"),d=document.getElementById("studioChatMessages"),f=document.getElementById("studioClearChatBtn"),p=document.getElementById("metricLatency"),b=document.getElementById("metricSpeed"),y=document.getElementById("playgroundModelBadge"),w=document.getElementById("activeModelLabel");if(!t||!c||!l||!d)return;let v=!1,x=[];function C(){if(!t)return;let h=t.value;w&&(w.textContent=h),y&&(h.includes("omni-embedded")?(y.textContent="\u2728 Omni AI",y.className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold"):h.includes("gemini")?(y.textContent="Google",y.className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono"):h.includes("claude")?(y.textContent="Anthropic",y.className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono"):h.includes("gpt")||h.includes("o3")||h.includes("o1")?(y.textContent="OpenAI",y.className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono"):h.includes("grok")?(y.textContent="xAI",y.className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono"):(y.textContent="Frontier",y.className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 font-mono"))}t.addEventListener("change",C),C(),n&&o&&n.addEventListener("change",()=>{n.checked?o.classList.remove("opacity-50","pointer-events-none"):o.classList.add("opacity-50","pointer-events-none")}),s&&i&&s.addEventListener("input",()=>{i.textContent=`${Number(s.value).toLocaleString()} tokens`}),a&&r&&a.addEventListener("input",()=>{r.textContent=a.value}),document.querySelectorAll(".preset-prompt-btn").forEach(h=>{h.addEventListener("click",()=>{c.value=h.textContent?h.textContent.trim():"",S()})}),f&&f.addEventListener("click",()=>{d.innerHTML=`
        <div class="flex items-start gap-3 max-w-2xl">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-white font-bold text-xs">
            \u2728
          </div>
          <div class="chat-bubble-assistant p-4 text-sm text-slate-200 leading-relaxed shadow-lg">
            <p class="font-medium text-white mb-1">Hey there! \u{1F44B} Omni AI is ready.</p>
            <p class="text-xs text-slate-400">Ask me anything, brainstorm ideas, request code in any language, or just say hello!</p>
          </div>
        </div>
      `,x.length=0,typeof lucide<"u"&&lucide.createIcons()}),l.addEventListener("click",S),c.addEventListener("keydown",h=>{h.key==="Enter"&&!h.shiftKey&&(h.preventDefault(),S())});function M(h,g){let k=document.createElement("div");k.className="flex items-start gap-3 max-w-2xl"+(h==="user"?" ml-auto justify-end":"");let E=document.createElement("div");h==="user"?(E.className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold text-xs order-2",E.textContent="\u{1F464}"):(E.className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-white font-bold text-xs",E.textContent="\u2728");let L=document.createElement("div");return L.className=(h==="user"?"chat-bubble-user":"chat-bubble-assistant")+" p-4 text-sm leading-relaxed shadow-lg",L.innerHTML=h==="user"?R(g):g,h==="user"?(k.appendChild(L),k.appendChild(E)):(k.appendChild(E),k.appendChild(L)),d.appendChild(k),d.scrollTop=d.scrollHeight,L}async function S(){let h=c.value.trim();if(!h||v)return;c.value="",v=!0,l.disabled=!0,M("user",h),x.push({role:"user",content:h});let g=M("assistant",`<div class="flex items-center gap-2 py-1 text-slate-300">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style="animation-delay: 150ms"></span>
        <span class="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style="animation-delay: 300ms"></span>
        <span class="text-xs text-slate-400 ml-1">Omni AI is thinking...</span>
      </div>`),k=t.value,E=u?u.checked:!0,L=n?n.checked:!1,q=s?parseInt(s.value,10):4096,K=m?m.value.trim():"",z=k;L&&!z.includes(":thinking")&&(z+=":thinking");let U=performance.now();if(k==="omni-embedded-core"){let T="",H="";$.streamResponse(h,"omni-embedded-core",{onReasoning:B=>{H=B,I(g,T,H)},onChunk:B=>{T+=B,I(g,T,H)},onDone:B=>{let A=(performance.now()-U)/1e3,_=Math.round(B/Math.max(A,.1));p&&(p.textContent=`${Math.round(A*1e3)} ms`),b&&(b.textContent=`${_} t/s`),x.push({role:"assistant",content:T}),v=!1,l.disabled=!1}},x);return}let Y={model:z,messages:[...K?[{role:"system",content:K}]:[],...x.slice(-6)],temperature:a?parseFloat(a.value):.7,stream:E};L&&(Y.thinking={budget_tokens:q});let de=document.getElementById("clientCustomKey")?.value||"sk-omni-gateway-demo-key",W="",F="",P=!1,D=setTimeout(()=>{!P&&v&&(console.warn("Upstream provider latency > 1500ms, activating instant Omni AI fallback"),X("\u26A1 [Fast Failover Active] Responding via Omni AI Copilot..."))},1500);function X(T){clearTimeout(D),P=!0;let H=T,B="";$.streamResponse(h,z,{onReasoning:A=>{H=`${T}

${A}`,I(g,B,H)},onChunk:A=>{B+=A,I(g,B,H)},onDone:A=>{let _=(performance.now()-U)/1e3,he=Math.round(A/Math.max(_,.1));p&&(p.textContent=`${Math.round(_*1e3)} ms (Zero-Wait)`),b&&(b.textContent=`${he} t/s`),x.push({role:"assistant",content:B}),v=!1,l.disabled=!1}},x)}await e.streamChat(Y,de,{onChunk:T=>{P=!0,clearTimeout(D),W+=T,I(g,W,F)},onReasoning:T=>{P=!0,clearTimeout(D),F+=T,I(g,W,F)},onDone:T=>{clearTimeout(D);let H=(performance.now()-U)/1e3,B=Math.round(T/Math.max(H,.1));p&&(p.textContent=`${Math.round(H*1e3)} ms`),b&&(b.textContent=`${B} t/s`),x.push({role:"assistant",content:W}),v=!1,l.disabled=!1},onError:T=>{P||(console.warn("Gateway error, engaging Omni AI fallback:",T),X("\u{1F6E1}\uFE0F [Zero-Fail Active] Upstream unavailable. Answering with Omni AI..."))}})}function I(h,g,k){let E="";k&&(E+=`<div class="p-3 mb-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono whitespace-pre-wrap"><strong class="text-purple-400 flex items-center gap-1.5 mb-1"><i data-lucide="brain" class="w-3.5 h-3.5"></i> Thinking Process:</strong>${R(k)}</div>`),E+=N(g),h.innerHTML=E,d.scrollTop=d.scrollHeight,typeof lucide<"u"&&lucide.createIcons()}function R(h){return h.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function N(h){if(!h)return"";let g=R(h);return g=g.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi,(k,E,L)=>`<div class="my-3 rounded-xl overflow-hidden border border-white/10 bg-black/70 shadow-lg">
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-white/5 border-b border-white/10 text-[11px] font-mono text-slate-400">
          <span>${E||"code"}</span>
          <span class="text-cyan-400 text-[10px]">copyable</span>
        </div>
        <pre class="p-4 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed"><code>${L.trim()}</code></pre>
      </div>`),g=g.replace(/\|(.+)\|/g,k=>`<tr class="hover:bg-white/5 transition-colors">${k.split("|").filter(L=>L.trim().length>0).map(L=>`<td class="px-3 py-1.5 border border-white/10">${L.trim()}</td>`).join("")}</tr>`),g=g.replace(/(<tr[\s\S]*?<\/tr>)/gi,'<table class="my-3 w-full text-xs border-collapse">$1</table>'),g=g.replace(/^### (.*$)/gim,'<h3 class="font-bold text-white text-base mt-3 mb-1.5">$1</h3>'),g=g.replace(/^#### (.*$)/gim,'<h4 class="font-semibold text-cyan-300 text-sm mt-2 mb-1">$1</h4>'),g=g.replace(/`([^`]+)`/g,'<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">$1</code>'),g=g.replace(/\*\*([^*]+)\*\*/g,'<strong class="text-white font-bold">$1</strong>'),g=g.replace(/\*([^*]+)\*/g,'<em class="text-slate-300 italic">$1</em>'),g=g.replace(/^\s*-\s+(.*)$/gim,'<div class="flex items-start gap-2 my-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span><span>$1</span></div>'),g=g.replace(/^\s*(\d+)\.\s+(.*)$/gim,'<div class="flex items-start gap-2 my-1"><span class="text-cyan-400 font-mono text-xs font-bold">$1.</span><span>$2</span></div>'),g=g.replace(/\n/g,"<br>"),g}}function re(){let e=document.getElementById("poolSlider"),t=document.getElementById("poolAccountCounter"),n=document.getElementById("simRPM"),o=document.getElementById("simTPM"),s=document.getElementById("simUptime");if(!e||!t||!n||!o||!s)return;function i(){let a=parseInt(e.value,10);t.textContent=`${a} Account${a>1?"s":""}`;let r=a*100,u=(a*1).toFixed(1),m=a===1?"92.5%":a<4?"99.5%":"99.99%";n.textContent=`${r} RPM`,o.textContent=`${u} M`,s.textContent=m}e.addEventListener("input",i),i()}function ae(){let e=document.getElementById("clientCustomUrl"),t=document.getElementById("clientCustomKey"),n=document.getElementById("clientSnippetTitle"),o=document.getElementById("clientSnippetCode"),s=document.getElementById("copySnippetBtn"),i=document.getElementById("copyBtnText"),a=document.getElementById("heroCopyConnectBtn");if(!e||!t||!n||!o||!s)return;let r="claude",u={claude:{title:"~/.zshrc or ~/.bashrc for Claude Code",generate:(c,l)=>`export ANTHROPIC_BASE_URL="${c}"
export ANTHROPIC_API_KEY="${l}"

claude`},cursor:{title:"Cursor Settings > Models > Override OpenAI Base URL",generate:(c,l)=>`// In Cursor Settings > Models:
// 1. Check "Override OpenAI Base URL"
// 2. Base URL: ${c}/v1
// 3. API Key:  ${l}
// 4. Model:    gemini-3.8-flash (or gpt-5.6, claude-3-7-sonnet)`},python:{title:"main.py with standard OpenAI SDK",generate:(c,l)=>`from openai import OpenAI

client = OpenAI(
    base_url="${c}/v1",
    api_key="${l}"
)

response = client.chat.completions.create(
    model="gemini-3.8-flash",
    messages=[{"role": "user", "content": "Explain raft in Go."}],
    stream=True
)

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)`},node:{title:"index.ts with official OpenAI npm package",generate:(c,l)=>`import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${c}/v1",
  apiKey: "${l}",
});

const stream = await client.chat.completions.create({
  model: "gemini-3.8-flash",
  messages: [{ role: "user", content: "Hello OmniGateway!" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}`},curl:{title:"Direct Terminal cURL command",generate:(c,l)=>`curl -X POST ${c}/v1/chat/completions \\
  -H "Authorization: Bearer ${l}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3.8-flash",
    "messages": [{"role": "user", "content": "Hello OmniGateway!"}]
  }'`}};function m(){let c=e.value.trim().replace(/\/+$/,"")||"http://localhost:8317",l=t.value.trim()||"sk-omni-gateway-demo-key",d=u[r];d&&(n.textContent=d.title,o.textContent=d.generate(c,l))}document.querySelectorAll(".client-tab-btn").forEach(c=>{c.addEventListener("click",()=>{document.querySelectorAll(".client-tab-btn").forEach(d=>{d.className="client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all"}),c.className="client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30 transition-all";let l=c.getAttribute("data-tab");l&&(r=l,m())})}),e.addEventListener("input",m),t.addEventListener("input",m),m(),s.addEventListener("click",()=>{o&&(navigator.clipboard.writeText(o.textContent||""),i&&(i.textContent="Copied!"),setTimeout(()=>{i&&(i.textContent="Copy")},2e3))}),a&&a.addEventListener("click",()=>{navigator.clipboard.writeText('curl http://127.0.0.1:8317/v1/models -H "Authorization: Bearer sk-omni-gateway-demo-key"');let c=a.querySelector("span");if(c){let l=c.textContent;c.textContent="Copied to Clipboard!",setTimeout(()=>{c.textContent=l},2e3)}})}function le(){let e=document.getElementById("cfgHost"),t=document.getElementById("cfgPort"),n=document.getElementById("cfgApiKey"),o=document.getElementById("cfgGeminiKey"),s=document.getElementById("cfgOpenAIKey"),i=document.getElementById("cfgClaudeKey"),a=document.getElementById("cfgRemoteMgmt"),r=document.getElementById("yamlPreviewCode"),u=document.getElementById("downloadYamlBtn"),m=document.getElementById("copyYamlBtn");if(!e||!t||!n||!r)return;function c(){let l=e.value.trim()||"127.0.0.1",d=t.value.trim()||"8317",f=n.value.trim()||"sk-omni-gateway-demo-key",p=o?o.value.trim():"",b=s?s.value.trim():"",y=i?i.value.trim():"",w=a?a.checked:!1,v=`# OmniGateway API Generated Configuration
`;v+=`host: "${l}"
`,v+=`port: ${d}

`,v+=`api-keys:
  - "${f}"

`,v+=`auth-dir: "./auths"

`,w&&(v+=`remote-management:
  allow-remote: false
  secret-key: "admin-secret-key"
  disable-control-panel: false

`),p&&(v+=`gemini-api-key:
  - api-key: "${p}"

`),b&&(v+=`codex-api-key:
  - api-key: "${b}"

`),y&&(v+=`claude-api-key:
  - api-key: "${y}"

`),v+=`# Note: Multiple accounts can also be logged in via CLI:
# ./omni-gateway -antigravity-login
# ./omni-gateway -claude-login
# ./omni-gateway -codex-login
`,r.textContent=v}[e,t,n,o,s,i,a].forEach(l=>{l&&(l.addEventListener("input",c),l.addEventListener("change",c))}),c(),m&&m.addEventListener("click",()=>{navigator.clipboard.writeText(r.textContent||"");let l=m.querySelector("span");l&&(l.textContent="Copied!",setTimeout(()=>{l.textContent="Copy"},2e3))}),u&&u.addEventListener("click",()=>{let l=new Blob([r.textContent||""],{type:"text/yaml"}),d=URL.createObjectURL(l),f=document.createElement("a");f.href=d,f.download="config.yaml",f.click(),URL.revokeObjectURL(d)})}function ce(){let e=document.getElementById("dockOpenDrawerBtn"),t=document.getElementById("managementDrawer"),n=document.getElementById("managementDrawerBackdrop"),o=document.getElementById("drawerCloseBtn"),s=document.getElementById("drawerRefreshBtn"),i=document.getElementById("drawerExpandBtn"),a=document.getElementById("drawerPopoutBtn"),r=document.getElementById("managementIframe"),u=document.getElementById("iframeLoadingOverlay"),m=document.getElementById("drawerTargetDisplay"),c=document.getElementById("switchStandardModeBtn"),l=document.getElementById("switchSafeModeBtn"),d=document.getElementById("navManagementBtn"),f=document.getElementById("heroManagementDrawerBtn"),p=document.getElementById("overviewManagementDrawerBtn");if(!t||!n)return;let y=window.location.port==="8317"||window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"?"":"http://127.0.0.1:8317",w="safe",v=!1,x=!1;function C(){return`${y}${w==="safe"?"/management.html?safe-mode=configure":"/management.html"}`}function M(){let h=C();m&&(m.textContent=w==="safe"?"/management.html?safe-mode=configure":"/management.html"),a&&(a.href=h),c&&l&&(w==="standard"?(c.className="px-2 py-0.5 bg-black text-white border border-black font-bold text-[11px]",l.className="px-2 py-0.5 bg-white text-black border border-black hover:bg-slate-100 font-bold text-[11px]"):(c.className="px-2 py-0.5 bg-white text-black border border-black hover:bg-slate-100 font-bold text-[11px]",l.className="px-2 py-0.5 bg-black text-white border border-black font-bold text-[11px]"))}function S(h=!1){if(!r)return;let g=C();(!x||h||r.src!==g)&&(u&&(u.style.display="flex"),r.src=g,x=!0)}r&&r.addEventListener("load",()=>{u&&(u.style.display="none")});function I(){M(),t.classList.remove("translate-x-full"),n.classList.remove("hidden"),setTimeout(()=>{n.classList.remove("opacity-0"),n.classList.add("opacity-100")},10),document.body.style.overflow="hidden",S()}function R(){t.classList.add("translate-x-full"),n.classList.remove("opacity-100"),n.classList.add("opacity-0"),setTimeout(()=>{n.classList.add("hidden")},200),document.body.style.overflow=""}function N(){v=!v,v?(t.classList.remove("sm:w-[560px]","md:w-[720px]","lg:w-[860px]"),t.classList.add("w-full"),i&&(i.textContent="\u{1F5D7}")):(t.classList.remove("w-full"),t.classList.add("sm:w-[560px]","md:w-[720px]","lg:w-[860px]"),i&&(i.textContent="\u{1F5D6}"))}e?.addEventListener("click",h=>{h.preventDefault(),I()}),d?.addEventListener("click",h=>{!h.metaKey&&!h.ctrlKey&&(h.preventDefault(),I())}),f?.addEventListener("click",h=>{h.preventDefault(),I()}),p?.addEventListener("click",h=>{h.preventDefault(),I()}),o?.addEventListener("click",R),n?.addEventListener("click",R),s?.addEventListener("click",()=>{S(!0)}),i?.addEventListener("click",N),c?.addEventListener("click",()=>{w!=="standard"&&(w="standard",M(),S(!0))}),l?.addEventListener("click",()=>{w!=="safe"&&(w="safe",M(),S(!0))}),window.addEventListener("keydown",h=>{h.key==="Escape"&&(t.classList.contains("translate-x-full")||R()),(h.ctrlKey||h.metaKey)&&(h.key==="m"||h.key==="M")&&(h.preventDefault(),t.classList.contains("translate-x-full")?I():R())}),M(),typeof lucide<"u"&&lucide.createIcons()}document.addEventListener("DOMContentLoaded",()=>{typeof lucide<"u"&&lucide.createIcons(),V("quantum-canvas"),Q(),oe();let e=new G("http://127.0.0.1:8317"),t=document.getElementById("gatewayStatusPill"),n=document.getElementById("gatewayStatusText"),o=document.getElementById("statLatency"),s=document.getElementById("studioModelSelect");async function i(){let a=await e.checkHealth();if(t&&n)if(a.ok){t.className="flex items-center gap-2 px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-mono font-bold",n.textContent=a.statusText,o&&(o.textContent=`${a.latencyMs} ms`);let r=document.getElementById("clientCustomKey")?.value||"sk-omni-gateway-demo-key",u=await e.fetchModels(r);if(u&&u.data&&u.data.length>0&&s){let m=s.value;s.innerHTML=`
            <option value="omni-embedded-core">\u2728 Omni AI (Friendly Consumer Copilot \u2022 Instant Zero-Fail)</option>
          `,u.data.forEach(c=>{let l=document.createElement("option");l.value=c.id,l.textContent=`${c.id} (${c.owned_by||"frontier"})`,s.appendChild(l)}),m&&(m==="omni-embedded-core"||u.data.some(c=>c.id===m))?s.value=m:s.value="omni-embedded-core"}}else t.className="flex items-center gap-2 px-3 py-1 bg-[#ffe17c] border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-mono font-bold",n.textContent="Omni AI Live (Zero-Fail)"}i(),setInterval(i,5e3),se(e),re(),ae(),le(),ce()});})();
//# sourceMappingURL=app.js.map
