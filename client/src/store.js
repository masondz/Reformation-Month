import { configureStore } from "@reduxjs/toolkit";
import { getReader } from './components/features/user';


const store = configureStore({
  reducer: {
    user: getReader;
  }
})

const export store

