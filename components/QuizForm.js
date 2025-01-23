'use client'; // Client-side component
import he from 'he';
import { useState, useEffect } from 'react';
import axios from 'axios';
// Import the CSS file
import '../styles/style.css';

const QuizForm = () => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('');
  const [questions, setQuestions] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quizGenerated, setQuizGenerated] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const quizTopics = [
    'Science',
    'Math',
    'History',
    'Geography',
    'Technology',
    'Literature',
    'Sports',
    'Art',
    'Music',
    'Animals',
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        const filteredCategories = response.data.trivia_categories.filter(
          (category) => quizTopics.includes(category.name)
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let difficulty = '';
    if (grade >= 1 && grade <= 3) difficulty = 'easy';
    if (grade >= 4 && grade <= 6) difficulty = 'medium';
    if (grade >= 7) difficulty = 'hard';
    try {
      const response = await axios.get('https://opentdb.com/api.php', {
        params: {
          amount: questions,
          category: topic,
          difficulty: difficulty,
          type: 'multiple', // multiple-choice questions
        },
      });
      console.log(response.data.results); // Log the quiz data to debug
      setQuizData(response.data.results);
      setQuizGenerated(true);
      setUserAnswers(Array(response.data.results.length).fill(null)); // Initialize answers array
      setIsFormSubmitted(true); // Set form submission to true
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
    setLoading(false);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  const handleQuizSubmit = () => {
    if (userAnswers.includes(null)) {
      alert("Please select an option for all questions");
      return;
    }
    let userScore = 0;
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        userScore++;
      }
    });
    setScore(userScore);
  };

  return (
    <div className="landing-container">
      <img src="/quiz.gif" alt="Animated GIF" className="gif-background" />
      <div>
        {/* Show the form if the quiz isn't generated yet */}
        {!quizGenerated ? (
          <form onSubmit={handleSubmit} className="form-container">
            <h1 className="landing-title mb-5" style={{ textAlign: 'center' }}>
              AI Quiz Generator
            </h1>
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="form-label">
                  Topic (Subject):
                </label>
                <select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                  className="form-input"
                >
                  <option value="">Select Topic</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="grade" className="form-label">
                  Grade:
                </label>
                <input
                  type="number"
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div>
              <label htmlFor="questions" className="form-label">
                Number of Questions:
              </label>
              <input
                type="number"
                id="questions"
                value={questions}
                onChange={(e) => setQuestions(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <button type="submit" className="form-submit">
              {loading ? 'Loading...' : 'Generate Quiz'}
            </button>
          </div>
        </form>
      ) : (
        <div className="quiz-container" style={{ width: "100%" }}>
             <h2 className="text-xl font-bold mt-5 mb-4" style={{ textAlign: "center" }}>
            Quiz Questions
          </h2>
          {score !== null && (
            <div className="score-container"  style={{
                textAlign: "right",
                marginBottom: "20px",
              }}>
              <h3>Your Score: {score} / {quizData.length}</h3>
            </div>
          )}
         <div style={{ height: "500px", overflowY: "auto" }}>
          <form>
            {quizData.length === 0 ? (
              <p>No quiz data found.</p>
            ) : (
              quizData.map((question, index) => (
                <div key={index} className="mb-4">
                  <p className="quiz-question">{he.decode(question.question)}</p>
                  <div className="quiz-answer-options">
                    {question.incorrect_answers.concat(question.correct_answer).map((answer, idx) => (
                      <label key={idx} className="quiz-answer-label">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={answer}
                          checked={userAnswers[index] === answer}
                          onChange={() => handleAnswerChange(index, answer)}
                          className="mr-2"
                        />
                        <span
                          className={
                            score !== null
                            ? answer === question.correct_answer
                            ? 'correct-answer'
                            : userAnswers[index] === answer && answer !== question.correct_answer
                            ? 'incorrect-answer'
                            : ''
                          : ''
                          }
                        >
                          {answer}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
              ))
            )}
             </form>
             </div>
             {score === null ? (
      <button type="button" onClick={handleQuizSubmit} className="form-submit">
        Submit Quiz
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          setQuizGenerated(false);
          setScore(null);
          setUserAnswers([]);
        }}
        className="form-submit"
      >
        Back to Main Menu
      </button>
          )}
        </div>
      )}
    </div>
  </div>

  );
};

export default QuizForm;