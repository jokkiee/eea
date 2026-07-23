/* ==========================================================================
   نقابة المهندسين بالبحيرة - Main Script & Interactive Controllers
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCommitteesView();
  initCommitteeDetail();
  initCalculator();
  initHealthcareSearch();
  initCoursesView();
  initBranchesView();
  initNewsView();
});

/* 1. Mobile Navbar Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

/* 2. Committees Grid Renderer (Committees Portal Page & Homepage) */
function initCommitteesView() {
  const container = document.getElementById('committeesGrid');
  if (!container || !SyndicateData.committees) return;

  container.innerHTML = SyndicateData.committees.map(item => `
    <div class="committee-card">
      <div class="committee-header">
        <div class="committee-icon-badge">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <h3 class="committee-title">${item.name}</h3>
        <span class="committee-tag">${item.tagline}</span>
      </div>
      <div class="committee-body">
        <p class="committee-desc">${item.desc}</p>
        <div class="committee-stats">
          <span><i class="fa-solid fa-users"></i> ${item.membersCount} عضواً باللجنة</span>
          <span><i class="fa-solid fa-layer-group"></i> ${item.services.length} خدمات أساسية</span>
        </div>
        <div style="margin-top: 20px;">
          <a href="committee-detail.html?id=${item.id}" class="btn-primary" style="width: 100%; justify-content: center; font-size: 0.9rem;">
            استعراض صفحة اللجنة <i class="fa-solid fa-arrow-left"></i>
          </a>
        </div>
      </div>
    </div>
  `).join('');
}

