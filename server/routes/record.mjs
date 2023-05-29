import express from "express";
import db from "../db/conn.mjs";
import mongodb from "mongodb";
import { stripe } from "../stripe/index.mjs";
import { createPayout } from "../paypal/index.mjs";

const { ObjectId } = mongodb;

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("records");
    const results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (e) {
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (e) {
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    const { paymentId } = req.body;
    let payment;

    if (paymentId) {
      const data = await stripe.paymentIntents.retrieve(paymentId);
      payment = data;
    }

    const newDocument = {
      name: req.body.name,
      email: req.body.email,
      level: req.body.level,
      ...(payment && {
        amount: payment.amount,
      }),
    };

    const collection = await db.collection("records");
    const result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (e) {
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

router.post("/:id/payout", async (req, res) => {
  try {
    const collection = await db.collection("records");
    const query = { _id: new ObjectId(req.params.id) };
    const record = await collection.findOne(query);

    if (!record) res.status(404).send("Record not found");

    if (!record.amount) res.status(404).send("Amount not found");

    let payout;
    try {
      payout = await createPayout({
        email: record.email,
        amount: record.amount,
      });
    } catch (e) {
      res.status(400).send("PAYOUT ERROR");
    }

    res.status(200).send({ status: payout.batch_header.batch_status });
  } catch (e) {
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        level: req.body.level,
      },
    };

    const collection = await db.collection("records");
    const result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (e) {
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    const result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (e) {
    res.status(500).send({ message: "INTERNAL SERVER ERROR" });
  }
});

export default router;
