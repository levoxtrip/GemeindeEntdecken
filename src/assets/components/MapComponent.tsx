import React, { useEffect } from 'react'
import { StationData } from '../data/stationData'
import {Loader} from '@googlemaps/js-api-loader'
import { useRef,useState } from 'react'

interface Props{
    stationData:StationData
}

const MapComponent = ({stationData}:Props) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [mapLoaded,setMapLoaded] = useState(false);

    useEffect(()=>{
        const loader = new Loader({
            apiKey:"AIzaSyCI5v_E8FctD-DHuPvKnZmZU5T-7m-XBco",
            version:"weekly"
        });

        loader.load().then(()=>{
            setMapLoaded(true);
        });

    },[])
    useEffect(() => {
        if (mapLoaded && mapRef.current) {
          const [lat, lng] = stationData.GPS;
          
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: 18,
          });
          
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: 'Station'
          });
        }
      }, [mapLoaded, stationData.GPS]);
    
  return (
    <div>
    <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>

<button className="google-maps-nav-btn">
    <a href={`https://www.google.com/maps?q=${stationData.GPS[0]},${stationData.GPS[1]}`} target="_blank">Google Maps Navigation</a>
    </button>
    </div>
  )
}

export default MapComponent