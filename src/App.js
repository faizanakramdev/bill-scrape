import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "./config/routes";
import ApiRequest from "./components/Home/Home";

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path={routes.home} element={<ApiRequest/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
