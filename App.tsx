import React, { useState, useEffect, useCallback } from 'react';
import { Player, Choice, StorySegment, GameResponse } from './types';
import { getInitialStory, getGameUpdate } from './services/gameService';
import CharacterSheet from './components/CharacterSheet';
import StoryDisplay from './components/StoryDisplay';
import ChoiceButtons from './components/ChoiceButtons';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const initialPlayerState: Player = {
    health: 100,
    maxHealth: 100,
    attack: 10,
  };

  const [player, setPlayer] = useState<Player>(initialPlayerState);
  const [storyLog, setStoryLog] = useState<StorySegment[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameMessage, setGameMessage] = useState<string>('');

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setIsGameOver(false);
    setGameMessage('');
    setPlayer(initialPlayerState);
    setStoryLog([]);
    const initialResponse = await getInitialStory();
    if (initialResponse) {
      setStoryLog([{ id: Date.now(), narrative: initialResponse.narrative }]);
      setChoices(initialResponse.choices);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const handleChoiceClick = async (prompt: string, choiceText: string) => {
    setIsLoading(true);
    setChoices([]);
    setStoryLog(prevLog => [...prevLog, { id: Date.now(), isPlayerChoice: true, choiceText, narrative: '' }]);

    const response: GameResponse = await getGameUpdate(prompt, player.health);

    if (response) {
      setStoryLog(prevLog => [...prevLog, { id: Date.now() + 1, narrative: response.narrative }]);

      let newHealth = player.health;
      if (response.playerUpdate?.healthChange) {
        newHealth = Math.max(0, player.health + response.playerUpdate.healthChange);
      }
      setPlayer(prevPlayer => ({ ...prevPlayer, health: newHealth }));
      
      if (response.gameOver || newHealth <= 0) {
        setIsGameOver(true);
        setGameMessage(response.gameMessage || '당신의 여정은 비극적인 끝을 맞이했습니다.');
        setChoices([]);
      } else if (response.gameWon) {
        setIsGameOver(true);
        setGameMessage(response.gameMessage || '당신은 승리했습니다!');
        setChoices([]);
      } else {
        setChoices(response.choices);
      }
    }
    setIsLoading(false);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed" 
      style={{backgroundImage: "url('https://picsum.photos/seed/medieval/1920/1080')"}}
    >
      <div className="min-h-screen bg-slate-900/80 backdrop-blur-sm flex flex-col items-center p-4 sm:p-6 md:p-8">
        <header className="w-full max-w-5xl text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-cinzel font-bold text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            중세 텍스트 RPG
          </h1>
          <p className="text-stone-400 mt-2">당신의 모험이 기다립니다...</p>
        </header>

        <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 flex-grow">
          <aside className="md:col-span-1">
            <CharacterSheet player={player} />
          </aside>
          <div className="md:col-span-2 bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col justify-between">
            <StoryDisplay storyLog={storyLog} />
            <div className="mt-4">
              {isLoading && <LoadingSpinner />}
              {!isLoading && !isGameOver && <ChoiceButtons choices={choices} onChoiceClick={handleChoiceClick} />}
              {isGameOver && (
                <div className="text-center p-6 bg-red-900/30 border border-red-700 rounded-lg animate-fade-in">
                  <h3 className="text-3xl font-cinzel text-red-400 mb-4">{gameMessage}</h3>
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded-lg transition-transform transform hover:scale-105"
                  >
                    새로운 전설 시작하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;