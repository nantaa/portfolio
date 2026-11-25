<script defer>
      (() => {
        const init = () => {
          initXrayHero();
          initPixelOverlays();
          initCrosshairTour();
          tabsInit();
        };

        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", init, { once: true });
        } else {
          init();
        }
      })();

      function initXrayHero() {
        // Do not initialize on mobile devices (767px and below)
        if (window.matchMedia("(max-width: 767px)").matches) return;

        const container = document.querySelector(".c--home-hero");
        const canvas = document.getElementById("xray-canvas");
        if (!container || !canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });

        // Collect all valid layer images
        const imgs = [0, 1, 2, 3]
          .map((i) => document.getElementById(`layer-${i}`))
          .filter(Boolean);
        if (!imgs.length) return;

        // Load center diamond SVG
        const dImg = new Image();
        dImg.crossOrigin = "anonymous";
        dImg.src =
          "./assets/69e8f29969dd0d989c819eb8_diamond.svg";

        // Animation configuration
        const c = {
          sz: 60, // Base cell size
          rX: 0.08,
          dX: 0.18, // Smooth rise, fast decay
          rF: 0.08,
          dF: 0.18,
          tA: 0.92, // Max tile alpha
          tSC: "#FEFEFB80", // Tile stroke color
          tSW: 0.5, // Tile stroke width
          fF: "rgba(255,255,255,0.025)", // Frame fill color
          fS: "rgba(255,255,255,0.08)", // Frame stroke color
          dC: "#FEFEFB", // Diamond color
          dSz: 8, // Diamond size
          fDSz: 32, // Center diamond icon size
          uT: 0.02, // Unlock threshold
          mF: 0.06, // Min visible frame strength
          iC: 0.01, // Idle cutoff
          iDel: 900, // Global idle fade delay (ms)
          iOut: 0.06, // Global fade out speed
          iIn: 0.12, // Global fade in speed
        };

        let rect, dpr, cols, rows;
        let cells = [],
          meta = [];
        let ptr = { x: -9e3, y: -9e3, act: false };
        let lC = -9e3,
          lR = -9e3;
        let raf = 0,
          rRaf = 0,
          on = false,
          rndr = false;
        let lT = performance.now(),
          gF = 1;

        // Utility functions
        const clamp = (v, n, x) => Math.max(n, Math.min(x, v));
        const lerp = (a, b, t) => a + (b - a) * t;
        const getC = (x, y) =>
          x >= 0 && y >= 0 && x < cols && y < rows ? cells[y * cols + x] : null;

        // Calculates image scaling to match GSAP's object-fit: cover logic
        function getCoverMeta(img, cR) {
          const mI = document.getElementById("main-img");
          const iR = mI ? mI.getBoundingClientRect() : cR;
          const iRatio = img.naturalWidth / img.naturalHeight;
          const bRatio = iR.width / iR.height;
          let sX,
            sY,
            oX = 0,
            oY = 0;

          if (iRatio > bRatio) {
            sY = sX = img.naturalHeight / iR.height;
            oX = (iR.height * iRatio - iR.width) / 2;
          } else {
            sX = sY = img.naturalWidth / iR.width;
            oY = (iR.width / iRatio - iR.height) / 2;
          }

          return {
            img,
            sX,
            sY,
            oX: oX + cR.left - iR.left,
            oY: oY + cR.top - iR.top,
          };
        }

        // Initialize and resize canvas
        function rs() {
          rect = container.getBoundingClientRect();
          const cR = canvas.getBoundingClientRect();
          dpr = Math.min(window.devicePixelRatio || 1, 2);

          const w = Math.max(1, rect.width);
          const h = Math.max(1, rect.height);

          canvas.width = w * dpr;
          canvas.height = h * dpr;
          canvas.style.cssText = `width:${w}px;height:${h}px`;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          cols = Math.ceil(w / c.sz);
          rows = Math.ceil(h / c.sz);

          cells = Array.from({ length: cols * rows }, (_, i) => ({
            c: i % cols,
            r: Math.floor(i / cols),
            x: (i % cols) * c.sz,
            y: Math.floor(i / cols) * c.sz,
            xS: 0,
            fS: 0,
            l: 0,
            type: "",
            lg: false,
            cv: false,
            hD: false,
            keep: false,
          }));

          meta = imgs.map((img) => getCoverMeta(img, cR));
        }

        // Applies pattern layout directly onto the grid
        function applyBrush(cx, cy) {
          const center = getC(cx, cy);
          const r = getC(cx + 1, cy);
          const b = getC(cx, cy + 1);
          const br = getC(cx + 1, cy + 1);
          if (!center) return;

          // Shatter old overlapping large blocks
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              let neighbor = getC(cx + dx, cy + dy);
              if (neighbor && neighbor.lg) neighbor.lg = false;
            }
          }

          const baseLayer =
            center.type === "X"
              ? center.l
              : Math.floor(Math.random() * imgs.length);

          if (r && b && br) {
            [center, r, b, br].forEach((c) => {
              c.l = baseLayer;
              c.type = "X";
              c.keep = true;
              c.hD = false;
              c.lg = false;
            });
            center.lg = true;
          } else {
            center.l = baseLayer;
            center.type = "X";
            center.keep = true;
            center.lg = false;
            center.hD = false;
          }

          const ring = [
            getC(cx - 1, cy),
            getC(cx - 1, cy + 1),
            getC(cx, cy - 1),
            getC(cx + 1, cy - 1),
            getC(cx + 2, cy),
            getC(cx + 2, cy + 1),
            getC(cx, cy + 2),
            getC(cx + 1, cy + 2),
          ].filter(Boolean);

          const free = ring.filter((cell) => {
            if (cell === center || cell === r || cell === b || cell === br)
              return false;
            return !(cell.keep && cell.type === "X");
          });

          const pool =
            free.length >= 4
              ? free
              : ring.filter((cell) => {
                  return (
                    cell !== center && cell !== r && cell !== b && cell !== br
                  );
                });

          const shuffled = pool.slice().sort(() => Math.random() - 0.5);
          const smalls = shuffled.slice(0, 1);
          const empties = shuffled.slice(1, 4);
          const layers = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

          smalls.forEach((cell, i) => {
            if (!cell) return;
            if (cell.type !== "X") cell.l = layers[i];
            cell.type = "X";
            cell.keep = true;
            cell.lg = false;
            cell.hD = false;
          });

          empties.forEach((cell, i) => {
            if (!cell) return;
            if (cell.keep && cell.type === "X") return;
            if (cell.type !== "F") cell.hD = false;

            cell.type = "F";
            cell.keep = true;
            cell.lg = false;

            if (i === 0) {
              cells.forEach((x) => (x.hD = false));
              cell.hD = true;
            }
          });
        }

        function spwn(cC, cR) {
          if (cC === lC && cR === lR) return;

          if (lC !== -9e3) {
            let dx = cC - lC;
            let dy = cR - lR;
            let steps = Math.max(Math.abs(dx), Math.abs(dy));
            for (let i = 1; i <= steps; i++) {
              applyBrush(
                Math.round(lC + dx * (i / steps)),
                Math.round(lR + dy * (i / steps)),
              );
            }
          } else {
            applyBrush(cC, cR);
          }

          lC = cC;
          lR = cR;
        }

        function drw() {
          if (!on) {
            rndr = false;
            raf = 0;
            return;
          }

          ctx.clearRect(0, 0, rect.width, rect.height);
          const nw = performance.now();

          if (ptr.act) spwn(Math.floor(ptr.x / c.sz), Math.floor(ptr.y / c.sz));

          gF = lerp(
            gF,
            ptr.act && nw - lT < c.iDel ? 1 : 0,
            ptr.act && nw - lT < c.iDel ? c.iIn : c.iOut,
          );

          cells.forEach((cl) => {
            if (cl.keep) {
              const dist = Math.max(Math.abs(cl.c - lC), Math.abs(cl.r - lR));
              if (!ptr.act || dist > 2) cl.keep = false;
            }

            const tX = cl.keep && cl.type === "X" ? 1 : 0;
            const tF = cl.keep && cl.type === "F" ? 1 : 0;

            cl.xS = lerp(cl.xS, tX, tX > cl.xS ? c.rX : c.dX);
            cl.fS = lerp(cl.fS, tF, tF > cl.fS ? c.rF : c.dF);

            if (cl.xS <= c.uT && cl.fS <= c.uT) {
              cl.type = "";
              cl.lg = false;
              cl.cv = false;
              cl.keep = false;
              cl.hD = false;
            }
          });

          cells.forEach((cl) => {
            if (cl.lg && cl.xS > c.uT) {
              let r = getC(cl.c + 1, cl.r),
                b = getC(cl.c, cl.r + 1),
                br = getC(cl.c + 1, cl.r + 1);
              if (
                !r ||
                !b ||
                !br ||
                r.type !== "X" ||
                b.type !== "X" ||
                br.type !== "X" ||
                r.l !== cl.l ||
                b.l !== cl.l ||
                br.l !== cl.l
              ) {
                cl.lg = false;

                let orphans = [cl, r, b, br].filter(
                  (s) => s && !s.keep && s.type === "X",
                );
                orphans.forEach((shard) => {
                  shard.type = "";
                  shard.xS *= 0.4;
                });
              }
            }
          });

          cells.forEach((cl) => (cl.cv = false));
          cells.forEach((cl) => {
            if (cl.lg && cl.xS > c.uT) {
              let r = getC(cl.c + 1, cl.r),
                b = getC(cl.c, cl.r + 1),
                br = getC(cl.c + 1, cl.r + 1);
              if (r) r.cv = true;
              if (b) b.cv = true;
              if (br) br.cv = true;
            }
          });

          cells.forEach((cl) => {
            // Draw Images (X-Ray tiles)
            if (!cl.cv && cl.xS >= 0.03 && meta[cl.l]?.img?.naturalWidth) {
              const m = meta[cl.l];
              const ds = cl.lg ? c.sz * 2 : c.sz;
              const is = c.tSW / 2;

              let visualAlpha = cl.xS;
              if (cl.lg) {
                let r = getC(cl.c + 1, cl.r),
                  b = getC(cl.c, cl.r + 1),
                  br = getC(cl.c + 1, cl.r + 1);
                if (r && b && br) {
                  visualAlpha = (cl.xS + r.xS + b.xS + br.xS) / 4;
                }
              }

              ctx.globalAlpha = visualAlpha * c.tA * gF;

              let sx = (cl.x + m.oX) * m.sX,
                sy = (cl.y + m.oY) * m.sY;
              let sw = ds * m.sX,
                sh = ds * m.sY;
              let dx = cl.x,
                dy = cl.y;

              if (sx < 0) {
                sw += sx;
                dx -= sx / m.sX;
                sx = 0;
              }
              if (sy < 0) {
                sh += sy;
                dy -= sy / m.sY;
                sy = 0;
              }

              if (sw > 0 && sh > 0) {
                ctx.drawImage(
                  m.img,
                  sx,
                  sy,
                  Math.min(sw, m.img.naturalWidth - sx),
                  Math.min(sh, m.img.naturalHeight - sy),
                  dx,
                  dy,
                  sw / m.sX,
                  sh / m.sY,
                );
              }

              ctx.globalAlpha = visualAlpha * gF;
              ctx.strokeStyle = c.tSC;
              ctx.lineWidth = c.tSW;
              ctx.strokeRect(cl.x + is, cl.y + is, ds - c.tSW, ds - c.tSW);
            }

            // Draw Empty Frames
            if (!cl.cv && !cl.lg && cl.fS >= c.mF && cl.xS <= 0.15) {
              ctx.globalAlpha = cl.fS * gF;
              ctx.fillStyle = c.fF;
              ctx.strokeStyle = c.fS;
              ctx.lineWidth = 1;
              ctx.fillRect(cl.x + 0.5, cl.y + 0.5, c.sz - 1, c.sz - 1);
              ctx.strokeRect(cl.x + 0.5, cl.y + 0.5, c.sz - 1, c.sz - 1);

              // Corner diamonds
              ctx.fillStyle = c.dC;
              const hf =
                (c.dSz * (1 - Math.pow(1 - clamp(cl.fS, 0, 1), 3))) / 2;
              if (hf > 0.01) {
                [
                  [cl.x, cl.y],
                  [cl.x + c.sz, cl.y],
                  [cl.x, cl.y + c.sz],
                  [cl.x + c.sz, cl.y + c.sz],
                ].forEach(([dx, dy]) => {
                  ctx.beginPath();
                  ctx.moveTo(dx, dy - hf);
                  ctx.lineTo(dx + hf, dy);
                  ctx.lineTo(dx, dy + hf);
                  ctx.lineTo(dx - hf, dy);
                  ctx.fill();
                });
              }

              // Center diamond icon
              if (cl.hD && dImg.naturalWidth) {
                ctx.drawImage(
                  dImg,
                  cl.x + (c.sz - c.fDSz) / 2,
                  cl.y + (c.sz - c.fDSz) / 2,
                  c.fDSz,
                  c.fDSz,
                );
              }
            }
          });

          ctx.globalAlpha = 1;

          if (
            ptr.act ||
            gF > 0.01 ||
            cells.some((x) => Math.max(x.xS, x.fS) > c.iC)
          ) {
            raf = requestAnimationFrame(drw);
          } else {
            rndr = false;
            raf = 0;
          }
        }

        const evt = (e) => {
          ptr.x = e.clientX - rect.left;
          ptr.y = e.clientY - rect.top;
          ptr.act = e.type !== "pointerleave";
          lT = performance.now();
          gF = 1;
          if (!rndr && ptr.act) {
            rndr = true;
            drw();
          }
        };

        const evts = [
          ["pointermove", evt],
          ["pointerenter", evt],
          [
            "pointerleave",
            (e) => {
              ptr.act = false;
              lC = lR = -9e3;
            },
          ],
        ];

        const rsz = () => {
          if (!on) return;
          rs();
          if (!rndr) {
            rndr = true;
            drw();
          }
        };

        Promise.all(
          [...imgs, dImg].map((i) =>
            i.complete && i.naturalWidth
              ? 1
              : new Promise((r) => {
                  i.onload = i.onerror = r;
                }),
          ),
        ).then(() => {
          on = true;
          rs();
          evts.forEach(([n, f]) =>
            container.addEventListener(n, f, { passive: true }),
          );
          window.addEventListener(
            "resize",
            () => {
              if (!rRaf)
                rRaf = requestAnimationFrame(() => {
                  rRaf = 0;
                  rsz();
                });
            },
            { passive: true },
          );

          canvas.classList.add("is-ready");
        });
      }

      /////
      function initCrosshairTour() {
        if (typeof gsap === "undefined") {
          console.warn("[crosshair] GSAP not found");
          return;
        }

        const mm = gsap.matchMedia();

        mm.add("(min-width: 992px)", () => {
          const section = document.querySelector(".s-platform");
          if (!section) return;

          const triggers = Array.from(document.querySelectorAll(".ch-trigger"));
          if (!triggers.length) {
            console.warn("[crosshair] no triggers found");
            return;
          }

          const classToIndexMap = {
            first: 1,
            second: 2,
            third: 3,
            fourth: 4,
            fifth: 5,
            sixth: 6,
            seventh: 7,
          };

          const points = {};
          const containers = {};

          for (let i = 1; i <= 7; i++) {
            points[i] = document.getElementById(`ch${i}`);
            containers[i] = document.getElementById(`ch-container${i}`);
          }

          const EDGE_PADDING = 80;
          const HIDE_DELAY = 0.22;

          const crosshair = document.createElement("div");
          crosshair.className = "crosshair";
          crosshair.setAttribute("aria-hidden", "true");
          crosshair.style.position = "absolute";
          crosshair.style.zIndex = "0";
          crosshair.style.pointerEvents = "none";

          const lineH = document.createElement("span");
          lineH.className = "crosshair__line crosshair__line--h";

          const lineV = document.createElement("span");
          lineV.className = "crosshair__line crosshair__line--v";

          const centerIcon = document.createElement("img");
          centerIcon.className = "crosshair__center";
          centerIcon.src =
            "./assets/69fda51c4553498c78fba30f_cross-center.svg";
          centerIcon.alt = "";
          centerIcon.width = 24;
          centerIcon.height = 24;
          centerIcon.draggable = false;

          crosshair.appendChild(lineH);
          crosshair.appendChild(lineV);
          crosshair.appendChild(centerIcon);
          crosshair.style.zIndex = "1";
          section.appendChild(crosshair);

          const setCX = gsap.quickTo(centerIcon, "x", {
            duration: 0.01,
            ease: "none",
          });
          const setCY = gsap.quickTo(centerIcon, "y", {
            duration: 0.01,
            ease: "none",
          });

          let activeKey = null;
          let hoveredKey = null;
          let lastX = section.clientWidth / 2;
          let lastY = section.clientHeight / 2;
          let crosshairTween = null;
          let hideDelayCall = null;

          function getTriggerKey(trigger) {
            for (const cls in classToIndexMap) {
              if (trigger.classList.contains(cls)) return classToIndexMap[cls];
            }
            return null;
          }

          function getOffsetPx(el) {
            const fontSize = parseFloat(getComputedStyle(el).fontSize) || 16;
            return fontSize;
          }

          function cancelHideDelay() {
            if (hideDelayCall) {
              hideDelayCall.kill();
              hideDelayCall = null;
            }
          }

          function showCrosshair(show) {
            if (crosshairTween) crosshairTween.kill();

            crosshairTween = gsap.to(crosshair, {
              opacity: show ? 1 : 0,
              duration: 0.2,
              ease: "power2.out",
              overwrite: true,
            });
          }

          function moveCrosshair(x, y) {
            lineH.style.top = y + "px";
            lineV.style.left = x + "px";
            setCX(x - 12);
            setCY(y - 12);
          }

          function hideAllPoints() {
            Object.values(points).forEach((point) => {
              if (!point) return;
              gsap.killTweensOf(point);
              gsap.to(point, {
                opacity: 0,
                duration: 0.18,
                ease: "power2.out",
                overwrite: true,
              });
            });
          }

          function showPoint(key) {
            const point = points[key];
            if (!point) {
              console.warn(`[crosshair] point ch${key} not found`);
              return;
            }

            if (activeKey === key) return;

            hideAllPoints();

            gsap.killTweensOf(point);
            gsap.set(point, { opacity: 0 });
            gsap.to(point, {
              opacity: 1,
              duration: 0.18,
              ease: "power2.out",
              overwrite: true,
            });
          }

          function clampContainerPosition(el, x, y) {
            const offset = getOffsetPx(el);
            const targetX = x + offset;
            const targetY = y + offset;

            const w = el.offsetWidth;
            const h = el.offsetHeight;
            const sw = section.clientWidth;
            const sh = section.clientHeight;

            const minX = EDGE_PADDING;
            const minY = EDGE_PADDING;
            const maxX = Math.max(minX, sw - w - EDGE_PADDING);
            const maxY = Math.max(minY, sh - h - EDGE_PADDING);

            return {
              x: Math.min(Math.max(targetX, minX), maxX),
              y: Math.min(Math.max(targetY, minY), maxY),
            };
          }

          function hideContainer(el) {
            if (!el) return;

            gsap.killTweensOf(el);
            gsap.to(el, {
              opacity: 0,
              duration: 0.15,
              ease: "power2.out",
              overwrite: true,
              onComplete: () => {
                el.style.display = "none";
                el.style.pointerEvents = "none";
              },
            });
          }

          function hideAllContainers(exceptKey = null) {
            Object.entries(containers).forEach(([key, el]) => {
              if (!el) return;
              if (String(key) === String(exceptKey)) return;
              hideContainer(el);
            });
          }

          function forceShowContainer(el, x, y) {
            el.style.display = "flex";
            el.style.position = "absolute";
            el.style.zIndex = "10";
            el.style.top = "0";
            el.style.left = "0";
            el.style.right = "auto";
            el.style.bottom = "auto";
            el.style.margin = "0";
            el.style.pointerEvents = "auto";
            el.style.willChange = "transform, opacity";

            gsap.killTweensOf(el);

            gsap.set(el, {
              display: "flex",
              opacity: 0,
            });

            const pos = clampContainerPosition(el, x, y);

            gsap.set(el, {
              x: pos.x,
              y: pos.y,
            });

            gsap.to(el, {
              opacity: 1,
              duration: 0.22,
              ease: "power2.out",
              overwrite: true,
            });
          }

          function showContainer(key, x, y) {
            const el = containers[key];
            if (!el) {
              console.warn(
                `[crosshair] container ch-container${key} not found`,
              );
              return;
            }

            if (activeKey === key && getComputedStyle(el).display !== "none") {
              return;
            }

            hideAllContainers(key);
            forceShowContainer(el, x, y);
          }

          function moveActiveContainer(x, y) {
            if (!activeKey) return;

            const el = containers[activeKey];
            if (!el) return;
            if (getComputedStyle(el).display === "none") return;

            const pos = clampContainerPosition(el, x, y);

            gsap.killTweensOf(el, "x,y");
            gsap.to(el, {
              x: pos.x,
              y: pos.y,
              duration: 0.18,
              ease: "power3.out",
              overwrite: "auto",
            });
          }

          function setActive(key) {
            cancelHideDelay();

            hoveredKey = key;

            if (activeKey === key) return;

            showPoint(key);
            showContainer(key, lastX, lastY);
            activeKey = key;
          }

          function scheduleClearActive(leavingKey = null) {
            cancelHideDelay();

            hideDelayCall = gsap.delayedCall(HIDE_DELAY, () => {
              if (hoveredKey && leavingKey && hoveredKey === leavingKey) return;
              if (hoveredKey) return;

              activeKey = null;
              hideAllPoints();
              hideAllContainers();
              hideDelayCall = null;
            });
          }

          function clearActive(immediate = false, leavingKey = null) {
            if (immediate) {
              cancelHideDelay();
              hoveredKey = null;
              activeKey = null;
              hideAllPoints();
              hideAllContainers();
              return;
            }

            scheduleClearActive(leavingKey);
          }

          const onMouseMove = (e) => {
            const rect = section.getBoundingClientRect();
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;

            moveCrosshair(lastX, lastY);
            showCrosshair(true);
            moveActiveContainer(lastX, lastY);
          };

          const onMouseLeaveSection = () => {
            showCrosshair(false);
            clearActive(true);
          };

          const triggerHandlers = triggers.map((trigger) => {
            const key = getTriggerKey(trigger);

            const onEnter = () => {
              if (!key) return;
              cancelHideDelay();
              hoveredKey = key;
              showCrosshair(true);
              setActive(key);
            };

            const onLeave = (e) => {
              const related = e.relatedTarget;

              if (related && related.closest(".ch-trigger")) {
                const nextTrigger = related.closest(".ch-trigger");
                const nextKey = getTriggerKey(nextTrigger);

                if (nextKey === key) {
                  return;
                }
              }

              if (hoveredKey === key) hoveredKey = null;
              clearActive(false, key);
            };

            trigger.addEventListener("mouseenter", onEnter);
            trigger.addEventListener("mouseleave", onLeave);

            return { trigger, onEnter, onLeave };
          });

          gsap.set(crosshair, { opacity: 0 });

          Object.values(points).forEach((point) => {
            if (!point) return;
            gsap.set(point, { opacity: 0 });
            point.style.pointerEvents = "none";
          });

          Object.values(containers).forEach((el) => {
            if (!el) return;
            gsap.killTweensOf(el);
            gsap.set(el, { opacity: 0, x: 0, y: 0 });
            el.style.display = "none";
            el.style.pointerEvents = "none";
          });

          section.addEventListener("mousemove", onMouseMove, { passive: true });
          section.addEventListener("mouseleave", onMouseLeaveSection);

          return () => {
            cancelHideDelay();

            section.removeEventListener("mousemove", onMouseMove, {
              passive: true,
            });
            section.removeEventListener("mouseleave", onMouseLeaveSection);

            triggerHandlers.forEach(({ trigger, onEnter, onLeave }) => {
              trigger.removeEventListener("mouseenter", onEnter);
              trigger.removeEventListener("mouseleave", onLeave);
            });

            Object.values(containers).forEach((el) => {
              if (!el) return;
              gsap.killTweensOf(el);
              el.style.display = "none";
              el.style.pointerEvents = "none";
              el.style.position = "";
              el.style.top = "";
              el.style.left = "";
              el.style.right = "";
              el.style.bottom = "";
              el.style.margin = "";
              el.style.willChange = "";
              gsap.set(el, { clearProps: "x,y,opacity,display" });
            });

            Object.values(points).forEach((point) => {
              if (!point) return;
              gsap.killTweensOf(point);
              gsap.set(point, { clearProps: "opacity" });
            });

            crosshair.remove();
          };
        });
      }

      //////
      function tabsInit() {
        (() => {
          if (typeof gsap === "undefined") {
            console.warn("[tabs-pixel] GSAP is not found");
            return;
          }
          if (typeof ScrollTrigger === "undefined") {
            console.warn("[tabs-pixel] ScrollTrigger is not found");
            return;
          }

          gsap.registerPlugin(ScrollTrigger);
          if (typeof Flip !== "undefined") gsap.registerPlugin(Flip);

          /* ---------- Breakpoint guard ---------- */
          const BREAKPOINT = 768;
          const isDesktop = () => window.innerWidth >= BREAKPOINT;

          const section = document.getElementById("tabs");
          const wrap = document.querySelector(".tabs-wrap");
          if (!section || !wrap) return;

          const links = [...wrap.querySelectorAll(".tabs-link")];
          const slidesHost = wrap.querySelector(".tabs-slides");
          const slides = [...wrap.querySelectorAll(".tabs-slide")];
          const contentSlides = [
            ...wrap.querySelectorAll(".tabs-content-slide"),
          ];
          const diamond = wrap.querySelector(".tabs-diamond");

          if (!links.length || !slidesHost || !slides.length) return;

          /* ---------- Settings ---------- */
          const COLS = 8;
          const FILL = "#F7F6F1";
          const CELL_DUR = 0.2;
          const ROW_DELAY = 0.06;
          const RANDOM_RANGE = 0.22;
          const STEP_VH = 1;
          const LAST_STEP_EXTRA_VH = 0.45;

          const CONTENT_OUT_DUR = 0.55;
          const CONTENT_IN_DUR = 0.75;
          const CONTENT_STAGGER = 0.1;
          const CONTENT_Y = 40;

          const BASE_BLUR = 1;
          const ACTIVE_BLUR = 0;

          /* ---------- Slide animations settings ---------- */
          const ANIM_FADE_DUR = 0.7;
          const ANIM_DRAW_DUR = 1.2;

          const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;

          /* ---------- Canvas ---------- */
          const canvas = document.createElement("canvas");
          canvas.className = "tabs-pixel-canvas";
          slidesHost.appendChild(canvas);
          const ctx = canvas.getContext("2d", { alpha: true });

          let cols = COLS,
            rows = 0,
            cellW = 0,
            cellH = 0,
            dpr = 1;
          let jitter = [];
          let activeTL = null;
          let resizeRAF = 0;

          const resize = () => {
            const rect = slidesHost.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            cellW = rect.width / cols;
            rows = Math.max(1, Math.round(rect.height / cellW));
            cellH = rect.height / rows;

            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            jitter = Array.from({ length: rows }, () =>
              Array.from({ length: cols }, () => Math.random() * RANDOM_RANGE),
            );
          };
          resize();

          new ResizeObserver(() => {
            cancelAnimationFrame(resizeRAF);
            resizeRAF = requestAnimationFrame(resize);
          }).observe(slidesHost);

          /* ---------- Pixel Wave ---------- */
          const buildPixelWave = (onMid, onDone) => {
            if (activeTL) activeTL.kill();

            const totalCover = (rows - 1) * ROW_DELAY + RANDOM_RANGE + CELL_DUR;
            const totalReveal = totalCover;
            const total = totalCover + totalReveal;
            const state = { p: 0 };

            const draw = () => {
              const w = canvas.width / dpr,
                h = canvas.height / dpr;
              ctx.clearRect(0, 0, w, h);
              ctx.fillStyle = FILL;
              const p = state.p;

              for (let r = 0; r < rows; r++) {
                const y0 = Math.floor(r * cellH);
                const yh = Math.ceil((r + 1) * cellH) - y0;

                for (let c = 0; c < cols; c++) {
                  const off = r * ROW_DELAY + jitter[r][c];
                  let v;

                  if (p < totalCover) {
                    v = Math.min(1, Math.max(0, (p - off) / CELL_DUR));
                  } else {
                    const pr = p - totalCover;
                    v = 1 - Math.min(1, Math.max(0, (pr - off) / CELL_DUR));
                  }

                  if (v <= 0.001) continue;

                  ctx.globalAlpha = v;
                  const x0 = Math.floor(c * cellW);
                  const xw = Math.ceil((c + 1) * cellW) - x0;
                  ctx.fillRect(x0, y0, xw, yh);
                }
              }

              ctx.globalAlpha = 1;
            };

            gsap.ticker.add(draw);

            const tl = gsap.timeline({
              onComplete: () => {
                gsap.ticker.remove(draw);
                ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
                onDone && onDone();
                activeTL = null;
              },
            });

            tl.to(state, { p: totalCover, duration: totalCover, ease: "none" })
              .add(() => onMid && onMid())
              .to(state, { p: total, duration: totalReveal, ease: "none" });

            activeTL = tl;
            return tl;
          };

          /* ---------- Content Out ---------- */
          const animateContentOut = (slide) => {
            if (!slide) return;
            const heads = slide.querySelectorAll(".tabs-content-head");
            if (!heads.length) return;

            gsap.to(heads, {
              y: CONTENT_Y,
              opacity: 0,
              duration: CONTENT_OUT_DUR,
              ease: "power2.in",
              stagger: CONTENT_STAGGER,
              overwrite: "auto",
            });
          };

          /* ---------- Content In ---------- */
          const animateContentIn = (slide) => {
            if (!slide) return;
            const heads = slide.querySelectorAll(".tabs-content-head");
            if (!heads.length) return;

            gsap.fromTo(
              heads,
              { y: -CONTENT_Y, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: CONTENT_IN_DUR,
                ease: "power3.out",
                stagger: CONTENT_STAGGER,
                overwrite: "auto",
              },
            );
          };

          /* ---------- Initial Content ---------- */
          const animateContentInitial = (slide) => {
            if (!slide) return;
            const heads = slide.querySelectorAll(".tabs-content-head");
            if (!heads.length) return;

            gsap.fromTo(
              heads,
              { y: CONTENT_Y, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: CONTENT_IN_DUR,
                ease: "power3.out",
                stagger: CONTENT_STAGGER,
                overwrite: "auto",
              },
            );
          };

          /* ============================================================
       DATA-SLIDE ANIMATIONS
    ============================================================ */

          const cacheChartWidths = () => {
            slides.forEach((slide) => {
              slide.querySelectorAll('[data-slide="chart"]').forEach((svg) => {
                svg.querySelectorAll("rect").forEach((rect) => {
                  if (!rect.dataset.naturalWidth) {
                    rect.dataset.naturalWidth = rect.getAttribute("width");
                    rect.dataset.naturalX = rect.getAttribute("x");
                  }
                });
              });
            });
          };

          const resetChartInstant = (svg) => {
            svg.querySelectorAll("rect").forEach((rect) => {
              gsap.set(rect, { attr: { width: 0 } });
            });
            svg
              .querySelectorAll("path, text, line, circle, g")
              .forEach((el) => {
                gsap.set(el, { opacity: 0 });
              });
          };

          const playChartAnim = (svg, baseDelay = 0) => {
            const decorEls = [...svg.querySelectorAll("path, line, circle")];
            if (decorEls.length) {
              gsap.to(decorEls, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
                stagger: 0.04,
                delay: baseDelay,
                overwrite: "auto",
              });
            }

            svg.querySelectorAll("rect").forEach((rect, i) => {
              const origW = parseFloat(
                rect.dataset.naturalWidth ?? rect.getAttribute("width"),
              );
              const origX = parseFloat(
                rect.dataset.naturalX ?? rect.getAttribute("x"),
              );

              gsap.fromTo(
                rect,
                { attr: { width: 0, x: origX } },
                {
                  attr: { width: origW, x: origX },
                  duration: 0.9,
                  ease: "power3.out",
                  delay: baseDelay + 0.2 + i * 0.15,
                  overwrite: "auto",
                },
              );
            });

            svg.querySelectorAll("g").forEach((g, i) => {
              const origOpacity = parseFloat(g.getAttribute("opacity") ?? 1);
              gsap.to(g, {
                opacity: origOpacity,
                duration: 0.5,
                ease: "power2.out",
                delay: baseDelay + 0.5 + i * 0.1,
                overwrite: "auto",
              });
            });
          };

          const playDrawPaths = (container, baseDelay = 0) => {
            container
              .querySelectorAll('path[fill="#6266E6"]')
              .forEach((path, i) => {
                try {
                  const len = path.getTotalLength();
                  gsap.set(path, {
                    strokeDasharray: len,
                    strokeDashoffset: len,
                    fillOpacity: 0,
                  });
                  gsap.to(path, {
                    strokeDashoffset: 0,
                    duration: ANIM_DRAW_DUR,
                    ease: "power2.inOut",
                    delay: baseDelay + i * 0.1,
                    overwrite: "auto",
                  });
                  gsap.to(path, {
                    fillOpacity: 1,
                    duration: 0.5,
                    ease: "power1.out",
                    delay: baseDelay + i * 0.1 + ANIM_DRAW_DUR * 0.6,
                    overwrite: "auto",
                  });
                } catch (e) {}
              });

            container.querySelectorAll('path[fill^="url("]').forEach((path) => {
              gsap.to(path, {
                opacity: 1,
                duration: 0.5,
                ease: "power1.out",
                delay: baseDelay + ANIM_DRAW_DUR * 0.6,
                overwrite: "auto",
              });
            });
          };

          const resetSlideAnimsInstant = (slide) => {
            if (!slide || !isDesktop()) return;

            slide.querySelectorAll('[data-slide="fade"]').forEach((el) => {
              gsap.set(el, { opacity: 0 });
            });

            slide
              .querySelectorAll('[data-slide="draw"]')
              .forEach((container) => {
                container
                  .querySelectorAll('path[fill="#6266E6"]')
                  .forEach((path) => {
                    try {
                      const len = path.getTotalLength();
                      gsap.set(path, {
                        strokeDasharray: len,
                        strokeDashoffset: len,
                        fillOpacity: 0,
                      });
                    } catch (e) {}
                  });

                container
                  .querySelectorAll('path[fill^="url("]')
                  .forEach((path) => {
                    gsap.set(path, { opacity: 0 });
                  });
              });

            slide.querySelectorAll('[data-slide="chart"]').forEach((svg) => {
              resetChartInstant(svg);
            });
          };

          const playSlideAnims = (slide) => {
            if (!slide || !isDesktop() || prefersReducedMotion) return;

            slide.querySelectorAll('[data-slide="fade"]').forEach((el) => {
              gsap.to(el, {
                opacity: 1,
                duration: ANIM_FADE_DUR,
                ease: "power2.out",
                overwrite: "auto",
              });
            });

            slide
              .querySelectorAll('[data-slide="draw"]')
              .forEach((container) => {
                playDrawPaths(container, 0);
              });

            slide.querySelectorAll('[data-slide="chart"]').forEach((svg, i) => {
              playChartAnim(svg, i * 0.12);
            });
          };

          const initAllSlideAnims = () => {
            if (!isDesktop()) return;
            cacheChartWidths();
            slides.forEach((slide) => resetSlideAnimsInstant(slide));
            playSlideAnims(slides[currentIndex]);
          };

          /* ============================================================
       STATE
    ============================================================ */
          let currentIndex = Math.max(
            0,
            links.findIndex((l) => l.classList.contains("is--active")),
          );

          const moveDiamondTo = (i, immediate = false) => {
            if (!diamond || !links[i]) return;

            if (typeof Flip !== "undefined") {
              const state = Flip.getState(diamond);
              links[i].appendChild(diamond);
              Flip.from(state, {
                duration: immediate ? 0 : 0.45,
                ease: "power2.out",
                absolute: true,
              });
            } else {
              links[i].appendChild(diamond);
            }
          };

          const getBlurByDistance = (distance) => {
            if (distance === 0) return 0;
            if (distance === 1) return 1;
            if (distance === 2) return 2;
            return 3;
          };

          const updateLinkBlur = (activeIndex) => {
            links.forEach((link, index) => {
              const distance = Math.abs(index - activeIndex);
              const blur = getBlurByDistance(distance);

              gsap.to(link, {
                filter: `blur(${blur}px)`,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto",
              });
            });
          };

          const setActiveLinks = (i, immediate = false) => {
            links.forEach((l, k) => l.classList.toggle("is--active", k === i));
            updateLinkBlur(i);
            moveDiamondTo(i, immediate);
          };

          const setActiveSlides = (i) => {
            slides.forEach((s, k) => s.classList.toggle("is--active", k === i));
            contentSlides.forEach((s, k) =>
              s.classList.toggle("is--active", k === i),
            );
          };

          setActiveLinks(currentIndex, true);
          setActiveSlides(currentIndex);
          animateContentInitial(contentSlides[currentIndex]);

          let busy = false;
          let targetIndex = currentIndex;
          let jumpDirect = false;

          const playTransitionTo = (i) => {
            if (i === currentIndex) return;
            busy = true;
            setActiveLinks(i);

            if (prefersReducedMotion) {
              setActiveSlides(i);
              animateContentInitial(contentSlides[i]);
              currentIndex = i;
              busy = false;
              if (targetIndex !== currentIndex) playTransitionTo(targetIndex);
              return;
            }

            animateContentOut(contentSlides[currentIndex]);

            const leavingSlide = slides[currentIndex];

            buildPixelWave(
              () => {
                if (isDesktop()) resetSlideAnimsInstant(leavingSlide);
                setActiveSlides(i);
                animateContentIn(contentSlides[i]);
              },
              () => {
                currentIndex = i;
                busy = false;

                playSlideAnims(slides[currentIndex]);

                if (jumpDirect) jumpDirect = false;

                if (targetIndex !== currentIndex) {
                  const next =
                    targetIndex > currentIndex
                      ? currentIndex + 1
                      : currentIndex - 1;
                  playTransitionTo(next);
                }
              },
            );
          };

          const requestTarget = (i) => {
            targetIndex = i;
            if (busy) return;
            if (i === currentIndex) return;
            const next = jumpDirect
              ? i
              : i > currentIndex
                ? currentIndex + 1
                : currentIndex - 1;
            playTransitionTo(next);
          };

          /* ---------- ScrollToPlugin ---------- */
          const hasScrollTo = typeof ScrollToPlugin !== "undefined";
          if (hasScrollTo) gsap.registerPlugin(ScrollToPlugin);

          /* ============================================================
       MATCH MEDIA â€” pin & scroll logic only on desktop
    ============================================================ */
          const mm = gsap.matchMedia();

          mm.add(`(min-width: ${BREAKPOINT}px)`, () => {
            const N = links.length;

            // ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ð¹ ÑˆÐ°Ð³ Ð´Ð»Ð¸Ð½Ð½ÐµÐµ Ð¾Ð±Ñ‹Ñ‡Ð½Ñ‹Ñ…
            const pinDistance = () => {
              const steps = Math.max(1, N - 1);
              const base = steps * window.innerHeight * STEP_VH;
              const extra = window.innerHeight * LAST_STEP_EXTRA_VH;
              return base + extra;
            };

            const getIndexByProgress = (progress) => {
              if (N === 1) return 0;

              const segments = [];
              for (let i = 0; i < N - 1; i++) {
                segments.push(
                  i === N - 2 ? STEP_VH + LAST_STEP_EXTRA_VH : STEP_VH,
                );
              }

              const totalUnits = segments.reduce((sum, val) => sum + val, 0);
              const scaled = progress * totalUnits;

              let acc = 0;
              for (let i = 0; i < segments.length; i++) {
                const seg = segments[i];
                const middle = acc + seg / 2;

                if (scaled < middle) return i;
                if (scaled < acc + seg) return i + 1;

                acc += seg;
              }

              return N - 1;
            };

            const getProgressForIndex = (i) => {
              if (N === 1) return 0;
              if (i <= 0) return 0;
              if (i >= N - 1) return 1;

              const segments = [];
              for (let k = 0; k < N - 1; k++) {
                segments.push(
                  k === N - 2 ? STEP_VH + LAST_STEP_EXTRA_VH : STEP_VH,
                );
              }

              const totalUnits = segments.reduce((sum, val) => sum + val, 0);
              let passed = 0;

              for (let k = 0; k < i; k++) passed += segments[k];
              return passed / totalUnits;
            };

            const st = ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: () => `+=${pinDistance()}`,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              refreshPriority: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const idx = getIndexByProgress(self.progress);
                requestTarget(idx);
              },
            });

            const scrollToIndex = (i) => {
              const startPx = st.start;
              const endPx = st.end;
              const progress = getProgressForIndex(i);
              const target = startPx + progress * (endPx - startPx);

              gsap.to(window, {
                scrollTo: { y: target, autoKill: false },
                duration: 0.8,
                ease: "power2.inOut",
              });
            };

            const handlers = links.map((link, i) => {
              const onClick = (e) => {
                e.preventDefault();
                if (i === currentIndex && i === targetIndex) return;

                jumpDirect = true;
                targetIndex = i;

                if (!busy) {
                  playTransitionTo(i);
                }

                if (hasScrollTo) {
                  scrollToIndex(i);
                } else {
                  const startPx = st.start;
                  const endPx = st.end;
                  const progress = getProgressForIndex(i);
                  const target = startPx + progress * (endPx - startPx);
                  window.scrollTo({ top: target, behavior: "smooth" });
                }
              };

              link.addEventListener("click", onClick);
              return onClick;
            });

            requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              initAllSlideAnims();
            });

            return () => {
              links.forEach((link, i) =>
                link.removeEventListener("click", handlers[i]),
              );
            };
          });

          /* ---------- Mobile fallback: simple click switch ---------- */
          mm.add(`(max-width: ${BREAKPOINT - 1}px)`, () => {
            const handlers = links.map((link, i) => {
              const onClick = (e) => {
                e.preventDefault();
                if (i === currentIndex) return;
                setActiveLinks(i);
                setActiveSlides(i);
                animateContentInitial(contentSlides[i]);
                currentIndex = i;
                targetIndex = i;
              };
              link.addEventListener("click", onClick);
              return onClick;
            });

            return () => {
              links.forEach((link, i) =>
                link.removeEventListener("click", handlers[i]),
              );
            };
          });
        })();
      }
  
