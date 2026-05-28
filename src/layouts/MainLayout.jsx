import { Outlet } from 'react-router-dom';
import Footer from '@/components/layout/Footer';


export default function MainLayout() {
    return (
        <div className="main-layout">
            <div className="main-layout__content">
                <Outlet />
            </div>
            <Footer />
            <style>{`
                .main-layout {
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                }
                .main-layout__content {
                    flex: 1 0 auto;
                }
            `}</style>
        </div>
    );
}
