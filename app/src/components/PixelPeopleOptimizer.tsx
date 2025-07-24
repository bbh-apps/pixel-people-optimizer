import {
	Accordion,
	Alert,
	Flex,
	Group,
	Image,
	Stack,
	Text,
	Title,
	useMatches,
	type TitleOrder,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { WarningCircleIcon } from "@phosphor-icons/react";
import PublicDataProvider from "../context/PublicDataProvider";
import { TOOL_USAGE_FAQ } from "../lib/faq";
import { Recommendations } from "./recommendations";
import { SavedData } from "./saved-data";

const PixelPeopleOptimizer = () => {
	const titleSize: TitleOrder = useMatches({
		base: 3,
		sm: 1,
	});
	const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
		offset: 70,
	});
	const howToUseFaq = TOOL_USAGE_FAQ[0];

	return (
		<Flex direction="column" gap="xl">
			<Stack gap="sm">
				<Group gap="xs" align="center">
					<Image src="/Mayor.webp" h={48} w={48} />
					<Title order={titleSize}>Pixel People Optimizer</Title>
				</Group>

				<Text>
					Welcome! I made this free open-source tool to make splicing easier in
					one of my favorite games.
				</Text>
				<Alert
					variant="light"
					color="red"
					title="Known bug"
					icon={<WarningCircleIcon />}
				>
					There is a bug with recommendations not working on Safari. Please use
					a different browser! Thanks for your patience while I look into a fix.
				</Alert>
				<Accordion chevronPosition="left" variant="contained">
					<Accordion.Item key={howToUseFaq.value} value={howToUseFaq.value}>
						<Accordion.Control>{howToUseFaq.title}</Accordion.Control>
						<Accordion.Panel>{howToUseFaq.description}</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Stack>
			<PublicDataProvider>
				<SavedData />
				<Flex ref={targetRef}>
					<Recommendations scrollIntoView={scrollIntoView} />
				</Flex>
			</PublicDataProvider>
		</Flex>
	);
};

export default PixelPeopleOptimizer;
