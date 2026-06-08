import { useState, useRef, useEffect, useCallback } from "react";
import { MakeupStep, ProductOption, TargetZone, CompletedEffect, CharacterProfile } from "@/types";

interface MakeupDrawingCanvasProps {
  step: MakeupStep;
  selectedProduct: ProductOption | null;
  effects: CompletedEffect;
  characterProfile?: CharacterProfile;
  onComplete: () => void;
  onCancel: () => void;
}

interface StrokePoint {
  x: number;
  y: number;
  timestamp: number;
}

const VIEWBOX_WIDTH = 400;
const VIEWBOX_HEIGHT = 480;

function isPointInEllipse(px: number, py: number, zone: TargetZone): boolean {
  const dx = (px - zone.cx) / zone.rx;
  const dy = (py - zone.cy) / zone.ry;
  return dx * dx + dy * dy <= 1;
}

function calculateCoverage(points: StrokePoint[], zones: TargetZone[], toolSize: number): number {
  if (zones.length === 0) return 100;

  const gridSize = 4;
  let coveredPoints = 0;
  let totalGridPoints = 0;

  zones.forEach((zone) => {
    for (let gx = zone.cx - zone.rx; gx <= zone.cx + zone.rx; gx += gridSize) {
      for (let gy = zone.cy - zone.ry; gy <= zone.cy + zone.ry; gy += gridSize) {
        if (isPointInEllipse(gx, gy, zone)) {
          totalGridPoints++;
          const covered = points.some((p) => {
            const dist = Math.sqrt((p.x - gx) ** 2 + (p.y - gy) ** 2);
            return dist <= toolSize;
          });
          if (covered) coveredPoints++;
        }
      }
    }
  });

  if (totalGridPoints === 0) return 100;
  return Math.min(100, Math.round((coveredPoints / totalGridPoints) * 100));
}

