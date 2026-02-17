import { useState } from 'react';
import type { InputState } from '../engine/types';

export function useTouchControls(enabled: boolean): InputState {
  const [input, setInput] = useState<InputState>({
    moveX: 0,
    moveY: 0,
    aimX: 640,
    aimY: 360,
    firing: false,
  });

  const updateMovement = (x: number, y: number) => {
    setInput((prev) => ({ ...prev, moveX: x, moveY: y }));
  };

  const updateAim = (x: number, y: number) => {
    setInput((prev) => ({ ...prev, aimX: x, aimY: y }));
  };

  const setFiring = (firing: boolean) => {
    setInput((prev) => ({ ...prev, firing }));
  };

  if (!enabled) {
    return {
      moveX: 0,
      moveY: 0,
      aimX: 640,
      aimY: 360,
      firing: false,
    };
  }

  return input;
}

export function useTouchControlsCallbacks() {
  const [input, setInput] = useState<InputState>({
    moveX: 0,
    moveY: 0,
    aimX: 640,
    aimY: 360,
    firing: false,
  });

  return {
    input,
    updateMovement: (x: number, y: number) => {
      setInput((prev) => ({ ...prev, moveX: x, moveY: y }));
    },
    updateAim: (x: number, y: number) => {
      setInput((prev) => ({ ...prev, aimX: x, aimY: y }));
    },
    setFiring: (firing: boolean) => {
      setInput((prev) => ({ ...prev, firing }));
    },
  };
}
