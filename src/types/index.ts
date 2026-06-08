export interface ProductOption {
  id: string;
  name: string;
  color?: string;
  color2?: string;
  previewColor?: string;
  icon?: string;
}

export interface MakeupStep {
  id: number;
  name: string;
  icon: string;
  description: string;
  tip: string;
  effectKey: string;
  products?: ProductOption[];
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
