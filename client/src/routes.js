import { Routes, Route } from "react-router-dom";
import Skeleton from "./components/Skeleton";
import Page404 from "./containers/404";
import Dashboard from "./containers/Dashboard";
import Home from "./containers/Home";
import SignUp from "./containers/SignUp";
import SignIn from "./containers/SignIn";

export default function Router() {
    return (
        <Routes>
            <Route path="" element={<Skeleton />}>
                <Route path="" element={<Home />} />
                <Route path="signup" element={<SignUp />} />
                <Route path="signin" element={<SignIn />} />
                <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}
