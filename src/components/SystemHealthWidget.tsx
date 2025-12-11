
import { useEffect, useState } from 'react';
import { fetchSystemHealth } from '../services/api';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

type SystemHealth = {
  system: string;
  cpu: number;
  memory: number;
  status: string;
};

export default function SystemHealthWidget() {
  const [data, setData] = useState<SystemHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">System Health</Typography>
      {loading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : (
        <List>
          {data.map((item) => (
            <ListItem key={item.system}>
              <ListItemText
                primary={item.system}
                secondary={`CPU: ${item.cpu}% | Memory: ${item.memory}%`}
              />
              <Chip
                label={item.status}
                color={
                  item.status === 'ok'
                    ? 'success'
                    : item.status === 'warning'
                    ? 'warning'
                    : 'error'
                }
                size="small"
                sx={{ ml: 2 }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
