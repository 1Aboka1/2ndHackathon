import { MainWindow } from "../components/MainWindow"

export const Home = () => {
    return (
	<div className="bg-black h-screen">
	<img className="text-white w-full object-cover h-[150px]" src={require('../assets/29391.jpg')} alt="japanese_image"/>
	    <div className="mx-auto w-[1150px]">
		<MainWindow/>
	    </div>
	</div>
    )
}
