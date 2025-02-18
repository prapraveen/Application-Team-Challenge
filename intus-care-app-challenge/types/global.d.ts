declare interface Participant {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: number;
    patientNotes: string;
    diagnoses: Diagnosis[];
    id: number;
}

declare interface Diagnosis {
    icdCode: string;
    timestamp: string;
    name?: string;
}