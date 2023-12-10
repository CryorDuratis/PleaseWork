import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Checkbox, Select, MenuItem, InputLabel, FormControl, TextField } from "@mui/material"
import CreateUserForm from "./CreateUserForm.jsx"
import userServices from "../services/userServices.jsx"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

const EditUser = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null) //to track editing user
  const [userEdits, setUserEdits] = useState({}) //New state to track edits

  //fetch all users on table
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userServices.getUser()
        setUsers(data.data) //response is an array of users
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }
    if (editingUser == null) fetchUser()
  }, [editingUser])

  //Edit each UserRow
  const toggleEditMode = (username) => {
    const user = users.find((user) => user.username == username)
    setEditingUser(editingUser === username ? null : username)
    username &&
      setUserEdits({
        ...userEdits,
        [username]: {
          email: user.email,
          isActive: user.isActive,
          groupnames: user.groupnames,
        },
      })
  }
  const handleEditChange = (username, key, value) => {
    setUserEdits({
      ...userEdits,
      [username]: {
        ...userEdits[username],
        [key]: value,
      },
    })
  }
  //    const handleIsActiveChange = isActive => {
  //       handleEditChange(user.username, "isActive", isActive)
  //    }
  const handleIsActiveChange = (username, isActive) => {
    handleEditChange(username, "isActive", isActive)
  }
  const saveChanges = async (username) => {
    //Logic to save changes
    const editedUser = userEdits[username]
    if (!editedUser) {
      console.warn("No edits made to the user:", username)
      setEditingUser(null)
      toggleEditMode(null)
      return
    }
    // Optionally: Update the backend with the edited user data
    try {
      const accessToken = Cookies.get("token")
      await userServices.updateUser(username, editedUser.email, editedUser.password, editedUser.groupnames, editedUser.isActive, accessToken) // Adjust as per your API
      toast.success("User updated successfully!")
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user. Please try again.")
      return
    }
    // Update the local users state
    setUsers(
      users.map((user) => {
        if (user.username === username) {
          return { ...user, ...editedUser }
        }
        return user
      })
    )

    // Reset editing state and clear edits for this user
    setEditingUser(null)
    setUserEdits((edit) => {
      const newEdits = { ...edit }
      delete newEdits[username]
      return newEdits
    })

    //Update users state and/or send update to backend
    toggleEditMode(null)
  }

  const UserRow = ({ user }) => {
    const isEditing = editingUser === user.username
    const currentUserEdits = userEdits[user.username] || {
      ...user,
      groupnames: user.groupnames.split(","),
    }

    return (
      <TableRow>
        <TableCell>{user.username}</TableCell>

        <TableCell>{isEditing ? <TextField type="email" defaultValue={currentUserEdits.email} onChange={(e) => handleEditChange(user.username, "email", e.target.value)} /> : user.email} </TableCell>
        <TableCell>{isEditing ? <TextField type="password" defaultValue={currentUserEdits.password} onChange={(e) => handleEditChange(user.username, "password", e.target.value)} placeholder="********" /> : "********"}</TableCell>

        <TableCell>
          {isEditing ? (
            <>
              <Button onClick={() => saveChanges(user.username)} variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={() => toggleEditMode(null)} variant="contained" color="secondary">
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => toggleEditMode(user.username)} variant="contained" color="primary">
              Edit
            </Button>
          )}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Paper style={{ border: "1px solid #ccc", marginLeft: "15px" }}>
      <Table>
        <colgroup>
          {/* {" "} */}
          {/* Ensures columns have the same width in head and body */}
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Password</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{Array.isArray(users) && users.map((user) => <UserRow key={user.username} user={user} />)}</TableBody>
      </Table>
    </Paper>
  )
}

export default EditUser
