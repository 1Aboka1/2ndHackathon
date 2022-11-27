import {TextField} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {Button} from 'rsuite';
import {RootState} from '../store';

export const Profile = () => {
    const darkTheme = createTheme({
      palette: {
	mode: 'dark',
      },
    });

    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const user = useSelector((state: RootState) => state.auth.account)
    const navigate = useNavigate()

    const onSelectImageHandler = (event: any) => {
	    const file = event?.currentTarget.files[0];
	    const formData = new FormData();
	    formData.append('avatar', file)

	    const config = {
		headers: {
		    "Content-Type":"multipart/form-data" 
		}
	    };

	    axios
		.post(
		    '/upload-avatar',
		    formData,
		    config,
		)
		.then((response) => {
		    console.log(response.data)
		})
		.catch((error) => {
		    console.log(error)
		})
	}

    const handlePasswordReset = () => {
	axios
	    .put(
		`/reset_password`,
		{
		    username: user?.user.username,
		    oldPassword: oldPass,
		    newPassword: newPass,
		}
	    )
	    .then((response) => {
		if(response.data === 'updated') {
		    navigate('/sign_in_up')
		} else {
		    alert('Old password is incorrect')
		}
		console.log(response.data)
	    })
	    .catch((error) => {
	    	console.log(error)
	    })
    }

    return (
	    <ThemeProvider theme={darkTheme}>
	<div className="bg-black h-screen space-y-20">
	    <div className="mx-auto w-[700px] divide-y space-y-5 p-10">
		<div className='space-y-3'>
		    <h1 className='text-gray-200 text-xl'>Upload Profile image</h1>
		    <input type="file" name="avatar" id="avatar" onChange={onSelectImageHandler}/>
		</div>
		<div className='space-y-3'>
		    <h1 className='text-gray-200 pt-2 text-xl'>Change password</h1>
		    <div className='flex flex-col space-y-2'>
			<TextField value={oldPass} label='Old password' type='password' onChange={(event: any) => setOldPass(event.currentTarget.value)}/>	
			<TextField value={newPass} label='New password' type='password' onChange={(event: any) => setNewPass(event.currentTarget.value)}/>	
		    </div>
		    <Button onClick={handlePasswordReset}>Change</Button>
		</div>
	    </div>
	</div>
	</ThemeProvider>
    )
}
