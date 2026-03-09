"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ParticleBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // ── Particles (Neural Network) ──
        const particleCount = 350;
        const positions = new Float32Array(particleCount * 3);
        const velocities: THREE.Vector3[] = [];
        const spread = 30;

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * spread;
            positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
            positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
            velocities.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.008,
                    (Math.random() - 0.5) * 0.008
                )
            );
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x00d4ff,
            size: 0.06,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // ── Connection Lines ──
        const lineGeometry = new THREE.BufferGeometry();
        const maxLines = 800;
        const linePositions = new Float32Array(maxLines * 6);
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setDrawRange(0, 0);

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending,
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // ── Glowing Ring (Arc Reactor) ──
        const ringGeometry = new THREE.TorusGeometry(4, 0.02, 8, 80);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.08,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        scene.add(ring);

        const ring2Geometry = new THREE.TorusGeometry(6, 0.015, 8, 100);
        const ring2Material = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.05,
        });
        const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
        scene.add(ring2);

        camera.position.z = 15;

        // ── Mouse tracking ──
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("mousemove", handleMouseMove);

        // ── Resize ──
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        // ── Animation Loop ──
        let animationId: number;
        const connectionDistance = 3.5;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const posArray = particleGeometry.attributes.position.array as Float32Array;

            // Update particle positions
            for (let i = 0; i < particleCount; i++) {
                posArray[i * 3] += velocities[i].x;
                posArray[i * 3 + 1] += velocities[i].y;
                posArray[i * 3 + 2] += velocities[i].z;

                // Boundary wrap
                const halfSpread = spread / 2;
                if (Math.abs(posArray[i * 3]) > halfSpread) velocities[i].x *= -1;
                if (Math.abs(posArray[i * 3 + 1]) > halfSpread) velocities[i].y *= -1;
                if (Math.abs(posArray[i * 3 + 2]) > halfSpread) velocities[i].z *= -1;
            }
            particleGeometry.attributes.position.needsUpdate = true;

            // Draw connection lines
            let lineIdx = 0;
            for (let i = 0; i < particleCount && lineIdx < maxLines; i++) {
                for (let j = i + 1; j < particleCount && lineIdx < maxLines; j++) {
                    const dx = posArray[i * 3] - posArray[j * 3];
                    const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                    const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < connectionDistance) {
                        linePositions[lineIdx * 6] = posArray[i * 3];
                        linePositions[lineIdx * 6 + 1] = posArray[i * 3 + 1];
                        linePositions[lineIdx * 6 + 2] = posArray[i * 3 + 2];
                        linePositions[lineIdx * 6 + 3] = posArray[j * 3];
                        linePositions[lineIdx * 6 + 4] = posArray[j * 3 + 1];
                        linePositions[lineIdx * 6 + 5] = posArray[j * 3 + 2];
                        lineIdx++;
                    }
                }
            }
            lineGeometry.setDrawRange(0, lineIdx * 2);
            lineGeometry.attributes.position.needsUpdate = true;

            // Subtle mouse-follow camera
            camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.02;
            camera.position.y += (mouseRef.current.y * 2 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            // Rotate rings
            ring.rotation.x += 0.002;
            ring.rotation.y += 0.001;
            ring2.rotation.x -= 0.001;
            ring2.rotation.z += 0.002;

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            particleGeometry.dispose();
            particleMaterial.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            ringGeometry.dispose();
            ringMaterial.dispose();
            ring2Geometry.dispose();
            ring2Material.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}
