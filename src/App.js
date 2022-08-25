import { useEffect, useState } from 'react';
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home/Home';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
          
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;