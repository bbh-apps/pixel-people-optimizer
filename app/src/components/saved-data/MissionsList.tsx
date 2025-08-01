import { useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useGetSavedMissions from "../../api/useGetSavedMissions";
import useSaveMissions from "../../api/useSaveMissions";
import { PublicDataContext } from "../../context/PublicDataContext";
import { CheckboxListFormSkeleton, GameDataForm } from "../shared";
import ErrorBoundaryAlert from "../shared/ErrorBoundaryAlert";
import MissionDetailContent from "./MissionDetailContent";

const MissionsList = () => {
	const { missions } = useContext(PublicDataContext);
	const { data: userMissions, isFetching } = useGetSavedMissions();
	const saveMissionsMutation = useSaveMissions();

	const userMissionsSet = new Set((userMissions ?? []).map((um) => um.id));
	const missionsData = (missions ?? []).map((m) => ({
		id: m.id,
		name: m.name,
		popoverContent: <MissionDetailContent mission={m} />,
		isUnlocked: userMissions && userMissionsSet.has(m.id),
	}));

	return isFetching ? (
		<CheckboxListFormSkeleton type="missions" />
	) : (
		<ErrorBoundary
			fallbackRender={({ error }) => (
				<ErrorBoundaryAlert message={error.message} />
			)}
		>
			<GameDataForm
				type="missions"
				gameData={missionsData ?? []}
				savedData={userMissions}
				defaultIds={[]}
				saveMutation={saveMissionsMutation}
			/>
		</ErrorBoundary>
	);
};

export default MissionsList;
