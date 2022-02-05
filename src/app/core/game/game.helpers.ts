import { InGameCard } from './game.types';

const simpleShuffleCards = (cards: InGameCard[]): InGameCard[] => {
  let shuffledCards = [...cards];
  let currentIndex = shuffledCards.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffledCards[currentIndex], shuffledCards[randomIndex]] = [shuffledCards[randomIndex], shuffledCards[currentIndex]];
  }

  return shuffledCards;
}

export const shuffleCards = (cards: InGameCard[]): InGameCard[] => {
  let shuffledCards = cards;

  for(let i = 0; i < 3; i++){
    shuffledCards = simpleShuffleCards(shuffledCards);
  }

  return shuffledCards;
}
