import { useState } from "react";
import HistoryIcon from "@mui/icons-material/History";

type historyProps = {
    pptHistory: Participant[];
    setPptHistory: React.Dispatch<React.SetStateAction<Participant[]>>;
    setPptSelected: React.Dispatch<React.SetStateAction<Participant|null>>;
}

const History = ({ pptHistory, setPptHistory, setPptSelected }: historyProps) => {
    const [menuToggled, setMenuToggled] = useState(false);
    
    const selectPpt = (ppt: Participant) => {
        setPptSelected(ppt);
        // update history
        let pptIdx = -1;
        for (let i = 0; i < pptHistory.length; i++) {
            if (pptHistory[i].id == ppt.id) {
                pptIdx = i;
                break;
            }
        }
        pptHistory.splice(pptIdx, 1);
        let updatedPptHistory = pptHistory.slice();
        updatedPptHistory.unshift(ppt);
        setPptHistory(updatedPptHistory);
        setMenuToggled(false);
    }

    return (
        <div className="fixed top-0 right-0 pr-6 pt-36">
            {menuToggled ? (
                <div>
                    <div 
                        className="card bg-white absolute top-0 right-0 mt-36 mr-6" 
                        style={{width: "20vw", minHeight: "10vh", maxHeight: "50vh"}}
                    >
                        <div className="labels flex flex-row justify-between">
                            <p className="m-2 ml-4 grayscale-labels">
                                Viewing History
                            </p>
                            <button className="p-2 hover:bg-gray-100 rounded-full"
                                    onClick={() => setMenuToggled(!menuToggled)}>
                                <HistoryIcon fontSize="large" />
                            </button>
                        </div>
                        <hr className="mx-2"/>
                        <ul>
                            {pptHistory.map((ppt: Participant, idx: number) => (
                                <li className="m-3" key={idx}>
                                    <button onClick={() => selectPpt(ppt)}>
                                        <h3 className="primary-IntusBlue hover:underline">
                                            {`${ppt.firstName} ${ppt.lastName}`}
                                        </h3>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <button className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={() => setMenuToggled(!menuToggled)}>
                    <HistoryIcon fontSize="large"/>
                </button>
            )}
        </div>
    );
}

export default History;