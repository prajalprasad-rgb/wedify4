"use client";

import { Music, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/constants";

export function AudioPlayer({ musicUrl = siteConfig.backgroundMusic }: { musicUrl?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);

  const stopGeneratedMusic = (clearContext = true) => {
    oscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
      } catch {
        // Oscillators can only be stopped once.
      }
      oscillator.disconnect();
    });
    oscillatorsRef.current = [];
    gainRef.current?.disconnect();
    gainRef.current = null;

    if (clearContext && contextRef.current) {
      void contextRef.current.close();
      contextRef.current = null;
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("wedify-audio");
    if (saved && audioRef.current) {
      const parsed = JSON.parse(saved) as { volume: number; playing: boolean };
      setVolume(parsed.volume);
      audioRef.current.volume = parsed.volume;
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    if (gainRef.current) gainRef.current.gain.value = volume * 0.18;
    window.localStorage.setItem("wedify-audio", JSON.stringify({ volume, playing }));
  }, [volume, playing]);

  useEffect(() => {
    return () => stopGeneratedMusic();
  }, []);

  const startGeneratedMusic = async () => {
    const context = contextRef.current ?? new AudioContext();
    contextRef.current = context;

    if (context.state === "suspended") {
      await context.resume();
    }

    stopGeneratedMusic(false);

    const gain = context.createGain();
    gain.gain.value = volume * 0.18;
    gain.connect(context.destination);
    gainRef.current = gain;

    const notes = [261.63, 329.63, 392];
    oscillatorsRef.current = notes.map((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = index === 1 ? "triangle" : "sine";
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      oscillator.start();
      return oscillator;
    });
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      stopGeneratedMusic();
      setPlaying(false);
      return;
    }

    setPlaying(true);

    await audio.play().catch(() => undefined);

    if (!audio.paused) {
      return;
    }

    await startGeneratedMusic().catch(() => setPlaying(false));
  };

  return (
    <div className="fixed bottom-5 left-4 z-40 flex items-center gap-3 rounded-full border border-white/10 bg-[#111111]/80 px-3 py-2 text-white shadow-2xl shadow-black/50 backdrop-blur-xl">
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        <source src={musicUrl} type="audio/mpeg" />
        <source src="/audio/background.wav" type="audio/wav" />
      </audio>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause background music" : "Play background music"}
        suppressHydrationWarning
        className="grid size-10 place-items-center rounded-full bg-[#D4AF37] text-black transition hover:bg-[#E8C76A]"
      >
        {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
      </button>
      <div className="hidden items-center gap-2 sm:flex">
        <Music size={16} className="text-[#E8C76A]" />
        <span className="text-xs uppercase tracking-[0.18em] text-white/55">
          Music
        </span>
      </div>
      <label className="flex items-center gap-2">
        <Volume2 size={15} className="text-white/60" />
        <input
          aria-label="Music volume"
          type="range"
          suppressHydrationWarning
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
          className="h-1 w-20 accent-[#D4AF37]"
        />
      </label>
    </div>
  );
}
