import React from 'react';
import { useContext, useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import mergeImages from 'merge-images';
import { saveAs } from 'file-saver';
import './Home.css';
import Layers from '../Layers/Layers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import MultiSlider from '../Multislider';
import { AiFillCloseCircle } from "react-icons/ai";
import LinearProgress from '@mui/material/LinearProgress';
import Modal from "react-bootstrap/Modal";
import { Container, Row, Col } from "react-bootstrap";

import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { useNavigate } from 'react-router-dom';

// indexedDB
import Localbase from 'localbase';
import { ALLLayerContext, GeneratedNFTContext, LayerContext } from '../../App';
let db = new Localbase('nftArtDB');

var zip = require('jszip')();

const Home = () => {
    const [allLayers, setAllLayers] = useContext(ALLLayerContext);
    const [selectedLayer, setSelectedLayer] = useContext(LayerContext);
    const [generatedNFT, setGeneratedNFT] = useContext(GeneratedNFTContext);
    const [rarityModalShow, setRarityModalShow] = useState(false)
    const [progressModalShow, setProgressModalShow] = useState(false)
    const [jsonfiles, setJsonfiles] = useState([])
    const [rarities, setRarities] = useState([])
    const [number, setNumber] = useState(1)
    const [reload, setReload] = useState(false);
    const [reloadCombine, setReloadCombine] = useState(false);
    const [projectname, setProjectname] = useState('')
    const [description, setDescription] = useState('')
    const [progressStatu, setProgressStatu] = useState(0)
    const [images, setImages] = useState([]);
    const maxNumber = 100;
    const [combined, setcombineimages] = useState([]);
    const [previewImg, setPreviewImg] = useState([]);

    const modalclose = () => { setRarityModalShow(false) }
    const progressModalclose = () => { setProgressModalShow(false) }

    const history = useNavigate();

    const sendvalue = (index, data) => {
        console.log(index, data)
        let array = rarities
        for (let i = 0; i < array.length; i++) {
            if (array[i][index]) array[i] = data
        }
        setRarities(array)
    }


    const [layerValue, setLayerValue] = useState([])

    const onChange = async (imageList, addUpdateIndex) => {
        addUpdateIndex = addUpdateIndex ? addUpdateIndex : 0;
        let newUploadImageStore = [];

        for (let i = 0; i < addUpdateIndex.length; i++) {
            newUploadImageStore.push(imageList[addUpdateIndex[i]])
        }
        let newImageGroup;
        if (addUpdateIndex == 0) {
            newImageGroup = imageList;
        }
        else {
            newImageGroup = newUploadImageStore.concat(...images);
        }
        await db.collection(selectedLayer).add({ newImageGroup })

        setReload(!reload);

        // window.location.reload(false);
        // reload function call
        reloadPage();
    };

    useEffect(() => {
        db.collection(selectedLayer).get().then(selectedLayer => {
            if (selectedLayer.length == 0) {
                setImages([])
            }
            else {
                setImages(selectedLayer[selectedLayer.length - 1].newImageGroup);
            }
        })
    }, [selectedLayer, reload])

    useEffect(() => {
        let arr = []
        let arr1 = []

        allLayers.map(item => {

            db.collection(item).get().then(allLayer => {
                // console.log(allLayer);
                // condition for empty images of layer
                if (allLayer.length != 0) {
                    let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
                    let obj = {}
                    obj[item] = temp1
                    arr1.push(obj)
                    let obj1 = {}
                    let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
                    obj1[item] = temp
                    arr.push(obj1)
                }
            })
        })

        setRarities(arr)
        setLayerValue(arr1)
    }, [allLayers, reloadCombine])

    function getRandom(weights) {
        var num = Math.random(),
            s = 0,
            lastIndex = weights.length - 1;

        for (var i = 0; i < lastIndex; ++i) {
            s += weights[i];
            if (num < s) {
                return i + 1;
            }
        }

        return lastIndex + 1;
    };

    const combine = async () => {
        console.log(allLayers)
        if (!number) alert("input number")

        let arr = []
        let files = []
        setProgressModalShow(true)
        for (let j = 0; j < number; j++) {
            setProgressStatu(j)
            let temp = []
            let objarr = []
            await allLayers.map(layer => {
                for (let i = 0; i < layerValue.length; i++) {
                    if (layerValue[i][layer]) {
                        let obj = {}
                        let total = rarities.find(item => item[layer])[layer].reduce((x, y) => parseInt(x) + parseInt(y))
                        let rarityitem = rarities.find(item => item[layer])
                        let newarr = []
                        for (let i = 0; i < rarityitem[layer].length; i++) {
                            newarr.push(rarityitem[layer][i] / total)
                        }
                        let random = getRandom(newarr)
                        obj['trait_type'] = layer
                        obj['value'] = layerValue[i][layer][0][random - 1].file.name.split('.')[0]
                        objarr.push(obj)
                        temp.push(layerValue[i][layer][0][random - 1].data_url)
                    }
                }
            })

            await mergeImages(temp)
                .then((b64) => {
                    arr.push(b64)
                    setcombineimages(arr)

                    // use for contextAPI
                    setGeneratedNFT(arr)
                    let jsonobj = {}
                    jsonobj['attributes'] = objarr
                    jsonobj['image'] = `${j}.jpg`
                    if (projectname)
                        jsonobj['name'] = projectname
                    if (description)
                        jsonobj['description'] = description
                    files.push(jsonobj)
                    setJsonfiles(files)
                })
                .catch(error => console.log(error))
        }
        setProgressModalShow(false)

        
        history('/generate');
    }

    console.log(combined);
    

    // code for preview just one NFT
    const preview = async () => {
        console.log(allLayers)
        // if (!number) alert("input number")

        let arr = []
        let files = []
        // setProgressModalShow(true)
        // for (let j = 0; j < number; j++) {
        for (let j = 0; j < 1; j++) {
            setProgressStatu(j)
            let temp = []
            let objarr = []
            await allLayers.map(layer => {
                for (let i = 0; i < layerValue.length; i++) {
                    if (layerValue[i][layer]) {
                        let obj = {}
                        let total = rarities.find(item => item[layer])[layer].reduce((x, y) => parseInt(x) + parseInt(y))
                        console.log(total);
                        // if(total)

                        let rarityitem = rarities.find(item => item[layer])
                        let newarr = []
                        for (let i = 0; i < rarityitem[layer].length; i++) {
                            newarr.push(rarityitem[layer][i] / total)
                        }
                        let random = getRandom(newarr)
                        obj['trait_type'] = layer
                        obj['value'] = layerValue[i][layer][0][random - 1].file.name.split('.')[0]
                        objarr.push(obj)
                        temp.push(layerValue[i][layer][0][random - 1].data_url)
                    }
                }
            })

            await mergeImages(temp)
                .then((b64) => {
                    arr.push(b64)
                    // setcombineimages(arr[0])
                    setPreviewImg(arr[0])
                    let jsonobj = {}
                    jsonobj['attributes'] = objarr
                    jsonobj['image'] = `${j}.jpg`
                    if (projectname)
                        jsonobj['name'] = projectname
                    if (description)
                        jsonobj['description'] = description
                    files.push(jsonobj)
                    setJsonfiles(files)
                })
                .catch(error => console.log(error))
        }
        setProgressModalShow(false)
    }

    // code for make download nft as zip format
    const download = async () => {
        var img = zip.folder("images");
        var json = zip.folder("json");

        for (let i = 0; i < combined.length; i++) {
            const dataFileArr = combined[i].split(",");

            const dataFile = dataFileArr[1]

            const textFile = new Blob([JSON.stringify(jsonfiles[i])], { type: 'text/plain' });

            img.file(`${i}.jpg`, dataFile, { base64: true });
            json.file(`${i}.json`, textFile, { base64: true })
        }

        zip.generateAsync({ type: "blob" }).then(function (content) {
            saveAs(content, "nft-art.zip");
        });
    }

    const showmodal = () => {
        console.log(allLayers.indexOf(selectedLayer), rarities, rarities[selectedLayer])
        setRarityModalShow(true)
    }

    console.log(selectedLayer);

    const reloadPage = () => {
        setTimeout(() => {
            window.location.reload(false);
        }, 1000)
    }

    console.log("Images : ", images);


    return (
        <div className="App-container">
            <div className="row App_container_inner">
                <div className="col-md-2">
                    <Layers></Layers>
                </div>
                <div className="col-md-3 upload_img_div my-5">
                    <div className='nft_des_div'>
                        <h4 className='text-studio '>Studio</h4>
                        <hr className='hr' />
                        {/*  */}
                        <label className='mx-2' htmlFor="NFT_Name">NFT Name</label>
                        <div className='row'>
                            <div className='col-12 py-1'>
                                <input className='w-100 h-100 form-control NFT_Common_style' id="NFT_Name" placeholder='Mintdropz NFT' type="text" value={projectname} onChange={e => setProjectname(e.target.value)}></input>
                            </div>
                        </div>

                        {/* <div className='row py-3'>
                            <div className='col-md-6'>
                                <label className='mx-2' htmlFor="nftWidth">Width</label>
                                <div className=' py-1'>
                                    <input className='w-100 h-100 form-control NFT_Common_style' id="nftWidth" placeholder='70 Pixels' type="number"></input>
                                </div>
                            </div>

                            <div className='col-md-6'>
                                <label className='mx-2' htmlFor="nftHeight">Height</label>
                                <div className=' py-1'>
                                    <input className='w-100 h-100 form-control NFT_Common_style' id="nftHeight" placeholder='70 Pixels' type="number"></input>
                                </div>
                            </div>
                        </div> */}

                        {/* <div className='row'>
                            <div className='col-md-6'>
                                <label className='mx-2' htmlFor="nftQuality">Quality</label>
                                <select class="form-select NFT_Common_style" id='nftQuality'>
                                    <option selected value="1">High</option>
                                    <option value="2">Low</option>
                                </select>
                            </div>

                            <div className='col-md-6'>
                                <label className='mx-2' htmlFor="nftType">Type</label>
                                <select class="form-select NFT_Common_style" id='nftType'>
                                    <option selected value="1">PNG</option>
                                    <option value="2">JPG</option>
                                </select>
                            </div>
                        </div> */}

                        <div className='row'>
                            <div className='col-12 pt-2'>
                                <input className='w-100 h-100 form-control' placeholder='Description' type="text" value={description} onChange={e => setDescription(e.target.value)}></input>
                            </div>
                        </div>

                        <div className='row pt-3'>
                            {/* <label className='mx-2' htmlFor="nftNumber">Number of NFT</label>
                            <div className='col-6'>
                                <input className='w-100 h-100 form-control' type="number" id='nftNumber' value={number} onChange={e => setNumber(e.target.value)}></input>
                            </div> */}
                            {/* <div className='col-6'>
                                <button className='btn btn-success' onClick={combine} onMouseEnter={() => setReloadCombine(true)}> Generate NFT</button>
                            </div> */}
                            <div className='col-12'>
                                <button className='btn btn-success w-100' onClick={preview} onMouseEnter={() => setReloadCombine(true)}> Preview NFT</button>
                            </div>
                        </div>

                        <div className="row">
                            {/* <div className='col-6'>
                                <button className='btn btn-danger' onClick={showmodal}>Rarity</button>
                            </div> */}
                        </div>
                    </div>
                    {selectedLayer != 'checking' ? <div className='upload-layer-images-div text-center py-2'>
                        <h6>Upload your {selectedLayer == 'checking' ? 'layer' : selectedLayer} images</h6>
                        <ImageUploading
                            multiple
                            value={images}
                            onChange={onChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                        >
                            {({
                                imageList,
                                onImageUpload,
                                onImageRemoveAll,
                                onImageUpdate,
                                onImageRemove,
                                isDragging,
                                dragProps,
                            }) => (
                                // write your building UI
                                <div className="">
                                    <button
                                        className='addLayerImgBtn'
                                        style={isDragging ? { color: 'red' } : undefined}
                                        onClick={onImageUpload}
                                        // onMouseLeave={reloadPage}
                                        {...dragProps}
                                    >
                                        {/* Click or Drop here */}
                                        <FontAwesomeIcon icon={faCamera} className='addImgBtn' />
                                    </button>
                                    <div className="image-item margin-bottom">
                                        {images && images.map((image, index) => (
                                            <div key={index} class="card image-card">
                                                <img src={image['data_url']} class="card-img-top" alt="..." />
                                                {/* <div class="card-text">{image['file']['name']}</div> */}
                                                <div className='positionabsolute' onClick={() => onImageRemove(index)}><AiFillCloseCircle /></div>
                                            </div>

                                        ))}
                                    </div>
                                    {/* <div className='my-5'>
                                        {images && images.length ? <button className='btn btn-danger' onClick={onImageRemoveAll}>Remove all images</button> : ' '}
                                    </div> */}
                                </div>
                            )}
                        </ImageUploading>
                    </div> : ''}
                </div>

                <div className="col-md-4 show_preview_div mx-2 my-5">
                    <div className='fixed-height show_preview_div_inner'>
                        {
                            combined ?
                                <img className='preview_img hoverscale' width="100" src={previewImg}></img>
                                :
                                <></>
                        }
                        {/*  */}
                    </div>
                </div>

                <div className="col-md-2 py-5">
                    {/* rarity section start */}
                    <div className='row py-5'>
                        {/* <div className='col-6'>
                            <button className='btn btn-info' onClick={download}> download</button>
                        </div> */}
                        {selectedLayer != 'checking' ?

                            <div className='col-12'>
                                <button className='btn btn-lg btn-success w-100' onClick={showmodal}>Rarity</button>
                            </div> :

                            // <div className='col-6'>
                            //     <button className='btn btn-danger' disabled onClick={showmodal}>Rarity</button>
                            // </div>

                            <OverlayTrigger
                                key='top'
                                placement='top'
                                overlay={
                                    <Tooltip id='rarity'>
                                        Select a layer before you can adjust rarity
                                    </Tooltip>
                                }
                            >
                                {/* <Button variant="success">Rarity</Button> */}
                                <div className='col-12'>
                                    <button className='btn btn-lg btn-success w-100'>Rarity</button>
                                </div>
                            </OverlayTrigger>
                        }
                    </div>
                    {/* rarity section end */}

                    {/* <div className='row'>
                        <div className='col-12 py-1'>
                            <input className='w-100 h-100' placeholder='Project Name' type="text" value={projectname} onChange={e => setProjectname(e.target.value)}></input>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 py-1'>
                            <input className='w-100 h-100' placeholder='Description' type="text" value={description} onChange={e => setDescription(e.target.value)}></input>
                        </div>
                    </div> */}
                    <div className='row py-1'>
                        <h4>Generate NFT</h4>
                        <div className='col-12'>
                            <OverlayTrigger
                                key='top'
                                placement='top'
                                overlay={
                                    <Tooltip id='number_of_nft_gen'>
                                        Number of NFT want to generate
                                    </Tooltip>
                                }
                            >
                                {/* <Button variant="success">Rarity</Button> */}
                                <div className='col-12'>
                                    <input className='input_nft_num' type="number" value={number} onChange={e => setNumber(e.target.value)}></input>
                                </div>
                            </OverlayTrigger>
                        </div>
                        <div className='col-12 my-2'>
                            <button className='btn btn-lg btn-success w-100' onClick={combine} onMouseEnter={() => setReloadCombine(true)}>Generate</button>
                        </div>
                    </div>
                    {/* <div className='previewtext'>
                        Preview
                    </div> */}
                    
                    {/* <div className='fixed-height'>
                        {
                            combined ?
                                combined.map(item => (
                                    <img className='m-1 border border-1 border-primary hoverscale' width="90" src={item}></img>
                                ))
                                :
                                <></>
                        }
                    </div> */}

                </div>
            </div>

            <Modal
                dialogClassName="modala"
                show={rarityModalShow}
                onHide={modalclose}
                backdrop="static"
                keyboard={false}
                size="lg"
                centered>
                <Modal.Header closeButton closeVariant='black' style={{ height: "70px" }}>
                    <Modal.Title>Rarity Settings ({selectedLayer})</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ marginTop: "-10px" }}>
                    <Container>
                        <MultiSlider Items={images} sendValues={sendvalue} layername={selectedLayer} values={rarities.find(item => item[selectedLayer])} />
                    </Container>
                </Modal.Body>
            </Modal>

            <Modal
                dialogClassName="modala"
                show={progressModalShow}
                // show={true}
                backdrop="static"
                keyboard={false}
                size="md"
                centered>
                <Modal.Header closeVariant='black' style={{ height: "70px" }}>
                    <Modal.Title>Generating NFT, Please wait...</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ marginTop: "-10px" }}>
                    <Container>
                        <div>{progressStatu} out of {number}</div>
                        <LinearProgress />
                    </Container>
                </Modal.Body>
            </Modal>

        </div >


    );
};

export default Home;