import React, {useState} from 'react';
import './App.css';
require('dotenv').config();

const App = () => {
  const [_player, setPlayer] = useState("");
  const [_search, setSearch] = useState("");

  const API_KEY = process.env.REACT_APP_RIOT_API_KEY;
  const get_player_request = `/tft/summoner/v1/summoners/by-name/${_search}?api_key=${API_KEY}`;
  
  
  const updateSearch = (event) => {
    setSearch(event.target.value);
  }
  
  const getPlayerQuery = async (event) => {
    event.preventDefault();
    setPlayer(_search);
    console.log(_player);
    const player_api_call = await fetch(get_player_request);
    const player_data = await player_api_call.json();
    console.log(player_data);
    setSearch("");
  }

  return (
    <div className="App">
      <form
        className="search-form"
        onSubmit={getPlayerQuery}
      >
        <input
          className="search-bar"
          type="text"
          value={_search}
          onChange={updateSearch}
        />
        <button
          className="search-btn"
          type="submit"
        >
          search
        </button>
      </form>
    </div>
  );
}

export default App;
