import { useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, HelpCircle, User } from "lucide-react";
import Avatar from "@/components/Avatar";
import StepList from "@/components/StepList";
import TipModal from "@/components/TipModal";
import SummaryCard from "@/components/SummaryCard";
import Decorations from "@/components/Decorations";
import ProductSelectionModal from "@/components/ProductSelectionModal";
import MakeupDrawingCanvas from "@/components/MakeupDrawingCanvas";
import { MAKEUP_STEPS } from "@/data/steps";
import { CompletedEffect, MakeupStep, ProductOption, CharacterProfile, SkinToneOption, FaceShapeOption, SceneOption, OutfitStyleOption } from "@/types";

const SKIN_TONE_LABELS: Record<string, SkinToneOption> = {
  fair: { id: "fair", name: "白皙肤色", color1: "#FFE8D6", color2: "#FFD9B8", icon: "🌸" },
  natural: { id: "natural", name: "自然肤色", color1: "#FFD9B8", color2: "#F5C49A", icon: "🌷" },
  wheat: { id: "wheat", name: "小麦肤色", color1: "#E8B88F", color2: "#D4A373", icon: "🌻" },
};

const FACE_SHAPE_LABELS: Record<string, FaceShapeOption> = {
  round: { id: "round", name: "圆脸", icon: "😊", description: "可爱圆润" },
  oval: { id: "oval", name: "鹅蛋脸", icon: "😄", description: "标准脸型" },
  square: { id: "square", name: "方脸", icon: "😎", description: "轮廓分明" },
};

const SCENE_LABELS: Record<string, SceneOption> = {
  commute: { id: "commute", name: "日常通勤", icon: "🚇", description: "清新自然" },
  date: { id: "date", name: "约会晚宴", icon: "🌹", description: "精致甜美" },
  beach: { id: "beach", name: "海边度假", icon: "🏖️", description: "阳光元气" },
  meeting: { id: "meeting", name: "职场会议", icon: "💼", description: "干练专业" },
};

