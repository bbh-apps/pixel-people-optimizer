import { Modal, Text } from "@mantine/core";

const SignOutModal = ({
	opened,
	onClose,
}: {
	opened: boolean;
	onClose: () => void;
}) => {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title="You've successfully signed out!"
		>
			<Text>
				All of your information is securely saved. Come back when you're ready
				to splice again!
			</Text>
		</Modal>
	);
};

export default SignOutModal;
