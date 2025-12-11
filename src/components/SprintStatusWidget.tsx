
import { useEffect, useState } from 'react';
import { fetchSprintStatus } from '../services/api';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

type Sprint = {
  sprint: string;
  status: string;
  completed: number;
  total: number;
};

export default function SprintStatusWidget() {
  const [data, setData] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSprintStatus().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Sprint Status</Typography>
      {loading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : (
        <List>
          {data.map((item, idx) => {
            const percent = Math.round((item.completed / item.total) * 100);
            return (
              <ListItem key={idx} alignItems="flex-start">
                <ListItemText
                  primary={item.sprint}
                  secondary={`${item.status} (${item.completed}/${item.total} pts)`}
                />
                <Box sx={{ minWidth: 100, ml: 2 }}>
                  <LinearProgress variant="determinate" value={percent} sx={{ height: 8, borderRadius: 4 }} />
                  <Typography variant="caption" color="text.secondary">{percent}%</Typography>
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
}
