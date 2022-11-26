import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AccountResponse } from "../../types"

type State = {
    account: AccountResponse | null,
}

const initialState: State = { account: null }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
	setAccount(state: State, action: PayloadAction<AccountResponse>) {
	    state.account = action.payload
	},
	setLogout(state: State) {
	    state.account = null
	}
    }
})

export default authSlice
