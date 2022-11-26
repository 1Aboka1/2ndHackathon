import { DataGrid, GridColDef, GridValueGetterParams, GridSelectionModel } from '@mui/x-data-grid'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {useEffect, useState} from 'react';
import axios from 'axios';

export const TableView = () => {
    const darkTheme = createTheme({
      palette: {
	mode: 'dark',
      },
    });
    const [tasks, setTasks] = useState<any>([])
    const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])

    useEffect(() => {
	axios
	    .get('/tasks')
	    .then((response) => {
		setTasks(response.data)
		setSelectionModel(response.data.filter((item: any) => item.done === true).map((item: any) => item.id))
	    })
	    .catch((error) => {
		console.log(error)
	    })
    }, [])
    console.log(selectionModel)

    const columns: GridColDef[] = [
      { field: 'id', headerName: 'ID', width: 70 },
      { field: 'name', headerName: 'Taskname', width: 130 },
      {
	field: 'deadline',
	headerName: 'Deadline',
	sortable: false,
	width: 160,
      },
      { field: 'author', headerName: 'Author', width: 130 },
      { field: 'tags', headerName: 'Tags', width: 200 },
      { field: 'usernames', headerName: 'Users', width: 200 },
    ];

    useEffect(() => {
	selectionModel.map((item: any) => {
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
    }, [selectionModel])

    return (
	    <ThemeProvider theme={darkTheme}>
	<div style={{ height: 500, width: '100%' }}>
	  <DataGrid
	    rows={tasks}
	    columns={columns}
	    pageSize={5}
	    rowsPerPageOptions={[5]}
	    checkboxSelection
	    onSelectionModelChange={(newSelectionModel) => {
	      setSelectionModel(newSelectionModel)
	    }}
	    selectionModel={selectionModel}
	  />
	</div>
	</ThemeProvider>
    )
}
