import { Alert, Anchor, Stack, Text } from "@mantine/core";
import { WarningIcon } from "@phosphor-icons/react";

type ErrorBoundaryAlertProps = {
	message: string;
};

const ErrorBoundaryAlert: React.FC<ErrorBoundaryAlertProps> = ({ message }) => {
	return (
		<Alert
			variant="light"
			color="red"
			title="Something went wrong"
			icon={<WarningIcon />}
			m="sm"
		>
			<Stack>
				<Text size="sm">{message}</Text>
				<Text size="sm">
					Contact{" "}
					<Anchor href="mailto:hello@bbhapps.com" target="_blank">
						hello@bbhapps.com
					</Anchor>{" "}
					to report this bug. Please include a screenshot and any details for
					reproducing this issue.
				</Text>
			</Stack>
		</Alert>
	);
};

export default ErrorBoundaryAlert;
