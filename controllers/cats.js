const Cat = require('../models/cat');
const checkAuth = require('../middleware/checkAuth');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    app.get('/cats/new', (req, res) => {
        res.render('cats-new')
    });

    app.post('/cats/new', checkAuth, (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'You must be logged in to create a cat!' });
        }
        const cat = new Cat(req.body);
        cat.owner = req.user._id;
        cat
            .save()
            .then(cat => {
                return User.findById(req.user._id);
            })
            .then(user => {
                user.cats.unshift(cat);
                user.save();
                res.redirect(`/cats/${cat._id}`);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('An error occurred while saving the cat.'); // Internal Server Error
            });
    });

    app.get('/cats', (req, res) => {
        Cat.find()
            .then(cats => {
                res.json(cats);
            })
            .catch(err => {
                console.log(err);
            });
    });

    app.get('/cats/:id', checkAuth, async (req, res) => {
        const cat = await Cat.findById(req.params.id)
        if (!req.user || req.user._id != cat.owner) {
            return res.status(401).send({ message: 'You must be logged in as the owner to view this cat.' });
        }
        return res.json({ cat });
    });

    app.put('/cats/:id', checkAuth, async (req, res) => {
        const cat = await Cat.findById(req.params.id)
        if (!req.user || req.user._id != cat.owner) {
            return res.status(401).send({ message: 'You must be logged in as the owner to edit this cat.' });
        }
        cat.set(req.body);
        cat
            .save()
            .then(cat => {
                res.json(cat);
            })
    });

    app.delete('/cats/:id', checkAuth, async (req, res) => {
        const cat = await Cat.findById(req.params.id)
        if (!req.user || req.user._id != cat.owner) {
            return res.status(401).send({ message: 'You must be logged in as the owner to delete this cat.' });
        }
        Cat.findByIdAndRemove(req.params.id)
            .then(cat => {
                res.redirect('/');
            })
    });
}; 