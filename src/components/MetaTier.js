import React from 'react';

const MetaTier = (props) => {
    let total;
    let topTraits;
    let topUnits;

    if (props.displayMeta){
        total = props.data.topFourPlayers;
        topTraits = props.data.traits.slice(0,10);
        topUnits = props.data.units.slice(0,10);
    }

    return(
        <div className="meta-tier-comp container">
            <div className="d-inline-flex flex-column">
                <button
                    className="btn btn-warning"
                    onClick={props.onClick}
                    disabled = {props.disabled}
                >
                    Display Most Played Traits and Units in Top 10 Challenger Lobbies
                </button>
            </div>

            {
            props.displayProgress && 
            <div className="d-flex flex-column">
                <div className="challenger-meta-title text-center"><h1>Challenger Meta</h1></div>
                <div className="progress"> 
                    <div 
                        className="progress-bar progress-bar-striped progress-bar-animated bg-dark" 
                        role="progressbar" 
                        style= {{width: ""+props.progress+"%"}}
                        aria-valuenow="100" 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                    >
                    </div> 
                </div>
                <div className="align-self-center text-center">
                    Please be patient this should only take about 3 mins. Other functionality disabled to preserve processing power
                </div>
            </div>
            }
            
            {
            props.displayMeta &&
            <div className="meta-data-comp d-flex flex-row flex-wrap">
                
                <div className="top-traits-sec flex-fill d-flex flex-column mx-1">
                    <div className="top-traits-title text-center"><h3>Top 10 Traits</h3></div>
                    <table className="traits-table table table-striped table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Trait</th>
                                <th scope="col">Top Four Play Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            topTraits.map( (traitLst, index, arr) => {
                                let row_num = index+1;
                                let trait=traitLst[0];
                                let play_rate = Math.round(traitLst[1]/total*100)/100;
                                return(
                                    <tr key={trait}>
                                        <th scope="row">{row_num}</th>
                                        <td>{trait}</td>
                                        <td>{play_rate}</td> 
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="top-units-sec flex-fill d-flex flex-column mx-1">
                    <div className="top-units-title text-center"><h3>Top 10 Units</h3></div>
                    <table className="top-units table table-striped table-dark">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Unit</th>
                                <th scope="col">Top Four Play Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            topUnits.map( (unitLst, index, arr) => {
                                let row_num = index+1;
                                let unit=unitLst[0];
                                let play_rate = Math.round(unitLst[1]/total*100)/100;
                                return(
                                    <tr key={unit}>
                                        <th scope="row">{row_num}</th>
                                        <td>{unit}</td>
                                        <td>{play_rate}</td> 
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            }

        </div>
    );
}

export default MetaTier;