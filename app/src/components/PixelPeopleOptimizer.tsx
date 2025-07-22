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
import { Suspense } from "react";
import { TOOL_USAGE_FAQ } from "../lib/faq";
import BuildingsList from "./BuildingsList";
import ProfessionsList from "./ProfessionsList";
import { Recommendations } from "./recommendations";
import { CheckboxListFormSkeleton } from "./shared";

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
			<Flex
				gap="sm"
				wrap="wrap"
				direction={{ base: "column", sm: "row" }}
				justify="center"
			>
				<Suspense fallback={<CheckboxListFormSkeleton title="My Buildings" />}>
					<BuildingsList />
				</Suspense>
				<Suspense
					fallback={
						<CheckboxListFormSkeleton title="My Discovered Professions" />
					}
				>
					<ProfessionsList />
				</Suspense>
			</Flex>
			<Flex ref={targetRef}>
				<Recommendations scrollIntoView={scrollIntoView} />
			</Flex>
		</Flex>
	);
};

export default PixelPeopleOptimizer;
