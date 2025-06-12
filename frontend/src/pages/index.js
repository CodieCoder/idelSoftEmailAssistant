"use client";

import DesktopLayout from "@/components/DesktopLayout";
import EmailListPage from "@/features/EmailListPage";
import { sampleEmails } from "@/shared/api/mock/emails";
import { useState } from "react";
import ViewMessage from "@/components/ViewMessage";
import ComposeEmail from "@/features/ComposeEmail";
import AddIcon from "@mui/icons-material/Add";
import { Fab, Snackbar, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function Home() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showComposeEmail, setShowComposeEmail] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <>
      <DesktopLayout
        sideContent={
          <EmailListPage
            setSelectedEmail={setSelectedEmail}
            selectedEmail={selectedEmail}
          />
        }
        mainContent={<ViewMessage email={selectedEmail} />}
      />
      {showComposeEmail ? null : (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: "absolute", bottom: 10, right: 10 }}
          onClick={() => setShowComposeEmail(true)}
        >
          <AddIcon />
        </Fab>
      )}
      {showComposeEmail ? (
        <ComposeEmail
          onClose={() => setShowComposeEmail(false)}
          setOpenSnackbar={setOpenSnackbar}
        />
      ) : null}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={"Message sent successfully"}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
}
