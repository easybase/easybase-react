import React from "react";

const QueryCardElement = ({ rating, picture, app_name, hq, latest_release }: any) => {

    return (
        <div className="card-root" style={{ height: 345 }}>
            <img src={picture} className="card-image" alt="" />
            <p className="mp-0" style={{ textAlign: 'center' }}>{latest_release ? latest_release.slice(0, 10) : ""}</p>
            <div className="p-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h5>{app_name}</h5>
                <em>{hq}</em>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>{rating}</p>
            </div>
        </div>
    )
}

export default QueryCardElement;
