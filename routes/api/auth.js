const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');


const { check, validationResult } = require('express-validator')

//@route    GET api/Auth
//@desc     Auth route
//@access   Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});


//@route    POST api/auth
//@desc     Authenticate User & get token route
//@access   Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        //If user not Exists return an error.
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
        }

        //Return JasonWebToken.
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 3600000 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});



module.exports = router;