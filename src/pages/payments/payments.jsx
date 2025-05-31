import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sidebar from '../../components/sidebar/sidebar.jsx'
import Navbar2 from '../../components/navbar2/navbar2.jsx';
import profile1 from '../../assets/images/profile1.jpg'
import './payments.css'

function Payments() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const toggleSidebar = () => {
        setIsSidebarExpanded(prev => !prev);
    };

    useEffect(() => {
        const handleResize = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        if(mobile) setIsSidebarExpanded(false);
        };
        
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <div class="payments" id="payments">


        {/* ------------------------------ SIDEBAR ------------------------------- */}

        <Sidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} isMobile={isMobile} />

        <div 
            class={`container ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}
            style={
                {marginLeft: !isMobile && isSidebarExpanded ? 
                    '280px' : !isMobile && !isSidebarExpanded ?
                    '100px' : '100px', transition: 'margin-left 0.3s ease-in-out'
                }
            }
        >


            

            {/* ------------------------------ MAIN SECTION ------------------------------- */}

            <main>

                <Navbar2 />

                <h2 class="section-header">Payments</h2>

                <div class="date">
                    <input type="date" />
                </div>


                <div class="table-data">
                    <div class="order">
                        <div class="head">
                            <h3>Booking Payments</h3>
                            <span><FontAwesomeIcon icon={['fas','fa-search']} /></span>
                            <span><FontAwesomeIcon icon={['fas','fa-filter']} /></span>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Paid On</th>
                                    <th>Rooms</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <img src={profile1} alt="" />
                                        <p>John Doe</p>
                                    </td>
                                    <td>$499</td>
                                    <td>01-10-2021</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td>
                                        <img src={profile1} alt="" />
                                        <p>John Doe</p>
                                    </td>
                                    <td>$499</td>
                                    <td>01-10-2021</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td>
                                        <img src={profile1} alt="" />
                                        <p>John Doe</p>
                                    </td>
                                    <td>$499</td>
                                    <td>01-10-2021</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td>
                                        <img src={profile1} alt="" />
                                        <p>John Doe</p>
                                    </td>
                                    <td>$499</td>
                                    <td>01-10-2021</td>
                                    <td>0</td>
                                </tr>
                                <tr>
                                    <td>
                                        <img src={profile1} alt="" />
                                        <p>John Doe</p>
                                    </td>
                                    <td>$499</td>
                                    <td>01-10-2021</td>
                                    <td>0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </div>

            </main>
        </div>
    </div>
  )
}

export default Payments;
