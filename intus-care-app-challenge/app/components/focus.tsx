import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button"
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import FocusListItem from "./focus-list-item";
import FocusListItemSkeleton from "./focus-list-item-skeleton";
import { ICDCodeAPIResponeSchema } from "./schemas/schemas";


type focusViewProps = {
    ppt: Participant;
    setPptSelected: React.Dispatch<React.SetStateAction<Participant|null>>;
    pptListData: Participant[]|null;
}

const BackButton = styled(Button)({
    textTransform: "none",
    backgroundColor: "var(--primary-IntusBlue)"
})

const FocusView = ({ ppt, setPptSelected, pptListData }: focusViewProps) => {
    const [loading, setLoading] = useState(true);
    const [showPptInfo, setShowPptInfo] = useState(false);
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

    const fetchDiagnosisName = async (diagnosis: Diagnosis) => {
        const icdCode = diagnosis.icdCode;
        const cachedData = localStorage.getItem(icdCode);
        if (cachedData) {
            console.log("cached");
            const parsedData = JSON.parse(cachedData);
            if (Date.now() <= parseInt(parsedData["expiration"], 10)) {
                const diagnosisName = parsedData["name"];
                const updatedDiagnosis = Object.assign({}, diagnosis, {name: diagnosisName})
                return updatedDiagnosis;
            }
        }
        
        console.log("fetching");

        const url = `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=${icdCode}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            ICDCodeAPIResponeSchema.parse([ ...data, undefined]);

            const displayStrings = data[3]; // index of display string
            let diagnosisName;
            if (displayStrings && displayStrings.length > 0) {
                diagnosisName = displayStrings[0][1]; // index of first item found, then diagnosis name
            }
            else {
                diagnosisName = null;
            }
            const expiryMinutes = 30;
                const expiryTimestamp = Date.now() + expiryMinutes * 60 * 1000; // 30 minutes
                const cachedData = {name: diagnosisName, expiration: expiryTimestamp};
                localStorage.setItem(icdCode, JSON.stringify(cachedData));
                const updatedDiagnosis = Object.assign({}, diagnosis, {name: diagnosisName})
                return updatedDiagnosis;
        }
        catch (error) {
            throw Error(`Error fetching data for ICD code ${diagnosis.icdCode}: ${error}`);
        }
    }

    const fetchDiagnosesNames = async (ppt: Participant) => {
        try {
            const diagnosesWithNamesPromises = ppt.diagnoses.map(
                (diagnosis: Diagnosis) => fetchDiagnosisName(diagnosis)
            );
            const diagnosesWithNames = await Promise.all(diagnosesWithNamesPromises);
            const updatedFields = {diagnoses: diagnosesWithNames, diagnosesCached: true};
            // const updatedPpt = Object.assign({}, ppt, updatedFields);
            // setPptSelected(updatedPpt);
            setDiagnoses(diagnosesWithNames);

            // get ppt index in the list
            /*
            let pptIdx = -1;
            for (let i = 0; i < pptListData!.length; i++) {
                if (pptListData![i].id == ppt.id) {
                    pptIdx = i;
                    break;
                }
            }
            // cache the results in pptListData
            let updatedPptListData = pptListData!.slice();
            updatedPptListData[pptIdx] = updatedPpt;
            setPptListData(updatedPptListData);
            */
        } catch (error) {
            throw Error(`Error fetching data for one or more ICD codes: ${error}`);
        }
    }

    useEffect(() => {
        setLoading(true);
        const getDiagnosesData = async () => {
            await fetchDiagnosesNames(ppt);
            setLoading(false)
        }
        try {
            getDiagnosesData();
        } catch {
            setLoading(true);
        }
        console.log(diagnoses);
    }, [ppt])
    
    
    const unselectPpt = () => {
        setPptSelected(null);
    }

    const displayPptInfo = () => {
        setShowPptInfo(!showPptInfo);
    }

    const pptInfo = (
        <div id="ppt-info" className="grayscale-black mb-4">
            <p>Date of Birth: {ppt.dateOfBirth}</p>
            <p>Gender: {ppt.gender}</p>
            <p>Phone Number: {ppt.phoneNumber}</p>
            <p>Notes: {(ppt.patientNotes) ? ppt.patientNotes : "N/A"}</p>
        </div>
    )

    return <>
        <div className="m-12 absolute">
            <BackButton onClick={unselectPpt} variant="contained">
                <h3 className="mx-3">{"< Back"}</h3>
            </BackButton>
        </div>
        <div 
            className="card bg-white mx-72 mt-12 px-8 hide-scrollbar"
            style={{maxHeight: "75vh", overflow: "scroll"}}
        >
            <div className="name flex flex-row">
                <h2 className="pt-8 pb-4 grayscale-body">
                    {`${ppt.firstName} ${ppt.lastName}`}
                </h2>
                <button onClick={displayPptInfo} className="mt-4">
                    {(showPptInfo) ? (
                        <KeyboardArrowDown sx={{fontSize: "3rem"}} />
                    ) : (
                        <KeyboardArrowRight sx={{fontSize: "3rem"}} />
                    )}
                </button>
            </div>
            {showPptInfo && pptInfo}
            <hr className="mb-4 grayscale-labels" />
            <p className="grayscale-labels mb-4">{`ICD Codes (${ppt.diagnoses.length})`}</p>
            <ul>
                {(!loading) ? (
                    diagnoses.map((diagnosis: Diagnosis, idx: number) => (
                        <li className="pb-6 mx-5" key={idx}>
                            <FocusListItem diagnosis={diagnosis} />
                        </li>))
                    ) : (
                    Array(10).fill(<FocusListItemSkeleton />).map((item, idx) => (
                        <li className="pb-6 mx-5" key={idx}>{item}</li>
                    ))
                )}
            </ul>
        </div>
    </>
}

export default FocusView