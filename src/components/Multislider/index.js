import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useState, useEffect } from "react"

function MultiSlider(Items){
    const [values, setValues] = useState(
        new Array(Items.Sliders.length).fill(100 / Items.Sliders.length)
    )


    function handleChange(index, value) {
        let maxValue = 100
        const remaining = maxValue - parseInt(value, 10)
        setValues((vs) =>
          vs.map((v, i) => {
            if (i === index) return parseInt(value, 10)
            const oldRemaining = maxValue - parseInt(vs[index], 10)
            if (oldRemaining) return (remaining * v) / oldRemaining
            return remaining / (Items.Sliders.length - 1)
          }),
        )
      }

    return (
        <Box>
            {
                Items.Sliders.map((item, index)=>
                    <div key={index}>
                        <span>{item}</span>

                        <Slider
                            size="small"
                            value={values[index]}
                            aria-label="Small"
                            valueLabelDisplay="auto"
                            onChange={(e) => handleChange(index, e.target.value)}
                        />
                        
                    </div>
                )
            }
        </Box>
      );
}

export default MultiSlider;