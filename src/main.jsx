import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell, CalendarDays, Check, CheckCircle2, Circle,
  Clock3, Eye, EyeOff, LayoutDashboard, ListTodo, LogOut, Menu,
  MoreHorizontal, Plus, Search, ShieldCheck, Sparkles, Trash2,
  UserRound, Users, X, Upload, Send, AlertTriangle, Paperclip
} from 'lucide-react';
import './styles.css';
import { api, getToken } from './api';


const STATUS = ['Cần làm', 'Đang làm', 'Hoàn thành'];
const DEPARTMENTS = ['Event', 'Media', 'Nghệ Thuật', 'Văn Hóa', 'Kỹ Thuật'];
const fmtDate = (date) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(`${date}T00:00:00`));
const getPerson = (id, people = []) => people.find((person) => person.id === id) || { name: '—', initials: '?', color: '#ccc', role: '' };

function Avatar({ person, small = false }) {
  return <span className={`avatar ${small ? 'small' : ''}`} style={{ background: person.color }}>{person.initials}</span>;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login(email, password);
      onLogin({ role: result.user.role, token: result.token, user: result.user });
    } catch (requestError) {
      setError(requestError.message || 'Email hoặc mật khẩu chưa đúng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-brand">
        <div className="brand-lockup"><span className="brand-mark"><Check size={20} strokeWidth={3} /></span><span>Faerie Workspace</span></div>
        <div className="brand-message">
          <div className="brand-art"><span className="art-card one"></span><span className="art-card two"></span><span className="art-check"><Check size={44} strokeWidth={2.8} /></span></div>
          <p className="eyebrow light">LÀM VIỆC THÔNG MINH HƠN</p>
          <h1>Mọi công việc.<br />Một nơi duy nhất.</h1>
          <p>Giao việc rõ ràng, theo dõi tiến độ dễ dàng và cùng đội nhóm hoàn thành mục tiêu.</p>
        </div>
        <p className="login-copyright">© 2026 Faerie Workspace. Made for great teams.</p>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="mobile-brand"><span className="brand-mark"><Check size={18} strokeWidth={3} /></span> Faerie Workspace</div>
          <p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p>
          <h2>Đăng nhập vào tài khoản</h2>
          <p className="muted">Tiếp tục để quản lý công việc của bạn.</p>
          <form onSubmit={submit}>
            <label>Email</label>
            <div className="field"><UserRound size={18} /><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@company.com" required /></div>
            <div className="label-row"><label>Mật khẩu</label></div>
            <div className="field"><ShieldCheck size={18} /><input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? 'text' : 'password'} required /><button type="button" className="icon-button" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            {error && <p className="form-error">{error}</p>}
            <button className="primary login-submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng nhập'} <span>→</span></button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Sidebar({ page, setPage, role, mobileOpen, close, user }) {
  const nav = role === 'admin'
    ? [{ id: 'overview', label: 'Tổng quan', icon: LayoutDashboard }, { id: 'tasks', label: 'Công việc', icon: ListTodo }, { id: 'users', label: 'Thành viên', icon: Users }]
    : [{ id: 'overview', label: 'Tổng quan', icon: LayoutDashboard }, { id: 'tasks', label: 'Công việc của tôi', icon: ListTodo }];
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : '?';
  const miniPerson = { initials, color: user?.color || '#73a4ff' };
  return <>
    {mobileOpen && <div className="overlay" onClick={close}></div>}
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebar-brand"><span className="brand-mark"><Check size={19} strokeWidth={3} /></span><span>Faerie Workspace</span><button className="sidebar-close" onClick={close}><X /></button></div>
      <p className="nav-title">KHÔNG GIAN LÀM VIỆC</p>
      <nav>{nav.map((item) => <button key={item.id} className={page === item.id || (page === 'create' && item.id === 'tasks') ? 'active' : ''} onClick={() => { setPage(item.id); close(); }}><item.icon size={19} />{item.label}</button>)}</nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><Sparkles size={18} /></div><strong>Cần trợ giúp?</strong><p>Xem hướng dẫn sử dụng Faerie Workspace</p><button>Tìm hiểu thêm</button></div>
        <div className="mini-profile"><Avatar person={miniPerson} small /><div><strong>{user?.name || '—'}</strong><span>{role === 'admin' ? 'Quản trị viên' : 'Thành viên'}</span></div><MoreHorizontal size={18} /></div>
      </div>
    </aside>
  </>;
}

