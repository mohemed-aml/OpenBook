// marker1: 'file:///home/amal/Code/moneybag/trial/backend_api/index.html',

// // Add click event listeners to the markers
// const markers = document.querySelectorAll('.marker');

// markers.forEach(marker => {
//     marker.addEventListener('click', () => {
//         const markerId = marker.id;
//         const url = markerUrls[markerId];

//         if (url) {
//             // Open the URL in the same window
//             window.location.href = url;
//         } else {
//             alert(`Marker ${marker.textContent} does not have a URL.`);
//         }
//     });
// });



// Function to generate markers based on the specified count
function generateMarkers(count) {
    const roadmap = document.querySelector('.roadmap');
    roadmap.innerHTML = ''; // Clear existing markers

    for (let i = 1; i <= count; i++) {
        const marker = document.createElement('div');
        marker.classList.add('marker');
        marker.textContent = `Ch.${i}`;
        marker.id = `marker${i}`;
        roadmap.appendChild(marker);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/get-random-number') // Replace with your API endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const resultElement = document.getElementById('result');
            resultElement.textContent = `Random Number: ${data.number}`;
            generateMarkers(data.number);
        })
        .catch(error => {
            const resultElement = document.getElementById('result');
            resultElement.textContent = `Error: ${error.message}`;
        });
});


// // Add click event listener to the "Generate Markers" button
// const generateMarkersButton = document.getElementById('generateMarkers');
// generateMarkersButton.addEventListener('click', () => {
//     const markerCountInput = document.getElementById('markerCount');
//     const count = parseInt(markerCountInput.value);

//     if (!isNaN(count) && count >= 1) {
//         generateMarkers(count);
//     } else {
//         alert('Please enter a valid number of markers (greater than or equal to 1).');
//     }
// });

// Add click event listeners to the markers (including dynamically generated ones)
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('marker')) {
        const markerId = event.target.id;
        // const url = markerUrls[markerId];
        const url = 'file:///home/amal/Code/moneybag/trial/backend_api/index.html';

        if (url) {
            // Open the URL in the same window
            window.location.href = url;
        } else {
            alert(`Marker ${event.target.textContent} does not have a URL.`);
        }
    }
});

// Define URLs for each marker
const markerUrls = {};

// Initial generation of markers
generateMarkers(3); // Default to 3 markers
