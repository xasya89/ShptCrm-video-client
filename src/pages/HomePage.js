import React, {useState, useEffect} from "react";
import axios from 'axios';
import $api from "../features/api";
import VideoSlider from "../components/slider/Slider";
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
        <div>
            <VideoSlider>
                {cams.map(cam => <div key={cam.devId} className='item'>
                <img src={`${process.env.REACT_APP_DVR_HOST}/video.mjpg?oids=${cam.devId}&size=1027x768`} draggable={false} />
                <div>{cam.isRecord && <>Идет запись</>}</div>
                </div> )}
            </VideoSlider>
        </div>
        <ul className="text-center p-2">
            <li><Link to="/startrecord" className="btn btn-info">Начать запись</Link></li>
            <li>&nbsp;</li>
            <li><Link to="/recordlist" className="btn btn-info">Список записей</Link></li>
        </ul>
    </div>;
}

export default HomePage;