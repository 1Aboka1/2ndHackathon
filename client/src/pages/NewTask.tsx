import {Button, TextField} from "@mui/material"
import { styled } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'
import {useState} from "react"
import ToggleButton from '@mui/material/ToggleButton'
import axios from "axios"
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ReplayIcon from '@mui/icons-material/Replay'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {useSelector} from "react-redux"
import {RootState} from "../store"

export const NewTask = () => {
    const user: any = useSelector((state: RootState) => state.auth.account)

    const [task, setTask] = useState<any>({
	name: '',
	usernames: [],
	tags: [],
	done: false,
	deadline: "",
	author: user['user']['username'],
    })	

    const handleTextFieldChange = (event: any) => {
	const id = event.currentTarget.id
	let tempObject = Object.assign({}, task)

	tempObject[id] = event.currentTarget.value
	setTask(tempObject)
    }

    const [date, setDate] = useState<Dayjs | null>(
	dayjs('2014-08-18T21:11:54'),
      );
    const handleDateChange = (newValue: Dayjs | null) => {
	setDate(newValue);
	let tempObject = Object.assign({}, task)
	tempObject['deadline'] = date
	setTask(tempObject)
      };

    const [status, setStatus] = useState('to-do')

    const handleChange = (
	event: React.MouseEvent<HTMLElement>,
	status: string,
      ) => {
	setStatus(status);
      };

    const handleCreate = () => {
	axios
	    .post(
		'/create',
		task,
	    )
	    .then((response) => {
		console.log(response.data)
	    })
	    .catch((error) => {
		console.log(error)
	    })
    }

    return (
	<div className="bg-white h-screen space-y-20">
	    <div className="mx-auto pt-[100px] w-[700px]">
		<div className="items-center flex flex-row">
		    <CssTextField size="medium" placeholder="Untitled" defaultValue='Untitled' className="font-bold" value={task.name} onChange={handleTextFieldChange} id='name' variant='standard'/>
		    <Button onClick={handleCreate} variant='contained'>Create</Button>
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
		</div>
		<div className="flex flex-row space-x-16 h-14 items-center">
		    <div className="flex w-36 items-center flex-row space-x-2">
			<PersonIcon className='text-gray-400'/> 
			<p className="text-gray-400">Tags</p>
		    </div>
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
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'black',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary',
    },
  },
})

