<template>
  <div class="faq-page">
    <div class="faq-container">
      <h1 class="faq-title">Frequently Asked Questions</h1>

      <div class="faq-layout">
        <!-- Левая колонка с вопросами -->
        <main class="faq-content">
          <section
            v-for="item in faqItems"
            :key="item.id"
            :id="item.id"
            class="faq-item"
          >
            <h2 class="faq-question">{{ item.question }}</h2>
            <div class="faq-answer" v-html="item.answer"></div>
          </section>

          <!-- FAQ Footer -->
          <div class="faq-footer">
            <p class="faq-footer-copyright">© 2025 Skillgig. All rights reserved.</p>
            <div class="faq-footer-contacts">
              <p class="faq-footer-contact-item">
                <span class="faq-footer-label">Phone:</span>
                <span class="faq-footer-value">8776 603 10 92</span>
              </p>
              <p class="faq-footer-contact-item">
                <span class="faq-footer-label">Email:</span>
                <a href="mailto:damirrakhymberdi662@gmail.com" class="faq-link">damirrakhymberdi662@gmail.com</a>
              </p>
            </div>
          </div>
        </main>

        <!-- Правая колонка с содержанием - FIXED -->
        <aside class="faq-sidebar">
          <div class="sidebar-sticky">
            <h3 class="sidebar-title">СОДЕРЖАНИЕ</h3>
            <nav class="sidebar-nav">
              <a
                v-for="item in faqItems"
                :key="item.id"
                :href="`#${item.id}`"
                :class="{ 'active-question': activeId === item.id }"
                class="sidebar-link"
                @click.prevent="scrollToQuestion(item.id)"
              >
                {{ item.question }}
              </a>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeId = ref('')

