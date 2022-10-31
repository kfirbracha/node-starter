import dotenv from 'dotenv';
import express from 'express';
import { resolve } from 'path';
import loader from './loaders/index';
dotenv.config({ path: resolve(__dirname, `../${process.env.NODE_ENV}.env`) });
const app = express();
const port = process.env.PORT;
loader(app);

// app.get('/', (req: express.Request, res: express.Response) => {
//     res.send(`EXPREESS TS ${port}`);
// });
//
app.listen(port, () => {
    console.log('APP IS ALIVE AND KICKING ON PORT ', port);
});
