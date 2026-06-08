import { useState } from "react";
import { MakeupStep, ProductOption } from "@/types";
import { Check, ShoppingBag } from "lucide-react";
import { getToolIcon } from "@/components/MakeupTools";

interface ProductSelectionModalProps {
  step: MakeupStep;
  onSelect: (product: ProductOption) => void;
}

const TOOL_ANIMATION_MAP: Record<string, string> = {
  brushLarge: "animate-brush-swing",
  brushMedium: "animate-brush-swing",
  brushSmall: "animate-brush-swing",
  brushBlush: "animate-brush-swing",
  concealerBrush: "animate-brush-swing",
  sponge: "animate-sponge-press",
  pencil: "animate-pencil-write",
  eyelinerPen: "animate-pencil-write",
  mascaraWand: "animate-mascara-wiggle",
  lipstick: "animate-lipstick-apply",
  skincarePad: "animate-pad-pat",
};

export default function ProductSelectionModal({
  step,
  onSelect,
}: ProductSelectionModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedId || !step.products) return;
    const product = step.products.find((p) => p.id === selectedId);
    if (product) {
      onSelect(product);
    }
  };

  if (!step.products || step.products.length === 0) {
    return null;
  }

  const toolKey = step.toolKey;
  const toolAnimationClass = toolKey ? TOOL_ANIMATION_MAP[toolKey] || "" : "";
  const toolName = step.drawingTool?.name;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-lg w-full animate-pop">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-300 via-lavender-200 to-peach-200 p-5 text-center relative overflow-hidden">
            <div className="absolute top-2 left-4 text-2xl animate-float">🎨</div>
            <div className="absolute top-3 right-5 text-2xl animate-float" style={{ animationDelay: "0.5s" }}>
              ✨
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShoppingBag className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white drop-shadow-md">
                  选择{step.name}产品
                </h2>
              </div>
              <p className="text-white/90 text-sm">
                请从下面选择一款你喜欢的产品~
              </p>
            </div>
          </div>

          <div className="p-5">
            {toolKey && (
              <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-lavender-50 border-2 border-pink-100 flex items-center gap-3">
                <div className="tool-demo-container flex-shrink-0">
                  <div className={`${toolAnimationClass}`}>
                    {getToolIcon(toolKey, 36)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-pink-600">
                    接下来用「{toolName}」上妆
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {step.drawingHint || "选择产品后开始化妆吧~"}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {step.products.map((product) => {
                const isSelected = selectedId === product.id;
                return (
                  <button
                    key={product.id}
                    onClick={() => setSelectedId(product.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                      isSelected
                        ? "border-pink-400 bg-pink-50 shadow-lg scale-[1.03]"
                        : "border-pink-100 bg-white hover:border-pink-200 hover:shadow-md hover:scale-[1.02]"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-full shadow-inner border-2 border-white flex items-center justify-center"
                        style={{
                          background: product.color2
                            ? `linear-gradient(135deg, ${product.color}, ${product.color2})`
                            : product.previewColor || "#FFE4E9",
                        }}
                      >
                        {product.icon && (
                          <span className="text-2xl">{product.icon}</span>
                        )}
                      </div>
                      {toolKey && (
                        <div className="absolute -bottom-1 -right-2 w-7 h-7 rounded-full bg-white border-2 border-pink-200 flex items-center justify-center shadow-sm">
                          <div className={`${toolAnimationClass}`}>
                            {getToolIcon(toolKey, 22)}
                          </div>
                        </div>
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium text-center leading-tight ${
                        isSelected ? "text-pink-600" : "text-gray-600"
                      }`}
                    >
                      {product.name}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className={`w-full py-3.5 rounded-2xl font-bold text-base shadow-lg transition-all duration-300 ${
                selectedId
                  ? "bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {selectedId ? "确定选择，完成这一步 ✨" : "请先选择一款产品~"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
