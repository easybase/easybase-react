import React, { useRef } from "react";
import { useEasybase } from "easybase-react";

const CardElement = ({ rating, picture, app_name, hq, latest_release, _key, tableName }: any) => {

    const inputEl = useRef<HTMLInputElement>(null);

    const { db, setImage } = useEasybase();

    const onRatingChange = (change: number) => {
        db(tableName || "").set({ 'rating': rating + change }).where({ _key }).all()
    }

    const onDelete = () => {
        db(tableName || "").delete().where({ _key }).one();
    }

    const onImageClick = () => {
        if (inputEl && inputEl.current) {
            inputEl.current.onchange = () => {
                if (inputEl && inputEl.current && inputEl.current.files && inputEl.current.files.length > 0) {
                    const imageFile = inputEl.current.files[0];
                    if (imageFile.type.includes("image")) {
                        setImage(_key, "picture", imageFile);
                    }
                }
            };

            inputEl.current.click();
        }
    }

    return (
        <div className="card-root">
            <div className="card-delete-button" onClick={onDelete}></div>
            <img src={picture} className="card-image" alt="" onClick={onImageClick} />
            <input ref={inputEl} type='file' hidden accept="image/*,video/*,.heic" />
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
