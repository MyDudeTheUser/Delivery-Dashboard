import { useQuery } from '@tanstack/react-query';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { fetchEnterpriseMetrics } from '../services/api';

import { type EnterpriseMetrics } from '../services/db';

export default function EnterpriseMetricsWidget() {
  const { data, isLoading, isError } = useQuery<EnterpriseMetrics[]>({
    queryKey: ['enterpriseMetrics'],
    queryFn: fetchEnterpriseMetrics,
  });

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Enterprise Metrics</Typography>
      {isLoading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : isError ? (
        <Typography color="error">Failed to load enterprise metrics.</Typography>
      ) : (
        <Box>
          {data && data.length > 0 && (
            <>
              <Typography variant="body1">
                Deployments: <b>{data[0].deployments}</b>
              </Typography>
              <Typography variant="body1">
                Incidents Resolved: <b>{data[0].incidentsResolved}</b>
              </Typography>
              <Typography variant="body1">
                Avg Uptime: <b>{data[0].avgUptime}%</b>
              </Typography>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
}
