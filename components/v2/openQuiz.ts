// Shared trigger for the "Get My Cash Offer" action. Scrolls to the form
// AND broadcasts an event that QuizCard listens for to flip from the intro
// offer-card panel to the SurveyCard. Wire this to any CTA on the page so
// the behavior is consistent.
export const START_QUIZ_EVENT = "ochb:start-quiz"

export function openQuiz() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(START_QUIZ_EVENT))
  // Small defer so the SurveyCard mounts before the scroll lands on it.
  requestAnimationFrame(() => {
    document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth", block: "start" })
  })
}
