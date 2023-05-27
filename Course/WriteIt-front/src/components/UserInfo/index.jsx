import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import styles from './UserInfo.module.scss';
import { fetchAuthMe } from '../../redux/slices/auth';
//TODO добавить action на Subscribe/Unsubsribe
export const UserInfo = ({ avatarUrl, fullName, additionalText, _id }) => {
    const dispatch = useDispatch();
    const postOwnerId = _id;
    const [userId, setUserId] = useState(null);
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await dispatch(fetchAuthMe());
            const id = data.payload._id;
            setUserId(id);

            try {
                const response = await axios.get(`https://localhost:4444/subscribe/${id}`);
                const responseData = response.data;
                setSubscribed(responseData.includes(postOwnerId));
                console.log(responseData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [dispatch, postOwnerId]);

    const buttonClassName = subscribed ? styles.unsubscribeButton : styles.subscribeButton;
    const buttonText = subscribed ? 'Unsubscribe' : 'Subscribe';

    return (
        <div className={styles.root}>
            <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={fullName} />
            <div className={styles.userDetails}>
                <span className={styles.userName}>{fullName}</span>
                <span className={styles.additional}>{additionalText}</span>
                {postOwnerId !== userId && (
                    <button className={buttonClassName}>{buttonText}</button>
                )}
            </div>
        </div>
    );
};
