import { createContext, useContext, useState, useEffect } from "react";
import { listDoctors } from "../api/api";

const DoctorsContext = createContext<any>(null);

export const DoctorsProvider = ({ children }: { children: any }) => {
  const [doctors, setDoctors] = useState([]);

  async function loadDoctors() {
    const r = await listDoctors();
    if (r.ok) {
      setDoctors(r.body);
      return r.body;
    }
    return [];
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  return (
    <DoctorsContext.Provider value={{ doctors, loadDoctors }}>
      {children}
    </DoctorsContext.Provider>
  );
};

export const useDoctors = () => useContext(DoctorsContext);
