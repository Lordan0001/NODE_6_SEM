import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchCategories = createAsyncThunk('posts/fetchCategories', async () => {
  const { data } = await axios.get('/categories');
  return data;
});



export const fetchPostsTags = createAsyncThunk('posts/fetchPostsTags', async ({ tagname }) => {
  //const url = `/${tagsWord}/${tagname}`;
  const response = await axios.get(`/tags/${tagname}`);
  return response.data;
});

export const fetchSearchPosts = createAsyncThunk('posts/fetchSearchPosts', async ({ tagname }) => {
  //const url = `/${tagsWord}/${tagname}`;
  const response = await axios.get(`/search/${tagname}`);
  return response.data;
});



export const fetchCategoriesWithTags = createAsyncThunk('posts/fetchCategoriesWithTags', async ({ tagfilter }) => {
  const url = `/subforum/${tagfilter}`;
  const response = await axios.get(url);
  return response.data;
});





export const fetchComments = createAsyncThunk('posts/fetchComments', async () => {
  const { data } = await axios.get('/comments');
  return data;
});

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags');
  return data;
});




export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) =>
  axios.delete(`/posts/${id}`),
);

const initialState = {
  posts: {
    items: [],
    status: 'loading',
  },
  tags: {
    items: [],
    status: 'loading',
  },
  comments: {
    items: [],
    status: 'loading',
  },
  categories: {
    items: [],
    status: 'loading',
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: {
    // Получение статей
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },
    // Получение категорий
    [fetchCategories.pending]: (state) => {
      state.categories.items = [];
      state.categories.status = 'loading';
    },
    [fetchCategories.fulfilled]: (state, action) => {
      state.categories.items = action.payload;
      state.categories.status = 'loaded';
    },
    [fetchCategories.rejected]: (state) => {
      state.categories.items = [];
      state.categories.status = 'error';
    },
    // Получение статей по тегам
    [fetchPostsTags.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchPostsTags.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchPostsTags.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // поиск
    [fetchSearchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = 'loading';
    },
    [fetchSearchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = 'loaded';
    },
    [fetchSearchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = 'error';
    },

    // Получение тегов
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },
    // Получение тегов к конкретной категории
    [fetchCategoriesWithTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = 'loading';
    },
    [fetchCategoriesWithTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = 'loaded';
    },
    [fetchCategoriesWithTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = 'error';
    },

    // Получение комментраиев
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = 'loading';
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = 'loaded';
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = 'error';
    },

    // Удаление статьи
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter((obj) => obj._id !== action.meta.arg);
    },
  },
});

export const postsReducer = postsSlice.reducer;
