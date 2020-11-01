import React, { useEffect, useState } from "react";
import { useEasybase } from 'easybase-react';
import CardElement from "./CardElement";

const FrameSyncExample = () => {

    const [tableLength, setTableLength] = useState(0);

    const {
        Frame,
        useFrameEffect,
        configureFrame,
        sync,
        fullTableSize,
        tableTypes,
        currentConfiguration,
        addRecord,
        deleteRecord
    } = useEasybase();

    useFrameEffect(() => {
        console.log("Frame effect");
    })

    useEffect(() => {
        const mounted = async () => {
            configureFrame({ limit: 10, offset: 0 });
            setTableLength((await fullTableSize()));
            await sync();
        }
        mounted();
    }, []);

    const onAddPage = async () => {
        Frame().unshift({ rating: 102 });
        await sync();
    }

    const tableAndFrameStats = async () => {
        console.log((await tableTypes()));
        console.log((await fullTableSize()));
    }

    const changePage = async (change: number) => {
        configureFrame({ limit: currentConfiguration().limit, offset: currentConfiguration().offset + change });
        await sync();
    }

    const deleteFirstRecord = async () => {
        await deleteRecord(Frame()[0]);
        await sync() // optional
    }

    const addFirstRecord = async () => {
        await addRecord({
            newRecord: { rating: 101 },
            insertAtEnd: false
        });
        await sync() // optional
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div className="m-4">
                    <button className="btn green" onClick={onAddPage}><span>Add<br />Card</span></button>
                </div>
                {Frame().map((ele, index) => <CardElement {...ele} index={index} key={index} />)}
            </div>
            <div className="button-row">
                <div className="d-flex align-items-center">
                    <button className="btn green" onClick={() => changePage(-10)}><span>Prev</span></button>
                    <p className="m-4">{currentConfiguration().offset} - {currentConfiguration().offset + currentConfiguration().limit} of {tableLength}</p>
                    <button className="btn green" onClick={() => changePage(10)}><span>Next</span></button>
                </div>
                <div className="d-flex align-items-center">
                    <button className="btn green m-4" onClick={deleteFirstRecord}><span>Delete 1st Card Sync</span></button>
                    <button className="btn green m-4" onClick={addFirstRecord}><span>Add 1st Card Sync</span></button>
                    <div className="spacer m-4"></div>
                    <button className="btn green m-4" onClick={tableAndFrameStats}><span>Log Stats</span></button>
                    <button className="btn green m-4" onClick={sync}><span>Sync</span></button>
                </div>
            </div>
        </div>
    )
}

export default FrameSyncExample;
