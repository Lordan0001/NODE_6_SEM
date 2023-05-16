import React from 'react';
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
  fetchPostsTags
} from '../redux/slices/posts';
import {useParams} from "react-router-dom";


export const SubForum = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags,comments,categories } = useSelector((state) => state.posts);
  const { tagfilter } = useParams();
  const fullUrl = window.location.href;
  const urlParts = fullUrl.split("/");
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
  }, []);

  return (
    <>
{/*      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>*/}
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
                isEditable={userData?._id === obj.user._id}
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={ comments.items} isLoading= {isCommentsLoading}
           // isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
