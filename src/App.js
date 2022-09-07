import React from 'react';
import { createContext, useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Generate from './components/Generate/Generate';
import Home from './components/Home/Home';
import Navbar from './components/Shared/Navbar/Navbar';

export const ALLLayerContext = createContext();
export const LayerContext = createContext();
export const GeneratedNFTContext = createContext();

const App = () => {
  const [allLayers, setAllLayers] = useState([]);
  // const [selectedLayer, setSelectedLayer] = useState('Background');
  const [selectedLayer, setSelectedLayer] = useState('checking');

  const [generatedNFT, setGeneratedNFT] = useState([]);


  return (
    <>
      <ALLLayerContext.Provider value={[allLayers, setAllLayers]}>
        <LayerContext.Provider value={[selectedLayer, setSelectedLayer]}>
          <GeneratedNFTContext.Provider value={[generatedNFT, setGeneratedNFT]}>
            <BrowserRouter>
            <Navbar></Navbar>
              <Routes>
                <Route path="/" element={<Home />}>
                </Route>
                <Route path="/home" element={<Home />}>
                </Route>
                <Route path="/generate" element={<Generate />}>
                </Route>
              </Routes>
            </BrowserRouter>
          </GeneratedNFTContext.Provider>
        </LayerContext.Provider>
      </ALLLayerContext.Provider>
    </>
  );
};

export default App;