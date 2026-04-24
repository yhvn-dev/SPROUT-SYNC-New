import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense, useEffect} from "react";
import api from './utils/api.js'

const Login = lazy(() => import("./pages/Login/login.jsx"));
const Home = lazy(() => import("./pages/Home/home.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/dashboard.jsx"));
const Manage_Plants = lazy(() => import("./pages/Manage_Plants/manage_plants.jsx"))
const Users = lazy(() => import("./pages/Users/users.jsx"));
const Analytics = lazy(() => import('./pages/Analytics/analytics.jsx'));
const Irrigation_Monitoring_Logs  = lazy(() => import('./pages/Irrigation_Monitoring_Logs/irrigation_monitoring_logs.jsx'));
const Batch_History = lazy(() => import("./pages/Batch_History/batch_history.jsx"));
const Plants = lazy(() => import("./pages/Plants/plants.jsx"));
const PasswordRequests =  lazy(() => import("./pages/Password_Request/password_request_page.jsx"));
const UserGuide = lazy(() => import("./pages/User_Guide/user_guide.jsx"))


import { Dashboard_Skeleton } from "./components/skeletons.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoutes/page.Routes.jsx";
import { MessagesProvider } from "./hooks/messageHooks.jsx";
import { PlantDataProvider } from "./hooks/plantContext.jsx";
import { ESP32Provider } from "./hooks/esp32Hooks.jsx";
import { ValveProvider } from "./hooks/valveContext.jsx";
import { WateringLogProvider } from "./hooks/wateringLogsContext.jsx"
import { markAudioUnlocked } from './utils/notificationSounds'; 
import NotifPopup from "./components/notifPopup.jsx";

import './styles.css';



function App() {

   useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await api.post('/auth/refresh-token', {}, { withCredentials: true })
      } catch (err) {
      }
    }, 1000) 

    return () => clearInterval(interval)
  }, [])
  

  
    useEffect(() => {
    const unlock = () => {
      const audio = new Audio('/sounds/NORMAL_NOTIF.mp3');
      audio.volume = 0;
      audio.play()
        .then(() => {
          markAudioUnlocked();
          console.log("🔊 Audio unlocked");
        })
        .catch((err) => {
          console.warn("Silent play failed:", err.message);
          markAudioUnlocked();
          console.log("🔊 Audio unlocked (fallback)");
        });
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
    
  }, []);


   
  return (
    <BrowserRouter>

    
           
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <Dashboard_Skeleton />
        </div>
      }>
        
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={
            <MessagesProvider>
              <PlantDataProvider>
                <NotifPopup />
                <ValveProvider>
                  <ESP32Provider>
                    <ProtectedRoute allowedRoles={['admin', 'farmer']}>
                      <Dashboard />
                    </ProtectedRoute>
                  </ESP32Provider>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

         <Route path='/manage_plants' element={
            <MessagesProvider>
              <PlantDataProvider>
                 <NotifPopup />
                <ValveProvider>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Manage_Plants/>
                  </ProtectedRoute>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>
    
          <Route path='/users' element={
            <MessagesProvider>
              <PlantDataProvider>
                <NotifPopup />
                <ValveProvider>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Users />
                  </ProtectedRoute>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

          <Route path='/reports' element={
            <MessagesProvider>
              <PlantDataProvider>
                <NotifPopup />
                <ValveProvider>
                  <ProtectedRoute allowedRoles={['admin', 'farmer']}>
                    <Analytics />
                  </ProtectedRoute>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>


          <Route path='/irrigation_monitoring_logs' element={
            <MessagesProvider> 
              <PlantDataProvider>     
                <NotifPopup />
                <WateringLogProvider>
                    <ProtectedRoute allowedRoles={['admin', 'farmer']}>
                        <Irrigation_Monitoring_Logs/>
                    </ProtectedRoute>         
                </WateringLogProvider>       
              </PlantDataProvider>
            </MessagesProvider>
          }/>
          
          <Route path='/batch_history' element={
            <MessagesProvider>
              <PlantDataProvider>
                <NotifPopup />
                <ValveProvider>
                  <ProtectedRoute allowedRoles={['admin','superadmin']}>
                    <Batch_History />
                  </ProtectedRoute>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

          <Route path='/plants' element={
            <MessagesProvider> 
              <PlantDataProvider>
                <NotifPopup />
                <ValveProvider>
                  <ESP32Provider>
                    <ProtectedRoute allowedRoles={['admin', 'farmer']}>
                      <Plants />
                    </ProtectedRoute>
                  </ESP32Provider>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

          <Route path='/password_request' element={
            <MessagesProvider> 
              <PlantDataProvider>
                <NotifPopup />
                <ValveProvider>
                  <ESP32Provider>
                    <ProtectedRoute allowedRoles={['admin', 'farmer']}>
                     <PasswordRequests/>                  
                    </ProtectedRoute>
                  </ESP32Provider>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>


          <Route path='/user_guide' element={  
             <MessagesProvider>
              <PlantDataProvider>   
               <NotifPopup /> 
                <ProtectedRoute allowedRoles={['admin', 'farmer']}>
                  <UserGuide/>                  
                </ProtectedRoute>
              </PlantDataProvider>
            </MessagesProvider> 
          }/>
        

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}




export default App;