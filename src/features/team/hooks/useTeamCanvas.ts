import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent
} from "react";
import { TEAM_FIT_PADDING, TEAM_MAX_SCALE, TEAM_MIN_SCALE } from "@/features/team/constants";
import { getTeamContentBounds, getTeamFitScale } from "@/features/team/lib/teamBounds";
import type { CanvasTransform, TeamMemberNode } from "@/features/team/types";
import { clamp } from "@/shared/lib/math/clamp";

type PointerDragState = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  originX: number;
  originY: number;
};

const DEFAULT_TRANSFORM: CanvasTransform = {
  x: 0,
  y: 0,
  scale: 1
};

const toCanvasTransformValue = (transform: CanvasTransform) => {
  return `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`;
};

export const useTeamCanvas = (members: TeamMemberNode[]) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<PointerDragState | null>(null);
  const transformRef = useRef<CanvasTransform>(DEFAULT_TRANSFORM);
  const pendingTransformRef = useRef<CanvasTransform | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const scheduleTransform = useCallback((nextTransform: CanvasTransform) => {
    transformRef.current = nextTransform;
    pendingTransformRef.current = nextTransform;

    if (animationFrameRef.current !== null) {
      return;
    }

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;

      if (!canvasRef.current || !pendingTransformRef.current) {
        return;
      }

      canvasRef.current.style.transform = toCanvasTransformValue(pendingTransformRef.current);
      pendingTransformRef.current = null;
    });
  }, []);

  const updateTransform = useCallback(
    (updater: (previousTransform: CanvasTransform) => CanvasTransform) => {
      const previousTransform = transformRef.current;
      const nextTransform = updater(previousTransform);

      if (
        previousTransform.x === nextTransform.x &&
        previousTransform.y === nextTransform.y &&
        previousTransform.scale === nextTransform.scale
      ) {
        return;
      }

      scheduleTransform(nextTransform);
    },
    [scheduleTransform]
  );

  // ----- Centering helpers -----
  const contentBounds = useMemo(() => getTeamContentBounds(members), [members]);

  // Puts the middle of the cards in the middle of the viewport, at the given scale.
  const centerContent = useCallback(
    (scaleOverride?: number) => {
      if (!viewportRef.current || !contentBounds) {
        return;
      }

      const scale = scaleOverride ?? transformRef.current.scale;
      const viewportRect = viewportRef.current.getBoundingClientRect();

      scheduleTransform({
        scale,
        x: viewportRect.width / 2 - contentBounds.centerX * scale,
        y: viewportRect.height / 2 - contentBounds.centerY * scale
      });
    },
    [contentBounds, scheduleTransform]
  );

  // Scales so the whole roster fits the viewport, whatever the screen and whatever the mandate.
  const fitView = useCallback(() => {
    if (!viewportRef.current || !contentBounds) {
      return;
    }

    const viewportRect = viewportRef.current.getBoundingClientRect();
    const scale = getTeamFitScale(
      contentBounds,
      viewportRect,
      TEAM_FIT_PADDING,
      TEAM_MIN_SCALE,
      TEAM_MAX_SCALE
    );

    centerContent(scale);
  }, [centerContent, contentBounds]);

  const zoomBy = useCallback(
    (factor: number) => {
      if (!viewportRef.current) {
        return;
      }

      const viewportRect = viewportRef.current.getBoundingClientRect();
      const pivotX = viewportRect.width / 2;
      const pivotY = viewportRect.height / 2;

      updateTransform((previousTransform) => {
        const nextScale = clamp(previousTransform.scale * factor, TEAM_MIN_SCALE, TEAM_MAX_SCALE);
        if (nextScale === previousTransform.scale) {
          return previousTransform;
        }

        const contentX = (pivotX - previousTransform.x) / previousTransform.scale;
        const contentY = (pivotY - previousTransform.y) / previousTransform.scale;

        return {
          scale: nextScale,
          x: pivotX - contentX * nextScale,
          y: pivotY - contentY * nextScale
        };
      });
    },
    [updateTransform]
  );

  // ----- Drag handlers -----
  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      originX: transformRef.current.x,
      originY: transformRef.current.y
    };

    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;
      if (!dragState) {
        return;
      }

      updateTransform((previousTransform) => ({
        ...previousTransform,
        x: dragState.originX + (event.clientX - dragState.startClientX),
        y: dragState.originY + (event.clientY - dragState.startClientY)
      }));
    },
    [updateTransform]
  );

  const stopDragging = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(dragState.pointerId)) {
      event.currentTarget.releasePointerCapture(dragState.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
  }, []);

  // ----- Zoom handlers -----
  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault();

      const viewportRect = event.currentTarget.getBoundingClientRect();
      const pointerX = event.clientX - viewportRect.left;
      const pointerY = event.clientY - viewportRect.top;

      updateTransform((previousTransform) => {
        const zoomDelta = -event.deltaY * 0.0018;
        const nextScale = clamp(previousTransform.scale + zoomDelta, TEAM_MIN_SCALE, TEAM_MAX_SCALE);
        if (nextScale === previousTransform.scale) {
          return previousTransform;
        }

        const contentX = (pointerX - previousTransform.x) / previousTransform.scale;
        const contentY = (pointerY - previousTransform.y) / previousTransform.scale;

        return {
          scale: nextScale,
          x: pointerX - contentX * nextScale,
          y: pointerY - contentY * nextScale
        };
      });
    },
    [updateTransform]
  );

  const resetView = fitView;

  const zoomIn = useCallback(() => {
    zoomBy(1.12);
  }, [zoomBy]);

  const zoomOut = useCallback(() => {
    zoomBy(0.9);
  }, [zoomBy]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    canvasRef.current.style.transform = toCanvasTransformValue(transformRef.current);
  }, []);

  // Fits on mount and again whenever the roster changes, since the bounds move with it.
  useEffect(() => {
    fitView();

    const handleResize = () => {
      centerContent();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [centerContent, fitView]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, []);

  return {
    viewportRef,
    canvasRef,
    isDragging,
    zoomIn,
    zoomOut,
    resetView,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: stopDragging,
    handlePointerCancel: stopDragging,
    handleWheel
  };
};
