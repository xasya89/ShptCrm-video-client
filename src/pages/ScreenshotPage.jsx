import { useLayoutEffect } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Webcam from "react-webcam";
import $api from "../features/api";

const constraints = {
    video: true
  };

export default function ScreenshotPage (){
  const video = useRef();
  const canvas = useRef();
  const width = useRef();
  const height = useRef();
  useLayoutEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
      video.current.srcObject = stream;
      video.current.play();
    }).catch(err=>console.error(err));
  }, []);

  useEffect(() => {
    const getVideoSize = () => {
      height.current = video.current.videoHeight;
      width.current = video.current.videoWidth;
      canvas.current.width = video.current.videoWidth;
      canvas.current.height = video.current.videoHeight;
    }
    video.current.addEventListener('canplay', getVideoSize);
    return () => video.current.removeEventListener('camplay', getVideoSize);
  }, []);

  const takePhoto = () => {
    const context = canvas.current.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.current.width, canvas.current.height);
    context.drawImage(video.current, 0, 0, width.current, height.current);

    let data = canvas.current.toDataURL("image/png");
    data = data.replace("data:image/png;base64,","");
    $api.post("/screenshotupload", {id:1 , screenshot: data});
  }
    /*
    useLayoutEffect(()=>{
        const getDevices = async () => {
            const stream = await navigator.mediaDevices.getUserMedia(constraints, c.src= window.URL.createObjectURL(stream), error=>console.error(error));
        }
        getDevices();
    }, []);
    */
    return(
      <div>
        <video ref={video} />
        <button onClick={takePhoto}>get capture</button>
        <canvas ref={canvas} />
      </div>
    )
}