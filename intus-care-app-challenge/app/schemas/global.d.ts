import type { DiagnosisAPIRes, PptAPIRes } from "./schemas";

declare global {
    interface Participant extends PptAPIRes {
        id: number;
    }
    interface Diagnosis extends DiagnosisAPIRes {
        name?: string;
    }

}