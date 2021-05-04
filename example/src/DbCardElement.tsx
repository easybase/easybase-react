import React, { useRef } from "react";
import { useEasybase } from "easybase-react";

const CardElement = ({ rating, picture, app_name, hq, latest_release, _key }: any) => {

    const inputEl = useRef<HTMLInputElement>(null);

    const { db } = useEasybase();

    const onRatingChange = (change: number) => {
        db().set({ 'rating': rating + change }).where({ _key }).all()
    }

    const onDelete = () => {
        db().delete().where({ _key }).one();
    }

    return (
        <div className="card-root">
            <div className="card-delete-button" onClick={onDelete}></div>
            <img src={picture} className="card-image" alt="" />
            <input ref={inputEl} type='file' hidden accept="image/*,video/*" />
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
