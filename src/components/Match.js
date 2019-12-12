import React, {useState} from 'react';

const Match = (props) => {
    const [_display_collapsible, setColDisplay] = useState(false);
    const toggleCollapsible = (event) => {
        setColDisplay(!_display_collapsible);
    }
    let gameStatus = "";
    let bg_color="";
    function convertPlacement(){
        if(props.data.placement > 4){
            gameStatus = "Lose";
            bg_color = " bg-danger";

        }
        else if(props.data.placement === 1){
            gameStatus = "Win";
            bg_color = " bg-success";
        }
        else{
            gameStatus = "Top Four";
            bg_color = " bg-primary";
        }
    }
    convertPlacement();
    return (
        <div className="match-container d-flex flex-column shadow">
            <div className={"match-header d-flex flex-row align-items-center border border-dark" + bg_color}>
                <div className="match-status-box flex-grow-1 d-flex flex-row px-3">
                    <div>Match Status: </div>
                    <div className="pl-2">{gameStatus}</div>
                </div>
                <button
                    className = "btn btn-secondary rounded-0" 
                    onClick={toggleCollapsible}
                    >expand
                </button>
            </div>
            
            {
            _display_collapsible &&
            <div className="match-toggalable d-flex flex-row border border-dark bg-white">
                <div className="match-info d-flex flex-column pl-3">
                    <div>Placed : {props.data.placement}</div>
                    <div>Damage Dealt : {props.data.damageDealt}</div>
                </div>
                
                <div className="traits-container align-self-center d-flex flex-row flex-wrap pl-3">Traits: 
                    {props.data.traits.map(
                        (trait, index, arr) => {
                            return(
                                <div
                                    className="trait pl-2" 
                                    key={trait.name}
                                >{trait.name} {trait.level}
                                </div>
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