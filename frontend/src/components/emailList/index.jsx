import React from "react";
import EachEmail from "./EachEmail";
import { List } from "@mui/material";

const EmailList = ({ emails, selectedEmail, setSelectedEmail }) => {
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {emails?.length ? (
        emails.map((email) => (
          <EachEmail
            key={email.id}
            email={email}
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
          />
        ))
      ) : (
        <div>No emails</div>
      )}
    </List>
  );
};

export default EmailList;
