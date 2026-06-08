import * as THREE from "three";

export function createFoundationBrush(color?: string): THREE.Group {
  const group = new THREE.Group();

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x8b6914,
    roughness: 0.5,
    metalness: 0.2,
  });
  const handleGeom = new THREE.CylinderGeometry(0.08, 0.1, 0.8, 16);
  const handle = new THREE.Mesh(handleGeom, handleMat);
  handle.position.y = -0.4;
  group.add(handle);

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.3,
    metalness: 0.7,
  });
  const metalGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
  const metal = new THREE.Mesh(metalGeom, metalMat);
  metal.position.y = 0.1;
  group.add(metal);

  const bristleColor = color ? new THREE.Color(color) : new THREE.Color(0x3d2416);
  const bristleMat = new THREE.MeshStandardMaterial({
    color: bristleColor,
    roughness: 0.9,
  });
  const bristleGeom = new THREE.ConeGeometry(0.25, 0.5, 32);
  const bristle = new THREE.Mesh(bristleGeom, bristleMat);
  bristle.position.y = 0.45;
  group.add(bristle);

  return group;
}

export function createBeautySponge(): THREE.Group {
  const group = new THREE.Group();

  const spongeMat = new THREE.MeshStandardMaterial({
    color: 0xffb8a0,
    roughness: 0.95,
  });

  const spongeGeom = new THREE.SphereGeometry(0.3, 32, 32);
  const sponge = new THREE.Mesh(spongeGeom, spongeMat);
  sponge.scale.set(1, 1.4, 1);
  group.add(sponge);

  const tipGeom = new THREE.SphereGeometry(0.12, 16, 16);
  const tip = new THREE.Mesh(tipGeom, spongeMat);
  tip.position.y = 0.25;
  tip.scale.set(0.7, 0.7, 0.7);
  group.add(tip);

  return group;
}

export function createBlushBrush(color?: string): THREE.Group {
  const group = new THREE.Group();

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    roughness: 0.5,
    metalness: 0.2,
  });
  const handleGeom = new THREE.CylinderGeometry(0.07, 0.09, 0.7, 16);
  const handle = new THREE.Mesh(handleGeom, handleMat);
  handle.position.y = -0.35;
  group.add(handle);

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.3,
    metalness: 0.7,
  });
  const metalGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.12, 16);
  const metal = new THREE.Mesh(metalGeom, metalMat);
  metal.position.y = 0.08;
  group.add(metal);

  const bristleColor = color ? new THREE.Color(color) : new THREE.Color(0xd2691e);
  const bristleMat = new THREE.MeshStandardMaterial({
    color: bristleColor,
    roughness: 0.9,
  });
  const bristleGeom = new THREE.SphereGeometry(0.28, 32, 32);
  const bristle = new THREE.Mesh(bristleGeom, bristleMat);
  bristle.position.y = 0.38;
  bristle.scale.set(1, 0.8, 1);
  group.add(bristle);

  return group;
}

export function createSmallBrush(color?: string): THREE.Group {
  const group = new THREE.Group();

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x2c1810,
    roughness: 0.5,
    metalness: 0.2,
  });
  const handleGeom = new THREE.CylinderGeometry(0.05, 0.06, 0.75, 16);
  const handle = new THREE.Mesh(handleGeom, handleMat);
  handle.position.y = -0.38;
  group.add(handle);

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.2,
    metalness: 0.8,
  });
  const metalGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.1, 16);
  const metal = new THREE.Mesh(metalGeom, metalMat);
  metal.position.y = 0.08;
  group.add(metal);

  const bristleColor = color ? new THREE.Color(color) : new THREE.Color(0x2d1810);
  const bristleMat = new THREE.MeshStandardMaterial({
    color: bristleColor,
    roughness: 0.9,
  });
  const bristleGeom = new THREE.ConeGeometry(0.1, 0.3, 32);
  const bristle = new THREE.Mesh(bristleGeom, bristleMat);
  bristle.position.y = 0.3;
  group.add(bristle);

  return group;
}

export function createBrowPencil(color?: string): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xd4a853,
    roughness: 0.6,
    metalness: 0.1,
  });
  const bodyGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.9, 16);
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = -0.05;
  group.add(body);

  const tipColor = color ? new THREE.Color(color) : new THREE.Color(0x4a3728);
  const tipMat = new THREE.MeshStandardMaterial({
    color: tipColor,
    roughness: 0.7,
  });
  const tipGeom = new THREE.ConeGeometry(0.06, 0.2, 16);
  const tip = new THREE.Mesh(tipGeom, tipMat);
  tip.position.y = 0.5;
  group.add(tip);

  const endMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.6,
  });
  const endGeom = new THREE.CylinderGeometry(0.055, 0.055, 0.1, 16);
  const end = new THREE.Mesh(endGeom, endMat);
  end.position.y = -0.55;
  group.add(end);

  return group;
}

