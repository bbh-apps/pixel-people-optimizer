import {
	Accordion,
	Flex,
	Group,
	Image,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { TOOL_USAGE_FAQ } from "../lib/faq";
import { Recommendations } from "./recommendations";
import { SavedData } from "./saved-data";

const PixelPeopleOptimizer = () => {
	const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
		offset: 70,
	});
	const howToUseFaq = TOOL_USAGE_FAQ[0];

	return (
		<Flex direction="column" gap="xl">
			<Stack gap="sm">
				<Group gap="xs" align="center">
					<Image src="/Mayor.webp" h={48} w={48} />
					<Title order={1}>Pixel People Optimizer</Title>
				</Group>

				<Text>
					Welcome! I made this free open-source tool to make splicing easier in
					one of my favorite games.
				</Text>
				<Accordion chevronPosition="left" variant="contained">
					<Accordion.Item key={howToUseFaq.value} value={howToUseFaq.value}>
						<Accordion.Control>{howToUseFaq.title}</Accordion.Control>
						<Accordion.Panel>{howToUseFaq.description}</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Stack>
			<SavedData />
			<Flex ref={targetRef}>
				<Recommendations scrollIntoView={scrollIntoView} />
			</Flex>
		</Flex>
	);
};

export default PixelPeopleOptimizer;
