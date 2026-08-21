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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <button
          onClick={() => {
            throw new Error('Sentry Test Error: This is a controlled test exception.');
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Trigger Sentry Test Error
        </button>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SystemHealthWidget />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AlertsWidget />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ReleasesWidget />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SprintStatusWidget />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <EnterpriseMetricsWidget />
        </Grid>
      </Grid>
    </Box>
  );
}
