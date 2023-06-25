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
    const [isCamLoading, setIsCamLoading] = useState(true);
    let [cams, setStateCams] = useState([]);

    const selectCamStatuses = useCallback( async () => {
        try{
            const resp = await $api.get("/video/CameraStatus");
            const cams = resp.data.filter(c=>c.isRecord || c.actId!=null)
                .map(c=>{
                    c.isRecordStoped = false;
                    return c;
                })
            setStateCams(cams);
        }
        catch(e){
            console.error(e);
        }
        finally{
            setIsCamLoading(false);
            setTimeout(() => {
                selectCamStatuses();
            }, 4_000);
        }
    }, []);

    useEffect(()=>{
        selectCamStatuses();
    }, []);

    const stopRecord = async (devId) => {
        try{
            const resp = await $api.put("/video/record",[devId]);
            setStateCams(prev=>prev.map(c=>{
                if(c.devId===devId) c.isRecordStoped = true;
                return {...c};
            }))
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
                {isCamLoading && <div>Получение списка камер</div>}
                {cams.map(cam => {
                    let _src = `${process.env.REACT_APP_DVR_HOST}/video.mjpg?oids=${cam.devId}&size=640x480`;
                    return <div className="card-vertical">
                        {cam.isOnline && <img src={_src} className="object-cover"></img>}
                        {!cam.isOnline && <h2 className="text-xl text-red-700">Камера {cam.devId} недоступна</h2>}
                        {cam.actId!=null && 
                            <div className="text-center">
                                <h2 className="text-xl text-center">Идет запись акта - {cam?.actNum} от {cam?.actDateStr}<br /> Машина {cam?.ActCar} <br/>Водитель {cam?.actFahrer}</h2>
                                {cam.isRecordStoped && <button onClick={() => stopRecord(cam.devId)} className="btn btn-danger mt-2">Идет остановка</button>}
                                {!cam.isRecordStoped && <button onClick={() => stopRecord(cam.devId)} className="btn btn-danger mt-2">Остановить</button>}
                            </div>
                        }
                        {cam.isRecord && cam.actId==null && 
                            <div className="text-center">
                                <button onClick={() => stopRecord(cam.devId)} className="btn btn-danger mt-2">Остановить</button>
                            </div>
                        }
                    </div>
                })}
            </div>
        </>
    )
}