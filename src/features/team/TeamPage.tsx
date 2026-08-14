import { useState } from "react";
import bpmWatermark from "@/assets/BPM_typo.png";
import { TEAM_CANVAS_CENTER, TEAM_CARD_SIZE } from "@/features/team/constants";
import { teamRosters } from "@/features/team/data/teamRosters";
import { useTeamCanvas } from "@/features/team/hooks/useTeamCanvas";
import type { TeamMemberNode } from "@/features/team/types";
import PageShell from "@/shared/components/layout/PageShell";
import "./TeamPage.css";

const getTeamNodePositionStyle = (member: TeamMemberNode) => {
  const left = TEAM_CANVAS_CENTER.x + member.x - TEAM_CARD_SIZE / 2;
  const top = TEAM_CANVAS_CENTER.y + member.y - TEAM_CARD_SIZE / 2;

  return {
    left: `${left}px`,
    top: `${top}px`
  };
};

const TeamPage = () => {
  const [selectedYearIndex, setSelectedYearIndex] = useState(0);
  const {
    viewportRef,
    canvasRef,
    isDragging,
    zoomIn,
    zoomOut,
    resetView,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleWheel
  } = useTeamCanvas();

  const selectedRoster = teamRosters[selectedYearIndex];

  const selectYear = (index: number) => {
    setSelectedYearIndex(index);
    resetView();
  };

  return (
    <PageShell pageClassName="team">
      <section className="team-frame">
        <img className="team-watermark" src={bpmWatermark} alt="" aria-hidden="true" />

        <div className="team-bg-number" aria-hidden="true">
          {selectedRoster.year}
        </div>

        <div className="team-label">Organigramme</div>

        <div className="team-year-tabs" role="tablist" aria-label="Choisir le mandat">
          {teamRosters.map((roster, index) => (
            <button
              key={roster.year}
              type="button"
              role="tab"
              aria-selected={index === selectedYearIndex}
              className="team-year-tab"
              data-active={index === selectedYearIndex || undefined}
              onClick={() => selectYear(index)}
            >
              {roster.year}
            </button>
          ))}
        </div>

        <div className="team-toolbar">
          <button type="button" className="team-button" onClick={zoomIn}>
            +
          </button>
          <button type="button" className="team-button" onClick={zoomOut}>
            -
          </button>
          <button type="button" className="team-button" onClick={resetView}>
            Reset
          </button>
        </div>

        <div className="team-hint">Glissez pour bouger. Molette pour zoomer.</div>

        <div
          ref={viewportRef}
          className="team-viewport"
          data-dragging={isDragging || undefined}
          role="region"
          aria-label="Organigramme"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
        >
          <div ref={canvasRef} className="team-canvas">
            <div className="team-tree">
              {selectedRoster.members.map((member) => (
                <div key={member.id} className="team-node" style={getTeamNodePositionStyle(member)}>
                  <div className="team-card">
                    <img className="team-avatar" src={member.photo} alt={member.name} loading="lazy" />
                    <span className="team-name">{member.name}</span>
                    <span className="team-role">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default TeamPage;
