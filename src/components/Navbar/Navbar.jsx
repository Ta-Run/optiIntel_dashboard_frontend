import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, FileText, AlertTriangle, Inbox } from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { globalSearch, getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';
import { formatRelativeTime } from '../../utils/formatters';

const searchIcons = {
  file: FileText,
  incident: AlertTriangle,
  dlq: Inbox,
};

export default function Navbar() {
  const { collapsed, setMobileOpen } = useSidebar();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await globalSearch(query);
      setResults(res);
      setShowResults(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleResultClick = (result) => {
    navigate(result.path);
    setQuery('');
    setShowResults(false);
  };

  const handleNotificationClick = async (notif) => {
    await markNotificationRead(notif.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    if (notif.link) navigate(notif.link);
    setShowNotifications(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white border-b border-border flex items-center px-4 lg:px-6 gap-4 transition-all duration-300 ${
        collapsed ? 'lg:left-[72px]' : 'lg:left-64'
      } left-0`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>

        <div ref={searchRef} className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search files, incidents, messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:border-border focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
          />

          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-border shadow-elevated overflow-hidden z-50">
              {results.map((result) => {
                const Icon = searchIcons[result.type] || FileText;
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left"
                  >
                    <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 truncate">{result.label}</p>
                      <p className="text-xs text-slate-500">{result.sublabel}</p>
                    </div>
                    <span className="text-xs text-slate-400 capitalize">{result.type}</span>
                  </button>
                );
              })}
            </div>
          )}

          {showResults && query.length >= 2 && results.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-border shadow-elevated p-4 text-sm text-slate-500 z-50">
              No results found
            </div>
          )}
        </div>
      </div>

      <div ref={notifRef} className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute top-full right-0 mt-1 w-80 bg-white rounded-lg border border-border shadow-elevated overflow-hidden z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={async () => {
                    await markAllNotificationsRead();
                    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                  }}
                  className="text-xs text-brand-600 hover:text-brand-700"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-border last:border-0 ${
                    !notif.read ? 'bg-brand-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                    )}
                    <div className={!notif.read ? '' : 'ml-3.5'}>
                      <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatRelativeTime(notif.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
