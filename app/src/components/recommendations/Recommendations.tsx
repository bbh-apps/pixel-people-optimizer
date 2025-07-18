import {
	Button,
	em,
	Flex,
	Input,
	NumberInput,
	Paper,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { MagicWandIcon } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../api/useAuth";
import useGetRecommendations from "../../api/useGetRecommendations";
import { useDelayedLoading } from "../../hooks";
import LoadingRecommendations from "./LoadingRecommendations";
import NoRecommendations from "./NoRecommendations";
import RecommendationsOutput from "./RecommendationsOutput";

type RecommendationsProps = {
	scrollIntoView: (params?: { alignment?: "start" | "end" | "center" }) => void;
};

const Recommendations: React.FC<RecommendationsProps> = ({
	scrollIntoView,
}) => {
	const { clickedSignOut, setClickedSignOut } = useAuth();
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme();
	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	const [remainingLand, setRemainingLand] = useState<number | null>(0);
	const [queryRemainingLand, setQueryRemainingLand] = useState<number | null>(
		null
	);
	const [hasClickedOptimize, setHasClickedOptimize] = useState<boolean>(false);

	const { data: recommendations, isLoading } =
		useGetRecommendations(queryRemainingLand);
	const showLoading = useDelayedLoading(isLoading, 1000);

	useEffect(() => {
		if (clickedSignOut) {
			setRemainingLand(null);
			setQueryRemainingLand(null);
			setHasClickedOptimize(false);
			setClickedSignOut(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [clickedSignOut]);

	let content = null;
	if (showLoading) {
		content = <LoadingRecommendations />;
	} else if (hasClickedOptimize) {
		if (recommendations && recommendations?.length > 0) {
			content = <RecommendationsOutput recommendations={recommendations} />;
		} else {
			content = <NoRecommendations />;
		}
	}

	return (
		<Paper
			withBorder
			p="md"
			bg={colorScheme === "light" ? theme.colors.gray[0] : theme.colors.dark[6]}
			w="100%"
		>
			<Flex direction="column" gap="lg">
				<Flex align="center" justify="space-between">
					<Flex
						flex={1}
						direction={isMobile ? "column" : "row"}
						gap="xs"
						align={isMobile ? "start" : "center"}
					>
						<Input.Label>Land remaining</Input.Label>
						<NumberInput
							label="Land remaining"
							placeholder="0"
							styles={{
								label: { display: "none" },
								wrapper: { width: isMobile ? "50%" : "auto" },
							}}
							value={remainingLand ?? 0}
							onChange={(val) => setRemainingLand(Number(val))}
						/>
					</Flex>
					<Button
						rightSection={<MagicWandIcon size={20} />}
						onClick={() => {
							setHasClickedOptimize(true);
							setQueryRemainingLand(remainingLand);
							scrollIntoView({
								alignment: "start",
							});
						}}
					>
						Optimize
					</Button>
				</Flex>
				{content}
			</Flex>
		</Paper>
	);
};

export default Recommendations;
