import { Accordion, Alert, Flex, Paper, Stack, Title } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { WarningIcon } from "@phosphor-icons/react";
import { useContext, useMemo, useState } from "react";
import { PublicDataContext } from "../../context/PublicDataContext";
import { TOOL_USAGE_FAQ } from "../../lib/faq";
import type { BaseEntityRes } from "../../types/models";
import { SearchableSelect } from "../shared";
import Visualizer from "./Visualizer";

const VisualizerPage = () => {
	const { professions } = useContext(PublicDataContext);
	const [value, setValue] = useState<BaseEntityRes | null>(null);
	const { ref, width } = useElementSize();
	const howToUseFaq = TOOL_USAGE_FAQ[1];

	const searchOptions = useMemo(
		() =>
			(professions ?? [])
				.map((p) => ({ id: p.id, name: p.name }))
				.sort((a, b) => a.name.localeCompare(b.name)),
		[professions]
	);

	return (
		<Flex direction="column" gap="xl">
			<Stack gap="sm">
				<Title order={3}>Visualizer</Title>
				<Alert
					title="Feature available on desktop and tablets only"
					icon={<WarningIcon />}
					color="yellow"
					hiddenFrom="sm"
				>
					Since many of the graphs are large and complex, they are much easier
					to view on a larger screen.
				</Alert>
				<Accordion chevronPosition="left" variant="contained">
					<Accordion.Item key={howToUseFaq.value} value={howToUseFaq.value}>
						<Accordion.Control>{howToUseFaq.title}</Accordion.Control>
						<Accordion.Panel>{howToUseFaq.description}</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
				<Stack visibleFrom="sm">
					<SearchableSelect
						value={value}
						setValue={setValue}
						options={searchOptions}
						placeholder="Search professions"
					/>
					{value && (
						<Paper
							ref={ref}
							withBorder
							style={{
								height: "600px",
								width: "100%",
								maxWidth: 1000,
								color: "black",
								margin: "0 auto",
							}}
						>
							<Visualizer value={value} width={width} />
						</Paper>
					)}
				</Stack>
			</Stack>
		</Flex>
	);
};

export default VisualizerPage;
