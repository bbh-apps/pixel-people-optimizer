import { useContext, useEffect, useMemo, useState } from "react";
import useGetSavedProfessions from "../../api/useGetSavedProfessions";
import useSaveProfessions from "../../api/useSaveProfessions";
import { PublicDataContext } from "../../context/PublicDataContext";
import { useSelectedDataCount } from "../../hooks";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";
import type { DisabledData } from "../shared/CheckboxListItem";
import ProfessionDetailContent from "./ProfessionDetailContent";
import UnlockMissionContent from "./UnlockMissionContent";

export type ProfessionSortType = "abc" | "gallery";

const DEFAULT_START_PROF_IDS = [1, 2];

const ProfessionsList = () => {
	const [ProfessionSortType, setProfessionSortType] =
		useState<ProfessionSortType>("gallery");
	const { professions } = useContext(PublicDataContext);
	const { data: userProfessions } = useGetSavedProfessions();
	const saveProfessionsMutation = useSaveProfessions();
	const { updateCount } = useSelectedDataCount();

	const professionsData = useMemo(
		() =>
			(professions ?? []).map((p) => ({
				...p,
				popoverContent: p.formula ? (
					<ProfessionDetailContent name={p.name} formula={p.formula} />
				) : null,
			})),
		[professions]
	);

	const disabledProfessions: DisabledData[] = useMemo(
		() =>
			(professions ?? [])
				.filter((p) => p.mission != null && !p.mission.is_complete)
				.map((p) => ({
					id: p.id,
					name: p.name,
					popoverContent: p.mission ? (
						<UnlockMissionContent
							mission={p.mission}
							formula={p.formula ?? []}
						/>
					) : null,
				})),
		[professions]
	);

	useEffect(() => {
		if (userProfessions) {
			updateCount("professions", userProfessions.length);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userProfessions]);

	return professions != null ? (
		<GameDataForm
			type="professions"
			gameData={professionsData}
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
