import * as THREE from "three";
import { ProductOption } from "@/types";

function getProductColor(product: ProductOption): string {
  return product.color || product.previewColor || "#ffc0cb";
}

function getProductColor2(product: ProductOption): string {
  return product.color2 || getProductColor(product);
}

function createLabelTexture(text: string, color1: string, color2: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 256, 128);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(0, 0, 256, 32);

  ctx.fillStyle = "white";
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const displayText = text.length > 6 ? text.slice(0, 6) : text;
  ctx.fillText(displayText, 128, 70);

  ctx.font = "bold 18px sans-serif";
  ctx.globalAlpha = 0.9;
  ctx.fillText("BEAUTY", 128, 28);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function createLipstickProduct(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);
  const color2 = getProductColor2(product);

  const tubeGeom = new THREE.CylinderGeometry(0.32, 0.36, 1.1, 32);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c,
    roughness: 0.35,
    metalness: 0.6,
  });
  const tube = new THREE.Mesh(tubeGeom, tubeMat);
  tube.position.y = -0.2;
  group.add(tube);

  const labelGeom = new THREE.CylinderGeometry(0.34, 0.34, 0.45, 32);
  const labelTexture = createLabelTexture(product.name, color, color2);
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.5,
    metalness: 0.1,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.y = -0.1;
  group.add(label);

  const goldGeom = new THREE.CylinderGeometry(0.4, 0.38, 0.12, 32);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.2,
    metalness: 0.95,
  });
  const gold = new THREE.Mesh(goldGeom, goldMat);
  gold.position.y = 0.38;
  group.add(gold);

  const lipstickGeom = new THREE.CylinderGeometry(0.25, 0.28, 0.5, 32);
  const lipstickMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.35,
    metalness: 0.2,
  });
  const lipstick = new THREE.Mesh(lipstickGeom, lipstickMat);
  lipstick.position.y = 0.7;
  group.add(lipstick);

  const tipGeom = new THREE.ConeGeometry(0.3, 0.35, 32);
  const tip = new THREE.Mesh(tipGeom, lipstickMat);
  tip.position.y = 1.05;
  group.add(tip);

  return group;
}

export function createFoundationBottle(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);
  const color2 = getProductColor2(product);

  const baseGeom = new THREE.BoxGeometry(0.75, 0.1, 0.45);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xf5e6d3,
    roughness: 0.4,
    metalness: 0.5,
  });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = -0.55;
  group.add(base);

  const bottleGeom = new THREE.BoxGeometry(0.65, 0.85, 0.35);
  const bottleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.55,
    metalness: 0.05,
    transparent: true,
    opacity: 0.85,
  });
  const bottle = new THREE.Mesh(bottleGeom, bottleMat);
  bottle.position.y = -0.05;
  group.add(bottle);

  const labelGeom = new THREE.PlaneGeometry(0.55, 0.5);
  const labelTexture = createLabelTexture(product.name, color, color2);
  const labelMat = new THREE.MeshBasicMaterial({
    map: labelTexture,
    transparent: true,
  });
  const label1 = new THREE.Mesh(labelGeom, labelMat);
  label1.position.set(0, 0, 0.185);
  group.add(label1);
  const label2 = new THREE.Mesh(labelGeom, labelMat);
  label2.position.set(0, 0, -0.185);
  label2.rotation.y = Math.PI;
  group.add(label2);

  const neckGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.15, 24);
  const neck = new THREE.Mesh(neckGeom, baseMat);
  neck.position.y = 0.45;
  group.add(neck);

  const capGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 24);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.4,
    metalness: 0.6,
  });
  const cap = new THREE.Mesh(capGeom, capMat);
  cap.position.y = 0.65;
  group.add(cap);

  const pumpGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16);
  const pumpMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.3,
    metalness: 0.8,
  });
  const pump = new THREE.Mesh(pumpGeom, pumpMat);
  pump.position.y = 0.85;
  group.add(pump);

  return group;
}

