import React, { useRef } from "react";
import { useEasybase } from "easybase-react";

const CardElement = ({ rating, picture, app_name, hq, latest_release, index }: any) => {

    const inputEl = useRef<HTMLInputElement>(null);

    const {
        Frame,
        sync,
        updateRecordImage,
        updateRecordVideo
    } = useEasybase();

    const onRatingChange = (change: number) => {
        Frame(index).rating += change;
        sync();
    }

    const onDelete = () => {
        Frame().splice(index, 1);
        sync();
    }

    const onImageClick = () => {
        if (inputEl && inputEl.current) {
            inputEl.current.onchange = () => {
                if (inputEl && inputEl.current && inputEl.current.files && inputEl.current.files.length > 0) {
                    const imageFile = inputEl.current.files[0];
                    if (imageFile.type.includes("image")) {
                        updateRecordImage({ columnName: "picture", record: Frame()[index], attachment: imageFile });
                    } else if (imageFile.type.includes("video")) {
                        updateRecordVideo({ columnName: "picture", record: Frame()[index], attachment: imageFile })
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
