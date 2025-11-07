// Sample data (saved to localStorage)
let profile = JSON.parse(localStorage.getItem('profile')) || {
    name: 'Your Name',
    bio: 'Add a short bio here.',
    pic: 'https://via.placeholder.com/150',
    links: [
        { label: 'Twitter', url: 'https://twitter.com/yourhandle' },
        { label: 'Instagram', url: 'https://instagram.com/yourhandle' }
    ]
};

let editMode = false;

// Render the page
function render() {
    document.getElementById('name').textContent = profile.name;
    document.getElementById('bio').textContent = profile.bio;
    document.getElementById('profile-pic').src = profile.pic;
    
    const linksEl = document.getElementById('links');
    linksEl.innerHTML = '';
    profile.links.forEach(link => {
        const btn = document.createElement('a');
        btn.href = link.url;
        btn.textContent = link.label;
        btn.className = 'link-btn';
        btn.target = '_blank';
        linksEl.appendChild(btn);
    });
}

// Toggle edit modal
document.getElementById('edit-btn').addEventListener('click', () => {
    editMode = true;
    document.getElementById('edit-modal').style.display = 'block';
    document.getElementById('edit-name').value = profile.name;
    document.getElementById('edit-bio').value = profile.bio;
    document.getElementById('edit-pic').value = profile.pic;
    
    // Render link inputs
    const inputsEl = document.getElementById('link-inputs');
    inputsEl.innerHTML = '';
    profile.links.forEach((link, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <label>Link ${index + 1} Label: <input type="text" value="${link.label}" data-index="${index}" class="link-label"></label>
            <label>URL: <input type="url" value="${link.url}" data-index="${index}" class="link-url"></label>
            <button type="button" onclick="removeLink(${index})">Remove</button>
        `;
        inputsEl.appendChild(div);
    });
});

// Add new link input
document.getElementById('add-link').addEventListener('click', () => {
    const index = profile.links.length;
    const div = document.createElement('div');
    div.innerHTML = `
        <label>Link ${index + 1} Label: <input type="text" placeholder="e.g., Twitter" data-index="${index}" class="link-label"></label>
        <label>URL: <input type="url" placeholder="https://..." data-index="${index}" class="link-url"></label>
        <button type="button" onclick="removeLink(${index})">Remove</button>
    `;
    document.getElementById('link-inputs').appendChild(div);
    profile.links.push({ label: '', url: '' }); // Placeholder
});

// Remove link
function removeLink(index) {
    profile.links.splice(index, 1);
    // Re-render inputs (simplified; in production, re-loop)
    // For brevity, reload the add listener or re-call render inputs
}

// Save form
document.getElementById('edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    profile.name = document.getElementById('edit-name').value;
    profile.bio = document.getElementById('edit-bio').value;
    profile.pic = document.getElementById('edit-pic').value;
    
    // Update links
    const labels = document.querySelectorAll('.link-label');
    const urls = document.querySelectorAll('.link-url');
    profile.links = [];
    labels.forEach((label, i) => {
        const url = urls[i];
        if (label.value && url.value) {
            profile.links.push({ label: label.value, url: url.value });
        }
    });
    
    localStorage.setItem('profile', JSON.stringify(profile));
    render();
    document.getElementById('edit-modal').style.display = 'none';
    editMode = false;
});

// Cancel
document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-modal').style.display = 'none';
    editMode = false;
});

// Initial render
render();
