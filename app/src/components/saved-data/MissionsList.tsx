import { useContext, useEffect } from "react";
import useGetSavedMissions from "../../api/useGetSavedMissions";
import useSaveMissions from "../../api/useSaveMissions";
import { PublicDataContext } from "../../context/PublicDataContext";
import { useSelectedDataCount } from "../../hooks";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";
import MissionDetailContent from "./MissionDetailContent";

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

	const userMissionsSet = new Set((userMissions ?? []).map((um) => um.id));
	const missionsData = (missions ?? []).map((m) => ({
		id: m.id,
		name: m.name,
		popoverContent: <MissionDetailContent mission={m} />,
		isUnlocked: userMissions && userMissionsSet.has(m.id),
	}));

	return missions != null ? (
		<GameDataForm
			type="missions"
			gameData={missionsData}
			savedData={userMissions}
			defaultIds={[]}
			saveMutation={saveMissionsMutation}
		/>
	) : (
		<CheckboxListFormSkeleton type="missions" />
	);
};

export default MissionsList;
