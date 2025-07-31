import { useContext } from "react";
import useGetSavedBuildings from "../../api/useGetSavedBuildings";
import useSaveBuildings from "../../api/useSaveBuildings";
import { PublicDataContext } from "../../context/PublicDataContext";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";

const DEFAULT_START_BLDG_IDS = [9, 140];

const BuildingsList = () => {
	const { buildings } = useContext(PublicDataContext);
	const { data: userBuildings, isFetching } = useGetSavedBuildings();
	const saveBuildingsMutation = useSaveBuildings();

	return isFetching ? (
		<CheckboxListFormSkeleton type="buildings" />
	) : (
		<GameDataForm
			type="buildings"
			gameData={buildings ?? []}
			savedData={userBuildings}
			defaultIds={DEFAULT_START_BLDG_IDS}
			saveMutation={saveBuildingsMutation}
		/>
	);
};

export default BuildingsList;
