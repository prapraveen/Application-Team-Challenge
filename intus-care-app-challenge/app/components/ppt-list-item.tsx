type pptListItemProps = {
    ppt: Participant;
    setPptSelected: React.Dispatch<React.SetStateAction<Participant|null>>;
    setPptSelectedIdx: React.Dispatch<React.SetStateAction<number|null>>;
    idx: number;
}

const PptListItem = ({ ppt, setPptSelected, setPptSelectedIdx, idx }: pptListItemProps) => {
    const selectPpt = () => {
        setPptSelected(ppt);
        setPptSelectedIdx(idx)
    }

    return <>
        <button className="card ppt-list-item flex flex-row justify-between w-full" onClick={selectPpt}>
            <p className="mx-8 py-5">{`${ppt.firstName} ${ppt.lastName}`}</p>
            <p className="mr-96 py-5">{`${ppt.diagnoses.length}`}</p>
        </button>
    </>
}

export default PptListItem