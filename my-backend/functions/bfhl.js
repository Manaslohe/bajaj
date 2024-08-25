// functions/bfhl.js
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const USER_ID = "john_doe_17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

// GET endpoint: /bfhl
router.get('/', (req, res) => {
    res.status(200).json({
        "operation_code": 1
    });
});

// POST endpoint: /bfhl
router.post('/', (req, res) => {
    try {
        const data = req.body.data || [];

        if (!Array.isArray(data)) {
            return res.status(400).json({
                "is_success": false,
                "user_id": USER_ID,
                "error": "Input data must be an array."
            });
        }

        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));

        const lowercaseAlphabets = alphabets.filter(item => item === item.toLowerCase());
        const highestLowercase = lowercaseAlphabets.length > 0 ?
                                 String.fromCharCode(Math.max(...lowercaseAlphabets.map(char => char.charCodeAt(0)))) :
                                 null;

        const response = {
            "is_success": true,
            "user_id": USER_ID,
            "email": EMAIL,
            "roll_number": ROLL_NUMBER,
            "numbers": numbers,
            "alphabets": alphabets,
            "highest_lowercase_alphabet": highestLowercase ? [highestLowercase] : []
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            "is_success": false,
            "user_id": USER_ID,
            "error": "Internal Server Error"
        });
    }
});

// Use the router
app.use('/.netlify/functions/bfhl', router);

module.exports.handler = serverless(app);
