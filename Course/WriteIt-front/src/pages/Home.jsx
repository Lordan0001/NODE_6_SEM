import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { Post, SubForumBlock, CommentsBlock } from '../components';
import {
  fetchComments,
  fetchPosts,
  fetchTags,
  fetchCategories,
  fetchAllLikes,
  fetchSubsPosts
} from '../redux/slices/posts';
import axios from "../axios";
import { fetchAuthMe } from '../redux/slices/auth';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments, categories } = useSelector((state) => state.posts);

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';
  const isCategoriesLoading = categories.status === 'loading';
  const [likes, setLikes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await dispatch(fetchAuthMe());
      const id = data.payload._id;
      setUserId(id);
    };

    fetchData();
    dispatch(fetchTags());
    dispatch(fetchComments());
    dispatch(fetchCategories());
    dispatch(fetchAllLikes());

    if (activeTab === 0) {
      dispatch(fetchPosts());
    } else if (activeTab === 1 && userId) {
      dispatch(fetchSubsPosts({ userId }));
    }

    axios
        .get(`/like`)
        .then((data) => {
          setLikes(data.data);
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении лайков');
        });
  }, [dispatch, activeTab, userId]);

  const getLikesCount = (postId) => {
    return likes.filter((like) => like.post === postId).length;
  };

  return (
      <>
        <Tabs
            style={{ marginBottom: 15 }}
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            aria-label="basic tabs example"
        >
          <Tab label="All" />
          <Tab label="Subscriptions" />
        </Tabs>
        <Grid container spacing={4}>
          <Grid xs={8} item>
            {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
                isPostsLoading ? (
                    <Post key={index} isLoading={true} />
                ) : (
                    <Post
                        id={obj._id}
                        title={obj.title}
                        imageUrl={`https://localhost:4444${obj.imageUrl}`}
                        user={obj.user}
                        createdAt={obj.createdAt}
                        viewsCount={obj.viewsCount}
                        commentsCount={comments.items.filter((com) => com.post === obj._id).length}
                        likes={getLikesCount(obj._id)}
                        tags={obj.tags}
                        isEditable={userData?._id === obj.user._id || userData?.role === 'admin'}
                    />
                ),
            )}
          </Grid>
          <Grid xs={4} item>
            <SubForumBlock items={categories.items} isLoading={isTagsLoading} />
            <CommentsBlock items={comments.items} isLoading={isCommentsLoading} />
            {/*<UserBlock items={  comments.items} isLoading= {isCommentsLoading}/>*/}
          </Grid>
        </Grid>
      </>
  );
};
