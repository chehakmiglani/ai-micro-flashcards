import React, { useEffect, useState } from "react";
import {
  getFlashcards,
  createFlashcard,
  // updateFlashcard, // not used here
  deleteFlashcard,
  generateFlashcards,
} from "./api";
import { Link } from "react-router-dom";
import "./App.css";
import { FaEdit, FaTrash } from "react-icons/fa";

function Flashcard({ card, onEdit, onDelete }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") setFlipped((f) => !f);
        if (e.key === "Delete") onDelete(card.id);
      }}
    >
      {/* If you later want a 3D flip, wrap front/back in .flashcard-inner and add transforms */}
      <div className="flashcard-front">
        <div className="flashcard-question">{card.question}</div>
        <div className="flashcard-topic">{card.topic || "General"}</div>
      </div>
      <div className="flashcard-back">
        <div className="flashcard-answer">{card.answer}</div>
      </div>

      <div className="flashcard-actions">
        <button
          className="icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card.id);
          }}
          title="Edit"
        >
          <FaEdit />
        </button>
        <button
          className="icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          title="Delete"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [topic, setTopic] = useState("General");
  const [topics, setTopics] = useState(["General"]);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [aiTopic, setAiTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Test Mode
  const [testMode, setTestMode] = useState(false);
  const [testIndex, setTestIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, []);

  async function fetchFlashcards() {
    try {
      const data = await getFlashcards();
      setFlashcards(data);
      const uniqueTopics = Array.from(
        new Set(["All", ...data.map((c) => c.topic || "General")])
      );
      setTopics(uniqueTopics);
    } catch {
      setError("Failed to load flashcards");
    }
  }

  const filteredCards =
    selectedTopic === "All"
      ? flashcards
      : flashcards.filter((c) => (c.topic || "General") === selectedTopic);

  async function handleCreate() {
    if (!question.trim() || !answer.trim()) return;
    try {
      const created = await createFlashcard(
        question.trim(),
        answer.trim(),
        topic || "General"
      );
      setFlashcards((prev) => [...prev, created]);
      setQuestion("");
      setAnswer("");
      if (!topics.includes(created.topic || "General")) {
        setTopics((prev) => [...prev, created.topic || "General"]);
      }
    } catch {
      setError("Failed to create flashcard");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteFlashcard(id);
      setFlashcards((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("Failed to delete flashcard");
    }
  }

  async function handleGenerateAI() {
    if (!aiTopic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const generated = await generateFlashcards(aiTopic.trim());
      for (const qa of generated) {
        const created = await createFlashcard(
          qa.question,
          qa.answer,
          aiTopic.trim()
        );
        setFlashcards((prev) => [...prev, created]);
      }
      if (!topics.includes(aiTopic.trim())) {
        setTopics((prev) => [...prev, aiTopic.trim()]);
      }
      setAiTopic("");
    } catch {
      setError("Generation failed");
    } finally {
      setLoading(false);
    }
  }

  function startTest() {
    setTestMode(true);
    setTestIndex(0);
    setShowAnswer(false);
  }
  function exitTest() {
    setTestMode(false);
    setShowAnswer(false);
  }
  function nextCard() {
    setTestIndex((i) => Math.min(i + 1, filteredCards.length - 1));
  }
  function prevCard() {
    setTestIndex((i) => Math.max(i - 1, 0));
  }

  // Test Mode UI
  if (testMode) {
    const card = filteredCards[testIndex];
    return (
      <div className="container">
        <header className="test-header">
          <h2>AI Micro-Flashcards — Test Mode</h2>
          <p>
            Card {testIndex + 1} of {filteredCards.length}
          </p>
          <Link to="/dashboard" className="btn-link">
            Dashboard
          </Link>
        </header>

        <div className="test-card">
          <div className="test-question">
            <h3>Question</h3>
            <p>{card?.question}</p>
          </div>
          {showAnswer && (
            <div className="test-answer">
              <h3>Answer</h3>
              <p>{card?.answer}</p>
            </div>
          )}
        </div>

        <div className="test-controls">
          <div className="test-navigation">
            <button className="btn" onClick={prevCard} disabled={testIndex === 0}>
              Prev
            </button>
            <button className="btn" onClick={() => setShowAnswer((s) => !s)}>
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
            <button
              className="btn"
              onClick={nextCard}
              disabled={testIndex === filteredCards.length - 1}
            >
              Next
            </button>
          </div>
          <button className="btn cancel" onClick={exitTest}>
            Exit
          </button>
        </div>
      </div>
    );
  }

  // Main App UI
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">AI Micro-Flashcards</h1>
        <Link to="/dashboard" className="btn-link">
          Dashboard
        </Link>
      </header>

      {error && <div className="error">{error}</div>}

      <section className="controls">
        <div className="card-form">
          <input
            className="input"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <input
            className="input"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <input
            className="input"
            placeholder="Topic (optional)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button className="btn" onClick={handleCreate}>
            Add Card
          </button>
        </div>

        <div className="card-form">
          <input
            className="input"
            placeholder="Generate topic with AI"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
          />
          <button className="btn" onClick={handleGenerateAI} disabled={loading}>
            {loading ? "Generating…" : "AI Generate"}
          </button>
        </div>

        <div className="topic-selector">
          <label>Topic:</label>
          <select
            className="input"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button className="btn" onClick={startTest} disabled={filteredCards.length === 0}>
            Start Test
          </button>
        </div>
      </section>

      <section className="flashcard-list">
        {filteredCards.map((card) => (
          <Flashcard key={card.id} card={card} onEdit={() => { }} onDelete={handleDelete} />
        ))}
      </section>
    </div>
  );
}

export default App;
