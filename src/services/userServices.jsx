import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

const API_URL = "http://localhost:3001/api/v1" // Replace with your API URL

//get all Users from database
const getAllUsers = async () => {
  try {
    const userData = {
      access_token: Cookies.get("token"),
      groupnames: "admin",
    }
    const response = await axios.post(`${API_URL}/getUsers`, userData)
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error // Propagate error for handling in the calling component
  }
}

//get User from database
const getUser = async () => {
  try {
    const userData = {
      access_token: Cookies.get("token"),
    }
    const response = await axios.post(`${API_URL}/getUser`, userData)
    return response.data
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error // Propagate error for handling in the calling component
  }
}

//create user
const createUser = async (username, email, password, groupnames) => {
  const userData = { access_token: Cookies.get("token"), username, email, password, groupnames }
  try {
    console.log("asds", userData)
    const response = await axios.post(`${API_URL}/createUser`, userData)
    const message = response.data.message
    // Show a toast with the dynamic message
    toast.success(`${message}`)
    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    const errorMessage = error.response?.data?.message || "Failed to create user. Please try again."
    // Show an error toast with the dynamic error message
    toast.error(errorMessage)
    throw error
  }
}

//toggle isActive
const toggleIsActive = async (username, isActive) => {
  const userData = { access_token: Cookies.get("token"), isActive }
  try {
    const response = await axios.put(`${API_URL}/toggle-status`, userData)
    return response.data
  } catch (error) {
    console.error("Error toggling isActive:", error)
    throw error
  }
}

//update Users (unable to update username)
const updateUser = async (username, email, password, groupnames, isActive) => {
  const userData = { access_token: Cookies.get("token"), username, email, password, groupnames, isActive }
  try {
    const response = await axios.put(`${API_URL}/users/:username`, userData)
    return response.data
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

//createGroup
const createGroup = async (groupname) => {
  const groupData = { access_token: Cookies.get("token"), groupname }
  try {
    const response = await axios.post(`${API_URL}/createGroup`, groupData)
    return response.data
  } catch (error) {
    console.error("Error creating group:", error)
    throw error
  }
}

//get all Groups from database
const getAllGroups = async (username) => {
  try {
    const userData = {
      access_token: Cookies.get("token"),
      username,
    }
    const response = await axios.post(`${API_URL}/getGroup`, userData)
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error // Propagate error for handling in the calling component
  }
}

//CheckGroup
const checkGroup = async (groupnames) => {
  const groupData = { access_token: Cookies.get("token"), groupnames }
  try {
    const response = await axios.post(`${API_URL}/checkGroup`, groupData)
    return response.data
  } catch (error) {
    console.error("User not in specified group", error)
    throw error
  }
}

export default {
  getAllUsers,
  createUser,
  toggleIsActive,
  updateUser,
  createGroup,
  checkGroup,
  getAllGroups,
  getUser,
}
