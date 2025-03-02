import { useRouter } from "next/navigation";
import useParticipantStore from "../stores/useParticipantStore";

type pptListItemProps = {
    ppt: Participant;
}

const PptListItem = ({ ppt }: pptListItemProps) => {
    const router = useRouter();

    const handleClick = (event: React.MouseEvent) => {
        // support ctrl+click or cmd+click to open in new tab
        if (!(event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            router.push(`/participant/${ppt.id}`);
        } else {
        }
    };

    return <>
        <a 
            href={`/participant/${ppt.id}`}
            className="card ppt-list-item flex flex-row justify-between w-full"
            onClick={handleClick}>
            <p className="mx-8 py-5">{`${ppt.firstName} ${ppt.lastName}`}</p>
            <p className="mr-96 py-5">{`${ppt.diagnoses.length}`}</p>
        </a>
    </>
}

export default PptListItem;