export function createEyeshadowPalette(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);
  const color2 = getProductColor2(product);

  const caseGeom = new THREE.BoxGeometry(0.9, 0.1, 0.7);
  const caseMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.5,
    metalness: 0.4,
  });
  const bottomCase = new THREE.Mesh(caseGeom, caseMat);
  bottomCase.position.y = -0.35;
  group.add(bottomCase);

  const paletteGeom = new THREE.BoxGeometry(0.82, 0.06, 0.62);
  const paletteMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0eb,
    roughness: 0.7,
  });
  const palette = new THREE.Mesh(paletteGeom, paletteMat);
  palette.position.y = -0.27;
  group.add(palette);

  const shadowColors = [
    new THREE.Color(color),
    new THREE.Color(color2),
    new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.3),
    new THREE.Color(color2).lerp(new THREE.Color("#000000"), 0.25),
    new THREE.Color(color).lerp(new THREE.Color("#ffd700"), 0.2),
    new THREE.Color(color2).lerp(new THREE.Color("#ffffff"), 0.5),
  ];

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const idx = row * 3 + col;
      const panGeom = new THREE.CylinderGeometry(0.09, 0.1, 0.04, 32);
      const panMat = new THREE.MeshStandardMaterial({
        color: shadowColors[idx],
        roughness: 0.6,
        metalness: 0.05,
      });
      const pan = new THREE.Mesh(panGeom, panMat);
      pan.position.set(-0.22 + col * 0.22, -0.21, -0.15 + row * 0.3);
      group.add(pan);
    }
  }

  const lidGeom = new THREE.BoxGeometry(0.9, 0.08, 0.7);
  const lid = new THREE.Mesh(lidGeom, caseMat);
  lid.position.set(0, -0.05, -0.35);
  lid.rotation.x = -Math.PI / 2.5;
  group.add(lid);

  const mirrorGeom = new THREE.PlaneGeometry(0.8, 0.6);
  const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    roughness: 0.05,
    metalness: 0.95,
  });
  const mirror = new THREE.Mesh(mirrorGeom, mirrorMat);
  mirror.position.set(0, -0.01, -0.38);
  mirror.rotation.x = -Math.PI / 2.5;
  group.add(mirror);

  const labelGeom = new THREE.PlaneGeometry(0.5, 0.15);
  const labelTexture = createLabelTexture(product.name, color, color2);
  const labelMat = new THREE.MeshBasicMaterial({
    map: labelTexture,
    transparent: true,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.set(0, -0.4, 0.36);
  group.add(label);

  return group;
}

export function createBlushCompact(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);
  const color2 = getProductColor2(product);

  const caseGeom = new THREE.CylinderGeometry(0.45, 0.47, 0.12, 48);
  const caseMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c,
    roughness: 0.35,
    metalness: 0.6,
  });
  const bottomCase = new THREE.Mesh(caseGeom, caseMat);
  bottomCase.position.y = -0.15;
  group.add(bottomCase);

  const blushGeom = new THREE.CylinderGeometry(0.38, 0.4, 0.05, 48);
  const blushMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.7,
    metalness: 0.0,
  });
  const blush = new THREE.Mesh(blushGeom, blushMat);
  blush.position.y = -0.06;
  group.add(blush);

  const swirlGeom = new THREE.TorusGeometry(0.2, 0.04, 12, 48);
  const swirlMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color2),
    roughness: 0.7,
  });
  const swirl = new THREE.Mesh(swirlGeom, swirlMat);
  swirl.position.y = -0.03;
  swirl.rotation.x = Math.PI / 2;
  group.add(swirl);

  const lidGeom = new THREE.CylinderGeometry(0.47, 0.45, 0.1, 48);
  const lid = new THREE.Mesh(lidGeom, caseMat);
  lid.position.set(0, 0.2, -0.3);
  lid.rotation.x = -Math.PI / 3;
  group.add(lid);

  const lidTopGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.02, 48);
  const lidTexture = createLabelTexture(product.name, color, color2);
  const lidTopMat = new THREE.MeshStandardMaterial({
    map: lidTexture,
    roughness: 0.4,
  });
  const lidTop = new THREE.Mesh(lidTopGeom, lidTopMat);
  lidTop.position.set(0, 0.24, -0.28);
  lidTop.rotation.x = -Math.PI / 3;
  group.add(lidTop);

  return group;
}

