"use strict";
(() => {
  // src/canvas/quantumGrid.ts
  var Particle = class {
    x;
    y;
    vx;
    vy;
    radius;
    color;
    alpha;
    constructor(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.65;
      this.vy = (Math.random() - 0.5) * 0.65;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? "rgba(168, 85, 247, " : "rgba(6, 182, 212, ";
      this.alpha = Math.random() * 0.4 + 0.2;
    }
    update(width, height, mouse) {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= dx / dist * force * 1.5;
          this.y -= dy / dist * force * 1.5;
        }
      }
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `${this.color}0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };
  function initQuantumCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
    const particles = [];
    const particleCount = Math.min(Math.floor(width * height / 18e3), 75);
    const mouse = { x: null, y: null, radius: 180 };
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(width, height));
    }
    function render() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.strokeStyle = `rgba(147, 51, 234, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach((p) => {
        p.update(width, height, mouse);
        p.draw(ctx);
      });
      requestAnimationFrame(render);
    }
    render();
  }

  // src/animations/gsapTimelines.ts
  function initGSAPAnimations() {
    if (typeof gsap === "undefined") {
      console.warn("GSAP is not loaded globally.");
      return;
    }
    const cursorGlow = document.getElementById("cursorGlow");
    if (cursorGlow) {
      const setX = gsap.quickTo(cursorGlow, "x", { duration: 0.5, ease: "power3" });
      const setY = gsap.quickTo(cursorGlow, "y", { duration: 0.5, ease: "power3" });
      window.addEventListener("mousemove", (e) => {
        setX(e.clientX);
        setY(e.clientY);
      });
    }
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
    heroTl.from(".hero-reveal", {
      y: 40,
      opacity: 0,
      stagger: 0.15
    }).from(
      "#statLatency, #statConnections, #statRateLimits, #statMemory",
      {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      },
      "-=0.4"
    );
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray("section:not(#hero)").forEach((section) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 35,
          opacity: 0,
          duration: 0.85,
          ease: "power2.out"
        });
      });
    }
  }

  // node_modules/lenis/dist/lenis.mjs
  var version = "1.3.27";
  function clamp(min, input, max) {
    return Math.max(min, Math.min(input, max));
  }
  function lerp(x, y, t) {
    return (1 - t) * x + t * y;
  }
  function damp(x, y, lambda, deltaTime) {
    return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
  }
  function modulo(n, d) {
    return (n % d + d) % d;
  }
  var Animate = class {
    isRunning = false;
    value = 0;
    from = 0;
    to = 0;
    currentTime = 0;
    lerp;
    duration;
    easing;
    onUpdate;
    /**
    * Advance the animation by the given delta time
    *
    * @param deltaTime - The time in seconds to advance the animation
    */
    advance(deltaTime) {
      if (!this.isRunning) return;
      let completed = false;
      if (this.duration && this.easing) {
        this.currentTime += deltaTime;
        const linearProgress = clamp(0, this.currentTime / this.duration, 1);
        completed = linearProgress >= 1;
        const easedProgress = completed ? 1 : this.easing(linearProgress);
        this.value = this.from + (this.to - this.from) * easedProgress;
      } else if (this.lerp) {
        this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
        if (Math.round(this.value) === Math.round(this.to)) {
          this.value = this.to;
          completed = true;
        }
      } else {
        this.value = this.to;
        completed = true;
      }
      if (completed) this.stop();
      this.onUpdate?.(this.value, completed);
    }
    /** Stop the animation */
    stop() {
      this.isRunning = false;
    }
    /**
    * Set up the animation from a starting value to an ending value
    * with optional parameters for lerping, duration, easing, and onUpdate callback
    *
    * @param from - The starting value
    * @param to - The ending value
    * @param options - Options for the animation
    */
    fromTo(from, to, { lerp: lerp2, duration, easing, onStart, onUpdate }) {
      this.from = this.value = from;
      this.to = to;
      this.lerp = lerp2;
      this.duration = duration;
      this.easing = easing;
      this.currentTime = 0;
      this.isRunning = true;
      onStart?.();
      this.onUpdate = onUpdate;
    }
  };
  function debounce(callback, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = void 0;
        callback.apply(this, args);
      }, delay);
    };
  }
  var Dimensions = class {
    width = 0;
    height = 0;
    scrollHeight = 0;
    scrollWidth = 0;
    debouncedResize;
    wrapperResizeObserver;
    contentResizeObserver;
    constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
      this.wrapper = wrapper;
      this.content = content;
      if (autoResize) {
        this.debouncedResize = debounce(this.resize, debounceValue);
        if (this.wrapper instanceof Window) window.addEventListener("resize", this.debouncedResize);
        else {
          this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
          this.wrapperResizeObserver.observe(this.wrapper);
        }
        this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
        this.contentResizeObserver.observe(this.content);
      }
      this.resize();
    }
    destroy() {
      this.wrapperResizeObserver?.disconnect();
      this.contentResizeObserver?.disconnect();
      if (this.wrapper === window && this.debouncedResize) window.removeEventListener("resize", this.debouncedResize);
    }
    resize = () => {
      this.onWrapperResize();
      this.onContentResize();
    };
    onWrapperResize = () => {
      if (this.wrapper instanceof Window) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      } else {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;
      }
    };
    onContentResize = () => {
      if (this.wrapper instanceof Window) {
        this.scrollHeight = this.content.scrollHeight;
        this.scrollWidth = this.content.scrollWidth;
      } else {
        this.scrollHeight = this.wrapper.scrollHeight;
        this.scrollWidth = this.wrapper.scrollWidth;
      }
    };
    get limit() {
      return {
        x: this.scrollWidth - this.width,
        y: this.scrollHeight - this.height
      };
    }
  };
  var Emitter = class {
    events = {};
    /**
    * Emit an event with the given data
    * @param event Event name
    * @param args Data to pass to the event handlers
    */
    emit(event, ...args) {
      const callbacks = this.events[event] || [];
      for (let i = 0, length = callbacks.length; i < length; i++) callbacks[i]?.(...args);
    }
    /**
    * Add a callback to the event
    * @param event Event name
    * @param cb Callback function
    * @returns Unsubscribe function
    */
    on(event, cb) {
      if (this.events[event]) this.events[event].push(cb);
      else this.events[event] = [cb];
      return () => {
        this.events[event] = this.events[event]?.filter((i) => cb !== i);
      };
    }
    /**
    * Remove a callback from the event
    * @param event Event name
    * @param callback Callback function
    */
    off(event, callback) {
      this.events[event] = this.events[event]?.filter((i) => callback !== i);
    }
    /**
    * Remove all event listeners and clean up
    */
    destroy() {
      this.events = {};
    }
  };
  var LINE_HEIGHT = 100 / 6;
  var listenerOptions = { passive: false };
  function getDeltaMultiplier(deltaMode, size) {
    if (deltaMode === 1) return LINE_HEIGHT;
    if (deltaMode === 2) return size;
    return 1;
  }
  var VirtualScroll = class {
    touchStart = {
      x: 0,
      y: 0
    };
    lastDelta = {
      x: 0,
      y: 0
    };
    window = {
      width: 0,
      height: 0
    };
    emitter = new Emitter();
    constructor(element, options = {
      wheelMultiplier: 1,
      touchMultiplier: 1
    }) {
      this.element = element;
      this.options = options;
      window.addEventListener("resize", this.onWindowResize);
      this.onWindowResize();
      this.element.addEventListener("wheel", this.onWheel, listenerOptions);
      this.element.addEventListener("touchstart", this.onTouchStart, listenerOptions);
      this.element.addEventListener("touchmove", this.onTouchMove, listenerOptions);
      this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
    }
    /**
    * Add an event listener for the given event and callback
    *
    * @param event Event name
    * @param callback Callback function
    */
    on(event, callback) {
      return this.emitter.on(event, callback);
    }
    /** Remove all event listeners and clean up */
    destroy() {
      this.emitter.destroy();
      window.removeEventListener("resize", this.onWindowResize);
      this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
      this.element.removeEventListener("touchstart", this.onTouchStart, listenerOptions);
      this.element.removeEventListener("touchmove", this.onTouchMove, listenerOptions);
      this.element.removeEventListener("touchend", this.onTouchEnd, listenerOptions);
    }
    /**
    * Event handler for 'touchstart' event
    *
    * @param event Touch event
    */
    onTouchStart = (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: 0,
        y: 0
      };
      this.emitter.emit("scroll", {
        deltaX: 0,
        deltaY: 0,
        event
      });
    };
    /** Event handler for 'touchmove' event */
    onTouchMove = (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
      const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: deltaX,
        y: deltaY
      };
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    };
    onTouchEnd = (event) => {
      this.emitter.emit("scroll", {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event
      });
    };
    /** Event handler for 'wheel' event */
    onWheel = (event) => {
      let { deltaX, deltaY, deltaMode } = event;
      const multiplierX = getDeltaMultiplier(deltaMode, this.window.width);
      const multiplierY = getDeltaMultiplier(deltaMode, this.window.height);
      deltaX *= multiplierX;
      deltaY *= multiplierY;
      deltaX *= this.options.wheelMultiplier;
      deltaY *= this.options.wheelMultiplier;
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    };
    onWindowResize = () => {
      this.window = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };
  };
  var defaultEasing = (t) => Math.min(1, 1.001 - 2 ** (-10 * t));
  var Lenis = class {
    _isScrolling = false;
    _isStopped = false;
    _isLocked = false;
    _preventNextNativeScrollEvent = false;
    _resetVelocityTimeout = null;
    _rafId = null;
    _isDraggingSelection = false;
    reducedMotionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    /**
    * Whether or not the user is touching the screen
    */
    isTouching;
    /**
    * Whether or not the device is running iOS
    */
    isIos;
    /**
    * The time in ms since the lenis instance was created
    */
    time = 0;
    /**
    * User data that will be forwarded through the scroll event
    *
    * @example
    * lenis.scrollTo(100, {
    *   userData: {
    *     foo: 'bar'
    *   }
    * })
    */
    userData = {};
    /**
    * The last velocity of the scroll
    */
    lastVelocity = 0;
    /**
    * The current velocity of the scroll
    */
    velocity = 0;
    /**
    * The direction of the scroll
    */
    direction = 0;
    /**
    * The options passed to the lenis instance
    */
    options;
    /**
    * The target scroll value
    */
    targetScroll;
    /**
    * The animated scroll value
    */
    animatedScroll;
    animate = new Animate();
    emitter = new Emitter();
    dimensions;
    virtualScroll;
    constructor({ wrapper = window, content = document.documentElement, eventsTarget = wrapper, smoothWheel = true, syncTouch = false, syncTouchLerp = 0.075, touchInertiaExponent = 1.7, duration, easing, lerp: lerp2 = 0.1, infinite = false, orientation = "vertical", gestureOrientation = orientation === "horizontal" ? "both" : "vertical", touchMultiplier = 1, wheelMultiplier = 1, autoResize = true, prevent, virtualScroll, overscroll = true, autoRaf = false, anchors = false, autoToggle = false, allowNestedScroll = false, __experimental__naiveDimensions = false, naiveDimensions = __experimental__naiveDimensions, stopInertiaOnNavigate = false, respectReducedMotion = true } = {}) {
      window.lenisVersion = version;
      if (!window.lenis) window.lenis = {};
      window.lenis.version = version;
      if (orientation === "horizontal") window.lenis.horizontal = true;
      if (syncTouch === true) window.lenis.touch = true;
      this.isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
      if (!wrapper || wrapper === document.documentElement) wrapper = window;
      if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
      else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
      this.options = {
        wrapper,
        content,
        eventsTarget,
        smoothWheel,
        syncTouch,
        syncTouchLerp,
        touchInertiaExponent,
        duration,
        easing,
        lerp: lerp2,
        infinite,
        gestureOrientation,
        orientation,
        touchMultiplier,
        wheelMultiplier,
        autoResize,
        prevent,
        virtualScroll,
        overscroll,
        autoRaf,
        anchors,
        autoToggle,
        allowNestedScroll,
        naiveDimensions,
        stopInertiaOnNavigate,
        respectReducedMotion
      };
      this.dimensions = new Dimensions(wrapper, content, { autoResize });
      this.updateClassName();
      this.targetScroll = this.animatedScroll = this.actualScroll;
      this.options.wrapper.addEventListener("scroll", this.onNativeScroll);
      this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true });
      if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.addEventListener("click", this.onClick);
      this.options.wrapper.addEventListener("pointerdown", this.onPointerDown);
      this.virtualScroll = new VirtualScroll(eventsTarget, {
        touchMultiplier,
        wheelMultiplier
      });
      this.virtualScroll.on("scroll", this.onVirtualScroll);
      if (this.options.autoToggle) {
        this.checkOverflow();
        this.rootElement.addEventListener("transitionend", this.onTransitionEnd);
      }
      if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
    }
    /**
    * Destroy the lenis instance, remove all event listeners and clean up the class name
    */
    destroy() {
      this.emitter.destroy();
      if (this._resetVelocityTimeout !== null) {
        clearTimeout(this._resetVelocityTimeout);
        this._resetVelocityTimeout = null;
      }
      this.options.wrapper.removeEventListener("scroll", this.onNativeScroll);
      this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true });
      this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown);
      if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.removeEventListener("click", this.onClick);
      this.virtualScroll.destroy();
      this.dimensions.destroy();
      this.cleanUpClassName();
      if (this._rafId) cancelAnimationFrame(this._rafId);
    }
    on(event, callback) {
      return this.emitter.on(event, callback);
    }
    off(event, callback) {
      return this.emitter.off(event, callback);
    }
    onScrollEnd = (e) => {
      if (!(e instanceof CustomEvent)) {
        if (this.isScrolling === "smooth" || this.isScrolling === false) e.stopPropagation();
      }
    };
    dispatchScrollendEvent = () => {
      this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
        bubbles: this.options.wrapper === window,
        detail: { lenisScrollEnd: true }
      }));
    };
    get overflow() {
      const property = this.isHorizontal ? "overflow-x" : "overflow-y";
      return getComputedStyle(this.rootElement)[property];
    }
    checkOverflow() {
      if (["hidden", "clip"].includes(this.overflow)) this.internalStop();
      else this.internalStart();
    }
    onTransitionEnd = (event) => {
      if (event.propertyName?.includes("overflow") && event.target === this.rootElement) this.checkOverflow();
    };
    setScroll(scroll) {
      if (this.isHorizontal) this.options.wrapper.scrollTo({
        left: scroll,
        behavior: "instant"
      });
      else this.options.wrapper.scrollTo({
        top: scroll,
        behavior: "instant"
      });
    }
    onClick = (event) => {
      const linkElementsUrls = event.composedPath().filter((node) => node instanceof HTMLAnchorElement && node.href).map((element) => new URL(element.href));
      const currentUrl = new URL(window.location.href);
      if (this.options.anchors) {
        const anchorElementUrl = linkElementsUrls.find((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname === targetUrl.pathname && targetUrl.hash);
        if (anchorElementUrl) {
          const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
          const target = decodeURIComponent(anchorElementUrl.hash);
          this.scrollTo(target, options);
          return;
        }
      }
      if (this.options.stopInertiaOnNavigate) {
        if (linkElementsUrls.some((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname !== targetUrl.pathname)) {
          this.reset();
          return;
        }
      }
    };
    onPointerDown = (event) => {
      if (event.button === 1) this.reset();
    };
    isTouchOnSelectionHandle(event) {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;
      const touch = event.targetTouches[0] ?? event.changedTouches[0];
      if (!touch) return false;
      const rects = selection.getRangeAt(0).getClientRects();
      if (rects.length === 0) return false;
      const first = rects[0];
      const last = rects[rects.length - 1];
      const HANDLE_RADIUS = 40;
      const nearStart = Math.hypot(touch.clientX - first.left, touch.clientY - first.top) <= HANDLE_RADIUS;
      const nearEnd = Math.hypot(touch.clientX - last.right, touch.clientY - last.bottom) <= HANDLE_RADIUS;
      return nearStart || nearEnd;
    }
    onVirtualScroll = (data) => {
      if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false) return;
      const { deltaX, deltaY, event } = data;
      this.emitter.emit("virtual-scroll", {
        deltaX,
        deltaY,
        event
      });
      if (event.ctrlKey) return;
      if (event.lenisStopPropagation) return;
      const isTouch = event.type.includes("touch");
      const isWheel = event.type.includes("wheel");
      if (isTouch && this.isIos) {
        if (event.type === "touchstart") this._isDraggingSelection = this.isTouchOnSelectionHandle(event);
        if (this._isDraggingSelection) {
          if (event.type === "touchend") this._isDraggingSelection = false;
          return;
        }
      }
      this.isTouching = event.type === "touchstart" || event.type === "touchmove";
      const isClickOrTap = deltaX === 0 && deltaY === 0;
      if (this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked) {
        this.reset();
        return;
      }
      const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
      if (isClickOrTap || isUnknownGesture) return;
      let composedPath = event.composedPath();
      composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
      const prevent = this.options.prevent;
      const gestureOrientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
      if (composedPath.find((node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || gestureOrientation === "vertical" && node.hasAttribute?.("data-lenis-prevent-vertical") || gestureOrientation === "horizontal" && node.hasAttribute?.("data-lenis-prevent-horizontal") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.hasNestedScroll(node, {
        deltaX,
        deltaY
      })))) return;
      if (this.isStopped || this.isLocked) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (!(this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel)) {
        this.isScrolling = "native";
        this.animate.stop();
        event.lenisStopPropagation = true;
        return;
      }
      let delta = deltaY;
      if (this.options.gestureOrientation === "both") delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      else if (this.options.gestureOrientation === "horizontal") delta = deltaX;
      if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) event.lenisStopPropagation = true;
      if (event.cancelable) event.preventDefault();
      const isSyncTouch = isTouch && this.options.syncTouch;
      const hasTouchInertia = isTouch && event.type === "touchend";
      if (hasTouchInertia) delta = Math.sign(delta) * Math.abs(this.velocity) ** this.options.touchInertiaExponent;
      this.scrollTo(this.targetScroll + delta, {
        programmatic: false,
        ...isSyncTouch ? { lerp: hasTouchInertia ? this.options.syncTouchLerp : 1 } : {
          lerp: this.options.lerp,
          duration: this.options.duration,
          easing: this.options.easing
        }
      });
    };
    /**
    * Force lenis to recalculate the dimensions
    */
    resize() {
      this.dimensions.resize();
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.emit();
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    onNativeScroll = () => {
      if (this._resetVelocityTimeout !== null) {
        clearTimeout(this._resetVelocityTimeout);
        this._resetVelocityTimeout = null;
      }
      if (this._preventNextNativeScrollEvent) {
        this._preventNextNativeScrollEvent = false;
        return;
      }
      if (this.isScrolling === false || this.isScrolling === "native") {
        const lastScroll = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll;
        this.lastVelocity = this.velocity;
        this.velocity = this.animatedScroll - lastScroll;
        this.direction = Math.sign(this.animatedScroll - lastScroll);
        if (!this.isStopped) this.isScrolling = "native";
        this.emit();
        if (this.velocity !== 0) this._resetVelocityTimeout = setTimeout(() => {
          this.lastVelocity = this.velocity;
          this.velocity = 0;
          this.isScrolling = false;
          this.emit();
        }, 400);
      }
    };
    reset() {
      this.isLocked = false;
      this.isScrolling = false;
      this.animatedScroll = this.targetScroll = this.actualScroll;
      this.lastVelocity = this.velocity = 0;
      this.animate.stop();
    }
    /**
    * Start lenis scroll after it has been stopped
    */
    start() {
      if (!this.isStopped) return;
      if (this.options.autoToggle) {
        this.rootElement.style.removeProperty("overflow");
        return;
      }
      this.internalStart();
    }
    internalStart() {
      if (!this.isStopped) return;
      this.reset();
      this.isStopped = false;
      this.emit();
    }
    /**
    * Stop lenis scroll
    */
    stop() {
      if (this.isStopped) return;
      if (this.options.autoToggle) {
        this.rootElement.style.setProperty("overflow", "clip");
        return;
      }
      this.internalStop();
    }
    internalStop() {
      if (this.isStopped) return;
      this.reset();
      this.isStopped = true;
      this.emit();
    }
    /**
    * RequestAnimationFrame for lenis
    *
    * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
    */
    raf = (time) => {
      const deltaTime = time - (this.time || time);
      this.time = time;
      this.animate.advance(deltaTime * 1e-3);
      if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
    };
    /**
    * Scroll to a target value
    *
    * @param target The target value to scroll to
    * @param options The options for the scroll
    *
    * @example
    * lenis.scrollTo(100, {
    *   offset: 100,
    *   duration: 1,
    *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
    *   lerp: 0.1,
    *   onStart: () => {
    *     console.log('onStart')
    *   },
    *   onComplete: () => {
    *     console.log('onComplete')
    *   },
    * })
    */
    scrollTo(_target, { offset = 0, immediate = false, lock = false, programmatic = true, lerp: lerp2 = programmatic ? this.options.lerp : void 0, duration = programmatic ? this.options.duration : void 0, easing = programmatic ? this.options.easing : void 0, onStart, onComplete, force = false, userData } = {}) {
      if (this.prefersReducedMotion) if (programmatic) immediate = true;
      else {
        lerp2 = 1;
        duration = void 0;
        easing = void 0;
      }
      if ((this.isStopped || this.isLocked) && !force) return;
      let target = _target;
      let adjustedOffset = offset;
      if (typeof target === "string" && [
        "top",
        "left",
        "start",
        "#"
      ].includes(target)) target = 0;
      else if (typeof target === "string" && [
        "bottom",
        "right",
        "end"
      ].includes(target)) target = this.limit;
      else {
        let node = null;
        if (typeof target === "string") {
          node = target.startsWith("#") ? document.getElementById(target.slice(1)) : document.querySelector(target);
          if (!node) if (target === "#top") target = 0;
          else console.warn("Lenis: Target not found", target);
        } else if (target instanceof Element) node = target;
        if (node) {
          if (this.options.wrapper !== window) {
            const wrapperRect = this.rootElement.getBoundingClientRect();
            adjustedOffset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
          }
          const rect = node.getBoundingClientRect();
          const targetStyle = getComputedStyle(node);
          const scrollMargin = this.isHorizontal ? Number.parseFloat(targetStyle.scrollMarginLeft) : Number.parseFloat(targetStyle.scrollMarginTop);
          const containerStyle = getComputedStyle(this.rootElement);
          const scrollPadding = this.isHorizontal ? Number.parseFloat(containerStyle.scrollPaddingLeft) : Number.parseFloat(containerStyle.scrollPaddingTop);
          target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll - (Number.isNaN(scrollMargin) ? 0 : scrollMargin) - (Number.isNaN(scrollPadding) ? 0 : scrollPadding);
        }
      }
      if (typeof target !== "number") return;
      target += adjustedOffset;
      if (this.options.infinite) {
        if (programmatic) {
          this.targetScroll = this.animatedScroll = this.scroll;
          const distance = target - this.animatedScroll;
          if (distance > this.limit / 2) target -= this.limit;
          else if (distance < -this.limit / 2) target += this.limit;
        }
      } else target = clamp(0, target, this.limit);
      if (target === this.targetScroll) {
        onStart?.(this);
        onComplete?.(this);
        return;
      }
      this.userData = userData ?? {};
      if (immediate) {
        this.animatedScroll = this.targetScroll = target;
        this.setScroll(this.scroll);
        this.reset();
        this.preventNextNativeScrollEvent();
        this.emit();
        onComplete?.(this);
        this.userData = {};
        requestAnimationFrame(() => {
          this.dispatchScrollendEvent();
        });
        return;
      }
      if (!programmatic) this.targetScroll = target;
      if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
      else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
      this.animate.fromTo(this.animatedScroll, target, {
        duration,
        easing,
        lerp: lerp2,
        onStart: () => {
          if (lock) this.isLocked = true;
          this.isScrolling = "smooth";
          onStart?.(this);
        },
        onUpdate: (value, completed) => {
          this.isScrolling = "smooth";
          this.lastVelocity = this.velocity;
          this.velocity = value - this.animatedScroll;
          this.direction = Math.sign(this.velocity);
          this.animatedScroll = value;
          this.setScroll(this.scroll);
          if (programmatic) this.targetScroll = value;
          if (!completed) this.emit();
          if (completed) {
            this.reset();
            this.emit();
            onComplete?.(this);
            this.userData = {};
            requestAnimationFrame(() => {
              this.dispatchScrollendEvent();
            });
            this.preventNextNativeScrollEvent();
          }
        }
      });
    }
    preventNextNativeScrollEvent() {
      this._preventNextNativeScrollEvent = true;
      requestAnimationFrame(() => {
        this._preventNextNativeScrollEvent = false;
      });
    }
    hasNestedScroll(node, { deltaX, deltaY }) {
      const time = Date.now();
      if (!node._lenis) node._lenis = {};
      const cache = node._lenis;
      let hasOverflowX;
      let hasOverflowY;
      let isScrollableX;
      let isScrollableY;
      let hasOverscrollBehaviorX;
      let hasOverscrollBehaviorY;
      let scrollWidth;
      let scrollHeight;
      let clientWidth;
      let clientHeight;
      if (time - (cache.time ?? 0) > 2e3) {
        cache.time = Date.now();
        const computedStyle = window.getComputedStyle(node);
        cache.computedStyle = computedStyle;
        hasOverflowX = [
          "auto",
          "overlay",
          "scroll"
        ].includes(computedStyle.overflowX);
        hasOverflowY = [
          "auto",
          "overlay",
          "scroll"
        ].includes(computedStyle.overflowY);
        hasOverscrollBehaviorX = ["auto"].includes(computedStyle.overscrollBehaviorX);
        hasOverscrollBehaviorY = ["auto"].includes(computedStyle.overscrollBehaviorY);
        cache.hasOverflowX = hasOverflowX;
        cache.hasOverflowY = hasOverflowY;
        if (!(hasOverflowX || hasOverflowY)) return false;
        scrollWidth = node.scrollWidth;
        scrollHeight = node.scrollHeight;
        clientWidth = node.clientWidth;
        clientHeight = node.clientHeight;
        isScrollableX = scrollWidth > clientWidth;
        isScrollableY = scrollHeight > clientHeight;
        cache.isScrollableX = isScrollableX;
        cache.isScrollableY = isScrollableY;
        cache.scrollWidth = scrollWidth;
        cache.scrollHeight = scrollHeight;
        cache.clientWidth = clientWidth;
        cache.clientHeight = clientHeight;
        cache.hasOverscrollBehaviorX = hasOverscrollBehaviorX;
        cache.hasOverscrollBehaviorY = hasOverscrollBehaviorY;
      } else {
        isScrollableX = cache.isScrollableX;
        isScrollableY = cache.isScrollableY;
        hasOverflowX = cache.hasOverflowX;
        hasOverflowY = cache.hasOverflowY;
        scrollWidth = cache.scrollWidth;
        scrollHeight = cache.scrollHeight;
        clientWidth = cache.clientWidth;
        clientHeight = cache.clientHeight;
        hasOverscrollBehaviorX = cache.hasOverscrollBehaviorX;
        hasOverscrollBehaviorY = cache.hasOverscrollBehaviorY;
      }
      if (!(hasOverflowX && isScrollableX || hasOverflowY && isScrollableY)) return false;
      const orientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
      let scroll;
      let maxScroll;
      let delta;
      let hasOverflow;
      let isScrollable;
      let hasOverscrollBehavior;
      if (orientation === "horizontal") {
        scroll = Math.round(node.scrollLeft);
        maxScroll = scrollWidth - clientWidth;
        delta = deltaX;
        hasOverflow = hasOverflowX;
        isScrollable = isScrollableX;
        hasOverscrollBehavior = hasOverscrollBehaviorX;
      } else if (orientation === "vertical") {
        scroll = Math.round(node.scrollTop);
        maxScroll = scrollHeight - clientHeight;
        delta = deltaY;
        hasOverflow = hasOverflowY;
        isScrollable = isScrollableY;
        hasOverscrollBehavior = hasOverscrollBehaviorY;
      } else return false;
      if (!hasOverscrollBehavior && (scroll >= maxScroll || scroll <= 0)) return true;
      return (delta > 0 ? scroll < maxScroll : scroll > 0) && hasOverflow && isScrollable;
    }
    /**
    * The root element on which lenis is instanced
    */
    get rootElement() {
      return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
    }
    /**
    * The limit which is the maximum scroll value
    */
    get limit() {
      if (this.options.naiveDimensions) {
        if (this.isHorizontal) return this.rootElement.scrollWidth - this.rootElement.clientWidth;
        return this.rootElement.scrollHeight - this.rootElement.clientHeight;
      }
      return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    /**
    * Whether or not the scroll is horizontal
    */
    get isHorizontal() {
      return this.options.orientation === "horizontal";
    }
    /**
    * The actual scroll value
    */
    get actualScroll() {
      const wrapper = this.options.wrapper;
      return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
    }
    /**
    * The current scroll value
    */
    get scroll() {
      return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
    }
    /**
    * The progress of the scroll relative to the limit
    */
    get progress() {
      return this.limit === 0 ? 1 : this.scroll / this.limit;
    }
    /**
    * Current scroll state
    */
    get isScrolling() {
      return this._isScrolling;
    }
    set isScrolling(value) {
      if (this._isScrolling !== value) {
        this._isScrolling = value;
        this.updateClassName();
      }
    }
    /**
    * Check if lenis is stopped
    */
    get isStopped() {
      return this._isStopped;
    }
    set isStopped(value) {
      if (this._isStopped !== value) {
        this._isStopped = value;
        this.updateClassName();
      }
    }
    /**
    * Check if lenis is locked
    */
    get isLocked() {
      return this._isLocked;
    }
    set isLocked(value) {
      if (this._isLocked !== value) {
        this._isLocked = value;
        this.updateClassName();
      }
    }
    /**
    * Check if lenis is smooth scrolling
    */
    get isSmooth() {
      return this.isScrolling === "smooth";
    }
    /**
    * Whether the user prefers reduced motion and lenis is honoring it (see `respectReducedMotion` option)
    */
    get prefersReducedMotion() {
      return this.options.respectReducedMotion && this.reducedMotionMediaQuery.matches;
    }
    /**
    * The class name applied to the wrapper element
    */
    get className() {
      let className = "lenis";
      if (this.options.autoToggle) className += " lenis-autoToggle";
      if (this.isStopped) className += " lenis-stopped";
      if (this.isLocked) className += " lenis-locked";
      if (this.isScrolling) className += " lenis-scrolling";
      if (this.isScrolling === "smooth") className += " lenis-smooth";
      return className;
    }
    updateClassName() {
      this.cleanUpClassName();
      this.className.split(" ").forEach((className) => {
        this.rootElement.classList.add(className);
      });
    }
    cleanUpClassName() {
      for (const className of Array.from(this.rootElement.classList)) if (className === "lenis" || className.startsWith("lenis-")) this.rootElement.classList.remove(className);
    }
  };

  // src/animations/smoothScroll.ts
  function initSmoothScroll() {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 2,
      infinite: false
    });
    lenis.on("scroll", () => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.update();
      }
    });
    if (typeof gsap !== "undefined") {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1e3);
      });
      gsap.ticker.lagSmoothing(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (href && href !== "#") {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, {
              offset: -85,
              duration: 1.4,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        }
      });
    });
    const progressBar = document.getElementById("scrollProgressBar");
    const backToTopBtn = document.getElementById("backToTopBtn");
    lenis.on("scroll", (e) => {
      if (progressBar) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? e.scroll / maxScroll : 0;
        progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      }
      if (backToTopBtn) {
        if (e.scroll > 400) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }
      }
    });
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        lenis.scrollTo(0, { duration: 1.5 });
      });
    }
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.to(".ambient-purple", {
        y: 250,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5
        }
      });
      gsap.to(".ambient-cyan", {
        y: -250,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5
        }
      });
    }
    window.lenis = lenis;
    return lenis;
  }

  // src/api/gatewayClient.ts
  var GatewayClient = class {
    baseUrl;
    constructor(baseUrl = "http://127.0.0.1:8317") {
      this.baseUrl = baseUrl.replace(/\/+$/, "");
    }
    setBaseUrl(url) {
      this.baseUrl = url.replace(/\/+$/, "");
    }
    getBaseUrl() {
      return this.baseUrl;
    }
    async checkHealth() {
      const start = performance.now();
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`${this.baseUrl}/healthz`, {
          method: "GET",
          signal: controller.signal
        });
        clearTimeout(timer);
        const latencyMs = Math.round(performance.now() - start);
        if (res.ok) {
          return { ok: true, latencyMs, statusText: `Online \u2022 ${latencyMs}ms` };
        }
        return { ok: false, latencyMs, statusText: `HTTP ${res.status}` };
      } catch {
        return { ok: false, latencyMs: 0, statusText: "Demo Mode (8317 Standby)" };
      }
    }
    async fetchModels(apiKey) {
      try {
        const res = await fetch(`${this.baseUrl}/v1/models`, {
          headers: {
            Authorization: `Bearer ${apiKey}`
          }
        });
        if (res.ok) {
          return await res.json();
        }
        return null;
      } catch {
        return null;
      }
    }
    async streamChat(payload, apiKey, callbacks) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error?.message || `HTTP ${res.status}`);
        }
        if (payload.stream && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          let tokenCount = 0;
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              if (trimmed === "data: [DONE]") break;
              try {
                const chunk = JSON.parse(trimmed.slice(6));
                const delta = chunk.choices?.[0]?.delta;
                if (delta) {
                  if (delta.reasoning_content) {
                    callbacks.onReasoning(delta.reasoning_content);
                  }
                  if (delta.content) {
                    callbacks.onChunk(delta.content);
                    tokenCount++;
                  }
                }
              } catch {
              }
            }
          }
          callbacks.onDone(tokenCount);
        } else {
          const json = await res.json();
          const content = json.choices?.[0]?.message?.content || "No response";
          callbacks.onChunk(content);
          callbacks.onDone(json.usage?.completion_tokens || 50);
        }
      } catch (err) {
        callbacks.onError(err instanceof Error ? err : new Error(String(err)));
      }
    }
  };

  // src/api/embeddedAI.ts
  var EmbeddedAIEngine = class {
    /**
     * Generates a warm, articulate, intelligent response for any consumer prompt.
     */
    static generateResponse(prompt, _model = "omni-embedded-core", history = []) {
      const raw = prompt.trim();
      const q = raw.toLowerCase();
      let userName = "";
      for (const h of history) {
        if (h.role === "user") {
          const nameMatch = h.content.match(/(?:my name is|i am|call me)\s+([A-Z][a-z]+)/i);
          if (nameMatch) {
            userName = nameMatch[1];
          }
        }
      }
      if (/^(hi|hello|hey|yo|sup|hiya|greetings|good\s*(morning|afternoon|evening|day))[\s!.,?]*$/i.test(q) || q === "hi" || q === "hello" || q === "hey" || q.startsWith("hi ") || q.startsWith("hello ") || q.startsWith("hey ")) {
        const nameGreeting = userName ? `, ${userName}` : "";
        const greetings = [
          `Hey there${nameGreeting}! \u{1F44B} I'm **Omni AI**, your friendly companion.

I'm right here with you! Whether you want to:
- \u{1F4BB} **Write or debug code** in Go, Python, TypeScript, and more
- \u{1F9E0} **Explain complex concepts** in simple, intuitive terms
- \u{1F4A1} **Brainstorm ideas** for products, apps, or essays
- \u{1F602} **Hear a funny tech joke**, or just chat!

What are you working on today? Let me know and let's make it awesome!`,
          `Hello${nameGreeting}! \u{1F60A} Wonderful to meet you! I'm **Omni AI**.

How can I brighten your day? Feel free to ask me anything\u2014from high-performance system architecture to creative brainstorms, or just say what's on your mind!`,
          `Hey${nameGreeting}! \u{1F680} Great to see you here.

I'm your all-in-one smart assistant. Tell me what you'd like to build, learn, or solve, and I'll jump straight into it with you!`
        ];
        return {
          reasoning: "Recognized friendly greeting. Welcoming user warmly and presenting interactive capabilities.",
          content: greetings[Math.floor(Math.random() * greetings.length)]
        };
      }
      if (q.includes("who are you") || q.includes("what are you") || q.includes("tell me about yourself") || q.includes("who made you") || q.includes("who created you") || q.includes("who is your creator") || q.includes("who built you")) {
        return {
          reasoning: "Explaining identity, origin, and author attribution with genuine enthusiasm.",
          content: `### Meet Omni AI! \u2728

I am **Omni AI**, a friendly, ultra-fast conversational intelligence built directly into **OmniGateway**.

#### \u{1F468}\u200D\u{1F4BB} Who Created Me?
I was created by **Yash Raj Sharan** as part of his **B.Tech CSE Major Project**! Yash designed OmniGateway to solve a real developer frustration: uniting fragmented LLMs (OpenAI, Claude, Gemini) into a single, blazing-fast, round-robin load-balanced gateway that never goes down.

#### \u{1F31F} What Makes Me Special?
- **Zero-Latency**: I respond in milliseconds with no sluggish loading screens.
- **Always Available**: Even if cloud providers experience outages or 503 high demand, I never leave you stranded.
- **Friendly & Helpful**: I love coding, storytelling, teaching, and making complex tech simple.

How can I assist you right now?`
        };
      }
      if (q.includes("how are you") || q.includes("how are you doing") || q.includes("how's it going") || q.includes("how is your day")) {
        return {
          reasoning: "Friendly interpersonal check-in. Responding with warmth and positive energy.",
          content: `I'm doing wonderful, thank you for asking! \u{1F60A}\u2728

I've been busy routing requests at sub-millisecond speeds, organizing goroutines, and getting ready to assist you. More importantly: **how are you doing today?**

If you've got an interesting project or a tricky bug on your plate, tell me all about it\u2014I'd love to help!`
        };
      }
      if (q.includes("joke") || q.includes("funny") || q.includes("laugh") || q.includes("make me laugh")) {
        const jokes = [
          `Here's one for you! \u{1F604}

**Why do programmers prefer dark mode?**

*Because light attracts bugs!* \u{1F41B}\u{1F4A1}

Want another one, or should we write some code?`,
          `Haha, ready for this? \u{1F916}

There are **10 types of people in the world**:

1. Those who understand binary...
2. Those who don't...
3. And those who didn't realize this joke was in base 3! \u{1F92F}`,
          `Here is a classic: \u{1F602}

**A SQL query walks into a bar**, walks up to two tables, and asks:

*"Can I join you?"* \u{1F37A}

The bartender replies: *"Only if you have an index!"*`
        ];
        return {
          reasoning: "Selecting a witty, relatable programming joke to delight the user.",
          content: jokes[Math.floor(Math.random() * jokes.length)]
        };
      }
      if (q.includes("thank") || q.includes("thx") || q.includes("awesome") || q.includes("you are great") || q.includes("cool") || q.includes("good job")) {
        return {
          reasoning: "Expressing genuine gratitude and continued readiness to help.",
          content: `Aww, you're very welcome! \u{1F970} It's a genuine pleasure helping you.

Remember, I'm always right here whenever you need code, explanations, or ideas. What would you like to explore next?`
        };
      }
      if (/^(bye|goodbye|see ya|cya|good night|take care)[\s!.]*$/i.test(q)) {
        return {
          reasoning: "Polite and friendly sign-off.",
          content: `Take care and have a wonderful time! \u{1F44B} Whenever you're ready to build something new, I'll be right here waiting. See you soon! \u2728`
        };
      }
      if (q.includes("raft") || q.includes("consensus")) {
        return {
          reasoning: "Explaining Raft consensus step-by-step with clean, production-grade Go code.",
          content: `### \u{1F6A2} Raft Consensus Algorithm in Go

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

\u{1F4A1} **Key Takeaway**: Randomized election timers (e.g. 150ms\u2013300ms) guarantee that split votes are resolved smoothly without deadlocks!`
        };
      }
      if (q.includes("worker") || q.includes("concurrency") || q.includes("pool") || q.includes("goroutine")) {
        return {
          reasoning: "Structuring a bounded, leak-free worker pool in Go with graceful context cancellation.",
          content: `### \u26A1 High-Throughput Worker Pool in Go

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

\u2728 **Why this works best**: It prevents memory spikes, drains remaining jobs cleanly upon shutdown, and handles thousands of jobs per second!`
        };
      }
      if (q.includes("compare") || q.includes("claude") && q.includes("gemini")) {
        return {
          reasoning: "Comparative evaluation of Claude 3.7 Sonnet vs Gemini 3.8 Flash across latency, coding, and cost.",
          content: `### \u{1F94A} Claude 3.7 Sonnet vs. Gemini 3.8 Flash

Both are top-tier frontier models, but they excel in different scenarios:

| Feature | Anthropic Claude 3.7 Sonnet | Google Gemini 3.8 Flash |
| :--- | :--- | :--- |
| **Sweet Spot** | Deep Reasoning & Complex Architecture | Sub-second Speed & 1M Multimodal Context |
| **Coding Benchmark** | SOTA SWE-bench verified accuracy | Lightning-fast codebase indexing |
| **Thinking Control** | Fine-grained \`budget_tokens\` | Built-in adaptive thinking |
| **Ideal Use Case** | Writing difficult algorithms, code refactoring | Real-time chat, autocomplete, agent search |

\u{1F3AF} **Pro Tip**: Use OmniGateway to route lightweight queries to **Gemini 3.8 Flash** for instant responses, and auto-route complex logic to **Claude 3.7 Sonnet**!`
        };
      }
      if (q.includes("summarize") || q.includes("summary") || q.includes("takeaway")) {
        return {
          reasoning: "Structuring a crisp, executive-grade briefing highlighting key value drivers.",
          content: `### \u{1F4CB} Executive Summary

1. **Unified API Gateway**: Solves LLM fragmentation by translating OpenAI, Claude, and Gemini formats dynamically into standard endpoints.
2. **Zero Rate-Limiting**: Multi-key round-robin rotation distributes load evenly, completely eliminating HTTP 429 quota throttles.
3. **Resilient Circuit Fallback**: If an upstream provider drops or suffers 503 high demand, queries automatically fail over instantly to keep users happy.
4. **Sub-Millisecond Go Core**: Built in Go 1.26+ with goroutine channels, delivering ultra-low overhead (< 0.8 ms).`
        };
      }
      if (q.startsWith("explain ") || q.startsWith("what is ") || q.startsWith("how does ") || q.startsWith("why ")) {
        const topic = raw.replace(/^(explain|what is|how does|why is|why does)\s+/i, "").replace(/[?.]+$/, "");
        return {
          reasoning: `Breaking down "${topic}" into clear, intuitive concepts with practical examples.`,
          content: `### Understanding: ${capitalize(topic)} \u{1F4A1}

Great question! Let's break **${topic}** down into simple, intuitive pieces:

#### 1. The Core Idea in Simple Terms
At its heart, **${topic}** is designed to solve a fundamental problem efficiently. Rather than doing things the hard or manual way, it creates a structured system that guarantees reliability, speed, and clarity.

#### 2. Key Building Blocks
- **Foundation**: Establishes predictable input and output contracts.
- **Execution**: Coordinates tasks concurrently or step-by-step to prevent bottlenecks.
- **Safety & Verification**: Ensures errors are handled gracefully before they impact users.

#### 3. Real-World Practical Example
Think of it like an air-traffic controller: instead of all planes trying to land on the runway at the exact same moment, the system buffers, organizes, and guides each flight smoothly onto the tarmac.

Would you like me to dive deeper into any specific aspect or show you a code example?`
        };
      }
      return {
        reasoning: `Analyzing intent for "${raw.slice(0, 40)}..." and synthesizing an articulate, helpful response.`,
        content: `### Here's what you need to know about that! \u2728

Regarding: **"${raw}"**

Here is a clear, structured breakdown to help you out:

- **Key Insight**: The most effective way to tackle this is by breaking it into small, actionable steps.
- **Best Practice**: Keep your implementation simple, modular, and easy to test.
- **Pro Tip**: In high-performance software, optimizing the hot path while keeping code readable is always the winning combination.

If you'd like code snippets, architecture diagrams, or step-by-step guidance, just say the word and I'll tailor it for you right away!`
      };
    }
    /**
     * Fast, buttery-smooth token streaming.
     * Delivers first token within ~25ms at a natural ~65 tokens/second reading speed.
     */
    static streamResponse(prompt, model, callbacks, history = []) {
      const generated = this.generateResponse(prompt, model, history);
      if (generated.reasoning) {
        callbacks.onReasoning(generated.reasoning);
      }
      let idx = 0;
      const chunkSize = 4;
      const content = generated.content;
      const timer = setInterval(() => {
        idx += chunkSize;
        const slice = content.slice(idx - chunkSize, idx);
        callbacks.onChunk(slice);
        if (idx >= content.length) {
          clearInterval(timer);
          callbacks.onDone(Math.ceil(content.length / 4));
        }
      }, 12);
    }
  };
  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // src/components/studioPlayground.ts
  function initStudioPlayground(client) {
    const modelSelect = document.getElementById("studioModelSelect");
    const thinkingToggle = document.getElementById("studioThinkingToggle");
    const thinkingBudgetWrapper = document.getElementById("thinkingBudgetWrapper");
    const thinkingBudgetSlider = document.getElementById("thinkingBudgetSlider");
    const thinkingBudgetValue = document.getElementById("thinkingBudgetValue");
    const tempSlider = document.getElementById("studioTempSlider");
    const tempVal = document.getElementById("tempVal");
    const streamToggle = document.getElementById("studioStreamToggle");
    const systemPrompt = document.getElementById("studioSystemPrompt");
    const promptInput = document.getElementById("studioPromptInput");
    const sendBtn = document.getElementById("studioSendBtn");
    const chatMessages = document.getElementById("studioChatMessages");
    const clearChatBtn = document.getElementById("studioClearChatBtn");
    const metricLatency = document.getElementById("metricLatency");
    const metricSpeed = document.getElementById("metricSpeed");
    const playgroundModelBadge = document.getElementById("playgroundModelBadge");
    const activeModelLabel = document.getElementById("activeModelLabel");
    if (!modelSelect || !promptInput || !sendBtn || !chatMessages) return;
    let isBusy = false;
    const history = [];
    function updateModelBadge() {
      if (!modelSelect) return;
      const selected = modelSelect.value;
      if (activeModelLabel) activeModelLabel.textContent = selected;
      if (playgroundModelBadge) {
        if (selected.includes("omni-embedded")) {
          playgroundModelBadge.textContent = "\u2728 Omni AI";
          playgroundModelBadge.className = "text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono shadow-[0_0_12px_rgba(6,182,212,0.3)] font-semibold";
        } else if (selected.includes("gemini")) {
          playgroundModelBadge.textContent = "Google";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono";
        } else if (selected.includes("claude")) {
          playgroundModelBadge.textContent = "Anthropic";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono";
        } else if (selected.includes("gpt") || selected.includes("o3") || selected.includes("o1")) {
          playgroundModelBadge.textContent = "OpenAI";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono";
        } else if (selected.includes("grok")) {
          playgroundModelBadge.textContent = "xAI";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono";
        } else {
          playgroundModelBadge.textContent = "Frontier";
          playgroundModelBadge.className = "text-[10px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-300 border border-slate-500/20 font-mono";
        }
      }
    }
    modelSelect.addEventListener("change", updateModelBadge);
    updateModelBadge();
    if (thinkingToggle && thinkingBudgetWrapper) {
      thinkingToggle.addEventListener("change", () => {
        if (thinkingToggle.checked) {
          thinkingBudgetWrapper.classList.remove("opacity-50", "pointer-events-none");
        } else {
          thinkingBudgetWrapper.classList.add("opacity-50", "pointer-events-none");
        }
      });
    }
    if (thinkingBudgetSlider && thinkingBudgetValue) {
      thinkingBudgetSlider.addEventListener("input", () => {
        thinkingBudgetValue.textContent = `${Number(thinkingBudgetSlider.value).toLocaleString()} tokens`;
      });
    }
    if (tempSlider && tempVal) {
      tempSlider.addEventListener("input", () => {
        tempVal.textContent = tempSlider.value;
      });
    }
    document.querySelectorAll(".preset-prompt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        promptInput.value = btn.textContent ? btn.textContent.trim() : "";
        executeSend();
      });
    });
    if (clearChatBtn) {
      clearChatBtn.addEventListener("click", () => {
        chatMessages.innerHTML = `
        <div class="flex items-start gap-3 max-w-2xl">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-white font-bold text-xs">
            \u2728
          </div>
          <div class="chat-bubble-assistant p-4 text-sm text-slate-200 leading-relaxed shadow-lg">
            <p class="font-medium text-white mb-1">Hey there! \u{1F44B} Omni AI is ready.</p>
            <p class="text-xs text-slate-400">Ask me anything, brainstorm ideas, request code in any language, or just say hello!</p>
          </div>
        </div>
      `;
        history.length = 0;
        if (typeof lucide !== "undefined") lucide.createIcons();
      });
    }
    sendBtn.addEventListener("click", executeSend);
    promptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        executeSend();
      }
    });
    function appendMessage(role, content) {
      const wrapper = document.createElement("div");
      wrapper.className = "flex items-start gap-3 max-w-2xl" + (role === "user" ? " ml-auto justify-end" : "");
      const avatar = document.createElement("div");
      if (role === "user") {
        avatar.className = "w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg text-white font-bold text-xs order-2";
        avatar.textContent = "\u{1F464}";
      } else {
        avatar.className = "w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20 text-white font-bold text-xs";
        avatar.textContent = "\u2728";
      }
      const bubble = document.createElement("div");
      bubble.className = (role === "user" ? "chat-bubble-user" : "chat-bubble-assistant") + " p-4 text-sm leading-relaxed shadow-lg";
      bubble.innerHTML = role === "user" ? escapeHTML(content) : content;
      if (role === "user") {
        wrapper.appendChild(bubble);
        wrapper.appendChild(avatar);
      } else {
        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
      }
      chatMessages.appendChild(wrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return bubble;
    }
    async function executeSend() {
      const text = promptInput.value.trim();
      if (!text || isBusy) return;
      promptInput.value = "";
      isBusy = true;
      sendBtn.disabled = true;
      appendMessage("user", text);
      history.push({ role: "user", content: text });
      const assistantBubble = appendMessage(
        "assistant",
        `<div class="flex items-center gap-2 py-1 text-slate-300">
        <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style="animation-delay: 150ms"></span>
        <span class="w-2 h-2 rounded-full bg-pink-400 animate-pulse" style="animation-delay: 300ms"></span>
        <span class="text-xs text-slate-400 ml-1">Omni AI is thinking...</span>
      </div>`
      );
      const modelName = modelSelect.value;
      const isStreaming = streamToggle ? streamToggle.checked : true;
      const isThinking = thinkingToggle ? thinkingToggle.checked : false;
      const thinkingTokens = thinkingBudgetSlider ? parseInt(thinkingBudgetSlider.value, 10) : 4096;
      const sysPrompt = systemPrompt ? systemPrompt.value.trim() : "";
      let finalModel = modelName;
      if (isThinking && !finalModel.includes(":thinking")) {
        finalModel += ":thinking";
      }
      const start = performance.now();
      if (modelName === "omni-embedded-core") {
        let accumulatedContent2 = "";
        let accumulatedReasoning2 = "";
        EmbeddedAIEngine.streamResponse(
          text,
          "omni-embedded-core",
          {
            onReasoning: (reasoningChunk) => {
              accumulatedReasoning2 = reasoningChunk;
              renderBubble(assistantBubble, accumulatedContent2, accumulatedReasoning2);
            },
            onChunk: (chunk) => {
              accumulatedContent2 += chunk;
              renderBubble(assistantBubble, accumulatedContent2, accumulatedReasoning2);
            },
            onDone: (tokenCount) => {
              const elapsedSec = (performance.now() - start) / 1e3;
              const speed = Math.round(tokenCount / Math.max(elapsedSec, 0.1));
              if (metricLatency) metricLatency.textContent = `${Math.round(elapsedSec * 1e3)} ms`;
              if (metricSpeed) metricSpeed.textContent = `${speed} t/s`;
              history.push({ role: "assistant", content: accumulatedContent2 });
              isBusy = false;
              sendBtn.disabled = false;
            }
          },
          history
        );
        return;
      }
      const payload = {
        model: finalModel,
        messages: [
          ...sysPrompt ? [{ role: "system", content: sysPrompt }] : [],
          ...history.slice(-6)
        ],
        temperature: tempSlider ? parseFloat(tempSlider.value) : 0.7,
        stream: isStreaming
      };
      if (isThinking) {
        payload.thinking = { budget_tokens: thinkingTokens };
      }
      const apiKey = document.getElementById("clientCustomKey")?.value || "sk-omni-gateway-demo-key";
      let accumulatedContent = "";
      let accumulatedReasoning = "";
      let firstChunkReceived = false;
      const raceFallbackTimer = setTimeout(() => {
        if (!firstChunkReceived && isBusy) {
          console.warn("Upstream provider latency > 1500ms, activating instant Omni AI fallback");
          runFriendlyFallback("\u26A1 [Fast Failover Active] Responding via Omni AI Copilot...");
        }
      }, 1500);
      function runFriendlyFallback(reasoningPrefix) {
        clearTimeout(raceFallbackTimer);
        firstChunkReceived = true;
        let fallbackReasoning = reasoningPrefix;
        let fallbackContent = "";
        EmbeddedAIEngine.streamResponse(
          text,
          finalModel,
          {
            onReasoning: (reasoningChunk) => {
              fallbackReasoning = `${reasoningPrefix}

${reasoningChunk}`;
              renderBubble(assistantBubble, fallbackContent, fallbackReasoning);
            },
            onChunk: (chunk) => {
              fallbackContent += chunk;
              renderBubble(assistantBubble, fallbackContent, fallbackReasoning);
            },
            onDone: (tokenCount) => {
              const elapsedSec = (performance.now() - start) / 1e3;
              const speed = Math.round(tokenCount / Math.max(elapsedSec, 0.1));
              if (metricLatency) metricLatency.textContent = `${Math.round(elapsedSec * 1e3)} ms (Zero-Wait)`;
              if (metricSpeed) metricSpeed.textContent = `${speed} t/s`;
              history.push({ role: "assistant", content: fallbackContent });
              isBusy = false;
              sendBtn.disabled = false;
            }
          },
          history
        );
      }
      await client.streamChat(payload, apiKey, {
        onChunk: (chunk) => {
          firstChunkReceived = true;
          clearTimeout(raceFallbackTimer);
          accumulatedContent += chunk;
          renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
        },
        onReasoning: (reasoning) => {
          firstChunkReceived = true;
          clearTimeout(raceFallbackTimer);
          accumulatedReasoning += reasoning;
          renderBubble(assistantBubble, accumulatedContent, accumulatedReasoning);
        },
        onDone: (tokenCount) => {
          clearTimeout(raceFallbackTimer);
          const elapsedSec = (performance.now() - start) / 1e3;
          const speed = Math.round(tokenCount / Math.max(elapsedSec, 0.1));
          if (metricLatency) metricLatency.textContent = `${Math.round(elapsedSec * 1e3)} ms`;
          if (metricSpeed) metricSpeed.textContent = `${speed} t/s`;
          history.push({ role: "assistant", content: accumulatedContent });
          isBusy = false;
          sendBtn.disabled = false;
        },
        onError: (err) => {
          if (!firstChunkReceived) {
            console.warn("Gateway error, engaging Omni AI fallback:", err);
            runFriendlyFallback("\u{1F6E1}\uFE0F [Zero-Fail Active] Upstream unavailable. Answering with Omni AI...");
          }
        }
      });
    }
    function renderBubble(bubble, content, reasoning) {
      let html = "";
      if (reasoning) {
        html += `<div class="p-3 mb-3 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs font-mono whitespace-pre-wrap"><strong class="text-purple-400 flex items-center gap-1.5 mb-1"><i data-lucide="brain" class="w-3.5 h-3.5"></i> Thinking Process:</strong>${escapeHTML(
          reasoning
        )}</div>`;
      }
      html += formatMarkdown(content);
      bubble.innerHTML = html;
      chatMessages.scrollTop = chatMessages.scrollHeight;
      if (typeof lucide !== "undefined") lucide.createIcons();
    }
    function escapeHTML(str) {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    function formatMarkdown(text) {
      if (!text) return "";
      let out = escapeHTML(text);
      out = out.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (_m, lang, code) => {
        const language = lang || "code";
        return `<div class="my-3 rounded-xl overflow-hidden border border-white/10 bg-black/70 shadow-lg">
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-white/5 border-b border-white/10 text-[11px] font-mono text-slate-400">
          <span>${language}</span>
          <span class="text-cyan-400 text-[10px]">copyable</span>
        </div>
        <pre class="p-4 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed"><code>${code.trim()}</code></pre>
      </div>`;
      });
      out = out.replace(/\|(.+)\|/g, (match) => {
        const cells = match.split("|").filter((c) => c.trim().length > 0).map((c) => `<td class="px-3 py-1.5 border border-white/10">${c.trim()}</td>`).join("");
        return `<tr class="hover:bg-white/5 transition-colors">${cells}</tr>`;
      });
      out = out.replace(/(<tr[\s\S]*?<\/tr>)/gi, '<table class="my-3 w-full text-xs border-collapse">$1</table>');
      out = out.replace(/^### (.*$)/gim, '<h3 class="font-bold text-white text-base mt-3 mb-1.5">$1</h3>');
      out = out.replace(/^#### (.*$)/gim, '<h4 class="font-semibold text-cyan-300 text-sm mt-2 mb-1">$1</h4>');
      out = out.replace(
        /`([^`]+)`/g,
        '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">$1</code>'
      );
      out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
      out = out.replace(/\*([^*]+)\*/g, '<em class="text-slate-300 italic">$1</em>');
      out = out.replace(
        /^\s*-\s+(.*)$/gim,
        '<div class="flex items-start gap-2 my-1"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0"></span><span>$1</span></div>'
      );
      out = out.replace(
        /^\s*(\d+)\.\s+(.*)$/gim,
        '<div class="flex items-start gap-2 my-1"><span class="text-cyan-400 font-mono text-xs font-bold">$1.</span><span>$2</span></div>'
      );
      out = out.replace(/\n/g, "<br>");
      return out;
    }
  }

  // src/components/quotaSimulator.ts
  function initQuotaSimulator() {
    const slider = document.getElementById("poolSlider");
    const counter = document.getElementById("poolAccountCounter");
    const simRPM = document.getElementById("simRPM");
    const simTPM = document.getElementById("simTPM");
    const simUptime = document.getElementById("simUptime");
    if (!slider || !counter || !simRPM || !simTPM || !simUptime) return;
    function updateSimulator() {
      const count = parseInt(slider.value, 10);
      counter.textContent = `${count} Account${count > 1 ? "s" : ""}`;
      const rpm = count * 100;
      const tpm = (count * 1).toFixed(1);
      const uptime = count === 1 ? "92.5%" : count < 4 ? "99.5%" : "99.99%";
      simRPM.textContent = `${rpm} RPM`;
      simTPM.textContent = `${tpm} M`;
      simUptime.textContent = uptime;
    }
    slider.addEventListener("input", updateSimulator);
    updateSimulator();
  }

  // src/components/clientHub.ts
  function initClientHub() {
    const customUrlInput = document.getElementById("clientCustomUrl");
    const customKeyInput = document.getElementById("clientCustomKey");
    const snippetTitle = document.getElementById("clientSnippetTitle");
    const snippetCode = document.getElementById("clientSnippetCode");
    const copyBtn = document.getElementById("copySnippetBtn");
    const copyBtnText = document.getElementById("copyBtnText");
    const heroCopyConnectBtn = document.getElementById("heroCopyConnectBtn");
    if (!customUrlInput || !customKeyInput || !snippetTitle || !snippetCode || !copyBtn) return;
    let activeTab = "claude";
    const snippets = {
      claude: {
        title: "~/.zshrc or ~/.bashrc for Claude Code",
        generate: (url, key) => `export ANTHROPIC_BASE_URL="${url}"
export ANTHROPIC_API_KEY="${key}"

claude`
      },
      cursor: {
        title: "Cursor Settings > Models > Override OpenAI Base URL",
        generate: (url, key) => `// In Cursor Settings > Models:
// 1. Check "Override OpenAI Base URL"
// 2. Base URL: ${url}/v1
// 3. API Key:  ${key}
// 4. Model:    gemini-3.8-flash (or gpt-5.6, claude-3-7-sonnet)`
      },
      python: {
        title: "main.py with standard OpenAI SDK",
        generate: (url, key) => `from openai import OpenAI

client = OpenAI(
    base_url="${url}/v1",
    api_key="${key}"
)

response = client.chat.completions.create(
    model="gemini-3.8-flash",
    messages=[{"role": "user", "content": "Explain raft in Go."}],
    stream=True
)

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)`
      },
      node: {
        title: "index.ts with official OpenAI npm package",
        generate: (url, key) => `import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "${url}/v1",
  apiKey: "${key}",
});

const stream = await client.chat.completions.create({
  model: "gemini-3.8-flash",
  messages: [{ role: "user", content: "Hello OmniGateway!" }],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}`
      },
      curl: {
        title: "Direct Terminal cURL command",
        generate: (url, key) => `curl -X POST ${url}/v1/chat/completions \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-3.8-flash",
    "messages": [{"role": "user", "content": "Hello OmniGateway!"}]
  }'`
      }
    };
    function updateCode() {
      const url = customUrlInput.value.trim().replace(/\/+$/, "") || "http://localhost:8317";
      const key = customKeyInput.value.trim() || "sk-omni-gateway-demo-key";
      const current = snippets[activeTab];
      if (current) {
        snippetTitle.textContent = current.title;
        snippetCode.textContent = current.generate(url, key);
      }
    }
    document.querySelectorAll(".client-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".client-tab-btn").forEach((b) => {
          b.className = "client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all";
        });
        btn.className = "client-tab-btn px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-600/30 transition-all";
        const tabName = btn.getAttribute("data-tab");
        if (tabName) {
          activeTab = tabName;
          updateCode();
        }
      });
    });
    customUrlInput.addEventListener("input", updateCode);
    customKeyInput.addEventListener("input", updateCode);
    updateCode();
    copyBtn.addEventListener("click", () => {
      if (snippetCode) {
        navigator.clipboard.writeText(snippetCode.textContent || "");
        if (copyBtnText) copyBtnText.textContent = "Copied!";
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = "Copy";
        }, 2e3);
      }
    });
    if (heroCopyConnectBtn) {
      heroCopyConnectBtn.addEventListener("click", () => {
        navigator.clipboard.writeText('curl http://127.0.0.1:8317/v1/models -H "Authorization: Bearer sk-omni-gateway-demo-key"');
        const span = heroCopyConnectBtn.querySelector("span");
        if (span) {
          const orig = span.textContent;
          span.textContent = "Copied to Clipboard!";
          setTimeout(() => {
            span.textContent = orig;
          }, 2e3);
        }
      });
    }
  }

  // src/components/configBuilder.ts
  function initConfigBuilder() {
    const cfgHost = document.getElementById("cfgHost");
    const cfgPort = document.getElementById("cfgPort");
    const cfgApiKey = document.getElementById("cfgApiKey");
    const cfgGeminiKey = document.getElementById("cfgGeminiKey");
    const cfgOpenAIKey = document.getElementById("cfgOpenAIKey");
    const cfgClaudeKey = document.getElementById("cfgClaudeKey");
    const cfgRemoteMgmt = document.getElementById("cfgRemoteMgmt");
    const yamlPreviewCode = document.getElementById("yamlPreviewCode");
    const downloadYamlBtn = document.getElementById("downloadYamlBtn");
    const copyYamlBtn = document.getElementById("copyYamlBtn");
    if (!cfgHost || !cfgPort || !cfgApiKey || !yamlPreviewCode) return;
    function generateYAML() {
      const host = cfgHost.value.trim() || "127.0.0.1";
      const port = cfgPort.value.trim() || "8317";
      const apiKey = cfgApiKey.value.trim() || "sk-omni-gateway-demo-key";
      const geminiKey = cfgGeminiKey ? cfgGeminiKey.value.trim() : "";
      const openaiKey = cfgOpenAIKey ? cfgOpenAIKey.value.trim() : "";
      const claudeKey = cfgClaudeKey ? cfgClaudeKey.value.trim() : "";
      const remoteMgmt = cfgRemoteMgmt ? cfgRemoteMgmt.checked : false;
      let yaml = `# OmniGateway API Generated Configuration
`;
      yaml += `host: "${host}"
`;
      yaml += `port: ${port}

`;
      yaml += `api-keys:
  - "${apiKey}"

`;
      yaml += `auth-dir: "./auths"

`;
      if (remoteMgmt) {
        yaml += `remote-management:
  allow-remote: false
  secret-key: "admin-secret-key"
  disable-control-panel: false

`;
      }
      if (geminiKey) {
        yaml += `gemini-api-key:
  - api-key: "${geminiKey}"

`;
      }
      if (openaiKey) {
        yaml += `codex-api-key:
  - api-key: "${openaiKey}"

`;
      }
      if (claudeKey) {
        yaml += `claude-api-key:
  - api-key: "${claudeKey}"

`;
      }
      yaml += `# Note: Multiple accounts can also be logged in via CLI:
# ./omni-gateway -antigravity-login
# ./omni-gateway -claude-login
# ./omni-gateway -codex-login
`;
      yamlPreviewCode.textContent = yaml;
    }
    [cfgHost, cfgPort, cfgApiKey, cfgGeminiKey, cfgOpenAIKey, cfgClaudeKey, cfgRemoteMgmt].forEach((el) => {
      if (el) {
        el.addEventListener("input", generateYAML);
        el.addEventListener("change", generateYAML);
      }
    });
    generateYAML();
    if (copyYamlBtn) {
      copyYamlBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(yamlPreviewCode.textContent || "");
        const span = copyYamlBtn.querySelector("span");
        if (span) {
          span.textContent = "Copied!";
          setTimeout(() => {
            span.textContent = "Copy";
          }, 2e3);
        }
      });
    }
    if (downloadYamlBtn) {
      downloadYamlBtn.addEventListener("click", () => {
        const blob = new Blob([yamlPreviewCode.textContent || ""], { type: "text/yaml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "config.yaml";
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  // src/main.ts
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
    initQuantumCanvas("quantum-canvas");
    initGSAPAnimations();
    initSmoothScroll();
    const client = new GatewayClient("http://127.0.0.1:8317");
    const statusPill = document.getElementById("gatewayStatusPill");
    const statusText = document.getElementById("gatewayStatusText");
    const statLatency = document.getElementById("statLatency");
    const studioModelSelect = document.getElementById("studioModelSelect");
    async function syncGatewayStatus() {
      const health = await client.checkHealth();
      if (statusPill && statusText) {
        if (health.ok) {
          statusPill.className = "flex items-center gap-2 px-3 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-mono font-bold";
          statusText.textContent = health.statusText;
          if (statLatency) statLatency.textContent = `${health.latencyMs} ms`;
          const apiKey = document.getElementById("clientCustomKey")?.value || "sk-omni-gateway-demo-key";
          const modelList = await client.fetchModels(apiKey);
          if (modelList && modelList.data && modelList.data.length > 0 && studioModelSelect) {
            const currentSelected = studioModelSelect.value;
            studioModelSelect.innerHTML = `
            <option value="omni-embedded-core">\u2728 Omni AI (Friendly Consumer Copilot \u2022 Instant Zero-Fail)</option>
          `;
            modelList.data.forEach((m) => {
              const opt = document.createElement("option");
              opt.value = m.id;
              opt.textContent = `${m.id} (${m.owned_by || "frontier"})`;
              studioModelSelect.appendChild(opt);
            });
            if (currentSelected && (currentSelected === "omni-embedded-core" || modelList.data.some((m) => m.id === currentSelected))) {
              studioModelSelect.value = currentSelected;
            } else {
              studioModelSelect.value = "omni-embedded-core";
            }
          }
        } else {
          statusPill.className = "flex items-center gap-2 px-3 py-1 bg-[#ffe17c] border-2 border-black shadow-[2px_2px_0px_#000] text-black text-xs font-mono font-bold";
          statusText.textContent = "Omni AI Live (Zero-Fail)";
        }
      }
    }
    syncGatewayStatus();
    setInterval(syncGatewayStatus, 5e3);
    initStudioPlayground(client);
    initQuotaSimulator();
    initClientHub();
    initConfigBuilder();
  });
})();
//# sourceMappingURL=app.js.map
