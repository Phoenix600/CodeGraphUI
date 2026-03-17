import React from 'react';
import { 
  ArrowLeft, 
  User, 
  Flag, 
  BarChart3, 
  Camera, 
  Github, 
  Twitter, 
  Linkedin, 
  Link as LinkIcon, 
  FileText,
  Code2,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ProfileViewProps {
  onBack: () => void;
}

interface WorkExperience {
  id: string;
  company: string;
  mode: string;
  role: string;
  duration: string;
  description: string;
}

const InputField = ({ label, placeholder, value, type = "text", icon: Icon, required }: { label: string, placeholder: string, value?: string, type?: string, icon?: any, required?: boolean }) => (
  <div className="space-y-1.5 flex-1 min-w-[240px]">
    <label className="text-xs font-medium text-zinc-500">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />}
      <input 
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        className={cn(
          "w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-600",
          Icon && "pl-9"
        )}
      />
    </div>
  </div>
);

const SelectField = ({ label, placeholder, required }: { label: string, placeholder: string, required?: boolean }) => (
  <div className="space-y-1.5 flex-1 min-w-[240px]">
    <label className="text-xs font-medium text-zinc-500">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <button className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-400 flex items-center justify-between hover:border-zinc-700 transition-colors">
      <span className="truncate">{placeholder}</span>
      <ChevronDown size={14} className="text-zinc-600" />
    </button>
  </div>
);

const TextAreaField = ({ label, placeholder, count, max }: { label: string, placeholder: string, count: number, max: number }) => (
  <div className="space-y-1.5 w-full">
    <label className="text-xs font-medium text-zinc-500">{label} ({count}/{max})</label>
    <textarea 
      placeholder={placeholder}
      rows={4}
      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-600 resize-none"
    />
  </div>
);

const Section = ({ title, children, onSave }: { title: string, children: React.ReactNode, onSave?: () => void }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-bold text-zinc-200 tracking-tight">{title}</h2>
    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 space-y-6">
      {children}
      {onSave && (
        <div className="flex justify-end">
          <button className="bg-orange-600/10 hover:bg-orange-600/20 text-orange-500 text-xs font-bold py-2 px-6 rounded-md border border-orange-500/20 transition-all">
            Save Changes
          </button>
        </div>
      )}
    </div>
  </div>
);

export default function ProfileView({ onBack }: ProfileViewProps) {
  const [activeTab, setActiveTab] = React.useState('Profile details');
  const [workExperiences, setWorkExperiences] = React.useState<WorkExperience[]>([
    { id: '1', company: '', mode: '', role: '', duration: '', description: '' }
  ]);

  const handleAddExperience = () => {
    const newId = (workExperiences.length + 1).toString();
    setWorkExperiences([...workExperiences, { id: newId, company: '', mode: '', role: '', duration: '', description: '' }]);
  };

  const handleRemoveExperience = (id: string) => {
    if (workExperiences.length > 1) {
      setWorkExperiences(workExperiences.filter(exp => exp.id !== id));
    }
  };

  const tabs = [
    { id: 'Profile details', icon: User },
    { id: 'Milestones', icon: Flag },
    { id: 'Progress', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-zinc-300 font-sans overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col p-4 space-y-6 shrink-0">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-colors px-3 py-2 rounded-md hover:bg-zinc-900"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-zinc-800/50 text-white border border-zinc-700/50 shadow-lg" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              )}
            >
              <tab.icon size={18} className={activeTab === tab.id ? "text-orange-500" : ""} />
              <span className="text-sm font-bold tracking-tight">{tab.id}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0A0A0A]">
        <div className="max-w-4xl mx-auto p-8 space-y-10">
          
          {/* Profile Photo Section */}
          <Section title="Profile Photo">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                  <User size={32} className="text-zinc-600" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera size={20} className="text-white" />
                  </div>
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-600 rounded-md flex items-center justify-center text-white shadow-lg">
                  <Camera size={12} />
                </button>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-200">Upload a Picture</h3>
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG (Max. 1MB)</p>
                <div className="pt-3 flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 cursor-pointer hover:border-orange-500/50 transition-colors overflow-hidden">
                      <img 
                        src={`https://picsum.photos/seed/avatar${i}/32/32`} 
                        alt="avatar" 
                        className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 mt-2 italic">Not ready with a photo? Use an avatar instead</p>
              </div>
            </div>
          </Section>

          {/* Personal Details Section */}
          <Section title="Personal details" onSave={() => {}}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Name" placeholder="Enter your name" value="Rohan Satam" />
              <InputField label="Email ID" placeholder="Enter your email" value="rohansatam@example.com" type="email" />
              <div className="flex gap-4 flex-1">
                <div className="w-24">
                  <SelectField label="Mobile Number" placeholder="Select" />
                </div>
                <div className="flex-1 pt-6">
                  <input 
                    placeholder="Enter your mobile num"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 px-3 text-sm text-zinc-200 focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-zinc-600"
                  />
                </div>
              </div>
              <InputField label="Location" placeholder="Enter your location" />
              <SelectField label="Education year" placeholder="Choose Your Graduation Year" />
              <SelectField label="Education" placeholder="Select or enter your college/university" />
            </div>
          </Section>

          {/* Social Links Section */}
          <Section title="Social Links" onSave={() => {}}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="GitHub" placeholder="Add your GitHub URL" icon={Github} />
              <InputField label="X (formerly twitter)" placeholder="Add your Twitter URL" icon={Twitter} />
              <InputField label="LinkedIn" placeholder="Add your LinkedIn URL" icon={Linkedin} />
              <InputField label="Others" placeholder="Add your others URL" icon={LinkIcon} />
              <InputField label="Resume" placeholder="Add your Resume URL" icon={FileText} />
            </div>
          </Section>

          {/* Coding Profile Section */}
          <Section title="Coding Profile" onSave={() => {}}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Leetcode" placeholder="Add your Leetcode profile URL" icon={Code2} />
              <InputField label="Hackerrank" placeholder="Add your Hackerrank profile URL" icon={Code2} />
              <InputField label="Codeforces" placeholder="Add your Codeforces profile URL" icon={Code2} />
              <InputField label="GeeksForGeeks" placeholder="Add your GeeksForGeeks profile URL" icon={Code2} />
              <InputField label="Others" placeholder="Add your other contest profile URL" icon={Code2} />
            </div>
          </Section>

          {/* Work Experience Section */}
          <Section title="Work Experience" onSave={() => {}}>
            <div className="space-y-10">
              {workExperiences.map((exp, index) => (
                <div key={exp.id} className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ChevronUp size={16} className="text-zinc-400" />
                      <span className="text-sm font-bold text-zinc-200">Work Experience {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {workExperiences.length > 1 && (
                        <button 
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="p-1.5 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                      {index === workExperiences.length - 1 && (
                        <button 
                          onClick={handleAddExperience}
                          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700 rounded-md text-[10px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          <Plus size={12} />
                          <span>Add more</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Company" placeholder="Enter company name" required />
                    <SelectField label="Mode" placeholder="Select mode" required />
                    <InputField label="Role" placeholder="Enter your role" required />
                    <InputField label="Duration" placeholder="Select duration" icon={Calendar} required />
                    <div className="md:col-span-2">
                      <TextAreaField label="Description" placeholder="Enter job description" count={0} max={100} />
                    </div>
                  </div>
                  {index < workExperiences.length - 1 && (
                    <div className="h-px bg-zinc-800/50 w-full mt-10" />
                  )}
                </div>
              ))}
            </div>
          </Section>

        </div>
      </main>
    </div>
  );
}
