import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { truncateText, formatDate } from "../../shared/utils";

const EachEmail = ({ email, selectedEmail, setSelectedEmail }) => {
  return (
    <>
      <ListItem
        alignItems="flex-start"
        onClick={() => setSelectedEmail(email)}
        sx={{ cursor: "pointer" }}
        selected={selectedEmail?.id === email.id}
      >
        <ListItemAvatar>
          <Avatar>{email.to?.charAt(0).toUpperCase()}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" fontWeight="bold">
                {truncateText(email.to, 20) || "No recipient"}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                {formatDate(email.created_at)}
              </Typography>
            </Box>
          }
          secondary={
            <div>
              <div>
                <Typography variant="body1">
                  {truncateText(email.subject, 50) || "No subject"}
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="text.secondary">
                  {truncateText(email.body, 70) || "No body"}
                </Typography>
              </div>
            </div>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
};

export default EachEmail;
