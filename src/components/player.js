import React from 'react';
require('dotenv').config();

const Player = (props) => {
    console.log(props.data);
    // console.log("player rendered");
    return (
        <div className="player-comp">
            <div className="player-rank">
                <h1>{props.data.summonerName}</h1>
                <button 
                    type="button">
                    See Past 10 Matches
                </button>
            </div>
            <div className="player-matches">

            </div>
        </div>
    );
};

export default Player;