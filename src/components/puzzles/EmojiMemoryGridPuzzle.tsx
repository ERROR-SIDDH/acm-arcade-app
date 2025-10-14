import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface EmojiMemoryGridPuzzleProps {
  onComplete: (score: number) => void;
}
const EMOJIS = ['🚀', '��', '🦄', '🤖', '👽', '👾', '🤠', '🤡'];
type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};
export const EmojiMemoryGridPuzzle: React.FC<EmojiMemoryGridPuzzleProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const grid = useMemo(() => {
    const emojiPairs = [...EMOJIS, ...EMOJIS];
    const shuffled = emojiPairs.sort(() => 0.5 - Math.random());
    return shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
  }, []);
  useEffect(() => {
    setCards(grid);
    setStartTime(Date.now());
  }, [grid]);
  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Match
        setCards(prev =>
          prev.map(card =>
            card.emoji === cards[firstIndex].emoji ? { ...card, isMatched: true } : card
          )
        );
        setFlippedIndices([]);
        setIsChecking(false);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev =>
            prev.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);
  useEffect(() => {
    const allMatched = cards.length > 0 && cards.every(card => card.isMatched);
    if (allMatched && startTime) {
      const score = Date.now() - startTime;
      onComplete(score);
    }
  }, [cards, startTime, onComplete]);
  const handleCardClick = (index: number) => {
    if (
      isChecking ||
      flippedIndices.length >= 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }
    setCards(prev =>
      prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndices(prev => [...prev, index]);
  };
  return (
    <div className="w-full h-auto md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-4 space-y-4">
      <h3 className="text-xl font-bold">Match the Emoji Pairs!</h3>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {cards.map((card, index) => (
          <div key={card.id} className="w-16 h-16 md:w-20 md:h-20 [perspective:1000px]">
            <motion.div
              className="relative w-full h-full [transform-style:preserve-3d]"
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Card Back */}
              <div
                onClick={() => handleCardClick(index)}
                className="absolute w-full h-full [backface-visibility:hidden] bg-border rounded-lg cursor-pointer flex items-center justify-center text-3xl font-bold text-primary-brand"
              >
                ?
              </div>
              {/* Card Front */}
              <div
                className={cn(
                  "absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg flex items-center justify-center text-4xl",
                  card.isMatched ? "bg-green-500/20" : "bg-card"
                )}
              >
                {card.emoji}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};