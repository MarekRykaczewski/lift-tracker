import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api";

interface PreferencesContextType {
  preferredUnit: string;
  setPreferredUnit: React.Dispatch<React.SetStateAction<string>>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [preferredUnit, setPreferredUnit] = useState<string>("kg");

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

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};
