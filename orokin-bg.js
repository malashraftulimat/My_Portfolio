
        // Scroll-driven "live" Orokin background: crossfade + parallax between two mirrored scenes
        (function () {
            const a = document.querySelector('.orokin-bg--a');
            const b = document.querySelector('.orokin-bg--b');
            if (!a || !b) return;

            // Phones/portrait need a touch more presence: the fixed artwork is
            // the main visual and the content is narrower.
            const portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            function baseOpacity() { return portrait.matches ? 0.9 : 0.72; }

            // Respect reduced motion: show a single static scene, no parallax.
            if (reducedMotion.matches) {
                a.style.opacity = baseOpacity().toFixed(3);
                b.style.opacity = '0';
                return;
            }

            let ticking = false;

            function update() {
                const doc = document.documentElement;
                const max = doc.scrollHeight - window.innerHeight;
                const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
                const BASE = baseOpacity();
                const tenno = document.body.classList.contains('theme-tenno');

                // Crossfade completes well before the page ends so the scene
                // change is actually felt while scrolling, not just at the very
                // bottom.
                const cf = Math.min(1, p / (tenno ? 0.45 : 0.80));
                a.style.opacity = (BASE * (1 - cf)).toFixed(3);
                b.style.opacity = (BASE * cf).toFixed(3);

                // Strong parallax drift + scale, centred so it shifts both up
                // and down through the page. NOTE: no rotation/horizontal move —
                // the artwork is mirrored left/right, so only vertical motion
                // keeps that symmetry intact. The theme-tenno layer is oversized
                // (see style.css) to give this drift room without exposing edges.
                const driftA = tenno ? 190 : 65;
                const driftB = tenno ? 120 : 40;
                const grow   = tenno ? 0.34 : 0.14;
                const yA = (p - 0.5) * 2 * driftA;
                const yB = (p - 0.5) * 2 * driftB;
                const scale = 1 + p * grow;
                a.style.transform = 'translate3d(0,' + yA.toFixed(1) + 'px,0) scale(' + scale.toFixed(4) + ')';
                b.style.transform = 'translate3d(0,' + yB.toFixed(1) + 'px,0) scale(' + scale.toFixed(4) + ')';

                ticking = false;
            }

            window.addEventListener('scroll', function () {
                if (!ticking) { requestAnimationFrame(update); ticking = true; }
            }, { passive: true });
            window.addEventListener('resize', update);
            if (portrait.addEventListener) portrait.addEventListener('change', update);
            update();
        })();
    