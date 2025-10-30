// Import Express
const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory card collection
let cards = [
  { id: 1, suit: "Hearts", value: "King" },
  { id: 2, suit: "Spades", value: "Ace" },
  { id: 3, suit: "Diamonds", value: "Queen" },
];

// ✅ Home route
app.get("/", (req, res) => {
  res.send("🎴 Welcome to the Playing Card Collection API!");
});

// ✅ Get all cards
app.get("/cards", (req, res) => {
  res.json(cards);
});

// ✅ Get a card by ID
app.get("/cards/:id", (req, res) => {
  const card = cards.find(c => c.id === parseInt(req.params.id));
  if (!card) return res.status(404).json({ message: "Card not found" });
  res.json(card);
});

// ✅ Add a new card
app.post("/cards", (req, res) => {
  const { suit, value } = req.body;

  if (!suit || !value) {
    return res.status(400).json({ message: "Suit and value are required" });
  }

  const newCard = {
    id: cards.length > 0 ? cards[cards.length - 1].id + 1 : 1,
    suit,
    value,
  };

  cards.push(newCard);
  res.status(201).json({ message: "Card added successfully", card: newCard });
});

// ✅ Update an existing card
app.put("/cards/:id", (req, res) => {
  const { suit, value } = req.body;
  const card = cards.find(c => c.id === parseInt(req.params.id));

  if (!card) return res.status(404).json({ message: "Card not found" });

  if (suit) card.suit = suit;
  if (value) card.value = value;

  res.json({ message: "Card updated successfully", card });
});

// ✅ Delete a card
app.delete("/cards/:id", (req, res) => {
  const index = cards.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Card not found" });

  const deletedCard = cards.splice(index, 1);
  res.json({ message: "Card deleted successfully", deletedCard });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
