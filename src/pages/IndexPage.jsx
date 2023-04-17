import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function IndexPage () {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);
    return (
        <>
            <Outlet />
        </>
    )
}