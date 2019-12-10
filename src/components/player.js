import React from 'react';

const Player = (props) => {
    // console.log(props.data);
    console.log("player rendered");
    return (
        <div className="player-comp">
            <div className="player-rank">
                <h1>{props.data.summonerName}</h1>
                <button 
                    type="button"
                    onClick={props.displayMatchOnClick}>
                    See Past 10 Matches
                </button>
                {
                    props.display &&
                    <div className="Matches">
                        <ul>
                            <li>test</li>
                            <li>test</li>
                        </ul>
                    </div>
                }
                
            </div>
            <div className="player-matches">

            </div>
        </div>
    );
};

export default Player;