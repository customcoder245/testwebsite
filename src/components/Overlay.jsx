import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smile, Cat, Ghost, Sparkles, Heart, Rocket, Globe, Zap, Mail, Info, Compass, ChevronRight, Candy, PartyPopper } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Section = ({ title, subtitle, icon, triggerEmoji, emoji = "✨", color = "bg-pink-400", children }) => (
    <section className={`min-h-screen w-full flex flex-col items-center justify-center p-8 md:p-32 relative overflow-hidden`}>
        {/* Playful Background Shapes */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-brand-primary opacity-10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-brand-secondary opacity-10 rounded-full blur-3xl animate-pulse" />

        <div className="max-w-[1200px] w-full flex flex-col items-center gap-12 relative z-10 text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                className={`px-12 py-3 rounded-full text-white font-black uppercase tracking-widest text-sm shadow-xl ${color}`}
            >
                {subtitle}
            </motion.div>
            
            <motion.h2 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-[12vw] font-black tracking-tighter leading-tight mb-4 uppercase cartoon-text select-none"
            >
                {title}
            </motion.h2>
            
            <div className="play-panel p-16 w-full max-w-4xl flex flex-col items-center gap-12">
                <motion.div 
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    className="p-8 rounded-full bg-brand-secondary/20 text-brand-secondary shadow-lg cursor-pointer"
                    onClick={(e) => triggerEmoji(e, emoji)}
                >
                    {icon}
                </motion.div>
                
                <div className="text-[#333] text-3xl leading-snug font-black uppercase tracking-tighter max-w-2xl italic select-none">
                    {children}
                </div>
                
                <motion.button 
                    whileHover={{ scale: 1.15, rotate: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        triggerEmoji(e, emoji);
                    }}
                    className="mt-8 px-20 py-8 bg-brand-accent text-[#333] text-4xl font-black rounded-full border-[6px] border-[#333] shadow-[12px_12px_0px_#333] cursor-pointer uppercase pointer-events-auto relative z-30 transform-gpu active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                    LET'S PLAY!
                </motion.button>
            </div>
        </div>
    </section>
);

const RunningCharacters = ({ triggerEmoji }) => {
    return (
        <div className="pointer-events-none select-none overflow-hidden">
             {/* OGGY RUNNING (Representation) */}
             <div className="running-char pointer-events-auto cursor-pointer" style={{ animationDuration: '6s', bottom: '8vh' }} onClick={(e) => triggerEmoji(e, "🐱")}>
                <motion.div whileHover={{ scale: 1.2, y: -20 }} className="flex flex-col items-center">
                    <div className="p-6 bg-[#42d3ff] rounded-full border-4 border-[#333] shadow-lg flex items-center justify-center relative">
                        <Cat size={60} color="white" />
                        <div className="absolute -top-4 -right-4 p-2 bg-white rounded-full border-2 border-[#333] text-[10px] font-black text-black">OGGY!</div>
                    </div>
                </motion.div>
             </div>

             {/* THE COCKROACHES RUNNING (Joey, Dee Dee, Marky) */}
             <div className="running-char pointer-events-auto cursor-pointer" style={{ animationDuration: '4s', bottom: '15vh', animationDelay: '2s' }} onClick={(e) => triggerEmoji(e, "🪳")}>
                <motion.div whileHover={{ scale: 1.2, y: -20 }} className="flex gap-8 items-end">
                    <div className="p-4 bg-purple-500 rounded-full border-4 border-[#333] shadow-lg relative">
                        <Ghost size={30} color="white" />
                        <div className="absolute -top-3 -right-3 p-1 bg-white rounded-full border-2 border-[#333] text-[6px] font-black text-black">JOEY</div>
                    </div>
                     <div className="p-3 bg-red-500 rounded-full border-4 border-[#333] shadow-lg relative">
                        <Ghost size={25} color="white" />
                        <div className="absolute -top-3 -right-3 p-1 bg-white rounded-full border-2 border-[#333] text-[6px] font-black text-black">MARK</div>
                    </div>
                     <div className="p-5 bg-green-500 rounded-full border-4 border-[#333] shadow-lg relative">
                        <Ghost size={35} color="white" />
                        <div className="absolute -top-3 -right-3 p-1 bg-white rounded-full border-2 border-[#333] text-[6px] font-black text-black">DEE DEE</div>
                    </div>
                </motion.div>
             </div>
        </div>
    );
};

const Overlay = ({ scroll, triggerEmoji }) => {
    const containerRef = useRef(null);

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
        { title: <>OGGY'S<br/>PARTY!</>, subtitle: "Episode 1: Fun Loop", icon: <Cat size={100} />, emoji: "🐱", color: "bg-[#42d3ff]", text: "WELCOME TO OGGY'S AWESOME WORLD! JOIN THE FUN AS WE RUN, JUMP, AND PLAY IN THE INFINITE BUBBLE LOOP!" },
        { title: <>COCKROACH<br/>DASH!</>, subtitle: "Episode 2: Chase Me!", icon: <Ghost size={100} />, emoji: "🪳", color: "bg-purple-500", text: "CATCH JOEY, DEE DEE, AND MARKY AS THEY RUN AROUND THE SCREEN! CAN YOU KEEP UP WITH THE FASTEST BUGS IN THE LOOP?" },
        { title: <>BUBBLE<br/>POPPING!</>, subtitle: "Episode 3: Pop Fun", icon: <Candy size={100} />, emoji: "🫧", color: "bg-pink-400", text: "FLOATING BUBBLES EVERYWHERE! IT'S A HAPPY WORLD OF COLORS, SHAPES, AND SUPER COOL BOUNCY BALLS!" },
        { title: <>GLOBAL<br/>SMILES!</>, subtitle: "Episode 4: Bye Fun", icon: <Smile size={100} />, emoji: "🌟", color: "bg-lime-400", text: "SHARE THE JOY WITH EVERYONE IN THE WORLD! CONNECT YOUR SMILE TO OGGY'S NETWORK AND KEEP THE FUN GOING FOREVER!" },
    ];

    return (
        <div ref={containerRef} className="relative z-10 pt-10">
            <RunningCharacters triggerEmoji={triggerEmoji} />
            
            {/* Render 3 sets for 360 loop effect */}
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

            <footer className="h-screen flex flex-col gap-12 items-center justify-center bg-brand-accent/20 border-t-8 border-[#333] relative z-[20]">
                <div className="text-[15vw] font-black tracking-tighter pink-glow uppercase cartoon-text select-none">THE END!</div>
                <div className="flex flex-wrap justify-center gap-12 font-black text-[#333] text-3xl uppercase">
                     {["CANDY", "TOYS", "BUBBLES", "PARTY", "GAMES"].map((txt, i) => (
                         <span key={i} onClick={(e) => triggerEmoji(e, "🎁")} className="cursor-pointer hover:rotate-12 transition-transform tracking-tight select-none">{txt}</span>
                     ))}
                </div>
                <div className="text-xl font-black uppercase text-brand-primary">Created by Antigravity Cartoon Studio!</div>
            </footer>
        </div>
    );
};

export default Overlay;
