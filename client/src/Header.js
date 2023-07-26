import { useContext, useEffect, useState } from "react";
import { Link, json, useSearchParams } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header(  ) { 
  const {setUserInfo,userInfo} = useContext(UserContext);
    useEffect(()=>{
      fetch('http://localhost:4000/api/profile',{
        
        credentials: 'include'
      }).then(response =>{
        response.json().then(userInfo =>{
          setUserInfo(userInfo);
        });
      })
    },[])

    function logout() {
      fetch('http://localhost:4000/api/logout',{
        
        credentials: 'include',
        method:'POST',
      });
      setUserInfo(null);  
    }
    const username = userInfo?.username;
    return (
        <header>
        <Link to="" className="logo">BlogNook
        </Link >    
        <nav>
          {
            username && (
              <>
             <span style={{ padding: '8px 16px' }}>Hello, {username}</span>

              <Link to  ="/create" class="create-link" >Create New Post </Link>
              <a  href="#" className="logout-link" onClick={logout}> LogOut</a>
              </>
            )
          }
          {
            !username &&(
              <>
               <Link to="/login" class="login-link">LOGIN </Link>
          <Link to="/register" class="register-link">SIGN IN </Link>
              </>
            )
          }
         
        </nav>
      </header>
    );
}