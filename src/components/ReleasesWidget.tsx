import { useLiveQuery } from 'dexie-react-hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { db } from '../services/db';

export default function ReleasesWidget() {
  const releases = useLiveQuery(() => db.releases.orderBy('date').toArray(), []);

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Release Calendar</Typography>
      {releases === undefined ? (
        <Typography color="text.secondary">Loading releases...</Typography>
      ) : releases.length === 0 ? (
        <Typography color="text.secondary" sx={{ pt: 1 }}>
          No release records have been stored locally.
        </Typography>
      ) : (
        <List>
          {releases.map((release) => (
            <ListItem key={release.id}>
              <ListItemText
                primary={release.version}
                secondary={`${release.date} — ${release.status}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
