import { useQuery } from '@tanstack/react-query';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fetchReleases } from '../services/api';

type Release = {
  name: string;
  date: string;
  systems: string[];
};

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
          {data?.map((item, idx) => (
            <ListItem key={idx}>
              <ListItemText
                primary={item.name}
                secondary={`${item.date} (${item.systems.join(', ')})`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
