import { Anchor, List, Stack, Text } from "@mantine/core";

export const TOOL_USAGE_FAQ = [
	{
		title: "How do I use this tool?",
		value: "how-to-use-tool",
		description: (
			<List
				type="ordered"
				styles={{ root: { "--list-spacing": "0.5rem" } }}
				pr="md"
			>
				<List.Item>
					By default, the professions and buildings that you start the game with
					will be pre-selected if you do not have an account or are not signed
					in. Clicking "Save" will prompt you to sign up/in.
				</List.Item>
				<List.Item>
					You can also start by saving buildings, professions, and missions you
					have already unlocked. If this is your first time, it will prompt you
					to create an account to save your game data.
				</List.Item>
				<List.Item>
					After signing in, click the "Optimize" button to see which new
					professions you can splice given the remaining land you have.
				</List.Item>
			</List>
		),
	},
	{
		title:
			"Adding everything for the first time is a pain. What's the easiest way to do it?",
		value: "onboarding",
		description: (
			<Stack>
				<Text>
					For professions, I recommend sorting by gallery order. Then, open up
					the gallery in your game. As you flip through the gallery, you can
					check it off the list.
				</Text>
				<Text>
					Unfortunately, for buildings, I don't think there's an easy list to
					reference unless you have been tracking things with a spreadsheet.
					I've added a search bar that should help speed things along.
				</Text>
			</Stack>
		),
	},
	{
		title: "How do you come up with the splicing recommendations?",
		value: "recommendation-logic",
		description: (
			<Stack>
				<Text>
					First, I take into account the professions you have unlocked (make
					sure you have checked off any special genes you have too). Both genes
					needed for the formula must be unlocked.
				</Text>
				<Text>
					Then, I check if the profession requires a mission to unlock it. If
					so, I check whether you have completed the mission or not.
				</Text>
				<Text>
					Lastly, I take a look at how much land you have left and whether you
					have already unlocked the building that the profession unlocks. If you
					have the building already, then there is no land cost. If the building
					land cost is higher than the remaining land you have, then we will not
					recommend this profession.
				</Text>
			</Stack>
		),
	},
	{
		title: "How do I request more features?",
		value: "feature-request",
		description: (
			<Text>
				Email me at{" "}
				<Anchor href="mailto:hello@bbhapps.com" target="_blank">
					hello@bbhapps.com
				</Anchor>{" "}
				and I will consider it. If you have the ability to do so, an even better
				thing to do is to contribute to the repo on Github! This is an
				open-source project.
			</Text>
		),
	},
	{
		title: "Who do I contact if there is a bug?",
		value: "bug-reports",
		description: (
			<Text>
				Email me at{" "}
				<Anchor href="mailto:hello@bbhapps.com" target="_blank">
					hello@bbhapps.com
				</Anchor>{" "}
				. I'll investigate promptly and help you out.
			</Text>
		),
	},
];

export const ACCOUNTS_FAQ = [
	{
		title: "Do I have to create an account to use this tool?",
		value: "create-account",
		description: (
			<Text>
				Yes, you do. The purpose of this tool is to help you decide which
				professions to unlock, so you will need to save your game data for this
				to work most effectively.
			</Text>
		),
	},
	{
		title: "What information do you save about users or accounts?",
		value: "what-info-saved-accounts",
		description: (
			<Text>
				I only save your email address. I use a secure third-party
				authentication provider for managing user accounts (Supabase). Since I
				simply email 6-digit verification codes for sign in, I do not save
				passwords.
			</Text>
		),
	},
	{
		title: "Do you sell any of our data?",
		value: "sell-data",
		description: <Text>No, I don't! That goes against my moral code.</Text>,
	},
	{
		title: "How do I delete my account?",
		value: "delete-account",
		description: (
			<Text>
				Email me at{" "}
				<Anchor href="mailto:hello@bbhapps.com" target="_blank">
					hello@bbhapps.com
				</Anchor>{" "}
				and I will send an email confirmation within 24 hours that your acconut
				has been deleted.
			</Text>
		),
	},
];
