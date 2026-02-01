
export function initGlassDock() {
    // Dock Icons Config
    const dockItems = [
        { title: 'Home', icon: 'home', href: '/' },
        { title: 'Services', icon: 'marker', href: '/#services' }, // Marker used for "Services" location
        { title: 'Portfolio', icon: 'blog', href: '/portfolio.html' }, // Blog/File icon for Portfolio
        { title: 'Contact', icon: 'email', href: 'mailto:webloqai@gmail.com' },
        // { title: 'Twitter', icon: 'x', href: '#' },
        // { title: 'GitHub', icon: 'github', href: '#' },
        { title: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/harshal-sankala/' }
    ];

    // Create Container
    const dockContainer = document.createElement('div');
    dockContainer.className = 'glass-dock-container';

    const dock = document.createElement('div');
    dock.className = 'glass-dock';

    // SVG Icons Map (Simplified paths)
    const icons = {
        home: '<path d="M3 18V10.5339C3 9.57062 3.46259 8.66591 4.24353 8.1019L10.2435 3.76856C11.2921 3.01128 12.7079 3.01128 13.7565 3.76856L19.7565 8.1019C20.5374 8.66591 21 9.57062 21 10.5339V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18Z" />',
        marker: '<path d="M12 21C12 21 9.39536 18.8605 7.3637 16C6.06474 14.1711 5 12.0475 5 10C5 6.134 8.134 3 12 3C15.866 3 19 6.134 19 10C19 12.0475 17.9353 14.1711 16.6363 16C14.6046 18.8605 12 21 12 21Z" />',
        blog: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />',
        email: '<path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />',
        linkedin: '<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />',
        x: '<path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />',
        github: '<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />'
    };

    dockItems.forEach(item => {
        const itemEl = document.createElement('a');
        itemEl.className = 'dock-item';
        itemEl.href = item.href;

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'dock-tooltip';
        tooltip.textContent = item.title;
        itemEl.appendChild(tooltip);

        // Icon (SVG)
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.innerHTML = icons[item.icon] || '';
        itemEl.appendChild(svg);

        dock.appendChild(itemEl);
    });

    dockContainer.appendChild(dock);

    // Append to footer contact section or footer container
    const footerContainer = document.querySelector('footer .container');
    if (footerContainer) {
        footerContainer.appendChild(dockContainer);
    } else {
        document.body.appendChild(dockContainer);
    }
}
