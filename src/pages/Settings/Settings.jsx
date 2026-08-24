import { useState } from 'react';
import { Bell, Shield, Globe, Palette, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Settings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    criticalAlerts: true,
    dlqAlerts: true,
    autoRefresh: true,
    refreshInterval: 30,
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
  });

  const handleSave = () => {
    addToast('Settings saved successfully');
  };

  const SettingSection = ({ icon: Icon, title, description, children }) => (
    <div className="card p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-slate-100">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="page-container space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your operations dashboard preferences</p>
        </div>
        <button onClick={handleSave} className="btn-primary">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingSection
          icon={Bell}
          title="Notifications"
          description="Configure alert and notification preferences"
        >
          <Toggle
            label="Email Notifications"
            description="Receive email alerts for critical events"
            checked={settings.emailNotifications}
            onChange={(v) => setSettings({ ...settings, emailNotifications: v })}
          />
          <Toggle
            label="Critical Incident Alerts"
            description="Immediate alerts for critical incidents"
            checked={settings.criticalAlerts}
            onChange={(v) => setSettings({ ...settings, criticalAlerts: v })}
          />
          <Toggle
            label="DLQ Threshold Alerts"
            description="Alert when DLQ message count exceeds threshold"
            checked={settings.dlqAlerts}
            onChange={(v) => setSettings({ ...settings, dlqAlerts: v })}
          />
        </SettingSection>

        <SettingSection
          icon={Shield}
          title="Dashboard"
          description="Dashboard behavior and refresh settings"
        >
          <Toggle
            label="Auto Refresh"
            description="Automatically refresh dashboard data"
            checked={settings.autoRefresh}
            onChange={(v) => setSettings({ ...settings, autoRefresh: v })}
          />
          <div className="py-3 border-b border-border">
            <label className="text-sm font-medium text-slate-900">Refresh Interval (seconds)</label>
            <select
              className="select-field w-full mt-1"
              value={settings.refreshInterval}
              onChange={(e) =>
                setSettings({ ...settings, refreshInterval: Number(e.target.value) })
              }
            >
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={120}>2 minutes</option>
            </select>
          </div>
        </SettingSection>

        <SettingSection
          icon={Globe}
          title="Regional"
          description="Timezone and date format preferences"
        >
          <div className="py-3 border-b border-border">
            <label className="text-sm font-medium text-slate-900">Timezone</label>
            <select
              className="select-field w-full mt-1"
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Asia/Kolkata">India Standard Time</option>
            </select>
          </div>
          <div className="py-3">
            <label className="text-sm font-medium text-slate-900">Date Format</label>
            <select
              className="select-field w-full mt-1"
              value={settings.dateFormat}
              onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </SettingSection>

        <SettingSection
          icon={Palette}
          title="Appearance"
          description="Theme and display preferences"
        >
          <div className="py-3">
            <label className="text-sm font-medium text-slate-900">Theme</label>
            <p className="text-xs text-slate-500 mt-0.5 mb-2">
              Dark mode support is structured for future implementation
            </p>
            <select
              className="select-field w-full"
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
            >
              <option value="light">Light</option>
              <option value="dark" disabled>
                Dark (Coming Soon)
              </option>
              <option value="system" disabled>
                System (Coming Soon)
              </option>
            </select>
          </div>
        </SettingSection>
      </div>
    </div>
  );
}
