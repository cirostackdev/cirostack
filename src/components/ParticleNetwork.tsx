/**
 * Three.js WebGL component — must be imported with next/dynamic to avoid SSR issues:
 *   const ParticleNetwork = dynamic(() => import("@/components/ParticleNetwork"), { ssr: false });
 */
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 160;
const CONNECTION_DISTANCE = 2.2;
const FIELD_W = 16;
const FIELD_H = 10;

function Particles({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const vel = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * FIELD_W;
      pos[i * 3 + 1] = (Math.random() - 0.5) * FIELD_H;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return { positions: pos, velocities: vel };
  }, []);

  const lineGeometry = useMemo(() => {
    const maxLines = PARTICLE_COUNT * 8;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(maxLines * 6), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(maxLines * 8), 4));
    geo.setDrawRange(0, 0);
    return geo;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const halfW = FIELD_W / 2;
    const halfH = FIELD_H / 2;

    const mx = (mouse.current.x / window.innerWidth * 2 - 1) * viewport.width * 0.5;
    const my = -(mouse.current.y / window.innerHeight * 2 - 1) * viewport.height * 0.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] += velocities[i * 3] + Math.sin(time * 0.2 + i * 0.1) * 0.001;
      positions[i * 3 + 1] += velocities[i * 3 + 1] + Math.cos(time * 0.15 + i * 0.12) * 0.001;
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(positions[i * 3]) > halfW) velocities[i * 3] *= -1;
      if (Math.abs(positions[i * 3 + 1]) > halfH) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 4) velocities[i * 3 + 2] *= -1;

      // Gentle mouse attraction
      const dx = mx - positions[i * 3];
      const dy = my - positions[i * 3 + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 3 && dist > 0.1) {
        const pull = 0.004 * (1 - dist / 3);
        positions[i * 3] += dx * pull;
        positions[i * 3 + 1] += dy * pull;
      }

      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Connection lines
    const linePos = lineGeometry.getAttribute("position") as THREE.BufferAttribute;
    const lineCol = lineGeometry.getAttribute("color") as THREE.BufferAttribute;
    let idx = 0;
    const maxLines = PARTICLE_COUNT * 8;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const ddx = positions[i * 3] - positions[j * 3];
        const ddy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const ddz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const d = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz);

        if (d < CONNECTION_DISTANCE) {
          const alpha = (1 - d / CONNECTION_DISTANCE);
          linePos.setXYZ(idx * 2, positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
          linePos.setXYZ(idx * 2 + 1, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
          lineCol.setXYZW(idx * 2, 1, 0.3, 0.3, alpha * 0.18);
          lineCol.setXYZW(idx * 2 + 1, 1, 0.3, 0.3, alpha * 0.08);
          idx++;
          if (idx >= maxLines) break;
        }
      }
      if (idx >= maxLines) break;
    }

    lineGeometry.setDrawRange(0, idx * 2);
    linePos.needsUpdate = true;
    lineCol.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#ff5555" transparent opacity={0.35} />
      </instancedMesh>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} />
      </lineSegments>
    </>
  );
}

export default function ParticleNetwork({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <div className="absolute inset-0 z-[1]" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Particles mouse={mouse} />
      </Canvas>
    </div>
  );
}
