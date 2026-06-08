import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import { ProductOption } from "@/types";
import { createProduct3D } from "./ProductModels3D";

interface Shelf3DProps {
  products: ProductOption[];
  onSelect: (product: ProductOption) => void;
  selectedId: string | null;
  productCategory?: string;
}

export default function Shelf3D({
  products,
  onSelect,
  selectedId,
  productCategory,
}: Shelf3DProps) {
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
    camera.position.set(0, 0.3, 5.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(3, 5, 4);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0xffc0cb, 0.6, 15);
    pointLight1.position.set(-3, 2, 2.5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xe0d0ff, 0.5, 15);
    pointLight2.position.set(3, -1, 2.5);
    scene.add(pointLight2);

    const topLight = new THREE.PointLight(0xffffff, 0.5, 15);
    topLight.position.set(0, 4, 0);
    scene.add(topLight);

    const productsGroup = new THREE.Group();
    const radius = 2.4;

    products.forEach((product, index) => {
      const angle = (index / products.length) * Math.PI * 2 - Math.PI / 2;
      const productGroup = new THREE.Group();

      const productModel = createProduct3D(product, productCategory);
      productModel.scale.set(0.75, 0.75, 0.75);
      productModel.position.y = 0.1;
      productGroup.add(productModel);

      const standGeom = new THREE.CylinderGeometry(0.55, 0.6, 0.08, 48);
      const standMat = new THREE.MeshStandardMaterial({
        color: 0xfce8f0,
        roughness: 0.5,
        metalness: 0.1,
      });
      const stand = new THREE.Mesh(standGeom, standMat);
      stand.position.y = -0.45;
      stand.receiveShadow = true;
      productGroup.add(stand);

      const pedestalGeom = new THREE.CylinderGeometry(0.45, 0.5, 0.04, 48);
      const pedestalMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
        metalness: 0.4,
      });
      const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
      pedestal.position.y = -0.38;
      productGroup.add(pedestal);

      const lightRingGeom = new THREE.TorusGeometry(0.42, 0.02, 12, 48);
      const lightRingMat = new THREE.MeshStandardMaterial({
        color: 0xff9ec5,
        emissive: 0xff9ec5,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.8,
      });
      const lightRing = new THREE.Mesh(lightRingGeom, lightRingMat);
      lightRing.position.y = -0.4;
      lightRing.rotation.x = Math.PI / 2;
      productGroup.add(lightRing);

      productGroup.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.15 - 0.1,
        Math.sin(angle) * radius
      );
      productGroup.lookAt(0, productGroup.position.y, 0);
      productGroup.rotation.y += Math.PI;
      productGroup.userData.productId = product.id;
      productGroup.userData.product = product;
      productGroup.userData.baseScale = 0.75;
      productGroup.userData.baseY = productGroup.position.y;
      productsGroup.add(productGroup);
    });

    scene.add(productsGroup);
    productsGroupRef.current = productsGroup;

    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.006;

      if (productsGroupRef.current) {
        productsGroupRef.current.rotation.y += 0.0035;

        productsGroupRef.current.children.forEach((child, idx) => {
          const product = child as THREE.Group;
          const productId = product.userData.productId;
          const isSelected = productId === selectedId;
          const isHovered = productId === hoveredId;

          const targetScale = isSelected ? 1.1 : isHovered ? 1.0 : 0.75;
          product.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);

          const floatY =
            product.userData.baseY + Math.sin(time * 2.5 + idx * 0.8) * 0.12;
          product.position.y = floatY;

          if (isSelected || isHovered) {
            const ring = product.children.find((c) => c.type === "Mesh" && (c as THREE.Mesh).geometry.type === "TorusGeometry");
            if (ring) {
              ((ring as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8 + Math.sin(time * 5) * 0.3;
            }
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();
  }, [products, selectedId, hoveredId, productCategory]);

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
      style={{ minHeight: "340px" }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
    />
  );
}
