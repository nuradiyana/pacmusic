var currentSongIndex = 0;
var musicItems = document.querySelectorAll('.music-item');

function playAudio(url, element) {
    var player = document.getElementById('audio-player');
    player.src = url;
    player.play();
    currentSongIndex = Array.from(musicItems).indexOf(element);
    updateNowPlaying();
}

function previousSong() {
    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = musicItems.length - 1; // Loop back to the last song if at the beginning
    }
    var musicItem = musicItems[currentSongIndex];
    playAudio(musicItem.getAttribute('data-url'), musicItem);
}

function nextSong() {
    if (currentSongIndex < musicItems.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0; // Loop back to the first song if at the end
    }
    var musicItem = musicItems[currentSongIndex];
    playAudio(musicItem.getAttribute('data-url'), musicItem);
}

function updateNowPlaying() {
    var nowPlaying = document.getElementById('now-playing');
    nowPlaying.textContent = "Now playing: " + musicItems[currentSongIndex].querySelector('.music-title').textContent;
}

function togglePlayPause() {
    var audioPlayer = document.getElementById('audio-player');
    if (audioPlayer.paused) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}