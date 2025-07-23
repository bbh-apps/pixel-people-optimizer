import { useContext, useEffect } from "react";
import useGetSavedMissions from "../../api/useGetSavedMissions";
import useSaveMissions from "../../api/useSaveMissions";
import { PublicDataContext } from "../../context/PublicDataContext";
import { useSelectedDataCount } from "../../hooks";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";

const MissionsList = () => {
	const { missions } = useContext(PublicDataContext);
	const { data: userMissions } = useGetSavedMissions();
	const saveMissionsMutation = useSaveMissions();
	const { updateCount } = useSelectedDataCount();

	useEffect(() => {
		if (userMissions) {
			updateCount("missions", userMissions.length);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userMissions]);

	return missions != null ? (
		<GameDataForm
			type="missions"
			gameData={missions}
			savedData={userMissions}
			defaultIds={[]}
			saveMutation={saveMissionsMutation}
		/>
	) : (
		<CheckboxListFormSkeleton type="missions" />
	);
};

export default MissionsList;
