"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { heroState } from "@/lib/sceneState";
import { loader } from "@/lib/ready";
import { getQuality } from "@/lib/webgl";

const ACCENT = new THREE.Color("#ff3d00");
const { damp } = THREE.MathUtils;

/** Asymmetric faceted gem: a lathe profile with few segments, flat-shaded so every facet catches light. */
function useCrystalGeometry() {
  return useMemo(() => {
    const profile = [
      new THREE.Vector2(0, -1.6),
      new THREE.Vector2(0.64, -0.62),
      new THREE.Vector2(0.8, 0.02),
      new THREE.Vector2(0.56, 0.7),
      new THREE.Vector2(0.001, 1.3),
    ];
    const geo = new THREE.LatheGeometry(profile, 7).toNonIndexed();
    geo.computeVertexNormals();
    return geo;
  }, []);
}

function Crystal({ low, reduced }: { low: boolean; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const gem = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const satellite = useRef<THREE.Mesh>(null);
  const geometry = useCrystalGeometry();
  const smooth = useRef({ x: 0, y: 0, scroll: 0, intro: 0, enter: 0 });
  const { viewport } = useThree();

  useFrame((state, dt) => {
    const s = smooth.current;
    const t = reduced ? 0 : state.clock.elapsedTime;
    const delta = Math.min(dt, 0.05);
    s.x = damp(s.x, reduced ? 0 : heroState.pointerX, 2.5, delta);
    s.y = damp(s.y, reduced ? 0 : heroState.pointerY, 2.5, delta);
    s.scroll = damp(s.scroll, heroState.scroll, 6, delta);
    s.intro = damp(s.intro, heroState.intro, 5, delta);
    s.enter = damp(s.enter, heroState.enter, 3.2, delta);

    const fit = Math.min(1, viewport.width / 7.5);
    const mobile = viewport.width < 5;
    if (group.current) {
      const g = group.current;
      const scale = fit * (0.35 + s.enter * 0.65) * (1 + s.scroll * 0.55 - s.intro * 0.45);
      g.scale.setScalar(Math.max(scale, 0.001));
      g.position.x = s.x * 0.18 + s.intro * viewport.width * (mobile ? 0.12 : 0.26);
      g.position.y = Math.sin(t * 0.6) * 0.06 + s.y * -0.12 + s.scroll * 0.25 - s.intro * (mobile ? 0.9 : 0.35) + (1 - s.enter) * -0.6;
      g.rotation.x = s.y * 0.22 + s.scroll * 0.5;
      g.rotation.y = s.x * 0.4;
      g.rotation.z = -0.18 + s.scroll * 0.35 - s.intro * 0.25;
    }
    if (gem.current) {
      gem.current.rotation.y = t * 0.16 + s.scroll * Math.PI * 1.25 + s.intro * Math.PI * 0.5 + (1 - s.enter) * -1.2;
    }
    if (ringA.current) {
      ringA.current.rotation.x = Math.PI / 2.25 + s.scroll * 0.9;
      ringA.current.rotation.y = -0.25 + s.x * 0.15;
      ringA.current.rotation.z = t * 0.12;
      ringA.current.scale.setScalar(1 + s.scroll * 1.1);
    }
    if (ringB.current) {
      ringB.current.rotation.x = Math.PI / 1.8 - s.scroll * 0.6;
      ringB.current.rotation.y = 0.5;
      ringB.current.rotation.z = -t * 0.08;
      ringB.current.scale.setScalar(1 + s.scroll * 1.6);
    }
    if (satellite.current) {
      const a = t * 0.45 + 1.2;
      const r = 2.05 * (1 + s.scroll * 1.1);
      satellite.current.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.22, Math.sin(a) * r * 0.3);
    }
  });

  return (
    <group ref={group}>
      <mesh ref={gem} geometry={geometry}>
        <meshPhysicalMaterial
          color="#9aa1e6"
          emissive="#0d1030"
          metalness={0.55}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.04}
          iridescence={0.7}
          iridescenceIOR={1.5}
          iridescenceThicknessRange={[200, 700]}
          envMapIntensity={2.6}
          flatShading
        />
      </mesh>
      <mesh ref={ringA}>
        <torusGeometry args={[1.95, 0.006, 8, 220]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <mesh ref={ringB}>
        <torusGeometry args={[2.35, 0.004, 8, 220]} />
        <meshBasicMaterial color="#f1efea" transparent opacity={0.4} toneMapped={false} />
      </mesh>
      <mesh ref={satellite}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Lights() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={5} position={[0, 4, -2]} rotation-x={Math.PI / 2} scale={[12, 1.2, 1]} />
      <Lightformer form="rect" intensity={2.5} position={[-5, 0.5, 1]} rotation-y={Math.PI / 2} scale={[8, 0.8, 1]} />
      <Lightformer form="rect" intensity={3} color="#ff3d00" position={[5, -1, 0]} rotation-y={-Math.PI / 2} scale={[8, 0.5, 1]} />
      <Lightformer form="ring" intensity={2} color="#9aa3ff" position={[0, 0, 6]} scale={3} />
      <Lightformer form="rect" intensity={1.5} position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[10, 2, 1]} />
    </Environment>
  );
}

function ReadySignal() {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 3) loader.resolve("scene");
  });
  return null;
}

export default function HeroScene({ active, reduced }: { active: boolean; reduced: boolean }) {
  const quality = useMemo(() => getQuality(), []);
  const [dpr, setDpr] = useState(quality.dpr);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      heroState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      heroState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 6.2], fov: 35 }}
      gl={{ antialias: !quality.low, alpha: true, powerPreference: "high-performance", stencil: false, depth: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor onDecline={() => setDpr((d) => Math.max(0.6, d - 0.25))} onFallback={() => setDpr(0.6)} flipflops={3} />
      <Lights />
      <Crystal low={quality.low} reduced={reduced} />
      <ReadySignal />
    </Canvas>
  );
}
