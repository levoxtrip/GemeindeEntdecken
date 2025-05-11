import '../../App.css'
interface Props{
    imgSrc:string;
}

const BGImage = ({imgSrc}:Props) => {
  return (
    <div>
        <img className="bg-top-img" src={imgSrc}></img>
        
    </div>
  )
}

export default BGImage