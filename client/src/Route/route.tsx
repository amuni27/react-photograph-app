import { Navigate } from "react-router-dom";
import Photographers from "../component/Pages/Photographer/Photographers/Photographers";
import AddPhotgrapher from "../component/Pages/Photographer/AddPhotgrapher/AddPhotgrapher";
import UpdatePhotographer from "../component/Pages/Photographer/UpdatePhotographer/UpdatePhotographer";
import SignIn from "../component/Pages/User/SignIn/SignIn";
import Photgrapher from "../component/Pages/Photographer/Photographer/Photgrapher";
import SignUp from "../component/Pages/User/SignUP/SignUp";
import PageNotFound from "../component/Pages/PageNotFound/PageNotFound";

const routes = ([
  { path: "/Photographers", element: <Photographers /> },
  { path: "/Photogrpaher", element: <Photgrapher /> },
  { path: "/AddPhotogrpaher", element: <AddPhotgrapher /> },
  { path: "/UpdatePhotogrpaher", element: <UpdatePhotographer /> },
  { path: "/Signin", element: <SignIn /> },
  { path: "/SingUp", element: <SignUp /> },
  { path: "/", element: <Navigate to="/Photographers"/> },
  { path: "*", element: <PageNotFound/> },
]);
export default routes

 
