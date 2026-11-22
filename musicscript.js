// TODO: Add online audio streams, and fix Find Art.
/*

Skiby: JavaScript rewrite

Of course, during the rewrite, I also added the things I wanted in the music player
but never had enough motivation to vibecode. Some of the new features include:

** The ability to use skiby with or without an account!
Better download system
Restore song on page load
Song metadata extraction on upload
(5/21/2026) Control other devices
(Hopefully) Less finnicky
And probably others...

*/

/* global AccountInjection:readonly, customAlert:readonly,
          showAModal:readonly, showContextMenu:readonly */

let parseBlob;
(async ()=>{parseBlob = (await import('https://cdn.jsdelivr.net/npm/music-metadata@11.0.0/+esm')).parseBlob})()

const $ = (id) => document.getElementById(id)
// Const hell
const homePlaylistsCont = $('home-playlists-container')
const playlistsView = $('playlistSection')
const playlistList = $('playlistList')
const mainContentHolder = $('main-holder')

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
const editSongModalPlaybackSpeed = $('modalSongPlaybackSpeed')
const editSongModalPreservePitch = $('modalSongPreservePitch')
const editSongModalUnsaved = $('unsavedChangesSongModal')
const editSongModalRevertBtn = $('songModalRevertBtn')
const editSongModalSaveBtn = $('songModalSaveBtn')
const editSongModalError = $('songModalError')
const editSongModalFindBtn = $('findMetadataBtn')
const editSongModalFindBtnIcon = $('findMetadataBtnIcon')
const editSongModalFindArtBtn = $('findArtBtn')
const editSongModalFindArtBtnIcon = $('findArtBtnIcon')

const mediaModal = $('pickMediaModal')
const closeMediaModalBtn = $('closeMediaModal')
const mediaModalUnsaved = $('actionsMediaModal')
const mediaModalSelectBtn = $('mediaModalSelectBtn')
const mediaModalToolbar = $('pickMediaModalToolbar')
const mediaModalBottom = $('pickMediaModalItemList')
const mediaFileInput = $('mediaFileInput');

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
const editPlaylistModalError = $('playlistModalError')

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
const devicesBtn = $('deviceBtn')
const devicesIndicator = $('deviceIndicator')
const devicesPopup = $('devicePopup')
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
const headphoneBtn = $('headphoneBtn')
const listenerCount = $('listenerCount')

const sidebar = $('sidebar')
const sidbarOberlay = $('overlay')

const playlistHeaderSelected = $('playlist-header-selected')
const playlistHeaderItemCount = $('playlist-header-item-count')
const playlistHeaderFindDrop = $('playlist-header-find-metadata-btn')
const playlistHeaderRemoveDrop = $('playlist-header-delete-btn')
const playlistHeaderDoneBtn = $('playlist-header-done-btn')

const uploadArea = $('onlineUploadArea')
const songList = $('onlinePlaylist')

const upNextContainer = $('upNextContainer');
const upNextSongTitle = $('upNextSongTitle');
const upNextSongArtist = $('upNextSongArtist');
const upNextAlbumArt = $('upNextAlbumArt');

const contextMenu = $('customContextMenu');

const footer = document.querySelector('.footer');

const devicesBackBtn = $('backChevron');
const devicesList = $('deviceList');
const devicesText = $('no-devices')

const listenAlongPopup = $('listenAlongPopup')
const listenAlongTextbox = $('listenAlongTextbox')
const createLinkBtn = $('createLinkBtn')

const genericBackgroundImages = [
	'https://torok.ing/songplayer/image/img6.jpg',
	'https://torok.ing/songplayer/image/img12.jpg',
	'https://torok.ing/songplayer/image/img11.jpg',
	'https://torok.ing/songplayer/image/img10.jpg',
	'https://torok.ing/songplayer/image/img9.jpg',
	'https://torok.ing/songplayer/image/img8.jpg',
	'https://torok.ing/songplayer/image/img7.jpg',
];

const popups = {
    devices: {
        popup: devicesPopup,
        button: devicesBtn,
        placement: 'top',
        percentX: 75
    }, 
    addPlaylist: {
        popup: addPlaylistPopup,
        button: addPlaylistBtn,
        placement: 'bottom',
        percentX: 12.5
    },
    listenAlong: {
        popup: listenAlongPopup,
        button: headphoneBtn,
        placement: 'top',
        percentX: 90
    }
}

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
    "miniplayer": true,
    "connectToWs": false,
    "publicStream": false,
    "canControlThisDeviceFromWs": false,
    "discordRPC": false,
    "showListenAlongOnRPC": false,
    "customThemeColor": "#808080",
    "themeMode": "dark",
    "font": "default",
    "playerControlPosition": "default"
}
Prefrences.publicStream = false;

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

let selectingSongs = false;
let selectedSongIds = new Set();

let onlineActionsQueue = JSON.parse(localStorage.getItem('onlineActionsQueue')) || [];
let failedOnlineActionsQueue = [];

let albumCoverReset = false;
let fullscreenBgReset = false;
let playlistCoverReset = false;

let currentTrackEffectiveTime = 0;
let trackResumeTime = 0;

let ws = {
    ws: null,
    connectedUser: null
};
let wsBackoff = 1000
let nextMsgId = 1;
let deviceId = null;
let firstConnectToDevice = false;
let initialTimePositionReq = false;

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
            audio.onloadedmetadata = () => {
                audio.currentTime = prev.position || 0;
                updateProgress(true)
                audio.onloadedmetadata = null
            };
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
        fetch('https://torok.ing/songplayer/songs.json', {credentials: 'include'}).then(a=>a.json()),
        fetch('https://torok.ing/songplayer/playlists.json', {credentials: 'include'}).then(a=>a.json())
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
        /*playlists = playlists.map((p2,i)=>{
            if (!arraysEqual(p2.song_ids, p[i].song_ids)) {
                // Conflict! In future ask user if they want to keep their version or the server version
            }
            return { ...p2, ...p[i] }
        })*/
        playlists = p;
        // Todo: fix playlists merging
        init()
    })
}

function afterLogin(id) {
    loggedIn = true;
    userid = id;
    fetchJsons();
    headphoneBtn.classList.remove('hidden')
    connectWs()
}

fetch('https://torok.ing/auth/test', {credentials: 'include'}).then(a=>a.json()).then(res=>{
    if (res.loggedIn || location.host === 'powop.cfd') 
        afterLogin(res.id);    
    else {
        songs = songs.filter(s=>songsOnDevice.has(s.id))
        init()
    }
})

window.addEventListener('message',(ev)=>{
    const data = ev.data;
    if (data.type === 'login_success')
        afterLogin(data.id);
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
    const songsInPlaylist = playlist.song_ids.map(id => songs.find(s => s.id === id)).filter(Boolean);
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
                if (selectingSongs) return;
                ev.preventDefault();
                if (currentDraggedIndex === null || currentDraggedIndex === index) return;
                const temp = playlist.song_ids[currentDraggedIndex];
                playlist.song_ids[currentDraggedIndex] = playlist.song_ids[index];
                playlist.song_ids[index] = temp;
                selectPlaylist(currentlyViewingPlaylist.id)
            }
        } 

        const trackCheckbox = createEl('input','track-checkbox')
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
        trackCheckbox.type = 'checkbox'
        if (!selectingSongs) trackCheckbox.classList.add('hidden')
        else li.style.gridTemplateColumns = '20px 40px 3fr 2fr 150px 50px 30px';
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
            if (selectingSongs) {
                trackCheckbox.checked = !trackCheckbox.checked
                selectedSongUpdate(song.id, trackCheckbox.checked)
                return;
            }
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

        li.appendChild(trackCheckbox)
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

function getLogicalTrackLength(song) {
    const trackSpeed = song.speed?.playbackRate || 1
    const dictionaryLength = parseTimeToSeconds(song["length"]);
    return dictionaryLength / trackSpeed
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
	if (!audio.src && !firstConnectToDevice)
        return startPlayback(songs[0].id, playlists[0])
    if (firstConnectToDevice) {
        initialTimePositionReq = true;
        sendWsMessage({type:"request",k:"timePosition"})
        return;
    }
    audio.play().then(()=>{
        navigator.mediaSession.playbackState = 'playing';
        updatePlayPauseButton();
    })
}

document.addEventListener('mousedown',()=>{
    if (firstConnectToDevice) playTrack()
}, {once:true})

async function getUpNextTrack(del) {
    if (ws.connectedUser) return {}
    if (manualQueue[0]) {
        if (del) return manualQueue.splice(0,1)[0]
        return manualQueue[0]
    }
    if (isShuffle) {
        while (queue.length && queue[0].skip) { 
            queue.splice(0,1) 
        }
        let song = queue[0];
        if (!song) return {}
        if (songsOnDevice.has(song.id)) song = await getIdFromDb(song.id)
        if (del) queue.splice(0,1)[0]
        return song;
    }
    const set = new Set(currentlyPlayingPlaylist.song_ids)
    const playlist = songs.filter(s=>set.has(s.id) && (songsOnDevice.has(s.id) || navigator.onLine))
    const idx = playlist.findIndex(i=>i.id===currentlyPlayingSong.id)+1
    if (idx === -1) return {}
    let song = playlist[idx]
    if (!song) return {}
    if (songsOnDevice.has(song.id)) song = await getIdFromDb(song.id)
    return song
}

