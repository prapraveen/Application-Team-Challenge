type pptListItemProps = {
    ppt: Participant;
    setPptSelected: React.Dispatch<React.SetStateAction<Participant|null>>;
    pptHistory: Participant[];
    setPptHistory: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const PptListItem = ({ ppt, setPptSelected, pptHistory, setPptHistory }: pptListItemProps) => {
    const selectPpt = () => {
        /* update history */
        // get index of ppt in array
        let pptIdx = -1;
        for (let i = 0; i < pptHistory.length; i++) {
            if (pptHistory[i].id == ppt.id) {
                pptIdx = i;
                break;
            }
        }
        if (pptIdx != -1) {
            pptHistory.splice(pptIdx, 1);
        }
        let updatedPptHistory = pptHistory.slice();
        updatedPptHistory.unshift(ppt);
        setPptHistory(updatedPptHistory);
        setPptSelected(ppt);
    }

    return <>
        <button className="card ppt-list-item flex flex-row justify-between w-full" onClick={selectPpt}>
            <p className="mx-8 py-5">{`${ppt.firstName} ${ppt.lastName}`}</p>
            <p className="mr-96 py-5">{`${ppt.diagnoses.length}`}</p>
        </button>
    </>
}

export default PptListItem;