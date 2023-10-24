document.addEventListener('DOMContentLoaded', function() {
    const roadmap = document.querySelector('.roadmap');

    // This function will generate and populate markers using embedded chaptersData
    function generateMarkers() {
        // Clear existing markers
        roadmap.innerHTML = '';

        chaptersData.forEach(chapter => {
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

            // Redirect to URL with chapter_id on click (modify this as required)
            marker.addEventListener('click', () => {
                window.location.href = `/path/to/your/url/${chapter.chapter_id}`;
            });

            // Append marker to roadmap
            roadmap.appendChild(marker);
        });
    }

    // Generate and display markers using embedded data
    generateMarkers();
});
