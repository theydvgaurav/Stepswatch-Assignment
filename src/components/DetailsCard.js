import React from 'react'
import './DetailsCard.css'

const DetailsCard = (props) => {
    return (
        <div className='maincontainer' >
            <div className='divContainer'>
                <div className='divItems title' >{props.item.title}</div>
            </div>
        </div>
    )
}

export default DetailsCard