function Topbar({ title, role, onLogout, openMenu, user }) {
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : '?';
  const topPerson = { initials, color: user?.color || '#73a4ff' };
  return <header className="topbar"><div className="topbar-title"><button className="menu-button" onClick={openMenu}><Menu /></button><div><p>Faerie Workspace</p><h2>{title}</h2></div></div><div className="topbar-actions"><button className="notification"><Bell size={20} /><span></span></button><div className="top-avatar"><Avatar person={topPerson} small /><div><strong>{user?.name || '—'}</strong><span>{role === 'admin' ? 'Admin' : 'User'}</span></div></div><button className="logout" onClick={onLogout} title="Đăng xuất"><LogOut size={19} /></button></div></header>;
}

function StatCard({ label, value, detail, icon: Icon, tone }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={22} /></div><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div></article>;
}

function StatusBadge({ status }) {
  const icon = status === 'Hoàn thành' ? <CheckCircle2 size={14} /> : status === 'Đang làm' ? <Clock3 size={14} /> : <Circle size={14} />;
  return <span className={`status-badge ${status.replaceAll(' ', '-').toLowerCase()}`}>{icon}{status}</span>;
}

function Priority({ value }) { return <span className={`priority p-${value.replace('Trung bình', 'medium').toLowerCase()}`}>● {value}</span>; }

function Dashboard({ tasks, people, reminders, role, openCreate, user }) {
  const visible = tasks;
  const completed = visible.filter((t) => t.status === 'Hoàn thành').length;
  const doing = visible.filter((t) => t.status === 'Đang làm').length;
  const now = new Date();
  const dateLabel = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' }).toUpperCase();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'buổi sáng' : hour < 18 ? 'buổi chiều' : 'buổi tối';
  const firstName = user?.name ? user.name.split(' ').pop() : '';
  return <>
    <section className="welcome-row"><div><p className="eyebrow">{dateLabel}</p><h1>Chào {greeting}{firstName ? `, ${firstName}` : ''} <span>👋</span></h1><p>Đây là tình hình công việc hôm nay của {role === 'admin' ? 'đội nhóm bạn' : 'bạn'}.</p></div>{role === 'admin' && <button className="primary" onClick={openCreate}><Plus size={19} /> Giao công việc</button>}</section>
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
    {role === 'admin' && <AdminInsights tasks={tasks} people={people} reminders={reminders} />}
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

function CreateTaskPage({ people, defaultAssignee, onSubmit, onCancel }) {
  const initialDept = people.find((p) => p.id === defaultAssignee)?.department || DEPARTMENTS[0];
  const [form, setForm] = useState({ title: '', description: '', priority: 'Trung bình', due: new Date().toISOString().slice(0, 10), department: initialDept, assignee: defaultAssignee || people[0]?.id || '', tag: 'Development' });
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const filteredPeople = people.filter((p) => p.department === form.department);
  const choices = filteredPeople.length ? filteredPeople : people;
  useEffect(() => {
    if (people.length && !filteredPeople.some((p) => p.id === form.assignee)) {
      setForm((current) => ({ ...current, assignee: filteredPeople[0]?.id || people[0]?.id || '' }));
    }
  }, [form.department, people]);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.assignee) return;
    setSending(true);
    await onSubmit({ ...form, status: 'Cần làm', attachments: files.map((file) => ({ name: file.name, size: file.size })) });
    setSending(false);
    onCancel();
  };
  const addFiles = (event) => setFiles((current) => [...current, ...Array.from(event.target.files || [])].slice(0, 20));
  return <>
    <section className="page-heading"><div><p className="eyebrow">ADMIN · GIAO VIỆC</p><h1>Tạo task mới</h1><p>Thiết lập yêu cầu, deadline và gửi đến đúng thành viên.</p></div><button className="secondary" onClick={onCancel}>← Quay lại</button></section>
    <form className="create-task-layout" onSubmit={submit}>
      <section className="panel task-form-card">
        <div className="form-section-title"><span>01</span><div><h3>Thông tin công việc</h3><p>Nội dung và kết quả cần hoàn thành.</p></div></div>
        <label>Task</label><input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Nhập tên công việc" required />
        <label>Mô tả chi tiết</label><textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows="6" placeholder="Mô tả yêu cầu, tiêu chí hoàn thành..." />
        <div className="form-grid"><div><label>Độ ưu tiên</label><select value={form.priority} onChange={(e) => update('priority', e.target.value)}><option>Cao</option><option>Trung bình</option><option>Thấp</option></select></div><div><label>Last date</label><input type="date" value={form.due} onChange={(e) => update('due', e.target.value)} required /></div></div>
        <label>Upload ảnh / folder / ZIP <span className="optional">(giả lập)</span></label>
        <label className="upload-zone"><Upload size={24} /><strong>Chọn file hoặc kéo thả vào đây</strong><span>Ảnh, tài liệu, ZIP · tối đa 20 file</span><input type="file" multiple accept="image/*,.zip,.rar,.7z,.pdf,.doc,.docx" onChange={addFiles} /></label>
        {files.length > 0 && <div className="file-list">{files.map((file, index) => <span key={`${file.name}-${index}`}><Paperclip size={13} />{file.name}<button type="button" onClick={() => setFiles(files.filter((_, i) => i !== index))}>×</button></span>)}</div>}
      </section>
      <aside className="panel assignment-card">
        <div className="form-section-title"><span>02</span><div><h3>Người nhận</h3><p>Chọn Ban và thành viên được giao việc.</p></div></div>
        <label>Chọn Ban</label><select value={form.department} onChange={(e) => update('department', e.target.value)}>{DEPARTMENTS.map(d => <option key={d}>{d}</option>)}</select>
        <label>Chọn thành viên</label><div className="member-options">{choices.length === 0 && <p style={{color:'#9aa3b2',fontSize:'12px',padding:'8px 0'}}>Không có thành viên nào trong ban này.</p>}{choices.map((person) => <label key={person.id} className={form.assignee === person.id ? 'selected' : ''}><input type="radio" name="assignee" value={person.id} checked={form.assignee === person.id} onChange={() => update('assignee', person.id)} /><Avatar person={person} small /><div><strong>{person.name}</strong><span>{person.mssv || 'Chưa có MSSV'} · {person.email}</span></div><Check size={16} /></label>)}</div>
        <div className="send-note"><Bell size={17} /><span>Thành viên sẽ nhận task trên hệ thống{` `}<strong>và qua email khi đã cấu hình mail.</strong></span></div>
        <button className="primary send-task-button" disabled={sending || !form.assignee}><Send size={18} />{sending ? 'Đang gửi...' : 'Send task'}</button>
      </aside>
    </form>
  </>;
}

