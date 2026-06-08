import * as THREE from "three";
import { CompletedEffect, ProductOption } from "@/types";

function getProductFromEffect(effect: ProductOption | boolean | undefined): ProductOption | null {
  if (!effect || typeof effect === "boolean") return null;
  return effect;
}

function getColorFromEffect(effect: ProductOption | boolean | undefined, useColor2 = false): string | null {
  const product = getProductFromEffect(effect);
  if (!product) return null;
  if (useColor2 && product.color2) return product.color2;
  return product.color || product.previewColor || null;
}

export function createCharacterBody(
  skinColor1: string,
  skinColor2: string,
  outfitColor1: string,
  outfitColor2: string,
  outfit: string
): THREE.Group {
  const characterGroup = new THREE.Group();

  const skinMat1 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor1),
    roughness: 0.7,
    metalness: 0.05,
  });

  const skinMat2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor2),
    roughness: 0.7,
    metalness: 0.05,
  });

  const outfitMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(outfitColor1),
    roughness: 0.55,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  const outfitMat2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(outfitColor2),
    roughness: 0.55,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  const neckGeom = new THREE.CylinderGeometry(0.32, 0.38, 0.6, 24);
  const neck = new THREE.Mesh(neckGeom, skinMat2);
  neck.position.set(0, 1.85, 0);
  characterGroup.add(neck);

  if (outfit === "dress") {
    const bustGeom = new THREE.SphereGeometry(0.95, 32, 32);
    const bust = new THREE.Mesh(bustGeom, outfitMat);
    bust.position.set(0, 1.25, 0.1);
    bust.scale.set(1, 0.65, 0.7);
    characterGroup.add(bust);

    const waistGeom = new THREE.CylinderGeometry(0.55, 0.65, 0.35, 32);
    const waist = new THREE.Mesh(waistGeom, outfitMat);
    waist.position.set(0, 0.75, 0);
    characterGroup.add(waist);

    const skirtPoints: THREE.Vector2[] = [];
    skirtPoints.push(new THREE.Vector2(0.65, 0.55));
    skirtPoints.push(new THREE.Vector2(0.85, 0.15));
    skirtPoints.push(new THREE.Vector2(1.5, -0.2));
    skirtPoints.push(new THREE.Vector2(1.75, -0.6));
    skirtPoints.push(new THREE.Vector2(1.85, -1.0));
    skirtPoints.push(new THREE.Vector2(1.8, -1.5));
    skirtPoints.push(new THREE.Vector2(0.05, -1.5));
    const skirtGeom = new THREE.LatheGeometry(skirtPoints, 48);
    const skirt = new THREE.Mesh(skirtGeom, outfitMat2);
    skirt.position.set(0, 0.75, 0);
    characterGroup.add(skirt);

    const beltGeom = new THREE.TorusGeometry(0.62, 0.05, 12, 48);
    const beltMat = new THREE.MeshStandardMaterial({
      color: 0xf5e6d3,
      roughness: 0.3,
      metalness: 0.6,
    });
    const belt = new THREE.Mesh(beltGeom, beltMat);
    belt.position.set(0, 0.85, 0);
    belt.rotation.x = Math.PI / 2;
    characterGroup.add(belt);

    const bowGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const bowMat = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      roughness: 0.4,
    });
    const bow1 = new THREE.Mesh(bowGeom, bowMat);
    bow1.position.set(0.7, 0.85, 0.2);
    bow1.scale.set(1.5, 0.6, 0.2);
    characterGroup.add(bow1);
    const bow2 = new THREE.Mesh(bowGeom, bowMat);
    bow2.position.set(0.55, 0.85, 0.2);
    bow2.scale.set(1.5, 0.6, 0.2);
    bow2.rotation.z = 0.3;
    characterGroup.add(bow2);
  } else if (outfit === "suit") {
    const jacketGeom = new THREE.CylinderGeometry(0.85, 0.75, 1.4, 32);
    const jacket = new THREE.Mesh(jacketGeom, outfitMat);
    jacket.position.set(0, 0.85, 0);
    characterGroup.add(jacket);

    const lapelShape = new THREE.Shape();
    lapelShape.moveTo(0, 0);
    lapelShape.lineTo(0.45, 0);
    lapelShape.lineTo(0.25, -0.7);
    lapelShape.lineTo(0.08, -0.7);
    lapelShape.lineTo(0, -0.3);
    lapelShape.lineTo(0, 0);
    const lapelGeom = new THREE.ExtrudeGeometry(lapelShape, {
      depth: 0.04,
      bevelEnabled: false,
    });
    const leftLapel = new THREE.Mesh(lapelGeom, outfitMat2);
    leftLapel.position.set(0.02, 1.4, 0.45);
    characterGroup.add(leftLapel);
    const rightLapel = new THREE.Mesh(lapelGeom, outfitMat2);
    rightLapel.position.set(-0.02, 1.4, 0.45);
    rightLapel.scale.x = -1;
    characterGroup.add(rightLapel);

    const shirtGeom = new THREE.BoxGeometry(0.5, 1.0, 0.06);
    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });
    const shirt = new THREE.Mesh(shirtGeom, shirtMat);
    shirt.position.set(0, 1.0, 0.44);
    characterGroup.add(shirt);

    const tiePoints: THREE.Vector2[] = [];
    tiePoints.push(new THREE.Vector2(0, 0.45));
    tiePoints.push(new THREE.Vector2(0.08, 0.35));
    tiePoints.push(new THREE.Vector2(0.06, 0));
    tiePoints.push(new THREE.Vector2(0.12, -0.6));
    tiePoints.push(new THREE.Vector2(0, -0.75));
    tiePoints.push(new THREE.Vector2(-0.12, -0.6));
    tiePoints.push(new THREE.Vector2(-0.06, 0));
    tiePoints.push(new THREE.Vector2(-0.08, 0.35));
    const tieShape = new THREE.Shape(tiePoints);
    const tieGeom = new THREE.ExtrudeGeometry(tieShape, {
      depth: 0.03,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
    });
    const tieMat = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      roughness: 0.4,
      metalness: 0.1,
    });
    const tie = new THREE.Mesh(tieGeom, tieMat);
    tie.position.set(0, 0.95, 0.48);
    characterGroup.add(tie);

    const buttonGeom = new THREE.SphereGeometry(0.05, 16, 16);
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0xf5e6d3,
      roughness: 0.3,
      metalness: 0.7,
    });
    for (let i = 0; i < 3; i++) {
      const btn = new THREE.Mesh(buttonGeom, buttonMat);
      btn.position.set(0, 1.3 - i * 0.35, 0.46);
      btn.scale.set(1, 0.5, 0.5);
      characterGroup.add(btn);
    }

    const pocketGeom = new THREE.BoxGeometry(0.2, 0.15, 0.02);
    const leftPocket = new THREE.Mesh(pocketGeom, outfitMat2);
    leftPocket.position.set(0.5, 1.0, 0.44);
    characterGroup.add(leftPocket);
    const rightPocket = new THREE.Mesh(pocketGeom, outfitMat2);
    rightPocket.position.set(-0.5, 1.0, 0.44);
    characterGroup.add(rightPocket);

    const pantsGeom = new THREE.CylinderGeometry(0.55, 0.5, 1.5, 32);
    const pants = new THREE.Mesh(pantsGeom, outfitMat2);
    pants.position.set(0, -0.4, 0);
    characterGroup.add(pants);

    const leftPantsGeom = new THREE.CylinderGeometry(0.22, 0.2, 1.4, 16);
    const leftPants = new THREE.Mesh(leftPantsGeom, outfitMat2);
    leftPants.position.set(-0.25, -0.9, 0);
    characterGroup.add(leftPants);
    const rightPants = new THREE.Mesh(leftPantsGeom, outfitMat2);
    rightPants.position.set(0.25, -0.9, 0);
    characterGroup.add(rightPants);

    const shoeGeom = new THREE.BoxGeometry(0.28, 0.15, 0.55);
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x2c1810,
      roughness: 0.4,
      metalness: 0.2,
    });
    const leftShoe = new THREE.Mesh(shoeGeom, shoeMat);
    leftShoe.position.set(-0.25, -1.7, 0.1);
    characterGroup.add(leftShoe);
    const rightShoe = new THREE.Mesh(shoeGeom, shoeMat);
    rightShoe.position.set(0.25, -1.7, 0.1);
    characterGroup.add(rightShoe);
  } else if (outfit === "casual") {
    const hoodieBodyGeom = new THREE.CylinderGeometry(0.85, 0.7, 1.3, 32);
    const hoodieBody = new THREE.Mesh(hoodieBodyGeom, outfitMat);
    hoodieBody.position.set(0, 0.85, 0);
    characterGroup.add(hoodieBody);

    const hoodGeom = new THREE.SphereGeometry(0.75, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const hood = new THREE.Mesh(hoodGeom, outfitMat);
    hood.position.set(0, 1.65, -0.25);
    hood.scale.set(1, 1, 1.1);
    characterGroup.add(hood);

    const drawstringGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    const drawstringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
    });
    const leftDraw = new THREE.Mesh(drawstringGeom, drawstringMat);
    leftDraw.position.set(-0.12, 1.45, 0.45);
    characterGroup.add(leftDraw);
    const rightDraw = new THREE.Mesh(drawstringGeom, drawstringMat);
    rightDraw.position.set(0.12, 1.45, 0.45);
    characterGroup.add(rightDraw);

    const pocketShape = new THREE.Shape();
    pocketShape.moveTo(-0.4, 0);
    pocketShape.lineTo(0.4, 0);
    pocketShape.lineTo(0.35, -0.4);
    pocketShape.lineTo(0, -0.5);
    pocketShape.lineTo(-0.35, -0.4);
    pocketShape.lineTo(-0.4, 0);
    const pocketGeom = new THREE.ExtrudeGeometry(pocketShape, {
      depth: 0.03,
      bevelEnabled: false,
    });
    const pocket = new THREE.Mesh(pocketGeom, outfitMat2);
    pocket.position.set(0, 0.85, 0.45);
    characterGroup.add(pocket);

    const zipperGeom = new THREE.BoxGeometry(0.03, 0.7, 0.03);
    const zipperMat = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      roughness: 0.3,
      metalness: 0.8,
    });
    const zipper = new THREE.Mesh(zipperGeom, zipperMat);
    zipper.position.set(0, 1.1, 0.46);
    characterGroup.add(zipper);

    const cuffGeom = new THREE.TorusGeometry(0.17, 0.03, 8, 24);
    const cuffMat = new THREE.MeshStandardMaterial({
      color: outfitColor2,
      roughness: 0.5,
    });
    const leftCuff = new THREE.Mesh(cuffGeom, cuffMat);
    leftCuff.position.set(-1.15, 0.2, 0);
    leftCuff.rotation.y = Math.PI / 2;
    characterGroup.add(leftCuff);
    const rightCuff = new THREE.Mesh(cuffGeom, cuffMat);
    rightCuff.position.set(1.15, 0.2, 0);
    rightCuff.rotation.y = Math.PI / 2;
    characterGroup.add(rightCuff);

    const jeansGeom = new THREE.CylinderGeometry(0.58, 0.52, 1.6, 32);
    const jeansMat = new THREE.MeshStandardMaterial({
      color: 0x4a6fa5,
      roughness: 0.8,
      metalness: 0.05,
    });
    const jeans = new THREE.Mesh(jeansGeom, jeansMat);
    jeans.position.set(0, -0.45, 0);
    characterGroup.add(jeans);

    const leftJeansGeom = new THREE.CylinderGeometry(0.24, 0.22, 1.5, 16);
    const leftJeans = new THREE.Mesh(leftJeansGeom, jeansMat);
    leftJeans.position.set(-0.26, -1.0, 0);
    characterGroup.add(leftJeans);
    const rightJeans = new THREE.Mesh(leftJeansGeom, jeansMat);
    rightJeans.position.set(0.26, -1.0, 0);
    characterGroup.add(rightJeans);

    const stichGeom = new THREE.BoxGeometry(0.01, 1.4, 0.02);
    const stichMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      roughness: 0.6,
    });
    const stitch1 = new THREE.Mesh(stichGeom, stichMat);
    stitch1.position.set(0, -0.9, 0.48);
    characterGroup.add(stitch1);

    const sneakerGeom = new THREE.BoxGeometry(0.32, 0.18, 0.6);
    const sneakerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
    });
    const leftSneaker = new THREE.Mesh(sneakerGeom, sneakerMat);
    leftSneaker.position.set(-0.26, -1.78, 0.1);
    characterGroup.add(leftSneaker);
    const rightSneaker = new THREE.Mesh(sneakerGeom, sneakerMat);
    rightSneaker.position.set(0.26, -1.78, 0.1);
    characterGroup.add(rightSneaker);
    const soleGeom = new THREE.BoxGeometry(0.34, 0.06, 0.62);
    const soleMat = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.8,
    });
    const leftSole = new THREE.Mesh(soleGeom, soleMat);
    leftSole.position.set(-0.26, -1.88, 0.1);
    characterGroup.add(leftSole);
    const rightSole = new THREE.Mesh(soleGeom, soleMat);
    rightSole.position.set(0.26, -1.88, 0.1);
    characterGroup.add(rightSole);
  } else if (outfit === "resort") {
    const dressTopGeom = new THREE.SphereGeometry(0.85, 32, 32);
    const dressTop = new THREE.Mesh(dressTopGeom, outfitMat);
    dressTop.position.set(0, 1.2, 0.05);
    dressTop.scale.set(1, 0.6, 0.65);
    characterGroup.add(dressTop);

    const strapGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
    const strapMat = new THREE.MeshStandardMaterial({
      color: outfitColor2,
      roughness: 0.4,
    });
    const leftStrap = new THREE.Mesh(strapGeom, strapMat);
    leftStrap.position.set(-0.5, 1.6, 0.2);
    leftStrap.rotation.z = 0.2;
    characterGroup.add(leftStrap);
    const rightStrap = new THREE.Mesh(strapGeom, strapMat);
    rightStrap.position.set(0.5, 1.6, 0.2);
    rightStrap.rotation.z = -0.2;
    characterGroup.add(rightStrap);

    const longSkirtPoints: THREE.Vector2[] = [];
    longSkirtPoints.push(new THREE.Vector2(0.6, 0.5));
    longSkirtPoints.push(new THREE.Vector2(1.0, 0));
    longSkirtPoints.push(new THREE.Vector2(1.8, -0.8));
    longSkirtPoints.push(new THREE.Vector2(2.3, -1.8));
    longSkirtPoints.push(new THREE.Vector2(2.4, -2.8));
    longSkirtPoints.push(new THREE.Vector2(2.3, -3.0));
    longSkirtPoints.push(new THREE.Vector2(0.05, -3.0));
    const longSkirtGeom = new THREE.LatheGeometry(longSkirtPoints, 48);
    const longSkirt = new THREE.Mesh(longSkirtGeom, outfitMat2);
    longSkirt.position.set(0, 0.9, 0);
    characterGroup.add(longSkirt);

    const flowerGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const flowerMat1 = new THREE.MeshStandardMaterial({
      color: 0xff69b4,
      roughness: 0.4,
    });
    const flowerMat2 = new THREE.MeshStandardMaterial({
      color: 0xffff66,
      roughness: 0.3,
    });
    const flowerMat3 = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      roughness: 0.4,
    });
    const flowerMats = [flowerMat1, flowerMat2, flowerMat3];

    for (let i = 0; i < 6; i++) {
      const flower = new THREE.Mesh(flowerGeom, flowerMats[i % 3]);
      const angle = (i / 6) * Math.PI * 2;
      const r = 1.2 + (i % 2) * 0.4;
      flower.position.set(
        Math.cos(angle) * r,
        -0.5 - Math.random() * 1.5,
        Math.sin(angle) * 0.2 + 0.5
      );
      flower.scale.set(1, 1, 0.3);
      characterGroup.add(flower);
    }

    const hatBrimGeom = new THREE.CylinderGeometry(1.1, 1.1, 0.04, 48);
    const hatMat = new THREE.MeshStandardMaterial({
      color: 0xf4e4bc,
      roughness: 0.9,
    });
    const hatBrim = new THREE.Mesh(hatBrimGeom, hatMat);
    hatBrim.position.set(0, 2.7, 0);
    characterGroup.add(hatBrim);

    const hatTopGeom = new THREE.CylinderGeometry(0.55, 0.6, 0.5, 32);
    const hatTop = new THREE.Mesh(hatTopGeom, hatMat);
    hatTop.position.set(0, 2.97, 0);
    characterGroup.add(hatTop);

    const hatBandGeom = new THREE.TorusGeometry(0.57, 0.05, 12, 48);
    const hatBandMat = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.5,
    });
    const hatBand = new THREE.Mesh(hatBandGeom, hatBandMat);
    hatBand.position.set(0, 2.75, 0);
    hatBand.rotation.x = Math.PI / 2;
    characterGroup.add(hatBand);

    const sandalGeom = new THREE.BoxGeometry(0.3, 0.05, 0.55);
    const sandalMat = new THREE.MeshStandardMaterial({
      color: 0xd2691e,
      roughness: 0.7,
    });
    const leftSandal = new THREE.Mesh(sandalGeom, sandalMat);
    leftSandal.position.set(-0.3, -1.95, 0.1);
    characterGroup.add(leftSandal);
    const rightSandal = new THREE.Mesh(sandalGeom, sandalMat);
    rightSandal.position.set(0.3, -1.95, 0.1);
    characterGroup.add(rightSandal);
  }

  const shoulderGeom = new THREE.SphereGeometry(0.42, 24, 24);
  const leftShoulder = new THREE.Mesh(shoulderGeom, outfitMat);
  leftShoulder.position.set(-1.0, 1.3, 0);
  characterGroup.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(shoulderGeom, outfitMat);
  rightShoulder.position.set(1.0, 1.3, 0);
  characterGroup.add(rightShoulder);

  const upperArmGeom = new THREE.CylinderGeometry(0.2, 0.18, 0.75, 20);
  const leftUpperArm = new THREE.Mesh(upperArmGeom, outfitMat);
  leftUpperArm.position.set(-1.25, 0.8, 0);
  characterGroup.add(leftUpperArm);

  const rightUpperArm = new THREE.Mesh(upperArmGeom, outfitMat);
  rightUpperArm.position.set(1.25, 0.8, 0);
  characterGroup.add(rightUpperArm);

  const foreArmGeom = new THREE.CylinderGeometry(0.17, 0.15, 0.75, 20);
  const leftForeArm = new THREE.Mesh(foreArmGeom, skinMat1);
  leftForeArm.position.set(-1.25, 0.05, 0);
  characterGroup.add(leftForeArm);

  const rightForeArm = new THREE.Mesh(foreArmGeom, skinMat1);
  rightForeArm.position.set(1.25, 0.05, 0);
  characterGroup.add(rightForeArm);

  const handGeom = new THREE.SphereGeometry(0.18, 20, 20);
  const leftHand = new THREE.Mesh(handGeom, skinMat1);
  leftHand.position.set(-1.25, -0.4, 0);
  leftHand.scale.set(1, 1.2, 0.8);
  characterGroup.add(leftHand);

  const rightHand = new THREE.Mesh(handGeom, skinMat1);
  rightHand.position.set(1.25, -0.4, 0);
  rightHand.scale.set(1, 1.2, 0.8);
  characterGroup.add(rightHand);

  const hipGeom = new THREE.SphereGeometry(0.65, 24, 24);
  const hip = new THREE.Mesh(hipGeom, outfitMat);
  hip.position.set(0, 0.05, 0);
  hip.scale.set(1.15, 0.8, 1.05);
  characterGroup.add(hip);

  if (outfit !== "suit" && outfit !== "casual" && outfit !== "resort") {
    const legGeom = new THREE.CylinderGeometry(0.22, 0.2, 1.4, 16);
    const leftLeg = new THREE.Mesh(legGeom, outfitMat2);
    leftLeg.position.set(-0.28, -1.0, 0);
    characterGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, outfitMat2);
    rightLeg.position.set(0.28, -1.0, 0);
    characterGroup.add(rightLeg);

    const footGeom = new THREE.BoxGeometry(0.3, 0.12, 0.5);
    const leftFoot = new THREE.Mesh(footGeom, outfitMat2);
    leftFoot.position.set(-0.28, -1.8, 0.1);
    characterGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeom, outfitMat2);
    rightFoot.position.set(0.28, -1.8, 0.1);
    characterGroup.add(rightFoot);
  }

  return characterGroup;
}

