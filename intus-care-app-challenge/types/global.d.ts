declare interface Participant {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: number;
    patientNotes: string;
    diagnoses: Diagnosis[];
}

declare interface Diagnosis {
    icdCode: string;
    timestamp: string;
}