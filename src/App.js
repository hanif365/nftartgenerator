import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import ImageUploading from 'react-images-uploading';
import mergeImages from 'merge-images';
import { saveAs } from 'file-saver';
import Layers from './components/Layers/Layers';
import MultiSlider from './components/Multislider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons';

import Modal from "react-bootstrap/Modal";
import {Container,Row,Col} from "react-bootstrap"

const data = ["Red hat", "Blue hat", "Green hat", "Black hat"]

function App() {
  const [images, setImages] = useState([]);
  const maxNumber = 100;
  const [combined, setcombineimages] = useState();
  const [rarityModalShow,setRarityModalShow] = useState(false) 

  const modalclose=()=>{setRarityModalShow(false)}

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

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

  const showmodal = () => {
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
          <button onClick={showmodal}>Rarity</button>
        </div>
        <div className="col-md-3"></div>


      </div>

      <Modal 
        dialogClassName ="modala"
        show={rarityModalShow}
        onHide={modalclose}
        backdrop="static"
        keyboard={false}
        centered>
          <Modal.Header closeButton closeVariant='black' style={{height:"10px"}}>
                <Modal.Title>Rarity Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{marginTop:"-10px"}}>
            <Container>
              <MultiSlider Sliders = {data}/>
            </Container>
          </Modal.Body>
        </Modal>

    </div>
  );
}

export default App;
