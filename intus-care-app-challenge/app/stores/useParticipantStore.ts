import { create } from "zustand";
import { pptArrayAPIResSchema } from "../schemas/schemas";

type ParticipantStore = {
    pptListData: Participant[] | null;
    fetchParticipants: () => Promise<void>;
    fetched: boolean;
    history: Participant[];
    addToHistory: (ppt: Participant) => void;
    clearHistory: () => void;
};

// Use local storage to save participant history data, so that it persists between tabs
const saveHistoryToLocalStorage = (history: Participant[]) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("participantHistory", JSON.stringify(history));
    }
}

const loadHistoryFromLocalStorage = (): Participant[] => {
    if (typeof window !== "undefined") {
        const history = localStorage.getItem("participantHistory");
        return history ? JSON.parse(history) : [];
    }
    return [];
};

const useParticipantStore = create<ParticipantStore>((set, get) => ({
    pptListData: null,
    fetched: false,
    history: loadHistoryFromLocalStorage(),

    fetchParticipants: async () => {
        if (get().fetched) { // don't refetch data if it has already been fetched
            return;
        }
        try {
            const response = await fetch("http://localhost:9000/participants");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            pptArrayAPIResSchema.parse(data);
            const participants: Participant[] = data.map((ppt: Participant, idx: number) => ({
                ...ppt,
                id: idx // assign ID to be index of participant, unique identifier
            }))
            set({ pptListData: participants });
        } catch (error) {
            throw new Error(`Error getting participant data: ${error}`);
        }
    },

    addToHistory: (ppt: Participant) => {
        const currentHistory = get().history;
        const maxHistory = 20;
        // remove participant from history if they are already there, and move them to the front of the list
        const updatedHistory = currentHistory.filter((p) => p.id !== ppt.id);
        updatedHistory.unshift(ppt);
        const limitedHistory = updatedHistory.slice(0, maxHistory); // cap number of participants in history
        set({ history: limitedHistory });
        saveHistoryToLocalStorage(limitedHistory);
    },

    clearHistory: () => {
        saveHistoryToLocalStorage([]);
        set({ history: [] })
    }
}));

// listen to updates to history from other tabs
if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
        if (event.key === "participantHistory") {
            const newHistory = JSON.parse(event.newValue || "[]");
            useParticipantStore.setState({ history: newHistory });
        }
    })
}

export default useParticipantStore;