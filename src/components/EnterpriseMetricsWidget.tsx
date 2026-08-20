import { useQuery } from '@tanstack/react-query';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { fetchEnterpriseMetrics } from '../services/api';

type Metric = {
  label: string;
  value: number;
};

export default function EnterpriseMetricsWidget() {
  const { data, isLoading, isError } = useQuery<Metric[]>({
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
          {data?.map((item, idx) => (
            <Typography key={idx} variant="body1">
              {item.label}: <b>{item.value}</b>
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
}
