import React from 'react';

const MetaTier = (props) => {
    
    return(
        <div className="meta-tier-comp container">
            <div className="d-flex flex-column">
                <button
                    onClick={props.onClick}
                >
                    test
                </button>
            </div>
            
            {
            props.displayValue &&
            <div>
                test render
            </div>
            }

        </div>
    );
}

export default MetaTier;