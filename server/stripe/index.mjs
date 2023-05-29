import connectStripe from "stripe";

export const stripe = connectStripe(process.env.STRIPE_SECRET_KEY, {});
