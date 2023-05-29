const createPaymentIntent = ({ amount }) => {
  return fetch("http://localhost:5050/stripe/create-payment-intent", {
    body: JSON.stringify({ amount }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getConfig = () => {
  return fetch("http://localhost:5050/stripe/config");
};

export const stripeApi = { createPaymentIntent, getConfig };
