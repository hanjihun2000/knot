import React from 'react'
import {House, MagnifyingGlass, Gear, Bell, UserGear} from "@phosphor-icons/react";

export const adminSidebarList = [
  {
    title: "Home Page",
    icon: <House />,
    link: "/home"
  },
  {
    title: "Search",
    icon: <MagnifyingGlass />,
    link: "/search"
  },
  {
    title: "Settings",
    icon: <Gear />,
    link: "/settings/profile-edit"
  },
  {
    title: "Notification",
    icon: <Bell />,
    link: "/notification"
  },
  {
    title :"Admin",
    icon: <UserGear />,
    link: "/admin/adminViewUser"
  }
]


