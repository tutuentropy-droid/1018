import MakeupDrawingCanvas3D from "./three/MakeupDrawingCanvas3D";
import { MakeupStep, ProductOption, CompletedEffect, CharacterProfile } from "@/types";

interface MakeupDrawingCanvasProps {
  step: MakeupStep;
  selectedProduct: ProductOption | null;
  effects: CompletedEffect;
  characterProfile?: CharacterProfile;
  onComplete: () => void;
  onCancel: () => void;
}

export default function MakeupDrawingCanvas({
  step,
  selectedProduct,
  effects,
  characterProfile,
  onComplete,
  onCancel,
}: MakeupDrawingCanvasProps) {
  return (
    <MakeupDrawingCanvas3D
      step={step}
      selectedProduct={selectedProduct}
      effects={effects}
      characterProfile={characterProfile}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
}