async function updateProgress(once) {
    const elapsed = audio.currentTime / audio.playbackRate;
    currentTimeSpan.innerText = formatTime(elapsed);
    fullscreenCurrentTime.innerText = formatTime(elapsed);

    const percent = audio.currentTime / audio.duration * 100
    progressBar.value = percent;
    fullscreenProgressBar.value = percent;

    const upNextTrack = await getUpNextTrack(false)
    if (repeatMode !== 2 && upNextTrack && (audio.duration - audio.currentTime <= 15)) {
        upNextSongTitle.innerText = upNextTrack.title;
        upNextSongArtist.innerText = upNextTrack.artist;
        if (!upNextAlbumArtBlobUrl) upNextAlbumArtBlobUrl = getAlbumCoverForTrack(upNextTrack) // Sometimes not a blob btw
        upNextAlbumArt.src = upNextAlbumArtBlobUrl;
        upNextContainer.classList.remove('hidden');
    } else upNextContainer.classList.add('hidden');

    if (audio.paused) return;
    if (once === true) return;
    requestAnimationFrame(updateProgress);
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

audio.onplaying = () => {
    trackResumeTime = new Date() - (audio.currentTime * 1000);
    updateProgress();
}

audio.onended = () => {
	if (repeatMode === 2) playTrack();
    else nextBtn.click();
}

function pauseTrack() {
	if (!audio.paused) audio.pause();
	navigator.mediaSession.playbackState = 'paused';
	updatePlayPauseButton();
}

function updatePlayPauseButton() {
    if (!ws.connectedUser && ws.ws && ws.ws.readyState === WebSocket.OPEN) sendControlUpdate("pause", audio.paused)
	if (audio.paused) {
		playPauseBtnImg.src = 'https://torok.ing/songplayer/icons/play.svg';
		fullscreenPlayPauseBtnImg.src = 'https://torok.ing/songplayer/icons/play.svg';
	} else {
		playPauseBtnImg.src = 'https://torok.ing/songplayer/icons/pause.svg';
		fullscreenPlayPauseBtnImg.src = 'https://torok.ing/songplayer/icons/pause.svg';
	}
}

async function checkForOnlineChange(song) {
    if (!songsOnDevice.has(song.id)) return;
    const songInSongs = songs.find(s=>s.id === song.id)
    if (!songInSongs) {
        songStatuses[song.id] = "local"
        await deleteSong(song.id) // would just making song local be better? the song was deleted on the server anyway
        selectPlaylist(currentlyViewingPlaylist.id)
        return;
    };
    if (new Date(songInSongs.modified) > new Date(song.modified) && navigator.onLine) {
        removeSongMediaFromDevice(song.id)
        downloadSongForOfflineUse(song.id)
    }
}

function getAudioForTrack(song) {
    if (typeof song.filename === "string" && song.filename.startsWith('http'))
        return song.filename
    if (!song.filename) return null;
    if (songsOnDevice.has(song.id))
        return URL.createObjectURL(song.filename)
    if (ws.connectedUser)
        return 'https://torok.ing/songplayer/public/' + song.filename
    return 'https://torok.ing/songplayer/songs/' + song.filename
}

function getAlbumCoverForTrack(song) {
    if (typeof song.album_cover === "string" && song.album_cover.startsWith('http'))
        return song.album_cover
    if (!song.album_cover) 
        return 'https://torok.ing/songplayer/image/genericalbumcover.jpg'
    if (songsOnDevice.has(song.id)) 
        return URL.createObjectURL(song.album_cover)
    if (ws.connectedUser) 
        return 'https://torok.ing/songplayer/public/' + song.album_cover
    return 'https://torok.ing/songplayer/albumcovers/' + song.album_cover
}

const randomFullscreenBg = () => genericBackgroundImages[Math.floor(Math.random() * genericBackgroundImages.length)]
function getFullscreenBgForTrack(song) {
    if (typeof song.fullscreenbg === "string" && song.fullscreenbg.startsWith('http'))
        return song.fullscreenbg
    if (!song.fullscreenbg) return randomFullscreenBg();
    if (songsOnDevice.has(song.id)) 
        return URL.createObjectURL(song.fullscreenbg)
    if (ws.connectedUser) 
        return 'https://torok.ing/songplayer/public/' + song.fullscreenbg
    return 'https://torok.ing/songplayer/images/' + song.fullscreenbg
}

function updateCurrentlyPlayingUI(song) {
    let audioSrc = getAudioForTrack(song)
    let albumCoverSrc = getAlbumCoverForTrack(song)

    currentlyPlayingSong = song;
    currentTrackEffectiveTime = getLogicalTrackLength(song)
    updateMetadataWs(song.id);
    highlightCurrentPlaying()

    totalTimeSpan.innerText = formatTime(currentTrackEffectiveTime) || '0:00'
    fullscreenTotalTime.innerText = formatTime(currentTrackEffectiveTime) || '0:00'
    currentTimeSpan.innerText = '-:--'
    fullscreenCurrentTime.innerText = '-:--'

    progressBar.value = 0
    fullscreenProgressBar.value = 0

    audio.src = audioSrc;
    audio.preservesPitch = song.speed?.preservePitch ?? true;
    audio.playbackRate = song.speed?.playbackRate || 1;
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

    navigator.mediaSession.setActionHandler('play', () =>  playPauseBtn.click());
    navigator.mediaSession.setActionHandler('pause', () =>  playPauseBtn.click());
    navigator.mediaSession.setActionHandler('previoustrack', () => prevBtn.click());
    navigator.mediaSession.setActionHandler('nexttrack', () => nextBtn.click());
    navigator.mediaSession.setActionHandler('stop', () => { pauseTrack(); audio.currentTime = 0; });
    navigator.mediaSession.setActionHandler('seekto', (details) => audio.fastSeek(details.seekTime));

    playlistList.querySelector('.playing-playlist')?.classList.remove('playing-playlist')
    if (!ws.connectedUser)
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
        },
        {
            name: "Playback",
            icon: "fa-music",
            content: [
                {
                    label: "Sync Fullscreen BG video with song",
                    type: "toggle",
                    default: Prefrences.syncVideo,
                    onAction: (sel) => changeSetting("syncVideo",sel)
                },                
                {
                    label: "Always use generic fullscreen backgrounds",
                    type: "toggle",
                    default: Prefrences.alwaysGenericBg,
                    onAction: (sel) => changeSetting("alwaysGenericBg",sel)
                },
                {
                    label: "Normalize volume between songs",
                    type: "toggle",
                    default: Prefrences.normalizeVolume,
                    onAction: (sel) => changeSetting("normalizeVolume",sel)
                }
            ]
        },
        {
            name: "Online",
            icon: "fa-cloud",
            content: [
                {
                    label: "Connect to Listen Along server",
                    type: "toggle",
                    default: Prefrences.connectToWs,
                    onAction: (sel) => changeSetting("connectToWs",sel)
                },
                {
                    label: "Allow controlling this device from connected devices",
                    type: "toggle",
                    default: Prefrences.canControlThisDeviceFromWs,
                    onAction: (sel) => changeSetting("canControlThisDeviceFromWs",sel)
                },
             ]
        },
        {
            name: "Integrations",
            icon: "fa-puzzle-piece",
            content: [
                {
                    label: "Discord Rich Presence",
                    type: "toggle",
                    default: Prefrences.discordRPC,
                    onAction: (sel) => changeSetting("discordRPC",sel)
                },
                {
                    label: "Show listen along option on Discord Rich Presence",
                    type: "toggle",
                    moreInfo: "Requires connection to WebSocket and public stream to be enabled",
                    default: Prefrences.showListenAlongOnRPC,
                    onAction: (sel) => changeSetting("showListenAlongOnRPC",sel)
                }
             ]
        },
        {
            name: "Customization",
            icon: "fa-paintbrush",
            content: [
                {
                    label: "Custom theme color",
                    type: "color",
                    default: Prefrences.customThemeColor,
                    onAction: (sel) => changeSetting("customThemeColor",sel)
                },
                {
                    label: "Theme mode",
                    type: "dropdown",
                    options: [
                        { label: "Dark", value: "dark" },
                        { label: "Light", value: "light" },
                    ],
                    default: Prefrences.themeMode,
                    onAction: (sel) => changeSetting("themeMode",sel)
                },
                {
                    label: "Font",
                    type: "dropdown",
                    options: [
                        { label: "Default", value: "Roboto" },
                        { label: "Open Sans", value: "Open Sans" },
                        { label: "Lato", value: "Lato" },
                        { label: "Montserrat", value: "Montserrat" },
                        { label: "Inter", value: "Inter" },
                        { label: "Nunito", value: "Nunito" },
                        { label: "Source Sans 3", value: "Source Sans 3" }
                    ],
                    default: Prefrences.font,
                    onAction: (sel) => changeSetting("font",sel)
                },
                {
                    label: "Player control position",
                    type: "dropdown",
                    options: [
                        { label: "Default", value: "default" },
                        { label: "Classic", value: "classic" }
                    ],
                    default: Prefrences.playerControlPosition,
                    onAction: (sel) => changeSetting("playerControlPosition",sel)
                }
             ]
        }
    ])
}

