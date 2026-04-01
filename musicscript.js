/*

Skiby: JavaScript rewrite

Of course, during the rewrite, I also added the things I wanted in the music player
but never had enough motivation to vibecode. Some of the new features include:

** The ability to use skiby with or without an account!
Restore song on page load
Song metadata extraction on upload
Song normalization
(Hopefully) Less finnicky
And probably others...

*/
let parseBlob;
(async ()=>{parseBlob = (await import('https://cdn.jsdelivr.net/npm/music-metadata@11.0.0/+esm')).parseBlob})()

$=(id)=>document.getElementById(id)
// Const hell
const homePlaylistsCont = $('home-playlists-container')
const playlistsView = $('playlistSection')
const playlistList = $('playlistList')

const addPlaylistBtn = $('addPlaylistBtn');
const addPlaylistPopup = $('addPlaylistPopup')
const newPlaylistNameInput = $('newPlaylistName')
const confirmAddPlaylistBtn = $('confirmAddPlaylistBtn')

const playlistDetails = $('playlist-view')
const playlistDetailsName = $('playlist-name')
const playlistDetailsDescription = $('playlist-description');
const playlistDetailsCreatorName = $('playlist-creator');
const playlistDetailsCreatorPic =  $('playlist-creator-pfp');
const playlistDetailsLength = $('playlist-length');
const playlistDetailsCoverArt = $('playlist-cover-art');
const playlistDownloadToggle = $('playlistDownloadToggle');
const playlistThreeDotsBtn = $('playlist-view-three-dots-button')

const editSongModal = $('editSongModal')
const closeEditSongModalBtn = $('closeEditSongModal')
const editSongModalTitle = $('modalSongTitle')
const editSongModalArtist = $('modalSongArtist')
const editSongModalAlbum = $('modalSongAlbum')
const editSongModalID = $('modalSongID')
const editSongModalUnsaved = $('unsavedChangesSongModal')
const editSongModalRevertBtn = $('songModalRevertBtn')
const editSongModalSaveBtn = $('songModalSaveBtn')

const changeAlbumCoverBtn = $('changeAlbumCoverBtn')
const resetAlbumCoverBtn = $('resetAlbumCoverBtn')
const changeAlbumCoverInput = $('modalAlbumCoverFile')
const modalSongAlbumCover = $('modalSongAlbumCover')
const changeFullscreenBgBtn = $('changeFullscreenBgBtn')
const resetFullscreenBgBtn = $('resetFullscreenBgBtn')
const changeFullscreenBgInput = $('modalFullscreenBgFile')
const modalFullscreenBgImg = $('modalFullscreenBgImg')
const modalFullscreenBgVideo = $('modalFullscreenBgVideo')

const editPlaylistModal = $('editPlaylistModal')
const closeEditPlaylistModalBtn = $('closeEditPlaylistModal')
const editPlaylistModalTitle = $('modalPlaylistName')
const editPlaylistModalDescription = $('modalPlaylistDescription')
const editPlaylistModalID = $('modalPlaylistID')
const editPlaylistModalUnsaved = $('unsavedChangesPlaylistModal')
const editPlaylistModalRevertBtn = $('playlistModalRevertBtn')
const editPlaylistModalSaveBtn = $('playlistModalSaveBtn')

const changePlaylistCoverBtn = $('changePlaylistCoverBtn')
const resetPlaylistCoverBtn = $('resetPlaylistCoverBtn')
const changePlaylistCoverInput = $('modalPlaylistCoverFile')
const modalPlaylistCover = $('modalPlaylistPlaylistCover')

const albumArtSlider = $('albumArtSlider')
const playlistArtLarge1 = $('albumArtImg1')
const playlistArtLarge2 = $('albumArtImg2')

const fullscreenPlayer = $('fullscreenPlayer')
const closeFullscreenBtn = $('close-fullscreen-button');
const fullscreenAlbumCover = $('fullscreenAlbumCover');
const fullscreenSongTitle = $('fullscreenSongTitle');
const fullscreenSongArtist = $('fullscreenSongArtist');
const fullscreenPrevBtn = $('fullscreenPrevBtn');
const fullscreenPlayPauseBtn = $('fullscreenPlayPauseBtn');
const fullscreenNextBtn = $('fullscreenNextBtn');
const fullscreenShuffleBtn = $('fullscreenShuffleBtn');
const fullscreenRepeatBtn = $('fullscreenRepeatBtn');
const fullscreenVolumeSlider = $('fullscreenVolumeSlider');
const fullscreenProgressBar = $('fullscreenProgressBar');
const fullscreenCurrentTime = $('fullscreenCurrentTime');
const fullscreenTotalTime = $('fullscreenTotalTime');
const fullscreenShuffleIndicator = $('fullscreenShuffleIndicator');
const fullscreenRepeatIndicator = $('fullscreenRepeatIndicator');
const fullscreenPlayPauseBtnImg = $('fullscreenPlayPauseBtnImg');
const fullscreenBackground1 = $('fullscreenBg1');
const fullscreenBackground2 = $('fullscreenBg2');
const fullscreenBackgroundVideo = $('fullscreenVideo');

const audio = $('audio');
const playPauseBtn = $('playPauseBtn');
const prevBtn = $('prevBtn');
const nextBtn = $('nextBtn');
const shuffleBtn = $('shuffleBtn');
const shuffleIndicator = $('shuffleIndicator')
const repeatBtn = $('repeatBtn');
const repeatIndicator = $('repeatIndicator')
const volumeBtn = $('volumeBtn')
const volumeSlider = $('volumeSlider');
const fullscreenBtn = $('fullscreenToggleBtn')
const albumCover = $('albumCover');
const songTitle = $('songTitle');
const songArtist = $('songArtist');
const playPauseBtnImg = $('playPauseBtnImg')
const totalTimeSpan = $('totalTime')
const progressBar = $('progressBar')
const currentTimeSpan = $('currentTime')

const hamburgerBtn = $('hamburger-button-mmmmmyummy')
const homeBtn = $('homeMode')
const libraryBtn = $('onlineMode')

const sidebar = $('sidebar')
const sidbarOberlay = $('overlay')

const uploadArea = $('onlineUploadArea')
const songList = $('onlinePlaylist')

const upNextContainer = $('upNextContainer');
const upNextSongTitle = $('upNextSongTitle');
const upNextSongArtist = $('upNextSongArtist');
const upNextAlbumArt = $('upNextAlbumArt');

const contextMenu = $('customContextMenu');

const footer = document.querySelector('.footer');

const genericBackgroundImages = [
	'https://torok.ing/songplayer/image/img6.jpg',
	'https://torok.ing/songplayer/image/img12.jpg',
	'https://torok.ing/songplayer/image/img11.jpg',
	'https://torok.ing/songplayer/image/img10.jpg',
	'https://torok.ing/songplayer/image/img9.jpg',
	'https://torok.ing/songplayer/image/img8.jpg',
	'https://torok.ing/songplayer/image/img7.jpg',
];

let songs = JSON.parse(localStorage.getItem('songsCache')) || []
let playlists = JSON.parse(localStorage.getItem('playlistsCache')) || []
let songStatuses = JSON.parse(localStorage.getItem('songStatusesCache')) || {}
let songOwnership = JSON.parse(localStorage.getItem('songOwnershipCache')) || {}

let Prefrences = JSON.parse(localStorage.getItem('songplayerPrefrencesCache')) || {
    "alwaysGenericBg": false,
    "syncVideo": false,
    "autoUpload": true,
    "playlistDownloadToggles": {},
    "normalizeVolume": false,
    "miniplayer": true
}

let loggedIn = false;
let userid;

let currentlyPlayingPlaylist;
let currentlyPlayingSong;
let currentlyViewingPlaylist;
let queue = [];
let manualQueue = [];

let db;
let songsOnDevice;

let isShuffle = Number(localStorage.getItem('shuffleMode') || 1)
let repeatMode = Number(localStorage.getItem('repeatMode') || 0)

let currentSongDragId;

let restored = false;

let currentMiniplayer;

let upNextAlbumArtBlobUrl;

let fullscreenBgSet;
let currentFullscreenBg = 1;

let onlineActionsQueue = JSON.parse(localStorage.getItem('onlineActionsQueue')) || [];
let failedOnlineActionsQueue = [];

let albumCoverReset = false;
let fullscreenBgReset = false;
let playlistCoverReset = false;

inject()
if (playlists) renderPlaylists();

const req = indexedDB.open('Boi DB', 2);
req.onupgradeneeded = () => req.result.createObjectStore('songs', {keyPath:'id'})
req.onsuccess = () => {
    db = req.result;
    const newReq = db.transaction('songs').objectStore('songs').getAll();
    newReq.onsuccess = (ev) => {
        songsOnDevice = new Set(ev.target.result.map(a=>a.id));
        restoreSong();
    };
    newReq.onerror = (ev) => console.error(ev.target.errorCode);
}
req.onerror = () => console.error(req.error);

