import { ActionIcon, Button, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { CheckCircleIcon, FloppyDiskIcon } from "@phosphor-icons/react";
import React from "react";
import useGetSavedBuildings from "../../api/useGetSavedBuildings";
import useGetSavedProfessions from "../../api/useGetSavedProfessions";
import useSaveBuildings from "../../api/useSaveBuildings";
import useSaveProfessions from "../../api/useSaveProfessions";
import type { RecommendationRes } from "../../types/models";

type SaveRecommendationButtonProps = {
	recommendation: RecommendationRes;
	refetch: () => void;
	onConsumeLandRemaining: (landCost: number) => void;
};

const SaveRecommendationButton: React.FC<SaveRecommendationButtonProps> = ({
	recommendation,
	refetch,
	onConsumeLandRemaining,
}) => {
	const { data: savedBuildings } = useGetSavedBuildings();
	const { data: savedProfessions } = useGetSavedProfessions();
	const { mutate: saveBuildings, isPending: isSavingBuildings } =
		useSaveBuildings();
	const { mutate: saveProfessions, isPending: isSavingProfessions } =
		useSaveProfessions();

	const [opened, handlers] = useDisclosure();
	const { profession, unlock_bldg, extra_land_needed } = recommendation;
	const hasLandCost = extra_land_needed > 0;

	const onClick = () => {
		handlers.close();
		const unlockBldgId = unlock_bldg?.id;
		if (savedBuildings && unlockBldgId && hasLandCost) {
			const buildingNotifId = notifications.show({
				loading: true,
				title: "Saving building...",
				message: unlock_bldg?.name,
				autoClose: false,
				withCloseButton: false,
			});
			const savedBldgIds = savedBuildings.map((b) => b.id);
			saveBuildings(
				{ ids: savedBldgIds.concat([unlockBldgId]) },
				{
					onSuccess: () => {
						notifications.update({
							id: buildingNotifId,
							color: "teal",
							title: "Building saved!",
							message: unlock_bldg?.name,
							icon: <CheckCircleIcon size={18} />,
							loading: false,
							autoClose: 2000,
						});
						onConsumeLandRemaining(extra_land_needed);
					},
					onError: (error) => {
						notifications.update({
							id: buildingNotifId,
							color: "red",
							title: `Error saving ${unlock_bldg?.name}`,
							message: error.message,
							icon: <CheckCircleIcon size={18} />,
							loading: false,
							withCloseButton: true,
						});
					},
				}
			);
		}

		if (savedProfessions) {
			const professionNotifId = notifications.show({
				loading: true,
				title: "Saving profession...",
				message: profession?.name,
				autoClose: false,
				withCloseButton: false,
			});
			const unlockProfessionId = profession.id;
			const savedProfIds = savedProfessions.map((p) => p.id);
			saveProfessions(
				{ ids: savedProfIds.concat([unlockProfessionId]) },
				{
					onSuccess: () => {
						notifications.update({
							id: professionNotifId,
							color: "teal",
							title: "Nice splicing. Profession saved!",
							message: profession?.name,
							icon: <CheckCircleIcon size={18} />,
							loading: false,
							autoClose: 2000,
						});
						refetch();
					},
					onError: (error) => {
						notifications.update({
							id: professionNotifId,
							color: "red",
							title: `Error saving ${profession?.name}`,
							message: error.message,
							icon: <CheckCircleIcon size={18} />,
							loading: false,
							withCloseButton: true,
						});
					},
				}
			);
		}
	};

	const isSaving = isSavingBuildings || isSavingProfessions;

	return (
		<>
			<ActionIcon size="sm" onClick={handlers.open} hiddenFrom="xs">
				<FloppyDiskIcon />
			</ActionIcon>
			<Button
				size="compact-xs"
				onClick={handlers.open}
				visibleFrom="sm"
				leftSection={<FloppyDiskIcon />}
				styles={{ section: { marginInlineEnd: "0.25rem" } }}
			>
				Save
			</Button>

			<Modal
				opened={opened}
				onClose={handlers.close}
				centered
				title={`Are you sure you want to splice a clone as a ${profession.name}?`}
			>
				<Stack>
					{hasLandCost && (
						<Text size="sm">
							Saving {profession.name} to your discovered professions will also
							save {unlock_bldg?.name} to your saved buildings.
						</Text>
					)}
					<Button onClick={onClick} loading={isSaving} disabled={isSaving}>
						{isSaving ? "Saving..." : "Yes, I want to save!"}
					</Button>
				</Stack>
			</Modal>
		</>
	);
};

export default SaveRecommendationButton;
