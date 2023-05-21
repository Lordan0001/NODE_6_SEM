import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {fetchCategories, fetchComments, fetchPosts, fetchPostsTags, fetchTags} from '../redux/slices/posts';
import {useParams} from "react-router-dom";
import {SubForumBlock} from "../components";


export const TagPost = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags, comments,categories  } = useSelector((state) => state.posts);
  const { tagname } = useParams();

  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';




  React.useEffect(() => {
    dispatch(fetchPostsTags( {tagname} ));
    dispatch(fetchTags());
    dispatch(fetchComments());
    dispatch(fetchCategories());
  }, []);

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
                        commentsCount={3}
                        tags={obj.tags}
                        isEditable={userData?._id === obj.user._id || userData?.role === 'admin' }
                    />
                ),
            )}
          </Grid>
          <Grid xs={4} item>
            <SubForumBlock items={categories.items} isLoading={isTagsLoading} />
            <CommentsBlock items={comments.items} isLoading={isCommentsLoading} />
          </Grid>
        </Grid>
      </>
  );
};
