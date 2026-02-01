/**
 * Flip Text Animation
 * Ported from Vengence UI for Vanilla JS
 * Replicates the staggered character flip effect.
 */

export function initFlipText() {
    // Target all primary headers and specified classes
    const targets = document.querySelectorAll('h1, h2, .category-title, .flip-target');

    const config = {
        duration: 3, // Seconds for full cycle
        delay: 0,
        loop: true,
        together: false,
        separator: ' '
    };

    targets.forEach(el => {
        // Prevent double init
        if (el.dataset.flipInit) return;
        el.dataset.flipInit = "true";
        el.classList.add('flip-text-wrapper');

        // Accessibility
        const originalText = el.innerText;
        el.setAttribute('aria-label', originalText);

        const words = originalText.split(config.separator);
        const totalChars = originalText.replace(/\s/g, '').length; // Count non-space chars for calc

        let fragment = document.createDocumentFragment();
        let charGlobalIndex = 0;

        words.forEach((word, wIndex) => {
            // Create Word Wrapper
            const wordSpan = document.createElement('span');
            wordSpan.className = 'flip-word';

            // Split chars
            const chars = word.split('');

            chars.forEach((char, cIndex) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'flip-char';
                charSpan.innerText = char;
                charSpan.dataset.char = char; // For potential pseudo-elements

                // Calculate Delay (Sine Wave Stagger)
                let calculatedDelay = config.delay;
                if (!config.together) {
                    const normalizedIndex = charGlobalIndex / totalChars;
                    // Sine wave distribution for organic feel
                    const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                    calculatedDelay = sineValue * (config.duration * 0.5) + config.delay;
                }

                charSpan.style.setProperty('--flip-delay', `${calculatedDelay}s`);
                charSpan.style.setProperty('--flip-duration', `${config.duration}s`);

                wordSpan.appendChild(charSpan);
                charGlobalIndex++;
            });

            fragment.appendChild(wordSpan);

            // Add Space (except last)
            if (wIndex < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.className = 'flip-space';
                spaceSpan.innerHTML = '&nbsp;';
                fragment.appendChild(spaceSpan);
            }
        });

        // Clear and Append
        el.innerHTML = '';
        el.appendChild(fragment);
    });
}
