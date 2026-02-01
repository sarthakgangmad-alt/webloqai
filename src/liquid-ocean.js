import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

/**
 * Liquid Ocean Background Effect
 * Ported from Vengence UI / ShadCN Registry for Vanilla JS
 */
export function initLiquidOcean() {
    // Config matching Vengence UI defaults but with theme colors
    const config = {
        backgroundColor: 0x050505, // Matching body bg
        gridColor: 0x333333,
        accentColor: 0xE67E22, // Webloq Orange (was 0xF00589)
        fov: 50, // Slightly wider for full screen impact
        rotationSpeed: 0.001,
        boatCount: 5,
        boatSpread: 5,
        oceanSize: 30, // Slightly larger coverage
        oceanFragments: 35, // Higher detail
        waveAmplitude: 0.3, // Slightly more motion
        waveSpeed: 0.02,
        oceanOpacity: 0.85
    };

    // Create Container
    const container = document.createElement('div');
    container.id = 'liquid-ocean-container';
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '-10', // Strictly background
        pointerEvents: 'none', // Allow clicks to pass through to buttons
        overflow: 'hidden',
        backgroundColor: '#050505' // Fallback
    });
    document.body.prepend(container);

    // Init Engine
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.backgroundColor);
    scene.fog = new THREE.Fog(config.backgroundColor, 5, 30);

    const camera = new THREE.PerspectiveCamera(config.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 12); // Slightly higher POV
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Init Lights
    RectAreaLightUniformsLib.init();

    const hemiLight = new THREE.HemisphereLight(0xFFD3D3, config.accentColor, 1.5);
    scene.add(hemiLight);

    const pLight1 = new THREE.PointLight(config.accentColor, 1);
    pLight1.position.set(-5, -20, -20);
    scene.add(pLight1);

    const rectLight = new THREE.RectAreaLight(config.accentColor, 20, 3, 3);
    rectLight.position.set(2, 2, -20);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

    const pLight2 = new THREE.PointLight(config.accentColor, 0.2);
    pLight2.position.set(0, 2, -2);
    scene.add(pLight2);

    // Main Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Grid
    const gridHelper = new THREE.GridHelper(20, 20, config.gridColor, 0x111111);
    gridHelper.position.y = -1;
    mainGroup.add(gridHelper);

    // --- Ocean Mesh ---
    const geo = new THREE.PlaneGeometry(config.oceanSize, config.oceanSize, config.oceanFragments, config.oceanFragments);
    const posAttr = geo.getAttribute('position');

    // Store wave data state
    const wavesData = [];
    for (let i = 0; i < posAttr.count; i++) {
        wavesData.push({
            x: posAttr.getX(i),
            y: posAttr.getY(i),
            z: posAttr.getZ(i),
            ang: Math.random() * Math.PI * 2,
            amp: 0.1 + Math.random() * config.waveAmplitude,
            speed: 0.01 + Math.random() * config.waveSpeed
        });
    }

    const surfaceMat = new THREE.MeshPhysicalMaterial({
        color: config.accentColor,
        transparent: true,
        opacity: config.oceanOpacity,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.5,
        reflectivity: 0.5,
        side: THREE.DoubleSide
    });

    const wireMat = new THREE.MeshPhysicalMaterial({
        color: config.accentColor,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
    });

    const oceanGroup = new THREE.Group();
    oceanGroup.rotation.x = -Math.PI / 2;

    const oceanSurface = new THREE.Mesh(geo, surfaceMat);
    oceanSurface.receiveShadow = true;

    const oceanWire = new THREE.Mesh(geo, wireMat);

    oceanGroup.add(oceanSurface);
    oceanGroup.add(oceanWire);
    mainGroup.add(oceanGroup);

    // --- Boats ---
    const boatGeo = new THREE.BoxGeometry(1, 1, 1);
    const boatMat = new THREE.MeshStandardMaterial({
        color: config.accentColor,
        roughness: 0.4,
        metalness: 0.6
    });

    const boats = [];
    const boatGroup = new THREE.Group();

    for (let i = 0; i < config.boatCount; i++) {
        // Random position
        const x = (Math.random() - 0.5) * config.boatSpread * 2;
        const z = (Math.random() - 0.5) * config.boatSpread * 2;
        const sX = 0.5 + Math.random() * 0.5;
        const sY = 0.5 + Math.random() * 2;

        const mesh = new THREE.Mesh(boatGeo, boatMat);
        mesh.position.set(x, 0, z);
        mesh.scale.set(sX, sY, sX);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Store animation data
        mesh.userData = {
            velocity: 1 + Math.random() * 3,
            amplitude: 1 + Math.random() * 5,
            yPosOffset: Math.random() * 0.5,
            rotOffset: Math.random() * Math.PI * 2
        };

        boatGroup.add(mesh);
        boats.push(mesh);
    }
    mainGroup.add(boatGroup);

    // --- Mouse Interaction ---
    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    window.addEventListener('mousemove', (e) => {
        // Normalize mouse from -1 to 1
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        const time = clock.getElapsedTime();

        // 1. Animate Ocean Waves
        for (let i = 0; i < posAttr.count; i++) {
            const w = wavesData[i];
            // Update wave angle
            w.ang += w.speed;

            // Calculate new Z (which maps to Y in world after rotation)
            // Note: In PlaneGeometry, Z is flat (0). We displace Z to make bumps.
            const waveHeight = Math.cos(w.ang) * w.amp;

            // Since we rotate the group -90deg X, Z becomes Y.
            // But the geometry itself has Z as the 'up' relative to the plane face.
            // Wait, PlaneGeometry(x, y). Vertices are in XY plane. Z=0.
            // So we displace Z.
            posAttr.setZ(i, waveHeight);
        }
        posAttr.needsUpdate = true;

        // 2. Animate Boats
        boats.forEach(boat => {
            const d = boat.userData;
            // Bobbing
            boat.position.y = Math.sin(time / d.velocity * 3) * 0.2 + d.yPosOffset;
            // Rocking
            boat.rotation.x = (Math.cos(time * 2) * d.velocity * 2 * Math.PI) / 180;
            boat.rotation.z = (Math.sin(time / d.velocity) * d.amplitude * Math.PI) / 180;
        });

        // 3. Scene Rotation
        mainGroup.rotation.y += config.rotationSpeed;

        // 4. Mouse Interactive Parallax (Subtle camera drift)
        // Lerp target rotation
        targetRotation.x = mouse.y * 0.5; // Look up down
        targetRotation.y = mouse.x * 0.5; // Look left right

        // Camera movement - "moved with that"
        // Move camera slightly based on mouse
        camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
        camera.position.y += (3 + mouse.y * 1 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        // Also rotate the main group slightly based on mouse for extra "liquid" feel
        mainGroup.rotation.z = THREE.MathUtils.lerp(mainGroup.rotation.z, mouse.x * 0.05, 0.1);
        mainGroup.rotation.x = THREE.MathUtils.lerp(mainGroup.rotation.x, mouse.y * 0.05, 0.1);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
