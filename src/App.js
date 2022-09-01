import React from 'react';
import { createContext, useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home/Home';

export const ALLLayerContext = createContext();
export const LayerContext = createContext();

const App = () => {
  const [allLayers, setAllLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState('Background');


  return (
    <>
      <ALLLayerContext.Provider value={[allLayers, setAllLayers]}>
        <LayerContext.Provider value={[selectedLayer, setSelectedLayer]}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />}>
              </Route>
            </Routes>
          </BrowserRouter>
        </LayerContext.Provider>
      </ALLLayerContext.Provider>
    </>
  );
};

export default App;