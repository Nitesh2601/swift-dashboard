
import { Routes, Route} from "react-router-dom";

import CommentsPage from "./Pages/CommentsPage";
import Navbar from "./Components/Navbar";

import ProfilePage from "./Pages/ProfilePage";
function App() {
  
  return (
    <>
     <div>
       <Navbar/>
     </div>
      <Routes>
        <Route path='/' element = {<CommentsPage/>}/>
        <Route path='/profile' element = {<ProfilePage/>}/>
      </Routes>
        
    </>
  )
}

export default App
