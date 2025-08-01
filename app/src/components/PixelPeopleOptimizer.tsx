import { Accordion, Flex, Stack, Title } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { ErrorBoundary } from "react-error-boundary";
import PublicDataProvider from "../context/PublicDataProvider";
import { TOOL_USAGE_FAQ } from "../lib/faq";
import { Recommendations } from "./recommendations";
import { SavedData } from "./saved-data";
import ErrorBoundaryAlert from "./shared/ErrorBoundaryAlert";

const PixelPeopleOptimizer = () => {
	const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
		offset: 70,
	});
	const howToUseFaq = TOOL_USAGE_FAQ[0];

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
			<ErrorBoundary
				fallbackRender={({ error }) => (
					<ErrorBoundaryAlert message={error.message} />
				)}
			>
				<PublicDataProvider>
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
				</PublicDataProvider>
			</ErrorBoundary>
		</Flex>
	);
};

export default PixelPeopleOptimizer;
