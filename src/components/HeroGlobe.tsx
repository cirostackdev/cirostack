/**
 * Three.js WebGL component — must be imported with next/dynamic to avoid SSR issues:
 *   const HeroGlobe = dynamic(() => import("@/components/HeroGlobe"), { ssr: false });
 */
"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Convert lat/lng to 3D position on a sphere */
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Simplified continent outlines as [lat, lng] coordinate chains
// Each sub-array is a polyline representing a continent/island boundary
const CONTINENT_COORDS: [number, number][][] = [
  // North America
  [
    [60,-140],[64,-139],[70,-141],[71,-156],[66,-164],[60,-165],[57,-170],[52,-170],
    [51,-180],[50,-176],[55,-162],[59,-152],[60,-149],[57,-136],[54,-133],[49,-128],
    [45,-124],[40,-124],[35,-121],[32,-117],[28,-115],[24,-110],[20,-105],[18,-96],
    [18,-88],[15,-83],[10,-84],[8,-77],[10,-75],[12,-72],[16,-87],[19,-87],[21,-90],
    [25,-90],[30,-88],[29,-85],[25,-80],[25,-78],[30,-81],[35,-75],[39,-74],[41,-70],
    [43,-66],[45,-61],[47,-60],[47,-53],[51,-56],[53,-56],[60,-64],[58,-68],[55,-77],
    [52,-79],[51,-80],[48,-89],[49,-95],[52,-96],[55,-97],[57,-92],[59,-94],[62,-114],
    [64,-128],[62,-138],[60,-140],
  ],
  // South America
  [
    [12,-72],[10,-75],[8,-77],[6,-77],[2,-80],[-5,-81],[-6,-77],[-15,-75],[-18,-70],
    [-23,-70],[-27,-71],[-33,-72],[-41,-73],[-46,-75],[-52,-70],[-54,-69],[-56,-67],
    [-55,-64],[-52,-68],[-48,-66],[-42,-63],[-38,-57],[-35,-57],[-33,-52],[-28,-49],
    [-23,-41],[-15,-39],[-12,-37],[-5,-35],[-2,-50],[2,-52],[6,-57],[8,-62],[10,-67],
    [12,-72],
  ],
  // Europe
  [
    [36,-10],[37,-2],[38,0],[40,0],[43,3],[43,6],[44,8],[46,6],[47,7],[48,2],[49,1],
    [50,-5],[51,-3],[52,1],[53,0],[54,8],[55,8],[55,12],[56,10],[57,12],[60,5],[62,5],
    [64,11],[68,16],[70,20],[71,28],[70,32],[67,41],[62,40],[60,30],[57,24],[54,20],
    [54,14],[52,14],[50,14],[48,17],[47,15],[46,13],[44,12],[42,15],[41,17],[40,20],
    [38,24],[36,23],[35,25],[37,28],[38,26],[40,26],[42,28],[41,30],[39,26],[38,20],
    [36,14],[38,12],[40,10],[40,4],[38,0],[36,-5],[36,-10],
  ],
  // Africa
  [
    [37,10],[36,0],[36,-5],[33,-8],[28,-13],[21,-17],[15,-17],[12,-16],[5,-10],[4,-7],
    [6,-2],[5,1],[4,2],[1,10],[-1,12],[-5,12],[-10,14],[-12,15],[-17,12],[-22,14],
    [-26,15],[-29,17],[-31,18],[-34,18],[-34,24],[-34,26],[-30,31],[-26,33],[-23,35],
    [-15,40],[-12,44],[-5,42],[-2,41],[0,42],[4,42],[5,44],[10,45],[12,44],[12,50],
    [11,51],[15,42],[20,40],[22,37],[25,35],[28,33],[30,32],[32,32],[35,33],[36,28],
    [37,20],[38,12],[37,10],
  ],
  // Asia
  [
    [42,28],[43,40],[40,44],[38,48],[36,52],[30,48],[27,50],[25,56],[24,58],[22,60],
    [20,63],[18,67],[16,73],[12,80],[8,77],[6,80],[1,104],[2,106],[5,105],[7,110],
    [10,109],[14,109],[18,106],[21,108],[22,114],[24,118],[28,122],[30,122],[34,127],
    [38,125],[40,130],[42,132],[44,135],[46,143],[50,143],[52,142],[55,137],[59,143],
    [63,140],[65,143],[68,180],[70,178],[72,180],[71,170],[67,160],[65,170],[62,177],
    [55,163],[54,155],[50,156],[48,154],[46,150],[44,148],[42,140],[40,135],[36,128],
    [32,125],[28,120],[25,120],[22,115],[20,110],[16,108],[13,109],[8,110],[4,108],
    [1,105],[-2,106],[-6,106],[-8,110],[-8,115],[-7,120],[-5,120],[-2,118],[1,116],
    [3,118],[5,119],[7,117],[8,115],[6,112],[4,108],
  ],
  // Australia
  [
    [-12,130],[-12,136],[-14,136],[-15,141],[-18,146],[-21,149],[-24,153],[-28,153],
    [-33,152],[-35,151],[-37,150],[-38,148],[-39,146],[-38,141],[-35,137],[-35,134],
    [-32,132],[-32,127],[-31,115],[-33,115],[-34,118],[-35,117],[-34,115],[-32,114],
    [-26,113],[-22,114],[-20,119],[-15,125],[-14,130],[-12,130],
  ],
  // Greenland
  [
    [77,-18],[80,-20],[82,-29],[83,-40],[83,-50],[82,-55],[80,-60],[78,-68],[76,-72],
    [72,-56],[70,-52],[68,-50],[65,-42],[64,-40],[66,-36],[68,-28],[72,-22],[77,-18],
  ],
  // Japan
  [
    [31,131],[33,130],[34,132],[35,134],[36,137],[37,137],[38,139],[39,140],[41,140],
    [42,141],[43,145],[45,142],[44,143],[42,143],[40,140],[38,139],[36,136],[34,134],
    [33,131],[31,131],
  ],
  // Indonesia (simplified)
  [
    [-6,106],[-7,106],[-8,110],[-8,115],[-7,117],[-6,116],[-5,114],[-6,112],[-6,106],
  ],
  // UK
  [
    [50,-5],[51,-3],[52,-1],[53,0],[54,0],[55,-2],[57,-5],[58,-3],[57,-7],[55,-7],
    [54,-5],[52,-5],[50,-5],
  ],
];

