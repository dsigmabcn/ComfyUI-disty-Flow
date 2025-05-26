
//import { insertElement } from './core/js/common/components/header.js';
//import { initializeUI } from '/model_manager/js/main.js';
document.addEventListener('DOMContentLoaded', () => {
    //initializeUI();
    //insertElement();
    displayDirectory('/workspace/ComfyUI/models', 'file-explorer');
});

let currentDirectory = '/workspace/ComfyUI/models'; // Track the current directory

function loadManagerApp() {
    // Code to load the Manager app into the content area
    const content = document.querySelector('.content');
    content.innerHTML = '<div id="manager-app">Manager App Loaded</div>';
    // Add additional logic to initialize the Manager app
}

window.loadDownloadApp = function () {
    /* Show the modal instead of replacing the content*/
    document.getElementById('download-modal').classList.remove('hidden');
};

window.closeModal = function () {
    document.getElementById('download-modal').classList.add('hidden');
};

window.startDownload = async function () {
    const url = document.getElementById('download-url').value;
    const button = document.getElementById('download-button');

    const progressContainer = document.getElementById('download-progress-container');
    const progressBar = document.getElementById('download-progress-bar');
    const progressText = document.getElementById('download-progress-text');
    const progressLabel = document.getElementById('download-progress-label');

    if (!url) {
        alert("Please enter a URL.");
        return;
    }

    // UI: Start progress
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    progressText.textContent = '';
    progressLabel.style.display = 'block';
    button.disabled = true;

    // Simulate progress (since we can't track real download progress from server)
    let fakeProgress = 0;
    const interval = setInterval(() => {
        fakeProgress += Math.floor(Math.random() * 10) + 5;
        if (fakeProgress >= 90) fakeProgress = 90;
        progressBar.style.width = `${fakeProgress}%`;
        progressText.textContent = `${fakeProgress}%`;
    }, 200);

    try {
        const response = await fetch('/flow/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, targetPath: currentDirectory })
        });

        clearInterval(interval);

        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        progressBar.style.width = '100%';
        progressText.textContent = '100%';

        setTimeout(() => {
            window.closeModal();
            displayDirectory(currentDirectory);
            progressBar.style.width = '0%';
            progressText.textContent = '';
            progressContainer.style.display = 'none';
            button.disabled = false;
        }, 1000);
    } catch (error) {
        clearInterval(interval);
        console.error("Download error:", error);
        alert("Failed to start download.");
        progressBar.style.width = '0%';
        progressText.textContent = '';
        progressContainer.style.display = 'none';
        button.disabled = false;
    }
};



/*function for uploading files*/
window.triggerFileUpload = function () {
    document.getElementById('hidden-upload').click();
};

window.handleFileUpload = function () {
    const fileInput = document.getElementById('hidden-upload');
    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress-bar');
    const progressText = document.getElementById('upload-progress-text');


    if (!fileInput.files.length) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetPath', currentDirectory);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/flow/api/upload', true);

    xhr.upload.onprogress = function (event) {
        if (event.lengthComputable) {
            const percent = Math.floor((event.loaded / event.total) * 100);
            progressBar.style.width = `${percent}%`;
            progressText.textContent = `${percent}%`;

        }
    };

    xhr.onloadstart = function () {
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
    };

    xhr.onloadend = function () {
        progressBar.style.width = '100%';
        setTimeout(() => {
            progressContainer.style.display = 'none';
            progressBar.style.width = '0%';
            fileInput.value = '';
        }, 1000);
    };

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                displayDirectory(currentDirectory);
                alert("Upload successful!");
            } else {
                alert("Upload failed.");
            }
        }
    };

    xhr.send(formData);
};





/*functions for the navigation of folders */

