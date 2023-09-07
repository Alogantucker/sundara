require('dotenv').config();

const apiKey = process.env.Google_API_KEY;
const clientID = process.env.Google_CLIENT_ID;
const spreadsheetID = process.env.Google_Sundara_Email_List_SPREADSHEET_ID;


const form = document.querySelector('#newsletter-form');
const emailInput = document.querySelector('#email-input');

// Initialize the Google Sheets API
gapi.load('client', init);

async function init() {
    try {
        await gapi.client.init({
            apiKey: `${apiKey}`, // Your Google API key
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
            clientId: `${clientID}`, // Your Google API client ID
            scope: 'https://www.googleapis.com/auth/spreadsheets',
        });
    } catch (error) {
        console.error('Google API initialization error:', error);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value;

    try {
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: `${spreadsheetID}`, // Replace with your Google Sheet ID
            range: 'A:A', // Specify the entire A column
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            values: [[email]],
        });

        if (response.status === 200) {
            // Success, hide the form and show the "Thank you" message
            form.style.display = 'none'; // Hide the form
            document.querySelector('.thank-you-message').style.display = 'block'; // Show the "Thank you" message
            console.log('Email added to Google Sheet successfully');
        } else {
            // Handle error
            console.error('Error adding email to Google Sheet:', response.statusText);
        }
        if (response.result.error) {
            // Handle error
            console.error('Error adding email to Google Sheet:', response.result.error.message);
        }
    } catch (error) {
        console.error('Google Sheets API request error:', error);
    }
});