export function createBrowPencilProduct(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);

  const bodyGeom = new THREE.CylinderGeometry(0.08, 0.09, 1.4, 24);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).lerp(new THREE.Color("#000000"), 0.3),
    roughness: 0.55,
    metalness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = 0.1;
  group.add(body);

  const labelGeom = new THREE.CylinderGeometry(0.085, 0.085, 0.5, 24);
  const labelTexture = createLabelTexture(product.name, color, color);
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.5,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.y = 0.2;
  group.add(label);

  const tipGeom = new THREE.ConeGeometry(0.09, 0.25, 24);
  const tipMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.7,
  });
  const tip = new THREE.Mesh(tipGeom, tipMat);
  tip.position.y = 0.95;
  group.add(tip);

  const sharpGeom = new THREE.ConeGeometry(0.025, 0.08, 16);
  const sharp = new THREE.Mesh(sharpGeom, tipMat);
  sharp.position.y = 1.1;
  group.add(sharp);

  const capGeom = new THREE.CylinderGeometry(0.1, 0.09, 0.4, 24);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.5,
    metalness: 0.3,
  });
  const cap = new THREE.Mesh(capGeom, capMat);
  cap.position.y = -0.8;
  group.add(cap);

  const brushHandleGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.45, 16);
  const brushHandle = new THREE.Mesh(brushHandleGeom, capMat);
  brushHandle.position.y = -1.25;
  group.add(brushHandle);

  const bristleGeom = new THREE.ConeGeometry(0.06, 0.2, 24);
  const bristleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).lerp(new THREE.Color("#000000"), 0.5),
    roughness: 0.9,
  });
  const bristle = new THREE.Mesh(bristleGeom, bristleMat);
  bristle.position.y = -1.55;
  bristle.rotation.x = Math.PI;
  group.add(bristle);

  return group;
}

export function createSkincareBottle(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);

  const bottleGeom = new THREE.CylinderGeometry(0.35, 0.4, 1.0, 32);
  const bottleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.3,
    metalness: 0.05,
    transparent: true,
    opacity: 0.75,
  });
  const bottle = new THREE.Mesh(bottleGeom, bottleMat);
  bottle.position.y = -0.05;
  group.add(bottle);

  const liquidGeom = new THREE.CylinderGeometry(0.3, 0.33, 0.8, 32);
  const liquidMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.3),
    roughness: 0.2,
    transparent: true,
    opacity: 0.55,
  });
  const liquid = new THREE.Mesh(liquidGeom, liquidMat);
  liquid.position.y = -0.1;
  group.add(liquid);

  const labelGeom = new THREE.CylinderGeometry(0.37, 0.37, 0.45, 32);
  const labelTexture = createLabelTexture(product.name, color, color);
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.5,
    transparent: true,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.y = -0.05;
  group.add(label);

  const neckGeom = new THREE.CylinderGeometry(0.2, 0.22, 0.15, 24);
  const neckMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    roughness: 0.4,
    metalness: 0.5,
  });
  const neck = new THREE.Mesh(neckGeom, neckMat);
  neck.position.y = 0.5;
  group.add(neck);

  const capGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.35, 24);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0xf5e6d3,
    roughness: 0.3,
    metalness: 0.6,
  });
  const cap = new THREE.Mesh(capGeom, capMat);
  cap.position.y = 0.75;
  group.add(cap);

  const dropletGeom = new THREE.SphereGeometry(0.1, 16, 16);
  const dropletMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.5),
    roughness: 0.1,
    transparent: true,
    opacity: 0.6,
  });
  const droplet = new THREE.Mesh(dropletGeom, dropletMat);
  droplet.position.set(0.35, 0.4, 0.25);
  droplet.scale.set(0.6, 1, 0.6);
  group.add(droplet);

  return group;
}

export function createMascaraTube(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);

  const tubeGeom = new THREE.CylinderGeometry(0.18, 0.2, 1.0, 24);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c1c,
    roughness: 0.35,
    metalness: 0.6,
  });
  const tube = new THREE.Mesh(tubeGeom, tubeMat);
  tube.position.y = -0.2;
  group.add(tube);

  const labelGeom = new THREE.CylinderGeometry(0.19, 0.19, 0.5, 24);
  const labelTexture = createLabelTexture(product.name, color, color);
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.4,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.y = -0.15;
  group.add(label);

  const capGeom = new THREE.CylinderGeometry(0.22, 0.2, 0.3, 24);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.4,
    metalness: 0.5,
  });
  const cap = new THREE.Mesh(capGeom, capMat);
  cap.position.y = 0.55;
  group.add(cap);

  const wandGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
  const wandMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.3,
    metalness: 0.8,
  });
  const wand = new THREE.Mesh(wandGeom, wandMat);
  wand.position.set(0.35, 0.6, 0);
  wand.rotation.z = Math.PI / 6;
  group.add(wand);

  const bristleMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.4,
  });
  for (let i = 0; i < 8; i++) {
    const bristleGeom = new THREE.SphereGeometry(0.05, 12, 12);
    const bristle = new THREE.Mesh(bristleGeom, bristleMat);
    bristle.position.set(
      0.55 + Math.cos(i * 0.2) * 0.03,
      0.7 + i * 0.05,
      Math.sin(i * 0.2) * 0.03
    );
    bristle.scale.set(1.3, 0.8, 1.3);
    group.add(bristle);
  }

  return group;
}

