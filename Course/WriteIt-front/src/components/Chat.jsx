import React, { useState, useEffect } from "react";
import { SideBlock } from "./SideBlock";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../redux/slices/auth";

export const Chat = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [userFullName, setUserFullName] = useState("");
    const [userAvatarUrl, setUserAvatarUrl] = useState("");
    const isAuth = useSelector(selectIsAuth);

    useEffect(() => {
        const newSocket = io("https://localhost:4444");
        setSocket(newSocket);

        // Listen for chat messages
        newSocket.on("chatMessage", (message) => {
            setChatMessages((prevMessages) => [...prevMessages, message]);
        });

        fetchUserInformation();
        fetchChatMessages();

        return () => {
            // Clean up the socket connection
            newSocket.disconnect();
        };
    }, []);

    const fetchUserInformation = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log("Token not found in localStorage");
                return;
            }

            const response = await axios.get("https://localhost:4444/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { fullName, avatarUrl } = response.data;
            setUserFullName(fullName);
            setUserAvatarUrl(avatarUrl);
        } catch (error) {
            console.log("Error fetching user information:", error);
        }
    };

    const fetchChatMessages = async () => {
        try {
            const response = await axios.get("https://localhost:4444/message");
            setChatMessages(response.data);
        } catch (error) {
            console.log("Error fetching chat messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            const messageData = {
                username: userFullName,
                message: newMessage,
                timestamp: new Date().toLocaleTimeString(),
                avatarUrl: userAvatarUrl,
            };

            // Send message via WebSocket
            socket.emit("chatMessage", messageData);

            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.log("Token not found in localStorage");
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Send message via POST request
                await axios.post("https://localhost:4444/message", messageData, config);
            } catch (error) {
                console.log("Error sending message via POST request:", error);
            }

            setNewMessage("");
        }
    };

    return (
        <SideBlock title="Chat">
            <List>
                {chatMessages.map((message, index) => (
                    <React.Fragment key={index}>
                        <ListItem>
                            {message.avatarUrl && (
                                <img
                                    src={message.avatarUrl}
                                    alt={message.username}
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        marginRight: "5px",
                                    }}
                                />
                            )}
                            <ListItemText
                                primary={
                                    <React.Fragment>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                marginBottom: "5px",
                                            }}
                                        >
                      <span
                          style={{
                              fontWeight: "bold",
                              marginRight: "5px",
                          }}
                      >
                        {message.username}
                      </span>
                                            <span>{message.timestamp}</span>
                                        </div>
                                        <div>{message.message}</div>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>

            {isAuth ? (
                <>
                    <TextField
                        label="New Message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleSendMessage}>
                        Send
                    </Button>
                </>
            ) : null}
        </SideBlock>
    );
};
