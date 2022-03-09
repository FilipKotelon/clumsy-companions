export interface TutorialSlide {
  title: string;
  description: string;
  imgUrl: string;
}

export interface Tutorial {
  open: boolean;
  slides: TutorialSlide[];
}

export interface Tutorials {
  [key: string]: Tutorial;
}

export type TutorialKey = 'basic' | 'deck' | 'game' | 'shop';

export const BASIC_TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    title: 'What is this game about?',
    description: 'Clumsy Companions is a Collectible Card Game. That means that you can collect cards and play games with them against an AI!<br/>The picture below though might be pretty confusing. Let\'s break down everything so you know what to do!',
    imgUrl: 'assets/img/tutorials/basic/1.png'
  },
  {
    title: 'What are looking at?',
    description: 'First let\'s figure out where to look. On the bottom we can see our board. What does our board consist of?<br/>1. Your companions in play. 2. Your energy and food. 3. Your hand. 4. Information about current turn. 5. Your sleepyard and deck. 6. Opponent\'s board.<br/> Okay, that\'s still not too useful, so let\'s go into some details!',
    imgUrl: 'assets/img/tutorials/basic/2.png'
  },
  {
    title: 'Companions in play',
    description: 'This is the most important part of the board. Companions which you have here can deal damage to the opponent or protect you. Their abilities are crucial to your victory. How do you get them there though? Well, you need to cast them from your hand. See the next slide for a little more information on that.',
    imgUrl: 'assets/img/tutorials/basic/3.png'
  },
  {
    title: 'Cards in hand',
    description: 'Cards in your hand are the cards that you can put into play. You start with 7 random cards, and then you draw a card each turn.<br/>We will get into more detail on turns later, but now let\'s look at what cards can you play.',
    imgUrl: 'assets/img/tutorials/basic/4.png'
  },
  {
    title: 'Food cards',
    description: 'First of all, to cast spells you need food tokens. To get them, you can cast one free food card each turn, which will increase the amount of your tokens by one. They don\'t expire, so each turn you play a food card, your token supply will grow. Casting spells uses up these tokens during your turn, but you will get all of them back next turn. Food cards are easily recognizable by the food icon in the top right corner.',
    imgUrl: 'assets/img/tutorials/basic/5.png'
  },
  {
    title: 'Companions',
    description: 'Here are the stars of the show, companions. They can be put into play to attack the opponent or defend you. They have 4 important properties:<br/>1. Strength (bottom left corner). 2. Energy (bottom right corner). 3. Cost (top right corner). 4. Effects (bottom right corner, above energy).<br/>For now, all you need to know is - cost is how many tokens you will pay for playing this companion and the more strength and energy it has, the better. You can click the effect to read how powerful it is and what it does.',
    imgUrl: 'assets/img/tutorials/basic/6.png'
  },
  {
    title: 'Charms',
    description: 'Charms don\'t enter the game the way companions do and they don\'t have stats. Think of them as ways to support your companions or disrupt the opponent. They have a cost and an effect when they enter the play - read it before you cast them! If a charm needs a target (for example when you want to make one of your companions better), you will need to click the companion it should have the effect on!',
    imgUrl: 'assets/img/tutorials/basic/7.png'
  },
  {
    title: 'Tricks',
    description: 'Tricks are essentialy the same as charms in terms of what effects they may have, but there is one big difference. Charms can only be played during your turn and only when you can play a companion. Tricks can be played during attacking or defending, and also when the opponent is attacking you! They are a great way to surprise your enemy and bait them into making mistakes! Now, that we mentioned turns, attacking and so on, let\'s see what you need to know about the flow of the game.',
    imgUrl: 'assets/img/tutorials/basic/8.png'
  },
  {
    title: 'Turn progress',
    description: 'The players take turns one after another. Each turns has <b>five phases</b>. Oh boy. But hold tight, it\'s not that crazy. In the <b>first</b> and <b>last phase</b> you can play any card out of your hand that you can pay the cost for (or <b>one free food card</b> per turn). Then, in the <b>second phase</b>, if you have cards which can attack, you can choose the ones you wish to attack with and in response the opponent can defend (the <b>third phase</b>) if they have companions in the field. The <b>fourth phase happens automatically after the third</b> - that\'s when damage is dealt. Then, there is the last phase which we talked about and the opponent gets their turn.',
    imgUrl: 'assets/img/tutorials/basic/9.png'
  },
  {
    title: 'Another look at your hand',
    description: 'Now, with a little more information, we can look at the hand once again. The cards you can play at the current moment have a green outline. This lets you know what you can do at the current moment. If you have no cards you can play or if you want to save them for later, click the button on the right (above the turn phase bar) to move to the next phase or end your turn.',
    imgUrl: 'assets/img/tutorials/basic/10.png'
  },
  {
    title: 'Your energy and food tokens',
    description: 'In the bottom left of the screen during the game, you will see your energy total and the amount of food tokens. You lose energy when the opponent companions hit you and when your energy goes to zero, you <b>lose the game</b>. On the right, you can see how many tokens you have available (the number on the left before the slash) and how many you will have at the start of your turn (the number on the right after the slash).',
    imgUrl: 'assets/img/tutorials/basic/11.png'
  },
  {
    title: 'Deck and sleepyard',
    description: 'The deck on the right is the stack of cards you draw from. When you have no more cards to draw, you will <b>lose the game</b>. The sleepyard next to it is where your companions go to when their energy drops below zero (which can happen when they are dealt damage in fights or because of the effects of other companions or charms / tricks). You can\'t recover your companions from there, so take care of your companions and don\'t lose them unnecessarily!',
    imgUrl: 'assets/img/tutorials/basic/12.png'
  },
  {
    title: 'That\'s it for now!',
    description: 'Okay, this was a lot to take in. Make yourself a nice cup of coffee or tea and relax for a moment. Of course it is best to just play the game to understand it, but, if you want to know a little more, check out the next tutorial which will give you some starting tips and tricks!',
    imgUrl: 'assets/img/tutorials/basic/1.png'
  }
];

