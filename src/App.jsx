import { useState, useRef, useEffect } from "react"
import {
  LayoutDashboard, Film, Send, BarChart2, BookOpen,
  Plus, Search, Bell, Play, Upload, Calendar, Clock,
  Star, Filter, TrendingUp, Users, Eye, Heart,
  Scissors, Globe, ChevronRight, ArrowUpRight,
  CheckCircle, Zap, Target, DollarSign, Activity,
  ChevronDown, Video, Tag, Camera, Mic, FileText,
  AlertCircle, Settings, Sparkles, Layers, Share2,
  X, Download, ExternalLink, Link, Smartphone,
  Building2, ChevronLeft, Inbox, MapPin, MessageSquare,
  Briefcase, Copy
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  bg:           '#0b0f1a',
  sidebar:      '#0d1220',
  surface:      '#131a2a',
  surfaceHover: '#192133',
  border:       '#1e2d42',
  borderLight:  '#253650',
  accent:       '#6366f1',
  accentHover:  '#5254d6',
  accentGlow:   'rgba(99,102,241,0.15)',
  accentLight:  '#818cf8',
  green:        '#10b981',
  greenGlow:    'rgba(16,185,129,0.15)',
  amber:        '#f59e0b',
  red:          '#ef4444',
  purple:       '#8b5cf6',
  cyan:         '#06b6d4',
  pink:         '#ec4899',
  t1:           '#f1f5f9',
  t2:           '#94a3b8',
  t3:           '#4b5f7a',
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const productionData = [
  { month: 'Oct', videos: 8 },
  { month: 'Nov', videos: 11 },
  { month: 'Dec', videos: 7 },
  { month: 'Jan', videos: 14 },
  { month: 'Feb', videos: 18 },
  { month: 'Mar', videos: 12 },
]

const roiData = [
  { month: 'Oct', revenue: 18200, cost: 8400 },
  { month: 'Nov', revenue: 24100, cost: 9200 },
  { month: 'Dec', revenue: 15800, cost: 6800 },
  { month: 'Jan', revenue: 38400, cost: 11200 },
  { month: 'Feb', revenue: 52100, cost: 13600 },
  { month: 'Mar', revenue: 41200, cost: 10800 },
]

const finalVideos = [
  { id: 1, title: 'Dr. Sarah Chen — Cardiology Introduction', type: 'Physician Bio',      hospital: 'Mercy Central', views: 2847, tags: ['cardiology','physician-bio','service-line'],   platform: 'Website + YouTube',    date: 'Mar 15' },
  { id: 2, title: 'What to Expect: Hip Replacement Surgery',  type: 'Pre-Visit',         hospital: 'Mercy North',   views: 1923, tags: ['orthopedics','pre-visit','patient-ed'],        platform: 'Website',               date: 'Mar 12' },
  { id: 3, title: 'Understanding Heart Failure — Patient Guide', type: 'Condition Ed.',  hospital: 'Mercy South',   views: 4102, tags: ['cardiology','condition-ed','heart-health'],     platform: 'YouTube + Instagram',   date: 'Mar 8'  },
  { id: 4, title: 'Meet Your Care Team — Oncology',           type: 'Dept. Tour',        hospital: 'Mercy Central', views: 873,  tags: ['oncology','trust-building','care-team'],        platform: 'Website',               date: 'Mar 1'  },
  { id: 5, title: "Patient Story: Maria's Knee Journey",      type: 'Testimonial',       hospital: 'Mercy North',   views: 6218, tags: ['orthopedics','testimonial','conversion'],        platform: 'Facebook + Instagram',  date: 'Feb 28' },
  { id: 6, title: 'Behavioral Health: Breaking the Stigma',   type: 'Service Line Ed.',  hospital: 'Mercy South',   views: 3341, tags: ['behavioral-health','awareness','social'],        platform: 'Facebook + YouTube',    date: 'Feb 20' },
]

const brollClips = [
  { id: 1, title: 'OR prep — surgical team scrubbing in',            tags: ['surgery','OR','clinical','team'],             quality: 5, duration: '0:12', usedIn: 4  },
  { id: 2, title: 'Hallway tracking shot — hospital corridor',       tags: ['facility','any-hospital','movement'],         quality: 4, duration: '0:08', usedIn: 9  },
  { id: 3, title: 'Patient consultation — doctor and patient',       tags: ['consultation','physician','patient-interaction'], quality: 5, duration: '0:15', usedIn: 6 },
  { id: 4, title: 'Cardiac monitoring equipment close-up',           tags: ['cardiology','equipment','clinical'],          quality: 4, duration: '0:06', usedIn: 3  },
  { id: 5, title: 'Nurse checking patient chart — bedside',          tags: ['nursing','clinical','any-hospital','care'],   quality: 5, duration: '0:10', usedIn: 7  },
  { id: 6, title: 'Hospital lobby — wide establishing shot',         tags: ['facility','lobby','any-hospital','exterior'],  quality: 4, duration: '0:09', usedIn: 5  },
]

const drafts = [
  { id: 1, title: 'Heart Health Month — Dr. Martinez Intro',       type: 'Physician Bio',    hospital: 'Mercy South',   status: 'ai-processing', progress: 75, created: '2 hours ago' },
  { id: 2, title: 'CHNA Gap: Diabetes Management Program',          type: 'Service Line Ed.', hospital: 'Mercy Central', status: 'review',        progress: 90, created: 'Yesterday'   },
  { id: 3, title: 'Oncology Nurse Recruitment — Day in Life',       type: 'Recruitment',      hospital: 'All Locations', status: 'draft',         progress: 20, created: '3 days ago'  },
]

const contentGaps = [
  { type: 'Physician Bio',   area: 'Neurology',         hospital: 'Mercy North',   priority: 'high',   reason: 'No video content for 3 active providers',        impact: 'Referral conversion +12% est.' },
  { type: 'Pre-Visit',       area: 'Behavioral Health', hospital: 'Mercy South',   priority: 'high',   reason: 'No-show rate 34% vs. 12% with video in place',   impact: '$44K/yr reclaimed per clinician' },
  { type: 'Testimonial',     area: 'Orthopedics',       hospital: 'Mercy Central', priority: 'medium', reason: 'Competitors have 8+ patient stories online',      impact: 'Booking rate +8.9% est.' },
]

const scheduledContent = [
  { id: 1, title: 'Heart Health Month Recap',       platform: 'Facebook',   platformColor: '#1877F2', date: 'Apr 3',  time: '9:00 AM',  status: 'scheduled'     },
  { id: 2, title: 'Dr. Chen — 60s Highlight Clip',  platform: 'Instagram',  platformColor: '#E1306C', date: 'Apr 5',  time: '12:00 PM', status: 'scheduled'     },
  { id: 3, title: "Hip Replacement Journey — Full",  platform: 'YouTube',    platformColor: '#FF0000', date: 'Apr 7',  time: '10:00 AM', status: 'pending-review'},
  { id: 4, title: 'Breaking the Stigma — 30s Cut',  platform: 'TikTok',     platformColor: '#69C9D0', date: 'Apr 10', time: '6:00 PM',  status: 'scheduled'     },
]

const readyToPublish = [
  {
    id: 1,
    title: "Patient Story: Maria's Knee Journey — 30s Vertical Cut",
    type: 'Testimonial',
    recommended:    ['Instagram', 'Facebook Reels', 'TikTok'],
    notRecommended: ['LinkedIn', 'YouTube'],
    reason: '9:16 vertical, 30 sec, personal narrative — optimized for social engagement.',
  },
  {
    id: 2,
    title: 'Diabetes Management — Full Program Overview',
    type: 'Service Line Ed.',
    recommended:    ['YouTube', 'Website', 'LinkedIn'],
    notRecommended: ['Instagram', 'TikTok'],
    reason: '16:9, 4 min 20 sec — educational depth suits YouTube and website embeds.',
  },
]

const perVideoStats = [
  { views: 2847, ctr: '6.2%', roi: '$18.4K' },
  { views: 1923, ctr: '4.1%', roi: '$12.7K' },
  { views: 4102, ctr: '7.8%', roi: '$31.2K' },
  { views:  873, ctr: '3.3%', roi: '$6.1K'  },
  { views: 6218, ctr: '8.9%', roi: '$42.3K' },
  { views: 3341, ctr: '5.1%', roi: '$22.8K' },
]

const platformColors = {
  Facebook: '#1877F2', Instagram: '#E1306C',
  YouTube:  '#FF0000', TikTok:    '#69C9D0',
  LinkedIn: '#0077B5', Website:   '#10b981',
}

// ─── V2 Mock Data ────────────────────────────────────────────────────────────
const notifications = [
  { id: 1, type: 'review',    title: 'Video ready for review',    desc: 'CHNA Gap: Diabetes Management Program',                       time: '2 hours ago',  unread: true  },
  { id: 2, type: 'schedule',  title: 'Scheduled post tomorrow',   desc: 'Heart Health Recap → Facebook at 9:00 AM',                     time: '5 hours ago',  unread: true  },
  { id: 3, type: 'gap',       title: 'Content gap alert',         desc: 'Neurology has 0 physician bios — high priority',               time: '1 day ago',    unread: true  },
  { id: 4, type: 'csv',       title: 'Monthly CSV upload due',    desc: 'Upload de-identified patient data for March attribution',       time: '2 days ago',   unread: false },
  { id: 5, type: 'published', title: 'Video published',           desc: 'Dr. Chen Cardiology Intro is now live on YouTube',             time: '3 days ago',   unread: false },
]

const notifColors = { review: C.amber, schedule: C.green, gap: C.red, csv: C.accent, published: C.cyan }
const notifIcons = { review: Eye, schedule: Calendar, gap: AlertCircle, csv: Upload, published: CheckCircle }

const connectedPlatforms = [
  { name: 'Instagram',   connected: true,  color: '#E1306C', icon: Camera      },
  { name: 'Facebook',    connected: true,  color: '#1877F2', icon: Globe       },
  { name: 'YouTube',     connected: true,  color: '#FF0000', icon: Play        },
  { name: 'LinkedIn',    connected: false, color: '#0077B5', icon: Briefcase   },
  { name: 'TikTok',      connected: false, color: '#69C9D0', icon: Smartphone  },
  { name: 'Website CMS', connected: true,  color: '#10b981', icon: Globe       },
]

const calendarEvents = [
  { day: 3,  title: 'Heart Health Recap',          platform: 'Facebook',  color: '#1877F2' },
  { day: 5,  title: 'Dr. Chen Highlight',          platform: 'Instagram', color: '#E1306C' },
  { day: 7,  title: 'Hip Replacement Full',        platform: 'YouTube',   color: '#FF0000' },
  { day: 10, title: 'Breaking Stigma 30s',         platform: 'TikTok',    color: '#69C9D0' },
  { day: 14, title: 'Nurse Recruitment Spotlight',  platform: 'LinkedIn',  color: '#0077B5' },
  { day: 18, title: 'Diabetes Program Overview',   platform: 'Website',   color: '#10b981' },
  { day: 22, title: 'Patient Story: Maria',        platform: 'Facebook',  color: '#1877F2' },
  { day: 25, title: 'Oncology Dept Tour',          platform: 'YouTube',   color: '#FF0000' },
]

const clinicalJourney = [
  { stage: 'Awareness & Prevention',       desc: 'Health screenings, wellness content',                    videos: 8,  views: 12400, estROI: '$24.2K' },
  { stage: 'Symptom & Condition Education', desc: 'Condition explainers, what-to-watch-for',                videos: 6,  views: 9800,  estROI: '$18.7K' },
  { stage: 'Provider Search & Selection',   desc: 'Physician bios, facility tours',                        videos: 12, views: 28300, estROI: '$52.1K' },
  { stage: 'Pre-Visit Preparation',         desc: 'What to expect, prep instructions',                     videos: 5,  views: 7200,  estROI: '$31.4K' },
  { stage: 'Treatment & Procedure',         desc: 'Procedure walkthroughs, technology highlights',          videos: 4,  views: 5100,  estROI: '$15.8K' },
  { stage: 'Recovery & Follow-Up',          desc: 'Post-op care, rehab guidance',                           videos: 3,  views: 4600,  estROI: '$12.3K' },
  { stage: 'Ongoing Relationship',          desc: 'Testimonials, community content, loyalty',               videos: 10, views: 18900, estROI: '$34.7K' },
]

const talentJourney = [
  { stage: 'Recruitment & Employer Brand', desc: 'Day-in-life, culture spotlights',         videos: 4, views: 6200, estROI: '$41.2K', note: 'Cost-per-hire reduction' },
  { stage: 'Onboarding & Training',        desc: 'Orientation videos, protocol walkthroughs', videos: 3, views: 2100, estROI: '$18.5K', note: 'Training time savings'   },
  { stage: 'Retention & Internal Comms',    desc: 'Staff spotlights, leadership updates',     videos: 2, views: 1800, estROI: '$8.9K',  note: 'Turnover reduction'      },
]

const systemFeedItems = [
  { id: 1, title: 'Robotic Surgery Showcase — Da Vinci XI', hospital: 'Mercy North', type: 'Service Line Ed.', views: 3420, date: 'Mar 28', serviceLine: 'Orthopedics' },
  { id: 2, title: 'Nursing Excellence Awards 2026',          hospital: 'Mercy East',  type: 'Internal Comms',   views: 1890, date: 'Mar 25', serviceLine: 'Culture' },
  { id: 3, title: 'Stroke Warning Signs — Community PSA',    hospital: 'Mercy South', type: 'Condition Ed.',    views: 8750, date: 'Mar 20', serviceLine: 'Neurology' },
  { id: 4, title: 'New NICU Tour for Expecting Parents',     hospital: 'Mercy North', type: 'Pre-Visit',        views: 4200, date: 'Mar 18', serviceLine: 'Maternity' },
  { id: 5, title: 'Behavioral Health: Telehealth Options',   hospital: 'Mercy East',  type: 'Service Line Ed.', views: 2340, date: 'Mar 15', serviceLine: 'Behavioral Health' },
]

const hospitalColors = { 'Mercy North': C.cyan, 'Mercy East': C.purple, 'Mercy South': C.green }

const projectOutputs = [
  { format: '9:16 30s', label: 'Social Clip',     platform: 'Instagram / TikTok' },
  { format: '9:16 60s', label: 'Social Extended',  platform: 'Facebook Reels'      },
  { format: '16:9 Full', label: 'Full Cut',        platform: 'YouTube / Website'   },
  { format: 'PDF',       label: 'One-Pager',       platform: 'Email / Print'       },
]

// ─── Reusable Components ──────────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && onClick ? C.surfaceHover : C.surface,
        border: `1px solid ${hovered ? (onClick ? C.accent : C.borderLight) : C.border}`,
        borderRadius: 10,
        padding: 20,
        transition: 'all 0.2s ease',
        cursor: onClick ? 'pointer' : 'default',
        transform: hovered && onClick ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered && onClick ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const Badge = ({ children, color = C.accent, style = {} }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center',
    padding: '2px 9px', borderRadius: 20,
    fontSize: 11, fontWeight: 600,
    background: `${color}22`, color,
    ...style,
  }}>
    {children}
  </span>
)

