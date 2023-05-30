import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {
  fetchComments,
  fetchPosts,
  fetchTags,
  fetchCategories,
  fetchCategoriesWithTags,
  fetchPostsTags,
  fetchAllLikes,
} from '../redux/slices/posts';
import {useParams} from "react-router-dom";
import {HideBlock} from "../components";
import axios from "../axios";


export const SubForum = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags,comments,categories } = useSelector((state) => state.posts);
  const { tagfilter } = useParams();
  const fullUrl = window.location.href;
  const urlParts = fullUrl.split("/");
  const [likes, setLikes] = useState([]);
  let tagname = urlParts[4];

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';
  const isCategoriesLoading = categories.status === 'loading';

  React.useEffect(() => {
    //dispatch(fetchPosts());
    //dispatch(fetchTags());
    dispatch(fetchPostsTags( {tagname} ));
    dispatch(fetchCategoriesWithTags({tagfilter}));
    dispatch(fetchComments());
    dispatch(fetchCategories());
    dispatch(fetchAllLikes());



    axios
        .get(`/like`)
        .then((data) => {
          setLikes(data.data);
        })
        .catch((err) => {
          console.warn(err);
          alert('Ошибка при получении лайков');
        });



  }, []);
  const getLikesCount = (postId) => {
    return likes.filter((like) => like.post === postId).length;
  };
  return (
    <>

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
                isEditable={userData?._id === obj.user._id || userData?.role === 'admin' }
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <HideBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={ comments.items} isLoading= {isCommentsLoading}
           // isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
