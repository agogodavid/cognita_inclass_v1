import { create } from 'zustand';
import { chatService } from '@/lib/chat';
export interface Flashcard {
  term: string;
  definition: string;
}
interface FlashcardState {
  inputText: string;
  flashcards: Flashcard[];
  isLoading: boolean;
  error: string | null;
  studyMode: {
    isOpen: boolean;
    currentIndex: number;
  };
  setInputText: (text: string) => void;
  generateFlashcards: () => Promise<void>;
  openStudyMode: () => void;
  closeStudyMode: () => void;
  nextCard: () => void;
  prevCard: () => void;
  reset: () => void;
}
const initialState = {
  inputText: '',
  flashcards: [],
  isLoading: false,
  error: null,
  studyMode: {
    isOpen: false,
    currentIndex: 0,
  },
};
export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  ...initialState,
  setInputText: (text) => set({ inputText: text }),
  generateFlashcards: async () => {
    const { inputText } = get();
    if (!inputText.trim()) {
      set({ error: 'Please enter some text to generate flashcards.' });
      return;
    }
    set({ isLoading: true, error: null, flashcards: [] });
    const prompt = `
      Based on the following text, extract the key terms and their definitions.
      Return the result as a valid JSON array of objects, where each object has a "term" and a "definition" key.
      Do not include any other text or explanation in your response, only the JSON array.
      Example: [{"term": "React", "definition": "A JavaScript library for building user interfaces."}]
      Text:
      ---
      ${inputText}
      ---
    `;
    try {
      // We will use a temporary streaming message to get the full response
      let fullResponse = '';
      await chatService.sendMessage(prompt, undefined, (chunk) => {
        fullResponse += chunk;
      });
      // Use a regex to find the JSON array within the response
      const jsonMatch = fullResponse.match(/(\[[\s\S]*\])/);
      if (!jsonMatch || !jsonMatch[0]) {
        throw new Error('Could not find a valid JSON array in the AI response.');
      }
      const jsonString = jsonMatch[0];
      const parsedFlashcards = JSON.parse(jsonString) as Flashcard[];
      if (!Array.isArray(parsedFlashcards) || parsedFlashcards.some(c => !c.term || !c.definition)) {
        throw new Error('The received data is not in the expected flashcard format.');
      }
      set({ flashcards: parsedFlashcards, isLoading: false, inputText: '' });
    } catch (e) {
      console.error('Failed to generate or parse flashcards:', e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      set({
        error: `Failed to generate flashcards. The AI's response might not be in the correct format. Please try again or adjust your text.`,
        isLoading: false,
      });
    }
  },
  openStudyMode: () => {
    if (get().flashcards.length > 0) {
      set(state => ({
        studyMode: { ...state.studyMode, isOpen: true, currentIndex: 0 },
      }));
    }
  },
  closeStudyMode: () => {
    set(state => ({
      studyMode: { ...state.studyMode, isOpen: false },
    }));
  },
  nextCard: () => {
    set(state => ({
      studyMode: {
        ...state.studyMode,
        currentIndex: Math.min(
          state.flashcards.length - 1,
          state.studyMode.currentIndex + 1
        ),
      },
    }));
  },
  prevCard: () => {
    set(state => ({
      studyMode: {
        ...state.studyMode,
        currentIndex: Math.max(0, state.studyMode.currentIndex - 1),
      },
    }));
  },
  reset: () => {
    set(initialState);
  },
}));