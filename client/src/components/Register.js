import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const Register = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: '',
        user_password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
    })
    const { email, user_password, confirm_password, first_name, last_name } = inputs

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }
    
     const checkPassword = (user_password, confirm_password) => {
        if (user_password !== confirm_password) {
            return toast.error('Password does not match. Please try again.')
        } else {
            console.log('password matches')
        }
    }

    const onSubmiForm = async (e) => {
        e.preventDefault()
        try {
            const body = { email, user_password, first_name, last_name }
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify(body),
            })
            const parseRes = await response.json()
            if (parseRes.token) {
                localStorage.setItem('token', parseRes.token)
                setAuth(true)
                toast.success('Registered Successfully')
            } else {
                setAuth(false)
                toast.error(parseRes)
            }
        } catch (err) {
            console.error(err.message)
        }
    }
    //Building the form. Form inputs must be consisistant with req.body of the serve i.e. the name of the inputs must the be the same as the keys for the request body
    return (
        <Fragment>
            <h1 className="text-center my-5">Register</h1>
            <form onSubmit={onSubmiForm}>
                <input
                    className="form-control my-3"
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={first_name}
                    onChange={(e) => onChange(e)}
                />
                <input
                    className="form-control my-3"
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={last_name}
                    onChange={(e) => onChange(e)}
                />
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
                    placeholder="Password"
                    value={user_password}
                    onChange={(e) => onChange(e)}
                />
                <input
                    className="form-control my-3"
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={confirm_password}
                    onChange={(e) => onChange(e)}
                />
                <button className="btn btn-success btn-block">Submit</button>
            </form>
            <Link to="/login">Login</Link>
        </Fragment>
    )
}

export default Register