function AdminInsights({ tasks, people, reminders }) {
  const now = new Date();
  const activeTasks = tasks.filter((task) => task.status !== 'Hoàn thành');
  const deadlines = [...activeTasks].sort((a, b) => new Date(a.due) - new Date(b.due)).slice(0, 6);
  const daysLeft = (date) => Math.ceil((new Date(`${date}T23:59:59`) - now) / 86400000);
  return <section className="admin-insights">
    <div className="panel deadline-panel"><div className="panel-header"><div><h3>Timeline & deadline</h3><p>Công việc cần ưu tiên theo thời hạn</p></div><CalendarDays size={19} /></div><div className="timeline-list">{deadlines.map((task) => { const days = daysLeft(task.due); return <div key={task.id} className={`timeline-item ${days < 0 ? 'overdue' : days <= 3 ? 'urgent' : ''}`}><span className="timeline-line"></span><div className="timeline-date"><strong>{fmtDate(task.due)}</strong><span>{days < 0 ? `Quá ${Math.abs(days)} ngày` : days === 0 ? 'Hôm nay' : `Còn ${days} ngày`}</span></div><div className="timeline-copy"><strong>{task.title}</strong><span>{getPerson(task.assignee, people).name} · {task.department || task.tag}</span></div><Priority value={task.priority} /></div>; })}{deadlines.length === 0 && <div className="empty"><CheckCircle2 /><strong>Không có deadline đang chờ</strong></div>}</div></div>
    <div className="panel reminder-panel"><div className="panel-header"><div><h3>Lời nhắc điều hành</h3><p>Từ Mentor, Supporter và Leader</p></div><Bell size={19} /></div><div className="reminder-table-wrap"><table className="compact-table"><thead><tr><th>TIME</th><th>MESSAGE</th><th>BY WHO?</th></tr></thead><tbody>{reminders.map((item) => <tr key={item.id}><td>{new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(item.time))}</td><td>{item.message}</td><td><span className={`by-badge by-${item.byWho?.toLowerCase()}`}>{item.byWho}</span></td></tr>)}</tbody></table></div></div>
    <div className="panel member-report"><div className="panel-header"><div><h3>Thống kê toàn bộ thành viên</h3><p>Khối lượng công việc và mức cảnh báo</p></div><Users size={19} /></div><div className="table-scroll"><table><thead><tr><th>MSSV</th><th>HỌ VÀ TÊN</th><th>CHỨC VỤ</th><th>NĂM SINH</th><th>EMAIL</th><th>TASK ON DOING</th><th>TASK OVERDUE</th><th>WARNING</th></tr></thead><tbody>{people.map((person) => { const memberTasks = tasks.filter((task) => task.assignee === person.id); const doing = memberTasks.filter((task) => task.status === 'Đang làm').length; const overdue = memberTasks.filter((task) => task.status !== 'Hoàn thành' && daysLeft(task.due) < 0).length; const warnings = Number(person.warnings) || 0; return <tr key={person.id}><td><strong>{person.mssv || '—'}</strong></td><td><div className="person-cell"><Avatar person={person} small /><div><strong>{person.name}</strong><span>{person.department}</span></div></div></td><td><span className={`role-badge role-${(person.job || 'member').toLowerCase().replace(/\s+/g, '-')}`}>{person.job || 'Member'}</span></td><td>{person.birthYear || '—'}</td><td>{person.email}</td><td><span className="metric-pill doing">{doing}</span></td><td><span className={`metric-pill ${overdue ? 'overdue' : ''}`}>{overdue}</span></td><td><span className={`warning-level warning-${Math.min(warnings, 3)}`}><AlertTriangle size={14} />{warnings} lần</span></td></tr>; })}</tbody></table></div></div>
    <div className="panel all-task-report"><div className="panel-header"><div><h3>List all task</h3><p>Toàn bộ công việc trong hệ thống</p></div><ListTodo size={19} /></div><div className="table-scroll"><table><thead><tr><th>TASK</th><th>THÀNH VIÊN</th><th>BAN</th><th>DEADLINE</th><th>TRẠNG THÁI</th></tr></thead><tbody>{tasks.map((task) => <tr key={task.id}><td><strong>{task.title}</strong></td><td>{getPerson(task.assignee, people).name}</td><td>{task.department || task.tag}</td><td>{fmtDate(task.due)}</td><td><StatusBadge status={task.status} /></td></tr>)}</tbody></table></div></div>
  </section>;
}

