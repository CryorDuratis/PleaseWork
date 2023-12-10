import React, { useState, useEffect } from "react"
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined"
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import Cookies from "js-cookie"
import userServices from "../services/userServices.jsx"

const Item = ({ title, to, icon, selected, setSelected }) => {
  const navigate = useNavigate()
  const primaryColor = "#556cd6" // Example primary color
  const greyColor = "#999" // Example grey color

  const handleNavigation = () => {
    setSelected(title)
    navigate(to)
  }

  return (
    <MenuItem active={selected === title} style={{ color: greyColor }} onClick={handleNavigation} icon={icon}>
      <Typography>{title}</Typography>
    </MenuItem>
  )
}

const Sidebarr = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selected, setSelected] = useState("Dashboard")
  const [isAdmin, setIsAdmin] = useState(false)
  const token = Cookies.get("token")

  useEffect(() => {
    async function checkAdmin() {
      try {
        await userServices.checkGroup("admin").then(function (result) {
          console.log("result: ", result)
          if (result.response && result.response.status == 401) {
            Cookies.remove("token")
            Navigate("/")
          }
          if (result.result === true) {
            setIsAdmin(true)
          }
        })
      } catch (e) {
        setIsAdmin(false)
      }
    }
    checkAdmin()
  }, [token])

  //check state
  //  useEffect(() => {
  //     console.log("hi", isAdmin)
  //  }, [isAdmin])

  return (
    <Box
      sx={{
        ".css-ewdv3l": {
          height: "100vh",
        },
        width: isCollapsed ? "80px" : "250px",
        backgroundColor: "#556cd6",
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}>
            {!isCollapsed && (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h3">TMS</Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          <Box paddingLeft={isCollapsed ? undefined : "10%"} sx={{ marginTop: "35px" }}>
            <Item title="Dashboard" to="/dashboard" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />
            {isAdmin ? (
              <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }}>
                Admin Functions
              </Typography>
            ) : null}
            {isAdmin ? <Item title="Admin" to="/admin" icon={<ContactsOutlinedIcon />} selected={selected} setSelected={setSelected} /> : null}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  )
}

export default Sidebarr
