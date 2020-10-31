import React, { useEffect, useState } from "react";
import { useEasybase } from 'easybase-react';

const Card = ({ rating, picture, app_name, hq, latest_release, index }: any) => {

    const {
        Frame,
        sync,
    } = useEasybase();

    const onRatingChange = (change: number) => {
        Frame(index).rating += change;
        sync();
    }

    const onDelete = () => {
        Frame().splice(index, 1);
        sync();
    }

    return (
        <div className="card-root">
            <div className="card-delete-button" onClick={onDelete}></div>
            <img src={picture} className="card-image" alt="" />
            <p>{latest_release}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h5>{app_name}</h5>
                <em>{hq}</em>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <button className="btn orange" onClick={_ => onRatingChange(-1)}><span>-</span></button>
                <p>{rating}</p>
                <button className="btn orange" onClick={_ => onRatingChange(1)}><span>+</span></button>
            </div>
        </div>
    )
}

const MyComponent = () => {

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
        Frame().unshift({});
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
                {Frame().map((ele, index) => <Card {...ele} index={index} key={index} />)}
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

export default MyComponent;
