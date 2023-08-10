// script.js
async function getSuggestions() {
    const proposalText = document.getElementById('proposalText').value;

    document.getElementById('suggestions-button').disabled = true;  // tells user it's loading
    document.getElementById("suggestions-button").innerHTML = "Processing...";
    const response = await fetch('http://localhost:3000/analyze_proposal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: proposalText }),
    });
    document.getElementById('suggestions-button').disabled = false;
    document.getElementById("suggestions-button").innerHTML = "Done";

    const data = await response.json();

    const converter = new showdown.Converter();
    const html = converter.makeHtml(data.suggestions);
    document.getElementById('suggestions').innerHTML = html;
}
