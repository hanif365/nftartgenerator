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
                setLayer0(allLayer[allLayer.length - 1].newImageGroup)
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

        // db.collection('Skin').get().then(allLayer => {
        //     setLayer0(allLayer[allLayer.length - 1].newImageGroup)
        //     let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
        //     arr1.push({
        //         'Skin': temp1
        //     })
        //     let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
        //     arr.push({
        //         'Skin': temp
        //     })
        // })
        // db.collection('Shirts').get().then(allLayer => {
        //     setLayer1(allLayer[allLayer.length - 1].newImageGroup)
        //     let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
        //     arr1.push({
        //         'Shirts': temp1
        //     })
        //     let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
        //     arr.push({
        //         'Shirts': temp
        //     })
        // })
        // db.collection('Mouth').get().then(allLayer => {
        //     setLayer2(allLayer[allLayer.length - 1].newImageGroup)
        //     let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
        //     arr1.push({
        //         'Mouth': temp1
        //     })
        //     let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
        //     arr.push({
        //         'Mouth': temp
        //     })
        // })
        // db.collection('Eyes').get().then(allLayer => {
        //     setLayer3(allLayer[allLayer.length - 1].newImageGroup)
        //     let temp1 = new Array(allLayer[allLayer.length - 1].newImageGroup)
        //     arr1.push({
        //         'Eyes': temp1
        //     })
        //     let temp = new Array(allLayer[allLayer.length - 1].newImageGroup.length).fill(50)
        //     arr.push({
        //         'Eyes': temp
        //     })
        // })
        setRarities(arr)
        setLayerValue(arr1)
    }, [allLayers, reloadCombine])
    
    function getRandom (weights) {
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

        for (let j = 0; j < number; j++) {
            let temp = []
            allLayers.map(layer=>{
                for(let i = 0; i < layerValue.length; i++){
                    if( layerValue[i][layer] ){
                        let total = rarities.find(item => item[layer])[layer].reduce((x, y) => parseInt(x) + parseInt(y))
                        let rarityitem = rarities.find(item => item[layer])
                        let newarr = []
                        for(let i = 0; i < rarityitem[layer].length; i++ ){
                            newarr.push(rarityitem[layer][i] / total)
                        }
                        let random = getRandom(newarr)
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
            console.log(temp)
            
            mergeImages(temp)
            .then((b64) => {
                arr.push(b64)
                console.log(arr)
                setcombineimages(arr)
            })
            .catch(error => console.log(error))
        }
    }

    const download = async () => {
        for(let i = 0; i < combined.length; i++)
            saveAs(combined[i], `${i}.jpg`) // Put your image url here.
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
                                                    <p class="card-text">{image['file']['name']}</p>
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
                    {
                        combined?
                        combined.map(item=>(
                            <img width="100" src={item}></img>
                        ))
                        :
                        <></>
                    }
                    
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