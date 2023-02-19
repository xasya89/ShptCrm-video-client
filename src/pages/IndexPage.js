import React, {useState, useEffect} from "react";
import axios from 'axios';

function selectCamStatuses(setStateCams){
    axios.get("https://172.172.172.45:7036/api/video/CameraStatus" ,{
        headers: {'Access-Control-Allow-Origin': "*"},
        mode: 'cors',
    })
    .then(function (resp){
        setStateCams(resp.data);
    })
    .catch(function (error){
        console.error(error);
    })
}

function stopRecord(devId, setStateCams){
    axios.put("https://172.172.172.45:7036/api/video/record",[devId],{
        headers: {'Access-Control-Allow-Origin': "*"},
        mode: 'cors',
    })
    .then(function (resp){
        setTimeout(()=>{
            selectCamStatuses(setStateCams)
        }, 100);
    })
    .catch(function (error){
        console.error(error);
    })
}

const IndexPage = () => {
    let [cams, setStateCams] = useState([]);
    useEffect(() => {
        selectCamStatuses(setStateCams);
    }, cams)

    return <div>
        <div className="text-center p-2">
            <a href="/startrecord" className="btn btn-info">Начать запись</a>
        </div>
        <div>
            {cams.map(cam => {
                let _src = `http://localhost:8090/video.mjpg?oids=${cam.devId}&size=640x480`;
                if(!cam.isOnline)
                    return <div className="card-vertical">
                        <h2 className="text-xl text-red-700">Камера недоступна</h2>
                    </div>;
                if(!cam.isOnline & cam.isRecord)
                    return <div className="card-vertical">
                        <h2 className="text-xl text-red-700">Камера недоступна во время погрузки</h2>
                    </div>;
                let actRecord= <div></div>;
                if(cam.isRecord)
                    actRecord = <div className="text-center">
                        <h2 className="text-xl text-center">Идет запись акта - 1234 от 22.10.22</h2>
                        <button onClick={() => stopRecord(cam.devId, setStateCams)} className="btn btn-danger mt-2">Остановить</button>
                    </div>;

                return <div className="card-vertical">
                    <img src={_src} className="object-cover"></img>
                    {actRecord}
                </div>
            })}
        </div>
    </div>;
}

export default IndexPage;