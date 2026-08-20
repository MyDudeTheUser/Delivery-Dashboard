
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

type Release = {
  name: string;
  date: string;
  systems: string[];
};

// Mock data for releases
const mockReleases: Release[] = [
  { name: 'Release 1.0', date: '2025-12-15', systems: ['App1', 'App2'] },
  { name: 'Release 1.1', date: '2026-01-10', systems: ['App3'] },
];

export default function ReleasesWidget() {
  const [data, setData] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with fetchReleases() when available
    setTimeout(() => {
      setData(mockReleases);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Release Calendar</Typography>
      {loading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : (
        <List>
          {data.map((item, idx) => (
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
