import React, { useState } from "react";
import QueryCardElement from "./QueryCardElement";
import { useEasybase } from "easybase-react";

const QueryExample = () => {

    const [queryInputValue, setQueryInputValue] = useState("");
    const [queryArray, setQueryArray] = useState<Record<string, any>[]>([]);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);
    const [sortBy, setSortBy] = useState("");

    const { Query } = useEasybase();

    const getQuery = async() => {
        const res = await Query({
            queryName: queryInputValue,
            descending: false,
            sortBy,
            limit,
            offset
        });
        console.log(res);
        setQueryArray(res);
    }

    return (
        <div>
            <div className="d-flex m-4 p-4" style={{ alignItems: "flex-end" }}>
                <div className="m-4">
                    <p>Query:</p>
                    <input value={queryInputValue} onChange={e => setQueryInputValue(e.target.value)} placeholder="Enter Query Name" />
                </div>
                <div className="m-4">
                    <p>Limit:</p>
                    <input value={limit} type="number" onChange={e => setLimit(+e.target.value)} placeholder="Limit" />
                </div>
                <div className="m-4">
                    <p>Offset:</p>
                    <input value={offset} type="number" onChange={e => setOffset(+e.target.value)} placeholder="Offset" />
                </div>
                <div className="m-4">
                    <p>Sort By:</p>
                    <input value={sortBy} onChange={e => setSortBy(e.target.value)} placeholder="Sort By Column" />
                </div>
                <button className="btn green m-4 p-4" onClick={getQuery}><span>Go</span></button>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                {queryArray.map((ele, index) => <QueryCardElement {...ele} key={index} />)}
            </div>
        </div>
    )
}

export default QueryExample;