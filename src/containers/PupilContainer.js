import PupilView from '../views/PupilView';
import ProgressStore from '../data/ProgressStore';
import {Container} from 'flux/utils';
import TickerActions from '../data/TickerActions';

function getStores() {
    return [ProgressStore];
}

function getState() {
    return {
        onTick: TickerActions.tick,
    };
}

export default new Container.createFunctional(PupilView,
					      getStores,
					      getState);

