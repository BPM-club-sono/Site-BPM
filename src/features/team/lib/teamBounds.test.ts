import { describe, expect, it } from "vitest";
import { TEAM_CANVAS_CENTER, TEAM_MAX_SCALE, TEAM_MIN_SCALE } from "@/features/team/constants";
import { getTeamContentBounds, getTeamFitScale } from "@/features/team/lib/teamBounds";
import type { TeamMemberNode } from "@/features/team/types";

const buildMember = (x: number, y: number): TeamMemberNode => ({
  id: `${x}-${y}`,
  name: "Test",
  role: "Test",
  photo: "photo.webp",
  x,
  y
});

describe("getTeamContentBounds", () => {
  it("returns null for an empty roster", () => {
    expect(getTeamContentBounds([])).toBeNull();
  });

  it("pads the outermost nodes by half a card on each side", () => {
    const bounds = getTeamContentBounds([buildMember(-100, -50), buildMember(100, 50)]);

    // 200 apart plus a full card (2 x 90) of overhang.
    expect(bounds).toEqual({
      width: 380,
      height: 280,
      centerX: TEAM_CANVAS_CENTER.x,
      centerY: TEAM_CANVAS_CENTER.y
    });
  });

  it("offsets the center when the roster is not symmetric", () => {
    const bounds = getTeamContentBounds([buildMember(0, 0), buildMember(0, 900)]);

    expect(bounds?.centerY).toBe(TEAM_CANVAS_CENTER.y + 450);
    expect(bounds?.centerX).toBe(TEAM_CANVAS_CENTER.x);
  });

  it("covers a single member", () => {
    const bounds = getTeamContentBounds([buildMember(0, 0)]);

    expect(bounds?.width).toBe(180);
    expect(bounds?.height).toBe(180);
  });
});

describe("getTeamFitScale", () => {
  const bounds = { width: 2180, height: 880, centerX: 1200, centerY: 1100 };

  it("fits the constraining axis, padding included", () => {
    // 1920 - 2 x 40 = 1840 usable, against 2180 of content.
    const scale = getTeamFitScale(bounds, { width: 1920, height: 1080 }, 40, TEAM_MIN_SCALE, TEAM_MAX_SCALE);

    expect(scale).toBeCloseTo(1840 / 2180, 5);
  });

  it("picks the height when height is the tighter axis", () => {
    const tallBounds = { ...bounds, width: 400, height: 1600 };
    const scale = getTeamFitScale(
      tallBounds,
      { width: 1920, height: 1080 },
      40,
      TEAM_MIN_SCALE,
      TEAM_MAX_SCALE
    );

    expect(scale).toBeCloseTo(1000 / 1600, 5);
  });

  it("never goes below the minimum zoom on a phone", () => {
    const scale = getTeamFitScale(bounds, { width: 390, height: 844 }, 40, TEAM_MIN_SCALE, TEAM_MAX_SCALE);

    expect(scale).toBe(TEAM_MIN_SCALE);
  });

  it("never goes above the maximum zoom for a tiny roster", () => {
    const scale = getTeamFitScale(
      { width: 180, height: 180, centerX: 1200, centerY: 1100 },
      { width: 1920, height: 1080 },
      40,
      TEAM_MIN_SCALE,
      TEAM_MAX_SCALE
    );

    expect(scale).toBe(TEAM_MAX_SCALE);
  });
});
