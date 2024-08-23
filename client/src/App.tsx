import { useRoutes } from "react-router-dom";
import "./App.css";
import routes from "./Route/route";
import { createContext, useState } from "react";

const GlobalContext = createContext<any>([]);

function App() {
  const [protographers, setPhographers] = useState<any>([]);
  const [artWork, setArtWork] = useState<any>([]);
  const [user, setUser] = useState<any>([]);
  const element = useRoutes(routes);
  return (
    <GlobalContext.Provider value={{ protographers, setPhographers }}>
      <div>{element}</div>
    </GlobalContext.Provider>
  );
}

export default App;
