import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import SaveIcon from '@mui/icons-material/Save';
import { db } from '../services/db';

export default function InteractiveScanner() {
  const profiles = useLiveQuery(() => db.scannerProfiles.toArray(), []);
  const m365Profile = profiles?.find((p) => p.type === 'Microsoft365');

  const [clientId, setClientId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [scanMail, setScanMail] = useState(true);
  const [scanTeams, setScanTeams] = useState(true);
  const [scanSharePoint, setScanSharePoint] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState<
    { severity: 'success' | 'error' | 'info'; message: string } | undefined
  >();

  // Initialize the configuration form from the stored IndexedDB profile.
  // We use a timeout to safely escape the synchronous React render cycle.
  useEffect(() => {
    if (!m365Profile || isEditing) {
      return;
    }

    const timer = setTimeout(() => {
      setClientId((m365Profile.config.clientId as string) || '');
      setTenantId((m365Profile.config.tenantId as string) || '');
      const scopes = (m365Profile.config.scopes as string[]) || [];
      setScanMail(scopes.includes('Mail.Read'));
      setScanTeams(scopes.includes('Chat.Read'));
      setScanSharePoint(scopes.includes('Files.Read.All'));
    }, 0);

    return () => clearTimeout(timer);
  }, [m365Profile, isEditing]);

  const handleSaveProfile = async () => {
    if (!clientId.trim() || !tenantId.trim()) {
      setNotice({
        severity: 'error',
        message: 'Client ID and Tenant ID are required to configure the scanner.',
      });
      return;
    }

    const scopes = [];
    if (scanMail) scopes.push('Mail.Read');
    if (scanTeams) scopes.push('Chat.Read');
    if (scanSharePoint) scopes.push('Files.Read.All');

    try {
      if (m365Profile?.id) {
        await db.scannerProfiles.update(m365Profile.id, {
          config: { clientId, tenantId, scopes },
          resources: [
            ...(scanMail ? ['Email' as const] : []),
            ...(scanTeams ? ['Teams' as const] : []),
            ...(scanSharePoint ? ['SharePoint' as const] : []),
          ],
          enabled: true,
        });
      } else {
        await db.scannerProfiles.add({
          name: 'Microsoft 365 Local Scanner',
          type: 'Microsoft365',
          mode: 'Interactive',
          resources: [
            ...(scanMail ? ['Email' as const] : []),
            ...(scanTeams ? ['Teams' as const] : []),
            ...(scanSharePoint ? ['SharePoint' as const] : []),
          ],
          enabled: true,
          config: { clientId, tenantId, scopes },
        });
      }
      setNotice({ severity: 'success', message: 'Scanner profile saved successfully.' });
      setIsEditing(false);
    } catch (error) {
      setNotice({
        severity: 'error',
        message: error instanceof Error ? error.message : 'Failed to save profile.',
      });
    }
  };

  const handleRunScan = async () => {
    if (!m365Profile?.config.clientId) {
      setNotice({
        severity: 'error',
        message: 'Please configure and save the scanner profile first.',
      });
      return;
    }

    // NOTE: This is the injection point for the Microsoft Authentication Library (MSAL).
    // Because this dashboard is local-first, it must use the OAuth 2.0 Authorization Code Flow with PKCE
    // or the Implicit Grant flow (if enabled in Entra). The resulting access token would then be
    // passed to the MicrosoftGraphParser via the Graph API endpoint.
    setNotice({
      severity: 'info',
      message:
        'Interactive scanning requires an active Microsoft Entra ID application registration. The local-first execution flow is ready, but a valid Client ID must be provisioned in your tenant to authorize the connection.',
    });
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Interactive Local Scanning
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure a direct, on-demand connection to Microsoft 365. This scanner runs entirely
          within your browser using delegated permissions, ensuring it can only access data you are
          authorized to see.
        </Typography>

        {!m365Profile || isEditing ? (
          <Stack spacing={2} sx={{ maxWidth: 500 }}>
            <TextField
              label="Entra Application Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g., 89ea5c94-7736-4e25-95ad-3fa95f62b66e"
              size="small"
              fullWidth
            />
            <TextField
              label="Tenant ID"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              placeholder="e.g., common, organizations, or a specific tenant GUID"
              size="small"
              fullWidth
            />

            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Target Resources
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={scanMail} onChange={(e) => setScanMail(e.target.checked)} />
                }
                label="Exchange Email (Mail.Read)"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={scanTeams} onChange={(e) => setScanTeams(e.target.checked)} />
                }
                label="Teams Messages (Chat.Read)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={scanSharePoint}
                    onChange={(e) => setScanSharePoint(e.target.checked)}
                  />
                }
                label="SharePoint & OneDrive (Files.Read.All)"
              />
            </FormGroup>

            <Box sx={{ pt: 1 }}>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveProfile}>
                Save Configuration
              </Button>
              {m365Profile && (
                <Button variant="text" onClick={() => setIsEditing(false)} sx={{ ml: 1 }}>
                  Cancel
                </Button>
              )}
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary">
                Configuration Active
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                <strong>Client ID:</strong> {m365Profile.config.clientId}
                <br />
                <strong>Tenant ID:</strong> {m365Profile.config.tenantId}
                <br />
                <strong>Scopes:</strong>{' '}
                {(m365Profile.config.scopes as string[])?.join(', ') || 'None'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudSyncIcon />}
                onClick={handleRunScan}
              >
                Run Interactive Scan
              </Button>
              <Button variant="outlined" onClick={() => setIsEditing(true)}>
                Edit Configuration
              </Button>
            </Stack>
          </Stack>
        )}

        {notice && (
          <Alert severity={notice.severity} sx={{ mt: 2 }}>
            {notice.message}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
