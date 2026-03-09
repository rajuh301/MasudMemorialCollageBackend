import app from "./app";
import config from "./config";

app.listen(config.port, () => {
  console.log("Server running on port", config.port);
});

if (process.env.NODE_ENV !== "vercel") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}