export const DECK_TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    title: 'How to create a deck?',
    description: 'You can create a deck on your decks page. Just click that huge shiny green button on the left!',
    imgUrl: 'assets/img/tutorials/deck/1.png'
  },
  {
    title: 'Pick a side!',
    description: 'Oh no! Instantly, you will be faced with a tough moral choice! Cats or dogs? Choose wisely. Your friends will know.',
    imgUrl: 'assets/img/tutorials/deck/2.png'
  },
  {
    title: 'So many options!',
    description: 'Now you have in front of you all the cards that you own. (Want to get more cards? Check out the "Shopping Guide" tutorial!) Each of them has a plus button on them, which will let you add them to your deck and then increase their amount. There are some limits to how many copies of a card you can have in a deck - the more it costs, the less copies of it you can have.',
    imgUrl: 'assets/img/tutorials/deck/3.png'
  },
  {
    title: 'Food base',
    description: 'It\'s always good to start with a solid food base for your deck. Approximately 40% of your deck should consist of food cards, which makes it somewhere around 20 copies in a 50 card deck. And to keep your odds of drawing the right cards high, you probably want your deck to have closer to 50 cards rather than to the top limit of 80 cards.',
    imgUrl: 'assets/img/tutorials/deck/4.png'
  },
  {
    title: 'Example deck',
    description: 'A good deck is one which allows you to have a chance to play useful cards along all stages of the game. Don\'t just rely on high cost and powerful cards, because you may not survive the early stages of the game. Don\'t go with the only cheap cards either, as they might not be as useful after a few turns! Try to have cards with different costs!',
    imgUrl: 'assets/img/tutorials/deck/5.png'
  },
  {
    title: 'Finishing touches',
    description: 'Once you select the cards, name your deck and choose its sleeve and a thumbnail! (thumbnail can be one of the cards in your deck) Then just hit save!',
    imgUrl: 'assets/img/tutorials/deck/6.png'
  },
  {
    title: 'It\'s done!',
    description: 'Great, your deck is now ready to play!',
    imgUrl: 'assets/img/tutorials/deck/7.png'
  }
];

