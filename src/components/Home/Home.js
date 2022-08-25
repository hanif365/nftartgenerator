import { useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import mergeImages from 'merge-images';
import { saveAs } from 'file-saver';
import './Home.css';
import Layers from '../Layers/Layers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons';

// indexedDB
import Localbase from 'localbase';
let db = new Localbase('db');

// Get Data from Local Storage
// const getLocalImages = () => {
//   let images = localStorage.getItem('testImages');
//   // console.log(images);

//   if (images) {
//     return JSON.parse(images);
//   } else {
//     return [];
//   }
// }

const Home = () => {
    const [images, setImages] = useState([]);
    // const [images, setImages] = useState(getLocalImages());
    const maxNumber = 100;
    const [combined, setcombineimages] = useState();


    const onChange = async (imageList, addUpdateIndex) => {
        // data for submit
        // console.log(imageList, addUpdateIndex);
        console.log(imageList);
        // setImages(imageList);

        // indexedDB
        await db.collection('users').add({ imageList })
        setImages(imageList);
    };

    useEffect(() => {
        db.collection('users').get().then(users => {
            console.log("ALl users : ", users);
            console.log(users[users.length - 1].imageList)
            setImages(users[users.length - 1].imageList);
        })
    }, [])


    console.log(typeof (images));
    console.log(images);

    // Store Data in Local Storage
    // useEffect(() => {
    //   localStorage.setItem('testImages', JSON.stringify(images))
    // }, [images])

    // console.log(images.length);


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
                                        {imageList.map((image, index) => (
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
                                        {imageList.length ? <button className='btn btn-danger' onClick={onImageRemoveAll}>Remove all images</button> : ' '}
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