import React from 'react';
import { Player } from '../types';

interface CharacterSheetProps {
  player: Player;
}

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.182 15.182 0 01-1.06-1.01A15.186 15.186 0 015.6 15.27l-.099-.101-.08-.086a4.5 4.5 0 01-1.22-3.26c0-1.4.52-2.69 1.34-3.693.82-1.003 1.98-1.575 3.14-1.575 1.16 0 2.32.572 3.14 1.575a4.5 4.5 0 011.34 3.693c0 1.4-.52 2.69-1.34 3.693a4.5 4.5 0 01-1.22 3.26l-.08.086-.099.101a15.185 15.185 0 01-2.404 2.871 15.247 15.247 0 01-1.344.688l-.022.012-.007.003z" />
  </svg>
);

const CharacterSheet: React.FC<CharacterSheetProps> = ({ player }) => {
  const healthPercentage = (player.health / player.maxHealth) * 100;

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 sticky top-4 z-10 shadow-lg">
      <h2 className="text-2xl font-cinzel text-amber-300 border-b-2 border-slate-600 pb-2 mb-4">전사</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartIcon className="text-red-500" />
            <span className="font-bold text-lg">체력</span>
          </div>
          <span className="font-mono text-xl text-red-400">{player.health} / {player.maxHealth}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4 border border-slate-600">
          <div
            className="bg-gradient-to-r from-red-500 to-red-700 h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;