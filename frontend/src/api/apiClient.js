// Wrapper for API calls

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const get = (url) => fetch(`${BASE_URL}${url}`);

const post = (url, data) =>
  fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const apiClient = {
  get,
  post,
};
