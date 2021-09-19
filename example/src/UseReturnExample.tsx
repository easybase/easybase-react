import React, { useEffect, useState } from "react";
import { useEasybase } from 'easybase-react';
import CardElement from "./DbCardElement";

interface IE {
    time: Date;
    success: boolean;
}

const UseReturnExample = () => {

    const [tableLength, setTableLength] = useState(0);
    const [frameLength, setFrameLength] = useState(10);
    const [frameOffset, setFrameOffset] = useState(0);
    const [ratingState, setRatingState] = useState(50);

    const {
        db,
        useReturn,
        fullTableSize,
        e
    } = useEasybase();

    const { frame, manualFetch, unsubscribe, loading } = useReturn<IE>(() => db().return().where(e.lt('rating', ratingState)).limit(frameLength).offset(frameOffset), [ frameLength, frameOffset, ratingState ]);

    useEffect(() => {
        async function mounted() {
            setTableLength(await fullTableSize())
        }
        mounted();
    }, [])
    

    const onAddPage = async () => {
        await db().insert({ rating: 68, "app name": "Inserted App", _position: 0 }).all();
    }

    const changePage = async (change: number) => {
        setFrameOffset(prev => Math.abs(prev + change));
    }

    const getFirstRecord = async () => {
        console.log(await db().return("app_name").where({ _position: 0 }).one());
        console.log(await db().return("app_name").where({ _position: 0 }).all());
        console.log(await db().return().where({ _position: 0 }).one());
        console.log(await db().return().where({ _position: 0 }).all());
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div className="m-4">
                    <button className="btn green" onClick={onAddPage}><span>Add<br />Card</span></button>
                </div>
                {loading ? <div className="loader"></div> : frame.map((ele: any, index: any) => <CardElement {...ele} index={index} key={index} />)}
            </div>
            <div className="button-row">
                <div className="d-flex align-items-center">
                    <button className="btn green" onClick={() => changePage(-10)}><span>Prev</span></button>
                    <p className="m-4">{frameOffset} - {frameOffset + Number(frameLength)} of {tableLength}</p>
                    <button className="btn green" onClick={() => changePage(10)}><span>Next</span></button>
                </div>
                <div className="d-flex align-items-center">
                    <p className="m-4">Edit db limit: </p>
                    <input type="number" onChange={e => setFrameLength(+e.target.value)} value={frameLength} />
                    <div className="spacer m-4"></div>
                    <p className="m-4">Edit Rating filter: </p>
                    <input type="number" onChange={e => setRatingState(+e.target.value)} value={ratingState} />
                </div>
                <div className="d-flex align-items-center">
                    <button className="btn green m-4" onClick={getFirstRecord}><span>Get 1st Card</span></button>
                    <div className="spacer m-4"></div>
                    <button className="btn green m-4" onClick={manualFetch}><span>Manual Fetch</span></button>
                    <button className="btn green m-4" onClick={unsubscribe}><span>Unsubscribe</span></button>
                </div>
            </div>
        </div>
    )
}

export default UseReturnExample;