const faqItems = ref([
  {
    id: 'what-is-skillgig-it',
    question: 'What is SkillGig IT?',
    answer: 'SkillGig IT is a comprehensive platform designed to connect people facing IT challenges with experienced professionals who can help solve them. Whether you\'re struggling with a bug in your web application, need design advice for your mobile app, or require assistance with backend optimization, our community of developers is here to assist you completely free of charge.<br><br>We support all major IT categories including Web Development, Mobile Development, UI/UX Design, Backend/Database, AI/ML, DevOps/Infrastructure, Game Development, and Security/Blockchain. The platform operates on a simple principle: knowledge sharing and mutual support within the IT community.'
  },
  {
    id: 'how-does-platform-work',
    question: 'How does the platform work?',
    answer: 'The platform works through a straightforward four-step process. First, you post your question by describing your IT problem in detail, including relevant code snippets, error messages, screenshots, and what you\'ve already tried. Second, multiple experts from our community review your question and submit their proposed solutions, often within hours. Third, you review all the answers, check the experts\' profiles and ratings, and choose the solution that seems most appropriate for your problem.<br><br>Once you select an answer, a private chat automatically opens between you and the chosen expert. You work together with the expert through the chat to implement the solution, and once your problem is solved, you mark the question as resolved and rate the expert\'s help. This creates a transparent and quality-driven ecosystem where good helpers get recognized.'
  },
  {
    id: 'is-skillgig-really-free',
    question: 'Is SkillGig really free?',
    answer: 'Yes, SkillGig IT is currently 100% free to use for both clients asking questions and experts providing answers. We believe that knowledge should be accessible to everyone, especially in the rapidly evolving IT field. Our primary goal at this stage is to build a strong, helpful community of developers who support each other.<br><br>There are no hidden fees, subscription costs, or charges for posting questions or receiving answers. In the future, we may introduce optional premium features or paid consultations for extremely complex problems, but the core platform will always remain free. We\'re committed to keeping the barrier to entry low so that students, freelancers, and developers at any stage of their career can benefit.'
  },
  {
    id: 'who-can-use-skillgig',
    question: 'Who can use SkillGig IT?',
    answer: 'SkillGig IT is designed for two main groups of users. First, clients or problem-solvers: this includes anyone facing challenges in their IT projects, whether you\'re a student working on a personal project, a freelance developer stuck on a bug, a startup founder needing technical advice, or an individual developer exploring new technologies. You don\'t need to be an expert to ask questions.<br><br>Second, experts or helpers: these are experienced developers who want to give back to the community. If you have knowledge in web development, mobile app creation, UI/UX design, backend systems, or DevOps, you can register as an expert and start answering questions. Even if you have just one or two years of experience, you likely have valuable insights that could help someone else.'
  },
  {
    id: 'what-questions-can-i-ask',
    question: 'What kind of questions can I ask?',
    answer: 'You can ask questions about virtually any IT-related problem you\'re facing in your own projects. This includes website bugs like broken layouts or JavaScript errors, mobile application problems such as performance issues or navigation bugs, design questions seeking feedback on UI/UX or color schemes, backend challenges like API design or database optimization, and DevOps issues including Docker setup or CI/CD pipelines.<br><br>The key requirement is that your question should be about a real problem in a project you\'re actually working on. You should provide context, show what you\'ve tried, and be specific about where you\'re stuck. Questions about game development, AI/ML integration, and security concerns are also welcome.'
  },
  {
    id: 'what-questions-not-allowed',
    question: 'What questions are NOT allowed?',
    answer: 'We strictly prohibit questions that violate academic integrity. This means you cannot ask for help with homework assignments, laboratory work, course projects that are meant to be completed individually, exam questions, or any academic work where you\'re expected to demonstrate your own learning.<br><br>For example, asking "Please create a complete to-do app for me because it\'s my lab assignment" is not allowed. Similarly, "Write my Python exam code" or "Build my entire course project" are prohibited. The reason is simple: academic work is designed to help you learn. However, if you\'re working on your own personal project outside of academic requirements, that\'s perfectly acceptable.'
  },
  {
    id: 'how-write-good-question',
    question: 'How do I write a good question?',
    answer: 'Writing a good question significantly increases your chances of getting helpful answers quickly. Start with a specific, descriptive title that summarizes the problem, like "React mobile menu doesn\'t open in Chrome but works in Safari" rather than just "Menu broken". In the description, explain what you\'re trying to achieve, what\'s currently happening instead, and what you\'ve already tried to fix it.<br><br>Include relevant code snippets, but don\'t paste your entire codebase. Show the specific function or component where the issue occurs. If possible, provide a GitHub repository link or CodePen demo. Add screenshots or screen recordings of the error. Select the correct category and add relevant technology tags. Finally, indicate the difficulty level honestly.'
  },
  {
    id: 'how-long-answers',
    question: 'How long does it take to get answers?',
    answer: 'Response time varies based on several factors including question complexity, time of day, and popularity of the technology. For simple, clearly explained questions about popular technologies like React, Vue, or Flutter, you can often receive initial answers within 30 minutes to 2 hours. Medium complexity questions typically get responses within 2 to 12 hours.<br><br>Complex architectural questions or problems involving less common technologies might take 12 to 24 hours. Keep in mind that our community of experts is spread across different time zones. If your question hasn\'t received answers within 24 hours, consider editing it to add more details, as sometimes questions don\'t get answered because they\'re unclear.'
  },
  {
    id: 'what-if-multiple-answers',
    question: 'What if I get multiple answers?',
    answer: 'Receiving multiple answers is actually a good sign. Take your time to review each answer carefully. First, read through each solution to understand the approach being suggested. Second, check each expert\'s profile to see their rating and experience level. Third, consider the quality of the answer itself: Is it detailed? Does it include code examples? Does it address the root cause?<br><br>You\'re not obligated to choose the first answer or the one from the highest-rated expert. Choose the answer that makes the most sense for your specific situation. Once you select an answer, a private chat opens with that expert, but if their solution doesn\'t work out, you can go back and try another expert\'s approach.'
  },
  {
    id: 'can-edit-delete-question',
    question: 'Can I edit or delete my question?',
    answer: 'Yes, you have control over your questions with some reasonable limitations. To edit a question, simply go to the question page and click the "Edit" button, which is only visible to you as the question author. You can modify the title, description, add more code or screenshots, update tags, or clarify any confusion.<br><br>Regarding deletion, you can delete your own questions using the "Delete" button on the question page. However, once experts have submitted answers and invested their time, deletion may be restricted to preserve that community effort. If you really need to delete a question with answers, contact our support team with a valid reason.'
  },
  {
    id: 'how-register-as-expert',
    question: 'How do I register as an expert?',
    answer: 'Registering as an expert is quick and straightforward. Start by clicking the "Register" button on the homepage. When prompted, select "I want to help others" to indicate you\'re registering as an expert. You\'ll need to fill out your basic profile information including your full name and email.<br><br>Then select your primary specialty from options like Frontend Developer, Backend Developer, Mobile Developer, UI/UX Designer, or DevOps Engineer. Indicate your years of experience and add your skills using hashtags like #React #Vue #JavaScript. Write a brief bio explaining your background. Finally, add links to your GitHub, LinkedIn, or Behance profiles. Once submitted, you can immediately start answering questions.'
  },
  {
    id: 'requirements-to-become-expert',
    question: 'What are the requirements to become an expert?',
    answer: 'We intentionally keep the requirements minimal because we believe that even developers with limited experience have valuable knowledge to share. There\'s no certification exam, no minimum years of experience required, and no approval process. The main requirements are: you should have genuine knowledge in at least one area of IT, be willing to explain concepts clearly and patiently, and commit to being respectful in all interactions.<br><br>While not required, having a portfolio like GitHub repositories or previous projects greatly helps establish your credibility. Your reputation on SkillGig IT will ultimately be determined by the quality of answers you provide and the ratings you receive from clients. Start with easier questions if you\'re newer to being an expert, and gradually take on more complex problems.'
  },
  {
    id: 'do-i-get-paid',
    question: 'Do I get paid for answering questions?',
    answer: 'Currently, SkillGig IT operates on a free, volunteer basis, meaning experts do not receive direct monetary payment for answering questions. However, there are significant non-monetary benefits. First, you build a strong public reputation through ratings and reviews. Second, you develop your own knowledge, as teaching is one of the best ways to deepen understanding. Third, you build a portfolio of solved problems.<br><br>Fourth, you make valuable connections within the developer community. Fifth, there\'s intrinsic satisfaction in helping others succeed. In the future, we may introduce optional paid consultations for highly complex problems, but for now, think of SkillGig IT as community service that pays dividends in reputation and learning.'
  },
  {
    id: 'how-many-questions-can-answer',
    question: 'How many questions can I answer?',
    answer: 'You can answer as many questions as you want with no limits. The more you help, the higher your reputation grows on the platform. However, we encourage quality over quantity. It\'s better to provide fewer excellent, detailed answers than many rushed, incomplete ones.<br><br>Focus on questions where you have genuine expertise and can provide real value. Don\'t feel pressured to answer questions outside your comfort zone. As you build confidence and see the positive impact of your help, you\'ll naturally want to contribute more to the community.'
  },
  {
    id: 'how-rating-calculated',
    question: 'How is my rating calculated?',
    answer: 'Your rating is calculated using a straightforward average system. After you help solve a problem, the client rates their experience with you on a scale of 1 to 5 stars. Your overall rating is the sum of all star ratings divided by the total number of ratings. For example, if you\'ve received 5, 4, 5, 5, and 3 stars from five clients, your rating would be 4.4 stars.<br><br>Your profile also displays the total number of problems you\'ve solved, your success rate percentage, and a breakdown by category showing expertise areas. Clients often look at these metrics when choosing which expert\'s answer to select, so maintaining high quality is important. A few lower ratings won\'t ruin your reputation if you have many high ratings overall.'
  },
  {
    id: 'how-chat-works',
    question: 'How does the chat work?',
    answer: 'The chat feature is the heart of collaboration on SkillGig IT. After you submit an answer, if the client chooses your solution, a private chat channel automatically opens between you two. You\'ll receive a notification letting you know. The chat operates in real-time, meaning messages appear instantly without refreshing.<br><br>You can send text messages, upload files up to 10MB, share code snippets with syntax highlighting, and see read receipts. One important rule: all communication must stay within the chat. Sharing external contact information like phone numbers or social media is prohibited for safety. The chat remains accessible even after the problem is solved, allowing for follow-up questions.'
  },
  {
    id: 'is-my-data-safe',
    question: 'Is my data safe?',
    answer: 'Yes, we take data security very seriously and implement multiple layers of protection. All passwords are hashed using bcrypt, meaning we never store your actual password. All communication uses HTTPS encryption. We use JWT tokens for secure authentication. We regularly update our dependencies and conduct security audits.<br><br>We follow GDPR principles regarding data collection. We only collect data necessary for the platform to function, we never sell your personal information to third parties, and we don\'t share your email address publicly. User-generated content is sanitized to prevent malicious code injection. We encourage users to use strong, unique passwords and be cautious about what personal information they include in questions or answers.'
  }
])

