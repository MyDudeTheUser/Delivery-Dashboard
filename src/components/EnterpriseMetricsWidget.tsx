import { useLiveQuery } from 'dexie-react-hooks';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { db } from '../services/db';

export default function EnterpriseMetricsWidget() {
  const metrics = useLiveQuery(() => db.enterpriseMetrics.toArray(), []);
  const latestMetrics = metrics?.[0];

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Enterprise Metrics</Typography>
      {metrics === undefined ? (
        <Typography color="text.secondary">Loading enterprise metrics...</Typography>
      ) : latestMetrics === undefined ? (
        <Typography color="text.secondary" sx={{ pt: 1 }}>
          No enterprise metrics have been stored locally.
        </Typography>
      ) : (
        <Box sx={{ pt: 1 }}>
          <Typography variant="body1">
            Deployments: <b>{latestMetrics.deployments}</b>
          </Typography>
          <Typography variant="body1">
            Incidents Resolved: <b>{latestMetrics.incidentsResolved}</b>
          </Typography>
          <Typography variant="body1">
            Avg Uptime: <b>{latestMetrics.avgUptime}%</b>
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
