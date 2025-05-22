import express from 'express';
import { supabase } from '../db.js';
import { summarizeTodos } from '../services/llm.js';
import { sendToSlack } from '../services/slack.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const { data, error } = await supabase
    .from('todos')
    .insert([{ title }]) 
    .select(); 

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .select(); 

  if (error) return res.status(500).json({ error: error.message });

  if (data.length === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json({ success: true, deleted: data[0] });
});

router.post('/summarize', async (req, res) => {
  const { data: todos } = await supabase.from('todos').select('*');
  const pendingTodos = todos.map(t => `- ${t.title}`).join('\n');

  try {
    const summary = await summarizeTodos(pendingTodos);
    const slackRes = await sendToSlack(summary);
    res.json({ success: true, summary, slackRes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
