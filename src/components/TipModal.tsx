import { X, Lightbulb } from "lucide-react";

interface TipModalProps {
  tip: string;
  stepName: string;
  onClose: () => void;
}

export default function TipModal({ tip, stepName, onClose }: TipModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bubble-tip bg-white rounded-3xl p-6 shadow-2xl border-4 border-pink-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 hover:bg-pink-200 text-pink-400 hover:text-pink-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-300 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-pink-400 font-bold mb-1">
                ✨ {stepName} 小技巧 ✨
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">{tip}</p>
            </div>
          </div>

          <div className="mt-5 flex justify-center gap-3">
            <span className="text-xl animate-sparkle">⭐</span>
            <span className="text-xl animate-sparkle" style={{ animationDelay: "0.2s" }}>
              💫
            </span>
            <span className="text-xl animate-sparkle" style={{ animationDelay: "0.4s" }}>
              ⭐
            </span>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-pink-300 to-pink-400 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            我学会啦！继续下一步 →
          </button>
        </div>
      </div>
    </div>
  );
}
