// Extract chapterId from the URL
const urlParams = new URLSearchParams(window.location.search);
const chapterId = urlParams.get('chapter_id');

// let quiz_data = [];
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

// When the page loads
window.onload = async function() {
    await fetchQuestions();
    displayQuestion();
    document.querySelector('.option-container').addEventListener('click', checkAnswer);
};

async function fetchQuestions() {
    try {
        const response = await fetch(`/quiz-data?chapter_id=${chapterId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! for fetch textbooks - Status: ${response.status}`);
        }
        const data = await response.json();
        questions = transformData(data);
    } catch (error) {
        console.error("Failed to fetch questions:", error);
    }
}

function transformData(data) {
    return data.map((questionData) => {
        // Get all answers except for the current question's answer.
        const otherAnswers = data.filter(item => item.question_id !== questionData.question_id)
                                  .map(item => item.answer);
        
        // Shuffle the other answers array and pick the first 3 for options add the answer and shuffle again
        const shuffledAnswers = shuffleArray([questionData.answer, ...shuffleArray(otherAnswers).slice(0, 3)]);
        // console.log(shuffledAnswers)
        
        return {
            question: questionData.question,
            options: shuffledAnswers, // spread the 3 other options
            answerIndex: shuffledAnswers.indexOf(questionData.answer)
        }
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}


function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        // You can handle the end of the quiz here. For now, just alert the user.
        alert(`Quiz finished! Your score is: ${score}/5`);
        return;
    }
    document.querySelector('.current-question').innerText = currentQuestionIndex + 1;
    const question = questions[currentQuestionIndex];
    document.querySelector('.question-window').innerText = question.question;
    document.querySelectorAll('.option').forEach((optionElement, index) => {
        optionElement.innerText = question.options[index];
    });
}

function checkAnswer(event) {
    const selectedOptionIndex = parseInt(event.target.getAttribute('data-index'));
    const correctAnswerIndex = questions[currentQuestionIndex].answerIndex;
    const currentCircle = document.querySelectorAll('.progress .circle')[currentQuestionIndex];

    if (selectedOptionIndex === correctAnswerIndex) {
        score++;
        document.querySelector('.feedback').innerText = 'Correct!';
        document.querySelector('.score').innerText = score;
        currentCircle.classList.add('correct');
    } else {
        document.querySelector('.feedback').innerText = 'Incorrect!';
        currentCircle.classList.add('incorrect');
    }
    currentQuestionIndex++;
    // Wait for 1 second and then show the next question
    setTimeout(() => {
        document.querySelector('.feedback').innerText = '    ';
        displayQuestion();
    }, 1000);
}