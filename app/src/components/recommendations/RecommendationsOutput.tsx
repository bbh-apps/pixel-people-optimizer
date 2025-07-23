import { Pagination, Stack } from "@mantine/core";
import React, { useEffect } from "react";
import { useSortRecommendationData } from "../../hooks/useSortRecommendationData";
import type { RecommendationRes } from "../../types/models";
import RecommendationCards from "./RecommendationCards";
import RecommendationsTable from "./RecommendationsTable";

type RecommendationsOutputProps = {
	recommendations: RecommendationRes[];
	refetch: () => void;
	onConsumeLandRemaining: (landCost: number) => void;
};

const RecommendationsOutput: React.FC<RecommendationsOutputProps> = ({
	recommendations,
	refetch,
	onConsumeLandRemaining,
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

	useEffect(() => {
		if (recommendations) {
			setPage(1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recommendations]);

	return (
		<Stack align="center">
			<RecommendationCards
				recommendations={currentPageData}
				sortBy={sortBy}
				sortDirection={sortDirection}
				onClickSorting={onClickSorting}
				refetch={refetch}
				onConsumeLandRemaining={onConsumeLandRemaining}
			/>
			<RecommendationsTable
				recommendations={currentPageData}
				sortBy={sortBy}
				sortDirection={sortDirection}
				onClickSorting={onClickSorting}
				refetch={refetch}
				onConsumeLandRemaining={onConsumeLandRemaining}
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