headphoneBtn.onclick = () => {
    listenAlongPopup.classList.toggle('hidden');
    positionPopupOverElement("listenAlong");
}
createLinkBtn.onclick = () => {
    if (!ws.ws || ws.ws.readyState !== WebSocket.OPEN) return customAlert("Please connect to Listen Along server!", "error")
    if (listenAlongTextbox.value) {
        navigator.clipboard.writeText(listenAlongTextbox.value).then(()=>{
            createLinkBtn.innerText = "Copied!"
            setTimeout(() => {
                createLinkBtn.innerText = "Copy Link"
            }, 2000);
        }).catch(e=>{
            customAlert("Couldn't write the link to clipboard, copy it yourself would you?", "error")
        })
        return
    }
    changeSetting("publicStream", true)
    listenAlongTextbox.value = `${location.origin}${location.pathname}?li=${userid}:${deviceId}`
    listenerCount.classList.remove('hidden')
    createLinkBtn.click();
}

function changeSetting(val,mode){
    if (!mode) mode = Prefrences[val]
    Prefrences[val] = mode
    if (val === "customThemeColor" || val === "themeMode" || val === "font") {
        changeThemeColor(Prefrences.customThemeColor, Prefrences.font, Prefrences.themeMode === "dark")
    }
    if (val === "playerControlPosition") {
        const location = mode === "default" ? document.body : mainContentHolder
        location.appendChild(footer)
    }
    if (val === "connectToWs") {
        if (mode) connectWs()
        else ws.ws?.close()
    }
    if (val === "publicStream" || val === "canControlThisDeviceFromWs" || val === "discordRPC")
        sendWsMessage({
            type: "settings_update",
            k: val,
            v: mode
        })
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
    if (!ws.connectedUser && ws.ws && ws.ws.readyState === WebSocket.OPEN) {
        sendControlUpdate("shuffleMode", isShuffle)
        sendControlUpdate("repeatMode", repeatMode)
    }

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
fullscreenProgressBar.oninput = () => {
    progressBar.value = fullscreenProgressBar.value
    progressBar.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true, target: fullscreenProgressBar }));
}
function sendSendControlUpdate(action, value) {
    sendWsMessage({ type: "send_control_update", action, value }).catch(e=>{
        customAlert(e, "error")
    });
}

function setActionHandlers() {
prevBtn.onclick = () => {
    if (ws.connectedUser) return sendSendControlUpdate("prev", null)
    audio.currentTime = 0
    updateProgress(true)
}
playPauseBtn.onclick = () => {
    if (ws.connectedUser) return sendSendControlUpdate("playpause", null)
    if (audio.paused) playTrack()
    else pauseTrack()
    if (Prefrences.syncVideo && fullscreenBackgroundVideo.src && currentlyPlayingSong.fullscreenbg.match(/\.(mp4|webm|mov)$/i))
        fullscreenBackgroundVideo[audio.paused ? 'pause' : 'play']()
}
nextBtn.onclick = async () => {
    if (ws.connectedUser) return sendSendControlUpdate("next", null)
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
    } else updatePlayPauseButton()
}
shuffleBtn.onclick = () => {
    if (ws.connectedUser) return sendSendControlUpdate("shuffle", null)
    if (isShuffle) isShuffle = 0
    else isShuffle = 1;
    updateControlBtns()
    initializeShuffleQueue();
}
repeatBtn.onclick = () => {
    if (ws.connectedUser) return sendSendControlUpdate("repeat", null)
    repeatMode++;
    if (repeatMode === 3) repeatMode = 0;
    updateControlBtns()
}
progressBar.oninput = () => {
    const val = (progressBar.value / 100) * audio.duration
    if (ws.connectedUser) return sendSendControlUpdate("timePosition", val)
    else sendControlUpdate("timePosition", val)
    audio.currentTime = val
    updateProgress(true)
    if (Prefrences.syncVideo && fullscreenBackgroundVideo.src && currentlyPlayingSong.fullscreenbg.match(/\.(mp4|webm|mov)$/i))
        fullscreenBackgroundVideo.currentTime = val
}
devicesBtn.onclick = () => {
    devicesPopup.classList.toggle('hidden');
    positionPopupOverElement("devices");
}
volumeSlider.oninput = () => {
    if (ws.ws) {
        if (ws.connectedUser) return sendSendControlUpdate("volume", volumeSlider.value)
        else sendControlUpdate("volume", volumeSlider.value)
    }
    audio.volume = volumeSlider.value
}
fullscreenBtn.onclick = () => {
    fullscreenPlayer.requestFullscreen();
    setFullscreenBg(currentlyPlayingSong)
    fullscreenPlayer.classList.remove('hidden')
}
}
setActionHandlers()

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

function dropEvent(ev) {
    ev.preventDefault();
    if (ev.dataTransfer.files.length === 0) return;
    const ids = addSongsFromFiles(ev.dataTransfer.files)
    if (currentlyViewingPlaylist.id !== "all songs") {
        addSongsToPlaylist(ids, currentlyViewingPlaylist.id)
    }
    else selectPlaylist(currentlyViewingPlaylist.id)
}
uploadArea.ondragover = (ev) => ev.preventDefault();
uploadArea.ondrop = dropEvent
songList.ondragover = (ev) => ev.preventDefault();
songList.ondrop = dropEvent

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

// ai function but whatever i got lazy
function positionPopupOverElement(popupName) {
    const { button, popup, placement, percentX } = popups[popupName];
    if (popup.classList.contains('hidden')) return;

    const buttonRect = button.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;

    // If percentX is provided, position the popup so that the percentX point across the
    // popup width lines up with the button center (e.g. percentX = 12.5 aligns triangle with button).
    let left;
    if (typeof percentX === 'number' && !Number.isNaN(percentX)) {
        left = buttonCenterX - (percentX / 100) * popupRect.width;
        left = Math.max(8, Math.min(left, window.innerWidth - popupRect.width - 8));
    } else {
        left = buttonCenterX - popupRect.width / 2;
        left = Math.max(8, Math.min(left, window.innerWidth - popupRect.width - 8));
    }

    let top;
    if (placement === 'bottom') {
        top = buttonRect.bottom + 8;
        popup.style.setProperty('--popup-arrow-before-display', 'block');
        popup.style.setProperty('--popup-arrow-after-display', 'none');
    } else {
        top = buttonRect.top - popupRect.height - 8;
        popup.style.setProperty('--popup-arrow-before-display', 'none');
        popup.style.setProperty('--popup-arrow-after-display', 'block');
    }

    if (top < 8 && placement === 'top') {
        top = buttonRect.bottom + 8;
        popup.style.setProperty('--popup-arrow-before-display', 'block');
        popup.style.setProperty('--popup-arrow-after-display', 'none');
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;

    let arrowLeft;
    if (typeof percentX === 'number' && !Number.isNaN(percentX)) {
        // arrowLeft measured from popup left; center arrow (20px wide) on percentX of popup width
        arrowLeft = (percentX / 100) * popupRect.width - 10;
    } else {
        // default: align arrow with button center
        arrowLeft = buttonCenterX - left - 10;
    }
    arrowLeft = Math.min(Math.max(arrowLeft, 12), popupRect.width - 22);
    popup.style.setProperty('--popup-arrow-left', `${arrowLeft}px`);
}

addPlaylistBtn.onclick = () => {
    addPlaylistPopup.classList.toggle('hidden');
    newPlaylistNameInput.value = "";
    positionPopupOverElement("addPlaylist");
}

window.addEventListener('resize', () => {
    Object.keys(popups).forEach(positionPopupOverElement);
});

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
    if (!isPersisted) await navigator.storage.persist();
}

