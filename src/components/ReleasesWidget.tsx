import { useQuery } from '@tanstack/react-query';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fetchReleases } from '../services/api';

import { type Release } from '../services/db';

export default function ReleasesWidget() {
  const { data, isLoading, isError } = useQuery<Release[]>({
    queryKey: ['releases'],
    queryFn: fetchReleases,
  });

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Release Calendar</Typography>
      {isLoading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : isError ? (
        <Typography color="error">Failed to load releases.</Typography>
      ) : (
        <List>
          {data?.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.version}
                secondary={`${item.date} - ${item.status}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
