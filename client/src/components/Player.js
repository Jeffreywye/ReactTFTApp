import React from 'react';
import Match from "./Match";

const Player = (props) => {
    return (
        <div className="player-comp d-flex flex-row flex-wrap justify-content-center p-2 mx-2">
            <div className="profile d-flex flex-column w-40">
                <div className="player-name text-center"><h1>{props.data.summonerName}</h1></div>
                <div className="player-rank d-flex flex-column ">
                    <div className="player-rank-box d-flex flex-row border border-secondary shadow bg-white rounded p-3">
                        <div className="px-3">
                            <h2 className="m-0">{props.data.tier} {props.data.rank}</h2>
                            <h6 className="m-0">LP : {props.data.leaguePoints}</h6>
                            <h6 className="m-0">win rate: {Math.round(props.data.wins/props.data.losses * 100)/100}</h6>
                        </div>
                        <div className="player-win-losses align-self-center">
                            <div className="win-lose-percentage text-center">{props.data.wins} / {props.data.losses}</div>
                            <div className="win-lose-label text-center"> W / L</div>
                        </div>
                    </div>
                    
                    <button
                        className="btn btn-dark flex-grow-1"
                        type="button"
                        onClick={props.displayMatchOnClick}>
                        See Past 5 Matches
                    </button>
                </div>
            </div>
            

            {props.display &&
            <div className="player-matches flex-grow-1 d-flex flex-column pl-3">
                <div className=""><h1>Match History</h1></div>
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
