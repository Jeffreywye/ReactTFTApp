import React, {useState} from 'react';
import Player from "./components/Player";
import './App.css';
require('dotenv').config();

const App = () => {
  const [_player_data, setPlayerData] = useState(null);
  const [_rank_data, setRankData] = useState(null);
  const [_display_matches, setDisplayMatches] = useState(true);
  const [_list_of_matches, setListOfMatches] = useState(null);
  const [_display_meta, setDisplayMeta] = useState(false);
  const [_meta_data_retrived, setMetaDataRetrieved] = useState(false);
  var _search = "";

  const API_KEY = process.env.REACT_APP_RIOT_API_KEY;

  const setMatchDisplayOff = (e) => {
    setDisplayMatches(false);
  }

  const toggleMatchDisplay = (e) => {
    setDisplayMatches(!_display_matches);
  }

  async function  fetchData(url){
    const api_call = await fetch(url);
    const data = await api_call.json();
    return data;
  }

  async function fetchMatches(listOfMatchIDs, playerPUUID){
    let temp = []
    for(let i = 0; i<listOfMatchIDs.length; i++){
      const matchID = listOfMatchIDs[i];
      const req_match = `/matches/${matchID}?api_key=${API_KEY}`;
      const matchData = await fetchData(req_match);
      temp.push(reformatMatchData(matchData, playerPUUID));
    }
    // replace old list with new list of matches
    setListOfMatches(temp);
  }

  // return an obj containing player placement, list of trait objects, damage dealt, and players eliminated
  function reformatMatchData(matchData, playerPUUID){
    let ret = {
      placement : 0,
      damageDealt : 0,
      eliminations: 0,
    }
    const participants = matchData.info.participants;
    ret.matchID = matchData.metadata.match_id;
    let player = null;
    //find desired player in participants
    for(let i = 0; i<participants.length; i++){
      if(participants[i].puuid === playerPUUID){
        player = participants[i];
      }
    }
    ret["damageDealt"] = player.total_damage_to_players;
    ret["placement"] = player.placement;
    ret["eliminations"] = player.players_eliminated;
    ret.traits = reformatTraits(player.traits);
    return ret;
  }

  // helper function that returns traits that were active
  function reformatTraits(traitList){
    let ret = []
    for(let i = 0; i<traitList.length; i++){
      if(traitList[i].tier_current !== 0){
        let trait = {};
        trait.name = traitList[i].name.replace("Set2_","");
        trait.level = traitList[i].tier_current;
        trait.maxLevel = traitList[i].tier_total;
        ret.push(trait);
      }
    }
    return ret;
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
      // fetch list of matchIDS
      let count = 5;
      const req_player_matches = `/by-puuid/${player_data.puuid}/ids?count=${count}&api_key=${API_KEY}`;
      const matchIDS = await fetchData(req_player_matches);
      await fetchMatches(matchIDS, player_data.puuid);
      setMatchDisplayOff();
      setPlayerData(player_data);
      setRankData(rank_data[0]);
    }
    document.getElementById("search-form").reset();
  }

  // rerender will occur 
  // whenever a state or prop value changes
  return (
    <div className="App">
      <div className="d-flex justify-content-center my-2">
        <form
          className="form-inline"
          id="search-form"
          onSubmit={getPlayerQuery}
        >
          <input
            className="search-bar form-control"
            type="text"
            name= "PlayerName"
            placeholder="Search TFT NA Player"
          />
          <button
            className="search-btn btn btn-primary"
            type="submit"
          >
            search
          </button>
        </form>
      </div>
      
      { 
        // render player component when _search is not null
        _rank_data &&
        <div className="container">
          <Player
            data = {_rank_data}
            matches = {_list_of_matches}
            display = {_display_matches}
            displayMatchOnClick = {toggleMatchDisplay}
          />
        </div>
      }
    </div>
  );
}

export default App;
