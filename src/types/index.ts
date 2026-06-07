export interface ProductOption {
  id: string;
  name: string;
  color?: string;
  color2?: string;
  previewColor?: string;
  icon?: string;
}

export interface MakeupStep {
  id: number;
  name: string;
  icon: string;
  description: string;
  tip: string;
  effectKey: string;
  products?: ProductOption[];
}

export interface CompletedEffect {
  [key: string]: ProductOption | boolean;
}
