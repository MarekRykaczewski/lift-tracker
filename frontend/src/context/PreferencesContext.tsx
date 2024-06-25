import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [preferredUnit, setPreferredUnit] = useState("kg");

  useEffect(() => {
    api
      .get("/api/user/profile/")
      .then((response) => {
        setPreferredUnit(response.data.preferred_unit);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  return (
    <PreferencesContext.Provider value={{ preferredUnit, setPreferredUnit }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  return useContext(PreferencesContext);
};
