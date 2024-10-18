const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const path = require('path');

// Database setup
//const db = new sqlite3.Database(':memory:');
const db = require('./database');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use('/', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, '../public')));


//app.use('/', path.join(__dirname, 'public'));


// Sample table creation
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, number TEXT)');
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint to view data
app.get('/view-data', (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error fetching data");
        }
        let tableRows = rows.map(row => `
            <tr>
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.email}</td>
                <td>${row.number}</td>
            </tr>
        `).join('');
        
        const tableHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Data Viewer</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h1>Submitted User Data</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        res.send(tableHTML);
    });
});

// Endpoint to submit form data (same as before)
app.post('/submit-form', (req, res) => {
    const { name, email, number } = req.body;
    if (!name || !email || !number) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    db.run('INSERT INTO users (name, email, number) VALUES (?, ?, ?)', [name, email, number], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Form submitted successfully' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
