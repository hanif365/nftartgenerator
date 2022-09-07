import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light px-5">
                <div class="container-fluid">
                    <Link class="navbar-brand" to="/">Mintdropz ART Generator</Link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div class="navbar-nav ms-auto">
                            <Link class="nav-link active" aria-current="page" to="/home">Home</Link>
                            {/* <Link class="nav-link" to="/generate">Generate</Link> */}
                            {/* <a class="nav-link" href="#">Pricing</a>
                            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a> */}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;