export default function MakeupDrawingCanvas({
  step,
  selectedProduct,
  effects,
  characterProfile,
  onComplete,
  onCancel,
}: MakeupDrawingCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokePoints, setStrokePoints] = useState<StrokePoint[]>([]);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [coverage, setCoverage] = useState(0);
  const [toolPicked, setToolPicked] = useState(false);
  const hasCompletedRef = useRef(false);

  const toolSize = step.drawingTool?.size ?? 20;
  const threshold = step.coverageThreshold ?? 70;

  const getSvgCoords = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;

    const rect = svg.getBoundingClientRect();
    const scaleX = VIEWBOX_WIDTH / rect.width;
    const scaleY = VIEWBOX_HEIGHT / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return { x, y };
  }, []);

  const handleToolAreaMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setToolPicked(true);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!toolPicked) return;
      e.preventDefault();

      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const coords = getSvgCoords(clientX, clientY);
      if (!coords) return;

      setIsDrawing(true);
      setCurrentPos(coords);
      setStrokePoints((prev) => [...prev, { ...coords, timestamp: Date.now() }]);
    },
    [toolPicked, getSvgCoords]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const coords = getSvgCoords(clientX, clientY);
      if (!coords) return;

      setCurrentPos(coords);

      if (isDrawing) {
        setStrokePoints((prev) => [...prev, { ...coords, timestamp: Date.now() }]);
      }
    },
    [isDrawing, getSvgCoords]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  useEffect(() => {
    if (strokePoints.length > 0 && step.targetZones) {
      const cov = calculateCoverage(strokePoints, step.targetZones, toolSize);
      setCoverage(cov);

      if (cov >= threshold && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setTimeout(() => onComplete(), 600);
      }
    }
  }, [strokePoints, step.targetZones, toolSize, threshold, onComplete]);

  const getProductColor = (): string => {
    if (!selectedProduct) return "#FFB6C1";
    return selectedProduct.color || selectedProduct.previewColor || "#FFB6C1";
  };

  const productColor = getProductColor();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-lg w-full animate-pop">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-300 via-lavender-200 to-peach-200 p-4 text-center relative overflow-hidden">
            <h2 className="text-xl font-bold text-white drop-shadow-md mb-1">
              ✨ {step.name}
            </h2>
            <p className="text-white/90 text-sm">
              {step.drawingHint || "拖动工具到正确的位置进行化妆~"}
            </p>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">完成度</span>
                <span className="text-sm font-bold text-pink-500">{coverage}% / {threshold}%</span>
              </div>
              <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    coverage >= threshold
                      ? "bg-gradient-to-r from-green-400 to-emerald-400"
                      : "bg-gradient-to-r from-pink-400 to-rose-400"
                  }`}
                  style={{ width: `${coverage}%` }}
                />
              </div>
            </div>

            <div className="relative select-none" style={{ touchAction: "none" }}>
              {!toolPicked && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-2xl">
                  <div className="text-center">
                    <div
                      className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform animate-float"
                      onMouseDown={handleToolAreaMouseDown}
                      onTouchStart={handleToolAreaMouseDown}
                    >
                      <span className="text-4xl">{step.drawingTool?.icon || "🖌️"}</span>
                    </div>
                    <p className="text-sm font-bold text-pink-600">点击拿起 {step.drawingTool?.name || "化妆工具"}</p>
                    <p className="text-xs text-gray-500 mt-1">然后在面部拖动涂抹~</p>
                  </div>
                </div>
              )}

              <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="relative w-full max-w-sm mx-auto h-auto drop-shadow-2xl"
                xmlns="http://www.w3.org/2000/svg"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
              >
                <AvatarSVGInner effects={effects} characterProfile={characterProfile} />

                {step.targetZones && toolPicked && (
                  <g className="target-zones-layer">
                    {step.targetZones.map((zone, idx) => (
                      <ellipse
                        key={idx}
                        cx={zone.cx}
                        cy={zone.cy}
                        rx={zone.rx}
                        ry={zone.ry}
                        fill={productColor}
                        opacity={0.15}
                        stroke={productColor}
                        strokeWidth="2"
                        strokeDasharray="6 4"
                        className="animate-pulse-slow"
                      />
                    ))}
                  </g>
                )}

                {strokePoints.length > 1 && (
                  <g className="strokes-layer" style={{ pointerEvents: "none" }}>
                    {strokePoints.map((point, idx) => {
                      if (idx === 0) return null;
                      const prev = strokePoints[idx - 1];
                      const opacity = Math.min(1, 0.3 + 0.4 * (idx / strokePoints.length));
                      return (
                        <line
                          key={idx}
                          x1={prev.x}
                          y1={prev.y}
                          x2={point.x}
                          y2={point.y}
                          stroke={productColor}
                          strokeWidth={toolSize}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity={opacity}
                        />
                      );
                    })}
                    {strokePoints.map((point, idx) => (
                      <circle
                        key={`dot-${idx}`}
                        cx={point.x}
                        cy={point.y}
                        r={toolSize / 2}
                        fill={productColor}
                        opacity={0.25}
                      />
                    ))}
                  </g>
                )}

                {toolPicked && currentPos && (
                  <g style={{ pointerEvents: "none" }} className="tool-cursor">
                    <circle
                      cx={currentPos.x}
                      cy={currentPos.y}
                      r={toolSize}
                      fill="none"
                      stroke={productColor}
                      strokeWidth="2"
                      opacity="0.6"
                    />
                    <circle
                      cx={currentPos.x}
                      cy={currentPos.y}
                      r={toolSize / 2}
                      fill={productColor}
                      opacity="0.3"
                    />
                  </g>
                )}
              </svg>

              {toolPicked && !isDrawing && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-pink-400/90 text-white text-xs rounded-full shadow-lg animate-bounce-slow">
                  👆 在高亮区域拖动涂抹~
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-2xl font-bold bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              {strokePoints.length > 0 && (
                <button
                  onClick={() => {
                    setStrokePoints([]);
                    setCoverage(0);
                    hasCompletedRef.current = false;
                  }}
                  className="flex-1 py-3 rounded-2xl font-bold bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                >
                  🔄 重画
                </button>
              )}
              {coverage >= threshold && (
                <button
                  onClick={onComplete}
                  className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  完成 ✨
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AvatarSVGInner({ effects, characterProfile }: { effects: CompletedEffect; characterProfile?: CharacterProfile }) {
  const skincareEffect = !!effects.skincare;
  const primerEffect = !!effects.primer;
  const foundationEffect = !!effects.foundation;
  const concealerEffect = !!effects.concealer;
  const powderEffect = !!effects.powder;
  const browsEffect = !!effects.brows;
  const eyeshadowEffect = !!effects.eyeshadow;
  const eyelinerEffect = !!effects.eyeliner;
  const mascaraEffect = !!effects.mascara;
  const blushEffect = !!effects.blush;
  const lipstickEffect = !!effects.lipstick;

  const skinTone = characterProfile?.skinTone;
  const faceShape = characterProfile?.faceShape;
  const outfit = characterProfile?.outfitStyle;

  const baseSkin = skinTone
    ? {
        fair: { c1: "#FFE8D6", c2: "#FFD9B8" },
        natural: { c1: "#FFD9B8", c2: "#F5C49A" },
        wheat: { c1: "#E8B88F", c2: "#D4A373" },
      }[skinTone]
    : { c1: "#FFE4CC", c2: "#FFCBA4" };

  const faceParams = (() => {
    switch (faceShape) {
      case "round":
        return { rx: 135, ry: 140, cheekCx1: 105, cheekCx2: 295, cheekCy: 270 };
      case "oval":
        return { rx: 118, ry: 155, cheekCx1: 115, cheekCx2: 285, cheekCy: 280 };
      case "square":
        return { rx: 130, ry: 135, cheekCx1: 108, cheekCx2: 292, cheekCy: 285 };
      default:
        return { rx: 125, ry: 145, cheekCx1: 115, cheekCx2: 285, cheekCy: 275 };
    }
  })();

  const getEffectColor = (key: keyof CompletedEffect, defaultColor: string) => {
    const eff = effects[key];
    if (!eff || typeof eff === "boolean") return defaultColor;
    return eff.color || eff.previewColor || defaultColor;
  };
  const getEffectColor2 = (key: keyof CompletedEffect, defaultColor: string) => {
    const eff = effects[key];
    if (!eff || typeof eff === "boolean") return defaultColor;
    return eff.color2 || eff.color || eff.previewColor || defaultColor;
  };

  const foundationColor1 = getEffectColor("foundation", baseSkin.c1);
  const foundationColor2 = getEffectColor2("foundation", baseSkin.c2);
  const primerColor = getEffectColor("primer", "#FFF5F0");
  const concealerColor = getEffectColor("concealer", baseSkin.c1);
  const powderColor = getEffectColor("powder", "#FFF8F0");
  const browsColor = getEffectColor("brows", "#5A3A1C");
  const eyeshadowColor1 = getEffectColor("eyeshadow", "#FFB6C1");
  const eyeshadowColor2 = getEffectColor2("eyeshadow", "#FF9AAF");
  const eyelinerColor = getEffectColor("eyeliner", "#2D1B0E");
  const blushColor1 = getEffectColor("blush", "#FFB6C1");
  const blushColor2 = getEffectColor2("blush", "#FF9AAF");
  const lipstickColor1 = getEffectColor("lipstick", "#FF6B8A");
  const lipstickColor2 = getEffectColor2("lipstick", "#E85070");

  const outfitColors = (() => {
    switch (outfit) {
      case "casual":
        return { c1: "#93C5FD", c2: "#60A5FA" };
      case "dress":
        return { c1: "#F9A8D4", c2: "#EC4899" };
      case "suit":
        return { c1: "#A5B4FC", c2: "#6366F1" };
      case "resort":
        return { c1: "#86EFAC", c2: "#22C55E" };
      default:
        return { c1: "#FBCFE8", c2: "#F9A8D4" };
    }
  })();
  const showOutfit = !!outfit;

  return (
    <>
      <defs>
        <radialGradient id="faceGradient_drawing" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={baseSkin.c1} />
          <stop offset="100%" stopColor={baseSkin.c2} />
        </radialGradient>
        <radialGradient id="foundationGradient_drawing" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={foundationColor1} />
          <stop offset="100%" stopColor={foundationColor2} />
        </radialGradient>
        <linearGradient id="hairGradient_drawing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B4423" />
          <stop offset="100%" stopColor="#4A2F17" />
        </linearGradient>
        <linearGradient id="eyeshadowGradient_drawing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={eyeshadowColor1} />
          <stop offset="100%" stopColor={eyeshadowColor2} />
        </linearGradient>
        <linearGradient id="lipstickGradient_drawing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lipstickColor1} />
          <stop offset="100%" stopColor={lipstickColor2} />
        </linearGradient>
        <linearGradient id="blushGradient_drawing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={blushColor1} />
          <stop offset="100%" stopColor={blushColor2} />
        </linearGradient>
        <linearGradient id="outfitGradient_drawing" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={outfitColors.c1} />
          <stop offset="100%" stopColor={outfitColors.c2} />
        </linearGradient>
        <filter id="softGlow_drawing" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {showOutfit && (
        <g style={{ opacity: 1 }}>
          {outfit === "dress" && (
            <path d="M 80 400 Q 100 380 150 385 L 200 370 L 250 385 Q 300 380 320 400 L 340 475 L 60 475 Z" fill="url(#outfitGradient_drawing)" opacity="0.9" />
          )}
          {outfit === "casual" && (
            <>
              <path d="M 90 395 Q 120 380 200 380 Q 280 380 310 395 L 320 475 L 80 475 Z" fill="url(#outfitGradient_drawing)" opacity="0.9" />
              <path d="M 160 380 L 200 365 L 240 380 L 230 395 L 200 388 L 170 395 Z" fill={outfitColors.c2} opacity="0.6" />
            </>
          )}
          {outfit === "suit" && (
            <>
              <path d="M 85 395 Q 115 380 200 380 Q 285 380 315 395 L 325 475 L 75 475 Z" fill="url(#outfitGradient_drawing)" opacity="0.95" />
              <path d="M 155 380 L 200 368 L 245 380 L 230 475 L 200 475 L 170 475 Z" fill="white" opacity="0.9" />
              <circle cx="200" cy="410" r="3" fill={outfitColors.c2} />
              <circle cx="200" cy="435" r="3" fill={outfitColors.c2} />
              <circle cx="200" cy="460" r="3" fill={outfitColors.c2} />
            </>
          )}
          {outfit === "resort" && (
            <>
              <path d="M 70 405 Q 100 382 170 388 L 200 372 L 230 388 Q 300 382 330 405 L 350 475 L 50 475 Z" fill="url(#outfitGradient_drawing)" opacity="0.85" />
            </>
          )}
        </g>
      )}

      <g>
        <ellipse cx="200" cy="200" rx={faceParams.rx + 35} ry={faceParams.ry + 35} fill="url(#hairGradient_drawing)" />
        <path d="M 60 220 Q 40 180 60 120 Q 80 60 200 50 Q 320 60 340 120 Q 360 180 340 220" fill="url(#hairGradient_drawing)" />
      </g>

      <g>
        <ellipse cx="200" cy="230" rx={faceParams.rx} ry={faceParams.ry} fill="url(#faceGradient_drawing)" />
      </g>

      <g>
        <path d="M 85 140 Q 100 80 200 70 Q 300 80 315 140 Q 290 130 250 145 Q 220 160 200 150 Q 180 160 150 145 Q 110 130 85 140" fill="url(#hairGradient_drawing)" />
        <path d="M 90 150 Q 110 130 140 155 Q 130 180 100 190 Q 85 175 90 150" fill="#5A3A1C" />
        <path d="M 310 150 Q 290 130 260 155 Q 270 180 300 190 Q 315 175 310 150" fill="#5A3A1C" />
      </g>

      <g>
        <ellipse cx={200 - faceParams.rx + 8} cy="240" rx="15" ry="25" fill="url(#faceGradient_drawing)" />
        <ellipse cx={200 + faceParams.rx - 8} cy="240" rx="15" ry="25" fill="url(#faceGradient_drawing)" />
      </g>

      <g style={{ opacity: skincareEffect ? 1 : 0 }}>
        <ellipse cx="160" cy="200" rx="25" ry="15" fill="white" opacity="0.4" />
        <ellipse cx="240" cy="200" rx="25" ry="15" fill="white" opacity="0.4" />
      </g>

      <g style={{ opacity: primerEffect ? 1 : 0 }}>
        <ellipse cx="200" cy="230" rx={faceParams.rx} ry={faceParams.ry} fill={primerColor} opacity="0.25" />
      </g>

      <g style={{ opacity: foundationEffect ? 1 : 0 }}>
        <ellipse cx="200" cy="230" rx={faceParams.rx} ry={faceParams.ry} fill="url(#foundationGradient_drawing)" opacity="0.85" />
      </g>

      <g style={{ opacity: concealerEffect ? 1 : 0 }}>
        <ellipse cx="155" cy="260" rx="22" ry="12" fill={concealerColor} opacity="0.7" />
        <ellipse cx="245" cy="260" rx="22" ry="12" fill={concealerColor} opacity="0.7" />
        <circle cx="280" cy="290" r="8" fill={concealerColor} opacity="0.8" />
      </g>

      <g style={{ opacity: powderEffect ? 1 : 0 }}>
        <ellipse cx="200" cy="230" rx={faceParams.rx} ry={faceParams.ry} fill={powderColor} opacity="0.18" />
      </g>

      <g style={{ opacity: browsEffect ? 1 : 0.2 }} filter={browsEffect ? undefined : "url(#softGlow_drawing)"}>
        <path d="M 125 185 Q 145 170 175 175 Q 155 182 125 195 Z" fill={browsEffect ? browsColor : "#8B6F5C"} />
        <path d="M 275 185 Q 255 170 225 175 Q 245 182 275 195 Z" fill={browsEffect ? browsColor : "#8B6F5C"} />
      </g>

      <g style={{ opacity: eyeshadowEffect ? 1 : 0 }}>
        <ellipse cx="155" cy="215" rx="30" ry="18" fill="url(#eyeshadowGradient_drawing)" opacity="0.7" />
        <ellipse cx="245" cy="215" rx="30" ry="18" fill="url(#eyeshadowGradient_drawing)" opacity="0.7" />
      </g>

      <g>
        <ellipse cx="155" cy="225" rx="22" ry="18" fill="white" />
        <ellipse cx="245" cy="225" rx="22" ry="18" fill="white" />
        <circle cx="155" cy="227" r="10" fill="#5D4037" />
        <circle cx="245" cy="227" r="10" fill="#5D4037" />
        <circle cx="155" cy="227" r="5" fill="#2D1B0E" />
        <circle cx="245" cy="227" r="5" fill="#2D1B0E" />
        <circle cx="152" cy="224" r="3" fill="white" />
        <circle cx="242" cy="224" r="3" fill="white" />
      </g>

      <g style={{ opacity: eyelinerEffect ? 1 : 0 }}>
        <path d="M 135 212 Q 145 207 155 208 Q 165 207 175 212" fill="none" stroke={eyelinerColor} strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 225 212 Q 235 207 245 208 Q 255 207 265 212" fill="none" stroke={eyelinerColor} strokeWidth="3.5" strokeLinecap="round" />
      </g>

      <g style={{ opacity: mascaraEffect ? 1 : 0 }}>
        <path d="M 135 210 L 132 200" stroke={eyelinerColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 150 206 L 150 193" stroke={eyelinerColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 166 208 L 170 196" stroke={eyelinerColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 227 210 L 222 200" stroke={eyelinerColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 242 206 L 240 193" stroke={eyelinerColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 258 208 L 260 196" stroke={eyelinerColor} strokeWidth="2.5" strokeLinecap="round" />
      </g>

      <g style={{ opacity: blushEffect ? 1 : 0 }}>
        <ellipse cx={faceParams.cheekCx1} cy={faceParams.cheekCy} rx="28" ry="18" fill="url(#blushGradient_drawing)" opacity="0.55" />
        <ellipse cx={faceParams.cheekCx2} cy={faceParams.cheekCy} rx="28" ry="18" fill="url(#blushGradient_drawing)" opacity="0.55" />
      </g>

      <g>
        <path d="M 200 240 Q 192 270 188 285 Q 195 295 200 295 Q 205 295 212 285 Q 208 270 200 240" fill="none" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g style={{ opacity: lipstickEffect ? 0.3 : 1 }}>
        <path d="M 170 325 Q 185 315 200 320 Q 215 315 230 325 Q 225 340 200 342 Q 175 340 170 325" fill={lipstickEffect ? "#E8B4B8" : "#F0B0A8"} />
      </g>

      <g style={{ opacity: lipstickEffect ? 1 : 0 }} filter="url(#softGlow_drawing)">
        <path d="M 165 322 Q 180 308 200 315 Q 220 308 235 322 Q 230 330 220 326 Q 210 332 200 328 Q 190 332 180 326 Q 170 330 165 322" fill="url(#lipstickGradient_drawing)" />
        <path d="M 168 325 Q 185 318 200 322 Q 215 318 232 325 Q 228 345 200 350 Q 172 345 168 325" fill="url(#lipstickGradient_drawing)" />
      </g>
    </>
  );
}
