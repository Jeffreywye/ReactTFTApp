import React from 'react';
import "./SearchPlayer.css"

const SearchPlayer = (props) => {
    
    return(
        <div className="d-flex justify-content-center my-2">
            <form
            className="form-inline"
            id="search-form"
            onSubmit={props.onSubmit}
            >
                <input
                    className="search-bar form-control px-4"
                    type="text"
                    name= "PlayerName"
                    placeholder="Search Player: Scarra"
                />
                <button
                    className="search-btn btn btn-primary"
                    type="submit"
                    disabled = {props.disabled}
                >
                    search
                </button>
            </form>
            
        </div>
        
    );
}

export default SearchPlayer;