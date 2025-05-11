import "../../App.css";
interface Props {
  currLangIndex: number;
  onLangBtnClicked: () => void;
}

const LangBtn = ({ currLangIndex, onLangBtnClicked }: Props) => {
  const currLangBtnSrc = () => {
    switch (currLangIndex) {
      case 0:
        return "/img/ger.png";
        break;
      case 1:
        return "/img/eng.png";
        break;
      default:
        return "/img/ger.png";
        break;
    }
  };
  return (
    <div>
      <img
        className="lang-btn"
        src={currLangBtnSrc()}
        onClick={onLangBtnClicked}
      ></img>
    </div>
  );
};

export default LangBtn;
