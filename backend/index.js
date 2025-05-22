import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/todos', todoRoutes);
app.post('/summarize', todoRoutes); // same controller handles this

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
