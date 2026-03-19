import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Experience from './components/Experience';
import Overlay from './components/Overlay';
import EmojiEffect from './components/EmojiEffect';
import { Smile, Heart, Rocket, Candy, PartyPopper } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LoadingScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 2500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            key="preloader"
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-10 overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
             <motion.div 
                className="w-24 h-24 border-8 border-brand-primary rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <h1 className="mt-8 text-4xl font-black italic text-[#333] uppercase animate-bounce">Loading Fun...</h1>
        </motion.div>
    );
};

function App() {
    const [loading, setLoading] = useState(true);
    const [wireframe, setWireframe] = useState(false);
    const scrollRef = useRef(0);
    const scrollProgress = useMotionValue(0);
    const progressBarTop = useTransform(scrollProgress, [0, 1], ["0%", "75%"]);
    const lenisRef = useRef(null);

    const [emojiTrigger, setEmojiTrigger] = useState({ x: 0, y: 0, count: 0, emoji: "✨" });

    const triggerEmoji = (e, emoji = "✨") => {
        setEmojiTrigger(prev => ({
            x: e.clientX || window.innerWidth / 2,
            y: e.clientY || window.innerHeight / 2,
            count: prev.count + 1,
            emoji
        }));
    };

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            lerp: 0.1,
            infinite: false,
        });

        lenisRef.current = lenis;

        lenis.on('scroll', (e) => {
            ScrollTrigger.update();
            scrollProgress.set(e.progress);

            const totalHeight = e.limit;
            const currentScroll = e.scroll;
            const progress = e.progress;
            
            if (progress > 0.666) {
                lenis.scrollTo(currentScroll - (totalHeight / 3), { immediate: true });
            } else if (progress < 0.333) {
                 lenis.scrollTo(currentScroll + (totalHeight / 3), { immediate: true });
            }
        });

        setTimeout(() => {
            if (lenisRef.current) {
                const mid = lenisRef.current.limit / 2;
                lenisRef.current.scrollTo(mid, { immediate: true });
            }
        }, 100);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
            gsap.ticker.remove(lenis.raf);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-[#fff5fa]">
            <AnimatePresence mode="wait">
                {loading ? (
                    <LoadingScreen onComplete={() => setLoading(false)} />
                ) : (
                    <motion.div 
                        key="main"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative"
                        onMouseMove={(e) => {
                            if (Math.random() > 0.92) { // 8% chance per move to spawn a trail star
                                triggerEmoji(e, "✨");
                            }
                        }}
                    >
                        <EmojiEffect trigger={emojiTrigger} />
                        
                        <Experience scroll={scrollRef} wireframe={wireframe} />
                        <Overlay scroll={scrollRef} triggerEmoji={triggerEmoji} />

                        {/* Progress Bar */}
                        <div className="fixed left-10 top-1/2 -translate-y-1/2 w-3 h-[30vh] bg-[#333]/10 rounded-full z-50 border-2 border-[#333] overflow-hidden">
                            <motion.div 
                                className="w-full bg-brand-primary" 
                                style={{ height: "25%", top: progressBarTop, position: "absolute" }}
                            />
                        </div>

                        {/* Playful Candy Nav Dock */}
                        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 p-5 rounded-full border-[6px] border-[#333] bg-white shadow-[10px_10px_0px_#333] z-[1001]">
                             {[Smile, Heart, Rocket, Candy, PartyPopper].map((Icon, i) => (
                                 <motion.button 
                                    key={i}
                                    onClick={(e) => triggerEmoji(e, ["😊", "❤️", "🚀", "🍬", "🎉"][i])}
                                    whileHover={{ scale: 1.2, rotate: 15 }}
                                    whileTap={{ scale: 0.8 }}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all border-4 border-[#333] shadow-lg outline-none focus:outline-none pointer-events-auto`}
                                    style={{
                                        backgroundColor: ["#ff5ebc", "#42d3ff", "#ffd700", "#7bff00", "#ff7f00"][i % 5],
                                        color: "#333"
                                    }}
                                 >
                                     <Icon size={30} strokeWidth={4} />
                                 </motion.button>
                             ))}
                        </div>

                        {/* Fun Mode Toggle */}
                        <div className="fixed top-10 right-10 flex items-center gap-6 z-[60]">
                             <button 
                                onClick={(e) => {
                                    setWireframe(!wireframe);
                                    triggerEmoji(e, "🎈");
                                }}
                                className="bg-brand-accent px-10 py-4 rounded-full border-[5px] border-[#333] text-[#333] text-xl font-black italic tracking-widest hover:scale-110 transition-all uppercase shadow-[8px_8px_0px_#333]"
                             >
                                FUN_MODE: {wireframe ? 'BUBBLE' : 'DASH'}
                             </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
