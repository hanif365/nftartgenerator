import React, { useContext } from 'react';
import { GeneratedNFTContext, GeneratedProjectName, GenerateJSONFileContext } from '../../App';
import './Generate.css';
import { saveAs } from 'file-saver';
import Navbar from '../Shared/Navbar/Navbar';

var zip = require('jszip')();

const Generate = () => {
    const [generatedNFT, setGeneratedNFT] = useContext(GeneratedNFTContext);
    const [generatedJSON, setGeneratedJSON] = useContext(GenerateJSONFileContext);
    const [generatedProjectName, setGeneratedProjectName] = useContext(GeneratedProjectName);
    console.log(generatedNFT);
    console.log(generatedJSON);

    // code for make download nft as zip format
    const download = async () => {
        var img = zip.folder("images");
        var json = zip.folder("json");

        for (let i = 0; i < generatedNFT.length; i++) {
            const dataFileArr = generatedNFT[i].split(",");

            const dataFile = dataFileArr[1]

            const textFile = new Blob([JSON.stringify(generatedJSON[i])], { type: 'text/plain' });

            img.file(`${i}.jpg`, dataFile, { base64: true });
            json.file(`${i}.json`, textFile, { base64: true })
        }

        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "nft-art.zip");
        });
    }

    var i = 1;

    return (
        <div className='generate_container'>
            <Navbar></Navbar>
            <div className="container-fluid">
                <div className="row gen_nft">
                    <div className="col-md-2 py-3">
                        <button className='btn btn-success' onClick={download}> Download NFT</button>
                    </div>

                    <div className="col-md-12 generateNFTOuter py-5">
                        <div className=' generateNFT_div'>
                            {
                                generatedNFT ?
                                    generatedNFT.map(item => (
                                        <div className="card nft_card">
                                            <img src={item} className="card-img-top nft_img_card" alt="..." />
                                            <div className="card-body">
                                                <h5 className="card-title text-center">{generatedProjectName} #{i++}</h5>
                                            </div>
                                        </div>
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