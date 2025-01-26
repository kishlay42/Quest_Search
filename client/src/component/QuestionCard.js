import React, { useState } from 'react';
import './QuestionCard.css';

const QuestionCard = ({ question, questionNumber }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const getOptionClass = (option) => {
    if (selectedOption === option) {
      return option.iscorrectanswer ? 'selected' : 'incorrect';
    }
    return '';
  };

  if (question.type === 'MCQ') {
    return (
      <div className="question-card">
        <h4>Question {questionNumber}</h4>
        
        <h3>{question.title}</h3>
        <p>{question.type}</p>
        <ul>
          {question.optionsList && question.optionsList.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              className={getOptionClass(option)}
            >
              {option.text}
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (question.type === 'ANAGRAM') {
    return (
      <div className="question-card">
        <h4>Question {questionNumber}</h4>
        <h3>{question.title}</h3>
        <p>{question.type}</p>
        <ul>
          {question.blocksList && question.blocksList.map((block, index) => (
            <li key={index}>{block.text}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="question-card">
        <h4>Question {questionNumber}</h4>
        <h3>{question.title}</h3>
        <p>{question.type}</p>
      </div>
    );
  }
};

export default QuestionCard;