import './App.css'
import React from 'react';
import Wrapper from './components/Wrapper'
import { useEffect } from 'react';


function App() {

  useEffect(() => {
    console.log("app mounted")
  }, []);
  return (
    <Wrapper />
  );
}
export default App;