let observer = null

onMounted(() => {
  // Настройка Intersection Observer
  const options = {
    root: null,
    rootMargin: '-100px 0px -60% 0px',
    threshold: 0.1
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeId.value = entry.target.id
      }
    })
  }, options)

  // Наблюдаем за всеми вопросами
  faqItems.value.forEach((item) => {
    const element = document.getElementById(item.id)
    if (element) {
      observer.observe(element)
    }
  })

  // Устанавливаем первый вопрос как активный при загрузке
  if (faqItems.value.length > 0) {
    activeId.value = faqItems.value[0].id
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const scrollToQuestion = (id) => {
  const element = document.getElementById(id)
  if (element) {
    const yOffset = -100
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
    
    // Обновляем активный ID
    setTimeout(() => {
      activeId.value = id
    }, 500)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sofia+Sans:wght@300;400;500;600;700;800;900&display=swap');

.faq-page {
  min-height: 100vh;
  background: #F5F7FA;
  color: #ffffff;
  font-family: 'Sofia Sans', Arial, Helvetica, sans-serif;
  padding: 9rem 5rem;
}

.faq-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.faq-title {
  font-size: 3rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 4rem 0;
  line-height: 1.2;
  border-bottom: 1px solid rgba(15, 174, 31, 0.982);
  padding-bottom: 2rem;
  width: 68.8%;
}

.faq-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  align-items: start;
  position: relative;
}

/* Левая колонка - Контент (СКРОЛЛИТСЯ) */
.faq-content {
  max-width: 900px;
}

.faq-item {
  margin-bottom: 4rem;
  scroll-margin-top: 120px;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(15, 174, 31, 0.982);
}


.faq-item:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.faq-question {
  font-size: 2rem;
  font-weight: 600;
  color: #000000;
  margin: 0 0 1.5rem 0;
  line-height: 1.3;
}

.faq-answer {
  font-size: 1.125rem;
  line-height: 1.3;
  color: #4D4D4D;
}

.faq-answer :deep(.faq-link) {
  color: #42b883;
  text-decoration: none;
  transition: color 0.3s ease;
}

.faq-answer :deep(.faq-link:hover) {
  color: #35a372;
  text-decoration: underline;
}

/* FAQ Footer */
.faq-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 83, 23, 0.477);
}

