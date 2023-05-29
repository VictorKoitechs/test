import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useStripeConfigContext } from "../context/stripe-config.context";
import { recordsApi } from "../api/records";
import { stripeApi } from "../api/stripe";

export default function Create() {
  const [paymentIntentIsFetched, setPaymentIntentIsFetched] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const { stripePromise } = useStripeConfigContext();
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    level: "",
    amount: 0,
  });

  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function createPaymentIntent() {
    await stripeApi
      .createPaymentIntent({ amount: form.amount })
      .then((res) => res.json())
      .then(({ clientSecret }) => setClientSecret(clientSecret));
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    let paymentId;

    if (form.amount > 0) {
      if (!clientSecret) {
        setPaymentIntentIsFetched(true);
        await createPaymentIntent();
        return;
      }

      const response = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/completion`,
        },
        redirect: "if_required",
      });

      if (response.error) {
        return;
      }

      paymentId = response.paymentIntent.id;
    }

    const newPerson = { ...form, paymentId };

    await recordsApi.create(newPerson).catch((error) => {
      window.alert(error);
      return;
    });

    setForm({ name: "", email: "", level: "" });
    navigate("/");
  }

  return (
    <div>
      <h3>Create New Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={form.email}
            onChange={(e) => updateForm({ email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionIntern"
              value="Intern"
              checked={form.level === "Intern"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionIntern" className="form-check-label">
              Intern
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionJunior"
              value="Junior"
              checked={form.level === "Junior"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionJunior" className="form-check-label">
              Junior
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionSenior"
              value="Senior"
              checked={form.level === "Senior"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionSenior" className="form-check-label">
              Senior
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            disabled={paymentIntentIsFetched}
            type="number"
            className="form-control"
            id="amount"
            value={form.amount}
            onChange={(e) => updateForm({ amount: e.target.valueAsNumber })}
          />
        </div>
        {clientSecret && stripePromise && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm onElements={setElements} onStripe={setStripe} />
          </Elements>
        )}
        <div className="form-group">
          <input
            disabled={paymentIntentIsFetched && !clientSecret}
            type="submit"
            value="Create person"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}

const CheckoutForm = ({ onStripe, onElements }) => {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe) {
      onStripe(stripe);
    }
    if (elements) {
      onElements(elements);
    }
  }, [stripe, elements]);

  return <PaymentElement id="payment-element" />;
};
