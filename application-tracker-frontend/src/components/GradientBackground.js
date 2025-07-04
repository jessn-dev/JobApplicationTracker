import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export function GradientBackground() {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        // Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
            -1, 1, 1, -1, 0.1, 10
        );
        camera.position.z = 1;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        // ShaderMaterial for the animated gradient
        // Vertex Shader: Simple passthrough
        const vertexShader = `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

        // Fragment Shader: Creates a dynamic gradient
        const fragmentShader = `
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y; // Adjust aspect ratio

        vec3 color1 = vec3(0.04, 0.52, 0.96); // A light blue
        vec3 color2 = vec3(0.3, 0.6, 1.0);  // A slightly darker blue
        vec3 color3 = vec3(0.6, 0.8, 1.0);  // A very light blue/white-ish

        // Animate the mix factor using sine waves
        float mixFactor1 = sin(st.x * 5.0 + u_time * 0.5) * 0.5 + 0.5;
        float mixFactor2 = cos(st.y * 3.0 + u_time * 0.7) * 0.5 + 0.5;
        float mixFactor3 = sin((st.x + st.y) * 4.0 + u_time * 0.6) * 0.5 + 0.5;

        vec3 finalColor = mix(color1, color2, mixFactor1);
        finalColor = mix(finalColor, color3, mixFactor2);
        finalColor = mix(finalColor, color1, mixFactor3); // Blend with color1 again for more variation

        // Add a subtle pulsating effect
        float pulse = sin(u_time * 1.5) * 0.1 + 0.9;
        finalColor *= pulse;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

        const uniforms = {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) }
        };

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        // Create a plane that covers the whole screen
        const geometry = new THREE.PlaneGeometry(2, 2); // A plane from -1 to 1 in x and y
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Animation loop
        let animationFrameId;
        const animate = () => {
            uniforms.u_time.value += 0.01; // Increment time for animation
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        // Handle window resize
        const handleResize = () => {
            if (currentMount) {
                const width = currentMount.clientWidth;
                const height = currentMount.clientHeight;
                renderer.setSize(width, height);
                uniforms.u_resolution.value.set(width, height);
                // Orthographic camera doesn't need aspect ratio update for full screen plane
            }
        };

        window.addEventListener('resize', handleResize);

        // Start animation
        animate();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (currentMount && renderer.domElement) {
                currentMount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <div ref={mountRef} className="absolute inset-0 w-full h-full z-0">
            {/* The Three.js canvas will be appended here */}
        </div>
    );
}