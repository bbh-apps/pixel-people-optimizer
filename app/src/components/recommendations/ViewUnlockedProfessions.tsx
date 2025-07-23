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
import pluralize from "pluralize";
import React from "react";
import type { RecommendationRes } from "../../types/models";

type ViewUnlockedProfessionsProps = {
	recommendation: RecommendationRes;
};

const ViewUnlockedProfessions: React.FC<ViewUnlockedProfessionsProps> = ({
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
	const { profession, unlock_professions } = recommendation;
	return (
		<>
			{unlock_professions.length > 0 ? (
				<Anchor
					size={size}
					onClick={() => {
						handlers.open();
					}}
				>
					{unlock_professions.length}{" "}
					{pluralize("profession", unlock_professions.length)}
				</Anchor>
			) : (
				"0 professions"
			)}
			<Modal
				opened={opened}
				onClose={handlers.close}
				centered
				title={
					<>
						<Text fw={700} span size="sm">
							{profession.name}
						</Text>
						<Text span size="sm">
							{" "}
							unlocks these professions
						</Text>
					</>
				}
			>
				<Group>
					{unlock_professions.map((prof) => (
						<Paper
							withBorder
							bg={parentColor}
							p={6}
							key={`unlock-prof-modal-${prof.name}`}
						>
							<Text size="xs" fw={700}>
								{prof.name}
							</Text>
							<Text size="xs">{prof.category}</Text>
						</Paper>
					))}
				</Group>
			</Modal>
		</>
	);
};

export default ViewUnlockedProfessions;
