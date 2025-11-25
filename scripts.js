// ====================================================================
// === SỬA DÒNG NÀY: Dán Web App URL MỚI NHẤT SAU KHI DEPLOY Apps Script ===
// ====================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxSp5fsL4ckMLpGBMtN5QaJEfZAqgld71tEVTDzamzKHDYNYAX_0q9OO3ieQUWUsec/exec'; 

/* -------------------- 1. HELPERS & UTILITIES -------------------- */
const $id = (x) => document.getElementById(x);

// Toast Notification (Thông báo nổi)
function toast(message, type = 'success') { 
    const n = document.createElement('div');
    n.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 340px;
        padding: 16px 18px; border-radius: 10px; color: #fff; font-weight: 600;
        box-shadow: 0 12px 28px rgba(0,0,0,.22); animation: slideIn .25s ease;
        background: ${type === 'error'
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : type === 'info' 
            ? 'linear-gradient(135deg, #3182CE, #2B6CB0)'
            : 'linear-gradient(135deg, #48bb78, #38a169)'};
    `;
    n.textContent = message;
    document.body.appendChild(n);
    
    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.innerHTML = `
            @keyframes slideIn { from { transform: translateX(120%); } to { transform: translateX(0); } }
            @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(120%); } }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        n.style.animation = 'slideOut .25s ease';
        setTimeout(() => document.body.removeChild(n), 250);
    }, 3000);
}

function successNoti(msg) { toast(msg, 'success'); }
function errorNoti(msg) { toast(msg, 'error'); }
function infoNoti(msg) { toast(msg, 'info'); }
function showNotification(msg) { successNoti(msg); }


/* -------------------- 2. MODAL LOGIC -------------------- */

