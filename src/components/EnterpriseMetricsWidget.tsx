
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

// Mock data for enterprise metrics
const mockMetrics = [
  { label: 'Deployments', value: 12 },
  { label: 'Incidents', value: 3 },
  { label: 'Uptime (%)', value: 99.8 },
];

export default function EnterpriseMetricsWidget() {
  const [data, setData] = useState<typeof mockMetrics>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setData(mockMetrics);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Enterprise Metrics</Typography>
      {loading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : (
        <Box>
          {data.map((item, idx) => (
            <Typography key={idx} variant="body1">
              {item.label}: <b>{item.value}</b>
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
}
