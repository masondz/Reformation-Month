import React, { useState } from 'react'
import { toast } from 'react-toastify'

const CreateFamilyGroup = ({ setAuth, reader, setFamGroup, setInFamGroup }) => {
    // const { family_name, reader_id, fg_password } = req.body;
    const [inputs, setInputs] = useState({
        familyName: '',
        familyPassword: '',
        confirmPassword: '',
    })

    const { familyName, familyPassword, confirmPassword } = inputs

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const resetInputs = () => {
        setInputs({
            familyName: '',
            familyPassword: '',
            confirmPassword: '',
        })
    }

    const checkPassword = (familyPassword, confirmPassword) => {
        if (familyPassword !== confirmPassword) {
           toast.error('Password does not match. Please try again.')
        } else {
            console.log('password matches')
        }
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        console.log('you submitted something.')
        let family_name = familyName
        let fg_password = familyPassword
        let reader_id = reader.id
        if (familyPassword !== confirmPassword) {
             return  toast.error('Password does not match. Please try again.')
        } else {
        try {
            const body = { family_name, fg_password, reader_id }
            const response = await fetch('/family-group/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },
                body: JSON.stringify(body),
            })
            const parseRes = await response.json()
            if (parseRes.status === 401) {
                return toast.error('family name already taken!')
            }
            const familyName = parseRes.family_name
            setFamGroup({ family_name: familyName }) //will this work?
            setInFamGroup(true)
            setTimeout(() => {
            window.location = '/';
            }, 2000);
        } catch (err) {
            console.error(err.message)
        }
       }
    }

    return (
        <div>
            {/* Button trigger modal  */}
            <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-toggle="modal"
                data-bs-target="#createFGModal"
            >
                Create Family Group
            </button>

            {/* // <!-- Modal --> */}
            <div
                class="modal fade"
                id="createFGModal"
                tabindex="-1"
                aria-labelledby="createFGModalLabel"
                aria-hidden="true"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="createFGModalLabel">
                                Create a Family Group
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
                                id="create-family-group"
                            >
                                <lable
                                    htmlFor="familyName"
                                    className="bg-light text-black form-control"
                                >
                                    Name Family Group
                                    <input
                                        className=" form-control mt-1 mb-1"
                                        type="character"
                                        name="familyName"
                                        placeholder=""
                                        value={familyName}
                                        onChange={(e) => onChange(e)}
                                    />
                                    Create Password for Family Group
                                    <input
                                        className=" form-control mt-1"
                                        type="password"
                                        name="familyPassword"
                                        placeholder=""
                                        value={familyPassword}
                                        onChange={(e) => onChange(e)}
                                    />
                                    Confirm Password
                                    <input
                                        className=" form-control mt-1"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder=""
                                        value={confirmPassword}
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
                                onClick={() => resetInputs()}
                            >
                                Close
                            </button>
                            <button
                                data-bs-dismiss="modal"
                                type="submit"
                                class="btn btn-primary"
                                form="create-family-group"
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

export default CreateFamilyGroup
