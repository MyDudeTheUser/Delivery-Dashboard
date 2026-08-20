import { useQuery } from '@tanstack/react-query';
import { fetchIncidents } from '../services/api';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';

type Incident = {
  id: number;
  system: string;
  severity: string;
  message: string;
};

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    default:
      return 'info';
  }
}

function getSeverityIcon(severity: string) {
  switch (severity.toLowerCase()) {
    case 'high':
      return <ErrorIcon fontSize="small" color="error" sx={{ mr: 1 }} />;
    case 'medium':
      return <WarningIcon fontSize="small" color="warning" sx={{ mr: 1 }} />;
    default:
      return <InfoIcon fontSize="small" color="info" sx={{ mr: 1 }} />;
  }
}

export default function AlertsWidget() {
  const { data, isLoading, isError } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: fetchIncidents,
  });

  const [filter, setFilter] = useState<string>('All');

  const filteredData = data?.filter(
    (item) => filter === 'All' || item.severity.toLowerCase() === filter.toLowerCase(),
  );

  return (
    <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">Alerts & Events</Typography>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          aria-label="Filter alerts by severity"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </Select>
      </Box>
      {isLoading ? (
        <Typography color="text.secondary">Loading...</Typography>
      ) : isError ? (
        <Typography color="error">Failed to load alerts.</Typography>
      ) : (
        <List>
          {filteredData?.length === 0 ? (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              No alerts found for this severity.
            </Typography>
          ) : (
            filteredData?.map((item) => (
              <ListItem key={item.id}>
                {getSeverityIcon(item.severity)}
                <ListItemText
                  primary={`${item.system} (${item.severity})`}
                  secondary={item.message}
                />
                <Chip
                  label={item.severity}
                  color={getSeverityColor(item.severity)}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </ListItem>
            ))
          )}
        </List>
      )}
    </Paper>
  );
}
