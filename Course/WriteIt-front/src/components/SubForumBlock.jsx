import React, { useState } from 'react';
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

export const SubForumBlock = ({ items, isLoading = true }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const visibleItems = expanded ? items : items.slice(0, 5);

    return (
        <SideBlock title="Categores">
            <List>
                {visibleItems.map((name, i) => (
                    <a style={{ textDecoration: 'none', color: 'black' }} href={`/subforum/${name.category}`} key={i}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <TagIcon />
                                </ListItemIcon>
                                {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name.category} />}
                            </ListItemButton>
                        </ListItem>
                    </a>
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