.faq-footer-copyright {
  font-size: 0.9rem;
  color: #888888;
  margin: 0 0 1rem 0;
}

.faq-footer-contacts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-footer-contact-item {
  font-size: 0.9rem;
  color: #000000;
  margin: 0;
  display: flex;
  gap: 0.5rem;
}

.faq-footer-label {
  font-weight: 500;
  color: #000000;
}

.faq-footer-value {
  color: #4D4D4D;
}

.faq-footer-contact-item .faq-link {
  color: #42b883;
  text-decoration: none;
  transition: color 0.3s ease;
}

.faq-footer-contact-item .faq-link:hover {
  color: #35a372;
  text-decoration: underline;
}

/* Правая колонка - Содержание (НЕ СКРОЛЛИТСЯ - FIXED) */
.faq-sidebar {
  width: 300px;
  position: relative;
}

.sidebar-sticky {
  position: fixed;
  top: 120px;
  width: 300px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding-right: 1rem;
}

/* Кастомный скроллбар для sidebar */
.sidebar-sticky::-webkit-scrollbar {
  width: 4px;
}

.sidebar-sticky::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.sidebar-sticky::-webkit-scrollbar-thumb {
  background: rgba(66, 184, 131, 0.3);
  border-radius: 4px;
}

.sidebar-sticky::-webkit-scrollbar-thumb:hover {
  background: rgba(66, 184, 131, 0.5);
}

.sidebar-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 1.5rem 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0rem;
}

.sidebar-link {
  font-size: 0.85rem;
  color: #4D4D4D;
  text-decoration: none;
  padding: 0.2rem 0;
  padding-left: 0;
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  line-height: 1.3;
  cursor: pointer;
  display: block;
  font-weight: 600;
}

.sidebar-link:hover {
  color: #4D4D4D;
  padding-left: 8px;
}

.sidebar-link.active-question {
  border-left-color: #42b883;
  padding-left: 10px;
  color: #000000;
  font-weight: 500;
  border-radius: 2px;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .faq-layout {
    grid-template-columns: 1fr 260px;
    gap: 3rem;
  }

  .faq-sidebar {
    width: 260px;
  }
}

@media (max-width: 968px) {
  .faq-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .faq-sidebar {
    width: 100%;
    order: -1;
    margin-bottom: 3rem;
  }

  .sidebar-sticky {
    position: relative;
    top: 0;
    max-height: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 2rem;
    padding-right: 0;
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .sidebar-link {
    border-left: none;
    border-bottom: 2px solid transparent;
    padding-left: 0;
  }

  .sidebar-link:hover {
    padding-left: 0;
  }

  .sidebar-link.active-question {
    border-left: none;
    border-bottom-color: #42b883;
    padding-left: 0;
    padding-bottom: 0.5rem;
  }
}

@media (max-width: 768px) {
  .faq-page {
    padding: 2rem 0;
  }

  .faq-container {
    padding: 0 1.5rem;
  }

  .faq-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .faq-item {
    margin-bottom: 3rem;
    scroll-margin-top: 80px;
  }

  .faq-question {
    font-size: 1.5rem;
  }

  .faq-answer {
    font-size: 1rem;
  }

  .sidebar-nav {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .faq-container {
    padding: 0 1rem;
  }

  .faq-title {
    font-size: 2rem;
  }

  .faq-question {
    font-size: 1.375rem;
  }

  .faq-answer {
    font-size: 0.9375rem;
  }
}
</style>