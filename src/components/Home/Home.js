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
import { LayerContext } from '../../App';
let db = new Localbase('db');

const Home = () => {
    const [selectedLayer, setSelectedLayer] = useContext(LayerContext);
    console.log("selectedLayer : ", selectedLayer);
    const [reload, setReload] = useState(false);

    const [images, setImages] = useState([]);
    // const [images, setImages] = useState(getLocalImages());
    const maxNumber = 100;
    const [combined, setcombineimages] = useState();

    const onChange = async (imageList, addUpdateIndex) => {
        // data for submit
        // console.log(imageList, addUpdateIndex);

        console.log(imageList);
        console.log(addUpdateIndex);

        let newUploadImageStore = [];

        for (let i = 0; i < addUpdateIndex.length; i++) {
            console.log(imageList[addUpdateIndex[i]]);
            newUploadImageStore.push(imageList[addUpdateIndex[i]])
        }

        // const uploadImg = imageList.filter(imgs => {
        //     console.log(addUpdateIndex[0]);

        //     for (let i = 0; i < addUpdateIndex.length; i++) {
        //         console.log(imageList[addUpdateIndex[i]]);
        //         newUploadImageStore.push(imageList[addUpdateIndex[i]])
        //     }

        //     console.log(imageList[addUpdateIndex[0]]);
        //     return (imgs)

        // })
        // console.log(uploadImg);

        console.log(newUploadImageStore);

        // setImages(imageList);

        // indexedDB
        console.log(selectedLayer);
        console.log(images);

        // setReload(!reload);

        const newImageGroup = newUploadImageStore.concat(...images)
        console.log(newImageGroup);



        await db.collection(selectedLayer).add({ newImageGroup })
        // await db.collection(selectedLayer).add({newUploadImageStore})

        // setReload(!reload);
        setReload(!reload);

        // setImages(newUploadImageStore);

        // empty image list after each insertion
        // imageList = [];
        // console.log(imageList);

    };

    useEffect(() => {
        db.collection(selectedLayer).get().then(selectedLayer => {
            console.log("ALl selectedLayer : ", selectedLayer);
            console.log(selectedLayer.length);

            // console.log(selectedLayer[selectedLayer.length - 1].newUploadImageStore);
            // setImages(selectedLayer[selectedLayer.length - 1].newUploadImageStore);

            // working
            // console.log(selectedLayer[selectedLayer.length - 1].newImageGroup);
            // setImages(selectedLayer[selectedLayer.length - 1].newImageGroup);

            if (selectedLayer.length == 0) {
                setImages([])
            }
            else {
                console.log(selectedLayer[selectedLayer.length - 1].newImageGroup);
                setImages(selectedLayer[selectedLayer.length - 1].newImageGroup);
            }


        })
    }, [selectedLayer, reload])

    console.log(typeof (images));
    console.log(images);

    const combine = () => {
        mergeImages([
            images[0].data_url,
            images[1].data_url,
            images[2].data_url,
            images[3].data_url,
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
                                            <div key={index} className="image-item-inner">
                                                <img src={image['data_url']} alt="" width="100" />
                                                <div className="">
                                                    <button className='btn btn-sm btn-primary me-3 mt-2' onClick={() => onImageUpdate(index)}>Update</button>
                                                    <button className='btn btn-sm btn-warning mt-2' onClick={() => onImageRemove(index)}>Remove</button>
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

                    <button onClick={combine}> combine</button>
                    <img width="100" src={combined}></img>
                    <button onClick={download}> download</button>
                </div>
                <div className="col-md-3"></div>


            </div>
        </div>
    );
};

export default Home;