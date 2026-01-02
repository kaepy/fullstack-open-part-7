import React, { useState, useEffect } from "react";
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

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then((response) => {
          //console.log("response: ", response);
          //console.log("response.data: ", response.data);
          setCountry({ found: true, data: response.data });
        })
        .catch((error) => {
          console.log("error: ", error);
          setCountry({ found: false });
        });
    }
  }, [name]);

  //console.log("country: ", country);

  return country;
};

const Country = ({ country }) => {
  // Handle the case when country is null
  if (!country) {
    return null;
  }

  console.log("country data: ", country);

  // Handle the case when country is not found
  if (!country.found) {
    return <div>not found...</div>;
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital[0]} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flags.svg}
        height="100"
        alt={`flag of ${country.data.name.common}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text"); // Custom hook for input field
  const [name, setName] = useState(""); // State to hold the country name
  const country = useCountry(name); // Fix: pass 'name' instead of 'nameInput.value'

  // Function to handle form submission
  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value); // Update the name state with the input value
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
