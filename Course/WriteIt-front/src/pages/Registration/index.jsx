import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { fetchAuth, fetchRegister, selectIsAuth } from '../../redux/slices/auth';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: 'user user',
      email: 'user@test.com',
      password: '1234',
      avatarUrl: '',
    },
    mode: 'onChange',
  });

  const [isInvalidUrl, setIsInvalidUrl] = useState(false);

  useEffect(() => {
    setIsInvalidUrl(!register.imageUrl || !isValidUrl(register.imageUrl));
  }, [register.imageUrl]);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert('Failed to pass registration!');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
      <Paper classes={{ root: styles.root }}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Create an account
        </Typography>
        <div className={styles.avatar}>
          {register.imageUrl && register.imageUrl.length > 0 ? (
              <Avatar sx={{ width: 100, height: 100 }} src={register.imageUrl} />
          ) : (
              <Avatar sx={{ width: 100, height: 100 }} />
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
              error={Boolean(errors.fullName?.message)}
              helperText={errors.fullName?.message}
              {...register('fullName', { required: 'Enter full name' })}
              className={styles.field}
              label="Full name"
              fullWidth
          />
          <TextField
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
              type="email"
              {...register('email', { required: 'Enter your email' })}
              className={styles.field}
              label="E-Mail"
              fullWidth
          />
          <TextField
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              type="password"
              {...register('password', {
                required: 'Enter a password',
                minLength: {
                  value: 5,
                  message: 'Password must contain at least 5 characters',
                },
              })}
              className={styles.field}
              label="Password"
              fullWidth
          />
          <TextField
              {...register('avatarUrl', {
                setValueAs: (value) => (value ? value : 'https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_1280.png'),
              })}
              className={styles.field}
              label="URL for image"
              fullWidth
          />

          <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
            Sign Up
          </Button>
        </form>
      </Paper>
  );
};
