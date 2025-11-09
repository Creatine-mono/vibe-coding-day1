
import React from 'react';
import { Choice } from '../types';

interface ChoiceButtonsProps {
  choices: Choice[];
  onChoiceClick: (prompt: string, text: string) => void;
}

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ choices, onChoiceClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => onChoiceClick(choice.prompt, choice.text)}
          className="text-lg text-left w-full bg-slate-800 hover:bg-amber-800 border-2 border-slate-600 hover:border-amber-500 rounded-lg p-4 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-75"
        >
          <span className="font-cinzel text-amber-300">{`> `}</span>
          <span className="text-stone-200">{choice.text}</span>
        </button>
      ))}
    </div>
  );
};

export default ChoiceButtons;