export function createEyelinerPen(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);

  const bodyGeom = new THREE.CylinderGeometry(0.07, 0.08, 1.1, 20);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.4,
    metalness: 0.4,
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = 0.1;
  group.add(body);

  const labelGeom = new THREE.CylinderGeometry(0.075, 0.075, 0.4, 20);
  const labelTexture = createLabelTexture(product.name, color, color);
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.4,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.y = 0.2;
  group.add(label);

  const silverGeom = new THREE.CylinderGeometry(0.09, 0.08, 0.12, 20);
  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.25,
    metalness: 0.85,
  });
  const silver = new THREE.Mesh(silverGeom, silverMat);
  silver.position.y = 0.7;
  group.add(silver);

  const tipGeom = new THREE.ConeGeometry(0.04, 0.35, 16);
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a0a,
    roughness: 0.5,
    metalness: 0.2,
  });
  const tip = new THREE.Mesh(tipGeom, tipMat);
  tip.position.y = 0.95;
  group.add(tip);

  const sharpTipGeom = new THREE.ConeGeometry(0.008, 0.1, 8);
  const sharpTip = new THREE.Mesh(sharpTipGeom, tipMat);
  sharpTip.position.y = 1.15;
  group.add(sharpTip);

  const capGeom = new THREE.CylinderGeometry(0.09, 0.08, 0.4, 20);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.4,
    metalness: 0.4,
  });
  const cap = new THREE.Mesh(capGeom, capMat);
  cap.position.y = -0.6;
  group.add(cap);

  return group;
}

export function createPowderCompact(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);

  const caseGeom = new THREE.CylinderGeometry(0.5, 0.52, 0.15, 48);
  const caseMat = new THREE.MeshStandardMaterial({
    color: 0xf5e6d3,
    roughness: 0.35,
    metalness: 0.5,
  });
  const bottomCase = new THREE.Mesh(caseGeom, caseMat);
  bottomCase.position.y = -0.2;
  group.add(bottomCase);

  const powderGeom = new THREE.CylinderGeometry(0.42, 0.44, 0.06, 48);
  const powderMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.9,
  });
  const powder = new THREE.Mesh(powderGeom, powderMat);
  powder.position.y = -0.08;
  group.add(powder);

  const puffGeom = new THREE.SphereGeometry(0.2, 24, 24);
  const puffMat = new THREE.MeshStandardMaterial({
    color: 0xff69b4,
    roughness: 0.9,
  });
  const puff = new THREE.Mesh(puffGeom, puffMat);
  puff.position.set(0.25, -0.05, 0.2);
  puff.scale.set(1, 0.5, 1);
  group.add(puff);

  const ribbonGeom = new THREE.TorusGeometry(0.06, 0.015, 8, 16);
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xff1493,
    roughness: 0.4,
  });
  const ribbon = new THREE.Mesh(ribbonGeom, ribbonMat);
  ribbon.position.set(0.25, 0, 0.2);
  ribbon.rotation.x = Math.PI / 2;
  group.add(ribbon);

  const lidGeom = new THREE.CylinderGeometry(0.52, 0.5, 0.12, 48);
  const lid = new THREE.Mesh(lidGeom, caseMat);
  lid.position.set(0, 0.2, -0.3);
  lid.rotation.x = -Math.PI / 3;
  group.add(lid);

  const lidLabelGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.02, 48);
  const lidLabelTexture = createLabelTexture(product.name, color, color);
  const lidLabelMat = new THREE.MeshStandardMaterial({
    map: lidLabelTexture,
    roughness: 0.4,
  });
  const lidLabel = new THREE.Mesh(lidLabelGeom, lidLabelMat);
  lidLabel.position.set(0, 0.25, -0.28);
  lidLabel.rotation.x = -Math.PI / 3;
  group.add(lidLabel);

  return group;
}

