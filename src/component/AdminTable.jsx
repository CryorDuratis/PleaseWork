import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Checkbox, Select, MenuItem, InputLabel, FormControl, TextField } from "@mui/material"
import CreateUserForm from "./CreateUserForm.jsx"
import userServices from "../services/userServices.jsx"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

const AdminTable = () => {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null) //to track editing user
  const [userEdits, setUserEdits] = useState({}) //New state to track edits

  // store all available group options and currently selected group options
  const [groupOptions, setGroupOptions] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])

  //fetch all users on table
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userServices.getAllUsers()
        setUsers(data.data) //response is an array of users
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }
    if (editingUser == null) fetchUsers()
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
    // Update the backend with the edited user data
    try {
      const accessToken = Cookies.get("token")
      await userServices.updateUser(username, editedUser.email, editedUser.password, editedUser.groupnames, editedUser.isActive, accessToken) // Adjust as per your API
      toast.success("User updated successfully!")
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user. Please try again.")
      return
    }
    // Set user that is currently being edited
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
    const [groupOptions, setGroupOptions] = useState([])
    const isEditing = editingUser === user.username
    const currentUserEdits = userEdits[user.username] || {
      ...user,
      groupnames: user.groupnames.split(","),
    }
    console.log("userrow is rendered ", user.username)

    useEffect(() => {
      const getGroupOptions = async () => {
        try {
          const result = await userServices.getAllGroups(user.username).catch((e) => {
            if (e.response.status === 401) {
              Cookies.remove("jwt-token")
              navigate("/")
            }
            let error = e.response.data
            if (error) {
              // Show error message
              toast.error(error.message, {
                autoClose: false,
              })
            }
          })
          setGroupOptions(result.data.map((group) => group.groupname))
        } catch (e) {
          console.error("TODO")
        }
      }
      getGroupOptions()
    }, [])

    return (
      <TableRow>
        <TableCell>{user.username}</TableCell>

        <TableCell>{isEditing ? <TextField type="email" defaultValue={currentUserEdits.email} onChange={(e) => handleEditChange(user.username, "email", e.target.value)} /> : user.email} </TableCell>
        <TableCell>{isEditing ? <TextField type="password" defaultValue={currentUserEdits.password} onChange={(e) => handleEditChange(user.username, "password", e.target.value)} placeholder="********" /> : "********"}</TableCell>
        <TableCell>
          {isEditing ? (
            <FormControl fullWidth>
              <InputLabel id="group-select-label-${user.username}">User Group</InputLabel>
              <Select
                labelId="group-select-label-"
                multiple
                value={currentUserEdits.groupnames.split(",")}
                onChange={(e) => handleEditChange(user.username, "groupnames", e.target.value.join(","))}
                //renderValue={selected => selected.join(", ")}
              >
                {Array.isArray(groupOptions) && groupOptions.map((opt) => <MenuItem value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
          ) : (
            user.groupnames
          )}
        </TableCell>
        <TableCell>
          {isEditing ? (
            <>
              <Button variant={currentUserEdits.isActive ? "contained" : "outlined"} color="primary" onClick={() => handleIsActiveChange(user.username, true)}>
                Active
              </Button>
              <Button variant={!currentUserEdits.isActive ? "contained" : "outlined"} color="secondary" onClick={() => handleIsActiveChange(user.username, false)}>
                Inactive
              </Button>
            </>
          ) : user.isActive ? (
            "Active"
          ) : (
            "Inactive"
          )}
        </TableCell>
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
            <TableCell>User Group</TableCell>
            <TableCell>IsActive</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <CreateUserForm />
          {Array.isArray(users) && users.map((user) => <UserRow key={user.username} user={user} />)}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default AdminTable
