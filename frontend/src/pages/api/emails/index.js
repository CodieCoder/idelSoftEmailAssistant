import { apiClient } from "@/api/apiClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    try {
      const response = await apiClient.post("/emails", { email });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const response = await apiClient.get("/emails");
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
