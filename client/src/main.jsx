import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.jsx'
import { UserProvider } from './hooks/userContext.jsx'


createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>
)
