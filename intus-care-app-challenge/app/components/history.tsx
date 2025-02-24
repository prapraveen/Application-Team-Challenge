"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import HistoryIcon from "@mui/icons-material/History";
import useParticipantStore from "../stores/useParticipantStore";

const History = () => {
    const router = useRouter();
    const [menuToggled, setMenuToggled] = useState(false);
    const { history, addToHistory, clearHistory } = useParticipantStore();

    const handleClick = (event: React.MouseEvent, ppt: Participant) => {
        // support ctrl+click or cmd+click to open in new tab
        if (!(event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            addToHistory(ppt);
            setMenuToggled(false);
            router.push(`/participant/${ppt.id}`);
        } else {
            addToHistory(ppt);
        }
    }

    return (
        <div className="fixed top-0 right-0 pr-6 pt-32">
            {menuToggled ? (
                <div>
                    <div 
                        className="card bg-white absolute top-0 right-0 mt-32 mr-6" 
                        style={{width: "20vw"}}
                    >
                        <div className="flex flex-row justify-between">
                            <p className="m-2 ml-4 grayscale-labels">
                                Viewing History
                            </p>
                            <button className="p-2 hover:bg-gray-100 rounded-full"
                                    onClick={() => setMenuToggled(!menuToggled)}>
                                <HistoryIcon fontSize="large" />
                            </button>
                        </div>
                        <hr className="mx-3"/>
                        <ul className="hide-scrollbar" style={{overflow: "scroll", minHeight: "5vh", maxHeight: "40vh"}}>
                            {history.map((ppt: Participant, idx: number) => (
                                <li className="m-3" key={idx}>
                                    <a href={`/participant/${ppt.id}`} onClick={(e) => handleClick(e, ppt)}>
                                        <h3 className="primary-IntusBlue hover:underline">
                                            {`${ppt.firstName} ${ppt.lastName}`}
                                        </h3>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <button onClick={clearHistory}>
                            <p className="text-red-500 my-2 mx-4">{history.length != 0 && "Clear"}</p>
                        </button>
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