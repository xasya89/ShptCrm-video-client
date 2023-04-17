import { Link } from "react-router-dom";

export default function ToolBar ({title, to}){
    return (
        <div className="drop-shadow-lg bg-lime-50 mb-2">
            <div className="flex flex-row justify-between p-2">
                <div className="text-lg text-center">
                    <h3>{title}</h3>
                </div>
                <Link to={to} className="btn btn-danger">x</Link>
            </div>
        </div>
    )
}