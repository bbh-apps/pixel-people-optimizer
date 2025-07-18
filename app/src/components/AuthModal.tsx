import { Button, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import useVerifyUser from "../api/useVerifyUser";
import { supabase } from "../lib/supabaseClient";

const AuthModal = ({
	opened,
	onClose,
}: {
	opened: boolean;
	onClose: () => void;
}) => {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [step, setStep] = useState<"email" | "token">("email");
	const { mutate: verifyUser, isPending } = useVerifyUser();

	const handleSendOtp = async () => {
		await supabase.auth.signInWithOtp({ email });
		setStep("token");
	};

	const handleVerify = async () => {
		const result = await supabase.auth.verifyOtp({
			email,
			token: code,
			type: "email",
		});
		if (result.data?.session?.access_token) {
			verifyUser(
				{ token: result.data?.session?.access_token },
				{
					onSuccess: () => {
						onClose();
					},
					onError: (err) => {
						console.error(err);
					},
				}
			);
		}
	};

	return (
		<Modal opened={opened} onClose={onClose} title="Sign in to save">
			{step === "email" ? (
				<>
					<TextInput
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
						label="Email"
					/>
					<Button mt="md" onClick={handleSendOtp}>
						Send OTP
					</Button>
				</>
			) : (
				<>
					<TextInput
						value={code}
						onChange={(e) => setCode(e.currentTarget.value)}
						label="Enter code"
					/>
					<Button mt="md" onClick={handleVerify} loading={isPending}>
						Verify
					</Button>
				</>
			)}
		</Modal>
	);
};

export default AuthModal;
