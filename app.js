const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: 'YOUR_OPENAI_API_KEY',
});
const openai = new OpenAIApi(configuration);

const app = express();

app.use(cors()); // This will enable all CORS requests
app.use(express.json());

app.post('/analyze_proposal', async (req, res) => {
    const proposal = req.body.text;

    // identify instrument types from proposal. return as json
    const instrumentTypeResponse = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            "role": "system",
            "content": "You will be provided with a student's science project proposal. Identify the types of sensors and meansurements that might be relevant:\n- Velocity and Acceleration\n- Force and Motion\n- Material Testing: Stress, Strain, Hardness and Fatigue\n- Gas and Liquid\n- Physiological\n- Radiation, Sound, and Electrical\n- Temperature\n\nProvide your output in json format with the key \"relevant_measurement_types\"."
          },
          {
            "role": "user",
            "content": proposal,
          },
        ],
        temperature: 1,
        max_tokens: 1000,
    });
    const instrumentTypes = JSON.parse(instrumentTypeResponse.data.choices[0].message.content).relevant_measurement_types;
    
    // read in instrument types from sensors.json
    const instrumentDocs = require('./sensors.json');
    let allRelevantDocsText = '# Sensors\n\n';
    for (const instrumentType of instrumentTypes) {
        allRelevantDocsText += '# ' + instrumentType + '\n' + instrumentDocs[instrumentType] + '\n\n';
    }

    // given relevant instrument docs and proposal, get advice
    const suggestionResponse = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            "role": "system",
            "content": "You will be presented with some tables about sensors in our equipment library, and a student's science project proposal. Your task is to provide suggestions on which sensors the student might wish to use to make measurements. "
          },
          {
            "role": "user",
            "content": allRelevantDocsText,
          },
          {
            "role": "user",
            "content": "Hi! I'm a student and here's my proposal.\n\n" + proposal + "\n\nWhat kind of intruments do you think I'll need to make measurements?\n\n",
          }
        ],
        temperature: 1,
        max_tokens: 2000,
      });
    const suggestions = suggestionResponse.data.choices[0].message.content;

    // return suggestion
    res.status(200).json({ suggestions });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
