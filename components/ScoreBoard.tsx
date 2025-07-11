import React from 'react';

interface ScoreBoardProps {
  wins: number;
  losses: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ wins, losses }) => {
  return (
    <div className="my-4 p-3 bg-slate-200 rounded-lg shadow max-w-xs mx-auto text-center">
      <h3 className="text-lg font-semibold text-slate-700">Счет Игры:</h3>
      <p className="text-md text-slate-600">
        <span className="text-green-600 font-medium">Победы: {wins}</span> | 
        <span className="text-red-600 font-medium ml-2">Поражения: {losses}</span>
      </p>
    </div>
  );
};

export default ScoreBoard;