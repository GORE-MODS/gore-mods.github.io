/* ==== Data (persisted in localStorage) ==== */
let profile = JSON.parse(localStorage.getItem('myBioLink')) || {
    name: 'Your Name',
    bio: 'Add a short bio here.',
    pic: 'https://via.placeholder.com/150',
    links: [
        { label: 'Twitter', url: 'https://twitter.com/yourhandle' },
        { label: 'Instagram', url: 'https://instagram.com/yourhandle' }
    ]
};

/* ==== Dark-mode handling ==== */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) body.classList.toggle('dark', savedTheme === 'dark');
else body.classList.add('light');

themeToggle.textContent = body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ==== Rendering ==== */
function render() {
    document.getElementById('name').textContent = profile.name;
    document.getElementById('bio').textContent = profile.bio;
    document.getElementById('profile-pic').src = profile.pic || 'https://via.placeholder.com/150';

    const linksEl = document.getElementById('links');
    linksEl.innerHTML = '';
    profile.links.forEach(l => {
        const a = Object.assign(document.createElement('a'), {
            href: l.url,
            textContent: l.label,
            className: 'link-btn',
            target: '_blank',
            rel: 'noopener'
        });
        linksEl.appendChild(a);
    });
}

/* ==== Edit modal ==== */
const modal = document.getElementById('edit-modal');
document.getElementById('edit-btn').onclick = openEdit;
function openEdit() {
    modal.style.display = 'flex';
    document.getElementById('edit-name').value = profile.name;
    document.getElementById('edit-bio').value = profile.bio;
    document.getElementById('edit-pic').value = profile.pic;

    const container = document.getElementById('link-inputs');
    container.innerHTML = '';
    profile.links.forEach((lnk, i) => addLinkRow(container, lnk, i));
}
function addLinkRow(parent, data = {label:'',url:''}, idx = profile.links.length) {
    const div = document.createElement('div');
    div.className = 'link-row';
    div.innerHTML = `
        <input type="text" placeholder="Label" value="${data.label}" data-idx="${idx}" class="link-label">
        <input type="url" placeholder="https://..." value="${data.url}" data-idx="${idx}" class="link-url">
        <button type="button" class="remove-link" data-idx="${idx}">Remove</button>
    `;
    parent.appendChild(div);
}
document.getElementById('add-link').onclick = () => {
    const idx = profile.links.length;
    profile.links.push({label:'',url:''});
    addLinkRow(document.getElementById('link-inputs'), {}, idx);
};

/* ==== Save ==== */
document.getElementById('edit-form').onsubmit = e => {
    e.preventDefault();
    profile.name = document.getElementById('edit-name').value.trim();
    profile.bio = document.getElementById('edit-bio').value.trim();
    profile.pic = document.getElementById('edit-pic').value.trim();

    const labels = document.querySelectorAll('.link-label');
    const urls   = document.querySelectorAll('.link-url');
    profile.links = [];
    labels.forEach((lbl,i) => {
        const u = urls[i];
        if (lbl.value && u.value) profile.links.push({label:lbl.value, url:u.value});
    });

    localStorage.setItem('myBioLink', JSON.stringify(profile));
    modal.style.display = 'none';
    render();
};
document.getElementById('cancel-edit').onclick = () => modal.style.display = 'none';

/* ==== Remove link row ==== */
document.addEventListener('click', ev => {
    if (ev.target.classList.contains('remove-link')) {
        const idx = +ev.target.dataset.idx;
        profile.links.splice(idx,1);
        openEdit(); // re-render rows
    }
});

/* ==== Init ==== */
render();
