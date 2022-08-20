import { Slider } from '@mui/material';

const Filter = ({currentValue, onChange}) => {
    return <div>
        <Slider
            size="large"
            value={currentValue}
            valueLabelDisplay="auto"
            max={400}
            step={10}
            onChange={onChange}
        />
        <p>Minimum price: ${currentValue}</p>
    </div>
};
export default Filter;
