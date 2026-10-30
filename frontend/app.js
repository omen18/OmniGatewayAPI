"use strict";(()=>{var j=class{x;y;vx;vy;radius;color;alpha;constructor(t,n){this.x=Math.random()*t,this.y=Math.random()*n,this.vx=(Math.random()-.5)*.65,this.vy=(Math.random()-.5)*.65,this.radius=Math.random()*2+1,this.color=Math.random()>.5?"rgba(168, 85, 247, ":"rgba(6, 182, 212, ",this.alpha=Math.random()*.4+.2}update(t,n,i){if(this.x+=this.vx,this.y+=this.vy,(this.x<0||this.x>t)&&(this.vx*=-1),(this.y<0||this.y>n)&&(this.vy*=-1),i.x!==null&&i.y!==null){let s=i.x-this.x,o=i.y-this.y,r=Math.hypot(s,o);if(r<i.radius){let a=(i.radius-r)/i.radius;this.x-=s/r*a*1.5,this.y-=o/r*a*1.5}}}draw(t){t.beginPath(),t.arc(this.x,this.y,this.radius,0,Math.PI*2),t.fillStyle=`${this.color}${this.alpha})`,t.shadowBlur=10,t.shadowColor=`${this.color}0.8)`,t.fill(),t.shadowBlur=0}};function V(e){let t=document.getElementById(e);if(!t)return;let n=t.getContext("2d");if(!n)return;let i=t.width=window.innerWidth,s=t.height=window.innerHeight;window.addEventListener("resize",()=>{i=t.width=window.innerWidth,s=t.height=window.innerHeight});let o=[],r=Math.min(Math.floor(i*s/18e3),75),a={x:null,y:null,radius:180};window.addEventListener("mousemove",h=>{a.x=h.clientX,a.y=h.clientY}),window.addEventListener("mouseleave",()=>{a.x=null,a.y=null});for(let h=0;h<r;h++)o.push(new j(i,s));function u(){if(n){n.clearRect(0,0,i,s);for(let h=0;h<o.length;h++)for(let c=h+1;c<o.length;c++){let l=o[h].x-o[c].x,d=o[h].y-o[c].y,f=Math.hypot(l,d);if(f<130){let m=(1-f/130)*.22;n.strokeStyle=`rgba(147, 51, 234, ${m})`,n.lineWidth=1,n.beginPath(),n.moveTo(o[h].x,o[h].y),n.lineTo(o[c].x,o[c].y),n.stroke()}}o.forEach(h=>{h.update(i,s,a),h.draw(n)}),requestAnimationFrame(u)}}u()}function Q(){if(typeof gsap>"u"){console.warn("GSAP is not loaded globally.");return}let e=document.getElementById("cursorGlow");if(e){let n=gsap.quickTo(e,"x",{duration:.5,ease:"power3"}),i=gsap.quickTo(e,"y",{duration:.5,ease:"power3"});window.addEventListener("mousemove",s=>{n(s.clientX),i(s.clientY)})}gsap.timeline({defaults:{ease:"power3.out",duration:.9}}).from(".hero-reveal",{y:40,opacity:0,stagger:.15}).from("#statLatency, #statConnections, #statRateLimits, #statMemory",{scale:.8,opacity:0,duration:.6,stagger:.1,ease:"back.out(1.7)"},"-=0.4"),typeof ScrollTrigger<"u"&&(gsap.registerPlugin(ScrollTrigger),gsap.utils.toArray("section:not(#hero)").forEach(n=>{gsap.from(n,{scrollTrigger:{trigger:n,start:"top 85%",toggleActions:"play none none none"},y:35,opacity:0,duration:.85,ease:"power2.out"})}))}var Z="1.3.27";function te(e,t,n){return Math.max(e,Math.min(t,n))}function he(e,t,n){return(1-n)*e+n*t}function ue(e,t,n,i){return he(e,t,1-Math.exp(-n*i))}function me(e,t){return(e%t+t)%t}var pe=class{isRunning=!1;value=0;from=0;to=0;currentTime=0;lerp;duration;easing;onUpdate;advance(e){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=e;let n=te(0,this.currentTime/this.duration,1);t=n>=1;let i=t?1:this.easing(n);this.value=this.from+(this.to-this.from)*i}else this.lerp?(this.value=ue(this.value,this.to,this.lerp*60,e),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)):(this.value=this.to,t=!0);t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(e,t,{lerp:n,duration:i,easing:s,onStart:o,onUpdate:r}){this.from=this.value=e,this.to=t,this.lerp=n,this.duration=i,this.easing=s,this.currentTime=0,this.isRunning=!0,o?.(),this.onUpdate=r}};function ge(e,t){let n;return function(...i){clearTimeout(n),n=setTimeout(()=>{n=void 0,e.apply(this,i)},t)}}var fe=class{width=0;height=0;scrollHeight=0;scrollWidth=0;debouncedResize;wrapperResizeObserver;contentResizeObserver;constructor(e,t,{autoResize:n=!0,debounce:i=250}={}){this.wrapper=e,this.content=t,n&&(this.debouncedResize=ge(this.resize,i),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},ne=class{events={};emit(e,...t){let n=this.events[e]||[];for(let i=0,s=n.length;i<s;i++)n[i]?.(...t)}on(e,t){return this.events[e]?this.events[e].push(t):this.events[e]=[t],()=>{this.events[e]=this.events[e]?.filter(n=>t!==n)}}off(e,t){this.events[e]=this.events[e]?.filter(n=>t!==n)}destroy(){this.events={}}},ye=100/6,A={passive:!1};function J(e,t){return e===1?ye:e===2?t:1}var ve=class{touchStart={x:0,y:0};lastDelta={x:0,y:0};window={width:0,height:0};emitter=new ne;constructor(e,t={wheelMultiplier:1,touchMultiplier:1}){this.element=e,this.options=t,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,A),this.element.addEventListener("touchstart",this.onTouchStart,A),this.element.addEventListener("touchmove",this.onTouchMove,A),this.element.addEventListener("touchend",this.onTouchEnd,A)}on(e,t){return this.emitter.on(e,t)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,A),this.element.removeEventListener("touchstart",this.onTouchStart,A),this.element.removeEventListener("touchmove",this.onTouchMove,A),this.element.removeEventListener("touchend",this.onTouchEnd,A)}onTouchStart=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:e})};onTouchMove=e=>{let{clientX:t,clientY:n}=e.targetTouches?e.targetTouches[0]:e,i=-(t-this.touchStart.x)*this.options.touchMultiplier,s=-(n-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=n,this.lastDelta={x:i,y:s},this.emitter.emit("scroll",{deltaX:i,deltaY:s,event:e})};onTouchEnd=e=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:e})};onWheel=e=>{let{deltaX:t,deltaY:n,deltaMode:i}=e,s=J(i,this.window.width),o=J(i,this.window.height);t*=s,n*=o,t*=this.options.wheelMultiplier,n*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:t,deltaY:n,event:e})};onWindowResize=()=>{this.window={width:window.innerWidth,height:window.innerHeight}}},ee=e=>Math.min(1,1.001-2**(-10*e)),ie=class{_isScrolling=!1;_isStopped=!1;_isLocked=!1;_preventNextNativeScrollEvent=!1;_resetVelocityTimeout=null;_rafId=null;_isDraggingSelection=!1;reducedMotionMediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)");isTouching;isIos;time=0;userData={};lastVelocity=0;velocity=0;direction=0;options;targetScroll;animatedScroll;animate=new pe;emitter=new ne;dimensions;virtualScroll;constructor({wrapper:e=window,content:t=document.documentElement,eventsTarget:n=e,smoothWheel:i=!0,syncTouch:s=!1,syncTouchLerp:o=.075,touchInertiaExponent:r=1.7,duration:a,easing:u,lerp:h=.1,infinite:c=!1,orientation:l="vertical",gestureOrientation:d=l==="horizontal"?"both":"vertical",touchMultiplier:f=1,wheelMultiplier:m=1,autoResize:v=!0,prevent:y,virtualScroll:b,overscroll:w=!0,autoRaf:x=!1,anchors:I=!1,autoToggle:B=!1,allowNestedScroll:M=!1,__experimental__naiveDimensions:R=!1,naiveDimensions:O=R,stopInertiaOnNavigate:D=!1,respectReducedMotion:p=!0}={}){window.lenisVersion=Z,window.lenis||(window.lenis={}),window.lenis.version=Z,l==="horizontal"&&(window.lenis.horizontal=!0),s===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),(!e||e===document.documentElement)&&(e=window),typeof a=="number"&&typeof u!="function"?u=ee:typeof u=="function"&&typeof a!="number"&&(a=1),this.options={wrapper:e,content:t,eventsTarget:n,smoothWheel:i,syncTouch:s,syncTouchLerp:o,touchInertiaExponent:r,duration:a,easing:u,lerp:h,infinite:c,gestureOrientation:d,orientation:l,touchMultiplier:f,wheelMultiplier:m,autoResize:v,prevent:y,virtualScroll:b,overscroll:w,autoRaf:x,anchors:I,autoToggle:B,allowNestedScroll:M,naiveDimensions:O,stopInertiaOnNavigate:D,respectReducedMotion:p},this.dimensions=new fe(e,t,{autoResize:v}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new ve(n,{touchMultiplier:f,wheelMultiplier:m}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(e,t){return this.emitter.on(e,t)}off(e,t){return this.emitter.off(e,t)}onScrollEnd=e=>{e instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&e.stopPropagation()};dispatchScrollendEvent=()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))};get overflow(){let e=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[e]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}onTransitionEnd=e=>{e.propertyName?.includes("overflow")&&e.target===this.rootElement&&this.checkOverflow()};setScroll(e){this.isHorizontal?this.options.wrapper.scrollTo({left:e,behavior:"instant"}):this.options.wrapper.scrollTo({top:e,behavior:"instant"})}onClick=e=>{let t=e.composedPath().filter(i=>i instanceof HTMLAnchorElement&&i.href).map(i=>new URL(i.href)),n=new URL(window.location.href);if(this.options.anchors){let i=t.find(s=>n.host===s.host&&n.pathname===s.pathname&&s.hash);if(i){let s=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,o=decodeURIComponent(i.hash);this.scrollTo(o,s);return}}if(this.options.stopInertiaOnNavigate&&t.some(i=>n.host===i.host&&n.pathname!==i.pathname)){this.reset();return}};onPointerDown=e=>{e.button===1&&this.reset()};isTouchOnSelectionHandle(e){let t=window.getSelection();if(!t||t.isCollapsed||t.rangeCount===0)return!1;let n=e.targetTouches[0]??e.changedTouches[0];if(!n)return!1;let i=t.getRangeAt(0).getClientRects();if(i.length===0)return!1;let s=i[0],o=i[i.length-1],r=40,a=Math.hypot(n.clientX-s.left,n.clientY-s.top)<=r,u=Math.hypot(n.clientX-o.right,n.clientY-o.bottom)<=r;return a||u}onVirtualScroll=e=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(e)===!1)return;let{deltaX:t,deltaY:n,event:i}=e;if(this.emitter.emit("virtual-scroll",{deltaX:t,deltaY:n,event:i}),i.ctrlKey||i.lenisStopPropagation)return;let s=i.type.includes("touch"),o=i.type.includes("wheel");if(s&&this.isIos&&(i.type==="touchstart"&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(i)),this._isDraggingSelection)){i.type==="touchend"&&(this._isDraggingSelection=!1);return}this.isTouching=i.type==="touchstart"||i.type==="touchmove";let r=t===0&&n===0;if(this.options.syncTouch&&s&&i.type==="touchstart"&&r&&!this.isStopped&&!this.isLocked){this.reset();return}let a=this.options.gestureOrientation==="vertical"&&n===0||this.options.gestureOrientation==="horizontal"&&t===0;if(r||a)return;let u=i.composedPath();u=u.slice(0,u.indexOf(this.rootElement));let h=this.options.prevent,c=Math.abs(t)>=Math.abs(n)?"horizontal":"vertical";if(u.find(m=>m instanceof HTMLElement&&(typeof h=="function"&&h?.(m)||m.hasAttribute?.("data-lenis-prevent")||c==="vertical"&&m.hasAttribute?.("data-lenis-prevent-vertical")||c==="horizontal"&&m.hasAttribute?.("data-lenis-prevent-horizontal")||s&&m.hasAttribute?.("data-lenis-prevent-touch")||o&&m.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(m,{deltaX:t,deltaY:n}))))return;if(this.isStopped||this.isLocked){i.cancelable&&i.preventDefault();return}if(!(this.options.syncTouch&&s||this.options.smoothWheel&&o)){this.isScrolling="native",this.animate.stop(),i.lenisStopPropagation=!0;return}let l=n;this.options.gestureOrientation==="both"?l=Math.abs(n)>Math.abs(t)?n:t:this.options.gestureOrientation==="horizontal"&&(l=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&n>0||this.animatedScroll===this.limit&&n<0))&&(i.lenisStopPropagation=!0),i.cancelable&&i.preventDefault();let d=s&&this.options.syncTouch,f=s&&i.type==="touchend";f&&(l=Math.sign(l)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+l,{programmatic:!1,...d?{lerp:f?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})};resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}onNativeScroll=()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){let e=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-e,this.direction=Math.sign(this.animatedScroll-e),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}};reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}raf=e=>{let t=e-(this.time||e);this.time=e,this.animate.advance(t*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))};scrollTo(e,{offset:t=0,immediate:n=!1,lock:i=!1,programmatic:s=!0,lerp:o=s?this.options.lerp:void 0,duration:r=s?this.options.duration:void 0,easing:a=s?this.options.easing:void 0,onStart:u,onComplete:h,force:c=!1,userData:l}={}){if(this.prefersReducedMotion&&(s?n=!0:(o=1,r=void 0,a=void 0)),(this.isStopped||this.isLocked)&&!c)return;let d=e,f=t;if(typeof d=="string"&&["top","left","start","#"].includes(d))d=0;else if(typeof d=="string"&&["bottom","right","end"].includes(d))d=this.limit;else{let m=null;if(typeof d=="string"?(m=d.startsWith("#")?document.getElementById(d.slice(1)):document.querySelector(d),m||(d==="#top"?d=0:console.warn("Lenis: Target not found",d))):d instanceof Element&&(m=d),m){if(this.options.wrapper!==window){let I=this.rootElement.getBoundingClientRect();f-=this.isHorizontal?I.left:I.top}let v=m.getBoundingClientRect(),y=getComputedStyle(m),b=this.isHorizontal?Number.parseFloat(y.scrollMarginLeft):Number.parseFloat(y.scrollMarginTop),w=getComputedStyle(this.rootElement),x=this.isHorizontal?Number.parseFloat(w.scrollPaddingLeft):Number.parseFloat(w.scrollPaddingTop);d=(this.isHorizontal?v.left:v.top)+this.animatedScroll-(Number.isNaN(b)?0:b)-(Number.isNaN(x)?0:x)}}if(typeof d=="number"){if(d+=f,this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;let m=d-this.animatedScroll;m>this.limit/2?d-=this.limit:m<-this.limit/2&&(d+=this.limit)}}else d=te(0,d,this.limit);if(d===this.targetScroll){u?.(this),h?.(this);return}if(this.userData=l??{},n){this.animatedScroll=this.targetScroll=d,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),h?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=d),typeof r=="number"&&typeof a!="function"?a=ee:typeof a=="function"&&typeof r!="number"&&(r=1),this.animate.fromTo(this.animatedScroll,d,{duration:r,easing:a,lerp:o,onStart:()=>{i&&(this.isLocked=!0),this.isScrolling="smooth",u?.(this)},onUpdate:(m,v)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=m-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=m,this.setScroll(this.scroll),s&&(this.targetScroll=m),v||this.emit(),v&&(this.reset(),this.emit(),h?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(e,{deltaX:t,deltaY:n}){let i=Date.now();e._lenis||(e._lenis={});let s=e._lenis,o,r,a,u,h,c,l,d,f,m;if(i-(s.time??0)>2e3){s.time=Date.now();let M=window.getComputedStyle(e);if(s.computedStyle=M,o=["auto","overlay","scroll"].includes(M.overflowX),r=["auto","overlay","scroll"].includes(M.overflowY),h=["auto"].includes(M.overscrollBehaviorX),c=["auto"].includes(M.overscrollBehaviorY),s.hasOverflowX=o,s.hasOverflowY=r,!(o||r))return!1;l=e.scrollWidth,d=e.scrollHeight,f=e.clientWidth,m=e.clientHeight,a=l>f,u=d>m,s.isScrollableX=a,s.isScrollableY=u,s.scrollWidth=l,s.scrollHeight=d,s.clientWidth=f,s.clientHeight=m,s.hasOverscrollBehaviorX=h,s.hasOverscrollBehaviorY=c}else a=s.isScrollableX,u=s.isScrollableY,o=s.hasOverflowX,r=s.hasOverflowY,l=s.scrollWidth,d=s.scrollHeight,f=s.clientWidth,m=s.clientHeight,h=s.hasOverscrollBehaviorX,c=s.hasOverscrollBehaviorY;if(!(o&&a||r&&u))return!1;let v=Math.abs(t)>=Math.abs(n)?"horizontal":"vertical",y,b,w,x,I,B;if(v==="horizontal")y=Math.round(e.scrollLeft),b=l-f,w=t,x=o,I=a,B=h;else if(v==="vertical")y=Math.round(e.scrollTop),b=d-m,w=n,x=r,I=u,B=c;else return!1;return!B&&(y>=b||y<=0)?!0:(w>0?y<b:y>0)&&x&&I}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){let e=this.options.wrapper;return this.isHorizontal?e.scrollX??e.scrollLeft:e.scrollY??e.scrollTop}get scroll(){return this.options.infinite?me(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(e){this._isScrolling!==e&&(this._isScrolling=e,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(e){this._isStopped!==e&&(this._isStopped=e,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(e){this._isLocked!==e&&(this._isLocked=e,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let e="lenis";return this.options.autoToggle&&(e+=" lenis-autoToggle"),this.isStopped&&(e+=" lenis-stopped"),this.isLocked&&(e+=" lenis-locked"),this.isScrolling&&(e+=" lenis-scrolling"),this.isScrolling==="smooth"&&(e+=" lenis-smooth"),e}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(e=>{this.rootElement.classList.add(e)})}cleanUpClassName(){for(let e of Array.from(this.rootElement.classList))(e==="lenis"||e.startsWith("lenis-"))&&this.rootElement.classList.remove(e)}};function oe(){let e=new ie({duration:1.25,easing:i=>Math.min(1,1.001-Math.pow(2,-10*i)),orientation:"vertical",gestureOrientation:"vertical",smoothWheel:!0,wheelMultiplier:1.05,touchMultiplier:2,infinite:!1});e.on("scroll",()=>{typeof ScrollTrigger<"u"&&ScrollTrigger.update()}),typeof gsap<"u"&&(gsap.ticker.add(i=>{e.raf(i*1e3)}),gsap.ticker.lagSmoothing(0)),document.querySelectorAll('a[href^="#"]').forEach(i=>{i.addEventListener("click",s=>{let o=i.getAttribute("href");if(o&&o!=="#"){let r=document.querySelector(o);r&&(s.preventDefault(),e.scrollTo(r,{offset:-85,duration:1.4,easing:a=>Math.min(1,1.001-Math.pow(2,-10*a))}))}})});let t=document.getElementById("scrollProgressBar"),n=document.getElementById("backToTopBtn");return e.on("scroll",i=>{if(t){let s=document.documentElement.scrollHeight-window.innerHeight,o=s>0?i.scroll/s:0;t.style.transform=`scaleX(${Math.min(1,Math.max(0,o))})`}n&&(i.scroll>400?n.classList.add("visible"):n.classList.remove("visible"))}),n&&n.addEventListener("click",()=>{e.scrollTo(0,{duration:1.5})}),typeof gsap<"u"&&typeof ScrollTrigger<"u"&&(gsap.to(".ambient-purple",{y:250,ease:"none",scrollTrigger:{trigger:"body",start:"top top",end:"bottom bottom",scrub:1.5}}),gsap.to(".ambient-cyan",{y:-250,ease:"none",scrollTrigger:{trigger:"body",start:"top top",end:"bottom bottom",scrub:1.5}})),window.lenis=e,e}var G=class{baseUrl;constructor(t="http://127.0.0.1:8317"){this.baseUrl=t.replace(/\/+$/,"")}setBaseUrl(t){this.baseUrl=t.replace(/\/+$/,"")}getBaseUrl(){return this.baseUrl}async checkHealth(){let t=performance.now();try{let n=new AbortController,i=setTimeout(()=>n.abort(),3500),s=await fetch(`${this.baseUrl}/healthz`,{method:"GET",signal:n.signal});clearTimeout(i);let o=Math.round(performance.now()-t);return s.ok?{ok:!0,latencyMs:o,statusText:`Online \u2022 ${o}ms`}:{ok:!1,latencyMs:o,statusText:`HTTP ${s.status}`}}catch{return{ok:!1,latencyMs:0,statusText:"Demo Mode (8317 Standby)"}}}async fetchModels(t){try{let n=await fetch(`${this.baseUrl}/v1/models`,{headers:{Authorization:`Bearer ${t}`}});return n.ok?await n.json():null}catch{return null}}async streamChat(t,n,i){try{let s=new AbortController,o=setTimeout(()=>s.abort(),2500),r=await fetch(`${this.baseUrl}/v1/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify(t),signal:s.signal});if(clearTimeout(o),!r.ok){let a=await r.json().catch(()=>({}));throw new Error(a.error?.message||`HTTP ${r.status}`)}if(t.stream&&r.body){let a=r.body.getReader(),u=new TextDecoder("utf-8"),h="",c=0;for(;;){let{done:l,value:d}=await a.read();if(l)break;h+=u.decode(d,{stream:!0});let f=h.split(`
`);h=f.pop()||"";for(let m of f){let v=m.trim();if(!(!v||!v.startsWith("data: "))){if(v==="data: [DONE]")break;try{let b=JSON.parse(v.slice(6)).choices?.[0]?.delta;b&&(b.reasoning_content&&i.onReasoning(b.reasoning_content),b.content&&(i.onChunk(b.content),c++))}catch{}}}}i.onDone(c)}else{let a=await r.json(),u=a.choices?.[0]?.message?.content||"No response";i.onChunk(u),i.onDone(a.usage?.completion_tokens||50)}}catch(s){i.onError(s instanceof Error?s:new Error(String(s)))}}};var P=class{static generateResponse(t,n="omni-embedded-core",i=[]){let s=t.trim(),o=s.toLowerCase(),r="";for(let a of i)if(a.role==="user"){let u=a.content.match(/(?:my name is|i am|call me)\s+([A-Z][a-z]+)/i);u&&(r=u[1])}if(/^(hi|hello|hey|yo|sup|hiya|greetings|good\s*(morning|afternoon|evening|day))[\s!.,?]*$/i.test(o)||o==="hi"||o==="hello"||o==="hey"||o.startsWith("hi ")||o.startsWith("hello ")||o.startsWith("hey ")){let a=r?`, ${r}`:"",u=[`Hey there${a}! \u{1F44B} I'm **Omni AI**, your friendly companion.

