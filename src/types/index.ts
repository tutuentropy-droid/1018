export interface MakeupStep {
  id: number;
  name: string;
  icon: string;
  description: string;
  tip: string;
  effectKey: string;
}

export interface CompletedEffect {
  [key: string]: boolean;
}
