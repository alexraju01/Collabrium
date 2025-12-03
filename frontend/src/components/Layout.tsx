import { ReactNode, useState } from 'react'
import Footer from './Footer';
import Header from './Header';
import { Route as SettingRoute } from '../routes/setting/route';

interface LayoutProps {
    children?: React.ReactNode;
}

interface SidebarItemProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

function Sidebar ({label,isSelected,onClick}: SidebarItemProps ) {
    return(   
        <li className="flex-1 md:flex-none md:mb-2">
            <button
                onClick={onClick}
                className={`w-full px-4 py-3 rounded flex items-center justify-center md:justify-between ${
                    isSelected 
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
            >
                <div className="flex items-center">
                    <span className="font-medium">{label}</span>
                </div>
            </button>
        </li>
    );   
}

export default function Layout ({ children }: LayoutProps) {
    const [selectedPage, setSelectedPage] = useState <'dashboard' | 'workspace' | 'settings'>('dashboard');

    const renderContent = () => {
        switch (selectedPage) {
            case 'dashboard':
                return <div className="p-6">dashboard</div>;
            case 'workspace':
                return <div className="p-6">Workspace</div>;
            case 'settings':
                const SettingComponent = SettingRoute.options.component || SettingRoute.component;
                return <SettingComponent />;
            default:
                return <div className="p-6">dashboard</div>;
        }
    };
    
    return(
        <div className="min-h-screen flex flex-col ">
            {/* header */}
            <Header />

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 shadow-sm p-4 overflow-y-auto">
                    <ul className="flex flex-row md:flex-col md:space-y-1">
                        <Sidebar 
                            label="dashboard" 
                            isSelected={selectedPage === 'dashboard'} 
                            onClick={() => setSelectedPage('dashboard')}
                        />
                        <Sidebar 
                            label="workspace" 
                            isSelected={selectedPage === 'workspace'} 
                            onClick={() => setSelectedPage('workspace')}
                        />
                        <Sidebar 
                            label="setting" 
                            isSelected={selectedPage === 'settings'} 
                            onClick={() => setSelectedPage('settings')}
                        />
                    </ul>
                </aside>

                {/* maincontent */}
                <section className="flex-1 bg-gray-50 overflow-auto">
                    {renderContent()}
                </section>
            </div>



            {/* Footer */}
            <Footer />
        </div>
    );
};

