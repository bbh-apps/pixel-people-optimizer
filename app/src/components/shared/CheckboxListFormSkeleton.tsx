import {
	Accordion,
	Button,
	Checkbox,
	Flex,
	Group,
	Skeleton,
	Text,
	useMatches,
} from "@mantine/core";
import { range } from "@mantine/hooks";
import React from "react";

type CheckboxListFormSkeletonProps = {
	title: string;
};

const CheckboxListFormSkeleton: React.FC<CheckboxListFormSkeletonProps> = ({
	title,
}) => {
	const width = useMatches({
		base: "100%",
		sm: "49%",
	});

	const getRandomWidth = () => {
		const minWidth = 60;
		const maxWidth = 70;
		return Math.random() * (maxWidth - minWidth) + minWidth;
	};

	return (
		<Flex w={width}>
			<Accordion
				chevronPosition="left"
				variant="contained"
				defaultValue={title}
				w="100%"
			>
				<Accordion.Item value={title} key={title}>
					<Accordion.Control>
						<Text>{title}</Text>
					</Accordion.Control>
					<Accordion.Panel>
						<Flex direction="column" gap="md" pt="xs">
							<Group gap="md">
								{range(0, 13).map((idx) => (
									<Group w="45%" key={`${title}-${idx}`}>
										<Checkbox.Indicator disabled />
										<Skeleton height={8} w={`${getRandomWidth()}%`} />
									</Group>
								))}
							</Group>
							<Flex justify="end">
								<Button variant="filled" disabled>
									Save
								</Button>
							</Flex>
						</Flex>
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</Flex>
	);
};

export default CheckboxListFormSkeleton;
