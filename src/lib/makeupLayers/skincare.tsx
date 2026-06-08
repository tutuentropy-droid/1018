import React from "react";
import { LayerRenderContext } from "./common";

export function renderSkincareLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.skincare ? 1 : 0;
  return (
    <g className="makeup-layer skincare-layer" style={{ opacity }}>
      <ellipse cx="160" cy="200" rx="25" ry="15" fill="white" opacity="0.4" />
      <ellipse cx="240" cy="200" rx="25" ry="15" fill="white" opacity="0.4" />
      <circle cx="155" cy="195" r="5" fill="white" opacity="0.6" />
      <circle cx="245" cy="195" r="5" fill="white" opacity="0.6" />
    </g>
  );
}
