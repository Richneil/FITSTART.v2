import express from 'express';
import { GLOSSARY_TERMS } from '../data/glossary.js';

const router = express.Router();

// GET /glossary - Public endpoint
router.get('/', (req, res) => {
  res.json({
    glossary: GLOSSARY_TERMS
  });
});

export default router;
