# AI Tutor - Personalized Learning Assistant

An intelligent tutoring system that provides personalized learning experiences using AI. The application adapts to each student's level and provides interactive learning sessions across various subjects.

## 🌟 Features

- **Personalized Learning**: Adapts to student's knowledge level and learning pace
- **Multi-Subject Support**: Covers various academic subjects
- **Interactive Q&A**: Real-time question answering and explanations
- **Progress Tracking**: Monitor learning progress and performance
- **Difficulty Levels**: Adjustable difficulty settings (Beginner, Intermediate, Advanced)
- **Instant Feedback**: Immediate response and evaluation of answers
- **Helpful Hints**: Contextual hints when students need assistance

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: 
  - Framer Motion (animations)
  - Heroicons
- **AI Integration**: Hugging Face API (FLAN-T5-Large model)
- **Development Tools**:
  - Turbopack
  - ESLint
  - Prettier

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Hugging Face account and API token

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-tutor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Add your Hugging Face API token
   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
ai-tutor/
├── app/                    # Next.js 13+ app directory
├── src/
│   ├── components/         # React components
│   ├── services/          # API and service functions
│   └── store/             # Zustand store
├── public/                # Static files
└── ...config files
```

## 💡 Key Components

- **TutorInterface**: Main chat interface for student-AI interaction
- **SubjectSelector**: Subject and difficulty level selection
- **ProgressDashboard**: Student progress tracking
- **AIService**: Handles AI model integration and responses

## 🔒 Environment Variables

```env
NEXT_PUBLIC_HF_API_TOKEN=your-huggingface-token-here
```

## 🎯 Future Scope

- Add support for more subjects and specialized topics
- Implement user authentication and profile management
- Add support for file uploads (e.g., images, PDFs)
- Integrate more AI models for specialized subjects
- Add voice interaction capabilities
- Implement peer learning features
- Add support for multiple languages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Hugging Face for providing the AI model API
- All contributors and users of this project
