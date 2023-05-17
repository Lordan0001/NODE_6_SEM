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

export const UserBlock = ({ items, children, isLoading = true }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const displayedItems = isLoading ? [...Array(5)] : items.slice(0, 5);
    const remainingItems = isLoading ? [] : items.slice(5);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <SideBlock title="Comments">
            <List>
                {displayedItems.map((obj, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
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
                                <ListItemText primary={obj.user.fullName} secondary={obj.text} />
                            )}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
                {showDropdown &&
                    remainingItems.map((obj, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                                </ListItemAvatar>
                                <ListItemText primary={obj.user.fullName} secondary={obj.text} />
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
