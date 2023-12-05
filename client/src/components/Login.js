import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
const Login = ({ setAuth }) => {
    const [inputs, setInputs] = useState({
        email: '',
        user_password: '',
    })

    const [inputType, setInputType] = useState("password")

    const { email, user_password } = inputs

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const togglePeek = () => {
        inputType === "password" ? setPeekPass("text") : setPeekPass("password");
    };

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
            <h1 className="text-center my-5">Login to start reporting!</h1>
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
                    type={inputType}
                    name="user_password"
                    placeholder="Password"
                    value={user_password}
                    onChange={(e) => onChange(e)}
                />
                <button className="btn btn-success btn-block my-2">
                    Submit
                </button>
                <input type="checkbox" id="peekPassword" name="peek-password" value="Show Password" onChange={() => togglePeek()}/>
                <label for="peek-password">Show Password</label>       
            </form>
            <Link to="/register">Register</Link>
            <br></br>
            <Link to="/forgot-passwrod">Forgot Password</Link>
        </Fragment>
    )
}

export default Login
