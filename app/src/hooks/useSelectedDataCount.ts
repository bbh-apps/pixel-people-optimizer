import { create } from "zustand";
import type { GameDataType } from "../components/shared/GameDataForm";

type SelectedDataStore = {
	buildingCount: number | null;
	professionCount: number | null;
	missionCount: number | null;
	updateCount: (key: GameDataType, count: number) => void;
	getCountByType: (key: GameDataType) => number | null;
};

export const useSelectedDataCount = create<SelectedDataStore>((set, get) => ({
	buildingCount: null,
	professionCount: null,
	missionCount: null,
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
	getCountByType: (key) => {
		const { buildingCount, professionCount, missionCount } = get();
		switch (key) {
			case "buildings":
				return buildingCount;
			case "professions":
				return professionCount;
			case "missions":
				return missionCount;
			default:
				return null;
		}
	},
}));
