import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/login/Login';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Login />
    </>
  )
}

export default App
