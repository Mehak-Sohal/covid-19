import React from 'react'
import './InfoBox.css'
import { Card, CardContent, Typography } from '@material-ui/core'

const InfoBox = ({ title, cases, isGreen, active, total, ...props }) => {
    return (
            <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox-selected'}`}>
                <CardContent>
                    {/* title */}
                    <Typography color='textSecondary' className='infoBox-title'>
                        <strong>{title}</strong>
                    </Typography>
                    {/* cases */}
                    <h2 className={`infoBox-cases ${isGreen && 'infoBox-green'}`}>
                        {cases}
                    </h2>
                    {/* total */}
                    <Typography color='textSecondary' className='infoBox-total'>
                        {total} Total
                    </Typography>
                </CardContent>
            </Card>
    )
}

export default InfoBox
