(function () {
    'use strict';

    // GitHub repo — fixed for this site
    const GITHUB_OWNER = 'mojtaba-max';
    const GITHUB_REPO = 'panel_code.js';
    const GITHUB_BRANCH = 'main';
    const UPLOAD_PASSWORD = 'Adm1238';
    const GATE_STORAGE_KEY = 'panel-upload-unlocked';
    const TOKEN_STORAGE_KEY = 'panel-upload-github-token';

    const DEFAULT_ICON = '<path d="M4 20V8a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/>';
    const SKIP_NAMES = new Set(['.DS_Store', 'Thumbs.db', '.gitkeep']);

    const gate = document.getElementById('gate');
    const gateForm = document.getElementById('gate-form');
    const gatePassword = document.getElementById('gate-password');
    const gateError = document.getElementById('gate-error');
    const tokenGate = document.getElementById('token-gate');
    const tokenForm = document.getElementById('token-form');
    const tokenInput = document.getElementById('token-input');
    const uploadApp = document.getElementById('upload-app');
    const changeTokenBtn = document.getElementById('change-token');
    const form = document.getElementById('upload-form');
    const folderInput = document.getElementById('folder');
    const folderInfo = document.getElementById('folder-info');
    const slugInput = document.getElementById('slug');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const categoryInput = document.getElementById('category');
    const colorInput = document.getElementById('color');
    const tagsInput = document.getElementById('tags');
    const iconInput = document.getElementById('icon');
    const submitBtn = document.getElementById('submit');
    const logEl = document.getElementById('log');

    let selectedFiles = [];

    if (sessionStorage.getItem(GATE_STORAGE_KEY) === '1') {
        afterPasswordUnlock();
    }

    gateForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (gatePassword.value === UPLOAD_PASSWORD) {
            sessionStorage.setItem(GATE_STORAGE_KEY, '1');
            afterPasswordUnlock();
            return;
        }
        gateError.hidden = false;
        gatePassword.value = '';
        gatePassword.focus();
    });

    tokenForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const token = tokenInput.value.trim();
        if (!token) {
            return;
        }
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        showUploadApp();
    });

    changeTokenBtn.addEventListener('click', function () {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        uploadApp.hidden = true;
        tokenGate.hidden = false;
        tokenInput.value = '';
        tokenInput.focus();
        log('', null);
    });

    folderInput.addEventListener('change', onFolderChange);
    form.addEventListener('submit', onSubmit);

    function afterPasswordUnlock() {
        gate.hidden = true;
        if (getToken()) {
            showUploadApp();
            return;
        }
        tokenGate.hidden = false;
        tokenInput.focus();
    }

    function showUploadApp() {
        gate.hidden = true;
        tokenGate.hidden = true;
        uploadApp.hidden = false;
    }

    function getToken() {
        return String(localStorage.getItem(TOKEN_STORAGE_KEY) || '').trim();
    }

    function log(message, state) {
        logEl.textContent = message;
        logEl.classList.remove('is-error', 'is-ok');
        if (state) {
            logEl.classList.add(state);
        }
    }

    function appendLog(line) {
        logEl.textContent = (logEl.textContent ? logEl.textContent + '\n' : '') + line;
    }

    function slugify(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function parseTags(value) {
        return String(value || '')
            .split(/[,،]/)
            .map(function (tag) { return tag.trim(); })
            .filter(Boolean);
    }

    function shouldSkip(file) {
        const name = file.name;
        if (SKIP_NAMES.has(name)) {
            return true;
        }
        const path = file.webkitRelativePath || name;
        return path.split('/').some(function (part) {
            return part === '.git' || part === 'node_modules';
        });
    }

    function relativeInsideFolder(file) {
        const full = file.webkitRelativePath || file.name;
        const parts = full.split('/');
        if (parts.length > 1) {
            return parts.slice(1).join('/');
        }
        return parts[0];
    }

    function onFolderChange() {
        const files = Array.from(folderInput.files || []).filter(function (file) {
            return !shouldSkip(file);
        });

        selectedFiles = files;

        if (!files.length) {
            folderInfo.hidden = true;
            folderInfo.textContent = '';
            return;
        }

        const rootName = (files[0].webkitRelativePath || '').split('/')[0] || '';
        if (rootName && !slugInput.value) {
            slugInput.value = slugify(rootName);
        }
        if (rootName && !titleInput.value) {
            titleInput.value = rootName
                .split(/[-_]/)
                .filter(Boolean)
                .map(function (part) {
                    return part.charAt(0).toUpperCase() + part.slice(1);
                })
                .join(' ');
        }

        const totalBytes = files.reduce(function (sum, file) { return sum + file.size; }, 0);
        folderInfo.hidden = false;
        folderInfo.textContent = files.length + ' فایل · ' + formatBytes(totalBytes)
            + (rootName ? ' · فولدر: ' + rootName : '');
    }

    function formatBytes(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function fileToBase64(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader();
            reader.onload = function () {
                const result = String(reader.result || '');
                const comma = result.indexOf(',');
                resolve(comma >= 0 ? result.slice(comma + 1) : result);
            };
            reader.onerror = function () {
                reject(reader.error || new Error('خواندن فایل ناموفق بود'));
            };
            reader.readAsDataURL(file);
        });
    }

    async function github(path, options) {
        options = options || {};
        const token = getToken();
        if (!token) {
            throw new Error('توکن GitHub هنوز تنظیم نشده. آن را برای ثبت دائمی بفرست.');
        }
        const response = await fetch('https://api.github.com' + path, {
            method: options.method || 'GET',
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer ' + token,
                'X-GitHub-Api-Version': '2022-11-28',
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        });

        const text = await response.text();
        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch (error) {
            data = { message: text };
        }

        if (!response.ok) {
            const msg = (data && data.message) ? data.message : ('HTTP ' + response.status);
            const needed = response.headers.get('X-Accepted-GitHub-Permissions');
            if (/resource not accessible/i.test(msg)) {
                throw new Error(
                    'توکن دسترسی نوشتن روی این ریپو ندارد.\n'
                    + 'یک توکن Classic با تیک repo بساز، یا Fine-grained با Contents: Read and write روی panel_code.js.\n'
                    + 'بعد از «تغییر توکن GitHub» توکن جدید را وارد کن.'
                    + (needed ? ('\nدسترسی لازم: ' + needed) : '')
                );
            }
            throw new Error(msg);
        }

        return data;
    }

    function repoPath(owner, repo, suffix) {
        return '/repos/' + encodeURIComponent(owner) + '/' + encodeURIComponent(repo) + suffix;
    }

    async function createBlob(owner, repo, base64Content) {
        return github(repoPath(owner, repo, '/git/blobs'), {
            method: 'POST',
            body: {
                content: base64Content,
                encoding: 'base64',
            },
        });
    }

    async function onSubmit(event) {
        event.preventDefault();

        const owner = GITHUB_OWNER;
        const repo = GITHUB_REPO;
        const branch = GITHUB_BRANCH;
        const slug = slugify(slugInput.value);

        if (!slug) {
            log('slug معتبر نیست.', 'is-error');
            return;
        }

        if (!selectedFiles.length) {
            log('ابتدا یک فولدر انتخاب کن.', 'is-error');
            return;
        }

        const projectEntry = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            href: 'project/' + slug + '/index.html',
            category: categoryInput.value,
            color: colorInput.value,
            icon: (iconInput.value.trim() || DEFAULT_ICON),
            tags: parseTags(tagsInput.value),
        };

        if (!projectEntry.title || !projectEntry.description) {
            log('عنوان و توضیح الزامی است.', 'is-error');
            return;
        }

        const hasIndex = selectedFiles.some(function (file) {
            return relativeInsideFolder(file).replace(/\\/g, '/') === 'index.html';
        });

        if (!hasIndex) {
            log('داخل فولدر باید فایل index.html باشد.', 'is-error');
            return;
        }

        submitBtn.disabled = true;
        logEl.classList.remove('is-error', 'is-ok');
        log('شروع آپلود…');

        try {
            appendLog('خواندن برنچ ' + branch + '…');
            const ref = await github(repoPath(owner, repo, '/git/ref/heads/' + encodeURIComponent(branch)));
            const commitSha = ref.object.sha;
            const commit = await github(repoPath(owner, repo, '/git/commits/' + commitSha));
            const baseTreeSha = commit.tree.sha;

            appendLog('خواندن projects.json…');
            let projects = [];
            try {
                const jsonFile = await github(
                    repoPath(owner, repo, '/contents/projects.json')
                    + '?ref=' + encodeURIComponent(branch)
                );
                const decoded = decodeURIComponent(escape(atob(jsonFile.content.replace(/\n/g, ''))));
                const parsed = JSON.parse(decoded);
                projects = Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                if (String(error.message || '').indexOf('Not Found') === -1) {
                    throw error;
                }
                projects = [];
            }

            const already = projects.some(function (item) {
                const href = (item && item.href) || '';
                return href === projectEntry.href || href.indexOf('project/' + slug + '/') === 0;
            });
            if (already) {
                throw new Error('پروژه با slug «' + slug + '» از قبل در projects.json هست.');
            }

            projects.push(projectEntry);

            appendLog('ساخت blob برای ' + selectedFiles.length + ' فایل…');
            const tree = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const rel = relativeInsideFolder(file).replace(/\\/g, '/');
                if (!rel || rel.endsWith('/')) {
                    continue;
                }

                const base64 = await fileToBase64(file);
                const blob = await createBlob(owner, repo, base64);
                tree.push({
                    path: 'project/' + slug + '/' + rel,
                    mode: '100644',
                    type: 'blob',
                    sha: blob.sha,
                });
                appendLog('  (' + (i + 1) + '/' + selectedFiles.length + ') ' + rel);
            }

            const projectsBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(projects, null, 2) + '\n')));
            const projectsBlob = await createBlob(owner, repo, projectsBase64);
            tree.push({
                path: 'projects.json',
                mode: '100644',
                type: 'blob',
                sha: projectsBlob.sha,
            });

            appendLog('ساخت tree و commit…');
            const newTree = await github(repoPath(owner, repo, '/git/trees'), {
                method: 'POST',
                body: {
                    base_tree: baseTreeSha,
                    tree: tree,
                },
            });

            const message = 'Add project: ' + projectEntry.title + ' (' + slug + ')';
            const newCommit = await github(repoPath(owner, repo, '/git/commits'), {
                method: 'POST',
                body: {
                    message: message,
                    tree: newTree.sha,
                    parents: [commitSha],
                },
            });

            await github(repoPath(owner, repo, '/git/refs/heads/' + encodeURIComponent(branch)), {
                method: 'PATCH',
                body: {
                    sha: newCommit.sha,
                },
            });

            log(
                'آپلود موفق بود.\n'
                + 'commit: ' + newCommit.sha.slice(0, 7) + '\n'
                + 'path: project/' + slug + '/\n'
                + 'بعد از چند ثانیه GitHub Pages آپدیت می‌شود.',
                'is-ok'
            );
        } catch (error) {
            console.error(error);
            log('خطا: ' + (error && error.message ? error.message : String(error)), 'is-error');
        } finally {
            submitBtn.disabled = false;
        }
    }
})();
