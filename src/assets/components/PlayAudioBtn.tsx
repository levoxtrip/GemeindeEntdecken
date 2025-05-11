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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakingRef = useRef<boolean>(false);

  // Debug logging for props
  useEffect(() => {
    console.log("PlayAudioBtn Props:", { currLangIndex, text: currentDescription });
  }, [currLangIndex, currentDescription]);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!window.speechSynthesis) {
      setErrorMessage("Speech synthesis not supported in this browser");
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log(
        "Loaded voices:",
        availableVoices.map((v) => `${v.name} (${v.lang})`)
      );
      setVoices(availableVoices);
    };

    loadVoices();

    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Cleanup function
    return () => {
      if (speakingRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle language changes
  useEffect(() => {
    console.log("Language changed to:", currLangIndex);
    if (speakingRef.current) {
      console.log("Cancelling speech due to language change");
      window.speechSynthesis.cancel();
      speakingRef.current = false;
      setAudioPlaying(false);
    }
  }, [currLangIndex]);

  const getVoice = () => {
    if (voices.length === 0) {
      console.warn("No voices available");
      return null;
    }

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
    
    // Make sure we have a valid index
    const validIndex = (currLangIndex in voiceMap) ? currLangIndex : 0;
    const settings = voiceMap[validIndex];
    
    console.log("Looking for voice for language:", settings.lang);

    // First try: exact matches of preferred voices
    for (const preferred of settings.preferredVoice) {
      const matchingVoice = voices.find(
        (v) => v.name.includes(preferred) || v.lang === preferred
      );
      if (matchingVoice) {
        console.log("Selected voice:", matchingVoice.name);
        return matchingVoice;
      }
    }

    // Second try: any voice for this language
    const fallbackVoice = voices.find((v) => v.lang.startsWith(settings.lang.split("-")[0]));
    if (fallbackVoice) {
      console.log("Fallback voice selected:", fallbackVoice.name);
      return fallbackVoice;
    }

    // Last resort: first available voice
    console.warn(
      "No voice found for language. Using default voice."
    );
    return voices[0];
  };

  const handleSpeakClick = () => {
    setErrorMessage(null);
    
    // Validate text to speak
    if (!currentDescription || currentDescription.trim() === "") {
      console.error("No text to speak");
      setErrorMessage("No text to speak");
      return;
    }

    // Always cancel any ongoing speech first
    if (window.speechSynthesis.speaking || speakingRef.current) {
      console.log("Cancelling previous speech");
      window.speechSynthesis.cancel();
      speakingRef.current = false;
      // Give a small delay before starting new speech
      setTimeout(() => startSpeaking(), 100);
    } else {
      startSpeaking();
    }
  };

  const startSpeaking = () => {
    try {
      console.log("Creating utterance with text:", currentDescription.substring(0, 50) + "...");
      const utterance = new SpeechSynthesisUtterance(currentDescription);
      
      const selectedVoice = getVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log("Using voice for speech:", selectedVoice.name);
      } else {
        console.warn("No voice selected, using default browser voice");
      }
      
      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;

      // Handle speech events
      utterance.onstart = () => {
        console.log("Speech started");
        speakingRef.current = true;
        setAudioPlaying(true);
      };

      utterance.onend = () => {
        console.log("Speech completed");
        speakingRef.current = false;
        setAudioPlaying(false);
      };

      utterance.onerror = (event) => {
        if (event.error === "interrupted") {
          console.log("Speech interrupted, likely manual stop");
        } else {
          console.error("Speech synthesis error:", event.error);
          setErrorMessage(`Speech error: ${event.error}`);
        }
        speakingRef.current = false;
        setAudioPlaying(false);
      };

      // Store reference to current utterance
      utteranceRef.current = utterance;
      
      // Begin speaking
      console.log("Starting speech synthesis...");
      window.speechSynthesis.speak(utterance);
      
      // Chrome/Safari bug workaround - sometimes speech doesn't start properly
      if (!window.speechSynthesis.speaking) {
        console.log("Speech didn't start, trying again...");
        window.speechSynthesis.cancel(); // Make sure it's cleared
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 250);
      }
    } catch (error) {
      console.error("Exception in speech synthesis:", error);
      setErrorMessage(`Error: ${error}`);
      speakingRef.current = false;
      setAudioPlaying(false);
    }
  };

  const handleAudioBtnClicked = () => {
    if (audioPlaying) {
      console.log("Stopping speech");
      window.speechSynthesis.cancel();
      speakingRef.current = false;
      setAudioPlaying(false);
    } else {
      console.log("Starting speech");
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
        style={{ cursor: 'pointer' }}
      />
      {errorMessage && (
        <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
          {errorMessage}
        </div>
      )}
      {voices.length === 0 && (
        <div style={{ color: 'orange', fontSize: '12px', marginTop: '5px' }}>
          Loading voices...
        </div>
      )}
    </div>
  );
};

export default PlayAudioBtn;