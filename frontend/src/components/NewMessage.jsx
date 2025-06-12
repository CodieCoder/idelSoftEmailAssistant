import {
  Box,
  TextField,
  Stack,
  Typography,
  IconButton,
  Divider,
  Button,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SendIcon from "@mui/icons-material/Send";

const NewMessage = ({
  genMsgInput,
  setGenMsgInput,
  subject,
  setSubject,
  body,
  setBody,
  handleGenerateMessage,
  loading,
  error,
  onClose,
  handleSendEmail,
  sendEmailError,
  to,
  setTo,
  cc,
  setCc,
  bcc,
  setBcc,
}) => {
  return (
    <Box
      sx={{
        paddingLeft: 2,
        paddingRight: 2,
        width: "35rem",
        height: "47rem",
        position: "absolute",
        border: "1px solid #ccc",
        backgroundColor: "white",
        bottom: 10,
        right: 10,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">New Message</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <Grid container sx={{ mt: 1, alignItems: "start" }}>
        <Grid item xs={10}>
          <TextField
            id="gen-msg-input"
            label="Generate message with AI"
            placeholder="Enter what your message is about"
            helperText="Example: Send a thank you email to John Doe for his help."
            size="small"
            value={genMsgInput}
            onChange={(e) => setGenMsgInput(e.target.value)}
            maxRows={1}
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={2} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: "2rem" }}
            endIcon={<AutoAwesomeIcon />}
            onClick={handleGenerateMessage}
            disabled={!genMsgInput?.length || loading}
          >
            AI
          </Button>
        </Grid>
      </Grid>
      {error ? (
        <Typography color="error" variant="body2" mt={1}>
          {error}
        </Typography>
      ) : null}
      <Stack direction="column" spacing={4} mt={2}>
        <Box>
          <TextField
            label="To"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            size="small"
            placeholder="To"
            fullWidth
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            label="CC"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            size="small"
            placeholder="CC"
            fullWidth
            value={cc}
            onChange={(e) => setCc(e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            label="BCC"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            size="small"
            placeholder="BCC"
            fullWidth
            value={bcc}
            onChange={(e) => setBcc(e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            label="Subject"
            placeholder="Subject"
            InputLabelProps={{ shrink: true }}
            variant="standard"
            size="small"
            fullWidth
            value={subject}
            maxRows={1}
            multiline
            onChange={(e) => setSubject(e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            label="Body"
            variant="standard"
            InputLabelProps={{ shrink: true }}
            placeholder="Write your message here..."
            fullWidth
            rows={10}
            multiline
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Box>
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        {sendEmailError ? (
          <Typography color="error" variant="body2" mt={1}>
            {sendEmailError}
          </Typography>
        ) : (
          <div></div>
        )}
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<SendIcon />}
          onClick={handleSendEmail}
          disabled={!subject?.length || !body?.length || !to?.length || loading}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default NewMessage;
