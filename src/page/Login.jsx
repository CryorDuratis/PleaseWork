import React, { useState } from "react"
import { TextField, Button, Grid, Paper, Container, Typography, Box } from "@mui/material"
import authService from "../services/authService.jsx"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Login = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // const [isLoggedIn, setIsLoggedIn] = useState(false)
  // const [userInfo, setUserInfo] = useState(null)

  //Submit Form
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const userData = await authService.login(username, password)
      // setUserInfo(userData) //storing user data
      // setIsLoggedIn(true) //Updating login state
      toast.success("Logged in Successfully")
      navigate("/dashboard")
    } catch (err) {
      console.error("login error:", err)
      setError("Invalid credentials")
    }
  }
  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="75vh">
        <Typography variant="h4" style={{ margin: "40px 0", textAlign: "center" }}>
          Task Management System
        </Typography>
        {/* LoginForm component */}
        <Paper style={{ padding: 20 }}>
          <Typography variant="h6" textAlign="centre ">
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField label="username" type="text" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} />
              </Grid>
              <Grid item>
                <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} />
              </Grid>
              {error && (
                <Grid item>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
              <Grid item>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login
