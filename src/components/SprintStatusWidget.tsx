import { useQuery } from '@tanstack/react-query';
import { fetchSprintStatus } from '../services/api';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { type SprintStatus } from '../services/db';

export default function SprintStatusWidget() {
  const { data, isLoading, isError } = useQuery<SprintStatus[]>({
    queryKey: ['sprintStatus'],
    queryFn: fetchSprintStatus,
  });

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Sprint Status</Typography>
      {isLoading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : isError ? (
        <Typography color="error">Failed to load sprint status.</Typography>
      ) : (
        <List>
          {data?.map((item) => {
            const percent = item.progress;
            return (
              <ListItem key={item.id} alignItems="flex-start">
                <ListItemText
                  primary={item.sprintName}
                  secondary={`(${item.completedStoryPoints}/${item.totalStoryPoints} pts)`}
                />
                <Box sx={{ minWidth: 100, ml: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {percent}%
                  </Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}
