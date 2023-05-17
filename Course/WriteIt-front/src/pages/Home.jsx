import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { SubForumBlock } from '../components/SubForumBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import {fetchComments, fetchPosts, fetchTags,fetchCategories} from '../redux/slices/posts';


export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags,comments,categories } = useSelector((state) => state.posts);



  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';
  const isCommentsLoading = comments.status === 'loading';
  const isCategoriesLoading = categories.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts());
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
                imageUrl={`http://localhost:4444${obj.imageUrl}`}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={comments.count}//problem here
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id || userData?.role === 'admin' }
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <SubForumBlock items={categories.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={ comments.items} isLoading= {isCommentsLoading}
           // isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
