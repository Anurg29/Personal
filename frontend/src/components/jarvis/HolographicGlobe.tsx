"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HolographicGlobe({ width = 130, height = 130, taskCount = 4 }: { width?: number, height?: number, taskCount?: number }) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        
        const scene = new THREE.Scene();
        // Camera setup for cool perspective
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        camera.position.z = 18;
        camera.position.y = 3;
        camera.lookAt(0, 0, 0);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);
        
        // 1. Central Core (The Arc Reactor / Sun)
        const coreGeo = new THREE.SphereGeometry(2, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({ 
            color: 0x00d4ff, 
            transparent: true,
            opacity: 0.9
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // A slightly larger glow around the core
        const glowGeo = new THREE.SphereGeometry(2.5, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        scene.add(glow);

        // 2. Orbital Rings
        const orbitsGroup = new THREE.Group();
        const ringsCount = 4;
        const orbitRadii = [4, 6, 8, 10];
        
        for (let i = 0; i < ringsCount; i++) {
            const ringGeo = new THREE.TorusGeometry(orbitRadii[i], 0.02, 16, 100);
            const ringMat = new THREE.MeshBasicMaterial({ 
                color: 0x00d4ff, 
                transparent: true, 
                opacity: 0.2 
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            
            // Randomly tilt the rings so they cross like an atom or complex orbit
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            orbitsGroup.add(ring);
        }
        scene.add(orbitsGroup);

        // 3. Orbiting Planets (representing Tasks)
        const planets: { mesh: THREE.Mesh, mat: THREE.MeshBasicMaterial, radius: number, speed: number, angle: number, isBlinking: boolean }[] = [];
        const planetColors = [0xff3b3b, 0xffb300, 0x00ff9d, 0xffffff, 0x00d4ff];
        
        // Ensure at least 1 ring exists, bound taskCount to max rings for safety, though they can share rings
        const actualPlanets = Math.max(0, Math.min(taskCount, 10)); 

        for (let i = 0; i < actualPlanets; i++) {
            const pGeo = new THREE.SphereGeometry(0.3 + (Math.random() * 0.2), 16, 16);
            const pMat = new THREE.MeshBasicMaterial({ 
                color: planetColors[i % planetColors.length],
                transparent: true,
                opacity: 1
            });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            
            // Add custom data for the animation loop
            planets.push({
                mesh: pMesh,
                mat: pMat,
                radius: orbitRadii[i % ringsCount],
                speed: 0.005 + Math.random() * 0.02, // Different speeds
                angle: Math.random() * Math.PI * 2, // Random start angle
                isBlinking: Math.random() > 0.3 // Make some blink aggresively
            });
            orbitsGroup.children[i % ringsCount].add(pMesh);
        }

        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const time = Date.now();
            
            // Pulse the core
            const scale = 1 + Math.sin(time * 0.003) * 0.05;
            core.scale.set(scale, scale, scale);
            glow.scale.set(scale * 1.1, scale * 1.1, scale * 1.1);

            // Rotate the entire orbital system slowly
            orbitsGroup.rotation.y += 0.001;
            orbitsGroup.rotation.z += 0.0005;

            // Move the planets around their rings and make them blink
            planets.forEach(p => {
                p.angle += p.speed;
                p.mesh.position.x = Math.cos(p.angle) * p.radius;
                p.mesh.position.y = Math.sin(p.angle) * p.radius;

                // Blinking effect for tasks
                if (p.isBlinking) {
                    // Fast pulsing between 0.3 and 1 opacity
                    p.mat.opacity = 0.65 + Math.sin(time * 0.01 + p.angle) * 0.35;
                }
            });

            renderer.render(scene, camera);
        };
        animate();
        
        return () => {
            cancelAnimationFrame(animationId);
            if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
            renderer.dispose();
            coreGeo.dispose();
            coreMat.dispose();
            glowGeo.dispose();
            glowMat.dispose();
        };
    }, [width, height]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
            <div ref={mountRef} style={{ width, height, filter: "drop-shadow(0 0 10px rgba(0, 212, 255, 0.4))" }} />
            {/* Adding the holographic base beam */}
            <div style={{
                position: "absolute",
                bottom: -10,
                width: 80,
                height: 20,
                background: "radial-gradient(ellipse at center, rgba(0,212,255,0.4) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "rotateX(70deg)",
                zIndex: -1
            }} />
        </div>
    );
}