function addSongsFromFiles(files) {
    const ids = []
    requestPersistentStorage();
    for (const file of files) {
        if (!file.type.startsWith('audio/')) continue;
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
        if (item.owner === userid) {
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
    if (!loggedIn) return;
    onlineActionsQueue.push({type, data, owner: userid})
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
        if (playlistid !== "all songs") queueAction("update_playlist", playlist.id)
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

function removeSongFromPlaylist(songids, playlistid) {
    const playlist = playlists.find(p=>p.id === playlistid)
    if (!playlist) return;
    if (Array.from(songids).some(id=>songStatuses[id] !== "local") && !navigator.onLine) {
        customAlert("One or more songs you're trying to remove from " + playlist.name + " are not available offline. Connect to the World Wide Web to remove it.", "error")
        return;
    }
    playlist.song_ids = playlist.song_ids.filter(id=>!songids.has(id))
    if (playlistid === currentlyViewingPlaylist.id) selectPlaylist(playlistid)
    queueAction("update_playlist", playlist.id)
}

async function deleteSong(id) {
    return new Promise(async (res, rej) => {
        if (songStatuses[id] !== "local" && !navigator.onLine) {
            return rej("Connect to the World Wide Web to delete this song")
        } 

        function deleteFromDevice() {
            songs.splice(songs.findIndex(s=>s.id === id),1)
            const transaction = db.transaction('songs','readwrite')
            transaction.objectStore('songs').delete(id)
            songsOnDevice.delete(id)
            delete songStatuses[id]
            playlists.forEach(p=>{
                p.song_ids = p.song_ids.filter(sid=>sid !== id)
            })
            res()
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
                } else {
                    rej(data.error)
                }
            }).catch(err=>{
               rej(err)
            })
        } else deleteFromDevice();
    })
}

