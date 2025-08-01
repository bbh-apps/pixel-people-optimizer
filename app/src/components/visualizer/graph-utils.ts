import { MarkerType, type Edge, type Node } from "@xyflow/react";
import dagre from "dagre";

const nodeWidth = 160;
const nodeHeight = 60;

export function getLayoutedElements(
	nodes: Node[],
	edges: Edge[],
	viewportWidth: number
) {
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));

	dagreGraph.setGraph({
		rankdir: "TB",
		ranksep: 60,
		nodesep: 20,
		edgesep: 10,
		width: viewportWidth,
		height: 800,
	});

	nodes.forEach((node) => {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
	});

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	const layoutedNodes = nodes.map((node) => {
		const { x, y } = dagreGraph.node(node.id);
		return {
			...node,
			position: { x, y },
		};
	});

	return { nodes: layoutedNodes, edges };
}

export function getEdgesFromPaths(paths: number[][]): Edge[] {
	const seen = new Set<string>();
	const edges: Edge[] = [];

	for (const path of paths) {
		for (let i = 0; i < path.length - 1; i++) {
			const source = path[i].toString();
			const target = path[i + 1].toString();
			const id = `${source}-${target}`;

			if (!seen.has(id)) {
				seen.add(id);
				edges.push({
					id,
					source,
					target,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						color: "#228be6",
					},
				});
			}
		}
	}

	return edges;
}
