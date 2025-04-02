export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
  
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      console.error("API error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  