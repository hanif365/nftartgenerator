import React from 'react';
import './LandingPage.css';
import landingVideo from '../../assets/landing_video.mp4';
import mintBtn from '../../assets/mint_img.png';
import checkStatusBtn from '../../assets/check_status_img.png';
import followBtn from '../../assets/follow_img.png';

const LandingPage = () => {
    return (
        <div>
            <div className='upperBtnGroup'>
                <img src={followBtn} alt="" className='followButton' />
                <img src={checkStatusBtn} alt="" className='checkStatusButton' />
            </div>

            <video className='videoImg' autoPlay muted loop>
                <source src={landingVideo} type="video/mp4" />
            </video>

            <div className='mint_btn_div'>
                <img src={mintBtn} alt="" className='mintBtn' />
            </div>
        </div>
    );
};

export default LandingPage;