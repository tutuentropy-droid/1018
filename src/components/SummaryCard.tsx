import { Sparkles, RotateCcw } from "lucide-react";
import { MAKEUP_STEPS } from "@/data/steps";

interface SummaryCardProps {
  onRestart: () => void;
}

export default function SummaryCard({ onRestart }: SummaryCardProps) {
  return (
    <div className="w-full max-w-lg animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-300 via-lavender-200 to-peach-200 p-5 text-center relative overflow-hidden">
          <div className="absolute top-2 left-4 text-3xl animate-float">🌸</div>
          <div className="absolute top-4 right-6 text-2xl animate-float" style={{ animationDelay: "0.5s" }}>
            💄
          </div>
          <div className="absolute bottom-2 left-8 text-2xl animate-float" style={{ animationDelay: "1s" }}>
            ✨
          </div>
          <div className="absolute bottom-3 right-4 text-3xl animate-float" style={{ animationDelay: "1.5s" }}>
            🌷
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                恭喜你，化妆完成啦！
              </h2>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/90 text-sm font-medium">
              你已经掌握了完整的日常化妆流程 🎉
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-pink-500 mb-3 flex items-center gap-2">
              <span className="text-lg">📝</span>
              化妆流程总结
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {MAKEUP_STEPS.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-mint-50 border border-mint-100"
                >
                  <span className="text-base">{step.icon}</span>
                  <span className="text-xs font-medium text-gray-700">
                    {step.id}. {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-cream-50 to-pink-50 rounded-2xl p-4 mb-4 border border-pink-100">
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-bold text-pink-500">💡 温馨提示：</span>
              化妆最重要的是适合自己！多加练习，慢慢找到最适合你的风格和产品。记得每天认真卸妆哦~
            </p>
          </div>

          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            再玩一次
          </button>
        </div>
      </div>
    </div>
  );
}
