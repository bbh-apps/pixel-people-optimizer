import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Group, Menu, Text, useMatches } from "@mantine/core";
import { CheckIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../api/useAuth";
import useGetProfessions from "../api/useGetAllProfessions";
import useGetSavedProfessions from "../api/useGetSavedProfessions";
import useSaveProfessions from "../api/useSaveProfessions";
import AuthModal from "./AuthModal";
import { AccordionCard, CheckboxList } from "./shared";
import { saveEntitySchema, type SaveProfessionsInput } from "./shared/schema";

type SortType = "abc" | "gallery";

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
	const [sortedProfessions, setSortedProfessions] = useState(professions);
	const [sortType, setSortType] = useState<SortType>("abc");

	const onSubmit = async (data: SaveProfessionsInput) => {
		if (!token) {
			setAuthOpen(true);
			return;
		}

		await saveProfessions(data);
		reset(data);
	};

	const onClickSort = (newSortType: SortType) => {
		if (newSortType !== sortType) {
			if (newSortType === "abc") {
				setSortedProfessions(
					professions.sort((a, b) => a.name.localeCompare(b.name))
				);
			} else if (newSortType === "gallery") {
				setSortedProfessions(professions.sort((a, b) => a.id - b.id));
			}
			setSortType(newSortType);
		}
	};

	return (
		<Flex w={width}>
			<AuthModal opened={authOpen} onClose={() => setAuthOpen(false)} />
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
					<AccordionCard
						title="My Professions"
						savedItemCount={(watch("ids") ?? userProfessions ?? []).length}
					>
						<Flex direction="column" gap="md" pt="xs">
							<CheckboxList items={sortedProfessions} />
							<Group justify="space-between" px="md" pb="md" align="center">
								<Text size="xs">* Note: Special genes listed at the end</Text>
								<Group gap="xs">
									<Menu>
										<Menu.Target>
											<Button px="xs">Sort order</Button>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												leftSection={
													sortType === "gallery" ? (
														<CheckIcon color="var(--mantine-color-text)" />
													) : null
												}
												onClick={() => onClickSort("gallery")}
											>
												Gallery order
											</Menu.Item>
											<Menu.Item
												leftSection={
													sortType === "abc" ? (
														<CheckIcon color="var(--mantine-color-text)" />
													) : null
												}
												onClick={() => onClickSort("abc")}
											>
												ABC order
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
									<Button
										variant="filled"
										disabled={!isDirty}
										loading={isPending}
										type="submit"
									>
										Save
									</Button>
								</Group>
							</Group>
						</Flex>
					</AccordionCard>
				</form>
			</FormProvider>
		</Flex>
	);
};

export default ProfessionsList;
