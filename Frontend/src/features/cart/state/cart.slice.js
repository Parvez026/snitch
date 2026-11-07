import { createSlice } from "@reduxjs/toolkit";

const cartSlice=createSlice({
    name:"cart",
    initialState:{
         items:[]
    },
    reducers:{
        setItem:(state,action)=>{
            state.items=action.payload
        },
        addItem:(state,action)=>{
            state.items.push(action.payload)
        }
    }
})

export const {setItem,addItem}=cartSlice.actions
export default cartSlice.reducer