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

import Modal from "react-bootstrap/Modal";
import { Container, Row, Col } from "react-bootstrap"

// indexedDB
import Localbase from 'localbase';
import { ALLLayerContext, LayerContext } from '../../App';
let db = new Localbase('nftArtDB');

var zip = require('jszip')();

const Home = () => {
    const [allLayers, setAllLayers] = useContext(ALLLayerContext);
    const [selectedLayer, setSelectedLayer] = useContext(LayerContext);
    const [rarityModalShow,setRarityModalShow] = useState(false) 
    const [jsonfiles, setJsonfiles] = useState([])
    const [rarities, setRarities] = useState([])
    const [number, setNumber] = useState(1)
    const [reload, setReload] = useState(false);
    const [reloadCombine, setReloadCombine] = useState(false);
    const [projectname, setProjectname] = useState('')
    const [description, setDescription] = useState('')

    const [images, setImages] = useState([]);
    const maxNumber = 100;
    const [combined, setcombineimages] = useState([]);

    const modalclose = () => { setRarityModalShow(false) }

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
                let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
                let obj = {}
                obj[item] = temp1
                arr1.push(obj)
                let obj1 = {}
                let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
                obj1[item] = temp
                arr.push(obj1)
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

    const combine = () => {
        console.log(allLayers)
        if (!number) alert("input number")

        let arr = []
        let files = []

        for (let j = 0; j < number; j++) {
            let temp = []
            let objarr = []
            allLayers.map(layer => {
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

            // layerValue.map(item=>{
            //     let key = Object.keys(item)[0]
            //     let total = rarities.find(item => item[key])[key].reduce((x, y) => parseInt(x) + parseInt(y))
            //     let rarityitem = rarities.find(item => item[key])
            //     let newarr = []
            //     for(let i = 0; i <rarityitem[key].length; i++ ){
            //         newarr.push(rarityitem[key][i] / total)
            //     }
            //     let random = getRandom(newarr)
            //     temp.push(item[key][0][random - 1].data_url)
            // })

            mergeImages(temp)
                .then((b64) => {
                    arr.push(b64)
                    setcombineimages(arr)
                    let jsonobj = {}
                    jsonobj['attributes'] = objarr
                    jsonobj['image'] = `${j}.jpg`
                    if(projectname)
                        jsonobj['name'] = projectname
                    if(description)
                        jsonobj['description'] = description
                    files.push(jsonobj)
                    console.log(files)
                    setJsonfiles(files)
                })
                .catch(error => console.log(error))
        }
    }

    // code for make download nft as zip format
    const download = async () => {
        var img = zip.folder("images");
        var json = zip.folder("json");

        for (let i = 0; i < combined.length; i++) {
            const dataFileArr = combined[i].split(",");

            const dataFile = dataFileArr[1]

            const textFile = new Blob([JSON.stringify(jsonfiles[i])], {type: 'text/plain'});

            img.file(`${i}.png`, dataFile, { base64: true });
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

    return (
        <div className="App-container">
            <div className="row">
                <div className="col-md-3">
                    <Layers></Layers>
                </div>
                <div className="col-md-6 bg-light my-5">
                    <div className='upload-layer-images-div text-center py-5'>
                        <h2>Upload your layer images</h2>
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
                                        {...dragProps}
                                    >
                                        {/* Click or Drop here */}
                                        <FontAwesomeIcon icon={faCamera} className='addBtn' />
                                    </button>
                                    <div className="image-item margin-bottom">
                                        {images && images.map((image, index) => (
                                            <div key={index} class="card image-card">
                                                <img src={image['data_url']} class="card-img-top" alt="..." />
                                                    <div class="card-text">{image['file']['name']}</div>
                                                    <div className='positionabsolute' onClick={() => onImageRemove(index)}><AiFillCloseCircle/></div>
                                            </div>

                                        ))}
                                    </div>
                                    <div className='my-5'>
                                        {images && images.length ? <button className='btn btn-danger' onClick={onImageRemoveAll}>Remove all images</button> : ' '}
                                    </div>
                                </div>
                            )}
                        </ImageUploading>
                    </div>
                  
                </div>
                <div className="col-md-3 py-5 px-5">
                    <div className='row'>
                        <div className='col-12 py-1'>
                            <input className='w-100 h-100' placeholder='Project Name' type="text" value={projectname} onChange={e => setProjectname(e.target.value)}></input>  
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 py-1'>
                            <input className='w-100 h-100' placeholder='Description' type="text" value={description} onChange={e => setDescription(e.target.value)}></input>  
                        </div>
                    </div>
                    <div className='row py-1'>
                        <div className='col-6'>
                            <input className='w-100 h-100' type="number" value={number} onChange={e => setNumber(e.target.value)}></input>  
                        </div>
                        <div className='col-6'>
                            <button className='btn btn-success' onClick={combine} onMouseEnter={() => setReloadCombine(true)}> combine</button>
                        </div>
                    </div>
                    <div className='previewtext'>
                        Preview
                    </div>
                    <div className='fixed-height'>
                        {
                            combined ?
                                combined.map(item => (
                                    <img className='m-1 border border-1 border-primary hoverscale' width="100" src={item}></img>
                                ))
                                :
                                <></>
                        }
                    </div>
                    <div className='row'>
                        <div className='col-6'>
                            <button className='btn btn-info' onClick={download}> download</button>
                        </div>
                        <div className='col-6'>
                            <button className='btn btn-danger' onClick={showmodal}>Rarity</button>
                        </div>
                    </div>
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

            </div >

            
    );
};

export default Home;