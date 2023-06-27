import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom";
import $api from "../features/api";

export default function CameraList () {
    const select = useRef();
    const [cams, setCams] = useState([]);
    const [selectCam, setSelectCam] = useState(null);
    const [isCamLoading, setIsCamLoading] = useState(true);
    useEffect(()=>{
        const getCams = async () => {
            try{
                const resp = await $api.get("/video/CameraStatus");
                setCams(resp.data.filter(c=>c.isOnline || c.isRecord));
                setSelectCam(resp.data.length>0 ? resp.data[0] : null);
            }
            catch(e){}
            finally{
                setIsCamLoading(false);
            }
        }
        getCams();
    }, []);

    const handleSelect= devId => setSelectCam(cams.filter(c=>c.devId==devId)[0]);

    return(<>
        <div className="drop-shadow-lg bg-lime-50 mb-2">
            <div className="flex flex-row justify-between p-2">
                <div className="text-lg text-center">
                    <h3>Список камер</h3>
                </div>
                <Link to="/" className="btn btn-danger">x</Link>
            </div>
        </div>

        <label for='camas' className="select-label text-lg text-center block">Выберите камеру</label>
        <select onChange={e=>handleSelect(e.target.value)} value={selectCam?.devId} ref={select} id='cams' className="select">
            {cams.map(c=><option value={c.devId} key={c.devId}>Камера {c.devId}</option>)}
        </select>
        <div>
            {isCamLoading && <div>Получение списка камер</div>}
            {selectCam && (
                <>
                    <img src={`${process.env.REACT_APP_DVR_HOST}/video.mjpg?oids=${selectCam.devId}&size=640x480`} className="object-cover"/>
                    {selectCam.isRecord && (
                        <h3 className="text-lg text-center">Идет запись<br />Акт {selectCam.ActNum} от {selectCam.actDateStr}</h3>
                    )}
                </>
            )}
        </div>
    </>)
}