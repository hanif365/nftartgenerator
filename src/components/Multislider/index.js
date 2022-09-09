import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import Switch from '@mui/material/Switch';
import './index.css';

function MultiSlider({ Items, sendValues, values, layername }) {
    console.log("Items : ", Items);

    const [advancedMode, setAdvancedMode] = useState(false)
    const [advancedvalues, setAdvancedValues] = useState([])
    const [totalRange, setTotalRange] = useState()

    useEffect(() => {
        setAdvancedValues(values[layername])
        // setTotalRange(values[layername].reduce((x, y) => parseInt(x) + parseInt(y)))
        setTotalRange(values[layername].reduce((x, y) => parseInt(x) + parseInt(y), 0))
    }, [])

    useEffect(() => {

        let arr = []
        advancedvalues.forEach((item, index) => {
            arr.push((item / totalRange * 100).toFixed(2))
        })
        let obj = {}
        obj[layername] = arr
        sendValues(layername, obj)

    }, [advancedvalues])

    function advanceHandleChange(index, value) {
        let arr = [...advancedvalues]
        arr[index] = value
        setAdvancedValues(arr)
        setTotalRange(arr.reduce((x, y) => parseInt(x) + parseInt(y)))
    }

    return (
        <Box>
            <Row>
                <Col xs={12} md={3}>
                    Advanced Mode
                </Col>

                <Col xs={12} md={3}>
                    <Switch checked={advancedMode} defaultChecked onChange={e => setAdvancedMode(e.target.checked)} />
                </Col>

            </Row>

            {Items ?
                Items.map((item, index) =>
                    // console.log("Item  : ",item)

                    <div key={index} className="margin">
                        {
                            !advancedMode ?
                                <Row className='d-flex'>
                                    <Col xs={12} md={6} className="align-self-center">
                                        <Row>
                                            <Col xs={6} md={6}>
                                                {/* {item.file.name} */}
                                                <img src={item['data_url']} className="traits_img" alt="traits_img" />
                                            </Col>
                                            <Col xs={6} md={6} className="mt-4">
                                                {(advancedvalues[index] / totalRange * 100).toFixed(2)}%
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} md={6} className="align-self-center mt-4">
                                        <Slider
                                            size="small"
                                            value={advancedvalues[index] / totalRange * 100}
                                            aria-label="Small"
                                            valueLabelDisplay="auto"
                                            onChange={(e) => advanceHandleChange(index, e.target.value)}
                                        />
                                    </Col>
                                </Row> :
                                <Row className='d-flex justify-content-center'>
                                    <Col xs={12} md={6} className="align-self-center">
                                        <Row>
                                            <Col xs={6} md={6}>
                                                {/* {item.file.name} */}
                                                <img src={item['data_url']} className="traits_img" alt="traits_img" />
                                            </Col>
                                            <Col xs={6} md={6} className="mt-4">
                                                {(advancedvalues[index] / totalRange * 100).toFixed(2)}%
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={12} md={6} className="align-self-center mt-4">
                                        <input
                                            type="number"
                                            value={advancedvalues[index]}
                                            onChange={(e) => advanceHandleChange(index, e.target.value)}
                                        /> out of {totalRange}
                                    </Col>
                                </Row>
                        }

                    </div>
                )
                :
                <></>
            }
        </Box>
    );
}

export default MultiSlider;