import { createContext } from "react";
import type {
	BuildingListWithDetailRes,
	MissionListWithDetailRes,
	ProfessionListWithDetailRes,
} from "../types/models";

type PublicDataContextType = {
	buildings: BuildingListWithDetailRes[] | undefined;
	professions: ProfessionListWithDetailRes[] | undefined;
	missions: MissionListWithDetailRes[] | undefined;
};

export const PublicDataContext = createContext<PublicDataContextType>({
	buildings: undefined,
	professions: undefined,
	missions: undefined,
});
