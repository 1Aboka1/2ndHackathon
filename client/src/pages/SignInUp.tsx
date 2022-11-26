import {useState} from "react"
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import {Button} from "@mui/material"
import axios from "axios"
import store from "../store"
import { useDispatch } from 'react-redux'
import authSlice from "../store/slices/auth"
import { useNavigate } from "react-router-dom"

export const SignInUp = () => {
    const [signType, setSignType] = useState('signIn')
    const [registrationInfo, setRegistrationInfo] = useState({
	'username': '',
	'password': '',
    })
    const [loginInfo, setLoginInfo] = useState({
	'username': '',
	'password': '',
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSignUpClick = () => {
	axios
	    .post(
		'/register',
		registrationInfo,
	    )
	    .then((response) => {
		if(response.data === "You already have an account") {
		    handleSignInClick()
		} 
		else {
		    console.log(response.data)
		}
	    })
	    .catch((error) => {
		console.log(error)
	    })
    }
    
    const handleSignUpTextChange = (event: any) => {
    	let tempRegistrationInfo: any = Object.assign({}, registrationInfo)
	const id = event.currentTarget.id
	tempRegistrationInfo[id] = event.currentTarget.value
	setRegistrationInfo(tempRegistrationInfo)
    }

    const renderSignUp = () => {
	return (
	    <div className="items-center space-y-7 flex flex-col">
		<h1 className="text-white font-semibold text-5xl">Sign up</h1>	
		<div className="flex flex-col space-y-4 items-center">
		    <CssTextField value={registrationInfo.username} onChange={handleSignUpTextChange} id='username' label='Username' type='email' variant='outlined'/> 
		    <CssTextField value={registrationInfo.password} onChange={handleSignUpTextChange} id='password'  label='Password' type='password' variant='outlined'/> 
		    <p onClick={() => setSignType('signIn')} className="text-gray-200 text-sm cursor-pointer hover:text-gray-300">Don't have an account?</p>
		</div>	
		<Button variant='contained' className='capitalize w-24' onClick={handleSignUpClick}>Sign up</Button>
	    </div>
	)
    }

    const handleSignInClick = () => {
	axios
	    .post(
		'/login',
		loginInfo,
	    )
	    .then((response) => {
		if(response.data === "Login successfully") {
		    dispatch(
			authSlice.actions.setAccount({ user: { username: loginInfo.username } })
		    )
		    navigate(`/`)
		} 
		else {
		    console.log(response.data)
		}
	    })
	    .catch((error) => {
		console.log(error)
	    })
    }
    
    const handleSignInTextChange = (event: any) => {
    	let tempLoginInfo: any = Object.assign({}, loginInfo)
	const id = event.currentTarget.id
	tempLoginInfo[id] = event.currentTarget.value
	setLoginInfo(tempLoginInfo)
    }

    const renderSignIn = () => {
	return (
	    <div className="items-center space-y-8 flex flex-col">
		<h1 className="text-white font-semibold text-5xl">Sign in</h1>	
		<div className="flex flex-col space-y-4 items-center">
		    <CssTextField value={loginInfo.username} onChange={handleSignInTextChange} id='username' type='email' label='Username' variant='outlined'/> 
		    <CssTextField value={loginInfo.password} onChange={handleSignInTextChange} id='password' type='password' label='Password' variant='outlined'/> 
		    <p onClick={() => setSignType('signUp')} className="text-gray-200 text-sm cursor-pointer hover:text-gray-300">Don't have an account?</p>
		</div>	
		<Button onClick={handleSignInClick} variant='contained' className='capitalize w-24'>Sign in</Button>
	    </div>
	)
    }

    return (
	<div className="bg-black h-screen space-y-20">
	    <div className="p-6 flex flex-row items-center space-x-3">
		<img src={require('../assets/photo1669449406.jpeg')} className='w-12 h-12 rounded-xl' alt='Logo'/>
		<h1 className="text-white font-semibold text-xl">Achiever</h1>
	    </div>
	    <div className="mx-auto w-[500px]">
		{
		    signType === 'signUp'
		    ?
		    renderSignUp()
		    :
		    renderSignIn()
		}
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
    color: 'white'
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'green',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'gray',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary',
    },
  },
})

