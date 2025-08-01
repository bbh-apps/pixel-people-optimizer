import { useComputedColorScheme } from "@mantine/core";
import { Controls, MarkerType, ReactFlow, type Node } from "@xyflow/react";
import { uniq } from "lodash";
import React, { useCallback, useContext, useMemo, useState } from "react";
import useGetPathsByProfession from "../../api/useGetPathsByProfession";
import { PublicDataContext } from "../../context/PublicDataContext";
import type { BaseEntityRes } from "../../types/models";
import { getEdgesFromPaths, getLayoutedElements } from "./graph-utils";
import GraphNode from "./GraphNode";

import "@xyflow/react/dist/style.css";
import "./index.css";

type VisualizerProps = {
	value: BaseEntityRes | null;
	width: number;
};

const nodeTypes = {
	textUpdater: GraphNode,
};

const Visualizer: React.FC<VisualizerProps> = ({ value, width }) => {
	const colorScheme = useComputedColorScheme();
	const { professions } = useContext(PublicDataContext);
	const { data: pathsData } = useGetPathsByProfession({ id: value?.id });

	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const handleNodeClick = useCallback((_: unknown, node: Node) => {
		setSelectedNodeId(node.id);
	}, []);

	const idToProfessionsMap = useMemo(() => {
		if (!professions) return new Map();
		const map = new Map();
		professions?.forEach((p) => map.set(p.id, p));
		return map;
	}, [professions]);

	const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
		if (!pathsData || !professions) return { nodes: [], edges: [] };

		const flatProfessions = pathsData.paths.flat();
		const uniqueProfessions = uniq(flatProfessions);

		const nodes = uniqueProfessions.map((p) => ({
			id: p.toString(),
			type: "textUpdater",
			data: {
				name: idToProfessionsMap.get(p)?.name ?? p.toString(),
				category: idToProfessionsMap.get(p)?.category ?? "n/a",
			},
			position: { x: 0, y: 0 },
		}));

		const edges = getEdgesFromPaths(pathsData.paths);

		return getLayoutedElements(nodes, edges, width - 100);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathsData, idToProfessionsMap]);

	const styledEdges = useMemo(() => {
		return layoutedEdges.map((edge) => {
			const isIncomingToSelected =
				selectedNodeId && edge.target === selectedNodeId;

			return {
				...edge,
				animated: isIncomingToSelected ? true : undefined,
				style: {
					stroke: isIncomingToSelected ? "#f03e3e" : "#228be6",
					strokeWidth: isIncomingToSelected ? 4 : 2,
				},
				markerEnd: {
					type: MarkerType.ArrowClosed,
					color: isIncomingToSelected ? "#f03e3e" : "#228be6",
				},
			};
		});
	}, [layoutedEdges, selectedNodeId]);

	return (
		<ReactFlow
			width={width}
			nodes={layoutedNodes}
			edges={styledEdges}
			nodeTypes={nodeTypes}
			fitView
			attributionPosition="bottom-left"
			minZoom={0.2}
			colorMode={colorScheme}
			onNodeClick={handleNodeClick}
		>
			<Controls showInteractive={false} position="bottom-right" />
		</ReactFlow>
	);
};

export default Visualizer;
