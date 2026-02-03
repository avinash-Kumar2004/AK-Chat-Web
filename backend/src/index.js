import dotenv from 'dotenv'
import express from 'express'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { ConnectDB } from './lib/db.js'
import path from "path";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app, server } from './lib/socket.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const __dirname = path.resolve()

app.use(express.json({ limit: "50mb" }))
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  
  app.get("/:path(*)", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../frontend", "dist", "index.html")
    );
  });
}


server.listen(PORT, () => {
  ConnectDB()
  console.log(`🚀 Server running on port ${PORT}`)
})
