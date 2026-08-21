import { useLiveQuery } from 'dexie-react-hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { db } from '../services/db';

function getHealthColor(status: string) {
  switch (status.toLowerCase()) {
    case 'healthy':
      return 'success';
    case 'warning':
      return 'warning';
    default:
      return 'error';
  }
}

export default function SystemHealthWidget() {
  const systems = useLiveQuery(() => db.systemHealth.orderBy('component').toArray(), []);

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">System Health</Typography>
      {systems === undefined ? (
        <Typography color="text.secondary">Loading system health...</Typography>
      ) : systems.length === 0 ? (
        <Typography color="text.secondary" sx={{ pt: 1 }}>
          No system-health records have been stored locally.
        </Typography>
      ) : (
        <List>
          {systems.map((system) => (
            <ListItem key={system.id}>
              <ListItemText primary={system.component} secondary={`Uptime: ${system.uptime}%`} />
              <Chip
                label={system.status}
                color={getHealthColor(system.status)}
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
