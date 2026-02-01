export function initSpotlightNavbar() {
    const navItemsContainer = document.querySelector('.spotlight-nav-items');
    const pill = document.querySelector('.spotlight-pill');
    const links = document.querySelectorAll('.spotlight-link');

    if (!navItemsContainer || !pill || !links.length) return;

    function movePillTo(element) {
        // Calculate position relative to the container
        const containerRect = navItemsContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        const left = elementRect.left - containerRect.left;
        const width = elementRect.width;

        pill.style.width = `${width}px`;
        pill.style.transform = `translateX(${left}px)`;
        pill.style.opacity = '1';
    }

    // Auto-detect active link based on URL path
    if (!document.querySelector('.spotlight-link.active')) {
        const currentPath = window.location.pathname;
        links.forEach(link => {
            const href = link.getAttribute('href');
            // Check for exact match or Home match
            if (href === currentPath || (href === '/' && (currentPath === '' || currentPath === '/index.html'))) {
                link.classList.add('active');
            }
        });
    }

    // Find active link
    const activeLink = document.querySelector('.spotlight-link.active');

    // Initial position if active link exists
    if (activeLink) {
        // We need to wait for layout? Usually yes.
        // Using requestAnimationFrame to ensure layout is computed
        requestAnimationFrame(() => movePillTo(activeLink));
    } else {
        pill.style.opacity = '0';
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            movePillTo(link);
        });
    });

    navItemsContainer.addEventListener('mouseleave', () => {
        const currentActive = document.querySelector('.spotlight-link.active');
        if (currentActive) {
            movePillTo(currentActive);
        } else {
            pill.style.opacity = '0';
        }
    });
}
