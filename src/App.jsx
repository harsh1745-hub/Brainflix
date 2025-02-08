import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Components/Common/Header'
import { Route,Routes } from 'react-router-dom'
import Register from './Pages/Register'
import NoteEditor from './Components/Notes/NoteEditor'
import Footer from './Components/Common/Footer'
import Home from './Pages/Home'
import Transcription from './Components/Common/Transcription'
import Login from './Pages/Login'
import AIYouTubeLibrary from './Components/Common/Library'
import QuizSection from './Components/Common/Discussion'



function App() {


  return (
    <>
     
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Register/>}/>
        <Route path='/notes' element={<NoteEditor/>}/>
        <Route path='/ai' element={<Transcription/>}/>
        <Route path='/section'element={<AIYouTubeLibrary/>}/>
        <Route path='/quiz' element={<QuizSection/>}/>
      </Routes>
      <Footer/>
      
    </>
  )
}

export default App