// === Modal Tư vấn (Consult Modal) ===
function openConsultModal() {
    const m = $id('consultModal');
    if (!m) return;
    m.classList.remove('hidden');
    m.classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $id('fullName')?.focus(), 50);
}
function closeConsultModal() {
    const m = $id('consultModal');
    if (!m) return;
    m.classList.add('hidden');
    m.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// === Modal Cho thuê (Rental Modal) ===
function openRentalModal() {
    const m = $id('rentalModal');
    if (!m) return;
    m.classList.remove('hidden');
    m.classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $id('rentalFullName')?.focus(), 50); 
}
function closeRentalModal() {
    const m = $id('rentalModal');
    if (!m) return;
    m.classList.add('hidden');
    m.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// === IMAGE MODAL LOGIC (Phóng to ảnh - ĐÃ CẢI THIỆN UI/UX) ===
function openImageModal(imageUrl) {
    const m = $id('image-modal');
    const img = $id('modal-image');
    if (!m || !img || !imageUrl) return;

    img.src = imageUrl;
    m.classList.remove('hidden');
    m.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Kích hoạt hiệu ứng phóng to (scale(1) và opacity: 1)
    setTimeout(() => {
        img.style.transform = 'scale(1)';
        img.style.opacity = '1';
    }, 50);
}

function closeImageModal() {
    const m = $id('image-modal');
    const img = $id('modal-image');
    if (!m || !img) return;

    // Kích hoạt hiệu ứng thu nhỏ (scale(0.85) và opacity: 0)
    img.style.transform = 'scale(0.85)';
    img.style.opacity = '0';

    // Thời gian chờ khớp với CSS transition (khoảng 350ms)
    setTimeout(() => {
        m.classList.add('hidden');
        m.classList.remove('flex');
        document.body.style.overflow = 'auto';
        img.src = ''; // Xóa nguồn ảnh
    }, 350); 
}
// ===========================================

/* -------------------- 3. INITIALIZATION & EVENTS -------------------- */
document.addEventListener('DOMContentLoaded', () => {
    
    // Modal overlay click 
    const consult = $id('consultModal');
    if (consult) consult.addEventListener('click', (e) => { if (e.target === consult) closeConsultModal(); });
    
    const rentalModal = $id('rentalModal');
    if (rentalModal) rentalModal.addEventListener('click', (e) => { 
        if (e.target.closest('.absolute.inset-0') || e.target === rentalModal) closeRentalModal();
    });

    const imageModal = $id('image-modal');
    if (imageModal) imageModal.addEventListener('click', (e) => { 
        // Đóng khi click vào backdrop hoặc ảnh
        if (e.target === imageModal || e.target.id === 'modal-image') closeImageModal(); 
    });

    // ESC key closes modal 
    window.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') { 
            closeConsultModal(); 
            closeRentalModal(); 
            closeImageModal(); 
        } 
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const targetId = a.getAttribute('href');
            if(targetId === '#') return;
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Service card buttons
    document.querySelectorAll('.service-card button').forEach((btn) => {
        if (!btn.getAttribute('onclick')) {
            btn.addEventListener('click', (e) => { e.stopPropagation(); openConsultModal(); });
        }
    });

    /* -------------------- FORM TƯ VẤN -------------------- */
    const form = $id('consultForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu
            const fullName       = $id('fullName')?.value.trim() ?? '';
            const phone          = $id('phone')?.value.trim() ?? '';
            const address        = $id('address')?.value.trim() ?? '';
            const email          = $id('email')?.value.trim() ?? '';
            const serviceContent = $id('serviceContent')?.value.trim() ?? ''; 

            let valid = true;
            
            // Validation
            setErr('errName',    !(valid = nameOk(fullName)   && valid));
            setErr('errPhone',   !(valid = phoneOk(phone)     && valid));
            setErr('errEmail',   !(valid = emailOk(email)     && valid));

            if (serviceContent === '' || serviceContent === '[KHÔNG CHỌN DỊCH VỤ]') {
                if (valid) errorNoti('Vui lòng chọn Dịch vụ Robot.'); 
                valid = false;
            }

            if (!valid) return;

            const btn = $id('submitBtn');
            const prev = btn ? btn.textContent : '';
            if (btn) { btn.textContent = 'Đang gửi...'; btn.disabled = true; }

            try {
                const fd = new FormData();
                fd.append('type', 'Consultation'); 
                fd.append('name', fullName);
                fd.append('phone', phone);
                fd.append('address', address);
                fd.append('email', email);
                fd.append('service_robot', serviceContent); 

                const response = await fetch(SCRIPT_URL, { method: 'POST', body: fd });
                
                let data = { ok: false, message: 'Lỗi phản hồi không xác định.' };
                
                try {
                    data = await response.json(); 
                } catch (jsonError) {
                    console.error('Lỗi JSON Parse:', jsonError);
                    errorNoti('⚠️ Đã gửi dữ liệu nhưng server phản hồi không đúng định dạng.');
                    form.reset(); 
                    closeConsultModal(); 
                    return;
                }

                if (data.ok) {
                    successNoti('📩 Đã nhận được thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất!');
                    form.reset();
                    closeConsultModal();
                } else {
                    errorNoti('❌ Lỗi server: ' + data.message); 
                }
                
            } catch (err) {
                console.error(err);
                errorNoti('Lỗi kết nối mạng. Vui lòng thử lại.');
            } finally {
                if (btn) { btn.textContent = prev; btn.disabled = false; }
            }
        });
    }

    /* -------------------- FORM CHO THUÊ --------------------------- */
    const rentalForm = $id('rentalForm');
    if (rentalForm) {
        rentalForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = $id('rentalFullName')?.value.trim() ?? '';
            const phone    = $id('rentalPhone')?.value.trim() ?? '';
            const email    = $id('rentalEmail')?.value.trim() ?? '';
            const eventDetails = $id('eventDetails')?.value.trim() ?? '';

            let valid = true;
            setErr('rentalErrName',   !(valid = nameOk(fullName)   && valid));
            setErr('rentalErrPhone',  !(valid = phoneOk(phone)     && valid));
            if (!valid) return;

            const btn = $id('rentalSubmitBtn');
            const prev = btn ? btn.textContent : '';
            if (btn) { btn.textContent = 'Đang gửi...'; btn.disabled = true; }

            try {
                const fd = new FormData();
                fd.append('type', 'Robot Rental'); 
                fd.append('name', fullName);
                fd.append('phone', phone);
                fd.append('email', email);
                fd.append('details', eventDetails);

                const response = await fetch(SCRIPT_URL, { method: 'POST', body: fd });
                
                let data = { ok: false, message: 'Lỗi không xác định.' };
                try { 
                    data = await response.json(); 
                } catch (e) {
                    console.error('Lỗi JSON Parse cho Rental Form:', e);
                    errorNoti('⚠️ Đã gửi dữ liệu nhưng server phản hồi không đúng định dạng.');
                    rentalForm.reset();
                    closeRentalModal();
                    return;
                }

                if (data.ok) {
                    successNoti('📩 Đã nhận được thông tin, chúng tôi sẽ liên hệ với bạn sớm nhất!');
                    rentalForm.reset();
                    closeRentalModal();
                } else {
                    errorNoti(`❌ Lỗi server: ${data.message || 'Lỗi không xác định.'}`);
                }
                
            } catch (err) {
                console.error(err);
                errorNoti('Lỗi kết nối. Vui lòng thử lại.');
            } finally {
                if (btn) { btn.textContent = prev; btn.disabled = false; }
            }
        });
    }

    // Init
    displayContracts(currentPage);
    displayPagination();
    initSocialRail();
});

