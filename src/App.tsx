/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  AlertTriangle, 
  Layers, 
  Zap, 
  Map as MapIcon, 
  Users, 
  Cpu, 
  Bell, 
  Activity,
  ChevronRight,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Plus,
  ShieldAlert,
  Eye,
  Smartphone,
  CheckCircle,
  Navigation,
  Cloud
} from 'lucide-react';
import { cn } from './lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// --- Types ---

type AdminSubView = 'dashboard' | 'incidents' | 'map' | 'units' | 'logs';
type GuestSubView = 'checkin' | 'dashboard' | 'map' | 'instructions' | 'sos';
type View = 'pitch' | 'admin' | 'guide';
type Scene = 'problem' | 'activation' | 'pillars' | 'outcome' | 'gcp';

// --- Constants ---

const SCENE_DURATION = {
  problem: 5000,
  activation: 8000,
  pillars: 12000,
  outcome: 6000,
  gcp: 4000,
};

// --- Components ---

const Sidebar = ({ currentView, currentSubView, setView, setSubView }: { 
  currentView: View, 
  currentSubView: AdminSubView,
  setView: (v: View) => void,
  setSubView: (sv: AdminSubView) => void
}) => {
  const isAdmin = currentView === 'admin';
  return (
    <aside className="hidden md:flex flex-col bg-slate-950 text-secondary font-headline shadow-2xl fixed left-0 top-0 h-full w-72 z-50">
      <div className="p-8 flex flex-col gap-1 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black uppercase tracking-widest text-sm leading-tight">Sentinel Admin</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Vigilant Watch v42</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar font-headline font-bold text-sm tracking-wide">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Layers },
          { id: 'incidents', label: 'Active Incidents', icon: ShieldAlert },
          { id: 'map', label: 'Resource Map', icon: MapIcon },
          { id: 'units', label: 'Responder Units', icon: Users },
          { id: 'logs', label: 'System Logs', icon: Activity },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setView('admin');
              setSubView(item.id as AdminSubView);
            }}
            className={cn(
              "flex items-center gap-4 py-3 px-8 mx-2 transition-all rounded-lg",
              isAdmin && currentSubView === item.id 
                ? "bg-slate-800 text-secondary border-l-4 border-secondary translate-x-1" 
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div className="mx-4 my-8 pt-4 border-t border-slate-800/30">
          <button 
            onClick={() => setView('guide')}
            className={cn(
              "w-full flex items-center gap-4 py-3 px-4 rounded-lg transition-all",
              currentView === 'guide' ? "bg-slate-800 text-secondary border-l-4 border-secondary" : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            )}
          >
            <Smartphone className="w-5 h-5" />
            <span>Guest Guide View</span>
          </button>
        </div>
      </nav>

      <div className="px-6 pb-6">
        <button className="w-full py-4 bg-secondary text-white rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-95 transition-all">
          Broadcast Alert
        </button>
      </div>

      <div className="mt-auto pb-4 pt-2 border-t border-slate-800/50 flex flex-col gap-1 font-headline font-bold text-sm">
        <button className="flex items-center gap-4 text-slate-400 hover:text-slate-100 px-8 py-3 transition-colors">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button className="flex items-center gap-4 text-slate-400 hover:text-slate-100 px-8 py-3 transition-colors border-t border-slate-800/30">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

const TopBar = ({ title, view, setView }: { title: string, view: View, setView: (v: View) => void }) => (
  <header className={cn(
    "fixed top-0 right-0 h-16 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-8 transition-all",
    view === 'pitch' ? "left-0" : "left-72"
  )}>
    <div className="flex items-center gap-6">
      <span className="text-lg font-bold text-on-surface uppercase tracking-widest font-body">{title}</span>
      {view !== 'pitch' && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-fixed-dim/10 border border-tertiary-fixed-dim/20">
          <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-pulse" />
          <span className="text-[10px] font-bold text-on-tertiary-container uppercase tracking-widest">System Secured</span>
        </div>
      )}
    </div>

    <div className="flex items-center gap-4">
      <nav className="hidden lg:flex items-center gap-6 mr-6 border-r border-outline-variant/20 pr-6">
        <button 
          onClick={() => setView('pitch')}
          className={cn("text-xs font-bold uppercase tracking-widest transition-all", view === 'pitch' ? 'text-secondary' : 'text-slate-500 hover:text-on-surface')}
        >
          Visual Pitch
        </button>
        <button 
          onClick={() => setView('admin')}
          className={cn("text-xs font-bold uppercase tracking-widest transition-all", view === 'admin' ? 'text-secondary' : 'text-slate-500 hover:text-on-surface')}
        >
          Operations
        </button>
      </nav>

      {view !== 'pitch' && (
        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-300 overflow-hidden border border-outline-variant/30">
            <img src="https://picsum.photos/seed/admin/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      )}
    </div>
  </header>
);

// --- Content Components ---

const AdminIncidents = () => (
  <div className="space-y-10">
    <div className="flex flex-col gap-2">
      <h2 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface">Active Incidents</h2>
      <p className="text-on-surface-variant font-medium">Monitoring ongoing threats and suppression status.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { t: 'Intrusion Alert', d: 'Sector G North - Unauthorized access at Perimeter Gate 04.', s: 'Critical', p: 'High' },
        { t: 'Smoke Detected', d: 'Server Room B - SUPPRESSION PRE-CHECK ACTIVE.', s: 'Warning', p: 'Medium' },
        { t: 'Elevator Fault', d: 'Main Lobby - Unit 3 stalled between floors 4-5.', s: 'Pending', p: 'Low' },
      ].map((inc, i) => (
        <div key={i} className="bg-white p-8 rounded-[2rem] border border-outline-variant/10 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className={cn("p-4 rounded-2xl", inc.s === 'Critical' ? 'bg-error/10 text-error' : inc.s === 'Warning' ? 'bg-secondary/10 text-secondary' : 'bg-slate-100 text-slate-500')}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">#INC-042{i}</span>
          </div>
          <div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-1">{inc.t}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">{inc.d}</p>
          </div>
          <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
             <span className={cn("px-2 py-1 rounded text-[10px] font-black uppercase", inc.s === 'Critical' ? 'bg-error text-white' : 'bg-slate-200 text-slate-700')}>{inc.s}</span>
             <button className="text-[10px] font-black uppercase tracking-widest text-secondary">Deploy Units</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminUnits = () => (
  <div className="space-y-10">
    <div className="flex flex-col gap-2">
      <h2 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface">Responder Units</h2>
      <p className="text-on-surface-variant font-medium">Managing on-site security and emergency personnel.</p>
    </div>

    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-outline-variant/20 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Unit ID</th>
            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Commander</th>
            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Sector</th>
            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
            <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {[
            { id: 'ALPHA-01', c: 'Vance R.', s: 'Sector G', st: 'In Action' },
            { id: 'BRAVO-02', c: 'Chen M.', s: 'North Wing', st: 'On Patrol' },
            { id: 'CHARLIE-03', c: 'Smith J.', s: 'Main Lobby', st: 'Standby' },
            { id: 'DELTA-04', c: 'Lopez K.', s: 'Sector B', st: 'Evacuating' },
          ].map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/50 transition-all">
              <td className="px-8 py-6 font-mono text-xs font-bold">{u.id}</td>
              <td className="px-8 py-6 text-sm font-bold">{u.c}</td>
              <td className="px-8 py-6 text-sm font-medium text-slate-500">{u.s}</td>
              <td className="px-8 py-6">
                <span className={cn("px-2 py-1 rounded text-[10px] font-black uppercase", u.st === 'In Action' ? 'bg-error/10 text-error' : 'bg-tertiary-fixed-dim/10 text-on-tertiary-container')}>
                  {u.st}
                </span>
              </td>
              <td className="px-8 py-6">
                <button className="text-secondary font-black text-[10px] uppercase tracking-widest">Connect Hub</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const GuestCheckIn = ({ onLogin }: { onLogin: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-surface">
    <div className="absolute top-[-10%] right-[-10%] w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surface-container-low/50 via-surface/10 to-surface pointer-events-none -z-10" />
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm space-y-8">
      <header className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-3 text-on-surface">
          <Shield className="w-8 h-8 text-secondary" />
          <h1 className="font-headline font-black text-3xl tracking-tight uppercase">SafeStay</h1>
        </div>
        <div className="space-y-2">
          <h2 className="font-headline text-4xl font-extrabold tracking-tight">Welcome back.</h2>
          <p className="font-body text-sm text-on-surface-variant max-w-[280px] leading-relaxed mx-auto">
            Access your secure guide and real-time safety dashboard.
          </p>
        </div>
      </header>
      
      <div className="bg-white/40 backdrop-blur-xl p-8 rounded-[2.50rem] shadow-2xl border border-white/20 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Room Number</label>
            <input 
              type="text" 
              placeholder="e.g. 402" 
              className="w-full bg-slate-100 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Access Key</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-slate-100 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-secondary/20 transition-all"
            />
          </div>
        </div>
        <button 
          onClick={onLogin}
          className="w-full py-5 bg-on-surface text-surface rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:bg-slate-800 active:scale-95 transition-all"
        >
          Check In
        </button>
      </div>
    </motion.div>
  </div>
);

const GuestDashboard = ({ setSubView }: { setSubView: (sv: GuestSubView) => void }) => (
  <div className="space-y-8 pb-12">
    <div className="text-center space-y-2">
      <h2 className="text-4xl font-headline font-extrabold tracking-tight">Sentinel Hub</h2>
      <p className="text-on-surface-variant font-medium">Hello, Room 412. Your wing is currently SECURE.</p>
    </div>

    <div className="grid grid-cols-1 gap-4">
      <button 
        onClick={() => setSubView('instructions')}
        className="w-full p-8 bg-error rounded-[2.5rem] text-white flex flex-col gap-4 text-left relative overflow-hidden shadow-2xl shadow-error/30"
      >
        <div className="absolute top-0 right-0 p-8 opacity-20"><ShieldAlert className="w-24 h-24" /></div>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 transition-transform group-hover:scale-110" />
          <span className="text-sm font-black uppercase tracking-widest">Active Instructions</span>
        </div>
        <h3 className="text-3xl font-headline font-black italic tracking-tighter uppercase leading-none">Emergency Guide Active</h3>
        <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Follow your personal route &rarr;</p>
      </button>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setSubView('map')}
          className="p-8 bg-white border border-outline-variant/20 rounded-[2.5rem] flex flex-col gap-4 text-left shadow-sm group"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all">
            <MapIcon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-headline font-black text-on-surface tracking-tight uppercase">Exit Map</h4>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Spatial Overview</p>
          </div>
        </button>
        <button 
          onClick={() => setSubView('sos')}
          className="p-8 bg-white border border-outline-variant/20 rounded-[2.5rem] flex flex-col gap-4 text-left shadow-sm group"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-error group-hover:text-white transition-all">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-headline font-black text-on-surface tracking-tight uppercase">SOS Hub</h4>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Call Security</p>
          </div>
        </button>
      </div>

      <div className="bg-tertiary-fixed-dim/10 p-8 rounded-[2.5rem] border border-tertiary-fixed-dim/20 flex flex-col gap-4">
        <div className="flex items-center gap-3 text-on-tertiary-container">
          <div className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">System Status</span>
        </div>
        <p className="text-sm font-bold text-on-surface leading-tight">All Campus monitoring nodes are nominal. Evacuation routes are currently optimized for your sector.</p>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="space-y-10">
    {/* Page Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded">Operational</span>
          <span className="text-on-surface-variant text-[11px] font-medium">100% Core Services Active</span>
        </div>
        <h2 className="text-5xl font-headline font-extrabold tracking-tight text-on-surface">Real-Time Operations</h2>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-label font-medium text-slate-700 shadow-sm">
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>
    </div>

    {/* Metric Grid */}
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-label text-[10px] font-black uppercase tracking-[0.2em]">Active Guests</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-headline font-black">1,248</span>
              <span className="text-xs font-bold text-emerald-600 font-label">+12%</span>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 font-label text-[10px] font-black uppercase tracking-[0.2em]">In-Zone Status</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-headline font-black">98.2<span className="text-3xl">%</span></span>
              <span className="text-[10px] text-slate-400 font-label uppercase tracking-widest">Stable</span>
            </div>
          </div>
          <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-2xl flex flex-col gap-4 border-l-8 border-secondary">
            <div className="flex justify-between items-start">
              <span className="text-secondary/80 font-label text-[10px] font-black uppercase tracking-[0.2em]">Alerts (Pending)</span>
              <AlertTriangle className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-headline font-black text-white">03</span>
              <span className="text-xs font-bold text-secondary font-label">Action Req.</span>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-[500px] relative group">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 relative z-20">
            <div className="flex items-center gap-3">
              <span className="font-headline font-extrabold text-slate-900">Safety Zone Monitoring</span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <div className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600"><Layers className="w-5 h-5" /></button>
              <button className="px-4 py-2 text-xs font-black text-on-surface uppercase tracking-widest bg-white border border-slate-200 rounded-xl shadow-sm">Details</button>
            </div>
          </div>
          
          <div className="flex-1 relative bg-slate-50 overflow-hidden">
            <img src="https://picsum.photos/seed/blueprint/1200/800?grayscale" alt="Map" className="w-full h-full object-cover opacity-20 grayscale" referrerPolicy="no-referrer" />
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }} 
               animate={{ opacity: 1, scale: 1 }} 
               className="absolute top-1/4 left-1/4 p-8 bg-slate-950/90 border border-white/10 rounded-[2rem] backdrop-blur-2xl shadow-2xl text-white max-w-[280px]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">North Wing Focus</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">Sensors calibrated. Last automated sweep successful. No anomalies detected.</p>
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-baseline">
                <div className="flex flex-col">
                  <span className="text-3xl font-black italic">92%</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cleared</span>
                </div>
                <button className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Explore Zone</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
        <div className="bg-slate-950 rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl transition-all group-hover:bg-secondary/30" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-[1.25rem] bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-lg">
              <Shield className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-headline font-black text-2xl text-white tracking-tight mb-2">System Authority</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-8">Sentinel Protocol v4.2</p>
            
            <div className="w-full space-y-3">
              <button className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all">
                Run Integrity Check
              </button>
              <button className="w-full py-5 bg-error text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-error/30 hover:brightness-110 active:scale-95 transition-all">
                Emergency Broadcast
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col h-[500px] overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Activity</h3>
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Live Feed</span>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {[
              { t: '12:44:02', title: 'Batch Inbound: 45 Guests', sub: 'North Gate Hub', status: 'normal', icon: Users },
              { t: '12:38:15', title: 'Sensor Latency Detected', sub: 'South Wing Exit B', status: 'warning', icon: Activity },
              { t: '12:15:00', title: 'Roster Sync Complete', sub: 'Automated Task', status: 'success', icon: CheckCircle },
              { t: '11:55:20', title: 'Zone Cleared: Pool Side', sub: 'Manual Patrol', status: 'success', icon: Shield },
              { t: '11:30:10', title: 'Hardware Self-Test', sub: 'Routine Check', status: 'normal', icon: Settings },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 hover:bg-slate-50 transition-all rounded-[1.5rem] group cursor-pointer">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                  item.status === 'warning' ? "bg-secondary/10 text-secondary" :
                  item.status === 'success' ? "bg-emerald-500/10 text-emerald-600" :
                  "bg-slate-100 text-slate-500"
                )}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
                    <span className="font-mono text-[9px] text-slate-400 font-bold">{item.t}</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface border-t border-slate-100 hover:bg-slate-50 transition-colors">
            Access Transaction Logs
          </button>
        </div>
      </div>
    </div>
  </div>
);

const GuestGuide = ({ onBack }: { onBack: () => void }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-sm mx-auto">
    <div className="w-full space-y-12">
      <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 hover:text-on-surface transition-colors">
        <ChevronRight className="w-4 h-4 rotate-180" /> Back to Hub
      </button>
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-3xl bg-error/10 text-error mb-2 animate-pulse">
           <AlertTriangle className="w-12 h-12" />
        </div>
        <h2 className="text-6xl font-headline font-black text-error tracking-tighter italic">Turn left</h2>
        <p className="text-2xl font-headline font-bold text-secondary tracking-tight">in 15 feet</p>
      </div>

      <div className="bg-surface-container-low p-2 rounded-[2.5rem] shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center text-on-surface text-[10px] font-black uppercase tracking-[0.2em]">
          <span>Evacuation Route</span>
          <span className="px-2 py-0.5 bg-tertiary-fixed-dim/20 text-on-tertiary-container rounded">Active</span>
        </div>
        <div className="space-y-2">
          {[
            { id: 1, title: 'Exit room', sub: 'Move quickly but calmly towards hall.', done: true },
            { id: 2, title: 'Proceed 15 feet', sub: 'Follow the wall to your left.', active: true },
            { id: 3, title: 'Continue straight', sub: 'Head towards primary stairwell.', pending: true },
          ].map((step) => (
            <div key={step.id} className={cn(
              "p-6 rounded-[2rem] flex gap-5 items-start transition-all relative overflow-hidden",
              step.active ? "bg-white shadow-xl border border-outline-variant/20" : 
              step.pending ? "opacity-40" : "opacity-80 scale-95 origin-left"
            )}>
              {step.active && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error" />}
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-headline font-black text-lg shadow-inner",
                step.active ? "bg-error text-white" : "bg-slate-200 text-slate-500"
              )}>
                {step.id}
              </div>
              <div className="flex-1">
                <h3 className={cn("font-bold text-base", step.active ? "text-error" : "text-on-surface")}>{step.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">{step.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-6 bg-tertiary-container text-on-tertiary-container rounded-[2rem] font-headline font-black text-2xl tracking-tighter italic shadow-[0_12px_40px_rgba(0,33,19,0.15)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4">
        <CheckCircle className="w-8 h-8" />
        I AM SAFE
      </button>

      <div className="flex justify-around items-center pt-8">
        <button className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-all group">
          <MapIcon className="w-6 h-6 group-hover:text-secondary group-hover:scale-110 transition-all" />
          <span className="text-[10px] font-black uppercase tracking-widest">Map</span>
        </button>
        <button className="flex flex-col items-center gap-2 text-error group">
           <AlertTriangle className="w-6 h-6 group-hover:scale-110 transition-all" />
           <span className="text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Emergency</span>
        </button>
        <button className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-all group">
          <HelpCircle className="w-6 h-6 group-hover:text-secondary group-hover:scale-110 transition-all" />
          <span className="text-[10px] font-black uppercase tracking-widest">SOS Help</span>
        </button>
      </div>
    </div>
  </div>
);

const VisualPitch = ({ onComplete }: { onComplete: () => void; key?: string }) => {
  const [scene, setScene] = useState<Scene>('problem');

  // Sequence simulation
  useEffect(() => {
    const timer1 = setTimeout(() => setScene('activation'), SCENE_DURATION.problem);
    const timer2 = setTimeout(() => setScene('pillars'), SCENE_DURATION.problem + SCENE_DURATION.activation);
    const timer3 = setTimeout(() => setScene('outcome'), SCENE_DURATION.problem + SCENE_DURATION.activation + SCENE_DURATION.pillars);
    const timer4 = setTimeout(() => setScene('gcp'), SCENE_DURATION.problem + SCENE_DURATION.activation + SCENE_DURATION.pillars + SCENE_DURATION.outcome);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
      {/* Immersive background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(0,212,255,0.1)_0%,_transparent_70%)] pointer-events-none" />

      <AnimatePresence mode="wait">
        {(scene === 'problem' || scene === 'activation') && (
          <motion.div 
            key="floorplan" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="w-full max-w-5xl flex flex-col gap-12"
          >
            <div className="aspect-video rounded-[3rem] bg-slate-100 border border-slate-200 shadow-2xl overflow-hidden relative group">
              <img src="https://picsum.photos/seed/evacuation/1200/800?grayscale" className="w-full h-full object-cover opacity-10 mix-blend-multiply" referrerPolicy="no-referrer" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-2/3 h-2/3">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-[0.05] pointer-events-none">
                    {Array.from({ length: 144 }).map((_, i) => <div key={i} className="border border-slate-900" />)}
                  </div>
                  
                  {/* Room Nodes */}
                  <motion.div 
                    layoutId="node-412"
                    initial={{ scale: 1 }}
                    animate={scene === 'problem' ? { scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={cn(
                      "absolute top-1/3 left-1/2 w-32 h-20 rounded-xl flex items-center justify-center font-black text-xl italic transition-colors shadow-2xl",
                      scene === 'problem' ? "bg-error text-white" : "bg-emerald-500 text-white"
                    )}
                  >
                    412
                  </motion.div>
                </div>
              </div>

              <div className="absolute top-12 left-12">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl">
                   {scene === 'problem' ? "CRITICAL ALERT DETECTED" : "NEXUS RESPONSE ACTIVE"}
                </div>
              </div>
            </div>

            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-6xl font-headline font-black tracking-tighter text-on-surface italic uppercase">
                {scene === 'problem' ? "Chaos by Design." : "Intelligent Safety."}
              </h2>
              <p className="text-xl text-on-surface-variant font-medium leading-relaxed">
                {scene === 'problem' 
                  ? "Standard systems offer noise, not directions. Seconds cost lives."
                  : "A neural safety mesh powered by Google Cloud Platform, guiding every guest individually."}
              </p>
            </div>
          </motion.div>
        )}

        {scene === 'pillars' && (
          <motion.div 
            key="pillars" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { t: 'Smart Detection', d: 'Cloud Pub/Sub ingests thousands of sensor events per second.', i: Eye, c: 'text-secondary bg-secondary/10' },
              { t: 'Contextual Alerting', d: 'Room-specific messaging via FCM replaces generic sirens.', i: Bell, c: 'text-amber-600 bg-amber-100' },
              { t: 'Adaptive Wayfinding', d: 'Vertex AI recalculates optimal paths as hazards shift.', i: Navigation, c: 'text-blue-600 bg-blue-100' },
              { t: 'Rescue Intelligence', d: 'Real-time responder HUD with room-level occupancy.', i: Users, c: 'text-emerald-700 bg-emerald-100' },
            ].map((p, i) => (
              <motion.div 
                key={p.t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white shadow-xl flex flex-col gap-6 group hover:scale-[1.02] transition-transform cursor-default"
              >
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center", p.c)}>
                  <p.i className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-headline font-black text-on-surface tracking-tight leading-tight">{p.t}</h3>
                  <p className="text-sm text-on-surface-variant font-medium leading-relaxed">{p.d}</p>
                </div>
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-end">
                   <div className="w-8 h-1 bg-slate-200 rounded-full group-hover:bg-secondary group-hover:w-full transition-all duration-500" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {scene === 'outcome' && (
          <motion.div 
            key="outcome" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
            className="w-full max-w-6xl flex flex-col gap-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Traditional System</span>
                <div className="aspect-[16/10] rounded-[3rem] bg-slate-900 overflow-hidden relative group">
                   <img src="https://picsum.photos/seed/legacy/1200/800?grayscale" className="w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
                   <div className="absolute inset-0 flex items-center justify-center text-error font-headline font-black text-4xl italic uppercase tracking-[0.2em] -rotate-12 border-4 border-error/30 m-12 rounded-[2rem]">Static Noise</div>
                </div>
                <p className="text-lg font-bold text-on-surface-variant italic">"Everyone runs. Nobody knows why."</p>
              </div>
              <div className="space-y-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">NexusResponse</span>
                <div className="aspect-[16/10] rounded-[3rem] bg-secondary-container overflow-hidden relative shadow-2xl group">
                   <img src="https://picsum.photos/seed/future/1200/800" className="w-full h-full object-cover opacity-40 mix-blend-overlay" referrerPolicy="no-referrer" />
                   <div className="absolute inset-0 flex items-center justify-center text-white font-headline font-black text-4xl italic uppercase tracking-[0.2em] -rotate-6">Precision Ops</div>
                </div>
                <p className="text-lg font-bold text-on-surface font-headline italic">"Every second is accounted for. Optimized for life."</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center pb-20">
               {[ {v: '50%', l: 'Reduction in Search Time'}, {v: '100Ms', l: 'Event Processing Latency'}, {v: 'ENTERPRISE', l: 'Built for Scale'} ].map(s => (
                 <div key={s.l} className="space-y-1">
                   <p className="text-6xl font-headline font-black text-on-surface italic tracking-tighter">{s.v}</p>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">{s.l}</p>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {scene === 'gcp' && (
          <motion.div 
             key="gcp" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="w-full max-w-4xl flex flex-col items-center gap-16 text-center"
          >
            <div className="space-y-6">
              <h2 className="text-7xl font-headline font-black tracking-tight text-on-surface">Built on <span className="text-secondary italic">Google Cloud.</span></h2>
              <p className="text-xl text-on-surface-variant font-medium max-w-2xl mx-auto">Scales from 20 rooms to 2,000. Enterprise-grade security meets real-time AI logic at the edge.</p>
            </div>
            
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { n: 'Pub/Sub', i: Activity, l: 'Event Bus' },
                 { n: 'Vertex AI', i: Cpu, l: 'Logic Engine' },
                 { n: 'Firebase', i: Zap, l: 'Realtime Data' },
                 { n: 'Maps JS', i: MapIcon, l: 'Spatial Viz' },
               ].map((svc, i) => (
                 <motion.div 
                   key={svc.n} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                   className="group p-8 rounded-[2.5rem] bg-white border border-slate-50 shadow-lg hover:shadow-2xl hover:bg-slate-50 transition-all flex flex-col items-center gap-6"
                 >
                    <div className="w-20 h-20 rounded-[1.75rem] bg-slate-900 flex items-center justify-center text-white group-hover:bg-secondary group-hover:scale-110 transition-all shadow-xl">
                      <svc.i className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black text-on-surface tracking-tight">{svc.n}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{svc.l}</p>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="flex gap-4">
               <button onClick={onComplete} className="px-10 py-5 bg-on-surface text-surface rounded-[1.75rem] font-headline font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all">Enter Dashboard</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [view, setView] = useState<View>('pitch');
  const [adminView, setAdminView] = useState<AdminSubView>('dashboard');
  const [guestView, setGuestView] = useState<GuestSubView>('checkin');

  return (
    <div className="min-h-screen bg-surface selection:bg-secondary-container transition-all duration-500 overflow-x-hidden">
      {view !== 'pitch' && (
        <Sidebar 
          currentView={view} 
          currentSubView={adminView}
          setView={setView} 
          setSubView={setAdminView}
        />
      )}
      
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-700 ease-in-out relative",
        view === 'pitch' ? "ml-0" : "md:ml-72"
      )}>
        <TopBar 
          title={view === 'pitch' ? "NexusResponse • Pitch Deck" : view === 'admin' ? `Sentinel Admin • ${adminView.charAt(0).toUpperCase() + adminView.slice(1)}` : "Sentinel Guest Hub"} 
          view={view} 
          setView={setView} 
        />
        
        <main className={cn(
          "flex-1 flex flex-col pt-16 relative",
          view !== 'pitch' && "p-12 max-w-7xl mx-auto w-full"
        )}>
          <AnimatePresence mode="wait">
            {view === 'pitch' && <VisualPitch key="pitch" onComplete={() => setView('admin')} />}
            
            {view === 'admin' && (
              <motion.div key={adminView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
                {adminView === 'dashboard' && <AdminDashboard />}
                {adminView === 'incidents' && <AdminIncidents />}
                {adminView === 'units' && <AdminUnits />}
                {adminView === 'map' && <div className="h-[600px] w-full bg-slate-100 rounded-[3rem] items-center justify-center flex font-black text-slate-300 italic uppercase">Spatial Map Engine</div>}
                {adminView === 'logs' && <div className="h-[600px] w-full bg-slate-100 rounded-[3rem] items-center justify-center flex font-black text-slate-300 italic uppercase">System Transaction Logs</div>}
              </motion.div>
            )}

            {view === 'guide' && (
              <motion.div key={guestView} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col">
                {guestView === 'checkin' && <GuestCheckIn onLogin={() => setGuestView('dashboard')} />}
                {guestView === 'dashboard' && <GuestDashboard setSubView={setGuestView} />}
                {guestView === 'instructions' && <GuestGuide onBack={() => setGuestView('dashboard')} />}
                {guestView === 'map' && (
                   <div className="flex-1 flex flex-col gap-8 items-center justify-center">
                      <button onClick={() => setGuestView('dashboard')} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back to Hub</button>
                      <div className="h-64 w-full bg-slate-100 rounded-[2.5rem] flex items-center justify-center font-black text-slate-300 italic uppercase">Guest Map View</div>
                   </div>
                )}
                {guestView === 'sos' && (
                   <div className="flex-1 flex flex-col gap-12 items-center justify-center">
                      <button onClick={() => setGuestView('dashboard')} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back to Hub</button>
                      <div className="relative">
                        <div className="absolute inset-0 bg-error/20 rounded-full animate-ping" />
                        <button className="relative w-40 h-40 bg-error rounded-full flex flex-col items-center justify-center text-white shadow-2xl shadow-error/40 font-black italic text-4xl">SOS</button>
                      </div>
                      <p className="font-bold text-on-surface-variant text-center max-w-xs">Connecting to Sentinel Security Hub... <br/>Stay calm, help is aware of your location.</p>
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className={cn(
          "py-8 border-t border-outline-variant/10 flex justify-between items-center bg-slate-50/50 backdrop-blur-md transition-all",
          view === 'pitch' ? "px-12" : "px-12"
        )}>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> SYSTEM SECURED • ACTIVE
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] border-l border-outline-variant/30 pl-6">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> AI CORE: ANALYZING
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">© 2026 NexusResponse Hub • Google Cloud Partner <br/><span className="text-[8px] opacity-60">Authorized Personnel Only</span></p>
        </footer>
      </div>

      {/* Global Style Inject for Layout Spacing */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(11, 28, 48, 0.1); 
          border-radius: 4px; 
        }
        ::selection {
          background-color: #ffdbca;
          color: #341100;
        }
      `}</style>
    </div>
  );
}
