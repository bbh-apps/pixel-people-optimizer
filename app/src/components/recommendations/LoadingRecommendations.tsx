import { em, Flex, Title, useComputedColorScheme } from "@mantine/core";
import { createStyles, keyframes } from "@mantine/emotion";
import { useMediaQuery } from "@mantine/hooks";

const wave = keyframes({
	"0%, 60%, 100%": { transform: "translateY(0)" },
	"30%": { transform: "translateY(-10px)" },
});

const useStyles = createStyles(() => ({
	container: {
		display: "inline-block",
		animation: `${wave} 2.5s ease-in-out infinite`,
	},
}));

const LoadingRecommendations = () => {
	const { classes } = useStyles();
	const colorScheme = useComputedColorScheme("light");
	const parentColor = colorScheme === "light" ? "blue.0" : "dark.5";

	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
	const text = "Figuring out what to splice...";

	return (
		<Flex
			bg={parentColor}
			p="md"
			h={{
				base: "200px",
				sm: "580px",
			}}
			align="center"
			justify="center"
			opacity={0.5}
		>
			<Title display="inline-block" order={isMobile ? 6 : 1}>
				{text.split("").map((char, i) =>
					char === " " ? (
						" "
					) : (
						<span
							key={i}
							className={classes.container}
							style={{ animationDelay: `${i * 0.08}s` }}
						>
							{char}
						</span>
					)
				)}
			</Title>
		</Flex>
	);
};

export default LoadingRecommendations;
