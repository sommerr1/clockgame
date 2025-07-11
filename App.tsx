
import React, { useState, useCallback, useEffect } from 'react';
import AnalogClock from './components/AnalogClock.tsx';
import TaskPanel from './components/TaskPanel.tsx';
import ControlButtons from './components/ControlButtons.tsx';
import ScoreBoard from './components/ScoreBoard.tsx';
import DifficultySelector from './components/DifficultySelector.tsx';
import { Time, Task, DifficultyLevel } from './types.ts';

// Function to generate pluralized hour word in Russian
const getHourWord = (hour: number, is24HourFormat: boolean): string => {
  let h: number;
  if (is24HourFormat) {
    h = hour; // 0-23
  } else {
    h = hour === 0 ? 12 : hour; // 1-12 for 12-hour format display rule
  }

  const hMod10 = h % 10;
  const hMod100 = h % 100;

  if (hMod100 >= 11 && hMod100 <= 19) {
    return 'часов';
  }
  if (hMod10 === 1) {
    return 'час';
  }
  if (hMod10 >= 2 && hMod10 <= 4) {
    return 'часа';
  }
  return 'часов';
};

// Helper function for pluralizing "победа"
const getWinsWord = (count: number): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 19) {
    return 'побед';
  }
  if (mod10 === 1) {
    return 'победа';
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return 'победы';
  }
  return 'побед';
};


// Function to generate a random task based on difficulty
const generateRandomTask = (level: DifficultyLevel): Task => {
  let targetHour: number;
  let targetMinute: number;
  let description: string;

  if (level === 1) { // Easy: 12-hour, 5-min steps
    targetHour = Math.floor(Math.random() * 12); // 0-11 (0 represents 12)
    targetMinute = Math.floor(Math.random() * 12) * 5; // 0, 5, ..., 55
    
    const displayHour = targetHour === 0 ? 12 : targetHour; // For description "12 часов" not "0 часов"
    const hourWord = getHourWord(targetHour, false);
    description = `${displayHour} ${hourWord} ${String(targetMinute).padStart(2, '0')} минут`;

  } else if (level === 2) { // Medium: 12-23 hour, 5-min steps
    targetHour = Math.floor(Math.random() * 12) + 12; // Generates 12-23
    targetMinute = Math.floor(Math.random() * 12) * 5; // 0, 5, ..., 55
    
    const hourWord = getHourWord(targetHour, true);
    description = `${String(targetHour).padStart(2, '0')} ${hourWord} ${String(targetMinute).padStart(2, '0')} минут`;

  } else { // Hard: 24-hour, 1-min steps
    targetHour = Math.floor(Math.random() * 24); // 0-23
    targetMinute = Math.floor(Math.random() * 60); // 0-59

    const hourWord = getHourWord(targetHour, true);
    description = `${String(targetHour).padStart(2, '0')} ${hourWord} ${String(targetMinute).padStart(2, '0')} минут`;
  }

  return {
    id: Date.now(),
    targetHour,
    targetMinute,
    description
  };
};

