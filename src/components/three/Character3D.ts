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
    metalness: 0.1,
  });

  const skinMat2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor2),
    roughness: 0.7,
    metalness: 0.1,
  });

  const outfitMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(outfitColor1),
    roughness: 0.6,
    metalness: 0.1,
  });

  const outfitMat2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(outfitColor2),
    roughness: 0.6,
    metalness: 0.1,
  });

  const neckGeom = new THREE.CylinderGeometry(0.25, 0.3, 0.5, 16);
  const neck = new THREE.Mesh(neckGeom, skinMat2);
  neck.position.set(0, 1.4, 0);
  characterGroup.add(neck);

  const torsoGeom = new THREE.CylinderGeometry(0.8, 0.6, 1.4, 16);
  const torso = new THREE.Mesh(torsoGeom, outfitMat);
  torso.position.set(0, 0.5, 0);
  characterGroup.add(torso);

  if (outfit === "dress") {
    const skirtGeom = new THREE.ConeGeometry(1.2, 1.5, 16);
    const skirt = new THREE.Mesh(skirtGeom, outfitMat2);
    skirt.position.set(0, -0.9, 0);
    skirt.rotation.x = Math.PI;
    characterGroup.add(skirt);
  } else if (outfit === "suit") {
    const lapelGeom = new THREE.BoxGeometry(1.0, 0.5, 0.05);
    const lapel = new THREE.Mesh(lapelGeom, outfitMat2);
    lapel.position.set(0, 0.8, 0.41);
    characterGroup.add(lapel);

    const buttonsGeom = new THREE.SphereGeometry(0.04, 8, 8);
    for (let i = 0; i < 3; i++) {
      const btn = new THREE.Mesh(buttonsGeom, outfitMat2);
      btn.position.set(0, 0.9 - i * 0.3, 0.45);
      characterGroup.add(btn);
    }

    const pantsGeom = new THREE.CylinderGeometry(0.5, 0.45, 1.2, 16);
    const pants = new THREE.Mesh(pantsGeom, outfitMat2);
    pants.position.set(0, -0.8, 0);
    characterGroup.add(pants);
  } else if (outfit === "casual") {
    const collarGeom = new THREE.TorusGeometry(0.4, 0.08, 8, 16);
    const collar = new THREE.Mesh(collarGeom, outfitMat2);
    collar.position.set(0, 1.15, 0.15);
    collar.rotation.x = Math.PI / 2.5;
    characterGroup.add(collar);

    const pantsGeom = new THREE.CylinderGeometry(0.5, 0.45, 1.2, 16);
    const pants = new THREE.Mesh(pantsGeom, outfitMat2);
    pants.position.set(0, -0.8, 0);
    characterGroup.add(pants);
  } else if (outfit === "resort") {
    const skirtGeom = new THREE.ConeGeometry(1.3, 1.3, 16);
    const skirt = new THREE.Mesh(skirtGeom, outfitMat2);
    skirt.position.set(0, -0.8, 0);
    skirt.rotation.x = Math.PI;
    characterGroup.add(skirt);

    const flowerGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const flower1 = new THREE.Mesh(
      flowerGeom,
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    flower1.position.set(-0.3, -0.2, 0.7);
    characterGroup.add(flower1);

    const flower2 = new THREE.Mesh(
      flowerGeom,
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    flower2.position.set(0.3, -0.5, 0.7);
    characterGroup.add(flower2);
  }

  const shoulderGeom = new THREE.SphereGeometry(0.35, 16, 16);
  const leftShoulder = new THREE.Mesh(shoulderGeom, outfitMat);
  leftShoulder.position.set(-0.9, 1.0, 0);
  characterGroup.add(leftShoulder);

  const rightShoulder = new THREE.Mesh(shoulderGeom, outfitMat);
  rightShoulder.position.set(0.9, 1.0, 0);
  characterGroup.add(rightShoulder);

  const upperArmGeom = new THREE.CylinderGeometry(0.18, 0.16, 0.7, 12);
  const leftUpperArm = new THREE.Mesh(upperArmGeom, outfitMat);
  leftUpperArm.position.set(-1.15, 0.55, 0);
  characterGroup.add(leftUpperArm);

  const rightUpperArm = new THREE.Mesh(upperArmGeom, outfitMat);
  rightUpperArm.position.set(1.15, 0.55, 0);
  characterGroup.add(rightUpperArm);

  const foreArmGeom = new THREE.CylinderGeometry(0.15, 0.13, 0.7, 12);
  const leftForeArm = new THREE.Mesh(foreArmGeom, skinMat1);
  leftForeArm.position.set(-1.15, -0.15, 0);
  characterGroup.add(leftForeArm);

  const rightForeArm = new THREE.Mesh(foreArmGeom, skinMat1);
  rightForeArm.position.set(1.15, -0.15, 0);
  characterGroup.add(rightForeArm);

  const handGeom = new THREE.SphereGeometry(0.15, 12, 12);
  const leftHand = new THREE.Mesh(handGeom, skinMat1);
  leftHand.position.set(-1.15, -0.55, 0);
  characterGroup.add(leftHand);

  const rightHand = new THREE.Mesh(handGeom, skinMat1);
  rightHand.position.set(1.15, -0.55, 0);
  characterGroup.add(rightHand);

  const hipGeom = new THREE.SphereGeometry(0.55, 16, 16);
  const hip = new THREE.Mesh(hipGeom, outfitMat);
  hip.position.set(0, -0.25, 0);
  hip.scale.set(1.1, 0.7, 1);
  characterGroup.add(hip);

  const legGeom = new THREE.CylinderGeometry(0.2, 0.18, 1.2, 12);
  const leftLeg = new THREE.Mesh(legGeom, outfitMat2);
  leftLeg.position.set(-0.3, -1.4, 0);
  characterGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeom, outfitMat2);
  rightLeg.position.set(0.3, -1.4, 0);
  characterGroup.add(rightLeg);

  const footGeom = new THREE.BoxGeometry(0.3, 0.1, 0.5);
  const leftFoot = new THREE.Mesh(footGeom, outfitMat2);
  leftFoot.position.set(-0.3, -2.0, 0.1);
  characterGroup.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeom, outfitMat2);
  rightFoot.position.set(0.3, -2.0, 0.1);
  characterGroup.add(rightFoot);

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
    roughness: 0.7,
    metalness: 0.1,
    transparent: true,
    opacity: 1,
  });

  const skinMat2 = new THREE.MeshStandardMaterial({
    color: new THREE.Color(skinColor2),
    roughness: 0.7,
    metalness: 0.1,
    transparent: true,
    opacity: 1,
  });

  let headScaleX = 1;
  let headScaleY = 1;
  let headScaleZ = 1;

  if (faceShape === "round") {
    headScaleX = 1.05;
    headScaleY = 0.95;
    headScaleZ = 1.05;
  } else if (faceShape === "square") {
    headScaleX = 1.0;
    headScaleY = 1.0;
    headScaleZ = 0.95;
  } else {
    headScaleX = 0.95;
    headScaleY = 1.08;
    headScaleZ = 1.0;
  }

  const headGeom = new THREE.SphereGeometry(0.85, 48, 48);
  const head = new THREE.Mesh(headGeom, skinMat1);
  head.scale.set(headScaleX, headScaleY, headScaleZ);
  head.position.y = 0;
  faceParts.add(head);

  const foreheadGeom = new THREE.SphereGeometry(0.75, 48, 48, 0, Math.PI * 2, 0, Math.PI / 2);
  const forehead = new THREE.Mesh(foreheadGeom, skinMat1);
  forehead.position.y = 0.35;
  forehead.scale.set(headScaleX, headScaleY, headScaleZ);
  faceParts.add(forehead);

  const chinGeom = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const chin = new THREE.Mesh(chinGeom, skinMat2);
  chin.position.y = -0.65;
  chin.scale.set(headScaleX * 0.9, headScaleY, headScaleZ * 0.9);
  faceParts.add(chin);

  const noseGeom = new THREE.SphereGeometry(0.12, 16, 16);
  const nose = new THREE.Mesh(noseGeom, skinMat2);
  nose.position.set(0, -0.15, 0.65);
  nose.scale.set(0.6, 1.2, 1.2);
  faceParts.add(nose);

  const nostrilGeom = new THREE.SphereGeometry(0.03, 8, 8);
  const leftNostril = new THREE.Mesh(
    nostrilGeom,
    new THREE.MeshStandardMaterial({ color: 0x8b5a3c, roughness: 0.9 })
  );
  leftNostril.position.set(-0.05, -0.28, 0.72);
  faceParts.add(leftNostril);

  const rightNostril = new THREE.Mesh(
    nostrilGeom,
    new THREE.MeshStandardMaterial({ color: 0x8b5a3c, roughness: 0.9 })
  );
  rightNostril.position.set(0.05, -0.28, 0.72);
  faceParts.add(rightNostril);

  const eyeWhiteGeom = new THREE.SphereGeometry(0.13, 16, 16);
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
  leftEyeWhite.position.set(-0.28, 0.08, 0.6);
  leftEyeWhite.scale.set(1, 0.75, 0.4);
  faceParts.add(leftEyeWhite);

  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeom, eyeWhiteMat);
  rightEyeWhite.position.set(0.28, 0.08, 0.6);
  rightEyeWhite.scale.set(1, 0.75, 0.4);
  faceParts.add(rightEyeWhite);

  const irisGeom = new THREE.SphereGeometry(0.07, 16, 16);
  const irisMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.2, metalness: 0.1 });
  const pupilMat = new THREE.MeshStandardMaterial({ color: 0x1a0d07, roughness: 0.1 });
  const highlightMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.2,
    emissive: 0xffffff,
    emissiveIntensity: 0.3,
  });

  const leftIris = new THREE.Mesh(irisGeom, irisMat);
  leftIris.position.set(-0.28, 0.08, 0.71);
  faceParts.add(leftIris);

  const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), pupilMat);
  leftPupil.position.set(-0.28, 0.08, 0.77);
  faceParts.add(leftPupil);

  const leftHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), highlightMat);
  leftHighlight.position.set(-0.3, 0.11, 0.78);
  faceParts.add(leftHighlight);

  const rightIris = new THREE.Mesh(irisGeom, irisMat);
  rightIris.position.set(0.28, 0.08, 0.71);
  faceParts.add(rightIris);

  const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), pupilMat);
  rightPupil.position.set(0.28, 0.08, 0.77);
  faceParts.add(rightPupil);

  const rightHighlight = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), highlightMat);
  rightHighlight.position.set(0.26, 0.11, 0.78);
  faceParts.add(rightHighlight);

  const mouthGeom = new THREE.SphereGeometry(0.06, 16, 16);
  const mouthMat = new THREE.MeshStandardMaterial({ color: 0x8b3a3a, roughness: 0.8 });
  const mouth = new THREE.Mesh(mouthGeom, mouthMat);
  mouth.position.set(0, -0.5, 0.6);
  mouth.scale.set(3.5, 0.8, 0.4);
  faceParts.add(mouth);

  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x4a2f17,
    roughness: 0.85,
    metalness: 0.05,
  });

  const hairBackGeom = new THREE.SphereGeometry(0.95, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
  const hairBack = new THREE.Mesh(hairBackGeom, hairMat);
  hairBack.position.set(0, 0.15, -0.15);
  hairBack.scale.set(1.05, 1.05, 1.1);
  faceParts.add(hairBack);

  const hairTopGeom = new THREE.SphereGeometry(0.78, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const hairTop = new THREE.Mesh(hairTopGeom, hairMat);
  hairTop.position.set(0, 0.55, 0);
  hairTop.scale.set(1.1, 1.0, 1.05);
  faceParts.add(hairTop);

  const bangsGeom = new THREE.SphereGeometry(0.7, 32, 32);
  const bangs = new THREE.Mesh(bangsGeom, hairMat);
  bangs.position.set(0, 0.35, 0.35);
  bangs.scale.set(1.1, 0.45, 0.55);
  faceParts.add(bangs);

  const leftSideGeom = new THREE.BoxGeometry(0.15, 0.5, 0.3);
  const leftSideHair = new THREE.Mesh(leftSideGeom, hairMat);
  leftSideHair.position.set(-0.75, 0, 0.15);
  faceParts.add(leftSideHair);

  const rightSideHair = new THREE.Mesh(leftSideGeom, hairMat);
  rightSideHair.position.set(0.75, 0, 0.15);
  faceParts.add(rightSideHair);

  const earGeom = new THREE.SphereGeometry(0.1, 16, 16);
  const leftEar = new THREE.Mesh(earGeom, skinMat2);
  leftEar.position.set(-0.82, 0, 0.1);
  leftEar.scale.set(0.6, 1.2, 0.4);
  faceParts.add(leftEar);

  const rightEar = new THREE.Mesh(earGeom, skinMat2);
  rightEar.position.set(0.82, 0, 0.1);
  rightEar.scale.set(0.6, 1.2, 0.4);
  faceParts.add(rightEar);

  const lipstickColor = getColorFromEffect(completedEffects.lipstick);
  if (lipstickColor) {
    const lipstickGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const lipstickMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(lipstickColor),
      roughness: 0.5,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const lipstickMesh = new THREE.Mesh(lipstickGeom, lipstickMat);
    lipstickMesh.position.set(0, -0.5, 0.61);
    lipstickMesh.scale.set(3.6, 0.9, 0.45);
    lipstickMesh.name = "lipstick";
    makeUpZones.lipstick = lipstickMesh;
    faceParts.add(lipstickMesh);
  }

  const blushColor = getColorFromEffect(completedEffects.blush);
  if (blushColor) {
    const blushGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const blushMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(blushColor),
      roughness: 0.6,
      transparent: true,
      opacity: 0.4,
    });

    const leftBlush = new THREE.Mesh(blushGeom, blushMat);
    leftBlush.position.set(-0.45, -0.15, 0.5);
    leftBlush.scale.set(1.1, 0.7, 0.25);
    leftBlush.name = "blush-left";
    makeUpZones["blush-left"] = leftBlush;
    faceParts.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeom, blushMat.clone());
    rightBlush.position.set(0.45, -0.15, 0.5);
    rightBlush.scale.set(1.1, 0.7, 0.25);
    rightBlush.name = "blush-right";
    makeUpZones["blush-right"] = rightBlush;
    faceParts.add(rightBlush);
  }

  const eyeshadowColor = getColorFromEffect(completedEffects.eyeshadow);
  if (eyeshadowColor) {
    const eyeshadowGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const eyeshadowMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(eyeshadowColor),
      roughness: 0.5,
      transparent: true,
      opacity: 0.55,
    });

    const leftEyeshadow = new THREE.Mesh(eyeshadowGeom, eyeshadowMat);
    leftEyeshadow.position.set(-0.28, 0.16, 0.55);
    leftEyeshadow.scale.set(1.2, 0.6, 0.25);
    leftEyeshadow.name = "eyeshadow-left";
    makeUpZones["eyeshadow-left"] = leftEyeshadow;
    faceParts.add(leftEyeshadow);

    const rightEyeshadow = new THREE.Mesh(eyeshadowGeom, eyeshadowMat.clone());
    rightEyeshadow.position.set(0.28, 0.16, 0.55);
    rightEyeshadow.scale.set(1.2, 0.6, 0.25);
    rightEyeshadow.name = "eyeshadow-right";
    makeUpZones["eyeshadow-right"] = rightEyeshadow;
    faceParts.add(rightEyeshadow);
  }

  const foundationColor = getColorFromEffect(completedEffects.foundation);
  if (foundationColor) {
    const foundationGeom = new THREE.SphereGeometry(0.86, 48, 48);
    const foundationMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(foundationColor),
      roughness: 0.6,
      transparent: true,
      opacity: 0.4,
    });
    const foundationMesh = new THREE.Mesh(foundationGeom, foundationMat);
    foundationMesh.scale.set(headScaleX, headScaleY, headScaleZ);
    foundationMesh.name = "foundation";
    makeUpZones.foundation = foundationMesh;
    faceParts.add(foundationMesh);
  }

  const browsProduct = getProductFromEffect(completedEffects.brows);
  const browsColor = browsProduct?.color || "#5A3A1C";
  if (completedEffects.brows) {
    const browGeom = new THREE.BoxGeometry(0.18, 0.03, 0.04);
    const browMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(browsColor),
      roughness: 0.9,
    });

    const leftBrow = new THREE.Mesh(browGeom, browMat);
    leftBrow.position.set(-0.28, 0.28, 0.6);
    leftBrow.rotation.z = 0.1;
    leftBrow.name = "brow-left";
    makeUpZones["brow-left"] = leftBrow;
    faceParts.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeom, browMat.clone());
    rightBrow.position.set(0.28, 0.28, 0.6);
    rightBrow.rotation.z = -0.1;
    rightBrow.name = "brow-right";
    makeUpZones["brow-right"] = rightBrow;
    faceParts.add(rightBrow);
  }

  const eyelinerProduct = getProductFromEffect(completedEffects.eyeliner);
  const eyelinerColor = eyelinerProduct?.color || "#2D1B0E";
  if (completedEffects.eyeliner) {
    const linerGeom = new THREE.BoxGeometry(0.26, 0.015, 0.02);
    const linerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(eyelinerColor),
      roughness: 0.3,
    });

    const leftLiner = new THREE.Mesh(linerGeom, linerMat);
    leftLiner.position.set(-0.28, 0.02, 0.7);
    leftLiner.rotation.z = 0.05;
    leftLiner.name = "eyeliner-left";
    makeUpZones["eyeliner-left"] = leftLiner;
    faceParts.add(leftLiner);

    const rightLiner = new THREE.Mesh(linerGeom, linerMat.clone());
    rightLiner.position.set(0.28, 0.02, 0.7);
    rightLiner.rotation.z = -0.05;
    rightLiner.name = "eyeliner-right";
    makeUpZones["eyeliner-right"] = rightLiner;
    faceParts.add(rightLiner);
  }

  if (completedEffects.mascara) {
    const lashGeom = new THREE.CylinderGeometry(0.004, 0.008, 0.08, 6);
    const lashMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 0.4,
    });

    for (let i = 0; i < 5; i++) {
      const lash = new THREE.Mesh(lashGeom, lashMat);
      lash.position.set(-0.4 + i * 0.06, 0.16, 0.74);
      lash.rotation.x = -0.3;
      lash.rotation.z = (i - 2) * 0.15;
      faceParts.add(lash);
    }
    for (let i = 0; i < 5; i++) {
      const lash = new THREE.Mesh(lashGeom, lashMat.clone());
      lash.position.set(0.16 + i * 0.06, 0.16, 0.74);
      lash.rotation.x = -0.3;
      lash.rotation.z = (i - 2) * -0.15;
      faceParts.add(lash);
    }
  }

  headGroup.add(faceParts);
  return { group: headGroup, faceParts, makeUpZones };
}
