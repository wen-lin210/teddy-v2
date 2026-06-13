document.addEventListener('DOMContentLoaded', () => {
    // ===== AUTH & TIER =====
    const loginModal = document.getElementById('login-modal');
    const loginKeyInput = document.getElementById('login-key');
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const tierDisplay = document.getElementById('tier-display');

    let currentUser = null;
    let currentTier = null;

    const loadUserFromStorage = () => {
        const stored = localStorage.getItem('user');
        const storedTier = localStorage.getItem('tier');
        if (stored && storedTier) {
            currentUser = JSON.parse(stored);
            currentTier = JSON.parse(storedTier);
            updateAuthUI();
            loginModal.style.display = 'none';
            return true;
        }
        return false;
    };

    const updateAuthUI = () => {
        if (currentUser) {
            usernameDisplay.textContent = currentUser.username;
            tierDisplay.textContent = currentTier.name || currentUser.tier;
            userInfo.style.display = 'block';
            btnLogin.style.display = 'none';
            btnLogout.style.display = 'block';
            loginKeyInput.style.display = 'none';
        } else {
            userInfo.style.display = 'none';
            btnLogin.style.display = 'block';
            btnLogout.style.display = 'none';
            loginKeyInput.style.display = 'block';
        }
    };

    btnLogin.addEventListener('click', async () => {
        const key = loginKeyInput.value.trim();
        if (!key) {
            alert('Vui lòng nhập khóa');
            return;
        }
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });
            const data = await res.json();
            if (res.ok) {
                currentUser = data.user;
                const tiersRes = await fetch('/api/tiers');
                const tiers = await tiersRes.json();
                currentTier = tiers[data.user.tier];
                localStorage.setItem('user', JSON.stringify(currentUser));
                localStorage.setItem('tier', JSON.stringify(currentTier));
                updateAuthUI();
                loginModal.style.display = 'none';
                showToast('Đăng nhập thành công!');
            } else {
                alert('Khóa không hợp lệ: ' + data.error);
            }
        } catch (e) {
            alert('Lỗi đăng nhập: ' + e.message);
        }
    });

    btnLogout.addEventListener('click', () => {
        currentUser = null;
        currentTier = null;
        localStorage.removeItem('user');
        localStorage.removeItem('tier');
        updateAuthUI();
        loginModal.style.display = 'flex';
        loginKeyInput.value = '';
        showToast('Đã đăng xuất');
    });

    loginKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnLogin.click();
    });

    // Show login if not authenticated
    if (!loadUserFromStorage()) {
        loginModal.style.display = 'flex';
    }

    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.page-view');
    const toast = document.getElementById('toast');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const btnMenu = document.getElementById('btn-menu');
    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    const pageTitle = document.getElementById('page-title');
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    const btnUpdate = document.getElementById('btn-update');
    const localVersionDisplay = document.getElementById('local-version-display');
    const statusBadge = document.getElementById('status-badge');
    const dashboardStatusText = document.getElementById('dashboard-status-text');
    const appstateEditor = document.getElementById('appstate-editor');
    const appstateWarning = document.getElementById('appstate-warning');
    const btnSaveAppstate = document.getElementById('btn-save-appstate');

    const configEditorArea = document.getElementById('dynamic-config-fields');
    const btnSaveConfig = document.getElementById('btn-save-config');
    let currentConfigState = {};
    const fileBrowser = document.getElementById('file-browser');
    const editorContainer = document.getElementById('editor-container');
    const codeEditor = document.getElementById('code-editor');
    const editingFilename = document.getElementById('editing-filename');
    const btnCloseEditor = document.getElementById('btn-close-editor');
    const btnSaveCode = document.getElementById('btn-save-code');

    let currentEditingFile = null;
    const threadListContainer = document.getElementById('thread-list');
    const toggleSidebar = (forceClose = false) => {
        if (forceClose || sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
        } else {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('show');
        }
    };

    if (btnMenu) btnMenu.addEventListener('click', () => toggleSidebar());
    if (btnCloseSidebar) btnCloseSidebar.addEventListener('click', () => toggleSidebar(true));
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => toggleSidebar(true));

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const titleText = btn.textContent.trim();

            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            views.forEach(v => v.style.display = 'none');
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.style.display = 'block';

            if (pageTitle) pageTitle.textContent = titleText;

            // Close sidebar on mobile after clicking a link
            if (window.innerWidth < 1024) toggleSidebar(true);

            // Refresh data on tab enter
            if (targetId === 'appstate') loadAppState();
            if (targetId === 'settings') loadConfig();
            if (targetId === 'box') loadThreads();
            if (targetId === 'commands') {
                editorContainer.style.display = 'none';
                fileBrowser.style.display = 'block';
                loadCommands();
            }
        });
    });

    const showToast = (msg) => {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    };

    // ----- BOT CONTROLS -----
    const updateStatusUI = (isRunning) => {
        if (isRunning) {
            statusBadge.textContent = 'Đang Chạy';
            statusBadge.className = 'badge on';
            btnStart.disabled = true;
            btnStop.disabled = false;
        } else {
            statusBadge.textContent = 'Đã Dừng';
            statusBadge.className = 'badge off';
            btnStart.disabled = false;
            btnStop.disabled = true;
        }
    };

    const checkStatus = async () => {
        try {
            const res = await fetch('/api/bot/status');
            const data = await res.json();
            updateStatusUI(data.running);
        } catch (e) {
            console.error('Lỗi khi lấy trạng thái', e);
        }
    };

    btnStart.addEventListener('click', async () => {
        btnStart.disabled = true;
        showToast('Đang khởi động bot...');
        try {
            await fetch('/api/bot/start', { method: 'POST' });
            setTimeout(checkStatus, 1500);
        } catch (e) {
            console.error(e);
            btnStart.disabled = false;
        }
    });

    btnStop.addEventListener('click', async () => {
        btnStop.disabled = true;
        try {
            await fetch('/api/bot/stop', { method: 'POST' });
            setTimeout(checkStatus, 1000);
            showToast('Đã dừng bot');
        } catch (e) {
            console.error(e);
            btnStop.disabled = false;
        }
    });

    const fetchVersion = async () => {
        try {
            const res = await fetch('/api/system/check-update');
            const data = await res.json();
            if (localVersionDisplay) {
                localVersionDisplay.textContent = `(v${data.localVersion})`;
            }
        } catch (e) {
            console.error('Không thể lấy version:', e);
        }
    };
    fetchVersion();

    btnUpdate.addEventListener('click', async () => {
        btnUpdate.disabled = true;
        btnUpdate.textContent = '🔄 Đang kiểm tra...';
        try {
            const res = await fetch('/api/system/check-update');
            const data = await res.json();

            if (data.error) {
                alert('Lỗi: ' + data.error);
                return;
            }

            if (data.hasUpdate) {
                const conf = confirm(`Phiên bản hiện hành: ${data.localVersion}\nPhiên bản mới nhất trên mây: ${data.latestVersion}\n\nBạn có muốn cập nhật mã nguồn ngay bây giờ không? Bot sẽ được dừng và tải file bot.zip từ Github.`);
                if (conf) {
                    btnUpdate.textContent = '📥 Đang tải và áp dụng...';
                    const upRes = await fetch('/api/system/update', { method: 'POST' });
                    const upData = await upRes.json();

                    if (upData.success) {
                        alert('Cập nhật thành công! Trang web sẽ được tải lại.');
                        window.location.reload();
                    } else {
                        alert('Lỗi cập nhật: ' + (upData.error || 'Unknown Error'));
                    }
                }
            } else {
                alert(`Bạn đang dùng phiên bản mới nhất (v${data.localVersion}).`);
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi kết nối khi cập nhật.');
        } finally {
            btnUpdate.disabled = false;
            btnUpdate.innerHTML = `🔄 Kiểm Tra Cập Nhật <span id="local-version-display" style="font-size: 0.8em; opacity: 0.8;"></span>`;
            fetchVersion();
        }
    });

    // ----- CONFIGURATION DYNAMIC BUILDER -----
    const createConfigInput = (key, value, pathArray, parentEl) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'config-item';

        const label = document.createElement('label');
        label.textContent = key;
        itemDiv.appendChild(label);

        const type = typeof value;
        let inputEl;

        if (Array.isArray(value)) {
            // Arrays represented as comma separated text for simplicity in mobile
            inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.value = value.join(', ');
            inputEl.dataset.type = 'array';
        } else if (value === null) {
            inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.value = 'null';
            inputEl.dataset.type = 'null';
        } else if (type === 'boolean') {
            inputEl = document.createElement('input');
            inputEl.type = 'checkbox';
            inputEl.checked = value;
            inputEl.dataset.type = 'boolean';
        } else if (type === 'number') {
            inputEl = document.createElement('input');
            inputEl.type = 'number';
            inputEl.value = value;
            inputEl.dataset.type = 'number';
        } else if (type === 'object') {
            // Nested object
            inputEl = document.createElement('div');
            inputEl.className = 'config-object';
            for (const subKey in value) {
                createConfigInput(subKey, value[subKey], [...pathArray, subKey], inputEl);
            }
            itemDiv.appendChild(inputEl);
            parentEl.appendChild(itemDiv);
            return;
        } else {
            // String default
            inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.value = value;
            inputEl.dataset.type = 'string';
        }

        // Store data path for re-assembling JSON
        inputEl.dataset.path = JSON.stringify(pathArray);
        inputEl.classList.add('config-form-control');

        itemDiv.appendChild(inputEl);
        parentEl.appendChild(itemDiv);
    };

    const loadConfig = async () => {
        try {
            configEditorArea.innerHTML = '';
            const res = await fetch('/api/config');
            currentConfigState = await res.json();

            for (const key in currentConfigState) {
                createConfigInput(key, currentConfigState[key], [key], configEditorArea);
            }
        } catch (e) {
            configEditorArea.innerHTML = '<p class="text-danger">Lỗi không thể tải file config</p>';
        }
    };

    btnSaveConfig.addEventListener('click', async () => {
        try {
            // Reconstruct JSON from inputs
            const inputs = document.querySelectorAll('.config-form-control');
            const newConfig = JSON.parse(JSON.stringify(currentConfigState)); // Deep copy

            inputs.forEach(input => {
                const pathArray = JSON.parse(input.dataset.path);

                let val;
                if (input.dataset.type === 'boolean') val = input.checked;
                else if (input.dataset.type === 'number') val = Number(input.value);
                else if (input.dataset.type === 'array') val = input.value.split(',').map(s => s.trim()).filter(s => s !== "");
                else if (input.dataset.type === 'null') val = null;
                else val = input.value;

                // Traverse and set
                let target = newConfig;
                for (let i = 0; i < pathArray.length - 1; i++) {
                    target = target[pathArray[i]];
                }
                target[pathArray[pathArray.length - 1]] = val;
            });

            const res = await fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newConfig)
            });

            if (res.ok) {
                showToast('Đã lưu Cấu Hình!');
                currentConfigState = newConfig;
            } else {
                showToast('Lỗi khi lưu cấu hình');
            }
        } catch (e) {
            alert('Lỗi xử lý Form!');
            console.error(e);
        }
    });

    // ----- APPSTATE -----
    const checkAppStateValidity = (data) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return false;
        }
        const hasCUser = data.some(item => item.key === 'c_user');
        return hasCUser;
    };

    const loadAppState = async () => {
        try {
            const res = await fetch('/api/appstate');
            const data = await res.json();
            appstateEditor.value = JSON.stringify(data, null, 2);

            if (!checkAppStateValidity(data)) {
                appstateWarning.style.display = 'block';
            } else {
                appstateWarning.style.display = 'none';
            }
        } catch (e) {
            appstateEditor.value = '[]';
            appstateWarning.style.display = 'block';
        }
    };

    btnSaveAppstate.addEventListener('click', async () => {
        try {
            const parsed = JSON.parse(appstateEditor.value);
            const res = await fetch('/api/appstate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsed)
            });

            if (res.ok) {
                showToast('Đã lưu Appstate!');
                loadAppState();
            }
            else showToast('Lỗi khi lưu appstate');
        } catch (e) {
            alert('Lỗi Cú Pháp JSON. Định dạng bắt buộc là mảng JSON [].');
        }
    });

    // ----- COMMANDS FILE BROWSER -----
    const loadCommands = async () => {
        try {
            fileBrowser.innerHTML = '<p>Đang tải...</p>';
            const res = await fetch('/api/commands');
            const data = await res.json();

            fileBrowser.innerHTML = '';
            for (const [category, files] of Object.entries(data)) {
                const catHeader = document.createElement('div');
                catHeader.className = 'folder-header';
                catHeader.textContent = `📁 ${category}`;
                fileBrowser.appendChild(catHeader);

                files.forEach(file => {
                    const item = document.createElement('div');
                    item.className = 'file-item';
                    item.innerHTML = `<span>📜 ${file}</span> <span>📝</span>`;
                    item.addEventListener('click', () => openEditor(category, file));
                    fileBrowser.appendChild(item);
                });
            }
        } catch (e) {
            fileBrowser.innerHTML = '<p class="text-danger">Lỗi khi tải danh sách lệnh</p>';
        }
    };

    const openEditor = async (category, filename) => {
        try {
            editorContainer.style.display = 'block';
            fileBrowser.style.display = 'none';
            codeEditor.value = 'Đang tải source code...';
            currentEditingFile = { category, filename };
            editingFilename.textContent = `${category} / ${filename}`;

            const res = await fetch(`/api/commands/${category}/${filename}`);
            const data = await res.json();
            codeEditor.value = data.content;
        } catch (e) {
            codeEditor.value = '// Lỗi khi mở tập tin này';
        }
    };

    btnCloseEditor.addEventListener('click', () => {
        editorContainer.style.display = 'none';
        fileBrowser.style.display = 'block';
        currentEditingFile = null;
    });

    btnSaveCode.addEventListener('click', async () => {
        if (!currentEditingFile) return;
        const { category, filename } = currentEditingFile;
        try {
            const payload = { content: codeEditor.value };
            const res = await fetch(`/api/commands/${category}/${filename}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) showToast('Đã lưu tập tin lệnh!');
            else showToast('Không thể lưu tập tin!');
        } catch (e) {
            showToast('Lỗi lưu trữ!');
        }
    });

    // ----- THREADS / BOX MANAGEMENT -----
    const loadThreads = async () => {
        try {
            threadListContainer.innerHTML = '<p>Đang tải...</p>';
            const res = await fetch('/api/threads');
            const data = await res.json();

            threadListContainer.innerHTML = '';

            const threads = Object.values(data);
            if (threads.length === 0) {
                threadListContainer.innerHTML = '<p>Bot chưa tham gia nhóm nào.</p>';
                return;
            }

            threads.forEach(thread => {
                const item = document.createElement('div');
                item.className = 'config-item';

                const groupName = thread.info?.name || 'Nhóm Chưa Đặt Tên';
                const memberCount = thread.info?.participantIDs?.length || 0;
                const isGroup = thread.info?.isGroup ? 'Box Nhóm' : 'Trò Chuyện Cá Nhân';

                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <strong style="color: var(--primary); font-size: 1rem;">${groupName}</strong>
                            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 5px;">
                                ID: ${thread.threadID} <br/>
                                Loại: ${isGroup} <br/>
                                Số thành viên: ${memberCount}
                            </div>
                        </div>
                    </div>
                `;
                threadListContainer.appendChild(item);
            });
        } catch (e) {
            threadListContainer.innerHTML = '<p class="text-danger">Lỗi khi tải danh sách Box</p>';
        }
    };

    // Initialization
    const initSystem = async () => {
        try {
            const res = await fetch('/api/system/status');
            const data = await res.json();

            if (!data.installed) {
                document.querySelector('.app-wrapper').style.display = 'none';
                document.getElementById('activation-view').style.display = 'flex';

                const btnActivate = document.getElementById('btn-activate');
                const progressDiv = document.getElementById('activation-progress');
                const keyInput = document.getElementById('activation-key-input');

                btnActivate.addEventListener('click', async () => {
                    const key = keyInput.value.trim();
                    if (!key) {
                        alert('Vui lòng nhập key kích hoạt!');
                        return;
                    }

                    btnActivate.disabled = true;
                    btnActivate.style.display = 'none';
                    keyInput.style.display = 'none';
                    progressDiv.style.display = 'block';

                    try {
                        const actRes = await fetch('/api/system/activate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ key })
                        });

                        if (actRes.ok) {
                            showToast('Kích hoạt và tải Source thành công. Đang tải lại...');
                            setTimeout(() => window.location.reload(), 1500);
                        } else {
                            const err = await actRes.json();
                            alert('Lỗi: ' + (err.error || 'Key không hợp lệ'));
                            btnActivate.disabled = false;
                            btnActivate.style.display = 'block';
                            keyInput.style.display = 'block';
                            progressDiv.style.display = 'none';
                        }
                    } catch (e) {
                        alert('Lỗi kết nối khi kích hoạt');
                        btnActivate.disabled = false;
                        btnActivate.style.display = 'block';
                        keyInput.style.display = 'block';
                        progressDiv.style.display = 'none';
                    }
                });
            } else {
                if (data.osInfo && dashboardStatusText) {
                    dashboardStatusText.textContent = `Hệ điều hành: ${data.osInfo}`;
                }
                checkStatus();
                setInterval(checkStatus, 3000); // Polling status
            }
        } catch (e) {
            console.error('Lỗi kiểm tra hệ thống:', e);
        }
    };

    // ----- MUSIC PLAYER -----
    const audioPlayer = document.getElementById('audio-player');
    const playerTitle = document.getElementById('player-title');
    const playerDuration = document.getElementById('player-duration');
    const playerThumbnail = document.getElementById('player-thumbnail');
    const btnPlay = document.getElementById('btn-play');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const progressSlider = document.getElementById('progress-slider');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const playlistContainer = document.getElementById('playlist-container');
    const btnAddSong = document.getElementById('btn-add-song');

    let playlist = [];
    let currentIndex = 0;
    let isPlaying = false;

    const loadPlaylist = async () => {
        try {
            const res = await fetch('/api/music/playlist');
            const data = await res.json();
            playlist = data.songs || [];
            currentIndex = data.currentIndex || 0;
            renderPlaylist();
            if (playlist.length > 0) loadTrack(currentIndex);
        } catch (e) {
            console.error('[v0] Error loading playlist:', e);
        }
    };

    const renderPlaylist = () => {
        playlistContainer.innerHTML = '';
        if (playlist.length === 0) {
            playlistContainer.innerHTML = '<p class="empty-state">Chưa có bài hát nào trong danh sách</p>';
            return;
        }
        playlist.forEach((song, idx) => {
            const item = document.createElement('div');
            item.className = 'playlist-item' + (idx === currentIndex ? ' active' : '');
            item.innerHTML = `
                <img src="${song.thumbnail}" alt="Thumbnail" class="playlist-thumbnail">
                <div class="playlist-info">
                    <div class="playlist-title">${song.title}</div>
                    <div class="playlist-duration">${formatTime(parseInt(song.duration) || 0)}</div>
                </div>
            `;
            item.addEventListener('click', () => {
                currentIndex = idx;
                loadTrack(currentIndex);
                play();
                renderPlaylist();
            });
            playlistContainer.appendChild(item);
        });
    };

    const loadTrack = (idx) => {
        if (idx < 0 || idx >= playlist.length) return;
        const track = playlist[idx];
        playerTitle.textContent = track.title;
        playerDuration.textContent = formatTime(parseInt(track.duration) || 0);
        playerThumbnail.src = track.thumbnail;
        totalTimeDisplay.textContent = formatTime(parseInt(track.duration) || 0);
        
        // For now, use a placeholder audio source - in production would need YouTube audio extraction
        audioPlayer.src = '';
        currentIndex = idx;
    };

    const play = () => {
        isPlaying = true;
        btnPlay.textContent = '⏸';
        // Note: Actual playback would require server-side YouTube audio extraction
        // For now, this is a UI-only implementation
    };

    const pause = () => {
        isPlaying = false;
        btnPlay.textContent = '▶';
        audioPlayer.pause();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (btnPlay) {
        btnPlay.addEventListener('click', () => {
            if (playlist.length === 0) {
                showToast('Chưa có bài hát nào!');
                return;
            }
            if (isPlaying) pause();
            else play();
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (playlist.length === 0) return;
            currentIndex = (currentIndex + 1) % playlist.length;
            loadTrack(currentIndex);
            play();
            renderPlaylist();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (playlist.length === 0) return;
            currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentIndex);
            play();
            renderPlaylist();
        });
    }

    // Load playlist on page load
    loadPlaylist();

    initSystem();
});
