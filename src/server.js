const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const app = express();

connectDB();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/chats', require('./routes/chat_router'));
app.use('/api/messages', require('./routes/message_router'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


