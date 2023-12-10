// import React, { useState } from "react"
// import { TextField, Button, Grid, Paper, Typography } from "@mui/material"
// import authService from "../services/authService.jsx"

// function LoginForm({ onLoginSuccess }) {
//    const [username, setUsername] = useState("")
//    const [password, setPassword] = useState("")
//    const [error, setError] = useState("")

//    const handleSubmit = async event => {
//       event.preventDefault()
//       try {
//          const userData = await authService.login(username, password)
//          console.log("hi", userData)
//          onLoginSuccess(userData)
//       } catch (err) {
//          console.error("login error:", err)
//          setError("Invalid credentials")
//       }
//    }

//    return (
//       <Paper style={{ padding: 20 }}>
//          <Typography variant="h6" textAlign="centre ">
//             Login
//          </Typography>
//          <form onSubmit={handleSubmit}>
//             <Grid container direction="column" spacing={2}>
//                <Grid item>
//                   <TextField
//                      label="username"
//                      type="text"
//                      fullWidth
//                      value={username}
//                      onChange={e => setUsername(e.target.value)}
//                   />
//                </Grid>
//                <Grid item>
//                   <TextField
//                      label="Password"
//                      type="password"
//                      fullWidth
//                      value={password}
//                      onChange={e => setPassword(e.target.value)}
//                   />
//                </Grid>
//                {error && (
//                   <Grid item>
//                      <Typography color="error">{error}</Typography>
//                   </Grid>
//                )}
//                <Grid item>
//                   <Button
//                      type="submit"
//                      variant="contained"
//                      color="primary"
//                      fullWidth
//                   >
//                      Login
//                   </Button>
//                </Grid>
//             </Grid>
//          </form>
//       </Paper>
//    )
// }

// export default LoginForm
