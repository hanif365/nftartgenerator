import React, { useEffect, useState } from 'react';
import './Layers.css';
// import todoLogo from '../../Assets/Images/todoLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faSquarePlus, faTrash } from '@fortawesome/free-solid-svg-icons';


// Get Data from Local Storage
const getLocalLayers = () => {
    let layers = localStorage.getItem('todoLayers');
    // console.log(layers);

    if (layers) {
        return JSON.parse(layers);
    } else {
        return [];
    }

}


const Layers = () => {
    const [inputData, setInputData] = useState("");
    const [layers, setLayers] = useState(getLocalLayers());

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
    const checkLayer = (checkedOrNot, id) => {

        console.log("Complete layers: ", checkedOrNot);
        console.log("Complete layers ID : ", id);

    }

    // Store Data in Local Storage
    useEffect(() => {
        localStorage.setItem('todoLayers', JSON.stringify(layers))
    }, [layers])
    return (
        <div className='container-fluid py-5 todoContainer'>
            <div className="">
                <div className=" bg-light py-5">
                    <div className='text-center'>
                        <figure>
                            {/* <img src={todoLogo} alt="todoLogo" className='todoLogo' /> */}
                        </figure>
                        <figcaption className='todoTitle'></figcaption>
                    </div>

                    <div className='d-flex p-3 '>
                        <input type="text" className="form-control me-3 inputField" placeholder='Add layer' value={inputData} onChange={(e) => setInputData(e.target.value)} />
                        <FontAwesomeIcon icon={faSquarePlus} className='addBtn' onClick={() => addLayer()} />
                    </div>

                    <div className='px-3'>
                        {
                            layers.map((layer, index) => {
                                return (
                                    <div className=' my-2 ' key={index}>
                                        <a href="#" className="list-group-item list-group-item-action list-group-item-primary d-flex justify-content-between show-field"><span><input className="form-check-input" type="radio" name="flexRadioDefault" id={index} onChange={(e) => checkLayer(e.target.checked, index)}></input> {layer}</span> <span><FontAwesomeIcon icon={faTrash} className="inner-fw-delete" onClick={() => deleteLayer(index)} /> </span></a>
                                    </div>
                                )
                            })
                        }
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