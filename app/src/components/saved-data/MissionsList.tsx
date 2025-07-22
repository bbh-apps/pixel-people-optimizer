import { useEffect } from "react";
import useGetMissions from "../../api/useGetAllMissions";
import useGetSavedMissions from "../../api/useGetSavedMissions";
import useSaveMissions from "../../api/useSaveMissions";
import { useSelectedDataCount } from "../../hooks";
import { GameDataForm } from "../shared";

const MissionsList = () => {
	const { data: missions } = useGetMissions();
	const { data: userMissions } = useGetSavedMissions();
	const saveMissionsMutation = useSaveMissions();
	const { updateCount } = useSelectedDataCount();

	useEffect(() => {
		if (userMissions) {
			updateCount("missions", userMissions.length);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userMissions]);

	return (
		<GameDataForm
			type="missions"
			gameData={missions}
			savedData={userMissions}
			defaultIds={[]}
			saveMutation={saveMissionsMutation}
		/>
	);
};

export default MissionsList;
