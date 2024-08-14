const express = require('express');
const Task = require('../models/task');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, creator: req.user._id });
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/tasks', auth, async (req, res) => {
  const match = {};
  const options = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  if (req.query.limit) {
    options.limit = parseInt(req.query.limit);
  }

  if (req.query.skip) {
    options.skip = parseInt(req.query.skip);
  }

  if (req.query.sortBy) {
    const sort = {};
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    options.sort = sort;
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options,
    });

    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, creator: req.user._id });
    if (!task) {
      return res.status(404).send();
    } else {
      res.send(task);
    }
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: 'There are no such tasks.' });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      creator: req.user._id,
    });
    // const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => {
      task[update] = req.body[update];
    });

    await task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      id: req.params.id,
      creator: req.user.id,
    });

    if (!task) {
      res.status(404).send();
    }

    res.send('Deleted!');
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