export function createConcealerTube(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);

  const tubeGeom = new THREE.CylinderGeometry(0.18, 0.2, 0.9, 24);
  const tubeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  const tube = new THREE.Mesh(tubeGeom, tubeMat);
  tube.position.y = 0;
  group.add(tube);

  const labelGeom = new THREE.CylinderGeometry(0.19, 0.19, 0.45, 24);
  const labelTexture = createLabelTexture(product.name, color, color);
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.4,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.y = 0;
  group.add(label);

  const neckGeom = new THREE.CylinderGeometry(0.1, 0.14, 0.12, 20);
  const neckMat = new THREE.MeshStandardMaterial({
    color: 0xf5e6d3,
    roughness: 0.3,
    metalness: 0.6,
  });
  const neck = new THREE.Mesh(neckGeom, neckMat);
  neck.position.y = 0.52;
  group.add(neck);

  const tipGeom = new THREE.ConeGeometry(0.06, 0.2, 20);
  const tipMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.5,
  });
  const tip = new THREE.Mesh(tipGeom, tipMat);
  tip.position.y = 0.7;
  group.add(tip);

  const capGeom = new THREE.CylinderGeometry(0.12, 0.1, 0.35, 20);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c2c,
    roughness: 0.4,
    metalness: 0.5,
  });
  const cap = new THREE.Mesh(capGeom, capMat);
  cap.position.set(0.35, 0.55, 0.15);
  cap.rotation.z = -Math.PI / 4;
  group.add(cap);

  return group;
}

export function createPrimerBottle(product: ProductOption): THREE.Group {
  const group = new THREE.Group();
  const color = getProductColor(product);
  const color2 = getProductColor2(product);

  const bottleGeom = new THREE.CylinderGeometry(0.32, 0.35, 0.95, 32);
  const bottleMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.3,
    metalness: 0.05,
    transparent: true,
    opacity: 0.7,
  });
  const bottle = new THREE.Mesh(bottleGeom, bottleMat);
  bottle.position.y = -0.05;
  group.add(bottle);

  const labelGeom = new THREE.CylinderGeometry(0.34, 0.34, 0.5, 32);
  const labelTexture = createLabelTexture(product.name, color, color2);
  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTexture,
    roughness: 0.4,
    transparent: true,
  });
  const label = new THREE.Mesh(labelGeom, labelMat);
  label.position.y = -0.05;
  group.add(label);

  const pumpBaseGeom = new THREE.CylinderGeometry(0.22, 0.24, 0.12, 24);
  const pumpBaseMat = new THREE.MeshStandardMaterial({
    color: 0xf0f0f0,
    roughness: 0.35,
    metalness: 0.5,
  });
  const pumpBase = new THREE.Mesh(pumpBaseGeom, pumpBaseMat);
  pumpBase.position.y = 0.48;
  group.add(pumpBase);

  const pumpHeadGeom = new THREE.BoxGeometry(0.35, 0.15, 0.2);
  const pumpHead = new THREE.Mesh(pumpHeadGeom, pumpBaseMat);
  pumpHead.position.y = 0.62;
  group.add(pumpHead);

  const nozzleGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 12);
  const nozzleMat = new THREE.MeshStandardMaterial({
    color: 0xc0c0c0,
    roughness: 0.3,
    metalness: 0.8,
  });
  const nozzle = new THREE.Mesh(nozzleGeom, nozzleMat);
  nozzle.position.set(0, 0.72, 0.1);
  nozzle.rotation.x = Math.PI / 2;
  group.add(nozzle);

  return group;
}

export function createProduct3D(
  product: ProductOption,
  productCategory?: string
): THREE.Group {
  const category = productCategory || product.id.split("-")[0];

  switch (category) {
    case "lipstick":
      return createLipstickProduct(product);
    case "foundation":
      return createFoundationBottle(product);
    case "eyeshadow":
      return createEyeshadowPalette(product);
    case "blush":
      return createBlushCompact(product);
    case "brows":
      return createBrowPencilProduct(product);
    case "skincare":
      return createSkincareBottle(product);
    case "mascara":
      return createMascaraTube(product);
    case "eyeliner":
      return createEyelinerPen(product);
    case "powder":
      return createPowderCompact(product);
    case "concealer":
      return createConcealerTube(product);
    case "primer":
      return createPrimerBottle(product);
    default:
      return createFoundationBottle(product);
  }
}
