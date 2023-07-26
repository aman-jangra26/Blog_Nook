import { useContext, useState } from "react"
import {Navigate} from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Loginpage() { 
    const formContainerStyle = {
        padding: '10px',
        width: '400px',
        margin: '30px auto',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f0f0f0',
      };
    
      const inputStyle = {
        width: '100%',
        padding: '8px',
        margin: '10px 0',
        borderRadius: '3px',
        border: '1px solid #ccc',
      };
    
      const buttonStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: 'black',
        color: '#fff',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      };
    
      const [isButtonHovered, setButtonHovered] = useState(false);

      const handleButtonHover = () => {
        setButtonHovered(true);
      };
    
      const handleButtonLeave = () => {
        setButtonHovered(false);
      };
   
    
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect,setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);
    async function loign(ev){
        ev.preventDefault();         
        const response =  await fetch('http://localhost:4000/api/login',{
        method:'POST',
        body:JSON.stringify({username,password}),
        headers:{'Content-Type':'application/json'},
        credentials:'include'
        });
        if(response.ok){
             response.json().then(userInfo =>{
                setUserInfo(userInfo);
                setRedirect(true);
             });
            
        }else{
            if (response.status === 401) {
                // Unauthorized (wrong credentials)
                alert('Wrong credentials');
              } else if (response.status === 404) {
                // User not found
                alert('User not found');
              } else {
                // Other error
                alert('Error occurred during login');
              }
        }
        
        
 
        
    }
    if(redirect){
        return <Navigate to={'/'}/>
    }

    return(
        <div style={formContainerStyle}>
        <form className="login" onSubmit={loign}><h1>
            LOGIN
        </h1>
            <input type="text" 
            placeholder="Username"
            style={inputStyle}
            value={username}
            onChange={ev =>     setUsername(ev.target.value)}/>
            <input type="password"
             placeholder="Password"
             style={inputStyle}
             value={password}
             onChange={ev =>setPassword(ev.target.value)}/>
            <button
            style={{
                ...buttonStyle,
                backgroundColor: isButtonHovered ? '#007bff' : 'black',
              }}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >LOGIN</button>
            </form>
            </div>
    )
}