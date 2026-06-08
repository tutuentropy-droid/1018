import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { ProductOption } from "@/types";

interface Shelf3DProps {
  products: ProductOption[];
  onSelect: (product: ProductOption) => void;
  selectedId: string | null;
}

export default function Shelf3D({ products, onSelect, selectedId }: Shelf3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);
  const productsGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const initScene = useCallback(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(3, 5, 4);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffc0cb, 0.5, 10);
    pointLight1.position.set(-3, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xe0d0ff, 0.5, 10);
    pointLight2.position.set(3, -1, 2);
    scene.add(pointLight2);

    const productsGroup = new THREE.Group();
    const radius = 2.2;

    products.forEach((product, index) => {
      const angle = (index / products.length) * Math.PI * 2 - Math.PI / 2;
      const productGroup = new THREE.Group();

      const color = product.color || product.previewColor || "#ffc0cb";
      const color2 = product.color2 || color;

      const bottleGeom = new THREE.CylinderGeometry(0.35, 0.4, 0.8, 32);
      const bottleMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.3,
        metalness: 0.2,
      });
      const bottle = new THREE.Mesh(bottleGeom, bottleMat);
      bottle.position.y = 0;
      productGroup.add(bottle);

      const capGeom = new THREE.CylinderGeometry(0.25, 0.28, 0.25, 32);
      const capMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.2,
        metalness: 0.9,
      });
      const cap = new THREE.Mesh(capGeom, capMat);
      cap.position.y = 0.55;
      productGroup.add(cap);

      const labelGeom = new THREE.PlaneGeometry(0.55, 0.35);
      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 256;
      labelCanvas.height = 160;
      const ctx = labelCanvas.getContext("2d")!;
      const gradient = ctx.createLinearGradient(0, 0, 256, 160);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 160);
      ctx.fillStyle = "white";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(product.name.slice(0, 8), 128, 90);

      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
      });
      const label = new THREE.Mesh(labelGeom, labelMat);
      label.position.z = 0.41;
      productGroup.add(label);

      const standGeom = new THREE.CylinderGeometry(0.5, 0.55, 0.1, 32);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0xf8e8f0,
        roughness: 0.5,
        metalness: 0.1,
      });
      const stand = new THREE.Mesh(standGeom, standMat);
      stand.position.y = -0.45;
      productGroup.add(stand);

      productGroup.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.2 - 0.1,
        Math.sin(angle) * radius
      );
      productGroup.lookAt(0, productGroup.position.y, 0);
      productGroup.userData.productId = product.id;
      productGroup.userData.product = product;
      productGroup.userData.baseScale = 1;
      productGroup.userData.baseY = productGroup.position.y;
      productsGroup.add(productGroup);
    });

    scene.add(productsGroup);
    productsGroupRef.current = productsGroup;

    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.005;

      if (productsGroupRef.current) {
        productsGroupRef.current.rotation.y += 0.003;

        productsGroupRef.current.children.forEach((child, idx) => {
          const product = child as THREE.Group;
          const productId = product.userData.productId;
          const isSelected = productId === selectedId;
          const isHovered = productId === hoveredId;

          const targetScale = isSelected ? 1.25 : isHovered ? 1.15 : 1;
          product.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

          const floatY = product.userData.baseY + Math.sin(time * 2 + idx) * 0.08;
          product.position.y = floatY;
        });
      }

      renderer.render(scene, camera);
    };
    animate();
  }, [products, selectedId, hoveredId]);

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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !productsGroupRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        productsGroupRef.current.children,
        true
      );

      if (intersects.length > 0) {
        let obj = intersects[0].object as THREE.Object3D;
        while (obj.parent && !obj.userData.productId) {
          obj = obj.parent;
        }
        if (obj.userData.product) {
          onSelect(obj.userData.product as ProductOption);
        }
      }
    },
    [onSelect]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !productsGroupRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(
        productsGroupRef.current.children,
        true
      );

      if (intersects.length > 0) {
        let obj = intersects[0].object as THREE.Object3D;
        while (obj.parent && !obj.userData.productId) {
          obj = obj.parent;
        }
        if (obj.userData.productId) {
          setHoveredId(obj.userData.productId as string);
          if (containerRef.current) {
            containerRef.current.style.cursor = "pointer";
          }
          return;
        }
      }
      setHoveredId(null);
      if (containerRef.current) {
        containerRef.current.style.cursor = "grab";
      }
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ minHeight: "320px" }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    />
  );
}
