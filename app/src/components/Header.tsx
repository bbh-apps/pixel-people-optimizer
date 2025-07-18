import {
	ActionIcon,
	Button,
	Group,
	lighten,
	Title,
	useMantineColorScheme,
	useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { GithubLogoIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "../api/useAuth";
import { supabase } from "../lib/supabaseClient";
import AuthModal from "./AuthModal";
import SignOutModal from "./SignOutModal";

const Header = () => {
	const { token, clickedSignOut, setClickedSignOut } = useAuth();
	const queryClient = useQueryClient();
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const [isSignInModalOpen, signInModal] = useDisclosure();
	const [isSignOutModalOpen, signOutModal] = useDisclosure();

	const handleSignOut = async () => {
		setClickedSignOut(true);
		await supabase.auth.signOut().then(() => {
			signOutModal.open();
		});
	};

	const onClickAuth = async () => {
		if (token == null) {
			signInModal.open();
		} else {
			return await handleSignOut();
		}
	};

	useEffect(() => {
		if (clickedSignOut && token == null) {
			queryClient.invalidateQueries({ queryKey: ["buildings", "saved"] });
			queryClient.invalidateQueries({ queryKey: ["professions", "saved"] });
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	return (
		<>
			<Group h="100%" px="md" align="center" justify="space-between">
				<Title order={4}>Pixel People Optimizer</Title>
				<Group align="center" justify="center">
					<ActionIcon
						radius="xl"
						autoContrast
						styles={{
							root: {
								"--ai-bg": colorScheme === "light" ? "black" : "white",
								"--ai-hover":
									colorScheme === "light"
										? lighten(theme.colors.gray[9], 0.1)
										: lighten(theme.colors.gray[5], 0.1),
							},
						}}
					>
						<a
							href="https://github.com/bbh-apps/pixel-people-optimizer/"
							target="_blank"
						>
							<GithubLogoIcon
								size={20}
								color={colorScheme === "light" ? "white" : "black"}
								weight="fill"
							/>
						</a>
					</ActionIcon>

					<Button variant="filled" size="xs" onClick={onClickAuth}>
						Sign {token == null ? "in" : "out"}
					</Button>
				</Group>
			</Group>
			<AuthModal opened={isSignInModalOpen} onClose={signInModal.close} />
			<SignOutModal opened={isSignOutModalOpen} onClose={signOutModal.close} />
		</>
	);
};

export default Header;
