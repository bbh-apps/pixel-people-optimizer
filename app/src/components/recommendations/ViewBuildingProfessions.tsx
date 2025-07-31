import {
	Anchor,
	Group,
	Modal,
	Paper,
	Text,
	useComputedColorScheme,
	useMantineTheme,
	useMatches,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import useGetSavedProfessions from "../../api/useGetSavedProfessions";
import type { RecommendationRes } from "../../types/models";

type ViewBuildingProfessionsProps = {
	recommendation: RecommendationRes;
};

const ViewBuildingProfessions: React.FC<ViewBuildingProfessionsProps> = ({
	recommendation,
}) => {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const parentColor =
		colorScheme === "light" ? theme.colors.blue[0] : theme.colors.dark[4];
	const size = useMatches({
		base: "xs",
		sm: "sm",
	});

	const [opened, handlers] = useDisclosure();
	const { unlock_bldg } = recommendation;

	const { data: savedProfessions } = useGetSavedProfessions();

	const getProfessionsList = () => {
		return unlock_bldg?.professions.map((prof) => {
			const isUnlocked =
				savedProfessions &&
				savedProfessions.find((savedProf) => savedProf.name === prof.name);
			return (
				<Paper
					withBorder={colorScheme === "light"}
					bg={isUnlocked ? "blue" : parentColor}
					p={6}
					key={`unlock-bldg-modal-${prof.name}`}
				>
					<Text size="xs" fw={700}>
						{prof.name}
					</Text>
					<Text size="xs">{prof.category}</Text>
				</Paper>
			);
		});
	};

	return (
		<>
			<Anchor
				size={size}
				onClick={() => {
					handlers.open();
				}}
			>
				{unlock_bldg?.name}
			</Anchor>
			<Modal
				opened={opened}
				onClose={handlers.close}
				centered
				title={
					<Text size="sm">
						<Text fw={700} span inherit>
							{unlock_bldg?.name}
						</Text>{" "}
						is the workplace for these professions
					</Text>
				}
			>
				<Text size="sm">
					<Text span c="blue" inherit>
						Blue
					</Text>{" "}
					represents professions you already unlocked.
				</Text>
				<Group mt="sm">{getProfessionsList()}</Group>
			</Modal>
		</>
	);
};

export default ViewBuildingProfessions;
