import { useState, useEffect, useRef } from "react";

interface Props {
  currLangIndex: number;
  currentDescription: string;
}

// Define a type for the voice settings
interface VoiceSettings {
  lang: string;
  preferredVoice: string[];
}

// Define a type for the voice map
type VoiceMap = Record<number, VoiceSettings>;

const PlayAudioBtn = ({ currLangIndex, currentDescription }: Props) => {
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const currentLangRef = useRef<number>(currLangIndex);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log(
        "Loaded voices:",
        availableVoices.map((v) => v.name + " (" + v.lang + ")")
      );
      setVoices(availableVoices);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    currentLangRef.current = currLangIndex;
    console.log("Language changed to:", currLangIndex);
    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
    }
  }, [currLangIndex, audioPlaying]);

  const getVoice = () => {
    // Properly typed voice map with a Record type
    const voiceMap: VoiceMap = {
      0: {
        lang: "de-DE",
        preferredVoice: [
          "Google Deutsch",
          "Microsoft Hedda",
          "Microsoft Katja",
          "Microsoft Stefan",
          "de-DE",
        ],
      },
      1: {
        lang: "en-US",
        preferredVoice: [
          "Samantha",
          "Google US English",
          "Microsoft Zira",
          "en-US",
        ],
      },
    };
    
    // Now TypeScript knows this is a valid access
    const settings = voiceMap[currLangIndex] || voiceMap[0];
    console.log("Looking for voice for language:", settings.lang);

    for (const preferred of settings.preferredVoice) {
      const matchingVoice = voices.find(
        (v) => v.name.includes(preferred) || v.lang === preferred
      );
      if (matchingVoice) {
        console.log("Selected voice:", matchingVoice.name);
        return matchingVoice;
      }
    }

    console.warn(
      "No preferred voice found. Falling back to the first available voice for language:",
      settings.lang
    );
    const fallbackVoice = voices.find((v) => v.lang === settings.lang);
    if (fallbackVoice) {
      console.log("Fallback voice selected:", fallbackVoice.name);
      return fallbackVoice;
    }

    console.error("No voice found for language:", settings.lang);
    return null;
  };

  const handleSpeakClick = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(currentDescription);
    const selectedVoice = getVoice();
    console.log("Using voice for speech:", selectedVoice?.name);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = 1;
    utterance.rate = 1;

    utterance.onend = () => {
      setAudioPlaying(false);
    };

    utterance.onerror = (event) => {
      if (event.error === "interrupted") {
        console.log("Speech interrupted, expected when manually stopping.");
        return;
      }
      console.error("Speech synthesis error:", event);
      setAudioPlaying(false);
    };

    utteranceRef.current = utterance;
    setAudioPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleAudioBtnClicked = () => {
    if (audioPlaying) {
      window.speechSynthesis.cancel();
      setAudioPlaying(false);
    } else {
      handleSpeakClick();
    }
  };

  return (
    <div>
      <img
        className="audio-btn"
        src={
          audioPlaying
            ? "/img/PauseBtn.png"
            : "/img/PlayBtn.png"
        }
        onClick={handleAudioBtnClicked}
        alt={audioPlaying ? "Pause" : "Play"}
      />
    </div>
  );
};

export default PlayAudioBtn;