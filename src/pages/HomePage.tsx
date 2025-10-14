import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Sparkles, ArrowLeft, ArrowRight, X, Loader, AlertTriangle } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotebookIllustration } from '@/components/icons/NotebookIllustration';
import { useFlashcardStore, Flashcard } from '@/hooks/use-flashcard-store';
function FlashcardComponent({ card, isFlipped, onClick }: { card: Flashcard; isFlipped: boolean; onClick: () => void; }) {
  return (
    <div className="w-full h-full cursor-pointer" style={{ perspective: '1000px' }} onClick={onClick}>
      <motion.div
        className="relative w-full h-full transition-transform duration-700"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-card border rounded-xl shadow-md">
          <p className="text-2xl font-semibold text-center text-foreground">{card.term}</p>
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-card border rounded-xl shadow-md" style={{ transform: 'rotateY(180deg)' }}>
          <p className="text-base text-center text-muted-foreground">{card.definition}</p>
        </div>
      </motion.div>
    </div>
  );
}
function StudyModeDialog() {
  const { isOpen, currentIndex } = useFlashcardStore(useShallow(s => s.studyMode));
  const { flashcards, closeStudyMode, nextCard, prevCard } = useFlashcardStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const currentCard = flashcards[currentIndex];
  const progress = flashcards.length > 0 ? ((currentIndex + 1) / flashcards.length) * 100 : 0;
  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(nextCard, 150);
  };
  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(prevCard, 150);
  };
  return (
    <Dialog open={isOpen} onOpenChange={closeStudyMode}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-8 bg-background/95 backdrop-blur-sm">
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
            {currentCard && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full max-w-xl"
              >
                <FlashcardComponent
                  card={currentCard}
                  isFlipped={isFlipped}
                  onClick={() => setIsFlipped(!isFlipped)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <Progress value={progress} className="w-1/2" />
          </div>
          <div className="flex justify-center items-center gap-4">
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={currentIndex === 0}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Previous
            </Button>
            <Button size="lg" onClick={handleNext} disabled={currentIndex === flashcards.length - 1}>
              Next <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function FlashcardGrid() {
  const flashcards = useFlashcardStore(s => s.flashcards);
  const openStudyMode = useFlashcardStore(s => s.openStudyMode);
  if (flashcards.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-8"
    >
      <div className="flex justify-center">
        <Button variant="secondary" size="lg" onClick={openStudyMode} className="font-bold transition-all hover:scale-105 active:scale-95">
          <BrainCircuit className="mr-2 h-5 w-5" /> Study this Deck
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {flashcards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="transform transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <Card className="h-48 rounded-xl flex items-center justify-center p-4 text-center cursor-default">
              <CardContent className="p-0">
                <p className="font-semibold text-foreground">{card.term}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function LoadingSkeletons() {
  return (
    <div className="w-full space-y-8">
      <div className="flex justify-center">
        <Skeleton className="h-12 w-48 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
export function HomePage() {
  const { inputText, setInputText, generateFlashcards, isLoading, error, flashcards } = useFlashcardStore(
    useShallow(s => ({
      inputText: s.inputText,
      setInputText: s.setInputText,
      generateFlashcards: s.generateFlashcards,
      isLoading: s.isLoading,
      error: s.error,
      flashcards: s.flashcards,
    }))
  );
  const handleGenerateClick = () => {
    if (inputText.trim()) {
      generateFlashcards();
    }
  };
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <ThemeToggle className="fixed top-6 right-6 z-50" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 md:py-24 text-center space-y-12">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-display text-foreground">
                Cognita
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Your Smart Study Buddy. Paste any text, and we'll magically create flashcards for you.
              </p>
            </div>
            <Card className="w-full text-left shadow-lg transition-shadow duration-300 focus-within:shadow-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded-xl">
              <CardHeader className="relative p-0">
                {inputText.length === 0 && !isLoading && flashcards.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50 pointer-events-none space-y-2">
                    <NotebookIllustration className="h-24 w-24" />
                    <span className="font-medium">Paste your study material here</span>
                  </div>
                )}
                <label htmlFor="study-material-input" className="sr-only">
                  Paste your study material here
                </label>
                <Textarea
                  id="study-material-input"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder=""
                  className="w-full h-48 text-base rounded-t-xl border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none p-6 bg-transparent"
                  disabled={isLoading}
                />
              </CardHeader>
              <CardContent className="p-4 border-t flex justify-end items-center">
                <Button
                  onClick={handleGenerateClick}
                  disabled={isLoading || !inputText.trim()}
                  size="lg"
                  className="font-bold transition-all hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-5 w-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Create Flashcards
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            {error && (
              <Alert variant="destructive" className="text-left max-w-3xl mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="pt-8">
              {isLoading && <LoadingSkeletons />}
              <AnimatePresence>
                {!isLoading && flashcards.length > 0 && <FlashcardGrid />}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <footer className="text-center py-8 text-muted-foreground text-sm">
          <p>AI has a shared rate limit. If you encounter errors, please try again later.</p>
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
      <StudyModeDialog />
    </>
  );
}