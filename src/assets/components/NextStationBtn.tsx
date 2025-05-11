import '../../App.css'
interface Props{
    onNextStationBtnClicked:()=> void;
}

const NextStationBtn = ({onNextStationBtnClicked}:Props) => {
  return (
    <div>
        <button className='next-station-btn' onClick={onNextStationBtnClicked}>→</button>
    </div>
  )
}

export default NextStationBtn;