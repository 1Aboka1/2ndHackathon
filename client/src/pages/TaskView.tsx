import {Button, TextField} from "@mui/material"
import { styled } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'
import {useEffect, useState} from "react"
import ToggleButton from '@mui/material/ToggleButton'
import axios from "axios"
import { TagPicker } from 'rsuite'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ReplayIcon from '@mui/icons-material/Replay'
import 'rsuite/dist/rsuite.min.css'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {useSelector} from "react-redux"
import {RootState} from "../store"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {useNavigate} from "react-router-dom"
import { useParams } from "react-router-dom"

export const TaskView = () => {
    const user: any = useSelector((state: RootState) => state.auth.account)
    const navigate = useNavigate()
    const taskId = useParams().taskId

    const [task, setTask] = useState<any>({
	name: '',
	usernames: [],
	tags: [],
	done: false,
	deadline: "",
	author: user['user']['username'],
    })	

    useEffect(() => {
	axios
	    .get(`/tasks/${taskId}`)
	    .then((response) => {
		setTask(response.data)
		setDate(dayjs(response.data.deadline))
	    })
    }, [taskId])

    const handleTextFieldChange = (event: any) => {
	const id = event.currentTarget.id
	let tempObject = Object.assign({}, task)

	tempObject[id] = event.currentTarget.value
	setTask(tempObject)
    }

    const [date, setDate] = useState<Dayjs | null>(
	dayjs('2022-11-27T21:11:54'),
      );
    const handleDateChange = (newValue: Dayjs | null) => {
	setDate(newValue);
	let tempObject = Object.assign({}, task)
	tempObject['deadline'] = newValue
	setTask(tempObject)
      };

    const [status, setStatus] = useState('to-do')

    const handleChange = (
	event: React.MouseEvent<HTMLElement>,
	status: string,
      ) => {
	setStatus(status);
	let tempObject = Object.assign({}, task)
	tempObject['done'] = (status === 'to-do' ? false : true)
	setTask(tempObject)
      };

    const handleCreate = () => {
	if(task.name.length === 0) {
	    alert('Type name of the task')
	    return null
	}
	axios
	    .put(
		'/change',
		task,
	    )
	    .then((response) => {
	    	navigate('/')
	    })
	    .catch((error) => {
		console.log(error)
	    })
    }

    const darkTheme = createTheme({
      palette: {
	mode: 'dark',
	primary: {
	    dark: "#FF69B4",
	    main: "#FF69B4",
	},
	secondary: {
	    main: '#00e676',
	}
      },
    });

    let users = task.usernames.map((item: any) => ({
	label: item,
	value: item,
    }))
    let tags = task.tags.map((item: any) => ({
	label: item,
	value: item,
    }))

    const handleTagChange = (value: any, item: any) => {
	let tempObject = Object.assign({}, task)
	tempObject['tags'] = [...value]
	setTask(tempObject)
    }

    const handleUsersChange = (value: any, item: any) => {
	let tempObject = Object.assign({}, task)
	tempObject['usernames'] = [...value]
	console.log(tempObject)
	setTask(tempObject)
    }

    const handleRedirectToMain = () => {
	navigate('/')
    }

    const handleDelete = (event: any) => {
    	const id = task.id
    	axios
		.post('/delete', {id})
		.then((response) => { console.log(response.data); navigate('/') })
		.catch((error) => { console.log(error) })

    }

    return (
	<div className="bg-black h-screen space-y-17">
	    <ThemeProvider theme={darkTheme}>
	    <div onClick={handleRedirectToMain} className="p-6 flex cursor-pointer flex-row items-center space-x-3">
		<img src={require('../assets/photo1669449406.jpeg')} className='w-12 h-12 rounded-xl' alt='Logo'/>
		<h1 className="text-white font-semibold text-xl">Achiever</h1>
	    </div>
	    <div className="mx-auto pt-[10px] w-[700px]">
		<div className="items-center flex flex-row mb-3">
		    <CssTextField size="medium" placeholder="Untitled" defaultValue='Untitled' className="font-bold" value={task.name} onChange={handleTextFieldChange} id='name' variant='standard'/>
		    <div className="flex flex-row space-x-2">
		    <Button onClick={handleCreate} color={'primary'} variant='contained'>Save</Button>
		    <Button onClick={handleDelete} variant='contained'>Delete</Button>

		    </div>
		</div>
		<div className="space-y-3">
		<div className="flex flex-row space-x-16 h-14 items-center">
		    <div className="flex w-36 flex-row space-x-2">
			<ReplayIcon className='text-gray-400'/> 
			<p className="text-gray-400">Status</p>
		    </div>
		    <ToggleButtonGroup
		      color="primary"
		      value={status}
		      exclusive
		      onChange={handleChange}
		      aria-label="Platform"
		    >
		      <ToggleButton className="capitalize" value="to-do">To-Do</ToggleButton>
		      <ToggleButton className="capitalize" value="done">Done</ToggleButton>
		    </ToggleButtonGroup> 
		</div>
		<div className="flex flex-row space-x-16 h-14 items-center">
		    <div className="flex w-36 items-center flex-row space-x-2">
			<PersonIcon className='text-gray-400'/> 
			<p className="text-gray-400">Usernames</p>
		    </div>
	    	<>
		    <TagPicker
		      creatable
		      data={users}
		      style={{ width: 300 }}
		      menuStyle={{ width: 300 }}
		      onCreate={(value, item) => {
			handleUsersChange(value, item)
			}}
		    />
		</>
		</div>
		<div className="flex flex-row space-x-16 h-14 items-center">
		    <div className="flex w-36 items-center flex-row space-x-2">
			<PersonIcon className='text-gray-400'/> 
			<p className="text-gray-400">Tags</p>
		    </div>
	    	<>
		    <TagPicker
		      creatable
		      data={tags}
		      style={{ width: 300 }}
		      menuStyle={{ width: 300 }}
		      onCreate={(value, item) => {
			handleTagChange(value, item)
		    }}
		    />

		</>
		</div>
		<div className="flex flex-row space-x-16 h-14 items-center">
		    <div className="flex w-36 flex-row items-center space-x-2">
			<CalendarMonthIcon className='text-gray-400'/> 
			<p className="text-gray-400">Deadline</p>
		    </div>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
			    <DesktopDatePicker
			      inputFormat="DD.MM.YYYY"
			      value={date}
			      onChange={handleDateChange}
			      renderInput={(params: any) => <TextField {...params} />}
			    />	
			</LocalizationProvider>
		</div>

		</div>
	    </div>
	    </ThemeProvider>
	</div>
    ) 
}


const CssTextField = styled(TextField)({
    'label': {
	color: 'gray',
    },
  '& label.Mui-focused': {
    color: 'primary',
  },
  'input-label': {
    color: 'red'
  },
  'input': {
    color: 'white',
    fontSize: '40px',
    "&::placeholder": {     color: "gray",   },
    fontWeight: 'bold',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'black',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'black',

  '& .MuiInput-underline': {
    borderBottomColor: 'black',
  },
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary',
    },
  },
})

