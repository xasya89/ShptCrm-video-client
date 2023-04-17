import React, {useState, useEffect} from "react";
import $api from "../features/api";
import { Link } from "react-router-dom";

async function selectCamStatuses(setStateCams){
    try{
        const resp = await $api.get("/video/CameraStatus");
        setStateCams(resp.data.filter(c=>c.isOnline));
    }
    catch(e){
        console.error(e);
    }
}

async function stopRecord(devId, setStateCams){
    try{
        const resp = $api.put("/video/record",[devId]);
        setTimeout(()=>{
            selectCamStatuses(setStateCams)
        }, 100);
    }
    catch(e){
        console.error(e);
    }
}

const HomePage = () => {
    let [cams, setStateCams] = useState([]);

    useEffect(() => {
        selectCamStatuses(setStateCams);
    }, [])
    return <div>
        <ul className="text-center p-2">
            <li><Link to="/startrecord" className="btn btn-info">Начать запись</Link></li>
            <li>&nbsp;</li>
            <li><Link to="/uploadphoto" className="btn btn-info">Загрузить фото</Link></li>
            <li>&nbsp;</li>
            <li><Link to="/camlist" className="btn btn-info">Список камер</Link></li>
            <li>&nbsp;</li>
            <li><Link to="/recordlist" className="btn btn-info">На записи</Link></li>
        </ul>
    </div>;
}

export default HomePage;