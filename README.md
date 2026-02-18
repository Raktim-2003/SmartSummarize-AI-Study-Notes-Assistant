# 🧠 SmartSummarize – AI Study Notes Assistant

> Transform long study notes into clear, structured summaries using Google Gemini AI.

SmartSummarize is a modern AI-powered SaaS web app built with **React, TypeScript, and Gemini AI**. It helps students and developers instantly summarize large text into concise, readable formats with a beautiful, production-level UI.

---

## ✨ Features

* 📝 Paste or type notes for instant summarization
* 🎤 Voice input support (Web Speech API)
* 📂 Upload `.txt` and `.md` files
* 🧠 Multiple summary styles:

  * Concise
  * Detailed
  * Bullet Points
  * Explain Like a Teacher
* 📊 Summary analytics:

  * Word count
  * Character count
  * Reduction %
  * Reading time
* 💾 Session history (localStorage)
* 📥 Export options:

  * Copy to clipboard
  * Download as `.txt`
  * Export as `.png`
* ⚡ Typing animation effect
* 🌙 Modern dark SaaS UI
* 📱 Fully responsive

---

## 🛠 Tech Stack

**Frontend**

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion

**AI Integration**

* Google Gemini API (`gemini-1.5-flash` / `gemini-3-flash-preview`)

**Libraries**

* html2canvas
* react-type-animation
* lucide-react

---

## 📸 Screenshots

<img width="1400" alt="SmartSummarize Screenshot" src="your-screenshot-link-here">

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/smartsummarize.git
cd smartsummarize
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create:

```
.env.local
```

Add your Gemini API key:

```
VITE_GEMINI_API_KEY=your_api_key_here
```

Get API key from:

https://aistudio.google.com/app/apikey

---

### 4. Run the dev server

```bash
npm run dev
```

Open:

```
http://localhost:8000
```

---

## 🧠 How it works

1. User inputs notes
2. App sends request to Gemini API
3. AI generates structured summary
4. Result displayed with typing animation
5. User can export or save

---

## 📁 Project Structure

```
smartsummarize/

components/
pages/
services/
App.tsx
index.tsx
.env.local
```

---

## 🚀 Deployment

You can deploy on:

* Vercel
* Netlify
* Firebase Hosting

---

## 💡 Use Cases

* Student study assistant
* Research summarization
* Blog summarization
* Documentation summarization

---

## 👨‍💻 Author

**Raktim Mondal**

* GitHub: https://github.com/Raktim-2003
* Portfolio: (add your portfolio link)

---

## ⭐ Show your support

If you like this project:

Give a ⭐ on GitHub

---

## 🪄 Future Improvements

* PDF support
* Multi-language summaries
* Cloud sync
* User authentication

---

## 📄 License

MIT License
