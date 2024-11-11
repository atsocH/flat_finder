import { useContext } from "react";
import Navbar from "./Navebar";
import { UserContext } from '../config/usercontex';



function Home(){

    const {user} = useContext(UserContext)

    return(
        <div>
            <Navbar />
            <h2>WELCOME TO MY WEBSITE {user}</h2>
            <p>Hello world</p>
        </div>
    )
}

export default Home;