const StatCard = ({ label, value, sub, color = C.t1, icon: Icon }) => (
  <Card style={{ padding: '18px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ fontSize: 11, color: C.t2, marginBottom: 6, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: C.t3, marginTop: 6 }}>{sub}</div>}
      </div>
      {Icon && (
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
      )}
    </div>
  </Card>
)

const Pill = ({ active, children, onClick, color = C.accent }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '5px 14px', borderRadius: 20,
        border: `1px solid ${active ? color : hovered ? C.borderLight : C.border}`,
        background: active ? `${color}20` : hovered ? `${C.t3}12` : 'transparent',
        color: active ? color : hovered ? C.t1 : C.t3,
        cursor: 'pointer', fontSize: 12,
        fontWeight: active ? 600 : 400,
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  )
}

const TabBar = ({ tabs, active, onChange }) => (
  <div style={{ display: 'flex', gap: 2, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 4, width: 'fit-content' }}>
    {tabs.map(t => (
      <button
        key={t.id}
        onClick={() => onChange(t.id)}
        style={{
          padding: '6px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: active === t.id ? 600 : 400,
          background: active === t.id ? C.accent : 'transparent',
          color: active === t.id ? 'white' : C.t2,
          transition: 'all 0.1s',
        }}
      >
        {t.label}
      </button>
    ))}
  </div>
)

const VideoThumbnail = ({ aspectRatio = '16/9', size = 28 }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', aspectRatio,
        background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', cursor: 'pointer', borderBottom: `1px solid ${C.border}`,
      }}
    >
      <Video size={size} color={C.t3} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(99,102,241,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered ? 1 : 0, transition: 'opacity 0.2s',
      }}>
        <Play size={18} color="white" />
      </div>
    </div>
  )
}

// ─── Modal Overlay ───────────────────────────────────────────────────────────
const ModalOverlay = ({ children, onClose, width = 500 }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        width, maxHeight: '85vh', overflowY: 'auto',
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 28,
      }}
    >
      {children}
    </div>
  </div>
)

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'creation',     label: 'Creation',     icon: Film            },
  { id: 'distribution', label: 'Distribution', icon: Send            },
  { id: 'results',      label: 'Results & ROI',icon: BarChart2       },
  { id: 'library',      label: 'Library',      icon: BookOpen        },
]

const NavItem = ({ item, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 8, border: 'none',
        background: isActive ? C.accentGlow : hovered ? `${C.t3}15` : 'transparent',
        color: isActive ? C.accent : hovered ? C.t1 : C.t2,
        cursor: 'pointer', marginBottom: 2,
        fontWeight: isActive ? 600 : 400, fontSize: 14, textAlign: 'left',
        transition: 'all 0.15s ease',
      }}
    >
      <item.icon size={16} />
      {item.label}
    </button>
  )
}

