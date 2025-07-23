/* tslint:disable */
/**
/* This file was automatically generated from pydantic models by running pydantic2ts.
/* Do not modify it by hand - just update the pydantic models and then re-run the script
*/

export interface BaseEntityRes {
	id: number;
	name: string;
}
export interface BuildingListRes {
	id: number;
	name: string;
}
export interface IDList {
	ids: number[];
}
export interface MissionListRes {
	id: number;
	name: string;
}
export interface OTPReq {
	email: string;
}
export interface ProfessionListRes {
	id: number;
	name: string;
	category: string;
}
export interface ProfessionListWithMissionRes {
	id: number;
	name: string;
	category: string;
	mission: MissionListRes | null;
	formula: ProfessionListRes[] | null;
}
export interface RecommendationRes {
	profession: ProfessionListRes;
	parent1: ProfessionListRes | null;
	parent2: ProfessionListRes | null;
	unlock_bldg: UnlockBuildingRes | null;
	unlock_professions: ProfessionListRes[];
	extra_land_needed: number;
	max_cps: number;
}
export interface UnlockBuildingRes {
	id: number;
	name: string;
	professions: ProfessionListRes[];
}
export interface SavedProfessionListRes {
	id: number;
	name: string;
	category: string;
	mission: MissionListRes | null;
}
export interface VerifiedUserRes {
	email: string;
	is_new_account: boolean;
}
