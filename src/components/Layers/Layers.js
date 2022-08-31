import React, { useContext, useEffect, useState } from 'react';
import './Layers.css';
import ReactDragListView from 'react-drag-listview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ALLLayerContext, LayerContext } from '../../App';


// Get Data from Local Storage
const getLocalLayers = () => {
    let layers = localStorage.getItem('nftArtLayers');
    console.log(layers)
    if (layers) {
        return JSON.parse(layers);
    } else {
        return [];
    }

}


const Layers = () => {
    const [allLayers, setAllLayers] = useContext(ALLLayerContext);
    const [selectedLayer, setSelectedLayer] = useContext(LayerContext);
    const [inputData, setInputData] = useState("");
    const [layers, setLayers] = useState(getLocalLayers());

    setAllLayers(layers);

    // Add layers
    const addLayer = () => {
        console.log("Input Data: ", inputData);
        console.log("Layers: ", layers);

        // Check if duplicate layers in the list. Duplicate layers can't be added.
        const duplicate = layers.includes(inputData);
        console.log(duplicate);

        if (duplicate) {
            alert("This layers Already Exists!");
            setInputData('');

        }
        else if (!inputData) {
            alert("Please input a layers!");
            setInputData('');
        }
        else {
            setLayers([...layers, inputData]);
            setInputData('');
        }
    }

    // Delete layers
    const deleteLayer = (id) => {
        // console.log(id);
        const updatedLayers = layers.filter((element, ind) => {
            return id !== ind;
        })
        // console.log(updatedLayers);

        setLayers(updatedLayers);


    }

    // Clear all layers
    const clearAllLayer = () => {
        setLayers([]);
    }

    // Complete layers
    const checkLayer = (checkedOrNot, id, layer) => {
        console.log("Complete layers: ", checkedOrNot);
        console.log("Complete layers ID : ", id);
        console.log(layer);
        setSelectedLayer(layer);
    }

    // Store Data in Local Storage
    useEffect(() => {
        localStorage.setItem('nftArtLayers', JSON.stringify(layers))
    }, [layers])

    const dragProps = {
        onDragEnd(fromIndex, toIndex) {
            const data = layers;
            const item = data.splice(fromIndex, 1)[0];
            data.splice(toIndex, 0, item);
            console.log(data)
            setLayers(data)
            console.log(layers)
        },
        nodeSelector: 'div',
        handleSelector:'a'
      };
  
    
    return (
        <div className='container-fluid py-5 todoContainer'>
            <div className="">
                <div className=" bg-light py-5">
                    <p className='add-layer-p'>Add Layer</p>
                    <div className='d-flex px-3 '>
                        
                        <input type="text" className="form-control me-3 inputField" placeholder='Add Layer' value={inputData} onChange={(e) => setInputData(e.target.value)} />
                        <FontAwesomeIcon icon={faSquarePlus} className='addBtn' onClick={() => addLayer()} />
                    </div>

                    <div className='px-3'>
                        <ReactDragListView {...dragProps}>
                            {
                                layers.map((layer, index) => (
                                    <div className=' my-2 ' key={index}>
                                        <a href="#" className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between show-field"><span><input className="form-check-input" type="radio" name="flexRadioDefault" id={index} onChange={(e) => checkLayer(e.target.checked, index, layer)}></input> {layer}</span> <span><FontAwesomeIcon icon={faTrash} className="inner-fw-delete" onClick={() => deleteLayer(index)} /> </span></a>
                                    </div>
                                ))
                            }
                        </ReactDragListView>
                        
                    </div>

                    <div className=' p-3 d-flex justify-content-between'>
                        <button className='btn btn-danger' onClick={clearAllLayer}>Clear All Layer</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Layers;