export function createCharacterHead(
  skinColor1: string,
  skinColor2: string,
  faceShape: string | null | undefined,
  completedEffects: CompletedEffect
): { group: THREE.Group; faceParts: THREE.Group; makeUpZones: Record<string, THREE.Mesh> } {
  const headGroup = new THREE.Group();
  const faceParts = new THREE.Group();
  const makeUpZones: Record<string, THREE.Mesh> = {};

  const skinMat1 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor1),
    roughness: 0.65,
    metalness: 0.05,
  });

  const skinMat2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor2),
    roughness: 0.65,
    metalness: 0.05,
  });

  let headScaleX = 1;
  let headScaleY = 1;
  let headScaleZ = 1;

  if (faceShape === "round") {
    headScaleX = 1.08;
    headScaleY = 0.92;
    headScaleZ = 1.08;
  } else if (faceShape === "square") {
    headScaleX = 1.03;
    headScaleY = 1.02;
    headScaleZ = 0.95;
  } else {
    headScaleX = 0.93;
    headScaleY = 1.1;
    headScaleZ = 1.0;
  }

  const headGeom = new THREE.SphereGeometry(1.0, 64, 64);
  const head = new THREE.Mesh(headGeom, skinMat1);
  head.scale.set(headScaleX, headScaleY, headScaleZ);
  head.position.y = 0;
  faceParts.add(head);

  const cheekGeom = new THREE.SphereGeometry(0.35, 32, 32);
  const leftCheek = new THREE.Mesh(cheekGeom, skinMat2);
  leftCheek.position.set(-0.5, -0.25, 0.55);
  leftCheek.scale.set(1, 0.7, 0.5);
  faceParts.add(leftCheek);
  const rightCheek = new THREE.Mesh(cheekGeom, skinMat2);
  rightCheek.position.set(0.5, -0.25, 0.55);
  rightCheek.scale.set(1, 0.7, 0.5);
  faceParts.add(rightCheek);

  const jawGeom = new THREE.SphereGeometry(0.6, 32, 32);
  const jaw = new THREE.Mesh(jawGeom, skinMat2);
  jaw.position.set(0, -0.8, 0.1);
  jaw.scale.set(headScaleX * 0.9, 0.6, headScaleZ * 0.85);
  faceParts.add(jaw);

  const noseBridgeGeom = new THREE.BoxGeometry(0.08, 0.3, 0.08);
  const noseBridge = new THREE.Mesh(noseBridgeGeom, skinMat2);
  noseBridge.position.set(0, -0.05, 0.75);
  noseBridge.scale.set(1, 1, 0.8);
  faceParts.add(noseBridge);

  const noseTipGeom = new THREE.SphereGeometry(0.16, 32, 32);
  const noseTip = new THREE.Mesh(noseTipGeom, skinMat2);
  noseTip.position.set(0, -0.3, 0.82);
  noseTip.scale.set(1.1, 0.85, 1.0);
  faceParts.add(noseTip);

  const nostrilGeom = new THREE.SphereGeometry(0.045, 16, 16);
  const nostrilMat = new THREE.MeshStandardMaterial({
    color: 0x8b5a3c,
    roughness: 0.9,
  });
  const leftNostril = new THREE.Mesh(nostrilGeom, nostrilMat);
  leftNostril.position.set(-0.07, -0.36, 0.86);
  leftNostril.scale.set(1, 0.7, 0.6);
  faceParts.add(leftNostril);
  const rightNostril = new THREE.Mesh(nostrilGeom, nostrilMat);
  rightNostril.position.set(0.07, -0.36, 0.86);
  rightNostril.scale.set(1, 0.7, 0.6);
  faceParts.add(rightNostril);

  const eyeSocketGeom = new THREE.SphereGeometry(0.22, 32, 32);
  const eyeSocketMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor2),
    roughness: 0.6,
  });
  const leftEyeSocket = new THREE.Mesh(eyeSocketGeom, eyeSocketMat);
  leftEyeSocket.position.set(-0.35, 0.08, 0.75);
  leftEyeSocket.scale.set(1.2, 0.9, 0.3);
  faceParts.add(leftEyeSocket);
  const rightEyeSocket = new THREE.Mesh(eyeSocketGeom, eyeSocketMat);
  rightEyeSocket.position.set(0.35, 0.08, 0.75);
  rightEyeSocket.scale.set(1.2, 0.9, 0.3);
  faceParts.add(rightEyeSocket);

  const eyeWhiteGeom = new THREE.SphereGeometry(0.18, 32, 32);
  const eyeWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.05,
  });
  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
  leftEyeWhite.position.set(-0.35, 0.08, 0.82);
  leftEyeWhite.scale.set(1, 0.75, 0.35);
  faceParts.add(leftEyeWhite);
  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
  rightEyeWhite.position.set(0.35, 0.08, 0.82);
  rightEyeWhite.scale.set(1, 0.75, 0.35);
  faceParts.add(rightEyeWhite);

  const irisGeom = new THREE.SphereGeometry(0.1, 32, 32);
  const irisMat = new THREE.MeshStandardMaterial({
    color: 0x5d4037,
    roughness: 0.15,
    metalness: 0.1,
  });
  const pupilMat = new THREE.MeshStandardMaterial({
    color: 0x1a0d07,
    roughness: 0.05,
    metalness: 0.05,
  });
  const highlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.1,
    emissive: 0xffffff,
    emissiveIntensity: 0.5,
  });

  const leftIris = new THREE.Mesh(irisGeom, irisMat);
  leftIris.position.set(-0.35, 0.08, 0.96);
  faceParts.add(leftIris);
  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 32, 32), pupilMat);
  leftPupil.position.set(-0.35, 0.08, 1.04);
  faceParts.add(leftPupil);
  const leftHighlight1 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), highlightMat);
  leftHighlight1.position.set(-0.38, 0.12, 1.06);
  faceParts.add(leftHighlight1);
  const leftHighlight2 = new THREE.Mesh(new THREE.SphereGeometry(0.008, 16, 16), highlightMat);
  leftHighlight2.position.set(-0.32, 0.05, 1.06);
  faceParts.add(leftHighlight2);

  const rightIris = new THREE.Mesh(irisGeom, irisMat);
  rightIris.position.set(0.35, 0.08, 0.96);
  faceParts.add(rightIris);
  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.05, 32, 32), pupilMat);
  rightPupil.position.set(0.35, 0.08, 1.04);
  faceParts.add(rightPupil);
  const rightHighlight1 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), highlightMat);
  rightHighlight1.position.set(0.32, 0.12, 1.06);
  faceParts.add(rightHighlight1);
  const rightHighlight2 = new THREE.Mesh(new THREE.SphereGeometry(0.008, 16, 16), highlightMat);
  rightHighlight2.position.set(0.38, 0.05, 1.06);
  faceParts.add(rightHighlight2);

  const upperLashGeom = new THREE.BoxGeometry(0.3, 0.015, 0.02);
  const lashMat = new THREE.MeshStandardMaterial({
    color: 0x1a0d07,
    roughness: 0.5,
  });
  const leftUpperLash = new THREE.Mesh(upperLashGeom, lashMat);
  leftUpperLash.position.set(-0.35, 0.2, 0.92);
  leftUpperLash.rotation.z = 0.08;
  faceParts.add(leftUpperLash);
  const rightUpperLash = new THREE.Mesh(upperLashGeom, lashMat);
  rightUpperLash.position.set(0.35, 0.2, 0.92);
  rightUpperLash.rotation.z = -0.08;
  faceParts.add(rightUpperLash);

  const lowerLashGeom = new THREE.BoxGeometry(0.25, 0.01, 0.015);
  const leftLowerLash = new THREE.Mesh(lowerLashGeom, lashMat);
  leftLowerLash.position.set(-0.35, -0.04, 0.92);
  leftLowerLash.rotation.z = -0.05;
  faceParts.add(leftLowerLash);
  const rightLowerLash = new THREE.Mesh(lowerLashGeom, lashMat);
  rightLowerLash.position.set(0.35, -0.04, 0.92);
  rightLowerLash.rotation.z = 0.05;
  faceParts.add(rightLowerLash);

  const upperLipGeom = new THREE.SphereGeometry(0.15, 32, 32);
  const lipMat = new THREE.MeshStandardMaterial({
    color: 0xc85a7a,
    roughness: 0.5,
    metalness: 0.05,
  });
  const upperLip = new THREE.Mesh(upperLipGeom, lipMat);
  upperLip.position.set(0, -0.62, 0.82);
  upperLip.scale.set(2.5, 0.7, 0.45);
  faceParts.add(upperLip);

  const cupidsBowGeom = new THREE.SphereGeometry(0.06, 16, 16);
  const cupidLeft = new THREE.Mesh(cupidsBowGeom, lipMat);
  cupidLeft.position.set(-0.09, -0.56, 0.86);
  cupidLeft.scale.set(1, 0.8, 0.6);
  faceParts.add(cupidLeft);
  const cupidRight = new THREE.Mesh(cupidsBowGeom, lipMat);
  cupidRight.position.set(0.09, -0.56, 0.86);
  cupidRight.scale.set(1, 0.8, 0.6);
  faceParts.add(cupidRight);

  const lowerLipGeom = new THREE.SphereGeometry(0.17, 32, 32);
  const lowerLip = new THREE.Mesh(lowerLipGeom, lipMat);
  lowerLip.position.set(0, -0.75, 0.8);
  lowerLip.scale.set(2.2, 0.85, 0.5);
  faceParts.add(lowerLip);

  const philtrumGeom = new THREE.BoxGeometry(0.02, 0.12, 0.02);
  const philtrumMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor2),
    roughness: 0.6,
  });
  const philtrum = new THREE.Mesh(philtrumGeom, philtrumMat);
  philtrum.position.set(0, -0.45, 0.83);
  faceParts.add(philtrum);

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x4a2f17,
    roughness: 0.85,
    metalness: 0.05,
  });
  const hairHighlightMat = new THREE.MeshStandardMaterial({
    color: 0x6b4423,
    roughness: 0.8,
    metalness: 0.05,
  });

  const hairBackGeom = new THREE.SphereGeometry(1.15, 48, 48, 0, Math.PI * 2, 0, Math.PI / 1.3);
  const hairBack = new THREE.Mesh(hairBackGeom, hairMat);
  hairBack.position.set(0, 0.1, -0.2);
  hairBack.scale.set(1.08, 1.1, 1.15);
  faceParts.add(hairBack);

  const hairTopGeom = new THREE.SphereGeometry(0.95, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  const hairTop = new THREE.Mesh(hairTopGeom, hairHighlightMat);
  hairTop.position.set(0, 0.7, 0);
  hairTop.scale.set(1.15, 1.1, 1.1);
  faceParts.add(hairTop);

  const bangsShape = new THREE.Shape();
  bangsShape.moveTo(-0.9, 0);
  bangsShape.quadraticCurveTo(-0.8, 0.35, -0.4, 0.45);
  bangsShape.quadraticCurveTo(0, 0.55, 0.4, 0.45);
  bangsShape.quadraticCurveTo(0.8, 0.35, 0.9, 0);
  bangsShape.quadraticCurveTo(0.5, -0.1, 0, -0.05);
  bangsShape.quadraticCurveTo(-0.5, -0.1, -0.9, 0);
  const bangsGeom = new THREE.ExtrudeGeometry(bangsShape, {
    depth: 0.3,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
  });
  const bangs = new THREE.Mesh(bangsGeom, hairMat);
  bangs.position.set(0, 0.3, 0.55);
  faceParts.add(bangs);

  const sideHairGeom = new THREE.BoxGeometry(0.18, 0.9, 0.45);
  const leftSideHair = new THREE.Mesh(sideHairGeom, hairMat);
  leftSideHair.position.set(-0.95, -0.1, 0.15);
  leftSideHair.scale.set(1, 1, 1);
  faceParts.add(leftSideHair);
  const rightSideHair = new THREE.Mesh(sideHairGeom, hairMat);
  rightSideHair.position.set(0.95, -0.1, 0.15);
  faceParts.add(rightSideHair);

  const earGeom = new THREE.SphereGeometry(0.13, 32, 32);
  const leftEar = new THREE.Mesh(earGeom, skinMat2);
  leftEar.position.set(-1.0, 0, 0.12);
  leftEar.scale.set(0.55, 1.1, 0.4);
  faceParts.add(leftEar);
  const rightEar = new THREE.Mesh(earGeom, skinMat2);
  rightEar.position.set(1.0, 0, 0.12);
  rightEar.scale.set(0.55, 1.1, 0.4);
  faceParts.add(rightEar);

  const earLobeGeom = new THREE.SphereGeometry(0.05, 16, 16);
  const leftLobe = new THREE.Mesh(earLobeGeom, skinMat2);
  leftLobe.position.set(-1.0, -0.22, 0.14);
  faceParts.add(leftLobe);
  const rightLobe = new THREE.Mesh(earLobeGeom, skinMat2);
  rightLobe.position.set(1.0, -0.22, 0.14);
  faceParts.add(rightLobe);

  const lipstickColor = getColorFromEffect(completedEffects.lipstick);
  if (lipstickColor) {
    const lipstickMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(lipstickColor),
      roughness: 0.35,
      metalness: 0.15,
      transparent: true,
      opacity: 0.92,
      emissive: new THREE.Color(lipstickColor),
      emissiveIntensity: 0.12,
    });
    const lipstickUpper = new THREE.Mesh(upperLipGeom, lipstickMat);
    lipstickUpper.position.set(0, -0.62, 0.83);
    lipstickUpper.scale.set(2.6, 0.75, 0.5);
    lipstickUpper.name = "lipstick-upper";
    makeUpZones["lipstick-upper"] = lipstickUpper;
    faceParts.add(lipstickUpper);

    const lipstickLower = new THREE.Mesh(lowerLipGeom, lipstickMat);
    lipstickLower.position.set(0, -0.75, 0.81);
    lipstickLower.scale.set(2.3, 0.9, 0.55);
    lipstickLower.name = "lipstick-lower";
    makeUpZones["lipstick-lower"] = lipstickLower;
    faceParts.add(lipstickLower);
  }

  const blushColor = getColorFromEffect(completedEffects.blush);
  if (blushColor) {
    const blushMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(blushColor),
      roughness: 0.55,
      transparent: true,
      opacity: 0.65,
      emissive: new THREE.Color(blushColor),
      emissiveIntensity: 0.2,
    });
    const blushGeom = new THREE.SphereGeometry(0.32, 32, 32);
    const leftBlush = new THREE.Mesh(blushGeom, blushMat);
    leftBlush.position.set(-0.58, -0.22, 0.62);
    leftBlush.scale.set(1.15, 0.8, 0.22);
    leftBlush.name = "blush-left";
    makeUpZones["blush-left"] = leftBlush;
    faceParts.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeom, blushMat.clone());
    rightBlush.position.set(0.58, -0.22, 0.62);
    rightBlush.scale.set(1.15, 0.8, 0.22);
    rightBlush.name = "blush-right";
    makeUpZones["blush-right"] = rightBlush;
    faceParts.add(rightBlush);
  }

  const eyeshadowColor = getColorFromEffect(completedEffects.eyeshadow);
  if (eyeshadowColor) {
    const eyeshadowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(eyeshadowColor),
      roughness: 0.45,
      transparent: true,
      opacity: 0.75,
      emissive: new THREE.Color(eyeshadowColor),
      emissiveIntensity: 0.15,
    });
    const eyeshadowGeom = new THREE.SphereGeometry(0.25, 32, 32);
    const leftEyeshadow = new THREE.Mesh(eyeshadowGeom, eyeshadowMat);
    leftEyeshadow.position.set(-0.35, 0.22, 0.78);
    leftEyeshadow.scale.set(1.4, 0.75, 0.2);
    leftEyeshadow.name = "eyeshadow-left";
    makeUpZones["eyeshadow-left"] = leftEyeshadow;
    faceParts.add(leftEyeshadow);

    const rightEyeshadow = new THREE.Mesh(eyeshadowGeom, eyeshadowMat.clone());
    rightEyeshadow.position.set(0.35, 0.22, 0.78);
    rightEyeshadow.scale.set(1.4, 0.75, 0.2);
    rightEyeshadow.name = "eyeshadow-right";
    makeUpZones["eyeshadow-right"] = rightEyeshadow;
    faceParts.add(rightEyeshadow);

    const lowerShadowGeom = new THREE.SphereGeometry(0.15, 32, 32);
    const leftLower = new THREE.Mesh(lowerShadowGeom, eyeshadowMat.clone());
    leftLower.position.set(-0.35, -0.05, 0.8);
    leftLower.scale.set(1.2, 0.5, 0.15);
    faceParts.add(leftLower);
    const rightLower = new THREE.Mesh(lowerShadowGeom, eyeshadowMat.clone());
    rightLower.position.set(0.35, -0.05, 0.8);
    rightLower.scale.set(1.2, 0.5, 0.15);
    faceParts.add(rightLower);
  }

  const foundationColor = getColorFromEffect(completedEffects.foundation);
  if (foundationColor) {
    const foundationGeom = new THREE.SphereGeometry(1.02, 64, 64);
    const foundationMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(foundationColor),
      roughness: 0.55,
      transparent: true,
      opacity: 0.55,
      emissive: new THREE.Color(foundationColor),
      emissiveIntensity: 0.08,
    });
    const foundationMesh = new THREE.Mesh(foundationGeom, foundationMat);
    foundationMesh.scale.set(headScaleX * 1.01, headScaleY * 1.01, headScaleZ * 1.01);
    foundationMesh.name = "foundation";
    makeUpZones.foundation = foundationMesh;
    faceParts.add(foundationMesh);

    const neckFoundationGeom = new THREE.CylinderGeometry(0.34, 0.4, 0.65, 24);
    const neckFoundation = new THREE.Mesh(neckFoundationGeom, foundationMat.clone());
    neckFoundation.position.set(0, -1.25, 0);
    neckFoundation.scale.set(1.02, 1, 1.02);
    faceParts.add(neckFoundation);
  }

  const browsProduct = getProductFromEffect(completedEffects.brows);
  const browsColor = browsProduct?.color || "#5A3A1C";
  if (completedEffects.brows) {
    const browMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(browsColor),
      roughness: 0.85,
      metalness: 0.05,
    });
    for (let i = 0; i < 5; i++) {
      const hairGeom = new THREE.CylinderGeometry(0.008, 0.01, 0.08, 6);
      const leftHair = new THREE.Mesh(hairGeom, browMat);
      leftHair.position.set(-0.48 + i * 0.05, 0.35, 0.9);
      leftHair.rotation.z = 0.3 - i * 0.1;
      leftHair.rotation.x = -0.2;
      faceParts.add(leftHair);

      const rightHair = new THREE.Mesh(hairGeom, browMat);
      rightHair.position.set(0.23 + i * 0.05, 0.35, 0.9);
      rightHair.rotation.z = -0.3 + i * 0.1;
      rightHair.rotation.x = -0.2;
      faceParts.add(rightHair);
    }

    const browGeom = new THREE.BoxGeometry(0.28, 0.05, 0.04);
    const leftBrow = new THREE.Mesh(browGeom, browMat);
    leftBrow.position.set(-0.35, 0.35, 0.88);
    leftBrow.rotation.z = 0.12;
    leftBrow.name = "brow-left";
    makeUpZones["brow-left"] = leftBrow;
    faceParts.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeom, browMat.clone());
    rightBrow.position.set(0.35, 0.35, 0.88);
    rightBrow.rotation.z = -0.12;
    rightBrow.name = "brow-right";
    makeUpZones["brow-right"] = rightBrow;
    faceParts.add(rightBrow);
  }

  const eyelinerProduct = getProductFromEffect(completedEffects.eyeliner);
  const eyelinerColor = eyelinerProduct?.color || "#2D1B0E";
  if (completedEffects.eyeliner) {
    const linerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(eyelinerColor),
      roughness: 0.25,
      metalness: 0.1,
    });
    const linerGeom = new THREE.BoxGeometry(0.32, 0.025, 0.025);
    const leftLiner = new THREE.Mesh(linerGeom, linerMat);
    leftLiner.position.set(-0.35, 0.2, 0.95);
    leftLiner.rotation.z = 0.1;
    leftLiner.name = "eyeliner-left";
    makeUpZones["eyeliner-left"] = leftLiner;
    faceParts.add(leftLiner);

    const rightLiner = new THREE.Mesh(linerGeom, linerMat.clone());
    rightLiner.position.set(0.35, 0.2, 0.95);
    rightLiner.rotation.z = -0.1;
    rightLiner.name = "eyeliner-right";
    makeUpZones["eyeliner-right"] = rightLiner;
    faceParts.add(rightLiner);

    const wingGeom = new THREE.ConeGeometry(0.02, 0.12, 4);
    const leftWing = new THREE.Mesh(wingGeom, linerMat);
    leftWing.position.set(-0.53, 0.22, 0.94);
    leftWing.rotation.z = Math.PI / 3;
    faceParts.add(leftWing);
    const rightWing = new THREE.Mesh(wingGeom, linerMat);
    rightWing.position.set(0.53, 0.22, 0.94);
    rightWing.rotation.z = -Math.PI / 3;
    faceParts.add(rightWing);
  }

  if (completedEffects.mascara) {
    const lashMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.35,
    });
    for (let i = 0; i < 7; i++) {
      const lashGeom = new THREE.CylinderGeometry(0.006, 0.012, 0.14, 6);
      const lash = new THREE.Mesh(lashGeom, lashMat);
      lash.position.set(-0.48 + i * 0.045, 0.28, 0.96);
      lash.rotation.x = -0.5;
      lash.rotation.z = 0.4 - i * 0.15;
      faceParts.add(lash);
    }
    for (let i = 0; i < 7; i++) {
      const lashGeom = new THREE.CylinderGeometry(0.006, 0.012, 0.14, 6);
      const lash = new THREE.Mesh(lashGeom, lashMat);
      lash.position.set(0.2 + i * 0.045, 0.28, 0.96);
      lash.rotation.x = -0.5;
      lash.rotation.z = -0.4 + i * 0.15;
      faceParts.add(lash);
    }
    for (let i = 0; i < 5; i++) {
      const lashGeom = new THREE.CylinderGeometry(0.004, 0.008, 0.08, 6);
      const lash = new THREE.Mesh(lashGeom, lashMat);
      lash.position.set(-0.42 + i * 0.05, -0.05, 0.96);
      lash.rotation.x = 0.4;
      lash.rotation.z = 0.3 - i * 0.12;
      faceParts.add(lash);
    }
    for (let i = 0; i < 5; i++) {
      const lashGeom = new THREE.CylinderGeometry(0.004, 0.008, 0.08, 6);
      const lash = new THREE.Mesh(lashGeom, lashMat);
      lash.position.set(0.17 + i * 0.05, -0.05, 0.96);
      lash.rotation.x = 0.4;
      lash.rotation.z = -0.3 + i * 0.12;
      faceParts.add(lash);
    }
  }

  headGroup.add(faceParts);
  return { group: headGroup, faceParts, makeUpZones };
}
