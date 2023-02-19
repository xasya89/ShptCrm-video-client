import React, {useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function camSelected(cams, setCams, devId){
    let pos = cams.indexOf(devId);
    if(pos>-1)
        cams.splice(pos, 1);
    else
        cams.push(devId);
    setCams([...cams]);
}

function startRecord(actId, cams){
    axios.post("https://172.172.172.45:7036/api/video/record", {
        actId: actId, cams: cams
    },{
        headers: {'Access-Control-Allow-Origin': "*"},
        mode: 'cors',
    })
    .then(function (resp){
        window.location.href="/";

    })
    .catch(function (error){
        console.error(error);
    })
}

const StartRecordPage = () => {
    let {actId} = useParams();
    let [cams, setCams] = useState([]);
    let [choosedAct, setChoosedAct] = useState(null);
    let [chooseCams, setChooseCams] = useState([]);

    useEffect(() => {
        axios.get("https://172.172.172.45:7036/api/video/CameraStatus" ,{
            headers: {'Access-Control-Allow-Origin': "*"},
            mode: 'cors',
        })
        .then(function (resp){
            setCams(resp.data);

        })
        .catch(function (error){
            console.error(error);
        })
    }, [])

    useEffect(() => {
        axios.get("https://172.172.172.45:7036/api/general/ActList/"+actId ,{
            headers: {'Access-Control-Allow-Origin': "*"},
            mode: 'cors',
        })
        .then(function (resp){
            setChoosedAct(resp.data);
        })
        .catch(function (error){
            console.error(error);
        })
    }, actId);

    let _actNote = <div></div>
    if(choosedAct!=null)
        _actNote = <h3 className="text-md">
            <span>Выбран акт: </span>
            <span>{choosedAct.actNum} </span>
            <span>{choosedAct.actDateStr} </span>
            <span>{choosedAct.fahrer} </span>
            <span>{choosedAct.carNum} </span>
        </h3>

    return <div className="flex flex-col gap-4 m-2 justify-center items-conter">
        <div className="card-vertical">
            <div>
                <h2 className="text-xl">2 - Выберите акт: </h2>
            </div>
            <div className="text-center my-3">
                <a href="/actchoose" className="btn btn-info">Выбрать акт</a>
            </div>
            <div>
                {_actNote}
            </div>
        </div>
        <div className="card-vertical">
            <div>
                <h2 className="text-xl">2 - Выберите камеры: </h2>
            </div>
                {cams.map(cam => {
                    let _src = `http://localhost:8090/video.mjpg?oids=${cam.devId}&size=640x480`;
                    let _camSelected = <div></div>;
                    if(chooseCams.indexOf(cam.devId) > -1)
                        _camSelected = <div className="absolute  w-full h-full top-0 left-0 bg-greenopacity opacity-40"></div>;
                    if(cam.isOnline & !cam.isRecord & cam.actId === null)
                        return <div onClick={()=> camSelected(chooseCams, setChooseCams, cam.devId)} className="relative">
                            <img src={_src} className="object-cover"></img>
                            {_camSelected}
                        </div>
                    return <div></div>
                })}
        </div>
        <div className="card text-center">
            <button onClick={()=>startRecord(choosedAct.id, chooseCams)} className="btn btn-info">Начать запись</button>
        </div>
    </div>
}

export default StartRecordPage;