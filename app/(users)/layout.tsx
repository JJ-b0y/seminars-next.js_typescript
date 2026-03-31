import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <p>User Navbar</p>
            {children}
        </div>
    )
}
export default Layout;
