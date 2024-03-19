import { pipeline } from '@xenova/transformers';
import cors from 'cors';
import express, { response } from 'express';

// Initialisation de l'application Express
const app = express();
app.use(cors());
const port = 3000; // Port sur lequel le serveur écoutera*
const generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat');




// Configuration des routes
app.get('/', (req, res) => {
    let sent = async () => {

        const prompt = req.query.message
        const messages = [
            { "role": "system", "content": "Tu es un assistant." },
            { "role": "user", "content": prompt + "----" }
        ]

        // Apply chat template
        const text = generator.tokenizer.apply_chat_template(messages, {
            tokenize: false,
            add_generation_prompt: false,



        });

        // Generate text
        const output = await generator(text, {
            max_new_tokens: 3000,
            do_sample: false,
        });

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({
            response: (output[0].generated_text).split("----")[1],
        })
        console.log((output[0].generated_text).split("----")[1]);

        // [{'label': 'POSITIVE', 'score': 0.9998}]
    }

    sent()

});






app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});