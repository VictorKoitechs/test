import { createContext, useContext } from "react";

export const StripeConfigContext = createContext({
  stripePromise: null,
});

export const useStripeConfigContext = () => useContext(StripeConfigContext);
