import { createSlice } from "@reduxjs/toolkit";

const addressSlice=createSlice({
    name:"address",
    initialState:{
        addresses:[],
        selectedAddress:null,
        loading:false
    },
    reducers:{
        setAddress:(state,action)=>{
            state.addresses=action.payload;
        },
        addAddress:(state,action)=>{
            state.addresses.push(action.payload)
        },
        updateAddress:(state,action)=>{
            const index=state.addresses.findIndex(
                (address)=>address._id===action.payload._id
            )
            if(index!==-1){
                state.addresses[index]=action.payload
            }
        },
        removeAddress:(state,action)=>{
            state.addresses=state.addresses.filter(
                (address)=>address._id!==action.payload
            )
        },
        setDefaultAddress:(state,action)=>{
            state.addresses=state.addresses.map(
                (address)=>({
                    ...address,isDefault:address._id===action.payload._id
                })
            )
        },
        setSelectedAddress:(state,action)=>{
            state.selectedAddress=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        }
    }
})

export const {setAddress,addAddress,updateAddress,removeAddress,setDefaultAddress,setSelectedAddress,setLoading}=addressSlice.actions;

export default addressSlice.reducer;