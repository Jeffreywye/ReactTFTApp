import React from 'react';
import Match from "./Match";

const Player = (props) => {
    return (
        <div className="player-comp">
            <div className="player-rank">
                <div>
                    <h1>{props.data.summonerName}</h1>
                    <h2>{props.data.tier} {props.data.rank}</h2>
                    <div>lP : {props.data.leaguePoints}</div>
                    <div>win rate: {Math.round(props.data.wins/props.data.losses * 100)/100}</div>
                </div>
                <div className="player-win-losses">
                    <div>{props.data.wins} / {props.data.losses}</div>
                    <div className="win-lose-label"> W / L</div>
                </div>
                <button 
                    type="button"
                    onClick={props.displayMatchOnClick}>
                    See Past 5 Matches
                </button>
            </div>

            {props.display &&
            <div className="player-matches">
                {props.matches.map(
                    (matchObj, index, arr) => (
                        <Match
                            key = {matchObj.matchID}
                            data = {matchObj}
                        />
                    )
                )}
            </div>
            }     
        </div>
    );
};

export default Player;