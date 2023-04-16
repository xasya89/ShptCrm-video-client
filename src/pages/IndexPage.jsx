import { Outlet, useNavigate } from "react-router-dom";

export default function IndexPage () {
    const navigate = useNavigate();
    return (
        <>
            <Outlet />
        </>
    )
}