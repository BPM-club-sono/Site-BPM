import type { TeamMemberNode } from "@/features/team/types";
import { teamMembers28 } from "@/features/team/data/teamMembers28";
import { teamMembers27 } from "@/features/team/data/teamMembers27";

export type TeamRoster = {
  year: string;
  members: TeamMemberNode[];
};

// Newest mandate first — the org chart page defaults to index 0
export const teamRosters: TeamRoster[] = [
  { year: "28", members: teamMembers28 },
  { year: "27", members: teamMembers27 }
];
