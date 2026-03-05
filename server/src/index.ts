import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRoutes from './routes/auth'
import postsRoutes from './routes/posts'

const app = express()
const PORT = process.env.PORT || 3000

// Befintligt middleware som vi använder globalt (för varje request som kommer in så körs denna middleware)
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
}),);


// // Custom middleware 
// const myMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   console.log("Hi from middleware!! ");
//   next();
// }


// // Routes
// app.get("/hello", myMiddleware, (req, res) => {
//   res.send("hello");
// })

// app.post("/hello", (req, res) => {
//   res.json({"message": "hello from post"});
// })

// API-endpoints

// ┌────────┬──────────────┬──────────────────────┬──────────────────────┐
// │ Metod  │    Route     │         Auth         │     Beskrivning      │
// ├────────┼──────────────┼──────────────────────┼──────────────────────┤
// │ POST   │ /auth/signup │ —                    │ Registrera användare, få JWT │
// ├────────┼──────────────┼──────────────────────┼──────────────────────┤
// │ POST   │ /auth/signin │ —                    │ Logga in, få JWT     │
// ├────────┼──────────────┼──────────────────────┼──────────────────────┤
// │ GET    │ /posts       │ —                    │ Se alla inlägg       │
// ├────────┼──────────────┼──────────────────────┼──────────────────────┤
// │ POST   │ /posts       │ JWT token            │ Skapa inlägg         │
// ├────────┼──────────────┼──────────────────────┼──────────────────────┤
// │ PUT    │ /posts/:id   │ JWT token            │ Redigera eget inlägg │
// ├────────┼──────────────┼──────────────────────┼──────────────────────┤
// │ DELETE │ /posts/:id   │ JWT token            │ Ta bort eget inlägg  │
// └────────┴──────────────┴──────────────────────┴──────────────────────┘

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`)
})
