import { useEffect, useState, RefObject } from 'react';
import type { InputState } from '../engine/types';

export function useDesktopControls(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  enabled: boolean
): InputState {
  const [input, setInput] = useState<InputState>({
    moveX: 0,
    moveY: 0,
    aimX: 0,
    aimY: 0,
    firing: false,
  });

  useEffect(() => {
    if (!enabled) return;

    const keys = new Set<string>();
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.delete(e.key.toLowerCase());
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      mouseX = (e.clientX - rect.left) * scaleX;
      mouseY = (e.clientY - rect.top) * scaleY;
    };

    const handleMouseDown = () => {
      isMouseDown = true;
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const updateInput = () => {
      let moveX = 0;
      let moveY = 0;

      if (keys.has('w') || keys.has('arrowup')) moveY -= 1;
      if (keys.has('s') || keys.has('arrowdown')) moveY += 1;
      if (keys.has('a') || keys.has('arrowleft')) moveX -= 1;
      if (keys.has('d') || keys.has('arrowright')) moveX += 1;

      setInput({
        moveX,
        moveY,
        aimX: mouseX,
        aimY: mouseY,
        firing: isMouseDown,
      });
    };

    const intervalId = setInterval(updateInput, 16);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [enabled, canvasRef]);

  return input;
}
