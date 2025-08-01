import {
	ActionIcon,
	Button,
	Divider,
	lighten,
	Stack,
	Text,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import {
	GithubLogoIcon,
	GraphIcon,
	MagicWandIcon,
	QuestionIcon,
} from "@phosphor-icons/react";
import type React from "react";
import { useLocation, useNavigate } from "react-router";

type NavBarProps = {
	toggle: () => void;
};

const NavBar: React.FC<NavBarProps> = ({ toggle }) => {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const navigate = useNavigate();
	const location = useLocation();

	const isOptimizer = location.pathname === "/";
	const isVisualizer = location.pathname === "/visualizer";
	const isFaq = location.pathname === "/faq";

	const unselectedStyle = {
		root: {
			color: "var(--mantine-color-text)",
		},
	};

	const onClick = (path: string) => {
		toggle();
		navigate({ pathname: path });
	};

	return (
		<Stack>
			<Text size="sm">
				Welcome! I made this free open-source tool to make splicing easier in
				one of my favorite games.
			</Text>
			<Divider />
			<Stack gap="xs">
				<Button
					variant={isOptimizer ? "light" : "subtle"}
					leftSection={<MagicWandIcon />}
					justify="start"
					onClick={() => onClick("/")}
					styles={isOptimizer ? {} : unselectedStyle}
				>
					Optimizer
				</Button>

				<Button
					variant={isVisualizer ? "light" : "subtle"}
					leftSection={<GraphIcon />}
					justify="start"
					onClick={() => onClick("/visualizer")}
					styles={isVisualizer ? {} : unselectedStyle}
				>
					Visualizer
				</Button>

				<Button
					variant={isFaq ? "light" : "subtle"}
					leftSection={<QuestionIcon />}
					justify="start"
					onClick={() => onClick("/faq")}
					styles={isFaq ? {} : unselectedStyle}
				>
					FAQ
				</Button>
			</Stack>

			<Divider hiddenFrom="sm" />
			<ActionIcon
				radius="xl"
				autoContrast
				hiddenFrom="sm"
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
		</Stack>
	);
};

export default NavBar;
