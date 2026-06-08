import { TargetZone } from "@/types";

export interface StrokePoint {
  x: number;
  y: number;
  timestamp: number;
}

export function isPointInEllipse(px: number, py: number, zone: TargetZone): boolean {
  const dx = (px - zone.cx) / zone.rx;
  const dy = (py - zone.cy) / zone.ry;
  return dx * dx + dy * dy <= 1;
}

export function isPointInAnyZone(px: number, py: number, zones: TargetZone[]): boolean {
  return zones.some((zone) => isPointInEllipse(px, py, zone));
}

export function calculateCoverage(
  points: StrokePoint[],
  zones: TargetZone[],
  toolSize: number,
  gridSize = 4
): number {
  if (zones.length === 0) return 100;

  let coveredPoints = 0;
  let totalGridPoints = 0;

  zones.forEach((zone) => {
    for (let gx = zone.cx - zone.rx; gx <= zone.cx + zone.rx; gx += gridSize) {
      for (let gy = zone.cy - zone.ry; gy <= zone.cy + zone.ry; gy += gridSize) {
        if (isPointInEllipse(gx, gy, zone)) {
          totalGridPoints++;
          const covered = points.some((p) => {
            const dist = Math.sqrt((p.x - gx) ** 2 + (p.y - gy) ** 2);
            return dist <= toolSize;
          });
          if (covered) coveredPoints++;
        }
      }
    }
  });

  if (totalGridPoints === 0) return 100;
  return Math.min(100, Math.round((coveredPoints / totalGridPoints) * 100));
}

export function calculateZoneCoverage(
  points: StrokePoint[],
  zone: TargetZone,
  toolSize: number,
  gridSize = 4
): number {
  let coveredPoints = 0;
  let totalGridPoints = 0;

  for (let gx = zone.cx - zone.rx; gx <= zone.cx + zone.rx; gx += gridSize) {
    for (let gy = zone.cy - zone.ry; gy <= zone.cy + zone.ry; gy += gridSize) {
      if (isPointInEllipse(gx, gy, zone)) {
        totalGridPoints++;
        const covered = points.some((p) => {
          const dist = Math.sqrt((p.x - gx) ** 2 + (p.y - gy) ** 2);
          return dist <= toolSize;
        });
        if (covered) coveredPoints++;
      }
    }
  }

  if (totalGridPoints === 0) return 100;
  return Math.min(100, Math.round((coveredPoints / totalGridPoints) * 100));
}

export function calculatePerZoneCoverage(
  points: StrokePoint[],
  zones: TargetZone[],
  toolSize: number
): number[] {
  return zones.map((zone) => calculateZoneCoverage(points, zone, toolSize));
}
