import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n.js'
import { GoogleOAuthProvider } from '@react-oauth/google';

console.log(import.meta.env.VITE_API_ROUTE)
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="791820989797-3cdepo9g96afmf12h23587sbcrg642dk.apps.googleusercontent.com">
      <App />
  </GoogleOAuthProvider>
)
console.log(App)
console.log("render")