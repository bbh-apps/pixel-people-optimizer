import { useContext, useMemo, useState } from "react";
import useGetSavedBuildings from "../../api/useGetSavedBuildings";
import useSaveBuildings from "../../api/useSaveBuildings";
import { PublicDataContext } from "../../context/PublicDataContext";
import type { BuildingListWithDetailRes } from "../../types/models";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";
import BuildingDetailContent from "./BuildingDetailContent";

export type BuildingSortType =
	| "abc"
	| "least_land_cost"
	| "max_land_cost"
	| "least_cps"
	| "max_cps";
const BUILDING_SORT_OPTIONS: { type: BuildingSortType; label: string }[] = [
	{
		type: "abc",
		label: "ABC Order",
	},
	{
		type: "least_land_cost",
		label: "Least Land Cost",
	},
	{
		type: "max_land_cost",
		label: "Max Land Cost",
	},
	{
		type: "least_cps",
		label: "Least CPS",
	},
	{
		type: "max_cps",
		label: "Max CPS",
	},
];

const DEFAULT_START_BLDG_IDS = [9, 140];

const BuildingsList = () => {
	const [buildingSortType, setBuildingSortType] =
		useState<BuildingSortType>("abc");
	const { buildings } = useContext(PublicDataContext);
	const { data: userBuildings, isFetching } = useGetSavedBuildings();
	const saveBuildingsMutation = useSaveBuildings();

	const buildingsData = useMemo(
		() =>
			(buildings ?? []).map((b) => ({
				...b,
				popoverContent: <BuildingDetailContent building={b} />,
			})),
		[buildings]
	);

	const onSort = (
		sortBy: BuildingSortType,
		data: BuildingListWithDetailRes[]
	) => {
		const sortFields: Record<
			BuildingSortType,
			{ field?: keyof BuildingListWithDetailRes; direction?: "asc" | "desc" }
		> = {
			abc: {},
			least_land_cost: { field: "land_cost", direction: "asc" },
			max_land_cost: { field: "land_cost", direction: "desc" },
			least_cps: { field: "max_cps", direction: "asc" },
			max_cps: { field: "max_cps", direction: "desc" },
		};

		const { field, direction } = sortFields[sortBy] || {};

		if (field && direction) {
			return data.sort((a, b) => {
				if (a[field] !== b[field]) {
					return direction === "asc"
						? (a[field] as number) - (b[field] as number)
						: (b[field] as number) - (a[field] as number);
				}
				return a.name.localeCompare(b.name);
			});
		}
		return data.sort((a, b) => a.name.localeCompare(b.name));
	};

	return isFetching ? (
		<CheckboxListFormSkeleton type="buildings" />
	) : (
		<GameDataForm
			type="buildings"
			gameData={buildingsData}
			savedData={userBuildings}
			defaultIds={DEFAULT_START_BLDG_IDS}
			saveMutation={saveBuildingsMutation}
			hasSort={true}
			sortOptions={BUILDING_SORT_OPTIONS}
			sortType={buildingSortType}
			setSortType={setBuildingSortType}
			sortFn={onSort}
		/>
	);
};

export default BuildingsList;
