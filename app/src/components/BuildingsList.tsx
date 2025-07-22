import useGetBuildings from "../api/useGetAllBuildings";
import useGetSavedBuildings from "../api/useGetSavedBuildings";
import useSaveBuildings from "../api/useSaveBuildings";
import { GameDataForm } from "./shared";

const DEFAULT_START_BLDG_IDS = [9, 140];

const BuildingsList = () => {
	const { data: buildings } = useGetBuildings();
	const { data: userBuildings } = useGetSavedBuildings();
	const saveBuildingsMutation = useSaveBuildings();

	return (
		<GameDataForm
			type="buildings"
			gameData={buildings}
			savedData={userBuildings}
			defaultIds={DEFAULT_START_BLDG_IDS}
			saveMutation={saveBuildingsMutation}
		/>
	);
};

export default BuildingsList;
