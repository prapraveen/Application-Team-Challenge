const FocusListItem = ({ diagnosis }: { diagnosis: Diagnosis }) => {
    return <>
        <div className="flex flex-row justify-between px-8 py-5" style={{background: "var(--grayscale-inputBack)"}}>
            <p className={`mr-10 h-20px ${!diagnosis.name && "grayscale-labels"}`}>
                {diagnosis.name || "N/A"}
            </p>
            <p>{diagnosis.icdCode}</p>
        </div>
    </>
    
}

export default FocusListItem;