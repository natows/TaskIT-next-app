"use client";
import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "./login/UserContext";
import { NotificationContext } from "./NotificationContext";
import ThemeSwitcher from "./ThemeSwitcher";
import Notifications from "./Notifications";
import { AppBar, Toolbar, Typography, IconButton, Badge, Button, Box } from "@mui/material";
import { AccountCircle, Notifications as NotificationsIcon, ExitToApp as LogoutIcon } from "@mui/icons-material";

export default function Navigation() {
    const { user, handleLogout } = useContext(UserContext);
    const { notifications } = useContext(NotificationContext);
    const [showNotifications, setShowNotifications] = useState(false);

    const userToNull = () => {
        handleLogout();
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>TaskIt</Link>
                </Typography>
                <ThemeSwitcher />
                {user !== null ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            {user.isAdmin ? `Welcome Admin ${user.username}` : `Welcome ${user.username}`}
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<LogoutIcon />}
                            onClick={userToNull}
                            sx={{ mr: 2 }}
                        >
                            Log out
                        </Button>
                        {!user.isAdmin && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton color="inherit" component={Link} href="/account">
                                    <AccountCircle />
                                </IconButton>
                                <IconButton color="inherit" onClick={toggleNotifications}>
                                    <Badge badgeContent={notifications.length} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Box>
                        )}
                        {showNotifications && !user.isAdmin && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50px',
                                    right: '10px',
                                    bgcolor: 'background.paper',
                                    color: 'text.primary',
                                    p: 2,
                                    borderRadius: 1,
                                    boxShadow: 3,
                                    zIndex: 10,
                                    width: '300px'
                                }}
                            >
                                <Notifications />
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Button color="inherit" component={Link} href="/login">
                        Log in
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}