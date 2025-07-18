import { Pagination, Stack } from "@mantine/core";
import React from "react";
import { useSortRecommendationData } from "../../hooks/useSortRecommendationData";
import type { RecommendationRes } from "../../types/models";
import RecommendationCards from "./RecommendationCards";
import RecommendationsTable from "./RecommendationsTable";

type RecommendationsOutputProps = {
	recommendations: RecommendationRes[];
};

const RecommendationsOutput: React.FC<RecommendationsOutputProps> = ({
	recommendations,
}) => {
	const {
		activePage,
		setPage,
		onClickSorting,
		pages,
		currentPageData,
		sortBy,
		sortDirection,
	} = useSortRecommendationData(recommendations);

	return (
		<Stack align="center">
			<RecommendationCards
				recommendations={currentPageData}
				sortBy={sortBy}
				sortDirection={sortDirection}
				onClickSorting={onClickSorting}
			/>
			<RecommendationsTable
				recommendations={currentPageData}
				sortBy={sortBy}
				sortDirection={sortDirection}
				onClickSorting={onClickSorting}
			/>
			<Pagination
				total={pages.length}
				value={activePage}
				onChange={setPage}
				my="sm"
			/>
		</Stack>
	);
};

export default RecommendationsOutput;