function createEl(name,classs) {
    const el = document.createElement(name)
    if (classs) el.className = classs
    return el
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
}

function restoreSong() {
    if (restored) return;
    restored = true;
    const prev = JSON.parse(localStorage.getItem('prevSong'))
    if (prev) {
        function functio(song) {
            updateCurrentlyPlayingUI(song)
            audio.onloadedmetadata = () => audio.currentTime = prev.position || 0;
            initializeShuffleQueue()
        }
        if (prev.id) {
            currentlyPlayingPlaylist = playlists.find(p=>p.id === prev.playlistId)
            if (songsOnDevice.has(prev.id)) {
                getIdFromDb(prev.id).then(song=>{
                    functio(song)        
                })
            } else {
                const song = songs.find(s=>s.id === prev.id)
                if (!song) return console.warn("previous song not found");
                functio(song)
            }
        }
    }
}

const init = () => {
    if (!playlists.length || playlists[0].id === "all songs")
        playlists.shift() 
    playlists.unshift({
        name: "<All Songs>",
        description: "All available songs.",
        id: "all songs",
        song_ids: songs.map(s=>s.id)
    })
    renderPlaylists();
    selectPlaylist("all songs")
    workThroughQueue()
    songsOnDevice.forEach(async id=>{
        const song = await getIdFromDb(id)
        checkForOnlineChange(song)
    })
}

function fetchJsons() {
    Promise.all([
        fetch('https://torok.ing/songplayer/songs.json').then(a=>a.json()),
        fetch('https://torok.ing/songplayer/playlists.json').then(a=>a.json())
    ]).then(([s,p])=>{
        if (loggedIn) s.map(s2=>songOwnership[s2.id] = userid)
        const combined = [...s, ...songs];
        const result = {};
        for (const obj of combined) {
            const existing = result[obj.id];
            if (!existing || new Date(obj.modified) > new Date(existing.modified)) {
                result[obj.id] = obj;
            }
        }
        songs = Object.values(result);
        if (!playlists.length || playlists[0].id === "all songs")
            playlists.shift() 
        playlists = playlists.map((p2,i)=>{
            if (!arraysEqual(p2.song_ids, p[i].song_ids)) {
                // Conflict! In future ask user if they want to keep their version or the server version
            }
            return { ...p2, ...p[i] }
        })
        init()
    })
}

fetch('https://torok.ing/auth/test').then(a=>a.json()).then(res=>{
    if (res.loggedIn) {
        loggedIn = true;
        userid = res.id;
        fetchJsons()
    } else {
        songs = songs.filter(s=>songsOnDevice.has(s.id))
        init()
    }
})

function getAverageColor(imgElement) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	canvas.width = imgElement.naturalWidth;
	canvas.height = imgElement.naturalHeight;

	context.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const data = imageData.data;

	let r = 0,
		g = 0,
		b = 0,
		count = 0;

	for (let i = 0; i < data.length; i += 4) {
		r += data[i];
		g += data[i + 1];
		b += data[i + 2];
		count++;
	}

	r = Math.round(r / count);
	g = Math.round(g / count);
	b = Math.round(b / count);

    return {r, g, b}
}

function updateSongStatusIcon(id, status) {
    const statusImg = songList.querySelector(`li[data-id="${id}"] .status-icon`)
    if (statusImg)
        statusImg.src = `https://torok.ing/songplayer/icons/${status}.svg`
}

function renderPlaylists() {
    homePlaylistsCont.innerHTML = '';
    playlistList.innerHTML = '';
    playlists.forEach(playlist=>{
        const card = createEl('div','playlist-card')
        const img = createEl('img','playlist-art')
        const infocont = createEl('div','playlist-info')
        const name = createEl('h4','playlist-name')
        const description = createEl('p','playlist-description')

        getIdFromDb(playlist.id).then((p)=>{ // Yes WE are using the songs db
            img.src = URL.createObjectURL(p.playlist_art);
        }).catch((e)=>{
            img.src = 'https://torok.ing/songplayer/playlistarts/' + (playlist.playlist_art || '../image/allsongsart.jpg');
        })
        name.innerText = playlist.name
        description.innerText = playlist.description
        card.onclick = () => switchMode('Library',playlist.id)
        card.dataset.id = playlist.id

        card.appendChild(img)
        infocont.appendChild(name)
        infocont.appendChild(description)
        card.appendChild(infocont)
        homePlaylistsCont.appendChild(card)

        const li = createEl('li','playlistOnSidebar')

        li.innerText = playlist.name
        li.dataset.id = playlist.id
        li.onclick = () => selectPlaylist(playlist.id)
        li.ondragover = (ev) => ev.preventDefault();
        li.ondrop = (ev) => {
            ev.preventDefault();
            const targetPlaylist = playlists.find(p=>p.id === playlist.id)
            if (!currentSongDragId || !targetPlaylist || targetPlaylist.id === "all songs") return;
            addSongsToPlaylist([currentSongDragId], targetPlaylist.id)
        }
        playlistList.appendChild(li)
        if (playlist.id === "all songs") return;
    })
}

function highlightCurrentPlaying() {
    if (currentlyPlayingPlaylist?.id !== currentlyViewingPlaylist?.id) return;
    const currentId = currentlyPlayingSong?.id
    if (!currentId) return;
    songList.querySelector('.track-title.playing')?.classList?.remove('playing')
    songList.querySelector('li[data-id="'+currentId+'"]')?.querySelector('.track-title')?.classList?.add('playing')
}

async function selectPlaylist(id) {
    const playlist = playlists.find(p=>p.id===id)
    if (!playlist) return;
    const songsInPlaylist = songs.filter(s=>new Set(playlist.song_ids).has(s.id))
    playlistList.querySelector('.active')?.classList?.remove('active')
    playlistList.querySelector(`.playlistOnSidebar[data-id="${id}"]`)?.classList?.add('active')
    currentlyViewingPlaylist = playlist;
    if (playlist.id === "all songs") {
        uploadArea.classList.remove('hidden');
        playlistDetails.classList.add('hidden');
    } else {
        uploadArea.classList.add('hidden');
        playlistDetails.classList.remove('hidden');
        
        playlistDetailsDescription.innerText = playlist.description;
        playlistDetailsName.innerText = playlist.name;
        getIdFromDb(playlist.id).then((p)=>{
            playlistDetailsCoverArt.src = URL.createObjectURL(p.playlist_art)
        }).catch((e)=>{
            playlistDetailsCoverArt.src = "https://torok.ing/songplayer/playlistarts/" + (playlist.playlist_art || '../image/allsongsart.jpg');
        })
        playlistDetailsCreatorName.innerText = localStorage.getItem("username") !== null ? localStorage.getItem('username') : "<unknown>";
        playlistDetailsLength.innerText = formatTime(songsInPlaylist.reduce((a,b)=>a+parseTimeToSeconds(b.length),0))
        playlistDownloadToggle.checked = Prefrences.playlistDownloadToggles[playlist.id]
    }

    songList.innerHTML = '';
    const allowReorder = id !== "all songs"
    let currentDraggedIndex;
    for (const [index,song] of songsInPlaylist.entries()) {
        const availlable = navigator.onLine || songsOnDevice.has(song.id)
        const li = document.createElement('li')
        li.dataset.id = song.id
        li.dataset.index = index

        li.draggable = true;
        li.ondragover = (ev) => ev.preventDefault();
        li.ondragstart = (ev) => {
            currentSongDragId = song.id;
            currentDraggedIndex = index;
        }
        li.ondragend = () => {
            currentDraggedIndex = null;
			currentSongDragId = null;
        }
        if (allowReorder) {
            li.ondrop = (ev) => {
                ev.preventDefault();
                if (!currentDraggedIndex || currentDraggedIndex === index) return;
                console.log(JSON.stringify(playlist.song_ids))
                const draggedSong = playlist.song_ids.splice(currentDraggedIndex,1)
                playlist.song_ids.splice(index, 0, draggedSong)
                console.log(JSON.stringify(playlist.song_ids))
            }
        } 

        const trackIndex = createEl('div','track-index')
        const trackTitleArtist = createEl('div','track-title-artist')
        const trackCoverImg = createEl('img','track-cover')
        const trackText = createEl('div','track-text')
        const trackTitle = createEl('div','track-title')
        const artistContainer = createEl('div','track-artist')
        const statusIconContainer = createEl('span')
        const statusIcon = createEl('img','status-icon')
        const artistElem = createEl('span')
        const trackAlbum = createEl('div','track-album')
        const trackDateAdded = createEl('div','track-date-added')
        const trackLength = createEl('div','track-length')
        const trackMenu = createEl('div')
        const threeDotsBtn = createEl('button','three-dots-button')

        if (songStatuses[song.id] === "local") statusIcon.src = 'https://torok.ing/songplayer/icons/file.svg'
        else if (songStatuses[song.id] === "downloaded") statusIcon.src = 'https://torok.ing/songplayer/icons/local.svg'
        else statusIcon.src = 'https://torok.ing/songplayer/icons/online.svg'
        trackIndex.innerText = index + 1
        trackCoverImg.loading = 'lazy'
        if (availlable) {
            getIdFromDb(song.id).then(offlineSongData=>{
                if (offlineSongData && offlineSongData.album_cover) trackCoverImg.src = URL.createObjectURL(offlineSongData.album_cover)
                else trackCoverImg.src = song.album_cover ? 'https://torok.ing/songplayer/albumcovers/' + song.album_cover : 'https://torok.ing/songplayer/image/genericalbumcover.jpg'
            })
        } else {
            trackCoverImg.src = 'https://torok.ing/songplayer/image/genericalbumcover.jpg'
            li.classList.add('disabled-offline')
        }
        trackTitle.innerText = song.title
        artistElem.innerText = song.artist;
        trackAlbum.innerText = song.album;
        trackDateAdded.innerText = (new Date(song.date_added.replace(" ", "T").split(".")[0])).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) || "";
        trackLength.innerText = song.length
        threeDotsBtn.innerText = '⋮';
        threeDotsBtn.onclick = (ev) => {
            const event = new MouseEvent("contextmenu", {
                bubbles: true,
                clientX: ev.clientX,
                clientY: ev.clientY,
                button: 2
            });
            threeDotsBtn.dispatchEvent(event);
        };
        li.onclick = (ev) => {
            if (threeDotsBtn.contains(ev.target)) return;
            if (!availlable) return;
            currentlyPlayingPlaylist = playlist
            startPlayback(song.id, playlist)
        }

        statusIconContainer.appendChild(statusIcon)
        artistContainer.appendChild(statusIconContainer)
        artistContainer.appendChild(artistElem)
        trackText.appendChild(trackTitle)
        trackText.appendChild(artistContainer)
        trackTitleArtist.appendChild(trackCoverImg)
        trackTitleArtist.appendChild(trackText)
        trackMenu.appendChild(threeDotsBtn)

        li.appendChild(trackIndex)
        li.appendChild(trackTitleArtist)
		li.appendChild(trackAlbum);
		li.appendChild(trackDateAdded);
		li.appendChild(trackLength);
		li.appendChild(trackMenu);

        songList.appendChild(li)
    }

    highlightCurrentPlaying()
}

