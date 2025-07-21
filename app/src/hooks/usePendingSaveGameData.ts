import { create } from "zustand";
import type {
	SaveBuildingsInput,
	SaveProfessionsInput,
} from "../components/shared/schema";

// Define valid keys and their associated input types
type SaveKey = "buildings" | "professions";

type SaveInputMap = {
	buildings: SaveBuildingsInput;
	professions: SaveProfessionsInput;
};

type SaveEntry<K extends SaveKey = SaveKey> = {
	key: K;
	save: (input: SaveInputMap[K]) => Promise<void>;
	input: SaveInputMap[K];
};

type PendingSaveStore = {
	saves: Partial<{
		[K in SaveKey]: SaveEntry<K>;
	}>;

	addPendingSave: <K extends SaveKey>(
		key: K,
		input: SaveInputMap[K],
		save: (input: SaveInputMap[K]) => Promise<void>
	) => void;

	submitAllPendingSaves: () => Promise<void>;
	clear: () => void;
};

export const usePendingSaveGameData = create<PendingSaveStore>((set, get) => ({
	saves: {},

	addPendingSave: (key, input, save) =>
		set((state) => ({
			saves: {
				...state.saves,
				[key]: { key, input, save } as SaveEntry,
			},
		})),

	submitAllPendingSaves: async () => {
		const { saves, clear } = get();
		for (const key in saves) {
			const entry = saves[key as SaveKey];
			if (!entry) continue;

			try {
				await entry.save(entry.input);
			} catch (err) {
				console.error(`Failed to save ${key}:`, err);
			}
		}
		clear();
	},

	clear: () => set({ saves: {} }),
}));
