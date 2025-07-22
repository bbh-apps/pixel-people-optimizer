import { useState } from "react";
import useGetProfessions, { type SortType } from "../api/useGetAllProfessions";
import useGetSavedProfessions from "../api/useGetSavedProfessions";
import useSaveProfessions from "../api/useSaveProfessions";
import { GameDataForm } from "./shared";

const DEFAULT_START_PROF_IDS = [1, 2];

const ProfessionsList = () => {
	const [sortType, setSortType] = useState<SortType>("gallery");
	const { data: professions } = useGetProfessions(sortType);
	const { data: userProfessions } = useGetSavedProfessions();
	const saveProfessionsMutation = useSaveProfessions();

	return (
		<GameDataForm
			type="professions"
			gameData={professions}
			savedData={userProfessions}
			defaultIds={DEFAULT_START_PROF_IDS}
			saveMutation={saveProfessionsMutation}
			hasSort={true}
			sortType={sortType}
			setSortType={setSortType}
		/>
		// <Flex w={width}>
		// 	<AuthModal opened={authOpen} onClose={() => setAuthOpen(false)} />
		// 	<FormProvider {...formMethods}>
		// 		<form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
		// 			<AccordionCard
		// 				title="My Professions"
		// 				savedItemCount={(watch("ids") ?? userProfessions ?? []).length}
		// 			>
		// 				<TextInput
		// 					placeholder="Search for a profession"
		// 					value={professionsSearch}
		// 					onChange={(e) => setProfessionsSearch(e.target.value)}
		// 					px="md"
		// 				/>
		// 				<Flex direction="column" gap="md" pt="xs">
		// 					<CheckboxList items={filteredProfessions} />
		// 					<Text size="xs" hiddenFrom="sm" px="md">
		// 						* Note: Special genes listed at the end
		// 					</Text>
		// 					<Group justify={justify} px="md" pb="md" align="center">
		// 						<Flex flex={1}>
		// 							<Text size="xs" visibleFrom="sm">
		// 								Note: Special genes listed at the end
		// 							</Text>
		// 						</Flex>
		// 						<Group gap="xs">
		// 							<Menu>
		// 								<Menu.Target>
		// 									<Button px="xs">Sort order</Button>
		// 								</Menu.Target>
		// 								<Menu.Dropdown>
		// 									<Menu.Item
		// 										leftSection={
		// 											sortType === "gallery" ? (
		// 												<CheckIcon color="var(--mantine-color-text)" />
		// 											) : null
		// 										}
		// 										onClick={() => onClickSort("gallery")}
		// 									>
		// 										Gallery order
		// 									</Menu.Item>
		// 									<Menu.Item
		// 										leftSection={
		// 											sortType === "abc" ? (
		// 												<CheckIcon color="var(--mantine-color-text)" />
		// 											) : null
		// 										}
		// 										onClick={() => onClickSort("abc")}
		// 									>
		// 										ABC order
		// 									</Menu.Item>
		// 								</Menu.Dropdown>
		// 							</Menu>
		// 							<Button
		// 								variant="filled"
		// 								disabled={!!token && !isDirty}
		// 								loading={isPending}
		// 								onClick={async () => {
		// 									if (!token) {
		// 										await triggerSaveAll();
		// 										setAuthOpen(true);
		// 									} else {
		// 										await handleSubmit(onSubmit)();
		// 									}
		// 								}}
		// 							>
		// 								Save
		// 							</Button>
		// 						</Group>
		// 					</Group>
		// 				</Flex>
		// 			</AccordionCard>
		// 		</form>
		// 	</FormProvider>
		// </Flex>
	);
};

export default ProfessionsList;
