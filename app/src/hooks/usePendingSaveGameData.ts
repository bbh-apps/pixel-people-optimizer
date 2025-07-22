import { create } from "zustand";
import type { GameDataType } from "../components/shared/GameDataForm";
import type {
	SaveBuildingsInput,
	SaveMissionsInput,
	SaveProfessionsInput,
} from "../components/shared/schema";

type SaveInputMap = {
	buildings: SaveBuildingsInput;
	professions: SaveProfessionsInput;
	missions: SaveMissionsInput;
};

type SaveEntry<K extends GameDataType = GameDataType> = {
	key: K;
	save: (input: SaveInputMap[K]) => Promise<void>;
	input: SaveInputMap[K];
};

type PendingSaveStore = {
	saves: Partial<{
		[K in GameDataType]: SaveEntry<K>;
	}>;

	addPendingSave: <K extends GameDataType>(
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
			const entry = saves[key as GameDataType];
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
