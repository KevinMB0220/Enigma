'use client';

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Find longest word to prevent layout shift
  const longestWord = useMemo(() => {
    return words.reduce((a, b) => (a.length > b.length ? a : b), "");
  }, [words]);

  // Slower typing for readability (as requested)
  useEffect(() => {
    if (index === words.length) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      // Pause at the end for 2 seconds
      const timeout = setTimeout(() => {
        setReverse(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 100 : 150); // Slower: 150ms typing, 100ms erasing

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  // Cursor blink
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  return (
    <span className="inline-grid grid-cols-1 grid-rows-1 text-left sm:text-center">
      {/* Invisible layer to hold the width and prevent line jumps */}
      <span className="invisible col-start-1 row-start-1 pr-4" aria-hidden="true">
        {longestWord}
      </span>
      <span className="col-start-1 row-start-1 whitespace-nowrap">
        {words[index].substring(0, subIndex)}
        <span className={cn(
          "inline-block w-[3px] h-[0.9em] bg-flare-accent ml-1 -mb-1 align-middle transition-opacity duration-100",
          blink ? "opacity-100" : "opacity-0"
        )}></span>
      </span>
    </span>
  );
}