/* 3. Committee Detail Page Controller */
function initCommitteeDetail() {
  const detailContainer = document.getElementById('committeeDetailContent');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const committeeId = urlParams.get('id') || 'training';
  const committee = SyndicateData.committees.find(c => c.id === committeeId) || SyndicateData.committees[0];

  // Update Page Title
  document.title = `${committee.name} | نقابة المهندسين بالبحيرة`;

  detailContainer.innerHTML = `
    <div class="glass-card" style="background: linear-gradient(135deg, var(--primary-dark), var(--primary-navy)); color: white; padding: 40px; margin-bottom: 40px; border: 1px solid var(--border-gold);">
      <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
        <div style="width: 70px; height: 70px; background: rgba(197, 160, 89, 0.2); border: 2px solid var(--gold-primary); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--gold-primary);">
          <i class="fa-solid ${committee.icon}"></i>
        </div>
        <div>
          <span class="badge-gold">صفحة مسؤولة ومستقلة للجنة</span>
          <h1 style="font-size: 2.2rem; font-weight: 900; margin-top: 6px;">${committee.name}</h1>
          <p style="color: var(--gold-light); font-size: 1.1rem; margin-top: 4px;">${committee.tagline}</p>
        </div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px;">
      <div>
        <div class="service-card" style="margin-bottom: 30px;">
          <h3 style="font-size: 1.4rem; color: var(--primary-navy); margin-bottom: 15px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px; display: inline-block;">
            عن اللجنة والأهداف
          </h3>
          <p style="font-size: 1.05rem; line-height: 1.8; color: var(--text-dark);">${committee.desc}</p>
        </div>

        <div class="service-card">
          <h3 style="font-size: 1.4rem; color: var(--primary-navy); margin-bottom: 20px; border-bottom: 2px solid var(--gold-primary); padding-bottom: 8px; display: inline-block;">
            الخدمات والأنشطة المقدمة من اللجنة
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
            ${committee.services.map(s => `
              <div style="background: var(--bg-body); padding: 16px; border-radius: var(--radius-sm); border-right: 4px solid var(--gold-primary); font-weight: 700;">
                <i class="fa-solid fa-circle-check" style="color: var(--gold-primary); margin-left: 8px;"></i> ${s}
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div>
        <div class="service-card" style="background: var(--primary-dark); color: white; border: 1px solid var(--border-gold);">
          <h4 style="color: var(--gold-primary); font-size: 1.2rem; margin-bottom: 15px;">التواصل المباشر مع اللجنة</h4>
          <p style="font-size: 0.95rem; color: rgba(255,255,255,0.8); margin-bottom: 20px;">يمكنك التواصل مع مقرر وأعضاء اللجنة لتقديم مقترحات أو استفسارات:</p>
          <div style="margin-bottom: 12px;"><i class="fa-solid fa-envelope" style="color: var(--gold-primary); margin-left: 8px;"></i> ${committee.contactEmail}</div>
          <div style="margin-bottom: 20px;"><i class="fa-solid fa-location-dot" style="color: var(--gold-primary); margin-left: 8px;"></i> مقر نقابة المهندسين بدمنهور</div>
          <a href="contact.html" class="btn-primary" style="width: 100%; justify-content: center;">تواصل معنا الآن</a>
        </div>
      </div>
    </div>
  `;
}

/* 4. Interactive Subscription Calculator */
function initCalculator() {
  const gradYearInput = document.getElementById('gradYear');
  const healthCheck = document.getElementById('healthCheck');
  const dependentsInput = document.getElementById('dependentsCount');
  const totalDisplay = document.getElementById('totalFeeDisplay');

  if (!gradYearInput || !totalDisplay) return;

  function calculate() {
    const currentYear = 2026;
    const gradYear = parseInt(gradYearInput.value) || 2020;
    const yearsExperience = Math.max(0, currentYear - gradYear);
    
    let baseFee = 250; // Basic Syndicate Membership
    if (yearsExperience > 15) baseFee = 550;
    else if (yearsExperience > 10) baseFee = 450;
    else if (yearsExperience > 5) baseFee = 350;

    let healthFee = 0;
    if (healthCheck && healthCheck.checked) {
      healthFee = 400; // Member health fee
      const dependents = parseInt(dependentsInput.value) || 0;
      healthFee += dependents * 250; // Dependents
    }

    const total = baseFee + healthFee;
    totalDisplay.innerHTML = `${total} <span>جنيه مصري</span>`;
  }

  gradYearInput.addEventListener('input', calculate);
  if (healthCheck) healthCheck.addEventListener('change', calculate);
  if (dependentsInput) dependentsInput.addEventListener('input', calculate);

  calculate();
}

/* 5. Healthcare Directory Search & Filter */
function initHealthcareSearch() {
  const grid = document.getElementById('healthcareGrid');
  const searchInput = document.getElementById('healthSearchInput');
  const citySelect = document.getElementById('healthCitySelect');

  if (!grid || !SyndicateData.healthcare) return;

  function render(filterText = '', cityFilter = 'all') {
    const filtered = SyndicateData.healthcare.filter(item => {
      const matchesText = item.name.includes(filterText) || item.type.includes(filterText) || item.address.includes(filterText);
      const matchesCity = cityFilter === 'all' || item.city === cityFilter;
      return matchesText && matchesCity;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">عذراً، لم يتم العثور على مراكز طبية تطابق البحث.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(item => `
      <div class="health-card">
        <span class="health-type-badge"><i class="fa-solid ${item.icon}"></i> ${item.type}</span>
        <h4 class="health-name">${item.name}</h4>
        <div class="health-info-row"><i class="fa-solid fa-location-dot"></i> ${item.city} - ${item.address}</div>
        <div class="health-info-row"><i class="fa-solid fa-phone"></i> ${item.phone}</div>
        <div style="margin-top: 15px; padding-top: 12px; border-top: 1px dashed var(--border-light); font-weight: 800; color: var(--success);">
          <i class="fa-solid fa-tags" style="color: var(--gold-primary);"></i> ${item.discount}
        </div>
      </div>
    `).join('');
  }

  if (searchInput) searchInput.addEventListener('input', (e) => render(e.target.value.trim(), citySelect ? citySelect.value : 'all'));
  if (citySelect) citySelect.addEventListener('change', (e) => render(searchInput ? searchInput.value.trim() : '', e.target.value));

  render();
}

/* 6. Courses View Controller */
function initCoursesView() {
  const container = document.getElementById('coursesGrid');
  if (!container || !SyndicateData.courses) return;

  container.innerHTML = SyndicateData.courses.map(course => `
    <div class="service-card">
      <span class="badge-gold" style="margin-bottom: 12px; align-self: flex-start;">${course.category}</span>
      <h3 class="service-title">${course.title}</h3>
      <div style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 15px;">
        <div><i class="fa-solid fa-user-tie" style="color: var(--gold-primary); width: 20px;"></i> المحاضر: ${course.instructor}</div>
        <div><i class="fa-solid fa-clock" style="color: var(--gold-primary); width: 20px;"></i> المدة: ${course.duration}</div>
        <div><i class="fa-solid fa-calendar-day" style="color: var(--gold-primary); width: 20px;"></i> البدء: ${course.startDate}</div>
        <div><i class="fa-solid fa-location-dot" style="color: var(--gold-primary); width: 20px;"></i> المكان: ${course.location}</div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-light);">
        <span style="font-weight: 800; color: var(--primary-navy); font-size: 1.1rem;">${course.price}</span>
        <button class="btn-primary" style="font-size: 0.85rem; padding: 6px 16px;" onclick="alert('تم استلام طلب التسجيل المبدئي في الدورة بنجاح. سيتم التواصل معك قريباً.')">تسجيل بالدورة</button>
      </div>
    </div>
  `).join('');
}

/* 7. Branches View Controller */
function initBranchesView() {
  const container = document.getElementById('branchesGrid');
  if (!container || !SyndicateData.branches) return;

  container.innerHTML = SyndicateData.branches.map(branch => `
    <div class="branch-card">
      <h4 class="branch-city"><i class="fa-solid fa-building-flag"></i> ${branch.name}</h4>
      <div style="font-size: 0.9rem; color: var(--text-muted); margin-top: 10px;">
        <div style="margin-bottom: 6px;"><i class="fa-solid fa-location-dot" style="color: var(--gold-primary); width: 18px;"></i> ${branch.address}</div>
        <div style="margin-bottom: 6px;"><i class="fa-solid fa-phone" style="color: var(--gold-primary); width: 18px;"></i> ${branch.phone}</div>
        <div><i class="fa-solid fa-clock" style="color: var(--gold-primary); width: 18px;"></i> المواعيد: ${branch.hours}</div>
      </div>
    </div>
  `).join('');
}

/* 8. News Grid Renderer */
function initNewsView() {
  const container = document.getElementById('newsGrid');
  if (!container || !SyndicateData.news) return;

  container.innerHTML = SyndicateData.news.map(item => `
    <div class="service-card" style="padding: 0; overflow: hidden;">
      <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover;">
      <div style="padding: 24px;">
        <span style="font-size: 0.8rem; color: var(--gold-primary); font-weight: 700;">${item.category} • ${item.date}</span>
        <h3 style="font-size: 1.15rem; font-weight: 800; margin: 10px 0; color: var(--primary-navy);">${item.title}</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 16px;">${item.summary}</p>
        <a href="#" class="link-btn" onclick="alert('سيتم فتح التفاصيل الكاملة للخبر'); return false;">اقرأ الخبر التفصيلي <i class="fa-solid fa-arrow-left"></i></a>
      </div>
    </div>
  `).join('');
}
