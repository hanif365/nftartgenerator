import { createContext, useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home/Home';

export const LayerContext = createContext();

const App = () => {
  const [selectedLayer, setSelectedLayer] = useState('Background');

  return (
    <>
      <LayerContext.Provider value={[selectedLayer, setSelectedLayer]}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>

            </Route>
          </Routes>
        </BrowserRouter>
      </LayerContext.Provider>
    </>
  );
};

export default App;