export function createEyelinerPen(color?: string): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c,
    roughness: 0.4,
    metalness: 0.5,
  });
  const bodyGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.85, 16);
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = -0.02;
  group.add(body);

  const tipColor = color ? new THREE.Color(color) : new THREE.Color(0x0c0c0c);
  const tipMat = new THREE.MeshStandardMaterial({
    color: tipColor,
    roughness: 0.3,
  });
  const tipGeom = new THREE.ConeGeometry(0.03, 0.25, 16);
  const tip = new THREE.Mesh(tipGeom, tipMat);
  tip.position.y = 0.53;
  group.add(tip);

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.3,
    metalness: 0.8,
  });
  const silverGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
  const silver = new THREE.Mesh(silverGeom, silverMat);
  silver.position.y = 0.42;
  group.add(silver);

  return group;
}

export function createMascaraWand(): THREE.Group {
  const group = new THREE.Group();

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x2c1810,
    roughness: 0.5,
    metalness: 0.3,
  });
  const handleGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.7, 16);
  const handle = new THREE.Mesh(handleGeom, handleMat);
  handle.position.y = -0.35;
  group.add(handle);

  const wandMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.3,
    metalness: 0.8,
  });
  const wandGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8);
  const wand = new THREE.Mesh(wandGeom, wandMat);
  wand.position.y = 0.12;
  group.add(wand);

  const bristleMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c0c,
    roughness: 0.4,
  });

  for (let i = 0; i < 8; i++) {
    const bristleGeom = new THREE.SphereGeometry(0.04, 12, 12);
    const bristle = new THREE.Mesh(bristleGeom, bristleMat);
    bristle.position.y = 0.35 - i * 0.06;
    bristle.scale.set(1.2, 0.7, 1.2);
    group.add(bristle);
  }

  return group;
}

export function createLipstick(color?: string): THREE.Group {
  const group = new THREE.Group();

  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c,
    roughness: 0.3,
    metalness: 0.6,
  });
  const tubeGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
  const tube = new THREE.Mesh(tubeGeom, tubeMat);
  tube.position.y = -0.3;
  group.add(tube);

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.2,
    metalness: 0.9,
  });
  const goldGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16);
  const gold = new THREE.Mesh(goldGeom, goldMat);
  gold.position.y = 0.02;
  group.add(gold);

  const lipstickColor = color ? new THREE.Color(color) : new THREE.Color(0xff6b8a);
  const lipstickMat = new THREE.MeshStandardMaterial({
    color: lipstickColor,
    roughness: 0.4,
    metalness: 0.1,
  });
  const lipstickGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16);
  const lipstickBody = new THREE.Mesh(lipstickGeom, lipstickMat);
  lipstickBody.position.y = 0.28;
  group.add(lipstickBody);

  const lipstickTipGeom = new THREE.ConeGeometry(0.09, 0.15, 16);
  const lipstickTip = new THREE.Mesh(lipstickTipGeom, lipstickMat);
  lipstickTip.position.y = 0.52;
  group.add(lipstickTip);

  return group;
}

export function createSkincarePad(): THREE.Group {
  const group = new THREE.Group();

  const padMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    transparent: true,
    opacity: 0.95,
  });
  const padGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.06, 32);
  const pad = new THREE.Mesh(padGeom, padMat);
  pad.rotation.x = Math.PI / 2;
  group.add(pad);

  const liquidMat = new THREE.MeshStandardMaterial({
    color: 0xb8e6ff,
    roughness: 0.6,
    transparent: true,
    opacity: 0.5,
  });
  const liquidGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.02, 32);
  const liquid = new THREE.Mesh(liquidGeom, liquidMat);
  liquid.rotation.x = Math.PI / 2;
  liquid.position.z = 0.02;
  group.add(liquid);

  return group;
}

export function createConcealerBrush(color?: string): THREE.Group {
  const group = new THREE.Group();

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c,
    roughness: 0.5,
    metalness: 0.2,
  });
  const handleGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.8, 16);
  const handle = new THREE.Mesh(handleGeom, handleMat);
  handle.position.y = -0.4;
  group.add(handle);

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.8,
  });
  const metalGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
  const metal = new THREE.Mesh(metalGeom, metalMat);
  metal.position.y = 0.08;
  group.add(metal);

  const bristleColor = color ? new THREE.Color(color) : new THREE.Color(0x2d1810);
  const bristleMat = new THREE.MeshStandardMaterial({
    color: bristleColor,
    roughness: 0.9,
  });
  const bristleGeom = new THREE.ConeGeometry(0.05, 0.15, 16);
  const bristle = new THREE.Mesh(bristleGeom, bristleMat);
  bristle.position.y = 0.2;
  group.add(bristle);

  return group;
}

export const createMakeupTool3D = (toolKey: string, productColor?: string): THREE.Group => {
  switch (toolKey) {
    case "sponge":
      return createBeautySponge();
    case "brushLarge":
      return createFoundationBrush(productColor);
    case "brushMedium":
      return createFoundationBrush(productColor);
    case "brushSmall":
      return createSmallBrush(productColor);
    case "brushBlush":
      return createBlushBrush(productColor);
    case "concealerBrush":
      return createConcealerBrush(productColor);
    case "pencil":
      return createBrowPencil(productColor);
    case "eyelinerPen":
      return createEyelinerPen(productColor);
    case "mascaraWand":
      return createMascaraWand();
    case "lipstick":
      return createLipstick(productColor);
    case "skincarePad":
      return createSkincarePad();
    default:
      return createFoundationBrush(productColor);
  }
};
