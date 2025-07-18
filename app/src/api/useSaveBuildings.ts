import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveBuildingsInput } from "../components/shared/schema";
import { useAuth } from "./useAuth";

const useSaveBuildings = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	return useMutation({
		mutationKey: ["buildings", "save"],
		mutationFn: async (data: SaveBuildingsInput) => {
			fetch("/api/buildings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify(data),
			}).then((res) => {
				if (!res.ok) throw new Error("Failed to save");
				return res.json();
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["buildings", "saved"] });
		},
	});
};

export default useSaveBuildings;
