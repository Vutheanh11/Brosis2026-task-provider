import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell, CalendarDays, Check, CheckCircle2, ChevronDown, Circle,
  Clock3, Eye, EyeOff, LayoutDashboard, ListTodo, LogOut, Menu,
  MoreHorizontal, Plus, Search, ShieldCheck, Sparkles, Trash2,
  UserRound, Users, X
} from 'lucide-react';
import './styles.css';
import { api, getToken } from './api';

const PEOPLE = [
  { id: 'u1', name: 'Minh Anh', email: 'minhanh@taskflow.vn', role: 'Designer', initials: 'MA', color: '#ffc66d' },
  { id: 'u2', name: 'Hoàng Nam', email: 'hoangnam@taskflow.vn', role: 'Developer', initials: 'HN', color: '#73a4ff' },
  { id: 'u3', name: 'Ngọc Linh', email: 'ngoclinh@taskflow.vn', role: 'Marketing', initials: 'NL', color: '#ef92ac' },
  { id: 'u4', name: 'Tuấn Kiệt', email: 'tuankiet@taskflow.vn', role: 'Developer', initials: 'TK', color: '#79cfad' },
  { id: 'u5', name: 'Thu Hà', email: 'thuha@taskflow.vn', role: 'Content', initials: 'TH', color: '#a58be8' }
];

const SEED_TASKS = [
  { id: 1, title: 'Thiết kế landing page mới', description: 'Hoàn thiện giao diện landing page cho chiến dịch tháng 7.', assignee: 'u1', priority: 'Cao', status: 'Đang làm', due: '2026-07-08', tag: 'Design' },
  { id: 2, title: 'Tích hợp API thanh toán', description: 'Kết nối cổng thanh toán và kiểm thử môi trường sandbox.', assignee: 'u2', priority: 'Cao', status: 'Cần làm', due: '2026-07-10', tag: 'Development' },
  { id: 3, title: 'Lên kế hoạch nội dung Q3', description: 'Xây dựng lịch nội dung cho các kênh truyền thông.', assignee: 'u3', priority: 'Trung bình', status: 'Đang làm', due: '2026-07-12', tag: 'Marketing' },
  { id: 4, title: 'Tối ưu tốc độ website', description: 'Kiểm tra Core Web Vitals và tối ưu tài nguyên.', assignee: 'u4', priority: 'Trung bình', status: 'Hoàn thành', due: '2026-07-03', tag: 'Development' },
  { id: 5, title: 'Viết bài giới thiệu sản phẩm', description: 'Bài giới thiệu tính năng quản lý công việc nhóm.', assignee: 'u5', priority: 'Thấp', status: 'Cần làm', due: '2026-07-15', tag: 'Content' },
  { id: 6, title: 'Cập nhật design system', description: 'Bổ sung component và quy chuẩn màu sắc mới.', assignee: 'u1', priority: 'Thấp', status: 'Hoàn thành', due: '2026-07-01', tag: 'Design' }
];

const STATUS = ['Cần làm', 'Đang làm', 'Hoàn thành'];
const fmtDate = (date) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(`${date}T00:00:00`));
const getPerson = (id, people = PEOPLE) => people.find((person) => person.id === id) || PEOPLE[0];

function Avatar({ person, small = false }) {
  return <span className={`avatar ${small ? 'small' : ''}`} style={{ background: person.color }}>{person.initials}</span>;
}

