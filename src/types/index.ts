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
