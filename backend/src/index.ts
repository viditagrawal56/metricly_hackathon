import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket from 'ws';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());


type ConnectionsMap = Map<string, WebSocket>;

const connections: ConnectionsMap = new Map();

// WebSocket connection handling
wss.on('connection', (ws: WebSocket) => {
    const requestId = Math.random().toString(36).substring(7);
    connections.set(requestId, ws);

    ws.on('close', () => {
        connections.delete(requestId);
    });

    ws.send(JSON.stringify({ type: 'requestId', requestId }));
});



app.post('/chat', async (req: Request, res: Response) => {
    const { input_value, requestId } = req.body as { input_value: string; requestId: string };
    const ws = connections.get(requestId);

    if (!ws) {
         res.status(400).json({ error: 'WebSocket connection not found' });
    }

    try {
        const response = await axios.post(
            'https://api.langflow.astra.datastax.com/lf/633dd972-5a0d-4103-b859-d603eeb3a05b/api/v1/run/357770da-954a-41cf-80c1-11503e4f30c0?stream=false',
            {
                input_value,
                output_type: 'chat',
                input_type: 'chat',
                tweaks: {
                    "ChatInput-qktNq": {},
                    "ParseData-r3qgx": {},
                    "Prompt-7eGC6": {},
                    "SplitText-ZoxGG": {},
                    "ChatOutput-xYygs": {},
                    "AstraDB-t3GoE": {},
                    "File-Jb0q5": {},
                    "NVIDIAEmbeddingsComponent-S5Ub0": {},
                    "NVIDIAEmbeddingsComponent-wcs5F": {},
                    "GroqModel-wLwcp": {},
                    "AstraDB-pOwex": {}

                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.APPLICATION_TOKEN}`
                }
            }
        );

        const message = response.data.outputs[0]?.outputs[0]?.results?.message?.text;
        if (message) {
            if(ws){
                            ws.send(JSON.stringify({ type: 'response', message }));
                            console.log(message)
                            res.json({
                                message : message,
                                status : "processing"
                            })
          
            }

        } else {
            throw new Error('No message found in response');
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if(ws){
                    ws.send(JSON.stringify({ type: 'error', message: errorMessage }));
        res.status(500).json({ error: errorMessage });
        }

    }
});

// Server initialization
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
