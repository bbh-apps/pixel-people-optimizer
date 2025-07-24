import { createContext } from "react";
import type {
	BuildingListRes,
	MissionListWithDetailRes,
	ProfessionListWithDetailRes,
} from "../types/models";

type PublicDataContextType = {
	buildings: BuildingListRes[] | undefined;
	professions: ProfessionListWithDetailRes[] | undefined;
	missions: MissionListWithDetailRes[] | undefined;
};

export const PublicDataContext = createContext<PublicDataContextType>({
	buildings: undefined,
	professions: undefined,
	missions: undefined,
});
