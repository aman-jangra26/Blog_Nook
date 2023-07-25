import './App.css';
import Post from './Post1';
import Header from './Header';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Indexpage from './Pages/Indexpage';
import Loginpage from './Pages/Loginpage';
import Registerpage from './Pages/Registerpage';
import { UserContextProvider } from './UserContext';
import CreatePost from './Pages/CreatePost';
import PostPage from './Pages/PostPage';
import EditPost from './Pages/EditPost';
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
        <Route index element={ <Indexpage/> }/>
        <Route path="/login"element={ <Loginpage/> }/>
        <Route path="/register" element={ <Registerpage/> }/>   
        <Route path="/create" element={<CreatePost/>} />
        <Route path="/post/:id"element={<PostPage/>}/>
        <Route path="edit/:id"element ={<EditPost/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
   
  );
}

export default App;
