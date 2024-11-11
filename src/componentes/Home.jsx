import { useLocation } from "react-router-dom";
import Navbar from "./Navebar";


function Home(){
    const location = useLocation();
    const {Logname} = location.state || {};
    const {Regname} = location.state || {};
    return(
        <div>
            <Navbar />
            <h2>WELCOME TO MY WEBSITE {Logname || Regname}</h2>
            <p>Hello world</p>
        </div>
    )
}

export default Home;