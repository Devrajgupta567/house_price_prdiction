import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../context/ThemeContext";

export default function ParticleMeshSphere({ className = "" }) {
  const containerRef = useRef(null);
  const { isDark } = useTheme();
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all 3D objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Particle Cloud Sphere (1,600 nodes representing valuation data points)
    const particleCount = 1600;
    const radius = 68;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Colors
    const colorA = new THREE.Color(isDark ? 0x06b6d4 : 0x2563eb); // Cyan / Electric Blue
    const colorB = new THREE.Color(isDark ? 0x8b5cf6 : 0x4f46e5); // Purple / Indigo
    const colorC = new THREE.Color(isDark ? 0xf59e0b : 0xd97706); // Gold / Amber

    for (let i = 0; i < particleCount; i++) {
      // Golden Spiral on sphere distribution for even spacing
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;

      const variance = (Math.random() - 0.5) * 4;
      const r = radius + variance;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      // Interpolate colors based on latitude (phi)
      const ratio = (y + radius) / (radius * 2);
      const chosenColor = ratio > 0.6 ? colorA.clone().lerp(colorC, Math.random() * 0.4) : colorB.clone().lerp(colorA, ratio);

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.8, "rgba(255,255,255,0.15)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const pointTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: isDark ? 3.4 : 3.8,
      map: pointTexture,
      transparent: true,
      vertexColors: true,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
      opacity: isDark ? 0.9 : 0.85,
    });

    const particles = new THREE.Points(geometry, material);
    mainGroup.add(particles);

    // 2. Inner Cyber Icosahedron Wireframe
    const icoGeometry = new THREE.IcosahedronGeometry(radius * 0.72, 1);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0x6366f1 : 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.15 : 0.1,
    });
    const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
    mainGroup.add(icosahedron);

    // 3. Orbital rings
    const ringGeo = new THREE.TorusGeometry(radius * 1.25, 0.4, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x06b6d4 : 0x0284c7,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(radius * 1.15, 0.3, 16, 100),
      new THREE.MeshBasicMaterial({
        color: isDark ? 0xf59e0b : 0xd97706,
        transparent: true,
        opacity: isDark ? 0.25 : 0.2,
      })
    );
    ring2.rotation.y = Math.PI / 4;
    mainGroup.add(ring2);

    // Mouse listener
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mousePos.current.targetX = x * 1.8;
      mousePos.current.targetY = y * 1.8;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia towards mouse position
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      // Group rotation
      mainGroup.rotation.y = elapsedTime * 0.25 + mousePos.current.x;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.2 + mousePos.current.y;

      icosahedron.rotation.y = -elapsedTime * 0.15;
      icosahedron.rotation.x = elapsedTime * 0.1;

      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.18;

      // Dynamic vertex wave pulsing on particles
      const pos = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        // Harmonic breathing wave
        const wave = Math.sin(elapsedTime * 2 + ox * 0.05 + oy * 0.05) * 2.2;
        const factor = 1 + wave / radius;

        pos[i * 3] = ox * factor;
        pos[i * 3 + 1] = oy * factor;
        pos[i * 3 + 2] = oz * factor;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      pointTexture.dispose();
      icoGeometry.dispose();
      icoMaterial.dispose();
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className={`particle-sphere-wrapper ${className}`}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 380,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
