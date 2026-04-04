const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEMP DATA
let transactions = [
  { _id: "1", title: "Salary", amount: 5000, type: "income" },
  { _id: "2", title: "Food", amount: 1000, type: "expense" }
];

// GET
app.get("/api/transactions", (req, res) => {
  console.log("API HIT ✅");
  res.json(transactions);
});

// ADD
app.post("/api/transactions", (req, res) => {
  const newData = {
    _id: Date.now().toString(),
    ...req.body
  };
  transactions.push(newData);
  res.json(newData);
});

// DELETE
app.delete("/api/transactions/:id", (req, res) => {
  transactions = transactions.filter(t => t._id !== req.params.id);
  res.json({ message: "Deleted" });
});

// SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});