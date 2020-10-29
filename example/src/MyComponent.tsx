import React, { useEffect } from "react";
import { useEasybase } from 'easybase-react';

const Card = ({ rating, picture, app_name, hq, latest_release, index, onRatingChange }: any) => {

    const root = {
        width: 300,
        height: 500,
        display: "block",
        borderRadius: 5,
        boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
        margin: 30
    }

    const imageStyle = {
        width: 300,
        height: 300,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    }

    return (
        <div style={root}>
            <img src={picture} style={imageStyle} alt="" />
            <p>{latest_release}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h5>{app_name}</h5>
                <em>{hq}</em>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <button onClick={_ => onRatingChange(-1, index)}>-</button>
                <p>{rating}</p>
                <button onClick={_ => onRatingChange(1, index)}>+</button>
            </div>
        </div>
    )
}

const MyComponent = () => {

    const { Frame, useFrameEffect, configureFrame, sync } = useEasybase();

    useFrameEffect(() => {
        console.log(Frame());
    })

    useEffect(() => {
        const mounted = async () => {
            configureFrame({ limit: 10, offset: 0 });
            await sync();
        }
        mounted();
    }, []);

    const onRatingChange = (change: number, index: number) => {

        console.log(change)
        Frame();
    }

    return (
        <div>
            {Frame().map((ele, index) => <Card {...(ele as any)} index={index} onRatingChange={onRatingChange} />)}
        </div>
    )
}

export default MyComponent;
