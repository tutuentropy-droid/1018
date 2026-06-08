import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { MakeupStep, ProductOption, CompletedEffect, CharacterProfile } from "@/types";
import { createCharacterHead, createCharacterBody } from "./Character3D";
import { createMakeupTool3D } from "./MakeupTools3D";
import { getSkinToneColors, getOutfitColors } from "@/data";

interface MakeupDrawingCanvas3DProps {
  step: MakeupStep;
  selectedProduct: ProductOption | null;
  effects: CompletedEffect;
  characterProfile?: CharacterProfile;
  onComplete: () => void;
  onCancel: () => void;
}

interface StrokePoint {
  position: THREE.Vector3;
  timestamp: number;
}

export default function MakeupDrawingCanvas3D({
  step,
  selectedProduct,
  effects,
  characterProfile,
  onComplete,
  onCancel,
}: MakeupDrawingCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const toolGroupRef = useRef<THREE.Group | null>(null);
  const strokePointsRef = useRef<StrokePoint[]>([]);
  const paintSpheresRef = useRef<THREE.Mesh[]>([]);
  const isDraggingRef = useRef(false);
  const isDrawingRef = useRef(false);
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0, y: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const toolPickedRef = useRef(false);
  const planeRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.5));

  const [coverage, setCoverage] = useState(0);
  const [toolPicked, setToolPicked] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const toolSize = step.drawingTool?.size ?? 20;
  const threshold = step.coverageThreshold ?? 70;

  const skinToneData = getSkinToneColors(characterProfile?.skinTone);
  const outfitColors = getOutfitColors(characterProfile?.outfitStyle);
  const faceShape = characterProfile?.faceShape;

  const productColor = (() => {
    if (!selectedProduct) return "#ffb6c1";
    return selectedProduct.color || selectedProduct.previewColor || "#ffb6c1";
  })();

  const targetZones3D = useMemo(
    () =>
      step.targetZones?.map((zone) => ({
        name: `zone-${zone.cx}-${zone.cy}`,
        position: [((zone.cx - 200) / 200) * 0.85, (230 - zone.cy) / 200, 0.5] as [number, number, number],
        size: [(zone.rx / 200) * 1.5, (zone.ry / 200) * 1.5, 0.2] as [number, number, number],
      })) || [],
    [step.targetZones]
  );

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
    camera.position.set(0, 1.5, 4.5);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.9);
    mainLight.position.set(3, 5, 4);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffd6e6, 0.5);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);

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

    targetZones3D.forEach((zone) => {
      const zoneGeom = new THREE.SphereGeometry(
        Math.max(zone.size[0], zone.size[1]),
        32,
        32
      );
      const zoneMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(productColor),
        transparent: true,
        opacity: 0.2,
        emissive: new THREE.Color(productColor),
        emissiveIntensity: 0.2,
      });
      const zoneMesh = new THREE.Mesh(zoneGeom, zoneMat);
      zoneMesh.position.set(zone.position[0], zone.position[1] + 1.6, zone.position[2]);
      zoneMesh.scale.set(zone.size[0], zone.size[1], zone.size[2]);
      zoneMesh.name = zone.name;
      zoneMesh.userData.isTargetZone = true;
      zoneMesh.userData.center = new THREE.Vector3(
        zone.position[0],
        zone.position[1] + 1.6,
        zone.position[2]
      );
      zoneMesh.userData.radius = Math.max(zone.size[0], zone.size[1]);
      characterGroup.add(zoneMesh);
    });

    scene.add(characterGroup);
    characterGroupRef.current = characterGroup;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      if (characterGroupRef.current) {
        characterGroupRef.current.rotation.y = rotationRef.current.y;
        characterGroupRef.current.rotation.x = rotationRef.current.x;

        if (!isDraggingRef.current && !isDrawingRef.current && !toolPickedRef.current) {
          rotationRef.current.y += 0.0015;
        }
      }

      if (toolGroupRef.current && characterGroupRef.current) {
        toolGroupRef.current.rotation.y = characterGroupRef.current.rotation.y;
        toolGroupRef.current.rotation.x = characterGroupRef.current.rotation.x;
      }

      renderer.render(scene, camera);
    };
    animate();
  }, [
    effects,
    characterProfile,
    skinToneData.c1,
    skinToneData.c2,
    outfitColors.c1,
    outfitColors.c2,
    faceShape,
    targetZones3D,
    productColor,
  ]);

  const createToolAtPosition = useCallback(
    (position: THREE.Vector3) => {
      if (!sceneRef.current || toolGroupRef.current) return;

      const toolGroup = createMakeupTool3D(step.toolKey || "brushMedium", productColor);
      toolGroup.scale.set(0.6, 0.6, 0.6);
      toolGroup.position.copy(position);
      toolGroup.rotation.z = Math.PI / 4;

      sceneRef.current.add(toolGroup);
      toolGroupRef.current = toolGroup;
    },
    [step.toolKey, productColor]
  );

  const addPaintStroke = useCallback(
    (worldPos: THREE.Vector3) => {
      if (!sceneRef.current || !characterGroupRef.current) return;

      const paintSize = (toolSize / 200) * 0.3;
      const paintGeom = new THREE.SphereGeometry(paintSize, 16, 16);
      const paintMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(productColor),
        transparent: true,
        opacity: 0.55,
        roughness: 0.5,
      });
      const paintSphere = new THREE.Mesh(paintGeom, paintMat);

      const localPos = characterGroupRef.current.worldToLocal(worldPos.clone());
      paintSphere.position.copy(localPos);
      paintSphere.scale.set(1, 1, 0.3);

      characterGroupRef.current.add(paintSphere);
      paintSpheresRef.current.push(paintSphere);
      strokePointsRef.current.push({
        position: worldPos.clone(),
        timestamp: Date.now(),
      });

      let coveredZones = 0;
      const totalZones = targetZones3D.length || 1;

      characterGroupRef.current.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.userData.isTargetZone && mesh.userData.center) {
          const center = mesh.userData.center as THREE.Vector3;
          const zoneRadius = (mesh.userData.radius || 0.3) * 0.8;

          let pointsInZone = 0;
          strokePointsRef.current.forEach((point) => {
            if (point.position.distanceTo(center) < zoneRadius) {
              pointsInZone++;
            }
          });

          const zoneCoverage = Math.min(100, (pointsInZone / 15) * 100);
          if (zoneCoverage >= 60) {
            coveredZones++;
            ((mesh as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.5;
            ((mesh as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5;
          }
        }
      });

      const newCoverage = Math.min(100, (coveredZones / totalZones) * 100);
      setCoverage(newCoverage);

      if (newCoverage >= threshold) {
        setTimeout(() => onComplete(), 600);
      }
    },
    [toolSize, productColor, targetZones3D, threshold, onComplete]
  );

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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !cameraRef.current) return;

      if (!toolPickedRef.current) {
        return;
      }

      previousMouseRef.current = { x: e.clientX, y: e.clientY };

      if (e.shiftKey || e.button === 2) {
        isDraggingRef.current = true;
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersectPoint = new THREE.Vector3();
        raycasterRef.current.ray.intersectPlane(planeRef.current, intersectPoint);

        if (intersectPoint) {
          isDrawingRef.current = true;
          setIsDrawing(true);
          addPaintStroke(intersectPoint);
        }
      }
    },
    [addPaintStroke]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !cameraRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersectPoint = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(planeRef.current, intersectPoint);

      if (toolPickedRef.current && toolGroupRef.current && intersectPoint) {
        toolGroupRef.current.position.copy(intersectPoint);
      }

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

      if (isDrawingRef.current && intersectPoint) {
        const lastPoint = strokePointsRef.current[strokePointsRef.current.length - 1];
        if (!lastPoint || lastPoint.position.distanceTo(intersectPoint) > 0.03) {
          addPaintStroke(intersectPoint);
        }
      }

      if (characterGroupRef.current && toolPickedRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(
          characterGroupRef.current.children,
          true
        );
        const targetZone = intersects.find(
          (i) => (i.object as THREE.Mesh).userData.isTargetZone
        );
        setHoveredZone(targetZone ? targetZone.object.name : null);
      }
    },
    [addPaintStroke]
  );

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    isDrawingRef.current = false;
    setIsDrawing(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    isDraggingRef.current = false;
    isDrawingRef.current = false;
    setIsDrawing(false);
  }, []);

  const handleToolPick = useCallback(() => {
    toolPickedRef.current = true;
    setToolPicked(true);
    createToolAtPosition(new THREE.Vector3(0, 1.6, 0.8));
  }, [createToolAtPosition]);

  const handleResetDrawing = useCallback(() => {
    if (!characterGroupRef.current) return;

    paintSpheresRef.current.forEach((sphere) => {
      characterGroupRef.current?.remove(sphere);
      sphere.geometry.dispose();
      (sphere.material as THREE.Material).dispose();
    });
    paintSpheresRef.current = [];
    strokePointsRef.current = [];
    setCoverage(0);

    characterGroupRef.current.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.userData.isTargetZone) {
        ((mesh as THREE.Mesh).material as THREE.MeshStandardMaterial).opacity = 0.2;
        ((mesh as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.2;
      }
    });
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!toolPickedRef.current || e.touches.length !== 1) return;
      previousMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      if (!containerRef.current || !cameraRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersectPoint = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(planeRef.current, intersectPoint);

      if (intersectPoint) {
        isDrawingRef.current = true;
        setIsDrawing(true);
        addPaintStroke(intersectPoint);
      }
    },
    [addPaintStroke]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!toolPickedRef.current || e.touches.length !== 1 || !isDrawingRef.current) return;
      if (!containerRef.current || !cameraRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.touches[0].clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersectPoint = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(planeRef.current, intersectPoint);

      if (toolGroupRef.current && intersectPoint) {
        toolGroupRef.current.position.copy(intersectPoint);
      }

      if (intersectPoint) {
        const lastPoint = strokePointsRef.current[strokePointsRef.current.length - 1];
        if (!lastPoint || lastPoint.position.distanceTo(intersectPoint) > 0.03) {
          addPaintStroke(intersectPoint);
        }
      }
    },
    [addPaintStroke]
  );

  const handleTouchEnd = useCallback(() => {
    isDrawingRef.current = false;
    setIsDrawing(false);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-2xl w-full animate-pop">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-300 via-lavender-200 to-peach-200 p-4 text-center relative overflow-hidden">
            <h2 className="text-xl font-bold text-white drop-shadow-md mb-1">✨ {step.name}</h2>
            <p className="text-white/90 text-sm">
              {step.drawingHint || "3D沉浸式化妆体验：拿起工具在高亮区域涂抹~"}
            </p>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">完成度</span>
                <span className="text-sm font-bold text-pink-500">
                  {coverage}% / {threshold}%
                </span>
              </div>
              <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    coverage >= threshold
                      ? "bg-gradient-to-r from-green-400 to-emerald-400"
                      : "bg-gradient-to-r from-pink-400 to-rose-400"
                  }`}
                  style={{ width: `${coverage}%` }}
                />
              </div>
            </div>

            <div
              className="relative select-none rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50 to-lavender-50"
              style={{ height: "450px", touchAction: "none" }}
            >
              {!toolPicked && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                  <div className="text-center">
                    <div
                      className="relative w-28 h-28 mx-auto mb-3 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center shadow-2xl cursor-pointer tool-hover-scale border-4 border-pink-200 hover:scale-110 transition-transform"
                      onClick={handleToolPick}
                    >
                      <div className="text-5xl animate-brush-swing">
                        {step.drawingTool?.icon || "🖌️"}
                      </div>
                      <div className="absolute -top-2 -right-2 text-2xl animate-sparkle">✨</div>
                    </div>
                    <p className="text-sm font-bold text-pink-600 mt-2">
                      点击拿起 {step.drawingTool?.name || "化妆工具"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      然后在面部高亮区域拖动涂抹~
                      <br />
                      <span className="text-pink-400">(按住 Shift 或右键可旋转视角)</span>
                    </p>
                  </div>
                </div>
              )}

              <div
                ref={containerRef}
                className="w-full h-full cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onContextMenu={(e) => e.preventDefault()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />

              {toolPicked && !isDrawing && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-pink-400/90 text-white text-sm rounded-full shadow-lg animate-bounce-slow pointer-events-none">
                  👆 在高亮区域拖动涂抹~ （Shift+拖拽旋转视角）
                </div>
              )}

              {hoveredZone && toolPicked && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-green-400/90 text-white text-xs rounded-full shadow-lg pointer-events-none animate-pulse">
                  🎯 对准目标区域！
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              {strokePointsRef.current.length > 0 && (
                <button
                  onClick={handleResetDrawing}
                  className="flex-1 py-3 rounded-2xl font-bold bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                >
                  🔄 重画
                </button>
              )}
              {coverage >= threshold && (
                <button
                  onClick={onComplete}
                  className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  完成 ✨
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
