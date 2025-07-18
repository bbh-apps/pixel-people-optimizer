import { useMutation } from "@tanstack/react-query";
import type { AuthenticatedReq } from "./useAuth";

const useVerifyUser = () => {
	// const queryClient = useQueryClient();
	return useMutation({
		mutationKey: ["auth", "me"],
		mutationFn: async (data: AuthenticatedReq) =>
			fetchClient("/auth/me", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: data.token ? `Bearer ${data.token}` : "",
				},
				body: JSON.stringify(data),
			}).then((res) => {
				if (!res.ok) throw new Error("Failed to save");
				return res.json();
			}),
	});
};

export default useVerifyUser;
