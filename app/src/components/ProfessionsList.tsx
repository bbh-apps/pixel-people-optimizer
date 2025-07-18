import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, useMatches } from "@mantine/core";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../api/useAuth";
import useGetProfessions from "../api/useGetAllProfessions";
import useGetSavedProfessions from "../api/useGetSavedProfessions";
import useSaveProfessions from "../api/useSaveProfessions";
import AuthModal from "./AuthModal";
import { AccordionCard, CheckboxList } from "./shared";
import { saveEntitySchema, type SaveProfessionsInput } from "./shared/schema";

const ProfessionsList = () => {
	const { token } = useAuth();
	const width = useMatches({
		base: "100%",
		sm: "49%",
	});
	const { data: professions } = useGetProfessions();
	const { data: userProfessions } = useGetSavedProfessions();

	const formMethods = useForm<SaveProfessionsInput>({
		resolver: zodResolver(saveEntitySchema),
		defaultValues: {
			ids: [],
		},
		values: {
			ids: token == null ? [] : userProfessions?.map((b) => b.id) ?? [],
		},
	});
	const {
		handleSubmit,
		formState: { isDirty },
		reset,
		watch,
	} = formMethods;

	const { mutate: saveProfessions, isPending } = useSaveProfessions();
	const [authOpen, setAuthOpen] = useState(false);

	const onSubmit = async (data: SaveProfessionsInput) => {
		if (!token) {
			setAuthOpen(true);
			return;
		}

		await saveProfessions(data);
		reset(data);
	};

	return (
		<Flex w={width}>
			<AuthModal opened={authOpen} onClose={() => setAuthOpen(false)} />
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
					<AccordionCard
						title="My Discovered Professions"
						savedItemCount={(watch("ids") ?? userProfessions ?? []).length}
					>
						<Flex direction="column" gap="md" pt="xs">
							<CheckboxList items={professions} />
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

export default ProfessionsList;
