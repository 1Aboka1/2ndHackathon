import { DataGrid, GridColDef, GridValueGetterParams, GridComparatorFn, GridSelectionModel } from '@mui/x-data-grid'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {useEffect, useState} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export const TableView = () => {
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
