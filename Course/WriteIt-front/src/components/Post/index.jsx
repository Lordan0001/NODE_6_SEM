import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import axios from 'axios';

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import {fetchAddLike, fetchRemovePost} from '../../redux/slices/posts';
import  FavoriteIcon   from "@mui/icons-material/Favorite";
import {selectIsAuth} from "../../redux/slices/auth";

export const Post = ({
                         id,
                         title,
                         createdAt,
                         imageUrl,
                         user,
                         viewsCount,
                         commentsCount,
                         likes,
                         tags,
                         children,
                         isFullPost,
                         isLoading,
                         isEditable,
                     }) => {
    const dispatch = useDispatch();
    const authToken = useSelector((state) => state.auth.token);
    const isAuth = useSelector(selectIsAuth);

    const handleLikeClick = () => {
        console.log(id);
        const data ={"postId": id}
       dispatch(fetchAddLike({postId:data}));
    };

    if (isLoading) {
        return <PostSkeleton />;
    }

    const onClickRemove = () => {
        if (window.confirm('Вы действительно хотите удалить статью?')) {
            dispatch(fetchRemovePost(id));
        }
    };

    return (
        <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
            {isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/posts/${id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={onClickRemove} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            {imageUrl && (
                <img
                    className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
                    src={imageUrl}
                    alt={title}
                />
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user} additionalText={createdAt} />
                <div className={styles.indention}>
                    <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
                        {isFullPost ? (
                            title
                        ) : (
                            <Link to={`/posts/${id}`}>{title}</Link>
                        )}
                    </h2>
                    <ul className={styles.tags}>
                        {tags.map((name) => (
                            <li key={name}>
                                <Link to={`/tags/${name}`}>#{name}</Link>
                            </li>
                        ))}
                    </ul>
                    {children && <div className={styles.content}>{children}</div>}
                    <ul className={styles.postDetails}>
                        {isAuth ? (
                            <>
                        <li>
                            <EyeIcon />
                            <span>{viewsCount}</span>
                        </li>
                        <li>
                            <CommentIcon />
                            <span>{commentsCount}</span>
                        </li>
                        <li>
                            <FavoriteIcon  onClick={handleLikeClick} />
                            <span>{likes}</span>
                        </li>
                            </>):(<></>

                )
                }
                    </ul>
                </div>
            </div>
        </div>
    );
};
