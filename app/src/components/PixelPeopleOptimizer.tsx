import { Accordion, Flex, Loader, Stack, Title } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { useIsFetching } from "@tanstack/react-query";
import { Suspense } from "react";
import PublicDataProvider from "../context/PublicDataProvider";
import { TOOL_USAGE_FAQ } from "../lib/faq";
import { Recommendations } from "./recommendations";
import { SavedData } from "./saved-data";

const PixelPeopleOptimizer = () => {
	const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
		offset: 70,
	});
	const howToUseFaq = TOOL_USAGE_FAQ[0];
	const isFetching = useIsFetching();

	return (
		<Flex direction="column" gap="xl">
			<Stack gap="sm">
				<Title order={3}>Optimizer</Title>
				<Accordion chevronPosition="left" variant="contained">
					<Accordion.Item key={howToUseFaq.value} value={howToUseFaq.value}>
						<Accordion.Control>{howToUseFaq.title}</Accordion.Control>
						<Accordion.Panel>{howToUseFaq.description}</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Stack>
			{isFetching ? (
				<Loader />
			) : (
				<Suspense key="optimizer-suspense" fallback={<Loader />}>
					<PublicDataProvider>
						<SavedData />
						<Flex ref={targetRef}>
							<Recommendations scrollIntoView={scrollIntoView} />
						</Flex>
					</PublicDataProvider>
				</Suspense>
			)}
		</Flex>
	);
};

export default PixelPeopleOptimizer;