function startDeleteSongs(ids) {
    const body = createEl('div')
    body.innerText = "Are you sure you want to delete " + (ids.length > 1 ? ids.length + " songs" : "this song") + "? This action cannot be undone."
    showAModal("Delete Song" + (ids.length > 1 ? "s" : ""), body, {
        okButtonAction: async () => {
            await Promise.all(ids.map(id => deleteSong(id)));
            selectPlaylist(currentlyViewingPlaylist.id)
        },
        buttons: true
    })
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
    return new Promise((resolveFuncBtwFuncMeansFunction, rej) => {
        const formData = new FormData();
        formData.append('file', file)
        formData.append("upload_type", type)
        other.forEach(o=>formData.append(o.name, o.value))

        fetch('https://torok.ing/songplayer/', {
            method: 'POST',
            body: formData
        }).then(async res=>{
            if (!res.ok) {
                return rej("Server error")
            }
            const data = await res.json()
            if (data.success) {
                const filename = data.data.filename || data.data.split('/').pop();
                resolveFuncBtwFuncMeansFunction(filename)
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
            songStatuses[id] = "downloaded"
            updateSongStatusIcon(id, 'local')
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
            fetch('https://torok.ing/songplayer/songs/' + song.filename, {credentials: 'include'}).then(res=>res.blob()),
            song.album_cover ? fetch('https://torok.ing/songplayer/albumcovers/' + song.album_cover, {credentials: 'include'}).then(res=>res.blob()) : null,
            song.fullscreenbg ? fetch('https://torok.ing/songplayer/images/' + song.fullscreenbg, {credentials: 'include'}).then(res=>res.blob()) : null
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
        extraControls.appendChild(devicesBtn)
        extraControls.appendChild(devicesPopup)
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
        changeSetting("playerControlPosition", Prefrences.playerControlPosition);
        setActionHandlers();
    }
}

document.onvisibilitychange = () => {
    if (document.hidden && Prefrences.miniplayer && !audio.paused) openMiniplayer();
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

    let isVideo;
    if (typeof song.fullscreenbg === 'object' && song.fullscreenbg instanceof Blob) {
        isVideo = song.fullscreenbg.type.startsWith('video/')
    } else {
        isVideo = song.fullscreenbg && song.fullscreenbg.match(/\.(mp4|webm|mov)$/i)
    }

    if (isVideo) {
        nextBgDiv.style.backgroundImage = 'none';
        fullscreenBackgroundVideo.classList.remove('hidden')
        fullscreenBackgroundVideo.src = fullscreenBgUrl;

        nextBgDiv.appendChild(fullscreenBackgroundVideo);

        async function play() {
            if (Prefrences.syncVideo) {
                const currentTime = audio.currentTime;
                if (Math.abs(fullscreenBackgroundVideo.currentTime - currentTime) > 0.5) {
                    fullscreenBackgroundVideo.currentTime = currentTime;
                }
                if (!audio.paused) fullscreenBackgroundVideo.play()
            }
            else fullscreenBackgroundVideo.play();
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

async function openMediaModal(type) {
    return new Promise(res=>{
        closeMediaModalBtn.onclick = () => {
            pickMediaModal.classList.add('hidden')
            res(null)
        }
        actionsMediaModal.classList.add('hidden')
        pickMediaModal.classList.remove('hidden')
        mediaModalBottom.innerHTML = '<p>Loading...</p>'
        mediaModalToolbar.innerHTML = '<span>Root</span>'
        
        let selectedItem = null
        mediaModalSelectBtn.onclick = () => {
            pickMediaModal.classList.add('hidden')
            res(selectedItem.dataset.filename)
        }

        const createLink = (text, action) => {
            const link = createEl('a')
            link.innerText = text
            link.href = "javascript:void(0)"
            link.onclick = () => {
                if (Array.from(mediaModalToolbar.children).at(-1) === link) return;
                let next = link.nextSibling
                while (next) {
                    const toRemove = next
                    next = next.nextSibling
                    toRemove.remove()
                }
                action?.()
            }
            const img = new Image()
            img.src = "https://torok.ing/songplayer/icons/chevron_right.svg"
            mediaModalToolbar.appendChild(img)
            mediaModalToolbar.appendChild(link)
        }

        const start = async (t, json, albumName, addLink = true) => {
            if (t) {
                if (!json) {
                    const res = await fetch('https://torok.ing/songplayer/media/' + t)
                    json = await res.json()
                }
                if (addLink) {
                    createLink(albumName || t, () => {
                        start(t, json, null, false)
                    })
                }

                if (t==="albumcovers") {
                    let dataForRender = []
                    if (!albumName) {
                        const albums = {};

                        Object.values(json).forEach(v => {
                            Object.entries(v.used_in_albums).forEach(([album, info]) => {
                                if (info.default) albums[album] = "albumcovers/" + v.filename;
                                else albums[album] ??= "image/genericalbumcover.jpg";
                            });
                        });

                        dataForRender = Object.entries(albums).map(([album, filename]) => ({
                            original_filename: album,
                            filename,
                            action: () => start(t, json, album)
                        }))

                        dataForRender.unshift({
                            original_filename: "All Album Covers",
                            filename: "image/genericalbumcover.jpg",
                            action: () => start(t, json, "All Album Covers")
                        })
                        
                        return renderData(dataForRender)
                    } else if (albumName === "All Album Covers") {
                        dataForRender = Object.values(json).map(v => ({
                            original_filename: v.original_filename,
                            filename: "albumcovers/" + v.filename
                        }));

                        dataForRender.unshift({
                            original_filename: "Upload",
                            filename: "image/upload.svg",
                            action: () => {
                                mediaFileInput.accept = "image/*";
                                mediaFileInput.click();
                                mediaFileInput.onchange = async () => {
                                    if (mediaFileInput.files.length === 0) return;
                                    const file = mediaFileInput.files[0];
                                    try {
                                        const filename = await uploadMedia(file, "album_cover");
                                        json[filename] = {
                                            original_filename: filename,
                                            filename,
                                            used_in_albums: {}
                                        };
                                        start(t, json, albumName, false);
                                    } catch (err) {
                                        customAlert(err.error || "Error uploading album cover", "error");
                                    }
                                };
                            }
                        });
                    
                        renderData(dataForRender)
                    } else if (albumName) {
                        renderData(Object.values(json)
                            .filter(v => albumName in v.used_in_albums)
                            .map(v => ({
                                original_filename: v.original_filename,
                                filename: "albumcovers/" + v.filename
                        })))
                    }
                } else {
                    json = Object.values(json)
                    json = json.map(v=>{
                        return {
                            ...v,
                            filename: t + '/' + v.filename
                        }
                    })
                    renderData(json)
                }
            } else {
                renderData()
            }
        }

        const renderData = (items) => {
            actionsMediaModal.classList.add('hidden')
            if (items) {
                items.sort((a,b)=>{
                    const dateA = new Date(a.date_uploaded)
                    const dateB = new Date(b.date_uploaded)
                    return dateB - dateA;
                });
            } else {
                mediaModalToolbar.innerHTML = '<a>Root</a>';
                const a = mediaModalToolbar.querySelector('a')
                a.href = "javascript:void(0)"
                a.onclick = () => renderData()
                items = [
                    {
                        original_filename: "Songs",
                        filename: "icons/songs.svg",
                        action: ()=>{start("songs")}
                    },
                    {
                        original_filename: "Album Covers",
                        filename: "icons/albumcovers.svg",
                        action: ()=>{start("albumcovers")}
                    },
                    {
                        original_filename: "Playlist Covers",
                        filename: "icons/playlistarts.svg",
                        action: ()=>{start("playlistarts")}
                    },        
                    {
                        original_filename: "Fullscreen Bgs",
                        filename: "icons/images.svg",
                        action: ()=>{start("songs")}
                    },
                ]
            }
            mediaModalBottom.innerHTML = ''
            items.forEach(itemData=>{
                const item = createEl('div','media-item')
                const img = new Image()
                const span = createEl('span')
                span.innerText = itemData.original_filename || itemData.filename
                img.loading = "lazy"
                img.src = itemData.filename
                item.dataset.filename = itemData.filename.split('/').at(-1)
                item.appendChild(img)
                item.appendChild(span)
                item.onclick = () => {
                    if (itemData.action) {
                        itemData.action()
                        return;
                    }
                    if (!type) return;
                    if (selectedItem) selectedItem.classList.remove('selected')
                    item.classList.add('selected')
                    selectedItem = item
                    actionsMediaModal.classList.remove('hidden')
                }
                mediaModalBottom.appendChild(item)
            })
        }

        start(type)
    })
} 

async function fetchSongMetadata(songid) {
    return new Promise((resolve, reject) => {
        fetch('https://torok.ing/songplayer/song/' + songid + '/fill_metadata').then(a=>a.json()).then(data=>{
            if (data.success) {
                resolve(data.data)
            } else {
                reject(data.data) // yes, data.data
            }
        }).catch(reject)
    })
}

async function fetchSongCoverUrls(songid) {
    return new Promise((resolve, reject) => {
        fetch('https://torok.ing/songplayer/song/' + songid + '/cover_urls').then(a=>a.json()).then(data=>{
            if (data.success) {
                Object.keys(data.data).forEach(key=>{
                    data.data[key] = data.data[key].replace('http://', 'https://')
                })
                resolve(data.data)
            } else {
                reject(data.error)
            }
        }).catch(reject)
    })
}

function updateTrackDevice(song, metadata, store) {
    if (!store) store = {};
    metadata=JSON.parse(JSON.stringify(metadata))
    Object.assign(songs.find(s => s.id === song.id), metadata);
    Object.assign(song, metadata);
    if (songsOnDevice.has(song.id)) {
        const transaction = db.transaction('songs','readwrite')
        const newObj = {
            ...song,
            modified: new Date().toISOString()
        }
        if (store.albumCoverForStore) newObj["album_cover"] = store.albumCoverForStore
        if (store.fullscreenBgForStore) newObj["fullscreenbg"] = store.fullscreenBgForStore
        transaction.objectStore('songs').put(newObj)
    }
}

async function fetchFilenamesAsBlob(urls) {
    // must be in format: [albumCoverUrl, fullscreenBgUrl] for now, u can leave one undefined but just remember the idx. holy hacky function 🙏
    let mappedUrls = ["/songplayer/albumcovers/", "/songplayer/images/"]
    return await Promise.all(urls.map((url,idx)=>{
        return new Promise(async (resolve, reject) => {
            if (!url) return resolve(url);
            try {
                const resource = await fetch(mappedUrls[idx] + url);
                const blob = await resource.blob();
                resolve(blob);
            } catch (error) {
                reject(error);
            }
        });
    }));
}

async function updateTrack(song, metadata, store) {
    return new Promise((res,rej)=>{
        if (songStatuses[song.id] !== "local") {
            fetch('https://torok.ing/songplayer/', { 
                method: 'PATCH',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    "action": "update_song",
                    "song_id": song.id,
                    "metadata": metadata
                }), 
                credentials: 'include'
            }).then(r=>r.json()).then(async data=>{
                if (data.success) {
                    const blobs = await fetchFilenamesAsBlob([data.updated_shite?.album_cover, data.updated_shite?.fullscreenbg]).catch(err=>{
                        customAlert("Error fetching resources to put in store: " + err.message + ". Data has been updated on the server but not on this device, please refresh to see changes", "error");
                    });
                    Object.entries(data.updated_shite).forEach(async ([key, value])=>{
                        metadata[key] = value;
                        if (key === "album_cover" && blobs[0] !== undefined) store.albumCoverForStore = blobs[0];
                        if (key === "fullscreenbg" && blobs[1] !== undefined) store.fullscreenBgForStore = blobs[1];
                    })
                    updateTrackDevice(song, metadata, store);
                    res()
                }
                else rej(data.error)
            }).catch(rej)
        } else {
            updateTrackDevice(song, metadata, store);
            res()
        }
    })
}

async function openEditSongModal(song) {
    const data = [
        [editSongModalTitle, song.title],
        [editSongModalArtist, song.artist],
        [editSongModalAlbum, song.album],
        [editSongModalPreservePitch, song.speed?.preservePitch],
        [editSongModalPlaybackSpeed, String(song.speed?.playbackRate)]
    ]
    const changedStuff = {}
    data.forEach(([el, val]) => {
        const property = el.type === "checkbox" ? "checked" : "value"
        el[property] = val;
        el.onchange = () => {
            changedStuff[el.id] = el[property] === val;                     
            if (Object.values(changedStuff).some(v => v === false)) {
                editSongModalUnsaved.classList.remove('hidden');
            } else {
                editSongModalUnsaved.classList.add('hidden');
            }
        }
    });
    editSongModalID.innerText = song.id;

    let albumCoverFile = null;
    let fullscreenBgFile = null;

    let foundAlbumCoverUrl = null;
    let foundFullscreenBgUrl = null;
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
        foundAlbumCoverUrl = null;
        foundFullscreenBgUrl = null;
        albumCoverFile = null;
        fullscreenBgFile = null;
        albumCoverReset = false;
        fullscreenBgReset = false;
    }

    function showError(text) {
        editSongModalError.classList.remove('hidden')
        editSongModalError.innerText = text
        editSongModalSaveBtn.disabled = false;
        editSongModalRevertBtn.disabled = false;
    }

    const isVideo = song.fullscreenbg && song.fullscreenbg.match(/\.(mp4|webm|mov)$/i); // Get it from online!
    song = songsOnDevice.has(song.id) ? await getIdFromDb(song.id) : song
    setDefaultArt()
    
    changeAlbumCoverBtn.onclick = async () => {
        if (songStatuses[song.id] !== "local") {
            const filename = await openMediaModal("albumcovers")
            if (filename) {
                modalSongAlbumCover.src = "https://torok.ing/songplayer/albumcovers/" + filename
                foundAlbumCoverUrl = filename
                albumCoverFile = null
                albumCoverReset = false
                editSongModalUnsaved.classList.remove('hidden');
            }
        } else changeAlbumCoverInput.click();
    }
    changeAlbumCoverInput.onchange = async (e) =>{
        if (e.target.files && e.target.files[0]) {
            albumCoverFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => modalSongAlbumCover.src = event.target.result;
            reader.readAsDataURL(e.target.files[0]);
            albumCoverReset = false
            foundAlbumCoverUrl = null
            editSongModalUnsaved.classList.remove('hidden');
        }
    };

    changeFullscreenBgBtn.onclick = () => changeFullscreenBgInput.click();
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
            fullscreenBgFile = file;
        }
    };

    resetAlbumCoverBtn.onclick = () => {
        modalSongAlbumCover.src = 'https://torok.ing/songplayer/image/genericalbumcover.jpg';
        albumCoverReset = true;
        foundAlbumCoverUrl = null;
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

    editSongModalUnsaved.classList.add('hidden');
    editSongModal.classList.remove('hidden')

    editSongModalRevertBtn.onclick = () => {
        data.forEach(([el, val]) => {
            const property = el.type === "checkbox" ? "checked" : "value"
            el[property] = val
        })
        setDefaultArt()
        editSongModalUnsaved.classList.add('hidden');
    }

    editSongModalSaveBtn.onclick = async () => {
        if (songStatuses[song.id] !== "local" && !navigator.onLine) return customAlert("Connect to the World Wide Web to edit this song's metadata", "error")

        editSongModalError.classList.add('hidden')
        editSongModalSaveBtn.disabled = true;
        editSongModalRevertBtn.disabled = true;

        const metadata = {
            title: editSongModalTitle.value,
            artist: editSongModalArtist.value,
            album: editSongModalAlbum.value,
            speed: {
                playbackRate: Number(editSongModalPlaybackSpeed.value),
                preservePitch: editSongModalPreservePitch.checked
            }
        }

        let albumCoverForStore =  song.album_cover
        let fullscreenBgForStore =  song.fullscreenbg

        if (foundAlbumCoverUrl) metadata.album_cover = foundAlbumCoverUrl
        if (foundFullscreenBgUrl) metadata.fullscreenbg = foundFullscreenBgUrl;
        foundAlbumCoverUrl = null;
        foundFullscreenBgUrl = null;

        if (albumCoverReset) {
            metadata.album_cover = '';
            albumCoverForStore = '';
        }
        if (fullscreenBgReset) {
            metadata.fullscreenbg = '';
            fullscreenBgForStore = ''
        }

        if (!albumCoverReset && albumCoverFile) {
            if (songStatuses[song.id] !== "local") metadata.album_cover = await uploadMedia(albumCoverFile, "album_cover").catch(showError)
            albumCoverForStore = albumCoverFile
        }
        if (!fullscreenBgReset && fullscreenBgFile) {
            if (songStatuses[song.id] !== "local")  metadata.fullscreenbg = await uploadMedia(fullscreenBgFile, "fullscreenbg").catch(showError)
            fullscreenBgForStore = fullscreenBgFile
        }

        const store = {
            albumCoverForStore, fullscreenBgForStore
        }

        updateTrack(song, metadata, store).catch(err=>customAlert(err, 'error')).finally(()=>{
            editSongModalSaveBtn.disabled = false;
            editSongModalRevertBtn.disabled = false;
            editSongModalUnsaved.classList.add('hidden');
            if (currentlyViewingPlaylist.song_ids.find(id => id === song.id)) selectPlaylist(currentlyViewingPlaylist.id);
        })
    }

    editSongModalFindBtn.onclick = () => {
        editSongModalFindBtn.classList.add('disabled')
        editSongModalFindBtnIcon.classList.add('fa-spin')
        editSongModalFindBtnIcon.classList.remove('fa-search')
        fetchSongMetadata(song.id).then(data=>{
            editSongModalTitle.value = data.title || song.title
            editSongModalArtist.value = data.artist || song.artist
            editSongModalAlbum.value = data.album || song.album
            editSongModalUnsaved.classList.remove('hidden');
        }).catch(err=>{
            customAlert(err, 'error')
        }).finally(()=>{
            editSongModalFindBtn.classList.remove('disabled')
            editSongModalFindBtnIcon.classList.remove('fa-spin')
            editSongModalFindBtnIcon.classList.add('fa-search')
        })
    }

    editSongModalFindArtBtn.onclick = () => {
        editSongModalFindArtBtn.classList.add('disabled')
        editSongModalFindArtBtnIcon.classList.add('fa-spin')
        editSongModalFindArtBtnIcon.classList.remove('fa-search')
        fetchSongCoverUrls(song.id).then(data=>{
            if (data.album_cover_url) {
                foundAlbumCoverUrl = data.album_cover_url;
                modalSongAlbumCover.src = foundAlbumCoverUrl;
                changeAlbumCoverInput.value = '';
                albumCoverFile = null;
                albumCoverReset = false;
            }
            if (data.thumbnail_url) {
                foundFullscreenBgUrl = data.thumbnail_url;
                modalFullscreenBgImg.src = foundFullscreenBgUrl;
                modalFullscreenBgVideo.classList.add('hidden');
                modalFullscreenBgImg.classList.remove('hidden');
                changeFullscreenBgInput.value = '';
                fullscreenBgFile = null;
                fullscreenBgReset = false;
            }
            editSongModalUnsaved.classList.remove('hidden');
        }).catch(err=>{
            customAlert(err, 'error')
        }).finally(()=>{
            editSongModalFindArtBtn.classList.remove('disabled')
            editSongModalFindArtBtnIcon.classList.remove('fa-spin')
            editSongModalFindArtBtnIcon.classList.add('fa-search')
        })
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

    function showError(text) {
        editPlaylistModalError.classList.remove('hidden')
        editPlaylistModalError.innerText = text
        editPlaylistModalSaveBtn.disabled = false;
        editPlaylistModalRevertBtn.disabled = false;
    }

    function setDefaultArt() {
        let artSrc = 'https://torok.ing/songplayer/image/allsongsart.jpg'
        if (pOnDevice) artSrc =  URL.createObjectURL(pOnDevice.playlist_art);
        else if (playlist.playlist_art) artSrc = 'playlistarts/' + playlist.playlist_art
        modalPlaylistCover.src = artSrc
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
            if (loggedIn) {
                metadata.playlist_art = await uploadMedia(changePlaylistCoverInput.files[0], "playlist_art").catch(showError)
            }
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

function selectedSongUpdate(songid, selected) {
    selectedSongIds[selected ? 'add' : 'delete'](songid)
    playlistHeaderItemCount.innerText = selectedSongIds.size + ' items selected'
}

function startSelectingSongs() {
    selectingSongs = true;
    playlistHeaderSelected.classList.remove('hidden')
    playlistHeaderItemCount.innerText = '0 items selected'
    document.querySelectorAll('#onlinePlaylist li').forEach(li=>{
        li.style.gridTemplateColumns = '20px 40px 3fr 2fr 150px 50px 30px'
        li.querySelector('.track-checkbox').classList.remove('hidden')
    })
}

playlistHeaderFindDrop.onclick = (ev) => {
    if (selectedSongIds.size === 0) return;
    async function metadataUpdate(t) {
        const results = await Promise.all(Array.from(selectedSongIds).map(id=>{
            return new Promise(async (res,rej)=>{
                const devSong = songsOnDevice.has(id) ? await getIdFromDb(id) : songs.find(s=>s.id === id)
                if (!devSong) return res("No song found")
                const data = await (t === "art" ? fetchSongCoverUrls(id) : fetchSongMetadata(id)).catch((err)=>err)
                if (typeof data !== "object") return res(data)
                let metadata = {
                    title: data.title,
                    artist: data.artist,
                    album: data.album,
                    album_cover: data.album_cover_url,
                    fullscreenbg: data.thumbnail_url
                }
                const store = {};
                if (data.album_cover_url) store["albumCoverForStore"] = await fetch(data.album_cover_url).then(r => r.blob()).catch(()=>{})
                if (data.thumbnail_url) store["fullscreenBgForStore"] = await fetch(data.thumbnail_url).then(r => r.blob()).catch(()=>{})
                updateTrack(devSong, metadata, store).catch(res).then(()=>res(false))
            })
        }))
        const errors = results.filter(Boolean)
        const successCount = results.length - errors.length
        customAlert(successCount + '/' + results.length + ` tracks had their ${t} updated`, 'success')
        errors.forEach(err=>{
            customAlert(err, 'error')
        })
        selectPlaylist(currentlyViewingPlaylist.id)
    }
    const items = [
        {
            label: "Find Metadata",
            icon: "fas fa-search",
            action: () => {
                metadataUpdate("metadata")
            }
        },
        {
            label: "Find Art",
            icon: "fas fa-search",
            action: () => {
                metadataUpdate("art")   
            }
        }
    ]
    showContextMenu(ev, items, ev)
}

playlistHeaderRemoveDrop.onclick = (ev) => {
    if (selectedSongIds.size === 0) return;
    const items = [
        {
            label: "Delete",
            icon: "fas fa-trash",
            danger: true,
            action: async () => {
                startDeleteSongs(Array.from(selectedSongIds))
                selectedSongIds.clear()
                playlistHeaderItemCount.innerText = '0 items selected'
            }
        }
    ]
    if (currentlyViewingPlaylist?.id !== "all songs")
        items.push({
            label: "Remove from playlist",
            icon: "fas fa-minus",
            danger: true,
            action: () => {
                removeSongFromPlaylist(selectedSongIds, currentlyViewingPlaylist.id)
                selectedSongIds.clear()
                playlistHeaderItemCount.innerText = '0 items selected'
            }
        })
    showContextMenu(ev, items, ev)
}

playlistHeaderDoneBtn.onclick = () => {
    selectingSongs = false;
    selectedSongIds.clear()
    playlistHeaderSelected.classList.add('hidden')
    document.querySelectorAll('#onlinePlaylist li').forEach(li=>{
        li.style.gridTemplateColumns = '40px 3fr 2fr 150px 50px 30px'
        const checkbox = li.querySelector('.track-checkbox')
        checkbox.classList.add('hidden')
        checkbox.checked = false
    })
}

document.addEventListener('touchend', cancel);
document.addEventListener('touchmove', cancel);
document.addEventListener('touchcancel', cancel);

document.addEventListener('mousedown',(ev)=>{
    if (ev.target.classList.contains('three-dots-button')) return;
    if (!contextMenu.contains(ev.target)) contextMenu.classList.add('hidden')
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
        base.push({
            label: "Select",
            icon: "fas fa-check",
            action: () => {
                document.querySelector('#onlinePlaylist li[data-id="' + id + '"] .track-checkbox').checked = true
                startSelectingSongs()
                selectedSongUpdate(id, true)
            }
        })
        base.push("hr")
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
        if (songStatuses[id] !== "local") {
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
                        removeSongFromPlaylist(new Set([id]), currentlyViewingPlaylist.id)
                    },
                    danger: true
                })
            }
        }
        base.push({
            label: songOwnership[id] === userid || !songOwnership[id] ? "Delete song" : "Remove from library",
            icon: "fas fa-trash",
            action: () => {
                startDeleteSongs([id])
            },
            danger: true
        })
    }
    showContextMenu(ev, base)
})

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
    if (new URLSearchParams(window.location.search).get('nosw')) return;
    if (!('serviceWorker' in navigator)) return;
    const isSkiby = /(^|\.)skiby\.app$/.test(location.hostname);
    navigator.serviceWorker.register(isSkiby ? '/sw.js' : '/songplayer/sw.js', {
        scope: isSkiby ? '/' : '/songplayer/',
        updateViaCache: 'none'
    })
    .then(registration => registration.update())
    .catch(error => {
        console.log('Service Worker registration failed:', error);
    });
},1000)

