require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({  
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Bloqueado por CORS"));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const CLIENT_ID = process.env.CLIENT_ID;

// Criar cliente OAuth
const client = new OAuth2Client(CLIENT_ID);

app.post("/auth/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ error: "Token não fornecido!" });
  }

  try {
    // Validar o ID Token do Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload(); // Dados do utilizador Google (email, nome, etc.)

    console.log("Login bem-sucedido:", payload);

    // Criar um cookie de sessão (ID Token)
    res.cookie("token", credential, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Apenas em HTTPS
      sameSite: "strict",
      maxAge: 3600000, // 1 hora
    });

    res.json({ success: true, user: payload });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Users data
app.get("/user", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erro ao obter dados do Google");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message || "Erro desconhecido" });
  }
});

// Session verification
app.get("/auth/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    res.json({ authenticated: true, user: payload });
  } catch (error) {
    res.status(401).json({ authenticated: false, error: "Invalid token" });
  }
});

app.listen(8000, () => console.log("Backend a correr em http://localhost:8000"));
