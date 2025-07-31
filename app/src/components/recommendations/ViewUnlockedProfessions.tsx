import {
	Anchor,
	Group,
	Modal,
	Paper,
	Stack,
	Text,
	useComputedColorScheme,
	useMantineTheme,
	useMatches,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import pluralize from "pluralize";
import React, { useContext, useMemo } from "react";
import { PublicDataContext } from "../../context/PublicDataContext";
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
	const partialUnlockColor =
		colorScheme === "light" ? theme.colors.green[6] : theme.colors.green[5];
	const missionUnlockColor =
		colorScheme === "light" ? theme.colors.orange[6] : theme.colors.orange[5];

	const size = useMatches({
		base: "xs",
		sm: "sm",
	});

	const [opened, handlers] = useDisclosure();
	const { profession, unlock_professions } = recommendation;

	const { professions } = useContext(PublicDataContext);
	const unlockProfessionsWithFormula = useMemo(
		() =>
			unlock_professions
				.map((up) => {
					const detail = professions?.find((p) => p.id === up.id);
					if (detail) {
						return {
							...detail,
							isPartialUnlock: detail.formula?.some(
								(p) =>
									p.is_unlocked === true &&
									!(detail.mission != null && !detail.mission?.is_complete)
							),
							isMissionNeeded: detail.formula?.some(
								(p) =>
									p.is_unlocked === true &&
									detail.mission != null &&
									!detail.mission?.is_complete
							),
						};
					}
				})
				.filter((up) => up != null),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[professions]
	);

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
					<Text size="sm">
						<Text fw={700} span inherit>
							{profession.name}
						</Text>{" "}
						unlocks these professions:
					</Text>
				}
			>
				<Stack>
					<Group>
						{unlockProfessionsWithFormula.map((prof) => (
							<Paper
								withBorder={colorScheme === "light"}
								bg={
									prof.isPartialUnlock
										? partialUnlockColor
										: prof.isMissionNeeded
										? missionUnlockColor
										: parentColor
								}
								p={6}
								key={`unlock-prof-modal-${prof.name}`}
							>
								<Text
									size="xs"
									fw={700}
									c={
										prof.isPartialUnlock || prof.isMissionNeeded
											? theme.colors.gray[9]
											: "var(--mantine-color-text)"
									}
								>
									{prof.name}
								</Text>
								<Text
									size="xs"
									c={
										prof.isPartialUnlock || prof.isMissionNeeded
											? theme.colors.gray[9]
											: "var(--mantine-color-text)"
									}
								>
									{prof.category}
								</Text>
							</Paper>
						))}
					</Group>
					<Stack gap="xs">
						<Text size="xs">
							<Text fw={700} span inherit c={partialUnlockColor}>
								Green
							</Text>
							: this is ready to splice after splicing{" "}
							<Text fw={700} span inherit>
								{profession.name}
							</Text>
							. You have unlocked the other half of the formula already and have
							completed the special mission (if applicable).
						</Text>
						<Text size="xs">
							<Text fw={700} span inherit c={missionUnlockColor}>
								Orange
							</Text>
							: you have unlocked half of the formula already but still need to
							complete a special mission to unlock it.
						</Text>
					</Stack>
				</Stack>
			</Modal>
		</>
	);
};

export default ViewUnlockedProfessions;
