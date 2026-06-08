import React from "react";
import { LayerRenderContext, getColorFromEffect, getFaceParams } from "./common";

export function renderPrimerLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.primer ? 1 : 0;
  const primerColor = getColorFromEffect(ctx.effects.primer, "#FFF5F0");
  const face = getFaceParams(ctx.faceShape);
  return (
    <g className="makeup-layer primer-layer" style={{ opacity }}>
      <ellipse cx="200" cy="230" rx={face.rx} ry={face.ry} fill={primerColor} opacity="0.25" />
    </g>
  );
}
