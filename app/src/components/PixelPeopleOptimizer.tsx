import { Accordion, Flex, Stack, Title } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { ErrorBoundary } from "react-error-boundary";
import { TOOL_USAGE_FAQ } from "../lib/faq";
import { Recommendations } from "./recommendations";
import { SavedData } from "./saved-data";
import ErrorBoundaryAlert from "./shared/ErrorBoundaryAlert";

const PixelPeopleOptimizer = () => {
	const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
		offset: 70,
	});
	const howToUseFaq = [TOOL_USAGE_FAQ[0], TOOL_USAGE_FAQ[2]];

	return (
		<Flex direction="column" gap="xl">
			<Stack gap="sm">
				<Title order={3}>Optimizer</Title>
				<Accordion chevronPosition="left" variant="contained">
					{howToUseFaq.map((item) => (
						<Accordion.Item key={item.value} value={item.value}>
							<Accordion.Control>{item.title}</Accordion.Control>
							<Accordion.Panel>{item.description}</Accordion.Panel>
						</Accordion.Item>
					))}
				</Accordion>
			</Stack>
			<ErrorBoundary
				fallbackRender={({ error }) => (
					<ErrorBoundaryAlert message={error.message} />
				)}
			>
				<ErrorBoundary
					fallbackRender={({ error }) => (
						<ErrorBoundaryAlert message={error.message} />
					)}
				>
					<SavedData />
				</ErrorBoundary>

				<Flex ref={targetRef}>
					<ErrorBoundary
						fallbackRender={({ error }) => (
							<ErrorBoundaryAlert message={error.message} />
						)}
					>
						<Recommendations scrollIntoView={scrollIntoView} />
					</ErrorBoundary>
				</Flex>
			</ErrorBoundary>
		</Flex>
	);
};

export default PixelPeopleOptimizer;
