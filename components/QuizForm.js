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
  const [topicError, setTopicError] = useState(null);
  const [gradeError, setGradeError] = useState(null);
  const [questionsError, setQuestionsError] = useState(null);

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
        const filteredCategories = response.data.trivia_categories.filter((category) =>
          quizTopics.includes(category.name)
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const validateForm = () => {
    let isValid = true;
    if (!topic) {
      setTopicError('Please select a topic');
      isValid = false;
    } else {
      setTopicError(null);
    }
    if (!grade || grade < 1 || grade > 12) {
      setGradeError('Please enter a grade between 1 and 12');
      isValid = false;
    } else {
      setGradeError(null);
    }
    if (!questions || questions < 1 || questions > 50) {
      setQuestionsError('Please enter a valid number of questions (1 to 50)');
      isValid = false;
    } else {
      setQuestionsError(null);
    }
    return isValid;
  };

  const getDifficulty = (grade) => {
    if (grade >= 1 && grade <= 3) return 'easy';
    if (grade >= 4 && grade <= 6) return 'medium';
    if (grade >= 7) return 'hard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const difficulty = getDifficulty(grade);
    try {
      const response = await axios.get('https://opentdb.com/api.php', {
        params: {
          amount: questions,
          category: topic,
          difficulty: difficulty,
          type: 'multiple',
        },
      });
      console.log(response.data.results);
      setQuizData(response.data.results);
      setQuizGenerated(true);
      setUserAnswers(Array(response.data.results.length).fill(null));
      setIsFormSubmitted(true);
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
      alert('Please select an option for all questions');
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

  console.log('score', score);

  return (
    <div className="landing-container">
      <img src="/quiz.gif" alt="Animated GIF" className="gif-background" />
      <div>
        {/* Show the form if the quiz isn't generated yet */}
        {!quizGenerated ? (
          <form onSubmit={handleSubmit} className="form-container">
            <h1
              className="landing-title mb-5"
              style={{ textAlign: 'center' }}
            >
              AI Quiz Generator
            </h1>
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="form-label">
                  Topic (Subject):
                </label>
                <
                  select
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Topic</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {topicError && (
                  <p style={{ color: 'red', fontSize: '18px', fontFamily: 'cursive' }}>
                    {topicError}
                  </p>
                )}
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
                  className="form-input"
                />
                {gradeError && (
                  <p style={{ color: 'red', fontSize: '18px', fontFamily: 'cursive' }}>
                    {gradeError}
                  </p>
                )}
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
                  className="form-input"
                />
                {questionsError && (
                  <p style={{ color: 'red', fontSize: '18px', fontFamily: 'cursive' }}>
                    {questionsError}
                  </p>
                )}
              </div>
              <button type="submit" className="form-submit">
                {loading ? 'Loading...' : 'Generate Quiz'}
              </button>
            </div>
          </form>
        ) : (
          <div className="quiz-container" style={{ width: '100%' }}>
            <h2
              className="text-xl font-bold mt-5 mb-4"
              style={{ textAlign: 'center' }}
            >
              Quiz Questions
            </h2>
            {score !== null && (
              <div
                className="score-container"
                style={{ textAlign: 'right', marginBottom: '20px' }}
              >
                <h3>
                  Your Score: {score} / {quizData.length}
                </h3>
              </div>
            )}
            <div
              style={{
                height: quizData.length === 0 ? '300px' : '500px',
                overflowY: 'auto',
                width: quizData.length === 0 ? '500px' : '',
              }}
            >
              <form>
                {quizData.length === 0 ? (
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    No quiz data found.
                  </p>
                ) : (
                  quizData.map((question, index) => (
                    <div key={index} className="mb-4">
                      <p className="quiz-question">
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {index + 1}:
                        </span>
                        {he.decode(question.question)}
                      </p>
                      <div className="quiz-answer-options">
                        {question.incorrect_answers
                          .concat(question.correct_answer)
                          .map((answer, idx) => (
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
                                      : userAnswers[index] === answer &&
                                        answer !== question.correct_answer
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
                <div
                  className="button-container"
                  style={{
                    marginTop: quizData.length === 0 ? '150px' : '20px',
                    marginLeft: quizData.length === 0 ? '150px' : '',
                  }}
                >
                  {quizData.length !== 0 && score === null && (
                    <button
                      type="button"
                      onClick={handleQuizSubmit}
                      className="quiz-button px-4 py-2 mr-5 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 transition duration-300"
                    >
                      Submit Quiz
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setQuizGenerated(false);
                      setScore(null);
                      setUserAnswers([]);
                      setTopic('');
                      setGrade('');
                      setQuestions('');
                    }}
                    className="quiz-button px-4 py-2 bg-red-500 text-white font-semibold rounded shadow hover:bg-gray-600 transition duration-300"
                  >
                    Back to Main Menu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizForm;
