import { createSlice } from "@reduxjs/toolkit";
import {toast} from "react-hot-toast";



const initialState={
    cart: localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[],
    totalItems: localStorage.getItem("totalItems")?JSON.parse(localStorage.getItem("totalItems")):0,
    total: localStorage.getItem("total")?JSON.parse(localStorage.getItem("total")):0,

}

const cartSlice=createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        //add to cart
        addToCart:(state,action) =>{
            const course= action.payload
            const index=state.cart.findIndex((item)=> item._id === course._id)

            if(index >=0){
                // If the course is already in the cart, do not modify the quantity
                toast.error("Course already in the cart.")
                return
            }
             // If the course is not in the cart, add it to the cart
            state.cart.push(course)
            // Update the total quantity and price
            state.totalItems++
            state.total += course.price

            //update to localstorage
            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))
            localStorage.setItem("total",JSON.stringify(state.total))

            toast.success("Course added to cart");
        },

        //removefromCart

        removeFromCart:(state,action) =>{
            const courseId= action.payload
            const index=state.cart.findIndex((item)=> item._id === courseId)

            if(index >=0){
                // If the course is already in the cart, do not modify the quantity
                state.totalItems--
                state.total -= state.cart[index].price
                state.cart.splice(index,1)
            
           

            //update to localstorage
            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))
            localStorage.setItem("total",JSON.stringify(state.total))

            toast.success("Course removed from cart");
            }
        },
        //resetCart
        resetCart:(state)=>{
            state.cart=[]
            state.totalItems=0
            state.total=0

            localStorage.removeItem("cart")
            localStorage.removeItem("total")
            localStorage.removeItem("totalItems")
        },
    },
});

export const {addToCart,removeFromCart,resetCart}=cartSlice.actions;
export default cartSlice.reducer;
