"use client"

import { useState, useEffect } from "react"
import { SkeletonTheme } from "react-loading-skeleton";
import FocusView from "./components/focus";
import Header from "./components/header";
import PptList from "./components/list";
import History from "./components/history";
import { pptArrayAPIResSchema } from "./components/schemas/schemas";
import "./app.css";

export default function Home() {
  const [pptListData, setPptListData] = useState<Participant[]|null>(null);
  const [pptSelected, setPptSelected] = useState<Participant|null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [pptHistory, setPptHistory] = useState<Participant[]>([]);

  // fetch dat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:9000/participants");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        pptArrayAPIResSchema.parse(data);
        for (let i = 0; i < data.length; i++) {
          data[i]["id"] = i;
          data[i]["diagnosesCached"] = false;
        }
        setPptListData(data);
      }
      catch (error) {
        throw new Error(`Error getting participant data: ${error}`);
      }
      finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [])

  return (
    <>
      <SkeletonTheme baseColor="#d2d2d2" highlightColor="#dddddd" duration={0.75}>
        <Header />
        {(pptSelected) ? (
          <FocusView ppt={pptSelected} 
            setPptSelected={setPptSelected}
            pptListData={pptListData} 
            setPptListData={setPptListData}/> 
        ) : ( 
          <PptList pptListData={pptListData} setPptListData={setPptListData} setPptSelected={setPptSelected} pptHistory={pptHistory} setPptHistory={setPptHistory}/>
        )}
            <History pptHistory={pptHistory} setPptHistory={setPptHistory} setPptSelected={setPptSelected}/>
      </SkeletonTheme>
    </>
  );
}
