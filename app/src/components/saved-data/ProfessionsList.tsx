import { useContext, useMemo, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useGetSavedProfessions from "../../api/useGetSavedProfessions";
import useSaveProfessions from "../../api/useSaveProfessions";
import { PublicDataContext } from "../../context/PublicDataContext";
import type { ProfessionListWithDetailRes } from "../../types/models";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";
import type { DisabledData } from "../shared/CheckboxListItem";
import ErrorBoundaryAlert from "../shared/ErrorBoundaryAlert";
import ProfessionDetailContent from "./ProfessionDetailContent";
import UnlockMissionContent from "./UnlockMissionContent";

export type ProfessionSortType = "abc" | "gallery";
const PROFESSION_SORT_OPTIONS: { type: ProfessionSortType; label: string }[] = [
	{
		type: "abc",
		label: "ABC Order",
	},
	{
		type: "gallery",
		label: "Gallery Order",
	},
];

const DEFAULT_START_PROF_IDS = [1, 2];

const ProfessionsList = () => {
	const [professionSortType, setProfessionSortType] =
		useState<ProfessionSortType>("gallery");
	const { professions } = useContext(PublicDataContext);
	const { data: userProfessions, isFetching } = useGetSavedProfessions();
	const saveProfessionsMutation = useSaveProfessions();

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

	const onSort = (
		sortBy: ProfessionSortType,
		data: ProfessionListWithDetailRes[]
	) => {
		if (sortBy === "abc") {
			return data.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortBy === "gallery") {
			return data.sort((a, b) => a.id - b.id);
		}
		return data;
	};

	return isFetching ? (
		<CheckboxListFormSkeleton type="professions" />
	) : (
		<ErrorBoundary
			fallbackRender={({ error }) => (
				<ErrorBoundaryAlert message={error.message} />
			)}
		>
			<GameDataForm
				type="professions"
				gameData={professionsData}
				savedData={userProfessions}
				disabledData={disabledProfessions}
				defaultIds={DEFAULT_START_PROF_IDS}
				saveMutation={saveProfessionsMutation}
				hasSort={true}
				sortOptions={PROFESSION_SORT_OPTIONS}
				sortType={professionSortType}
				setSortType={setProfessionSortType}
				sortFn={onSort}
			/>
		</ErrorBoundary>
	);
};

export default ProfessionsList;
