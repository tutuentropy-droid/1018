import React from "react";
import { LayerRenderContext, getColorFromEffect, getFaceParams } from "./common";

export function renderFoundationLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.foundation ? 1 : 0;
  const suffix = ctx.gradientSuffix || "";
  const gradientId = `foundationGradient${suffix}`;
  const color1 = getColorFromEffect(ctx.effects.foundation, "#FFE8D6");
  const color2 = getColorFromEffect(ctx.effects.foundation, "#FFD9B8", true);
  const face = getFaceParams(ctx.faceShape);
  return (
    <g className="makeup-layer foundation-layer" style={{ opacity }}>
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </radialGradient>
      </defs>
      <ellipse cx="200" cy="230" rx={face.rx} ry={face.ry} fill={`url(#${gradientId})`} opacity="0.85" />
    </g>
  );
}
