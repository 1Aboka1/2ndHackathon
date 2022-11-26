import {
    BrowserRouter,
    Routes,
    Route,
} from 'react-router-dom'
import { Home } from './pages/Home'
import { SignInUp } from './pages/SignInUp'
import { NewTask } from './pages/NewTask'
import { TaskView } from './pages/TaskView'
import {Provider} from 'react-redux'
import store, { persistor } from './store'
import { PersistGate } from 'redux-persist/integration/react'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {	
    return (
    	<Provider store={store}>
	    <PersistGate persistor={persistor} loading={null}>
		<BrowserRouter>
		    <Routes>
			<Route path="/"> 
			    <Route index element={<Home/>}/>
			    <Route path="sign_in_up" element={<SignInUp/>}/>
			    <Route path="new_task" element={<NewTask/>}/>
			    <Route path="task_view">
				<Route path=":taskId" element={<TaskView/>}/>
			    </Route>
			</Route>
		    </Routes>
		</BrowserRouter>
	    </PersistGate>
	</Provider>
    )
}

export default App

