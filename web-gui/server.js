import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import axios from 'axios';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

let botProcess = null;

const configPath = path.resolve(__dirname, '../settings/config.main.json');

const getAppStatePath = () => {
    try {
        const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return path.resolve(__dirname, '..', cfg.APPSTATE_PATH || 'appstate.json');
    } catch (e) {
        return path.resolve(__dirname, '../appstate.json');
    }
};

app.get('/api/system/status', (req, res) => {
    const isInstalled = fs.existsSync(path.resolve(__dirname, '../nvsoftware.js'));
    const osType = os.type();
    const osPlatform = os.platform();
    const osRelease = os.release();
    const osArch = os.arch();
    res.json({
        installed: isInstalled,
        osInfo: `${osType} ${osRelease} (${osPlatform} ${osArch})`
    });
});

app.get('/api/system/metrics', (req, res) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(1);
    const uptimeSeconds = os.uptime();
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    res.json({
        totalMem: (totalMem / 1024 / 1024 / 1024).toFixed(2),
        usedMem: (usedMem / 1024 / 1024 / 1024).toFixed(2),
        memUsagePercent,
        uptime: `${days}d ${hours}h ${minutes}m`
    });
});

app.post('/api/system/activate', async (req, res) => {
    try {
        const isInstalled = fs.existsSync(path.resolve(__dirname, '../nvsoftware.js'));
        if (isInstalled) {
            return res.status(400).json({ error: 'Bot is already installed' });
        }

        const zipPath = path.resolve(__dirname, '../temp_source.zip');
        const extractPath = path.resolve(__dirname, '..');

        const url = 'https://raw.githubusercontent.com/nvstudio2003-art/alphabot/main/Alphabot.zip';
        try {
            const response = await axios({ url, method: 'GET', responseType: 'arraybuffer' });
            fs.writeFileSync(zipPath, response.data);
        } catch (downloadErr) {
            console.error('GitHub Download Error:', downloadErr.message);
            return res.status(500).json({ error: 'Lỗi tải source file từ GitHub' });
        }

        const zip = new AdmZip(zipPath);
        if (zip.getEntries().length === 0) throw new Error('Downloaded ZIP is empty');

        const tempExtractPath = path.join(extractPath, 'temp_bot_extract');
        if (fs.existsSync(tempExtractPath)) fs.rmSync(tempExtractPath, { recursive: true, force: true });

        zip.extractAllTo(tempExtractPath, true);

        const items = fs.readdirSync(tempExtractPath);
        let sourceFolder = tempExtractPath;
        if (items.length === 1 && fs.statSync(path.join(tempExtractPath, items[0])).isDirectory()) {
            sourceFolder = path.join(tempExtractPath, items[0]);
        }

        for (const file of fs.readdirSync(sourceFolder)) {
            const source = path.join(sourceFolder, file);
            const dest = path.join(extractPath, file);
            if (file !== 'web-gui' && file !== 'package.json' && file !== 'package-lock.json') {
                fs.cpSync(source, dest, { recursive: true, force: true });
            }
        }

        fs.rmSync(tempExtractPath, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
        res.json({ success: true, message: 'Bot source downloaded and extracted' });
    } catch (e) {
        console.error('Activation Error:', e);
        res.status(500).json({ error: e.message || 'Failed to activate' });
    }
});

app.get('/api/system/check-update', async (req, res) => {
    try {
        const packagePath = path.resolve(__dirname, '../package.json');
        let localVersion = '1.0.0';
        if (fs.existsSync(packagePath)) {
            const pkgInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            localVersion = pkgInfo.version || '1.0.0';
        }
        res.json({ hasUpdate: false, localVersion, latestVersion: localVersion });
    } catch (e) {
        res.status(500).json({ error: 'Lỗi kiểm tra bản cập nhật' });
    }
});

app.post('/api/system/update', async (req, res) => {
    try {
        if (botProcess && !botProcess.killed) {
            botProcess.kill();
            botProcess = null;
        }

        const zipPath = path.resolve(__dirname, '../temp_update.zip');
        const extractPath = path.resolve(__dirname, '..');

        const url = 'https://raw.githubusercontent.com/nvstudio2003-art/alphabot/main/Alphabot.zip';
        try {
            const response = await axios({ url, method: 'GET', responseType: 'arraybuffer' });
            fs.writeFileSync(zipPath, response.data);
        } catch (downloadErr) {
            return res.status(500).json({ error: 'Lỗi tải bản cập nhật từ GitHub' });
        }

        const zip = new AdmZip(zipPath);
        if (zip.getEntries().length === 0) throw new Error('Downloaded update ZIP is empty');

        const tempExtractPath = path.join(extractPath, 'temp_bot_update');
        if (fs.existsSync(tempExtractPath)) fs.rmSync(tempExtractPath, { recursive: true, force: true });

        zip.extractAllTo(tempExtractPath, true);

        const items = fs.readdirSync(tempExtractPath);
        let sourceFolder = tempExtractPath;
        if (items.length === 1 && fs.statSync(path.join(tempExtractPath, items[0])).isDirectory()) {
            sourceFolder = path.join(tempExtractPath, items[0]);
        }

        for (const file of fs.readdirSync(sourceFolder)) {
            const source = path.join(sourceFolder, file);
            const dest = path.join(extractPath, file);
            if (file !== 'node_modules' && file !== 'web-gui' && file !== 'appstate.json' && file !== 'settings' && file !== 'package-lock.json') {
                fs.cpSync(source, dest, { recursive: true, force: true });
            }
        }

        fs.rmSync(tempExtractPath, { recursive: true, force: true });
        fs.unlinkSync(zipPath);
        res.json({ success: true, message: 'Cập nhật thành công!' });
    } catch (e) {
        res.status(500).json({ error: e.message || 'Lỗi áp dụng bản cập nhật' });
    }
});

app.get('/api/bot/status', (req, res) => {
    res.json({ running: botProcess !== null && !botProcess.killed });
});

app.post('/api/bot/start', (req, res) => {
    if (botProcess && !botProcess.killed) {
        return res.status(400).json({ error: 'Bot is already running' });
    }
    const botScript = path.resolve(__dirname, '../nvsoftware.js');
    botProcess = spawn('node', [botScript], {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'pipe'
    });
    botProcess.stdout.on('data', (data) => console.log(`[BOT OUT]: ${data}`));
    botProcess.stderr.on('data', (data) => console.error(`[BOT ERR]: ${data}`));
    botProcess.on('close', (code) => {
        console.log(`Bot process exited with code ${code}`);
        botProcess = null;
    });
    res.json({ success: true, message: 'Bot started' });
});

app.post('/api/bot/stop', (req, res) => {
    if (!botProcess || botProcess.killed) {
        return res.status(400).json({ error: 'Bot is not running' });
    }
    if (process.platform === 'win32' && botProcess.pid) {
        exec(`taskkill /pid ${botProcess.pid} /T /F`, () => {
            botProcess = null;
            res.json({ success: true, message: 'Bot forcefully stopped' });
        });
    } else {
        botProcess.kill('SIGKILL');
        botProcess = null;
        res.json({ success: true, message: 'Bot stopped' });
    }
});

app.get('/api/config', (req, res) => {
    try {
        res.json(JSON.parse(fs.readFileSync(configPath, 'utf8')));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/config', (req, res) => {
    try {
        fs.writeFileSync(configPath, JSON.stringify(req.body, null, 4), 'utf8');
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/appstate', (req, res) => {
    try {
        const appStatePath = getAppStatePath();
        if (!fs.existsSync(appStatePath)) return res.json([]);
        res.json(JSON.parse(fs.readFileSync(appStatePath, 'utf8')));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/appstate', (req, res) => {
    try {
        const appStatePath = getAppStatePath();
        const dir = path.dirname(appStatePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(appStatePath, JSON.stringify(req.body, null, 2), 'utf8');
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const commandsPath = path.resolve(__dirname, '../module/commands');

app.get('/api/commands', (req, res) => {
    try {
        if (!fs.existsSync(commandsPath)) return res.json({});
        const categories = fs.readdirSync(commandsPath, { withFileTypes: true })
            .filter(d => d.isDirectory()).map(d => d.name);
        const result = {};
        for (const cat of categories) {
            result[cat] = fs.readdirSync(path.join(commandsPath, cat)).filter(f => f.endsWith('.js'));
        }
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/commands/:category/:filename', (req, res) => {
    try {
        const filePath = path.join(commandsPath, req.params.category, req.params.filename);
        if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Not found' });
        res.json({ content: fs.readFileSync(filePath, 'utf8') });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/commands/:category/:filename', (req, res) => {
    try {
        const dirPath = path.join(commandsPath, req.params.category);
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(path.join(dirPath, req.params.filename), req.body.content, 'utf8');
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const threadsPath = path.resolve(__dirname, '../src/Core/data/threads.json');
app.get('/api/threads', (req, res) => {
    try {
        if (!fs.existsSync(threadsPath)) return res.json({});
        res.json(JSON.parse(fs.readFileSync(threadsPath, 'utf8')));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const openBrowser = (url) => {
    const isTermux = process.env.TERMUX_VERSION !== undefined ||
        (process.env.HOME && process.env.HOME.includes('com.termux'));
    let cmd;
    if (isTermux) cmd = `termux-open-url ${url}`;
    else if (process.platform === 'win32') cmd = `start "" "${url}"`;
    else cmd = `xdg-open ${url}`;
    exec(cmd, (err) => { if (err) console.error('Không thể mở trình duyệt tự động:', err.message); });
};

const startServer = (port) => {
    app.listen(port, () => {
        const url = `http://localhost:${port}`;
        console.log(`Web GUI Launcher running at ${url}`);
        openBrowser(url);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is in use, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });
};

startServer(PORT);