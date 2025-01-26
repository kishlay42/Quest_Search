import React, { useState } from 'react';
import { getQuestions } from './grpcClient';
import QuestionCard from './component/QuestionCard';
import Header from './component/header';
import BackToTop from './component/BackToTop';
import './App.css';
import LoadingIndicator from './component/LoadingIndicator';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchQuestions = async (newType = type) => {
    if (!title.trim()) {
      setError('Title cannot be empty');
      toast.error('Title cannot be empty');
      return;
    }
    setLoading(true);
    setQuestions([]); // Clear old information
    try {
      getQuestions(title, newType, (err, response) => {
        if (err) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setQuestions(response.questionsList);
          setError(null);
          if (response.questionsList.length === 0) {
            toast.info(`Sorry, no content available for "${title}".`);
          }
        }
        setLoading(false);
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    fetchQuestions();
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
    fetchQuestions();
  };

  const handlePageClick = (pageNumber) => {
    setPage(pageNumber);
    fetchQuestions();
  };

  const handleTabClick = (tabValue) => {
    setType(tabValue);
    fetchQuestions(tabValue);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (error) {
      setError(null);
    }
  };

  const totalPages = Math.ceil(questions.length / pageSize);
  const paginatedQuestions = questions.slice((page - 1) * pageSize, page * pageSize);

  const renderPagination = () => {
    const pages = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageClick(1)} disabled={page === 1}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => handlePageClick(i)} disabled={page === i}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageClick(totalPages)} disabled={page === totalPages}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const renderTabs = () => {
    const tabs = [
      { name: 'All', value: null },
      { name: 'MCQ', value: 'MCQ' },
      { name: 'Anagram', value: 'ANAGRAM' },
      { name: 'Read Along', value: 'READ_ALONG' },
      { name: 'Content Only', value: 'CONTENT_ONLY' },
    ];

    return (
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => handleTabClick(tab.value)}
              className={type === tab.value ? 'active' : ''}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Header />
      <div className="search-container">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter title"
        />
        <button className="search-button" onClick={fetchQuestions}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M10 2a8 8 0 105.293 14.707l5 5a1 1 0 001.414-1.414l-5-5A8 8 0 0010 2zm0 2a6 6 0 110 12A6 6 0 0110 4z" />
          </svg>
        </button>
      </div>
      {renderTabs()}
      {loading && <LoadingIndicator />}
      <ToastContainer />
      <div className="question-list">
        {paginatedQuestions.map((question, index) => (
          <QuestionCard key={question.siblingid} question={question} questionNumber={(page - 1) * pageSize + index + 1} />
        ))}
      </div>
      {questions.length > 0 && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={page === 1}>&laquo;</button>
          {renderPagination()}
          <button onClick={handleNextPage} disabled={page === totalPages}>&raquo;</button>
        </div>
      )}
      <BackToTop />
    </div>
  );
};

export default App;