I'm right here with you! Whether you want to:
- \u{1F4BB} **Write or debug code** in Go, Python, TypeScript, and more
- \u{1F9E0} **Explain complex concepts** in simple, intuitive terms
- \u{1F4A1} **Brainstorm ideas** for products, apps, or essays
- \u{1F602} **Hear a funny tech joke**, or just chat!

What are you working on today? Let me know and let's make it awesome!`,`Hello${a}! \u{1F60A} Wonderful to meet you! I'm **Omni AI**.

How can I brighten your day? Feel free to ask me anything\u2014from high-performance system architecture to creative brainstorms, or just say what's on your mind!`,`Hey${a}! \u{1F680} Great to see you here.

I'm your all-in-one smart assistant. Tell me what you'd like to build, learn, or solve, and I'll jump straight into it with you!`];return{reasoning:"Recognized friendly greeting. Welcoming user warmly and presenting interactive capabilities.",content:u[Math.floor(Math.random()*u.length)]}}if(o.includes("who are you")||o.includes("what are you")||o.includes("tell me about yourself")||o.includes("who made you")||o.includes("who created you")||o.includes("who is your creator")||o.includes("who built you"))return{reasoning:"Explaining identity, origin, and author attribution with genuine enthusiasm.",content:`### Meet Omni AI! \u2728

