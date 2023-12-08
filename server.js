const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.DB_CONNECTION_STRING);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
console.log('Connected to MongoDB');
});

// Route pour retourner tous les utilisateurs
app.get('/users', async (req, res) => {
try {
const users = await User.find();
res.json(users);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

// Route pour ajouter un nouvel utilisateur à la base de données
app.post('/users', async (req, res) => {
const user = new User({
name: req.body.name,
email: req.body.email,
age: req.body.age
});

try {
const newUser = await user.save();
res.status(201).json(newUser);
} catch (err) {
res.status(400).json({ message: err.message });
}
});

// Route pour modifier un utilisateur par ID
app.put('/users/:id', async (req, res) => {
const userId = req.params.id;

try {
const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
    name: req.body.name,
    email: req.body.email,
    age: req.body.age
    },
    { new: true }
);

if (!updatedUser) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
}

res.json(updatedUser);
} catch (err) {
res.status(500).json({ message: err.message });
}
});

// Route pour supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
const userId = req.params.id;

try {
const deletedUser = await User.findByIdAndDelete(userId);

if (!deletedUser) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
}

res.json({ message: 'Utilisateur supprimé avec succès' });
} catch (err) {
res.status(500).json({ message: err.message });
}
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
