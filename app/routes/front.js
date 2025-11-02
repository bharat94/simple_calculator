const express = require('express');
const Calculation = require('./../models/Calculation');

const router = express.Router();

// Home page - render calculator UI
router.get('/', async (req, res) => {
    const history = await Calculation.find().sort({ created_at: -1 }).limit(100);
    res.render('todos', { history });
});

// POST /calculate - evaluate expression and save to history
router.post('/calculate', async (req, res) => {
    const expression = (req.body.expression || '').toString();

    // Basic sanitization: allow digits, operators, parentheses, dot, percent and spaces
    const normalized = expression.replace(/[×x]/g, '*').replace(/[÷]/g, '/');

    if (!/^[0-9+\-*/().%\s]+$/.test(normalized)) {
        const calc = new Calculation({ expression, result: 'Invalid input', isError: true });
        await calc.save();
        return res.json({ ok: false, error: 'Invalid characters in expression' });
    }

    try {
        // Handle percentages like 5% -> (5/100)
        const prepared = normalized.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

        // Evaluate in a safer sandbox using Function (still assume trusted environment)
        // Wrap in parentheses to allow expressions like "-3 + 5"
        const result = Function('"use strict"; return (' + prepared + ')')();

        const resultStr = (typeof result === 'number' && !Number.isNaN(result)) ? String(result) : String(result);
        const calc = new Calculation({ expression, result: resultStr, isError: false });
        await calc.save();

        res.json({ ok: true, result: resultStr, id: calc._id });
    } catch (err) {
        const calc = new Calculation({ expression, result: err.message, isError: true });
        await calc.save();
        res.json({ ok: false, error: err.message });
    }
});

// GET /history - return recent calculations
router.get('/history', async (req, res) => {
    const history = await Calculation.find().sort({ created_at: -1 }).limit(100);
    res.json({ ok: true, history });
});

// POST /history/clear - clear all history
router.post('/history/clear', async (req, res) => {
    await Calculation.deleteMany({});
    res.json({ ok: true });
});

// DELETE /history/:id - delete single history item
router.delete('/history/:id', async (req, res) => {
    const id = req.params.id;
    await Calculation.findByIdAndDelete(id);
    res.json({ ok: true });
});

module.exports = router;