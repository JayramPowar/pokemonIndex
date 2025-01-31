import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Pokeapi } from './pokeapi.jsx'
// import {Card} from './components/Card.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Pokeapi />
    {/* <Card /> */}
  </StrictMode>,
)
