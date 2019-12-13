import React, {useState} from 'react';
import './App.css';
import Player from "./components/Player";
import SearchPlayer from './components/SearchPlayer';
import MetaTier from './components/MetaTier';
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

  const toggleMetaTierDisplay = (e) => {
    //if should only be ran once!
    //if meta data was not retrieved initially
    if(!_meta_data_retrived){
      console.log("I should be ran once");
      //retrived so set true
      setMetaDataRetrieved(true);
    }
    setDisplayMeta(!_display_meta);
  }

  async function fetchData(url){
    const api_call = await fetch(url);
    const data = await api_call.json();
    return data;
  }

  async function fetchChallengerPlayers(){
    const req_challenger_players = `/league/v1/challenger?api_key=${API_KEY}`;
    return await fetchData(req_challenger_players); 
  }

  async function fetchPlayerDataByName(name){
    const get_player_request = `/summoner/v1/summoners/by-name/${name}?api_key=${API_KEY}`;
    return await fetchData(get_player_request);
  }

  async function fetchPlayerDataByID(id){
    const req_player_by_id = `/summoner/v1/summoners/${id}?api_key=${API_KEY}`;
    return await fetchData(req_player_by_id);
  }

  async function fetchPlayerRankDataByID(id){
    const req_player_rank = `/league/v1/entries/by-summoner/${id}?api_key=${API_KEY}`;
    return await fetchData(req_player_rank);
  }

  async function fetchPlayerMatchListByPID(puuid, count){
    const req_player_matches = `/by-puuid/${puuid}/ids?count=${count}&api_key=${API_KEY}`;
    return await fetchData(req_player_matches);
  }

  async function fetchMatchData(matchID){
    const req_match = `/matches/${matchID}?api_key=${API_KEY}`;
    return await fetchData(req_match);
  }

  async function setReformatedMatches(listOfMatchIDs, playerPUUID){
    let temp = []
    for(let i = 0; i<listOfMatchIDs.length; i++){
      const matchID = listOfMatchIDs[i];
      const matchData = await fetchMatchData(matchID);
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
    const player_data = await fetchPlayerDataByName(_search);

    // fetch Player rank from API
    const rank_data = await fetchPlayerRankDataByID(player_data.id);
    // valid rank data is returned as an array
    // invalid requests for rank_data returns a json obj
    if (rank_data.length === 0 || !Array.isArray(rank_data) ){
      console.log("no ranked player");
    }

    //valid rank player
    else {
      // fetch list of matchIDS given the amount and player puuid
      let count = 5;
      const matchIDS = await fetchPlayerMatchListByPID(player_data.puuid, count);

      await setReformatedMatches(matchIDS, player_data.puuid);
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
      <SearchPlayer
        onSubmit={getPlayerQuery}
      />
      
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

      <MetaTier
        onClick={toggleMetaTierDisplay}
        displayValue = {_display_meta}
      />
    </div>
  );
}

export default App;
