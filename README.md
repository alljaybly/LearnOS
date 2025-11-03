# LearnOS: AI Study Companion

**LearnOS** is an innovative AI-powered study companion designed to transform your study materials into interactive and personalized learning experiences. Paste any text—from class notes to dense articles—and let LearnOS generate comprehensive study guides, practice quizzes, and structured study plans to help you learn smarter, not harder.

## ✨ Key Features

-   **🤖 AI-Powered Study Guides**: Automatically generates a concise summary, identifies key concepts with simple explanations, and creates unique text-based visual aids (ASCII diagrams) to simplify complex topics.
-   **📝 Personalized Quizzes**: Creates a variety of quiz questions (multiple-choice, true/false, fill-in-the-blank) based on your study material to test your knowledge and reinforce learning.
-   **📸 Photo Study Planner (OCR)**: Snap a picture of your textbook or handwritten notes, and LearnOS will use OCR to extract the text and generate a structured, day-by-day study plan with clear objectives and time estimates.
-   **📊 Progress Analytics**: Tracks your quiz performance over time. Review your history, see your scores, and identify areas where you need more focus.
-   **🔗 Shareable Content**: Easily share your generated study guides with classmates or study groups via a unique, shareable link.
-   **🌐 Offline-First PWA**: Works offline as a Progressive Web App (PWA), ensuring you can access your study materials anytime, anywhere, without an internet connection.
-   **🔒 Privacy-Focused**: Your study material is processed to generate guides and quizzes and is not stored long-term.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/gemini-api) (`@google/genai`)
-   **OCR**: [Tesseract.js](https://tesseract.projectnaptha.com/) for client-side text recognition.
-   **PWA**: Service Workers for offline caching and a Web App Manifest for installability.

## 🚀 Getting Started

Using LearnOS is simple and intuitive:

1.  **Navigate to the Dashboard**: Paste your study material into the main text area.
2.  **Generate a Guide**: Click the "Generate Study Guide" button. The AI will process your text and create a detailed study guide and an initial quiz.
3.  **Study & Quiz**: Review the summary, key concepts, and visual aids. When you're ready, take the quiz to test your comprehension.
4.  **Use the Photo Planner**: Go to the "Photo Scan" tab. Upload or scan an image of your notes. The app will extract the text and build a multi-day study plan.
5.  **Track Your Progress**: Visit the "Progress" tab to see your quiz history and average scores.

## 📁 File Structure

The project is organized with a clear and scalable structure:

```
/
├── public/
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── Header.tsx
│   │   ├── OcrStudyPlanner.tsx
│   │   ├── Quiz.tsx
│   │   └── ...
│   ├── services/
│   │   └── geminiService.ts   # Handles all Gemini API interactions
│   ├── App.tsx                # Main application component and state management
│   ├── index.tsx              # React app entry point
│   └── types.ts               # Centralized TypeScript types
├── index.html
└── README.md
```

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features, bug fixes, or improvements, please feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Open a Pull Request.

## 📜 License

This project is licensed under the MIT License.