const OUTFIT_LABELS: Record<string, OutfitStyleOption> = {
  casual: { id: "casual", name: "休闲T恤", icon: "👕", description: "轻松随性" },
  dress: { id: "dress", name: "优雅连衣裙", icon: "👗", description: "温柔浪漫" },
  suit: { id: "suit", name: "职场西装", icon: "🧥", description: "利落干练" },
  resort: { id: "resort", name: "度假长裙", icon: "🌴", description: "飘逸灵动" },
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { characterProfile?: CharacterProfile } | null;
  const initialProfile = locationState?.characterProfile ?? null;

  const [characterProfile] = useState<CharacterProfile | null>(initialProfile);
  const [started, setStarted] = useState(!!initialProfile);
  const [expectedStepId, setExpectedStepId] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [completedEffects, setCompletedEffects] = useState<CompletedEffect>({});
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState("");
  const [currentTipName, setCurrentTipName] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongStepId, setWrongStepId] = useState<number | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [showProductSelection, setShowProductSelection] = useState(false);
  const [pendingStep, setPendingStep] = useState<MakeupStep | null>(null);
  const [showDrawing, setShowDrawing] = useState(false);
  const [drawingStep, setDrawingStep] = useState<MakeupStep | null>(null);
  const [drawingProduct, setDrawingProduct] = useState<ProductOption | null>(null);

  const shuffledSteps = useMemo<MakeupStep[]>(() => {
    return shuffleArray(MAKEUP_STEPS);
  }, [started]);

  const isComplete = completedSteps.length === MAKEUP_STEPS.length;

  const finalizeStep = useCallback((step: MakeupStep, product?: ProductOption) => {
    setCompletedSteps((prev) => [...prev, step.id]);
    setCompletedEffects((prev) => ({
      ...prev,
      [step.effectKey]: product ? product : true,
    }));
    setCurrentTip(step.tip);
    setCurrentTipName(step.name);
    setShowTip(true);

    if (step.id === MAKEUP_STEPS.length) {
      setTimeout(() => setShowConfetti(true), 500);
    }
  }, []);

  const handleStepClick = useCallback(
    (stepId: number) => {
      if (completedSteps.includes(stepId)) return;

      if (stepId === expectedStepId) {
        setWrongStepId(null);
        setShowHint(false);
        const step = MAKEUP_STEPS.find((s) => s.id === stepId);
        if (!step) return;

        if (step.products && step.products.length > 0) {
          setPendingStep(step);
          setShowProductSelection(true);
        } else if (step.drawingTool && step.targetZones) {
          setDrawingStep(step);
          setDrawingProduct(null);
          setShowDrawing(true);
        } else {
          finalizeStep(step);
        }
      } else {
        setWrongStepId(stepId);
        setTimeout(() => setWrongStepId(null), 600);
      }
    },
    [expectedStepId, completedSteps, finalizeStep]
  );

  const handleProductSelect = useCallback(
    (product: ProductOption) => {
      if (!pendingStep) return;
      setShowProductSelection(false);
      if (pendingStep.drawingTool && pendingStep.targetZones) {
        setDrawingStep(pendingStep);
        setDrawingProduct(product);
        setShowDrawing(true);
      } else {
        finalizeStep(pendingStep, product);
        setPendingStep(null);
      }
    },
    [pendingStep, finalizeStep]
  );

  const handleDrawingComplete = useCallback(() => {
    if (!drawingStep) return;
    setShowDrawing(false);
    finalizeStep(drawingStep, drawingProduct ?? undefined);
    setDrawingStep(null);
    setDrawingProduct(null);
    setPendingStep(null);
  }, [drawingStep, drawingProduct, finalizeStep]);

  const handleDrawingCancel = useCallback(() => {
    setShowDrawing(false);
    setDrawingStep(null);
    setDrawingProduct(null);
    setPendingStep(null);
  }, []);

  const handleCloseTip = useCallback(() => {
    setShowTip(false);
    if (expectedStepId < MAKEUP_STEPS.length) {
      setExpectedStepId((prev) => prev + 1);
    }
  }, [expectedStepId]);

  const handleUseHint = useCallback(() => {
    if (hintsRemaining > 0) {
      setHintsRemaining((prev) => prev - 1);
      setShowHint(true);
    }
  }, [hintsRemaining]);

  const handleRestart = useCallback(() => {
    setExpectedStepId(1);
    setCompletedSteps([]);
    setCompletedEffects({});
    setShowConfetti(false);
    setWrongStepId(null);
    setHintsRemaining(3);
    setShowHint(false);
    setShowProductSelection(false);
    setPendingStep(null);
    setShowDrawing(false);
    setDrawingStep(null);
    setDrawingProduct(null);
    setStarted(true);
  }, []);

  const handleGoToCustomize = useCallback(() => {
    navigate("/customize");
  }, [navigate]);

  const renderProfileBadge = () => {
    if (!characterProfile) return null;
    const items: string[] = [];
    if (characterProfile.skinTone) items.push(`${SKIN_TONE_LABELS[characterProfile.skinTone].icon}${SKIN_TONE_LABELS[characterProfile.skinTone].name}`);
    if (characterProfile.faceShape) items.push(`${FACE_SHAPE_LABELS[characterProfile.faceShape].icon}${FACE_SHAPE_LABELS[characterProfile.faceShape].name}`);
    if (characterProfile.scene) items.push(`${SCENE_LABELS[characterProfile.scene].icon}${SCENE_LABELS[characterProfile.scene].name}`);
    if (characterProfile.outfitStyle) items.push(`${OUTFIT_LABELS[characterProfile.outfitStyle].icon}${OUTFIT_LABELS[characterProfile.outfitStyle].name}`);
    return items;
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-pattern-dots">
        <Decorations />

        <div className="relative z-10 text-center animate-fade-in-up max-w-xl">
          <div className="mb-8">
            <div className="inline-block p-6 rounded-full bg-gradient-to-br from-pink-200 via-lavender-100 to-peach-100 shadow-2xl mb-6">
              <span className="text-7xl block animate-float">💄</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-cute">
            <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-lavender-400 bg-clip-text text-transparent">
              小仙女化妆课堂
            </span>
          </h1>

          <p className="text-gray-600 text-lg mb-2">先定制你的专属角色，再开始沉浸式化妆体验吧！</p>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            选择你的肤色、脸型、场景和服装，打造属于你的完美形象~
            <br />
            之后从打乱的化妆步骤中，按正确顺序依次操作，每一步先选产品，然后用工具在脸上"画"出妆容哦！✨
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">👤</span>
              <span className="text-sm text-gray-600">定制专属形象</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">�</span>
              <span className="text-sm text-gray-600">挑选喜爱的产品</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">�️</span>
              <span className="text-sm text-gray-600">拖拽绘画上妆</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">💡</span>
              <span className="text-sm text-gray-600">3次提示机会</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">📚</span>
              <span className="text-sm text-gray-600">11个化妆步骤</span>
            </div>
          </div>

          <button
            onClick={handleGoToCustomize}
            className="group relative px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 via-pink-300 to-lavender-300 text-white font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <User className="w-6 h-6" />
              开始定制角色
              <Sparkles className="w-6 h-6 group-hover:animate-spin" />
            </span>
          </button>

          <div className="mt-10 flex items-start justify-center gap-4 text-left bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-pink-100">
            <HelpCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-700 mb-1">游戏玩法</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                首先定制你的专属形象，然后右侧列表中所有化妆步骤已被打乱，请根据你的化妆知识，
                从「洁面护肤」开始，按正确的化妆顺序依次选择每一步。
                选对后先挑选你喜欢的产品色号，然后拿起化妆工具在人物脸上的高亮区域"画"出妆容，
                完成度达标才算过关哦！选错了会有震动提醒，实在不知道可以使用提示功能~
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-pattern-dots">
        <Decorations showConfetti={showConfetti} />

        <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in-up">
          {characterProfile && (
            <div className="flex flex-wrap justify-center gap-2">
              {renderProfileBadge().map((text, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-white/80 text-xs text-gray-700 shadow-sm border border-pink-100 font-medium"
                >
                  {text}
                </span>
              ))}
            </div>
          )}
          <div className="w-72 md:w-80">
            <Avatar effects={completedEffects} isComplete={true} characterProfile={characterProfile ?? undefined} />
          </div>
          <SummaryCard onRestart={handleRestart} />
        </div>
      </div>
    );
  }

  const currentExpectedStep = MAKEUP_STEPS.find((s) => s.id === expectedStepId);

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-pattern-dots">
      <Decorations />

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-pink-500 via-pink-400 to-lavender-400 bg-clip-text text-transparent">
              💄 小仙女化妆课堂
            </span>
          </h1>
          {characterProfile && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-2 mb-2">
              {renderProfileBadge().map((text, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-white/70 text-xs text-gray-600 shadow-sm border border-pink-100"
                >
                  {text}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500">
            从打乱的步骤中，找出正确的化妆顺序，选品后用工具在脸上"画"出妆容~
            {currentExpectedStep && !showHint && (
              <span className="ml-2 text-pink-400 font-medium">
                （提示：下一步应该是第 {expectedStepId} 步）
              </span>
            )}
          </p>
        </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
        <div className="flex justify-center lg:sticky lg:top-8">
          <div className="w-full max-w-sm animate-fade-in">
            <Avatar effects={completedEffects} isComplete={false} characterProfile={characterProfile ?? undefined} />
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 md:p-6 shadow-xl border-2 border-pink-100">
            <StepList
              shuffledSteps={shuffledSteps}
              expectedStepId={expectedStepId}
              completedSteps={completedSteps}
              wrongStepId={wrongStepId}
              onStepClick={handleStepClick}
              onUseHint={handleUseHint}
              hintsRemaining={hintsRemaining}
              showHint={showHint}
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              🎮 选择正确的步骤 → 挑选产品 → 拿起工具在脸上"画"出妆容吧！
            </p>
          </div>
        </div>
      </div>
    </div>

    {showProductSelection && pendingStep && (
      <ProductSelectionModal
        step={pendingStep}
        onSelect={handleProductSelect}
      />
    )}

    {showDrawing && drawingStep && (
      <MakeupDrawingCanvas
        step={drawingStep}
        selectedProduct={drawingProduct}
        effects={completedEffects}
        characterProfile={characterProfile ?? undefined}
        onComplete={handleDrawingComplete}
        onCancel={handleDrawingCancel}
      />
    )}

    {showTip && (
      <TipModal
        tip={currentTip}
        stepName={currentTipName}
        onClose={handleCloseTip}
      />
    )}
  </div>
);
}
