import React from "react";
import { renderSkincareLayer } from "./skincare";
import { renderPrimerLayer } from "./primer";
import { renderFoundationLayer } from "./foundation";
import { renderConcealerLayer } from "./concealer";
import { renderPowderLayer } from "./powder";
import { renderBrowsLayer } from "./brows";
import { renderEyeshadowLayer } from "./eyeshadow";
import { renderEyelinerLayer } from "./eyeliner";
import { renderMascaraLayer } from "./mascara";
import { renderBlushLayer } from "./blush";
import { renderLipstickLayer } from "./lipstick";
import { LayerRenderContext } from "./common";

export const LAYER_ORDER = [
  "skincare",
  "primer",
  "foundation",
  "concealer",
  "powder",
  "brows",
  "eyeshadow",
  "eyeliner",
  "mascara",
  "blush",
  "lipstick",
] as const;

export type LayerKey = (typeof LAYER_ORDER)[number];

const LAYER_RENDERERS: Record<LayerKey, (ctx: LayerRenderContext) => React.ReactNode> = {
  skincare: renderSkincareLayer,
  primer: renderPrimerLayer,
  foundation: renderFoundationLayer,
  concealer: renderConcealerLayer,
  powder: renderPowderLayer,
  brows: renderBrowsLayer,
  eyeshadow: renderEyeshadowLayer,
  eyeliner: renderEyelinerLayer,
  mascara: renderMascaraLayer,
  blush: renderBlushLayer,
  lipstick: renderLipstickLayer,
};

export function renderMakeupLayers(ctx: LayerRenderContext, onlyLayers?: LayerKey[]): React.ReactNode {
  const layers = onlyLayers || LAYER_ORDER;
  return layers.map((key) => (
    <React.Fragment key={key}>{LAYER_RENDERERS[key](ctx)}</React.Fragment>
  ));
}

export function renderMakeupLayer(key: LayerKey, ctx: LayerRenderContext): React.ReactNode {
  const renderer = LAYER_RENDERERS[key];
  return renderer ? renderer(ctx) : null;
}

export * from "./common";
