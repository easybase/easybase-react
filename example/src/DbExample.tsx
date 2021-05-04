import React, { useEffect, useState } from "react";
import { useEasybase } from 'easybase-react';
import CardElement from "./CardElement";

const DbExample = () => {

    const [tableLength, setTableLength] = useState(0);
    const [frameLength, setFrameLength] = useState(10);
    const [frameOffset, setFrameOffset] = useState(0);
    const [currentData, setCurrentData] = useState<any[]>([]);

    const {
        db,
        dbEventListener,
        fullTableSize,
        tableTypes
    } = useEasybase();

    useEffect(() => {
        const mounted = async () => {
            dbEventListener(console.log);
            setTableLength(await fullTableSize());
        }
        mounted();
    }, []);

    useEffect(() => {
        const runEffect = async () => {
            setCurrentData(await db().return().limit(frameLength).offset(frameOffset).all());
        }
        runEffect();
    }, [frameOffset, frameLength])
    

    const onAddPage = async () => {
        await db().insert({ rating: 50, "app name": "Inserted App", _position: 0 }).all();
        setCurrentData(await db().return().limit(frameLength).offset(frameOffset).all());
    }

    const tableAndFrameStats = async () => {
        console.log((await tableTypes()));
        console.log((await fullTableSize()));
    }

    const changePage = async (change: number) => {
        setFrameOffset(prev => Math.abs(prev + change));
    }

    const deleteSecondRecord = async () => {
        const firstRecord = currentData[1];
        if (firstRecord) {
            console.log("Second record begin deleted: ", firstRecord);
            await db().delete(firstRecord as any).all();
            setCurrentData(await db().return().limit(frameLength).offset(frameOffset).all());
        }
    }

    const getFirstRecord = async () => {
        await db().return("app_name").where({ _position: 0 }).one();
        await db().return("app_name").where({ _position: 0 }).all();
        await db().return().where({ _position: 0 }).one();
        await db().return().where({ _position: 0 }).all();
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div className="m-4">
                    <button className="btn green" onClick={onAddPage}><span>Add<br />Card</span></button>
                </div>
                {Array.isArray(currentData) && currentData.map((ele, index) => <CardElement {...ele} index={index} key={index} />)}
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
                </div>
                <div className="d-flex align-items-center">
                    <button className="btn green m-4" onClick={deleteSecondRecord}><span>Delete 2st Card</span></button>
                    <button className="btn green m-4" onClick={getFirstRecord}><span>Get 1st Card</span></button>
                    <div className="spacer m-4"></div>
                    <button className="btn green m-4" onClick={tableAndFrameStats}><span>Log Stats</span></button>
                </div>
            </div>
        </div>
    )
}

export default DbExample;
