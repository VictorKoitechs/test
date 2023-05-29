import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import { StripeConfigContext } from "./context/stripe-config.context";
import { loadStripe } from "@stripe/stripe-js";
import { stripeApi } from "./api/stripe";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    stripeApi.getConfig().then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  return (
    <StripeConfigContext.Provider value={{ stripePromise }}>
      <ToastContainer />
      <div>
        <Navbar />
        <div style={{ margin: 20 }}>
          <Routes>
            <Route exact path="/" element={<RecordList />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/create" element={<Create />} />
          </Routes>
        </div>
      </div>
    </StripeConfigContext.Provider>
  );
};

export default App;
