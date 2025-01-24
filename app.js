const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: './config.env' });

const app = express();

// Middleware for security and logging
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
    if (err) {
        throw err;
    } else {
        console.log('Database successfully connected!');
    }
});

// API route to fetch a single random question
app.get('/netapi/random-question', (req, res) => {
    const selectSQL = `
        SELECT q.question_id, q.question, a.correct_answer, a.wrong_answer_one, a.wrong_answer_two, a.wrong_answer_three
        FROM question q
        JOIN question_answer qa ON q.question_id = qa.question_id
        JOIN answer a ON qa.answer_id = a.answer_id
        ORDER BY RAND()
        LIMIT 1
    `;

    db.query(selectSQL, (error, rows) => {
        if (error) {
            console.error('Error executing SQL query:', error);
            return res.status(500).json({ message: 'Error fetching question' });
        }
        if (rows.length > 0) {
            res.status(200).json({ status: 'success', data: rows[0] });
        } else {
            res.status(404).json({ status: 'failure', message: 'No question found' });
        }
    });
});

// Default route to serve the static HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
