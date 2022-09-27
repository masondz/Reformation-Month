import e from 'cors'
import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
    let [email, setEmail] = useState('')
    let [showNullError, setShowNullError] = useState(false)
    let [showError, setShowError] = useState(false)
    let [messageFromServer, setMessageFromServer] = useState('')

    const onChange = (e) => {
        setEmail(e.target.value)
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        console.log(`submit: ${email}`)
    }

    const sendEmail = async (e) => {
        e.preventDefault()
        try {
            if (email === '') {
                setShowNullError(true)
                setMessageFromServer('')
            } else {
                const body = { email }
                const response = await fetch('/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })
                const parseRes = await response.json()

                if (parseRes.data === 'email not in db') {
                    setShowNullError(false)
                    setShowError(true)
                    setMessageFromServer('')
                } else if (response.data === 'recovery email sent') {
                    setShowError(false)
                    setShowNullError(false)
                    setMessageFromServer('recovery email sent')
                }
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <Fragment>
            <h1>Forgot Password Page!</h1>
            <form onSubmit={sendEmail}>
                <input
                    className="form-control my-3"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    id="email"
                    onChange={(e) => onChange(e)}
                />

                <button className="btn btn-success btn-block my-2">
                    Submit
                </button>
                <br></br>
            </form>
            {showNullError && (
                <div>
                    <p>The email cannot be blank.</p>
                </div>
            )}
            {showError && (
                <div>
                    <p>
                        That email address isn't recognized. Please try agin or
                        register for a new account.
                    </p>
                    <Link to="/register">Register</Link>
                    <br></br>
                    <Link to="/login">Login</Link>
                </div>
            )}
            {messageFromServer === 'recovery email sent' && (
                <div>
                    <h3>Reset password email sent!</h3>
                </div>
            )}
        </Fragment>
    )
}

export default ForgotPassword
