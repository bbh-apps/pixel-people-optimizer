import { Card, Stack, Text } from "@mantine/core";
import { useAuth } from "../../api/useAuth";

const NoRecommendations = () => {
	const { token } = useAuth();
	return (
		<Card withBorder>
			<Stack>
				<Text size="lg" ta="center" fw={500}>
					{token != null
						? "No possible combinations!"
						: "Sign up/in to view combinations."}
				</Text>
				{token != null && (
					<Text ta="center">Increase your land remaining to see more.</Text>
				)}
			</Stack>
		</Card>
	);
};

export default NoRecommendations;
