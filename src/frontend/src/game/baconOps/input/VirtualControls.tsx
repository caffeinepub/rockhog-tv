import { useEffect, useRef, useState } from 'react';
import { Crosshair } from 'lucide-react';
import { useTouchControlsCallbacks } from './useTouchControls';

export default function VirtualControls() {
  const { updateMovement, updateAim, setFiring } = useTouchControlsCallbacks();
  const joystickRef = useRef<HTMLDivElement>(null);
  const fireButtonRef = useRef<HTMLButtonElement>(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleJoystickStart = (e: TouchEvent) => {
      if (!joystickRef.current) return;
      const touch = e.touches[0];
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setJoystickActive(true);
      handleJoystickMove(touch.clientX, touch.clientY, centerX, centerY);
    };

    const handleJoystickMove = (clientX: number, clientY: number, centerX: number, centerY: number) => {
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 40;
      
      const clampedDistance = Math.min(distance, maxDistance);
      const angle = Math.atan2(dy, dx);
      
      const x = Math.cos(angle) * clampedDistance;
      const y = Math.sin(angle) * clampedDistance;
      
      setJoystickPosition({ x, y });
      
      const normalizedX = x / maxDistance;
      const normalizedY = y / maxDistance;
      updateMovement(normalizedX, normalizedY);
    };

    const handleJoystickEnd = () => {
      setJoystickActive(false);
      setJoystickPosition({ x: 0, y: 0 });
      updateMovement(0, 0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!joystickActive || !joystickRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      handleJoystickMove(touch.clientX, touch.clientY, centerX, centerY);
    };

    const handleFireStart = () => {
      setFiring(true);
    };

    const handleFireEnd = () => {
      setFiring(false);
    };

    const joystick = joystickRef.current;
    const fireButton = fireButtonRef.current;

    if (joystick) {
      joystick.addEventListener('touchstart', handleJoystickStart);
      joystick.addEventListener('touchmove', handleTouchMove as any);
      joystick.addEventListener('touchend', handleJoystickEnd);
    }

    if (fireButton) {
      fireButton.addEventListener('touchstart', handleFireStart);
      fireButton.addEventListener('touchend', handleFireEnd);
    }

    return () => {
      if (joystick) {
        joystick.removeEventListener('touchstart', handleJoystickStart);
        joystick.removeEventListener('touchmove', handleTouchMove as any);
        joystick.removeEventListener('touchend', handleJoystickEnd);
      }
      if (fireButton) {
        fireButton.removeEventListener('touchstart', handleFireStart);
        fireButton.removeEventListener('touchend', handleFireEnd);
      }
    };
  }, [joystickActive, updateMovement, setFiring]);

  return (
    <div className="bacon-ops-virtual-controls">
      <div 
        ref={joystickRef}
        className="bacon-ops-joystick"
      >
        <div 
          className="bacon-ops-joystick-stick"
          style={{
            transform: `translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
          }}
        />
      </div>

      <button
        ref={fireButtonRef}
        className="bacon-ops-fire-button"
      >
        <Crosshair className="w-8 h-8" />
      </button>
    </div>
  );
}
