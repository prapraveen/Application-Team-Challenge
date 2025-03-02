"use client"

import { useEffect, useState } from "react";
import PptListItem from "./ppt-list-item";
import PptListItemSkeleton from "./ppt-list-item-skeleton";
import Searchbars from "./searchbars";
import useParticipantStore from "../stores/useParticipantStore";

const PptList = () => {
    const { pptListData, fetchParticipants } = useParticipantStore();
    const [loading, setLoading ] = useState(true);
    const [orderCodesAsc, setOrderCodesAsc] = useState(false);
    const [orderNamesAsc, setOrderNamesAsc] = useState(false);
    const [pptDisplayOrder, setPptDisplayOrder] = useState<Participant[]>([]);

    // load participant data
    useEffect(() => {
        setLoading(true);
        fetchParticipants();
    }, [])

    // set loading to false once data is loaded in
    useEffect(() => {
        if (pptListData) {
            setLoading(false);
          }
    }, [pptListData])

    useEffect(() => {
        // default order: number of ICD codes, descending
        if (!loading) {
          if (pptListData) {
              const sortedPptList = pptListData.slice();
              sortedPptList.sort((pptA, pptB) => 
                  (pptA.diagnoses.length - pptB.diagnoses.length) * ((!orderCodesAsc ? -1 : 1)) // reverse if false
              )
              setPptDisplayOrder(sortedPptList);
          }
        }
    }, [loading])

    /* functions to order ppt */
    const orderByCodes = () => {
        setOrderCodesAsc(!orderCodesAsc);
        const newPptDisplayOrder = pptDisplayOrder.slice();
        newPptDisplayOrder.sort((pptA, pptB) => 
            (pptA.diagnoses.length - pptB.diagnoses.length) * ((orderCodesAsc ? -1 : 1)) // reverse if false
        )
        setPptDisplayOrder(newPptDisplayOrder);
    }

    const orderByNames = () => {
        setOrderNamesAsc(!orderNamesAsc);
        const newPptDisplayOrder = pptDisplayOrder.slice();
        newPptDisplayOrder.sort((pptA, pptB) => {
            const nameA = `${pptA.firstName} ${pptA.lastName}`;
            const nameB = `${pptB.firstName} ${pptB.lastName}`;
            const comparison = nameA.localeCompare(nameB, "en", {});
            return comparison * ((!orderNamesAsc) ? 1 : -1); // reverse if false
        })
        setPptDisplayOrder(newPptDisplayOrder);
    }

    // default order: number of ICD codes, descending
    const resetOrder = () => {
        setOrderCodesAsc(false);
        setOrderNamesAsc(false);
        if (pptListData) {
            const sortedPptList = pptListData.slice();
            sortedPptList.sort((pptA, pptB) => 
                (pptA.diagnoses.length - pptB.diagnoses.length) * ((!orderCodesAsc ? -1 : 1)) // reverse if false
            )
            setPptDisplayOrder(sortedPptList);
        }
    }    

    return (
        <>
            
            <h2 className="mt-8 ml-16 primary-IntusNavy">
                Participants
            </h2>
            <div className="card bg-white mx-24 my-3 hide-scrollbar" style={{maxHeight: "75vh", overflow: "scroll"}}>
                <Searchbars 
                    pptListData={pptListData} 
                    resetOrder={resetOrder} 
                    setPptDisplayOrder={setPptDisplayOrder} 
                />
                <div className="flex flex-row justify-between pt-5 mb-3 ">
                    <div className="flex flex-row px-8">
                        <p className="grayscale-labels mr-3">Participant Name</p>
                        <button id="names-order" onClick={orderByNames}>
                            <img 
                                src="../images/orderFilter_Up.svg" 
                                style={(!orderNamesAsc) ? {rotate: "180deg"} : {}}
                            />
                        </button>
                    </div>
                    <div className="flex flex-row pr-80">
                        <p className="mx-3 grayscale-labels">ICD Codes</p>
                        <button id="codes-order" onClick={orderByCodes}>
                            <img 
                                src="../images/orderFilter_Up.svg" 
                                style={(!orderCodesAsc) ? {rotate: "180deg"} : {}}
                            />
                        </button>
                    </div>

                </div>
                <hr className="mb-5 mx-8 grayscale-labels" />
                <ul>
                    {(!loading) ? (
                        pptDisplayOrder.map((ppt, idx) => (
                            <li key={idx} className="mx-8 mb-5">
                                <PptListItem ppt={ppt} />
                            </li>
                        ))
                        ) : (
                        Array(10).fill(<PptListItemSkeleton />).map((skeleton, idx) => // skeleton loader 
                            <li key={idx} className="mx-8 mb-5">{skeleton}</li>
                        )
                    )}
                </ul>
            </div>
        </>
    )
}

export default PptList