import { useEffect, useState } from "react";
import PptListItem from "./ppt-list-item";
import NameSearchBar from "./searchbar";
import PptListItemSkeleton from "./ppt-list-item-skeleton";
import { ICDCodeAPIResponeSchema } from "./schemas/schemas";
import "../app.css";
import Searchbars from "./searchbars";

type pptListProps = {
    pptListData: Participant[]|null;
    setPptListData: React.Dispatch<React.SetStateAction<Participant[]|null>>;
    setPptSelected: React.Dispatch<React.SetStateAction<Participant|null>>;
    pptHistory: Participant[];
    setPptHistory: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const PptList = ({ pptListData, setPptSelected, pptHistory, setPptHistory }: pptListProps) => {
    const [orderCodesAsc, setOrderCodesAsc] = useState(false);
    const [orderNamesAsc, setOrderNamesAsc] = useState(false);
    const [pptDisplayOrder, setPptDisplayOrder] = useState<Participant[]>([]);

    useEffect(() => {
        // sort descending by default
        if (pptListData) {
            let sortedPptList = pptListData.slice();
            sortedPptList.sort((pptA, pptB) => 
                (pptA.diagnoses.length - pptB.diagnoses.length) * ((!orderCodesAsc ? -1 : 1))
            )
            setPptDisplayOrder(sortedPptList);
        }
    }, [pptListData])

    /* functions to order ppt */
    const orderByCodes = () => {
        setOrderCodesAsc(!orderCodesAsc);
        let newPptDisplayOrder = pptDisplayOrder.slice();
        newPptDisplayOrder.sort((pptA, pptB) => 
            (pptA.diagnoses.length - pptB.diagnoses.length) * ((orderCodesAsc ? -1 : 1))
        )
        setPptDisplayOrder(newPptDisplayOrder);
    }

    const orderByNames = () => {
        setOrderNamesAsc(!orderNamesAsc);
        let newPptDisplayOrder = pptDisplayOrder.slice();
        newPptDisplayOrder.sort((pptA, pptB) => {
            const nameA = `${pptA.firstName} ${pptA.lastName}`;
            const nameB = `${pptB.firstName} ${pptB.lastName}`;
            const comparison = nameA.localeCompare(nameB, "en", {});
            return comparison * ((!orderNamesAsc) ? 1 : -1);
        })
        setPptDisplayOrder(newPptDisplayOrder);
    }

    // default order: number of ICD codes, descending
    const resetOrder = () => {
        setOrderCodesAsc(false);
        setOrderNamesAsc(false);
        if (pptListData) {
            let sortedPptList = pptListData.slice();
            sortedPptList.sort((pptA, pptB) => 
                (pptA.diagnoses.length - pptB.diagnoses.length) * ((!orderCodesAsc ? -1 : 1))
            )
            setPptDisplayOrder(sortedPptList);
        }
    }    

    return (
        <>
            <h2 className="mt-8 ml-16 primary-IntusNavy">
                Participants
            </h2>
            <div className="card bg-white mx-24 my-2 hide-scrollbar" style={{maxHeight: "75vh", overflow: "scroll"}}>
                <Searchbars pptListData={pptListData} resetOrder={resetOrder} setPptDisplayOrder={setPptDisplayOrder} />
                <div className="tableLabels flex flex-row justify-between pt-5 mb-3 ">
                    <div className="ppt-name flex flex-row px-8">
                        <p className="grayscale-labels mr-3">Participant Name</p>
                        <button onClick={orderByNames}>
                            <img 
                                src="../images/orderFilter_Up.svg" 
                                style={(!orderNamesAsc) ? {rotate: "180deg"} : {}}
                            />
                        </button>
                    </div>
                    <div className="icd-codes flex flex-row pr-80">
                        <p className="mx-3 grayscale-labels">ICD Codes</p>
                        <button onClick={orderByCodes}>
                            <img 
                                src="../images/orderFilter_Up.svg" 
                                style={(!orderCodesAsc) ? {rotate: "180deg"} : {}}
                            />
                        </button>
                    </div>

                </div>
                <hr className="mb-5 mx-8 grayscale-labels" />
                <ul>
                    {(pptListData) ? (
                        pptDisplayOrder.map((ppt, idx) => (
                            <li key={idx} className="mx-8 mb-5">
                                <PptListItem 
                                    ppt={ppt} 
                                    setPptSelected={setPptSelected} 
                                    pptHistory={pptHistory} 
                                    setPptHistory={setPptHistory}
                                />
                            </li>
                        ))
                        ) : (
                        Array(10).fill(<PptListItemSkeleton />).map((skeleton, idx) => 
                            <li key={idx} className="mx-8 mb-5">{skeleton}</li>
                        )
                    )}
                </ul>
            </div>
        </>
    )
}

export default PptList