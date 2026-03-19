import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smile, Cat, Ghost, Sparkles, Heart, Rocket, Globe, Zap, Mail, Info, Compass, ChevronRight, Candy, PartyPopper } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Section = ({ title, subtitle, icon, triggerEmoji, emoji = "✨", color = "bg-pink-400", children }) => {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const onMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
    };

    return (
        <section className={`min-h-screen w-full flex flex-col items-center justify-center p-8 md:p-32 relative overflow-hidden`} onMouseMove={onMouseMove}>
            <div className="max-w-[1200px] w-full flex flex-col items-center gap-12 relative z-10 text-center">
                
                {/* 100-Years Parallax Header */}
                <motion.div 
                    animate={{ x: mousePos.x * 40, y: mousePos.y * 20 }}
                    className="flex flex-col items-center"
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        className={`px-12 py-3 rounded-full text-white font-black uppercase tracking-widest text-sm shadow-2xl ${color}`}
                    >
                        {subtitle}
                    </motion.div>
                    
                    <motion.h2 
                        className="text-[12vw] font-black tracking-tighter leading-tight mb-4 uppercase cartoon-text select-none"
                        animate={{ x: mousePos.x * 20, y: mousePos.y * 10 }}
                    >
                        {title}
                    </motion.h2>
                </motion.div>
                
                {/* Parallax Play Panel */}
                <motion.div 
                    ref={cardRef}
                    animate={{ 
                        rotateY: mousePos.x * 10, 
                        rotateX: -mousePos.y * 10,
                        x: mousePos.x * 10
                    }}
                    style={{ perspective: 1000 }}
                    className="play-panel p-16 w-full max-w-4xl flex flex-col items-center gap-12"
                >
                    <motion.div 
                        whileHover={{ scale: 1.3, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="p-8 rounded-full bg-brand-secondary/20 text-brand-secondary shadow-xl cursor-pointer"
                        onClick={(e) => triggerEmoji(e, emoji)}
                    >
                        {icon}
                    </motion.div>
                    
                    <div className="text-[#333] text-4xl leading-snug font-black uppercase tracking-tighter max-w-2xl italic select-none">
                        {children}
                    </div>
                    
                    <motion.button 
                        whileHover={{ scale: 1.2, rotate: 3 }}
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            triggerEmoji(e, emoji);
                        }}
                        className="mt-8 px-24 py-10 bg-brand-accent text-[#333] text-5xl font-black rounded-full border-[8px] border-[#333] shadow-[15px_15px_0px_#333] cursor-pointer uppercase pointer-events-auto relative z-30 transition-transform active:shadow-none translate-gpu"
                    >
                        LET'S PLAY!
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

const RunningCharacters = ({ triggerEmoji }) => {
    return (
        <div className="pointer-events-none select-none overflow-hidden">
             <div className="running-char pointer-events-auto cursor-pointer" style={{ animationDuration: '6s', bottom: '8vh' }} onClick={(e) => triggerEmoji(e, "🐱")}>
                <motion.div whileHover={{ scale: 1.4, y: -40 }} className="flex flex-col items-center wobble-anim">
                    <div className="p-10 bg-[#42d3ff] rounded-full border-6 border-[#333] shadow-2xl flex items-center justify-center relative">
                        <Cat size={80} color="white" />
                        <div className="absolute -top-6 -right-6 p-3 bg-white rounded-full border-4 border-[#333] text-xs font-black text-black shadow-lg">OGGY!</div>
                    </div>
                </motion.div>
             </div>

             <div className="running-char pointer-events-auto cursor-pointer" style={{ animationDuration: '4s', bottom: '15vh', animationDelay: '2s' }} onClick={(e) => triggerEmoji(e, "🪳")}>
                <motion.div whileHover={{ scale: 1.4, y: -40 }} className="flex gap-10 items-end wobble-anim">
                    <div className="p-6 bg-purple-500 rounded-full border-4 border-[#333] shadow-xl relative">
                        <Ghost size={40} color="white" />
                        <div className="absolute -top-4 -right-4 p-2 bg-white rounded-full border-2 border-[#333] text-[10px] font-black text-black">JOEY</div>
                    </div>
                     <div className="p-5 bg-red-500 rounded-full border-4 border-[#333] shadow-xl relative">
                        <Ghost size={35} color="white" />
                        <div className="absolute -top-4 -right-4 p-2 bg-white rounded-full border-2 border-[#333] text-[10px] font-black text-black">MARK</div>
                    </div>
                     <div className="p-8 bg-green-500 rounded-full border-6 border-[#333] shadow-xl relative">
                        <Ghost size={50} color="white" />
                        <div className="absolute -top-4 -right-4 p-2 bg-white rounded-full border-2 border-[#333] text-[10px] font-black text-black">DEE DEE</div>
                    </div>
                </motion.div>
             </div>
        </div>
    );
};

const Overlay = ({ scroll, triggerEmoji }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    useEffect(() => {
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
                const totalStages = 4;
                scroll.current = (self.progress * totalStages * 3) % totalStages;
            }
        });

        return () => {
             ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [scroll]);

    const sectionData = [
        { title: <>OGGY'S<br/>PARTY!</>, subtitle: "Episode 1: Fun Loop", icon: <Cat size={120} />, emoji: "🐱", color: "bg-[#42d3ff]", text: "WELCOME TO OGGY'S AWESOME WORLD! JOIN THE FUN AS WE RUN, JUMP, AND PLAY IN THE INFINITE BUBBLE LOOP!" },
        { title: <>COCKROACH<br/>DASH!</>, subtitle: "Episode 2: Chase Me!", icon: <Ghost size={120} />, emoji: "🪳", color: "bg-purple-500", text: "CATCH JOEY, DEE DEE, AND MARKY AS THEY RUN AROUND THE SCREEN! CAN YOU KEEP UP WITH THE FASTEST BUGS IN THE LOOP?" },
        { title: <>BUBBLE<br/>POPPING!</>, subtitle: "Episode 3: Pop Fun", icon: <Candy size={120} />, emoji: "🫧", color: "bg-pink-400", text: "FLOATING BUBBLES EVERYWHERE! IT'S A HAPPY WORLD OF COLORS, SHAPES, AND SUPER COOL BOUNCY BALLS!" },
        { title: <>GLOBAL<br/>SMILES!</>, subtitle: "Episode 4: Bye Fun", icon: <Smile size={120} />, emoji: "🌟", color: "bg-lime-400", text: "SHARE THE JOY WITH EVERYONE IN THE WORLD! CONNECT YOUR SMILE TO OGGY'S NETWORK AND KEEP THE FUN GOING FOREVER!" },
    ];

    return (
        <div ref={containerRef} className="relative z-10 pt-10 sky-bg">
            <RunningCharacters triggerEmoji={triggerEmoji} />
            
            {[0, 1, 2].map(setIdx => (
                <React.Fragment key={setIdx}>
                    {sectionData.map((data, i) => (
                        <Section 
                            key={`${setIdx}-${i}`}
                            {...data}
                            triggerEmoji={triggerEmoji}
                        >
                            {data.text}
                        </Section>
                    ))}
                </React.Fragment>
            ))}

            <footer className="h-screen flex flex-col gap-12 items-center justify-center bg-white/20 border-t-8 border-[#333] relative z-[20]">
                <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[18vw] font-black tracking-tighter pink-glow uppercase cartoon-text select-none"
                >
                    THE END!
                </motion.div>
                <div className="flex flex-wrap justify-center gap-16 font-black text-[#333] text-5xl uppercase">
                     {["CANDY", "TOYS", "BUBBLES", "PARTY", "GAMES"].map((txt, i) => (
                         <span key={i} onClick={(e) => triggerEmoji(e, "🎁")} className="cursor-pointer hover:rotate-12 hover:scale-125 transition-all tracking-tight select-none">{txt}</span>
                     ))}
                </div>
                <div className="text-2xl font-black uppercase text-brand-primary animate-pulse">Created by Antigravity Cartoon Studio!</div>
            </footer>
        </div>
    );
};

export default Overlay;