// Key tech hub cities
const CITIES = [
  { lat: 40.71, lng: -74.0 },   // New York
  { lat: 37.77, lng: -122.42 }, // San Francisco
  { lat: 51.51, lng: -0.13 },   // London
  { lat: 48.86, lng: 2.35 },    // Paris
  { lat: 52.52, lng: 13.41 },   // Berlin
  { lat: 35.68, lng: 139.69 },  // Tokyo
  { lat: 1.35, lng: 103.82 },   // Singapore
  { lat: -23.55, lng: -46.63 }, // São Paulo
  { lat: 19.43, lng: -99.13 },  // Mexico City
  { lat: 28.61, lng: 77.21 },   // New Delhi
  { lat: -33.87, lng: 151.21 }, // Sydney
  { lat: 55.76, lng: 37.62 },   // Moscow
  { lat: 25.2, lng: 55.27 },    // Dubai
  { lat: 37.57, lng: 126.98 },  // Seoul
  { lat: 49.28, lng: -123.12 }, // Vancouver
  { lat: 30.04, lng: 31.24 },   // Cairo
];

// Connections between cities (index pairs)
const ARCS = [
  [0, 2], [0, 1], [2, 3], [2, 4], [3, 4], [5, 6],
  [6, 9], [7, 8], [0, 7], [1, 8], [9, 5], [10, 6],
  [2, 11], [9, 12], [5, 13], [1, 14], [12, 9], [15, 12],
];

const GLOBE_RADIUS = 2.2;

/** Create a curved arc between two points on the globe */
function createArc(start: THREE.Vector3, end: THREE.Vector3, segments = 48): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const dist = start.distanceTo(end);
  mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.25);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3();
    p.lerpVectors(start, mid, t);
    const p2 = new THREE.Vector3().lerpVectors(mid, end, t);
    p.lerp(p2, t);
    points.push(p);
  }
  return points;
}

