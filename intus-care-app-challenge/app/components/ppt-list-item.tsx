const PptListItem = ({ ppt }: { ppt:Participant }) => {
    return <>
        <div className="card flex flex-row justify-between">
            <p className="mx-8 py-5">{`${ppt.firstName} ${ppt.lastName}`}</p>
            <p className="mr-96 py-5">{`${ppt.diagnoses.length}`}</p>
        </div>
    </>
}

export default PptListItem