function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@taskflow.vn');
  const [password, setPassword] = useState('123456');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = mode === 'register'
        ? await api.register(name, email, password)
        : await api.login(email, password);
      onLogin({ role: result.user.role, token: result.token, user: result.user });
    } catch (requestError) {
      if (mode === 'login' && requestError instanceof TypeError && password === '123456' && ['admin@taskflow.vn', 'user@taskflow.vn'].includes(email)) {
        onLogin({ role: email.startsWith('admin') ? 'admin' : 'user' });
      } else {
        setError(requestError.message || 'Email hoặc mật khẩu chưa đúng.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-brand">
        <div className="brand-lockup"><span className="brand-mark"><Check size={20} strokeWidth={3} /></span><span>taskflow</span></div>
        <div className="brand-message">
          <div className="brand-art"><span className="art-card one"></span><span className="art-card two"></span><span className="art-check"><Check size={44} strokeWidth={2.8} /></span></div>
          <p className="eyebrow light">LÀM VIỆC THÔNG MINH HƠN</p>
          <h1>Mọi công việc.<br />Một nơi duy nhất.</h1>
          <p>Giao việc rõ ràng, theo dõi tiến độ dễ dàng và cùng đội nhóm hoàn thành mục tiêu.</p>
        </div>
        <p className="login-copyright">© 2026 Taskflow. Made for great teams.</p>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-brand"><span className="brand-mark"><Check size={18} strokeWidth={3} /></span> taskflow</div>
          <p className="eyebrow">{mode === 'login' ? 'CHÀO MỪNG TRỞ LẠI' : 'THAM GIA TASKFLOW'}</p>
          <h2>{mode === 'login' ? 'Đăng nhập vào tài khoản' : 'Tạo tài khoản mới'}</h2>
          <p className="muted">{mode === 'login' ? 'Tiếp tục để quản lý công việc của bạn.' : 'Tạo tài khoản để nhận và theo dõi công việc.'}</p>
          <form onSubmit={submit}>
            {mode === 'register' && <><label>Họ và tên</label><div className="field"><UserRound size={18} /><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" required /></div></>}
            <label>Email</label>
            <div className="field"><UserRound size={18} /><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.com" /></div>
            <div className="label-row"><label>Mật khẩu</label>{mode === 'login' && <button type="button" className="link-btn">Quên mật khẩu?</button>}</div>
            <div className="field"><ShieldCheck size={18} /><input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? 'text' : 'password'} /><button type="button" className="icon-button" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            {error && <p className="form-error">{error}</p>}
            <button className="primary login-submit" disabled={loading}>{loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'} <span>→</span></button>
          </form>
          <div className="auth-switch">{mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? 'Tạo tài khoản' : 'Đăng nhập'}</button></div>
          {mode === 'login' && <div className="demo-box"><Sparkles size={17} /><div><strong>Tài khoản dùng thử</strong><p>Admin: admin@taskflow.vn · User: user@taskflow.vn</p><p>Mật khẩu: 123456</p></div></div>}
        </div>
      </section>
    </main>
  );
}

function Sidebar({ page, setPage, role, mobileOpen, close }) {
  const nav = role === 'admin'
    ? [{ id: 'overview', label: 'Tổng quan', icon: LayoutDashboard }, { id: 'tasks', label: 'Công việc', icon: ListTodo }, { id: 'users', label: 'Thành viên', icon: Users }]
    : [{ id: 'overview', label: 'Tổng quan', icon: LayoutDashboard }, { id: 'tasks', label: 'Công việc của tôi', icon: ListTodo }];
  return <>
    {mobileOpen && <div className="overlay" onClick={close}></div>}
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-brand"><span className="brand-mark"><Check size={19} strokeWidth={3} /></span><span>taskflow</span><button className="sidebar-close" onClick={close}><X /></button></div>
      <p className="nav-title">KHÔNG GIAN LÀM VIỆC</p>
      <nav>{nav.map((item) => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => { setPage(item.id); close(); }}><item.icon size={19} />{item.label}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><Sparkles size={18} /></div><strong>Cần trợ giúp?</strong><p>Xem hướng dẫn sử dụng Taskflow</p><button>Tìm hiểu thêm</button></div>
        <div className="mini-profile"><Avatar person={role === 'admin' ? PEOPLE[0] : PEOPLE[1]} small /><div><strong>{role === 'admin' ? 'Nguyễn Minh' : 'Hoàng Nam'}</strong><span>{role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</span></div><MoreHorizontal size={18} /></div>
      </div>
    </aside>
  </>;
}

function Topbar({ title, role, onLogout, openMenu }) {
  return <header className="topbar"><div className="topbar-title"><button className="menu-button" onClick={openMenu}><Menu /></button><div><p>Taskflow Workspace</p><h2>{title}</h2></div></div><div className="topbar-actions"><button className="notification"><Bell size={20} /><span></span></button><div className="top-avatar"><Avatar person={role === 'admin' ? PEOPLE[0] : PEOPLE[1]} small /><div><strong>{role === 'admin' ? 'Nguyễn Minh' : 'Hoàng Nam'}</strong><span>{role === 'admin' ? 'Admin' : 'User'}</span></div></div><button className="logout" onClick={onLogout} title="Đăng xuất"><LogOut size={19} /></button></div></header>;
}

function StatCard({ label, value, detail, icon: Icon, tone }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={22} /></div><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div></article>;
}

function StatusBadge({ status }) {
  const icon = status === 'Hoàn thành' ? <CheckCircle2 size={14} /> : status === 'Đang làm' ? <Clock3 size={14} /> : <Circle size={14} />;
  return <span className={`status-badge ${status.replaceAll(' ', '-').toLowerCase()}`}>{icon}{status}</span>;
}

function Priority({ value }) { return <span className={`priority p-${value.replace('Trung bình', 'medium').toLowerCase()}`}>● {value}</span>; }

function Dashboard({ tasks, people, role, openCreate }) {
  const visible = tasks;
  const completed = visible.filter((t) => t.status === 'Hoàn thành').length;
  const doing = visible.filter((t) => t.status === 'Đang làm').length;
  return <>
    <section className="welcome-row"><div><p className="eyebrow">THỨ BẢY, 04 THÁNG 07</p><h1>Chào buổi sáng, {role === 'admin' ? 'Minh' : 'Nam'} <span>👋</span></h1><p>Đây là tình hình công việc hôm nay của {role === 'admin' ? 'đội nhóm bạn' : 'bạn'}.</p></div>{role === 'admin' && <button className="primary" onClick={openCreate}><Plus size={19} /> Giao công việc</button>}</section>
    <section className="stats-grid">
      <StatCard label="Tổng công việc" value={visible.length} detail="trong không gian làm việc" icon={ListTodo} tone="blue" />
      <StatCard label="Đang thực hiện" value={doing} detail="cần được theo dõi" icon={Clock3} tone="orange" />
      <StatCard label="Đã hoàn thành" value={completed} detail={`${visible.length ? Math.round(completed / visible.length * 100) : 0}% tỷ lệ hoàn thành`} icon={CheckCircle2} tone="green" />
      <StatCard label="Sắp đến hạn" value={visible.filter(t => t.status !== 'Hoàn thành').length} detail="trong 7 ngày tới" icon={CalendarDays} tone="purple" />
    </section>
    <section className="dashboard-grid">
      <div className="panel activity-panel"><div className="panel-header"><div><h3>Công việc gần đây</h3><p>Tiến độ mới nhất của đội nhóm</p></div><button className="text-action">Xem tất cả →</button></div><div className="recent-list">{visible.slice(0, 5).map(task => { const person = getPerson(task.assignee, people); return <div className="recent-item" key={task.id}><div className="task-check">{task.status === 'Hoàn thành' ? <Check size={15} /> : null}</div><div className="recent-copy"><strong className={task.status === 'Hoàn thành' ? 'done' : ''}>{task.title}</strong><span>{task.tag} · Hạn {fmtDate(task.due)}</span></div><Avatar person={person} small /><StatusBadge status={task.status} /></div>; })}</div></div>
      <div className="panel progress-panel"><div className="panel-header"><div><h3>Tiến độ tổng quan</h3><p>Theo trạng thái công việc</p></div></div><div className="donut-wrap"><div className="donut" style={{ '--pct': `${visible.length ? completed / visible.length * 100 : 0}%` }}><div><strong>{visible.length ? Math.round(completed / visible.length * 100) : 0}%</strong><span>Hoàn thành</span></div></div></div><div className="legend">{STATUS.map((status, index) => <div key={status}><span className={`legend-dot dot-${index}`}></span><span>{status}</span><strong>{visible.filter(t => t.status === status).length}</strong></div>)}</div></div>
    </section>
  </>;
}

function TasksPage({ tasks, people, onUpdateStatus, onRemove, role, openCreate }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tất cả');
  const visible = tasks.filter(t => (filter === 'Tất cả' || t.status === filter) && t.title.toLowerCase().includes(search.toLowerCase()));
  return <>
    <section className="page-heading"><div><p className="eyebrow">QUẢN LÝ CÔNG VIỆC</p><h1>{role === 'admin' ? 'Tất cả công việc' : 'Công việc của tôi'}</h1><p>{role === 'admin' ? 'Theo dõi, phân công và quản lý công việc của đội nhóm.' : 'Theo dõi và cập nhật tiến độ công việc được giao.'}</p></div>{role === 'admin' && <button className="primary" onClick={openCreate}><Plus size={19} /> Giao công việc</button>}</section>
    <section className="panel task-table-panel">
      <div className="task-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm công việc..." /></div><div className="filter-tabs">{['Tất cả', ...STATUS].map(s => <button key={s} className={filter === s ? 'active' : ''} onClick={() => setFilter(s)}>{s}</button>)}</div></div>
      <div className="table-scroll"><table><thead><tr><th>CÔNG VIỆC</th>{role === 'admin' && <th>NGƯỜI PHỤ TRÁCH</th>}<th>ƯU TIÊN</th><th>HẠN CHÓT</th><th>TRẠNG THÁI</th><th></th></tr></thead><tbody>{visible.map(task => { const person = getPerson(task.assignee, people); return <tr key={task.id}><td><div className="task-title-cell"><span className="tag">{task.tag}</span><strong>{task.title}</strong><p>{task.description}</p></div></td>{role === 'admin' && <td><div className="person-cell"><Avatar person={person} small /><div><strong>{person.name}</strong><span>{person.role}</span></div></div></td>}<td><Priority value={task.priority} /></td><td><span className="date-cell"><CalendarDays size={15} />{fmtDate(task.due)}</span></td><td><select className={`status-select s-${task.status.replaceAll(' ', '-').toLowerCase()}`} value={task.status} onChange={e => onUpdateStatus(task.id, e.target.value)}>{STATUS.map(s => <option key={s}>{s}</option>)}</select></td><td>{role === 'admin' && <button className="delete-btn" onClick={() => onRemove(task.id)} title="Xóa"><Trash2 size={17} /></button>}</td></tr>; })}</tbody></table>{visible.length === 0 && <div className="empty"><Search size={28} /><strong>Không tìm thấy công việc</strong><p>Thử thay đổi từ khóa hoặc bộ lọc.</p></div>}</div>
    </section>
  </>;
}

function UsersPage({ tasks, people, onAssign }) {
  return <><section className="page-heading"><div><p className="eyebrow">ĐỘI NGŨ</p><h1>Thành viên</h1><p>Quản lý thành viên và giao công việc trực tiếp.</p></div><button className="secondary"><Plus size={18} /> Mời thành viên</button></section><section className="users-grid">{people.map(person => { const assigned = tasks.filter(t => t.assignee === person.id); const done = assigned.filter(t => t.status === 'Hoàn thành').length; return <article className="user-card" key={person.id}><div className="user-card-top"><Avatar person={person} /><button><MoreHorizontal /></button></div><h3>{person.name}</h3><p>{person.role}</p><span className="user-email">{person.email}</span><div className="user-progress"><div><span>Tiến độ công việc</span><strong>{assigned.length ? Math.round(done / assigned.length * 100) : 0}%</strong></div><div className="progress-track"><span style={{ width: `${assigned.length ? done / assigned.length * 100 : 0}%` }}></span></div></div><div className="user-card-footer"><span><strong>{assigned.length}</strong> công việc</span><button onClick={() => onAssign(person.id)}>Giao việc →</button></div></article>; })}</section></>;
}

function TaskModal({ close, addTask, defaultAssignee, people }) {
  const [form, setForm] = useState({ title: '', description: '', assignee: defaultAssignee || people[0]?.id || '', priority: 'Trung bình', status: 'Cần làm', due: '2026-07-10', tag: 'Development' });
  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = (e) => { e.preventDefault(); if (!form.title.trim()) return; addTask(form); close(); };
  return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">CÔNG VIỆC MỚI</p><h2>Giao công việc</h2><p>Chỉ định người phụ trách và thiết lập thông tin.</p></div><button className="modal-close" onClick={close}><X /></button></div><form onSubmit={submit}><label>Tên công việc</label><input autoFocus value={form.title} onChange={e => update('title', e.target.value)} placeholder="Ví dụ: Hoàn thiện báo cáo tháng..." required /><label>Mô tả</label><textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Mô tả ngắn gọn yêu cầu công việc" rows="3"></textarea><div className="form-grid"><div><label>Giao cho</label><select value={form.assignee} onChange={e => update('assignee', e.target.value)}>{people.map(p => <option key={p.id} value={p.id}>{p.name} — {p.role}</option>)}</select></div><div><label>Hạn hoàn thành</label><input type="date" value={form.due} onChange={e => update('due', e.target.value)} /></div><div><label>Mức ưu tiên</label><select value={form.priority} onChange={e => update('priority', e.target.value)}><option>Cao</option><option>Trung bình</option><option>Thấp</option></select></div><div><label>Nhóm công việc</label><select value={form.tag} onChange={e => update('tag', e.target.value)}><option>Development</option><option>Design</option><option>Marketing</option><option>Content</option></select></div></div><div className="modal-actions"><button type="button" className="secondary" onClick={close}>Hủy</button><button className="primary"><Plus size={18} /> Giao công việc</button></div></form></div></div>;
}

function App() {
  const [role, setRole] = useState(() => sessionStorage.getItem('taskflow-role'));
  const [people, setPeople] = useState(PEOPLE);
  const [page, setPage] = useState('overview');
  const [tasks, setTasks] = useState(() => { try { return JSON.parse(localStorage.getItem('taskflow-tasks')) || SEED_TASKS; } catch { return SEED_TASKS; } });
  const [modal, setModal] = useState(false);
  const [defaultAssignee, setDefaultAssignee] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => localStorage.setItem('taskflow-tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => {
    if (!role || !getToken()) return;
    api.tasks().then(setTasks).catch(() => {});
    if (role === 'admin') {
      api.users().then((users) => setPeople(users.map((user) => ({
        ...user,
        role: user.job || 'Thành viên',
        initials: user.initials || user.name.slice(0, 2).toUpperCase(),
        color: user.color || '#73a4ff'
      })))).catch(() => {});
    }
  }, [role]);
  const login = ({ role: nextRole, token }) => {
    sessionStorage.setItem('taskflow-role', nextRole);
    if (token) sessionStorage.setItem('taskflow-token', token);
    setRole(nextRole);
  };
  const logout = () => { sessionStorage.removeItem('taskflow-role'); sessionStorage.removeItem('taskflow-token'); setRole(null); setPage('overview'); };
  const pageTitle = useMemo(() => ({ overview: 'Tổng quan', tasks: role === 'admin' ? 'Công việc' : 'Công việc của tôi', users: 'Thành viên' })[page], [page, role]);
  const showCreate = (assignee = '') => { setDefaultAssignee(assignee); setModal(true); };
  const addTask = async (task) => {
    const temporary = { ...task, id: `temp-${Date.now()}` };
    setTasks((current) => [temporary, ...current]);
    if (!getToken()) return;
    try {
      const created = await api.createTask(task);
      setTasks((current) => current.map((item) => item.id === temporary.id ? created : item));
    } catch {
      setTasks((current) => current.filter((item) => item.id !== temporary.id));
    }
  };
  const updateTaskStatus = async (id, status) => {
    const previous = tasks.find((task) => task.id === id)?.status;
    setTasks((current) => current.map((task) => task.id === id ? { ...task, status } : task));
    if (!getToken()) return;
    try { await api.updateTask(id, { status }); }
    catch { setTasks((current) => current.map((task) => task.id === id ? { ...task, status: previous } : task)); }
  };
  const removeTask = async (id) => {
    const previous = tasks;
    setTasks((current) => current.filter((task) => task.id !== id));
    if (!getToken()) return;
    try { await api.deleteTask(id); }
    catch { setTasks(previous); }
  };
  if (!role) return <Login onLogin={login} />;
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} role={role} mobileOpen={mobileOpen} close={() => setMobileOpen(false)} /><div className="main-shell"><Topbar title={pageTitle} role={role} onLogout={logout} openMenu={() => setMobileOpen(true)} /><main className="content">{page === 'overview' && <Dashboard tasks={tasks} people={people} role={role} openCreate={() => showCreate()} />}{page === 'tasks' && <TasksPage tasks={tasks} people={people} onUpdateStatus={updateTaskStatus} onRemove={removeTask} role={role} openCreate={() => showCreate()} />}{page === 'users' && role === 'admin' && <UsersPage tasks={tasks} people={people} onAssign={showCreate} />}</main></div>{modal && <TaskModal close={() => setModal(false)} addTask={addTask} defaultAssignee={defaultAssignee} people={people} />}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
