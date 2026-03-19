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
                className="w-24 h-24 border-8 border-brand-primary rounded-full border-t-transparent shadow-[0_0_20px_#ff5ebc]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <h1 className="mt-8 text-5xl font-black italic text-[#333] uppercase animate-bounce cartoon-text">Fun Time!</h1>
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
    const [combo, setCombo] = useState(0);
    const lastClickTime = useRef(0);

    const triggerEmoji = (e, emoji = "✨") => {
        const now = Date.now();
        if (now - lastClickTime.current < 1000) {
            setCombo(prev => prev + 1);
        } else {
            setCombo(1);
        }
        lastClickTime.current = now;

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
        <div className="relative min-h-screen bg-[#fff5fa] overflow-hidden">
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
                            if (Math.random() > 0.95) {
                                triggerEmoji(e, ["✨", "🌈", "🍭", "🎨"][Math.floor(Math.random() * 4)]);
                            }
                        }}
                    >
                        <EmojiEffect trigger={emojiTrigger} />

                        {/* Combo Popup */}
                        <AnimatePresence>
                            {combo > 1 && (
                                <motion.div 
                                    key={combo}
                                    initial={{ scale: 0, rotate: -20, opacity: 0 }}
                                    animate={{ scale: [1, 1.5, 1], rotate: 15, opacity: 1 }}
                                    exit={{ scale: 2, opacity: 0 }}
                                    className="combo-popup select-none"
                                >
                                    {combo}x COMBO!
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <Experience scroll={scrollRef} wireframe={wireframe} />
                        <Overlay scroll={scrollRef} triggerEmoji={triggerEmoji} />

                        {/* Progress Bar */}
                        <div className="fixed left-10 top-1/2 -translate-y-1/2 w-4 h-[40vh] bg-[#333]/5 rounded-full z-50 border-[6px] border-[#333] overflow-hidden shadow-[8px_8px_0px_rgba(0,0,0,0.1)]">
                            <motion.div 
                                className="w-full bg-brand-primary" 
                                style={{ height: "25%", top: progressBarTop, position: "absolute" }}
                            />
                        </div>

                        {/* Candy Nav Dock */}
                        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 p-6 rounded-full border-[8px] border-[#333] bg-white shadow-[12px_12px_0px_#333] z-[1001]">
                             {[Smile, Heart, Rocket, Candy, PartyPopper].map((Icon, i) => (
                                 <motion.button 
                                    key={i}
                                    onClick={(e) => triggerEmoji(e, ["😊", "❤️", "🚀", "🍬", "🎉"][i])}
                                    whileHover={{ scale: 1.3, rotate: 10, y: -10 }}
                                    whileTap={{ scale: 0.7 }}
                                    className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all border-4 border-[#333] shadow-lg outline-none focus:outline-none pointer-events-auto active:shadow-none`}
                                    style={{
                                        backgroundColor: ["#ff5ebc", "#42d3ff", "#ffd700", "#7bff00", "#ff7f00"][i % 5],
                                        color: "#333"
                                    }}
                                 >
                                     <Icon size={40} strokeWidth={4} />
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
                                className="bg-brand-accent px-12 py-5 rounded-full border-[6px] border-[#333] text-[#333] text-2xl font-black italic tracking-widest hover:scale-110 active:scale-95 transition-all uppercase shadow-[10px_10px_0px_#333]"
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
