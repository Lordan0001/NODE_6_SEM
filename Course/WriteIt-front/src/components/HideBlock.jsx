import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import { SideBlock } from './SideBlock';
import {useDispatch} from "react-redux";
import {fetchPostsWithTagAndWithout} from "../redux/slices/posts";

export const HideBlock = ({ items, isLoading = true }) => {
    const [expanded, setExpanded] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dispatch = useDispatch();
    const mainTag = window.location.pathname.split('/').pop();

    useEffect(() => {
        console.log(mainTag);
        console.log(selectedItem);
        dispatch(fetchPostsWithTagAndWithout({ mainTag: mainTag, hideTag: selectedItem }));
    }, [mainTag, selectedItem]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
        setSelectedItem(null);
    };

    const visibleItems = expanded ? items : items.slice(0, 5);

    return (
        <SideBlock title="Hide">
            <List>
                {visibleItems.map((name, i) => (
                    //  <a style={{ textDecoration: 'none', color: 'black' }} href={`/tags/${name}`} key={i}>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setSelectedItem(name)}>
                                <ListItemIcon>
                                    <TagIcon />
                                </ListItemIcon>
                                {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name} />}
                            </ListItemButton>
                        </ListItem>
                  //  </a>
                ))}
            </List>
            {items.length > 5 && (
                <IconButton size="small" onClick={toggleExpanded} sx={{ mt: 1 }}>
                    <ExpandMoreIcon fontSize="small" />
                </IconButton>
            )}
        </SideBlock>
    );
};