async function displayDirectory(path, explorerId = 'file-explorer') {
    currentDirectory = path;
    const explorer = document.getElementById(explorerId);
    if (!explorer) {
        console.warn(`Explorer element with ID "${explorerId}" not found.`);
        return;
    }
    explorer.innerHTML = ''; /* Clear current contents*/


    // Add "Go Up" link if not at root
    const rootPath = '/workspace/ComfyUI/models';
    if (path !== rootPath) {
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        const upItem = document.createElement('div');
        upItem.className = 'file-item up';

        // Create a span for the name and icon (like other items)
        const nameSpan = document.createElement('span');
        nameSpan.className = 'file-name';
        nameSpan.style.display = 'flex';
        nameSpan.style.alignItems = 'center';
        nameSpan.style.gap = 'center';

        // Add the icon inside the name span
        const upIcon = document.createElement('i');
        upIcon.className = 'fas fa-arrow-up';
        upIcon.title = 'Go Up';
        upIcon.style.marginRight = '6px'; // tighter spacing


        const upLabel = document.createElement('span');
        upLabel.textContent = 'Go Up';

        nameSpan.appendChild(upIcon);
        nameSpan.appendChild(upLabel);

        upItem.appendChild(nameSpan);
        upItem.onclick = () => displayDirectory(parentPath, explorerId);
        explorer.appendChild(upItem);

    }

    const directory = await loadDirectory(path);
    directory.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    directory.forEach(item => {
        const fileItem = createFileItem(item.name, item.type, `${path}/${item.name}`, explorerId);
        explorer.appendChild(fileItem);
    });
}

function createFileItem(name, type, path) {
    const item = document.createElement('div');
    item.className = `file-item ${type}`;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'file-name';
    nameSpan.textContent = name;
    nameSpan.onclick = () => {
        if (type === 'folder') {
            displayDirectory(path);
        }
    };

    const actions = document.createElement('span');
    actions.className = 'file-actions';

    if (type === 'file') {
        // Rename button
        const renameBtn = document.createElement('button');
        renameBtn.innerHTML = '<i class="fas fa-pen"></i>';
        renameBtn.title = 'Rename';
        renameBtn.onclick = async (e) => {
            e.stopPropagation();
            const newName = prompt("Enter new name:", name);
            if (newName && newName !== name) {
                await renameFile(path, newName);
            }
        };

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = async (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${name}"?`)) {
                await deleteFile(path);
            }
        };

        actions.appendChild(renameBtn);
        actions.appendChild(deleteBtn);
    }

    const nameAndActions = document.createElement('div');
    nameAndActions.style.display = 'flex';
    nameAndActions.style.alignItems = 'center';
    nameAndActions.style.gap = '8px';

    nameAndActions.appendChild(nameSpan);
    nameAndActions.appendChild(actions);

    item.appendChild(nameAndActions);


    return item;
}




async function loadDirectory(path) {
    try {
        const response = await fetch(`/flow/api/directory?path=${encodeURIComponent(path)}`);
        if (!response.ok) {
            throw new Error(`Failed to load directory: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading directory:", error);
        return [];
    }
}

async function renameFile(currentPath, newName) {
    try {
        const response = await fetch('/flow/api/rename-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPath, newName })
        });
        if (!response.ok) {
            throw new Error(`Rename failed: ${response.statusText}`);
        }
        await displayDirectory(currentDirectory);
    } catch (error) {
        console.error("Rename error:", error);
        alert("Failed to rename file.");
    }
}

async function deleteFile(filePath) {
    try {
        const response = await fetch('/flow/api/delete-file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filePath })
        });
        if (!response.ok) {
            throw new Error(`Delete failed: ${response.statusText}`);
        }
        await displayDirectory(currentDirectory);
    } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete file.");
    }
};

import { insertElement } from '../../../core/js/common/components/header.js';

        document.addEventListener('DOMContentLoaded', () => {
            const headerContainer = document.querySelector('header');
            insertElement(headerContainer);

            // Delay the update to ensure the header is fully rendered
            setTimeout(() => {
                const appNameElement = document.querySelector('.appName');
                if (appNameElement) {
                    appNameElement.textContent = 'Model Manager';
                    appNameElement.style.fontSize = '1.5em'; // or '20px', '24px', etc.

                }
            }, 300);
        });



