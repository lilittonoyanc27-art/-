import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  BookOpen, 
  Gamepad2, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  ChevronRight,
  Trophy,
  Info,
  Sparkles
} from 'lucide-react';

type Section = 'theory' | 'quiz' | 'result';

const THEORY_CARDS = [
  {
    title: "Հիմնական հարցը",
    spanish: "¿Qué hora es?",
    armenian: "Ժամը քանի՞սն է:",
    description: "Իսպաներենում ժամը հարցնելու միակ ձևն է:"
  },
  {
    title: "Ժամը 1-ը",
    spanish: "Es la una",
    armenian: "Ժամը մեկն է",
    description: "Միայն 1-ի դեպքում ենք օգտագործում 'Es la' (եզակի թիվ):"
  },
  {
    title: "Ժամը 2-ից 12-ը",
    spanish: "Son las dos / Son las tres...",
    armenian: "Ժամը երկուսն է / երեքն է...",
    description: "2-ից սկսած օգտագործում ենք 'Son las' (հոգնակի թիվ):"
  },
  {
    title: "Քառորդ և Կես",
    spanish: "y cuarto / y media",
    armenian: "անց քառորդ / կես",
    description: "Օրինակ՝ 2:15 - Son las dos y cuarto. 2:30 - Son las dos y media."
  },
  {
    title: "Պակաս քառորդ",
    spanish: "menos cuarto",
    armenian: "քառորդ պակաս",
    description: "Օրինակ՝ 2:45 - Son las tres menos cuarto (երեքից քառորդ պակաս):"
  },
  {
    title: "Րոպեներն ավելացնելիս",
    spanish: "y cinco, y diez...",
    armenian: "անց հինգ, անց տաս...",
    description: "Մինչև 30 րոպեն օգտագործում ենք 'y' (և):"
  },
  {
    title: "Րոպեները պակասելիս",
    spanish: "menos diez, menos veinte...",
    armenian: "տաս պակաս, քսան պակաս...",
    description: "30 րոպեից հետո ասում ենք հաջորդ ժամը և հանում րոպեները:"
  }
];

const QUIZ_QUESTIONS = [
  { q: "1:00", options: ["Es la una", "Son las una", "Es las una"], a: "Es la una" },
  { q: "2:00", options: ["Es las dos", "Son las dos", "Son la dos"], a: "Son las dos" },
  { q: "3:15", options: ["Son las tres y cuarto", "Son las tres y media", "Son las tres menos cuarto"], a: "Son las tres y cuarto" },
  { q: "4:30", options: ["Son las cuatro y cuarto", "Son las cuatro y media", "Es las cuatro y media"], a: "Son las cuatro y media" },
  { q: "5:45", options: ["Son las cinco y cuarto", "Son las seis menos cuarto", "Son las cinco menos cuarto"], a: "Son las seis menos cuarto" },
  { q: "1:05", options: ["Es la una y cinco", "Son las una y cinco", "Es la una menos cinco"], a: "Es la una y five" }, // Fixed typo in answer key below
  { q: "7:10", options: ["Son las siete y diez", "Es la siete y diez", "Son las siete menos diez"], a: "Son las siete y diez" },
  { q: "8:20", options: ["Son las ocho y veinte", "Son las ocho y media", "Es la ocho y veinte"], a: "Son las ocho y veinte" },
  { q: "9:25", options: ["Son las nueve y veinticinco", "Son las nueve y media", "Son las diez menos veinticinco"], a: "Son las nueve y veinticinco" },
  { q: "10:35", options: ["Son las diez y treinta y cinco", "Son las once menos veinticinco", "Son las diez menos veinticinco"], a: "Son las once menos veinticinco" },
  { q: "11:40", options: ["Son las doce menos veinte", "Son las once y cuarenta", "Son las doce y veinte"], a: "Son las doce menos veinte" },
  { q: "12:50", options: ["Son las doce y cincuenta", "Es la una menos diez", "Son las una menos diez"], a: "Es la una menos diez" },
  { q: "6:15", options: ["Son las seis y cuarto", "Son las seis y media", "Son las siete menos cuarto"], a: "Son las seis y cuarto" },
  { q: "2:45", options: ["Son las dos y cuarto", "Son las tres menos cuarto", "Son las dos menos cuarto"], a: "Son las three menos cuarto" }, // Fixed typo below
  { q: "1:30", options: ["Es la una y media", "Son las una y media", "Es la una y cuarto"], a: "Es la una y media" },
  { q: "4:10", options: ["Son las cuatro y diez", "Es la cuatro y diez", "Son las cuatro menos diez"], a: "Son las cuatro y diez" },
  { q: "5:55", options: ["Son las seis menos cinco", "Son las cinco y cincuenta y cinco", "Es la seis menos cinco"], a: "Son las seis menos five" }, // Fixed typo below
  { q: "10:00", options: ["Son las diez", "Es la diez", "Son las diez y cero"], a: "Son las diez" },
  { q: "9:45", options: ["Son las diez menos cuarto", "Son las nueve y cuarto", "Son las नौ menos cuarto"], a: "Son las diez menos cuarto" },
  { q: "7:30", options: ["Son las siete y media", "Es la siete y media", "Son las siete y cuarto"], a: "Son las siete y media" }
];

