import React, { useState } from "react";
import { useEasybase } from 'easybase-react';
import CardElement from "./DbCardElement";

const ChildUseReturn = () => {
    const [ratingState, setRatingState] = useState(50);

    const {
        db,
        useReturn,
        e
    } = useEasybase();

    const { frame, loading } = useReturn(() => db()
        .return()
        .where(e.lt('rating', ratingState))
        .limit(10),
        [ratingState]);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center" }}>
                {loading ? <div className="loader"></div> : frame.map((ele: any, index: any) => <CardElement {...ele} index={index} key={index} />)}
            </div>
            <div className="button-row">
                <div className="d-flex align-items-center">
                    <p className="m-4">Edit Rating filter: </p>
                    <input type="number" onChange={e => setRatingState(+e.target.value)} value={ratingState} />
                </div>
            </div>
        </div>
    )
}

const UseReturnStressTest = () => {
    const [showChild, setShowChild] = useState(true);

    const {
        db,
    } = useEasybase();

    const onAddPage = async () => {
        await db().insert({ rating: 68, "app name": "Inserted App", _position: 0 }).all();
    }

    return (
        <div>
            <div>
                <button className="btn green" onClick={onAddPage}><span>Add<br />Card</span></button>
                <label>
                    Show Child:
                    <input type="checkbox" onChange={e => setShowChild(e.target.checked)} checked={showChild} />
                </label>

                { showChild && <ChildUseReturn /> }
            </div>
        </div>
    )
}

export default UseReturnStressTest;
