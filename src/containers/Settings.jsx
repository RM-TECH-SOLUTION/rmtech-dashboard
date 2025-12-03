
import React, { useState } from 'react';
import {
  Save,
  Globe,
  Mail,
  Bell,
  Shield,
  Database,
  Palette,
  Code
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'database', label: 'Database', icon: <Database className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Code className="w-4 h-4" /> },
  ];

  const settingsData = {
    general: {
      siteTitle: 'RM Tech Solution',
      siteDescription: 'Innovative technology solutions for modern businesses',
      siteUrl: 'https://rmtechsolution.com',
      adminEmail: 'admin@rmtechsolution.com',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      postsPerPage: 10,
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3b82f6',
      fontFamily: 'Inter',
      borderRadius: '0.375rem',
    },
  };

  const [settings, setSettings] = useState(settingsData.general);

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert('Settings saved successfully!');
      setLoading(false);
    }, 1000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Title
          </label>
          <input
            type="text"
            value={settings.siteTitle}
            onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site URL
          </label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="Asia/Kolkata">India (IST)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">New York (EST)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Format
          </label>
          <select
            value={settings.dateFormat}
            onChange={(e) => setSettings({...settings, dateFormat: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posts Per Page
          </label>
          <input
            type="number"
            value={settings.postsPerPage}
            onChange={(e) => setSettings({...settings, postsPerPage: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input type="radio" name="theme" value="light" className="mr-2" />
            Light
          </label>
          <label className="flex items-center">
            <input type="radio" name="theme" value="dark" className="mr-2" />
            Dark
          </label>
          <label className="flex items-center">
            <input type="radio" name="theme" value="auto" className="mr-2" />
            Auto
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <input
          type="color"
          value={settings.primaryColor}
          onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
          className="w-16 h-10"
        />
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'email':
        return <div>Email Settings</div>;
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your CMS settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="md:w-64 border-r">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {renderContent()}

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-white rounded-xl shadow-md border border-red-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-red-700 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Reset All Settings</h4>
                <p className="text-sm text-gray-600">Reset all settings to default values</p>
              </div>
              <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                Reset
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Clear Cache</h4>
                <p className="text-sm text-gray-600">Clear all cached data</p>
              </div>
              <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;