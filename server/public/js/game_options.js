// Extract chapterId from the URL
const urlParams = new URLSearchParams(window.location.search);
const chapterId = urlParams.get('chapter_id');

function selectGame(gameType) {
    switch (gameType) {
        case 'fill_in_blanks':
            window.location.href = `/fill_in_blanks?chapter_id=${chapterId}`;
            break;
        case 'quiz':
            window.location.href = `/quiz?chapter_id=${chapterId}`;
            break;
        case 'game3':
        case 'game4':
            alert('This game is under development and is not yet active.');
            break;
    }
}
