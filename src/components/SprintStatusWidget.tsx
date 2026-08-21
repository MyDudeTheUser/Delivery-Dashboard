import { useLiveQuery } from 'dexie-react-hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { db } from '../services/db';

export default function SprintStatusWidget() {
  const sprints = useLiveQuery(() => db.sprintStatus.orderBy('sprintName').toArray(), []);

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Sprint Status</Typography>
      {sprints === undefined ? (
        <Typography color="text.secondary">Loading sprint status...</Typography>
      ) : sprints.length === 0 ? (
        <Typography color="text.secondary" sx={{ pt: 1 }}>
          No sprint-status records have been stored locally.
        </Typography>
      ) : (
        <List>
          {sprints.map((sprint) => (
            <ListItem key={sprint.id} alignItems="flex-start">
              <ListItemText
                primary={sprint.sprintName}
                secondary={`${sprint.completedStoryPoints}/${sprint.totalStoryPoints} story points completed`}
              />
              <Box sx={{ minWidth: 100, ml: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={sprint.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {sprint.progress}%
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
