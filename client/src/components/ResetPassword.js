import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const ResetPassword = ({ setAuth, props }) => {
    const [inputs, setInputs] = useState({
        email: '',
        user_password: '',
        confirmPassword: '',
    })
    const [updated, setUpdated] = useState('')
    const [isLoading, setIsLoading] = useState('')
    const [error, setError] = useState('')

    //we need to get the token from the endpoint of the URL (comes after "/reset/")
    const url = window.location.href
    const reference = url.lastIndexOf('/')
    const start = reference + 1
    const token = url.slice(start)
    console.log(token.toString())
    ////////////////////////

    const checkResetToken = async () => {
        const response = await fetch(`/reset/${token}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        console.log(response)
        if (response.message === 'password link a-ok') {
            console.log('it worked')
        } else {
            console.log('token no longer good.')
        }
    }

    useEffect(() => {
        checkResetToken()
    }, [])

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const { email, user_password, confirm_password } = inputs

    const onSubmiForm = async (e) => {
        e.preventDefault()
        if (user_password !== confirm_password) {
            return toast.error('Password does not match. Please try again.')
        } else {
            try {
                const body = { email, user_password, resetPasswordToken: token } //the api will need the email to find the correct user
                const response = await fetch('*****THE LINK*******', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                })
                const parseRes = await response.json()
                if (parseRes.token) {
                    localStorage.setItem('token', parseRes.token)
                    setAuth(true)
                    toast.success('Password Reset Successfully')
                }
            } catch (error) {
                console.error(error.message)
            }
        }
    }

    return (
        <Fragment>
            <h1 className="text-center my-5">Reset Password</h1>
            <form onSubmit={onSubmiForm}>
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
                <button className="btn btn-success btn-block">Submit</button>
            </form>
            <Link to="/login">Login</Link>
        </Fragment>
    )
}

export default ResetPassword
