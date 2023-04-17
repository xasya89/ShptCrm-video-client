import React, { Component, useReducer, useContext } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import ActChoosePage from './pages/ActChoosePage';
import { ActChooseContext, actChooseinitialState, actChooseReducer } from './ChooseActReducer';
import StartRecordPage from './pages/StartRecordPage';
import CamRecordListPage from './pages/CamListPage';
import HomePage from './pages/HomePage';
import IndexPage from './pages/IndexPage';
import ScreenshotPage from './pages/ScreenshotPage';
import CameraList from './pages/CameraList';
import UploadPhoto from './pages/UploadPhoto';


const askPermission = () => {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error("We weren't granted permission.");
    }
  });
}

const router = createBrowserRouter([
    {
      path: "/",
      element: <IndexPage />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "uploadphoto",
          element: <UploadPhoto />
        },
        {
          path: "uploadphoto/:actId",
          element: <UploadPhoto />
        },
        {
          path: "camlist",
          element: <CameraList />
        },
        {
          path: "recordlist",
          element: <div><CamRecordListPage /></div>
        },
        {
          path: "actchoose",
          element:  <div>
              <ActChoosePage />
            </div>,
        },
        {
          path: "actchoose/",
          element:  <div>
              <ActChoosePage />
            </div>,
        },
        {
          path: "startrecord",
          element:  <div>
              <StartRecordPage />
            </div>,
        },
        {
          path: "startrecord/:actId",
          element:  <div>
              <StartRecordPage />
            </div>,
        },
        {
          path: "screenshot",
          element: <ScreenshotPage />
        },
      ]
    },
  ])


class App extends Component {
  render() {
    return (
        <RouterProvider router={router} />
    );
  }
}



/*
const App = () => {
  let {state, dispatch} = useContext(ActChooseContext);
    return (
      <ActChooseContext.Provider value={{dispatch, state}}>
        <RouterProvider router={router} />
      </ActChooseContext.Provider>
        
    );
}
*/


export default App;
