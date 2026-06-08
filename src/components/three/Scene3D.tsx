import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { createCharacterHead, createCharacterBody } from "./Character3D";
import { CompletedEffect, CharacterProfile } from "@/types";
import { getSkinToneColors, getOutfitColors } from "@/data";

interface Scene3DProps {
  effects: CompletedEffect;
  isComplete: boolean;
  characterProfile?: CharacterProfile;
  interactive?: boolean;
  showTargetZones?: boolean;
  targetZones?: { name: string; position: [number, number, number]; size: [number, number, number] }[];
  onZoneHover?: (zoneName: string | null) => void;
}

export default function Scene3D({
  effects,
  isComplete,
  characterProfile,
  interactive = true,
  showTargetZones = false,
  targetZones = [],
  onZoneHover,
}: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const [isRotating, setIsRotating] = useState(false);

  const skinToneData = getSkinToneColors(characterProfile?.skinTone);
  const outfitColors = getOutfitColors(characterProfile?.outfitStyle);
  const faceShape = characterProfile?.faceShape;

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfdf2f6);
    scene.fog = new THREE.Fog(0xfdf2f6, 5, 15);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.8, 4.5);
    camera.lookAt(0, 0.6, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(3, 5, 4);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -5;
    mainLight.shadow.camera.right = 5;
    mainLight.shadow.camera.top = 5;
    mainLight.shadow.camera.bottom = -5;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffd6e6, 0.4);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xe0d0ff, 0.3);
    rimLight.position.set(0, 2, -4);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0xffe8f0, 0.5, 10);
    topLight.position.set(0, 5, 1);
    scene.add(topLight);

    const floorGeometry = new THREE.CircleGeometry(4, 64);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xfce4ec,
      roughness: 0.9,
      metalness: 0.0,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.3;
    floor.receiveShadow = true;
    scene.add(floor);

    const characterGroup = new THREE.Group();

    const body = createCharacterBody(
      skinToneData.c1,
      skinToneData.c2,
      outfitColors.c1,
      outfitColors.c2,
      characterProfile?.outfitStyle || "dress"
    );
    body.position.y = -0.9;
    characterGroup.add(body);

    const { group: headGroup } = createCharacterHead(
      skinToneData.c1,
      skinToneData.c2,
      faceShape,
      effects
    );
    headGroup.position.y = 1.6;
    characterGroup.add(headGroup);

    if (showTargetZones && targetZones.length > 0) {
      targetZones.forEach((zone) => {
        const zoneGeom = new THREE.SphereGeometry(
          Math.max(zone.size[0], zone.size[1], zone.size[2]),
          32,
          32
        );
        const zoneMat = new THREE.MeshStandardMaterial({
          color: 0xff6b9d,
          transparent: true,
          opacity: 0.25,
          emissive: 0xff6b9d,
          emissiveIntensity: 0.3,
        });
        const zoneMesh = new THREE.Mesh(zoneGeom, zoneMat);
        zoneMesh.position.set(zone.position[0], zone.position[1] + 1.6, zone.position[2]);
        zoneMesh.scale.set(zone.size[0], zone.size[1], zone.size[2]);
        zoneMesh.name = zone.name;
        zoneMesh.userData.isTargetZone = true;
        characterGroup.add(zoneMesh);

        const ringGeom = new THREE.RingGeometry(
          Math.max(zone.size[0], zone.size[1], zone.size[2]) * 0.85,
          Math.max(zone.size[0], zone.size[1], zone.size[2]),
          32
        );
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xff6b9d,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.set(zone.position[0], zone.position[1] + 1.6, zone.position[2] + 0.01);
        ring.name = `${zone.name}-ring`;
        characterGroup.add(ring);
      });
    }

    if (isComplete) {
      const particleCount = 50;
      const particleGeom = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 1] = Math.random() * 4;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      }
      particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xffd700,
        size: 0.08,
        transparent: true,
        opacity: 0.9,
      });
      const particles = new THREE.Points(particleGeom, particleMat);
      particles.name = "sparkles";
      characterGroup.add(particles);
    }

    scene.add(characterGroup);
    characterGroupRef.current = characterGroup;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (characterGroupRef.current) {
        characterGroupRef.current.rotation.y = rotationRef.current.y;
        characterGroupRef.current.rotation.x = rotationRef.current.x;

        if (!isDraggingRef.current && interactive) {
          rotationRef.current.y += 0.002;
        }

        const sparkles = characterGroupRef.current.getObjectByName("sparkles") as THREE.Points;
        if (sparkles) {
          sparkles.rotation.y += 0.01;
          const positions = sparkles.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < positions.length / 3; i++) {
            positions[i * 3 + 1] += 0.005;
            if (positions[i * 3 + 1] > 4) {
              positions[i * 3 + 1] = 0;
            }
          }
          sparkles.geometry.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };
    animate();
  }, [
    effects,
    isComplete,
    characterProfile,
    skinToneData.c1,
    skinToneData.c2,
    outfitColors.c1,
    outfitColors.c2,
    faceShape,
    showTargetZones,
    targetZones,
    interactive,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    initScene();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
      if (rendererRef.current && container) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [initScene]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    setIsRotating(true);
    previousMouseRef.current = { x: e.clientX, y: e.clientY };
  }, [interactive]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!interactive) return;

      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMouseRef.current.x;
        const deltaY = e.clientY - previousMouseRef.current.y;
        rotationRef.current.y += deltaX * 0.01;
        rotationRef.current.x = Math.max(
          -Math.PI / 4,
          Math.min(Math.PI / 4, rotationRef.current.x + deltaY * 0.008)
        );
        previousMouseRef.current = { x: e.clientX, y: e.clientY };
      }

      if (showTargetZones && containerRef.current && cameraRef.current && characterGroupRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(
          characterGroupRef.current.children,
          true
        );

        const targetZone = intersects.find(
          (i) => (i.object as THREE.Mesh).userData.isTargetZone
        );

        if (targetZone) {
          onZoneHover?.(targetZone.object.name);
          ((targetZone.object as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.5;
        } else {
          onZoneHover?.(null);
          characterGroupRef.current.traverse((child) => {
            if ((child as THREE.Mesh).userData.isTargetZone) {
              ((child as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.25;
            }
          });
        }
      }
    },
    [interactive, showTargetZones, onZoneHover]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsRotating(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDraggingRef.current = false;
    setIsRotating(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!interactive || e.touches.length !== 1) return;
    isDraggingRef.current = true;
    setIsRotating(true);
    previousMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, [interactive]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!interactive || e.touches.length !== 1 || !isDraggingRef.current) return;
      const deltaX = e.touches[0].clientX - previousMouseRef.current.x;
      const deltaY = e.touches[0].clientY - previousMouseRef.current.y;
      rotationRef.current.y += deltaX * 0.01;
      rotationRef.current.x = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 4, rotationRef.current.x + deltaY * 0.008)
      );
      previousMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    [interactive]
  );

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    setIsRotating(false);
  }, []);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ minHeight: "400px" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
      {interactive && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-gray-500 pointer-events-none shadow-sm border border-pink-100">
          {isRotating ? "🔄 旋转中..." : "✨ 拖拽旋转查看"}
        </div>
      )}
    </div>
  );
}
