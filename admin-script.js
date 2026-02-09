// Admin Dashboard JavaScript

// Sample Data
const ordersData = [
    {
        id: '001',
        customer: 'أحمد محمد',
        phone: '01012345678',
        email: 'ahmed@example.com',
        service: 'دهانات',
        date: '2026-02-06',
        status: 'new',
        details: 'طلب دهان شقة كاملة 3 غرف وصالة، الدور الخامس',
        timeline: [
            { date: '2026-02-06 10:30', status: 'تم استلام الطلب', completed: true },
        ]
    },
    {
        id: '002',
        customer: 'سارة علي',
        phone: '01123456789',
        email: 'sara@example.com',
        service: 'ديكورات',
        date: '2026-02-05',
        status: 'processing',
        details: 'تصميم داخلي لفيلا سكنية، مطلوب عرض 3D',
        timeline: [
            { date: '2026-02-05 14:20', status: 'تم استلام الطلب', completed: true },
            { date: '2026-02-06 09:00', status: 'جاري معاينة الموقع', completed: true },
        ]
    },
    {
        id: '003',
        customer: 'محمد حسن',
        phone: '01234567890',
        email: 'mohamed@example.com',
        service: 'تشطيبات',
        date: '2026-02-04',
        status: 'completed',
        details: 'تشطيب كامل لمحل تجاري 50 متر',
        timeline: [
            { date: '2026-02-04 11:00', status: 'تم استلام الطلب', completed: true },
            { date: '2026-02-05 10:00', status: 'بدء العمل', completed: true },
            { date: '2026-02-06 16:00', status: 'تم الانتهاء', completed: true },
        ]
    },
    {
        id: '004',
        customer: 'فاطمة أحمد',
        phone: '01556789123',
        email: 'fatma@example.com',
        service: 'أحجار',
        date: '2026-02-03',
        status: 'cancelled',
        details: 'تركيب رخام للمطبخ والحمامات',
        timeline: [
            { date: '2026-02-03 09:30', status: 'تم استلام الطلب', completed: true },
            { date: '2026-02-04 12:00', status: 'تم الإلغاء من العميل', completed: true },
        ]
    },
    {
        id: '005',
        customer: 'خالد محمود',
        phone: '01098765432',
        email: 'khaled@example.com',
        service: 'بوابات',
        date: '2026-02-02',
        status: 'processing',
        details: 'تصنيع بوابة حديد للفيلا مع تركيبات الأمن',
        timeline: [
            { date: '2026-02-02 13:45', status: 'تم استلام الطلب', completed: true },
            { date: '2026-02-03 11:00', status: 'جاري التصنيع', completed: true },
        ]
    },
    {
        id: '006',
        customer: 'نورا سامي',
        phone: '01122334455',
        email: 'nora@example.com',
        service: 'أثاث',
        date: '2026-02-01',
        status: 'new',
        details: 'تفصيل غرفة نوم كاملة مع دواليب مدمجة',
        timeline: [
            { date: '2026-02-01 16:20', status: 'تم استلام الطلب', completed: true },
        ]
    }
];

const customersData = [
    { id: 1, name: 'أحمد محمد', phone: '01012345678', email: 'ahmed@example.com', orders: 3, lastOrder: '2026-02-06' },
    { id: 2, name: 'سارة علي', phone: '01123456789', email: 'sara@example.com', orders: 2, lastOrder: '2026-02-05' },
    { id: 3, name: 'محمد حسن', phone: '01234567890', email: 'mohamed@example.com', orders: 5, lastOrder: '2026-02-04' },
    { id: 4, name: 'فاطمة أحمد', phone: '01556789123', email: 'fatma@example.com', orders: 1, lastOrder: '2026-02-03' },
    { id: 5, name: 'خالد محمود', phone: '01098765432', email: 'khaled@example.com', orders: 2, lastOrder: '2026-02-02' },
];

// State Management
let currentPage = 1;
const itemsPerPage = 5;
let filteredOrders = [...ordersData];

