import { useLayoutEffect } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Webcam from "react-webcam";
import $api from "../features/api";

const constraints = {
    video: true
  };

export default function ScreenshotPage (){
    const canvas = useRef();
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
            <Webcam screenshotFormat="image/jpeg">
            {({ getScreenshot }) => (
      <button
        onClick={() => {
          const imageSrc = getScreenshot();
          console.log(imageSrc);
          const formData = new FormData();
          formData.append("file", imageSrc);
          $api.post("/PhotoUpload", {file: imageSrc});
        }}
      >
        Capture photo
      </button>
    )}
                </Webcam>
                <canvas ref={canvas} />
        </div>
    )
}