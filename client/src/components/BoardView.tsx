import axios from "axios"
import {useEffect, useState} from "react"
import LensOutlinedIcon from '@mui/icons-material/LensOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import Chip from '@mui/material/Chip'
import {useNavigate} from "react-router-dom"

export const BoardView = () => {
    const [tasks, setTasks] = useState<any>([])
    const navigate = useNavigate()

    useEffect(() => {
	axios
	    .get('/tasks')
	    .then((response) => {
		setTasks(response.data)
	    })
	    .catch((error) => {
		console.log(error)
	    })
    }, [])

    const columns = [
	{
	    name: <h1 className="text-sm text-gray-500">To-Do</h1>,
	    refName: 'To-Do',
	    icon: <LensOutlinedIcon className='text-gray-500'/>,
	},
	{
	    name: <h1 className="text-sm text-green-800">Done</h1>,
	    refName: 'Done',
	    icon: <CheckCircleOutlineOutlinedIcon className='text-green-800'/>,
	},
    ]

    let color_choices: "primary" | "secondary" | "success" | "default" | "error" | "info" | "warning" | undefined;
    let colors = ['primary', 'secondary', 'success', 'default', 'error', 'info', 'warning', 'undefined']

    const handleRedirectToTaskView = (event: any) => {
	const id = event.currentTarget.id
	navigate(`/task_view/${id}`)
    }

    const renderTask = (task: any) => {
	// @ts-ignore
	const color: typeof color_choices = colors[Math.floor(Math.random()*colors.length)]
	return (
	    <div className="bg-gray-800 p-3 rounded-xl space-y-3 cursor-pointer" id={task.id} onClick={handleRedirectToTaskView}>
		<div className="flex flex-row items-center space-x-2">
		    <ArticleOutlinedIcon className="text-gray-200"/>
		    <h1 className="text-gray-200 text-sm">{task.name}</h1>
		</div>
		{
		    task.tags.map((tag: any) => {
			return <Chip label={tag} className='px-3 font-semibold' color={color} size='small'/>
		    })
		}
	    </div>
	)
    }

    const renderColumn = (column: any) => {
	let currentTasks: any = []
	if(column.refName === 'To-Do') {
	    currentTasks = tasks.filter((item: any) => item.done === false)		
	} else if(column.refName === 'Done') {
	    currentTasks = tasks.filter((item: any) => item.done === true)		
	}

	return (
	    <div className="w-[220px] space-y-3">
		<div className="flex flex-row space-x-1 items-center">
		    { column.icon } 
		    { column.name }
		</div>		
		<div className="flex flex-col space-y-2">
		{ currentTasks.map((task: any) => renderTask(task)) }
		</div>
	    </div>
	)
    }

    return (
	<div className="p-2">
	    <div className="flex flex-row space-x-5">
		{
		    columns.map((item: any) => renderColumn(item))
		}
	    </div>
	</div>
    )
}
