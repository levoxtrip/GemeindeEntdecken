import { useEffect, useState } from "react";
import data from './assets/data/stations.json'
import HeaderComponent from "./assets/components/HeaderComponent"
import ContentContainer from "./assets/components/ContentContainer";
import { StationData } from "./assets/data/stationData";

function App(){
    let[stationIndex,setStationIndex] =useState(0);
    let[currentLanguageIndex,setCurrentLanguageIndex] = useState(0);
    const stationData = data[stationIndex] as StationData;


    const handleNextStationBtnClicked = () => {
        if(stationIndex< data.length-1){
        setStationIndex(stationIndex + 1);
        } else {
            setStationIndex(0);
        }
    }

    const handleLangBtnClicked = () => {
        currentLanguageIndex = (currentLanguageIndex + 1) % stationData.languages.length;
        setCurrentLanguageIndex(currentLanguageIndex);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
      }, [stationIndex]); 

    return(
        <div>
            {stationData && (
            <>
            <HeaderComponent stationData={stationData} currentLangIndex={currentLanguageIndex} handleLangBtnClicked={handleLangBtnClicked}/>
            {/* <BGImage imgSrc={stationData.image}/>
            <PlayAudioBtn currLangIndex={currentLanguageIndex}/>
            <LangBtn currLangIndex={currentLanguageIndex} onLangBtnClicked={handleLangBtnClicked}/> */}
            <ContentContainer stationData={stationData} currLangIndex={currentLanguageIndex} handleNextStationBtnClicked={handleNextStationBtnClicked}/>
     
            </>
      
    )}
    </div>
    
    )
}

export default App;