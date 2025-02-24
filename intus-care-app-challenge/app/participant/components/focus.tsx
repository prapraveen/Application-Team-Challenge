import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button"
import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import FocusListItem from "./focus-list-item";
import FocusListItemSkeleton from "./focus-list-item-skeleton";
import { ICDCodeAPIResponeSchema } from "../../schemas/schemas";
import Skeleton from "react-loading-skeleton";

type focusViewProps = {
    ppt: Participant|null;
}

const BackButton = styled(Button)({
    textTransform: "none",
    backgroundColor: "var(--primary-IntusBlue)"
})

const FocusView = ({ ppt }: focusViewProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [showPptInfo, setShowPptInfo] = useState(false); // info about gender, date of birth, etc
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

    const fetchDiagnosisName = async (diagnosis: Diagnosis) => {
        const icdCode = diagnosis.icdCode;
        const cachedData = localStorage.getItem(icdCode);
        // if ICD code is cached in local storage, fetch it from there
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (Date.now() <= parseInt(parsedData["expiration"], 10)) { // only use data if not expired
                const diagnosisName = parsedData["name"];
                const updatedDiagnosis = { ...diagnosis, name: diagnosisName };
                return updatedDiagnosis; // return diagnosis with name
            }
        }

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
                diagnosisName = null; // no diagnosis name found
            }
            const expiryMinutes = 30;
            const expiryTimestamp = Date.now() + expiryMinutes * 60 * 1000; // 30 minutes expiration time
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
            setDiagnoses(diagnosesWithNames);

        } catch (error) {
            throw Error(`Error fetching data for one or more ICD codes: ${error}`);
        }
    }

    useEffect(() => {
        setLoading(true);
        if (ppt) {
            const getDiagnosesData = async () => {
                await fetchDiagnosesNames(ppt);
                setLoading(false)
            }
            try {
                getDiagnosesData();
            } catch {
                setLoading(true);
            }
        }
    }, [ppt])
    
    
    const unselectPpt = () => {
        router.push("/");
    }

    const displayPptInfo = () => {
        setShowPptInfo(!showPptInfo);
    }

    const formatDate = (dateStr: string) => {
        const dateObj = new Date(dateStr);
        const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const day = dateObj.getDate().toString().padStart(2, '0');
        const year = dateObj.getFullYear().toString();
        return `${month}/${day}/${year}`;
    }

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
            <div className="flex flex-row">
                <h2 className={`pt-8 pb-4 grayscale-body ${!ppt && "w-1/5"}`}>
                    {(ppt) ? `${ppt.firstName} ${ppt.lastName}` : <Skeleton />}
                </h2>
                <button onClick={displayPptInfo} className="mt-4"> {/*button to display info about participant*/}
                    {(showPptInfo) ? (
                        <KeyboardArrowDown sx={{fontSize: "3rem"}} />
                    ) : (
                        <KeyboardArrowRight sx={{fontSize: "3rem"}} />
                    )}
                </button>
            </div>
            {(showPptInfo && ppt) && ( // participant info
                <div id="ppt-info" className="grayscale-black mb-4">
                    <p>Date of Birth: {formatDate(ppt.dateOfBirth)}</p>
                    <p>Gender: {ppt.gender}</p>
                    <p>Phone Number: {ppt.phoneNumber}</p>
                    <p>Notes: {(ppt.patientNotes) ? ppt.patientNotes : "N/A"}</p>
                </div>
            )}
            <hr className="mb-4 grayscale-labels" />
            <p className={`grayscale-labels mb-4 ${!ppt && "w-1/6"}`}>
                {(ppt) ? `ICD Codes (${ppt.diagnoses.length})` : <Skeleton />}
            </p>
            <ul>
                {(!loading) ? (
                    diagnoses.map((diagnosis: Diagnosis, idx: number) => (
                        <li className="pb-6 mx-5" key={idx}>
                            <FocusListItem diagnosis={diagnosis} />
                        </li>))
                    ) : (
                    Array(10).fill(<FocusListItemSkeleton />).map((item, idx) => ( // skeleton loader
                        <li className="pb-6 mx-5" key={idx}>{item}</li>
                    ))
                )}
            </ul>
        </div>
    </>
}

export default FocusView