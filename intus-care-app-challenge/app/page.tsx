"use client"

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
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
        for (let i = 0; i < res.length; i++) {
          res[i]["id"] = i;
          res[i]["diagnosesCached"] = false;
        }
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
      <SkeletonTheme baseColor='#d2d2d2' highlightColor='#dddddd' duration={0.75}>
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
      </SkeletonTheme>
    </>
  );
}
