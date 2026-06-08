import { useState } from "react";
import { MakeupStep, ProductOption } from "@/types";
import { Check, ShoppingBag, X } from "lucide-react";
import Shelf3D from "./three/Shelf3D";

interface ProductSelectionModalProps {
  step: MakeupStep;
  onSelect: (product: ProductOption) => void;
}

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

  const selectedProduct = step.products.find((p) => p.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="relative max-w-2xl w-full animate-pop">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-300 via-lavender-200 to-peach-200 p-5 text-center relative overflow-hidden">
            <div className="absolute top-2 left-4 text-2xl animate-float">🛍️</div>
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
                从3D悬浮货架中点击选择你喜欢的产品~
              </p>
            </div>
          </div>

          <div className="p-5">
            <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-lavender-50 border-2 border-pink-100 flex items-center gap-3">
              <div className="text-3xl">🎨</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-pink-600">
                  3D沉浸式产品货架
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {step.drawingHint || "点击产品瓶身进行选择，选中后点击确认按钮~"}
                </p>
              </div>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden border-2 border-pink-100 bg-gradient-to-b from-pink-50/80 to-lavender-50/80"
              style={{ height: "340px" }}
            >
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-pink-500 shadow-sm border border-pink-100">
                  💡 点击产品瓶身选择
                </div>
              </div>
              <Shelf3D
                products={step.products}
                onSelect={(product) => setSelectedId(product.id)}
                selectedId={selectedId}
                productCategory={step.effectKey}
              />
            </div>

            {selectedProduct && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 flex items-center gap-4 animate-pop">
                <div className="relative flex-shrink-0">
                  <div
                    className="w-16 h-16 rounded-full shadow-inner border-4 border-white flex items-center justify-center"
                    style={{
                      background: selectedProduct.color2
                        ? `linear-gradient(135deg, ${selectedProduct.color}, ${selectedProduct.color2})`
                        : selectedProduct.previewColor || "#FFE4E9",
                    }}
                  >
                    {selectedProduct.icon && (
                      <span className="text-2xl">{selectedProduct.icon}</span>
                    )}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-pink-600">
                    已选择：{selectedProduct.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    点击下方确认按钮，开始化妆体验~
                  </p>
                </div>
              </div>
            )}

            {!selectedProduct && (
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center gap-2">
                <X className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">
                  请在上方3D货架中点击选择一款产品
                </p>
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className={`mt-4 w-full py-3.5 rounded-2xl font-bold text-base shadow-lg transition-all duration-300 ${
                selectedId
                  ? "bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {selectedId ? "确定选择，开始化妆 ✨" : "请先在3D货架中选择一款产品~"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
