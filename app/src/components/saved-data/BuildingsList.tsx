import { useContext, useEffect } from "react";
import useGetSavedBuildings from "../../api/useGetSavedBuildings";
import useSaveBuildings from "../../api/useSaveBuildings";
import { PublicDataContext } from "../../context/PublicDataContext";
import { useSelectedDataCount } from "../../hooks";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";

const DEFAULT_START_BLDG_IDS = [9, 140];

const BuildingsList = () => {
	const { buildings } = useContext(PublicDataContext);
	const { data: userBuildings } = useGetSavedBuildings();
	const saveBuildingsMutation = useSaveBuildings();
	const { updateCount } = useSelectedDataCount();

	useEffect(() => {
		if (userBuildings) {
			updateCount("buildings", userBuildings.length);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userBuildings]);

	return buildings != null ? (
		<GameDataForm
			type="buildings"
			gameData={buildings}
			savedData={userBuildings}
			defaultIds={DEFAULT_START_BLDG_IDS}
			saveMutation={saveBuildingsMutation}
		/>
	) : (
		<CheckboxListFormSkeleton type="buildings" />
	);
};

export default BuildingsList;
