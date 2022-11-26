import Button from '@mui/material/Button'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import {useState} from 'react'
import {BoardView} from './BoardView'
import {TableView} from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import {RootState} from '../store'
import {useNavigate} from 'react-router-dom'
import authSlice from '../store/slices/auth'

const styleForSelectedButton = 'border-b border-white'
const styleForApplied = 'text-blue-300'

export const MainWindow = () => {
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
			<Button onClick={() => setFilterApplied(!filterApplied)} className={'capitalize hover:bg-gray-900 ' + (filterApplied ? ' text-blue-300 ' : 'text-gray-100')}>Filter</Button>
			<Button onClick={() => setSortApplied(!sortApplied)} className={'capitalize hover:bg-gray-900 ' + (sortApplied ? ' text-blue-300 ' : 'text-gray-100')}>Sort</Button>
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
