"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/header";
import Focus from "../components/focus";
import History from "@/app/components/history";
import useParticipantStore from "@/app/stores/useParticipantStore";
import "@/app/app.css"

const FocusPage = () => {
    const { pptListData, fetchParticipants, addToHistory } = useParticipantStore();
    const [pptSelected, setPptSelected] = useState<Participant|null>(null);
    
    const params = useParams();
    const pptId = params.id;
    const router = useRouter();

    useEffect(() => {
        fetchParticipants(); // get participants
    }, [])

    useEffect(() => {
        // if invalid patient parameter, redirect to home page
        if (typeof pptId !== "string") {
            router.push("/");
        }
        const parsedId = parseInt((pptId as string), 10);
        if (isNaN(parsedId)) {
            router.push("/");
        }
        if (pptListData) {
            // valid number, but not a valid ID
            if (parsedId < 0 || parsedId >= pptListData.length) {
                router.push("/");
            } else { // valid
                setPptSelected(pptListData[parsedId]); // set participant to the one with the corresponding ID
                addToHistory(pptListData[parsedId]); // add to history
            }
        }
    }, [pptListData, pptId, router])


    return <>
        <Header />
        <History />
        <Focus ppt={pptSelected} />
    </>
}

export default FocusPage;