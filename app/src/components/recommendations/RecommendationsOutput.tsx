import { Pagination, Stack } from "@mantine/core";
import React, { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSortRecommendationData } from "../../hooks/useSortRecommendationData";
import type { RecommendationRes } from "../../types/models";
import ErrorBoundaryAlert from "../shared/ErrorBoundaryAlert";
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
			<ErrorBoundary
				fallbackRender={({ error }) => (
					<ErrorBoundaryAlert message={error.message} />
				)}
			>
				<RecommendationCards
					recommendations={currentPageData}
					sortBy={sortBy}
					sortDirection={sortDirection}
					onClickSorting={onClickSorting}
					refetch={refetch}
					onConsumeLandRemaining={onConsumeLandRemaining}
				/>
			</ErrorBoundary>
			<ErrorBoundary
				fallbackRender={({ error }) => (
					<ErrorBoundaryAlert message={error.message} />
				)}
			>
				<RecommendationsTable
					recommendations={currentPageData}
					sortBy={sortBy}
					sortDirection={sortDirection}
					onClickSorting={onClickSorting}
					refetch={refetch}
					onConsumeLandRemaining={onConsumeLandRemaining}
				/>
			</ErrorBoundary>
			<ErrorBoundary
				fallbackRender={({ error }) => (
					<ErrorBoundaryAlert message={error.message} />
				)}
			>
				<Pagination
					total={pages.length}
					value={activePage}
					onChange={setPage}
					my="sm"
				/>
			</ErrorBoundary>
		</Stack>
	);
};

export default RecommendationsOutput;
