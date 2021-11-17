import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";

const { myAPI } = window;

const TextView: React.FC = () => {
    const [list, setList] = useState<string[]>([]);

    const onClickOpen = async () => {
        const filelist = await myAPI.openDialog();
        
        if (!filelist) return;

        setList(filelist);
    };
    
    return (
        <div>
            <button onClick={onClickOpen}>OpenDirectory and Show Files</button>
            <ul>
                {list.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
    
}

export default TextView;