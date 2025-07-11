
import React from 'react';

interface ControlButtonsProps {
  onCheckAnswer: () => void;
  onProceed: () => void;
  isAnswerCorrect: boolean | null; 
  showSalute: boolean;
  showGameOver: boolean; // New prop for game over state
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ onCheckAnswer, onProceed, isAnswerCorrect, showSalute, showGameOver }) => {
  const showProceedButton = isAnswerCorrect || showSalute || showGameOver;
  
  let proceedButtonText = "Следующее задание ➡️";
  let proceedButtonColorClass = 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-400';
  let proceedButtonAriaLabel = "Следующее задание";

  if (showSalute) {
    proceedButtonText = "Играть снова! 🔄";
    proceedButtonColorClass = 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-400';
    proceedButtonAriaLabel = "Играть снова";
  } else if (showGameOver) {
    proceedButtonText = "Попробовать снова 🔁";
    proceedButtonColorClass = 'bg-red-500 hover:bg-red-600 focus:ring-red-400';
    proceedButtonAriaLabel = "Попробовать снова";
  }
  
  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6 mb-8">
      {!showProceedButton && (
        <button
          onClick={onCheckAnswer}
          className="w-full sm:w-auto px-8 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
          aria-label="Проверить ответ"
        >
          Проверить
        </button>
      )}
      {showProceedButton && (
         <button
          onClick={onProceed}
          className={`w-full sm:w-auto px-8 py-3 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-150 ease-in-out ${proceedButtonColorClass}`}
          aria-label={proceedButtonAriaLabel}
        >
          {proceedButtonText}
        </button>
      )}
    </div>
  );
};

export default ControlButtons;
