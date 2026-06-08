import makeupStepsRaw from "./json/makeupSteps.json";
import productsRaw from "./json/products.json";
import toolsRaw from "./json/tools.json";
import characterOptionsRaw from "./json/characterOptions.json";
import {
  MakeupStep,
  MakeupStepRaw,
  ProductOption,
  DrawingTool,
  SkinToneOption,
  FaceShapeOption,
  SceneOption,
  OutfitStyleOption,
  OutfitColors,
  SceneDecoration,
  FaceShapeParams,
  SkinTone,
  FaceShape,
  Scene,
  OutfitStyle,
} from "@/types";

const productsData = productsRaw as Record<string, ProductOption[]>;
const toolsData = toolsRaw as Record<string, DrawingTool>;

export const PRODUCTS: Record<string, ProductOption[]> = productsData;
export const TOOLS: Record<string, DrawingTool> = toolsData;

function hydrateMakeupStep(raw: MakeupStepRaw): MakeupStep {
  const step: MakeupStep = {
    id: raw.id,
    name: raw.name,
    icon: raw.icon,
    description: raw.description,
    tip: raw.tip,
    effectKey: raw.effectKey,
    toolKey: raw.toolKey,
  };
  if (raw.productKey && productsData[raw.productKey]) {
    step.products = productsData[raw.productKey];
  }
  if (raw.toolKey && toolsData[raw.toolKey]) {
    step.drawingTool = toolsData[raw.toolKey];
  }
  if (raw.targetZones) {
    step.targetZones = raw.targetZones;
  }
  if (raw.drawingHint) {
    step.drawingHint = raw.drawingHint;
  }
  if (raw.coverageThreshold !== undefined) {
    step.coverageThreshold = raw.coverageThreshold;
  }
  return step;
}

export const MAKEUP_STEPS: MakeupStep[] = (makeupStepsRaw as MakeupStepRaw[]).map(hydrateMakeupStep);

const charOpts = characterOptionsRaw as {
  skinTones: Record<SkinTone, SkinToneOption>;
  faceShapes: Record<FaceShape, FaceShapeOption>;
  scenes: Record<Scene, SceneOption>;
  outfitStyles: Record<OutfitStyle, OutfitStyleOption>;
  outfitColors: Record<string, OutfitColors>;
  sceneDecorations: Record<Scene, SceneDecoration>;
  faceShapeParams: Record<string, FaceShapeParams>;
};

export const SKIN_TONE_LABELS: Record<string, SkinToneOption> = charOpts.skinTones;
export const FACE_SHAPE_LABELS: Record<string, FaceShapeOption> = charOpts.faceShapes;
export const SCENE_LABELS: Record<string, SceneOption> = charOpts.scenes;
export const OUTFIT_LABELS: Record<string, OutfitStyleOption> = charOpts.outfitStyles;

export function getSkinToneColors(skinTone: SkinTone | null | undefined): { c1: string; c2: string } {
  if (!skinTone || !charOpts.skinTones[skinTone]) {
    return { c1: "#FFE4CC", c2: "#FFCBA4" };
  }
  const opt = charOpts.skinTones[skinTone];
  return { c1: opt.color1, c2: opt.color2 };
}

export function getFaceShapeParams(shape: FaceShape | null | undefined): FaceShapeParams {
  if (!shape || !charOpts.faceShapeParams[shape]) {
    return charOpts.faceShapeParams.default;
  }
  return charOpts.faceShapeParams[shape];
}

export function getOutfitColors(outfit: OutfitStyle | null | undefined): OutfitColors {
  if (!outfit || !charOpts.outfitColors[outfit]) {
    return charOpts.outfitColors.default;
  }
  return charOpts.outfitColors[outfit];
}

export function getSceneDecor(scene: Scene | null | undefined): SceneDecoration | null {
  if (!scene || !charOpts.sceneDecorations[scene]) {
    return null;
  }
  return charOpts.sceneDecorations[scene];
}

export const SKIN_TONE_LIST: SkinToneOption[] = Object.values(charOpts.skinTones);
export const FACE_SHAPE_LIST: FaceShapeOption[] = Object.values(charOpts.faceShapes);
export const SCENE_LIST: SceneOption[] = Object.values(charOpts.scenes);
export const OUTFIT_STYLE_LIST: OutfitStyleOption[] = Object.values(charOpts.outfitStyles);
