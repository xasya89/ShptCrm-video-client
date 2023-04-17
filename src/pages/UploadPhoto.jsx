import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import ToolBar from "../components/toolbar/ToolBar";
import $api from "../features/api";

export default function UploadPhoto () {
    const location = useLocation();
    const {actId} = useParams();
    const [choosedAct, setChooseAct] = useState(null);
    const [selectImages, setSelectImages] = useState([]);
    const [urls, setURLs] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        const getAct = async () => {
            const resp = await $api.get("/general/ActList/"+actId);
            setChooseAct(resp.data);
        }
        if(actId) getAct();
    }, [])
    
    
    const navigateToActChoose = () => navigate("/actchoose", {state: {parentPage: "/uploadphoto"}});

    useEffect(()=>{
        let arr = [];
        Array.from(selectImages).forEach(file => arr.push(URL.createObjectURL(file)));
        setURLs(arr);
       /*
       const fileReader = new FileReader();
       fileReader.onload = e => setURLs(prev => [...prev, e.target.result]);
       Array.from(selectImages).forEach(file => fileReader.readAsDataURL(file));
       */
    }, [selectImages]);

    const uploadImgs = async () => {
        if(actId===undefined) {
            alert("Акт не выбран");
            return;
        }
        const data = new FormData();
        data.append("actId", actId);
        for(let i = 0; i<selectImages.length; i++)
            data.append("form", selectImages[i]);
        //Array.from(e.target.files).forEach(file=>data.append("file", file));
        try{
            await $api.post("/PhotoUpload", data);
            navigate("/");
        }
        catch (e){
            alert(`Ошибка заугрузки, попробуйте повторить операцию`);
        }
        
    }

    return (<>
        <ToolBar title="Загрузить фото" to="/" />

        <div className="flex flex-col gap-4 m-2 justify-center items-conter">
            <div className="card-vertical">
                <div>
                    <h2 className="text-xl">1 - Выберите акт: </h2>
                </div>
                <div className="text-center my-3">
                    <button onClick={navigateToActChoose} className="btn btn-info">Выбрите акт</button>
                </div>
                <div>
                    {choosedAct && (
                        <h3 className="text-md">
                            <span>Выбран акт: </span>
                            <span>{choosedAct.actNum} </span>
                            <span>{choosedAct.actDateStr} </span>
                            <span>{choosedAct.fahrer} </span>
                            <span>{choosedAct.carNum} </span>
                        </h3>
                    )}
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-4 m-2 justify-center items-conter">
            <div className="card-vertical">
                <div>
                    <h2 className="text-xl">2 - Выберите фото: </h2>
                </div>
                <div className="text-center my-3">
                    <label for="uplaodInput" className="btn btn-info">Загрузить фото</label>
                    <input onChange={e=>setSelectImages(e.target.files)} type="file" accept="image/*" multiple={true} id="uplaodInput" style={{display: "none"}} />
                </div>
            </div>
        </div>

        {urls && urls.length>0 && (
            urls.map(url => <div><img style={{width: "100px", height: "100px"}} src={ /* process.env.REACT_APP_SERVER_API + "/PhotoUpload/" + */ url } /> </div>)
        )}

        
        <div className="flex flex-col gap-4 m-2 justify-center items-conter">
            <div className="card-vertical">
                <div className="text-center my-3">
                    <button onClick={uploadImgs} className="btn btn-info">Загрузить</button>
                </div>
            </div>
        </div>
    </>)
}