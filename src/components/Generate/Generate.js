import React, { useContext } from 'react';
import { GeneratedNFTContext } from '../../App';
import './Generate.css';

const Generate = () => {
    const [generatedNFT, setGeneratedNFT] = useContext(GeneratedNFTContext);
    console.log(generatedNFT);

    return (
        <div className='generate_container'>
            <div className="container-fluid">
                <div className="row gen_nft">
                    {/* <div className="col-md-2">
                        Rarity
                    </div> */}
                    <div className="col-md-12 generateNFTOuter">
                        <div className='fixed-height generateNFT_div'>
                            {
                                generatedNFT ?
                                    generatedNFT.map(item => (
                                        <img className='generateNFT hoverscale' src={item}></img>
                                    ))
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Generate;