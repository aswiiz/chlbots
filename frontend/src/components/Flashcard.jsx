import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    RotateCw,
    CheckCircle,
    XCircle,
    Lightbulb
} from 'lucide-react';
import { generateFlashcards, getFlashcards } from '../utils/api';

const Flashcard = ({ projectId }) => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [learnedCount, setLearnedCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadFlashcards = async () => {
        if (!projectId) return;
        try {
            const data = await getFlashcards(projectId);
            if (data && data.cards) {
                setCards(data.cards);
            }
        } catch (err) {
            console.error("Failed to load flashcards", err);
        }
    };

    useEffect(() => {
        loadFlashcards();
    }, [projectId]);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const result = await generateFlashcards(projectId);
            setCards(result.cards || result);
            setCurrentIndex(0);
        } catch (err) {
            alert("Error generating flashcards.");
        } finally {
            setLoading(false);
        }
    };

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const markLearned = () => {
        setLearnedCount((prev) => prev + 1);
        nextCard();
    };

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-15rem)] glass-card">
                <Lightbulb className="w-16 h-16 text-primary-500 mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold mb-2">No flashcards found</h3>
                <p className="text-slate-400 mb-6">Upload some notes then generate flashcards to start studying.</p>
                <button
                    onClick={handleGenerate}
                    disabled={loading || !projectId}
                    className="btn-primary flex items-center gap-2"
                >
                    {loading ? <RotateCw className="animate-spin" size={20} /> : null}
                    {loading ? 'Generating...' : 'Generate Flashcards'}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-8">
            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                    className="bg-primary-600 h-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
            </div>

            <div className="flex justify-between items-center text-sm font-medium text-slate-400">
                <span>CARD {currentIndex + 1} OF {cards.length}</span>
                <span>{learnedCount} LEARNED</span>
            </div>

            {/* Card Container with Perspective */}
            <div className="perspective-1000 h-[400px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                    className="relative w-full h-full duration-500 preserve-3d"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    {/* Front Side */}
                    <div className="absolute inset-0 backface-hidden glass-card flex flex-col items-center justify-center p-12 text-center">
                        <div className="absolute top-6 left-6 text-primary-400 flex items-center gap-2 text-sm">
                            <RotateCw className="w-4 h-4" /> Click to reveal answer
                        </div>
                        <h2 className="text-3xl font-semibold leading-relaxed">
                            {cards[currentIndex].question}
                        </h2>
                    </div>

                    {/* Back Side */}
                    <div className="absolute inset-0 backface-hidden glass-card flex flex-col items-center justify-center p-12 text-center bg-primary-950/20 rotate-y-180">
                        <div className="absolute top-6 left-6 text-primary-400 text-sm">
                            ANSWER
                        </div>
                        <p className="text-xl text-slate-200 font-medium leading-relaxed">
                            {cards[currentIndex].answer}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <button onClick={prevCard} className="btn-secondary p-4 rounded-full">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextCard} className="btn-secondary p-4 rounded-full">
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => nextCard()} className="btn-secondary flex items-center gap-2 border-red-500/20 hover:bg-red-500/10">
                        <XCircle size={20} className="text-red-500" /> Need more practice
                    </button>
                    <button onClick={markLearned} className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20">
                        <CheckCircle size={20} className="text-white" /> Learned it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
