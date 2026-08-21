import { useLiveQuery } from 'dexie-react-hooks';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CodeIcon from '@mui/icons-material/Code';
import { db } from '../services/db';

export default function ImportScanner() {
  const profiles = useLiveQuery(() => db.scannerProfiles.toArray(), []);
  const plan = profiles?.find((profile) => profile.mode === 'Import');

  const generateScript = async () => {
    const profile = {
      name: 'PowerShell Baseline Export',
      type: 'Microsoft365' as const,
      mode: 'Import' as const,
      resources: ['Email' as const, 'Teams' as const, 'SharePoint' as const],
      enabled: true,
      config: {
        scriptUrl: 'https://learn.microsoft.com/en-us/powershell/microsoftgraph/get-started',
      },
    };

    if (plan?.id) {
      await db.scannerProfiles.update(plan.id, profile);
    } else {
      await db.scannerProfiles.add(profile);
    }
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Export-and-Ingest Baseline
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The lightest and most secure way to ingest enterprise resources. Use official Microsoft
          Graph PowerShell scripts to export data locally on your own machine, then upload the
          resulting JSON payload below.
        </Typography>
        <Stack spacing={2} sx={{ maxWidth: 500 }}>
          <Box>
            <Button variant="outlined" startIcon={<CodeIcon />} onClick={generateScript}>
              Configure PowerShell Export
            </Button>
          </Box>
          {plan && (
            <Alert severity="info">
              Export configured. To run the baseline:
              <ol style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                <li>Open PowerShell on your local machine</li>
                <li>
                  Run <code>Connect-MgGraph -Scopes "Mail.Read, Chat.Read, Files.Read.All"</code>
                </li>
                <li>Export the data to JSON</li>
                <li>
                  Upload the JSON file using the <strong>Ingest signal</strong> form below
                </li>
              </ol>
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
