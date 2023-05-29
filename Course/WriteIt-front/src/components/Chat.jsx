import React, { useState, useEffect } from "react";
import { SideBlock } from "./SideBlock";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";

export const Chat = () => {
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io("https://localhost:4444");
        setSocket(newSocket);

        // Listen for chat messages
        newSocket.on("chatMessage", (message) => {
            setChatMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            // Clean up the socket connection
            newSocket.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            const messageData = {
                username: "Your Username", // Replace with the actual username
                message: newMessage,
                timestamp: new Date().toLocaleTimeString() // Add timestamp
            };
            socket.emit("chatMessage", messageData);
            setNewMessage("");
        }
    };

    return (
        <SideBlock title="Chat">
            <List>
                {chatMessages.map((message, index) => (
                    <React.Fragment key={index}>
                        <ListItem>
                            <ListItemText
                                primary={message.message}
                                secondary={`By: ${message.username} - ${message.timestamp}`}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
            <TextField
                label="New Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                fullWidth
            />
            <Button variant="contained" onClick={handleSendMessage}>
                Send
            </Button>
        </SideBlock>
    );
};
