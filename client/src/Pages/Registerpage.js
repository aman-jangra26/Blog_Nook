import { useState } from "react"

export default function Registerpage( ) { 

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
    
    async function register(ev){
        ev.preventDefault();         
        const response =  await fetch('http://localhost:4000/api/register',{
        method:'POST',
        body:JSON.stringify({username,password}),
        headers:{'Content-Type':'application/json'},
        });
        if(response.status === 200 ){
            alert('Registration SuccesFull');
        }else{
            alert('Registration Failed');
        }   
        
    }

    return(
        <div style={formContainerStyle}>
        <form className="register" onSubmit={register}><h1>
            SIGN IN
        </h1>
            <input type="text" 
            placeholder="Username"
            style={inputStyle}
            value={username}
            onChange={ev =>     setUsername(ev.target.value)}/>
            <input type="password"
             style={inputStyle}
             placeholder="Password"
             value={password}
             onChange={ev =>setPassword(ev.target.value)}/>
            <button 
            style={{
                ...buttonStyle,
                backgroundColor: isButtonHovered ? '#007bff' : 'black',
              }}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}>

                SIGN IN</button>
            </form>
            </div>
    )
}