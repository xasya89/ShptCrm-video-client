import React, {useState, useEffect} from "react";
import axios from 'axios';
import { Link, useLocation, useNavigate, useNavigation, useParams } from "react-router-dom";
import $api from "../features/api";

const ActChoosePage = () => {
    const [actlist, setActList] = useState([]);
    const navigate = useNavigate();
    const {parentPage} = useLocation().state ?? {parentPage:"/"};
    useEffect(() => {
        const selectList = async () => {
            try{
                const resp = await $api.get("/general/ActList");
                setActList(resp.data);
            }
            catch(e){
                console.error(e);
            }
        }
        selectList();
    }, []);

    const handleChooseAct = (actId) => navigate(parentPage=="/" ? "/" : `${parentPage}/${actId}`);
    
    return <div className="">
        <div className="sticky top-0 w-full text-right p-2">
            <a href="/" className="btn btn-danger m-2">Закрыть</a>
        </div>
        <div>
            {actlist.map(act =>{
                let _choosedhref="/startrecord/" + act.id;
                return <div className="card">
                    <div>Номер</div>
                    <div>{act.actNum}</div>
                    <div>Дата</div>
                    <div>{act.actDate}</div>
                    <div>Организация</div>
                    <div>{act.orgName}</div>
                    <div>Водитель</div>
                    <div>{act.fahrer}</div>
                    <div>Машина</div>
                    <div>{act.carNum}</div>
                    <div className="col-span-2 text-center">{act.note}</div>
                    <div className="col-span-2 text-center">
                        <button onClick={_=>handleChooseAct(act.id)} className="btn btn-info">Выбрать</button>
                    </div>
                </div>
            } )}
        </div>
    </div>;
}

export default ActChoosePage;