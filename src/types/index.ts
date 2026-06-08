export interface ProductOption {
  id: string;
  name: string;
  color?: string;
  color2?: string;
  previewColor?: string;
  icon?: string;
}

export interface TargetZone {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export interface DrawingTool {
  type: "brush" | "pencil" | "sponge" | "stick";
  icon: string;
  size: number;
  name: string;
}

export interface MakeupStepRaw {
  id: number;
  name: string;
  icon: string;
  description: string;
  tip: string;
  effectKey: string;
  productKey?: string;
  toolKey?: string;
  targetZones?: TargetZone[];
  drawingHint?: string;
  coverageThreshold?: number;
}

export interface MakeupStep {
  id: number;
  name: string;
  icon: string;
  description: string;
  tip: string;
  effectKey: string;
  products?: ProductOption[];
  drawingTool?: DrawingTool;
  targetZones?: TargetZone[];
  drawingHint?: string;
  coverageThreshold?: number;
}

export interface OutfitColors {
  c1: string;
  c2: string;
}

export interface SceneDecoration {
  top: string;
  bottom: string;
}

export interface FaceShapeParams {
  rx: number;
  ry: number;
  cheekCx1: number;
  cheekCx2: number;
  cheekCy: number;
  highlightCx: number;
  highlightCy: number;
}

export interface CompletedEffect {
  [key: string]: ProductOption | boolean;
}

export type SkinTone = "fair" | "natural" | "wheat";

export type FaceShape = "round" | "oval" | "square";

export type Scene = "commute" | "date" | "beach" | "meeting";

export type OutfitStyle = "casual" | "dress" | "suit" | "resort";

export interface CharacterProfile {
  skinTone: SkinTone | null;
  faceShape: FaceShape | null;
  scene: Scene | null;
  outfitStyle: OutfitStyle | null;
}

export interface SkinToneOption {
  id: SkinTone;
  name: string;
  color1: string;
  color2: string;
  icon: string;
}

export interface FaceShapeOption {
  id: FaceShape;
  name: string;
  icon: string;
  description: string;
}

export interface SceneOption {
  id: Scene;
  name: string;
  icon: string;
  description: string;
}

export interface OutfitStyleOption {
  id: OutfitStyle;
  name: string;
  icon: string;
  description: string;
}

export type GameMode = "guided" | "free";

export interface StepRecord {
  stepId: number;
  stepName: string;
  product?: ProductOption;
  completedAt: number;
}
