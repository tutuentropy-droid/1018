import { useMemo, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, HelpCircle, User } from "lucide-react";
import Avatar from "@/components/Avatar";
import StepList from "@/components/StepList";
import TipModal from "@/components/TipModal";
import SummaryCard from "@/components/SummaryCard";
import Decorations from "@/components/Decorations";
import ProductSelectionModal from "@/components/ProductSelectionModal";
import MakeupDrawingCanvas from "@/components/MakeupDrawingCanvas";
import { useGameStore } from "@/store/useGameStore";
import { MAKEUP_STEPS, SKIN_TONE_LABELS, FACE_SHAPE_LABELS, SCENE_LABELS, OUTFIT_LABELS } from "@/data";
import { MakeupStep, ProductOption, CharacterProfile } from "@/types";

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

  const store = useGameStore();

  useEffect(() => {
    if (initialProfile && !store.characterProfile) {
      store.setCharacterProfile(initialProfile);
      store.setStarted(true);
    }
  }, [initialProfile, store]);

  const {
    characterProfile,
    started,
    gameMode,
    expectedStepId,
    completedSteps,
    stepHistory,
    completedEffects,
    showTip,
    currentTip,
    currentTipName,
    showConfetti,
    wrongStepId,
    hintsRemaining,
    showHint,
    showProductSelection,
    pendingStep,
    showDrawing,
    drawingStep,
    drawingProduct,
    setGameMode,
    finalizeStep,
    setWrongStep,
    setShowHint,
    openProductSelection,
    setPendingStep,
    openDrawing,
    closeDrawing,
    closeTip,
    resetGame,
  } = store;

  const shuffledSteps = useMemo<MakeupStep[]>(() => {
    return shuffleArray(MAKEUP_STEPS);
  }, []);

  const isComplete = completedSteps.length === MAKEUP_STEPS.length;

  const handleStepClick = useCallback(
    (stepId: number) => {
      if (completedSteps.includes(stepId)) return;

      if (gameMode === "free" || stepId === expectedStepId) {
        setWrongStep(null);
        setShowHint(false);
        const step = MAKEUP_STEPS.find((s) => s.id === stepId);
        if (!step) return;

        if (step.products && step.products.length > 0) {
          openProductSelection(step);
        } else if (step.drawingTool && step.targetZones) {
          openDrawing(step, null);
        } else {
          finalizeStep(step);
        }
      } else {
        setWrongStep(stepId);
        setTimeout(() => setWrongStep(null), 600);
      }
    },
    [gameMode, expectedStepId, completedSteps, setWrongStep, setShowHint, openProductSelection, openDrawing, finalizeStep]
  );

  const handleProductSelect = useCallback(
    (product: ProductOption) => {
      if (!pendingStep) return;
      store.closeProductSelection();
      if (pendingStep.drawingTool && pendingStep.targetZones) {
        openDrawing(pendingStep, product);
      } else {
        finalizeStep(pendingStep, product);
        setPendingStep(null);
      }
    },
    [pendingStep, store, openDrawing, finalizeStep, setPendingStep]
  );

  const handleDrawingComplete = useCallback(() => {
    if (!drawingStep) return;
    closeDrawing();
    finalizeStep(drawingStep, drawingProduct ?? undefined);
  }, [drawingStep, drawingProduct, closeDrawing, finalizeStep]);

  const handleDrawingCancel = useCallback(() => {
    closeDrawing();
  }, [closeDrawing]);

  const handleUseHint = useCallback(() => {
    store.useHint();
  }, [store]);

  const handleRestart = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleModeChange = useCallback(
    (mode: "guided" | "free") => {
      setGameMode(mode);
    },
    [setGameMode]
  );

  const handleGoToCustomize = useCallback(() => {
    navigate("/customize");
  }, [navigate]);

  const renderProfileBadge = () => {
    if (!characterProfile) return null;
    const items: string[] = [];
    if (characterProfile.skinTone)
      items.push(
        `${SKIN_TONE_LABELS[characterProfile.skinTone].icon}${SKIN_TONE_LABELS[characterProfile.skinTone].name}`
      );
    if (characterProfile.faceShape)
      items.push(
        `${FACE_SHAPE_LABELS[characterProfile.faceShape].icon}${FACE_SHAPE_LABELS[characterProfile.faceShape].name}`
      );
    if (characterProfile.scene)
      items.push(
        `${SCENE_LABELS[characterProfile.scene].icon}${SCENE_LABELS[characterProfile.scene].name}`
      );
    if (characterProfile.outfitStyle)
      items.push(
        `${OUTFIT_LABELS[characterProfile.outfitStyle].icon}${OUTFIT_LABELS[characterProfile.outfitStyle].name}`
      );
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
            {gameMode === "guided"
              ? "之后从打乱的化妆步骤中，按正确顺序依次操作，每一步先选产品，然后用工具在脸上\"画\"出妆容哦！✨"
              : "之后自由选择任意化妆步骤，随意组合妆容效果，发挥你的创意吧！🎨"}
          </p>

          <div className="mb-8">
            <p className="text-sm font-bold text-gray-600 mb-3">选择游戏模式</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleModeChange("guided")}
                className={`flex-1 max-w-[200px] p-4 rounded-2xl border-2 transition-all duration-300 ${
                  gameMode === "guided"
                    ? "bg-gradient-to-br from-pink-100 to-lavender-100 border-pink-300 shadow-lg scale-105"
                    : "bg-white/70 border-pink-100 hover:bg-white hover:border-pink-200"
                }`}
              >
                <div className="text-3xl mb-2">📖</div>
                <div className={`font-bold ${gameMode === "guided" ? "text-pink-500" : "text-gray-700"}`}>
                  顺序教学
                </div>
                <div className="text-xs text-gray-500 mt-1">按正确步骤学习化妆</div>
              </button>
              <button
                onClick={() => handleModeChange("free")}
                className={`flex-1 max-w-[200px] p-4 rounded-2xl border-2 transition-all duration-300 ${
                  gameMode === "free"
                    ? "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 shadow-lg scale-105"
                    : "bg-white/70 border-pink-100 hover:bg-white hover:border-pink-200"
                }`}
              >
                <div className="text-3xl mb-2">🎨</div>
                <div className={`font-bold ${gameMode === "free" ? "text-purple-500" : "text-gray-700"}`}>
                  自由创作
                </div>
                <div className="text-xs text-gray-500 mt-1">随意搭配发挥创意</div>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">👤</span>
              <span className="text-sm text-gray-600">定制专属形象</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">🛍️</span>
              <span className="text-sm text-gray-600">挑选喜爱的产品</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">🖌️</span>
              <span className="text-sm text-gray-600">拖拽绘画上妆</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 shadow-sm border border-pink-100">
              <span className="text-lg">💡</span>
              <span className="text-sm text-gray-600">
                {gameMode === "guided" ? "3次提示机会" : "无顺序限制"}
              </span>
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
                {gameMode === "guided" ? (
                  <>
                    首先定制你的专属形象，然后右侧列表中所有化妆步骤已被打乱，请根据你的化妆知识，
                    从「洁面护肤」开始，按正确的化妆顺序依次选择每一步。
                    选对后先挑选你喜欢的产品色号，然后拿起化妆工具在人物脸上的高亮区域"画"出妆容，
                    完成度达标才算过关哦！选错了会有震动提醒，实在不知道可以使用提示功能~
                  </>
                ) : (
                  <>
                    首先定制你的专属形象，然后可以自由选择任意化妆步骤，不受顺序限制！
                    尽情发挥创意，挑选你喜欢的产品色号，拿起化妆工具在人物脸上的高亮区域"画"出妆容，
                    完成度达标即可。尝试夸张或混搭的妆容，打造属于你自己的独特风格~
                    完成所有步骤后会记录你的创作顺序哦！✨
                  </>
                )}
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
            <Avatar
              effects={completedEffects}
              isComplete={true}
              characterProfile={characterProfile ?? undefined}
            />
          </div>
          <SummaryCard
            onRestart={handleRestart}
            gameMode={gameMode}
            stepHistory={stepHistory}
            completedEffects={completedEffects}
            characterProfile={characterProfile ?? undefined}
          />
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

          <div className="flex justify-center gap-2 mb-3">
            <button
              onClick={() => handleModeChange("guided")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                gameMode === "guided"
                  ? "bg-gradient-to-r from-pink-400 to-lavender-400 text-white shadow-md"
                  : "bg-white/70 text-gray-500 hover:bg-white border border-pink-100"
              }`}
            >
              📖 顺序教学
            </button>
            <button
              onClick={() => handleModeChange("free")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                gameMode === "free"
                  ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md"
                  : "bg-white/70 text-gray-500 hover:bg-white border border-pink-100"
              }`}
            >
              🎨 自由创作
            </button>
          </div>

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
            {gameMode === "guided" ? (
              <>
                从打乱的步骤中，找出正确的化妆顺序，选品后用工具在脸上"画"出妆容~
                {currentExpectedStep && !showHint && (
                  <span className="ml-2 text-pink-400 font-medium">
                    （提示：下一步应该是第 {expectedStepId} 步）
                  </span>
                )}
              </>
            ) : (
              <>
                自由选择任意步骤，发挥创意打造专属妆容~ 🎨
                <span className="ml-2 text-purple-400 font-medium">
                  （已完成 {completedSteps.length} / {MAKEUP_STEPS.length} 步）
                </span>
              </>
            )}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          <div className="flex justify-center lg:sticky lg:top-8">
            <div className="w-full max-w-sm animate-fade-in">
              <Avatar
                effects={completedEffects}
                isComplete={false}
                characterProfile={characterProfile ?? undefined}
              />
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
                gameMode={gameMode}
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                {gameMode === "guided"
                  ? "🎮 选择正确的步骤 → 挑选产品 → 拿起工具在脸上\"画\"出妆容吧！"
                  : "🎨 任意选择步骤 → 挑选产品 → 拿起工具在脸上\"画\"出妆容，自由发挥创意！"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showProductSelection && pendingStep && (
        <ProductSelectionModal step={pendingStep} onSelect={handleProductSelect} />
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
        <TipModal tip={currentTip} stepName={currentTipName} onClose={closeTip} />
      )}
    </div>
  );
}
