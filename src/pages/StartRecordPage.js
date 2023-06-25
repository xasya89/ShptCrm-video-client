import React, {useState, useEffect} from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import $api from "../features/api";

function camSelected(cams, setCams, devId){
    let pos = cams.indexOf(devId);
    if(pos>-1)
        cams.splice(pos, 1);
    else
        cams.push(devId);
    setCams([...cams]);
}


const StartRecordPage = () => {
    const navigate = useNavigate();
    let {actId} = useParams();
    let [cams, setCams] = useState([]);
    let [isCamLoading, setIsCamLoading] = useState(false);
    let [choosedAct, setChoosedAct] = useState(null);
    let [chooseCams, setChooseCams] = useState([]);

    useEffect(() => {
        const select = async () => {
            setIsCamLoading(true);
            try{
                const resp = await $api.get("/video/CameraStatus");
                setCams(resp.data);
            }
            catch(e){
                console.error(e);
            }
            setIsCamLoading(false);
        };
        select();
    }, [])

    useEffect(() => {
        const select = async () => {
            try{
                const resp = await $api.get("/general/ActList/"+actId);
                setChoosedAct(resp.data);
            }
            catch(e){
                console.error(e);
            }
        }
        select();
    }, [actId]);

    const startRecord = async () => {
        try{
            const resp = await $api.post("/video/record", {
                actId: actId, cams: chooseCams
            });
            setTimeout(()=> navigate("/recordlist"), 1_000);
        }
        catch(e){
            console.error(e);
        }

    }

    const navigateToActChoose = () => navigate("/actchoose", {state: {parentPage: "/startrecord"}});

    let _actNote = <div></div>
    if(choosedAct!=null)
        _actNote = <h3 className="text-md">
            <span>Выбран акт: </span>
            <span>{choosedAct.actNum} </span>
            <span>{choosedAct.actDateStr} </span>
            <span>{choosedAct.fahrer} </span>
            <span>{choosedAct.carNum} </span>
        </h3>

    return (<>
        <div className="drop-shadow-lg bg-lime-50 mb-2">
            <div className="flex flex-row justify-between p-2">
                <div className="text-lg text-center">
                    <h3>Начало записи</h3>
                </div>
                <Link to="/" className="btn btn-danger">x</Link>
            </div>
        </div>

    <div className="flex flex-col gap-4 m-2 justify-center items-conter">
        <div className="card-vertical">
            <div>
                <h2 className="text-xl">1 - Выберите акт: </h2>
            </div>
            <div className="text-center my-3">
                <button onClick={navigateToActChoose} className="btn btn-info">Выбрать акт</button>
            </div>
            <div>
                {_actNote}
            </div>
        </div>
        <div className="card-vertical">
            <div>
                <h2 className="text-xl">2 - Выберите камеры: </h2>
            </div>
                {isCamLoading && <div>Получение списка  камер</div>}
                {cams.filter(x=>x.isOnline & !x.isRecord).map(cam => {
                    let _src = `${process.env.REACT_APP_DVR_HOST}/video.mjpg?oids=${cam.devId}&size=640x480`;
                    let _camSelected = <div></div>;
                    if(chooseCams.indexOf(cam.devId) > -1)
                        _camSelected = <div className="absolute  w-full h-full top-0 left-0 bg-greenopacity opacity-40"></div>;
                    
                    return <div key={cam.devId} onClick={()=> camSelected(chooseCams, setChooseCams, cam.devId)} className="relative">
                        <img src={_src} className="object-cover"></img>
                        {_camSelected}
                    </div>
                })}
        </div>
        <div className="card text-center" style={{marginBottom: "100px"}}>
            <button onClick={()=>startRecord(choosedAct.id, chooseCams)} className="btn btn-info">Начать запись</button>
        </div>
    </div>
    </>)
}

export default StartRecordPage;