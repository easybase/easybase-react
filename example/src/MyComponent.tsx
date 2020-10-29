import React, { useEffect, useState } from "react";
import { useEasybase } from 'easybase-react';

const Card = ({ rating, picture, app_name, hq, latest_release, index, onRatingChange }: any) => {

    return (
        <div className="card-root">
            <img src={picture} className="card-image" alt="" />
            <p>{latest_release}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h5>{app_name}</h5>
                <em>{hq}</em>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <button className="btn orange" onClick={_ => onRatingChange(-1, index)}><span>-</span></button>
                <p>{rating}</p>
                <button className="btn orange" onClick={_ => onRatingChange(1, index)}><span>+</span></button>
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
        currentConfiguration
    } = useEasybase();

    useFrameEffect(() => {
        console.log(Frame());
    })

    useEffect(() => {
        const mounted = async () => {
            configureFrame({ limit: 10, offset: 0 });
            setTableLength((await fullTableSize()));
            await sync();
        }
        mounted();
    }, []);

    const onRatingChange = (change: number, index: number) => {
        Frame(index).rating += change;
        sync();
    }

    const tableAndFrameStats = async () => {
        console.log((await tableTypes()));
        console.log((await fullTableSize()));
    }

    const changePage = async (change: number) => {
        configureFrame({ limit: currentConfiguration().limit, offset: currentConfiguration().offset + change });
        await sync();
    }

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
                {Frame().map((ele, index) => <Card {...ele} index={index} onRatingChange={onRatingChange} />)}
            </div>
            <div className="button-row">
                <div className="d-flex align-items-center">
                    <button className="btn green" onClick={() => changePage(-10)}><span>Prev</span></button>
                    <p className="m-4">{currentConfiguration().offset} - {currentConfiguration().offset + currentConfiguration().limit} of {tableLength}</p>
                    <button className="btn green" onClick={() => changePage(10)}><span>Next</span></button>
                </div>
                <div>
                    <button className="btn green" onClick={tableAndFrameStats}><span>Log Stats</span></button>
                </div>
            </div>
        </div>
    )
}

export default MyComponent;
