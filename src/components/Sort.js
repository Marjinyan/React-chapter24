import { Button, ButtonGroup } from '@mui/material'

const Sort = ({fn}) => {
    return <div>
        <ButtonGroup>
            <Button onClick={() => fn()}>price (asc)</Button>
            <Button onClick={() => fn('desc')}>price (desc)</Button>
        </ButtonGroup>
    </div>
}
export default Sort