/* -------------------- 4. VALIDATE & CÁC HÀM LINH TINH -------------------- */
const nameOk  = (v) => v && v.trim().length >= 2;
const emailOk = (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
const phoneOk = (v) => {
    if (!v) return false;
    const digits = (v + '').replace(/\D/g, '');
    return /^(\+?84|84|0)\d{8,10}$/.test(v) || digits.length >= 8;
};
const setErr = (id, show) => { const el = $id(id); if (el) el.classList.toggle('hidden', !show) };

// Các hàm linh tinh
function showSolution(solutionId) {
    let message = '';
    if (solutionId === 'stem-ai-edu') {
        message = '🎓 Chương trình Giáo dục STEM/AI: Đã sẵn sàng tư vấn!';
    } else if (solutionId === 'cruzr-robot') {
        message = '🤖 Robot Lễ tân CRUZR: Liên hệ để trải nghiệm demo!';
    } else if (solutionId === 'custom-ai') {
        message = '🧠 Giải pháp AI Tùy chỉnh: Đội ngũ chuyên gia sẽ liên hệ bạn.';
    } else {
        message = 'Bạn đã chọn một giải pháp. Chúng tôi sẽ tư vấn chi tiết!';
    }
    successNoti(message); 
    openConsultModal();
}

/* -------------------- 5. HỢP ĐỒNG (CẬP NHẬT UI/UX) -------------------- */
const contracts = [
    {
        id: 1,
        title: "Lễ ký kết MOU 'Đào tạo gắn kết với doanh nghiệp'",
        description: "lễ phát động cuộc thi xây dựng thương hiệu cá nhân YOUBRANDING 2025.",
        date: "2025-11-22",
        status: "Đang thực hiện",
        value: "Liên hệ",
        // Sửa URL mẫu để đảm bảo hiển thị
        image: "https://lh3.googleusercontent.com/d/1mFXya3v0dB8PrzCPSSIuBB0rcHHj78Mh", 
        content: ``
    },
    // Thêm các hợp đồng khác tại đây...
];

let currentPage = 1;
const contractsPerPage = 6;

function displayContracts(page) {
    const startIndex = (page - 1) * contractsPerPage;
    const endIndex = startIndex + contractsPerPage;
    const contractsToShow = contracts.slice(startIndex, endIndex);

    const grid = $id('contracts-grid');
    if (!grid) return;
    grid.innerHTML = '';

    contractsToShow.forEach(contract => {
        const hasImage = !!contract.image; 
        const statusClass = contract.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                             contract.status === 'Đang thực hiện' ? 'bg-blue-100 text-blue-800' :
                             'bg-yellow-100 text-yellow-800';
        
        // CẬP NHẬT: Dùng tên nút "Xem Ảnh"
        const buttonText = hasImage ? 'Xem Ảnh' : '🔒 Chưa có Ảnh'; 
        const buttonClass = hasImage ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400 cursor-not-allowed';
        // Hành động là mở Image Modal
        const buttonAction = hasImage ? `openImageModal('${contract.image}')` : `errorNoti('Hợp đồng này chưa có hình ảnh minh họa.')`;

        const el = document.createElement('div');
        // Thêm UI/UX: shadow-2xl, hover:shadow-2xl, hover:-translate-y-1, group
        el.className = 'contract-card bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group'; 
        
        el.innerHTML = `
            <div class="relative h-48 overflow-hidden">
                <img src="${contract.image}" alt="${contract.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute top-4 right-4">
                    <span class="px-3 py-1 text-xs font-semibold rounded-full ${statusClass}">${contract.status}</span>
                </div>
            </div>
            
            <div class="p-6">
                <div class="flex justify-between items-start mb-3">
                    <span class="text-sm text-gray-500">${contract.date}</span>
                    <span class="text-lg font-bold text-secondary">${contract.value}</span>
                </div>
                
                <h3 class="text-xl font-bold text-primary mb-2 line-clamp-2">${contract.title}</h3>
                <p class="text-gray-600 mb-6 line-clamp-3">${contract.description}</p>
                
                <div class="flex">
                    <button onclick="${buttonAction}"
                            class="${buttonClass} text-white px-6 py-3 rounded-lg transition-colors text-base font-medium interactive-button w-full">
                        ${buttonText}
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(el);
    });
}

function viewContractDetails(id) {
    const c = contracts.find(x => x.id === id);
    if(c && c.image) {
        openImageModal(c.image);
    } else {
        infoNoti('Hợp đồng này chưa có hình ảnh chi tiết.'); 
    }
}

function displayPagination() {
    const totalPages = Math.ceil(contracts.length / contractsPerPage);
    const pagination = $id('pagination');
    if (!pagination) return;
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;

    // Đảm bảo phân trang có class CSS để hiển thị đẹp
    pagination.className = 'pagination flex justify-center mt-12 space-x-2';

    for (let i = 1; i <= totalPages; i++) {
        const b = document.createElement('button');
        // Thêm class hover
        b.className = `w-10 h-10 rounded-lg font-bold transition-all ${i === currentPage ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'}`;
        b.textContent = i;
        b.onclick = () => { currentPage = i; displayContracts(currentPage); displayPagination(); };
        pagination.appendChild(b);
    }
}

/* -------------------- 6. SOCIAL RAIL -------------------- */
function initSocialRail() {
    const rail = document.getElementById('socialRail');
    if (!rail) return;

    // Logic khởi tạo social rail
    const items = rail.querySelectorAll('.rail-item');
    const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if(e.isIntersecting){
                items.forEach((it, idx) => {
                    setTimeout(() => it.style.opacity = '1', idx * 100);
                });
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    io.observe(rail);

    // Hiệu ứng di chuột cho nút
    rail.querySelectorAll('.rail-btn').forEach(btn=>{
        btn.addEventListener('mousemove', (e)=>{
            const r = btn.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 2 - 1;
            const y = ((e.clientY - r.top) / r.height) * 2 - 1;
            btn.style.transform = `scale(1.1) translate(${x*2}px, ${y*2}px)`;
            btn.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.3)';
        });
        btn.addEventListener('mouseleave', ()=>{
            btn.style.transform = '';
            btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    });
}