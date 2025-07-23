import {
	Group,
	Text,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import { CopyrightIcon } from "@phosphor-icons/react";

const Footer = () => {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");

	return (
		<Group
			py="lg"
			styles={{
				root: {
					borderTopWidth: "1px",
					borderTopStyle: "solid",
					borderTopColor:
						colorScheme === "light"
							? theme.colors.gray[3]
							: theme.colors.dark[4],
				},
			}}
		>
			<Group gap={4} px="md" align="center">
				<CopyrightIcon size={16} />
				<Text>2025 BBH Apps.</Text>
			</Group>
		</Group>
	);
};

export default Footer;
