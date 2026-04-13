import React, { useState } from 'react';
import { sendResume } from '../services/api';

const UploadForm = () => {
    const [emailFile, setEmailFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [manualEmails, setManualEmails] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resume) return alert('Resume PDF is mandatory!');
        if (!manualEmails && !emailFile) return alert('Please provide at least one email or upload a file.');

        const formData = new FormData();
        if (emailFile) formData.append('emailListFile', emailFile);
        formData.append('resumePDF', resume);
        formData.append('manualEmails', manualEmails);
        formData.append('customMessage', message);
        formData.append('subject', subject);

        setLoading(true);
        setResults(null);
        setError('');

        try {
            const { data } = await sendResume(formData);
            setResults(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Upload Email List (PDF, Docx, TXT)</label>
                    <div className="file-input-wrapper">
                        <input type="file" accept=".pdf,.docx,.doc,.txt"
                            onChange={(e) => setEmailFile(e.target.files[0])} />
                    </div>
                    {emailFile && <p style={{ fontSize: '12px', color: '#aaa', marginTop: 4 }}>📎 {emailFile.name}</p>}
                </div>

                <div className="input-group">
                    <label>OR Paste Emails Manually</label>
                    <textarea
                        className="glass-input"
                        placeholder="hr@company.com, recruiter@firm.com..."
                        value={manualEmails}
                        onChange={(e) => setManualEmails(e.target.value)}
                        rows="3"
                    />
                </div>

                <div className="input-row">
                    <div className="input-group">
                        <label>Resume (PDF Only) *</label>
                        <div className="file-input-wrapper">
                            <input type="file" accept=".pdf"
                                onChange={(e) => setResume(e.target.files[0])} />
                        </div>
                        {resume && <p style={{ fontSize: '12px', color: '#aaa', marginTop: 4 }}>📎 {resume.name}</p>}
                    </div>

                    <div className="input-group">
                        <label>Subject</label>
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="Job Application – Your Name"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Message</label>
                    <textarea
                        className="glass-input"
                        placeholder="Dear Hiring Manager, I am writing to express..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="4"
                    />
                </div>

                <div className="form-footer">
                    <p className="consent">
                        By submitting, you agree to our <strong>Terms</strong> and <strong>Privacy Policy</strong>.
                    </p>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Sending emails...' : 'Send Emails'}
                    </button>
                </div>
            </form>

            {loading && (
                <div className="status-msg">
                     Processing... This may take a moment depending on the number of emails.
                </div>
            )}

            {error && (
                <div className="status-msg" style={{ color: '#ff6b6b', marginTop: 16 }}>
                    error X {error}
                </div>
            )}

            {results && (
                <div className="results-card">
                    <h3> Done — {results.total} email{results.total !== 1 ? 's' : ''} processed</h3>
                    <p style={{ color: '#4ade80' }}>✔ Sent: {results.sent}</p>
                    <p style={{ color: '#f87171' }}>✘ Failed: {results.failed}</p>
                    {results.results?.filter(r => r.status === 'failed').map((r, i) => (
                        <p key={i} style={{ fontSize: '12px', color: '#f87171' }}>
                            ✘ {r.email}: {r.error}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UploadForm;
