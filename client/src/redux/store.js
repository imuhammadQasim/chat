import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice"; 
import userReducer from "./userSlice"; 
const store = configureStore({
  reducer: {
    loader: loaderReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
