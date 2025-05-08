import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("./Pages/Home"));
const Profile = lazy(() => import("./Pages/Profile"));
const Chat = lazy(() => import("./Pages/Chat"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Requests = lazy(() => import("./Components/Profile/Requests"));
const Reset = lazy(() => import("./Pages/Reset"));
const ResetPass = lazy(() => import("./Pages/ResetPass"));
const Landing = lazy(() => import("./Pages/Landing"));
const Public = lazy(() => import("./Pages/Public"));

const App = () => {
  return (
 
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/profile/:username" element={<Public />} />
          <Route path="/resetpassword/:token" element={<ResetPass />} />
        </Routes>
      </Router>
 
  );
};

export default App;