import { CompletedEffect, ProductOption, FaceShape } from "@/types";
import { getSkinToneColors, getFaceShapeParams } from "@/data";

export interface LayerRenderContext {
  effects: CompletedEffect;
  faceShape?: FaceShape | null;
  gradientSuffix?: string;
}

export function getEffectProduct(effect: ProductOption | boolean | undefined): ProductOption | null {
  if (!effect || typeof effect === "boolean") return null;
  return effect;
}

export function getColorFromEffect(
  effect: ProductOption | boolean | undefined,
  defaultColor: string,
  useColor2 = false
): string {
  const product = getEffectProduct(effect);
  if (!product) return defaultColor;
  return useColor2
    ? product.color2 || product.color || product.previewColor || defaultColor
    : product.color || product.previewColor || defaultColor;
}

export function getBaseSkin(skinTone: any) {
  return getSkinToneColors(skinTone);
}

export function getFaceParams(shape: FaceShape | null | undefined) {
  return getFaceShapeParams(shape);
}

export function hasEffect(ctx: LayerRenderContext, key: string): boolean {
  return !!ctx.effects[key];
}

export function layerOpacity(ctx: LayerRenderContext, key: string, offValue = 0, onValue = 1): number {
  return hasEffect(ctx, key) ? onValue : offValue;
}