window.addEventListener('message',(ev)=>{
    if (ev.data && ev.data.type === 'login_status' && ev.data.loggedIn === true) {
        fetchJsons()
    }
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.onmessage = (ev) => {
        if (ev.data?.type === "PLAYER_ASSETS_UPDATED") {
            customAlert("Updates installed, refresh the page to see changes", "info")
        }
    }
    const reportPlayerReady = () => navigator.serviceWorker.controller?.postMessage({ type: 'PLAYER_CLIENT_READY' });
    navigator.serviceWorker.addEventListener('controllerchange', reportPlayerReady);
    navigator.serviceWorker.ready.then(reportPlayerReady);
}

// WebSocket
async function sendWsMessage(payload) {
    const sock = ws.ws
    return new Promise((resolve, reject) => {
        if (!sock || sock.readyState !== WebSocket.OPEN) {
            return reject(new Error("WebSocket is not open"));
        }

        const msgid = nextMsgId++;

        const onMessage = (ev) => {
            const resp = JSON.parse(ev.data);

            if (resp.msgid === msgid) {
                sock.removeEventListener("message", onMessage);

                if (resp.error) {
                    console.log(resp.error)
                    reject(new Error(resp.error));
                }
                else resolve(resp);
            }
        };

        sock.addEventListener("message", onMessage)

        sock.send(JSON.stringify({
            msgid,
            ...payload
        }));
    });
}
function onWsMessage(msg) {
    switch (msg.type) {
        case "metadata_update": {
            updateCurrentlyPlayingUI(msg.data)
            if (!ws.connectedUser.pause && !firstConnectToDevice) playTrack();
            if (firstConnectToDevice) customAlert("Please tap on the screen to enable sound","warning")
        } break;

        case "control_update": {
            if (ws.connectedUser) {
                ws.connectedUser[msg.k] = msg.v;
                switch (msg.k) {
                    case "pause": {
                        if (firstConnectToDevice) break;
                        if (msg.v) pauseTrack(); else playTrack(); 
                        break;
                    }
                    case "shuffleMode": isShuffle = msg.v; updateControlBtns(); break;
                    case "repeatMode": repeatMode = msg.v; updateControlBtns(); break;
                    case "timePosition": {
                        audio.currentTime = msg.v;
                        if (firstConnectToDevice && initialTimePositionReq) {
                            firstConnectToDevice = false;
                            if (!ws.connectedUser.pause) playTrack();
                        }
                        break;
                    }
                    case "volume": volumeSlider.value = msg.v; audio.volume = msg.v; break;
                }
            } else {
                switch (msg.k) {
                    case "prev": prevBtn.click(); break;
                    case "playpause": playPauseBtn.click(); break;
                    case "next": nextBtn.click(); break;
                    case "shuffle": shuffleBtn.click(); break;
                    case "repeat": repeatBtn.click(); break;
                    case "timePosition": audio.currentTime = msg.v; sendControlUpdate("timePosition", audio.currentTime); break;
                    case "volume": volumeSlider.value = msg.v; audio.volume = msg.v; break;
                }
            }
        } break;

        case "request": {
            if (msg.k === "timePosition") sendControlUpdate("timePosition", audio.currentTime);
        } break;
        
        case "listener_update": {
            listenerCount.innerText = String(msg.count)
        } break;

        case "connected": {
            deviceId = msg.deviceid;
        } break;
        case "disconnect": {
            ws.connectedUser = null;
            devicesBtn.classList.remove('active')
            devicesIndicator.classList.add('hidden')
            customAlert("The controlling device has disconnected", "info")
        } break;
    }
}
function sendControlUpdate(k,v) {
    sendWsMessage({
        type: "control_update",
        k, v
    })
    if (k==="pause")
        sendWsMessage({
            type: "control_update",
            k: "timePosition",
            v: audio.currentTime
        })
}
function connectWs() {
    if (((!Prefrences.connectToWs || !loggedIn) && !document.location.search.includes('li')) || (ws.ws && ws.ws.readyState !== WebSocket.CLOSED)) return;
    ws.ws = new WebSocket('https://torok.ing/ws/skibskib')
    const sock = ws.ws
    sock.onopen = () => {        
        console.log("The Websocket is open!")
        wsBackoff = 1000
        sock.onerror = (err) => {
            console.warn("WebSocket error: ", err)
            sock.close()
        }
        ;['publicStream','canControlThisDeviceFromWs'].forEach(k=>{
            sendWsMessage({
                type: "settings_update",
                k, 
                v: Prefrences[k]
            })
        })

        sendControlUpdate("pause", audio.paused)
        sendControlUpdate("shuffleMode", isShuffle)
        sendControlUpdate("repeatMode", repeatMode)
        sendControlUpdate("volume", audio.volume)
        refreshDeviceList();
        updateMetadataWs(currentlyPlayingSong?.id)
        
        const params = new URLSearchParams(document.location.search);
        const li = params.get('li');
        if (li) {
            const data = li.split(":")
            startSubscribeToDevice(data[0], data[1])
        }
    }
    sock.onmessage = (ev) => {
        onWsMessage(JSON.parse(ev.data))
    }
    sock.onclose = () => {
        console.log("Websocket is closed")
        createLinkBtn.innerText = "Create Link"
        listenAlongTextbox.value = ""
        listenerCount.innerText = "0"
        listenerCount.classList.add('hidden')
        setTimeout(() => {
            wsBackoff += 3000
            if (wsBackoff > 15000) wsBackoff = 15000
            connectWs();
        }, wsBackoff)
    }
}
async function updateMetadataWs(songid) {
    const metadata = songs.find(s=>s.id === songid)
    if (!metadata) return;
    const sockOpen = ws.ws && ws.ws.readyState === WebSocket.OPEN
    if (!sockOpen || ws.connectedUser) return;
    let metadataToSend = {...metadata, sendTime: new Date().getTime(), currentProgress: audio.currentTime}
    if (songStatuses[metadata.id] === "local") {
        sendWsMessage({
            type: "metadata_update",
            metadata: {...metadataToSend, localSong: true}
        })
        return
    }
    const map = {
        filename: "songs",
        album_cover: "albumcovers",
        fullscreenbg: "images"
    }
    await Promise.all(["filename","album_cover","fullscreenbg"].map(async k => {
        const resp = await sendWsMessage({
            type: "create_public_file",
            folder: map[k],
            filename: metadata[k]
        }).catch(()=>null)
        metadataToSend[k] = resp?.url || ""
    }))
    sendWsMessage({
        type: "metadata_update",
        metadata: metadataToSend
    })
}

function createDevice(name,subtext = "") {
    const deviceEl = createEl('div','device')
    deviceEl.innerHTML = `
        <img src="https://torok.ing/songplayer/icons/device.svg">
        <div class="songInfo">
            <h3>${name}</h3>
            <p>${subtext}</p>
        </div>
        <img src="https://torok.ing/songplayer/icons/chevron_right.svg">
    `
    return deviceEl
}

async function startSubscribeToDevice(targetUserId, deviceId) {
    pauseTrack()
    sendWsMessage({
        type: "subscribe_to_device",
        userid: targetUserId,
        deviceid: deviceId
    }).then(()=>{
        ws.connectedUser = { targetUserId, deviceId }
        firstConnectToDevice = true;
        devicesBtn.classList.add('active')
        devicesIndicator.classList.remove('hidden')
        return true
    }).catch(err=>{
        customAlert(err.error, "error")
        return false
    })
}

let refreshInterval;
async function refreshDeviceList(targetUserId) {
    const sock = ws.ws
    devicesBackBtn.classList[targetUserId ? 'remove' : 'add']('hidden')
    devicesList.querySelectorAll('.device').forEach(d => d.remove())
    devicesText.innerText = "Loading devices..."
    positionPopupOverElement("devices")
    if (!sock || sock.readyState !== WebSocket.OPEN) {
        devicesText.innerText = 'You are not connected to WebSocket!'
        return;
    }
    const devices = []

    const resp = await sendWsMessage({
        type: "list_devices",
        userid: targetUserId
    })
    const myIdx = resp.data.findIndex(d => d.id === String(userid) || d.id === deviceId)
    if (myIdx !== -1) {
        if (targetUserId) resp.data[myIdx].name += " (this device)"
        else resp.data.splice(myIdx, 1)
    }
    if (!targetUserId)
        devices.unshift({
            name: "My devices",
            id: userid
        })
    devices.push(...resp.data)
    devices.forEach(d => {
        const subtext = d.currentMetadata ? (d.currentMetadata?.title + " - " + d.currentMetadata?.artist) : ""
        const deviceEl = createDevice(d.name, subtext)
        if (d.id === ws.connectedUser?.deviceId || (d.id === deviceId || d.id === String(userid)) && !ws.connectedUser) deviceEl.classList.add('connected')
        deviceEl.onclick = () => {
            if (!targetUserId) {
                refreshDeviceList(d.id)
                return;
            }
            if (d.id === deviceId) {
                ws.connectedUser = null;
                devicesBtn.classList.remove('active')
                devicesIndicator.classList.add('hidden')
                return;
            }
            if (deviceEl.classList.contains('connected')) return;
            startSubscribeToDevice(targetUserId, d.id).then(suc=>{
                devicesList.querySelectorAll('.device').forEach(d => d.classList.remove('connected'))
                if (!suc) return;
                deviceEl.classList.add('connected')
            })
        }
        devicesList.appendChild(deviceEl)
    })
    if (devices.length === 0)
        devicesText.innerText = "No devices found"
    else
        devicesText.innerText = ""
    positionPopupOverElement("devices")
    if (refreshInterval) clearInterval(refreshInterval)
    refreshInterval = setInterval(() => {
        refreshDeviceList(targetUserId)
    }, 10000)
}
devicesBackBtn.onclick = () => refreshDeviceList()

if (Prefrences.connectToWs || document.location.search.includes('li')) 
    connectWs();

// Let the vibecoded shit commence:

// Optional local Discord handoff. Existing public artwork and listen-along links only.
let latest = null, busy = false, queued = false, wasEnabled = false;
const originalSend = sendWsMessage;
sendWsMessage = function (payload) {
    if (payload?.type === 'metadata_update') latest = payload.metadata;
    return originalSend.apply(this, arguments);
};
if (location.hash === '#discord-artwork') {
    Prefrences.discordRPC = true;
    localStorage.setItem('songplayerPrefrencesCache', JSON.stringify(Prefrences));
    history.replaceState(null, '', location.pathname + location.search);
}
async function sendArtwork() {
    if (busy) { queued = true; return; }
    const enabled = Prefrences.discordRPC === true;
    if (!enabled && !wasEnabled) return;
    wasEnabled = enabled;
    const song = currentlyPlayingSong;
    const connected = ws.ws?.readyState === WebSocket.OPEN;
    const metadata = ws.connectedUser ? song : latest;
    const same = metadata && song && metadata.title === song.title && metadata.artist === song.artist;
    const url = enabled && connected && same ? metadata.album_cover : null;
    const publicUrl = typeof url === 'string' && /^https:\/\/(?:torok\.ing|(?:www\.)?skiby\.app)\/songplayer\/public\/[a-f0-9-]{36}\.(?:png|jpe?g|webp|gif|avif)$/i.test(url) ? url : null;
    const publicStream = Prefrences.publicStream === true;
    const showListenAlongOnRPC = Prefrences.showListenAlongOnRPC === true;
    // Same URL as createLinkBtn, without enabling public streaming or touching the clipboard.
    // A subscribed listener must not advertise their own device as the host.
    const listenAlongUrl = enabled && connected && publicStream && showListenAlongOnRPC &&
        !ws.connectedUser && typeof userid !== 'undefined' && userid != null && deviceId ?
        `${location.origin}${location.pathname}?li=${userid}:${deviceId}` : null;
    busy = true;
    fetch('http://127.0.0.1:29741/artwork', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            credentials: 'omit', signal: AbortSignal.timeout(2500),
            body: JSON.stringify(enabled && song ? {
                enabled: true, title: song.title || '', artist: song.artist || '',
                album: song.album || '', url: publicUrl,
                publicStream, showListenAlongOnRPC, connected, listenAlongUrl
            } : { enabled: false })
        }).catch(()=>{}).finally(() => {
        busy = false;
        if (queued) { queued = false; queueMicrotask(sendArtwork); }
    })
}
setInterval(sendArtwork, 5000);
// React to sharing/settings/socket changes even when the song and artwork stay unchanged.
let previousSharingState = '';
setInterval(() => {
    const sharingState = JSON.stringify([Prefrences.discordRPC, Prefrences.publicStream,
        Prefrences.showListenAlongOnRPC, ws.ws?.readyState, Boolean(ws.connectedUser),
        typeof userid === 'undefined' ? null : userid, typeof deviceId === 'undefined' ? null : deviceId]);
    if (sharingState !== previousSharingState) {
        previousSharingState = sharingState;
        void sendArtwork();
    }
}, 1000);

