"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTypingStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { RefreshCwIcon, PlayIcon, TimerIcon } from "lucide-react";

export function TypingTest() {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const addResult = useTypingStore((state) => state.addResult);

  const sampleText = "The quick brown fox jumps over the lazy dog. Programming is both an art and a science, requiring creativity and logical thinking. Technology continues to evolve at a rapid pace, transforming the way we live and work.";

  useEffect(() => {
    setText(sampleText);
    setTypedChars(new Array(sampleText.length).fill(""));
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (startTime && !endTime) {
      intervalId = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [startTime, endTime]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!startTime && !isCompleted) {
      setStartTime(Date.now());
    }

    if (currentIndex < text.length && !isCompleted) {
      const newTypedChars = [...typedChars];
      newTypedChars[currentIndex] = e.key;
      setTypedChars(newTypedChars);

      if (e.key !== text[currentIndex]) {
        setMistakes((prev) => prev + 1);
      }
      setCurrentIndex((prev) => prev + 1);

      if (currentIndex === text.length - 1) {
        setEndTime(Date.now());
        setIsCompleted(true);
        const duration = (Date.now() - startTime!) / 1000 / 60; // in minutes
        const wordsTyped = text.split(" ").length;
        const wpm = Math.round(wordsTyped / duration);
        const accuracy = Math.round(((text.length - mistakes) / text.length) * 100);
        
        addResult({
          wpm,
          accuracy,
          mistakes,
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [currentIndex, text, typedChars, isCompleted]);

  const resetTest = () => {
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
    setMistakes(0);
    setIsCompleted(false);
    setTimer(0);
    setTypedChars(new Array(text.length).fill(""));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentIndex / text.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Typing Test</h1>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <TimerIcon className="w-4 h-4" />
                <span className="font-mono">{formatTime(timer)}</span>
              </div>
            </div>
            <Button onClick={resetTest} variant="outline" size="sm">
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              New Test
            </Button>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="relative min-h-[150px] font-mono text-lg leading-relaxed">
            {text.split("").map((char, index) => {
              const isCurrent = index === currentIndex;
              const isTyped = index < currentIndex;
              const isCorrect = typedChars[index] === text[index];

              return (
                <motion.span
                  key={index}
                  className={`
                    ${isTyped && isCorrect ? "text-primary" : ""}
                    ${isTyped && !isCorrect ? "text-destructive" : ""}
                    ${!isTyped ? "text-muted-foreground" : ""}
                    ${isCurrent ? "bg-primary/20" : ""}
                  `}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>

          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/10 p-6 rounded-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Test Complete!</h2>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">WPM</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      (text.split(" ").length /
                        ((endTime! - startTime!) / 1000 / 60))
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      ((text.length - mistakes) / text.length) * 100
                    )}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mistakes</p>
                  <p className="text-2xl font-bold">{mistakes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="text-2xl font-bold">{formatTime(timer)}</p>
                </div>
              </div>
            </motion.div>
          )}

          {!startTime && !isCompleted && (
            <div className="text-center text-muted-foreground">
              <PlayIcon className="w-8 h-8 mx-auto mb-2" />
              <p>Start typing to begin the test</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}