import React, {useState} from 'react';

const Match = (props) => {
    const [_display_collapsible, setColDisplay] = useState(false);
    const toggleCollapsible = (event) => {
        setColDisplay(!_display_collapsible);
    }
    let gameStatus = "";

    function convertPlacement(){
        if(props.data.placement > 4){
            gameStatus = "Top Four";
        }
        else if(props.data.placement === 1){
            gameStatus = "Win";
        }
        else{
            gameStatus = "Lose";
        }
    }
    convertPlacement();
    return (
        <div className="match-container">
            <div>Match Status</div>
            <div>{gameStatus}</div>
            <button onClick={toggleCollapsible}>expand</button>
            {
                _display_collapsible &&
                <div>
                    <div>Placement : {props.data.placement}</div>
                    <div>Damage Dealt : {props.data.damageDealt}</div>
                    <div className="traits-container">Traits
                        {props.data.traits.map(
                            (trait, index, arr) => {
                                return(
                                    <div key={trait.name}>{trait.name} {trait.level}</div>
                                )
                            }
                        )}
                    </div>
                </div>
                
            }
        </div>
        
    );
}

export default Match;