// Fixed appearance for Skiby. Include once, instead of the interactive draft.
// Edit these three constants in the source to choose a different preset.
// The color supplies hue/saturation; theme determines surface brightness.
const originalThemeDeclarations = new WeakMap();
function changeThemeColor(color, font, theme) {
    const properties = new Set([
        'color', 'background', 'background-color', 'background-image',
        'border', 'border-color', 'border-top', 'border-right', 'border-bottom', 'border-left',
        'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
        'outline', 'outline-color', 'box-shadow', 'text-shadow', 'text-decoration-color',
        'accent-color', 'caret-color', 'fill', 'stroke'
    ]);
    // Covers color formats currently used in skibidistylenew.css.
    // Consume complete URLs first so color-like URL fragments are never rewritten.
    const tokens = /url\((?:[^)"']|"[^"]*"|'[^']*')*\)|#[\da-f]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black|transparent|grey|gray|darkgrey|darkgray)\b/gi;
    const parser = document.createElement('canvas').getContext('2d');

    function hsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const d = max - min, l = (max + min) / 2;
        if (!d) return [0, 0, l];
        const s = d / (l > 0.5 ? 2 - max - min : max + min);
        const h = max === r ? (g - b) / d + (g < b ? 6 : 0)
            : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        return [h * 60, s, l];
    }

    function rgb(h, s, l) {
        const a = s * Math.min(l, 1 - l);
        return [0, 8, 4].map(offset => {
            const k = (offset + h / 30) % 12;
            return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
        });
    }

    function parse(value) {
        parser.fillStyle = value;
        const c = parser.fillStyle;
        if (c.startsWith('#')) {
            return [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)).concat(1);
        }
        const numbers = c.match(/[\d.]+/g)?.map(Number);
        return numbers?.length === 3 ? [...numbers, 1] : numbers;
    }

    function mapColor(value, target, background, property) {
        if (/^url\(/i.test(value)) return value;
        const color = parse(value);
        if (!color || color[3] < 0.01) return value;
        const [originalHue, originalS, originalL] = hsl(...color);
        const [targetHue, targetS, targetL] = target;
        // Skiby's source CSS is dark: inversion produces the LIGHT variant.
        let l = !theme ? 1 - originalL : originalL;
        let h = targetHue, s = originalS;
        if (targetS < 0.01) {
            if (theme) return value;
            h = originalHue;
            if (property === 'color' && originalS > 0.08) {
                l = Math.min(l, 0.30);
            }
        } else if (originalS < 0.08) {
            const strength = Math.min(targetS / 0.8, 1);
            if (l > 0.95) { s = 0.50 * strength; l = 0.90; }
            else if (l > 0.85) { s = 0.40 * strength; l -= 0.05; }
            else if (l > 0.70) s = 0.35 * strength;
            else if (l < 0.02) { s = 0.50 * strength; l = 0.10; }
            else if (l < 0.15) { s = 0.40 * strength; l = Math.max(l, 0.08); }
            else s = (l < 0.40 ? 0.30 : 0.25) * strength;
        } else {
            s = 0.6 * originalS + 0.4 * targetS;
            if (background && l < 0.15) {
                l = Math.max(0.8 * targetL, 0.4);
                s = Math.max(s, 0.7 * targetS);
            }
        }
        return `rgba(${rgb(h, s, l).join(', ')}, ${color[3]})`;
    }


    function rewrite(rules, target) {
        for (const rule of rules) {
            if (rule.type === CSSRule.KEYFRAMES_RULE) continue;
            if (rule.style && rule.selectorText) {
                const style = rule.style;
                if (!originalThemeDeclarations.has(style)) {
                    originalThemeDeclarations.set(
                        style,
                        Array.from(style, property => [
                            property,
                            style.getPropertyValue(property),
                            style.getPropertyPriority(property)
                        ])
                    );
                }
                const declarations = originalThemeDeclarations.get(style);
                for (const [property, value, priority] of declarations) {
                    if (property === 'font-family') {
                        style.setProperty(property, `'${font}', sans-serif` ?? value, priority);
                    } else if (properties.has(property)) {
                        const background = property === 'background' || property === 'background-image';
                        const mapped = value.replace(tokens, color => mapColor(color, target, background, property));
                        style.setProperty(property, mapped, priority);
                    }
                }
            }
            if (rule.cssRules) rewrite(rule.cssRules, target);
        }
    }

    const link = Array.from(document.querySelectorAll('link[rel~="stylesheet"]')).find(node => node.href.endsWith('skibidistylenew.css')).sheet.cssRules;
    const chosen = parse(color);
    document.body.dataset.theme = theme ? 'dark' : 'light';
    const [hue, saturation] = hsl(...chosen);
    const target = saturation
        ? hsl(...rgb(hue, saturation, !theme ? 0.85 : 0.15))
        : [0, 0, 0.5];
    rewrite(link, target);
};

changeSetting("playerControlPosition")
changeSetting("customThemeColor")
