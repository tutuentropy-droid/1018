import { Check } from "lucide-react";
import { MakeupStep } from "@/types";

interface StepCardProps {
  step: MakeupStep;
  isCompleted: boolean;
  isWrong: boolean;
  onClick: () => void;
}

export default function StepCard({
  step,
  isCompleted,
  isWrong,
  onClick,
}: StepCardProps) {
  const getCardStyle = () => {
    if (isWrong) {
      return "bg-red-50 border-red-300 shadow-red-100 animate-shake";
    }
    if (isCompleted) {
      return "bg-mint-50 border-mint-200 shadow-mint-100";
    }
    return "bg-white border-pink-100 hover:border-pink-300 hover:shadow-pink-200 shadow-pink-100 cursor-pointer";
  };

  const getNumberStyle = () => {
    if (isWrong) {
      return "bg-red-200 text-red-500";
    }
    if (isCompleted) {
      return "bg-mint-200 text-mint-300";
    }
    return "bg-pink-100 text-pink-400";
  };

  return (
    <button
      onClick={onClick}
      disabled={isCompleted}
      className={`step-card w-full p-4 rounded-2xl border-2 text-left transition-all duration-300 shadow-md ${getCardStyle()} ${
        isCompleted ? "cursor-default opacity-90" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getNumberStyle()}`}
        >
          {isCompleted ? (
            <Check className="w-5 h-5 text-mint-300" strokeWidth={3} />
          ) : (
            step.id
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{step.icon}</span>
            <h3
              className={`font-bold text-base truncate ${
                isWrong
                  ? "text-red-500"
                  : isCompleted
                  ? "text-mint-300"
                  : "text-gray-700"
              }`}
            >
              {step.name}
            </h3>
          </div>
          <p
            className={`text-xs truncate ${
              isWrong ? "text-red-400" : isCompleted ? "text-mint-300" : "text-gray-500"
            }`}
          >
            {step.description}
          </p>
        </div>

        {isCompleted && (
          <div className="flex-shrink-0 text-mint-300 text-sm font-bold">
            已完成 ✓
          </div>
        )}
        {isWrong && (
          <div className="flex-shrink-0 text-red-400 text-sm font-bold animate-pulse">
            顺序不对！
          </div>
        )}
      </div>
    </button>
  );
}
