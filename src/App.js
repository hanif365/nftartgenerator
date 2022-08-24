import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import ImageUploading from 'react-images-uploading';
import mergeImages from 'merge-images';
import { saveAs } from 'file-saver'

function App() {
  const [images, setImages] = useState([]);
  const maxNumber = 100;
  const [combined, setcombineimages] = useState();

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

  return (
    <div className="App">
      <header className="App-header">
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
          <div className="upload__image-wrapper">
            <button
              style={isDragging ? { color: 'red' } : undefined}
              onClick={onImageUpload}
              {...dragProps}
            >
              Click or Drop here
            </button>
            &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image['data_url']} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
      <button onClick={combine}> combine</button>
      <img width="100" src={combined}></img>
      <button onClick={download}> download</button>
      </header>
    </div>
  );
}

export default App;
