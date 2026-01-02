import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  // Async implementation using async/await
  useEffect(() => {
    // Fetch all resources from the baseUrl
    const fetchResources = async () => {
      try {
        const response = await axios.get(baseUrl); // Assuming the response data is an array of resources
        setResources(response.data); // Update state with fetched resources
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources(); // Call the async function to fetch resources
  }, [baseUrl]); // Re-run effect if baseUrl changes

  /* Then implementation using .then() is ok, but async/await is more modern, scalable and easier to read.
  useEffect(() => {
    axios
      .get(baseUrl)
      .then((response) => {
        setResources(response.data);
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
      });
  }, [baseUrl]);
  */

  const create = (resource) => {
    // Create a new resource at the baseUrl
    const createResource = async () => {
      const response = await axios.post(baseUrl, resource); // Assuming the response data is the created resource
      setResources(resources.concat(response.data)); // Update state with the new resource
    };
    createResource(); // Call the async function to create resource
  };

  // Return the resources and the service object
  const service = {
    create, // Expose the create function
  };

  return [resources, service];
};

const App = () => {
  const content = useField("text");
  const name = useField("text");
  const number = useField("text");

  const [notes, noteService] = useResource("http://localhost:3005/notes");
  const [persons, personService] = useResource("http://localhost:3005/persons");

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value });
  };

  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value });
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map((n) => (
        <p key={n.id}>{n.content}</p>
      ))}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map((n) => (
        <p key={n.id}>
          {n.name} {n.number}
        </p>
      ))}
    </div>
  );
};

export default App;
