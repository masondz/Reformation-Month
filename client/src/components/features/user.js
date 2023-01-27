import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getReader = createAsyncThunk(async () => {
    const response = await fetch('/dashboard/', {
        method: 'GET',
        headers: { token: localStorage.token },
    })
    const json = await response.json()
    return json
})

/*
structure of objects
request:
first_name, last_name, chapters_read, books_read, verses_memorized, id

how reader info is structured
books_read: 0
chapters_read: 96
first_name: "Zach"
id: "b1461e7c-4f57-4ebb-9aee-5b9d2e0498ed"
last_name: "Mason"
verses_memorized: 0

challenge_name, organization, goal, challenge, id, challenge_admin 
*/

export const checkChallenge = createAsyncThunk(async () => {
    const response = await fetch('/reader-dashboard/reader-challenge-id/', {
        method: 'GET',
        headers: { token: localStorage.token },
    })
    const json = response.json()
    return json
})

export const readerSlice = createSlice({
    name: 'reader',
    initialState: {
        first_name: '',
        last_name: '',
        chapters_read: '',
        books_read: '',
        verses_memorized: '',
        id: '',
        gettingReaderPending: false,
        gettingReaderFailed: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReader.pending, (state) => {
                state.gettingReaderPending = true
                state.gettingReaderFailed = false
            })
            .addCase(getReader.fulfilled, (state, action) => {
                state.first_name = action.payload.first_name
                state.last_name = action.payload.last_name
                state.chapters_read = action.payload.chapters_read
                state.books_read = action.payload.books_read
                state.verses_memorized = action.payload.verses_memorized
                state.id = action.payload.id
                state.gettingReaderPending = false
                state.gettingReaderFailed = false
            })
            .addCase(getReader.rejected, (state) => {
                state.gettingReaderPending = false
                state.gettingReaderFailed = true
            })
    },
})

export default readerSlice.reducer