playlistDownloadToggle.onchange = () => {
    Prefrences.playlistDownloadToggles[currentlyViewingPlaylist.id] = playlistDownloadToggle.checked
    if (playlistDownloadToggle.checked) {
        songs.filter(s=>currentlyViewingPlaylist.song_ids.includes(s.id) && !songsOnDevice.has(s.id)).forEach(s=>{
            queueAction("download_song",s.id)
        })
    }
}

function switchMode(mode,id) {
    homeMode.classList.toggle('active', mode === 'Home');
    onlineMode.classList.toggle('active', mode === 'Library');
    homeSection.classList.toggle('hidden', mode === 'Library');
	onlineSection.classList.toggle('hidden', mode === 'Home');
	playlistsView.classList.toggle('hidden', mode === 'Home');
    if (id) selectPlaylist(id)
}

async function startPlayback(id,playlist) {
    currentlyPlayingPlaylist = playlist
    await startTrack(id,playlist)
    initializeShuffleQueue()
}

async function startTrack(id) {
    upNextAlbumArtBlobUrl = null;
    fullscreenBgSet = false;
    updateCurrentlyPlayingUI(songsOnDevice.has(id) ? await getIdFromDb(id) : songs.find(s=>s.id===id))
    playTrack()
}

function initializeShuffleQueue() {
    const set = new Set(currentlyPlayingPlaylist?.song_ids || playlists[0].song_ids)
    if (isShuffle) {
        queue = songs.filter(s=>set.has(s.id));
        for (let i = queue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }
    } else {
        const songsInPlaylist = songs.filter(s=>set.has(s.id))
        queue = songsInPlaylist.splice(songsInPlaylist.findIndex(s=>s.id === currentlyPlayingSong?.id) + 1)
    }
    const currentlyPlayingIndex = queue.findIndex(s=>s.id === currentlyPlayingSong?.id)
    if (currentlyPlayingIndex !== -1) queue.splice(currentlyPlayingIndex, 1)
    queue = queue.map(i=>{ 
        if (!songsOnDevice.has(i.id) && !navigator.onLine) return {...i, skip: true} 
        else return i 
    })
}

function playTrack() {
	if (!audio.src)
        return startPlayback(songs[0].id, playlists[0])
	audio.play();
	navigator.mediaSession.playbackState = 'playing';
	updatePlayPauseButton();
}

async function getUpNextTrack(del) {
    if (manualQueue[0]) return manualQueue[0]
    if (isShuffle) {
        while (queue.length && queue[0].skip) { 
            queue.splice(0,1) 
        }
        let song = queue[0];
        if (!song) return null
        if (songsOnDevice.has(song.id)) song = await getIdFromDb(song.id)
        if (del) queue.splice(0,1)[0]
        return song;
    }
    const set = new Set(currentlyPlayingPlaylist.song_ids)
    const playlist = songs.filter(s=>set.has(s.id) && (songsOnDevice.has(s.id) || navigator.onLine))
    const idx = playlist.findIndex(i=>i.id===currentlyPlayingSong.id)+1
    if (idx === -1) return null
    let song = playlist[idx]
    if (!song) return null
    if (songsOnDevice.has(song.id)) song = await getIdFromDb(song.id)
    return song
}

function tweenSlider(to) {
    async function tweenOne(progressBar) {
        const from = parseFloat(progressBar.value);
        const startTime = performance.now();

        function animate(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / 250, 1);

            const value = from + (to - from) * progress;
            progressBar.value = value;

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate)
    }
    tweenOne(progressBar);
    tweenOne(fullscreenProgressBar);
}

audio.onended = () => {
	if (repeatMode === 2) playTrack();
    else nextBtn.click();
}
async function onTimeUpdate() {
    if (!audio.duration) return;
    const progressPercent = (audio.currentTime / audio.duration) * 100;

    currentTimeSpan.innerText = formatTime(audio.currentTime);
    fullscreenCurrentTime.innerText = formatTime(audio.currentTime);

    tweenSlider(progressPercent);

    const upNextTrack = await getUpNextTrack(false)
    if (repeatMode !== 2 && upNextTrack && (audio.duration - audio.currentTime <= 15)) {
        upNextSongTitle.innerText = upNextTrack.title;
        upNextSongArtist.innerText = upNextTrack.artist;
        if (!upNextAlbumArtBlobUrl) upNextAlbumArtBlobUrl = getAlbumCoverForTrack(upNextTrack) // Sometimes not a blob btw
        upNextAlbumArt.src = upNextAlbumArtBlobUrl;
        upNextContainer.classList.remove('hidden');
    } else upNextContainer.classList.add('hidden');
}
audio.ontimeupdate = onTimeUpdate

function pauseTrack() {
	if (!audio.paused) audio.pause();
	navigator.mediaSession.playbackState = 'paused';
	updatePlayPauseButton();
}

function updatePlayPauseButton() {
	if (audio.paused) {
		playPauseBtnImg.src = 'https://torok.ing/songplayer/icons/play.svg';
		fullscreenPlayPauseBtnImg.src = 'https://torok.ing/songplayer/icons/play.svg';
	} else {
		playPauseBtnImg.src = 'https://torok.ing/songplayer/icons/pause.svg';
		fullscreenPlayPauseBtnImg.src = 'https://torok.ing/songplayer/icons/pause.svg';
	}
}

function checkForOnlineChange(song) {
    if (!songsOnDevice.has(song.id)) return;
    const songInSongs = songs.find(s=>s.id === song.id)
    if (!songInSongs) {
        songStatuses[song.id] = "local"
        deleteSong(song.id) // would just making song local be better? the song was deleted on the server anyway
        return;
    };
    if (new Date(songInSongs.modified) > new Date(song.modified) && navigator.onLine) {
        removeSongMediaFromDevice(song.id)
        downloadSongForOfflineUse(song.id)
    }
}

function getAudioForTrack(song) {
    if (songsOnDevice.has(song.id)) {
        return URL.createObjectURL(song.filename)
    } else {
        return 'https://torok.ing/songplayer/songs/' + song.filename
    }
}

