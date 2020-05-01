import PupilView from '../views/PupilView';
import ProgressStore from '../data/ProgressStore';
import {Container} from 'flux/utils';
import TickerActions from '../data/TickerActions';
import GameStore from '../data/GameStore';
import GameActions from '../data/GameActions';
import ProgressActions from '../data/ProgressActions';
import EllipsesStore from '../data/EllipsesStore';

function getStores() {
    return [ProgressStore, GameStore, EllipsesStore];
}

function getState() {
    return {
        onTick: TickerActions.tick,
        gameState: ProgressStore.getState().gameState,
        activeBoard: GameStore.getState().activeBoard,
        gameSecondsRemaining: ProgressStore.getState().gameSecondsRemaining,
        activeWord: GameStore.getState().activeWord,
        onWordSubmit: GameActions.wordSubmit,
        wordList: GameStore.getState().submittedWords,
        onWordCancel: GameActions.wordCancel,
        onDiceClick: GameActions.diceClick,
        activeDice: GameStore.getState().activeDice,
        playAgain: ProgressActions.playAgain,
        finishEarly: ProgressActions.finishEarly,
        scoreboard: GameStore.getState().scoreboard,
        wordChange: GameActions.wordChange,
        numEllipses: EllipsesStore.getState(),
        errorMsg: ProgressStore.getState().errorMsg,
    };
}

export default new Container.createFunctional(PupilView,
					      getStores,
					      getState);

