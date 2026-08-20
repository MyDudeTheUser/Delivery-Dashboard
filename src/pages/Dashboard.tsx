import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SystemHealthWidget from '../components/SystemHealthWidget';
import AlertsWidget from '../components/AlertsWidget';
import ReleasesWidget from '../components/ReleasesWidget';
import SprintStatusWidget from '../components/SprintStatusWidget';
import EnterpriseMetricsWidget from '../components/EnterpriseMetricsWidget';

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Delivery Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SystemHealthWidget />
        </Grid>
        <Grid item xs={12} md={6}>
          <AlertsWidget />
        </Grid>
        <Grid item xs={12} md={6}>
          <ReleasesWidget />
        </Grid>
        <Grid item xs={12} md={6}>
          <SprintStatusWidget />
        </Grid>
        <Grid item xs={12}>
          <EnterpriseMetricsWidget />
        </Grid>
      </Grid>
    </Box>
  );
}