function Globe({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null!);
  const landDotsRef = useRef<THREE.InstancedMesh>(null!);
  const cityDotsRef = useRef<THREE.InstancedMesh>(null!);
  const arcsRef = useRef<THREE.Group>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const landDotsInitialized = useRef(false);

  // Build continent outline geometries
  const continentLines = useMemo(() => {
    return CONTINENT_COORDS.map((coords) => {
      const points = coords.map(([lat, lng]) => latLngToVec3(lat, lng, GLOBE_RADIUS));
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  // Generate land-fill dots along continent outlines (densified)
  const landDots = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    CONTINENT_COORDS.forEach((coords) => {
      for (let i = 0; i < coords.length - 1; i++) {
        const [lat1, lng1] = coords[i];
        const [lat2, lng2] = coords[i + 1];
        // Place dots along each edge segment
        const steps = 3;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const lat = lat1 + (lat2 - lat1) * t;
          const lng = lng1 + (lng2 - lng1) * t;
          pts.push(latLngToVec3(lat, lng, GLOBE_RADIUS));
        }
      }
    });
    return pts;
  }, []);

  // City positions
  const cityPositions = useMemo(
    () => CITIES.map((c) => latLngToVec3(c.lat, c.lng, GLOBE_RADIUS)),
    []
  );

  // Arc geometries
  const arcLines = useMemo(() => {
    return ARCS.map(([a, b]) => {
      const pts = createArc(cityPositions[a], cityPositions[b]);
      return new THREE.BufferGeometry().setFromPoints(pts);
    });
  }, [cityPositions]);

  useFrame((state) => {
    // Initialize land dot positions once
    if (!landDotsInitialized.current && landDotsRef.current) {
      landDots.forEach((p, i) => {
        dummy.position.copy(p);
        dummy.updateMatrix();
        landDotsRef.current.setMatrixAt(i, dummy.matrix);
      });
      landDotsRef.current.instanceMatrix.needsUpdate = true;
      landDotsInitialized.current = true;
    }

    const t = state.clock.elapsedTime;

    // Slow rotation + subtle mouse influence
    const mx = (mouse.current.x / window.innerWidth - 0.5) * 0.3;
    const my = (mouse.current.y / window.innerHeight - 0.5) * 0.15;
    groupRef.current.rotation.y = t * 0.06 + mx;
    groupRef.current.rotation.x = -0.1 + my * 0.4;

    // Pulse city dots
    cityPositions.forEach((p, i) => {
      const scale = 1 + Math.sin(t * 2 + i * 0.7) * 0.35;
      dummy.position.copy(p);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      cityDotsRef.current.setMatrixAt(i, dummy.matrix);
    });
    cityDotsRef.current.instanceMatrix.needsUpdate = true;

    // Animate arc opacity
    if (arcsRef.current) {
      arcsRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Line).material as THREE.LineBasicMaterial;
        mat.opacity = 0.18 + Math.sin(t * 1.5 + i * 0.8) * 0.12;
      });
    }
  });

  return (
    <group ref={groupRef} position={[1.8, -0.2, 0]}>
      {/* Faint globe wireframe sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS - 0.01, 48, 48]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.025} />
      </mesh>

      {/* Continent outlines */}
      {continentLines.map((geo, i) => (
        <line key={`c-${i}`} geometry={geo}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
        </line>
      ))}

      {/* Land dots along continent edges */}
      <instancedMesh ref={landDotsRef} args={[undefined, undefined, landDots.length]}>
        <sphereGeometry args={[0.013, 4, 4]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </instancedMesh>

      {/* City nodes — pulsing red */}
      <instancedMesh ref={cityDotsRef} args={[undefined, undefined, cityPositions.length]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#ff3b3b" transparent opacity={0.9} />
      </instancedMesh>

      {/* Connection arcs */}
      <group ref={arcsRef}>
        {arcLines.map((geo, i) => (
          <line key={i} geometry={geo}>
            <lineBasicMaterial color="#ff5555" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
          </line>
        ))}
      </group>

      {/* Atmospheric glow */}
      <mesh>
        <ringGeometry args={[GLOBE_RADIUS + 0.02, GLOBE_RADIUS + 0.1, 64]} />
        <meshBasicMaterial color="#ff3b3b" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function HeroGlobe({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <div className="absolute inset-0 z-[1]" style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Globe mouse={mouse} />
      </Canvas>
    </div>
  );
}
