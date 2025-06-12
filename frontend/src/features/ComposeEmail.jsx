"use client";

import { useState } from "react";
import NewMessage from "@/components/NewMessage";

const ComposeEmail = ({ onClose, setOpenSnackbar }) => {
  const [genMsgInput, setGenMsgInput] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [sendEmailError, setSendEmailError] = useState(null);

  const handleStreamGeneratedEmail = async () => {
    if (!genMsgInput) return;

    setLoading(true);
    setError(null);
    setSubject("");
    setBody("");

    // First..... generate subject and get template ID
    const assistantSource = new EventSource(
      "/api/assistant/?message=" + encodeURIComponent(genMsgInput)
    );

    assistantSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.content) {
          if (data.type === "subject") {
            setSubject((prev) => prev + data.content);
          }
          if (data.type === "body") {
            setBody((prev) => prev + data.content);
          }
        }
      } catch (err) {
        setError("Error generating from AI assistant");
      }
    };

    assistantSource.onerror = () => {
      assistantSource.close();
      setLoading(false);
    };
  };

  const handleSendEmail = async () => {
    if (!subject?.length || !body?.length || !to?.length) return;

    const email = { subject, body, to, cc, bcc };

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (data.success) {
        // Show success message
        setOpenSnackbar(true);
        onClose();
      } else {
        setSendEmailError(data.message);
      }
    } catch (err) {
      setSendEmailError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NewMessage
        genMsgInput={genMsgInput}
        setGenMsgInput={setGenMsgInput}
        subject={subject}
        setSubject={setSubject}
        body={body}
        setBody={setBody}
        handleGenerateMessage={handleStreamGeneratedEmail}
        loading={loading}
        error={error}
        onClose={onClose}
        handleSendEmail={handleSendEmail}
        sendEmailError={sendEmailError}
        to={to}
        setTo={setTo}
        cc={cc}
        setCc={setCc}
        bcc={bcc}
        setBcc={setBcc}
      />
    </>
  );
};

export default ComposeEmail;
