const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//list of ideas GET.
router.get('/', (req, res) => {
    Idea
    .find({
        user: req.user.id
    })
    .sort({ date: 'desc' })
    .then(ideas => {
        res.render('ideas/index', {
            ideas: ideas
        });
    });
});

//GET: Add idea form
router.get('/add', (req, res) => {
    res.render('ideas/add');
});

//GET: Edit idea form
router.get('/edit/:id', (req, res) => {
    Idea
    .findOne({
        _id: req.params.id
    })
    .then(idea => {
        if (idea.user != req.user.id) {
            req.flash('error_msg', 'Unauthorised access!!');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
                idea: idea
            });
        }
    });
});

//Process add idea form data for ideas.
router.post('/', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please provide title.' });
    }

    if (!req.body.details) {
        errors.push({ text: 'Please provide details for your idea.' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newIdea = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newIdea)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea added');
                res.redirect('/ideas');
            });
    }
});

//Process Edit form PUT.
router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea updated');
            res.redirect('/ideas');
        });
    });
});

//Delete idea DELETE
router.delete('/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea deleted');
            res.redirect('/ideas');
        });
});

module.exports = router;