function getAlbumCoverForTrack(song) {
    if (songsOnDevice.has(song.id)) {
        return song.album_cover ? URL.createObjectURL(song.album_cover) : 'https://torok.ing/songplayer/image/genericalbumcover.jpg'
    } else {
        return song.album_cover ? 'https://torok.ing/songplayer/albumcovers/' + song.album_cover : 'https://torok.ing/songplayer/image/genericalbumcover.jpg'
    }
}

const randomFullscreenBg = () => genericBackgroundImages[Math.floor(Math.random() * genericBackgroundImages.length)]
function getFullscreenBgForTrack(song) {
    if (songsOnDevice.has(song.id)) {
        return song.fullscreenbg ? URL.createObjectURL(song.fullscreenbg) : randomFullscreenBg()
    } else {
        return song.fullscreenbg ? 'https://torok.ing/songplayer/images/' + song.fullscreenbg : randomFullscreenBg()
    }
}

function updateCurrentlyPlayingUI(song) {
    let audioSrc = getAudioForTrack(song)
    let albumCoverSrc = getAlbumCoverForTrack(song)

    currentlyPlayingSong = song;
    highlightCurrentPlaying()

    totalTimeSpan.innerText = song.length || '0:00'
    fullscreenTotalTime.innerText = song.length || '0.00'
    currentTimeSpan.innerText = '-:--'
    fullscreenCurrentTime.innerText = '-:--'

    audio.ontimeupdate = null
    audio.onloadedmetadata = null
    progressBar.value = 0
    fullscreenProgressBar.value = 0
    audio.ontimeupdate = onTimeUpdate

    audio.src = audioSrc;
    songTitle.innerText = song.title;
    songArtist.innerText = song.artist;
    albumCover.src = albumCoverSrc;
    document.title = `${song.title} • ${song.artist}`

    if (document.fullscreenElement !== null) setFullscreenBg(song)
    fullscreenSongTitle.innerText = song.title;
    fullscreenSongArtist.innerText = song.artist;
    fullscreenAlbumCover.src = albumCoverSrc;

    playlistArtLarge2.src = albumCoverSrc;    
    albumArtSlider.style.transition = 'transform 0.5s ease-in-out';
    albumArtSlider.style.transform = 'translateX(-50%)';
    albumArtSlider.ontransitionend = async () => {
        playlistArtLarge1.onload = () => {
            albumArtSlider.style.transition = 'none';
            albumArtSlider.style.transform = 'translateX(0)';
        }
        playlistArtLarge1.src = playlistArtLarge2.src;
    };

    navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: [{ src: albumCoverSrc, sizes: '256x256', type: 'image/jpeg' }]
    });

    navigator.mediaSession.setActionHandler('play', () =>  playTrack());
    navigator.mediaSession.setActionHandler('pause', () =>  pauseTrack());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevBtn.click());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextBtn.click());
    navigator.mediaSession.setActionHandler('stop', () => { pauseTrack(); audio.currentTime = 0; });
    navigator.mediaSession.setActionHandler('seekto', (details) => audio.fastSeek(details.seekTime));

    playlistList.querySelector('.playing-playlist')?.classList.remove('playing-playlist')
    playlistList.querySelector(`.playlistOnSidebar[data-id="${currentlyPlayingPlaylist.id}"]`).classList.add('playing-playlist')
}

homeBtn.onclick = () => switchMode('Home')
libraryBtn.onclick = () => switchMode('Library')

async function addDataToSongsDb(data) {
    const transaction = db.transaction('songs','readwrite')
    transaction.objectStore('songs').add(data)
    songsOnDevice.add(data.id)
}

async function getIdFromDb(id) {
    const transaction = db.transaction('songs')
    const req =  transaction.objectStore('songs').get(id)
    return new Promise((res, rej) => {
        req.onsuccess = () => res(req.result);
        req.onerror = () => rej(req.error);
    });
}

function inject() {
    AccountInjection.inject($('navRight'),[
        {
            name: "General",
            icon: "fa-gear",
            content: [
                {
                    label: "Always use generic fullscreen backgrounds",
                    type: "toggle",
                    default: Prefrences.alwaysGenericBg,
                    onAction: (sel) => changeSetting("alwaysGenericBg",sel)
                },
                {
                    label: "Sync Fullscreen BG video with song",
                    type: "toggle",
                    default: Prefrences.syncVideo,
                    onAction: (sel) => changeSetting("syncVideo",sel)
                },
                {
                    label: "Auto sync uploaded songs when logged-in",
                    type: "toggle",
                    default: Prefrences.autoUpload,
                    onAction: (sel) => changeSetting("autoUpload",sel)
                },
                {
                    label: "Show the miniplayer when navigating away",
                    type: "toggle",
                    default: Prefrences.miniplayer,
                    onAction: (sel) => changeSetting("miniplayer",sel)
                }
            ]
        }
    ])
}

function changeSetting(val,mode){
    Prefrences[val] = mode
}

window.onbeforeunload = () => {
    localStorage.setItem('songsCache',JSON.stringify(songs))
    localStorage.setItem('playlistsCache',JSON.stringify(playlists))
    localStorage.setItem('songplayerPrefrencesCache',JSON.stringify(Prefrences))
    localStorage.setItem('prevSong',JSON.stringify({
        id: currentlyPlayingSong?.id,
        playlistId: currentlyPlayingPlaylist?.id,
        position: audio.currentTime
    }))
    localStorage.setItem('onlineActionsQueue',JSON.stringify(failedOnlineActionsQueue.concat(onlineActionsQueue)))
    localStorage.setItem('songStatusesCache',JSON.stringify(songStatuses))
    localStorage.setItem('songOwnershipCache',JSON.stringify(songOwnership))
    localStorage.setItem('shuffleMode', isShuffle)
    localStorage.setItem('repeatMode', repeatMode)
}

function updateControlBtns() {
    const repeatActive = repeatMode > 0;
    const repeatIcon = repeatMode === 2
        ? "https://torok.ing/songplayer/icons/repeat2.svg"
        : "https://torok.ing/songplayer/icons/repeat.svg";

    shuffleBtn.classList.toggle('active', isShuffle);
    fullscreenShuffleBtn.classList.toggle('active', isShuffle);
    shuffleIndicator.classList.toggle('hidden', !isShuffle);
    fullscreenShuffleIndicator.classList.toggle('hidden', !isShuffle);

    repeatBtn.classList.toggle('active', repeatActive);
    fullscreenRepeatBtn.classList.toggle('active', repeatActive);
    repeatIndicator.classList.toggle('hidden', !repeatActive);
    fullscreenRepeatIndicator.classList.toggle('hidden', !repeatActive);

    repeatBtn.querySelector('img').src = repeatIcon;
    fullscreenRepeatBtn.querySelector('img').src = repeatIcon;
}

fullscreenPlayPauseBtn.onclick = () => playPauseBtn.click();
fullscreenPrevBtn.onclick = () => prevBtn.click();
fullscreenNextBtn.onclick = () => nextBtn.click();
fullscreenShuffleBtn.onclick = () => shuffleBtn.click()
fullscreenRepeatBtn.onclick = () => repeatBtn.click()
fullscreenProgressBar.oninput = () => progressBar.value = fullscreenProgressBar.value

prevBtn.onclick = () => {
    audio.currentTime = 0
}
playPauseBtn.onclick = () => {
 if (audio.paused) playTrack()
 else pauseTrack()
}
nextBtn.onclick = async () => {
    const ar = manualQueue.length > 0 ? manualQueue : queue
    if (ar.length > 0) {
        const track = await getUpNextTrack(true)
        if (!track) return updatePlayPauseButton();
        return startTrack(track.id, track.playlist || currentlyPlayingPlaylist)
    } else if (repeatMode === 1) {
        if (!isShuffle) await startTrack(currentlyPlayingPlaylist.song_ids[0])
        else {
            initializeShuffleQueue()
            nextBtn.click()
        }
    }
}
shuffleBtn.onclick = () => {
    if (isShuffle) isShuffle = 0
    else isShuffle = 1;
    updateControlBtns()
    initializeShuffleQueue();
}
repeatBtn.onclick = () => {
    repeatMode++;
    if (repeatMode === 3) repeatMode = 0;
    updateControlBtns()
}
progressBar.oninput = () => audio.currentTime = (progressBar.value / 100) * audio.duration 
uploadArea.onclick = () => {
    const file = document.createElement('input')
    file.type = 'file'
    file.accept = 'audio/*'
    file.click();
    file.onchange = () => {
        addSongsFromFiles(file.files)
        selectPlaylist(currentlyViewingPlaylist.id)
    }
}
songList.ondragover = (ev) => ev.preventDefault();
songList.ondrop = (ev) => {
    ev.preventDefault();
    if (ev.dataTransfer.files.length === 0) return;
    const ids = addSongsFromFiles(ev.dataTransfer.files)
    if (currentlyViewingPlaylist.id !== "all songs") {
        addSongsToPlaylist(ids, currentlyViewingPlaylist.id)
    }
    else selectPlaylist(currentlyViewingPlaylist.id)
}

