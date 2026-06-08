import React from "react";
import { LayerRenderContext, getColorFromEffect } from "./common";

export function renderMascaraLayer(ctx: LayerRenderContext): React.ReactNode {
  const opacity = ctx.effects.mascara ? 1 : 0;
  const color = getColorFromEffect(ctx.effects.eyeliner || ctx.effects.mascara, "#2D1B0E");
  return (
    <g className="makeup-layer mascara-layer" style={{ opacity }}>
      <path d="M 135 210 L 132 200" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 142 208 L 140 196" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 150 206 L 150 193" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 158 206 L 160 193" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 166 208 L 170 196" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 173 210 L 178 200" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

      <path d="M 227 210 L 222 200" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 234 208 L 230 196" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 242 206 L 240 193" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 250 206 L 250 193" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 258 208 L 260 196" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 265 210 L 268 200" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

      <path d="M 140 240 L 138 248" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 155 243 L 155 252" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 170 240 L 172 248" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 230 240 L 228 248" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 245 243 L 245 252" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 260 240 L 262 248" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}
