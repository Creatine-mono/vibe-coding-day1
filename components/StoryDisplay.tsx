
import React, { useRef, useEffect } from 'react';
import { StorySegment } from '../types';

interface StoryDisplayProps {
  storyLog: StorySegment[];
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyLog }) => {
  const endOfLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [storyLog]);

  return (
    <div className="h-full max-h-[60vh] md:max-h-full overflow-y-auto p-6 bg-slate-800/30 rounded-lg border border-slate-700 shadow-inner">
      <div className="space-y-6">
        {storyLog.map((segment) => (
          <div key={segment.id} className="animate-fade-in">
            {segment.isPlayerChoice ? (
              <div className="text-right">
                <p className="inline-block bg-amber-900/50 border border-amber-700/50 text-amber-200 rounded-lg px-4 py-2 italic text-lg">
                  {segment.choiceText}
                </p>
              </div>
            ) : (
              <p className="text-stone-300 whitespace-pre-wrap leading-relaxed text-xl">
                {segment.narrative}
              </p>
            )}
          </div>
        ))}
      </div>
      <div ref={endOfLogRef} />
    </div>
  );
};

export default StoryDisplay;
