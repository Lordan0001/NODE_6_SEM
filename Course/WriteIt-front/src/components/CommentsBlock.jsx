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
import axios from "axios";

export const CommentsBlock = ({ items, children, isLoading = true }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const displayedItems = isLoading ? [...Array(5)] : items.slice(0, 5);
    const remainingItems = isLoading ? [] : items.slice(5);
    const userData = useSelector((state) => state.auth.data);
    const [hoveredComment, setHoveredComment] = useState(null);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token"); // Получение токена из localStorage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Добавление токена в заголовок запроса
                },
            };
            await axios.delete(`https://localhost:4444/comments/${commentId}`, config);
            // Обработка успешного удаления, обновление состояния или получение обновленных комментариев
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.warn(error);
            alert("Ошибка при удалении комментария");
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
                {/* Основные комментарии */}
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
                                    <ListItemText primary={obj.user.fullName} secondary={obj.text} />
                                    {userData?.role === "admin" && hoveredComment === obj._id && (
                                        <DeleteIcon onClick={() => handleDeleteComment(obj._id)} />
                                    )}
                                </>
                            )}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}

                {/* Выпадающее меню с комментариями */}
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
                                {userData?.role === "admin" && hoveredComment === obj._id && (
                                    <DeleteIcon onClick={() => handleDeleteComment(obj._id)} />
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
