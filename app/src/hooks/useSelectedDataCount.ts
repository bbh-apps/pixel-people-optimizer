import { create } from "zustand";
import type { GameDataType } from "../components/shared/GameDataForm";

type SelectedDataStore = {
	buildingCount: number;
	professionCount: number;
	missionCount: number;
	updateCount: (key: GameDataType, count: number) => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSelectedDataCount = create<SelectedDataStore>((set, _get) => ({
	buildingCount: 0,
	professionCount: 0,
	missionCount: 0,
	updateCount: (key, count) =>
		set(() => {
			if (key === "buildings") {
				return {
					buildingCount: count,
				};
			} else if (key === "professions") {
				return {
					professionCount: count,
				};
			} else {
				return {
					missionCount: count,
				};
			}
		}),
}));
