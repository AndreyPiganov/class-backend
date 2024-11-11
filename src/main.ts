import express from 'express';
import lessonRoutes from './routes/lesson.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/lesson', lessonRoutes);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
