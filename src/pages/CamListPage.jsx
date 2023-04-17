import React, {useState, useEffect} from "react";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import $api from "../features/api";

async function selectCamStatuses(setStateCams){
    try{
        const resp = await $api.get("/video/CameraStatus");
        setStateCams(resp.data.filter(c=>c.isRecord));
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

export default function CamRecordListPage() {
    let [cams, setStateCams] = useState([]);

    const selectCamStatuses = useCallback( async () => {
        try{
            const resp = await $api.get("/video/CameraStatus");
            setStateCams(resp.data.filter(c=>c.isRecord));
        }
        catch(e){
            console.error(e);
        }

    }, []);

    useEffect(()=>{
        selectCamStatuses();
        const timer = setInterval(()=>{ selectCamStatuses(); }, 4_000);
        return ()=>clearInterval(timer);
    }, []);

    const stopRecord = async (devId) => {
        try{
            const resp = $api.put("/video/record",[devId]);
            setTimeout(()=>{
                selectCamStatuses(setStateCams)
            }, 500);
        }
        catch(e){
            console.error(e);
        }
    }

    return (
        <>
            <div className="drop-shadow-lg bg-lime-50 mb-2">
                <div className="flex flex-row justify-between p-2">
                    <div className="text-lg text-center">
                        <h3>Список записей</h3>
                    </div>
                    <Link to="/" className="btn btn-danger">x</Link>
                </div>
            </div>
            <div>
                {cams.filter(c=>c.isOnline).map(cam => {
                    let _src = `${process.env.REACT_APP_DVR_HOST}/video.mjpg?oids=${cam.devId}&size=640x480`;
                    if(!cam.isOnline)
                        return <div className="card-vertical">
                            <h2 className="text-xl text-red-700">Камера {cam.devId} недоступна</h2>
                        </div>;
                    if(!cam.isOnline & cam.isRecord)
                        return <div className="card-vertical">
                            <h2 className="text-xl text-red-700">Камера {cam.devId} недоступна во время записи</h2>
                        </div>;
                    let actRecord= <div></div>;
                    if(cam.isRecord)
                        actRecord = <div className="text-center">
                            <h2 className="text-xl text-center">Идет запись акта - {cam?.actNum} от {cam?.actDateStr}<br /> Машина {cam?.ActCar} <br/>Водитель {cam?.actFahrer}</h2>
                            <button onClick={() => stopRecord(cam.devId)} className="btn btn-danger mt-2">Остановить</button>
                        </div>;

                    return <div className="card-vertical">
                        <img src={_src} className="object-cover"></img>
                        {actRecord}
                    </div>
                })}
            </div>
        </>
    )
}