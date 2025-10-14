import { ClickTheBoxPuzzle } from '@/components/puzzles/ClickTheBoxPuzzle';
import { TypeTheWordPuzzle } from '@/components/puzzles/TypeTheWordPuzzle';
import { ReactionTimePuzzle } from '@/components/puzzles/ReactionTimePuzzle';
import { ColorMatchPuzzle } from '@/components/puzzles/ColorMatchPuzzle';
import { SequenceTapPuzzle } from '@/components/puzzles/SequenceTapPuzzle';
import { MathSprintPuzzle } from '@/components/puzzles/MathSprintPuzzle';
import { FastTapPuzzle } from '@/components/puzzles/FastTapPuzzle';
import { EmojiMemoryGridPuzzle } from '@/components/puzzles/EmojiMemoryGridPuzzle';
import { BinarySwitchPuzzle } from '@/components/puzzles/BinarySwitchPuzzle';
import { ColorShadesPuzzle } from '@/components/puzzles/ColorShadesPuzzle';
import { SliderPrecisionPuzzle } from '@/components/puzzles/SliderPrecisionPuzzle';
import React from 'react';
export interface Puzzle {
  key: string;
  name: string;
  description: string;
  component: React.FC<{ onComplete: (score: number) => void }>;
}
export const PUZZLES: Puzzle[] = [
  { key: 'click-the-box', name: 'Box Click', description: 'Click the box as it appears.', component: ClickTheBoxPuzzle },
  { key: 'type-the-word', name: 'Word Type', description: 'Type the displayed word quickly.', component: TypeTheWordPuzzle },
  { key: 'reaction-time', name: 'Reaction Test', description: 'Click when the screen changes color.', component: ReactionTimePuzzle },
  { key: 'color-match', name: 'Color Match', description: 'Match the font color, not the word.', component: ColorMatchPuzzle },
  { key: 'sequence-tap', name: 'Sequence Memory', description: 'Repeat the pattern of lights.', component: SequenceTapPuzzle },
  { key: 'math-sprint', name: 'Math Sprint', description: 'Solve simple math problems fast.', component: MathSprintPuzzle },
  { key: 'fast-tap', name: 'Fast Tap', description: 'Tap the button as many times as you can.', component: FastTapPuzzle },
  { key: 'emoji-memory', name: 'Emoji Memory', description: 'Match pairs of hidden emojis.', component: EmojiMemoryGridPuzzle },
  { key: 'binary-switch', name: 'Light Switch', description: 'Turn on all the lights.', component: BinarySwitchPuzzle },
  { key: 'color-shades', name: 'Shade Spotter', description: 'Find the slightly different color.', component: ColorShadesPuzzle },
  { key: 'slider-precision', name: 'Slider Precision', description: 'Stop the slider on the target.', component: SliderPrecisionPuzzle },
];
export const PUZZLES_MAP = new Map(PUZZLES.map(p => [p.key, p.component]));