import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, useMatches } from "@mantine/core";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../api/useAuth";
import useGetBuildings from "../api/useGetAllBuildings";
import useGetSavedBuildings from "../api/useGetSavedBuildings";
import useSaveBuildings from "../api/useSaveBuildings";
import { usePendingSaveGameData } from "../hooks/usePendingSaveGameData";
import { useSaveGameDataForms } from "../hooks/useSaveGameDataForms";
import AuthModal from "./AuthModal";
import { AccordionCard, CheckboxList } from "./shared";
import { saveEntitySchema, type SaveBuildingsInput } from "./shared/schema";

const DEFAULT_START_BLDG_IDS = [9, 140];

const BuildingsList = () => {
	const { token } = useAuth();
	const width = useMatches({
		base: "100%",
		sm: "49%",
	});
	const { data: buildings } = useGetBuildings();
	const { data: userBuildings } = useGetSavedBuildings();

	const formMethods = useForm<SaveBuildingsInput>({
		resolver: zodResolver(saveEntitySchema),
		defaultValues: {
			ids: [],
		},
		values: {
			ids: !token
				? DEFAULT_START_BLDG_IDS
				: userBuildings?.map((b) => b.id) ?? [],
		},
	});
	const {
		handleSubmit,
		formState: { isDirty },
		reset,
		watch,
	} = formMethods;

	const { registerSaveCallback, unregisterSaveCallback, triggerSaveAll } =
		useSaveGameDataForms();
	const { addPendingSave } = usePendingSaveGameData();
	const {
		mutate: saveBuildings,
		mutateAsync: saveBuildingsAsync,
		isPending,
	} = useSaveBuildings();
	const [authOpen, setAuthOpen] = useState(false);

	const onSubmit = async (data: SaveBuildingsInput) => {
		if (token) {
			saveBuildings(data);
			reset(data);
		} else {
			addPendingSave("buildings", data, async (input) => {
				await saveBuildingsAsync(input);
			});
		}
	};

	useEffect(() => {
		if (!token) {
			registerSaveCallback("buildings", () => handleSubmit(onSubmit)());

			return () => unregisterSaveCallback("buildings");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, handleSubmit, onSubmit]);

	return (
		<Flex w={width}>
			<AuthModal opened={authOpen} onClose={() => setAuthOpen(false)} />
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
					<AccordionCard
						title="My Buildings"
						savedItemCount={(watch("ids") ?? userBuildings ?? []).length}
					>
						<Flex direction="column" gap="md" pt="xs">
							<CheckboxList items={buildings} />
							<Flex justify="end" px="md" pb="md">
								<Button
									variant="filled"
									disabled={!!token && !isDirty}
									loading={isPending}
									onClick={async () => {
										if (!token) {
											await triggerSaveAll();
											setAuthOpen(true);
										} else {
											await handleSubmit(onSubmit)();
										}
									}}
								>
									Save
								</Button>
							</Flex>
						</Flex>
					</AccordionCard>
				</form>
			</FormProvider>
		</Flex>
	);
};

export default BuildingsList;
