const FocusListItem = ({ diagnosis }: { diagnosis: Diagnosis }) => {
    return <>
        <div className="flex flex-row justify-between px-8 py-5" style={{background: "var(--grayscale-inputBack)"}}>
            <p className="mr-10">{("name" in diagnosis) ? diagnosis.name : "Unknown"}</p>
            <p className="">{diagnosis.icdCode}</p>
        </div>
    </>
    
}

export default FocusListItem;