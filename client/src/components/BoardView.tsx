import axios from "axios"

export const BoardView = () => {
    axios
	.get('/tasks')
	.then((response) => {
	    console.log(response.data)
	})

    return (
	<div>
	    
	</div>
    )
}
