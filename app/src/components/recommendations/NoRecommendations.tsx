import { Card, Text } from "@mantine/core";
import { useAuth } from "../../api/useAuth";

const NoRecommendations = () => {
	const { token } = useAuth();
	return (
		<Card withBorder>
			<Text size="lg" ta="center" fw={500} pb="xs">
				No possible combinations!
			</Text>
			<Text ta="center">
				Increase your land remaining{" "}
				{token != null
					? "to see more."
					: "or sign up/in to save more buildings and professions."}
			</Text>
		</Card>
	);
};

export default NoRecommendations;