const Sidebar = ({ active, onNav }) => (
  <div style={{
    width: 240, minWidth: 240,
    background: C.sidebar,
    borderRight: `1px solid ${C.border}`,
    display: 'flex', flexDirection: 'column',
    height: '100vh',
  }}>
    {/* Logo */}
    <div style={{ padding: '20px 20px 20px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, background: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 15, color: 'white', letterSpacing: '-0.03em',
        }}>C</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.t1, letterSpacing: '-0.01em' }}>Cyrano</div>
          <div style={{ fontSize: 11, color: C.t3 }}>MarOps Platform</div>
        </div>
      </div>
    </div>

    {/* Org Switcher */}
    <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}` }}>
      <button style={{
        width: '100%', background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 8, padding: '8px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', color: C.t1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 5, background: C.green,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'white',
          }}>M</div>
          <span style={{ fontSize: 13, fontWeight: 500 }}>Mercy Health System</span>
        </div>
        <ChevronDown size={13} color={C.t3} />
      </button>
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, padding: '12px 10px 0' }}>
      {navItems.map(item => (
        <NavItem key={item.id} item={item} isActive={active === item.id} onClick={() => onNav(item.id)} />
      ))}
    </nav>

    {/* User */}
    <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', background: C.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
        }}>JR</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.t1 }}>Jamie Rivera</div>
          <div style={{ fontSize: 11, color: C.t3 }}>Marketing Director</div>
        </div>
        <Settings size={14} color={C.t3} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  </div>
)

// ─── Top Bar ──────────────────────────────────────────────────────────────────
const sectionMeta = {
  dashboard:    { title: 'Dashboard',     sub: 'Content program overview'             },
  creation:     { title: 'Creation',      sub: 'AI-assisted video production'         },
  distribution: { title: 'Distribution',  sub: 'Schedule & publish across platforms'  },
  results:      { title: 'Results & ROI', sub: 'Performance & attribution'            },
  library:      { title: 'Library',       sub: 'Final videos, b-roll, and assets'     },
}

const TopBar = ({ section, showNotifs, setShowNotifs }) => {
  const meta = sectionMeta[section] || {}
  const bellRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (
        showNotifs &&
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        bellRef.current && !bellRef.current.contains(e.target)
      ) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showNotifs, setShowNotifs])

  return (
    <div style={{
      height: 58, display: 'flex', alignItems: 'center',
      padding: '0 24px', borderBottom: `1px solid ${C.border}`, gap: 16,
      background: C.bg,
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: C.t1 }}>{meta.title}</span>
        <ChevronRight size={13} color={C.t3} />
        <span style={{ fontSize: 13, color: C.t3 }}>{meta.sub}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 8, padding: '6px 12px', fontSize: 13, color: C.t3,
          width: 220,
        }}>
          <Search size={13} />
          <span>Search…</span>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            ref={bellRef}
            onClick={() => setShowNotifs(!showNotifs)}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: C.t2 }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: -2, right: -2,
              width: 8, height: 8, borderRadius: '50%', background: C.amber,
            }} />
          </button>

          {showNotifs && (
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute', right: 0, top: 42, width: 350,
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                zIndex: 100, overflow: 'hidden',
              }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>Notifications</span>
                <button style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  Mark all read
                </button>
              </div>
              <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                {notifications.map(n => {
                  const NIcon = notifIcons[n.type] || Bell
                  return (
                    <div
                      key={n.id}
                      style={{
                        padding: '12px 16px', borderBottom: `1px solid ${C.border}`,
                        borderLeft: `3px solid ${notifColors[n.type]}`,
                        background: n.unread ? `${notifColors[n.type]}08` : 'transparent',
                        cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = `${notifColors[n.type]}14`}
                      onMouseLeave={e => e.currentTarget.style.background = n.unread ? `${notifColors[n.type]}08` : 'transparent'}
                    >
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: `${notifColors[n.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <NIcon size={13} color={notifColors[n.type]} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 13, fontWeight: n.unread ? 600 : 400, color: C.t1 }}>{n.title}</span>
                          {n.unread && <span style={{ width: 6, height: 6, borderRadius: '50%', background: notifColors[n.type], flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: 12, color: C.t2, marginBottom: 3 }}>{n.desc}</div>
                        <div style={{ fontSize: 11, color: C.t3 }}>{n.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
const DashboardView = ({ onNavigate }) => (
  <div style={{ maxWidth: 1160 }}>

    {/* Welcome */}
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: C.t1, margin: 0 }}>Good morning, Jamie 👋</h2>
      <p style={{ fontSize: 14, color: C.t2, margin: '4px 0 0' }}>Content program overview — March 2026</p>
    </div>

    {/* KPI row */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      <StatCard label="Videos Published"  value="48"     sub="↑ 6 vs. last month"   color={C.accent} icon={Video}       />
      <StatCard label="Scheduled Posts"   value="12"     sub="Next: Apr 3"           color={C.green}  icon={Calendar}    />
      <StatCard label="Est. ROI Impact"   value="$189K"  sub="YTD attribution"       color={C.amber}  icon={DollarSign}  />
      <StatCard label="Content Gaps"      value="3"      sub="High priority action"  color={C.red}    icon={AlertCircle} />
    </div>

    {/* Charts */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 2 }}>Video Production</div>
        <div style={{ fontSize: 12, color: C.t3, marginBottom: 16 }}>Monthly output — last 6 months</div>
        <ResponsiveContainer width="100%" height={155}>
          <AreaChart data={productionData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="vidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.accent} stopOpacity={0.35} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: C.t3, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.t3, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.t1, fontSize: 12 }} />
            <Area type="monotone" dataKey="videos" stroke={C.accent} fill="url(#vidGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 2 }}>Revenue Attribution vs. Cost</div>
        <div style={{ fontSize: 12, color: C.t3, marginBottom: 16 }}>Estimated impact vs. production spend</div>
        <ResponsiveContainer width="100%" height={155}>
          <BarChart data={roiData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <XAxis dataKey="month" tick={{ fill: C.t3, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.t3, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.t1, fontSize: 12 }} formatter={v => `$${v.toLocaleString()}`} />
            <Bar dataKey="revenue" fill={C.green}  radius={[3,3,0,0]} name="Est. Revenue" />
            <Bar dataKey="cost"    fill={C.border} radius={[3,3,0,0]} name="Video Cost"   />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>

    {/* Content Gaps + In Progress */}
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>

      {/* Gaps */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>AI Content Recommendations</div>
            <div style={{ fontSize: 12, color: C.t3 }}>Care journey gaps across your system</div>
          </div>
          <Badge color={C.amber}>3 High Priority</Badge>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {contentGaps.map((gap, i) => (
            <div key={i} style={{
              padding: 14, borderRadius: 8, background: C.bg,
              border: `1px solid ${gap.priority === 'high' ? `${C.amber}45` : C.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{gap.type}</span>
                  <Badge color={gap.priority === 'high' ? C.amber : C.t3}>{gap.area}</Badge>
                </div>
                <button onClick={() => {}} style={{ fontSize: 12, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Create →
                </button>
              </div>
              <div style={{ fontSize: 12, color: C.t2, marginBottom: 4 }}>{gap.reason}</div>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 500 }}>💡 {gap.impact}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* In Progress */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 2 }}>In Progress</div>
        <div style={{ fontSize: 12, color: C.t3, marginBottom: 16 }}>Active drafts & AI processing</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {drafts.map((d, i) => (
            <div key={i} style={{ padding: 12, borderRadius: 8, background: C.bg, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.t1, marginBottom: 6, lineHeight: 1.4 }}>{d.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <Badge color={C.accent}>{d.type}</Badge>
                <span style={{ fontSize: 11, color: C.t3 }}>{d.created}</span>
              </div>
              <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${d.progress}%`, borderRadius: 2,
                  background: d.status === 'ai-processing' ? C.accent : d.status === 'review' ? C.amber : C.t3,
                }} />
              </div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 5 }}>
                {d.status === 'ai-processing' ? '⚡ AI Processing' : d.status === 'review' ? '👁 Ready for Review' : '✏ Draft'} · {d.progress}%
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  </div>
)

// ─── Creation — extra mock data ──────────────────────────────────────────────
const projectGroups = {
  review: [
    { id: 2, title: 'CHNA Gap: Diabetes Management Program', type: 'Service Line Ed.', hospital: 'Mercy Central', status: 'review',         progress: 90, submitted: 'Mar 28', due: 'Apr 4',  editor: 'CS Team',          revisions: 1,
      outputs: [
        { format: '9:16 30s', label: 'Social Clip',    platform: 'Instagram / TikTok', status: 'ready'     },
        { format: '9:16 60s', label: 'Social Extended', platform: 'Facebook Reels',     status: 'ready'     },
        { format: '16:9 Full', label: 'Full Cut',       platform: 'YouTube / Website',  status: 'rendering' },
        { format: 'PDF',       label: 'One-Pager',      platform: 'Email / Print',      status: 'ready'     },
      ],
    },
  ],
  production: [
    { id: 1, title: 'Heart Health Month — Dr. Martinez Intro', type: 'Physician Bio',  hospital: 'Mercy South',   status: 'ai-processing', progress: 75, submitted: 'Mar 30', due: 'Apr 6',  editor: 'AI → Editor Queue', revisions: 0,
      outputs: [
        { format: '9:16 30s', label: 'Social Clip',    platform: 'Instagram / TikTok', status: 'pending'   },
        { format: '9:16 60s', label: 'Social Extended', platform: 'Facebook Reels',     status: 'pending'   },
        { format: '16:9 Full', label: 'Full Cut',       platform: 'YouTube / Website',  status: 'rendering' },
        { format: 'PDF',       label: 'One-Pager',      platform: 'Email / Print',      status: 'pending'   },
      ],
    },
    { id: 4, title: 'Behavioral Health: Staff Spotlight',       type: 'Recruitment',    hospital: 'All Locations', status: 'editing',       progress: 50, submitted: 'Mar 25', due: 'Apr 8',  editor: 'Editing Team',      revisions: 1,
      outputs: [
        { format: '9:16 30s', label: 'Social Clip',    platform: 'Instagram / TikTok', status: 'rendering' },
        { format: '9:16 60s', label: 'Social Extended', platform: 'Facebook Reels',     status: 'pending'   },
        { format: '16:9 Full', label: 'Full Cut',       platform: 'YouTube / Website',  status: 'rendering' },
        { format: 'PDF',       label: 'One-Pager',      platform: 'Email / Print',      status: 'pending'   },
      ],
    },
  ],
  draft: [
    { id: 3, title: 'Oncology Nurse Recruitment — Day in Life', type: 'Recruitment',   hospital: 'All Locations', status: 'draft',         progress: 20, submitted: null,      due: null,     editor: null,               revisions: 0,
      outputs: [
        { format: '9:16 30s', label: 'Social Clip',    platform: 'Instagram / TikTok', status: 'pending' },
        { format: '9:16 60s', label: 'Social Extended', platform: 'Facebook Reels',     status: 'pending' },
        { format: '16:9 Full', label: 'Full Cut',       platform: 'YouTube / Website',  status: 'pending' },
        { format: 'PDF',       label: 'One-Pager',      platform: 'Email / Print',      status: 'pending' },
      ],
    },
  ],
}

const storyboardScenes = [
  { id: 1, section: 'Introduction',   label: 'Scene 1 · INTRO',           type: 'Existing Footage', desc: 'Hospital intro graphic + Mercy Central branding overlay',              duration: '0:08', done: true  },
  { id: 2, section: 'Introduction',   label: 'Scene 2 · Subject Intro',    type: 'Recording Task',   desc: 'Name, title, how long at Mercy Central. Keep under 45 seconds.',        duration: '0:45', done: true  },
  { id: 3, section: 'Core Message',   label: 'Scene 3 · Why Cardiology?',  type: 'Recording Task',   desc: "What drew you to this specialty? Personal story — conversational tone.", duration: '1:20', done: true  },
  { id: 4, section: 'Core Message',   label: 'Scene 4 · Patient Impact',   type: 'Recording Task',   desc: 'Describe a patient outcome that stayed with you. Emotional beat.',        duration: '1:15', done: true  },
  { id: 5, section: 'Core Message',   label: 'Scene 5 · B-Roll Insert',    type: 'B-Roll',           desc: 'Cardiac monitoring / OR prep footage from b-roll library.',              duration: '0:12', done: false },
  { id: 6, section: 'Call to Action', label: 'Scene 6 · Book an Appt.',    type: 'Recording Task',   desc: 'Direct address to viewer: how to reach the Cardiology practice.',        duration: '0:30', done: true  },
]

const projectComments = [
  { id: 1, author: 'Cyrano Editor',   initials: 'CV', time: '04/01/26 · 2:25 AM', text: 'Scene 5 b-roll pulled from the cardiac library. Waiting on brand confirmation before final render.',    resolved: false, isInternal: true  },
  { id: 2, author: 'JC Spears',       initials: 'JC', time: '03/30/26 · 1:59 PM', text: '00:02:53 — Lighting in Scene 3 feels inconsistent. Reviewing original footage before sign-off.',       resolved: false, isInternal: false },
  { id: 3, author: 'Cyrano Editor',   initials: 'CV', time: '02/03/26 · 6:50 AM', text: '00:00:00 — Camera 2 not fully recording on take 1. Main camera used for full Scene 2 sequence.',       resolved: true,  isInternal: true  },
]

const statusConfig = {
  review:          { label: 'Ready for Review',  color: C.amber,  bg: `${C.amber}15`,    border: `${C.amber}45`  },
  'ai-processing': { label: 'AI Processing',     color: C.accent, bg: C.accentGlow,       border: `${C.accent}45` },
  editing:         { label: 'With Editing Team', color: C.cyan,   bg: `${C.cyan}15`,      border: `${C.cyan}35`   },
  draft:           { label: 'Draft',             color: C.t3,     bg: 'transparent',      border: C.border        },
}

const outputStatusConfig = {
  ready:     { label: 'Ready',     color: C.green  },
  rendering: { label: 'Rendering', color: C.cyan   },
  pending:   { label: 'Pending',   color: C.t3     },
}

// ─── Creation ─────────────────────────────────────────────────────────────────
const CreationView = ({ tab, onTabChange }) => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [newStep, setNewStep] = useState(1)

  if (selectedProject) {
    return <ProjectDetailView project={selectedProject} onBack={() => setSelectedProject(null)} />
  }

  return (
    <div style={{ maxWidth: 1160 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <TabBar
          tabs={[
            { id: 'projects', label: 'Projects'    },
            { id: 'new',      label: 'New Request' },
          ]}
          active={tab}
          onChange={t => { onTabChange(t); setNewStep(1) }}
        />
        <button
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.accent, color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
          onClick={() => { onTabChange('new'); setNewStep(1) }}
        >
          <Plus size={15} /> New Request
        </button>
      </div>
      {tab === 'projects' && <ProjectsTab onSelect={setSelectedProject} />}
      {tab === 'new'      && <NewProjectTab step={newStep} onStepChange={setNewStep} />}
    </div>
  )
}

const ProjectCard = ({ project, onSelect }) => {
  const sc = statusConfig[project.status] || statusConfig.draft
  return (
    <Card onClick={() => onSelect(project)} style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 80, height: 52, borderRadius: 7, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}`, flexShrink: 0 }}>
          <Video size={20} color={C.t3} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Badge color={C.accent}>{project.type}</Badge>
            <span style={{ fontSize: 12, color: C.t3 }}>{project.hospital}</span>
            {project.revisions > 0 && <Badge color={C.red}>{project.revisions} revision{project.revisions > 1 ? 's' : ''}</Badge>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ flex: 1, height: 3, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${project.progress}%`, background: sc.color, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: C.t3, minWidth: 28 }}>{project.progress}%</span>
          </div>
          {/* Output format pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {project.outputs.map((o, i) => {
              const osc = outputStatusConfig[o.status] || outputStatusConfig.pending
              return (
                <span key={i} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 12, background: `${osc.color}18`, color: osc.color, fontWeight: 600 }}>
                  {o.format}
                </span>
              )
            })}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 600, border: `1px solid ${sc.border}` }}>{sc.label}</span>
          <div style={{ fontSize: 11, color: C.t3 }}>{project.due ? `Due ${project.due}` : 'No due date'}</div>
          {project.status === 'review' && (
            <button
              onClick={e => { e.stopPropagation(); onSelect(project) }}
              style={{ background: C.amber, color: 'white', border: 'none', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 12 }}
            >
              Review Now →
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}

const ProjectGroupSection = ({ title, count, color, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 24 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 12px', width: '100%', textAlign: 'left' }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
        <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 20, background: `${color}20`, color, fontWeight: 700 }}>{count}</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <ChevronDown size={13} color={C.t3} style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
      </button>
      {open && <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>}
    </div>
  )
}

const ProjectsTab = ({ onSelect }) => (
  <div>
    {/* Summary bar */}
    <div style={{ display: 'flex', gap: 20, marginBottom: 24, padding: '12px 18px', background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, alignItems: 'center' }}>
      {[
        { label: 'Ready for Review', count: 1, color: C.amber  },
        { label: 'In Production',    count: 2, color: C.accent },
        { label: 'Drafts',           count: 1, color: C.t3     },
        { label: 'This Month',       count: 4, color: C.green  },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {i > 0 && <div style={{ width: 1, height: 20, background: C.border }} />}
          <span style={{ fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: '-0.02em' }}>{s.count}</span>
          <span style={{ fontSize: 12, color: C.t2 }}>{s.label}</span>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 10px', fontSize: 12, color: C.t3 }}>
        <Search size={12} /> <span>Search projects…</span>
      </div>
      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, color: C.t2, cursor: 'pointer', fontSize: 12 }}>
        <Filter size={12} /> Filter
      </button>
    </div>

    <ProjectGroupSection title="Ready for Review" count={1} color={C.amber}>
      {projectGroups.review.map(p => <ProjectCard key={p.id} project={p} onSelect={onSelect} />)}
    </ProjectGroupSection>

    <ProjectGroupSection title="In Production" count={2} color={C.accent}>
      {projectGroups.production.map(p => <ProjectCard key={p.id} project={p} onSelect={onSelect} />)}
    </ProjectGroupSection>

    <ProjectGroupSection title="Drafts" count={1} color={C.t3} defaultOpen={false}>
      {projectGroups.draft.map(p => <ProjectCard key={p.id} project={p} onSelect={onSelect} />)}
    </ProjectGroupSection>
  </div>
)

// ─── Project Detail View ──────────────────────────────────────────────────────
const ProjectDetailView = ({ project, onBack }) => {
  const [activePanel, setActivePanel] = useState('comments')
  const [commentText, setCommentText] = useState('')
  const sc = statusConfig[project.status] || statusConfig.draft

  const sections = storyboardScenes.reduce((acc, scene) => {
    if (!acc[scene.section]) acc[scene.section] = []
    acc[scene.section].push(scene)
    return acc
  }, {})

  return (
    <div style={{ maxWidth: 1160 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: C.t2, cursor: 'pointer', fontSize: 13, padding: 0 }}>
          <ChevronRight size={13} style={{ transform: 'rotate(180deg)' }} /> Projects
        </button>
        <span style={{ color: C.border }}>/</span>
        <span style={{ fontSize: 13, color: C.t1, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</span>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: sc.bg, color: sc.color, fontWeight: 600, border: `1px solid ${sc.border}`, flexShrink: 0 }}>{sc.label}</span>
        {project.due && <span style={{ fontSize: 12, color: C.t3, flexShrink: 0 }}>Due {project.due}</span>}
        {project.status === 'review' && (
          <>
            <button style={{ padding: '7px 16px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, color: C.t2, cursor: 'pointer', fontSize: 13, flexShrink: 0 }}>
              Request Revision
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 18px', background: C.green, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, flexShrink: 0 }}>
              <CheckCircle size={13} /> Approve & Publish
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16, alignItems: 'start' }}>

        {/* Left: Video + Storyboard + Outputs */}
        <div>
          {/* Video player */}
          <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ width: '100%', aspectRatio: '16/9', background: '#07090f', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              {project.status === 'review' ? (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0d1225 0%, #1a1640 100%)' }} />
                  <div style={{ position: 'relative', textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: C.accentGlow, border: `2px solid ${C.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', cursor: 'pointer' }}>
                      <Play size={28} color={C.accent} />
                    </div>
                    <div style={{ fontSize: 13, color: C.t2 }}>CHNA_Diabetes_v01.mp4</div>
                    <div style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>2:47 · 215 MB</div>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 16px 14px' }}>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 2, position: 'relative', marginBottom: 6 }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, width: '35%', height: '100%', background: C.accent, borderRadius: 2 }} />
                      <div style={{ position: 'absolute', left: '35%', top: '50%', transform: 'translate(-50%, -50%)', width: 11, height: 11, borderRadius: '50%', background: C.accent, border: '2px solid white' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>0:58</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>2:47</span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <Sparkles size={32} color={C.accent} style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 14, color: C.t2 }}>Video in production</div>
                  <div style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>Preview will appear here once editing is complete</div>
                </div>
              )}
            </div>
          </Card>

          {/* Storyboard */}
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Storyboard</div>
                <div style={{ fontSize: 12, color: C.t3 }}>AI-generated scene structure · {storyboardScenes.length} scenes · {storyboardScenes.filter(s => s.done).length} recorded</div>
              </div>
              <Badge color={C.green}>{storyboardScenes.filter(s => s.done).length}/{storyboardScenes.length} Complete</Badge>
            </div>
            {Object.entries(sections).map(([sectionName, scenes]) => (
              <div key={sectionName} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>{sectionName}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {scenes.map(scene => (
                    <div key={scene.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 8,
                      background: scene.done ? `${C.green}08` : `${C.amber}08`,
                      border: `1px solid ${scene.done ? `${C.green}28` : `${C.amber}35`}`,
                    }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: scene.done ? C.green : C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        {scene.done
                          ? <CheckCircle size={12} color="white" />
                          : <span style={{ fontSize: 9, color: 'white', fontWeight: 700 }}>!</span>
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.t1 }}>{scene.label}</span>
                          <Badge color={scene.type === 'B-Roll' ? C.purple : scene.type === 'Existing Footage' ? C.cyan : C.t3} style={{ fontSize: 10 }}>{scene.type}</Badge>
                          <span style={{ fontSize: 11, color: C.t3, marginLeft: 'auto' }}>{scene.duration}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.5 }}>{scene.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Card>

          {/* Outputs — Content Package */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Outputs</div>
                <div style={{ fontSize: 12, color: C.t3 }}>Content package — {project.outputs.length} variants from this source</div>
              </div>
              <Badge color={C.accent}>{project.outputs.filter(o => o.status === 'ready').length}/{project.outputs.length} Ready</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {project.outputs.map((o, i) => {
                const osc = outputStatusConfig[o.status] || outputStatusConfig.pending
                const FormatIcon = o.format === 'PDF' ? FileText : o.format.startsWith('9:16') ? Smartphone : Globe
                return (
                  <div key={i} style={{
                    padding: 14, borderRadius: 8, background: C.bg,
                    border: `1px solid ${o.status === 'ready' ? `${C.green}44` : C.border}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: `${osc.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FormatIcon size={15} color={osc.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{o.format}</div>
                        <div style={{ fontSize: 11, color: C.t3 }}>{o.label}</div>
                      </div>
                      <Badge color={osc.color} style={{ marginLeft: 'auto' }}>{osc.label}</Badge>
                    </div>
                    <div style={{ fontSize: 12, color: C.t2 }}>→ {o.platform}</div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Right: Comments panel */}
        <div style={{ position: 'sticky', top: 0 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
              {[
                { id: 'comments', label: 'Comments (3)' },
                { id: 'activity', label: 'Activity (2)' },
                { id: 'brief',    label: 'Brief'        },
              ].map(t => (
                <button key={t.id} onClick={() => setActivePanel(t.id)} style={{
                  flex: 1, padding: '11px 6px', border: 'none', background: 'none',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  color: activePanel === t.id ? C.t1 : C.t3,
                  borderBottom: `2px solid ${activePanel === t.id ? C.accent : 'transparent'}`,
                }}>{t.label}</button>
              ))}
            </div>

            {project.status === 'review' && (
              <div style={{ padding: '10px 14px', background: `${C.amber}15`, borderBottom: `1px solid ${C.amber}30`, fontSize: 12, color: C.amber, lineHeight: 1.5 }}>
                <strong>Revision in progress</strong> — Hold off on additional requests until the current one is resolved.
              </div>
            )}

            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 380, overflowY: 'auto' }}>
              {projectComments.map(comment => (
                <div key={comment.id} style={{ opacity: comment.resolved ? 0.5 : 1 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: comment.isInternal ? C.accent : C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                      {comment.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{comment.author}</span>
                        {comment.isInternal && <Badge color={C.t3} style={{ fontSize: 10 }}>Internal</Badge>}
                      </div>
                      <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.55, marginBottom: 5 }}>{comment.text}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, color: C.t3 }}>{comment.time}</span>
                        {comment.resolved
                          ? <span style={{ fontSize: 11, color: C.green }}>✓ Resolved</span>
                          : <button style={{ fontSize: 11, color: C.t3, background: 'none', border: 'none', cursor: 'pointer' }}>Mark resolved</button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: 14, borderTop: `1px solid ${C.border}` }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment… include a timestamp if helpful"
                style={{ width: '100%', minHeight: 68, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', color: C.t1, fontSize: 12, resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.t3, cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: C.accent }} /> Include timestamp
                </label>
                <button style={{ background: C.accent, color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  Add Comment
                </button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}

// ─── New Project — 3-step flow ────────────────────────────────────────────────
const NewProjectTab = ({ step, onStepChange }) => (
  <div style={{ maxWidth: 640 }}>
    {/* Step indicator */}
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {[
        { n: 1, label: 'Describe it'     },
        { n: 2, label: 'Add footage'     },
        { n: 3, label: 'Review & Submit' },
      ].map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: step >= s.n ? C.accent : C.surface,
              border: `2px solid ${step >= s.n ? C.accent : C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: step >= s.n ? 'white' : C.t3,
            }}>
              {step > s.n ? '✓' : s.n}
            </div>
            <span style={{ fontSize: 13, fontWeight: step === s.n ? 600 : 400, color: step === s.n ? C.t1 : C.t3 }}>{s.label}</span>
          </div>
          {i < 2 && <div style={{ flex: 1, height: 1, background: step > s.n ? C.accent : C.border, margin: '0 12px' }} />}
        </div>
      ))}
    </div>

    {/* Step 1 */}
    {step === 1 && (
      <Card>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.t1, marginBottom: 4 }}>What's this video about?</div>
        <div style={{ fontSize: 13, color: C.t2, marginBottom: 20 }}>Describe it naturally — AI will figure out the type, length, and where to send it.</div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 11, color: C.t2, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Hospital</label>
          <select style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '9px 12px', color: C.t1, fontSize: 13, outline: 'none' }}>
            <option>Mercy Central</option><option>Mercy North</option><option>Mercy South</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: C.t2, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Describe the video</label>
          <textarea
            defaultValue="We want to introduce Dr. Martinez from Cardiology at Mercy South. He specializes in preventive care and has been here 12 years. For the website and maybe Instagram. Friendly tone, under 2 minutes."
            style={{ width: '100%', minHeight: 110, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.t1, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', outline: 'none', lineHeight: 1.6 }}
          />
          <div style={{ fontSize: 12, color: C.t3, marginTop: 5 }}>Tip: mention who's in it, the topic, the audience, and where it'll be used.</div>
        </div>
        <div style={{ padding: '12px 14px', background: `${C.accent}12`, borderRadius: 8, border: `1px solid ${C.accent}30`, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Sparkles size={13} color={C.accent} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.accent }}>AI Interpretation</span>
          </div>
          <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.7 }}>
            <strong style={{ color: C.t1 }}>Type:</strong> Physician Bio &nbsp;·&nbsp;
            <strong style={{ color: C.t1 }}>Service Line:</strong> Cardiology &nbsp;·&nbsp;
            <strong style={{ color: C.t1 }}>Target Length:</strong> 90s &nbsp;·&nbsp;
            <strong style={{ color: C.t1 }}>Platforms:</strong> Website, Instagram
          </div>
          <div style={{ fontSize: 11, color: C.t3, marginTop: 4 }}>Not right? You can edit in Step 3.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => onStepChange(2)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: C.accent, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Next: Add Footage <ChevronRight size={14} />
          </button>
        </div>
      </Card>
    )}

    {/* Step 2 */}
    {step === 2 && (
      <Card>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.t1, marginBottom: 4 }}>Add footage</div>
        <div style={{ fontSize: 13, color: C.t2, marginBottom: 20 }}>Upload now, send a capture link to their phone, or pull from an existing source.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { icon: Upload,   label: 'Upload Now',        sub: 'MP4, MOV up to 4 GB',            active: false },
            { icon: Camera,   label: 'Record via Mobile', sub: 'Send a capture link to their phone', active: true  },
            { icon: BookOpen, label: 'Pull from Library', sub: 'Use existing footage',            active: false },
          ].map((opt, i) => (
            <button key={i} style={{
              padding: '20px 14px', textAlign: 'center', cursor: 'pointer', color: C.t1,
              background: opt.active ? C.accentGlow : C.bg,
              border: `2px solid ${opt.active ? C.accent : C.border}`,
              borderRadius: 10,
            }}>
              <opt.icon size={24} color={opt.active ? C.accent : C.t3} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{opt.label}</div>
              <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.4 }}>{opt.sub}</div>
            </button>
          ))}
        </div>
        <div style={{ padding: 14, background: C.accentGlow, borderRadius: 8, border: `1px solid ${C.accent}40`, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 4 }}>Send capture link to Dr. Martinez</div>
          <div style={{ fontSize: 12, color: C.t2, marginBottom: 12 }}>They'll get an SMS with a recording link. Footage uploads automatically when done.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input defaultValue="+1 (555) 214-8832" style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: '7px 12px', color: C.t1, fontSize: 13, outline: 'none' }} />
            <button style={{ background: C.accent, color: 'white', border: 'none', borderRadius: 7, padding: '7px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Send Link</button>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => onStepChange(1)} style={{ padding: '8px 16px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, color: C.t2, cursor: 'pointer', fontSize: 13 }}>← Back</button>
          <button onClick={() => onStepChange(3)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: C.accent, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Next: Review & Submit <ChevronRight size={14} />
          </button>
        </div>
      </Card>
    )}

    {/* Step 3 */}
    {step === 3 && (
      <Card>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.t1, marginBottom: 4 }}>Review & submit to Cyrano</div>
        <div style={{ fontSize: 13, color: C.t2, marginBottom: 20 }}>AI has filled this in. Edit anything that looks wrong, then submit.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          {[
            { label: 'Content Type',  value: 'Physician Bio'      },
            { label: 'Service Line',  value: 'Cardiology'         },
            { label: 'Hospital',      value: 'Mercy South'        },
            { label: 'Target Length', value: '90 seconds'         },
            { label: 'Platforms',     value: 'Website, Instagram' },
            { label: 'Subject',       value: 'Dr. Martinez'       },
          ].map((f, i) => (
            <div key={i}>
              <label style={{ fontSize: 11, color: C.t2, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input defaultValue={f.value} style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: '8px 12px', color: C.t1, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: C.t2, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Special requests for the editor <span style={{ color: C.t3, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <textarea
            placeholder="e.g. Use upbeat background music. Show name and title on screen. Avoid anything that feels too clinical."
            style={{ width: '100%', minHeight: 76, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.t1, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => onStepChange(2)} style={{ padding: '8px 16px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, color: C.t2, cursor: 'pointer', fontSize: 13 }}>← Back</button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: C.green, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
            <CheckCircle size={15} /> Submit to Cyrano Team
          </button>
        </div>
      </Card>
    )}
  </div>
)

// ─── Distribution ─────────────────────────────────────────────────────────────
const DistributionView = () => {
  const [scheduleTarget, setScheduleTarget] = useState(null)
  const [calMonth] = useState('April 2026')
  const [autoCaptions, setAutoCaptions] = useState(true)
  const [autoCaption, setAutoCaption] = useState(true)

  // April 2026: starts on Wednesday. Mon-first grid → 2 blank cells.
  const daysInMonth = 30
  const startOffset = 2 // (Wed=3 + 6) % 7 = 2 for Mon-first
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div style={{ maxWidth: 1160 }}>
      <div style={{ display: 'flex', gap: 16, position: 'relative' }}>

        {/* Main calendar area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Month header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: C.t2 }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.t1 }}>{calMonth}</span>
            <button style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: C.t2 }}>
              <ChevronRight size={16} />
            </button>
            <div style={{ flex: 1 }} />
            <Badge color={C.accent}>{calendarEvents.length} scheduled</Badge>
          </div>

          {/* Calendar grid */}
          <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
            {/* Day-of-week header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${C.border}` }}>
              {dayNames.map(d => (
                <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {d}
                </div>
              ))}
            </div>
            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {cells.map((day, i) => {
                const events = day ? calendarEvents.filter(e => e.day === day) : []
                const colIndex = i % 7
                const isWeekend = colIndex >= 5
                const isToday = day === 1
                return (
                  <div key={i} style={{
                    minHeight: 100, padding: '6px 6px',
                    borderRight: (i + 1) % 7 !== 0 ? `1px solid ${C.border}` : 'none',
                    borderBottom: i < cells.length - 7 ? `1px solid ${C.border}` : 'none',
                    background: !day ? C.bg : isWeekend ? `${C.bg}80` : 'transparent',
                  }}>
                    {day && (
                      <>
                        <div style={{
                          fontSize: 12, fontWeight: isToday ? 700 : 500,
                          color: isToday ? C.accent : C.t2, marginBottom: 6,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          {isToday ? (
                            <span style={{
                              width: 22, height: 22, borderRadius: '50%', background: C.accent,
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: 11, fontWeight: 700,
                            }}>
                              {day}
                            </span>
                          ) : day}
                        </div>
                        {events.map((ev, j) => (
                          <div
                            key={j}
                            onClick={() => setScheduleTarget(ev)}
                            style={{
                              padding: '3px 6px', borderRadius: 4, marginBottom: 3,
                              background: `${ev.color}22`, borderLeft: `3px solid ${ev.color}`,
                              fontSize: 10, fontWeight: 600, color: ev.color,
                              cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap', transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = `${ev.color}40`}
                            onMouseLeave={e => e.currentTarget.style.background = `${ev.color}22`}
                          >
                            {ev.title}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Ready to Publish queue */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.t1 }}>Ready to Publish</div>
                <div style={{ fontSize: 12, color: C.t3 }}>AI has analyzed format, length, and content — and recommends the following distribution</div>
              </div>
              <Badge color={C.green}>{readyToPublish.length} awaiting action</Badge>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {readyToPublish.map((item, i) => (
                <Card key={i}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ width: 112, height: 70, borderRadius: 8, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}`, flexShrink: 0 }}>
                      <Play size={26} color={C.t3} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 }}>{item.title}</div>
                          <Badge color={C.accent}>{item.type}</Badge>
                        </div>
                        <button
                          onClick={() => setScheduleTarget({ title: item.title, platform: item.recommended[0], color: platformColors[item.recommended[0]] || C.accent })}
                          style={{ background: C.accent, color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                          Schedule Now
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 24 }}>
                        <div>
                          <div style={{ fontSize: 11, color: C.green, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recommended</div>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {item.recommended.map((p, j) => (
                              <span key={j} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${platformColors[p] || C.accent}22`, color: platformColors[p] || C.accent, fontWeight: 600, border: `1px solid ${platformColors[p] || C.accent}44` }}>{p}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ width: 1, background: C.border }} />
                        <div>
                          <div style={{ fontSize: 11, color: C.red, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Not Recommended</div>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {item.notRecommended.map((p, j) => (
                              <span key={j} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${C.red}12`, color: C.t3, fontWeight: 500 }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 12, color: C.t3, fontStyle: 'italic' }}>AI: {item.reason}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Connected Platforms sidebar */}
        <div style={{ width: 240, flexShrink: 0 }}>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 }}>Connected Platforms</div>
            <div style={{ fontSize: 12, color: C.t3, marginBottom: 16 }}>Manage your integrations</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {connectedPlatforms.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: `${p.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p.icon size={14} color={p.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.t1 }}>{p.name}</div>
                  </div>
                  {p.connected ? (
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: `${C.green}20`, color: C.green, fontWeight: 600 }}>Connected</span>
                  ) : (
                    <button style={{ fontSize: 10, padding: '2px 10px', borderRadius: 10, background: C.accent, color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Connect</button>
                  )}
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: 16, padding: '8px 0', background: 'none', border: `1px solid ${C.border}`, borderRadius: 7, color: C.accent, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              Manage integrations →
            </button>
          </Card>
        </div>

        {/* Schedule Drawer overlay */}
        {scheduleTarget && (
          <>
          <div
            onClick={() => setScheduleTarget(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 49 }}
          />
          <div style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: 400,
            background: C.surface, borderLeft: `1px solid ${C.border}`,
            boxShadow: '-12px 0 40px rgba(0,0,0,0.5)', zIndex: 50,
            display: 'flex', flexDirection: 'column', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>Schedule Post</span>
              <button onClick={() => setScheduleTarget(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t2 }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Title */}
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{scheduleTarget.title}</div>

              {/* Thumbnail */}
              <div style={{ width: '100%', aspectRatio: '16/9', background: C.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}` }}>
                <Video size={28} color={C.t3} />
              </div>

              {/* Platform checkboxes */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t2, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Platforms</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {connectedPlatforms.filter(p => p.connected).map((p, i) => (
                    <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.t1, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: p.color }} />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t2, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Date</div>
                <input type="date" defaultValue="2026-04-03" style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: '8px 12px', color: C.t1, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Time */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t2, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Time</div>
                <input type="time" defaultValue="09:00" style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: '8px 12px', color: C.t1, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Toggle: Auto-generate captions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: C.t1 }}>Auto-generate captions</span>
                <button
                  onClick={() => setAutoCaptions(!autoCaptions)}
                  style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: autoCaptions ? C.accent : C.border, position: 'relative', transition: 'background 0.2s' }}
                >
                  <span style={{ position: 'absolute', top: 2, left: autoCaptions ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                </button>
              </div>

              {/* Toggle: Auto-caption (AI) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: C.t1 }}>Auto-caption (AI)</span>
                <button
                  onClick={() => setAutoCaption(!autoCaption)}
                  style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer', background: autoCaption ? C.accent : C.border, position: 'relative', transition: 'background 0.2s' }}
                >
                  <span style={{ position: 'absolute', top: 2, left: autoCaption ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                </button>
              </div>

              {/* Caption textarea */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t2, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Custom caption / notes</div>
                <textarea
                  placeholder="Add a caption or notes for this post..."
                  style={{ width: '100%', minHeight: 80, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.t1, fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button style={{ flex: 1, padding: '10px 0', background: C.accent, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
                  Schedule Post
                </button>
                <button
                  onClick={() => setScheduleTarget(null)}
                  style={{ flex: 1, padding: '10px 0', background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, color: C.t2, cursor: 'pointer', fontSize: 13 }}
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Results ──────────────────────────────────────────────────────────────────
const ResultsView = ({ tab, onTabChange }) => {
  const [showExport, setShowExport] = useState(false)
  const [showAttribution, setShowAttribution] = useState(false)

  return (
    <div style={{ maxWidth: 1160 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <TabBar
          tabs={[
            { id: 'overview',  label: 'Overview'        },
            { id: 'roi',       label: 'ROI Attribution' },
            { id: 'per-video', label: 'Per-Video'       },
          ]}
          active={tab}
          onChange={onTabChange}
        />
        <button
          onClick={() => setShowExport(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: C.accent, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
        >
          <Download size={14} /> Export Report
        </button>
      </div>
      {tab === 'overview'  && <ResultsOverview />}
      {tab === 'roi'       && <ROITab onShowAttribution={() => setShowAttribution(true)} />}
      {tab === 'per-video' && <PerVideoTab />}

      {/* Export Modal */}
      {showExport && (
        <ModalOverlay onClose={() => setShowExport(false)} width={500}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.t1 }}>Export CEO Report</span>
            <button onClick={() => setShowExport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t2 }}><X size={18} /></button>
          </div>

          {/* Preview card */}
          <div style={{ padding: 16, background: C.bg, borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Report Preview</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><div style={{ fontSize: 11, color: C.t3 }}>Total Videos</div><div style={{ fontSize: 20, fontWeight: 700, color: C.t1 }}>48</div></div>
              <div><div style={{ fontSize: 11, color: C.t3 }}>Total Views</div><div style={{ fontSize: 20, fontWeight: 700, color: C.t1 }}>124K</div></div>
              <div><div style={{ fontSize: 11, color: C.t3 }}>Est. ROI</div><div style={{ fontSize: 20, fontWeight: 700, color: C.green }}>$189K</div></div>
              <div><div style={{ fontSize: 11, color: C.t3 }}>Top Performer</div><div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>Maria's Knee Journey</div></div>
            </div>
          </div>

          {/* Format selector */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t2, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Format</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['PDF', 'PowerPoint', 'Email Summary'].map((fmt, i) => (
                <Pill key={i} active={i === 0} onClick={() => {}}>{fmt}</Pill>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.t2, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Date Range</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Last 30 Days', 'Last Quarter', 'YTD', 'Custom'].map((r, i) => (
                <Pill key={i} active={i === 0} onClick={() => {}}>{r}</Pill>
              ))}
            </div>
          </div>

          {/* Checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.t1, cursor: 'pointer', marginBottom: 24 }}>
            <input type="checkbox" defaultChecked style={{ accentColor: C.accent }} />
            Include per-video breakdown
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ flex: 1, padding: '10px 0', background: C.accent, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
              Generate Report
            </button>
            <button onClick={() => setShowExport(false)} style={{ padding: '10px 20px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, color: C.t2, cursor: 'pointer', fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* Attribution Modal */}
      {showAttribution && (
        <ModalOverlay onClose={() => setShowAttribution(false)} width={600}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.t1 }}>ROI Attribution Methodology</span>
            <button onClick={() => setShowAttribution(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.t2 }}><X size={18} /></button>
          </div>

          {/* Section 1 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 8 }}>1. Three Data Sources</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Video Analytics', desc: 'Plays, watch time, completion rates from hosting platforms' },
                { label: 'De-Identified Patient CSV', desc: 'Monthly upload, appointment bookings with UTM source' },
                { label: 'Website/Booking Click Data', desc: 'UTM-tagged links from video CTAs' },
              ].map((s, i) => (
                <div key={i} style={{ padding: 10, background: C.bg, borderRadius: 7, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: C.t2 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 8 }}>2. Attribution Formula</div>
            <div style={{ padding: 14, background: C.bg, borderRadius: 8, border: `1px solid ${C.accent}30`, fontFamily: 'monospace', fontSize: 12, color: C.accentLight, lineHeight: 1.8 }}>
              Attributed Revenue = (Video-Influenced Bookings × Avg. Procedure Revenue) × Attribution Weight
            </div>
            <div style={{ fontSize: 12, color: C.t2, marginTop: 8, lineHeight: 1.6 }}>
              30-day attribution window · First-touch / last-touch blended model
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 8 }}>3. CSV Template</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr>
                    {['date', 'patient_id_hash', 'service_line', 'procedure_code', 'revenue', 'utm_source', 'utm_medium', 'utm_campaign', 'referring_video_id', 'appointment_type', 'location'].map(col => (
                      <th key={col} style={{ padding: '6px 8px', borderBottom: `1px solid ${C.border}`, textAlign: 'left', color: C.t2, fontWeight: 700, whiteSpace: 'nowrap' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {['2026-03-15', 'a1b2c3', 'Cardiology', 'CPT-93000', '1200', 'youtube', 'video', 'dr-chen', 'vid_042', 'new_patient', 'mercy_central'].map((val, i) => (
                      <td key={i} style={{ padding: '6px 8px', borderBottom: `1px solid ${C.border}`, color: C.t3, whiteSpace: 'nowrap' }}>{val}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.accent, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            <Download size={14} /> Download CSV Template
          </button>
        </ModalOverlay>
      )}
    </div>
  )
}

const ResultsOverview = () => (
  <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      <StatCard label="Total Views"       value="124K"  sub="↑ 18% vs. last month"  color={C.accent}  icon={Eye}        />
      <StatCard label="Avg. Watch Time"   value="72%"   sub="↑ 4 pts vs. last month" color={C.green}   icon={Activity}   />
      <StatCard label="Booking Clicks"    value="1,847" sub="4.8% avg CTR"           color={C.amber}   icon={Target}     />
      <StatCard label="Est. New Patients" value="312"   sub="From video attribution" color={C.purple}  icon={Users}      />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {[
        { label: 'Testimonials',      views: '52,400', ctr: '8.9%', icon: Heart,     color: C.pink   },
        { label: 'Physician Bios',    views: '38,100', ctr: '6.2%', icon: Users,     color: C.accent },
        { label: 'Service Line Ed.',  views: '21,800', ctr: '3.4%', icon: FileText,  color: C.green  },
      ].map((t, i) => (
        <Card key={i}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: `${t.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <t.icon size={18} color={t.color} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{t.label}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Views</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.t1 }}>{t.views}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Avg CTR</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: t.color }}>{t.ctr}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
)

const journeyColors = [C.green, '#22c55e', '#34d399', C.accent, C.accentLight, C.amber, '#f59e0b']

const ROITab = ({ onShowAttribution }) => (
  <div>
    {/* Summary card */}
    <Card style={{ marginBottom: 16, borderColor: `${C.green}44` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: C.t1 }}>Year-to-Date ROI Attribution</span>
            <button onClick={onShowAttribution} style={{ fontSize: 12, color: C.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              How is this calculated? →
            </button>
          </div>
          <div style={{ fontSize: 13, color: C.t2, marginBottom: 20 }}>Based on patient starts matched to video touchpoints + no-show reduction impact</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            <div>
              <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Est. New Patients</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.green, letterSpacing: '-0.03em' }}>312</div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>Matched to video touchpoints</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>No-Show Reduction</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.amber, letterSpacing: '-0.03em' }}>$44K</div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>Reclaimed revenue YTD</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Est. Revenue Impact</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: C.accent, letterSpacing: '-0.03em' }}>$189K</div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>vs. $58K program cost</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '20px 28px', background: C.greenGlow, borderRadius: 14, border: `1px solid ${C.green}44`, flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>ROI Index</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: C.green, lineHeight: 1, letterSpacing: '-0.03em' }}>3.3×</div>
          <div style={{ fontSize: 12, color: C.t2, marginTop: 6 }}>Return on program cost</div>
        </div>
      </div>
    </Card>

    {/* Clinical Care Journey */}
    <Card style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 }}>Clinical Care Journey</div>
      <div style={{ fontSize: 12, color: C.t3, marginBottom: 16 }}>ROI attribution across 7 stages of the patient journey</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 90px', gap: 8, padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Videos</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Views</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Est. ROI</span>
        </div>
        {clinicalJourney.map((row, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 90px', gap: 8,
            padding: '10px 12px', borderBottom: `1px solid ${C.border}`,
            borderLeft: `3px solid ${journeyColors[i] || C.accent}`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{row.stage}</span>
            <span style={{ fontSize: 12, color: C.t2 }}>{row.desc}</span>
            <span style={{ fontSize: 13, color: C.t1, textAlign: 'right' }}>{row.videos}</span>
            <span style={{ fontSize: 13, color: C.t1, textAlign: 'right' }}>{row.views.toLocaleString()}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.green, textAlign: 'right' }}>{row.estROI}</span>
          </div>
        ))}
        {/* Total */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 90px', gap: 8, padding: '10px 12px', background: `${C.green}08` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Total</span>
          <span />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, textAlign: 'right' }}>{clinicalJourney.reduce((s, r) => s + r.videos, 0)}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, textAlign: 'right' }}>{clinicalJourney.reduce((s, r) => s + r.views, 0).toLocaleString()}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.green, textAlign: 'right' }}>$189.2K</span>
        </div>
      </div>
    </Card>

    {/* Talent & Culture */}
    <Card>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginBottom: 4 }}>Talent & Culture</div>
      <div style={{ fontSize: 12, color: C.t3, marginBottom: 16 }}>Recruitment, onboarding, and retention video impact</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 90px', gap: 8, padding: '8px 12px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Impact</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Videos</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Views</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Est. ROI</span>
        </div>
        {talentJourney.map((row, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 90px', gap: 8,
            padding: '10px 12px', borderBottom: `1px solid ${C.border}`,
            borderLeft: `3px solid ${C.amber}`,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{row.stage}</div>
              <div style={{ fontSize: 11, color: C.t3 }}>{row.desc}</div>
            </div>
            <span style={{ fontSize: 12, color: C.amber, fontWeight: 500 }}>{row.note}</span>
            <span style={{ fontSize: 13, color: C.t1, textAlign: 'right' }}>{row.videos}</span>
            <span style={{ fontSize: 13, color: C.t1, textAlign: 'right' }}>{row.views.toLocaleString()}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.amber, textAlign: 'right' }}>{row.estROI}</span>
          </div>
        ))}
        {/* Total */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 80px 90px', gap: 8, padding: '10px 12px', background: `${C.amber}08` }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Total</span>
          <span />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, textAlign: 'right' }}>{talentJourney.reduce((s, r) => s + r.videos, 0)}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, textAlign: 'right' }}>{talentJourney.reduce((s, r) => s + r.views, 0).toLocaleString()}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: C.amber, textAlign: 'right' }}>$68.6K</span>
        </div>
      </div>
    </Card>
  </div>
)