function UsersPage({ tasks, people, onAssign }) {
  return <><section className="page-heading"><div><p className="eyebrow">ĐỘI NGŨ</p><h1>Thành viên</h1><p>Quản lý thành viên và giao công việc trực tiếp.</p></div></section><section className="users-grid">{people.map(person => { const assigned = tasks.filter(t => t.assignee === person.id); const done = assigned.filter(t => t.status === 'Hoàn thành').length; return <article className="user-card" key={person.id}><div className="user-card-top"><Avatar person={person} /><button><MoreHorizontal /></button></div><h3>{person.name}</h3><span className={`role-badge role-${(person.job || 'member').toLowerCase().replace(/\s+/g, '-')}`}>{person.job || 'Member'}</span><span className="user-email">{person.email}</span><div className="user-progress"><div><span>Tiến độ công việc</span><strong>{assigned.length ? Math.round(done / assigned.length * 100) : 0}%</strong></div><div className="progress-track"><span style={{ width: `${assigned.length ? done / assigned.length * 100 : 0}%` }}></span></div></div><div className="user-card-footer"><span><strong>{assigned.length}</strong> công việc</span><button onClick={() => onAssign(person.id)}>Giao việc →</button></div></article>; })}</section></>;
}

function TaskModal({ close, addTask, defaultAssignee, people }) {
  const [form, setForm] = useState({ title: '', description: '', assignee: defaultAssignee || people[0]?.id || '', priority: 'Trung bình', status: 'Cần làm', due: '2026-07-10', tag: 'Development' });
  const update = (key, value) => setForm({ ...form, [key]: value });
  const submit = (e) => { e.preventDefault(); if (!form.title.trim()) return; addTask(form); close(); };
  return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">CÔNG VIỆC MỚI</p><h2>Giao công việc</h2><p>Chỉ định người phụ trách và thiết lập thông tin.</p></div><button className="modal-close" onClick={close}><X /></button></div><form onSubmit={submit}><label>Tên công việc</label><input autoFocus value={form.title} onChange={e => update('title', e.target.value)} placeholder="Ví dụ: Hoàn thiện báo cáo tháng..." required /><label>Mô tả</label><textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Mô tả ngắn gọn yêu cầu công việc" rows="3"></textarea><div className="form-grid"><div><label>Giao cho</label><select value={form.assignee} onChange={e => update('assignee', e.target.value)}>{people.map(p => <option key={p.id} value={p.id}>{p.name} — {p.role}</option>)}</select></div><div><label>Hạn hoàn thành</label><input type="date" value={form.due} onChange={e => update('due', e.target.value)} /></div><div><label>Mức ưu tiên</label><select value={form.priority} onChange={e => update('priority', e.target.value)}><option>Cao</option><option>Trung bình</option><option>Thấp</option></select></div><div><label>Nhóm công việc</label><select value={form.tag} onChange={e => update('tag', e.target.value)}><option>Development</option><option>Design</option><option>Marketing</option><option>Content</option></select></div></div><div className="modal-actions"><button type="button" className="secondary" onClick={close}>Hủy</button><button className="primary"><Plus size={18} /> Giao công việc</button></div></form></div></div>;
}

