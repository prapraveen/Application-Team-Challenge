import { z } from "zod";

export const diagnosisAPIResSchema = z.object({
    icdCode: z.string(),
    timestamp: z.string()
})

export const pptAPIResSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    dateOfBirth: z.string(),
    gender: z.string(),
    phoneNumber: z.number(),
    patientNotes: z.string().nullable(),
    diagnoses: z.array(diagnosisAPIResSchema)
})

export const pptArrayAPIResSchema = z.array(pptAPIResSchema);
  
export const ICDCodeAPIResponeSchema = z.tuple([
    z.number(),
    z.array(z.string()),
    z.any().nullable(),
    z.array(z.tuple([
        z.string(),
        z.string()
    ])),
    z.array(z.string()).optional()
]);


export type DiagnosisAPIRes = z.infer<typeof diagnosisAPIResSchema>
export type PptAPIRes = z.infer<typeof pptAPIResSchema>
export type ICDCodeAPIRes = z.infer<typeof ICDCodeAPIResponeSchema>
