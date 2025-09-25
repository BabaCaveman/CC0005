import React, { useState, useEffect } from 'react';
import { VideoLearningModule } from './components/VideoLearning';
import { Breadcrumbs } from './components/UI/Breadcrumbs';
import { LessonNavigation } from './components/UI/LessonNavigation';
import { HelpSupport } from './components/UI/HelpSupport';
import { UserPreferences } from './types';

interface Lesson {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  chapters: Array<{
    id: string;
    title: string;
    startTime: number;
    endTime: number;
    description?: string;
  }>;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: 'Understanding Diabetes',
    description: 'Learn the fundamentals of diabetes management and how to take control of your health.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    chapters: [
      {
        id: 'ch1-1',
        title: 'What is Diabetes?',
        startTime: 0,
        endTime: 90,
        description: 'Understanding what diabetes means for your health'
      },
      {
        id: 'ch1-2',
        title: 'Types of Diabetes',
        startTime: 90,
        endTime: 180,
        description: 'Learning about Type 1, Type 2, and gestational diabetes'
      },
      {
        id: 'ch1-3',
        title: 'Why Management Matters',
        startTime: 180,
        endTime: 300,
        description: 'The importance of daily diabetes care for your wellbeing'
      }
    ]
  },
  {
    id: 2,
    title: 'Blood Sugar Monitoring',
    description: 'Master the essential skill of checking and tracking your blood glucose levels.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    chapters: [
      {
        id: 'ch2-1',
        title: 'Using a Blood Glucose Meter',
        startTime: 0,
        endTime: 120,
        description: 'Step-by-step guide to testing your blood sugar'
      },
      {
        id: 'ch2-2',
        title: 'When to Test',
        startTime: 120,
        endTime: 210,
        description: 'Understanding the best times to check your levels'
      },
      {
        id: 'ch2-3',
        title: 'Recording Your Results',
        startTime: 210,
        endTime: 360,
        description: 'Keeping track of your readings for better health'
      }
    ]
  },
  {
    id: 3,
    title: 'Healthy Eating for Diabetes',
    description: 'Discover delicious and nutritious meal planning strategies for better blood sugar control.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    chapters: [
      {
        id: 'ch3-1',
        title: 'The Diabetes Plate Method',
        startTime: 0,
        endTime: 120,
        description: 'Simple portion control using the plate method'
      },
      {
        id: 'ch3-2',
        title: 'Smart Carbohydrate Choices',
        startTime: 120,
        endTime: 240,
        description: 'Choosing the right carbs for stable blood sugar'
      },
      {
        id: 'ch3-3',
        title: 'Meal Planning Tips',
        startTime: 240,
        endTime: 360,
        description: 'Practical strategies for planning healthy meals'
      }
    ]
  }
];

function App() {
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'large',
    theme: 'light',
    playbackSpeed: 1,
    captionsEnabled: true,
    autoPlay: false
  });
  const [lessonProgress, setLessonProgress] = useState<Record<number, boolean>>({});
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  // Auto-save preferences and progress to localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('learningPreferences');
    const savedProgress = localStorage.getItem('lessonProgress');
    const savedCurrentLesson = localStorage.getItem('currentLessonId');

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error('Error loading saved preferences');
      }
    }

    if (savedProgress) {
      try {
        setLessonProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Error loading saved progress');
      }
    }

    if (savedCurrentLesson) {
      setCurrentLessonId(parseInt(savedCurrentLesson, 10));
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('learningPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('lessonProgress', JSON.stringify(lessonProgress));
  }, [lessonProgress]);

  useEffect(() => {
    localStorage.setItem('currentLessonId', currentLessonId.toString());
  }, [currentLessonId]);

  const currentLesson = lessons.find(lesson => lesson.id === currentLessonId) || lessons[0];

  const handlePreferencesChange = (newPreferences: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const handleProgress = (progress: number) => {
    console.log('Video progress:', progress);
    // Auto-save progress
    if (progress >= 90) { // Consider completed at 90%
      setIsVideoCompleted(true);
    }
  };

  const handleComplete = () => {
    console.log('Video completed!');
    setIsVideoCompleted(true);
    setLessonProgress(prev => ({ ...prev, [currentLessonId]: true }));

    // Show completion message
    setTimeout(() => {
      alert('🎉 Congratulations! You have completed this lesson. You can now proceed to the next lesson.');
    }, 500);
  };

  const handleNextLesson = () => {
    if (currentLessonId < lessons.length && isVideoCompleted) {
      const confirmed = window.confirm(
        'Are you ready to move to the next lesson? Your progress has been saved.'
      );
      if (confirmed) {
        setCurrentLessonId(prev => prev + 1);
        setIsVideoCompleted(false);
      }
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonId > 1) {
      const confirmed = window.confirm(
        'Go back to the previous lesson? Your current progress will be saved.'
      );
      if (confirmed) {
        setCurrentLessonId(prev => prev - 1);
        setIsVideoCompleted(lessonProgress[currentLessonId - 1] || false);
      }
    }
  };

  return (
    <div className={`app ${preferences.theme}`} data-font-size={preferences.fontSize} data-theme={preferences.theme}>
      <HelpSupport />

      <Breadcrumbs
        currentLesson={currentLessonId}
        totalLessons={lessons.length}
        lessonTitle={currentLesson.title}
      />

      <main className="app-main">
        <VideoLearningModule
          videoUrl={currentLesson.videoUrl}
          title={currentLesson.title}
          description={currentLesson.description}
          chapters={currentLesson.chapters}
          preferences={preferences}
          onPreferencesChange={handlePreferencesChange}
          onProgress={handleProgress}
          onComplete={handleComplete}
        />

        <LessonNavigation
          currentLesson={currentLessonId}
          totalLessons={lessons.length}
          onPreviousLesson={handlePreviousLesson}
          onNextLesson={handleNextLesson}
          isVideoCompleted={isVideoCompleted}
        />
      </main>

      <footer className="app-footer">
        <p>🏥 Need help? Call 1-800-DIABETES (1-800-342-2383) | Progress is automatically saved</p>
        <p><small>Lesson {currentLessonId} of {lessons.length} • {lessonProgress[currentLessonId] ? 'Completed' : 'In Progress'}</small></p>
        <p><small>⚠️ This educational content does not replace professional medical advice. Always consult your healthcare provider.</small></p>
      </footer>
    </div>
  );
}

export default App;