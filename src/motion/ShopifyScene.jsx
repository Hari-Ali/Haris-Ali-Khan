import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, PerspectiveCamera } from "@react-three/drei";
import {
  Shape,
  ExtrudeGeometry,
  CubicBezierCurve3,
  TubeGeometry,
  Vector3,
  MathUtils,
} from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
const logo =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125"><path d="M62 29c-4-3-9-5-14-5-17 0-27 10-27 24 0 12 7 18 17 24 7 4 9 7 9 11 0 5-3 8-8 8-6 0-14-4-20-9l-6 21c7 6 16 9 27 9 18 0 30-10 30-26 0-12-7-19-19-26-7-4-10-7-10-10 0-4 3-7 8-7 5 0 10 2 15 5z"/></svg>';
function Bag({ mobile }) {
  const group = useRef();
  const geometries = useMemo(() => {
    const outline = new Shape();
    outline.moveTo(-0.87, -1.15);
    outline.lineTo(0.87, -1.15);
    outline.lineTo(0.74, 1);
    outline.lineTo(-0.74, 1);
    outline.closePath();
    const body = new ExtrudeGeometry(outline, {
      depth: 0.48,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.025,
    });
    body.translate(0, 0, -0.24);
    const handle = (z) =>
      new TubeGeometry(
        new CubicBezierCurve3(
          new Vector3(-0.35, 0.92, z),
          new Vector3(-0.48, 1.88, z),
          new Vector3(0.48, 1.88, z),
          new Vector3(0.35, 0.92, z),
        ),
        32,
        0.045,
        8,
        false,
      );
    const marks = new SVGLoader()
      .parse(logo)
      .paths.flatMap((path) => SVGLoader.createShapes(path))
      .map(
        (shape) =>
          new ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false }),
      );
    return { body, front: handle(0.2), back: handle(-0.2), marks };
  }, []);
  useEffect(
    () => () =>
      Object.values(geometries)
        .flat()
        .forEach((g) => g.dispose()),
    [geometries],
  );
  useFrame(({ clock, pointer }, delta) => {
    const t = clock.getElapsedTime();
    const step = Math.min(delta, 0.05);
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      -0.37 + Math.sin(t * 0.23) * 0.08 + (mobile ? 0 : pointer.x * 0.1),
      4,
      step,
    );
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      -0.1 + (mobile ? 0 : -pointer.y * 0.05),
      4,
      step,
    );
    group.current.rotation.z = -0.08;
    group.current.position.y = Math.sin(t * 0.55) * 0.045;
  });
  return (
    <group ref={group} rotation={[-0.1, -0.37, -0.08]}>
      <mesh geometry={geometries.body} castShadow receiveShadow>
        <meshStandardMaterial
          attach="material-0"
          color="#87a85b"
          roughness={0.48}
          metalness={0.02}
        />
        <meshStandardMaterial
          attach="material-1"
          color="#607a40"
          roughness={0.65}
        />
      </mesh>
      {[geometries.front, geometries.back].map((geometry, i) => (
        <mesh key={i} geometry={geometry} castShadow>
          <meshStandardMaterial color="#88a867" roughness={0.5} />
        </mesh>
      ))}
      <group position={[-0.45, 0.63, 0.275]} scale={[0.011, -0.011, 0.011]}>
        {geometries.marks.map((geometry, i) => (
          <mesh key={i} geometry={geometry}>
            <meshStandardMaterial color="#f6f5eb" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
function Scene({ host, onReady }) {
  const [active, setActive] = useState(!document.hidden);
  const mobile = matchMedia("(max-width:700px)").matches;
  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        update();
      },
      { rootMargin: "50px" },
    );
    observer.observe(host);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [host]);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={mobile ? 1 : [1, 1.5]}
      shadows={!mobile}
      gl={{ alpha: true, antialias: !mobile, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", () =>
          host.closest(".scene")?.classList.remove("webgl-ready"),
        );
        onReady();
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.3, 5.5]} fov={39} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[-3, 4, 4]} intensity={2.5} color="#fff7e7" />
      <directionalLight position={[3, 2, -2]} intensity={2.8} color="#c3d2ef" />
      <pointLight position={[-2, 0, 3]} intensity={2} />
      <Bag mobile={mobile} />
      {!mobile && (
        <ContactShadows
          position={[0, -1.55, 0]}
          opacity={0.3}
          scale={5}
          blur={2.5}
          far={3}
          resolution={256}
          frames={1}
        />
      )}
    </Canvas>
  );
}
class SceneBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function mountShopifyScene(scene) {
  const host = document.createElement("div");
  host.className = "webgl-bag";
  host.setAttribute("aria-hidden", "true");
  scene.append(host);
  const root = createRoot(host);
  root.render(
    <SceneBoundary onFailure={() => scene.classList.remove("webgl-ready")}>
      <Scene host={host} onReady={() => scene.classList.add("webgl-ready")} />
    </SceneBoundary>,
  );
  return () => {
    root.unmount();
    host.remove();
    scene.classList.remove("webgl-ready");
  };
}