function App() {
  const [role, setRole] = useState(() => sessionStorage.getItem('taskflow-role'));
  const [user, setUser] = useState(() => { try { return JSON.parse(sessionStorage.getItem('taskflow-user')); } catch { return null; } });
  const [people, setPeople] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [page, setPage] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [defaultAssignee, setDefaultAssignee] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (!role || !getToken()) return;
    api.tasks().then(setTasks).catch(() => {});
    api.reminders().then(setReminders).catch(() => {});
    if (role === 'admin') {
      api.users().then((users) => setPeople(users.map((u) => ({
        ...u,
        role: u.job || 'Thành viên',
        initials: u.initials || u.name.slice(0, 2).toUpperCase(),
        color: u.color || '#73a4ff'
      })))).catch(() => {});
    }
  }, [role]);
  const login = ({ role: nextRole, token, user: nextUser }) => {
    sessionStorage.setItem('taskflow-role', nextRole);
    if (token) sessionStorage.setItem('taskflow-token', token);
    if (nextUser) sessionStorage.setItem('taskflow-user', JSON.stringify(nextUser));
    setRole(nextRole);
    setUser(nextUser || null);
  };
  const logout = () => {
    sessionStorage.removeItem('taskflow-role');
    sessionStorage.removeItem('taskflow-token');
    sessionStorage.removeItem('taskflow-user');
    setRole(null);
    setUser(null);
    setTasks([]);
    setPeople([]);
    setReminders([]);
    setPage('overview');
  };
  const pageTitle = useMemo(() => ({ overview: 'Tổng quan', tasks: role === 'admin' ? 'Công việc' : 'Công việc của tôi', users: 'Thành viên', create: 'Tạo task' })[page], [page, role]);
  const showCreate = (assignee = '') => { setDefaultAssignee(assignee); setPage('create'); };
  const addTask = async (task) => {
    const temporary = { ...task, id: `temp-${Date.now()}` };
    setTasks((current) => [temporary, ...current]);
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
    try { await api.updateTask(id, { status }); }
    catch { setTasks((current) => current.map((task) => task.id === id ? { ...task, status: previous } : task)); }
  };
  const removeTask = async (id) => {
    const previous = tasks;
    setTasks((current) => current.filter((task) => task.id !== id));
    try { await api.deleteTask(id); }
    catch { setTasks(previous); }
  };
  if (!role) return <Login onLogin={login} />;
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} role={role} mobileOpen={mobileOpen} close={() => setMobileOpen(false)} user={user} /><div className="main-shell"><Topbar title={pageTitle} role={role} onLogout={logout} openMenu={() => setMobileOpen(true)} user={user} /><main className="content">{page === 'overview' && <Dashboard tasks={tasks} people={people} reminders={reminders} role={role} openCreate={() => showCreate()} user={user} />}{page === 'tasks' && <TasksPage tasks={tasks} people={people} onUpdateStatus={updateTaskStatus} onRemove={removeTask} role={role} openCreate={() => showCreate()} />}{page === 'users' && role === 'admin' && <UsersPage tasks={tasks} people={people} onAssign={showCreate} />}{page === 'create' && role === 'admin' && <CreateTaskPage people={people} defaultAssignee={defaultAssignee} onSubmit={addTask} onCancel={() => setPage('tasks')} />}</main></div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
