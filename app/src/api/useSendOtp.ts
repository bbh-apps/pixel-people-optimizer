import { useMutation } from "@tanstack/react-query";
import type { OTPReq } from "../types/models";

const useSendOtp = () => {
	return useMutation({
		mutationKey: ["auth", "sign_in"],
		mutationFn: async (data: OTPReq) =>
			fetch("/auth/otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}).then((res) => {
				if (!res.ok) throw new Error("Failed to send OTP");
				return res.json();
			}),
	});
};

export default useSendOtp;
