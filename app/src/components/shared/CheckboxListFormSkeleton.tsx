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
	const widths = useMatches({
		base: "45%",
		sm: "30%",
		md: "23%",
	});

	const getRandomWidth = () => {
		const minWidth = 70;
		const maxWidth = 80;
		return Math.random() * (maxWidth - minWidth) + minWidth;
	};

	return (
		<Flex direction="column" gap="md" pt="xs" px="md">
			<TextInput disabled />
			<Group gap="md">
				{range(0, 19).map((idx) => (
					<Group w={widths} key={`${type}-${idx}`}>
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
