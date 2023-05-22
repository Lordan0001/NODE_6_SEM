import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { logout, selectIsAuth } from '../../redux/slices/auth';
import {fetchPosts, fetchSearchPosts} from "../../redux/slices/posts";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [searchValue, setSearchValue] = useState('');

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout());
      window.localStorage.removeItem('token');
    }
  };

  const handleSearch = () => {
    // Perform search logic based on the searchValue
    console.log('Perform search for:', searchValue);
    dispatch(fetchSearchPosts({tagname:searchValue}))
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  const MainPageOnClick = (event)=>{
    dispatch(fetchPosts());
  }

  return (
      <div className={styles.root}>
        <Container maxWidth="lg">
          <div className={styles.inner}>
            <Link className={styles.logo} onClick={
              MainPageOnClick
            } to="/">
              <div>WriteIt</div>
            </Link>
            <div className={styles.search}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <TextField
                      variant="outlined"
                      placeholder="Search"
                      size="small"
                      value={searchValue}
                      onChange={handleChange}
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </Grid>
              </Grid>
            </div>
            <div className={styles.buttons}>
              {isAuth ? (
                  <>
                    <Link to="/add-post">
                      <Button variant="contained">Сreate a discussion</Button>
                    </Link>
                    <Button onClick={onClickLogout} variant="contained" color="error">
                      Log out
                    </Button>
                  </>
              ) : (
                  <>
                    <Link to="/login">
                      <Button variant="outlined">Sign in</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="contained">Sign up</Button>
                    </Link>
                  </>
              )}
            </div>
          </div>
        </Container>
      </div>
  );
};
