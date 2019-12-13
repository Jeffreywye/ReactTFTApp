import React from 'react';

const SearchPlayer = (props) => {
    
    return(
        <div className="d-flex justify-content-center my-2">
            <form
            className="form-inline"
            id="search-form"
            onSubmit={props.onSubmit}
            >
            <input
                className="search-bar form-control"
                type="text"
                name= "PlayerName"
                placeholder="Search TFT NA Player"
            />
            <button
                className="search-btn btn btn-primary"
                type="submit"
            >
                search
            </button>
            </form>
        </div>
    );
}

export default SearchPlayer;