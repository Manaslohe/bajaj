const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// User Details (replace with actual values)
const USER_ID = "john_doe_17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

// GET endpoint: /bfhl
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        "operation_code": 1
    });
});

// POST endpoint: /bfhl
app.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data || [];
        const numbers = data.filter(item => !isNaN(item));
        const alphabets = data.filter(item => isNaN(item));
        
        // Find the highest lowercase alphabet
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
        res.status(400).json({
            "is_success": false,
            "error": error.message
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
