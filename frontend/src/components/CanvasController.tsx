import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

export interface CanvasControllerProps {
  children?: React.ReactNode;
}

const CanvasController = (props: CanvasControllerProps) => {
  const { children } = props;
  const contentElem = useRef<HTMLElement | null>(null);
  const [dragStart, setDragStart] = useState<
    { x: number; y: number } | undefined
  >();
  const [scale, setScale] = useState<number>(1);
  const [translate, setTranslate] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  return (
    <Box
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        userSelect: "none",
      }}
      onMouseDown={(e) => {
        setDragStart({ x: e.clientX, y: e.clientY });
      }}
      onMouseMove={(e) => {
        if (dragStart) {
          setTranslate({
            x: translate.x + e.clientX - dragStart.x,
            y: translate.y + e.clientY - dragStart.y,
          });
          setDragStart({ x: e.clientX, y: e.clientY });
        }
      }}
      onMouseUp={() => {
        setDragStart(undefined);
      }}
      onMouseLeave={() => {
        setDragStart(undefined);
      }}
      onWheel={(e) => {
        const scaleFactor = Math.pow(1.001, -e.deltaY);
        if (contentElem.current) {
          const contentBoundingRect =
            contentElem.current.getBoundingClientRect();
          setTranslate({
            x:
              (1 - scaleFactor) * (e.clientX - contentBoundingRect.x) +
              translate.x,
            y:
              (1 - scaleFactor) * (e.clientY - contentBoundingRect.y) +
              translate.y,
          });
          setScale(scale * scaleFactor);
        }
        e.stopPropagation();
      }}
    >
      <Box
        ref={contentElem}
        style={{
          transformOrigin: "top left",
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
        }}
        sx={{
          width: "max-content",
          height: "max-content",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CanvasController;
