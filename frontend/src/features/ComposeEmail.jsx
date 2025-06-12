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
  const [sendEmailError, setSendEmailError] = useState(null);

  const handleStreamGeneratedEmail = async () => {
    if (!genMsgInput) return;

    setLoading(true);
    setError(null);
    setSubject("");
    setBody("");

    // First..... generate subject and get template ID
    const subjectSource = new EventSource(
      "/api/assistant/subject?message=" + encodeURIComponent(genMsgInput)
    );

    let tempId = null;

    subjectSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.content) {
          setSubject((prev) => prev + data.content);
        }

        if (data.promptId) {
          tempId = data.promptId;
        }
      } catch (err) {
        console.error("Subject stream error:", err);
        setError("Error generating subject");
      }
    };

    subjectSource.onerror = () => {
      subjectSource.close();

      if (!tempId) {
        setLoading(false);
        return setError("No email ID returned from subject phase");
      }

      // Then..... stream the body using the returned ID
      const bodySource = new EventSource("/api/assistant/body?id=" + tempId);

      bodySource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.content) {
            setBody((prev) => prev + data.content);
          }
        } catch (err) {
          console.error("Body stream error:", err);
          setError("Error generating body");
        }
      };

      bodySource.onerror = () => {
        setLoading(false);
        bodySource.close();
      };
    };
  };

  const handleSendEmail = async () => {
    if (!subject?.length || !body?.length || !to?.length) return;

    const email = { subject, body, to };

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
      />
    </>
  );
};

export default ComposeEmail;
