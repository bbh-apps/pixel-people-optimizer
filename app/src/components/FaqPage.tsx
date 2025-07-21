import { Accordion, Stack, Title } from "@mantine/core";
import type React from "react";
import { ACCOUNTS_FAQ, TOOL_USAGE_FAQ } from "../lib/faq";

type FaqSectionContent = {
	title: string;
	value: string;
	description: React.ReactNode;
};

type FaqSectionProps = {
	section: FaqSectionContent[];
};

const FaqSection: React.FC<FaqSectionProps> = ({ section }) => {
	return (
		<Accordion
			defaultValue={section[0].value}
			chevronPosition="left"
			variant="contained"
		>
			{section.map((item) => (
				<Accordion.Item key={item.value} value={item.value}>
					<Accordion.Control>{item.title}</Accordion.Control>
					<Accordion.Panel>{item.description}</Accordion.Panel>
				</Accordion.Item>
			))}
		</Accordion>
	);
};

const FaqPage = () => {
	return (
		<Stack>
			<Title order={1}>Frequently Asked Questions</Title>
			<Title order={3}>Using the tool</Title>
			<FaqSection section={TOOL_USAGE_FAQ} />
			<Title order={3}>Accounts</Title>
			<FaqSection section={ACCOUNTS_FAQ} />
		</Stack>
	);
};

export default FaqPage;
