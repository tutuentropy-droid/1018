import React from "react";
import { LayerRenderContext, getColorFromEffect, getFaceParams } from "./common";

export function renderPowderLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.powder ? 1 : 0;
  const color = getColorFromEffect(ctx.effects.powder, "#FFF8F0");
  const face = getFaceParams(ctx.faceShape);
  return (
    <g className="makeup-layer powder-layer" style={{ opacity }}>
      <ellipse cx="200" cy="230" rx={face.rx} ry={face.ry} fill={color} opacity="0.18" />
    </g>
  );
}
