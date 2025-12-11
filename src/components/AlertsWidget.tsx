
import { useEffect, useState } from 'react';
import { fetchIncidents } from '../services/api';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

type Incident = {
  id: number;
  system: string;
  severity: string;
  message: string;
};

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    default: return 'info';
  }
}

function getSeverityIcon(severity: string) {
  switch (severity.toLowerCase()) {
    case 'high': return <ErrorIcon fontSize="small" color="error" sx={{ mr: 1 }} />;
    case 'medium': return <WarningIcon fontSize="small" color="warning" sx={{ mr: 1 }} />;
    default: return <InfoIcon fontSize="small" color="info" sx={{ mr: 1 }} />;
  }
}

export default function AlertsWidget() {
  const [data, setData] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Typography variant="h6">Alerts & Events</Typography>
      {loading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : (
        <List>
          {data.map((item) => (
            <ListItem key={item.id}>
              {getSeverityIcon(item.severity)}
              <ListItemText
                primary={`${item.system} (${item.severity})`}
                secondary={item.message}
              />
              <Chip label={item.severity} color={getSeverityColor(item.severity)} size="small" sx={{ ml: 2 }} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}
