/* ================================================================
   ART FIVE EDUCATION - scripts.js (BẢN HOÀN CHỈNH CUỐI CÙNG)
   ✓ Click "Xem chương trình" → cuộn tới #core-values (có highlight)
   ✓ Chỉ giữ noti robot + noti form
   ✓ Không thêm bất kỳ hiệu ứng hay noti thừa nào
   ================================================================ */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxSp5fsL4ckMLpGBMtN5QaJEfZAqgld71tEVTDzamzKHDYNYAX_0q9OO3ieQUWUsec/exec';
const $ = id => document.getElementById(id);

// ===================== TOAST (chỉ dùng cho robot + form) =====================
const toast = (msg, type = 'success') => {
    const div = document.createElement('div');
    div.textContent = msg;
    div.style.cssText = `
        position:fixed;top:20px;right:20px;z-index:9999;padding:16px 28px;
        border-radius:12px;color:#fff;font-weight:600;max-width:380px;
        background:${type==='error'?'#ef4444':type==='robot'?'#8b5cf6':'#10b981'};
        box-shadow:0 12px 30px rgba(0,0,0,0.25);animation:slideIn 0.4s ease;
        transform:translateX(120%);opacity:0;
    `;
    document.body.appendChild(div);
    requestAnimationFrame(() => {
        div.style.transform = 'translateX(0)';
        div.style.opacity = '1';
    });
    setTimeout(() => {
        div.style.transform = 'translateX(120%)';
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 400);
    }, 3500);
};
document.head.insertAdjacentHTML('beforeend', `<style>
    @keyframes slideIn { from {transform:translateX(120%);opacity:0} to {transform:none;opacity:1} }
</style>`);

const successNoti = msg => toast(msg, 'success');
const errorNoti   = msg => toast(msg, 'error');
function robotGreeting() {
    toast('Xin chào! Tôi là Cruzr – Robot lễ tân thông minh', 'robot');
}

// ===================== MODAL =====================
const toggleModal = (id, show) => {
    const m = $(id);
    if (!m) return;
    m.classList.toggle('hidden', !show);
    m.classList.toggle('flex', show);
    document.body.style.overflow = show ? 'hidden' : '';
};

function openConsultModal()  { toggleModal('consultModal', true);  setTimeout(() => $('fullName')?.focus(), 100); }
function closeConsultModal() { toggleModal('consultModal', false); }
function openRentalModal()   { toggleModal('rentalModal', true); }
function closeRentalModal()  { toggleModal('rentalModal', false); }

function openImageModal(url) {
    if (!url) return;
    const m = $('image-modal'), img = $('modal-image');
    if (!m || !img) return;
    img.src = url;
    toggleModal('image-modal', true);
    setTimeout(() => img.style = 'opacity:1;transform:scale(1)', 50);
}
function closeImageModal() {
    const img = $('modal-image');
    if (!img) return;
    img.style = 'opacity:0;transform:scale(0.9)';
    setTimeout(() => {
        toggleModal('image-modal', false);
        img.src = '';
    }, 300);
}

// ===================== CÁC HÀM =====================
function exploreAI()      { document.querySelector('#services')?.scrollIntoView({behavior:'smooth'}); }

// ĐÃ CẬP NHẬT THEO YÊU CẦU: Xem chương trình → cuộn tới Giá trị cốt lõi
function viewProgram() {
    const target = document.querySelector('#core-values');
    if (target) {
        target.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        // Highlight nhẹ khi tới nơi (rất sang trọng)
        target.style.transition = 'background 1.5s ease';
        target.style.background = 'linear-gradient(90deg, rgba(99,102,241,0.08), transparent 80%)';
        setTimeout(() => target.style.background = '', 2200);
    }
}

function scrollToNext()   { document.querySelector('#about')?.scrollIntoView({behavior:'smooth'}); }
function exploreService() { openConsultModal(); }

