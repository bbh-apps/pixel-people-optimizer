import {
	ActionIcon,
	Anchor,
	Burger,
	Button,
	em,
	Group,
	Image,
	lighten,
	Title,
	useComputedColorScheme,
	useMantineTheme,
	type TitleOrder,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { GithubLogoIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../api/useAuth";
import { supabase } from "../lib/supabaseClient";
import AuthModal from "./AuthModal";
import SignOutModal from "./SignOutModal";

type HeaderProps = {
	isNavBarOpen: boolean;
	navBarToggle: () => void;
};

const Header: React.FC<HeaderProps> = ({ isNavBarOpen, navBarToggle }) => {
	const { token, clickedSignOut, setClickedSignOut } = useAuth();
	const queryClient = useQueryClient();
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const navigate = useNavigate();

	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
	const titleSize: TitleOrder = isMobile ? 5 : 4;
	const buttonSize = isMobile ? "compact-xs" : "xs";

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
				<Group gap="xs" align="center">
					<Image src="/Mayor.webp" h={32} w={32} />
					<Anchor
						onClick={() => navigate({ pathname: "/" })}
						c="var(--mantine-color-text)"
						underline="never"
					>
						<Title order={titleSize}>Pixel People Optimizer</Title>
					</Anchor>
				</Group>

				<Group hiddenFrom="sm">
					<Button variant="filled" size={buttonSize} onClick={onClickAuth}>
						Sign {token == null ? "in" : "out"}
					</Button>
					<Burger opened={isNavBarOpen} onClick={navBarToggle} size="sm" />
				</Group>

				<Group align="center" justify="center" gap="sm" visibleFrom="sm">
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

					<Button variant="filled" size={buttonSize} onClick={onClickAuth}>
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
