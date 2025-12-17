import { useState } from "react";
import { Routes, Route, Link, useNavigate, useMatch } from "react-router-dom";
import { useField } from "./hooks/useField";

// App navigation menu
const Menu = () => {
  const button = {
    padding: 5,
    border: "1px solid #000000",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    marginRight: "10px",
    backgroundColor: "#fff6c3cb",
    textDecoration: "none",
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Link style={button} to="/">
        Anecdotes
      </Link>
      <Link to="/create" style={button}>
        Create new
      </Link>
      <Link to="/about" style={button}>
        About
      </Link>
    </div>
  );
};

// Display notification messages
const Notification = ({ message }) => {
  const style = {
    border: "2px solid green",
    borderRadius: "4px",
    padding: "10px",
    marginBottom: "20px",
    backgroundColor: "#f2fcf2ff",
    fontWeight: "500",
  };

  if (!message) return null;

  return <div style={style}>{message}</div>;
};

// Display a single anecdote
const Anecdote = ({ anecdote }) => (
  <div>
    <h2>
      {anecdote.content} by {anecdote.author}
    </h2>
    <p>Has {anecdote.votes} votes</p>
    <p>
      For more info see <a href={anecdote.info}>{anecdote.info}</a>
    </p>
  </div>
);

// List all anecdotes
const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link to={`/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      ))}
    </ul>
  </div>
);

// Show information about the app
const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
);

// Form to create a new anecdote
const CreateNew = (props) => {
  const navigate = useNavigate(); // useNavigate hook gives access to the navigate function

  // Custom hook for form fields
  const contentField = useField("content");
  const authorField = useField("author");
  const infoField = useField("info");

  // Destructure reset functions and input attributes
  const { reset: resetContent, ...contentFieldInputAttributes } = contentField;
  const { reset: resetAuthor, ...authorFieldInputAttributes } = authorField;
  const { reset: resetInfo, ...infoFieldInputAttributes } = infoField;

  // Custom hook for managing form reset
  const handleReset = () => {
    resetContent();
    resetAuthor();
    resetInfo();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addNew({
      content: contentField.value,
      author: authorField.value,
      info: infoField.value,
      votes: 0,
    });

    navigate("/"); // Programmatically navigate to the home page after login
  };

  return (
    <div>
      <h2>Create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          Content:
          <input
            style={{ margin: "0 5px 5px 5px" }}
            {...contentFieldInputAttributes}
          />
        </div>
        <div>
          Author:
          <input
            style={{ margin: "0 5px 5px 5px" }}
            {...authorFieldInputAttributes}
          />
        </div>
        <div>
          URL for more info:
          <input
            style={{ margin: "0 5px 5px 5px" }}
            {...infoFieldInputAttributes}
          />
        </div>
        <button style={{ padding: "5px 10px 5px 10px" }}>Create</button>
        <button
          style={{ margin: "0 5px 5px 5px", padding: "5px 10px 5px 10px" }}
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      </form>
    </div>
  );
};

// Show footer information
const Footer = () => (
  <div style={{ marginTop: "20px" }}>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See{" "}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{" "}
    for the source code.
  </div>
);

const App = () => {
  // State to hold anecdotes
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  // State for notification messages
  const [notification, setNotification] = useState("");

  // To add a new anecdote
  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
    showNotification(`A new anecdote "${anecdote.content}" created!`);
  };

  // To find an anecdote by ID
  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  // To vote for an anecdote
  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  // Match the route parameter for anecdote ID
  const match = useMatch("/:id");
  const anecdote = match
    ? anecdotes.find((anecdote) => anecdote.id === Number(match.params.id))
    : null;

  // To show notification messages
  const showNotification = (message, duration = 5000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, duration);
  };

  return (
    <div>
      <h1>Software Anecdotes</h1>
      <Menu />
      <Notification message={notification} />
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path="/:id" element={<Anecdote anecdote={anecdote} />} />
        <Route
          path="/create"
          element={
            <CreateNew addNew={addNew} setNotification={setNotification} />
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
