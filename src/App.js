import React, {useState} from 'react';
import Player from "./components/Player";
import './App.css';
require('dotenv').config();

const App = () => {
  const [_player_data, setPlayerData] = useState(null);
  const [_rank_data, setRankData] = useState(null);
  var _search = "";

  const API_KEY = process.env.REACT_APP_RIOT_API_KEY;
  
  const getPlayerQuery = async (event) => {
    event.preventDefault();
    _search = event.target.children.PlayerName.value;
    const get_player_request = `/tft/summoner/v1/summoners/by-name/${_search}?api_key=${API_KEY}`;
    // console.log(_player);
    const player_api_call = await fetch(get_player_request);
    const player_data = await player_api_call.json();
    console.log(player_data);

    //// fetch Player rank from API
    const req_player_rank = `/tft/league/v1/entries/by-summoner/${player_data.id}?api_key=${API_KEY}`;
    const rank_api_call = await fetch(req_player_rank);
    const rank_data = await rank_api_call.json();
    
    if (rank_data.length === 0){
      console.log("no ranked player")
    }
    else {
      setPlayerData(player_data);
      setRankData(rank_data[0]);
    }
    document.getElementById("search-form").reset();
    // // setSearch("");
  }

  // rerender will occur 
  // whenever a state or prop value changes
  return (
    <div className="App">
      <form
        id="search-form"
        onSubmit={getPlayerQuery}
      >
        <input
          className="search-bar"
          type="text"
          // value={_search}
          // onChange={updateSearch}
          name = "PlayerName"
        />
        <button
          className="search-btn"
          type="submit"
        >
          search
        </button>
      </form>
      
      { 
        // render player component when _search is not null
        _rank_data &&
        <div>
          <Player
            data = {_rank_data}
          />
        </div>
      }
    </div>
  );
}

export default App;
