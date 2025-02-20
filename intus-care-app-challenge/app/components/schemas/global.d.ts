import type { DiagnosisAPIRes, PptAPIRes } from "./schemas";

declare global {
    interface Participant extends PptAPIRes {
        id: number;
        diagnosesCached: boolean;
    }
    interface Diagnosis extends DiagnosisAPIRes {
        name?: string;
    }

}