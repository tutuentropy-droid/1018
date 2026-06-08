import React from "react";
import { LayerRenderContext, getColorFromEffect } from "./common";

export function renderConcealerLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.concealer ? 1 : 0;
  const color = getColorFromEffect(ctx.effects.concealer, "#FFE4CC");
  return (
    <g className="makeup-layer concealer-layer" style={{ opacity }}>
      <ellipse cx="155" cy="260" rx="22" ry="12" fill={color} opacity="0.7" />
      <ellipse cx="245" cy="260" rx="22" ry="12" fill={color} opacity="0.7" />
      <circle cx="280" cy="290" r="8" fill={color} opacity="0.8" />
    </g>
  );
}
