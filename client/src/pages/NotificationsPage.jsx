import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  ClipboardList,
  Calendar,
  FolderHeart,
  Stethoscope,
  Info,
} from 'lucide-react';
import { notificationService } from '../services/api';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { formatDateTime } from '../utils/formatters';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAll();
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id, link) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      if (link) {
        navigate(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'assessment':
        return <ClipboardList className="w-4 h-4 text-health-600" />;
      case 'review':
        return <Stethoscope className="w-4 h-4 text-clinical-600" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'record':
        return <FolderHeart className="w-4 h-4 text-amber-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading notifications..." />;
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
            {unreadCount > 0 && <Badge variant="danger" size="sm">{unreadCount} Unread</Badge>}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            System alerts, doctor assessment review updates, and appointment reminders.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {displayedNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description={filter === 'unread' ? "You're all caught up! No unread notifications." : "No notifications on record yet."}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft divide-y divide-slate-100 overflow-hidden">
          {displayedNotifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleMarkRead(n._id, n.link)}
              className={`p-4 sm:px-6 flex items-start justify-between cursor-pointer transition-colors ${
                n.read ? 'hover:bg-slate-50' : 'bg-health-50/30 hover:bg-health-50/60'
              }`}
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0 pr-4">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>
                <div className="text-xs">
                  <p className={`text-slate-900 leading-relaxed ${n.read ? 'font-normal' : 'font-semibold'}`}>
                    {n.message}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-health-600 flex-shrink-0" />
                )}
                {n.link && <ExternalLink className="w-4 h-4 text-slate-400" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
