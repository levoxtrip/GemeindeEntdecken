import LangBtn from "./LangBtn";
import PlayAudioBtn from "./PlayAudioBtn";
import BGImage from "./BGImage";
import { StationData } from "../data/stationData";
import "../../App.css";
interface Props {
  currentLangIndex: number;
  handleLangBtnClicked: () => void;
  stationData: StationData;
}

const HeaderComponent = ({
  stationData,
  currentLangIndex,
  handleLangBtnClicked,
}: Props) => {
  return (
    <div>
      <>
        <div className="header-comp">
          <BGImage imgSrc={stationData.image} />
          {stationData.stationTypeIndex === 0 && (
            <PlayAudioBtn
              currentDescription={
                stationData.languages[currentLangIndex].description
              }
              currLangIndex={currentLangIndex}
            />
          )}
          <LangBtn
            currLangIndex={currentLangIndex}
            onLangBtnClicked={handleLangBtnClicked}
          />
        </div>
      </>
    </div>
  );
};

export default HeaderComponent;
