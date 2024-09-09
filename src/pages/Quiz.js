import React, { useState } from 'react';
import styles from '../styles/Quiz.module.css';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const questions = [
    {
      question: 'Qual é a melhor forma de ensinar um novo comando para um cão?',
      answers: [
        { text: 'Repetir o comando várias vezes em voz alta', correct: false },
        { text: 'Usar recompensas e reforço positivo', correct: true },
        { text: 'Punir o cão quando ele não obedecer', correct: false },
        { text: 'Ignorar o cão até ele entender o comando', correct: false },
      ],
    },
    {
      question: 'Como você deve agir se um cão desconhecido se aproximar de você na rua?',
      answers: [
        { text: 'Correr e gritar para assustá-lo', correct: false },
        { text: 'Fazer movimentos bruscos e encarar o cão', correct: false },
        { text: 'Ficar calmo, evitar contato visual direto e se afastar lentamente', correct: true },
        { text: 'Tentar acariciar o cão para mostrar que você é amigável', correct: false },
      ],
    },
    {
      question: 'Qual é a principal causa de problemas comportamentais em cães?',
      answers: [
        { text: 'Falta de socialização desde filhote', correct: true },
        { text: 'Alimentação inadequada', correct: false },
        { text: 'Ausência de banhos regulares', correct: false },
        { text: 'Passeios muito longos', correct: false },
      ],
    },
    {
      question: 'Como você deve introduzir um novo animal de estimação em casa quando já tem outro pet?',
      answers: [
        { text: 'Colocá-los juntos imediatamente e deixá-los se entender', correct: false },
        { text: 'Manter os animais separados e fazer introduções graduais supervisionadas', correct: true },
        { text: 'Dar mais atenção ao novo animal para que ele se sinta em casa', correct: false },
        { text: 'Ignorar o animal antigo e focar apenas no novo', correct: false },
      ],
    },
    {
      question: 'Qual é a quantidade diária recomendada de exercícios para a maioria dos cães?',
      answers: [
        { text: '10 minutos', correct: false },
        { text: '30 minutos a 1 hora', correct: true },
        { text: '2 a 3 horas', correct: false },
        { text: 'Apenas nos finais de semana', correct: false },
      ],
    },
    {
      question: 'Como você deve lidar com um cão que apresenta comportamento agressivo?',
      answers: [
        { text: 'Gritar com o cão para mostrar dominância', correct: false },
        { text: 'Ignorar o comportamento e esperar que ele pare', correct: false },
        { text: 'Procurar ajuda de um treinador ou behaviorista canino', correct: true },
        { text: 'Isolar o cão e evitar interações', correct: false },
      ],
    },
    {
      question: 'Qual é a idade ideal para iniciar o treinamento básico de obediência em cães?',
      answers: [
        { text: 'Assim que o filhote chegar em casa', correct: true },
        { text: 'Após os 6 meses de idade', correct: false },
        { text: 'Apenas quando o cão apresentar problemas comportamentais', correct: false },
        { text: 'Cães não precisam de treinamento de obediência', correct: false },
      ],
    },
    {
      question: 'Como você deve recompensar um cão durante o treinamento?',
      answers: [
        { text: 'Com petiscos saudáveis e elogios verbais', correct: true },
        { text: 'Ignorando o bom comportamento', correct: false },
        { text: 'Dando brinquedos novos a cada sessão de treinamento', correct: false },
        { text: 'Com longos abraços e beijos', correct: false },
      ],
    },
    {
      question: 'Qual é a melhor forma de lidar com a ansiedade de separação em cães?',
      answers: [
        { text: 'Nunca deixar o cão sozinho em casa', correct: false },
        { text: 'Praticar saídas curtas e aumentar gradualmente a duração', correct: true },
        { text: 'Medicá-lo antes de sair de casa', correct: false },
        { text: 'Ignorar o comportamento ansioso do cão', correct: false },
      ],
    },
    {
      question: 'Como você deve apresentar um cão a uma criança?',
      answers: [
        { text: 'Permitir que a criança abrace e beije o cão imediatamente', correct: false },
        { text: 'Ensinar a criança a respeitar o espaço do cão e interagir com calma', correct: true },
        { text: 'Manter o cão e a criança sempre separados por segurança', correct: false },
        { text: 'Incentivar a criança a puxar a cauda e as orelhas do cão', correct: false },
      ],
    },
  ];
  

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowAnswers(true);

    setTimeout(() => {
      setShowAnswers(false);
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {showScore ? (
          <div className={styles.scoreSection}>
            <h2>
              Você acertou {score} de {questions.length} questões!
            </h2>
            <button className={styles.restartButton} onClick={() => window.location.reload()}>
              Refazer Quiz
            </button>
          </div>
        ) : (
          <>
            <div className={styles.questionSection}>
              <h2>
                <span>Questão {currentQuestion + 1}</span>/{questions.length}
              </h2>
              <p>{questions[currentQuestion].question}</p>
            </div>
            <div className={styles.answerSection}>
              {questions[currentQuestion].answers.map((answerOption, index) => (
                <button
                  key={index}
                  className={`${styles.answerButton} ${
                    showAnswers ? (answerOption.correct ? styles.correct : styles.incorrect) : ''
                  }`}
                  onClick={() => handleAnswerOptionClick(answerOption.correct)}
                >
                  {answerOption.text}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
