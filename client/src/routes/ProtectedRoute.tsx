import { Navigate, Route, Outlet, RouteProps } from 'react-router'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

const ProtectedRoute = (props: RouteProps) => {
    const auth = useSelector((state: RootState) => state.auth)

    if(auth.account) {
	return <Outlet/>
    } 
    else if(!auth.account) {
	return <Navigate to={'sign_in_up'}/>
    }
    else {
	return <div>Not found</div>
    }
}

export default ProtectedRoute

