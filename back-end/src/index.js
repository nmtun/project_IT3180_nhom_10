const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Test
app.get('/', (req, res) => {
    res.json({data: 'help'})
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 