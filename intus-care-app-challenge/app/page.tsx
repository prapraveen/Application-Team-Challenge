"use client"

import FocusView from './components/focus';
import Header from './components/header';
import PptList from './components/list';
import axios from 'axios';

import { useState, useEffect } from 'react'

export default function Home() {
  const [pptData, setPptData] = useState<Participant[]|null>(null);
  const [pptSelected, setPptSelected] = useState<Participant|null>(null);
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
        setPptData(res);
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
      {(pptSelected) ? <FocusView ppt={pptSelected}/> : <PptList pptData={pptData}/>}

    </>
  );
}