// ===================== FORM TƯ VẤN =====================
$('consultForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    
    const name = $('fullName').value.trim();
    const phone = $('phone').value.trim();
    const address = $('address').value.trim();
    const email = $('email').value.trim();
    const service = $('serviceContent').value;

    ['errName','errPhone','errEmail'].forEach(id => $(id)?.classList.add('hidden'));

    let valid = true;
    if (name.length < 2) { $('errName')?.classList.remove('hidden'); valid = false; }
    if (!/^0\d{8,10}$/.test(phone.replace(/\D/g,''))) { $('errPhone')?.classList.remove('hidden'); valid = false; }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('errEmail')?.classList.remove('hidden'); valid = false; }
    if (!service || service.includes('KHÔNG CHỌN')) { errorNoti('Vui lòng chọn dịch vụ'); return; }
    if (!valid) return;

    const btn = $('submitBtn');
    const old = btn.textContent;
    btn.disabled = true; btn.textContent = 'Đang gửi...';

    try {
        const fd = new FormData();
        fd.append('type', 'Consultation');
        fd.append('name', name);
        fd.append('phone', phone);
        fd.append('address', address || 'Không có');
        fd.append('email', email || 'Không có');
        fd.append('service_robot', service);

        const res = await fetch(SCRIPT_URL, {method:'POST', body:fd});
        const data = await res.json().catch(() => ({ok:false}));

        if (data.ok) {
            successNoti('Đã gửi thành công! Chúng tôi sẽ liên hệ sớm nhất');
            e.target.reset();
            closeConsultModal();
        } else {
            errorNoti(data.message || 'Có lỗi xảy ra');
        }
    } catch (err) {
        errorNoti('Lỗi kết nối mạng');
    } finally {
        btn.disabled = false;
        btn.textContent = old;
    }
});

// ===================== HỢP ĐỒNG =====================
const contracts = [
    { id:1, title:"Lễ ký kết MOU 'Đào tạo gắn kết với doanh nghiệp'", description:"Lễ phát động cuộc thi xây dựng thương hiệu cá nhân YOUBRANDING 2025.", date:"2025-11-22", status:"Đang thực hiện", value:"Liên hệ", image:"https://lh3.googleusercontent.com/d/1mFXya3v0dB8PrzCPSSIuBB0rcHHj78Mh=w1000" },
];

let currentPage = 1;
const perPage = 6;

function displayContracts(page = 1) {
    currentPage = page;
    const grid = $('contracts-grid');
    if (!grid) return;
    const start = (page-1)*perPage;
    const items = contracts.slice(start, start+perPage);

    grid.innerHTML = items.map(c => `
        <div class="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
            <div class="relative h-48 overflow-hidden">
                <img src="${c.image || 'https://via.placeholder.com/600x300?text=No+Image'}" 
                     alt="${c.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                <span class="absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                    ${c.status}
                </span>
            </div>
            <div class="p-6">
                <div class="flex justify-between text-sm mb-3">
                    <span class="text-gray-500">${c.date}</span>
                    <span class="font-bold text-secondary">${c.value}</span>
                </div>
                <h3 class="text-xl font-bold text-primary mb-2 line-clamp-2">${c.title}</h3>
                <p class="text-gray-600 mb-6 line-clamp-3">${c.description}</p>
                <button onclick="openImageModal('${c.image || ''}')" 
                        class="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition">
                    Xem Ảnh
                </button>
            </div>
        </div>
    `).join('');
}

function displayPagination() {
    const total = Math.ceil(contracts.length / perPage);
    const pag = $('pagination');
    if (!pag || total <= 1) return;
    pag.innerHTML = Array.from({length:total},(_,i)=>i+1).map(p => `
        <button onclick="displayContracts(${p})" 
                class="w-10 h-10 rounded-lg font-bold ${p===currentPage?'bg-primary text-white':'bg-white border hover:bg-gray-100'}">
            ${p}
        </button>
    `).join('');
}

// ===================== KHỞI TẠO =====================
document.addEventListener('DOMContentLoaded', () => {
    // Đóng modal khi click ngoài hoặc ESC
    ['consultModal','rentalModal','image-modal'].forEach(id => {
        $(id)?.addEventListener('click', e => {
            if (e.target === e.currentTarget || e.target.id === 'modal-image') {
                closeConsultModal(); closeRentalModal(); closeImageModal();
            }
        });
    });
    window.addEventListener('keydown', e => e.key === 'Escape' && (closeConsultModal(), closeRentalModal(), closeImageModal()));

    // Smooth scroll cho menu
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            if (a.getAttribute('href') === '#') return;
            e.preventDefault();
            document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
        });
    });

    // Nút dịch vụ → mở form tư vấn
    document.querySelectorAll('.service-card button').forEach(btn => {
        if (!btn.onclick) btn.onclick = () => openConsultModal();
    });

    // Noti khi bấm robot
    document.querySelectorAll('[onclick*="interactWithRobot"], [onclick*="robotGreeting"]').forEach(el => {
        el.onclick = robotGreeting;
    });

    // Khởi động hợp đồng
    displayContracts();
    displayPagination();
});