const PerVideoTab = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {finalVideos.map((v, i) => (
      <Card key={i} onClick={() => {}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 88, height: 56, borderRadius: 7, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}`, flexShrink: 0 }}>
            <Play size={18} color={C.t3} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 5 }}>{v.title}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge color={C.accent}>{v.type}</Badge>
              <span style={{ fontSize: 12, color: C.t3 }}>{v.hospital}</span>
              <span style={{ fontSize: 12, color: C.t3 }}>· {v.platform}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, textAlign: 'right', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Views</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.t1 }}>{v.views.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>CTR</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>{perVideoStats[i].ctr}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Est. ROI</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.amber }}>{perVideoStats[i].roi}</div>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
)

// ─── Library ──────────────────────────────────────────────────────────────────
const LibraryView = ({ view, onViewChange }) => (
  <div style={{ maxWidth: 1160 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <TabBar
        tabs={[
          { id: 'videos', label: 'Final Videos'   },
          { id: 'broll',  label: 'B-Roll'          },
          { id: 'feed',   label: 'System Feed'     },
          { id: 'public', label: 'Public Library'  },
        ]}
        active={view}
        onChange={onViewChange}
      />
      {(view === 'videos' || view === 'broll') && (
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 12px', fontSize: 13, color: C.t3, width: 300 }}>
            <Search size={13} />
            <input
              placeholder={view === 'videos' ? 'Search by title, tag, hospital, service line…' : 'Search by scene, subject, setting, mood…'}
              style={{ background: 'none', border: 'none', outline: 'none', flex: 1, color: C.t1, fontSize: 13 }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.t2, cursor: 'pointer', fontSize: 13 }}>
            <Filter size={13} /> Filter
          </button>
        </div>
      )}
    </div>

    {/* Videos tab — split filters */}
    {view === 'videos' && (
      <div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Service Line</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Cardiology', 'Orthopedics', 'Oncology', 'Behavioral Health', 'Neurology', 'Primary Care'].map((tag, i) => (
              <Pill key={i} active={i === 0} onClick={() => {}}>{tag}</Pill>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Content Type</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All', 'Physician Bio', 'Testimonial', 'Pre-Visit', 'Condition Ed.', 'Service Line Ed.', 'Recruitment', 'Dept. Tour'].map((tag, i) => (
              <Pill key={i} active={i === 0} onClick={() => {}} color={C.purple}>{tag}</Pill>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {finalVideos.map((v, i) => (
            <Card key={i} style={{ padding: 0, overflow: 'hidden' }} onClick={() => {}}>
              <VideoThumbnail />
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 7, lineHeight: 1.4 }}>{v.title}</div>
                <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
                  {v.tags.map((tag, j) => (
                    <span key={j} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: `${C.accent}18`, color: C.accentLight, fontWeight: 500 }}>#{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: C.t3 }}>
                  <span>{v.hospital}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={11} /><span>{v.views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )}

    {/* B-Roll tab — unchanged */}
    {view === 'broll' && (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {['All', 'Universal (Any Hospital)', 'Clinical', 'Facility', 'Cardiology', 'Surgery', 'Patient Interaction'].map((tag, i) => (
            <Pill key={i} active={i === 0} onClick={() => {}} color={i === 1 ? C.green : C.accent}>{tag}</Pill>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {brollClips.map((clip, i) => (
            <Card key={i} style={{ padding: 0, overflow: 'hidden' }} onClick={() => {}}>
              <div style={{ width: '100%', aspectRatio: '16/9', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', borderBottom: `1px solid ${C.border}` }}>
                <Camera size={28} color={C.t3} />
                <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', borderRadius: 4, padding: '2px 7px', fontSize: 11, color: 'white', fontWeight: 600 }}>{clip.duration}</div>
                <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 2 }}>
                  {Array.from({ length: clip.quality }).map((_, j) => (
                    <span key={j} style={{ color: C.amber, fontSize: 10 }}>★</span>
                  ))}
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 8, lineHeight: 1.4 }}>{clip.title}</div>
                <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
                  {clip.tags.map((tag, j) => (
                    <span key={j} style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500,
                      background: tag === 'any-hospital' ? `${C.green}18` : `${C.accent}18`,
                      color: tag === 'any-hospital' ? C.green : C.accentLight,
                    }}>#{tag}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>Used in {clip.usedIn} videos</span>
                  <button style={{ background: C.accent, color: 'white', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
                    Add to Project
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )}

    {/* System Feed tab */}
    {view === 'feed' && (
      <div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.t1, marginBottom: 4 }}>System Feed</div>
          <div style={{ fontSize: 13, color: C.t3 }}>Discover content from other hospitals in the Mercy Health System</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {['All Hospitals', 'Mercy North', 'Mercy East', 'Mercy South'].map((h, i) => (
            <Pill key={i} active={i === 0} onClick={() => {}} color={i === 0 ? C.accent : hospitalColors[h] || C.accent}>{h}</Pill>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {systemFeedItems.map((item, i) => (
            <Card key={i} style={{ padding: 0, overflow: 'hidden' }}>
              <VideoThumbnail />
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 8, lineHeight: 1.4 }}>{item.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Building2 size={11} color={hospitalColors[item.hospital] || C.t3} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: hospitalColors[item.hospital] || C.t3 }}>{item.hospital}</span>
                  </div>
                  <Badge color={C.accent} style={{ fontSize: 10 }}>{item.type}</Badge>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, fontSize: 12, color: C.t3 }}>
                  <span>{item.date}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={11} /><span>{item.views.toLocaleString()}</span>
                  </div>
                </div>
                <button style={{ width: '100%', padding: '7px 0', background: C.accentGlow, border: `1px solid ${C.accent}40`, borderRadius: 7, color: C.accent, cursor: 'pointer', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Download size={12} /> Request Copy
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )}

    {/* Public Library tab */}
    {view === 'public' && (
      <div>
        {/* Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '14px 20px', background: C.accentGlow, borderRadius: 10, border: `1px solid ${C.accent}30` }}>
          <ExternalLink size={18} color={C.accent} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>Public Video Library — External Microsite</div>
            <div style={{ fontSize: 12, color: C.t2 }}>This is how patients and referring providers see your published video content. SEO-optimized and AI-indexable.</div>
          </div>
          <Badge color={C.amber}>Preview Mode</Badge>
        </div>

        {/* Light-themed preview */}
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 28, border: `1px solid ${C.borderLight}`, boxShadow: 'inset 0 2px 20px rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.06)' }}>
          {/* Simulated search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 16px', marginBottom: 16 }}>
            <Search size={16} color="#94a3b8" />
            <span style={{ color: '#94a3b8', fontSize: 14 }}>Search by condition, provider, or topic...</span>
          </div>

          {/* Category nav */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {['By Service Line', 'By Provider', 'By Topic'].map((cat, i) => (
              <button key={i} style={{
                padding: '6px 16px', borderRadius: 20, border: `1px solid ${i === 0 ? '#6366f1' : '#e2e8f0'}`,
                background: i === 0 ? '#6366f120' : 'white', color: i === 0 ? '#6366f1' : '#64748b',
                cursor: 'pointer', fontSize: 12, fontWeight: i === 0 ? 600 : 400,
              }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Video cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {finalVideos.slice(0, 6).map((v, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={24} color="#94a3b8" />
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 6, lineHeight: 1.4 }}>{v.title}</div>
                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 12, background: '#6366f115', color: '#6366f1', fontWeight: 500 }}>{v.type}</span>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>{v.views.toLocaleString()} views</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: C.accent, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Customize Public Page →
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'none', border: `1px solid ${C.border}`, borderRadius: 8, color: C.t1, cursor: 'pointer', fontSize: 13 }}>
            <Copy size={14} /> Copy Public URL
          </button>
        </div>
      </div>
    )}

  </div>
)

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function CyranoMarOps() {
  const [section,      setSection]      = useState('dashboard')
  const [libraryView,  setLibraryView]  = useState('videos')
  const [creationTab,  setCreationTab]  = useState('projects')
  const [resultsTab,   setResultsTab]   = useState('overview')
  const [showNotifs,   setShowNotifs]   = useState(false)

  return (
    <div style={{
      display: 'flex', height: '100vh',
      background: C.bg, color: C.t1,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      overflow: 'hidden', fontSize: 14,
    }}>
      <Sidebar active={section} onNav={setSection} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar section={section} showNotifs={showNotifs} setShowNotifs={setShowNotifs} />
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>
          {section === 'dashboard'    && <DashboardView onNavigate={setSection} />}
          {section === 'creation'     && <CreationView  tab={creationTab}  onTabChange={setCreationTab} />}
          {section === 'distribution' && <DistributionView />}
          {section === 'results'      && <ResultsView   tab={resultsTab}   onTabChange={setResultsTab} />}
          {section === 'library'      && <LibraryView   view={libraryView} onViewChange={setLibraryView} />}
        </div>
      </div>
    </div>
  )
}
