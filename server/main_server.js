const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const https = require('https');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Load and parse the YAML configuration
const configFile = fs.readFileSync('./config/creds.yaml', 'utf8');
const config = yaml.load(configFile);

// SSL configurations
const privateKey = fs.readFileSync('../secrets/key.pem', 'utf8');
const certificate = fs.readFileSync('../secrets/cert.pem', 'utf8');
const credentials = { 
    key: privateKey, 
    cert: certificate, 
    passphrase: config.SSL_certificate.passphrase
};

// AWS PostgreSQL connection configuration using values from the YAML file
const pool = new Pool({
    user: config.postgres_aws_db.username,
    host: config.postgres_aws_db.host,
    database: config.postgres_aws_db.db_name,
    password: config.postgres_aws_db.password,
    port: config.postgres_aws_db.port,
    ssl: {
        rejectUnauthorized: false
    }
});

// Use the cors middleware to enable CORS
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// sends the main webpage data
// console.log(path.join(__dirname, '/public/html/main_index.html'))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/main_index.html'));
});

app.get('/textbooks', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/main_index.html'));
});

app.get('/textbook_data', (req, res) => {
    pool.query("SELECT * FROM textbooks", (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch textbooks." });
        }
        res.json(result.rows);
    });
});

app.get('/chapters', (req, res) => {
    const textbookId = req.query.textbook_id;
    if (!textbookId) {
        return res.status(400).json({ error: "textbook_id is required." });
    }
    pool.query("SELECT * FROM chapters WHERE textbook_id = $1", [textbookId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch chapters." });
        }
        res.json(result.rows);
    });
});

app.get('/game_options', async (req, res) => {
    const chapterId = req.query.chapter_id;
    if (!chapterId) {
        return res.status(400).send('Chapter ID is required');
    }

    // Fetch chapter title
    pool.query("SELECT chapter_title FROM chapters WHERE chapter_id = $1", [chapterId], async (err, result) => {
        if (err || !result.rows.length) {
            return res.status(500).send('Failed to fetch chapter details');
        }

        const chapterTitle = result.rows[0].chapter_title;

        try {
            fileContent = await fsPromises.readFile(path.join(__dirname, '/public/html/game_options.html'), 'utf8');
            
            // Inject chapter title and ID into the HTML before sending
            fileContent = fileContent.replace('<h1 id="chapterTitle">Select a Game</h1>', `<h1>Select the game for the chapter: ${chapterTitle}</h1>`);
            res.send(fileContent);
        } catch (error) {
            console.error("Error reading the file:", error);
            res.status(500).send('Failed to load the game options page');
        }
    });
});

// Add routes to serve the CSS and JS files
app.get('/game_options.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/css/game_options.css'));
});

app.get('/game_options.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/js/game_options.js'));
});

app.get('/quiz', async (req, res) => {
    const chapterId = req.query.chapter_id;
    try {
        const result = await pool.query(
            "SELECT question_id, question, answer FROM question_answers WHERE chapter_id = $1 ORDER BY RANDOM() LIMIT 5",
            [chapterId]
        );

        const questions = result.rows.map(row => row.question);
        const answers = result.rows.map(row => row.answer);
  
        const questionsWithOptions = result.rows.map(row => {
            // Remove the correct answer from the choices
            const otherOptions = answers.filter(answer => answer !== row.answer);
            
            // Randomly pick 3 other options
            const randomOptions = [];
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * otherOptions.length);
                randomOptions.push(...otherOptions.splice(randomIndex, 1));
            }

            // Merge the correct answer with the 3 other options and shuffle them
            const allOptions = [row.answer, ...randomOptions].sort(() => Math.random() - 0.5);

            return {
                text: row.question,
                options: allOptions
            };
        });

        // Send the first question and its options to the EJS view for rendering
        res.render('quiz', {
            currentQuestionText: questionsWithOptions[0].text,
            currentOptions: questionsWithOptions[0].options,
            questionStates: Array(5).fill('unanswered')
        });
    }
    catch (err) {
      console.error('Error querying the database', err.stack);
      res.status(500).send('Server error');
    }
  });
  
  // Add routes to serve the CSS and JS files for the quiz
  app.get('/quiz.css', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/css/quiz.css'));
  });
  
  app.get('/quiz.js', (req, res) => {
      res.sendFile(path.join(__dirname, '/public/js/quiz.js'));
  });

app.use(express.static(__dirname));

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
