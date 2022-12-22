const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;

const app = express();
const port = 3002;

const configuration = new Configuration({
  organization: "org-avY44frD4bX5D4oCBShR66Vl",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());

app.post("/", async (req, res) => {
  const { message } = req.body;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Please provide a list of the wrong spellings in the sentence, then provide a new instance of the sentence with the corrected spellings and punctuations.
    sentence: ${message}
    spelling check:`,
    max_tokens: 2048,
    temperature: 0.5,
  });
  console.log(response.data);
  if (response.data.choices) {
    res.json({
      message: response.data.choices[0].text,
    });
  }
});

app.post("/tense", async (req, res) => {
  const { message } = req.body;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Based on the overall context in the sentence, and judging with the first verbal word in the sentence, what tense is the sentence written in? Is there any word that contradicts the overall tense in the sentence? If yes, then provide a new instance of the correct sentence with the right words to fit the overall tense.
    sentence: ${message}
    spelling check:`,
    max_tokens: 2048,
    temperature: 0.5,
  });
  console.log(response.data);
  if (response.data.choices) {
    res.json({
      message: response.data.choices[0].text,
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
