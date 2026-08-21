import { useRef, useState, type ChangeEvent } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { db } from '../services/db';
import { ingestSignal, supportedSignalSources } from '../services/ingestion';

type Notice = {
  severity: 'success' | 'error' | 'info';
  message: string;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The signal could not be ingested.';
}

export default function Scans() {
  const scans = useLiveQuery(() => db.scanHistory.orderBy('timestamp').reverse().toArray(), []);
  const [sourceName, setSourceName] = useState('Manual upload');
  const [payloadText, setPayloadText] = useState('');
  const [notice, setNotice] = useState<Notice | undefined>();
  const [isIngesting, setIsIngesting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setPayloadText(await file.text());
      setSourceName(file.name);
      setNotice({
        severity: 'info',
        message:
          'JSON file loaded. Review the payload and select Ingest signal to save the findings locally.',
      });
    } catch (error) {
      setNotice({ severity: 'error', message: getErrorMessage(error) });
    } finally {
      event.target.value = '';
    }
  };

  const handleIngest = async () => {
    if (!payloadText.trim()) {
      setNotice({ severity: 'error', message: 'Paste or upload a JSON signal before ingestion.' });
      return;
    }

    let payload: unknown;
    try {
      payload = JSON.parse(payloadText);
    } catch {
      setNotice({ severity: 'error', message: 'The supplied signal is not valid JSON.' });
      return;
    }

    setIsIngesting(true);
    setNotice(undefined);
    try {
      const result = await ingestSignal(payload, sourceName);
      setNotice({
        severity: 'success',
        message: `${result.issuesFound} issue${result.issuesFound === 1 ? '' : 's'} ingested using the ${result.adapter} adapter.`,
      });
      setPayloadText('');
    } catch (error) {
      setNotice({ severity: 'error', message: getErrorMessage(error) });
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Scan Operations
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 780 }}>
        Ingest supported enterprise scan signals into this browser&apos;s local database. New
        findings immediately appear in the dashboard&apos;s Alerts &amp; Events widget and every
        ingestion is recorded below for auditability.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6" gutterBottom>
          Ingest signal
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Supported adapters: {supportedSignalSources.join(' and ')}. Signal payloads are stored
          only in this browser&apos;s IndexedDB database.
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Scan source label"
            value={sourceName}
            onChange={(event) => setSourceName(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 120 } }}
            fullWidth
          />
          <TextField
            label="Signal JSON"
            value={payloadText}
            onChange={(event) => setPayloadText(event.target.value)}
            placeholder={'Paste a supported JSON payload, for example: {"issues": []}'}
            multiline
            minRows={12}
            fullWidth
            slotProps={{ htmlInput: { 'aria-label': 'Signal JSON payload' } }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
            >
              Load JSON file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileSelected}
              hidden
            />
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleIngest}
              disabled={isIngesting}
            >
              {isIngesting ? 'Ingesting...' : 'Ingest signal'}
            </Button>
          </Stack>
          {notice && <Alert severity={notice.severity}>{notice.message}</Alert>}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }} elevation={3}>
        <Typography variant="h6">Scan history</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
          Each completed ingestion is recorded locally, including scans that found no issues.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {scans === undefined ? (
          <Typography color="text.secondary">Loading local scan history...</Typography>
        ) : scans.length === 0 ? (
          <Typography color="text.secondary">No scans have been ingested yet.</Typography>
        ) : (
          <TableContainer>
            <Table aria-label="Scan history">
              <TableHead>
                <TableRow>
                  <TableCell>Completed</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Issues found</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell>{new Date(scan.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{scan.source}</TableCell>
                    <TableCell align="right">{scan.issuesFound}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
