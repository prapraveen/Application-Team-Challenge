"use client"

import FocusView from './components/focus';
import Header from './components/header';
import PptList from './components/list';

import { useState, useEffect } from 'react'

export default function Home() {
  const [pptListData, setPptListData] = useState<Participant[]|null>(null);
  const [pptSelected, setPptSelected] = useState<Participant|null>(null);
  const [pptSelectedIdx, setPptSelectedIdx] = useState<number|null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:9000/participants');
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const res = await response.json();
        setPptListData(res);
        console.log(res);
      }
      catch (error) {
        console.log(error);
      }
      finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [])

  return (
    <>
      <Header />
      {(pptSelected) ? 
        <FocusView ppt={pptSelected} 
          setPptSelected={setPptSelected} 
          pptSelectedIdx={pptSelectedIdx} 
          setPptSelectedIdx={setPptSelectedIdx} 
          pptListData={pptListData} 
          setPptListData={setPptListData}/> 
        : 
        <PptList pptListData={pptListData} setPptSelected={setPptSelected} setPptSelectedIdx={setPptSelectedIdx}/>}

    </>
  );
}
