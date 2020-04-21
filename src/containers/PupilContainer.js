import PupilView from '../views/PupilView';
import ProgressStore from '../data/ProgressStore';
import {Container} from 'flux/utils';
import TickerActions from '../data/TickerActions';
import GameStore from '../data/GameStore';
import GameActions from '../data/GameActions';
import ProgressActions from '../data/ProgressActions';

function getStores() {
    return [ProgressStore, GameStore];
}

function getState() {
    return {
        onTick: TickerActions.tick,
        gameState: ProgressStore.getState().gameState,
        activeBoard: GameStore.getState().activeBoard,
        gameSecondsRemaining: ProgressStore.getState().gameSecondsRemaining,
        activeWord: GameStore.getState().activeWord,
        onKeyPress: GameActions.keyPress,
        onWordSubmit: GameActions.wordSubmit,
        wordList: GameStore.getState().submittedWords,
        onWordCancel: GameActions.wordCancel,
        onDiceClick: GameActions.diceClick,
        activeDice: GameStore.getState().activeDice,
        playAgain: ProgressActions.playAgain,
        finishEarly: ProgressActions.finishEarly,
    };
}

export default new Container.createFunctional(PupilView,
					      getStores,
					      getState);