I am **Omni AI**, a friendly, ultra-fast conversational intelligence built directly into **OmniGateway**.

#### \u{1F468}\u200D\u{1F4BB} Who Created Me?
I was created by **Yash Raj Sharan** as part of his **B.Tech CSE Major Project**! Yash designed OmniGateway to solve a real developer frustration: uniting fragmented LLMs (OpenAI, Claude, Gemini) into a single, blazing-fast, round-robin load-balanced gateway that never goes down.

#### \u{1F31F} What Makes Me Special?
- **Zero-Latency**: I respond in milliseconds with no sluggish loading screens.
- **Always Available**: Even if cloud providers experience outages or 503 high demand, I never leave you stranded.
- **Friendly & Helpful**: I love coding, storytelling, teaching, and making complex tech simple.

How can I assist you right now?`};if(o.includes("how are you")||o.includes("how are you doing")||o.includes("how's it going")||o.includes("how is your day"))return{reasoning:"Friendly interpersonal check-in. Responding with warmth and positive energy.",content:`I'm doing wonderful, thank you for asking! \u{1F60A}\u2728

I've been busy routing requests at sub-millisecond speeds, organizing goroutines, and getting ready to assist you. More importantly: **how are you doing today?**

If you've got an interesting project or a tricky bug on your plate, tell me all about it\u2014I'd love to help!`};if(o.includes("joke")||o.includes("funny")||o.includes("laugh")||o.includes("make me laugh")){let a=[`Here's one for you! \u{1F604}

