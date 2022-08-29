import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useState, useEffect } from "react"
import {Container,Row,Col} from "react-bootstrap"
import Switch from '@mui/material/Switch';

function MultiSlider({Items, sendValues}){

    const [advancedMode, setAdvancedMode] = useState(false)
    const [advancedvalues, setAdvancedValues] = useState(
        new Array(Items.length).fill(50)
    )
    const [totalRange, setTotalRange] = useState(Items.length * 50)

    useEffect(()=>{
        let arr = []
        advancedvalues.forEach((item, index)=>{
            arr.push((item / totalRange * 100).toFixed(2))
        })
        sendValues(arr)
    },[advancedvalues])

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
                    <Switch checked = {advancedMode} defaultChecked onChange={ e => setAdvancedMode(e.target.checked)}/>
                </Col>

            </Row>
            
            { Items ?
                Items.map((item, index)=>
                    <div key={index} className = "margin">
                        {
                            !advancedMode?
                            <Row>
                                <Col xs={12} md={6}>
                                    <Row>
                                        <Col xs={6} md={6}>
                                            {item.file.name}
                                        </Col>
                                        <Col xs={6} md={6}>
                                            { (advancedvalues[index] / totalRange * 100).toFixed(2)}%
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} md={6}>
                                    <Slider
                                        size="small"
                                        value={advancedvalues[index] / totalRange * 100}
                                        aria-label="Small"
                                        valueLabelDisplay="auto"
                                        onChange={(e) => advanceHandleChange(index, e.target.value)}
                                    />
                                </Col>
                            </Row>:
                            <Row>
                                <Col xs={12} md={6}>
                                    <Row>
                                        <Col xs={6} md={6}>
                                            {item.file.name}
                                        </Col>
                                        <Col xs={6} md={6}>
                                            { (advancedvalues[index] / totalRange * 100).toFixed(2)}%
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12} md={6}>
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