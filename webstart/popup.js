document.addEventListener('DOMContentLoaded', () => {
  const urlList = document.getElementById('urlList');
  const addUrlForm = document.getElementById('addUrlForm');
  const urlInput = document.getElementById('urlInput');
  const themeToggle = document.getElementById('themeToggle');
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');
  const openInNewWindow = document.getElementById('openInNewWindow');

  // Load saved URLs and settings
  chrome.storage.sync.get(['urls', 'darkMode', 'openInNewWindow'], (data) => {
    if (data.darkMode) {
      document.body.classList.add('dark');
    }
    if (data.openInNewWindow) {
      openInNewWindow.checked = true;
    }
    if (data.urls) {
      data.urls.forEach(url => addUrlToList(url));
    }
  });

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    chrome.storage.sync.set({
      darkMode: document.body.classList.contains('dark')
    });
  });

  // Settings toggle
  settingsToggle.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  // New window setting
  openInNewWindow.addEventListener('change', () => {
    chrome.storage.sync.set({
      openInNewWindow: openInNewWindow.checked
    });
  });

  // Add URL
  addUrlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = urlInput.value;
    
    if (url) {
      chrome.storage.sync.get(['urls'], (data) => {
        const urls = data.urls || [];
        if (!urls.includes(url)) {
          urls.push(url);
          chrome.storage.sync.set({ urls });
          addUrlToList(url);
          urlInput.value = '';
        }
      });
    }
  });

  function addUrlToList(url) {
    const div = document.createElement('div');
    div.className = 'url-item flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg';
    
    const urlText = document.createElement('span');
    urlText.textContent = url;
    urlText.className = 'truncate flex-1';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `
      <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
      </svg>
    `;
    deleteBtn.className = 'btn p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full ml-2';
    
    deleteBtn.addEventListener('click', () => {
      chrome.storage.sync.get(['urls'], (data) => {
        const urls = data.urls.filter(u => u !== url);
        chrome.storage.sync.set({ urls });
        div.remove();
      });
    });

    div.appendChild(urlText);
    div.appendChild(deleteBtn);
    urlList.appendChild(div);
  }
});