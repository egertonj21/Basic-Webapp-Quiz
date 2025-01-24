document.addEventListener("DOMContentLoaded", () => {
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question');
    const answersContainer = document.getElementById('answers-container');
    const submitBtn = document.getElementById('submit-btn');
    const resultContainer = document.getElementById('result-container');
    const resultMessage = document.getElementById('result-message');
    const correctAnswerText = document.getElementById('correct-answer');
    const nextQuestionBtn = document.createElement('button');

    nextQuestionBtn.textContent = 'Next Question';
    nextQuestionBtn.style.display = 'none';
    nextQuestionBtn.style.marginTop = '10px';
    nextQuestionBtn.addEventListener('click', handleNextQuestion);
    resultContainer.appendChild(nextQuestionBtn);

    let currentQuestion = null;

    // Fetch a random question from the API
    function fetchQuestion() {
        fetch('/netapi/random-question')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    displayQuestion(data.data);
                } else {
                    questionContainer.innerHTML = '<p>Failed to load a question.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching question:', error);
                questionContainer.innerHTML = '<p>Error loading question.</p>';
            });
    }

    // Display the question and answers
    function displayQuestion(question) {
        currentQuestion = question;
        questionText.textContent = question.question;
        answersContainer.innerHTML = '';

        const answers = [
            question.correct_answer,
            question.wrong_answer_one,
            question.wrong_answer_two,
            question.wrong_answer_three,
        ];
        shuffleArray(answers);

        answers.forEach(answer => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.value = answer;

            label.appendChild(input);
            label.appendChild(document.createTextNode(answer));
            answersContainer.appendChild(label);
        });

        submitBtn.style.display = 'block';
        resultContainer.style.display = 'none';
        nextQuestionBtn.style.display = 'none';
    }

    // Handle answer submission
    submitBtn.addEventListener('click', () => {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');

        if (!selectedAnswer) {
            alert('Please select an answer!');
            return;
        }

        const isCorrect = selectedAnswer.value === currentQuestion.correct_answer;
        resultMessage.textContent = isCorrect ? 'Correct!' : 'Incorrect.';
        correctAnswerText.textContent = `Correct Answer: ${currentQuestion.correct_answer}`;

        submitBtn.style.display = 'none';
        resultContainer.style.display = 'block';
        nextQuestionBtn.style.display = 'block';
    });

    // Handle fetching the next question
    function handleNextQuestion() {
        fetchQuestion();
        nextQuestionBtn.style.display = 'none';
    }

    // Shuffle array utility
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Fetch the first question on page load
    fetchQuestion();
});