addPlaylistBtn.onclick = () => {
    addPlaylistPopup.classList.toggle('hidden')
    newPlaylistNameInput.value = ""
}
confirmAddPlaylistBtn.onclick = () => {
    const name = newPlaylistNameInput.value.trim();
    addPlaylistPopup.classList.add('hidden')
    if (!name) return;
    const newPlaylist = {
        id: crypto.randomUUID(),
        name,
        description: "",
        song_ids: []
    }
    playlists.push(newPlaylist)
    queueAction("create_playlist", newPlaylist.id)
    renderPlaylists()
    selectPlaylist(newPlaylist.id)
}

function parseTimeToSeconds(timeStr) {
	const parts = timeStr.split(':');
	if (parts.length === 2) {
		const minutes = parseInt(parts[0], 10);
		const seconds = parseInt(parts[1], 10);
		return minutes * 60 + seconds;
	} else if (parts.length === 3) {
		const hours = parseInt(parts[0], 10);
		const minutes = parseInt(parts[1], 10);
		const seconds = parseInt(parts[2], 10);
		return hours * 3600 + minutes * 60 + seconds;
	}
	return 0;
}

async function requestPersistentStorage() {
    const isPersisted = await navigator.storage.persisted();
    if (!isPersisted) {
        const result = await navigator.storage.persist();
        console.log(`Storage persistence request was ${result ? 'granted' : 'denied'}.`);
    }
}

function addSongsFromFiles(files) {
    const ids = []
    requestPersistentStorage();
    for (const file of files) {
        parseBlob(new Blob([file], {type:file.type})).then(metadata => {
            const newSong = {
                id: crypto.randomUUID(),
                title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
                artist: metadata.common.artist || "",
                album: metadata.common.album || "",
                length: formatTime(metadata.format.duration),
                filename: "local song",
                date_added: new Date().toISOString(),
                modified: new Date().toISOString(),
            };
            const albumCover = metadata.common.picture ? new Blob([metadata.common.picture[0].data], {type:metadata.common.picture[0].format}) : null
            songStatuses[newSong.id] = "local"
            songs.push(newSong);
            addSongsToPlaylist([newSong.id], "all songs")
            addDataToSongsDb({ 
                ...newSong, 
                filename: file, 
                album_cover: albumCover, 
                fullscreenbg: null 
            });

            if (Prefrences.autoUpload && loggedIn) queueAction("upload", {id: newSong.id})

            ids.push(newSong.id)
        });
    }
    return ids
}

let workingThroughQueue = false;
async function workThroughQueue() {
    if (workingThroughQueue || !navigator.onLine) return;
    workingThroughQueue = true;

    while (onlineActionsQueue.length > 0) {
        const item = onlineActionsQueue[0];
        try {
            if (item.type === "upload") {
                await uploadSongToServer(item.data.id);
            } else if (item.type === "download_song") {
                await downloadSongForOfflineUse(item.data)
            } else if (item.type === "create_playlist" || item.type === "update_playlist") {
                if (!loggedIn) throw new Error("Need to be logged in to create a playlist on the server")
                const playlist = playlists.find(p=>p.id === item.data)
                if (playlist){
                    const response = await fetch('https://torok.ing/songplayer/',{
                        method: item.type === "create_playlist" ? "PUT" : "PATCH",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            action: item.type,
                            playlist_id: playlist.id,
                            metadata: playlist
                        })
                    })
                    const res = await response.json();
                    if (!res.success) throw new Error(res.error)
                };
            }
        } catch (err) {
            console.warn("Error working through an online queue item:", err, item.data);
            //failedOnlineActionsQueue.push(item);
            // if an action fails, we currently just skip it and move on to the next one. This is because if we keep retrying failed actions, they will block the queue and prevent any subsequent successful actions from being processed. In the future, we might want to implement a more robust retry mechanism that allows for a certain number of retries before giving up on an action, or we could move failed actions to a separate queue that is retried less frequently. For now, we will just log the error and continue processing the rest of the queue.
            // shut up copilot
        }
        onlineActionsQueue.shift();
    }

    workingThroughQueue = false;
}

window.addEventListener('online', () => {
    selectPlaylist(currentlyViewingPlaylist.id)
    workThroughQueue();
    queue = queue.map(({ skip, ...a }) => a);
    manualQueue = manualQueue.map(({ skip, ...a }) => a);
})
window.addEventListener('offline', () => {
    selectPlaylist(currentlyViewingPlaylist.id)
    queue = queue.map(i=>{
        if (!songsOnDevice.has(i.id)) return {...i, skip: true}
        else return i
    })
    manualQueue = manualQueue.map(i=>{
        if (!songsOnDevice.has(i.id)) return {...i, skip: true}
        else return i
    })
})

function queueAction(type, data) {
    if ((type === "update_playlist" || type === "create_playlist") 
        && onlineActionsQueue.find(i=>(i.type === "update_playlist" || i.type === "create_playlist") && i.data === data)) return;
    onlineActionsQueue.push({type, data})
    workThroughQueue();
}

function deletePlaylist(id) {
    if (loggedIn && !navigator.onLine) return customAlert("Connect to the World Wide Web to delete this playlist", "error")   
    function del() {
        const index = playlists.findIndex(p=>p.id === id)   
        if (index === -1) return;
        playlists.splice(index,1)
        renderPlaylists()
        if (currentlyViewingPlaylist.id === id) selectPlaylist("all songs")
    }
    if (loggedIn) {
        fetch('https://torok.ing/songplayer/',{
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                delete_type: "playlist",
                playlist_id: id
            })
        }).then(res=>res.json()).then(data=>{
            if (!data.success) {
                customAlert(data.error, "error")
                return;
            }
            del()
        })
    } else del();
}

function addSongsToPlaylist(ids, playlistid) {
    const playlist = playlists.find(p=>p.id === playlistid)
    if (!playlist) return;
    function add() {
        playlist.song_ids.push(...ids)
        if (playlistid === currentlyViewingPlaylist.id) selectPlaylist(playlistid)
        queueAction("update_playlist", playlist.id)
    }
    if (ids.some(id=>songStatuses[id] !== "local") && !navigator.onLine) {
        customAlert("One or more songs you're trying to add to " + playlist.name + " are not available offline. Connect to the World Wide Web to add them.", "error")
        return;
    }
    if (playlist.song_ids.some(id=>ids.includes(id))) {
        const body = createEl('div')
        body.innerText = "One or more songs you're trying to add to " + playlist.name + " are already in that playlist. Do you want to add them again?"
        showAModal("Warning", body, {
            okButtonAction: add,
            buttons: true
        })
        return;
    }
    add()
}

function removeSongFromPlaylist(songid, playlistid) {
    const playlist = playlists.find(p=>p.id === playlistid)
    if (!playlist) return;    
    if (songStatuses[songid] !== "local" && !navigator.onLine) {
        customAlert("One or more songs you're trying to remove from " + playlist.name + " are not available offline. Connect to the World Wide Web to remove it.", "error")
        return;
    }
    playlist.song_ids = playlist.song_ids.filter(id=>id !== songid)
    if (playlistid === currentlyViewingPlaylist.id) selectPlaylist(playlistid)
    queueAction("update_playlist", playlist.id)
}

function deleteSong(id) {
    if (songStatuses[id] !== "local" && !navigator.onLine) return customAlert("Connect to the World Wide Web to delete this song", "error")

    function deleteFromDevice() {
        songs.splice(songs.findIndex(s=>s.id === id),1)
        const transaction = db.transaction('songs','readwrite')
        transaction.objectStore('songs').delete(id)
        songsOnDevice.delete(id)
        delete songStatuses[id]
        playlists.forEach(p=>{
            p.song_ids = p.song_ids.filter(sid=>sid !== id)
            if (currentlyViewingPlaylist.id === p.id) selectPlaylist(currentlyViewingPlaylist.id)
        })
    }

    if (songStatuses[id] !== "local" && loggedIn && (!songOwnership[id] || songOwnership[id] === userid)) {
        fetch('https://torok.ing/songplayer', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                delete_type: "song",
                song_id: id,
            })
        }).then(res=>res.json()).then(data=>{
            if (data.success) {
                deleteFromDevice()
            } else customAlert(data.error, 'error')
        }).catch(err=>{
            customAlert(err, "error")
        })
    } else deleteFromDevice();
}

