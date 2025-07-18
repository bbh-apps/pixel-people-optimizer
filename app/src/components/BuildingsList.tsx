import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, useMatches } from "@mantine/core";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../api/useAuth";
import useGetBuildings from "../api/useGetAllBuildings";
import useGetSavedBuildings from "../api/useGetSavedBuildings";
import useSaveBuildings from "../api/useSaveBuildings";
import AuthModal from "./AuthModal";
import { AccordionCard, CheckboxList } from "./shared";
import { saveEntitySchema, type SaveBuildingsInput } from "./shared/schema";

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
			ids: token == null ? [] : userBuildings?.map((b) => b.id) ?? [],
		},
	});
	const {
		handleSubmit,
		formState: { isDirty },
		reset,
		watch,
	} = formMethods;

	const { mutate: saveBuildings, isPending } = useSaveBuildings();
	const [authOpen, setAuthOpen] = useState(false);

	const onSubmit = async (data: SaveBuildingsInput) => {
		if (!token) {
			setAuthOpen(true);
			return;
		}

		await saveBuildings(data);
		reset(data);
	};

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
									disabled={!isDirty}
									loading={isPending}
									type="submit"
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
