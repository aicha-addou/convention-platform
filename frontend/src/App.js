import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("https://convention-platform.onrender.com") // ← à remplacer par ton URL Render
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Plateforme VIGIK</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;

