import React from 'react';
import { Task } from '../types.ts';

interface TaskPanelProps {
  currentTask: Task | null;
  feedbackMessage: string | null;
  isCorrect: boolean | null;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ currentTask, feedbackMessage, isCorrect }) => {
  if (!currentTask) {
    return (
      <div className="text-center p-4 my-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
        <p className="text-xl text-emerald-700 font-semibold">Все задания выполнены! Отличная работа! 🏆</p>
      </div>
    );
  }

  return (
    <div className="text-center p-4 my-6 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-sky-700 mb-3">Задание:</h2>
      <p className="text-xl text-slate-800 mb-4">
        Поставь время на <strong className="text-sky-600">{currentTask.description}</strong>
      </p>
      {feedbackMessage && (
        <p
          className={`text-lg font-medium p-3 rounded transition-all duration-300 ${
            isCorrect === true ? 'bg-green-100 text-green-700' : 
            isCorrect === false ? 'bg-red-100 text-red-700' : 
            'bg-blue-100 text-blue-700' // Neutral/info if isCorrect is null
          }`}
        >
          {feedbackMessage}
        </p>
      )}
    </div>
  );
};

export default TaskPanel;