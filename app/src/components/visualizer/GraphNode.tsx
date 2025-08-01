import { Paper, Text } from "@mantine/core";
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { categoryColorsMap } from "../../lib/categoryColors";

type GraphNodeProps = Node<{
	name: string;
	category: string;
}>;

const GraphNode: React.FC<NodeProps<GraphNodeProps>> = ({ data }) => {
	const { bgColor, textColor } =
		categoryColorsMap[data.category as keyof typeof categoryColorsMap];
	return (
		<div>
			<Handle type="target" position={Position.Top} />
			<Paper withBorder px="md" py="xs" ta="center" bg={bgColor} w="160px">
				<Text c={textColor} fw={700}>
					{data.name}
				</Text>
				<Text size="xs" c={textColor}>
					{data.category}
				</Text>
			</Paper>
			<Handle type="source" position={Position.Bottom} />
		</div>
	);
};

export default GraphNode;