// DOM Elements
const sidebar = document.querySelector('.sidebar');
const toggleSidebar = document.getElementById('toggleSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const navLinks = document.querySelectorAll('.sidebar-nav a');
const contentSections = document.querySelectorAll('.content-section');

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initSidebar();
    initNavigation();
    initCharts();
    renderOrders();
    renderRecentOrders();
    renderCustomers();
    renderServices();
    updateStats();
});

// Authentication Check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn && !window.location.href.includes('admin-login.html')) {
        window.location.href = 'admin-login.html';
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    window.location.href = 'admin-login.html';
}

// Sidebar Toggle
function initSidebar() {
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
}

// Navigation
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');

            // Update active states
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            link.parentElement.classList.add('active');

            // Show target section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
}

// Update Statistics
function updateStats() {
    const totalOrders = ordersData.length;
    const pendingOrders = ordersData.filter(o => o.status === 'new' || o.status === 'processing').length;
    const completedOrders = ordersData.filter(o => o.status === 'completed').length;
    const totalCustomers = customersData.length;

    animateValue('totalOrders', 0, totalOrders, 1000);
    animateValue('pendingOrders', 0, pendingOrders, 1000);
    animateValue('completedOrders', 0, completedOrders, 1000);
    animateValue('totalCustomers', 0, totalCustomers, 1000);
}

// Animate Number Counter
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;

    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Render Orders Table
function renderOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageOrders = filteredOrders.slice(start, end);

    tbody.innerHTML = pageOrders.map(order => `
        <tr>
            <td><input type="checkbox" class="order-checkbox" data-id="${order.id}"></td>
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.phone}</td>
            <td>${order.service}</td>
            <td>${formatDate(order.date)}</td>
            <td><span class="status-badge ${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewOrder('${order.id}')" title="عرض">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editOrder('${order.id}')" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteOrder('${order.id}')" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    updatePagination();
}

// Render Recent Orders (Dashboard)
function renderRecentOrders() {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;

    const recentOrders = ordersData.slice(0, 5);

    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.service}</td>
            <td>${formatDate(order.date)}</td>
            <td><span class="status-badge ${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="action-btn view" onclick="viewOrder('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Render Customers
function renderCustomers() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;

    tbody.innerHTML = customersData.map((customer, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.email}</td>
            <td>${customer.orders}</td>
            <td>${formatDate(customer.lastOrder)}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" title="عرض">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Render Services
function renderServices() {
    const container = document.getElementById('servicesList');
    if (!container) return;

    const services = [
        { name: 'الدهانات', icon: 'fa-paint-roller', color: '#3b82f6', orders: 45, revenue: '125,000' },
        { name: 'الأحجار', icon: 'fa-gem', color: '#06b6d4', orders: 28, revenue: '89,000' },
        { name: 'التشطيبات', icon: 'fa-tools', color: '#f59e0b', orders: 52, revenue: '210,000' },
        { name: 'الديكورات', icon: 'fa-couch', color: '#8b5cf6', orders: 35, revenue: '156,000' },
        { name: 'البوابات', icon: 'fa-dungeon', color: '#ef4444', orders: 22, revenue: '78,000' },
        { name: 'الأثاث', icon: 'fa-chair', color: '#10b981', orders: 38, revenue: '134,000' },
    ];

    container.innerHTML = services.map(service => `
        <div class="service-card">
            <h3>
                <div class="icon" style="background: ${service.color}20; color: ${service.color}">
                    <i class="fas ${service.icon}"></i>
                </div>
                ${service.name}
            </h3>
            <div class="service-stats">
                <div class="service-stat">
                    <h4>${service.orders}</h4>
                    <p>طلب</p>
                </div>
                <div class="service-stat">
                    <h4>${service.revenue} ج.م</h4>
                    <p>إيرادات</p>
                </div>
            </div>
        </div>
    `).join('');
}

// View Order Modal
function viewOrder(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('modalOrderId').textContent = '#' + order.id;
    document.getElementById('modalCustomerName').textContent = order.customer;
    document.getElementById('modalPhone').textContent = order.phone;
    document.getElementById('modalEmail').textContent = order.email;
    document.getElementById('modalService').textContent = order.service;
    document.getElementById('modalDetails').textContent = order.details;
    document.getElementById('modalDate').textContent = formatDate(order.date);
    document.getElementById('modalStatus').value = order.status;

    // Render timeline
    const timelineContainer = document.getElementById('orderTimeline');
    timelineContainer.innerHTML = order.timeline.map(item => `
        <div class="timeline-item ${item.completed ? 'completed' : ''}">
            <div class="timeline-content">
                <p>${item.status}</p>
                <span class="timeline-date">${item.date}</span>
            </div>
        </div>
    `).join('');

    document.getElementById('orderModal').classList.add('active');
}

// Close Modal
function closeModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// Save Order Changes
function saveOrderChanges() {
    const orderId = document.getElementById('modalOrderId').textContent.replace('#', '');
    const newStatus = document.getElementById('modalStatus').value;
    const notes = document.getElementById('orderNotes').value;

    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        if (notes) {
            order.timeline.push({
                date: new Date().toLocaleString('ar-EG'),
                status: 'ملاحظة: ' + notes,
                completed: true
            });
        }

        // Add status change to timeline
        if (newStatus !== order.status) {
            order.timeline.push({
                date: new Date().toLocaleString('ar-EG'),
                status: 'تم تغيير الحالة إلى: ' + getStatusText(newStatus),
                completed: true
            });
        }

        renderOrders();
        renderRecentOrders();
        updateStats();
        closeModal();

        // Show success message
        alert('تم حفظ التغييرات بنجاح!');
    }
}

// Edit Order
function editOrder(orderId) {
    viewOrder(orderId);
}

// Delete Order
function deleteOrder(orderId) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        const index = ordersData.findIndex(o => o.id === orderId);
        if (index > -1) {
            ordersData.splice(index, 1);
            filteredOrders = [...ordersData];
            renderOrders();
            updateStats();
        }
    }
}

// Filter Functions
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const serviceFilter = document.getElementById('serviceFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;

    filteredOrders = ordersData.filter(order => {
        let match = true;

        if (statusFilter !== 'all') {
            match = match && order.status === statusFilter;
        }

        if (serviceFilter !== 'all') {
            const serviceMap = {
                'painting': 'دهانات',
                'stones': 'أحجار',
                'finishing': 'تشطيبات',
                'decor': 'ديكورات',
                'gates': 'بوابات',
                'furniture': 'أثاث'
            };
            match = match && order.service === serviceMap[serviceFilter];
        }

        if (dateFrom) {
            match = match && new Date(order.date) >= new Date(dateFrom);
        }

        if (dateTo) {
            match = match && new Date(order.date) <= new Date(dateTo);
        }

        return match;
    });

    currentPage = 1;
    renderOrders();
}

// Pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages || 1;
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderOrders();
    }
}

// Export Orders
function exportOrders() {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "رقم الطلب,العميل,الهاتف,الخدمة,التاريخ,الحالة\n"
        + filteredOrders.map(o => `${o.id},${o.customer},${o.phone},${o.service},${o.date},${getStatusText(o.status)}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Print Order
function printOrder() {
    window.print();
}

// Helper Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

function getStatusText(status) {
    const statusMap = {
        'new': 'جديد',
        'processing': 'قيد المعالجة',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
}

// Initialize Charts
function initCharts() {
    // Orders Chart
    const ordersCtx = document.getElementById('ordersChart');
    if (ordersCtx) {
        new Chart(ordersCtx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'الطلبات',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#94a3b8'
                        }
                    }
                }
            }
        });
    }

    // Services Chart
    const servicesCtx = document.getElementById('servicesChart');
    if (servicesCtx) {
        new Chart(servicesCtx, {
            type: 'doughnut',
            data: {
                labels: ['دهانات', 'ديكورات', 'تشطيبات', 'أخرى'],
                datasets: [{
                    data: [30, 25, 35, 10],
                    backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#94a3b8',
                            padding: 15,
                            font: {
                                family: 'Cairo'
                            }
                        }
                    }
                }
            }
        });
    }
}

// Select All Checkbox
document.getElementById('selectAll')?.addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.order-checkbox');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

// Close modal on outside click
document.getElementById('orderModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Global Search
document.getElementById('globalSear