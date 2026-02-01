
export function initPixelatedImageTrail(configOverride = {}) {
    const selector = configOverride.selector || '[data-trail-images]';
    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    // Create container if not exists
    let trailContainer = document.querySelector('.pixelated-trail-container');
    if (!trailContainer) {
        trailContainer = document.createElement('div');
        trailContainer.className = 'pixelated-trail-container';
        document.body.appendChild(trailContainer);
    }

    // Default configuration
    const defaultConfig = {
        imageLifespan: 800,
        inDuration: 200,
        outDuration: 300,
        staggerIn: 60,
        slideDuration: 900,
        slideEasing: "cubic-bezier(0.16, 1, 0.3, 1)", // Expo.easeOut
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        slices: 5,
        spawnThreshold: 50,
        smoothing: 0.15
    };

    const config = { ...defaultConfig, ...configOverride };

    // State
    const mousePos = { x: 0, y: 0 };
    const lastMousePos = { x: 0, y: 0 };
    const interpolatedMousePos = { x: 0, y: 0 };
    let currentImageIndex = 0;
    let isActive = false;
    let images = [];
    let rafId = null;

    // Math Utils
    const lerp = (a, b, n) => (1 - n) * a + n * b;
    const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);


    const createTrailImage = (x, y, dx, dy) => {
        if (!images.length) return;

        const imgSrc = images[currentImageIndex % images.length];
        currentImageIndex++;

        const imgContainer = document.createElement('div');
        imgContainer.className = 'pixelated-trail-img';

        // Start position offset to center
        const offset = 125; // Half of 250px width
        const startX = x - offset;
        const startY = y - offset;

        // Add momentum visual
        const targetX = startX + dx * 0.8;
        const targetY = startY + dy * 0.8;

        imgContainer.style.left = `${startX}px`;
        imgContainer.style.top = `${startY}px`;
        // imgContainer.style.transition = `left ${config.slideDuration}ms ${config.slideEasing}, top ${config.slideDuration}ms ${config.slideEasing}`;

        // Create Slices
        const maskLayers = [];
        for (let i = 0; i < config.slices; i++) {
            const layer = document.createElement('div');
            layer.classList.add('pixelated-mask-layer');

            const imageLayer = document.createElement('div');
            imageLayer.classList.add('pixelated-image-layer');
            imageLayer.style.backgroundImage = `url(${imgSrc})`;

            const sliceSize = 100 / config.slices;
            const startClipY = i * sliceSize;
            const endClipY = (i + 1) * sliceSize;

            // Initial: Hidden (collapsed height 0)
            layer.style.clipPath = `polygon(0% ${i * sliceSize}%, 100% ${i * sliceSize}%, 100% ${i * sliceSize}%, 0% ${i * sliceSize}%)`;
            layer.style.transition = `clip-path ${config.inDuration}ms ${config.easing}`;

            layer.appendChild(imageLayer);
            imgContainer.appendChild(layer);
            maskLayers.push({ layer, startClipY, endClipY });
        }

        trailContainer.appendChild(imgContainer);

        // Reveal Animation
        requestAnimationFrame(() => {
            // Move slightly
            imgContainer.style.transform = `translate(${dx * 2}px, ${dy * 2}px)`;
            imgContainer.style.transition = `transform ${config.slideDuration}ms ease-out`;

            maskLayers.forEach((item, i) => {
                // Stagger from middle or top? Let's do simple top-down or middle-out
                // Middle out creates a nice "split" effect
                const delay = i * config.staggerIn;

                setTimeout(() => {
                    item.layer.style.clipPath = `polygon(0% ${item.startClipY}%, 100% ${item.startClipY}%, 100% ${item.endClipY}%, 0% ${item.endClipY}%)`;
                }, delay);
            });
        });

        // Cleanup
        setTimeout(() => {
            imgContainer.classList.add('animate-out');
            setTimeout(() => {
                if (imgContainer.parentElement) imgContainer.parentElement.removeChild(imgContainer);
            }, config.outDuration);
        }, config.imageLifespan);
    };


    const handleMouseMove = (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    };


    const render = () => {
        if (!isActive) {
            rafId = requestAnimationFrame(render);
            return;
        }

        // Smooth Mouse
        interpolatedMousePos.x = lerp(interpolatedMousePos.x, mousePos.x, config.smoothing);
        interpolatedMousePos.y = lerp(interpolatedMousePos.y, mousePos.y, config.smoothing);

        const dist = distance(interpolatedMousePos.x, interpolatedMousePos.y, lastMousePos.x, lastMousePos.y);

        if (dist > config.spawnThreshold) {
            const dx = interpolatedMousePos.x - lastMousePos.x;
            const dy = interpolatedMousePos.y - lastMousePos.y;

            createTrailImage(interpolatedMousePos.x, interpolatedMousePos.y, dx, dy);

            lastMousePos.x = interpolatedMousePos.x;
            lastMousePos.y = interpolatedMousePos.y;
        }

        rafId = requestAnimationFrame(render);
    };

    // Event Listeners for Elements
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            isActive = true;
            // Parse images from data attribute
            const imgData = el.getAttribute('data-trail-images');
            if (imgData) {
                try {
                    images = JSON.parse(imgData);
                    // Preload?
                } catch (e) {
                    console.error("Invalid JSON in data-trail-images", e);
                    images = [];
                }
            }

            // Initial position reset to avoid jumping
            lastMousePos.x = mousePos.x;
            lastMousePos.y = mousePos.y;
            interpolatedMousePos.x = mousePos.x;
            interpolatedMousePos.y = mousePos.y;
        });

        el.addEventListener('mouseleave', () => {
            isActive = false;
        });
    });

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(render);
}
