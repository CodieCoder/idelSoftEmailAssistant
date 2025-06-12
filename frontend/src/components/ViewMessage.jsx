import React from "react";
import { Box, Typography, Container } from "@mui/material";

const ViewMessage = ({ email }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 0,
        m: 0,
        overflow: "auto",
        textOverflow: "ellipsis",
      }}
    >
      {email ? (
        <Box>
          <Typography variant="h6">{email.subject}</Typography>
          <Typography variant="body1">{email.body}</Typography>
        </Box>
      ) : (
        <Box>No message selected</Box>
      )}
    </Box>
  );
};

export default ViewMessage;
