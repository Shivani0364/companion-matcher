const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // frontend serve karega

const users = []; // temporary memory storage

// ➕ POST /users — Save profile
app.post('/users', (req, res) => {
  const { name, age, interests } = req.body;

  // Basic validation
  if (!name || !age || !interests) {
    return res.status(400).json({ message: 'Missing data' });
  }

  // ✅ Duplicate name check (case insensitive)
  const existingUser = users.find(u => u.name.toLowerCase() === name.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ message: 'User with this name already exists' });
  }

  users.push({ name, age, interests });
  res.status(201).json({ message: 'User profile saved!', user: { name, age, interests } });
});

// 🔍 GET /matches/:username — Find 2+ common interest users
app.get('/matches/:username', (req, res) => {
  const username = req.params.username.toLowerCase();
  const currentUser = users.find(u => u.name.toLowerCase() === username);

  if (!currentUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  const matches = users.filter(user =>
    user.name !== currentUser.name &&
    user.interests.filter(i => currentUser.interests.includes(i)).length >= 2
  );

  res.json(matches);
});

// ▶️ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
