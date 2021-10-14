import React, { useState } from 'react'
import { toast } from 'react-toastify'

const CreateAdditionalReader = ({
    setAuth,
    reader,
    adReaders,
    setAdReaders,
    famGroup,
    setCheckAdReaders,
    checkAdReaders,
    leaveFG,
}) => {
    const [input, setInput] = useState({
        name: '',
    })

    const name = input.name

    const toggleCheck = () => {
        if (checkAdReaders) {
            setCheckAdReaders(false)
        } else {
            setCheckAdReaders(true)
        }
    }

    const resetInput = () => {
        setInput({ name: '' })
    }

    const onChange = (e) => {
        e.preventDefault()
        setInput({ name: e.target.value })
    }

    const addAdReaders = () => {
        setAdReaders([
            ...adReaders,
            {
                name: name,
                chapters_read: 0,
                books_read: 0,
                verses_memorized: 0,
            },
        ]) //somehow update list of additional readers??
    }

    const adReaderJoinFG = async (adReaderId) => {
        let ad_reader_id = adReaderId
        let fg_id = famGroup.id
        console.log(
            `I'm in the adReaderJoinFG func: ${ad_reader_id} ${fg_id}...`
        )
        try {
            const body = { ad_reader_id, fg_id }
            const joinFG = await fetch('/family-group/add-additional-reader', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },
                body: JSON.stringify(body),
            })
            const parseJoinFG = await joinFG.json()
            console.log(parseJoinFG)
        } catch (err) {
            console.error(err.message)
        }
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            let reader_id = reader.id
            const body = { name, reader_id }
            if (!name) {
                throw new Error('New reader must have a name!')
            }
            const newAdReader = await fetch('/additional-readers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },
                body: JSON.stringify(body),
            })
            const parseRes = await newAdReader.json()
            console.log(parseRes.ad_reader_id)
            if (parseRes) {
                await adReaderJoinFG(parseRes.ad_reader_id, famGroup.id)
                addAdReaders() //will this work???
                resetInput()
                toggleCheck()
            } else {
                console.log("adREaderJoinFG didn't work")
            }
        } catch (err) {
            console.error(err.message)
            toast.error(err.message)
        }

        return console.log('you submitted something')
    }

    
    
 
    return (
        <div>
            <div className="d-grid gap-2 col-6 mx-auto">
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#make-additional-reader"
                >
                    Add Family Group Member
                </button>
                <button
                    button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#leave-fg"
                    
                >
                    Leave Family Group
                </button>
            </div>

            {/* // <!-- Modal FOR ADDING MEMBERS --> */}
            <div
                class="modal fade"
                id="make-additional-reader"
                tabindex="-1"
                aria-labelledby="make-additional-readerLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5
                                class="modal-title"
                                id="make-additional-readerLabel"
                            >
                                Create a new Family Group Member
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                // onClick={() => resetInput()}
                            ></button>
                        </div>
                        <div class="modal-body">
                            <form
                                onSubmit={onSubmitForm}
                                id="make-additional-readerform"
                            >
                                <lable
                                    htmlFor="familyName"
                                    className="bg-light text-black form-control"
                                >
                                    Name the new member.
                                    <input
                                        className=" form-control mt-1 mb-1"
                                        type="character"
                                        name="name"
                                        placeholder=""
                                        value={name}
                                        onChange={(e) => onChange(e)}
                                    />
                                </lable>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => resetInput()}
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                data-dismiss="modal"
                                className="btn btn-primary"
                                form="make-additional-readerform"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>


           {/* // <!-- Modal FOR leaving family group --> */}
            <div
                className="modal fade"
                id="leave-fg"
                tabindex="-1"
                aria-labelledby="leave-fgLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to leave Family Group?</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                data-dismiss="modal"
                                className="btn btn-warning"
                                data-bs-dismiss="modal"
                                onClick={() => leaveFG()}
                            >
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default CreateAdditionalReader