function removeSongMediaFromDevice(id) {
    if (!songsOnDevice.has(id)) return;
    function remove() {
        const transaction = db.transaction('songs','readwrite')
        transaction.objectStore('songs').delete(id)
        songsOnDevice.delete(id)
        delete songStatuses[id]
        updateSongStatusIcon(id, 'online')
    }
    if (!navigator.onLine) {
        const body = createEl('div')
        body.innerText = "You're not online, doing this will make the song inaccessable until you go back online!"
        showAModal("Warning", body, {
            okButtonAction: remove,
            buttons: true
        })
    }
    else remove()
}

async function uploadMedia(file, type, other = []) {
    return new Promise((res, rej) => {
        const formData = new FormData();
        formData.append('file', file)
        formData.append("upload_type", type)
        other.forEach(o=>formData.append(o.name, o.value))

        fetch('https://torok.ing/songplayer/', {
            method: 'POST',
            body: formData
        }).then(res=>res.json()).then(data=>{
            console.log(data.data)
            if (data.success) {
                const filename = data.data.filename || data.data.split('/').pop();
                res(filename)
            }
            else rej(data)
        }).catch(err=>{
            rej(err)
        })
    })
}

async function uploadSongToServer(id) {
    return new Promise(async (res, rej) => {
        const song = await getIdFromDb(id)
        if (!song) return res()

        updateSongStatusIcon(id, 'loading')

        uploadMedia(song.filename, "song", [
            {name: "preferred_id", value: song.id}
        ]).then(filename=>{
            songStatuses[id] = "uploaded"
            updateSongStatusIcon(id, 'uploaded')
            const song = songs.find(s=>s.id === id)
            song.filename = filename
            songOwnership[id] = userid
            res()
        }).catch(err=>{
            updateSongStatusIcon(id, 'file')
            customAlert(err.error, 'error')
            rej(err)
        })
    })
}

async function downloadSongForOfflineUse(id) {
    return new Promise((res, rej) => {
        const song = songs.find(s=>s.id === id)
        if (!song) return;

        updateSongStatusIcon(id, 'loading')

        Promise.all([
            fetch('https://torok.ing/songplayer/songs/' + song.filename).then(res=>res.blob()),
            song.album_cover ? fetch('https://torok.ing/songplayer/albumcovers/' + song.album_cover).then(res=>res.blob()) : null,
            song.fullscreenbg ? fetch('https://torok.ing/songplayer/images/' + song.fullscreenbg).then(res=>res.blob()) : null
        ]).then(([songBlob, albumCoverBlob, fullscreenBgBlob])=>{
            songStatuses[id] = "downloaded"
            addDataToSongsDb({
                ...song,
                filename: songBlob,
                album_cover: albumCoverBlob,
                fullscreenbg: fullscreenBgBlob,
                owner: userid
            })
            updateSongStatusIcon(id, 'local')
            songOwnership[id] = userid
            res()
        }).catch(err=>{
            updateSongStatusIcon(id, 'online')
            rej(err)
        })
    })
}

function formatTime(totalSeconds) {
	totalSeconds = Math.floor(totalSeconds);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
	const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

	if (hours > 0)
		return `${hours}:${formattedMinutes}:${formattedSeconds}`;
	return `${minutes}:${formattedSeconds}`;
}

async function openMiniplayer() {
    const doc = await fetch('https://torok.ing/songplayer/miniplayer.html')
    const html = await doc.text()
    const mini = await documentPictureInPicture.requestWindow({
        width: 300,
        height: 300,
    });
    mini.document.body.innerHTML = html;
    mini.document.body.appendChild(footer)
    const css = document.createElement('style')
    css.textContent = "*{margin:0;padding:0;}"
    mini.document.head.appendChild(css)
    const css2 = document.createElement('link')
    css2.rel = "stylesheet"
    css2.href = "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
    mini.document.head.appendChild(css2)
    mini.document.body.querySelectorAll('script').forEach(s=>{
        const newScript = document.createElement('script')
        newScript.textContent = s.textContent
        mini.document.body.appendChild(newScript)
    })
    mini.onbeforeunload = () => closeMiniplayer()
    currentMiniplayer = mini;
}
async function closeMiniplayer() {
    if (currentMiniplayer) {
        // Now assemble it all back...
        footer.innerHTML = "";
        const footerInfoDiv = createEl('div','footerInfoDiv')
        footer.appendChild(footerInfoDiv)
        const nowPlaying = createEl('div','now-playing')
        footerInfoDiv.appendChild(nowPlaying)
        const albumCoverContainer = createEl('div','album-cover-container')
        nowPlaying.appendChild(albumCoverContainer)
        albumCoverContainer.appendChild(albumCover)
        const songInfo = createEl('div','songInfo')
        nowPlaying.appendChild(songInfo)
        songInfo.appendChild(songTitle)
        songInfo.appendChild(songArtist)
        const playerControls = createEl('div','player-controls')
        playerControls.appendChild(prevBtn)
        playerControls.appendChild(playPauseBtn)
        playerControls.appendChild(nextBtn)
        const controlItem1 = createEl('div','control-item')
        controlItem1.appendChild(shuffleBtn)
        controlItem1.appendChild(shuffleIndicator)
        playerControls.appendChild(controlItem1)
        const controlItem2 = createEl('div','control-item')
        playerControls.appendChild(controlItem2)
        controlItem2.appendChild(repeatBtn)
        controlItem2.appendChild(repeatIndicator)
        footerInfoDiv.appendChild(playerControls)
        const extraControls = createEl('div','extra-controls')
        footerInfoDiv.appendChild(extraControls)
        extraControls.appendChild(volumeBtn)
        extraControls.appendChild(volumeSlider)
        extraControls.appendChild(fullscreenBtn)
        const progressContainer = createEl('div','progress-container')
        footer.appendChild(progressContainer)
        progressContainer.appendChild(currentTimeSpan)
        progressContainer.appendChild(progressBar)
        progressContainer.appendChild(totalTimeSpan)
        currentMiniplayer.close();
        currentMiniplayer = null;
        document.body.appendChild(footer);
    }
}

document.onvisibilitychange = () => {
    if (document.hidden && Prefrences.miniplayer) openMiniplayer();
    else closeMiniplayer();
}

function setFullscreenBg(song) {
    if (fullscreenBgSet) return;
    fullscreenBgSet = true;
    let fullscreenBgUrl = getFullscreenBgForTrack(song)
    if (Prefrences.alwaysGenericBg) {
        fullscreenBgUrl = genericBackgroundImages[Math.floor(Math.random() * genericBackgroundImages.length)]
    }

	const nextBgDiv = currentFullscreenBg === 1 ? fullscreenBackground2 : fullscreenBackground1;
	const currentVisibleDiv = currentFullscreenBg === 1 ? fullscreenBackground1 : fullscreenBackground2;
    if (nextBgDiv.querySelector('video')) fullscreenBackgroundVideo.remove()
	nextBgDiv.innerHTML = '';

    const isVideo = song.fullscreenbg && (song.fullscreenbg.match(/\.(mp4|webm|mov)$/i) || (song.fullscreenbg.type && song.fullscreenbg.type.startsWith('video/')))

    if (isVideo) {
        nextBgDiv.style.backgroundImage = 'none';
        fullscreenBackgroundVideo.classList.remove('hidden')
        fullscreenBackgroundVideo.src = fullscreenBgUrl;

        nextBgDiv.appendChild(fullscreenBackgroundVideo);

        async function play() {
            fullscreenBackgroundVideo.play();
        }
        if (fullscreenBackgroundVideo.readyState >= 2 && fullscreenBackgroundVideo.duration) {
            play()
        } else {
            fullscreenBackgroundVideo.addEventListener('loadedmetadata', function once() {
                play()
                fullscreenBackgroundVideo.removeEventListener('loadedmetadata', once);
            });
        }
    } else {
        nextBgDiv.style.backgroundImage = `url('${fullscreenBgUrl}')`;
    }

	nextBgDiv.style.opacity = '1';
	currentVisibleDiv.style.opacity = '0';
	currentFullscreenBg = currentFullscreenBg === 1 ? 2 : 1;
}

hamburgerBtn.onclick = () => {
    sidebar.classList.toggle('hidden-sidebar');
	if (window.innerWidth <= 800) {
		sidbarOberlay.classList.toggle('active');
		sidbarOberlay.classList.toggle('hidden');
	}
}
sidbarOberlay.onclick = () => hamburgerBtn.click()

fullscreenBtn.onclick = () => {
    fullscreenPlayer.requestFullscreen();
    setFullscreenBg(currentlyPlayingSong)
    fullscreenPlayer.classList.remove('hidden')
}
closeFullscreenBtn.onclick = () => {
    document.exitFullscreen()
    fullscreenPlayer.classList.add('hidden')
}

