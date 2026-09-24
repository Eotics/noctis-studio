"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor, MeshDistortMaterial } from "@react-three/drei";
import { useMemo, useRef, useState, type ComponentRef, type RefObject } from "react";
import * as THREE from "three";
import { experienceState } from "@/lib/sceneState";
import { getQuality } from "@/lib/webgl";

const { damp, lerp } = THREE.MathUtils;

type DistortMaterial = ComponentRef<typeof MeshDistortMaterial>;

/**
 * A liquid chrome form whose skin fades away on scroll, revealing its wireframe:
 * the structure (code) was always part of the surface (design).
 */
function Form({ low, reduced, readout }: { low: boolean; reduced: boolean; readout: RefObject<HTMLElement | null> }) {
  const group = useRef<THREE.Group>(null);
  const skin = useRef<DistortMaterial>(null);
  const wire = useRef<DistortMaterial>(null);
  const points = useRef<THREE.PointsMaterial>(null);
  const smooth = useRef({ x: 0, y: 0, progress: 0, spin: 0 });
  const frame = useRef(0);
  const { viewport } = useThree();

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.35, low ? 14 : 24), [low]);
  const shell = useMemo(() => new THREE.IcosahedronGeometry(1.9, low ? 2 : 4), [low]);

  useFrame((state, dt) => {
    const s = smooth.current;
    const delta = Math.min(dt, 0.05);
    const st = experienceState;
    s.x = damp(s.x, reduced ? 0 : st.pointerX, 2.2, delta);
    s.y = damp(s.y, reduced ? 0 : st.pointerY, 2.2, delta);
    s.progress = damp(s.progress, st.progress, 5, delta);

    if (!st.dragging) st.dragVelocity *= Math.pow(0.04, delta);
    s.spin += (reduced ? 0 : 0.12) * delta + st.dragVelocity * delta;

    const p = s.progress;
    const fit = Math.min(1, viewport.width / 6.2);
    if (group.current) {
      group.current.rotation.y = s.spin + s.x * 0.5;
      group.current.rotation.x = s.y * 0.35 + p * 0.8;
      group.current.rotation.z = p * -0.4;
      group.current.position.y = lerp(-0.35, 0.35, p) * (reduced ? 0 : 1);
      group.current.scale.setScalar(fit * lerp(0.82, 1.08, Math.sin(p * Math.PI)));
    }

    const reveal = THREE.MathUtils.smoothstep(p, 0.25, 0.8);
    if (skin.current) {
      skin.current.opacity = 1 - reveal * 0.9;
      skin.current.distort = reduced ? 0.2 : lerp(0.28, 0.5, reveal);
    }
    if (wire.current) {
      wire.current.opacity = 0.05 + reveal * 0.5;
      wire.current.distort = reduced ? 0.2 : lerp(0.28, 0.5, reveal);
    }
    if (points.current) points.current.opacity = 0.15 + reveal * 0.55;

    frame.current += 1;
    if (readout.current && frame.current % 6 === 0 && group.current) {
      const r = group.current.rotation;
      readout.current.textContent = `ROT ${r.x.toFixed(2)} / ${(r.y % (Math.PI * 2)).toFixed(2)} — SKIN ${Math.round((1 - reveal * 0.9) * 100)}%`;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <MeshDistortMaterial
          ref={skin}
          color="#16161b"
          metalness={1}
          roughness={0.22}
          envMapIntensity={1.35}
          clearcoat={1}
          clearcoatRoughness={0.2}
          transparent
          speed={reduced ? 0 : 1.1}
          distort={0.28}
        />
      </mesh>
      <mesh geometry={geometry} scale={1.004}>
        <MeshDistortMaterial ref={wire} color="#f1efea" wireframe transparent opacity={0.05} speed={reduced ? 0 : 1.1} distort={0.28} depthWrite={false} />
      </mesh>
      <points geometry={shell}>
        <pointsMaterial ref={points} color="#ff3d00" size={low ? 0.03 : 0.022} sizeAttenuation transparent opacity={0.2} depthWrite={false} />
      </points>
    </group>
  );
}

export default function ExperienceScene({
  active,
  reduced,
  readout,
}: {
  active: boolean;
  reduced: boolean;
  readout: RefObject<HTMLElement | null>;
}) {
  const quality = useMemo(() => getQuality(), []);
  const [dpr, setDpr] = useState(quality.dpr);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: !quality.low, alpha: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(0.6, d - 0.25))} onFallback={() => setDpr(0.6)} flipflops={3} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={5} position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[14, 0.4, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[12, 0.25, 1]} />
        <Lightformer form="rect" intensity={4} color="#ff3d00" position={[5, -0.5, -1]} rotation-y={-Math.PI / 2} scale={[12, 0.35, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#9aa3ff" position={[0, 0, 6]} scale={5} />
      </Environment>
      <Form low={quality.low} reduced={reduced} readout={readout} />
    </Canvas>
  );
}
