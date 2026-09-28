
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
                const max = document.documentElement.scrollHeight - window.innerHeight;
                const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
                const BASE = baseOpacity();

                // crossfade between scene A (top) and scene B (bottom)
                a.style.opacity = (BASE * (1 - p)).toFixed(3);
                b.style.opacity = (BASE * p).toFixed(3);

                // parallax drift + gentle scale. NOTE: no rotation here — the
                // artwork is mirrored left/right, and rotating the whole layer
                // would tilt the two sides in opposite directions and break that
                // symmetry. Pure translate + scale keeps it perfectly mirrored.
                const y = p * -80;
                const scale = 1 + p * 0.10;
                a.style.transform = 'translate3d(0,' + y + 'px,0) scale(' + scale + ')';
                b.style.transform = 'translate3d(0,' + (-y) + 'px,0) scale(' + scale + ')';

                ticking = false;
            }

            window.addEventListener('scroll', function () {
                if (!ticking) { requestAnimationFrame(update); ticking = true; }
            }, { passive: true });
            window.addEventListener('resize', update);
            if (portrait.addEventListener) portrait.addEventListener('change', update);
            update();
        })();
    