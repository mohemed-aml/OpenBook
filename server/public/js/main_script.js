document.addEventListener('DOMContentLoaded', () => {
    const textbooksDiv = document.getElementById('textbooks');
    const roadmap = document.querySelector('.roadmap');

    // Fetch and display textbooks
    fetch('https://localhost:3000/textbook_data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! for fetch textbooks - Status: ${response.status}`);
            }
            return response.json();
        })
        .then(textbooks => {
            textbooks.forEach(textbook => {
                const div = document.createElement('div');
                div.className = 'textbook';
                div.textContent = textbook.textbook_title;
                div.addEventListener('click', () => fetchChapters(textbook.textbook_id));
                textbooksDiv.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Failed to fetch textbooks data:', error);
        });

    function fetchChapters(textbookId) {
        // Clear any previous chapters
        roadmap.innerHTML = '';

        fetch(`https://localhost:3000/chapters?textbook_id=${textbookId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! for fetch chapters - Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Assume data is an array of JSON objects with chapter_id and chapter_title
                data.forEach(chapter => {
                    // Create marker element
                    const marker = document.createElement('div');
                    marker.className = 'marker';
                    marker.textContent = `Ch.${chapter.chapter_id}`;

                    // Create tooltip for chapter title
                    const tooltip = document.createElement('div');
                    tooltip.className = 'marker-tooltip';
                    tooltip.textContent = chapter.chapter_title;
                    marker.appendChild(tooltip);

                    // Show tooltip on hover
                    marker.addEventListener('mouseenter', () => {
                        tooltip.style.display = 'block';
                        tooltip.style.left = (marker.clientWidth / 2 - tooltip.clientWidth / 2) + 'px';
                        tooltip.style.top = -(tooltip.clientHeight + 20) + 'px';
                    });
                    marker.addEventListener('mouseleave', () => {
                        tooltip.style.display = 'none';
                    });

                    // Redirect to URL with chapter_id on click
                    marker.addEventListener('click', () => {
                        window.location.href = `/game_options?chapter_id=${chapter.chapter_id}`;
                    });

                    // Append marker to container
                    roadmap.appendChild(marker);
                });
            })
            .catch(error => {
                console.error('Failed to fetch chapters data:', error);
            });
    }
});
