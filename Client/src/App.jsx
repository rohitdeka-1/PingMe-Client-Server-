import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { lazy } from "react"
import Requests from "./Components/Profile/Requests"
// import Home from "./Pages/Home"
// import Profile from "./Pages/Profile"
// import Chat from "./Pages/Chat"
// import Login from "./Pages/Login"

const Home = lazy(()=> import("./Pages/Home"))
const Profile = lazy(()=> import("./Pages/Profile"))
const Chat = lazy(()=> import("./Pages/Chat"))
const Login = lazy(()=> import("./Pages/Login"))
const Register = lazy(()=> import("./Pages/Register"))


const App = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/chat/:userId" element={<Chat/>}/>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/requests" element={<Requests/>} />
        </Routes>
    </Router>
  )
}

export default App