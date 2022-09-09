import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import MintdropzLogo from '../../../assets/mintdropz_logo.png';

const Navbar = () => {
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light px-5">
                <div class="container-fluid">
                    <Link class="navbar-brand" to="/"><img src={MintdropzLogo} alt="" className='MintdropzLogo' /> MintdropzArtGenerator</Link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav ms-auto">
                            <Link class="nav-link active" aria-current="page" to="/home">Home</Link>
                            {/* <Link class="nav-link" aria-current="page" to="/landing">Landing</Link> */}
                            {/* <Link class="nav-link" to="/generate">Generate</Link> */}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;