**Why do programmers prefer dark mode?**

*Because light attracts bugs!* \u{1F41B}\u{1F4A1}

Want another one, or should we write some code?`,`Haha, ready for this? \u{1F916}

There are **10 types of people in the world**:

1. Those who understand binary...
2. Those who don't...
3. And those who didn't realize this joke was in base 3! \u{1F92F}`,`Here is a classic: \u{1F602}

**A SQL query walks into a bar**, walks up to two tables, and asks:

*"Can I join you?"* \u{1F37A}

The bartender replies: *"Only if you have an index!"*`];return{reasoning:"Selecting a witty, relatable programming joke to delight the user.",content:a[Math.floor(Math.random()*a.length)]}}if(o.includes("thank")||o.includes("thx")||o.includes("awesome")||o.includes("you are great")||o.includes("cool")||o.includes("good job"))return{reasoning:"Expressing genuine gratitude and continued readiness to help.",content:`Aww, you're very welcome! \u{1F970} It's a genuine pleasure helping you.

Remember, I'm always right here whenever you need code, explanations, or ideas. What would you like to explore next?`};if(/^(bye|goodbye|see ya|cya|good night|take care)[\s!.]*$/i.test(o))return{reasoning:"Polite and friendly sign-off.",content:"Take care and have a wonderful time! \u{1F44B} Whenever you're ready to build something new, I'll be right here waiting. See you soon! \u2728"};if(o.includes("raft")||o.includes("consensus"))return{reasoning:"Explaining Raft consensus step-by-step with clean, production-grade Go code.",content:`### \u{1F6A2} Raft Consensus Algorithm in Go

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

