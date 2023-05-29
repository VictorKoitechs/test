import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import stripe from "./routes/stripe.mjs";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use("/stripe/webhook", express.raw({ type: "*/*" }));
app.use(express.json());

app.use("/record", records);
app.use("/stripe", stripe);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
