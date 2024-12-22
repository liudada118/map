import { createSlice } from "@reduxjs/toolkit";

export const equipSlice = createSlice({
    name : 'equip',
    initialState : {
        equipArr : []
    } ,
    reducers : {
        getEquip : (state , action) => {
            state.equipArr = action.payload
            
        }
    }
})

export const equipSelect = (state : any) => state.equip.equipArr

export const {getEquip} = equipSlice.actions
export default equipSlice.reducer