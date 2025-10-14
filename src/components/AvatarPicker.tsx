import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AVATARS } from '@/lib/constants';
interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
}
export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selectedAvatar, onSelectAvatar }) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
      {AVATARS.map((avatar, index) => (
        <motion.button
          key={avatar}
          type="button"
          onClick={() => onSelectAvatar(avatar)}
          className={cn(
            'aspect-square text-3xl rounded-full flex items-center justify-center transition-all duration-200',
            selectedAvatar === avatar
              ? 'bg-primary-brand ring-4 ring-primary-brand/50 scale-110'
              : 'bg-muted hover:bg-accent'
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {avatar}
        </motion.button>
      ))}
    </div>
  );
};