import { createContext, useState, useEffect, useContext, useCallback } from "react";
import * as userService from "../data/userService";
import * as passwordRequestService from "../data/passwordResetsServices";

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [passwordRequests, setPasswordRequests] = useState([]); 
  const [allUsers, setAllUsers] = useState([]);
  const [skippedRegister, setSkippedRegister] = useState(false);

  useEffect(() => {
    loadUser();
    loadPasswordRequests();
  }, []);

  async function loadUser() {
    try {
      const loggedUser = await userService.fetchLoggedUser();
      setUser(loggedUser);
    } catch (err) {
      console.error("Error fetching logged user:", err);
    }
  }

  const loadPasswordRequests = useCallback(async () => {
    try {
      const res = await passwordRequestService.fetchPasswordRequestsAll()
      setPasswordRequests(res);
    } catch (err) {
      console.error("Error fetching password requests:", err);
    }
  }, []);



  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        allUsers,
        setAllUsers,
        skippedRegister,
        setSkippedRegister,
        passwordRequests,      
        setPasswordRequests,
        loadPasswordRequests,  
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};