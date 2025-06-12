"use client";

import React, { useState, useEffect } from "react";
import EmailList from "@/components/emailList";
import { Box, CircularProgress } from "@mui/material";

const EmailListPage = ({ setSelectedEmail, selectedEmail }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/emails", {
        method: "GET",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {messages?.length ? (
        <EmailList
          emails={messages}
          selectedEmail={selectedEmail}
          setSelectedEmail={setSelectedEmail}
        />
      ) : (
        <div>No messages</div>
      )}
    </Box>
  );
};

export default EmailListPage;
