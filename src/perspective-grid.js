
export function initPerspectiveGrid(containerSelectors) {
    const containers = document.querySelectorAll(containerSelectors);

    containers.forEach(container => {
        // Prevent double init
        if (container.querySelector('.perspective-grid')) return;

        container.style.position = 'relative';
        container.style.overflow = 'hidden';

        const gridSize = 40; // 40x40 to match the reference
        const grid = document.createElement('div');
        grid.className = 'perspective-grid';

        // Optimize: use DocumentFragment
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < gridSize * gridSize; i++) {
            const tile = document.createElement('div');
            tile.className = 'perspective-tile';
            fragment.appendChild(tile);
        }

        grid.appendChild(fragment);

        // Gradient Overlay
        const overlay = document.createElement('div');
        overlay.className = 'perspective-grid-overlay';

        container.appendChild(grid);
        container.appendChild(overlay);
    });
}
