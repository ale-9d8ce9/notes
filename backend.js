async function fetchData(url) {
    try {
        const response = await fetch(url); // Send a GET request to the URL
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text(); // Get the response as a string
        console.log(data); // Log the response
        return data; // Return the response as a string
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Return null in case of an error
    }
}
