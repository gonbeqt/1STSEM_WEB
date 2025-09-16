import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuditsViewModel } from '../../../hooks/useAuditsViewModel';
import SideNavbar from '../../../components/SideNavbar';
import './audits.css';

const AuditsPage = () => {
    const { audits, statistics, isLoading, error } = useAuditsViewModel();
    const navigate = useNavigate();

    const handleViewDetails = (auditId: string) => {
        navigate(`/audits/${auditId}`);
    };

    return (
        <div className="audits-page">
            <SideNavbar />
            <main className="audits-content">
                <header className="audits-header">
                    <h1>Contract Audits</h1>
                </header>

                {statistics && (
                    <section className="statistics-section">
                        <div className="stat-card">
                            <h4>Total Audits</h4>
                            <p>{statistics.total_audits}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Completed</h4>
                            <p>{statistics.completed_audits}</p>
                        </div>
                        <div className="stat-card">
                            <h4>Completion Rate</h4>
                            <p>{statistics.completion_rate.toFixed(1)}%</p>
                        </div>
                        <div className="stat-card">
                            <h4>Critical Risks</h4>
                            <p>{statistics.risk_distribution.CRITICAL}</p>
                        </div>
                    </section>
                )}

                {isLoading && <div className="loader"></div>}
                {error && <div className="error-message">{error}</div>}
                {!isLoading && !error && (
                    <div className="audits-list">
                        {audits.map(audit => (
                            <div key={audit.audit_id} className="audit-card">
                                <div className="audit-card-header">
                                    <h3>{audit.contract_name}</h3>
                                    <span className={`status-badge status-${audit.status.toLowerCase()}`}>{audit.status}</span>
                                </div>
                                <div className="audit-card-body">
                                    <p><strong>Risk Level:</strong> <span className={`risk-level risk-${audit.risk_level?.toLowerCase()}`}>{audit.risk_level}</span></p>
                                    <p><strong>Vulnerabilities:</strong> {audit.vulnerabilities_found}</p>
                                    <p><strong>Completed:</strong> {audit.completed_at ? new Date(audit.completed_at).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div className="audit-card-footer">
                                    <button className="btn-details" onClick={() => handleViewDetails(audit.audit_id)}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AuditsPage;
