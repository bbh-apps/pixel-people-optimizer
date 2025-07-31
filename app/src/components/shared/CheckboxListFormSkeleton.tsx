import {
	Button,
	Checkbox,
	Flex,
	Group,
	Skeleton,
	TextInput,
	useMatches,
} from "@mantine/core";
import { range } from "@mantine/hooks";
import React from "react";
import type { GameDataType } from "./GameDataForm";

type CheckboxListFormSkeletonProps = {
	type: GameDataType;
};

const CheckboxListFormSkeleton: React.FC<CheckboxListFormSkeletonProps> = ({
	type,
}) => {
	const numItems = useMatches({
		base: 4,
		sm: 14,
		md: 19,
	});

	const getRandomWidth = () => {
		const minWidth = 65;
		const maxWidth = 70;
		return Math.random() * (maxWidth - minWidth) + minWidth;
	};

	return (
		<Flex direction="column" gap="md" pt="xs" px="md">
			<TextInput disabled />
			<Group gap="sm">
				{range(0, numItems).map((idx) => (
					<Group
						w={{
							base: "45%",
							sm: "30%",
							md: "23%",
						}}
						key={`${type}-${idx}`}
					>
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
	);
};

export default CheckboxListFormSkeleton;