export const GAME_TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    title: 'How to play the game?',
    description: 'You can enter the game either by clicking the button in the top left corner or at the home page of hub.',
    imgUrl: 'assets/img/tutorials/game/1.png'
  },
  {
    title: 'Choose how you want to play!',
    description: 'Here you can choose your deck and the opponent you want to face. Once you click Play, you will enter the game!<br/>(Want to customize your deck? Go back to the list of tutorials and choose the "How to create a deck?" tutorial!)',
    imgUrl: 'assets/img/tutorials/game/2.png'
  },
  {
    title: 'Decide on your starting hand!',
    description: 'Once you load into the game, you will be given 7 random cards from your deck. This is your starting hand.<br/>If you don\'t like it, you can shuffle the deck one more time! When should you do it? Check the next slide!',
    imgUrl: 'assets/img/tutorials/game/3.png'
  },
  {
    title: 'First, look at the costs of your cards!',
    description: 'It\'s important to start with cards you can play early in the game. Look at the amount of food cards (with food icon in the top right corner) in your hand and the costs of other cards (marked with the arrows going from bottom to top). You can play only one food card per turn, so, just in case you don\'t draw too many food cards later, it would be best if you can pay for most of the cards in your hands with the food tokens you will get from your hand. So don\'t hold onto extremely costly cards which you may not be able to use at all!',
    imgUrl: 'assets/img/tutorials/game/4.png'
  },
  {
    title: 'Have a look at a great starting hand',
    description: 'This hand for example is a really great start! There is enough food to play all of the cards within 3 turns, and you will have a nice setup for the future! Of course it is not that easy to land a start like this every time. There is no need to reshuffle if there are some cards that are just out of your starting food range, just make sure that you won\'t have to sit around and look at your opponent playing the game without you!',
    imgUrl: 'assets/img/tutorials/game/5.png'
  },
  {
    title: 'Playing cards',
    description: 'Cards you can play are marked wit a green outline. If you want to cast them, just click them and drag upwards onto the board until their outline changes to yellow! When you let it go while it is yellow, it will be played! Whenever you have one in your hand, play a food card first so you can play stronger cards with each turn!',
    imgUrl: 'assets/img/tutorials/game/6.png'
  },
  {
    title: 'Companion statuses',
    description: 'Every companion you play will get the <b>dizzy</b> status (indicated by the spiral icon in the top right corner). It means it can\'t attack yet until your next turn, because it doesn\'t yet know what is happening, I mean, what would you do if you were tossed into play out of nowhere? There are also other statuses, related directly to attacking and defending and we will discuss them next!',
    imgUrl: 'assets/img/tutorials/game/7.png'
  },
  {
    title: 'Attacking the opponent',
    description: 'Attacking is a very important part of this game! In the second phase, you can select the highlighted companions and attack your opponent with them! They will get the <b>attacking</b> status (indicated by an icon in the top right corner) and, if not blocked, will reduce your opponent\'s energy by the amount equal to their strength! You can attack with multiple companions at a time, but bear in mind, that attacking may leave both you and your companions vulnerable!',
    imgUrl: 'assets/img/tutorials/game/8.png'
  },
  {
    title: 'Defending',
    description: 'Whenever a player attacks, the other may block with their companions! You can do that by clicking your highlighted companions and then selecting the enemies which are attacking you. When companions block, they fight against the attacker and deal energy damage to each other, equal to the amount of their strength! If any of them have their energy decreased to zero or below, they get moved to the sleepyards. Blocking is great to keep your energy total high, but sometimes it is better to save your companions and let your opponents expose themselves to a counterattack!',
    imgUrl: 'assets/img/tutorials/game/9.png'
  },
  {
    title: 'Tired companions',
    description: 'After a companion attacks and deals damage, it will get the <b>tired</b> status (it will be tilted and have a clock icon). <b>Tired companions can\'t block until they recover at the start of your next turn.</b> Keep that in mind, because attacking recklessly may open you up to easy counterattacks from your opponent!',
    imgUrl: 'assets/img/tutorials/game/10.png'
  },
  {
    title: 'Playing targeted charms and tricks',
    description: 'To play a charm or a trick that targets one of the companions in play, cast it like any other card, and then, once its effect shows up on the left, the cards which can be affected will be highlighted. Click any of them to select it as the target.',
    imgUrl: 'assets/img/tutorials/game/11.png'
  },
  {
    title: 'Good luck!',
    description: 'There are many interactions and combinations for you to discover! If you want to get some information on how to build a deck, check the "How to create a deck?" tutorial!',
    imgUrl: 'assets/img/tutorials/game/12.png'
  }
];

export const SHOP_TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    title: 'Shopping guide',
    description: 'Here\'s a quick tutorial on what to buy and how to do it!',
    imgUrl: 'assets/img/tutorials/shop/1.png'
  },
  {
    title: 'Buy packs!',
    description: 'Packs are possibly the best thing you can buy. Each one of them gives you 3 new shiny cards of the set that you want! Unlike some other games, in Clumsy Companions you can\'t get duplicates of cards, so each purchase brings you something new!',
    imgUrl: 'assets/img/tutorials/shop/1.png'
  },
  {
    title: 'Open packs',
    description: 'Packs you purchased can be found under the packs icon in the navigation. Once you click that, you will see all of them, and once you click them, they will open!',
    imgUrl: 'assets/img/tutorials/shop/2.png'
  },
  {
    title: 'Enjoy your gifts!',
    description: 'After opening a pack, you will get 3 new cards! Now you can use them in your decks, or just enjoy the feeling of having them in your collection!',
    imgUrl: 'assets/img/tutorials/shop/3.png'
  }
]
