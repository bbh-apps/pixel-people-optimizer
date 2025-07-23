import {
	ActionIcon,
	Group,
	NumberInput as MNumberInput,
	Stack,
	type NumberInputProps as MNumberInputProps,
	type NumberInputHandlers,
} from "@mantine/core";
import { MinusCircleIcon, PlusCircleIcon } from "@phosphor-icons/react";
import React, { useRef } from "react";

type NumberInputProps = MNumberInputProps & {
	value: number;
	onChange: (v: number) => void;
};

const NumberInput: React.FC<NumberInputProps> = (props) => {
	const handlersRef = useRef<NumberInputHandlers>(null);
	const { styles, ...rest } = props;
	const buttonStyles = {
		root: {
			borderWidth: "2px",
		},
	};

	return (
		<Group gap="xs">
			<ActionIcon
				variant="transparent"
				styles={buttonStyles}
				onClick={() => handlersRef.current?.decrement()}
				disabled={props.disabled || props.value === 0}
				p={0}
				visibleFrom="sm"
			>
				<MinusCircleIcon weight="bold" size={36} />
			</ActionIcon>
			<MNumberInput
				{...rest}
				min={0}
				step={1}
				handlersRef={handlersRef}
				styles={{
					controls: { display: "none" },
					input: { textAlign: "center", padding: "var(--mantine-spacing-sm)" },
					root: { width: "80px" },
					wrapper: { width: "80px" },
					...styles,
				}}
			/>
			<ActionIcon
				variant="transparent"
				styles={buttonStyles}
				onClick={() => handlersRef.current?.increment()}
				disabled={props.disabled}
				p={0}
				visibleFrom="sm"
			>
				<PlusCircleIcon weight="bold" size={36} />
			</ActionIcon>
			<Stack gap={2}>
				<ActionIcon
					variant="transparent"
					styles={buttonStyles}
					onClick={() => handlersRef.current?.increment()}
					disabled={props.disabled}
					p={0}
					hiddenFrom="sm"
				>
					<PlusCircleIcon weight="bold" size={20} />
				</ActionIcon>
				<ActionIcon
					variant="transparent"
					styles={buttonStyles}
					onClick={() => handlersRef.current?.decrement()}
					disabled={props.disabled || props.value === 0}
					p={0}
					hiddenFrom="sm"
				>
					<MinusCircleIcon weight="bold" size={20} />
				</ActionIcon>
			</Stack>
		</Group>
	);
};

export default NumberInput;
