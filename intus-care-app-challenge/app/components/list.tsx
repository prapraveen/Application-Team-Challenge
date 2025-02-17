import '../app.css'
import Image from 'next/image'
import PptListItem from './ppt-list-item';

const PptList = ({ pptData }: { pptData: Participant[]|null }) => {
    const tableLabel = null;

    return <>
        <div>
            <h2 
                style={{color: 'var(--primary-IntusNavy'}}
                className="mt-8 ml-16"
                >
                Participants
            </h2>
            <div className="card bg-white mx-24 my-2 hide-scrollbar" style={{maxHeight: '75vh', overflow: 'scroll'}}>
                <div className="tableLabels flex flex-row justify-between pt-5 mb-3 ">
                    <p style={{color: 'var(--grayscale-labels'}} className='px-8'>Participant Name</p>
                    <div className="icd-codes flex flex-row pr-96">
                        <p style={{color: 'var(--grayscale-labels'}} className='mx-3'>ICD Codes</p>
                        <button>
                            <img src='/orderFilter_Down.svg' />
                        </button>
                    </div>

                </div>
                <hr className='mb-5 mx-8' />
                <ul> 
                    {pptData?.map((ppt, idx) => (
                        <li key={idx} className='mx-8 mb-5'>
                            <PptListItem ppt={ppt} />
                        </li>
                    ))}
                </ul>

            </div>
                
        </div>
    </>
}

const Label = () => {
    return 
}

export default PptList