import { useState, useEffect } from "react";
import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles";
import FocusListItem from "./focus-list-item";
import FocusListItemSkeleton from "./focus-list-item-skeleton";

type focusViewProps = {
    ppt: Participant;
    setPptSelected: React.Dispatch<React.SetStateAction<Participant|null>>;
    pptSelectedIdx: number|null;
    setPptSelectedIdx: React.Dispatch<React.SetStateAction<number|null>>;
    pptListData: Participant[]|null;
    setPptListData: React.Dispatch<React.SetStateAction<Participant[]|null>>;
}

const BackButton = styled(Button)({
    textTransform: "none",
    backgroundColor: "var(--primary-IntusBlue)"
})

const FocusView = ({ ppt, setPptSelected, pptSelectedIdx, setPptSelectedIdx, pptListData, setPptListData}: focusViewProps) => {
    const [loading, setLoading] = useState(true);

    const fetchDiagnosisName = async (diagnosis: Diagnosis) => {
        const url = `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=${diagnosis.icdCode}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const displayStrings = data[3]; // index of display string
            if (displayStrings && displayStrings.length > 0) {
                const diagnosisName = displayStrings[0][1]; // index of first item found, then diagnosis name
                let diagnosisWithName = { ... diagnosis };
                diagnosisWithName["name"] = diagnosisName;
                return diagnosisWithName; 
            }
            else {
                return diagnosis;
            }
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
            const updatedPpt = Object.assign({}, ppt, {diagnoses: diagnosesWithNames, diagnosesCached: true});
            setPptSelected(updatedPpt);
    
            // cache the results in pptListData
            let updatedPptListData = pptListData!.slice();
            updatedPptListData[pptSelectedIdx!] = updatedPpt;
            setPptListData(updatedPptListData);
        }
        catch (error) {
            throw Error("Could not fetch data for one or more ICD codes.");
        }
        

    }

    useEffect(() => {
        const getDiagnosesData = async () => {
            if (ppt.diagnosesCached == false) {
                await fetchDiagnosesNames(ppt);
            }
            setLoading(false)
        }
        try {
            getDiagnosesData();
        }
        catch {
            setLoading(true);
        }
    }, [])
    
    
    const unselectPpt = () => {
        setPptSelected(null);
        setPptSelectedIdx(null);
    }

    return <>
        <div className="m-12 absolute">
            <BackButton onClick={unselectPpt} variant="contained">
                <h3 className="mx-3">{"< Back"}</h3>
            </BackButton>
        </div>
        <div className="card bg-white mx-72 mt-12 px-8 hide-scrollbar" style={{maxHeight: '75vh', overflow: 'scroll'}}>
            <h2 className="pt-8 pb-4 grayscale-body">
                {`${ppt.firstName} ${ppt.lastName}`}
            </h2>
            <hr className="mb-4 grayscale-labels" />
            <p className="grayscale-labels mb-4">{`ICD Codes (${ppt.diagnoses.length})`}</p>
            <ul>
                {(!loading) ? 
                    ppt.diagnoses.map((diagnosis: Diagnosis, idx: number) => (
                        <li className="pb-6 mx-5" key={idx}>
                            <FocusListItem diagnosis={diagnosis} />
                        </li>))
                    :
                    Array(10).fill(<FocusListItemSkeleton />).map((item, idx) => (
                        <li className="pb-6 mx-5" key={idx}>{item}</li>
                    ))}
            </ul>
        </div>
        
    </>
}

export default FocusView