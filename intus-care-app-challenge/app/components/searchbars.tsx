import Searchbar from "./searchbar"
import { ICDCodeAPIResponeSchema } from "../schemas/schemas";

type SearchbarsProps = {
    pptListData: Participant[]|null;
    resetOrder: () => void;
    setPptDisplayOrder: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const Searchbars = ({ pptListData, resetOrder, setPptDisplayOrder}: SearchbarsProps) => {
    // filter by name (not case sensitive)
    const nameSearch = (term: string) => {
        setPptDisplayOrder(pptListData!.filter((ppt) => {
            const name = `${ppt.firstName} ${ppt.lastName}`;
            return name.toLowerCase().startsWith(term.toLowerCase());
        }))
    }

    // filter participants with an ICD code
    const icdCodeSearch = (term: string) => (
        setPptDisplayOrder(pptListData!.filter((ppt) => (
            ppt.diagnoses.some((diagnosis) => (
                diagnosis.icdCode.toLocaleLowerCase().startsWith(term.toLowerCase())
            ))
        )))
    )

    // filter participants by diagnosis name
    const diagnosisSearch = async (term: string) => {
        const fetchICDCodes = async () => {
            const url = `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${term.toLowerCase()}&maxList=500`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                ICDCodeAPIResponeSchema.parse([ ...data, undefined]);
                
                const displayStrings: [string, string][] = data[3]; // index of display string
                const icdCodes = displayStrings.map((displayString) => (displayString[0])) // index of ICD
                return icdCodes;
            }
            catch (error) {
                throw Error(`Error fetching ICD Codes for diagnosis: ${error}`);
            }
        }
        // get ICD codes associated with the diagnosis name, and convert to a set for faster indexing
        const icdCodesArray = await fetchICDCodes();
        const icdCodesSet = new Set(icdCodesArray);

        setPptDisplayOrder(pptListData!.filter((ppt) => {
            const pptICDCodes = ppt.diagnoses.map((diagnosis) => diagnosis.icdCode);
            return pptICDCodes.some((code) => icdCodesSet.has(code)); // get participants that have at least 1 matching ICD code
        }));
    }

    const searchbarsList = [
        <Searchbar 
            key={"name"}
            resetOrder={resetOrder} 
            searchFilter={nameSearch}
            placeholder={"Search Names..."}
        />,
        <Searchbar 
            key={"ICD codes"}
            resetOrder={resetOrder} 
            searchFilter={icdCodeSearch}
            placeholder={"Search ICD Codes..."}
        />,
        <Searchbar 
            key={"diagnosis"}
            resetOrder={resetOrder} 
            searchFilter={diagnosisSearch}
            placeholder={"Search Diagnoses..."}
        />
    ]

    return (
        <div className="searchbars flex flex-row pt-5 pl-8">
            {searchbarsList.map((searchbar, idx) => (
                <div key={idx} className="pr-4">{searchbar}</div>
            ))}
        </div>
    )
}

export default Searchbars;