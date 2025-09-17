import React, { useState } from 'react';
import { Upload, Globe, Mail, Bell, Server } from 'lucide-react';

const S2PlatformSettings = () => {
  const [logo, setLogo] = useState(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaTags, setMetaTags] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [collapsedSection, setCollapsedSection] = useState('');

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(URL.createObjectURL(file));
  };

  const toggleSection = (section) => {
    setCollapsedSection((prev) => (prev === section ? '' : section));
  };

  return (
    <div className="p-4 w-full max-w-7xl mt-5 md:mt-10 mx-auto space-y-6 font-interR">
      <h2 className="text-xl font-interSb text-bluecol">Platform Configuration</h2>

      {/* Branding Section */}
      <div className="shadow-customCard p-4 rounded-xl bg-white">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('branding')}>
          <h3 className="text-lg font-interSb flex items-center gap-2"><Globe size={18} /> Branding Settings</h3>
          <span className="text-sm text-bluecol">{collapsedSection === 'branding' ? 'Hide' : 'Show'}</span>
        </div>
        {collapsedSection === 'branding' && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm mb-1">Upload Logo</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm" />
              {logo && <img src={logo} alt="Preview" className="mt-2 h-16" />}
            </div>
            <div>
              <label className="block text-sm mb-1">Meta Title</label>
              <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm mb-1">Meta Keywords (comma-separated)</label>
              <input type="text" value={metaTags} onChange={(e) => setMetaTags(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm mb-1">Meta Description</label>
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" rows={3}></textarea>
            </div>
          </div>
        )}
      </div>

      {/* Notification Section */}
      <div className="shadow-customCard p-4 rounded-xl bg-white">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('notifications')}>
          <h3 className="text-lg font-interSb flex items-center gap-2"><Bell size={18} /> Notification Settings</h3>
          <span className="text-sm text-bluecol">{collapsedSection === 'notifications' ? 'Hide' : 'Show'}</span>
        </div>
        {collapsedSection === 'notifications' && (
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>Configure email/SMS gateways and alert preferences.</p>
            <p>(This section will include real input fields later during integration.)</p>
          </div>
        )}
      </div>

      {/* API/Webhooks Section */}
      <div className="shadow-customCard p-4 rounded-xl bg-white">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('webhooks')}>
          <h3 className="text-lg font-interSb flex items-center gap-2"><Server size={18} /> API & Webhooks</h3>
          <span className="text-sm text-bluecol">{collapsedSection === 'webhooks' ? 'Hide' : 'Show'}</span>
        </div>
        {collapsedSection === 'webhooks' && (
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p>Manage API keys, webhooks, and integration tokens.</p>
            <p>(This section will include real input fields later during integration.)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default S2PlatformSettings;
