import React from "react";
import { LayerRenderContext, getColorFromEffect } from "./common";

export function renderEyelinerLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.eyeliner ? 1 : 0;
  const color = getColorFromEffect(ctx.effects.eyeliner, "#2D1B0E");
  return (
    <g className="makeup-layer eyeliner-layer" style={{ opacity }}>
      <path
        d="M 135 212 Q 145 207 155 208 Q 165 207 175 212"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 135 212 Q 133 213 132 215"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 175 212 Q 182 211 188 207 Q 192 204 195 202"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 225 212 Q 235 207 245 208 Q 255 207 265 212"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 265 212 Q 267 213 268 215"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 225 212 Q 218 211 212 207 Q 208 204 205 202"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}
