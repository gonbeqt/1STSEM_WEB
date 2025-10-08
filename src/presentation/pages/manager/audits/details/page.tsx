import { useParams } from 'react-router-dom';
import { useAuditDetailsViewModel } from '../../../../hooks/useAuditDetailsViewModel';
import SideNavbar from '../../../../components/SideNavbar';
import ManagerNavbar from '../../../../components/ManagerNavbar';

const AuditDetailsPage = () => {
    const { auditId } = useParams<{ auditId: string }>();
    const { audit, vulnerabilities, isLoading, error } = useAuditDetailsViewModel(auditId || '');

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen">{error}</div>;
    }

    if (!audit) {
        return <div>Audit not found.</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <SideNavbar />
            <div className="flex-1 flex flex-col">
                <ManagerNavbar />
                <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="m-0 text-2xl font-bold">{audit.contract_name}</h1>
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold text-white bg-${audit.status.toLowerCase()}`}>
                        {audit.status}
                    </span>
                </header>

                <section className="bg-white p-6 rounded-lg mb-8 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Audit Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <strong>Risk Level:</strong> 
                            <span className={`ml-2 px-2 py-1 rounded text-sm text-white bg-${audit.risk_level?.toLowerCase()}`}>
                                {audit.risk_level}
                            </span>
                        </div>
                        <div><strong>Vulnerabilities:</strong> {audit.vulnerabilities_found}</div>
                        <div><strong>Completed:</strong> {new Date(audit.completed_at || '').toLocaleString()}</div>
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg mb-8 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Audit Report</h2>
                    <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap break-words">{audit.audit_report}</pre>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Vulnerabilities</h2>
                    {vulnerabilities.map((vuln, index) => (
                        <div key={index} className="border border-gray-200 rounded p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="m-0 text-lg font-medium">{vuln.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getSeverityClass(vuln.severity)}`}>
                                    {vuln.severity}
                                </span>
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
        </div>
    );
};

// Helper function to map severity to Tailwind classes
const getSeverityClass = (severity: string) => {
    switch (severity.toLowerCase()) {
        case 'critical': return 'bg-red-600';
        case 'high': return 'bg-orange-500';
        case 'medium': return 'bg-yellow-500';
        case 'low': return 'bg-green-500';
        case 'info': return 'bg-cyan-500';
        default: return 'bg-gray-500';
    }
};

export default AuditDetailsPage;