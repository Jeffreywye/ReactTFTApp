import React, {useState} from 'react';
import Player from "./components/Player";
import './App.css';
require('dotenv').config();

const App = () => {
  const [_player_data, setPlayerData] = useState(null);
  const [_rank_data, setRankData] = useState(null);
  const [_display_matches, setDisplayMatches] = useState(true);
  var _list_of_matches = [];
  var _search = "";

  const API_KEY = process.env.REACT_APP_RIOT_API_KEY;

  async function fetchMatches(listOfMatchIDs){
    for(let i = 0; i<listOfMatchIDs.length; i++){
      const matchID = listOfMatchIDs[i];
      console.log(matchID);
      const req_match = `/matches/${matchID}?api_key=${API_KEY}`;
      const matchData = await fetchData(req_match);
      console.log(matchData);
      _list_of_matches.push(matchData)
    }
    
  }

  async function  fetchData(url){
    const api_call = await fetch(url);
    const data = await api_call.json();
    return data;
  }
  
  const getPlayerQuery = async (event) => {
    event.preventDefault();
    _search = event.target.children.PlayerName.value;
    const get_player_request = `/summoner/v1/summoners/by-name/${_search}?api_key=${API_KEY}`;
    const player_data = await fetchData(get_player_request);

    // fetch Player rank from API
    const req_player_rank = `/league/v1/entries/by-summoner/${player_data.id}?api_key=${API_KEY}`;
    const rank_data = await fetchData(req_player_rank);
    // valid rank data is returned as an array
    // invalid requests for rank_data returns a json obj
    if (rank_data.length === 0 || !Array.isArray(rank_data) ){
      console.log("no ranked player");
    }

    //valid rank player
    else {
      // clear prev player list of matches
      _list_of_matches = [];
      setPlayerData(player_data);
      setRankData(rank_data[0]);

      // fetch list of matchIDS
      let count = 5;
      const req_player_matches = `/by-puuid/${player_data.puuid}/ids?count=${count}&api_key=${API_KEY}`;
      const matchIDS = await fetchData(req_player_matches);
      console.log(matchIDS);
      await fetchMatches(matchIDS);
      setMatchDisplayOff();
    }
    document.getElementById("search-form").reset();
  }

  const setMatchDisplayOff = (e) => {
    setDisplayMatches(false);
  }

  const toggleMatchDisplay = (e) => {
    setDisplayMatches(!_display_matches);
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
            display = {_display_matches}
            displayMatchOnClick = {toggleMatchDisplay}
          />
        </div>
      }
    </div>
  );
}

export default App;
