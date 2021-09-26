import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
const Login = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: '',
        user_password: '',
    })

    const { email, user_password } = inputs

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const body = { email, user_password }
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            console.log(`body: ${body}, response: ${response}`)
            const parseRes = await response.json()

            if (parseRes.token) {
                localStorage.setItem('token', parseRes.token)
                setAuth(true)
                toast.success('login successfull!')
            } else {
                setAuth(false)
                toast.error(parseRes)
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <Fragment>
            <h1 className="text-center my-5">Login to report your reading!</h1>
            <form onSubmit={onSubmitForm}>
                <input
                    className="form-control my-3"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => onChange(e)}
                />
                <input
                    className="form-control"
                    type="password"
                    name="user_password"
                    placeholder="Password"
                    value={user_password}
                    onChange={(e) => onChange(e)}
                />
                <button className="btn btn-success btn-block">Submit</button>
            </form>
            <Link to="/register">Register</Link>
        </Fragment>
    )
}

export default Login
