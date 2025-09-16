import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuditDetailsViewModel } from '../../../../hooks/useAuditDetailsViewModel';
import SideNavbar from '../../../../components/SideNavbar';
import './audit-details.css';

const AuditDetailsPage = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const { audit, vulnerabilities, isLoading, error } = useAuditDetailsViewModel(auditId || '');

    if (isLoading) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    if (!audit) {
        return <div>Audit not found.</div>;
    }

    return (
        <div className="audit-details-page">
            <SideNavbar />
            <main className="audit-details-content">
                <header className="audit-details-header">
                    <h1>{audit.contract_name}</h1>
                    <span className={`status-badge status-${audit.status.toLowerCase()}`}>{audit.status}</span>
                </header>

                <section className="summary-section">
                    <h2>Audit Summary</h2>
                    <div className="summary-grid">
                        <div><strong>Risk Level:</strong> <span className={`risk-level risk-${audit.risk_level?.toLowerCase()}`}>{audit.risk_level}</span></div>
                        <div><strong>Vulnerabilities:</strong> {audit.vulnerabilities_found}</div>
                        <div><strong>Completed:</strong> {new Date(audit.completed_at || '').toLocaleString()}</div>
                    </div>
                </section>

                <section className="report-section">
                    <h2>Audit Report</h2>
                    <pre className="audit-report">{audit.audit_report}</pre>
                </section>

                <section className="vulnerabilities-section">
                    <h2>Vulnerabilities</h2>
                    {vulnerabilities.map((vuln, index) => (
                        <div key={index} className="vulnerability-card">
                            <div className="vulnerability-header">
                                <h4>{vuln.title}</h4>
                                <span className={`severity-badge severity-${vuln.severity.toLowerCase()}`}>{vuln.severity}</span>
                            </div>
                            <p>{vuln.description}</p>
                            {vuln.line_number && <p><strong>Line:</strong> {vuln.line_number}</p>}
                            {vuln.code_snippet && <pre><code>{vuln.code_snippet}</code></pre>}
                            <p><strong>Recommendation:</strong> {vuln.recommendation}</p>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

export default AuditDetailsPage;
