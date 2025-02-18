import '../app.css'
import Image from 'next/image'
import PptListItem from './ppt-list-item';
import PptListItemSkeleton from './ppt-list-item-skeleton';

type pptListProps = {
    pptListData: Participant[]|null;
    setPptSelected: React.Dispatch<React.SetStateAction<Participant|null>>;
    setPptSelectedIdx: React.Dispatch<React.SetStateAction<number|null>>;
}

const PptList = ({ pptListData, setPptSelected, setPptSelectedIdx }: pptListProps) => {

    return <>
        <div>
            <h2 className="mt-8 ml-16 primary-IntusNavy">
                Participants
            </h2>
            <div className="card bg-white mx-24 my-2 hide-scrollbar" style={{maxHeight: '75vh', overflow: 'scroll'}}>
                <div className="tableLabels flex flex-row justify-between pt-5 mb-3 ">
                    <p className='px-8 grayscale-labels'>Participant Name</p>
                    <div className="icd-codes flex flex-row pr-96">
                        <p className='mx-3 grayscale-labels'>ICD Codes</p>
                        <button>
                            <img src='/orderFilter_Down.svg' />
                        </button>
                    </div>

                </div>
                <hr className='mb-5 mx-8 grayscale-labels' />
                <ul>
                    {(pptListData) ? pptListData?.map((ppt, idx) => (
                        <li key={idx} className='mx-8 mb-5'>
                            <PptListItem ppt={ppt} setPptSelected={setPptSelected} setPptSelectedIdx={setPptSelectedIdx} idx={idx}/>
                        </li>
                    ))
                    :
                    Array(10).fill(<PptListItemSkeleton />).map((skeleton, idx) => 
                        <li key={idx} className='mx-8 mb-5'>{skeleton}</li>
                    )}
                </ul>

            </div>
                
        </div>
    </>
}

const Label = () => {
    return 
}

export default PptList