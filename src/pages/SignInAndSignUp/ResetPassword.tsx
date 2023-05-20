import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AdbIcon from '@mui/icons-material/Adb';
import { useState } from 'react';
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import { FormValues } from '../../Constant';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const theme = createTheme();

const schemaSignUp = yup.object().shape({
    email: yup.string().required("Please fill out this field!")
        .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter the correct format!"
        )
    })

const ResetPass =  () => {
    const [email, setEmail] = useState<string>('');

    const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm<FormValues>({
        resolver: yupResolver(schemaSignUp),
    });

    const onSubmit = async(data: FormValues) => {
        try {
            const ob: any = await sendPasswordResetEmail(auth, data.email);
            
        }catch (error) {
        console.log(error); 
        }
    }

    return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <AdbIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/" variant="body2">
                  Sign In
                </Link>
              </Grid>
              
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    );
}

export default ResetPass;