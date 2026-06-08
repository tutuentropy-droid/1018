import React from "react";
import { LayerRenderContext, getColorFromEffect } from "./common";

export function renderBrowsLayer(ctx: LayerRenderContext): React.ReactNode {
  const active = !!ctx.effects.brows;
  const opacity = active ? 1 : 0.2;
  const filter = active ? undefined : `url(#softGlow${ctx.gradientSuffix || ""})`;
  const color = getColorFromEffect(ctx.effects.brows, "#5A3A1C");
  const fallbackColor = "#8B6F5C";
  const fill = active ? color : fallbackColor;
  return (
    <g className="makeup-layer brows-layer" style={{ opacity }} filter={filter}>
      <path d="M 125 185 Q 145 170 175 175 Q 155 182 125 195 Z" fill={fill} strokeWidth="2" />
      <path d="M 275 185 Q 255 170 225 175 Q 245 182 275 195 Z" fill={fill} strokeWidth="2" />
      {active && (
        <>
          <path d="M 128 188 L 140 180" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 135 186 L 150 178" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 145 183 L 160 176" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 272 188 L 260 180" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 265 186 L 250 178" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 255 183 L 240 176" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}
