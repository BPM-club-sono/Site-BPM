import { TEAM_CANVAS_CENTER, TEAM_CARD_SIZE } from "@/features/team/constants";
import type { TeamMemberNode } from "@/features/team/types";
import { clamp } from "@/shared/lib/math/clamp";

export type TeamContentBounds = {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

export type ViewportSize = {
  width: number;
  height: number;
};

/*
 * Box the cards actually occupy, in canvas coordinates. Nodes are placed from the canvas center
 * and sized TEAM_CARD_SIZE, so half a card past the outermost ones covers them fully. The canvas
 * itself is much larger than any roster needs, which is why the view fits to this instead.
 */
export const getTeamContentBounds = (members: TeamMemberNode[]): TeamContentBounds | null => {
  if (members.length === 0) {
    return null;
  }

  const halfCard = TEAM_CARD_SIZE / 2;
  const xs = members.map((member) => member.x);
  const ys = members.map((member) => member.y);

  const minX = TEAM_CANVAS_CENTER.x + Math.min(...xs) - halfCard;
  const maxX = TEAM_CANVAS_CENTER.x + Math.max(...xs) + halfCard;
  const minY = TEAM_CANVAS_CENTER.y + Math.min(...ys) - halfCard;
  const maxY = TEAM_CANVAS_CENTER.y + Math.max(...ys) + halfCard;

  return {
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
};

/*
 * Largest scale that still leaves `padding` on every side, clamped to the manual zoom range.
 * On a narrow screen the clamp wins and the roster stays wider than the viewport: the user drags.
 */
export const getTeamFitScale = (
  bounds: TeamContentBounds,
  viewport: ViewportSize,
  padding: number,
  minScale: number,
  maxScale: number
) => {
  const availableWidth = Math.max(viewport.width - padding * 2, 1);
  const availableHeight = Math.max(viewport.height - padding * 2, 1);

  return clamp(Math.min(availableWidth / bounds.width, availableHeight / bounds.height), minScale, maxScale);
};
