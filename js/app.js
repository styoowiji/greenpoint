const App = {

  // === DATA STORE ===
  db: {
    get users() { return JSON.parse(localStorage.getItem('gp_users') || '[]'); },
    set users(v) { localStorage.setItem('gp_users', JSON.stringify(v)); },

    get setorans() { return JSON.parse(localStorage.getItem('gp_setorans') || '[]'); },
    set setorans(v) { localStorage.setItem('gp_setorans', JSON.stringify(v)); },

    get rewards() { return JSON.parse(localStorage.getItem('gp_rewards') || '[]'); },
    set rewards(v) { localStorage.setItem('gp_rewards', JSON.stringify(v)); },

    get penukarans() { return JSON.parse(localStorage.getItem('gp_penukarans') || '[]'); },
    set penukarans(v) { localStorage.setItem('gp_penukarans', JSON.stringify(v)); },

    get jadwals() { return JSON.parse(localStorage.getItem('gp_jadwals') || '[]'); },
    set jadwals(v) { localStorage.setItem('gp_jadwals', JSON.stringify(v)); },

    get notifikasi() { return JSON.parse(localStorage.getItem('gp_notifikasi') || '[]'); },
    set notifikasi(v) { localStorage.setItem('gp_notifikasi', JSON.stringify(v)); },

    get session() { return localStorage.getItem('gp_session'); },
    set session(v) { localStorage.setItem('gp_session', v); },
  },

  currentUser: null,

  // === INIT ===
  async init() {
    await this.seedData();
    await this.checkSession();
    setTimeout(() => {
      const splash = document.getElementById('splash-screen');
      splash.style.opacity = '0';
      setTimeout(() => splash.style.display = 'none', 400);
    }, 1200);
  },

  checkSession() {
    const uid = this.db.session;
    if (uid) {
      const user = this.db.users.find(u => u.id === uid && u.active !== false);
      if (user) {
        this.currentUser = user;
        this.showApp();
        this.showPage('home');
        return;
      }
    }
    this.db.session = null;
    this.showAuth();
    this.showPage('login');
  },

  showAuth() {
    document.getElementById('bottom-nav').style.display = 'none';
    document.querySelectorAll('.auth-page').forEach(p => p.style.display = '');
  },

  showApp() {
    document.getElementById('bottom-nav').style.display = 'flex';
    document.querySelectorAll('.auth-page').forEach(p => p.style.display = 'none');
  },

  // === SEED DATA ===
  async seedData() {
    if (this.db.users.length === 0) {
      this.db.users = [
        { id: 'admin', name: 'Admin GreenPoint', phone: '081234567890', address: 'Desa Ngemplak, Sragen', type: 'admin', password: 'admin123', active: true },
        { id: 'petugas1', name: 'Petugas Bank Sampah', phone: '081234567891', address: 'Desa Ngemplak, Sragen', type: 'petugas', password: 'petugas123', active: true },
      ];
    }
    if (this.db.rewards.length === 0) {
      this.db.rewards = [
        { id: 'r1', name: 'Diskon 5% Warung Sederhana', category: 'diskon', poin: 50, emoji: '🍜', stock: 20 },
        { id: 'r2', name: 'Diskon 10% Warung Makan', category: 'diskon', poin: 100, emoji: '🍛', stock: 15 },
        { id: 'r3', name: 'Sapu Lidi 1 Pcs', category: 'kebersihan', poin: 30, emoji: '🧹', stock: 25 },
        { id: 'r4', name: 'Alat Pel 1 Set', category: 'kebersihan', poin: 75, emoji: '🪣', stock: 10 },
        { id: 'r5', name: 'Sertifikat Warga Peduli Lingkungan', category: 'sertifikat', poin: 150, emoji: '📜', stock: 50 },
        { id: 'r6', name: 'Sertifikat Usaha Ramah Lingkungan', category: 'bisnis', poin: 200, emoji: '🏆', stock: 20 },
        { id: 'r7', name: 'Diskon Supplier Bahan Baku 5%', category: 'bisnis', poin: 300, emoji: '📦', stock: 10 },
        { id: 'r8', name: 'E-Money Rp5.000', category: 'emoney', poin: 200, emoji: '💳', stock: 30 },
        { id: 'r9', name: 'E-Money Rp10.000', category: 'emoney', poin: 350, emoji: '💳', stock: 20 },
        { id: 'r10', name: 'Alat Makan Bambu 1 Set', category: 'kebersihan', poin: 60, emoji: '🥢', stock: 15 },
      ];
    }
    if (this.db.lokasi === undefined) {
      this.db.lokasi = this.db.lokasi || [];
    }
  },

  // === ROUTING ===
  showPage(page) {
    document.querySelectorAll('.page').forEach(p => {
      if (p.id !== 'splash-screen') p.style.display = 'none';
    });
    const el = document.getElementById(`page-${page}`);
    if (el) el.style.display = 'flex';

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const nav = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (nav) nav.classList.add('active');

    if (page !== 'login' && page !== 'register') {
      this.renderPage(page);
    }
  },

  renderPage(page) {
    switch(page) {
      case 'home': this.renderHome(); break;
      case 'setor': this.renderSetor(); break;
      case 'reward': this.renderReward(); break;
      case 'lokasi': this.renderLokasi(); break;
      case 'aktivitas': this.renderAktivitas(); break;
      case 'jadwal': this.renderJadwal(); break;
      case 'profil': this.renderProfil(); break;
      case 'notifikasi': this.renderNotifikasi(); break;
      case 'admin': this.renderAdmin(); break;
    }
    this.updateNotifBadge();
  },

  // === AUTH ===
  login() {
    const phone = document.getElementById('login-phone').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.style.display = 'none';

    if (!phone || !password) {
      errorEl.textContent = 'Harap isi nomor HP dan kata sandi';
      errorEl.style.display = 'block'; return;
    }

    const user = this.db.users.find(u => u.phone === phone && u.password === password);
    if (!user) {
      errorEl.textContent = 'Nomor HP atau kata sandi salah';
      errorEl.style.display = 'block'; return;
    }
    if (user.active === false) {
      errorEl.textContent = 'Akun Anda telah dinonaktifkan';
      errorEl.style.display = 'block'; return;
    }

    this.currentUser = user;
    this.db.session = user.id;
    this.showApp();
    this.showPage('home');
  },

  register() {
    const name = document.getElementById('reg-name').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const address = document.getElementById('reg-address').value.trim();
    const type = document.getElementById('reg-type').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const errorEl = document.getElementById('register-error');
    errorEl.style.display = 'none';

    if (!name || !phone || !address || !password) {
      errorEl.textContent = 'Harap isi semua field';
      errorEl.style.display = 'block'; return;
    }
    if (password.length < 6) {
      errorEl.textContent = 'Kata sandi minimal 6 karakter';
      errorEl.style.display = 'block'; return;
    }
    if (password !== confirm) {
      errorEl.textContent = 'Konfirmasi kata sandi tidak cocok';
      errorEl.style.display = 'block'; return;
    }
    if (this.db.users.find(u => u.phone === phone)) {
      errorEl.textContent = 'Nomor HP sudah terdaftar';
      errorEl.style.display = 'block'; return;
    }

    const user = {
      id: 'u' + Date.now(),
      name, phone, address,
      type,
      password,
      active: true,
      createdAt: new Date().toISOString()
    };

    const users = this.db.users;
    users.push(user);
    this.db.users = users;

    this.currentUser = user;
    this.db.session = user.id;

    this.tambahNotifikasi('Selamat datang di GreenPoint!', 'Akun Anda berhasil dibuat. Ayo mulai setor sampah dan kumpulkan poin!');

    this.showApp();
    this.showPage('home');
  },

  logout() {
    this.currentUser = null;
    this.db.session = null;
    this.showAuth();
    this.showPage('login');
    document.getElementById('login-phone').value = '';
    document.getElementById('login-password').value = '';
  },

  // === HOME ===
  renderHome() {
    const user = this.currentUser;
    if (!user) return;

    const hour = new Date().getHours();
    let greeting = 'Selamat';
    if (hour < 10) greeting = 'Selamat Pagi';
    else if (hour < 15) greeting = 'Selamat Siang';
    else if (hour < 18) greeting = 'Selamat Sore';
    else greeting = 'Selamat Malam';

    const roleLabel = { warga: 'Warga Umum', usaha: 'Pelaku Usaha', admin: 'Admin', petugas: 'Petugas' };

    document.getElementById('greeting-text').textContent = `${greeting}, ${user.name.split(' ')[0]}`;
    document.getElementById('user-role-badge').textContent = roleLabel[user.type] || user.type;

    const poin = this.hitungTotalPoin(user.id);
    document.getElementById('home-points').textContent = this.formatNumber(poin);

    const quickActions = document.querySelector('.quick-actions');
    const existingAdminBtn = quickActions.querySelector('.qa-btn-admin');
    if (user.type === 'admin' || user.type === 'petugas') {
      if (!existingAdminBtn) {
        const btn = document.createElement('button');
        btn.className = 'qa-btn qa-btn-admin';
        btn.innerHTML = '<span class="qa-icon">⚙️</span><span class="qa-label">Panel Admin</span>';
        btn.onclick = () => this.showPage('admin');
        quickActions.appendChild(btn);
      }
    } else if (existingAdminBtn) {
      existingAdminBtn.remove();
    }

    this.renderRecentActivity();
  },

  renderRecentActivity() {
    const list = document.getElementById('recent-activity-list');
    const all = [...this.db.setorans.filter(s => s.userId === this.currentUser.id),
                 ...this.db.penukarans.filter(p => p.userId === this.currentUser.id)]
      .sort((a,b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    if (all.length === 0) {
      list.innerHTML = '<div class="empty-state">Belum ada aktivitas</div>';
      return;
    }

    list.innerHTML = all.map(a => {
      if (a.type === 'setor') {
        const statusLabel = { pending: 'Pending', diproses: 'Diproses', selesai: 'Selesai', ditolak: 'Ditolak' };
        return `
          <div class="activity-item">
            <div class="activity-icon">🗑️</div>
            <div class="activity-info">
              <div class="activity-title">Setor Sampah ${a.jenis}</div>
              <div class="activity-desc">${a.berat} kg • ${this.formatDate(a.date)}</div>
            </div>
            <div class="activity-status status-${a.status}">${statusLabel[a.status]}</div>
          </div>`;
      } else {
        return `
          <div class="activity-item">
            <div class="activity-icon">🎁</div>
            <div class="activity-info">
              <div class="activity-title">Tukar Poin: ${a.rewardName}</div>
              <div class="activity-desc">${a.poin} poin • ${this.formatDate(a.date)}</div>
            </div>
            <div class="activity-status status-selesai">Selesai</div>
          </div>`;
      }
    }).join('');
  },

  // === SETOR SAMPAH ===
  selectedWasteType: 'organik',

  renderSetor() {
    this.selectedWasteType = 'organik';
    document.querySelectorAll('.waste-option').forEach(w => w.classList.remove('selected'));
    document.querySelector('.waste-option[data-type="organik"]').classList.add('selected');
    document.getElementById('setor-berat').value = '';
    document.getElementById('estimasi-nilai').textContent = '0';
    document.getElementById('foto-preview').style.display = 'none';
    document.getElementById('foto-placeholder').textContent = '📷 Ambil Foto';
    document.getElementById('setor-catatan').value = '';
    document.getElementById('setor-error').style.display = 'none';
    this.updateSubkategori('organik');
  },

  selectWasteType(type) {
    this.selectedWasteType = type;
    document.querySelectorAll('.waste-option').forEach(w => w.classList.remove('selected'));
    document.querySelector(`.waste-option[data-type="${type}"]`).classList.add('selected');
    this.updateSubkategori(type);
    this.hitungEstimasiPoin();
  },

  updateSubkategori(type) {
    const sel = document.getElementById('setor-subkategori');
    const options = type === 'organik'
      ? [{v:'sisa_makanan',l:'Sisa Makanan'},{v:'sayuran',l:'Sayuran'},{v:'buah',l:'Buah Busuk'},{v:'daun',l:'Daun/Kebun'}]
      : [{v:'plastik',l:'Plastik'},{v:'botol',l:'Botol Kaca'},{v:'kertas',l:'Kertas/Kardus'},{v:'kaleng',l:'Kaleng/Logam'},{v:'elektronik',l:'Elektronik'}];
    sel.innerHTML = '<option value="">Pilih sub-kategori</option>' + options.map(o => `<option value="${o.v}">${o.l}</option>`).join('');
  },

  hitungEstimasiPoin() {
    const berat = parseFloat(document.getElementById('setor-berat').value) || 0;
    let poin = 0;
    if (this.selectedWasteType === 'organik') {
      poin = Math.floor((berat * 1000 / 100) * 5);
    } else {
      poin = Math.floor(berat * 10);
    }
    document.getElementById('estimasi-nilai').textContent = this.formatNumber(poin);
  },

  previewFoto(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        document.getElementById('foto-preview').src = ev.target.result;
        document.getElementById('foto-preview').style.display = 'block';
        document.getElementById('foto-placeholder').textContent = '📸 Foto diambil';
      };
      reader.readAsDataURL(file);
    }
  },

  kirimSetoran() {
    const jenis = this.selectedWasteType;
    const subkategori = document.getElementById('setor-subkategori').value;
    const berat = parseFloat(document.getElementById('setor-berat').value);
    const catatan = document.getElementById('setor-catatan').value.trim();
    const errorEl = document.getElementById('setor-error');
    errorEl.style.display = 'none';

    if (!berat || berat <= 0) {
      errorEl.textContent = 'Harap masukkan berat sampah';
      errorEl.style.display = 'block'; return;
    }

    const poin = jenis === 'organik' ? Math.floor((berat * 1000 / 100) * 5) : Math.floor(berat * 10);

    const setoran = {
      id: 's' + Date.now(),
      userId: this.currentUser.id,
      jenis,
      subkategori,
      berat,
      poin,
      catatan,
      status: 'pending',
      date: new Date().toISOString(),
      foto: document.getElementById('foto-preview').src || null
    };

    const setorans = this.db.setorans;
    setorans.push(setoran);
    this.db.setorans = setorans;

    this.tambahNotifikasi('Setoran berhasil dikirim!', `Setoran ${jenis} ${berat} kg menunggu validasi petugas. Estimasi poin: ${poin}`);

    alert('✅ Setoran berhasil dikirim! Menunggu validasi petugas.');
    this.showPage('home');
  },

  // === REWARD / EXCHANGE ===
  currentRewardFilter: 'all',

  renderReward(filter) {
    const poin = this.hitungTotalPoin(this.currentUser.id);
    document.getElementById('reward-points').textContent = this.formatNumber(poin);

    this.currentRewardFilter = filter || 'all';
    document.querySelectorAll('#reward-filters .chip').forEach(c => {
      c.classList.toggle('active', c.dataset.filter === this.currentRewardFilter);
    });
    this.renderRewardList();
  },

  filterReward(filter) {
    this.renderReward(filter);
  },

  renderRewardList() {
    const list = document.getElementById('reward-list');
    let rewards = this.db.rewards;
    if (this.currentRewardFilter !== 'all') {
      rewards = rewards.filter(r => r.category === this.currentRewardFilter);
    }

    if (rewards.length === 0) {
      list.innerHTML = '<div class="empty-state">Tidak ada reward di kategori ini</div>';
      return;
    }

    const userPoin = this.hitungTotalPoin(this.currentUser.id);

    list.innerHTML = rewards.map(r => {
      const bisaTukar = userPoin >= r.poin && r.stock > 0;
      return `
        <div class="reward-card">
          <div class="reward-emoji">${r.emoji}</div>
          <div class="reward-name">${r.name}</div>
          <div class="reward-points">${this.formatNumber(r.poin)} poin</div>
          <div class="reward-stock">Stok: ${r.stock}</div>
          <button class="btn btn-sm ${bisaTukar ? 'btn-primary' : 'btn-outline'}" ${bisaTukar ? `onclick="App.tukarReward('${r.id}')"` : 'disabled'}>
            ${bisaTukar ? 'Tukar' : 'Poin Kurang'}
          </button>
        </div>`;
    }).join('');
  },

  tukarReward(rewardId) {
    const reward = this.db.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    const userPoin = this.hitungTotalPoin(this.currentUser.id);
    if (userPoin < reward.poin) {
      alert('Poin Anda tidak mencukupi!');
      return;
    }
    if (reward.stock <= 0) {
      alert('Stok reward habis!');
      return;
    }

    if (!confirm(`Tukarkan ${this.formatNumber(reward.poin)} poin dengan ${reward.name}?`)) return;

    const penukaran = {
      id: 'p' + Date.now(),
      userId: this.currentUser.id,
      rewardId: reward.id,
      rewardName: reward.name,
      rewardEmoji: reward.emoji,
      poin: reward.poin,
      date: new Date().toISOString(),
      type: 'tukar'
    };

    const penukarans = this.db.penukarans;
    penukarans.push(penukaran);
    this.db.penukarans = penukarans;

    const rewards = this.db.rewards;
    const r = rewards.find(x => x.id === rewardId);
    if (r) r.stock--;
    this.db.rewards = rewards;

    this.tambahNotifikasi('Penukaran berhasil!', `Anda telah menukarkan ${reward.poin} poin dengan ${reward.name}.`);

    alert(`✅ Selamat! ${reward.name} berhasil ditukarkan.`);
    this.renderReward(this.currentRewardFilter);
  },

  // === LOKASI TERDEKAT ===
  renderLokasi() {
    const list = document.getElementById('lokasi-list');
    const lokasi = [
      { name: 'Bank Sampah Induk Desa Ngemplak', address: 'Jl. Raya Ngemplak No. 1, Sragen', jarak: '0.5 km', jam: '08:00 - 16:00', emoji: '🏪' },
      { name: 'Drop Point Balai Desa', address: 'Balai Desa Ngemplak, Sragen', jarak: '0.8 km', jam: '07:00 - 17:00', emoji: '🏛️' },
      { name: 'Bank Sampah Unit Karanganyar', address: 'Jl. Karanganyar RT 03, Sragen', jarak: '1.2 km', jam: '08:00 - 15:00', emoji: '🏪' },
      { name: 'Drop Point Pasar Ngemplak', address: 'Pasar Tradisional Ngemplak', jarak: '1.5 km', jam: '06:00 - 18:00', emoji: '🏬' },
    ];

    list.innerHTML = lokasi.map(l => `
      <div class="lokasi-card">
        <div class="lokasi-name">${l.emoji} ${l.name}</div>
        <div class="lokasi-address">${l.address}</div>
        <div class="lokasi-info">
          <span>📍 ${l.jarak}</span>
          <span>🕐 ${l.jam}</span>
        </div>
        <div class="lokasi-actions">
          <button class="btn btn-sm btn-primary" onclick='alert("Membuka Google Maps...📍\\n${l.name}\\n${l.address}")'>🗺️ Lihat Rute</button>
        </div>
      </div>
    `).join('');
  },

  initMap() {
    const placeholder = document.getElementById('map-placeholder');
    const container = document.getElementById('map-container');
    placeholder.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = '<div style="width:100%;height:100%;background:#E8F5E9;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--text-secondary)">🗺️ Peta akan tampil di sini (Google Maps API)</div>';
  },

  // === AKTIVITAS ===
  currentAktivitasFilter: 'all',

  renderAktivitas(filter) {
    this.currentAktivitasFilter = filter || 'all';
    document.querySelectorAll('#aktivitas-filters .chip').forEach(c => {
      c.classList.toggle('active', c.dataset.period === this.currentAktivitasFilter);
    });
    this.renderAktivitasList();
  },

  filterAktivitas(filter) {
    this.renderAktivitas(filter);
  },

  renderAktivitasList() {
    const list = document.getElementById('aktivitas-list');

    let setorans = this.db.setorans.filter(s => s.userId === this.currentUser.id).map(s => ({ ...s, type: 'setor' }));
    let penukarans = this.db.penukarans.filter(p => p.userId === this.currentUser.id).map(p => ({ ...p, type: 'tukar' }));

    let all = [...setorans, ...penukarans];

    if (this.currentAktivitasFilter && this.currentAktivitasFilter !== 'all') {
      const now = new Date();
      const start = new Date();
      if (this.currentAktivitasFilter === 'today') {
        start.setHours(0,0,0,0);
      } else if (this.currentAktivitasFilter === 'week') {
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0,0,0,0);
      } else if (this.currentAktivitasFilter === 'month') {
        start.setDate(1);
        start.setHours(0,0,0,0);
      }
      all = all.filter(a => new Date(a.date) >= start);
    }

    all.sort((a,b) => new Date(b.date) - new Date(a.date));

    if (all.length === 0) {
      list.innerHTML = '<div class="empty-state">Belum ada aktivitas</div>';
      return;
    }

    list.innerHTML = all.map(a => {
      if (a.type === 'setor') {
        const statusLabel = { pending: 'Pending', diproses: 'Diproses', selesai: 'Selesai', ditolak: 'Ditolak' };
        return `
          <div class="activity-item">
            <div class="activity-icon">🗑️</div>
            <div class="activity-info">
              <div class="activity-title">Setor Sampah ${a.jenis === 'organik' ? '🌿 Organik' : '🧴 Anorganik'}</div>
              <div class="activity-desc">${a.berat} kg • ${this.formatDate(a.date)}${a.catatan ? ' • ' + a.catatan : ''}</div>
            </div>
            <div class="activity-status status-${a.status}">${statusLabel[a.status] || a.status}</div>
          </div>`;
      } else {
        return `
          <div class="activity-item">
            <div class="activity-icon">🎁</div>
            <div class="activity-info">
              <div class="activity-title">Tukar Poin: ${a.rewardName}</div>
              <div class="activity-desc">${a.poin} poin • ${this.formatDate(a.date)}</div>
            </div>
            <div class="activity-status status-selesai">Selesai</div>
          </div>`;
      }
    }).join('');
  },

  // === JADWAL ===
  renderJadwal() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('jadwal-tanggal').value = today;
    document.getElementById('jadwal-jam').value = '09:00';
    document.getElementById('jadwal-volume').value = '';
    document.getElementById('jadwal-catatan').value = '';
    document.getElementById('jadwal-error').style.display = 'none';
    this.renderJadwalList();
  },

  renderJadwalList() {
    const list = document.getElementById('jadwal-list');
    const jadwals = this.db.jadwals.filter(j => j.userId === this.currentUser.id)
      .sort((a,b) => new Date(a.tanggal + 'T' + a.jam) - new Date(b.tanggal + 'T' + b.jam));

    if (jadwals.length === 0) {
      list.innerHTML = '<div class="empty-state">Belum ada jadwal</div>';
      return;
    }

    const jenisLabel = { organik: '🌿 Organik', anorganik: '🧴 Anorganik', campuran: '♻️ Campuran' };

    list.innerHTML = jadwals.map(j => `
      <div class="jadwal-item">
        <div style="font-size:32px">📅</div>
        <div class="jadwal-info">
          <div class="jadwal-date">${this.formatDate(j.tanggal)} • ${j.jam}</div>
          <div class="jadwal-detail">${jenisLabel[j.jenis] || j.jenis} • ${j.volume} kg</div>
        </div>
        <button class="btn btn-sm btn-danger" onclick="App.hapusJadwal('${j.id}')">✕</button>
      </div>
    `).join('');
  },

  buatJadwal() {
    const tanggal = document.getElementById('jadwal-tanggal').value;
    const jam = document.getElementById('jadwal-jam').value;
    const jenis = document.getElementById('jadwal-jenis').value;
    const volume = parseFloat(document.getElementById('jadwal-volume').value) || 0;
    const catatan = document.getElementById('jadwal-catatan').value.trim();
    const errorEl = document.getElementById('jadwal-error');
    errorEl.style.display = 'none';

    if (!tanggal || !jam) {
      errorEl.textContent = 'Harap pilih tanggal dan jam';
      errorEl.style.display = 'block'; return;
    }

    const jadwal = {
      id: 'j' + Date.now(),
      userId: this.currentUser.id,
      tanggal, jam, jenis, volume, catatan,
      status: 'dikonfirmasi',
      date: new Date().toISOString()
    };

    const jadwals = this.db.jadwals;
    jadwals.push(jadwal);
    this.db.jadwals = jadwals;

    this.tambahNotifikasi('Jadwal penjemputan dikonfirmasi!', `Penjemputan ${jenis} pada ${this.formatDate(tanggal)} pukul ${jam}.`);

    alert('✅ Jadwal berhasil dibuat!');
    this.renderJadwal();
  },

  hapusJadwal(id) {
    if (!confirm('Hapus jadwal ini?')) return;
    const jadwals = this.db.jadwals.filter(j => j.id !== id);
    this.db.jadwals = jadwals;
    this.renderJadwal();
  },

  // === PROFIL ===
  renderProfil() {
    const user = this.currentUser;
    if (!user) return;

    const roleLabel = { warga: 'Warga Umum', usaha: 'Pelaku Usaha', admin: 'Admin', petugas: 'Petugas' };

    document.getElementById('profil-nama').textContent = user.name;
    document.getElementById('profil-role').textContent = roleLabel[user.type] || user.type;
    document.getElementById('profil-points').textContent = this.formatNumber(this.hitungTotalPoin(user.id));
    document.getElementById('profil-phone').textContent = user.phone;
    document.getElementById('profil-address').textContent = user.address;
    document.getElementById('profil-type').textContent = roleLabel[user.type] || user.type;
  },

  showEditProfil() {
    const user = this.currentUser;
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <h3>✏️ Edit Profil</h3>
      <div class="form-group">
        <label>Nama Lengkap</label>
        <input type="text" id="edit-name" value="${user.name}">
      </div>
      <div class="form-group">
        <label>Nomor HP</label>
        <input type="tel" id="edit-phone" value="${user.phone}">
      </div>
      <div class="form-group">
        <label>Alamat</label>
        <textarea id="edit-address" rows="2">${user.address}</textarea>
      </div>
      <div id="edit-error" class="form-error" style="display:none"></div>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="App.simpanEditProfil()">Simpan</button>
        <button class="btn btn-outline" onclick="App.tutupModal()">Batal</button>
      </div>
    `;
    document.getElementById('modal-overlay').style.display = 'flex';
  },

  simpanEditProfil() {
    const name = document.getElementById('edit-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const address = document.getElementById('edit-address').value.trim();
    const errorEl = document.getElementById('edit-error');
    errorEl.style.display = 'none';

    if (!name || !phone) {
      errorEl.textContent = 'Nama dan nomor HP tidak boleh kosong';
      errorEl.style.display = 'block'; return;
    }

    const users = this.db.users;
    const idx = users.findIndex(u => u.id === this.currentUser.id);
    if (idx >= 0) {
      users[idx].name = name;
      users[idx].phone = phone;
      users[idx].address = address;
      this.db.users = users;
      this.currentUser = users[idx];
    }

    this.tutupModal();
    this.renderProfil();
    alert('✅ Profil berhasil diperbarui!');
  },

  // === NOTIFIKASI ===
  tambahNotifikasi(title, message) {
    const notif = {
      id: 'n' + Date.now(),
      title,
      message,
      date: new Date().toISOString(),
      read: false
    };
    const notifikasi = this.db.notifikasi;
    notifikasi.unshift(notif);
    this.db.notifikasi = notifikasi;
    this.updateNotifBadge();
  },

  updateNotifBadge() {
    if (!this.currentUser) return;
    const count = this.db.notifikasi.filter(n => !n.read).length;
    const badge = document.getElementById('notif-count');
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  },

  renderNotifikasi() {
    const list = document.getElementById('notifikasi-list');
    const notifikasi = this.db.notifikasi;

    if (notifikasi.length === 0) {
      list.innerHTML = '<div class="empty-state">Belum ada notifikasi</div>';
      return;
    }

    list.innerHTML = notifikasi.map(n => `
      <div class="activity-item" style="${n.read ? '' : 'border-left:3px solid var(--primary)'}">
        <div class="activity-icon">🔔</div>
        <div class="activity-info">
          <div class="activity-title">${n.title}</div>
          <div class="activity-desc">${n.message} • ${this.formatDate(n.date)}</div>
        </div>
      </div>
    `).join('');

    const notif = this.db.notifikasi.map(n => ({ ...n, read: true }));
    this.db.notifikasi = notif;
    this.updateNotifBadge();
  },

  // === ADMIN ===
  currentAdminTab: 'validasi',

  renderAdmin() {
    if (this.currentUser.type !== 'admin' && this.currentUser.type !== 'petugas') {
      this.showPage('home');
      return;
    }
    const isPetugas = this.currentUser.type === 'petugas';
    document.querySelector('.admin-tab[data-tab="reward"]').style.display = isPetugas ? 'none' : '';
    document.querySelector('.admin-tab[data-tab="users"]').style.display = isPetugas ? 'none' : '';

    this.currentAdminTab = 'validasi';
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.admin-tab[data-tab="validasi"]').classList.add('active');
    document.getElementById('admin-validasi').style.display = '';
    document.getElementById('admin-reward').style.display = 'none';
    document.getElementById('admin-users').style.display = 'none';
    this.renderAdminValidasi();
  },

  switchAdminTab(tab) {
    if (this.currentUser.type === 'petugas' && tab !== 'validasi') return;
    this.currentAdminTab = tab;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.admin-tab[data-tab="${tab}"]`).classList.add('active');
    document.getElementById('admin-validasi').style.display = tab === 'validasi' ? '' : 'none';
    document.getElementById('admin-reward').style.display = tab === 'reward' ? '' : 'none';
    document.getElementById('admin-users').style.display = tab === 'users' ? '' : 'none';

    if (tab === 'validasi') this.renderAdminValidasi();
    else if (tab === 'reward') this.renderAdminReward();
    else if (tab === 'users') this.renderAdminUsers();
  },

  renderAdminValidasi() {
    const list = document.getElementById('admin-validasi-list');
    const setorans = this.db.setorans.filter(s => s.status === 'pending')
      .sort((a,b) => new Date(b.date) - new Date(a.date));

    if (setorans.length === 0) {
      list.innerHTML = '<div class="empty-state">Tidak ada setoran yang menunggu validasi</div>';
      return;
    }

    const users = this.db.users;

    list.innerHTML = setorans.map(s => {
      const user = users.find(u => u.id === s.userId);
      const userName = user ? user.name : 'Unknown';
      return `
        <div class="admin-setoran-item">
          <div class="admin-setoran-info">
            <div class="admin-setoran-user">${userName}</div>
            <div class="admin-setoran-detail">${s.jenis === 'organik' ? '🌿 Organik' : '🧴 Anorganik'} • ${s.berat} kg • ${this.formatDate(s.date)}${s.catatan ? ' • ' + s.catatan : ''}</div>
          </div>
          <div class="admin-setoran-actions">
            <button class="btn-approve" onclick="App.validasiSetoran('${s.id}','selesai')">✅</button>
            <button class="btn-reject" onclick="App.validasiSetoran('${s.id}','ditolak')">❌</button>
          </div>
        </div>`;
    }).join('');
  },

  validasiSetoran(id, status) {
    const setorans = this.db.setorans;
    const s = setorans.find(x => x.id === id);
    if (!s) return;

    const alasan = status === 'ditolak' ? prompt('Alasan penolakan:') : '';
    if (status === 'ditolak' && !alasan) {
      alert('Harap isi alasan penolakan');
      return;
    }

    s.status = status;
    s.validatedBy = this.currentUser.id;
    s.validatedAt = new Date().toISOString();
    if (alasan) s.alasanTolak = alasan;
    this.db.setorans = setorans;

    if (status === 'selesai') {
      this.tambahNotifikasi('Setoran divalidasi ✓', `Setoran ${s.jenis} ${s.berat} kg Anda telah divalidasi. ${s.poin} poin ditambahkan!`);
    } else {
      this.tambahNotifikasi('Setoran ditolak ✗', `Setoran ${s.jenis} ${s.berat} kg Anda ditolak. Alasan: ${alasan}`);
    }

    this.renderAdminValidasi();
  },

  renderAdminReward() {
    const list = document.getElementById('admin-reward-list');
    const rewards = this.db.rewards;

    if (rewards.length === 0) {
      list.innerHTML = '<div class="empty-state">Belum ada reward</div>';
      return;
    }

    const catLabel = { diskon: 'Diskon UMKM', kebersihan: 'Kebersihan', sertifikat: 'Sertifikat', bisnis: 'Khusus Bisnis', emoney: 'E-Money' };

    list.innerHTML = rewards.map(r => `
      <div class="admin-reward-item">
        <div style="font-size:28px">${r.emoji}</div>
        <div class="admin-reward-info">
          <div class="admin-reward-name">${r.name}</div>
          <div class="admin-reward-meta">${catLabel[r.category] || r.category} • ${r.poin} poin • Stok: ${r.stock}</div>
        </div>
        <div class="admin-reward-actions">
          <button class="btn btn-sm btn-outline" onclick="App.editReward('${r.id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="App.hapusReward('${r.id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  },

  tambahReward() {
    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <h3>➕ Tambah Reward</h3>
      <div class="form-group">
        <label>Nama Reward</label>
        <input type="text" id="reward-name">
      </div>
      <div class="form-group">
        <label>Kategori</label>
        <select id="reward-category">
          <option value="diskon">Diskon UMKM</option>
          <option value="kebersihan">Kebersihan</option>
          <option value="sertifikat">Sertifikat</option>
          <option value="bisnis">Khusus Bisnis</option>
          <option value="emoney">E-Money</option>
        </select>
      </div>
      <div class="form-group">
        <label>Poin Dibutuhkan</label>
        <input type="number" id="reward-poin" min="1">
      </div>
      <div class="form-group">
        <label>Emoji</label>
        <input type="text" id="reward-emoji" value="🎁">
      </div>
      <div class="form-group">
        <label>Stok</label>
        <input type="number" id="reward-stock" value="10" min="1">
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="App.simpanRewardBaru()">Simpan</button>
        <button class="btn btn-outline" onclick="App.tutupModal()">Batal</button>
      </div>
    `;
    document.getElementById('modal-overlay').style.display = 'flex';
  },

  simpanRewardBaru() {
    const name = document.getElementById('reward-name').value.trim();
    const category = document.getElementById('reward-category').value;
    const poin = parseInt(document.getElementById('reward-poin').value);
    const emoji = document.getElementById('reward-emoji').value.trim() || '🎁';
    const stock = parseInt(document.getElementById('reward-stock').value) || 10;

    if (!name || !poin) { alert('Harap isi nama dan poin'); return; }

    const reward = { id: 'r' + Date.now(), name, category, poin, emoji, stock };
    const rewards = this.db.rewards;
    rewards.push(reward);
    this.db.rewards = rewards;

    this.tutupModal();
    this.renderAdminReward();
    alert('✅ Reward berhasil ditambahkan!');
  },

  editReward(id) {
    const r = this.db.rewards.find(x => x.id === id);
    if (!r) return;

    const content = document.getElementById('modal-content');
    content.innerHTML = `
      <h3>✏️ Edit Reward</h3>
      <div class="form-group">
        <label>Nama Reward</label>
        <input type="text" id="reward-name" value="${r.name}">
      </div>
      <div class="form-group">
        <label>Kategori</label>
        <select id="reward-category">
          <option value="diskon" ${r.category==='diskon'?'selected':''}>Diskon UMKM</option>
          <option value="kebersihan" ${r.category==='kebersihan'?'selected':''}>Kebersihan</option>
          <option value="sertifikat" ${r.category==='sertifikat'?'selected':''}>Sertifikat</option>
          <option value="bisnis" ${r.category==='bisnis'?'selected':''}>Khusus Bisnis</option>
          <option value="emoney" ${r.category==='emoney'?'selected':''}>E-Money</option>
        </select>
      </div>
      <div class="form-group">
        <label>Poin Dibutuhkan</label>
        <input type="number" id="reward-poin" value="${r.poin}" min="1">
      </div>
      <div class="form-group">
        <label>Emoji</label>
        <input type="text" id="reward-emoji" value="${r.emoji}">
      </div>
      <div class="form-group">
        <label>Stok</label>
        <input type="number" id="reward-stock" value="${r.stock}" min="0">
      </div>
      <div class="modal-actions">
        <button class="btn btn-primary" onclick="App.simpanEditReward('${id}')">Simpan</button>
        <button class="btn btn-outline" onclick="App.tutupModal()">Batal</button>
      </div>
    `;
    document.getElementById('modal-overlay').style.display = 'flex';
  },

  simpanEditReward(id) {
    const rewards = this.db.rewards;
    const r = rewards.find(x => x.id === id);
    if (!r) return;

    r.name = document.getElementById('reward-name').value.trim();
    r.category = document.getElementById('reward-category').value;
    r.poin = parseInt(document.getElementById('reward-poin').value);
    r.emoji = document.getElementById('reward-emoji').value.trim() || '🎁';
    r.stock = parseInt(document.getElementById('reward-stock').value) || 0;
    this.db.rewards = rewards;

    this.tutupModal();
    this.renderAdminReward();
    alert('✅ Reward berhasil diperbarui!');
  },

  hapusReward(id) {
    if (!confirm('Hapus reward ini?')) return;
    const rewards = this.db.rewards.filter(r => r.id !== id);
    this.db.rewards = rewards;
    this.renderAdminReward();
  },

  renderAdminUsers() {
    const list = document.getElementById('admin-users-list');
    const users = this.db.users.filter(u => u.type !== 'admin');

    if (users.length === 0) {
      list.innerHTML = '<div class="empty-state">Tidak ada pengguna</div>';
      return;
    }

    const roleLabel = { warga: 'Warga', usaha: 'Pelaku Usaha', petugas: 'Petugas' };

    list.innerHTML = users.map(u => `
      <div class="admin-user-item">
        <div style="font-size:32px">👤</div>
        <div class="admin-user-info">
          <div class="admin-user-name">${u.name}</div>
          <div class="admin-user-meta">${u.phone} • ${roleLabel[u.type] || u.type} • Poin: ${this.hitungTotalPoin(u.id)}</div>
        </div>
        <div class="admin-user-status ${u.active !== false ? 'status-active' : 'status-inactive'}">${u.active !== false ? 'Aktif' : 'Nonaktif'}</div>
        <div class="admin-user-actions">
          <button class="btn btn-sm ${u.active !== false ? 'btn-danger' : 'btn-primary'}" onclick="App.toggleUserStatus('${u.id}')">
            ${u.active !== false ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
        </div>
      </div>
    `).join('');
  },

  toggleUserStatus(id) {
    const users = this.db.users;
    const u = users.find(x => x.id === id);
    if (!u) return;
    u.active = u.active === false ? true : false;
    this.db.users = users;
    this.renderAdminUsers();
  },

  // === MODAL ===
  tutupModal() {
    document.getElementById('modal-overlay').style.display = 'none';
  },

  // === HELPERS ===
  hitungTotalPoin(userId) {
    const user = this.db.users.find(u => u.id === userId);
    const setorans = this.db.setorans.filter(s => s.userId === userId && s.status === 'selesai');
    const poinSetor = setorans.reduce((sum, s) => sum + (s.poin || 0), 0);
    const penukarans = this.db.penukarans.filter(p => p.userId === userId);
    const poinTukar = penukarans.reduce((sum, p) => sum + (p.poin || 0), 0);
    return poinSetor - poinTukar;
  },

  formatNumber(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  },

  formatDate(d) {
    const date = new Date(d);
    const opts = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('id-ID', opts);
  },

  // === PWA INSTALL ===
  deferredPrompt: null,
};

document.addEventListener('DOMContentLoaded', () => App.init());

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  App.deferredPrompt = e;
  setTimeout(() => {
    if (App.currentUser) {
      const installBtn = document.createElement('button');
      installBtn.className = 'btn btn-sm btn-primary';
      installBtn.textContent = '📲 Install Aplikasi';
      installBtn.style.position = 'fixed';
      installBtn.style.bottom = '80px';
      installBtn.style.right = '16px';
      installBtn.style.zIndex = '60';
      installBtn.style.borderRadius = '24px';
      installBtn.style.padding = '10px 20px';
      installBtn.style.boxShadow = '0 4px 16px rgba(46,125,50,0.4)';
      installBtn.onclick = async () => {
        if (App.deferredPrompt) {
          App.deferredPrompt.prompt();
          const result = await App.deferredPrompt.userChoice;
          if (result.outcome === 'accepted') installBtn.remove();
          App.deferredPrompt = null;
        }
      };
      document.getElementById('app').appendChild(installBtn);
    }
  }, 5000);
});
