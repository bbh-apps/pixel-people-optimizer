import { useContext, useEffect, useState } from "react";
import useGetSavedMissions from "../../api/useGetSavedMissions";
import useGetSavedProfessions from "../../api/useGetSavedProfessions";
import useSaveProfessions from "../../api/useSaveProfessions";
import { PublicDataContext } from "../../context/PublicDataContext";
import { useSelectedDataCount } from "../../hooks";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";
import type { DisabledData } from "../shared/CheckboxListItem";
import UnlockMissionContent from "./UnlockMissionContent";

export type ProfessionSortType = "abc" | "gallery";

const DEFAULT_START_PROF_IDS = [1, 2];

const ProfessionsList = () => {
	const [ProfessionSortType, setProfessionSortType] =
		useState<ProfessionSortType>("gallery");
	const { professions } = useContext(PublicDataContext);
	const { data: userProfessions } = useGetSavedProfessions();
	const { data: userMissions } = useGetSavedMissions();
	const saveProfessionsMutation = useSaveProfessions();
	const { updateCount } = useSelectedDataCount();

	const [disabledProfessions, setDisabledProfessions] = useState<
		DisabledData[]
	>([]);

	useEffect(() => {
		if (userProfessions) {
			updateCount("professions", userProfessions.length);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userProfessions]);

	useEffect(() => {
		if (userProfessions && userMissions) {
			const userProfessionsSet = new Set(
				userProfessions.map((mission) => mission.id)
			);
			const profToDisable = (professions ?? [])
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
					popoverContent:
						prof.mission && prof.formula ? (
							<UnlockMissionContent
								mission={prof.mission}
								formula={prof.formula.map((p) => ({
									...p,
									isUnlocked: userProfessionsSet.has(p.id),
								}))}
							/>
						) : null,
				}));
			setDisabledProfessions(profToDisable);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userProfessions, userMissions]);

	return professions != null ? (
		<GameDataForm
			type="professions"
			gameData={professions}
			savedData={userProfessions}
			disabledData={disabledProfessions}
			defaultIds={DEFAULT_START_PROF_IDS}
			saveMutation={saveProfessionsMutation}
			hasSort={true}
			ProfessionSortType={ProfessionSortType}
			setProfessionSortType={setProfessionSortType}
		/>
	) : (
		<CheckboxListFormSkeleton type="professions" />
	);
};

export default ProfessionsList;
