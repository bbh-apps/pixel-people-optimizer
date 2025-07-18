import { Accordion, Badge, Group, Text } from "@mantine/core";
import type React from "react";

export type AccordionCardProps = {
	title: string;
	children: React.ReactNode;
	savedItemCount: number;
};

const AccordionCard: React.FC<AccordionCardProps> = ({
	title,
	children,
	savedItemCount,
}) => {
	return (
		<Accordion
			chevronPosition="left"
			variant="contained"
			defaultValue={title}
			w="100%"
			styles={{
				content: {
					padding: 0,
				},
			}}
		>
			<Accordion.Item value={title} key={title}>
				<Accordion.Control>
					<Group>
						<Text>{title}</Text>
						<Badge
							color="blue"
							variant="light"
							styles={{ root: { borderRadius: "2px", padding: "4px" } }}
						>
							{savedItemCount}
						</Badge>
					</Group>
				</Accordion.Control>
				<Accordion.Panel>{children}</Accordion.Panel>
			</Accordion.Item>
		</Accordion>
	);
};

export default AccordionCard;
