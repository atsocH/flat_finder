import { Link } from 'react-router-dom';


export default function Navbar() {
  
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
  
    return (
      <div>
        <nav>
          <ul style={styles.ul}>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/register'>Registar/Login</Link></li>
          </ul>
        </nav>
      </div>
    );
}