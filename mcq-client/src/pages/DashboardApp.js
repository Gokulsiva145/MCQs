// material
import { Box, Grid, Container, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppUsers,
  AppStudents,
  AppExams,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppCurrentSubject,
  AppConversionRates
} from '../masters/dashboard';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <AppExams />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppUsers />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppStudents />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
