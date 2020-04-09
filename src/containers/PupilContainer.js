import PupilView from '../views/PupilView';
import {Container} from 'flux/utils';
import PupilStore from '../data/PupilStore';
import PupilActions from '../data/PupilActions';

function getStores() {
    return [PupilStore];
}

function getState() {
    return {
	listItems: PupilStore.getState().listItems,
        textBox: PupilStore.getState().textBox,
        time: PupilStore.getState().time,
        onClick: PupilActions.click,
        onTextChange: PupilActions.textChange,
        onTick: PupilActions.tick,
    };
}

export default new Container.createFunctional(PupilView,
					      getStores,
					      getState);

