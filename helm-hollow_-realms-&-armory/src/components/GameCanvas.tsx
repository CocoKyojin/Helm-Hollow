import React, { useEffect, useRef } from 'react';
import { HelmEngine } from '../game/engine';
import { GameState, PlayerState } from '../game/types';

interface GameCanvasProps {
  onEngineReady: (engine: HelmEngine) => void;
  onStateChange: (state: GameState) => void;
  onPlayerUpdate: (player: PlayerState) => void;
  onToast: (msg: string) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onEngineReady,
  onStateChange,
  onPlayerUpdate,
  onToast,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<HelmEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new HelmEngine(canvasRef.current);
    engineRef.current = engine;

    engine.onStateChange = onStateChange;
    engine.onPlayerUpdate = onPlayerUpdate;
    engine.onToast = onToast;

    onEngineReady(engine);
    engine.startLoop();

    return () => {
      engine.stopLoop();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0d141b] select-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none select-none"
      />
    </div>
  );
};
