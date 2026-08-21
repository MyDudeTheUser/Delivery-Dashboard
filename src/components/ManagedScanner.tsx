import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { db } from '../services/db';

const schedules = [
  { value: 'weekdays-0900', label: 'Weekdays at 9:00 AM' },
  { value: 'daily-0900', label: 'Daily at 9:00 AM' },
  { value: 'weekly-mon-0900', label: 'Every Monday at 9:00 AM' },
];

export default function ManagedScanner() {
  const profiles = useLiveQuery(() => db.scannerProfiles.toArray(), []);
  const plan = profiles?.find((profile) => profile.mode === 'Managed');
  const [schedule, setSchedule] = useState('weekdays-0900');
  const [scanMail, setScanMail] = useState(true);
  const [scanTeams, setScanTeams] = useState(true);
  const [scanSharePoint, setScanSharePoint] = useState(true);
  const [notice, setNotice] = useState<string | undefined>();

  const savePlan = async () => {
    const resources = [
      ...(scanMail ? ['Email' as const] : []),
      ...(scanTeams ? ['Teams' as const] : []),
      ...(scanSharePoint ? ['SharePoint' as const] : []),
    ];

    if (resources.length === 0) {
      setNotice('Select at least one enterprise resource for the managed scan plan.');
      return;
    }

    const profile = {
      name: 'Microsoft 365 Managed Scan Plan',
      type: 'Microsoft365' as const,
      mode: 'Managed' as const,
      resources,
      schedule,
      enabled: false,
      config: {
        status:
          'Blocked pending Microsoft Entra application registration and secure backend deployment.',
        authorization:
          'Application permissions with least-privilege resource assignments required.',
      },
    };

    if (plan?.id) {
      await db.scannerProfiles.update(plan.id, profile);
    } else {
      await db.scannerProfiles.add(profile);
    }

    setNotice(
      'Managed scan plan saved. It remains disabled until a secure backend and Entra authorization are configured.',
    );
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Managed Scheduled Scanning
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Define the resource scope and schedule for a future background scanner. This browser-only
          dashboard intentionally does not store client secrets or execute unattended scans.
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Managed scans are disabled until a secure backend is deployed and a Microsoft Entra
          administrator authorizes the required application permissions.
        </Alert>
        <Stack spacing={2} sx={{ maxWidth: 500 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="managed-schedule-label">Planned schedule</InputLabel>
            <Select
              labelId="managed-schedule-label"
              label="Planned schedule"
              value={schedule}
              onChange={(event) => setSchedule(event.target.value)}
            >
              {schedules.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={scanMail}
                  onChange={(event) => setScanMail(event.target.checked)}
                />
              }
              label="Exchange Email"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={scanTeams}
                  onChange={(event) => setScanTeams(event.target.checked)}
                />
              }
              label="Teams Messages"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={scanSharePoint}
                  onChange={(event) => setScanSharePoint(event.target.checked)}
                />
              }
              label="SharePoint and OneDrive"
            />
          </FormGroup>
          <Box>
            <Button variant="outlined" startIcon={<ScheduleIcon />} onClick={savePlan}>
              Save Managed Scan Plan
            </Button>
          </Box>
          {plan && (
            <Typography variant="body2" color="text.secondary">
              A disabled plan is stored locally for: {plan.resources.join(', ')}.
            </Typography>
          )}
          {notice && (
            <Alert severity={notice.includes('Select') ? 'error' : 'info'}>{notice}</Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
