import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const FocusListItemSkeleton = () => {
    return <>
        <div className="flex flex-row justify-between px-8 py-5" style={{background: "var(--grayscale-inputBack)"}}>
            <p className="h-20px w-1/4"><Skeleton /></p>
            <p className="h-20px w-1/12"><Skeleton /></p>
        </div>
    </>
}

export default FocusListItemSkeleton;