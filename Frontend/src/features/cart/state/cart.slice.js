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
        },
        removeItemByIds:(state,action)=>{
            const {productId,variantId}=action.payload
            state.items = state.items.filter(item =>
                !(item.product?._id === productId && item.variant === variantId)
            )
        },
        incrementCartItems:(state,action)=>{
            const {productId,variantId}=action.payload
            state.items = state.items.map((item)=>{
                if(item.product?._id === productId && item.variant === variantId){
                    return {...item, quantity: item.quantity + 1}
                }
                return item
            })
        },
        decrementCartItems:(state,action)=>{
            const {productId,variantId}=action.payload
            state.items = state.items.map((item)=>{
                if(item.product?._id === productId && item.variant === variantId){
                    return {...item, quantity: Math.max(1, item.quantity - 1)}
                }
                return item
            })
        }
    }
})

export const {setItem, addItem, removeItemByIds, incrementCartItems, decrementCartItems}=cartSlice.actions
export default cartSlice.reducer