// Correcting the answer keys to match options exactly
QUIZ_QUESTIONS[5].a = "Es la una y cinco";
QUIZ_QUESTIONS[13].a = "Son las tres menos cuarto";
QUIZ_QUESTIONS[16].a = "Son las seis menos cinco";

export default function TimeApp() {
  const [section, setSection] = useState<Section>('theory');
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const handleSelect = (option: string) => {
    if (feedback) return;
    setSelectedOption(option);
  };

  const checkAnswer = () => {
    if (!selectedOption || feedback) return;
    
    const current = QUIZ_QUESTIONS[quizIndex];
    if (selectedOption === current.a) {
      setScore(s => s + 1);
      setFeedback({ isCorrect: true, message: 'Ճիշտ է!' });
    } else {
      setFeedback({ isCorrect: false, message: `Սխալ է: Ճիշտ պատասխանն է՝ ${current.a}` });
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setSelectedOption(null);
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(i => i + 1);
    } else {
      setSection('result');
    }
  };

  const reset = () => {
    setSection('theory');
    setQuizIndex(0);
    setScore(0);
    setSelectedOption(null);
    setFeedback(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-100">
      {/* Header */}
      <header className="bg-white border-b-4 border-amber-100 p-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Ժամ և Ժամանակ</h1>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Իսպաներենի Դաս</span>
            </div>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setSection('theory')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${section === 'theory' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ՏԵՍՈՒԹՅՈՒՆ
            </button>
            <button 
              onClick={() => { reset(); setSection('quiz'); }}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${section === 'quiz' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ՎԱՐԺՈՒԹՅՈՒՆՆԵՐ
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {section === 'theory' && (
            <motion.div 
              key="theory"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {THEORY_CARDS.map((card, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-8 rounded-[40px] border-4 border-slate-100 shadow-xl hover:border-amber-200 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <BookOpen className="w-6 h-6 text-amber-500" />
                      </div>
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Կանոն {i + 1}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{card.title}</h3>
                    <div className="space-y-4">
                      <p className="text-3xl font-black text-amber-600 leading-none">{card.spanish}</p>
                      <p className="text-lg font-bold text-slate-400">{card.armenian}</p>
                      <div className="pt-4 border-t border-slate-50">
                        <p className="text-sm text-slate-500 leading-relaxed italic">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-amber-600 rounded-[48px] p-12 text-white text-center space-y-6 shadow-2xl shadow-amber-600/20">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-4xl font-black uppercase tracking-tight">Պատրա՞ստ ես ստուգել գիտելիքներդ</h2>
                <p className="text-amber-100 text-xl font-medium max-w-md mx-auto">
                  Անցիր 20 հարցից բաղկացած թեստը և տես, թե որքան լավ ես սովորել ժամերը:
                </p>
                <button 
                  onClick={() => { reset(); setSection('quiz'); }}
                  className="px-12 py-6 bg-white text-amber-600 rounded-[32px] font-black text-2xl shadow-xl hover:bg-amber-50 transition-all active:scale-95"
                >
                  ՍԿՍԵԼ ԹԵՍՏԸ
                </button>
              </div>
            </motion.div>
          )}

          {section === 'quiz' && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl border-4 border-slate-100 flex items-center justify-center font-black text-slate-400">
                    {quizIndex + 1}
                  </div>
                  <div className="h-2 w-48 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  ՄԻԱՎՈՐ: <span className="text-amber-600">{score}</span>
                </div>
              </div>

              <div className="bg-white rounded-[48px] p-12 border-4 border-slate-100 shadow-2xl text-center space-y-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Clock className="w-48 h-48 text-amber-600" />
                </div>

                <div className="space-y-4 relative z-10">
                  <span className="text-xs font-black text-amber-500 uppercase tracking-[0.3em]">Ինչպե՞ս կլինի իսպաներեն</span>
                  <h2 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter">
                    {QUIZ_QUESTIONS[quizIndex].q}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 relative z-10">
                  {QUIZ_QUESTIONS[quizIndex].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(option)}
                      disabled={feedback !== null}
                      className={`py-6 px-8 rounded-[32px] text-xl font-black transition-all text-left flex items-center justify-between group ${
                        feedback 
                          ? option === QUIZ_QUESTIONS[quizIndex].a
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : option === selectedOption
                              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                              : 'bg-slate-50 text-slate-300'
                          : option === selectedOption
                            ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20'
                            : 'bg-slate-50 text-slate-700 hover:bg-amber-100 hover:text-amber-700'
                      }`}
                    >
                      {option}
                      {feedback && option === QUIZ_QUESTIONS[quizIndex].a && <CheckCircle2 className="w-8 h-8" />}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {selectedOption && !feedback && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="pt-4"
                    >
                      <button 
                        onClick={checkAnswer}
                        className="w-full py-6 bg-amber-600 text-white rounded-[32px] font-black text-2xl shadow-xl hover:bg-amber-700 transition-all active:scale-95"
                      >
                        ՍՏՈՒԳԵԼ
                      </button>
                    </motion.div>
                  )}

                  {feedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-[32px] flex items-center justify-between ${feedback.isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}
                    >
                      <div className="flex items-center gap-4">
                        {feedback.isCorrect ? <CheckCircle2 /> : <XCircle />}
                        <span className="font-bold text-lg">{feedback.message}</span>
                      </div>
                      <button 
                        onClick={nextQuestion}
                        className="px-8 py-3 bg-white rounded-2xl shadow-sm font-black uppercase tracking-widest text-sm hover:shadow-md transition-all"
                      >
                        ՀԱՋՈՐԴԸ <ChevronRight className="inline w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {section === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12"
            >
              <div className="bg-white rounded-[64px] p-16 border-4 border-slate-100 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="space-y-4">
                  <div className="w-24 h-24 bg-amber-500 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30 mb-8">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tight">Հրաշալի է:</h2>
                  <p className="text-2xl text-slate-500 font-medium">
                    Դու ավարտեցիր թեստը {QUIZ_QUESTIONS.length}-ից <span className="text-amber-600 font-black">{score}</span> միավորով:
                  </p>
                </div>

                {/* Celebratory Image */}
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-[48px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <img 
                    src="https://picsum.photos/seed/celebration/800/400" 
                    alt="Celebration" 
                    className="relative w-full h-64 object-cover rounded-[40px] shadow-xl border-4 border-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-2xl border border-white/50">
                      <span className="text-2xl font-black text-amber-600 uppercase tracking-widest">ՇՆՈՐՀԱՎՈՐՈՒՄ ԵՆՔ</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-8">
                  <button 
                    onClick={reset}
                    className="w-full py-6 bg-amber-600 text-white rounded-[32px] font-black text-2xl shadow-xl hover:bg-amber-700 transition-all active:scale-95 flex items-center justify-center gap-4"
                  >
                    ՓՈՐՁԵԼ ՆՈՐԻՑ
                    <RotateCcw className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-300 font-black uppercase tracking-[0.5em] text-xs">
                <Sparkles className="w-4 h-4" />
                ԳԱՅԱՆԵԻ ՀԱՄԱՐ
                <Sparkles className="w-4 h-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