const App: React.FC = () => {
  const [userSetTime, setUserSetTime] = useState<Time>({ hour: 0, minute: 0 });
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [showSalute, setShowSalute] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false); // New state for game over
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);

  const WINS_FOR_SALUTE = 5;
  const LOSSES_FOR_GAME_OVER = 5; // New constant

  const resetClockAndFeedback = useCallback(() => {
    setUserSetTime({ hour: 0, minute: 0 });
    setFeedbackMessage(null);
    setIsCorrect(null);
  }, []);

  const startNewGameRound = useCallback((levelToUse: DifficultyLevel) => {
    setWins(0);
    setLosses(0);
    setShowSalute(false);
    setShowGameOver(false); // Reset game over state
    setCurrentTask(generateRandomTask(levelToUse));
    resetClockAndFeedback();
  }, [resetClockAndFeedback]);

  const prepareNextTask = useCallback((levelToUse: DifficultyLevel) => {
    setCurrentTask(generateRandomTask(levelToUse));
    resetClockAndFeedback();
  }, [resetClockAndFeedback]);
  
  useEffect(() => {
    startNewGameRound(difficulty);
  }, [difficulty, startNewGameRound]); // Added startNewGameRound to deps as it now includes setShowGameOver


  const handleTimeUpdate = useCallback((newTime: Time) => {
    setUserSetTime(newTime);
    if (isCorrect !== null && !showSalute && !showGameOver) { 
        setFeedbackMessage(null);
        setIsCorrect(null);
    }
  }, [isCorrect, showSalute, showGameOver]);

  const checkAnswer = useCallback(() => {
    if (!currentTask || showSalute || showGameOver) return;

    let isHourCorrectFlag: boolean;
    const userClockHour = userSetTime.hour; 

    if (difficulty === 1) {
      isHourCorrectFlag = userClockHour === currentTask.targetHour;
    } else { 
      const expectedUserClockHour = currentTask.targetHour % 12;
      isHourCorrectFlag = userClockHour === expectedUserClockHour;
    }

    const isMinuteCorrectFlag = userSetTime.minute === currentTask.targetMinute;

    if (isHourCorrectFlag && isMinuteCorrectFlag) {
      const newWins = wins + 1;
      setWins(newWins);
      setIsCorrect(true);
      if (newWins >= WINS_FOR_SALUTE) {
        setShowSalute(true);
        setFeedbackMessage(`ПОЗДРАВЛЯЕМ! ${newWins} ${getWinsWord(newWins)}! Отличная работа! 🎉🎊🎈`); // This message is for internal state
      } else {
        setFeedbackMessage("Правильно! Молодец! 🎉");
      }
    } else {
      const newLosses = losses + 1;
      setLosses(newLosses);
      setIsCorrect(false);

      if (newLosses >= LOSSES_FOR_GAME_OVER) {
        setShowGameOver(true);
        // Feedback message here is less critical as TaskPanel will be hidden
        // but set it for consistency or if it were used elsewhere.
        setFeedbackMessage("Вы проиграли! Попробуйте снова."); 
      } else {
        let specificFeedback = "Попробуй еще раз. ";
        const hourWrong = !isHourCorrectFlag;
        const minuteWrong = !isMinuteCorrectFlag;

        if (hourWrong && minuteWrong) {
          specificFeedback += "И час, и минуты неверны.";
        } else if (hourWrong) {
          specificFeedback += "Час указан неверно.";
        } else if (minuteWrong) {
          specificFeedback += "Минуты указаны неверно.";
        }
        setFeedbackMessage(specificFeedback + " 🤔");
      }
    }
  }, [userSetTime, currentTask, wins, losses, showSalute, showGameOver, difficulty]); // Added losses and showGameOver

  const handleProceed = useCallback(() => {
    if (showSalute || showGameOver) {
      startNewGameRound(difficulty);
    } else {
      prepareNextTask(difficulty);
    }
  }, [showSalute, showGameOver, startNewGameRound, prepareNextTask, difficulty]); // Added showGameOver

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel); 
  };
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center lg:items-stretch bg-gradient-to-br from-sky-100 to-blue-200 font-sans p-4 lg:p-8 lg:space-x-8">
      
      <div className="w-full lg:w-1/2 flex justify-center items-center py-4 lg:py-0">
        <AnalogClock 
          time={userSetTime} 
          onTimeUpdate={handleTimeUpdate} 
          draggable={!(isCorrect || showSalute || showGameOver)} 
        />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start space-y-4 lg:space-y-6 py-4 lg:py-0">
        <header className="text-center lg:text-left w-full">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
            Интерактивные Часы <span role="img" aria-label="clock emoji">🕰️</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mt-2">Научись определять время весело!</p>
        </header>

        <main className="w-full max-w-lg lg:max-w-none bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-2xl">
          <DifficultySelector 
            currentLevel={difficulty} 
            onSelectLevel={handleDifficultyChange}
            disabled={showSalute || isCorrect === true || showGameOver}
          />
          <ScoreBoard wins={wins} losses={losses} />
          
          {showSalute ? (
            <div className="text-center p-4 my-6 bg-yellow-100 border-2 border-yellow-400 rounded-lg max-w-md mx-auto animate-pulse">
              <h2 className="text-3xl font-bold text-yellow-700">ПОЗДРАВЛЯЕМ!</h2>
              <p className="text-xl mt-2 text-yellow-600">
                {wins} {getWinsWord(wins)}! Отличная работа! 
                <span role="img" aria-label="confetti emojis" className="ml-2">🎉🎊🎈</span>
              </p>
            </div>
          ) : showGameOver ? (
            <div className="text-center p-4 my-6 bg-red-100 border-2 border-red-400 rounded-lg max-w-md mx-auto">
              <h2 className="text-3xl font-bold text-red-700">ВЫ ПРОИГРАЛИ!</h2>
              <p className="text-xl mt-2 text-red-600">
                Кажется, удача сегодня не на вашей стороне. Не расстраивайтесь!
                <span role="img" aria-label="sad face emoji" className="ml-2">😥</span>
              </p>
              <p className="text-md mt-1 text-slate-600">Счет будет сброшен.</p>
            </div>
          ) : (
            <TaskPanel 
              currentTask={currentTask} 
              feedbackMessage={feedbackMessage} 
              isCorrect={isCorrect} 
            />
          )}
          
          <ControlButtons 
            onCheckAnswer={checkAnswer} 
            onProceed={handleProceed}
            isAnswerCorrect={isCorrect}
            showSalute={showSalute}
            showGameOver={showGameOver} 
          />
        </main>

        <footer className="text-center lg:text-left text-slate-500 pt-4 w-full">
          <p>&copy; {new Date().getFullYear()} Веселые Часики. Удачи в обучении!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;