import React, { useState } from 'react';
import { sendResume } from '../services/api';

const UploadForm = () => {
    const [emailFile, setEmailFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [manualEmails, setManualEmails] = useState("");
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resume) return alert("Resume PDF is mandatory!");

        const formData = new FormData();
        if (emailFile) formData.append('emailListFile', emailFile);
        formData.append('resumePDF', resume);
        formData.append('manualEmails', manualEmails);
        formData.append('customMessage', message);
        formData.append('subject', subject);

        setLoading(true);
        try {
            const { data } = await sendResume(formData);
            setResults(data);
        } catch (error) {
            alert(error.response?.data?.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Upload List (PDF, Docx, TXT, PPT)</label>
                    <div className="file-input-wrapper">
                        <input type="file" onChange={(e) => setEmailFile(e.target.files[0])} />
                    </div>
                </div>

                <div className="input-group">
                    <label>OR Paste Emails Manually</label>
                    <textarea
                        className="glass-input"
                        placeholder="test1@hr.com, test2@company.com..."
                        value={manualEmails}
                        onChange={(e) => setManualEmails(e.target.value)}
                        rows="3"
                    />
                </div>

                <div className="input-row">
                    <div className="input-group">
                        <label>Resume (PDF Only)</label>
                        <div className="file-input-wrapper">
                            <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Subject</label>
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="Email Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Message</label>
                    <textarea
                        className="glass-input"
                        placeholder="Write your message here..."
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
                        {loading ? "Sending emails..." : "Submit"}
                    </button>
                </div>
            </form>

            {loading && <div className="status-msg">Processing request...</div>}

            {results && (
                <div className="results-card">
                    <h3>Processed {results.total} emails</h3>
                </div>
            )}
        </div>
    );
};

export default UploadForm;