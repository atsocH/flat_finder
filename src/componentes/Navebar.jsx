import { Link } from 'react-router-dom';
import { AuthContext } from '../config/authcontex';
import { useContext } from 'react';


export default function Navbar() {

  const {isAuthenticated} = useContext(AuthContext)
  
  const styles = {
    ul: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      listStyle: 'none',
      margin: 0,
      padding: '0.2em',
      backgroundColor: 'rgba(127, 127, 127, 0.2)',
    },
  };
    if(isAuthenticated){ 
    return (
      <div>
        <nav>
          <ul style={styles.ul}>
            <li><Link to='/'>Home</Link></li>
          </ul>
        </nav>
      </div>
      )} else {
        return ( 
          <div>
            <ul style={styles.ul}>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/register'>Registar/Login</Link></li>
            </ul>
          </div>
      )}
    ;
}