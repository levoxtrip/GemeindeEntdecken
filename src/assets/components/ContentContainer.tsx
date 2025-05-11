
import NextStationBtn from "./NextStationBtn";
import {StationData} from "../data/stationData"
import MapComponent from "./MapComponent";
import '../../App.css'
interface Props{
    currLangIndex:number;
    handleNextStationBtnClicked: ()=>void;
    stationData:StationData
}

const ContentContainer = ({currLangIndex,stationData,handleNextStationBtnClicked}:Props) => {
  return (
    <div>
        {stationData.stationTypeIndex ===0 && (
            <>
            <h1 className="title">{stationData.languages[currLangIndex].title}</h1>
            <div className="text-field">
            <p className="station-text">{stationData.languages[currLangIndex].description}</p>
            </div>
            <NextStationBtn onNextStationBtnClicked={handleNextStationBtnClicked}/>
            </>
        )}
        {
        stationData.stationTypeIndex ===1 && (
            <>
            <h1 className="title">{stationData.languages[currLangIndex].title}</h1>
            
            <p className="station-text">{stationData.languages[currLangIndex].description}</p>
            
            <MapComponent stationData={stationData}/>
            <NextStationBtn onNextStationBtnClicked={handleNextStationBtnClicked}/>
            </>
        )
        }
        

    </div>
  )
}

export default ContentContainer