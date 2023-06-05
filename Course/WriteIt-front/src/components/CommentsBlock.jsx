import React, { useState } from "react";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

export const CommentsBlock = ({ items, children, isLoading = true }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const displayedItems = isLoading ? [...Array(5)] : items.slice(0, 5);
    const remainingItems = isLoading ? [] : items.slice(5);
    const userData = useSelector((state) => state.auth.data);
    const [hoveredComment, setHoveredComment] = useState(null);
    const [editedComment, setEditedComment] = useState("");
    const [editCommentId, setEditCommentId] = useState(null);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the request headers
                },
            };
            await axios.delete(`https://localhost:4444/comments/${commentId}`, config);
            // Handle successful deletion, update the state or fetch the updated comments
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.warn(error);
            alert("Error deleting the comment");
        }
    };

    const handleEditComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token"); // Get the token from localStorage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the token to the request headers
                },
            };
            const body = {
                text: editedComment, // Use the editedComment state as the new text value
            };
            await axios.patch(`https://localhost:4444/comments/${commentId}`, body, config);
            // Handle successful edit, update the state or fetch the updated comments
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.warn(error);
            alert("Error editing the comment");
        }
    };

    const handleMouseEnter = (commentId) => {
        setHoveredComment(commentId);
    };

    const handleMouseLeave = () => {
        setHoveredComment(null);
    };

    return (
        <SideBlock title="Comments">
            <List>
                {/* Main comments */}
                {displayedItems.map((obj, index) => (
                    <React.Fragment key={index}>
                        <ListItem
                            alignItems="flex-start"
                            onMouseEnter={() => handleMouseEnter(obj._id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <ListItemAvatar>
                                {isLoading ? (
                                    <Skeleton variant="circular" width={40} height={40} />
                                ) : (
                                    <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                                )}
                            </ListItemAvatar>
                            {isLoading ? (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Skeleton variant="text" height={25} width={120} />
                                    <Skeleton variant="text" height={18} width={230} />
                                </div>
                            ) : (
                                <>
                                    {editCommentId === obj._id ? (
                                        <textarea
                                            rows={3} // Set the number of rows to make the textarea larger
                                            value={editedComment}
                                            onChange={(e) => setEditedComment(e.target.value)}
                                            style={{ width: "100%" }} // Adjust the width to fit the container
                                        />
                                    ) : (
                                        <ListItemText primary={obj.user.fullName} secondary={obj.text} />
                                    )}
                                    <div>
                                        {(userData?._id === obj.user._id || userData?.role === "admin") &&
                                            hoveredComment === obj._id && (
                                                <>
                                                    {editCommentId === obj._id ? (
                                                        <>
                                                            <Button onClick={() => handleEditComment(obj._id)}>Save</Button>
                                                            <Button onClick={() => setEditCommentId(null)}>Cancel</Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EditIcon onClick={() => setEditCommentId(obj._id)} />
                                                            <DeleteIcon onClick={() => handleDeleteComment(obj._id)} />
                                                        </>
                                                    )}
                                                </>
                                            )}
                                    </div>
                                </>
                            )}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}

                {/* Dropdown menu with remaining comments */}
                {showDropdown &&
                    remainingItems.map((obj, index) => (
                        <React.Fragment key={index}>
                            <ListItem
                                alignItems="flex-start"
                                onMouseEnter={() => handleMouseEnter(obj._id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <ListItemAvatar>
                                    <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                                </ListItemAvatar>
                                <ListItemText primary={obj.user.fullName} secondary={obj.text} />
                                {(userData?._id === obj.user._id || userData?.role === "admin") &&
                                    hoveredComment === obj._id && (
                                        <>
                                            <EditIcon onClick={() => setEditCommentId(obj._id)} />
                                            <DeleteIcon onClick={() => handleDeleteComment(obj._id)} />
                                        </>
                                    )}
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))}
            </List>
            {remainingItems.length > 0 && (
                <Button onClick={toggleDropdown}>
                    {showDropdown ? "Hide" : "Show"} {remainingItems.length} more comment(s)
                </Button>
            )}
            {children}
        </SideBlock>
    );
};
