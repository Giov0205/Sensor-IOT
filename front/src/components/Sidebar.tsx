import { useState } from 'react';
import {
    Home,
    Book,
    AlertCircle,
    Settings,
    Menu
} from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const [open, setOpen] = useState(true);

    return (
        <div className={`sidebar ${open ? 'expanded' : 'collapsed'}`}>
            <button className="menu-toggle" onClick={() => setOpen(!open)}>
                <Menu size={20} />
            </button>

            <div className="logo-section">
                <div className="logo-dot"></div>
                {open && <h1 className="sidebar-title">AirGuard</h1>}
            </div>

            <ul className="nav-list">
                <li><a href="/home"><Home size={20} /> {open && <span>Inicio</span>}</a></li>
                <li><a href="/lecturas"><Book size={20} /> {open && <span>Lecturas</span>}</a></li>
                <li><a href="/alertas"><AlertCircle size={20} /> {open && <span>Alertas</span>}</a></li>
                <li><a href="/config"><Settings size={20} /> {open && <span>Configuración</span>}</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;
