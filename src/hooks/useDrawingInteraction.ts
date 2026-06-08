import { useState, useRef, useCallback, useEffect } from "react";
import { TargetZone } from "@/types";
import { StrokePoint, calculateCoverage } from "@/lib/coverage";

export interface UseDrawingInteractionOptions {
  viewBoxWidth: number;
  viewBoxHeight: number;
  targetZones?: TargetZone[];
  toolSize: number;
  coverageThreshold?: number;
  onCoverageReached?: () => void;
}

export interface UseDrawingInteractionResult {
  svgRef: React.RefObject<SVGSVGElement>;
  isDrawing: boolean;
  strokePoints: StrokePoint[];
  currentPos: { x: number; y: number } | null;
  coverage: number;
  toolPicked: boolean;
  hasCompleted: boolean;
  getSvgCoords: (clientX: number, clientY: number) => { x: number; y: number } | null;
  handleToolAreaMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  handleMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
  handleMouseMove: (e: React.MouseEvent | React.TouchEvent) => void;
  handleMouseUp: () => void;
  resetDrawing: () => void;
}

export function useDrawingInteraction(
  options: UseDrawingInteractionOptions
): UseDrawingInteractionResult {
  const { viewBoxWidth, viewBoxHeight, targetZones, toolSize, coverageThreshold = 70, onCoverageReached } = options;

  const svgRef = useRef<SVGSVGElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokePoints, setStrokePoints] = useState<StrokePoint[]>([]);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [coverage, setCoverage] = useState(0);
  const [toolPicked, setToolPicked] = useState(false);
  const hasCompletedRef = useRef(false);
  const [hasCompleted, setHasCompleted] = useState(false);

  const getSvgCoords = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const scaleX = viewBoxWidth / rect.width;
      const scaleY = viewBoxHeight / rect.height;
      const x = (clientX - rect.left) * scaleX;
      const y = (clientY - rect.top) * scaleY;
      return { x, y };
    },
    [viewBoxWidth, viewBoxHeight]
  );

  const handleToolAreaMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setToolPicked(true);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!toolPicked) return;
      e.preventDefault();

      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const coords = getSvgCoords(clientX, clientY);
      if (!coords) return;

      setIsDrawing(true);
      setCurrentPos(coords);
      setStrokePoints((prev) => [...prev, { ...coords, timestamp: Date.now() }]);
    },
    [toolPicked, getSvgCoords]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      let clientX: number, clientY: number;
      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const coords = getSvgCoords(clientX, clientY);
      if (!coords) return;

      setCurrentPos(coords);

      if (isDrawing) {
        setStrokePoints((prev) => [...prev, { ...coords, timestamp: Date.now() }]);
      }
    },
    [isDrawing, getSvgCoords]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const resetDrawing = useCallback(() => {
    setStrokePoints([]);
    setCoverage(0);
    hasCompletedRef.current = false;
    setHasCompleted(false);
  }, []);

  useEffect(() => {
    if (strokePoints.length > 0 && targetZones) {
      const cov = calculateCoverage(strokePoints, targetZones, toolSize);
      setCoverage(cov);

      if (cov >= coverageThreshold && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        setHasCompleted(true);
        if (onCoverageReached) {
          onCoverageReached();
        }
      }
    }
  }, [strokePoints, targetZones, toolSize, coverageThreshold, onCoverageReached]);

  return {
    svgRef,
    isDrawing,
    strokePoints,
    currentPos,
    coverage,
    toolPicked,
    hasCompleted,
    getSvgCoords,
    handleToolAreaMouseDown,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetDrawing,
  };
}