function handleInitialSidebarState() {
	if (window.innerWidth <= 800) {
		sidebar.classList.add('hidden-sidebar');
		overlay.classList.remove('active');
	} else {
		if (!sidebar.classList.contains('hidden-sidebar')) sidebar.classList.remove('hidden-sidebar');
		overlay.classList.remove('active');
	}
}

handleInitialSidebarState();
window.addEventListener('resize', handleInitialSidebarState);

let touchTimer = null;
let touchX = 0;
let touchY = 0;

document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchX = touch.clientX;
    touchY = touch.clientY;
    touchTimer = setTimeout(() => {
        const target = document.elementFromPoint(touchX, touchY)
        target.dispatchEvent(new MouseEvent('contextmenu', {
            bubbles: true,
            button: 2,
            clientX: touchX,
            clientY: touchY
        }));
    }, 750);
});
const cancel = () => {
    if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
}

async function openEditSongModal(song) {
    const data = [
        [editSongModalTitle, song.title],
        [editSongModalArtist, song.artist],
        [editSongModalAlbum, song.album]
    ]
    const changedStuff = {}
    data.forEach(([el, val]) => {
        el.value = val;
        el.onchange = () => {
            changedStuff[el.id] = el.value === val;                     
            if (Object.values(changedStuff).some(v => v === false)) {
                editSongModalUnsaved.classList.remove('hidden');
            } else {
                editSongModalUnsaved.classList.add('hidden');
            }
        }
    });
    editSongModalID.innerText = song.id;

    function setDefaultArt() {
        modalSongAlbumCover.src = getAlbumCoverForTrack(song)
        if (isVideo) {
            modalFullscreenBgVideo.src = getFullscreenBgForTrack(song);
            modalFullscreenBgVideo.classList.remove('hidden');
            modalFullscreenBgImg.classList.add('hidden');
        } else {
            modalFullscreenBgImg.src = song.fullscreenbg ? getFullscreenBgForTrack(song) : randomFullscreenBg();
            modalFullscreenBgImg.classList.remove('hidden');
            modalFullscreenBgVideo.classList.add('hidden');
        }
        changeAlbumCoverInput.value = '';
        changeFullscreenBgInput.value = '';
    }

    const isVideo = song.fullscreenbg && song.fullscreenbg.match(/\.(mp4|webm|mov)$/i); // Get it from online!
    song = songsOnDevice.has(song.id) ? await getIdFromDb(song.id) : song
    setDefaultArt()
    
    editSongModalUnsaved.classList.add('hidden');
    editSongModal.classList.remove('hidden')

    editSongModalRevertBtn.onclick = () => {
        data.forEach(([el, val]) => el.value = val)
        setDefaultArt()
        editSongModalUnsaved.classList.add('hidden');
    }

    editSongModalSaveBtn.onclick = async () => {
        if (songStatuses[song.id] !== "local" && !navigator.onLine) return customAlert("Connect to the World Wide Web to edit this song's metadata", "error")

        editSongModalSaveBtn.disabled = true;
        editSongModalRevertBtn.disabled = true;

        const metadata = {
            title: editSongModalTitle.value,
            artist: editSongModalArtist.value,
            album: editSongModalAlbum.value
        }

        let albumCoverForStore = song.album_cover
        let fullscreenBgForStore = song.fullscreenbg

        if (albumCoverReset) {
            metadata.album_cover = '';
            albumCoverForStore = '';
        }
        if (fullscreenBgReset) {
            metadata.fullscreenbg = '';
            fullscreenBgForStore = ''
        }

        if (!albumCoverReset && changeAlbumCoverInput.files && changeAlbumCoverInput.files[0]) {
            if (songStatuses[song.id] !== "local") metadata.album_cover = await uploadMedia(changeAlbumCoverInput.files[0], "album_cover")
            albumCoverForStore = changeAlbumCoverInput.files[0]
        }
        if (!fullscreenBgReset && changeFullscreenBgInput.files && changeFullscreenBgInput.files[0]) {
            if (songStatuses[song.id] !== "local") metadata.fullscreenbg = await uploadMedia(changeFullscreenBgInput.files[0], "fullscreenbg")
            fullscreenBgForStore = changeFullscreenBgInput.files[0]
        }

        function updateTrackDevice() {
            Object.assign(song, metadata);
            if (songsOnDevice.has(song.id)) {
                const transaction = db.transaction('songs','readwrite')
                transaction.objectStore('songs').put({
                    ...song,
                    id: song.id,
                    album_cover: albumCoverForStore,
                    fullscreenbg: fullscreenBgForStore,
                    title: metadata.title,
                    artist: metadata.artist,
                    album: metadata.album,
                    modified: new Date().toISOString()
                })
            }    
            editSongModalUnsaved.classList.add('hidden');
            if (currentlyViewingPlaylist.song_ids.find(id => id === song.id)) selectPlaylist(currentlyViewingPlaylist.id);
        }

        if (songStatuses[song.id] !== "local") {
            const response = await fetch('https://torok.ing/songplayer/', { 
                method: 'PATCH',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    "action": "update_song",
                    "song_id": song.id,
                    "metadata": metadata
                }), 
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                updateTrackDevice();
            } else {
                customAlert(data.error, 'error')
                editSongModalRevertBtn.click();
            }
        } else updateTrackDevice();
        
        editSongModalSaveBtn.disabled = false;
        editSongModalRevertBtn.disabled = false;
    }
}

async function openEditPlaylistModal(playlist) {
    const data = [
        [editPlaylistModalTitle, playlist.name],
        [editPlaylistModalDescription, playlist.description]
    ]
    const changedStuff = {}
    data.forEach(([el, val]) => {
        el.value = val;
        el.onchange = () => {
            changedStuff[el.id] = el.value === val;                     
            if (Object.values(changedStuff).some(v => v === false)) {
                editPlaylistModalUnsaved.classList.remove('hidden');
            } else {
                editPlaylistModalUnsaved.classList.add('hidden');
            }
        }
    });
    editPlaylistModalID.innerText = playlist.id;

    const pOnDevice = await getIdFromDb(playlist.id)

    function setDefaultArt() {
        modalPlaylistCover.src = pOnDevice ? URL.createObjectURL(pOnDevice.playlist_art) : playlist.playlist_art || 'https://torok.ing/songplayer/image/allsongsart.jpg'
        changePlaylistCoverInput.value = '';
    }

    setDefaultArt()
    
    editPlaylistModalUnsaved.classList.add('hidden');
    editPlaylistModal.classList.remove('hidden')

    editPlaylistModalRevertBtn.onclick = () => {
        data.forEach(([el, val]) => el.value = val)
        setDefaultArt()
        editPlaylistModalUnsaved.classList.add('hidden');
    }

    editPlaylistModalSaveBtn.onclick = async () => {
        editPlaylistModalSaveBtn.disabled = true;
        editPlaylistModalRevertBtn.disabled = true;

        const metadata = {
            name: editPlaylistModalTitle.value,
            description: editPlaylistModalDescription.value
        }

        let playlistCoverForStore = pOnDevice ? pOnDevice.playlist_art : playlist.playlist_art || 'https://torok.ing/songplayer/image/allsongsart.jpg'

        if (playlistCoverReset) {
            metadata.playlist_art = '';
            playlistCoverForStore = '';
        }

        if (!playlistCoverReset && changePlaylistCoverInput.files && changePlaylistCoverInput.files[0]) {
            if (loggedIn) metadata.playlist_art = await uploadMedia(changePlaylistCoverInput.files[0], "playlist_art")
            playlistCoverForStore = changePlaylistCoverInput.files[0]
        }

        function updateTrackDevice() {
            Object.assign(playlist, metadata);  
            editPlaylistModalUnsaved.classList.add('hidden');
            const transaction = db.transaction('songs','readwrite')
            transaction.objectStore('songs').put({
                id: playlist.id,
                playlist_art: playlistCoverForStore
            })
            renderPlaylists();
            if (currentlyViewingPlaylist?.id === playlist.id) selectPlaylist(currentlyViewingPlaylist.id);
        }

        if (loggedIn) {
            const response = await fetch('https://torok.ing/songplayer/', { 
                method: 'PATCH',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    "action": "update_playlist",
                    "playlist_id": playlist.id,
                    "metadata": metadata
                }), 
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                updateTrackDevice();
            } else {
                customAlert(data.error, 'error')
                editPlaylistModalRevertBtn.click();
            }
        } else {
            updateTrackDevice();
            queueAction("update_playlist", playlist.id)
        }
        
        editPlaylistModalSaveBtn.disabled = false;
        editPlaylistModalRevertBtn.disabled = false;
    }
}

document.addEventListener('touchend', cancel);
document.addEventListener('touchmove', cancel);
document.addEventListener('touchcancel', cancel);

