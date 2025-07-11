import React from 'react';
import { DifficultyLevel } from '../types.ts';

interface DifficultySelectorProps {
  currentLevel: DifficultyLevel;
  onSelectLevel: (level: DifficultyLevel) => void;
  disabled?: boolean;
}

const levels: { value: DifficultyLevel; label: string; emoji: string }[] = [
  { value: 1, label: 'Легкий', emoji: '🧒' }, // 🧒
  { value: 2, label: 'Средний', emoji: '🧑‍🎓' }, // 🧑‍🎓
  { value: 3, label: 'Сложный', emoji: '🧑‍🏫' }, // 🧑‍🏫
];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ currentLevel, onSelectLevel, disabled }) => {
  return (
    <div className="my-5 text-center">
      <h3 className="text-xl font-semibold text-slate-700 mb-3">Выберите уровень:</h3>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => onSelectLevel(level.value)}
            disabled={disabled}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium transition-all duration-150 ease-in-out border-2 focus:outline-none focus:ring-2 focus:ring-offset-1
              ${
                currentLevel === level.value
                  ? 'bg-sky-500 text-white border-sky-600 shadow-lg scale-105 focus:ring-sky-400'
                  : 'bg-white text-sky-700 border-sky-300 hover:bg-sky-100 hover:border-sky-500 focus:ring-sky-300'
              }
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 active:scale-100'}
            `}
            aria-pressed={currentLevel === level.value}
            aria-label={`Уровень ${level.label}`}
          >
            {level.label} <span role="img" aria-hidden="true">{level.emoji}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;