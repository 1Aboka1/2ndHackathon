import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import LensOutlinedIcon from '@mui/icons-material/LensOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {RootState} from '../store'
import {useNavigate} from 'react-router-dom'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import authSlice from '../store/slices/auth'
import {DataGrid, GridColDef, GridSelectionModel} from '@mui/x-data-grid'
import {ThemeProvider} from '@emotion/react'
import axios from 'axios'
import {createTheme} from '@mui/material'
import dayjs from 'dayjs'


const styleForSelectedButton = 'border-b border-white'
const styleForApplied = 'text-blue-300'

export const MainWindow = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClose = () => {
	setAnchorEl(null);
    };
    const [selectedView, setSelectedView] = useState('board')
    const [filterApplied, setFilterApplied] = useState(false)
    const [sortApplied, setSortApplied] = useState(false)
    const user = useSelector((state: RootState) => state.auth.account)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleNewButtonClick = () => {
    	navigate('/new_task')	
    }

    const handleLogOut = () => {
	dispatch(authSlice.actions.setLogout())
	navigate('/sign_in_up')
    }

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
	setFilterApplied(!filterApplied)
	setAnchorEl(event.currentTarget);
    }

    return (
	<div className="p-5 flex flex-col">
	    <div className='border-b border-gray-800 space-y-7'>
		<div className="bg-black flex flex-row justify-between items-center">
		    <div className='flex flex-row items-center space-x-2'>
			<TaskAltOutlinedIcon className='text-white' fontSize='large'/>
			<h1 className="text-gray-300 text-3xl font-semibold">Tasks</h1>
		    </div>
		    <Button variant='contained' color='warning' onClick={handleLogOut} className='text-white'>Exit</Button>
		</div>
		<div className="flex flex-row items-center justify-between">
		    <div className='flex flex-row space-x-2'>
			<div className={selectedView === 'board' ? styleForSelectedButton : ''}>
			    <Button onClick={() => setSelectedView('board')} className={'capitalize hover:bg-gray-900 ' + (selectedView === 'board' ? ' text-gray-100 border-b-2 border-white' : ' text-gray-400')} startIcon={<DashboardRoundedIcon/>}>Board</Button>
			</div>
			<div className={selectedView === 'table' ? styleForSelectedButton : ''}>
			    <Button onClick={() => setSelectedView('table')} className={'capitalize hover:bg-gray-900 ' + (selectedView === 'table' ? ' text-gray-100 border-b-2 border-white' : 'text-gray-400')} startIcon={<TableRowsRoundedIcon/>}>Table</Button>
			</div>
		    </div>
		    <div className='flex flex-row'>
			<Button id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined} onClick={handleFilterClick} className={'capitalize hover:bg-gray-900 ' + (filterApplied ? ' text-blue-300 ' : 'text-gray-100')}>Filter</Button>
			<Menu
			    id="basic-menu"
			    anchorEl={anchorEl}
			    open={open}
			    onClose={handleClose}
			    MenuListProps={{
			      'aria-labelledby': 'basic-button',
			    }}
			  >
			    <MenuItem onClick={handleClose}>Profile</MenuItem>
			    <MenuItem onClick={handleClose}>My account</MenuItem>
			    <MenuItem onClick={handleClose}>Logout</MenuItem>
			  </Menu>
			<div className='py-1'>
				<Button onClick={handleNewButtonClick} variant='contained' className={'capitalize text-white'}>New</Button>
			</div>
		    </div>
		</div>
	    </div>
	    <div>
	    {
		    selectedView === 'board' 
			    ?
			    <BoardView/>
			    :
			    <TableView/>
	    }
	   </div>
	</div>
    )
}

// TableView
const TableView = () => {
    const darkTheme = createTheme({
      palette: {
	mode: 'dark',
      },
    });
    const [tasks, setTasks] = useState<any>([])
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
    const [ids, setIds] = useState<any>([])

    useEffect(() => {
	axios
	    .get('/tasks')
	    .then((response) => {
		setTasks(response.data.map((item: any) => {
		    item['deadline'] = dayjs(item['deadline']).format('DD/MM/YYYY')
		    return item
		}))
		setSelectionModel(response.data.filter((item: any) => item.done === true).map((item: any) => item.id))
		setIds(response.data.map((item: any) => item.id))
	    })
	    .catch((error) => {
		console.log(error)
	    })
    }, [])

    const columns: GridColDef[] = [
      { field: 'name', headerName: 'Taskname', width: 200 },
      {
	field: 'deadline',
	headerName: 'Deadline',
	width: 160,
      },
      { field: 'author', headerName: 'Author', width: 130 },
      { field: 'tags', headerName: 'Tags', width: 200 },
      { field: 'usernames', headerName: 'Users', width: 200 },
      { field: 'id', headerName: 'ID', width: 100 },
    ];

    const handleSelectionChange = (newSelectionModel: any) => {
	setSelectionModel(newSelectionModel)
	newSelectionModel.map((item: any) => {
	    axios
		.put(
		    `/done`,
		    { id: item },
		)
		.then((response) => {
		    console.log(response.data)
		})
		.catch((error) => {
		    console.log(error)
		})
	    })
	const newArr = ids.filter((x: any) => !newSelectionModel.includes(x))
	newArr.map((item: any) => {
	    axios
		.put(
		    `/undone`,
		    { id: item },
		)
		.then((response) => {
		    console.log(response.data)
		})
		.catch((error) => {
		    console.log(error)
		})
	    })
    }

    return (
	    <ThemeProvider theme={darkTheme}>
	<div style={{ height: 500, width: '100%' }}>
	  <DataGrid
	    rows={tasks}
	    columns={columns}
	    pageSize={5}
	    rowsPerPageOptions={[5]}
	    checkboxSelection
	    onSelectionModelChange={handleSelectionChange}
	    selectionModel={selectionModel}
	  />
	</div>
	</ThemeProvider>
    )
}

// BoardView


const BoardView = () => {
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
