import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PlayfulEmoji = ({ x, y, emoji, onComplete }) => {
    // Generate random trajectory
    const angle = (Math.random() - 0.5) * Math.PI * 0.5; // Upwards cone
    const velocity = 400 + Math.random() * 400;
    const tx = Math.sin(angle) * velocity;
    const ty = -Math.cos(angle) * velocity;

    return (
        <motion.div
            initial={{ opacity: 1, x, y, scale: 0, rotate: 0 }}
            animate={{ 
                opacity: 0, 
                x: x + tx, 
                y: y + ty, 
                scale: 3, 
                rotate: 720 
            }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            onAnimationComplete={onComplete}
            className="fixed pointer-events-none z-[200] text-7xl select-none"
            style={{ left: 0, top: 0 }}
        >
            {emoji}
        </motion.div>
    );
};

const EmojiEffect = ({ trigger }) => {
    const [emojis, setEmojis] = useState([]);
    const lastCount = useRef(0);

    useEffect(() => {
        // Detect ONLY when count increases
        if (trigger.count > lastCount.current) {
            lastCount.current = trigger.count;
            
            const newBatch = Array.from({ length: 12 }).map((_, i) => ({
                id: `${trigger.count}-${i}-${Math.random()}`,
                x: trigger.x,
                y: trigger.y,
                emoji: trigger.emoji || "✨"
            }));
            
            setEmojis(prev => [...prev.slice(-48), ...newBatch]); // Limit total active emojis to 60 for performance
        }
    }, [trigger]);

    const removeEmoji = useCallback((id) => {
        setEmojis(prev => prev.filter(e => e.id !== id));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[1000]">
            <AnimatePresence mode="popLayout">
                {emojis.map(e => (
                    <PlayfulEmoji 
                        key={e.id} 
                        {...e} 
                        onComplete={() => removeEmoji(e.id)} 
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default EmojiEffect;