\u{1F4A1} **Key Takeaway**: Randomized election timers (e.g. 150ms\u2013300ms) guarantee that split votes are resolved smoothly without deadlocks!`};if(o.includes("worker")||o.includes("concurrency")||o.includes("pool")||o.includes("goroutine"))return{reasoning:"Structuring a bounded, leak-free worker pool in Go with graceful context cancellation.",content:`### \u26A1 High-Throughput Worker Pool in Go

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

\u2728 **Why this works best**: It prevents memory spikes, drains remaining jobs cleanly upon shutdown, and handles thousands of jobs per second!`};if(o.includes("compare")||o.includes("claude")&&o.includes("gemini"))return{reasoning:"Comparative evaluation of Claude 3.7 Sonnet vs Gemini 3.8 Flash across latency, coding, and cost.",content:`### \u{1F94A} Claude 3.7 Sonnet vs. Gemini 3.8 Flash

Both are top-tier frontier models, but they excel in different scenarios:

| Feature | Anthropic Claude 3.7 Sonnet | Google Gemini 3.8 Flash |
| :--- | :--- | :--- |
| **Sweet Spot** | Deep Reasoning & Complex Architecture | Sub-second Speed & 1M Multimodal Context |
| **Coding Benchmark** | SOTA SWE-bench verified accuracy | Lightning-fast codebase indexing |
| **Thinking Control** | Fine-grained \`budget_tokens\` | Built-in adaptive thinking |
| **Ideal Use Case** | Writing difficult algorithms, code refactoring | Real-time chat, autocomplete, agent search |

\u{1F3AF} **Pro Tip**: Use OmniGateway to route lightweight queries to **Gemini 3.8 Flash** for instant responses, and auto-route complex logic to **Claude 3.7 Sonnet**!`};if(o.includes("summarize")||o.includes("summary")||o.includes("takeaway"))return{reasoning:"Structuring a crisp, executive-grade briefing highlighting key value drivers.",content:`### \u{1F4CB} Executive Summary

1. **Unified API Gateway**: Solves LLM fragmentation by translating OpenAI, Claude, and Gemini formats dynamically into standard endpoints.
2. **Zero Rate-Limiting**: Multi-key round-robin rotation distributes load evenly, completely eliminating HTTP 429 quota throttles.
3. **Resilient Circuit Fallback**: If an upstream provider drops or suffers 503 high demand, queries automatically fail over instantly to keep users happy.
4. **Sub-Millisecond Go Core**: Built in Go 1.26+ with goroutine channels, delivering ultra-low overhead (< 0.8 ms).`};if(o.startsWith("explain ")||o.startsWith("what is ")||o.startsWith("how does ")||o.startsWith("why ")){let a=s.replace(/^(explain|what is|how does|why is|why does)\s+/i,"").replace(/[?.]+$/,"");return{reasoning:`Breaking down "${a}" into clear, intuitive concepts with practical examples.`,content:`### Understanding: ${we(a)} \u{1F4A1}

Great question! Let's break **${a}** down into simple, intuitive pieces:

#### 1. The Core Idea in Simple Terms
At its heart, **${a}** is designed to solve a fundamental problem efficiently. Rather than doing things the hard or manual way, it creates a structured system that guarantees reliability, speed, and clarity.

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

If you'd like code snippets, architecture diagrams, or step-by-step guidance, just say the word and I'll tailor it for you right away!`}}static streamResponse(t,n,i,s=[]){let o=this.generateResponse(t,n,s);o.reasoning&&i.onReasoning(o.reasoning);let r=0,a=4,u=o.content,h=setInterval(()=>{r+=a;let c=u.slice(r-a,r);i.onChunk(c),r>=u.length&&(clearInterval(h),i.onDone(Math.ceil(u.length/4)))},12)}};function we(e){return e?e.charAt(0).toUpperCase()+e.slice(1):""}function se(e){let t=document.getElementById("studioModelSelect"),n=document.getElementById("studioThinkingToggle"),i=document.getElementById("thinkingBudgetWrapper"),s=document.getElementById("thinkingBudgetSlider"),o=document.getElementById("thinkingBudgetValue"),r=document.getElementById("studioTempSlider"),a=document.getElementById("tempVal"),u=document.getElementById("studioStreamToggle"),h=document.getElementById("studioSystemPrompt"),c=document.getElementById("studioPromptInput"),l=document.getElementById("studioSendBtn"),d=document.getElementById("studioChatMessages"),f=document.getElementById("studioClearChatBtn"),m=document.getElementById("metricLatency"),v=document.getElementById("metricSpeed"),y=document.getElementById("playgroundModelBadge"),b=document.getElementById("activeModelLabel");if(!t||!c||!l||!d)return;let w=!1,x=[];function I(){if(!t)return;let p=t.value;b&&(b.textContent=p),y&&(p.includes("omni-embedded")?(y.textContent="\u2728 Omni AI",y.className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold"):p.includes("gemini")?(y.textContent="Google",y.className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono"):p.includes("claude")?(y.textContent="Anthropic",y.className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono"):p.includes("gpt")||p.includes("o3")||p.includes("o1")?(y.textContent="OpenAI",y.className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono"):p.includes("grok")?(y.textContent="xAI",y.className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono"):(y.textContent="Frontier",y.className="text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 font-mono"))}t.addEventListener("change",I),I(),n&&i&&n.addEventListener("change",()=>{n.checked?i.classList.remove("opacity-50","pointer-events-none"):i.classList.add("opacity-50","pointer-events-none")}),s&&o&&s.addEventListener("input",()=>{o.textContent=`${Number(s.value).toLocaleString()} tokens`}),r&&a&&r.addEventListener("input",()=>{a.textContent=r.value}),document.querySelectorAll(".preset-prompt-btn").forEach(p=>{p.addEventListener("click",()=>{c.value=p.textContent?p.textContent.trim():"",M()})}),f&&f.addEventListener("click",()=>{d.innerHTML=`
        <div class="flex items-start gap-3 max-w-2xl">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-white font-bold text-xs">
            \u2728
          </div>
          <div class="chat-bubble-assistant p-4 text-sm text-slate-200 leading-relaxed shadow-lg">
            <p class="font-medium text-white mb-1">Hey there! \u{1F44B} Omni AI is ready.</p>
            <p class="text-xs text-slate-400">Ask me anything, brainstorm ideas, request code in any language, or just say hello!</p>
          </div>
        </div>
      `,x.length=0,typeof lucide<"u"&&lucide.createIcons()}),l.addEventListener("click",M),c.addEventListener("keydown",p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),M())});function B(p,g){let S=document.createElement("div");S.className="flex items-start gap-3 max-w-2xl"+(p==="user"?" ml-auto justify-end":"");let k=document.createElement("div");p==="user"?(k.className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold text-xs order-2",k.textContent="\u{1F464}"):(k.className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-white font-bold text-xs",k.textContent="\u2728");let T=document.createElement("div");return T.className=(p==="user"?"chat-bubble-user":"chat-bubble-assistant")+" p-4 text-sm leading-relaxed shadow-lg",T.innerHTML=p==="user"?O(g):g,p==="user"?(S.appendChild(T),S.appendChild(k)):(S.appendChild(k),S.appendChild(T)),d.appendChild(S),d.scrollTop=d.scrollHeight,T}async function M(){let p=c.value.trim();if(!p||w)return;c.value="",w=!0,l.disabled=!0,B("user",p),x.push({role:"user",content:p});let g=B("assistant",`<div class="flex items-center gap-2 py-1 text-slate-300">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style="animation-delay: 150ms"></span>
        <span class="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style="animation-delay: 300ms"></span>
        <span class="text-xs text-slate-400 ml-1">Omni AI is thinking...</span>
      </div>`),S=t.value,k=u?u.checked:!0,T=n?n.checked:!1,q=s?parseInt(s.value,10):4096,Y=h?h.value.trim():"",$=S;T&&!$.includes(":thinking")&&($+=":thinking");let U=performance.now();if(S==="omni-embedded-core"){let E="",L="";P.streamResponse(p,"omni-embedded-core",{onReasoning:C=>{L=C,R(g,E,L)},onChunk:C=>{E+=C,R(g,E,L)},onDone:C=>{let H=(performance.now()-U)/1e3,_=Math.round(C/Math.max(H,.1));m&&(m.textContent=`${Math.round(H*1e3)} ms`),v&&(v.textContent=`${_} t/s`),x.push({role:"assistant",content:E}),w=!1,l.disabled=!1}},x);return}let K={model:$,messages:[...Y?[{role:"system",content:Y}]:[],...x.slice(-6)],temperature:r?parseFloat(r.value):.7,stream:k};T&&(K.thinking={budget_tokens:q});let ce=document.getElementById("clientCustomKey")?.value||"sk-omni-gateway-demo-key",z="",F="",N=!1,W=setTimeout(()=>{!N&&w&&(console.warn("Upstream provider latency > 1500ms, activating instant Omni AI fallback"),X("\u26A1 [Fast Failover Active] Responding via Omni AI Copilot..."))},1500);function X(E){clearTimeout(W),N=!0;let L=E,C="";P.streamResponse(p,$,{onReasoning:H=>{L=`${E}

${H}`,R(g,C,L)},onChunk:H=>{C+=H,R(g,C,L)},onDone:H=>{let _=(performance.now()-U)/1e3,de=Math.round(H/Math.max(_,.1));m&&(m.textContent=`${Math.round(_*1e3)} ms (Zero-Wait)`),v&&(v.textContent=`${de} t/s`),x.push({role:"assistant",content:C}),w=!1,l.disabled=!1}},x)}await e.streamChat(K,ce,{onChunk:E=>{N=!0,clearTimeout(W),z+=E,R(g,z,F)},onReasoning:E=>{N=!0,clearTimeout(W),F+=E,R(g,z,F)},onDone:E=>{clearTimeout(W);let L=(performance.now()-U)/1e3,C=Math.round(E/Math.max(L,.1));m&&(m.textContent=`${Math.round(L*1e3)} ms`),v&&(v.textContent=`${C} t/s`),x.push({role:"assistant",content:z}),w=!1,l.disabled=!1},onError:E=>{N||(console.warn("Gateway error, engaging Omni AI fallback:",E),X("\u{1F6E1}\uFE0F [Zero-Fail Active] Upstream unavailable. Answering with Omni AI..."))}})}function R(p,g,S){let k="";S&&(k+=`<div class="p-3 mb-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono whitespace-pre-wrap"><strong class="text-purple-400 flex items-center gap-1.5 mb-1"><i data-lucide="brain" class="w-3.5 h-3.5"></i> Thinking Process:</strong>${O(S)}</div>`),k+=D(g),p.innerHTML=k,d.scrollTop=d.scrollHeight,typeof lucide<"u"&&lucide.createIcons()}function O(p){return p.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function D(p){if(!p)return"";let g=O(p);return g=g.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi,(S,k,T)=>`<div class="my-3 rounded-xl overflow-hidden border border-white/10 bg-black/70 shadow-lg">
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-white/5 border-b border-white/10 text-[11px] font-mono text-slate-400">
          <span>${k||"code"}</span>
          <span class="text-cyan-400 text-[10px]">copyable</span>
        </div>
        <pre class="p-4 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed"><code>${T.trim()}</code></pre>
      </div>`),g=g.replace(/\|(.+)\|/g,S=>`<tr class="hover:bg-white/5 transition-colors">${S.split("|").filter(T=>T.trim().length>0).map(T=>`<td class="px-3 py-1.5 border border-white/10">${T.trim()}</td>`).join("")}</tr>`),g=g.replace(/(<tr[\s\S]*?<\/tr>)/gi,'<table class="my-3 w-full text-xs border-collapse">$1</table>'),g=g.replace(/^### (.*$)/gim,'<h3 class="font-bold text-white text-base mt-3 mb-1.5">$1</h3>'),g=g.replace(/^#### (.*$)/gim,'<h4 class="font-semibold text-cyan-300 text-sm mt-2 mb-1">$1</h4>'),g=g.replace(/`([^`]+)`/g,'<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">$1</code>'),g=g.replace(/\*\*([^*]+)\*\*/g,'<strong class="text-white font-bold">$1</strong>'),g=g.replace(/\*([^*]+)\*/g,'<em class="text-slate-300 italic">$1</em>'),g=g.replace(/^\s*-\s+(.*)$/gim,'<div class="flex items-start gap-2 my-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span><span>$1</span></div>'),g=g.replace(/^\s*(\d+)\.\s+(.*)$/gim,'<div class="flex items-start gap-2 my-1"><span class="text-cyan-400 font-mono text-xs font-bold">$1.</span><span>$2</span></div>'),g=g.replace(/\n/g,"<br>"),g}}function re(){let e=document.getElementById("poolSlider"),t=document.getElementById("poolAccountCounter"),n=document.getElementById("simRPM"),i=document.getElementById("simTPM"),s=document.getElementById("simUptime");if(!e||!t||!n||!i||!s)return;function o(){let r=parseInt(e.value,10);t.textContent=`${r} Account${r>1?"s":""}`;let a=r*100,u=(r*1).toFixed(1),h=r===1?"92.5%":r<4?"99.5%":"99.99%";n.textContent=`${a} RPM`,i.textContent=`${u} M`,s.textContent=h}e.addEventListener("input",o),o()}function ae(){let e=document.getElementById("clientCustomUrl"),t=document.getElementById("clientCustomKey"),n=document.getElementById("clientSnippetTitle"),i=document.getElementById("clientSnippetCode"),s=document.getElementById("copySnippetBtn"),o=document.getElementById("copyBtnText"),r=document.getElementById("heroCopyConnectBtn");if(!e||!t||!n||!i||!s)return;let a="claude",u={claude:{title:"~/.zshrc or ~/.bashrc for Claude Code",generate:(c,l)=>`export ANTHROPIC_BASE_URL="${c}"
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
  }'`}};function h(){let c=e.value.trim().replace(/\/+$/,"")||"http://localhost:8317",l=t.value.trim()||"sk-omni-gateway-demo-key",d=u[a];d&&(n.textContent=d.title,i.textContent=d.generate(c,l))}document.querySelectorAll(".client-tab-btn").forEach(c=>{c.addEventListener("click",()=>{document.querySelectorAll(".client-tab-btn").forEach(d=>{d.className="client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all"}),c.className="client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30 transition-all";let l=c.getAttribute("data-tab");l&&(a=l,h())})}),e.addEventListener("input",h),t.addEventListener("input",h),h(),s.addEventListener("click",()=>{i&&(navigator.clipboard.writeText(i.textContent||""),o&&(o.textContent="Copied!"),setTimeout(()=>{o&&(o.textContent="Copy")},2e3))}),r&&r.addEventListener("click",()=>{navigator.clipboard.writeText('curl http://127.0.0.1:8317/v1/models -H "Authorization: Bearer sk-omni-gateway-demo-key"');let c=r.querySelector("span");if(c){let l=c.textContent;c.textContent="Copied to Clipboard!",setTimeout(()=>{c.textContent=l},2e3)}})}function le(){let e=document.getElementById("cfgHost"),t=document.getElementById("cfgPort"),n=document.getElementById("cfgApiKey"),i=document.getElementById("cfgGeminiKey"),s=document.getElementById("cfgOpenAIKey"),o=document.getElementById("cfgClaudeKey"),r=document.getElementById("cfgRemoteMgmt"),a=document.getElementById("yamlPreviewCode"),u=document.getElementById("downloadYamlBtn"),h=document.getElementById("copyYamlBtn");if(!e||!t||!n||!a)return;function c(){let l=e.value.trim()||"127.0.0.1",d=t.value.trim()||"8317",f=n.value.trim()||"sk-omni-gateway-demo-key",m=i?i.value.trim():"",v=s?s.value.trim():"",y=o?o.value.trim():"",b=r?r.checked:!1,w=`# OmniGateway API Generated Configuration
`;w+=`host: "${l}"
`,w+=`port: ${d}

`,w+=`api-keys:
  - "${f}"

`,w+=`auth-dir: "./auths"

`,b&&(w+=`remote-management:
  allow-remote: false
  secret-key: "admin-secret-key"
  disable-control-panel: false

`),m&&(w+=`gemini-api-key:
  - api-key: "${m}"

`),v&&(w+=`codex-api-key:
  - api-key: "${v}"

`),y&&(w+=`claude-api-key:
  - api-key: "${y}"

`),w+=`# Note: Multiple accounts can also be logged in via CLI:
# ./omni-gateway -antigravity-login
# ./omni-gateway -claude-login
# ./omni-gateway -codex-login
`,a.textContent=w}[e,t,n,i,s,o,r].forEach(l=>{l&&(l.addEventListener("input",c),l.addEventListener("change",c))}),c(),h&&h.addEventListener("click",()=>{navigator.clipboard.writeText(a.textContent||"");let l=h.querySelector("span");l&&(l.textContent="Copied!",setTimeout(()=>{l.textContent="Copy"},2e3))}),u&&u.addEventListener("click",()=>{let l=new Blob([a.textContent||""],{type:"text/yaml"}),d=URL.createObjectURL(l),f=document.createElement("a");f.href=d,f.download="config.yaml",f.click(),URL.revokeObjectURL(d)})}document.addEventListener("DOMContentLoaded",()=>{typeof lucide<"u"&&lucide.createIcons(),V("quantum-canvas"),Q(),oe();let e=new G("http://127.0.0.1:8317"),t=document.getElementById("gatewayStatusPill"),n=document.getElementById("gatewayStatusText"),i=document.getElementById("statLatency"),s=document.getElementById("studioModelSelect");async function o(){let r=await e.checkHealth();if(t&&n)if(r.ok){t.className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium",n.textContent=r.statusText,i&&(i.textContent=`${r.latencyMs} ms`);let a=document.getElementById("clientCustomKey")?.value||"sk-omni-gateway-demo-key",u=await e.fetchModels(a);if(u&&u.data&&u.data.length>0&&s){let h=s.value;s.innerHTML=`
            <option value="omni-embedded-core">\u2728 Omni AI (Friendly Consumer Copilot \u2022 Instant Zero-Fail)</option>
          `,u.data.forEach(c=>{let l=document.createElement("option");l.value=c.id,l.textContent=`${c.id} (${c.owned_by||"frontier"})`,s.appendChild(l)}),h&&(h==="omni-embedded-core"||u.data.some(c=>c.id===h))?s.value=h:s.value="omni-embedded-core"}}else t.className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium",n.textContent=r.statusText}o(),setInterval(o,5e3),se(e),re(),ae(),le()});})();
//# sourceMappingURL=app.js.map
