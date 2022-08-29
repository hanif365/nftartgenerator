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
import { Container, Row, Col } from "react-bootstrap"

// indexedDB
import Localbase from 'localbase';
import { ALLLayerContext, LayerContext } from '../../App';
let db = new Localbase('nftArtDB');

const Home = () => {
    const [allLayers, setAllLayers] = useContext(ALLLayerContext);
    const [selectedLayer, setSelectedLayer] = useContext(LayerContext);
    const [values, setValues] = useState([])
    const [rarityModalShow, setRarityModalShow] = useState(false)
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
        db.collection('Skin').get().then(allLayer => {
            setLayer0(allLayer[allLayer.length - 1].newImageGroup)
            let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
            arr1.push({
                'Skin': temp1
            })
            let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
            arr.push({
                'Skin': temp
            })
        })
        db.collection('Shirts').get().then(allLayer => {
            setLayer1(allLayer[allLayer.length - 1].newImageGroup)
            let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
            arr1.push({
                'Shirts': temp1
            })
            let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
            arr.push({
                'Shirts': temp
            })
        })
        db.collection('Mouth').get().then(allLayer => {
            setLayer2(allLayer[allLayer.length - 1].newImageGroup)
            let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
            arr1.push({
                'Mouth': temp1
            })
            let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
            arr.push({
                'Mouth': temp
            })
        })
        db.collection('Eyes').get().then(allLayer => {
            setLayer3(allLayer[allLayer.length - 1].newImageGroup)
            let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
            arr1.push({
                'Eyes': temp1
            })
            let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
            arr.push({
                'Eyes': temp
            })
        })
        setRarities(arr)
        setLayerValue(arr1)
    }, [allLayers, reloadCombine])

    console.log(rarities);
    console.log(rarities[0]?.Skin[0]);

    console.log(layerValue);
    console.log(layerValue[0]?.Skin[0]?.[0].data_url);

    const maxUniqueLayer0Value = Math.floor(Math.random() * (layer0.length - 1 + 1));
    const maxUniqueLayer1Value = Math.floor(Math.random() * (layer1.length - 1 + 1));
    const maxUniqueLayer2Value = Math.floor(Math.random() * (layer2.length - 1 + 1));
    const maxUniqueLayer3Value = Math.floor(Math.random() * (layer3.length - 1 + 1));


    function getRandom(weights) {
        weights = weights.map(item => item / 100)
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

        if (!number) alert("input number")

        for (let i = 0; i < number; i++) {
            let arr = []
            mergeImages([
                // need to change the probability
                layerValue[0]?.Skin[0]?.[getRandom([0.1, 0.2, 0.7])].data_url,
                layerValue[0]?.Shirts[0]?.[getRandom([0.1, 0.2, 0.7])].data_url,
                layerValue[0]?.Eyes[0]?.[getRandom([0.1, 0.2, 0.7])].data_url,
                layerValue[0]?.Mouth[0]?.[getRandom([0.1, 0.2, 0.7])].data_url,

            ])
                .then((b64) => {
                    arr.push(b64)
                })
                .catch(error => console.log(error))
            setcombineimages(arr)
        }
    }

    const download = () => {
        saveAs(combined[0], 'image.jpg') // Put your image url here.
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
                    <input type="number" value={number} onChange={e => setNumber(e.target.value)}></input>
                    <button className='btn btn-success' onClick={combine} onMouseEnter={() => setReloadCombine(true)}> combine</button>
                    <img width="100" src={combined[0]}></img>
                    <button className='btn btn-info' onClick={download}> download</button>
                    <button onClick={showmodal}>Rarity</button>
                </div>
                <div className="col-md-3"></div>


            </div >

            <Modal
                dialogClassName="modala"
                show={rarityModalShow}
                onHide={modalclose}
                backdrop="static"
                keyboard={false}
                size="lg"
                centered>
                <Modal.Header closeButton closeVariant='black' style={{ height: "70px" }}>
                    <Modal.Title>Rarity Settings</Modal.Title>
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