document.addEventListener('click',(ev)=>{
    if (ev.target.classList.contains('three-dots-button')) return;
    if (!contextMenu.contains(ev.target)) contextMenu.classList.add('hidden')
    if (!addPlaylistPopup.contains(ev.target) && !addPlaylistBtn.contains(ev.target)) addPlaylistPopup.classList.add('hidden')
})
document.addEventListener('contextmenu',(ev)=>{
    const target = ev.target;
    const contextableItem = target.closest('li') || target.closest('.playlistOnSidebar') || target.closest('.playlist-card');
    const id = contextableItem?.dataset.id
    if (!id) return;
    ev.preventDefault();
    const isPlaylist = contextableItem.closest('.playlistOnSidebar') || contextableItem.closest('.playlist-card');
    const isAllSongsPlaylist = isPlaylist && isPlaylist.dataset.id === "all songs"
    let base = [];
    if (isPlaylist && !isAllSongsPlaylist) {
        base.push({
            label: "Edit playlist",
            icon: "fas fa-pen",
            action: () => {
                const playlist = playlists.find(p=>p.id === id)
                openEditPlaylistModal(playlist)
            }
        },
        {
            label: "Delete playlist",
            icon: "fas fa-trash",
            action: () => {
                const body = createEl('div')
                body.innerText = "Are you sure you want to delete this playlist?"
                showAModal("Confirm delete", body, {
                    okButtonAction: () => {
                        deletePlaylist(id)
                    },
                    buttons: true
                })
            },
            danger: true
        })
    } else if (!isAllSongsPlaylist) {
        let song = songs.find(s=>s.id === id)
        if (songOwnership[id] && songOwnership[id] !== userid && songStatuses[id] !== "local") {
            base.push({
                label: "This song is owned by userid " + songOwnership[id],
                icon: "fas fa-user",
                disabled: true
            })
        } else {
            base.push({
                label: "Edit metadata",
                icon: "fas fa-pen",
                action: () => {
                    openEditSongModal(song)
                }
            })
        }
        if (playlists.find(p=>p.id === currentlyPlayingPlaylist?.id || currentlyViewingPlaylist?.id || p.id).song_ids.includes(id)) {
            base.push({
                label: "Add to queue",
                icon: "fas fa-plus",
                action: () => {
                    const song = songs.find(s=>s.id === id)
                    if (!song) return;
                    manualQueue.push(song)
                }
            })
        }
        base.push("hr")
        if (songStatuses[id] === "local" && loggedIn) {
            base.push({
                label: "Upload song to server",
                icon: "fas fa-upload",
                action: () => {
                    uploadSongToServer(id)
                }
            })
        }
        if (songStatuses[id] !== "local" && songStatuses[id] !== "uploaded") {
            base.push({
                label: "Download file",
                icon: "fas fa-download",
                action: () => {
                    const a = document.createElement('a')
                    a.target = "_blank"
                    if (songsOnDevice.has(id)) {
                        getIdFromDb(id).then(data=>{
                            if (!data) return;
                            const url = URL.createObjectURL(data.filename)
                            a.href = url
                            a.download = data.title + ".mp3"
                        })
                    } else {
                        a.href = 'https://torok.ing/songplayer/songs/' + song.filename
                    }
                    a.click();
                }
            })
        }
        if (songsOnDevice.has(id) && songStatuses[id] !== "local" && songOwnership[id] === userid) {
            base.push({
                label: "Remove downloaded file",
                icon: "fas fa-xmark",
                action: () => {
                    removeSongMediaFromDevice(id)
                },
                danger: true
            })
        } else if (!songsOnDevice.has(id)) {
            base.push({
                label: "Download for offline use",
                icon: "fas fa-download",
                action: () => {
                    downloadSongForOfflineUse(id)
                }
            })
        }
        base.push("hr")
        if (!songOwnership[id] || songOwnership[id] === userid || songStatuses[id] === "local") {
            base.push({
                label: "Add to playlist",
                icon: "fas fa-plus",
                contents: playlists.filter(p=>p.id !== "all songs").map(p=>({
                    label: p.name,
                    action: () => {
                        addSongsToPlaylist([id], p.id)
                    }
                }))
            })
            if (currentlyViewingPlaylist?.song_ids.includes(id) && currentlyViewingPlaylist?.id !== "all songs") {
                base.push({
                    label: "Remove from playlist",
                    icon: "fas fa-minus",
                    action: () => {
                        removeSongFromPlaylist(id, currentlyViewingPlaylist.id)
                    },
                    danger: true
                })
            }
        }
        base.push({
            label: songOwnership[id] === userid || !songOwnership[id] ? "Delete song" : "Remove from library",
            icon: "fas fa-trash",
            action: () => {
                const body = createEl('div')
                body.innerText = "Are you sure you want to delete this song?"
                showAModal("Confirm delete", body, {
                    okButtonAction: () => {
                        requestAnimationFrame(() => {
                            deleteSong(id)
                        })
                    },
                    buttons: true
                })
            },
            danger: true
        })
    }
    showContextMenu(ev, base)
})

changeFullscreenBgBtn.onclick = () => changeFullscreenBgInput.click();
changeAlbumCoverBtn.onclick = () => changeAlbumCoverInput.click();

changeAlbumCoverInput.onchange = (e) =>{
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => modalSongAlbumCover.src = event.target.result;
        reader.readAsDataURL(e.target.files[0]);
        albumCoverReset = false
        editSongModalUnsaved.classList.remove('hidden');
    }
};

changeFullscreenBgInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const isVideo = file.type.startsWith('video/');
            if (isVideo) {
                modalFullscreenBgVideo.src = event.target.result;
                modalFullscreenBgVideo.classList.remove('hidden');
                modalFullscreenBgImg.classList.add('hidden');
            } else {
                modalFullscreenBgImg.src = event.target.result;
                modalFullscreenBgImg.classList.remove('hidden');
                modalFullscreenBgVideo.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
        fullscreenBgReset = false;
        editSongModalUnsaved.classList.remove('hidden');
    }
};

resetAlbumCoverBtn.onclick = () => {
    modalSongAlbumCover.src = 'https://torok.ing/songplayer/image/genericalbumcover.jpg';
    albumCoverReset = true;
    changeAlbumCoverInput.value = '';
    editSongModalUnsaved.classList.remove('hidden');
};

resetFullscreenBgBtn.onclick = () => {
    modalFullscreenBgImg.src = randomFullscreenBg();
    modalFullscreenBgImg.classList.remove('hidden');
    modalFullscreenBgVideo.classList.add('hidden');
    fullscreenBgReset = true;
    changeFullscreenBgInput.value = '';
    editSongModalUnsaved.classList.remove('hidden');
};

changePlaylistCoverBtn.onclick = () => changePlaylistCoverInput.click();

resetPlaylistCoverBtn.onclick = () => {
    modalPlaylistCover.src = 'https://torok.ing/songplayer/image/allsongsart.jpg';
    playlistCoverReset = true;
    changePlaylistCoverInput.value = '';
    editPlaylistModalUnsaved.classList.remove('hidden');
};

changePlaylistCoverInput.onchange = () => {
    if (changePlaylistCoverInput.files && changePlaylistCoverInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            modalPlaylistCover.src = e.target.result;
        };
        reader.readAsDataURL(changePlaylistCoverInput.files[0]);
        playlistCoverReset = false;
        editPlaylistModalUnsaved.classList.remove('hidden');
    }
};

playlistThreeDotsBtn.onclick = (ev) => {
    const event = new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: ev.clientX,
        clientY: ev.clientY,
        button: 2
    });
    homePlaylistsCont.querySelector(`.playlist-card[data-id="${currentlyViewingPlaylist.id}"]`).dispatchEvent(event);
};

updateControlBtns()

;[editSongModal, editPlaylistModal].forEach((thing)=>{
    const tabButtons = thing.querySelectorAll('.tab-button')
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            thing.querySelectorAll('.content-panel').forEach(p => p.style.display = 'none');
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            thing.querySelector(`div[data-tab="${tabId}"]`).style.display = 'block';
        });
    });
    thing.querySelector('.close-button').onclick = () => thing.classList.add('hidden')
})

setTimeout(()=>{
    navigator.serviceWorker.register('sw.js')
    .catch(error => {
        console.log('Service Worker registration failed:', error);
    });
},1000)

window.addEventListener('message',(ev)=>{
    if (ev.data && ev.data.type === 'login_status' && ev.data.loggedIn === true) {
        fetchJsons()
    }
})

navigator.serviceWorker.onmessage = (ev) => {
    if (ev.data?.type === "PLAYER_ASSETS_UPDATED") {
        customAlert("Updates installed, refresh the page to see changes", "info")
    }
}