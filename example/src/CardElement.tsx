import React from "react";
import { useEasybase } from "easybase-react";

const CardElement = ({ rating, picture, app_name, hq, latest_release, index }: any) => {

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
            <p className="mp-0" style={{ textAlign: 'center' }}>{latest_release ? latest_release.slice(0, 10) : ""}</p>
            <div className="p-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

export default CardElement;
