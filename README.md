Hi. This is a sample webapp that uses GPT-4, sensor documentation and the student's project proposal to suggest which sensors to use.

# Architecture

**index.html** and **script.js**: Take the project proposal text and send it to **app.js**, the Node.js backend for processing.

**app.js**: Node.js server. On receiving proposal text:
1. Determines which types of sensors (Acceleration, Force and Motion, ...) are involved. The total doc is too long for 8k tokens, so we decide first which parts to include. Uses GPT-4 to do so.
2. Tells GPT-4 "here's the documentation, here's the proposal, which sensors do you think the student will need"?
3. Returns result to **script.js**.

**script.js**: Renders GPT-4's suggestions.

# How to use

To test-drive the app, fill in `YOUR_OPENAI_API_KEY` in `app.js`, run `npm install` and `node app.js` in this folder, and open `index.html` in your browser. 

You might wish to check the Developer Console and Terminal for potential error messages in case something goes wrong.

To deploy the app, you'll need to host `app.js` somewhere that supports Node.js apps. The request to OpenAI models has to happen server-side because otherwise the user can see the API key client side.

Since GPT-4 costs $0.03/1k tokens, and each request sends the full sensor documentation with it (easily overloading the 8k token limit), the costs should run at around $0.25/request.

To customize the sensor types and documentation, edit `sensors.json`. To change the prompts, edit `app.js`. To change the location of the Node.js serveer, edit `scripts.js`.
