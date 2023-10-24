let score = 0;
let questions = [];
let currentQuestionIndex = 0;

function getChapterIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('chapter_id');
}

function fetchQuestions(chapter_id) {
    fetch(`/get_questions/${chapter_id}`)
    .then(response => response.json())
    .then(data => {
        questions = data;
        displayQuestion();
    });
}

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        let q = questions[currentQuestionIndex];
        let options = [...questions].sort(() => 0.5 - Math.random()).slice(0, 3).map(item => item[2]);
        if (!options.includes(q[2])) {
            options[Math.floor(Math.random() * 3)] = q[2];
        }
        
        let questionHtml = `<h3>${q[1]}</h3>`;
        options.forEach((option, index) => {
            questionHtml += `<button onclick="checkAnswer('${option}', '${q[2]}')">${option}</button><br>`;
        });

        document.getElementById('questionDiv').innerHTML = questionHtml;
    } else {
        alert("You've answered all questions correctly!");
    }
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        score++;
        document.getElementById('score').innerText = score;
        currentQuestionIndex++;
        displayQuestion();
    } else {
        alert("Incorrect answer!");
        document.getElementById('questionDiv').querySelectorAll('button').forEach(btn => {
            if (btn.innerText === correct) {
                btn.classList.add('correct');
            } else if (btn.innerText === selected) {
                btn.classList.add('incorrect');
            }
        });
        setTimeout(() => {
            currentQuestionIndex++;
            displayQuestion();
        }, 2000);
    }
}

const chapterId = getChapterIdFromUrl();
if (chapterId) {
    fetchQuestions(chapterId);
} else {
    alert("Invalid chapter selection!");
}