import { configureStore } from '@reduxjs/toolkit'
import readerSlice from './components/features/user'

const store = configureStore({
    reducer: {
        reader: readerSlice,
    },
})

export default store
