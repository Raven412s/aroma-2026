import React from 'react'

export const Map = ({mapSrc}:{mapSrc: string}) => {
    return (
        <div className="w-full h-full  relative">
            <iframe
                src={mapSrc}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Aroma Restaurant Location"
            />
        </div>
    )
}
