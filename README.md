# 📬 AutoMailer

> Automated bulk email sender that extracts email addresses from files and sends personalized emails with resume attachments.

---

## ✨ Features

- 📄 Extract emails from PDF, DOCX, TXT files
- 📧 Send bulk emails with resume attachment
- ✍️ Paste emails manually as an alternative
- 🔐 Secure backend with Node.js & Express
- ⚡ Async processing with retry mechanism
- 🖥️ Clean React frontend

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React.js, Axios, CSS |
| Backend | Node.js, Express.js, Nodemailer, Multer |
| Tools | Git, Postman |

---

## 📁 Project Structure

```
AutoMailer/
├── Backend/
│   ├── controllers/
│   │   └── emailController.js
│   ├── routes/
│   │   └── emailRoutes.js
│   ├── utils/
│   │   ├── mailer.js
│   │   └── fileParser.js
│   ├── .env
│   └── server.js
│
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   └── UploadForm.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    └── index.html
```

---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/LeadWithAnkit/AutoMailer.git
cd AutoMailer
```

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:

```env
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password
```

> ⚠️ Use a **Google App Password**, not your regular Gmail password.
> Get one here → [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

Start the backend:

```bash
npm start
```

Backend runs on → `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file inside `Frontend/`:

```env
VITE_API_URL=http://localhost:5000/api/emails
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on → `http://localhost:5173`

---

## 🔗 API Endpoint

```
POST /api/emails/send
```

| Field | Type | Description |
|-------|------|-------------|
| `emailListFile` | File | PDF / DOCX / TXT containing emails |
| `resumePDF` | File | Resume to attach (PDF only) |
| `manualEmails` | String | Comma-separated emails (optional) |
| `subject` | String | Email subject line |
| `customMessage` | String | Email body text |

---

## 🧪 How It Works

1. Upload a file with emails **or** paste them manually
2. Upload your resume (PDF)
3. Enter subject and message
4. Click **Send Emails**
5. Results show sent ✔ and failed ✘ per email

---

## ⚠️ Important Notes

- Must use **Google App Password** — regular Gmail password won't work
- Works best on **localhost** — free hosting tiers block SMTP ports
- Avoid sending to 100+ emails at once due to Gmail rate limits

---

## 👨‍💻 Author

**Ankit Kumar Tiwari**
📧 [ankitiwari008@gmail.com](mailto:ankitiwari008@gmail.com)
💼 [LinkedIn](https://www.linkedin.com/in/ankit-kumar-tiwari08/)
💻 [GitHub](https://github.com/LeadWithAnkit)

---

⭐ If you found this useful, give it a star on GitHub!
