import React, { Fragment, useState, useEffect } from 'react'
import './App.css'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//components

import Dashboard from './components/Dashboard'
import Register from './components/Register'
import Login from './components/Login'
import ChallengeDashboard from './components/ChallengeDashboard'
import ReaderInfo from './components/ReaderInfo'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

toast.configure()

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean)
    }

    async function isAuth() {
        try {
            const response = await fetch('/auth/is-verify', {
                method: 'GET',
                headers: { token: localStorage.token },
            })
            const parseRes = await response.json()

            parseRes === true
                ? setIsAuthenticated(true)
                : setIsAuthenticated(false)
        } catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        isAuth()
    })

    return (
        <Fragment>
            <Router>
                <div className="container">
                    <Switch>
                        <Route
                            exact
                            path="/login"
                            render={(props) =>
                                !isAuthenticated ? (
                                    <Login {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/dashboard" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/"
                            render={(props) =>
                                !isAuthenticated ? (
                                    <Login {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/dashboard" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/register"
                            render={(props) =>
                                !isAuthenticated ? (
                                    <Register {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/forgot-passwrod"
                            render={(props) =>
                                !isAuthenticated ? (
                                    <ForgotPassword
                                        {...props}
                                        setAuth={setAuth}
                                    />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/reset*"
                            render={(props) =>
                                !isAuthenticated ? (
                                    <ResetPassword
                                        {...props}
                                        setAuth={setAuth}
                                    />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/dashboard"
                            render={(props) =>
                                isAuthenticated ? (
                                    <Dashboard {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/challenge-dashboard"
                            render={(props) =>
                                isAuthenticated ? (
                                    <ChallengeDashboard
                                        {...props}
                                        setAuth={setAuth}
                                    />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                        <Route
                            exact
                            path="/readers/:id"
                            render={(props) =>
                                isAuthenticated ? (
                                    <ReaderInfo {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                        <Route
                            path="*"
                            render={(props) =>
                                isAuthenticated ? (
                                    <Dashboard {...props} setAuth={setAuth} />
                                ) : (
                                    <Redirect to="/login" />
                                )
                            }
                        />
                    </Switch>
                </div>
            </Router>
        </Fragment>
    )
}

export default App
