import { useEffect, useState } from "react";
import useGetProfessions, {
	type SortType,
} from "../../api/useGetAllProfessions";
import useGetSavedMissions from "../../api/useGetSavedMissions";
import useGetSavedProfessions from "../../api/useGetSavedProfessions";
import useSaveProfessions from "../../api/useSaveProfessions";
import { useSelectedDataCount } from "../../hooks";
import { GameDataForm } from "../shared";

const DEFAULT_START_PROF_IDS = [1, 2];

const ProfessionsList = () => {
	const [sortType, setSortType] = useState<SortType>("gallery");
	const { data: professions } = useGetProfessions(sortType);
	const { data: userProfessions } = useGetSavedProfessions();
	const { data: userMissions } = useGetSavedMissions();
	const saveProfessionsMutation = useSaveProfessions();
	const { updateCount } = useSelectedDataCount();

	const [disabledProfessions, setDisabledProfessions] = useState<
		{ id: number; name: string; reason: string }[]
	>([]);

	useEffect(() => {
		if (userProfessions) {
			updateCount("professions", userProfessions.length);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userProfessions]);

	useEffect(() => {
		if (userProfessions && userMissions) {
			const profToDisable = professions
				.filter((prof) => {
					const requiresMission = prof.mission != null;
					const userCompletedMission = userMissions.find(
						(mission) => mission.id === prof.mission?.id
					);
					return requiresMission && !userCompletedMission;
				})
				.map((prof) => ({
					id: prof.id,
					name: prof.name,
					reason: `Must complete the special mission first: ${
						prof.mission?.name ?? "n/a"
					}`,
				}));
			setDisabledProfessions(profToDisable);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userProfessions, userMissions]);

	return (
		<GameDataForm
			type="professions"
			gameData={professions}
			savedData={userProfessions}
			disabledData={disabledProfessions}
			defaultIds={DEFAULT_START_PROF_IDS}
			saveMutation={saveProfessionsMutation}
			hasSort={true}
			sortType={sortType}
			setSortType={setSortType}
		/>
	);
};

export default ProfessionsList;
