import React, {useState} from 'react';
import './App.css';
import Player from "./components/Player";
import SearchPlayer from './components/SearchPlayer';
import MetaTier from './components/MetaTier';

const App = () => {
  const [_player_data, setPlayerData] = useState(null);
  const [_rank_data, setRankData] = useState(null);
  const [_display_matches, setDisplayMatches] = useState(true);
  const [_list_of_matches, setListOfMatches] = useState(null);
  const [_display_meta, setDisplayMeta] = useState(false);
  const [_meta_data_retrived, setMetaDataRetrieved] = useState(false);
  const [_tft_meta_data, setTFTMetaData] = useState(null);
  const [_disabled, setDisabled] = useState(false);
  const [_display_progress_bar, setDisplayProgressBar] = useState(false);
  const [_progress_percent, setProgressPercent] = useState(0);
  const [_display_no_player_found, setNoPlayerFound] = useState(false);

  var _search = "";
  
  async function sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  const setMatchDisplayOff = (e) => {
    setDisplayMatches(false);
  }

  const toggleMatchDisplay = (e) => {
    setDisplayMatches(!_display_matches);
  }

  const toggleMetaTierDisplay = async (e) => {
    //if statement should only be ran once!
    //if meta data was not retrieved initially
    if(!_meta_data_retrived){
      //disable buttons to not cause errors
      setDisabled(true);
      setDisplayProgressBar(true);
      await retriveMetaTierList();
      //retrived so set true
      setMetaDataRetrieved(true);
      //reenable buttons
      setDisabled(false);
      setDisplayProgressBar(false)
    }
    setDisplayMeta(!_display_meta);
  }

  async function postDataFromServer(url){
    let payload = {"url": url}
    let request = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let jsonData = await request.json();
    return jsonData;
  }

  async function fetchChallengerPlayers(){
    const req_challenger_players = `https://na1.api.riotgames.com/tft/league/v1/challenger?api_key=`;
    return await postDataFromServer(req_challenger_players); 
  }

  async function fetchPlayerDataByName(name){
    const get_player_request = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/${name}?api_key=`;
    return await postDataFromServer(get_player_request);
  }

  async function fetchPlayerDataByID(id){
    const req_player_by_id = `https://na1.api.riotgames.com/tft/summoner/v1/summoners/${id}?api_key=`;
    return await postDataFromServer(req_player_by_id);
  }

  async function fetchPlayerRankDataByID(id){
    const req_player_rank = `https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/${id}?api_key=`;
    return await postDataFromServer(req_player_rank);
  }

  async function fetchPlayerMatchIDsListByPID(puuid, count){
    const req_player_matches = `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${count}&api_key=`;
    return await postDataFromServer(req_player_matches);
  }

  async function fetchMatchData(matchID){
    const req_match = `https://americas.api.riotgames.com/tft/match/v1/matches/${matchID}?api_key=`;
    return await postDataFromServer(req_match);
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
    ret.units = reformatUnits(player.units);
    return ret;
  }

  // helper function that returns a list of trait objects that were active
  // ex format 
  // [
  //   {name: inferno,
  //   level: 1,
  //   maxLevel: 3},
  //   {},...
  // ]
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

  // helper function that returns a list of units
  // uncomment filter code for "unique" list of units
  // ex of "unique" singed 1 and singed 2 are unique,
  // but singed 1 and singed 1 are not unique 
  //exformat
  //["singed 2", "singed 1", "twitch 2", ...]
  function reformatUnits(unitList){
    let reformattedUnitsList = [];
    for(const unitObj of unitList){
      let reformattedCharacterName = unitObj.character_id.replace("TFT2_","")
      let unit = reformattedCharacterName+" "+unitObj.tier;
      reformattedUnitsList.push(unit);
    }
    // filter out for distinct units
    // let ret = reformattedUnitsList.filter((unit, index, arr) => {
    //   return arr.indexOf(unit) === index;
    // });
    return reformattedUnitsList;
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
      setNoPlayerFound(true);
    }

    //valid rank player
    else {
      // fetch list of matchIDS given the amount and player puuid
      let count = 10;
      const matchIDS = await fetchPlayerMatchIDsListByPID(player_data.puuid, count);

      await setReformatedMatches(matchIDS, player_data.puuid);
      setMatchDisplayOff();
      setPlayerData(player_data);
      setRankData(rank_data[0]);
      setNoPlayerFound(false);
    }
    document.getElementById("search-form").reset();
  }

  async function retriveMetaTierList(){
    // var startTime = performance.now();
    const challenger_players_data = await fetchChallengerPlayers();
    const list_of_challengers = challenger_players_data.entries;
    list_of_challengers.sort(
      (PlayerA,PlayerB) => PlayerB.leaguePoints - PlayerA.leaguePoints
    );
    const top_ten_challengers = list_of_challengers.slice(0,10);
    setProgressPercent(5);
    // var top_ten_challegers_finish_time = performance.now();
    // console.log("collecting top ten challengers took "+(top_ten_challegers_finish_time - startTime)+" ms");
    
    
    const top_ten_challengers_pid_list = await convertPlayerListToPlayerPIDList(top_ten_challengers);
    setProgressPercent(10);
    // var top_ten_challegers_pid_finish_time = performance.now();
    // console.log("collecting top ten challengers pids took "+(top_ten_challegers_pid_finish_time - top_ten_challegers_finish_time)+" ms");
    
    
    const top100MatchIDsList = await convertPIDSListToMatchIDList(top_ten_challengers_pid_list);
    setProgressPercent(20);
    // var top_100_match_ids_time = performance.now();
    // console.log("collecting top 100 match ids took "+(top_100_match_ids_time - top_ten_challegers_pid_finish_time)+" ms");
    
    
    const top100MatchesList = await convertMatchIDListToMatchList(top100MatchIDsList);
    // var top_100_matches_time = performance.now();
    // console.log("collecting top 100 matches took "+(top_100_matches_time - top_100_match_ids_time)+" ms");

    // var startOfSynchronous = performance.now();
    const topPlaceMentsList = convertMatchListToTopPlacementsList(top100MatchesList);
    const traitsAndUnitsObjList = convertTopPlacementListToTraitsAndUnitObjList(topPlaceMentsList);
    const metaData = convertTraitsAndUnitsObjListToMetaData(traitsAndUnitsObjList);
    const sortedMetaData = sortMetaData(metaData);
    sortedMetaData.topFourPlayers = topPlaceMentsList.length;
  
    // let endTime = performance.now();
    // console.log("THIS WHOLE PROCESS TOOK "+(endTime-startTime)+" ms");
    // console.log("the non async process took "+(endTime-startOfSynchronous)+" ms");
    // setProgressPercent(100);
    setTFTMetaData(sortedMetaData);
  }

  // return a metaobj containing 2 lists of sorted traits and units
  // by popularity
  // param metaData is an obj only produced by the method
  // convertTraitsAndUnitsObjListToMetaData()
  // return ex format
  // {
  //   traits=[
  //     ["Ocean 2",300],["Inferno 1", 100],...
  //   ],
  //   units=[
  //     ["Nocturne 2",100], ["Khazix 2", 75],...
  //   ]
  // }
  function sortMetaData(metaData){
    let metaObj = {}
    let sortedTraits = []
    for (const trait in metaData.traits){
      sortedTraits.push([trait, metaData.traits[trait]]);
    }
    
    sortedTraits.sort((traitA, traitB) => {
      return traitB[1] - traitA[1];
    });
    metaObj.traits = sortedTraits
    
    let sortedUnits = []
    for (const unit in metaData.units){
      sortedUnits.push([unit, metaData.units[unit]]);
    }

    sortedUnits.sort((unitA, unitB) => {
      return unitB[1] - unitA[1];
    });
    metaObj.units = sortedUnits
    return metaObj;
  }

  //return an object containing 2 lists of traits and units
  // ex format
  // {
  //   traits:[[],[]]
  //     "Inferno 1"= 100,
  //     "Ocean 2"=300
  //   }
  //   units:{
  //     "Khazix 1"=100,
  //     "singed 2"=200 
  //   }
  // }
  function convertTraitsAndUnitsObjListToMetaData(traitsAndUnitsObjList){
    let metaObj = {
      traits:{},
      units:{}
    }

    for(const traitsAndUnitsObj of traitsAndUnitsObjList){
      let traitList = traitsAndUnitsObj.traits;
      let unitList = traitsAndUnitsObj.units;
      
      for(const traitObj of traitList){
        let trait = traitObj.name + " " + traitObj.level;
        if (metaObj.traits.hasOwnProperty(trait)){
          metaObj.traits[trait]++; 
        }
        else{
          metaObj.traits[trait] = 1;
        }
      }
      
      for(const unit of unitList){
        if(metaObj.units.hasOwnProperty(unit)){
          metaObj.units[unit]++;
        }
        else{
          metaObj.units[unit] = 1;
        }
      }
    }
    return metaObj;
  }

  // should return a list of objects
  // in each obj should be 2 lists of reformatted traits and reformatted Units
  // ex format
  // [
  //   {
  //     traits: [
  //         {name: inferno,
  //         level: 1,
  //         maxLevel: 3},
  //         {},...
  //       ],
  //     units: ["singed 1","singed 2",...]
  //   },
  //   {},...
  // ]
  function convertTopPlacementListToTraitsAndUnitObjList(topPlacementList){
    let ret = []
    for (const playerObj of topPlacementList){
      let traits_and_unit_obj = {};
      traits_and_unit_obj.traits = reformatTraits(playerObj.traits);
      traits_and_unit_obj.units = reformatUnits(playerObj.units)
      ret.push(traits_and_unit_obj);
    }
    return ret;
  }

  function convertMatchListToTopPlacementsList(matchList){
    let top_placement_list = [];
    for( const matchObj of matchList){
      let participants = matchObj.info.participants;
      participants.sort((PlayerA, PlayerB)=> {
        return PlayerA.placement - PlayerB.placement
      });
      let top_four = participants.slice(0,4);
      top_placement_list = [...top_placement_list, ...top_four];
    }
    return top_placement_list; 
  }

  // this function is 80% of the process time!!
  async function convertMatchIDListToMatchList(matchIdList){
    // these 4 lines are for the progress bar 
    // and is not part of the methods functionality
    let initialprogress = 20;
    let len = matchIdList.length;
    let interval = Math.round(len/80);
    let count = 0;
    
    let match_list = [];
    for (const matchId of matchIdList){
      await sleep(1210);
      const match_data = await fetchMatchData(matchId);
      match_list.push(match_data);
      
      // these last lines within the for are for the progress bar
      // and is not part of the methods functionality
      count++;
      if(count === interval){
        initialprogress++;
        setProgressPercent(initialprogress);
        count=0;
      }
    }
    return match_list;
  }

  async function convertPIDSListToMatchIDList(pidList){
    let match_id_list = [];
    for(const pid of pidList){
      await sleep(1250);
      const player_match_ids = await fetchPlayerMatchIDsListByPID(pid, 10);
      match_id_list = [...match_id_list, ...player_match_ids];
    }
    // filter match_id_list to contain only unique matches since the top 100 players could have played against each other
    let ret = match_id_list.filter((matchID, index, arr) => {
      return arr.indexOf(matchID) === index;
    });
    return ret;
  }

  async function convertPlayerListToPlayerPIDList(challengerList){
    let ret = [];
    // iteritively fetch data using the sleep function to rate limit
    for(const challengerIndex in challengerList){
      const playerID = challengerList[challengerIndex].summonerId;
      await sleep(1500);
      const challenger_player_data = await fetchPlayerDataByID(playerID);
      ret.push(challenger_player_data.puuid);
    }
    return ret;
  }

  // this function recursively fetches player data using setTimeout to ratelimit the calls
  // async function retrivePlayerPIDLoop(iterationCur, challengerList, ret){
  //   setTimeout( async function() {
  //     let playerID = challengerList[iterationCur].summonerId;
  //     const challenger_player_data = await fetchPlayerDataByID(playerID);
  //     console.log(challenger_player_data);
  //     ret.push(challenger_player_data.puuid);
  //     iterationCur++;
  //     if (iterationCur<10){
  //       await retrivePlayerPIDLoop(iterationCur, challengerList, ret);
  //     }
  //   }, 1500); 
  // }

  // rerender will occur 
  // whenever a state or prop value changes
  return (
    <div className="App">
      
      <nav className="navbar navbar-expand navbar-dark bg-dark sticky-top" id="mainNav">
        <div className="container">
          <a className="navbar-brand nav-link" href="#about">TFT APP</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#player-search">Search Player</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#meta-table">Meta</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      
      <section id="about">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2 className="text-center">TFT APP</h2>
              <p className="lead text-center">Find information of the current state of Riot's NA TFT Meta</p>
              <ul>
                <li>Search Ranked NA Players</li>
                <li>Discover the most played traits to top four with in challenger lobbies</li>
                <li>Uses Riot Games API To recieve the latest in game data</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="player-search">
        <SearchPlayer
          onSubmit={getPlayerQuery}
          disabled={_disabled}
        />

        {
        // render if no player was found from the search
        _display_no_player_found &&
        <div>
          <p className="font-wieght-bold text-danger text-center">No Ranked Player Found, try inputting "scarra" or "Krmx"</p>
        </div>
        }
        
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
      </section>
      
      <section id="meta-table">
        <MetaTier
          onClick={toggleMetaTierDisplay}
          displayMeta = {_display_meta}
          disabled={_disabled}
          progress={_progress_percent}
          displayProgress = {_display_progress_bar}
          data={_tft_meta_data}
        />
      </section>

      
    </div>
  );
}

export default App;
