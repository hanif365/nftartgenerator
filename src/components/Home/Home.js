import { useContext, useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import mergeImages from 'merge-images';
import { saveAs } from 'file-saver';
import './Home.css';
import Layers from '../Layers/Layers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons';

// indexedDB
import Localbase from 'localbase';
import { ALLLayerContext, LayerContext } from '../../App';
let db = new Localbase('nftArtDB');

const Home = () => {
    const [allLayers, setAllLayers] = useContext(ALLLayerContext);
    const [selectedLayer, setSelectedLayer] = useContext(LayerContext);

    // console.log("ALL Layers from Layers Component: ", allLayers);

    // console.log("selectedLayer : ", selectedLayer);
    const [reload, setReload] = useState(false);

    // code for combine
    const [reloadCombine, setReloadCombine] = useState(false);

    // extra
    // const [allLayerValues, setAllLayerValues] = useState({
    //     // test: [],
    //     // Skin: [],
    //     // Eyes: [],
    //     // Background: [],
    //     // Mouth: [],
    // });
    // const changeHandler = e => {
    //     setAllLayerValues({ ...allLayerValues, [e.target.name]: e.target.value })
    // }


    // new journey start
    const [layer0, setLayer0] = useState([]);
    const [layer1, setLayer1] = useState([]);
    const [layer2, setLayer2] = useState([]);
    const [layer3, setLayer3] = useState([]);
    // new journey end

    const [images, setImages] = useState([]);
    const maxNumber = 100;
    const [combined, setcombineimages] = useState();

    const onChange = async (imageList, addUpdateIndex) => {

        // console.log(imageList);
        // console.log(addUpdateIndex);

        // code used for remove an image
        // here we set addUpdateIndex value 0 if it was undefined
        addUpdateIndex = addUpdateIndex ? addUpdateIndex : 0;

        // console.log(addUpdateIndex);

        let newUploadImageStore = [];

        for (let i = 0; i < addUpdateIndex.length; i++) {
            // console.log(imageList[addUpdateIndex[i]]);
            newUploadImageStore.push(imageList[addUpdateIndex[i]])
        }

        // console.log(newUploadImageStore);
        // console.log(selectedLayer);
        // console.log(images);

        let newImageGroup;

        // condition check for remove operation (we set if addUpdateIndex is undefined then it value will be 0)
        //  when we delete an image then we get updated list from imageList
        if (addUpdateIndex == 0) {
            // newImageGroup = newUploadImageStore.concat(...imageList)
            newImageGroup = imageList;
        }
        else {
            newImageGroup = newUploadImageStore.concat(...images);
        }
        // console.log(newImageGroup);


        await db.collection(selectedLayer).add({ newImageGroup })

        setReload(!reload);
    };

    useEffect(() => {
        db.collection(selectedLayer).get().then(selectedLayer => {
            // console.log("ALl selectedLayer : ", selectedLayer);
            // console.log(selectedLayer.length);

            // console.log(selectedLayer[selectedLayer.length - 1].newUploadImageStore);
            // setImages(selectedLayer[selectedLayer.length - 1].newUploadImageStore);

            // working
            // console.log(selectedLayer[selectedLayer.length - 1].newImageGroup);
            // setImages(selectedLayer[selectedLayer.length - 1].newImageGroup);

            if (selectedLayer.length == 0) {
                setImages([])
            }
            else {
                // console.log(selectedLayer[selectedLayer.length - 1].newImageGroup);
                setImages(selectedLayer[selectedLayer.length - 1].newImageGroup);
            }


        })
    }, [selectedLayer, reload])

    // console.log(typeof (images));
    // console.log(images);

    // code for combine
    // useEffect(() => {
    //     // console.log(allLayers);

    //     for (let i = 0; i < allLayers.length; i++) {
    //         // console.log(allLayers[i]);

    //         db.collection(allLayers[i]).get().then(allLayer => {
    //             var layerName = allLayers[i];
    //             console.log(layerName);


    //             // console.log("allLayer : ", allLayer);
    //             // console.log("Current Images of Layer : ", allLayer[allLayer.length - 1].newImageGroup);

    //             // setAllLayerValues(allLayer[allLayer.length - 1].newImageGroup)

    //             setAllLayerValues({ ...allLayerValues, [layerName]: allLayer[allLayer.length - 1].newImageGroup })

    //             // console.log("Length: ", allLayer[allLayer.length - 1].newImageGroup.length);

    //         })

    //     }



    // }, [allLayers, reloadCombine])


    // new journey start
    useEffect(() => {
        console.log(allLayers);
        console.log(allLayers[0]);
        
        
        // for(let i = 0; i< allLayers.length; i++ ){
        //     db.collection(allLayers[i]).get().then(allLayer => {
        //         setLayer0(allLayer[allLayer.length - 1].newImageGroup)
                
        //     })
        // } 

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

    console.log(layer0);
    console.log(layer1);
    console.log(layer2);
    console.log(layer3);
    
    // new journey end




    // console.log("ALlLayers Value : ******** : ", allLayerValues);
    // console.log("test : ******** : ", allLayerValues.test);
    // console.log("skin : *********: ", allLayerValues.Skin);
    // console.log("Eyes : *********: ", allLayerValues.Eyes);
    // console.log("Mouth : *********: ", allLayerValues.Mouth);
    // console.log("Background : *********: ", allLayerValues.Background);

    // get layer content from useState
    // console.log(allLayers);
    // console.log(allLayers.length);
    // for (let i = 0; i < allLayers.length; i++) {
    //     console.log("***********************STARTING *************************");
    //     console.log(allLayers[i]);
    //     const tt = allLayers[i];
    //     console.log(tt);

    //     console.log("Hanif : ******** : ", allLayerValues[tt]);
    //     console.log("Hanif child: ******** : ", allLayerValues[tt]?.[0]);
    //     // console.log("Hanif : ******** : ", allLayerValues);
    // }




    console.log(layer0.length);
    console.log(layer1.length);
    console.log(layer2.length);
    console.log(layer3.length);
    // const maxUniqueLayer1Value = Math.floor(Math.random() * (max - min + 1)) + min;
    const maxUniqueLayer0Value = Math.floor(Math.random() * (layer0.length - 1 + 1));
    const maxUniqueLayer1Value = Math.floor(Math.random() * (layer1.length - 1 + 1));
    const maxUniqueLayer2Value = Math.floor(Math.random() * (layer2.length - 1 + 1));
    const maxUniqueLayer3Value = Math.floor(Math.random() * (layer3.length - 1 + 1));

    const combine = () => {
        mergeImages([
            // allLayerValues.Background?.[0].data_url,
            // console.log(allLayerValues.Skin),
            // allLayerValues.Skin?.[0].data_url,
            // allLayerValues.Eyes?.[0].data_url,
            // allLayerValues.Mouth?.[0].data_url,
            // allLayerValues.test?.[0].data_url,

            // images[0].data_url,
            // images[1].data_url,
            // images[2].data_url,
            // images[3].data_url,

            // layer0[0].data_url,
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

    const download = () => {
        saveAs(combined, 'image.jpg') // Put your image url here.
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

                    <button className='btn btn-success' onClick={combine} onMouseEnter={() => setReloadCombine(true)}> combine</button>
                    <img width="100" src={combined}></img>
                    <button className='btn btn-info' onClick={download}> download</button>
                </div>
                <div className="col-md-3"></div>


            </div >

            {/*  */}
            {/* {allLayerValues.mobile} <br />
            {allLayerValues.username}
            <input type="text"
                className="form-control"
                id="mobile"
                name="mobile"
                placeholder="Enter a valid mobile number"
                onChange={changeHandler}
            />
            <input type="text"
                className="form-control"
                id="username"
                name="username"
                placeholder="Enter a valid mobile number"
                onChange={changeHandler}
            /> */}
            {/*  */}
        </div >
    );
};

export default Home;