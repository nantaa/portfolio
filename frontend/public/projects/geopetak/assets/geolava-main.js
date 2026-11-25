<script>
      const qs = (s, ctx = document) => ctx.querySelector(s);
      const qsa = (s, ctx = document) => ctx.querySelectorAll(s);

      // === Plugins registration ===
      if (window.gsap) {
        ["ScrollTrigger", "SplitText", "Flip", "ScrollToPlugin"].forEach(
          (p) => window[p] && gsap.registerPlugin(window[p]),
        );
      }

      function initPageTransitions(prefersReducedMotion) {
        if (!window.gsap || prefersReducedMotion) return;
        const overlay = qs(".page-transition"),
          grid = qs(".page-transition__grid", overlay);
        if (!overlay || !grid) return;

        const C = {
          s: 120,
          sM: 60,
          d: 0.24,
          dM: 0.2,
          step: 0.05,
          n: 0.8,
          ei: "power3.out",
          eo: "power2.inOut",
        };
        let cells = [],
          cols = 0,
          rows = 0,
          busy = false,
          resizeTimer;
        const isM = () => window.innerWidth < 768;

        const buildGrid = () => {
          const s = Math.max(28, Math.min(160, isM() ? C.sM : C.s));
          cols = Math.ceil(innerWidth / s) + 1;
          rows = Math.ceil(innerHeight / s) + 1;
          grid.innerHTML = "";
          cells = [];
          const frag = document.createDocumentFragment();
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const el = document.createElement("span");
              el.className = "page-transition__cell";
              Object.assign(el.style, {
                width: `${s}px`,
                height: `${s}px`,
                left: `${c * s}px`,
                top: `${r * s}px`,
              });
              Object.assign(el.dataset, { r, c, n: Math.random() });
              frag.appendChild(el);
              cells.push(el);
            }
          }
          grid.appendChild(frag);
        };

        const getDelay = (el, rev) =>
          Math.max(
            0,
            ((rev ? +el.dataset.c : cols - 1 - +el.dataset.c) +
              (+el.dataset.n - 0.5) * C.n * 4.2 +
              +el.dataset.r * 0.035) *
              C.step,
          );

        const setVis = (vis, op) => {
          gsap.set(overlay, { visibility: vis ? "visible" : "hidden" });
          gsap.set(cells, { opacity: op, scale: 1 });
        };

        buildGrid();
        const url = new URL(location.href);

        if (url.searchParams.has("pt")) {
          setVis(true, 1);
          requestAnimationFrame(() => {
            document.documentElement.classList.remove("pt-loading");
            gsap.killTweensOf(cells);
            gsap.to(cells, {
              opacity: 0,
              duration: isM() ? C.dM : C.d,
              ease: C.eo,
              stagger: (_, el) => getDelay(el, false),
              onComplete: () => setVis(false, 0),
            });
            url.searchParams.delete("pt");
            history.replaceState({}, "", url.pathname + url.search + url.hash);
          });
        } else setVis(false, 0);

        document.addEventListener("click", (e) => {
          const l = e.target.closest("a");
          if (
            !l ||
            l.matches("[data-no-transition]") ||
            l.target === "_blank" ||
            l.hasAttribute("download") ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.altKey
          )
            return;
          const href = l.getAttribute("href");
          if (!href || href.startsWith("#") || href.match(/^(mailto|tel):/))
            return;

          const lUrl = new URL(l.href, location.href);
          if (
            lUrl.origin !== location.origin ||
            (lUrl.pathname === location.pathname &&
              lUrl.search === location.search &&
              !!lUrl.hash)
          )
            return;

          if (busy) return e.preventDefault();
          busy = true;
          e.preventDefault();

          gsap.killTweensOf(cells);
          setVis(true, 0);
          gsap.to(cells, {
            opacity: 1,
            duration: isM() ? C.dM : C.d,
            ease: C.ei,
            stagger: (_, el) => getDelay(el, true),
            onComplete: () => {
              lUrl.searchParams.set("pt", "1");
              location.href = lUrl.toString();
            },
          });
        });

        window.addEventListener("pageshow", () => (busy = false));
        window.addEventListener("resize", () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => (buildGrid(), setVis(false, 0)), 180);
        });
      }

      document.addEventListener("DOMContentLoaded", () => {
        const isRedMot = matchMedia("(prefers-reduced-motion: reduce)").matches;
        initPageTransitions(isRedMot);

        // --- Mobile Nav ---
        const nav = qs(".header-nav"),
          nBtn = qs(".m-nav-button"),
          ham = qs(".button-icon.is--ham"),
          crs = qs(".button-icon.is--cross");
        if (nav && nBtn && ham && crs) {
          const mMQ = matchMedia("(max-width: 767px)");
          const setNav = (o) => {
            nav.classList.toggle("state-opened", o);
            ham.style.opacity = o ? "0" : "1";
            crs.style.opacity = o ? "1" : "0";
            nBtn.setAttribute(
              "aria-label",
              o ? "Close Nav Menu" : "Open Nav Menu",
            );
            nBtn.setAttribute("aria-expanded", o);
          };
          setNav(false);
          nBtn.addEventListener(
            "click",
            () =>
              mMQ.matches && setNav(!nav.classList.contains("state-opened")),
          );
          mMQ.addEventListener("change", (e) => !e.matches && setNav(false));
        }

        if (!window.gsap || !window.ScrollTrigger) return;
        const num = (v, def) => parseFloat(v) || def;

        // --- SplitText Reveals ---
        if (window.SplitText) {
          qsa("[data-split-reveal]:not([data-reveal])").forEach((el) => {
            const d = el.dataset,
              t = d.splitType || "lines";
            SplitText.create(el, {
              type: t,
              mask: t,
              autoSplit: t === "lines",
              linesClass: "line",
              wordsClass: "word",
              charsClass: "char",
              onSplit(s) {
                const trg =
                  t === "chars" ? s.chars : t === "words" ? s.words : s.lines;
                const blur = isRedMot ? 0 : num(d.splitBlur, 6);
                gsap.set(trg, {
                  opacity: 0,
                  y: num(d.splitY, 18),
                  scale: num(d.splitScale, 1.02),
                  filter: blur ? `blur(${blur}px)` : "none",
                  willChange: "transform, opacity",
                });
                gsap.set(el, { visibility: "visible" });
                return gsap.to(trg, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: num(d.splitDuration, 0.9),
                  ease: d.splitEase || "power3.out",
                  delay: num(d.splitDelay, 0),
                  stagger: num(d.splitStagger, t === "chars" ? 0.02 : 0.06),
                  clearProps: "willChange,filter",
                  overwrite: "auto",
                  scrollTrigger: {
                    trigger: el,
                    start: d.splitStart || "top 80%",
                    once: d.splitOnce !== "false",
                  },
                });
              },
            });
          });
        }

        // --- General Reveals ---
        qsa("[data-reveal]").forEach((el) => {
          const d = el.dataset;
          gsap.fromTo(
            el,
            {
              autoAlpha: 0,
              y: num(d.revealY, 18),
              willChange: "transform, opacity",
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: num(d.revealDuration, 0.9),
              delay: num(d.revealDelay, 0),
              ease: d.revealEase || "power3.out",
              clearProps: "willChange",
              overwrite: "auto",
              scrollTrigger: {
                trigger: el,
                start: d.revealStart || "top 85%",
                once: d.revealOnce !== "false",
              },
            },
          );
        });

        window.addEventListener("load", () => ScrollTrigger.refresh());

        // --- Ask Button (Typewriter) ---
        const dMQ = matchMedia("(min-width: 992px)");
        const aBtn = qs(".button-ask.c--ask");
        if (!aBtn) return;

        const tWrap = qs(".button-text-style", aBtn),
          tMask = qs(".ask-text-mask", aBtn),
          tCur = qs(".ask-text-current", aBtn),
          lWrap = qs(".button-lottie-wrap", aBtn),
          form = qs("form", aBtn),
          sBtn = qs(".button-submit", aBtn);
        if (!tWrap || !tMask || !tCur) return;

        const redir = (e) => {
          e.preventDefault();
          const u =
            form?.getAttribute("redirect") ||
            form?.getAttribute("data-redirect");
          if (u) location.href = u;
        };
        form?.addEventListener("submit", redir);
        sBtn?.addEventListener("click", redir);
        tCur.addEventListener("keydown", (e) => e.key === "Enter" && redir(e));

        let init = false,
          cDelay,
          aTL,
          bInt,
          wasB = false,
          sPh = "";

        const initAsk = () => {
          if (init) return;
          init = true;
          const phr = [
            "Start a due diligence",
            "Underwrite a property",
            "Monitor your portfolio",
            "Analyze a location",
          ];
          let pId = 0,
            isOpen = false,
            cVis = true;
          const cChar = "│";

          const startB = (t) => {
            cVis = true;
            tCur.placeholder = t + cChar;
            bInt = setInterval(
              () => (tCur.placeholder = t + ((cVis = !cVis) ? cChar : "")),
              500,
            );
          };
          const stopB = () => {
            clearInterval(bInt);
            bInt = null;
          };
          const runTyp = () => {
            stopB();
            cDelay?.kill();
            aTL?.kill();
            const p = phr[pId];
            tCur.placeholder = cChar;
            const tl = gsap.timeline({
              onComplete: () => {
                startB(p);
                cDelay = gsap.delayedCall(1.8, () => {
                  stopB();
                  const dTl = gsap.timeline({
                    onComplete: () => {
                      pId = (pId + 1) % phr.length;
                      runTyp();
                    },
                  });
                  for (let i = p.length; i >= 0; i--)
                    dTl.call(
                      () => (tCur.placeholder = p.slice(0, i) + cChar),
                      null,
                      (p.length - i) * 0.028,
                    );
                  aTL = dTl;
                });
              },
            });
            for (let i = 1; i <= p.length; i++)
              tl.call(
                () => (tCur.placeholder = p.slice(0, i) + cChar),
                null,
                (i - 1) * 0.045,
              );
            aTL = tl;
          };

          tCur.addEventListener("focus", () => {
            aTL?.pause();
            cDelay?.pause();
            wasB = !!bInt;
            stopB();
            sPh = tCur.placeholder;
            tCur.placeholder = "";
          });
          tCur.addEventListener("blur", () => {
            tCur.placeholder = sPh;
            wasB
              ? startB(phr[pId])
              : tCur.placeholder.includes(cChar) || (tCur.placeholder += cChar);
            aTL?.resume();
            cDelay?.resume();
          });

          const measW = () => {
            const cur = tCur.placeholder;
            gsap.set([tWrap, tMask], { width: "auto" });
            const m = document.createElement("span"),
              cs = getComputedStyle(tCur);
            Object.assign(m.style, {
              font: cs.font,
              visibility: "hidden",
              position: "absolute",
              whiteSpace: "nowrap",
            });
            document.body.appendChild(m);
            let max = phr.reduce(
              (a, p) => (
                (m.textContent = p + cChar),
                Math.max(a, m.getBoundingClientRect().width)
              ),
              0,
            );
            m.remove();
            tCur.placeholder = cur;

            const ex = [
              "paddingLeft",
              "paddingRight",
              "marginLeft",
              "marginRight",
            ].reduce((a, p) => a + (parseFloat(cs[p]) || 0), 0);
            let bEx = 0;
            if (sBtn) {
              const bs = getComputedStyle(sBtn),
                fs = getComputedStyle(sBtn.parentElement || document.body);
              bEx =
                sBtn.getBoundingClientRect().width +
                (parseFloat(bs.marginLeft) || 0) +
                (parseFloat(bs.marginRight) || 0) +
                (fs.display.includes("flex") ? parseFloat(fs.gap) || 0 : 0);
            }
            return Math.ceil(max + ex + bEx) + 12;
          };

          const setup = () => {
            tCur.placeholder = phr[0] + cChar;
            gsap.set(aBtn, {
              visibility: "visible",
              autoAlpha: 0,
              width: "auto",
              overflow: "visible",
            });
            gsap.set([tWrap, tMask], { width: measW() });
            const fW = aBtn.scrollWidth;
            gsap.set(aBtn, { width: 0, autoAlpha: 0, overflow: "hidden" });
            gsap.set([tWrap, tCur, lWrap].filter(Boolean), { autoAlpha: 0 });

            ScrollTrigger.create({
              start: 200,
              once: true,
              onEnter: () => {
                gsap
                  .timeline({
                    onComplete: () => {
                      gsap.set(aBtn, {
                        width: fW,
                        clearProps: "overflow,willChange",
                      });
                      isOpen = true;
                      runTyp();
                      if (document.activeElement === tCur) {
                        aTL?.pause();
                        cDelay?.pause();
                        wasB = !!bInt;
                        stopB();
                        sPh = tCur.placeholder;
                        tCur.placeholder = "";
                      }
                    },
                  })
                  .to(aBtn, {
                    width: fW,
                    autoAlpha: 1,
                    duration: 0.6,
                    ease: "power2.out",
                  })
                  .to(
                    [tWrap, tCur, lWrap].filter(Boolean),
                    { autoAlpha: 1, duration: 0.18, ease: "none" },
                    ">-0.02",
                  );
              },
            });

            let rTmr;
            new ResizeObserver(() => {
              if (!isOpen) return;
              clearTimeout(rTmr);
              rTmr = setTimeout(() => {
                gsap.set([tWrap, tMask], { width: measW() });
                gsap.set(aBtn, { width: "auto" });
                gsap.set(aBtn, { width: aBtn.scrollWidth });
              }, 100);
            }).observe(document.documentElement);
          };
          document.fonts?.ready
            ? document.fonts.ready.then(() => requestAnimationFrame(setup))
            : requestAnimationFrame(setup);
        };

        if (dMQ.matches) initAsk();
        else {
          const oC = (e) => {
            if (e.matches) {
              initAsk();
              dMQ.removeEventListener("change", oC);
            }
          };
          dMQ.addEventListener("change", oC);
        }
      });

      function initPixelOverlays() {
        if (!window.gsap || !window.ScrollTrigger) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          return;

        const overlays = document.querySelectorAll("[data-pixel-overlay]");
        if (!overlays.length) return;

        gsap.registerPlugin(ScrollTrigger);

        const isTouchDevice = () =>
          window.matchMedia("(pointer: coarse)").matches ||
          window.innerWidth < 768;

        const toNumber = (v, fb) => {
          const n = parseFloat(v);
          return Number.isFinite(n) ? n : fb;
        };
        const clamp = (mn, mx, v) => Math.min(mx, Math.max(mn, v));
        const invertDirection = (d) => {
          if (d === "top-bottom") return "bottom-top";
          if (d === "bottom-top") return "top-bottom";
          if (d === "left-right") return "right-left";
          if (d === "right-left") return "left-right";
          return "bottom-top";
        };

        const getConfig = (overlay) => {
          const isMobile = window.innerWidth < 768;
          const staggerDesktop = toNumber(overlay.dataset.pixelStagger, 0.034);
          const staggerMobile = toNumber(
            overlay.dataset.pixelStaggerMobile,
            0.05,
          );
          const durationDesktop = toNumber(overlay.dataset.pixelDuration, 0.34);
          const durationMobile = toNumber(
            overlay.dataset.pixelDurationMobile,
            0.2,
          );

          return {
            mode: overlay.dataset.pixelMode || "reveal",
            direction: overlay.dataset.pixelDirection || "top-bottom",
            sizeDesktop: toNumber(overlay.dataset.pixelSize, 78),
            sizeMobile: toNumber(overlay.dataset.pixelSizeMobile, 128),
            color: overlay.dataset.pixelColor || "#F7F6F1",
            randomness: clamp(
              0,
              1.2,
              toNumber(overlay.dataset.pixelRandomness, 0.42),
            ),
            stagger: isMobile ? staggerMobile : staggerDesktop,
            duration: isMobile ? durationMobile : durationDesktop,
            delay: toNumber(overlay.dataset.pixelDelay, 0),
            hold: toNumber(overlay.dataset.pixelHold, 0.08),
            easeIn: overlay.dataset.pixelEaseIn || "power3.out",
            easeOut: overlay.dataset.pixelEaseOut || "power2.inOut",
          };
        };

        class PixelSectionOverlay {
          constructor(overlay) {
            this.overlay = overlay;
            this.cells = [];
            this.rows = 0;
            this.cols = 0;
            this.size = 0;
            this.forwardTween = null;
            this.lastPlayedDirection = null; // 'forward' | 'backward' | null
            this.isCovered = false;
            this.scrollTrigger = null;

            this._pendingDirection = null;
            this._pendingTimer = null;

            this.build();
            this.setInitialState();
            this.buildTween();
            this.createTrigger();
          }

          get section() {
            return (
              this.overlay.closest("section") || this.overlay.parentElement
            );
          }

          get bounds() {
            return this.overlay.getBoundingClientRect();
          }

          get triggerElement() {
            const trigger = this.overlay.dataset.pixelTrigger || "self";
            if (trigger === "self") return this.section;
            return document.querySelector(trigger) || this.section;
          }

          build() {
            const config = getConfig(this.overlay);
            const isMobile = window.innerWidth < 768;
            const rawSize = isMobile ? config.sizeMobile : config.sizeDesktop;
            this.size = clamp(24, 220, rawSize);

            const rect = this.bounds;
            const section = this.section;

            const width = Math.max(
              rect.width,
              section ? section.offsetWidth : 0,
              this.overlay.offsetWidth,
              1,
            );
            const height = Math.max(
              rect.height,
              section ? section.offsetHeight : 0,
              this.overlay.offsetHeight,
              1,
            );

            this.cols = Math.ceil(width / this.size) + 1;
            this.rows = Math.ceil(height / this.size) + 1;

            this.overlay.innerHTML = "";
            this.overlay.style.setProperty("--pixel-size", `${this.size}px`);
            this.overlay.style.setProperty("--pixel-color", config.color);

            this.cells = [];
            const fragment = document.createDocumentFragment();

            for (let row = 0; row < this.rows; row++) {
              for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement("span");
                cell.className = "pixel-section-overlay__cell";
                cell.style.left = `${col * this.size}px`;
                cell.style.top = `${row * this.size}px`;
                cell.style.willChange = "auto";
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.dataset.noise = Math.random().toFixed(4);
                cell.dataset.phase = (Math.random() * Math.PI * 2).toFixed(4);
                fragment.appendChild(cell);
                this.cells.push(cell);
              }
            }

            this.overlay.appendChild(fragment);

            this.cacheStaggerDelays(config);
          }

          cacheStaggerDelays(config) {
            const forwardDir = config.direction;
            for (let i = 0; i < this.cells.length; i++) {
              const cell = this.cells[i];
              cell.dataset.staggerForward = this.computeDelayIndex(
                cell,
                forwardDir,
                config.randomness,
              );
            }
          }

          computeDelayIndex(cell, direction, randomness) {
            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);
            const noise = Number(cell.dataset.noise);
            const phase = Number(cell.dataset.phase);
            const isVertical =
              direction === "top-bottom" || direction === "bottom-top";
            const primaryMax = isVertical ? this.rows : this.cols;
            const crossMax = isVertical ? this.cols : this.rows;

            let primary;
            if (direction === "top-bottom") primary = row;
            else if (direction === "bottom-top") primary = this.rows - 1 - row;
            else if (direction === "left-right") primary = col;
            else if (direction === "right-left") primary = this.cols - 1 - col;
            else primary = row;

            const cross = isVertical ? col : row;
            const waveOffset =
              Math.sin(
                (cross / Math.max(1, crossMax - 1)) * Math.PI * 2 + phase,
              ) *
              randomness *
              primaryMax *
              0.18;
            const randomOffset = (noise - 0.5) * randomness * primaryMax * 0.85;
            const centerDrift =
              Math.abs(cross - crossMax * 0.5) * randomness * 0.045;
            return Math.max(
              0,
              primary + waveOffset + randomOffset + centerDrift,
            );
          }

          getCachedDelay(cell, config) {
            const cached = Number(cell.dataset.staggerForward);
            const safe = Number.isFinite(cached) ? cached : 0;
            return safe * config.stagger;
          }

          setInitialState() {
            const config = getConfig(this.overlay);
            if (config.mode === "reveal") {
              this.isCovered = true;
              gsap.set(this.overlay, { autoAlpha: 1 });
              gsap.set(this.cells, { autoAlpha: 1, scale: 1 });
              return;
            }
            this.isCovered = false;
            gsap.set(this.overlay, { autoAlpha: 1 });
            gsap.set(this.cells, { autoAlpha: 0, scale: 1 });
          }

          activateWillChange() {
            gsap.set(this.cells, { willChange: "opacity, transform" });
          }

          deactivateWillChange() {
            gsap.set(this.cells, { willChange: "auto" });
          }

          buildTween() {
            if (this.forwardTween) {
              this.forwardTween.kill();
              this.forwardTween = null;
            }

            const config = getConfig(this.overlay);
            const cells = this.cells;
            const overlay = this.overlay;

            const onAnyStart = () => this.activateWillChange();
            const onAnyComplete = () => this.deactivateWillChange();

            if (config.mode === "transition") {
              const tl = gsap.timeline({
                paused: true,
                onStart: onAnyStart,
                onComplete: () => {
                  this.isCovered = false;
                  onAnyComplete();
                },
                onReverseComplete: () => {
                  this.isCovered = false;
                  onAnyComplete();
                },
              });
              tl.to(cells, {
                autoAlpha: 1,
                scale: 1,
                duration: config.duration,
                ease: config.easeIn,
                stagger: (i, cell) => this.getCachedDelay(cell, config),
              });
              tl.to({}, { duration: config.hold });
              tl.to(cells, {
                autoAlpha: 0,
                duration: config.duration,
                ease: config.easeOut,
                stagger: (i, cell) => this.getCachedDelay(cell, config),
              });
              this.forwardTween = tl;
              return;
            }

            if (config.mode === "hide") {
              this.forwardTween = gsap.to(cells, {
                paused: true,
                autoAlpha: 1,
                duration: config.duration,
                ease: config.easeIn,
                stagger: (i, cell) => this.getCachedDelay(cell, config),
                onStart: onAnyStart,
                onComplete: () => {
                  this.isCovered = true;
                  onAnyComplete();
                },
                onReverseComplete: () => {
                  this.isCovered = false;
                  onAnyComplete();
                },
              });
              return;
            }

            this.forwardTween = gsap.to(cells, {
              paused: true,
              autoAlpha: 0,
              duration: config.duration,
              ease: config.easeOut,
              stagger: (i, cell) => this.getCachedDelay(cell, config),
              onStart: onAnyStart,
              onComplete: () => {
                this.isCovered = false;
                onAnyComplete();
              },
              onReverseComplete: () => {
                this.isCovered = true;
                onAnyComplete();
              },
            });
          }

          _runDirection(direction) {
            if (!this.forwardTween) return;
            gsap.set(this.overlay, { autoAlpha: 1 });
            this.activateWillChange();

            if (direction === "forward") {
              const prog = this.forwardTween.progress();

              if (prog >= 1) {
                this.deactivateWillChange();
                return;
              }

              this.forwardTween.play();
            } else {
              const prog = this.forwardTween.progress();

              if (prog <= 0) {
                this.deactivateWillChange();
                return;
              }

              this.forwardTween.reverse();
            }

            this.lastPlayedDirection = direction;
          }

          requestDirection(direction) {
            this._pendingDirection = direction;

            if (this._pendingTimer) clearTimeout(this._pendingTimer);

            const debounceMs = isTouchDevice() ? 90 : 30;
            this._pendingTimer = setTimeout(() => {
              this._pendingTimer = null;
              const dir = this._pendingDirection;
              this._pendingDirection = null;
              if (dir) this._runDirection(dir);
            }, debounceMs);
          }

          playForward() {
            this.requestDirection("forward");
          }

          playBackward() {
            this.requestDirection("backward");
          }

          createTrigger() {
            const touch = isTouchDevice();
            const defaultStart = touch ? "top 80%" : "top 70%";
            const defaultEnd = touch ? "bottom 20%" : "bottom 30%";
            const start = this.overlay.dataset.pixelStart || defaultStart;
            const end = this.overlay.dataset.pixelEnd || defaultEnd;

            const shouldReverse = this.overlay.dataset.pixelReverse !== "false";
            const markers = this.overlay.dataset.pixelMarkers === "true";

            this.scrollTrigger = ScrollTrigger.create({
              trigger: this.triggerElement,
              start,
              end,
              markers,
              onEnter: () => this.playForward(),
              onLeaveBack: () => {
                if (shouldReverse) this.playBackward();
              },

              onEnterBack: () => this.playForward(),
              onLeave: () => {},
            });
          }

          rebuildOnResize() {
            const wasCovered = this.isCovered;
            const lastDirection = this.lastPlayedDirection;
            this.build();
            this.setInitialState();
            this.buildTween();

            if (lastDirection === "forward" && this.forwardTween) {
              this.forwardTween.progress(1, false).pause();
              this.isCovered = !wasCovered ? false : this.isCovered;
            } else if (wasCovered) {
              gsap.set(this.cells, { autoAlpha: 1 });
            } else {
              gsap.set(this.cells, { autoAlpha: 0 });
            }
          }
        }

        const instances = [];
        overlays.forEach((overlay) =>
          instances.push(new PixelSectionOverlay(overlay)),
        );

        let resizeTimer = null;
        let lastWidth = window.innerWidth;
        window.addEventListener(
          "resize",
          () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;

            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
              for (let i = 0; i < instances.length; i++)
                instances[i].rebuildOnResize();
              ScrollTrigger.refresh();
            }, 220);
          },
          { passive: true },
        );

        window.PixelSectionOverlays = instances;
      }
    </script>
    
