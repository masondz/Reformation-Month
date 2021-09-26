// -> /family-group/add-reader  is the route to add reader
// -> /family-group/add-additional-reader  is the rout to add additional reader

import React, { useState } from 'react'
import { toast } from 'react-toastify'

const JoinFamilyGroup = ({ setAuth, reader }) => {
    const [inputs, setInputs] = useState({
        familyName: '',
        familyPassword: '',
    })

    const { familyName, familyPassword } = inputs

    const onSubmitForm = async (e) => {
        e.preventDefault()
        console.log('you submitted something.')
        let family_name = familyName
        let fg_password = familyPassword
        let reader_id = reader.id
        try {
            const body = { family_name, fg_password, reader_id }
            const response = await fetch('/family-group/add-reader', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },
                body: JSON.stringify(body),
            })
            const parseRes = await response.json()
            window.location = '/'
            if (parseRes.status === 401) {
                return toast.error('Password or Family Name is incorrect')
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const resetInputs = () => {
        setInputs({
            familyName: '',
            familyPassword: '',
        })
    }

    return (
        <div>
            {/* Button trigger modal  */}
            <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#joinFGModal"
            >
                Join A Family Group
            </button>

            {/* // <!-- Modal --> */}
            <div
                class="modal fade"
                id="joinFGModal"
                tabindex="-1"
                aria-labelledby="joinFGModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="joinFGModalLabel">
                                Join a Family Group
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => resetInputs()}
                            ></button>
                        </div>
                        <div class="modal-body">
                            <form
                                onSubmit={onSubmitForm}
                                id="join-family-group"
                            >
                                <lable
                                    htmlFor="familyName"
                                    className="bg-light text-black form-control"
                                >
                                    Family Group Name
                                    <input
                                        className=" form-control mt-1 mb-1"
                                        type="character"
                                        name="familyName"
                                        placeholder=""
                                        value={familyName}
                                        onChange={(e) => onChange(e)}
                                    />
                                    Family Group Password
                                    <input
                                        className=" form-control mt-1"
                                        type="password"
                                        name="familyPassword"
                                        placeholder=""
                                        value={familyPassword}
                                        onChange={(e) => onChange(e)}
                                    />
                                </lable>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                class="btn btn-primary"
                                form="join-family-group"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinFamilyGroup
