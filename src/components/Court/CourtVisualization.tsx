import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { ShotAttempt } from '../../store/resultsSlice';

const CourtVisualization: React.FC = () => {
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const isSimulating = useSelector((state: RootState) => state.simulator.isSimulating);
  const gameState = useSelector((state: RootState) => state.simulator.gameState);
  
  const [shotMarkers, setShotMarkers] = useState<ShotAttempt[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Court dimensions in feet
  const courtWidth = 50;
  const courtLength = 94;
  const threePointRadius = 23.75; // Adjustable based on rules
  const threePointStraightDistance = 22; // Distance at the top of the arc
  const freeThrowLineDistance = 15;
  const freeThrowRadius = 6;
  const rimRadius = 0.75;
  const backboardWidth = 6;
  const backboardDistance = 4;
  const keyWidth = 16;
  const keyLength = 19;
  const centerCircleRadius = 6;
  
  // Scale factor to convert feet to pixels
  const scaleFactor = 8;
  
  useEffect(() => {
    if (currentResults?.shotChart) {
      setShotMarkers(currentResults.shotChart);
    }
  }, [currentResults]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw court
    drawCourt(ctx);
    
    // Draw shot markers
    drawShotMarkers(ctx);
    
    // Draw current game state (ball position, player positions, etc.)
    if (isSimulating) {
      drawGameState(ctx);
    }
  }, [shotMarkers, isSimulating, gameState]);
  
  const drawCourt = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Court background
    ctx.fillStyle = '#E8A958'; // Hardwood color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw court outline
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();
    
    // Center circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, centerCircleRadius * scaleFactor, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw baskets and keys
    drawBasket(ctx, 10, canvas.height / 2); // Left basket
    drawBasket(ctx, canvas.width - 10, canvas.height / 2); // Right basket
    
    // Draw three-point lines
    drawThreePointLine(ctx, 10, canvas.height / 2, false); // Left
    drawThreePointLine(ctx, canvas.width - 10, canvas.height / 2, true); // Right
  };
  
  const drawBasket = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const isLeftBasket = x < 100;
    const keyX = isLeftBasket ? x : x - keyWidth * scaleFactor;
    
    // Paint/key area
    ctx.fillStyle = '#C47E3B'; // Key color
    ctx.fillRect(
      keyX,
      y - keyWidth * scaleFactor / 2,
      keyLength * scaleFactor,
      keyWidth * scaleFactor
    );
    
    // Key outline
    ctx.strokeStyle = '#FFFFFF';
    ctx.strokeRect(
      keyX,
      y - keyWidth * scaleFactor / 2,
      keyLength * scaleFactor,
      keyWidth * scaleFactor
    );
    
    // Free throw line
    ctx.beginPath();
    ctx.moveTo(
      isLeftBasket ? x + freeThrowLineDistance * scaleFactor : x - freeThrowLineDistance * scaleFactor,
      y - keyWidth * scaleFactor / 2
    );
    ctx.lineTo(
      isLeftBasket ? x + freeThrowLineDistance * scaleFactor : x - freeThrowLineDistance * scaleFactor,
      y + keyWidth * scaleFactor / 2
    );
    ctx.stroke();
    
    // Free throw circle
    ctx.beginPath();
    ctx.arc(
      isLeftBasket ? x + freeThrowLineDistance * scaleFactor : x - freeThrowLineDistance * scaleFactor,
      y,
      freeThrowRadius * scaleFactor,
      0,
      Math.PI * 2
    );
    ctx.stroke();
    
    // Backboard
    ctx.beginPath();
    ctx.moveTo(
      isLeftBasket ? x + backboardDistance * scaleFactor : x - backboardDistance * scaleFactor,
      y - backboardWidth * scaleFactor / 2
    );
    ctx.lineTo(
      isLeftBasket ? x + backboardDistance * scaleFactor : x - backboardDistance * scaleFactor,
      y + backboardWidth * scaleFactor / 2
    );
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineWidth = 2;
    
    // Rim
    ctx.beginPath();
    ctx.arc(
      isLeftBasket ? x + backboardDistance * scaleFactor + rimRadius * scaleFactor : x - backboardDistance * scaleFactor - rimRadius * scaleFactor,
      y,
      rimRadius * scaleFactor,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  };
  
  const drawThreePointLine = (ctx: CanvasRenderingContext2D, x: number, y: number, isRight: boolean) => {
    const centerX = isRight ? x - backboardDistance * scaleFactor - rimRadius * scaleFactor : x + backboardDistance * scaleFactor + rimRadius * scaleFactor;
    
    ctx.beginPath();
    
    // Starting point - bottom
    ctx.moveTo(
      isRight ? centerX - threePointStraightDistance * scaleFactor : centerX + threePointStraightDistance * scaleFactor,
      y + keyWidth * scaleFactor / 2
    );
    
    // Arc
    ctx.arc(
      centerX,
      y,
      threePointRadius * scaleFactor,
      isRight ? Math.PI * 0.85 : Math.PI * 0.15,
      isRight ? Math.PI * 1.15 : -Math.PI * 0.15,
      !isRight
    );
    
    // End point - top
    ctx.lineTo(
      isRight ? centerX - threePointStraightDistance * scaleFactor : centerX + threePointStraightDistance * scaleFactor,
      y - keyWidth * scaleFactor / 2
    );
    
    ctx.stroke();
  };
  
  const drawShotMarkers = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    shotMarkers.forEach(shot => {
      const isHome = shot.team === 'home';
      
      // Calculate position based on shot location
      let x: number, y: number;
      
      // Simple mapping for demonstration purposes
      // In a real app, you'd have exact coordinates from the simulation
      if (shot.location === 'threePoint') {
        // Random position outside 3-point line
        const angle = Math.random() * Math.PI;
        const distance = threePointRadius + Math.random() * 3;
        
        x = canvas.width / 2 + Math.cos(angle) * distance * scaleFactor;
        y = canvas.height / 2 + Math.sin(angle) * distance * scaleFactor;
      } else if (shot.location === 'midRange') {
        // Random mid-range position
        const angle = Math.random() * Math.PI;
        const distance = 10 + Math.random() * 10;
        
        x = canvas.width / 2 + Math.cos(angle) * distance * scaleFactor;
        y = canvas.height / 2 + Math.sin(angle) * distance * scaleFactor;
      } else if (shot.location === 'inside') {
        // Random position inside the key
        const sideX = isHome ? canvas.width - 50 : 50;
        
        x = sideX + (Math.random() - 0.5) * keyWidth * scaleFactor;
        y = canvas.height / 2 + (Math.random() - 0.5) * keyWidth * scaleFactor;
      } else {
        // Free throw
        const sideX = isHome ? canvas.width - 50 : 50;
        
        x = isHome ? 
          sideX - freeThrowLineDistance * scaleFactor : 
          sideX + freeThrowLineDistance * scaleFactor;
        y = canvas.height / 2 + (Math.random() - 0.5) * 2;
      }
      
      // Draw shot marker
      ctx.fillStyle = shot.made ? 
        (isHome ? '#4CAF50' : '#8BC34A') : // Made shots - green variants
        (isHome ? '#F44336' : '#E91E63');  // Missed shots - red variants
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  const drawGameState = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Draw ball
    const ballX = canvas.width / 2;
    const ballY = canvas.height / 2;
    
    ctx.fillStyle = '#D95621'; // Basketball color
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw lines for ball seams
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI, true);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, Math.PI / 2, Math.PI * 1.5, true);
    ctx.stroke();
  };
  
  return (
    <div className="card">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Court Visualization</h2>
        
        <div className="flex space-x-2">
          <button 
            className="btn btn-secondary text-sm py-1"
            onClick={() => setShotMarkers([])}
          >
            Clear Shots
          </button>
          
          <button className="btn btn-primary text-sm py-1">
            <svg className="w-4 h-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Export
          </button>
        </div>
      </div>
      
      <div className="relative bg-court rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={courtLength * scaleFactor}
          height={courtWidth * scaleFactor}
          className="w-full h-auto"
        />
        
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-75 rounded px-2 py-1 text-xs">
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            <span>Made Shot</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
            <span>Missed Shot</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Total Shots: {shotMarkers.length}</p>
        <p>Made: {shotMarkers.filter(s => s.made).length} ({shotMarkers.length > 0 ? Math.round(shotMarkers.filter(s => s.made).length / shotMarkers.length * 100) : 0}%)</p>
      </div>
    </div>
  );
};

export default CourtVisualization;