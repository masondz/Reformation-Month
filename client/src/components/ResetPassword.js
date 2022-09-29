import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ResetPassword = ({ props }) => {
    const [inputs, setInputs] = useState({
        email: '',
        user_password: '',
        confirmPassword: '',
    })
    const [updated, setUpdated] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const { email, user_password, confirm_password } = inputs

    //we need to get the token from the endpoint of the URL (comes after "/reset/")
    const url = window.location.href
    const reference = url.lastIndexOf('/')
    const start = reference + 1
    const token = url.slice(start)
    console.log(token.toString())
    ////////////////////////

    /*
    When sending the request to reset password it should:

1. Check to see if user exists.

2. Check to see if token matches database.

3. Check to see if token is not expired.

THEN

4. generate new password using bcrypt.

5. update database with new password.

6. set resettoken and resetexpires to null.

    */

    // const checkResetToken = async () => {
    //     try {
    //         const response = await fetch(`/reset/${token}`, {
    //             method: 'GET',
    //             headers: { 'Content-Type': 'application/json' },
    //         })
    //         console.log(response)
    //         if (response.message === 'password link a-ok') {
    //             setUpdated(false)
    //             setIsLoading(false)
    //             setError(false)
    //         } else {
    //             setUpdated(false)
    //             setIsLoading(false)
    //             setError(true)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     checkResetToken()
    // }, [])

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const updatePassword = async (e) => {
        e.preventDefault()
        try {
            const body = { email, user_password, token }
            const response = await fetch('/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            const parseRes = await response.json()
            //need to figure out a way to check if password is changed
            /*if (parseRes.token) {
                localStorage.setItem('token', parseRes.token)
                setAuth(true)
                setUpdated(true)
                setError(false)
                toast.success('Password Reset Successfully')
            }
            */
        } catch (error) {
            console.error(error.message)
        }
    }

    //ALTERNATIVE UPDATEPASSWORD FUNCTION
    /* might need response.data instead of just response
    const updatePassword = async (e) => {
        e.preventDefault()
        try {
            const body = { email, user_password }
            const response = await fetch('/auth/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            console.log(response);
            if (response.message === 'password updated') {
                setUpdated(true)
                setError(false)
            } else {
                setUpdated(false)
                setError(true)
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    */

    return (
        <Fragment>
            <h1 className="text-center my-5">Reset Password</h1>
            {error ? (
                <div>
                    <h4>
                        Problem resetting password. Please send another reset
                        link.
                    </h4>
                </div>
            ) : isLoading ? (
                <div>
                    <h5>Loading User Data...</h5>
                </div>
            ) : (
                <form onSubmit={updatePassword}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control my-3"
                        value={email}
                        onChange={(e) => onChange(e)}
                    />
                    <input
                        className="form-control my-3"
                        type="password"
                        name="user_password"
                        placeholder="New Password"
                        value={user_password}
                        onChange={(e) => onChange(e)}
                    />
                    <input
                        className="form-control my-3"
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm New Password"
                        value={confirm_password}
                        onChange={(e) => onChange(e)}
                    />
                    <button className="btn btn-success btn-block">
                        Submit
                    </button>
                </form>
            )}
            {updated && (
                <div>
                    <p>
                        Your password has been successfully reset, please try
                        logging in again.
                    </p>
                </div>
            )}
            <Link to="/forgot-passwrod">Forgot Password</Link>
            <br></br>
            <Link to="/login">Login</Link>
        </Fragment>
    )
}

export default ResetPassword
