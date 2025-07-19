import { Pagination, Stack } from "@mantine/core";
import React from "react";
import { useSortRecommendationData } from "../../hooks/useSortRecommendationData";
import type { RecommendationRes } from "../../types/models";
import RecommendationCards from "./RecommendationCards";
import RecommendationsTable from "./RecommendationsTable";

type RecommendationsOutputProps = {
	recommendations: RecommendationRes[];
	refetch: () => void;
};

const RecommendationsOutput: React.FC<RecommendationsOutputProps> = ({
	recommendations,
	refetch,
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
				refetch={refetch}
			/>
			<RecommendationsTable
				recommendations={currentPageData}
				sortBy={sortBy}
				sortDirection={sortDirection}
				onClickSorting={onClickSorting}
				refetch={refetch}
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
