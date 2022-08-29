import { useContext, useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import mergeImages from 'merge-images';
import { saveAs } from 'file-saver';
import './Home.css';
import Layers from '../Layers/Layers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import MultiSlider from '../Multislider';

import Modal from "react-bootstrap/Modal";
import {Container,Row,Col} from "react-bootstrap"

// indexedDB
import Localbase from 'localbase';
import { ALLLayerContext, LayerContext } from '../../App';
let db = new Localbase('nftArtDB');

const Home = () => {
    const [allLayers, setAllLayers] = useContext(ALLLayerContext);
    const [selectedLayer, setSelectedLayer] = useContext(LayerContext);
    const [values, setValues] = useState([])
    const [rarityModalShow,setRarityModalShow] = useState(false) 
    const [rarities, setRarities] = useState([])
    const [number, setNumber] = useState(1)
    const [reload, setReload] = useState(false);
    const [reloadCombine, setReloadCombine] = useState(false);

    const [layer0, setLayer0] = useState([]);
    const [layer1, setLayer1] = useState([]);
    const [layer2, setLayer2] = useState([]);
    const [layer3, setLayer3] = useState([]);

    const [images, setImages] = useState([]);
    const maxNumber = 100;
    const [combined, setcombineimages] = useState();

    const modalclose=()=>{setRarityModalShow(false)}

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
        db.collection('Skin').get().then(allLayer => {
            setLayer0(allLayer[allLayer.length - 1].newImageGroup)
            
        })
        db.collection('Shirts').get().then(allLayer => {
            setLayer1(allLayer[allLayer.length - 1].newImageGroup)
            
        })
        db.collection('Mouth').get().then(allLayer => {
            setLayer2(allLayer[allLayer.length - 1].newImageGroup)
            
        })
        db.collection('Eyes').get().then(allLayer => {
            setLayer3(allLayer[allLayer.length - 1].newImageGroup)
            
        })

    }, [allLayers, reloadCombine])

    const maxUniqueLayer0Value = Math.floor(Math.random() * (layer0.length - 1 + 1));
    const maxUniqueLayer1Value = Math.floor(Math.random() * (layer1.length - 1 + 1));
    const maxUniqueLayer2Value = Math.floor(Math.random() * (layer2.length - 1 + 1));
    const maxUniqueLayer3Value = Math.floor(Math.random() * (layer3.length - 1 + 1));

    
    function getRandom (weights) {
        // weights = [0.3, 0.3, 0.3, 0.1]
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
        if(!number) alert("input number")
       for(let i = 0; i < number; i ++){

        mergeImages([
            layer0[maxUniqueLayer0Value].data_url,
            layer1[maxUniqueLayer1Value].data_url,
            layer2[maxUniqueLayer2Value].data_url,
            layer3[maxUniqueLayer3Value].data_url
        ])
            .then((b64) => {
                console.log(b64)
                setcombineimages(b64)
            })
            .catch(error => console.log(error))
       }
    }

    const download = () => {
        saveAs(combined, 'image.jpg') // Put your image url here.
    }

    const showmodal = () => {
        console.log(images)
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


                                    <div className="image-item">
                                        {images && images.map((image, index) => (
                                            <div key={index} class="card image-card">
                                                <img src={image['data_url']} class="card-img-top" alt="..." />
                                                <div class="">
                                                    <p class="card-text">test</p>
                                                    {/* <button className='btn btn-sm btn-primary me-3 mt-2' onClick={() => onImageUpdate(index)}>Update</button> */}
                                                    <button className='btn px-5 btn-warning mb-2' onClick={() => onImageRemove(index)}>Remove</button>
                                                </div>
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
                    <input type="number" value={number} onChange={e=>setNumber(e.target.value)}></input>
                    <button className='btn btn-success' onClick={combine} onMouseEnter={() => setReloadCombine(true)}> combine</button>
                    <img width="100" src={combined}></img>
                    <button className='btn btn-info' onClick={download}> download</button>
                    <button onClick={showmodal}>Rarity</button>
                </div>
                <div className="col-md-3"></div>


            </div >

            <Modal 
            dialogClassName ="modala"
            show={rarityModalShow}
            onHide={modalclose}
            backdrop="static"
            keyboard={false}
            size="lg"
            centered>
                <Modal.Header closeButton closeVariant='black' style={{height:"70px"}}>
                        <Modal.Title>Rarity Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{marginTop:"-10px"}}>
                    <Container>
                        <MultiSlider Items = {images} sendValues = {setValues}/>
                    </Container>
                </Modal.Body>
            </Modal>
        </div >
    );
};

export default Home;